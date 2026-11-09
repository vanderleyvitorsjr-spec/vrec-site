/* ---------- Depoimentos (dados em assets/depoimentos.js) ---------- */
(function(){
  var me = document.querySelector('script[src$="assets/vrec.js"]');
  var root = me ? me.getAttribute("src").replace(/assets\/vrec\.js$/, "") : "";
  var TPL = '<div class="wrap"><div class="depo__head"><span class="eyebrow reveal">Depoimentos</span>' +
    '<h2 id="depo-title" class="reveal">Nas palavras <em>de quem viveu.</em></h2></div>' +
    '<div class="depo__feature" data-depo-feature></div><div class="depo__list" data-depo-list></div></div>';
  function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function paras(t){ return String(t).split(/\n\s*\n/).map(function(p){ return "<p>" + esc(p.trim()).replace(/\n/g,"<br>") + "</p>"; }).join(""); }
  function meta(d){ return [d.tipo, d.local, d.ano, d.fonte].filter(Boolean).map(esc).join(" · "); }
  function sign(d){
    var foto = d.foto ? '<img class="depo__foto" src="' + esc(/^(https?:)?\//.test(d.foto) ? d.foto : root + d.foto) + '" alt="' + esc(d.casal) + '" loading="lazy" width="112" height="112">' : "";
    var film = d.filme ? '<a class="depo__film" href="https://www.youtube.com/watch?v=' + encodeURIComponent(d.filme) + '" target="_blank" rel="noopener">Assistir ao filme <span class="arrow" aria-hidden="true"></span></a>' : "";
    return '<footer class="depo__sign">' + foto + '<div><cite>' + esc(d.casal) + '</cite>' + (meta(d) ? '<span>' + meta(d) + '</span>' : "") + film + '</div></footer>';
  }
  function reveal(sec){
    var els = sec.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)){ Array.prototype.forEach.call(els, function(e){ e.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function(en){ en.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("is-in"); io.unobserve(e.target); } }); }, {threshold:.12, rootMargin:"0px 0px -40px 0px"});
    Array.prototype.forEach.call(els, function(e){ io.observe(e); });
  }
  function render(){
    var data = (window.VREC_DEPOIMENTOS || []).filter(function(d){ return d && d.casal && d.texto; });
    if (!data.length) return;
    var secs = document.querySelectorAll("[data-depoimentos]");
    if (!secs.length){
      var path = location.pathname.replace(/index\.html$/, "");
      var contato = document.getElementById("contato");
      if (!contato || !/(^\/$|\/casamentos\/$)/.test(path)) return;
      var sec = document.createElement("section");
      sec.className = "section depo"; sec.id = "depoimentos";
      sec.setAttribute("aria-labelledby", "depo-title"); sec.setAttribute("data-depoimentos", "");
      sec.innerHTML = TPL;
      contato.parentNode.insertBefore(sec, contato);
      secs = [sec];
    }
    var feat = data.filter(function(d){ return d.destaque; })[0] || data[0];
    var list = [feat].concat(data.filter(function(d){ return d !== feat; }));
    var n = list.length, pad = function(i){ return (i < 9 ? "0" : "") + (i + 1); };
    Array.prototype.forEach.call(secs, function(sec){
      var f = sec.querySelector("[data-depo-feature]"), l = sec.querySelector("[data-depo-list]");
      if (l) l.remove();
      f.className = "depo__slider reveal";
      f.setAttribute("role", "region"); f.setAttribute("aria-roledescription", "carrossel"); f.setAttribute("aria-label", "Depoimentos");
      f.innerHTML = '<div class="depo__track" aria-live="polite">' + list.map(function(d, i){
          return '<blockquote class="depo__slide' + (i ? "" : " is-active") + '" aria-hidden="' + (i ? "true" : "false") + '">' +
            '<div class="depo__txt">' + paras(d.texto) + '</div>' +
            '<button type="button" class="depo__more" aria-expanded="false" hidden>Ler depoimento completo</button>' + sign(d) + '</blockquote>';
        }).join("") + '</div>' +
        (n > 1 ? '<div class="depo__nav"><button type="button" class="depo__arrow" data-dir="-1" aria-label="Depoimento anterior"><span aria-hidden="true">&larr;</span></button>' +
          '<span class="depo__count"><b>01</b> / ' + pad(n - 1) + '</span>' +
          '<div class="depo__dots">' + list.map(function(d, i){ return '<button type="button" class="depo__dot' + (i ? "" : " is-active") + '" data-go="' + i + '" aria-label="Depoimento ' + (i + 1) + ' de ' + n + ': ' + esc(d.casal) + '"></button>'; }).join("") + '</div>' +
          '<button type="button" class="depo__arrow" data-dir="1" aria-label="Próximo depoimento"><span aria-hidden="true">&rarr;</span></button></div>' : "");
      sec.hidden = false;
      reveal(sec);
      var slides = f.querySelectorAll(".depo__slide"), dots = f.querySelectorAll(".depo__dot"), count = f.querySelector(".depo__count b"), cur = 0;
      function go(i){
        i = (i + n) % n; if (i === cur) return;
        var old = slides[cur]; old.classList.remove("is-active", "is-open"); old.setAttribute("aria-hidden", "true");
        var ob = old.querySelector(".depo__more"); if (!ob.hidden){ ob.setAttribute("aria-expanded", "false"); ob.textContent = "Ler depoimento completo"; }
        slides[i].classList.add("is-active"); slides[i].setAttribute("aria-hidden", "false");
        dots[cur].classList.remove("is-active"); dots[i].classList.add("is-active");
        cur = i; count.textContent = pad(i);
      }
      Array.prototype.forEach.call(f.querySelectorAll("[data-dir]"), function(b){ b.addEventListener("click", function(){ go(cur + +b.getAttribute("data-dir")); }); });
      Array.prototype.forEach.call(dots, function(b){ b.addEventListener("click", function(){ go(+b.getAttribute("data-go")); }); });
      f.addEventListener("keydown", function(e){ if (e.key === "ArrowRight") go(cur + 1); if (e.key === "ArrowLeft") go(cur - 1); });
      var x0 = null, y0 = 0;
      f.addEventListener("touchstart", function(e){ x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, {passive:true});
      f.addEventListener("touchend", function(e){
        if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(cur + (dx < 0 ? 1 : -1));
      }, {passive:true});
      requestAnimationFrame(function(){
        Array.prototype.forEach.call(slides, function(sl){
          var txt = sl.querySelector(".depo__txt"), btn = sl.querySelector(".depo__more");
          if (txt.scrollHeight > txt.clientHeight + 20){
            btn.hidden = false;
            btn.addEventListener("click", function(){
              var open = sl.classList.toggle("is-open");
              btn.setAttribute("aria-expanded", open);
              btn.textContent = open ? "Recolher" : "Ler depoimento completo";
            });
          } else sl.classList.add("fits");
        });
      });
    });
  }
  if (window.VREC_DEPOIMENTOS) render();
  else {
    var sc = document.createElement("script");
    sc.src = root + "assets/depoimentos.js?v=" + Date.now().toString(36).slice(0, -3);
    sc.onload = render;
    document.head.appendChild(sc);
  }
})();

