/* SHARED SCRIPT - used by every page. Plain JavaScript, no libraries. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Mobile navbar toggle */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
  }

  /* 2. Scroll-reveal: elements with class "reveal" fade in when visible */
  var reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduce) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* 3. Counters: <span class="count" data-target="1" data-prefix="~"> */
  function runCount(el) {
    var target = +el.dataset.target, prefix = el.dataset.prefix || '';
    if (reduce) { el.textContent = prefix + target; return; }
    var start = null;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / 1500, 1);
      el.textContent = prefix + Math.ceil(p * target);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('.count');
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  } else { counters.forEach(runCount); }

  /* 4. Lightbox: any link with [data-lightbox] opens its image large */
  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-label', 'Enlarged photo');
  box.innerHTML = '<button type="button" aria-label="Close">&times;</button><img alt="">';
  document.body.appendChild(box);
  var bigImg = box.querySelector('img'), closeBtn = box.querySelector('button'), lastLink;
  function close() { if (!box.classList.contains('open')) return; box.classList.remove('open'); if (lastLink) lastLink.focus(); }
  document.querySelectorAll('[data-lightbox]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      ev.preventDefault();
      lastLink = a;
      bigImg.src = a.href;
      bigImg.alt = a.querySelector('img').alt;
      box.classList.add('open');
      closeBtn.focus();
    });
  });
  closeBtn.addEventListener('click', close);
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  /* 5. Contact form success message (Netlify redirects back with ?sent=1) */
  var ok = document.getElementById('form-success');
  if (ok && location.search.indexOf('sent=1') > -1) ok.classList.remove('hidden');
})();
