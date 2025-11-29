import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import ScrollTrigger from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import lottie from 'lottie-web';

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  initPreloader();
  initThemeToggle();
  initMenu();
  initSmoothScroll();
  initHeroScene();
  initInteractiveScene();
  initLottieHeroAccent();
  initTeeTimeForm();
  initTournamentFilters();
  initShopCatalog();
  initLessonForm();
  initContactForm();
  initScrollAnimations();
});

function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.fromTo('.preloader-mark', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 })
    .fromTo('.preloader-text', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')
    .to(preloader, {
      opacity: 0,
      duration: 0.8,
      delay: 0.6,
      onComplete: () => preloader.remove(),
    });
}

function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  const body = document.body;
  if (!toggle) return;

  const savedTheme = localStorage.getItem('ef-theme');
  if (savedTheme) body.dataset.theme = savedTheme;
  updateThemeLabel();

  toggle.addEventListener('click', () => {
    body.dataset.theme = body.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('ef-theme', body.dataset.theme);
    updateThemeLabel();
  });

  function updateThemeLabel() {
    toggle.textContent = body.dataset.theme === 'dark' ? 'Modo claro' : 'Modo escuro';
  }
}

function initMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navOverlay = document.getElementById('nav-overlay');
  if (!menuToggle || !navOverlay) return;

  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    navOverlay.classList.toggle('open');
  });

  navOverlay.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      navOverlay.classList.remove('open');
    });
  });

  window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 32);
  });
}

function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      gsap.to(window, { duration: 1, scrollTo: target.offsetTop - 60, ease: 'power2.out' });
    });
  });
}

function initHeroScene() {
  const canvas = document.getElementById('hero-canvas-3d');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const geometry = new THREE.IcosahedronGeometry(1.2, 0);
  const material = new THREE.MeshStandardMaterial({ color: 0xc5a059, flatShading: true, metalness: 0.4, roughness: 0.2 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const light = new THREE.PointLight(0xffffff, 1.2);
  light.position.set(3, 4, 5);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));

  camera.position.z = 4;

  const animate = () => {
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.003;
    mesh.rotation.y += 0.003;
    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });
}

function initInteractiveScene() {
  const canvas = document.getElementById('interactive-canvas-3d');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const geometry = new THREE.TorusKnotGeometry(1, 0.3, 120, 16);
  const material = new THREE.MeshPhysicalMaterial({ color: 0x2b9d8f, roughness: 0.2, metalness: 0.6 });
  const knot = new THREE.Mesh(geometry, material);
  scene.add(knot);

  const directional = new THREE.DirectionalLight(0xffffff, 1.5);
  directional.position.set(2, 3, 4);
  scene.add(directional);
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));

  camera.position.z = 4.5;

  const animate = () => {
    requestAnimationFrame(animate);
    knot.rotation.x += 0.003;
    knot.rotation.y += 0.002;
    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });
}

function initLottieHeroAccent() {
  const container = document.getElementById('lottie-animation-container');
  if (!container) return;

  lottie.loadAnimation({
    container,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json',
  });
}

function initTeeTimeForm() {
  const form = document.getElementById('tee-time-form');
  const dateInput = document.getElementById('tee-date');
  const playersInput = document.getElementById('players');
  if (!form || !dateInput || !playersInput) return;

  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const feedback = form.querySelector('.form-feedback');
    feedback.className = 'form-feedback';

    if (dateInput.value < today) {
      feedback.textContent = 'Escolha uma data futura para o tee time.';
      feedback.classList.add('error');
      return;
    }

    const players = Number(playersInput.value);
    if (players < 1 || players > 4 || Number.isNaN(players)) {
      feedback.textContent = 'Indique entre 1 e 4 jogadores por horário.';
      feedback.classList.add('error');
      return;
    }

    feedback.textContent = 'Pedido recebido. Confirmaremos em até 10 minutos via concierge.';
    feedback.classList.add('success');
    form.reset();
    dateInput.min = today;
  });
}

