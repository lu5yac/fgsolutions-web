(function () {
  'use strict';

  var header = document.getElementById('siteHeader');
  var progressBar = document.getElementById('scrollProgress');
  var navToggle = document.getElementById('menuTrigger');
  var mainNav = document.getElementById('siteNav');
  var navLinks = document.querySelectorAll('.site-nav__link, .site-nav__ghost, .btn--compact');

  function onScroll() {
    var scrollY = window.scrollY;
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    var progress = maxScroll > 0 ? (scrollY / maxScroll) : 0;

    if (header) {
      header.classList.toggle('site-header--scrolled', scrollY > 24);
    }

    if (progressBar) {
      progressBar.style.transform = 'scaleX(' + Math.min(Math.max(progress, 0), 1) + ')';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!header || !navToggle || !mainNav) {
    console.error('No se encontraron los elementos principales del sitio.');
    return;
  }

  navToggle.addEventListener('click', function () {
    var expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.classList.toggle('open');
    document.body.style.overflow = expanded ? '' : 'hidden';
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  var revealElements = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  var counters = document.querySelectorAll('[data-count]');
  var countersStarted = false;

  function animateCounters() {
    if (countersStarted) return;
    countersStarted = true;

    counters.forEach(function (counter) {
      var target = parseInt(counter.getAttribute('data-count'), 10);
      var duration = 1800;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(eased * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(step);
    });
  }

  if ('IntersectionObserver' in window) {
    var heroMetrics = document.querySelector('.hero__metrics');
    if (heroMetrics) {
      var metricsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounters();
            metricsObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      metricsObserver.observe(heroMetrics);
    }
  } else {
    animateCounters();
  }

  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item && other.open) {
            other.open = false;
          }
        });
      }
    });
  });

  var contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var nombre = document.getElementById('nombre').value;
      var email = document.getElementById('email').value;
      var empresa = document.getElementById('empresa').value;
      var mensaje = document.getElementById('mensaje').value;

      var subject = encodeURIComponent('Consulta desde FG Solutions — ' + nombre);
      var body = encodeURIComponent(
        'Nombre: ' + nombre + '\n' +
        'Email: ' + email + '\n' +
        'Empresa: ' + (empresa || 'No especificada') + '\n\n' +
        'Mensaje:\n' + mensaje
      );

      window.location.href = 'mailto:fgustavoj@yahoo.com.ar?subject=' + subject + '&body=' + body;
    });
  }
})();
