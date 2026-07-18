/* ====================================================================
   NexEdge Studios - shared behaviour
   Vanilla, no dependencies. Loaded by every page.
   ==================================================================== */
(function(){
  'use strict';

  /* ---- year, everywhere it appears ---- */
  var yr = new Date().getFullYear();
  [].slice.call(document.querySelectorAll('.yr')).forEach(function(el){
    el.textContent = yr;
  });

  /* ---- hand-drawn ring ----
     The dash length MUST be measured. A hardcoded value shorter than the
     path leaves the circle visibly unfinished. */
  var ring = document.getElementById('ring');
  if(ring){
    var path = ring.querySelector('path');
    if(path && path.getTotalLength){
      var arm = function(){
        var len = path.getTotalLength();
        path.style.strokeDasharray  = len;
        path.style.strokeDashoffset = len;
        requestAnimationFrame(function(){ ring.classList.add('go'); });
      };
      if(document.readyState === 'complete'){ arm(); }
      else { window.addEventListener('load', arm); }
    }
  }

  /* ---- reveal on scroll ---- */
  var revealables = [].slice.call(document.querySelectorAll('.reveal'));
  if(revealables.length){
    if(!('IntersectionObserver' in window)){
      revealables.forEach(function(e){ e.classList.add('in'); });
    } else {
      var ro = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting){ e.target.classList.add('in'); ro.unobserve(e.target); }
        });
      }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
      revealables.forEach(function(e){ ro.observe(e); });
    }
  }

  /* ---- slide-out panel (left) ---- */
  var burger = document.getElementById('burger');
  var panel  = document.getElementById('panel');
  var scrim  = document.getElementById('scrim');
  var closeB = document.getElementById('panelClose');

  if(burger && panel && scrim){
    var lastFocus = null;

    var openPanel = function(){
      lastFocus = document.activeElement;
      scrim.hidden = false;
      document.body.classList.add('panel-open');
      document.body.style.overflow = 'hidden';
      burger.setAttribute('aria-expanded','true');
      panel.setAttribute('aria-hidden','false');
      var first = panel.querySelector('a,button');
      if(first) first.focus();
    };

    var shutPanel = function(){
      document.body.classList.remove('panel-open');
      document.body.style.overflow = '';
      burger.setAttribute('aria-expanded','false');
      panel.setAttribute('aria-hidden','true');
      setTimeout(function(){
        if(!document.body.classList.contains('panel-open')) scrim.hidden = true;
      }, 600);
      if(lastFocus && lastFocus.focus) lastFocus.focus();
    };

    burger.addEventListener('click', function(){
      document.body.classList.contains('panel-open') ? shutPanel() : openPanel();
    });
    if(closeB) closeB.addEventListener('click', shutPanel);
    scrim.addEventListener('click', shutPanel);
    panel.addEventListener('click', function(e){
      if(e.target.closest('a')) shutPanel();
    });

    /* close on scroll of the PAGE (scrolling inside the panel is ignored
       because the panel has its own scroll container) */
    var lastY = window.scrollY;
    window.addEventListener('scroll', function(){
      if(!document.body.classList.contains('panel-open')) return;
      if(Math.abs(window.scrollY - lastY) > 4) shutPanel();
      lastY = window.scrollY;
    }, {passive:true});

    /* Esc to close, and keep Tab inside the panel while it is open */
    document.addEventListener('keydown', function(e){
      if(!document.body.classList.contains('panel-open')) return;
      if(e.key === 'Escape'){ shutPanel(); return; }
      if(e.key !== 'Tab') return;
      var f = panel.querySelectorAll('a[href],button');
      if(!f.length) return;
      var first = f[0], last = f[f.length-1];
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    });
  }

  /* ---- magnetic buttons: pointer devices only, and never when the
     visitor has asked for reduced motion ---- */
  if(window.matchMedia('(hover: hover)').matches &&
     !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    [].slice.call(document.querySelectorAll('.mag')).forEach(function(btn){
      btn.addEventListener('mousemove', function(e){
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width/2;
        var y = e.clientY - r.top  - r.height/2;
        btn.style.transform = 'translate(' + (x*0.14) + 'px,' + (y*0.24) + 'px)';
      });
      btn.addEventListener('mouseleave', function(){ btn.style.transform = ''; });
    });
  }

  /* ---- team photos: show initials until a real photo is dropped in ---- */
  [].slice.call(document.querySelectorAll('.avatar img')).forEach(function(img){
    img.addEventListener('error', function(){
      var holder = img.parentElement;
      if(holder) holder.classList.add('noimg');
      img.remove();
    });
  });

})();