function initTournamentFilters() {
  const list = document.getElementById('tournament-list');
  const chips = document.querySelectorAll('[data-filter]');
  const skeletons = document.getElementById('tournament-skeletons');
  const empty = document.getElementById('tournament-empty');
  if (!list || !chips.length) return;

  const tournaments = [
    { name: 'Elysian Classic', date: '2025-03-12', type: 'pro', status: 'upcoming', format: 'Stroke Play 54 buracos', fee: 'R$ 1.500', rules: 'USGA local rules', cta: 'Aplicar vaga' },
    { name: 'Sunset Stableford', date: '2025-02-18', type: 'amador', status: 'upcoming', format: 'Stableford 18 buracos', fee: 'R$ 450', rules: 'Shotgun, pace 4h10', cta: 'Reservar saída' },
    { name: 'Corporate Scramble', date: '2024-12-08', type: 'amador', status: 'past', format: 'Scramble equipes', fee: 'Sob consulta', rules: 'Equipes mistas', cta: 'Fale com eventos' },
    { name: 'Match Play Masters', date: '2024-11-02', type: 'pro', status: 'past', format: 'Match Play', fee: 'R$ 900', rules: 'Handicap index', cta: 'Resultados' },
  ];

  setTimeout(() => skeletons?.remove(), 600);
  render('upcoming');

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.dataset.filter;
      render(filter);
    });
  });

  function render(filter) {
    list.innerHTML = '';
    const filtered = tournaments.filter((item) => {
      if (filter === 'upcoming') return item.status === 'upcoming';
      if (filter === 'past') return item.status === 'past';
      return item.type === filter;
    });

    if (!filtered.length) {
      empty.hidden = false;
      return;
    }

    empty.hidden = true;
    filtered.forEach((tournament) => {
      const article = document.createElement('article');
      article.className = 'card';
      article.innerHTML = `
        <p class="eyebrow">${formatDate(tournament.date)}</p>
        <h3>${tournament.name}</h3>
        <p>${tournament.format}</p>
        <p class="helper">${tournament.rules}</p>
        <div class="mini-metrics">
          <span><strong>${tournament.fee}</strong> inscrição</span>
          <span><strong>${tournament.type === 'pro' ? 'Profissional' : 'Amador'}</strong></span>
        </div>
        <button class="btn btn-primary">${tournament.cta}</button>
      `;
      list.appendChild(article);
    });
  }
}

function initShopCatalog() {
  const grid = document.getElementById('shop-grid');
  const chips = document.querySelectorAll('[data-shop]');
  const skeletons = document.getElementById('shop-skeletons');
  const empty = document.getElementById('shop-empty');
  if (!grid || !chips.length) return;

  const items = [
    { name: 'Driver Artisan 460', category: 'tacos', price: 'R$ 4.200', note: 'Fitting incluso', tag: 'Premium' },
    { name: 'Bolas Tour Soft', category: 'bolas', price: 'R$ 320', note: '12 unidades', tag: 'Controle' },
    { name: 'Polo Tech Dry', category: 'roupas', price: 'R$ 540', note: 'UV 50+, corte italiano', tag: 'Lifestyle' },
    { name: 'Maleta de viagem travelcover', category: 'acessorios', price: 'R$ 890', note: 'Proteção reforçada', tag: 'Viagem' },
    { name: 'Putter milled', category: 'tacos', price: 'R$ 3.100', note: 'Custom neck', tag: 'Tour' },
  ];

  setTimeout(() => skeletons?.remove(), 600);
  render('todos');

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      render(chip.dataset.shop || 'todos');
    });
  });

  function render(filter) {
    grid.innerHTML = '';
    const filtered = filter === 'todos' ? items : items.filter((item) => item.category === filter);

    if (!filtered.length) {
      empty.hidden = false;
      return;
    }

    empty.hidden = true;
    filtered.forEach((item) => {
      const article = document.createElement('article');
      article.className = 'card';
      article.innerHTML = `
        <p class="eyebrow">${capitalize(item.category)}</p>
        <h3>${item.name}</h3>
        <p>${item.note}</p>
        <div class="mini-metrics"><span><strong>${item.price}</strong></span><span class="tag">${item.tag}</span></div>
        <div class="cta-group">
          <button class="btn btn-primary">Solicitar orçamento</button>
          <button class="btn btn-ghost">Falar com a loja</button>
        </div>
      `;
      grid.appendChild(article);
    });
  }
}

function initLessonForm() {
  const form = document.getElementById('form-aulas');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const feedback = form.querySelector('.form-feedback');
    feedback.className = 'form-feedback';
    if (!form.reportValidity()) {
      feedback.textContent = 'Complete os campos obrigatórios.';
      feedback.classList.add('error');
      return;
    }
    feedback.textContent = 'Recebido. Nossa academy retornará com agenda e proposta.';
    feedback.classList.add('success');
    form.reset();
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const feedback = form.querySelector('.form-feedback');
    feedback.className = 'form-feedback';
    if (!form.reportValidity()) {
      feedback.textContent = 'Revise os campos obrigatórios.';
      feedback.classList.add('error');
      return;
    }
    feedback.textContent = 'Mensagem enviada. Concierge retornará em até 2 horas úteis.';
    feedback.classList.add('success');
    form.reset();
  });
}

function initScrollAnimations() {
  const elements = document.querySelectorAll('.section, .card, .hero-overlay-card');
  elements.forEach((el) => {
    gsap.from(el, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
