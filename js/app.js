const navbar = document.querySelector('.navbar');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.nav a');

function closeMenu() {
  navbar?.classList.remove('open');
  if (menuToggle) {
    menuToggle.setAttribute('aria-expanded', 'false');
  }
}

menuToggle?.addEventListener('click', () => {
  const isOpen = navbar?.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (href?.startsWith('#')) {
      event.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      closeMenu();
    }
  });
});

function handleFormSubmit(formId, successMessage) {
  const form = document.getElementById(formId);
  if (!form) return;
  const feedback = form.querySelector('.form-feedback');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (feedback) {
      feedback.textContent = successMessage;
      feedback.style.color = '#a7f0c4';
    }
    form.reset();
  });
}

handleFormSubmit('tee-form', 'Reserva enviada! Nossa concierge confirmará o horário.');
handleFormSubmit('lesson-form', 'Solicitação recebida! Entraremos em contato para agendar.');
handleFormSubmit('contato-form', 'Mensagem enviada. Retornaremos em breve.');
