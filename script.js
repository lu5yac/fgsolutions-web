(function () {
  'use strict';

  /* Header scroll effect */
  var header = document.getElementById('header');
  var lastScroll = 0;

  function onScroll() {
    var scrollY = window.scrollY;
    if (scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile navigation */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  var navLinks = mainNav.querySelectorAll('.nav__link, .nav__cta');

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

  /* Scroll reveal */
  var revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* Counter animation */
  var counters = document.querySelectorAll('[data-count]');
  var countersStarted = false;

  function animateCounters() {
    if (countersStarted) return;
    countersStarted = true;

    counters.forEach(function (counter) {
      var target = parseInt(counter.getAttribute('data-count'), 10);
      var duration = 2000;
      var start = 0;
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
    var statsSection = document.querySelector('.hero__stats');
    if (statsSection) {
      var statsObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounters();
              statsObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      statsObserver.observe(statsSection);
    }
  }

  /* Active nav link on scroll */
  var sections = document.querySelectorAll('section[id]');

  function highlightNav() {
    var scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('nav__link--active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('nav__link--active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  /* Smooth FAQ — close others when one opens */
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

  /* Contact form enhancement */
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

      window.location.href = 'mailto:FGUSTAVOJ@YAHOO.COM.AR?subject=' + subject + '&body=' + body;
    });
  }
})();
