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

function downloadBusinessCardPDF() {
  const { jsPDF } = window.jspdf;
  // Business-card-proportioned page, landscape, in mm
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [140, 85] });

  const inkColor = [22, 48, 46];      // --ink
  const tealColor = [47, 122, 115];   // --teal
  const skyColor = [169, 203, 199];   // --sky
  const midColor = [92, 111, 109];    // --mid

  // Background
  doc.setFillColor(...inkColor);
  doc.rect(0, 0, 140, 85, 'F');

  // Spectrum accent bar (teal -> sky simplified as two blocks, jsPDF has no native gradient)
  doc.setFillColor(...tealColor);
  doc.rect(0, 0, 4, 85, 'F');
  doc.setFillColor(...skyColor);
  doc.rect(0, 78, 4, 7, 'F');

  // Practice name
  doc.setFont('times', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(...skyColor);
  doc.text('Healing Minds', 14, 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(200, 210, 208);
  doc.text('Compassion. Care. Commitment.', 14, 20.5);

  // Name
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('Dr. Pushpinder Singh', 14, 34);

  // Title
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...skyColor);
  doc.text('MBBS | Clinical Psychologist | Sex Therapist', 14, 40.5);

  // Divider line
  doc.setDrawColor(...tealColor);
  doc.setLineWidth(0.4);
  doc.line(14, 46, 126, 46);

  // Contact details
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(230, 235, 234);

  const details = [
    ['Phone', '+91 87000 56840'],
    ['Email', 'pushpinder.singh873@gmail.com'],
    ['Address', 'H.No. 10552, St. No. 5, Malout Road,'],
    ['', 'Sri Muktsar Sahib - 152026, Punjab'],
  ];

  let y = 53;
  details.forEach(([label, value]) => {
    if (label) {
      doc.setTextColor(...skyColor);
      doc.setFontSize(6.5);
      doc.text(label.toUpperCase(), 14, y);
      y += 4;
    }
    doc.setTextColor(230, 235, 234);
    doc.setFontSize(8);
    doc.text(value, 14, y);
    y += label ? 4.5 : 4.5;
  });

  doc.save('Dr-Pushpinder-Singh-Business-Card.pdf');
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