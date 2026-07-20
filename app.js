/* ============================================================
   Healing Minds — site scripts
   ============================================================
   CONTACT FORM EMAIL SETUP (FormSubmit)
   ------------------------------------------------------------
   This form uses FormSubmit (formsubmit.co) — the same free
   service used on Vanshul's site — to deliver submissions
   straight to mayki.kiran@gmail.com. No backend server needed,
   no dashboard signup required.

   The form's action attribute in index.html already points to:
     https://formsubmit.co/ajax/mayki.kiran@gmail.com

   One-time step: the very first submission triggers a
   confirmation email to mayki.kiran@gmail.com — click the
   "Activate Form" link in that email once, and every
   submission after that is delivered automatically.

   If the destination email ever needs to change, update the
   action="..." attribute on <form id="contactForm"> in
   index.html — nothing here in app.js needs to change.
   ============================================================ */

/* ---------- vCard / QR modal ---------- */
function openVcard() {
  var modal = document.getElementById('vcard-modal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  if (!document.getElementById('vcardQR').hasChildNodes()) {
    var vcardData = "BEGIN:VCARD\nVERSION:3.0\nFN:Dr. Pushpinder Bedi\nN:Bedi;Pushpinder;Dr.;;\nORG:Healing Minds\nTITLE:Clinical Psychologist | Sex Therapist\nTEL;TYPE=CELL:+919876543210\nEMAIL:hello@healingminds-dr.com\nADR;TYPE=WORK:;;4th Floor Care Chambers Green Park;New Delhi;;110016;India\nEND:VCARD";
    new QRCode(document.getElementById('vcardQR'), { text: vcardData, width: 160, height: 160, colorDark: '#16302E', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M });
  }
}
function closeVcard() {
  document.getElementById('vcard-modal').style.display = 'none';
  document.body.style.overflow = '';
}
document.getElementById('vcard-modal').addEventListener('click', function (e) {
  if (e.target === this) closeVcard();
});

/* ---------- Contact form → FormSubmit ---------- */
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const form = this;
  const btn = document.getElementById('submitBtn');
  const errorBox = document.getElementById('formError');

  if (errorBox) errorBox.style.display = 'none';

  btn.textContent = 'Sending...';
  btn.disabled = true;

  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  })
    .then(function (response) {
      if (!response.ok) throw new Error('FormSubmit request failed');
      form.style.display = 'none';
      document.getElementById('formSuccess').style.display = 'block';
    })
    .catch(function (err) {
      console.error('FormSubmit error:', err);
      btn.textContent = 'Send Message';
      btn.disabled = false;
      if (errorBox) {
        errorBox.textContent = 'Something went wrong sending your message. Please try again or email us directly.';
        errorBox.style.display = 'block';
      }
    });
});

/* ---------- Mobile menu ---------- */
function toggleMenu() { document.getElementById('mobileMenu').classList.toggle('open'); }
function closeMenu() { document.getElementById('mobileMenu').classList.remove('open'); }

/* ---------- Fade-in on scroll ---------- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

/* ---------- Scroll-spy nav highlighting ---------- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 90) current = s.id; });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--sky)' : '';
  });
});