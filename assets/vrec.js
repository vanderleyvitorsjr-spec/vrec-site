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
