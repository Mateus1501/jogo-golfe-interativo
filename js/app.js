const topbar = document.querySelector('.topbar');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.main-nav a');

function closeMenu() {
  topbar?.classList.remove('open');
}

menuToggle?.addEventListener('click', () => {
  topbar?.classList.toggle('open');
});

navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href?.startsWith('#')) {
      e.preventDefault();
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

    feedback.textContent = successMessage;
    feedback.style.color = '#175235';
    form.reset();
  });
}

handleFormSubmit('tee-form', 'Reserva enviada! Nossa concierge confirmará o horário.');
handleFormSubmit('lesson-form', 'Solicitação recebida! Entraremos em contato para agendar.');
handleFormSubmit('contato-form', 'Mensagem enviada. Retornaremos em breve.');
