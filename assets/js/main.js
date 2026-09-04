/* Oberoi Dhaba — main.js
   Plain JS, no build step. Shared across every page. Handles: nav state,
   mobile menu, the looping hero video, menu tabs (menu.html), gallery
   lightbox (rooftop.html, visit.html), and scroll reveals. Every block
   below checks the element exists first, so one file works on every page
   without errors on pages that don't have that piece.
*/
(function(){
  "use strict";

  /* ---------------- NAV ---------------- */
  var nav = document.querySelector('.nav');
  var navLinks = document.querySelector('.nav-links');
  var navToggle = document.querySelector('.nav-toggle');
  var navScrim = document.querySelector('.nav-scrim');

  function onScrollNav(){
    if (window.scrollY > 40) nav.classList.add('solid');
    else nav.classList.remove('solid');
  }
  addEventListener('scroll', onScrollNav, {passive:true});
  onScrollNav();

  function closeMobileNav(){
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navScrim.classList.remove('open');
    navToggle.setAttribute('aria-expanded','false');
  }
  if (navToggle){
    navToggle.addEventListener('click', function(){
      var open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navScrim.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });
    navScrim.addEventListener('click', closeMobileNav);
    navLinks.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeMobileNav); });
  }

  /* ---------------- SCROLL REVEALS ---------------- */
  var revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold:.16, rootMargin:'0px 0px -6% 0px' });
    revealItems.forEach(function(el, i){
      if (el.classList.contains('reveal-stagger')){
        Array.from(el.children).forEach(function(child, ci){ child.style.setProperty('--i', ci); });
      }
      io.observe(el);
    });
  } else {
    revealItems.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---------------- lantern dividers draw-in ---------------- */
  var lanternDividers = document.querySelectorAll('.divider-lanterns');
  if ('IntersectionObserver' in window && lanternDividers.length){
    var lio = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); lio.unobserve(e.target); } });
    }, { threshold:.4 });
    lanternDividers.forEach(function(el){ lio.observe(el); });
  }

  /* ================= HERO: looping video, plays continuously, not tied to scroll ================= */
  var hero = document.getElementById('hero');
  var heroVideo = document.getElementById('heroVideo');
  if (hero && heroVideo){
    var reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

    function applyMotionPref(){
      if (reduceMotion.matches){
        heroVideo.pause();
      } else {
        heroVideo.muted = true;
        var p = heroVideo.play();
        if (p && p.catch) p.catch(function(){ /* autoplay blocked; poster stays visible */ });
      }
    }

    heroVideo.addEventListener('canplay', function(){
      heroVideo.classList.add('ready');
      applyMotionPref();
    }, { once:true });
    heroVideo.addEventListener('error', function(){
      heroVideo.classList.remove('ready'); // the section's own poster background shows instead
    });

    reduceMotion.addEventListener('change', applyMotionPref);
  }

  /* ================= MENU TABS ================= */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.menu-tab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.menu-panel'));
  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      tabs.forEach(function(t){ t.setAttribute('aria-selected','false'); });
      panels.forEach(function(p){ p.classList.remove('active'); });
      tab.setAttribute('aria-selected','true');
      var panel = document.getElementById(tab.getAttribute('aria-controls'));
      if (panel) panel.classList.add('active');
    });
    tab.addEventListener('keydown', function(e){
      var i = tabs.indexOf(tab);
      if (e.key === 'ArrowRight'){ e.preventDefault(); (tabs[i+1] || tabs[0]).focus(); (tabs[i+1] || tabs[0]).click(); }
      if (e.key === 'ArrowLeft'){ e.preventDefault(); (tabs[i-1] || tabs[tabs.length-1]).focus(); (tabs[i-1] || tabs[tabs.length-1]).click(); }
    });
  });

  /* ================= GALLERY LIGHTBOX ================= */
  var lightbox = document.querySelector('.lightbox');
  if (lightbox){
    var lbImg = lightbox.querySelector('img');
    document.querySelectorAll('.gallery a').forEach(function(a){
      a.addEventListener('click', function(e){
        e.preventDefault();
        var full = a.getAttribute('href');
        var alt = a.querySelector('img').getAttribute('alt') || '';
        lbImg.setAttribute('src', full);
        lbImg.setAttribute('alt', alt);
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    function closeLightbox(){
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e){ if (e.target === lightbox) closeLightbox(); });
    addEventListener('keydown', function(e){ if (e.key === 'Escape') closeLightbox(); });
  }

  /* current year in footer */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
