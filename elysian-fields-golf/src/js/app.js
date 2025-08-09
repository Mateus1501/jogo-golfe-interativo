import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import ScrollTrigger from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import lottie from 'lottie-web';

// --- INICIALIZAÇÃO GERAL ---
document.addEventListener('DOMContentLoaded', () => {
    // Registra os plugins do GSAP
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Funções de inicialização modulares
    initPreloader();
    initCursor();
    initMenu();
    initHeroScene();
    initLottieAnimation();
    initInteractiveScene(); // Inicializa a cena interativa também
    // As animações de scroll serão chamadas ao final do preloader
});

// --- MÓDULO: PRELOADER E ENTRADA DO SITE ---
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');
    if (!preloader || !mainContent) return;

    const tl = gsap.timeline();
    tl.from('#preloader-text', { y: 80, opacity: 0, duration: 1.5, ease: 'expo.out' })
      .to(preloader, {
          opacity: 0,
          duration: 1,
          delay: 0.5,
          onComplete: () => {
              preloader.style.display = 'none';
              mainContent.style.visibility = 'visible';
              gsap.from(mainContent, { opacity: 0, duration: 1 });
              // Inicia as animações de scroll APÓS tudo estar visível
              initScrollAnimations();
          }
      });
}

// --- MÓDULO: CURSOR CUSTOMIZADO ---
function initCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;
    window.addEventListener('mousemove', e => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.2, ease: 'power2.out' });
    });
    document.querySelectorAll('a, button, #menu-toggle').forEach(el => {
        el.addEventListener('mouseenter', () => gsap.to(cursor, { scale: 2, backgroundColor: 'rgba(192, 160, 98, 0.3)', duration: 0.3 }));
        el.addEventListener('mouseleave', () => gsap.to(cursor, { scale: 1, backgroundColor: 'transparent', duration: 0.3 }));
    });
}

// --- MÓDULO: MENU DE NAVEGAÇÃO ---
function initMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!menuToggle || !navOverlay) return;

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navOverlay.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            if (menuToggle.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navOverlay.classList.remove('active');
            }
            gsap.to(window, { duration: 1.5, scrollTo: link.getAttribute('href'), ease: 'power2.inOut' });
        });
    });
}

// --- MÓDULO: ANIMAÇÃO DA CENA HERO (COM PLACEHOLDER) ---
function initHeroScene() {
    const canvas = document.getElementById('hero-canvas-3d');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // PLACEHOLDER 3D: um Icosaedro giratório. Garante que a cena funcione.
    // SUBSTITUA ESTA PARTE QUANDO TIVER SEU MODELO .GLB
    const geometry = new THREE.IcosahedronGeometry(1.5, 0);
    const material = new THREE.MeshStandardMaterial({ color: 0xC0A062, flatShading: true });
    const placeholderMesh = new THREE.Mesh(geometry, material);
    scene.add(placeholderMesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    camera.position.z = 5;

    const animate = () => {
        requestAnimationFrame(animate);
        placeholderMesh.rotation.x += 0.001;
        placeholderMesh.rotation.y += 0.001;
        renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- MÓDULO: ANIMAÇÃO LOTTIE ---
function initLottieAnimation() {
    const container = document.getElementById('lottie-animation-container');
    if (!container) return;
    lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: true,
        autoplay: true, // Deixamos autoplay para garantir que está funcionando
        path: 'https://assets5.lottiefiles.com/packages/lf20_Vpsd6M.json'
    });
}

// --- MÓDULO: CENA 3D INTERATIVA (COM PLACEHOLDER) ---
function initInteractiveScene() {
    const canvas = document.getElementById('interactive-canvas-3d');
    if (!canvas) return;
    // Semelhante ao Hero, mas com controle do mouse que será adicionado depois.
    // Por enquanto, apenas renderiza uma cena para garantir que funciona.
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const geometry = new THREE.TorusKnotGeometry(1, 0.4, 100, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
    const placeholderMesh = new THREE.Mesh(geometry, material);
    scene.add(placeholderMesh);
    
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(1, 1, 1);
    scene.add(light);
    camera.position.z = 5;

    const animate = () => {
        requestAnimationFrame(animate);
        placeholderMesh.rotation.y += 0.005;
        renderer.render(scene, camera);
    };
    animate();
}

// --- MÓDULO: ANIMAÇÕES DE SCROLL ---
function initScrollAnimations() {
    // Animação de entrada dos títulos das seções
    gsap.utils.toArray('h2, .section-content p').forEach(elem => {
        gsap.from(elem, {
            y: 50,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
                trigger: elem,
                start: 'top 90%',
            }
        });
    });

    // Animação da imagem do Clubhouse
    const clubhouseImg = document.querySelector('.clubhouse-image-wrapper img');
    if(clubhouseImg) {
        gsap.from(clubhouseImg, {
            scale: 1.2,
            scrollTrigger: {
                trigger: '.clubhouse-image-wrapper',
                scrub: true
            }
        });
    }
}
