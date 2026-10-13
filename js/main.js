/* =====================================================================
   TRAMONTIS - DATI DEL SITO (unica fonte)
   Modifica solo questo blocco. Tutto il resto del sito si aggiorna.
   Dove vedi [DA COMPILARE] manca il dato: sostituiscilo con quello vero.
   ===================================================================== */
var CONFIG = {
  nome: "Tramontis",
  zona: "Varese e provincia",
  email: "tramontis.info@gmail.com",

  // Solo cifre, con prefisso internazionale, senza + e senza spazi. Esempio: "393331234567".
  // Lasciato vuoto: i pulsanti WhatsApp restano nascosti.
  whatsapp: "",
  // Numero per chiamare (facoltativo), come lo scriveresti normalmente. Vuoto = nascosto.
  telefono: "",

  // Messaggio che arriva su WhatsApp quando qualcuno preme il pulsante.
  whatsappMessaggio: "Ciao, vi scrivo dal sito Tramontis. Vorrei un preventivo per il sito della mia attività.",
  emailOggetto: "Richiesta preventivo dal sito",

  // Indirizzo del servizio per il form (Formspree o simile). Esempio: "https://formspree.io/f/xxxxxxxx".
  // Se contiene [DA COMPILARE] il form mostra un messaggio e rimanda all'email.
  formEndpoint: "https://formspree.io/f/[DA COMPILARE]",

  // Footer e privacy
  ragioneSociale: "Tramontis",
  formaGiuridica: "[FORMA GIURIDICA DA COMPILARE]",
  partitaIva: "[P. IVA DA COMPILARE]",
  indirizzo: "[INDIRIZZO DA COMPILARE]",
  titolarePrivacy: "[TITOLARE DEL TRATTAMENTO DA COMPILARE]",
  dataPrivacy: "[DATA DA COMPILARE]",
  conservazioneDati: "[PERIODO DI CONSERVAZIONE DA COMPILARE]",

  // Mestieri che scorrono nel titolo, dopo "idraulico" (scritto in index.html). Chi legge vede il suo.
  mestieriAnimati: ["elettricista", "giardiniere", "imbianchino", "falegname"],

  // Ruoli dei tre fondatori (i nomi sono scritti in index.html)
  ruoli: [
    "[RUOLO DA COMPILARE]",
    "[RUOLO DA COMPILARE]",
    "[RUOLO DA COMPILARE]"
  ]
};
/* ===================== FINE DATI. Sotto: codice. ===================== */

