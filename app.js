/* ============================================================
   Healing Minds — site scripts
   ============================================================
   CONTACT FORM EMAIL SETUP (FormSubmit)
   ------------------------------------------------------------
   This form uses FormSubmit (formsubmit.co) — the same free
   service used on Vanshul's site — to deliver submissions
   straight to pushpinder.singh873@gmail.com. No backend server needed,
   no dashboard signup required.

   The form's action attribute in index.html already points to:
     https://formsubmit.co/ajax/pushpinder.singh873@gmail.com

   One-time step: the very first submission triggers a
   confirmation email to pushpinder.singh873@gmail.com — click the
   "Activate Form" link in that email once, and every
   submission after that is delivered automatically.

   If the destination email ever needs to change, update the
   action="..." attribute on <form id="contactForm"> in
   index.html — nothing here in app.js needs to change.
   ============================================================ */

/* ---------- vCard / QR modal ---------- */
const VCARD_DATA = "BEGIN:VCARD\nVERSION:3.0\nFN:Dr. Pushpinder Singh\nN:Singh;Pushpinder;Dr.;;\nORG:Healing Minds\nTITLE:MBBS | Clinical Psychologist | Sex Therapist\nTEL;TYPE=CELL:+918700056840\nEMAIL:pushpinder.singh873@gmail.com\nADR;TYPE=WORK:;;H.No. 10552, St. No. 5, Malout Road;Sri Muktsar Sahib;Punjab;152026;India\nEND:VCARD";

function openVcard() {
  var modal = document.getElementById('vcard-modal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  if (!document.getElementById('vcardQR').hasChildNodes()) {
    new QRCode(document.getElementById('vcardQR'), { text: VCARD_DATA, width: 160, height: 160, colorDark: '#16302E', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M });
  }
}
function closeVcard() {
  document.getElementById('vcard-modal').style.display = 'none';
  document.body.style.overflow = '';
}
document.getElementById('vcard-modal').addEventListener('click', function (e) {
  if (e.target === this) closeVcard();
});

function downloadVcard() {
  const blob = new Blob([VCARD_DATA], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Dr-Pushpinder-Singh.vcf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/* ---------- Appointment date: block past dates ---------- */
const apptDateInput = document.getElementById('appt_date');
if (apptDateInput) {
  apptDateInput.min = new Date().toISOString().split('T')[0];
}

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