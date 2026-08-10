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
    if (header) header.classList.toggle('site-header--scrolled', scrollY > 24);
    if (progressBar) progressBar.style.transform = 'scaleX(' + Math.min(Math.max(progress, 0), 1) + ')';
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
    revealElements.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealElements.forEach(function (el) { el.classList.add('visible'); });
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
        if (progress < 1) requestAnimationFrame(step);
        else counter.textContent = target;
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
          if (other !== item && other.open) other.open = false;
        });
      }
    });
  });

  // Captación: el formulario real usa .contact__form. Antes buscaba .contact-form,
  // por lo que las consultas nunca se enviaban. Ahora abre WhatsApp con todos los datos.
  var contactForm = document.querySelector('.contact__form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = document.getElementById('nombre').value.trim();
      var email = document.getElementById('email').value.trim();
      var empresa = document.getElementById('empresa').value.trim();
      var mensaje = document.getElementById('mensaje').value.trim();

      if (!nombre || !email || !mensaje) {
        contactForm.reportValidity();
        return;
      }

      var texto = 'Hola Gustavo, quiero solicitar una consulta inicial con FG Solutions.%0A%0A' +
        'Nombre: ' + encodeURIComponent(nombre) + '%0A' +
        'Email: ' + encodeURIComponent(email) + '%0A' +
        'Empresa: ' + encodeURIComponent(empresa || 'No especificada') + '%0A%0A' +
        'Necesidad: ' + encodeURIComponent(mensaje);

      window.location.href = 'https://wa.me/5492994274794?text=' + texto;
    });
  }
})();