/* V•REC Films — scripts compartilhados */
(function(){
  var WHATSAPP = "5573982005990";
  var $ = function(s, c){ return (c||document).querySelector(s); };
  var $$ = function(s, c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); };
  var tryPlay = function(v){ var p = v.play(); if (p && p.catch) p.catch(function(){}); };

  /* Ano */
  $$("[data-year]").forEach(function(el){ el.textContent = new Date().getFullYear(); });

  /* Links de WhatsApp (data-wa="mensagem opcional") */
  $$("[data-wa]").forEach(function(a){
    var t = a.getAttribute("data-wa");
    a.href = "https://wa.me/" + WHATSAPP + (t ? "?text=" + encodeURIComponent(t) : "");
    a.target = "_blank"; a.rel = "noopener";
  });

  /* Balão do WhatsApp: aparece depois de alguns segundos, some ao fechar */
  var bubble = $(".wa-bubble");
  if (bubble){
    var closed = false; try { closed = sessionStorage.getItem("vrecWaClosed") === "1"; } catch(e){}
    if (!closed) setTimeout(function(){ bubble.classList.add("is-on"); }, 3500);
    $("button", bubble).addEventListener("click", function(){
      bubble.classList.remove("is-on");
      try { sessionStorage.setItem("vrecWaClosed","1"); } catch(e){}
    });
  }

  /* Header */
  var header = $(".header");
  if (header){
    var onScroll = function(){ header.classList.toggle("is-scrolled", window.scrollY > 40); };
    onScroll(); window.addEventListener("scroll", onScroll, {passive:true});
    var toggle = $(".nav-toggle"), nav = $(".nav");
    if (toggle && nav){
      toggle.addEventListener("click", function(){
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
        header.classList.toggle("is-scrolled", open || window.scrollY > 40);
      });
      $$("a", nav).forEach(function(a){ a.addEventListener("click", function(){ nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded","false"); }); });
    }
  }

  /* Reveal */
  var els = $$(".reveal");
  if ("IntersectionObserver" in window){
    var io = new IntersectionObserver(function(en){
      en.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, {threshold:.12, rootMargin:"0px 0px -40px 0px"});
    els.forEach(function(el){ io.observe(el); });
  } else { els.forEach(function(el){ el.classList.add("is-in"); }); }

  /* Vídeos que tocam sozinhos quando visíveis (topo e bastidores) */
  $$("video[data-autoplay]").forEach(function(v){
    v.muted = true;
    var start = parseFloat(v.getAttribute("data-start") || "0"), jumped = !start;
    var jump = function(){ if (!jumped && v.currentTime < 1){ jumped = true; try { v.currentTime = start; } catch(e){} } };
    v.addEventListener("playing", jump); v.addEventListener("loadeddata", jump);
    if ("IntersectionObserver" in window){
      new IntersectionObserver(function(en){ en.forEach(function(e){ e.isIntersecting ? tryPlay(v) : v.pause(); }); }, {threshold:.25}).observe(v);
    } else { tryPlay(v); }
  });

  /* Plano B: se o navegador bloquear a reprodução automática (ex.: iPhone em
     modo de economia de bateria), toca no primeiro toque, clique ou rolagem. */
  var kick = function(){
    $$("video[data-autoplay]").forEach(function(v){
      var r = v.getBoundingClientRect();
      if (v.paused && r.bottom > 0 && r.top < window.innerHeight){ v.muted = true; tryPlay(v); }
    });
  };
  ["touchstart","click","scroll","keydown"].forEach(function(evt){
    window.addEventListener(evt, kick, {passive:true, once:true});
  });
  window.addEventListener("load", kick);

  /* Botão de som do vídeo de bastidores */
  $$("[data-sound-for]").forEach(function(btn){
    var v = document.getElementById(btn.getAttribute("data-sound-for"));
    if (!v) return;
    btn.addEventListener("click", function(){
      v.muted = !v.muted;
      if (!v.muted){ v.currentTime = 0; tryPlay(v); }
      btn.setAttribute("aria-pressed", String(!v.muted));
      btn.querySelector("span").textContent = v.muted ? "Ativar som" : "Silenciar";
    });
  });

  /* Thumbnails do YouTube */
  function ytThumb(img, id, isShort){
    var fallback = "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
    img.onload = function(){
      if (img.naturalWidth <= 120 && img.src !== fallback){ img.src = fallback; return; }
      img.classList.add("is-loaded");
    };
    img.onerror = function(){ if (img.src !== fallback) img.src = fallback; else img.remove(); };
    img.src = "https://i.ytimg.com/vi/" + id + (isShort ? "/oardefault.jpg" : "/maxresdefault.jpg");
  }
  $$("img[data-yt-thumb]").forEach(function(img){ ytThumb(img, img.getAttribute("data-yt-thumb"), false); });

  /* Filmes: player do YouTube carregado só no clique */
  $$(".film[data-yt]").forEach(function(film){
    var id = film.getAttribute("data-yt"), isShort = film.getAttribute("data-kind") === "short";
    var img = $("img", film); if (img) ytThumb(img, id, isShort);
    function play(){
      if (film.classList.contains("is-playing")) return;
      /* Arquivo aberto direto do computador: o YouTube recusa o player (erro 153). */
      if (location.protocol === "file:"){
        window.open(isShort ? "https://www.youtube.com/shorts/" + id : "https://www.youtube.com/watch?v=" + id, "_blank", "noopener");
        return;
      }
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
      f.allow = "autoplay; encrypted-media; fullscreen; picture-in-picture";
      f.allowFullscreen = true; f.referrerPolicy = "strict-origin-when-cross-origin";
      f.title = $(".film__title", film).textContent;
      $(".film__frame", film).appendChild(f);
      film.classList.add("is-playing");
    }
    film.addEventListener("click", play);
    film.addEventListener("keydown", function(e){ if (e.key === "Enter" || e.key === " "){ e.preventDefault(); play(); } });
  });

  /* Telefone BR */
  $$('input[type="tel"]').forEach(function(phone){
    phone.addEventListener("input", function(){
      var v = phone.value.replace(/\D/g,"").slice(0,11);
      if (v.length > 6) phone.value = "(" + v.slice(0,2) + ") " + v.slice(2, v.length-4) + "-" + v.slice(-4);
      else if (v.length > 2) phone.value = "(" + v.slice(0,2) + ") " + v.slice(2);
      else phone.value = v;
    });
  });
  $$('input[type="date"]').forEach(function(d){ d.min = new Date().toISOString().split("T")[0]; });

  /* Formulários → WhatsApp com a mensagem montada */
  $$("form[data-wa-form]").forEach(function(form){
    var fields = $$("input[name],select[name],textarea[name]", form);
    fields.forEach(function(el){
      var clear = function(){ var f = el.closest(".field"); if (f) f.classList.remove("has-error"); };
      el.addEventListener("input", clear); el.addEventListener("change", clear);
    });
    form.addEventListener("submit", function(ev){
      ev.preventDefault();
      var ok = true;
      $$("[required]", form).forEach(function(el){
        var valid = el.value.trim() !== "";
        if (el.type === "tel") valid = el.value.replace(/\D/g,"").length >= 10;
        el.closest(".field").classList.toggle("has-error", !valid);
        if (!valid) ok = false;
      });
      if (!ok){ var first = $(".has-error input, .has-error select", form); if (first) first.focus(); return; }

      var lines = ["Oi, V.REC! " + (form.getAttribute("data-wa-form") || "Vim pelo site."), ""], extra = "";
      fields.forEach(function(el){
        var val = (el.value || "").trim(); if (!val) return;
        if (el.type === "date") val = val.split("-").reverse().join("/");
        if (el.tagName === "TEXTAREA"){ extra = val; return; }
        var lab = form.querySelector('label[for="' + el.id + '"]');
        var name = lab ? lab.childNodes[0].textContent.trim().replace(/\?$/,"") : el.name;
        lines.push(name + ": " + val);
      });
      if (extra) lines.push("", extra);
      window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
      form.style.display = "none";
      var okBox = form.parentNode.querySelector(".form__ok"); if (okBox) okBox.classList.add("is-on");
    });
  });
})();
