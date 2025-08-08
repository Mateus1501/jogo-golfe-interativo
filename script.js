document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const sections = document.querySelectorAll('.tab-content');

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach((t) => t.classList.remove('active'));
            sections.forEach((s) => s.classList.remove('active'));

            tab.classList.add('active');
            const target = document.getElementById(tab.dataset.target);
            target.classList.add('active');
        });
    });

    const membershipForm = document.getElementById('membership-form');
    if (membershipForm) {
        membershipForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Obrigado por se associar! Em breve entraremos em contato.');
            membershipForm.reset();
        });
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Mensagem enviada! Retornaremos em breve.');
            contactForm.reset();
        });
    }
});
