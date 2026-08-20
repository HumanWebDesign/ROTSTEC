/* =========================================================
   ROT STEC : assets/js/main.js
   Interacciones y lógica frontend compartida por las 3 páginas
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ===== Menú móvil ===== */
  (function initMobileMenu() {
    var toggle = document.getElementById('menuToggle');
    var menu = document.getElementById('mobileMenu');
    var icon = document.getElementById('menuIcon');
    if (!toggle || !menu || !icon) return;

    var open = false;

    function closeMenu() {
      open = false;
      menu.classList.remove('open');
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      open = !open;
      menu.classList.toggle('open', open);
      icon.classList.toggle('fa-bars', !open);
      icon.classList.toggle('fa-xmark', open);
      toggle.setAttribute('aria-expanded', String(open));
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  })();

  /* ===== Navbar: cambio de fondo al hacer scroll ===== */
  (function initNavbarScroll() {
    var navbar = document.getElementById('mainNavbar');
    if (!navbar) return;

    function updateNavbar() {
      if (window.scrollY > 12) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });
  })();

  /* ===== Smooth scroll para enlaces de ancla ===== */
  (function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    anchors.forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        var target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        var navbarHeight = 72;
        var top = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  })();

  /* ===== Horario en tiempo real (America/Santiago) ===== */
  (function initOpenStatus() {
    var dot = document.getElementById('statusDot');
    var text = document.getElementById('statusText');
    if (!dot || !text) return;

    function updateStatus() {
      var now = new Date();
      var parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Santiago',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      }).formatToParts(now);

      var weekday = parts.find(function (p) { return p.type === 'weekday'; }).value;
      var hour = parseInt(parts.find(function (p) { return p.type === 'hour'; }).value, 10);
      var minute = parseInt(parts.find(function (p) { return p.type === 'minute'; }).value, 10);
      var minutesNow = hour * 60 + minute;

      var isOpen = false;

      if (['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].indexOf(weekday) !== -1) {
        isOpen = minutesNow >= (8 * 60) && minutesNow < (18 * 60);
      } else if (weekday === 'Sat') {
        isOpen = minutesNow >= (10 * 60) && minutesNow < (17 * 60);
      } else {
        isOpen = false;
      }

      if (isOpen) {
        dot.className = 'status-dot open';
        text.textContent = 'Abierto ahora';
      } else {
        dot.className = 'status-dot closed';
        text.textContent = 'Cerrado actualmente';
      }
    }

    updateStatus();
    setInterval(updateStatus, 60000);
  })();

  /* ===== Scroll reveal ===== */
  (function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    items.forEach(function (el) { observer.observe(el); });
  })();

  /* ===== Filtro interactivo de catalogo.html ===== */
  (function initCatalogFilter() {
    var filterButtons = document.querySelectorAll('.filter-btn');
    var products = document.querySelectorAll('[data-category]');
    if (!filterButtons.length || !products.length) return;

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var category = btn.getAttribute('data-filter');

        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        products.forEach(function (product) {
          var matches = category === 'todas' || product.getAttribute('data-category') === category;
          product.classList.toggle('hidden-item', !matches);
        });
      });
    });
  })();

});
