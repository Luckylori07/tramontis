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