(function () {
  "use strict";

  var doc = document;

  function all(sel, root) {
    return Array.prototype.slice.call((root || doc).querySelectorAll(sel));
  }

  function isSet(v) {
    return typeof v === "string" && v !== "" && v.indexOf("[DA COMPILARE]") === -1;
  }

  /* ---------- Link di contatto ---------- */
  var waDigits = String(CONFIG.whatsapp || "").replace(/\D/g, "");
  var telDigits = String(CONFIG.telefono || "").replace(/[^\d+]/g, "");

  var links = {
    mailto: "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent(CONFIG.emailOggetto),
    wa: "https://wa.me/" + waDigits + "?text=" + encodeURIComponent(CONFIG.whatsappMessaggio),
    tel: "tel:" + telDigits
  };

  /* ---------- Testi dai dati ---------- */
  all("[data-cfg]").forEach(function (el) {
    var v = CONFIG[el.getAttribute("data-cfg")];
    if (typeof v === "string" && v) { el.textContent = v; }
  });

  all("[data-role]").forEach(function (el) {
    var v = CONFIG.ruoli[Number(el.getAttribute("data-role"))];
    if (v) { el.textContent = v; }
  });

  all("[data-href]").forEach(function (el) {
    var kind = el.getAttribute("data-href");
    if (links[kind]) { el.setAttribute("href", links[kind]); }
  });

  /* ---------- Pulsanti che compaiono solo se il dato c'è ---------- */
  var available = { whatsapp: waDigits.length >= 8, telefono: telDigits.length >= 6 };
  all("[data-show]").forEach(function (el) {
    if (available[el.getAttribute("data-show")]) { el.hidden = false; }
  });

  /* ---------- Titolo: il mestiere scorre verso l'alto ---------- */
  (function () {
    var box = doc.getElementById("rotante");
    var titolo = box && box.parentNode;
    if (!box || !window.Element || !box.animate) { return; }
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { return; }

    var DURATA = 650;      // millisecondi per lo scorrimento
    var PAUSA = 2200;      // millisecondi in cui il mestiere resta fermo
    var EASING = "cubic-bezier(.7, 0, .2, 1)";

    var parole = [box.firstElementChild];
    (CONFIG.mestieriAnimati || []).forEach(function (testo) {
      var el = doc.createElement("span");
      el.className = "parola";
      el.textContent = testo;
      el.setAttribute("aria-hidden", "true"); // chi usa lo screen reader sente solo la prima parola
      box.appendChild(el);
      parole.push(el);
    });
    if (parole.length < 2) { return; }

    var larghezze = [];
    var corrente = 0;
    var timer = null;

    // Larghezza della targhetta = parola + il suo respiro a sinistra e a destra.
    function misura() {
      var cs = window.getComputedStyle(box);
      var bordi = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      larghezze = parole.map(function (el) { return Math.ceil(el.offsetWidth + bordi); });
    }

    // Prima di attivare il layout animato la parola è in linea: la misuro, poi la fisso.
    box.style.width = box.offsetWidth + "px";
    box.classList.add("pronto");
    misura();
    box.style.width = larghezze[0] + "px";

    // Riserva l'altezza del titolo più alta (a capo diversi con parole diverse): la pagina non salta.
    function riservaAltezza() {
      titolo.style.minHeight = "";
      box.classList.add("misura");
      var max = 0;
      larghezze.forEach(function (w) {
        box.style.width = w + "px";
        max = Math.max(max, titolo.offsetHeight);
      });
      box.style.width = larghezze[corrente] + "px";
      titolo.style.minHeight = max + "px";
      void box.offsetWidth;
      box.classList.remove("misura");
    }
    riservaAltezza();

    var rid;
    function rimisura() { misura(); riservaAltezza(); }
    window.addEventListener("resize", function () {
      clearTimeout(rid);
      rid = setTimeout(rimisura, 150);
    });
    // Il carattere del sito può arrivare dopo la prima pagina: appena c'è, rifaccio le misure.
    if (doc.fonts && doc.fonts.ready) { doc.fonts.ready.then(rimisura); }

    function avanti() {
      var da = parole[corrente];
      corrente = (corrente + 1) % parole.length;
      var a = parole[corrente];
      var opzioni = { duration: DURATA, easing: EASING };

      da.classList.remove("attiva");
      a.classList.add("attiva");
      da.animate([{ transform: "none", opacity: 1 }, { transform: "translateY(-130%)", opacity: 0 }], opzioni);
      a.animate([{ transform: "translateY(130%)", opacity: 0 }, { transform: "none", opacity: 1 }], opzioni);
      box.style.width = larghezze[corrente] + "px";
    }

    function ciclo() {
      timer = setTimeout(function () {
        if (!doc.hidden) { avanti(); }
        ciclo();
      }, PAUSA + DURATA);
    }

    // Si ferma quando il titolo non si vede (risparmia batteria) e riparte quando torna visibile.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (voci) {
        clearTimeout(timer);
        if (voci[0].isIntersecting) { ciclo(); }
      }).observe(titolo);
    } else {
      ciclo();
    }
  })();

  /* ---------- Form ---------- */
  var form = doc.getElementById("form-contatti");
  if (!form) { return; }

  var status = doc.getElementById("form-stato");
  var button = form.querySelector("button[type=submit]");

  function showStatus(kind, html) {
    status.className = "form-stato " + kind;
    status.innerHTML = html;
    status.hidden = false;
  }

  function mailLink(text) {
    return '<a href="' + links.mailto + '">' + text + "</a>";
  }

  function fieldError(field, message) {
    var box = doc.getElementById(field.id + "-errore");
    if (box) { box.textContent = message; }
    field.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validate() {
    var firstBad = null;
    var rules = {
      nome: function (v) { return v.trim().length < 2 ? "Scrivi il tuo nome." : ""; },
      telefono: function (v) {
        return v.replace(/\D/g, "").length < 6 ? "Scrivi un numero di telefono valido." : "";
      },
      mestiere: function (v) { return v === "" ? "Scegli il tuo mestiere." : ""; }
    };
    Object.keys(rules).forEach(function (name) {
      var field = form.elements[name];
      var msg = rules[name](field.value);
      fieldError(field, msg);
      if (msg && !firstBad) { firstBad = field; }
    });
    if (firstBad) { firstBad.focus(); }
    return !firstBad;
  }

  ["nome", "telefono", "mestiere"].forEach(function (name) {
    form.elements[name].addEventListener("input", function () { fieldError(this, ""); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.hidden = true;

    if (!validate()) { return; }

    // Honeypot: un utente vero non vede questo campo. Se è pieno è un robot.
    if (form.elements._gotcha.value) {
      showStatus("ok", "<strong>Grazie!</strong> Ti ricontattiamo presto.");
      return;
    }

    if (!isSet(CONFIG.formEndpoint)) {
      showStatus("errore", "Il modulo non è ancora attivo. Scrivici a " + mailLink(CONFIG.email) + ".");
      return;
    }

    button.disabled = true;
    button.textContent = "Invio in corso…";

    fetch(CONFIG.formEndpoint, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    })
      .then(function (res) {
        if (!res.ok) { throw new Error("http " + res.status); }
        form.reset();
        showStatus("ok", "<strong>Grazie!</strong> Abbiamo ricevuto la tua richiesta. Ti ricontattiamo presto.");
      })
      .catch(function () {
        showStatus("errore", "Non siamo riusciti a inviare il messaggio. Scrivici a " + mailLink(CONFIG.email) + ".");
      })
      .then(function () {
        button.disabled = false;
        button.textContent = "Invia la richiesta";
      });
  });
})();
