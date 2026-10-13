# Tramontis – sito

Sito statico (HTML, CSS, un solo file JS). Nessun build, nessun npm, nessun backend.

```
index.html      pagina principale
privacy.html    informativa privacy
css/style.css   stile
js/main.js      DATI in cima (CONFIG) + codice del sito e del form
assets/         logo, foto, immagini delle demo
sitemap.xml, robots.txt
.claude/skills/ guida di design usata per l'aspetto del sito
```

## Come modificare i dati

Apri `js/main.js`. In cima c'è il blocco `CONFIG`: email, WhatsApp, telefono, messaggio WhatsApp, indirizzo del form, dati del footer e della privacy, ruoli dei fondatori. Sostituisci ogni `[DA COMPILARE]`.

- **WhatsApp:** scrivi il numero solo con cifre e prefisso, per esempio `393331234567`. Finché è vuoto i pulsanti WhatsApp restano nascosti.
- **Telefono:** se lo compili compare il pulsante "Chiama ora".
- **Form:** crea un modulo su [Formspree](https://formspree.io), copia l'indirizzo (`https://formspree.io/f/xxxxxxxx`) in `formEndpoint`. Il campo antispam `_gotcha` è già nel modulo.

**Da cambiare a mano, perché non leggono la config:**
- `index.html`: blocco JSON-LD nella `<head>` (telefono, P. IVA, indirizzo) e i testi `[DA COMPILARE]` dei pacchetti e delle FAQ.
- `canonical`, `og:url`, `sitemap.xml`, `robots.txt`: ora puntano a `https://luckylori07.github.io/tramontis/`. Se usi un dominio tuo, sostituiscilo ovunque.
- `privacy.html`: il nome del servizio del form.
- Il link di fallback email è scritto anche in `index.html` (`mailto:`), così funziona anche senza JavaScript.

## Aspetto
L'idea è la fiancata di un furgone da lavoro: blu tuta, giallo cantiere, scritte grosse e strette. I colori sono le variabili in cima a `css/style.css` (`:root`). Il carattere è Archivo (licenza OFL, file e licenza in `assets/fonts/`), un solo file che serve sia per i titoli stretti sia per il testo.

## Mestieri che scorrono nel titolo
Il primo mestiere ("idraulico") è scritto in `index.html`, dentro l'`<h1>`. Gli altri sono in `CONFIG.mestieriAnimati` in `js/main.js`: aggiungi o togli parole a piacere (devono andare bene dopo "un": un elettricista, un falegname...). Durata e pausa si cambiano nelle costanti `DURATA` e `PAUSA` del codice. Chi ha attivato "riduci movimento" nel telefono vede solo "idraulico", fermo.

## Come mettere il logo
Copia il file in `assets/` e cambia `src` (e `width`/`height`) dell'immagine nell'header di `index.html` e `privacy.html`. Cambia anche l'icona (`<link rel="icon">`). Per l'anteprima sui social aggiungi `og:image` (vedi commento in `index.html`).

## Come aggiungere una demo
In `index.html`, sezione "Esempi di siti", c'è un commento con i passi. In breve: metti l'immagine in `assets/` (WebP, circa 800 px), copia una `<article class="demo">`, sostituisci il riquadro con un `<img ... loading="lazy">` e il pulsante "Presto online" con un link alla demo.

## Come pubblicare su GitHub Pages
1. Su GitHub: **Settings → Pages**.
2. **Source:** *Deploy from a branch*. **Branch:** `main`, cartella `/ (root)`. Salva.
3. Dopo circa un minuto il sito è su `https://<utente>.github.io/tramontis/`.

I percorsi sono relativi, quindi funziona anche in una sottocartella. Per un dominio tuo: **Settings → Pages → Custom domain**.

## Prima di mandare il link ai clienti
Controlla che non resti nessun `[DA COMPILARE]` visibile, che il form invii davvero una richiesta di prova e fai rivedere `privacy.html` da un professionista.
