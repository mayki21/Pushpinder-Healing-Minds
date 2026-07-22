/* ============================================================
   Healing Minds — In-page Assistant (rule-based, no external AI)
   ------------------------------------------------------------
   • Answers visitor questions using a local knowledge base built
     from this site's own content — no OpenAI / external API calls.
   • Auto-greets on first visit, gently recommends booking, and
     runs a full appointment-booking flow inside the chat.
   • Booking details are emailed via the SAME FormSubmit endpoint
     used by the Contact form → pushpinder.singh873@gmail.com
   ============================================================ */
(function () {
  "use strict";

  var FORM_ENDPOINT = "https://formsubmit.co/ajax/pushpinder.singh873@gmail.com";
  var DOCTOR = "Dr. Pushpinder Singh";

  /* ---------- Knowledge base (site content) ---------- */
  var KB = {
    services: {
      keywords: ["service", "services", "what do you offer", "what do you do", "what do you provide", "areas of", "specialt", "what can you help"],
      text: "Healing Minds offers three core areas of care with " + DOCTOR + ":<br><br>• <strong>Sexual Health &amp; Intimacy</strong> (sex therapy)<br>• <strong>Gender-Affirming Care</strong><br>• <strong>Holistic Mental Health &amp; Wellbeing</strong><br><br>Which one would you like to hear about?",
      quicks: [{ l: "Sex Therapy", i: "sex" }, { l: "Gender-Affirming", i: "gender" }, { l: "Holistic Care", i: "holistic" }, { l: "Book a session", i: "book", solid: true }]
    },
    sex: {
      keywords: ["sex", "intimacy", "intimate", "libido", "desire", "erectile", "performance", "arousal", "orgasm", "painful", "pleasure", "sexual"],
      text: "The practice is <strong>sex-positive, kink-aware, and poly-informed</strong> — a judgment-free space for desire, connection and intimacy. Common concerns include mismatched libido, performance anxiety, ethical non-monogamy (ENM), painful intercourse, and recovering from sexual trauma.<br><br>The goal isn't a universal &ldquo;normal&rdquo; — it's what brings <em>you</em> personal satisfaction and joy.",
      quicks: [{ l: "Book a session", i: "book", solid: true }, { l: "Other services", i: "services" }]
    },
    gender: {
      keywords: ["gender", "trans", "transgender", "affirming", "dysphoria", "pronoun", "transition", "non-binary", "nonbinary", "queer", "lgbt", "coming out", "wpath", "hormone", "letter"],
      text: DOCTOR + " works from a <strong>gender-affirming model</strong> — you won't need to educate your therapist. Support includes WPATH-informed readiness letters, social transition and coming out, gender dysphoria, family dynamics, and minority stress.<br><br>And not every session has to be about gender — you're supported as a whole person.",
      quicks: [{ l: "Book a session", i: "book", solid: true }, { l: "Other services", i: "services" }]
    },
    holistic: {
      keywords: ["holistic", "anxiety", "depression", "burnout", "adhd", "stress", "grief", "loss", "mental health", "wellbeing", "well-being", "transition", "relationship", "cbt", "emdr", "somatic", "mindful", "therapy"],
      text: "Beyond sex and gender, " + DOCTOR + " supports <strong>anxiety, depression, burnout, ADHD, life transitions, relationship friction, and grief</strong> — with approaches like CBT, EMDR, somatic therapy and mindfulness.<br><br>Being queer, trans or kink-inclined is never treated as the problem — the work is building resilience against outside pressures.",
      quicks: [{ l: "Book a session", i: "book", solid: true }, { l: "Other services", i: "services" }]
    },
    safety: {
      keywords: ["safe", "judged", "judge", "shame", "deadname", "dead name", "confidential", "privacy", "inclusive", "welcome"],
      text: "You're safe here. Chosen names and pronouns are used consistently — in session and in clinical notes — with systems in place so you're never deadnamed. Intake is inclusive, and the burden of &ldquo;teaching your therapist&rdquo; never falls on you.",
      quicks: [{ l: "Book a session", i: "book", solid: true }]
    },
    enm: {
      keywords: ["poly", "polyam", "non-monogam", "nonmonogam", "enm", "kink", "bdsm", "open relationship"],
      text: "Absolutely — the practice is <strong>kink-aware and poly-informed</strong>, with experience supporting ethical non-monogamy (ENM). You'll be met without judgment or assumptions.",
      quicks: [{ l: "Book a session", i: "book", solid: true }]
    },
    heritage: {
      keywords: ["kamasutra", "kama sutra", "heritage", "history", "ancient", "india", "hijra", "tritiya", "temple", "khajuraho"],
      text: "The practice draws on India's own sex-positive heritage — the Kamasutra's emphasis on pleasure and consent, and the open recognition of gender diversity (<em>Tritiya Prakriti</em>) long before colonial-era shame. You can read more in the <strong>Perspectives</strong> section of the site.",
      quicks: [{ l: "Book a session", i: "book", solid: true }]
    },
    location: {
      keywords: ["where", "location", "address", "clinic", "office", "muktsar", "punjab", "directions", "reach you"],
      text: "The practice is at <strong>H.No. 10552, St. No. 5, Malout Road, Sri Muktsar Sahib – 152026, Punjab</strong>. Telehealth (video) sessions are also available anywhere in India.",
      quicks: [{ l: "Book a session", i: "book", solid: true }, { l: "Is online available?", i: "online" }]
    },
    online: {
      keywords: ["online", "telehealth", "video", "virtual", "remote", "call", "in-person", "in person"],
      text: "Yes — sessions are available both <strong>in-person</strong> in Sri Muktsar Sahib and via <strong>telehealth (video call)</strong>, so you can meet from wherever you're comfortable.",
      quicks: [{ l: "Book a session", i: "book", solid: true }]
    },
    hours: {
      keywords: ["hour", "timing", "time", "open", "available", "when can", "schedule", "slot"],
      text: "Appointments are by request — you pick a preferred date and time, and the practice confirms by phone or email within <strong>one business day</strong>. Want to request a slot now?",
      quicks: [{ l: "Book a session", i: "book", solid: true }]
    },
    fees: {
      keywords: ["fee", "cost", "price", "charge", "pricing", "payment", "insurance", "how much"],
      text: "Session fees are discussed directly with the practice. You can reach out by phone or email, or I can help you request an appointment and the details will be confirmed with you.",
      quicks: [{ l: "Book a session", i: "book", solid: true }, { l: "Contact details", i: "contact" }]
    },
    contact: {
      keywords: ["contact", "phone", "call", "email", "mail", "number", "whatsapp", "reach"],
      text: "You can reach the practice at:<br>• Phone: <a href='tel:+918700056840'>+91 87000 56840</a><br>• Email: <a href='mailto:pushpinder.singh873@gmail.com'>pushpinder.singh873@gmail.com</a><br>• WhatsApp: <a href='https://wa.me/918700056840' target='_blank' rel='noopener'>message directly</a><br><br>Or I can book a session for you right here.",
      quicks: [{ l: "Book a session", i: "book", solid: true }]
    },
    about: {
      keywords: ["who is", "about", "doctor", "credential", "qualif", "registration", "council", "experience", "mbbs", "pushpinder"],
      text: "<strong>" + DOCTOR + ", MBBS</strong> — Clinical Psychologist &amp; Sex Therapist. Area of practice: consultation for sexual health, psychosexual wellness &amp; LGBTQIA+ affirming care, with 10+ years of experience.<br><br><em>Registration No.: Punjab Medical Council — 43696.</em>",
      quicks: [{ l: "Book a session", i: "book", solid: true }, { l: "Services", i: "services" }]
    },
    greeting: {
      keywords: ["hi", "hello", "hey", "namaste", "good morning", "good evening", "good afternoon", "yo", "sup"],
      text: "Hi! I'm the Healing Minds assistant 🌿 I can tell you about our services or help you book a session with " + DOCTOR + ". How can I help you today?",
      quicks: [{ l: "Our services", i: "services" }, { l: "Book a session", i: "book", solid: true }]
    },
    thanks: {
      keywords: ["thank", "thanks", "thx", "appreciate", "great", "awesome", "perfect", "ok cool"],
      text: "You're very welcome 💚 Whenever you're ready, I can help you book a session with " + DOCTOR + ".",
      quicks: [{ l: "Book a session", i: "book", solid: true }]
    }
  };

  var CRISIS_WORDS = ["suicide", "suicidal", "kill myself", "kill my self", "end my life", "want to die", "hurt myself", "harm myself", "self harm", "self-harm", "emergency", "can't go on", "cant go on", "hopeless"];
  // Kept deliberately specific — bare words like "session"/"consult" collide with
  // ordinary questions ("online sessions?"), so booking needs a clear intent phrase.
  var BOOK_WORDS = ["book", "appointment", "schedule", "reserve", "sign me up", "sign up", "make a booking", "a session with", "book a session", "get a session", "want a session", "want an appointment"];

  /* ---------- Booking flow definition ---------- */
  var STEPS = [
    { key: "name", field: "name", type: "text", q: "Wonderful — let's get you booked with " + DOCTOR + " 🌿<br>First, what's your <strong>full name</strong>?", validate: function (v) { return v.trim().length >= 2 ? "" : "Please enter your name."; } },
    { key: "phone", field: "phone", type: "text", q: "Thanks{name}! What's the best <strong>contact number</strong>?", validate: function (v) { return /^[0-9+\-\s]{7,15}$/.test(v.trim()) ? "" : "Please enter a valid phone number (7–15 digits)."; } },
    { key: "email", field: "email", type: "text", q: "And your <strong>email address</strong>?", validate: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "That doesn't look like a valid email — mind checking it?"; } },
    { key: "reason", field: "reason", type: "choice", q: "What would you like the session to focus on?", options: ["Sex Therapy & Intimacy", "Gender-Affirming Care", "Holistic Mental Health", "Not sure yet"] },
    { key: "mode", field: "session_mode", type: "choice", q: "How would you like to meet?", options: ["In-Person", "Telehealth (Video Call)", "No Preference"] },
    { key: "date", field: "appointment_date", type: "date", q: "Which <strong>date</strong> works best for you?" },
    { key: "time", field: "appointment_time", type: "time", q: "And a preferred <strong>time</strong>?" },
    { key: "message", field: "message", type: "textarea", optional: true, q: "Anything you'd like " + DOCTOR + " to know beforehand? (optional — type <em>skip</em> to skip)" }
  ];

  /* ---------- State ---------- */
  var booking = { active: false, step: 0, data: {}, awaiting: null }; // awaiting: 'choice' | 'date' | 'time' | null
  var infoAnswers = 0, recommended = false, opened = false;

  /* ---------- DOM build ---------- */
  var el = {};
  function build() {
    var wrap = document.createElement("div");
    wrap.id = "hm-chat";
    wrap.innerHTML =
      '<button class="hm-launcher" aria-label="Open chat assistant">' +
        '<span class="hm-badge">1</span>' +
        '<svg class="hm-ico-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>' +
        '<svg class="hm-ico-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
      '</button>' +
      '<div class="hm-teaser" role="dialog" aria-label="Chat greeting">' +
        '<button class="hm-teaser-x" aria-label="Dismiss">&times;</button>' +
        '<strong>Hi there 👋</strong><br>How can I help you today? I can answer questions or book your session.' +
      '</div>' +
      '<div class="hm-window" role="dialog" aria-label="Healing Minds assistant">' +
        '<div class="hm-header">' +
          '<div class="hm-avatar"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5"><path d="M9 3a6 6 0 016 6c0 2.2-1.2 3.4-2 4.3-.5.6-.8 1-.8 1.7v2a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1.2c-1.7-.5-3-2.1-3-4A5 5 0 019 3z"/><path d="M6 18h6"/></svg></div>' +
          '<div class="hm-htext"><h4>Healing Minds Assistant</h4><p>Online now</p></div>' +
          '<button class="hm-hclose" aria-label="Close chat">&times;</button>' +
        '</div>' +
        '<div class="hm-body" id="hm-body"></div>' +
        '<div class="hm-foot">' +
          '<div class="hm-inputrow">' +
            '<textarea id="hm-text" rows="1" placeholder="Type your message…"></textarea>' +
            '<button class="hm-send" id="hm-send" aria-label="Send"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></button>' +
          '</div>' +
          '<p class="hm-disclaimer">Automated assistant · not for emergencies</p>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);

    el.launcher = wrap.querySelector(".hm-launcher");
    el.badge = wrap.querySelector(".hm-badge");
    el.teaser = wrap.querySelector(".hm-teaser");
    el.teaserX = wrap.querySelector(".hm-teaser-x");
    el.window = wrap.querySelector(".hm-window");
    el.hclose = wrap.querySelector(".hm-hclose");
    el.body = wrap.querySelector("#hm-body");
    el.text = wrap.querySelector("#hm-text");
    el.send = wrap.querySelector("#hm-send");

    el.launcher.addEventListener("click", toggle);
    el.hclose.addEventListener("click", close);
    el.teaserX.addEventListener("click", function (e) { e.stopPropagation(); hideTeaser(); });
    el.teaser.addEventListener("click", open);
    el.send.addEventListener("click", onSend);
    el.text.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); }
    });
    el.text.addEventListener("input", function () {
      el.text.style.height = "auto";
      el.text.style.height = Math.min(el.text.scrollHeight, 90) + "px";
    });
  }

  /* ---------- UI helpers ---------- */
  function scrollDown() { el.body.scrollTop = el.body.scrollHeight; }

  function clearInteractives() {
    el.body.querySelectorAll(".hm-quicks, .hm-inline").forEach(function (n) { n.remove(); });
  }

  function addMsg(html, who, cls) {
    // Any user action supersedes previously-offered choices/pickers.
    if (who === "user") clearInteractives();
    var d = document.createElement("div");
    d.className = "hm-msg " + who + (cls ? " " + cls : "");
    if (who === "user") { d.textContent = html; } else { d.innerHTML = html; }
    el.body.appendChild(d);
    scrollDown();
    return d;
  }

  function addQuicks(quicks) {
    if (!quicks || !quicks.length) return;
    var row = document.createElement("div");
    row.className = "hm-quicks";
    quicks.forEach(function (q) {
      var b = document.createElement("button");
      b.className = "hm-chip" + (q.solid ? " solid" : "");
      b.textContent = q.l;
      b.addEventListener("click", function () {
        row.remove();
        addMsg(q.l, "user");
        if (q.i === "book") { startBooking(); }
        else { respond(q.i); }
      });
      row.appendChild(b);
    });
    el.body.appendChild(row);
    scrollDown();
    return row;
  }

  function typing(cb, delay) {
    var t = document.createElement("div");
    t.className = "hm-typing";
    t.innerHTML = "<span></span><span></span><span></span>";
    el.body.appendChild(t);
    scrollDown();
    setTimeout(function () { t.remove(); cb(); }, delay || 650);
  }

  /* ---------- Open / close ---------- */
  function open() {
    el.window.classList.add("open");
    el.launcher.classList.add("active");
    hideTeaser();
    el.badge.style.display = "none";
    if (!opened) { opened = true; greet(); }
    setTimeout(function () { el.text.focus(); }, 300);
  }
  function close() {
    el.window.classList.remove("open");
    el.launcher.classList.remove("active");
  }
  function toggle() { el.window.classList.contains("open") ? close() : open(); }
  function hideTeaser() { el.teaser.classList.remove("show"); }

  function greet() {
    typing(function () {
      addMsg(KB.greeting.text, "bot");
      addQuicks(KB.greeting.quicks);
    }, 500);
  }

  /* ---------- Intent matching ---------- */
  function normalize(s) { return " " + s.toLowerCase().replace(/[^\w\s'-]/g, " ").replace(/\s+/g, " ") + " "; }

  function matchIntent(text) {
    var t = normalize(text);
    for (var c = 0; c < CRISIS_WORDS.length; c++) { if (t.indexOf(CRISIS_WORDS[c]) !== -1) return "crisis"; }
    for (var b = 0; b < BOOK_WORDS.length; b++) { if (t.indexOf(BOOK_WORDS[b]) !== -1) return "book"; }
    var best = null, bestScore = 0;
    for (var id in KB) {
      if (!KB.hasOwnProperty(id)) continue;
      var score = 0, kws = KB[id].keywords;
      for (var k = 0; k < kws.length; k++) { if (t.indexOf(" " + kws[k]) !== -1 || t.indexOf(kws[k] + " ") !== -1 || t.indexOf(kws[k]) !== -1) score++; }
      if (score > bestScore) { bestScore = score; best = id; }
    }
    return bestScore > 0 ? best : "fallback";
  }

  function respond(id) {
    if (id === "crisis") {
      typing(function () {
        addMsg("I'm really glad you reached out, and I want you to be safe. I'm just an automated assistant and can't help in an emergency.<br><br>If you're in crisis or thinking about harming yourself, please contact:<br>• <strong>iCall Helpline</strong>: <a href='tel:9152987821'>9152987821</a><br>• <strong>Vandrevala Foundation</strong>: <a href='tel:18602662345'>1860-2662-345</a><br><br>…or go to your nearest emergency room right now. You deserve immediate support. 💚", "bot", "crisis");
      }, 500);
      return;
    }
    if (id === "book") { startBooking(); return; }
    if (id === "fallback") {
      typing(function () {
        addMsg("I'm a simple assistant, so I might have missed that. I can help with <strong>sexual health</strong>, <strong>gender-affirming care</strong>, <strong>holistic mental health</strong>, fees, location — or book a session with " + DOCTOR + ".", "bot");
        addQuicks([{ l: "Our services", i: "services" }, { l: "Book a session", i: "book", solid: true }]);
      }, 550);
      return;
    }
    var entry = KB[id];
    typing(function () {
      addMsg(entry.text, "bot");
      infoAnswers++;
      if (infoAnswers >= 3 && !recommended && !booking.active) {
        recommended = true;
        setTimeout(function () {
          typing(function () {
            addMsg("If it would help, I can book a session with " + DOCTOR + " for you right now — it only takes a minute. Would you like to?", "bot");
            addQuicks([{ l: "Yes, book a session", i: "book", solid: true }, { l: "Maybe later", i: "later" }]);
          }, 700);
        }, 400);
      } else {
        addQuicks(entry.quicks);
      }
    });
  }

  /* ---------- Booking flow ---------- */
  function startBooking() {
    booking = { active: true, step: 0, data: {}, awaiting: null };
    askStep();
  }

  function askStep() {
    var s = STEPS[booking.step];
    if (!s) { confirmBooking(); return; }
    var q = s.q.replace("{name}", booking.data.name ? ", " + booking.data.name.split(" ")[0] : "");
    typing(function () {
      addMsg(q, "bot");
      if (s.type === "choice") { booking.awaiting = "choice"; renderChoices(s.options); setInput(false); }
      else if (s.type === "date") { booking.awaiting = "date"; renderPicker("date"); setInput(false); }
      else if (s.type === "time") { booking.awaiting = "time"; renderPicker("time"); setInput(false); }
      else { booking.awaiting = null; setInput(true, s.optional ? "Type your message… (or 'skip')" : "Type your answer…"); el.text.focus(); }
    }, 500);
  }

  function renderChoices(options) {
    var row = document.createElement("div");
    row.className = "hm-quicks";
    options.forEach(function (opt) {
      var b = document.createElement("button");
      b.className = "hm-chip";
      b.textContent = opt;
      b.addEventListener("click", function () {
        row.remove();
        addMsg(opt, "user");
        acceptValue(opt);
      });
      row.appendChild(b);
    });
    el.body.appendChild(row);
    scrollDown();
  }

  function renderPicker(kind) {
    var row = document.createElement("div");
    row.className = "hm-inline";
    var input = document.createElement("input");
    input.type = kind;
    if (kind === "date") {
      var today = new Date();
      input.min = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
    }
    var btn = document.createElement("button");
    btn.textContent = "Confirm";
    btn.addEventListener("click", function () {
      if (!input.value) { input.focus(); return; }
      row.remove();
      var disp = kind === "date" ? formatDate(input.value) : formatTime(input.value);
      addMsg(disp, "user");
      acceptValue(input.value, disp);
    });
    row.appendChild(input); row.appendChild(btn);
    el.body.appendChild(row);
    scrollDown();
    setTimeout(function () { input.focus(); }, 100);
  }

  function acceptValue(value, display) {
    var s = STEPS[booking.step];
    booking.data[s.key] = value;
    if (display) booking.data[s.key + "_display"] = display;
    booking.awaiting = null;
    booking.step++;
    askStep();
  }

  // Handle free-text answers during text steps
  function handleBookingText(text) {
    var s = STEPS[booking.step];
    if (!s) return;
    if (booking.awaiting === "choice" || booking.awaiting === "date" || booking.awaiting === "time") {
      addMsg("Please use the option" + (booking.awaiting === "choice" ? "s" : " picker") + " above to continue 🙂", "bot");
      return;
    }
    if (s.optional && text.trim().toLowerCase() === "skip") { acceptValue(""); return; }
    if (s.validate) {
      var err = s.validate(text);
      if (err) { typing(function () { addMsg(err, "bot"); }, 350); return; }
    }
    acceptValue(text.trim());
  }

  function formatDate(v) {
    try {
      var p = v.split("-");
      var d = new Date(p[0], p[1] - 1, p[2]);
      return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    } catch (e) { return v; }
  }
  function formatTime(v) {
    try {
      var p = v.split(":"), h = parseInt(p[0], 10), m = p[1];
      var ap = h >= 12 ? "PM" : "AM"; var hh = h % 12; if (hh === 0) hh = 12;
      return hh + ":" + m + " " + ap;
    } catch (e) { return v; }
  }

  function confirmBooking() {
    var d = booking.data;
    typing(function () {
      addMsg("Here's what I have — please check it over:", "bot");
      var box = document.createElement("div");
      box.className = "hm-summary";
      box.innerHTML =
        row("Name", d.name) +
        row("Phone", d.phone) +
        row("Email", d.email) +
        row("Focus", d.reason) +
        row("Mode", d.mode) +
        row("Date", d.date_display || d.date) +
        row("Time", d.time_display || d.time) +
        (d.message ? row("Note", d.message) : "");
      el.body.appendChild(box);
      scrollDown();
      addQuicksRaw([
        { l: "✓ Confirm & send", cb: submitBooking, solid: true },
        { l: "Start over", cb: startBooking }
      ]);
    }, 500);
  }
  function row(k, v) { return '<div class="row"><span class="k">' + k + '</span><span class="v">' + escapeHtml(v) + '</span></div>'; }

  function addQuicksRaw(items) {
    var wrap = document.createElement("div");
    wrap.className = "hm-quicks";
    items.forEach(function (it) {
      var b = document.createElement("button");
      b.className = "hm-chip" + (it.solid ? " solid" : "");
      b.textContent = it.l;
      b.addEventListener("click", function () { wrap.remove(); it.cb(); });
      wrap.appendChild(b);
    });
    el.body.appendChild(wrap);
    scrollDown();
  }

  function submitBooking() {
    var d = booking.data;
    addMsg("Confirm & send", "user");
    var sending = addMsg("Sending your request… ⏳", "bot");

    var fd = new FormData();
    fd.append("_subject", "New Appointment Request — Healing Minds (Chatbot)");
    fd.append("name", d.name);
    fd.append("phone", d.phone);
    fd.append("email", d.email);
    fd.append("reason", d.reason);
    fd.append("session_mode", d.mode);
    fd.append("appointment_date", d.date);
    fd.append("appointment_time", d.time);
    fd.append("message", d.message || "(none)");
    fd.append("source", "Website chatbot");

    fetch(FORM_ENDPOINT, { method: "POST", body: fd, headers: { "Accept": "application/json" } })
      .then(function (r) { if (!r.ok) throw new Error("send failed"); return r.json(); })
      .then(function () {
        sending.remove();
        booking.active = false;
        addMsg("All done! ✅ Your appointment request has been sent to " + DOCTOR + "'s practice.<br><br>You'll get a confirmation by <strong>phone or email within one business day</strong>. Thank you for reaching out — that first step matters. 💚", "bot");
        addQuicksRaw([{ l: "Ask another question", cb: function () { addMsg("I have another question", "user"); typing(function () { addMsg("Of course — what would you like to know?", "bot"); addQuicks([{ l: "Our services", i: "services" }, { l: "Contact details", i: "contact" }]); }); } }]);
      })
      .catch(function () {
        sending.remove();
        booking.active = false;
        addMsg("I'm sorry — something went wrong sending that. Please try again, or reach the practice directly at <a href='tel:+918700056840'>+91 87000 56840</a> or <a href='mailto:pushpinder.singh873@gmail.com'>pushpinder.singh873@gmail.com</a>.", "bot", "crisis");
        addQuicksRaw([{ l: "Try again", cb: submitBooking, solid: true }]);
      });
  }

  /* ---------- Input handling ---------- */
  function setInput(enabled, placeholder) {
    el.text.disabled = !enabled;
    el.send.disabled = !enabled;
    el.text.placeholder = placeholder || "Type your message…";
    if (!enabled) el.text.value = "";
  }

  function onSend() {
    var text = el.text.value.trim();
    if (!text || el.text.disabled) return;
    el.text.value = "";
    el.text.style.height = "auto";
    addMsg(text, "user");
    if (booking.active) { handleBookingText(text); }
    else { respond(matchIntent(text)); }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- Init ---------- */
  function init() {
    build();
    // Auto teaser + first-visit auto-open
    setTimeout(function () {
      if (!el.window.classList.contains("open")) el.teaser.classList.add("show");
    }, 1600);
    if (!sessionStorage.getItem("hm_chat_seen")) {
      sessionStorage.setItem("hm_chat_seen", "1");
      setTimeout(function () { open(); }, 3200);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
