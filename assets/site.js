/* ====================================================================
   NexEdge Studios - shared behaviour
   Vanilla, no dependencies. Loaded by every page. Every block checks its
   elements exist, so one file serves the home page and the inner pages.
   ==================================================================== */
(function(){
  'use strict';
  var d = document, b = d.body;
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, r){ return (r || d).querySelector(s); }
  function $$(s, r){ return [].slice.call((r || d).querySelectorAll(s)); }

  /* ---- year, everywhere it appears ---- */
  var yr = new Date().getFullYear();
  $$('.yr').forEach(function(el){ el.textContent = yr; });

  /* ---- announcement bar ---- */
  var annX = $('[data-ann-close]');
  if(annX) annX.addEventListener('click', function(){ var a = $('#ann'); if(a) a.remove(); });

  /* ---- side menu, cart and account drawers ----
     The menu works like NexStudents: the main list, with sub panels that
     slide over it. Cart and account slide in from the right. */
  var lastFocus = null;
  function closeAll(){
    b.classList.remove('nav-open', 'sub-open', 'cart-open', 'acct-open');
    $$('.dsub').forEach(function(p){ p.classList.remove('open'); });
    var bg = $('#burger'); if(bg) bg.setAttribute('aria-expanded', 'false');
    if(lastFocus && lastFocus.focus) lastFocus.focus({preventScroll: true});
    lastFocus = null;
  }
  function open(cls, focusIn){
    closeAll();
    lastFocus = d.activeElement;
    b.classList.add(cls);
    if(focusIn){ var f = focusIn.querySelector('a,button'); if(f) f.focus({preventScroll: true}); }
  }
  var burger = $('#burger');
  if(burger) burger.addEventListener('click', function(){
    if(b.classList.contains('nav-open')){ closeAll(); return; }
    open('nav-open', $('#drawer'));
    burger.setAttribute('aria-expanded', 'true');
  });
  $$('.scrim,.cscrim,.ascrim,[data-close]').forEach(function(e){ e.addEventListener('click', closeAll); });
  $$('[data-sub]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var p = $('[data-panel="' + btn.getAttribute('data-sub') + '"]');
      if(!p) return;
      p.classList.add('open'); b.classList.add('sub-open');
      /* preventScroll matters: the panel is still sliding in, and a plain
         focus() scrolls the menu sideways to reach it, which leaves the
         WRONG panel showing (it opened Software when Rankings was tapped) */
      var f = p.querySelector('button,a'); if(f) f.focus({preventScroll: true});
      var mc = $('#menucol'); if(mc) mc.scrollLeft = 0;
    });
  });
  $$('[data-back]').forEach(function(btn){
    btn.addEventListener('click', function(){
      b.classList.remove('sub-open'); btn.parentNode.classList.remove('open');
    });
  });
  var cartBtn = $('#cartBtn'), acctBtn = $('#acctBtn');
  if(cartBtn) cartBtn.addEventListener('click', function(){ open('cart-open', $('.cdrawer')); });
  if(acctBtn) acctBtn.addEventListener('click', function(){ open('acct-open', $('.adrawer')); });
  d.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeAll(); });

  /* ---- hand-drawn ring ----
     The dash length MUST be measured. A hardcoded value shorter than the
     path leaves the circle visibly unfinished. */
  var ring = $('#ring');
  if(ring){
    var path = ring.querySelector('path');
    if(path && path.getTotalLength){
      var arm = function(){
        var len = path.getTotalLength();
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
        requestAnimationFrame(function(){ ring.classList.add('go'); });
      };
      if(d.readyState === 'complete') arm(); else window.addEventListener('load', arm);
    }
  }

  /* ---- reveal on scroll (.rv, and .reveal on the older pages) ---- */
  var revs = $$('.rv,.reveal,.bars');
  if(!('IntersectionObserver' in window) || RM){
    revs.forEach(function(e){ e.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold: .12, rootMargin: '0px 0px -40px 0px'});
    revs.forEach(function(e){ io.observe(e); });
  }

  /* ---- motion: scroll parallax, pointer drift, pinned sections ----
     data-depth moves an element with scroll; data-mouse drifts it toward the
     pointer. The rail and spotlight read how far their tall section has
     scrolled and turn that into sideways travel and a zoom. */
  var movers = $$('[data-depth],[data-mouse]');
  var rail = $('#rail'), track = $('#railTrack'), prog = $('#railProg');
  var spot = $('#spot'), sObj = $('#spotObj'), sWord = $('#spotWord');
  var WORDS = spot ? (spot.getAttribute('data-words') || '').split('|') : [];
  if(!RM && (movers.length || rail || spot)){
    var mx = 0, my = 0, tx = 0, ty = 0;
    if(window.matchMedia('(hover: hover)').matches){
      window.addEventListener('pointermove', function(e){ mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, {passive: true});
    }
    var frame = function(){
      tx += (mx - tx) * .06; ty += (my - ty) * .06;
      var vh = innerHeight;
      movers.forEach(function(el){
        var r = el.getBoundingClientRect();
        if(r.bottom < -200 || r.top > vh + 200) return;
        var c = r.top + r.height / 2 - vh / 2;
        var dp = +el.getAttribute('data-depth') || 0, mo = +el.getAttribute('data-mouse') || 0;
        el.style.transform = 'translate3d(' + (tx * mo).toFixed(1) + 'px,' + (c * dp + ty * mo).toFixed(1) + 'px,0)';
      });
      if(rail && track){
        var rr = rail.getBoundingClientRect();
        if(rr.bottom > 0 && rr.top < vh){
          var max = track.scrollWidth - innerWidth + 60;
          var p = Math.min(1, Math.max(0, -rr.top / (rr.height - vh)));
          track.style.transform = 'translate3d(' + (-p * max).toFixed(0) + 'px,0,0)';
          if(prog) prog.style.transform = 'scaleX(' + p + ')';
        }
      }
      if(spot && sObj){
        var sr = spot.getBoundingClientRect();
        if(sr.bottom > 0 && sr.top < vh){
          var q = Math.min(1, Math.max(0, -sr.top / (sr.height - vh)));
          var step = Math.min(2, Math.floor(q * 3));
          sObj.style.transform = 'scale(' + (.5 + q * .55).toFixed(3) + ') rotate(' + (-18 + q * 36).toFixed(1) + 'deg)';
          if(sWord) sWord.style.transform = 'translate3d(' + (innerWidth * .6 - q * innerWidth * 2.2).toFixed(0) + 'px,-50%,0)';
          if(spot.getAttribute('data-step') !== String(step)){
            spot.setAttribute('data-step', step);
            $$('.cap', spot).forEach(function(c, i){ c.classList.toggle('on', i === step); });
            $$('.spot-steps i', spot).forEach(function(c, i){ c.classList.toggle('on', i <= step); });
            if(sWord && WORDS[step]) sWord.textContent = WORDS[step];
          }
        }
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  /* ---- spec explorer: tap a point on the board ---- */
  var specCard = $('#specCard'), specData = $('#specData');
  if(specCard && specData){
    var SPECS = JSON.parse(specData.textContent);
    var show = function(i){
      var s = SPECS[i], h = '<h4>' + s[0] + '</h4><dl>';
      s[1].forEach(function(r){ h += '<dt>' + r[0] + '</dt><dd>' + r[1] + '</dd>'; });
      specCard.innerHTML = h + '</dl>';
      $$('.hs').forEach(function(x){ x.classList.toggle('on', +x.getAttribute('data-spec') === i); });
    };
    $$('.hs').forEach(function(h){ h.addEventListener('click', function(){ show(+h.getAttribute('data-spec')); }); });
    show(0);
  }

  /* ---- team photos: show initials until a real photo is dropped in ---- */
  $$('.avatar img').forEach(function(img){
    img.addEventListener('error', function(){
      var holder = img.parentElement;
      if(holder) holder.classList.add('noimg');
      img.remove();
    });
  });
})();
