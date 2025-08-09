import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import lottie from 'lottie-web';

// Registrar o plugin ScrollTrigger do GSAP
gsap.registerPlugin(ScrollTrigger);

// --- LÓGICA DO CURSOR ---
const cursor = document.querySelector('.cursor');
window.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.2,
        ease: 'power2.out'
    });
});
document.querySelectorAll('a, button, .menu-toggle').forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursor, {
            width: 50,
            height: 50,
            backgroundColor: 'rgba(192, 160, 98, 0.3)',
            borderWidth: '0px',
            duration: 0.3
        });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursor, {
            width: 25,
            height: 25,
            backgroundColor: 'transparent',
            borderWidth: '1px',
            duration: 0.3
        });
    });
});

// --- LÓGICA DO MENU DE NAVEGAÇÃO ---
const menuToggle = document.querySelector('.menu-toggle');
const navOverlay = document.querySelector('.nav-overlay');
const navLinks = document.querySelectorAll('.nav-link');
const mainContent = document.querySelector('#main-content');

let menuOpen = false;
const tlMenu = gsap.timeline({ paused: true });

tlMenu.to(navOverlay, {
    transform: 'translateY(0)',
    duration: 0.8,
    ease: 'expo.inOut'
}).to(navLinks, {
    opacity: 1,
    y: 0,
    stagger: 0.1,
    duration: 0.5,
    ease: 'power2.out'
}, "-=0.5");

menuToggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    menuToggle.classList.toggle('active');
    
    if (menuOpen) {
        tlMenu.play();
    } else {
        tlMenu.reverse();
    }
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuOpen = false;
        menuToggle.classList.remove('active');
        tlMenu.reverse();
        // Lógica de smooth scroll
        const target = document.querySelector(link.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// --- ANIMAÇÃO DO PRELOADER ---
const preloaderText = document.querySelector('#preloader-text');
const tlPreloader = gsap.timeline();
tlPreloader.from(preloaderText, {
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: 'expo.out'
}).to('#preloader', {
    opacity: 0,
    duration: 1,
    onComplete: () => {
        document.querySelector('#preloader').style.display = 'none';
        // Inicia a animação do HERO somente após o preloader
        animateHero();
    }
});

// --- ANIMAÇÕES CONTROLADAS POR SCROLL (SCROLLTRIGGER) ---
function initScrollAnimations() {
    // Animação de desenho da linha SVG
    gsap.to("#tracado-svg path", {
        strokeDashoffset: 0,
        scrollTrigger: {
            trigger: "#o-tracado",
            start: "top center",
            end: "bottom center",
            scrub: true,
        },
    });

    // Fade in genérico para seções
    document.querySelectorAll('section').forEach(section => {
        gsap.from(section.querySelectorAll('h2, p, button'), {
            opacity: 0,
            y: 50,
            stagger: 0.2,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
            }
        });
    });
}

// --- ANIMAÇÃO LOTTIE ---
lottie.loadAnimation({
    container: document.getElementById('lottie-animation'),
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: 'https://assets5.lottiefiles.com/packages/lf20_Vpsd6M.json' // URL de um placeholder de animação de swing
});

document.querySelector('.column-lottie').addEventListener('mouseenter', () => {
    lottie.play();
});
document.querySelector('.column-lottie').addEventListener('mouseleave', () => {
    lottie.stop();
});

// --- ANIMAÇÃO THREE.JS (HERO) ---
let camera, scene, renderer;
let heroAnimationStarted = false;

function initHero3D() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg-3d'), antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Carregador de Textura e Fundo
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
        'https://images.unsplash.com/photo-1500932382259-518b829622d1?q=80&w=2072&auto=format&fit=crop',
        () => {
            const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
            rt.fromEquirectangularTexture(renderer, texture);
            scene.background = rt.texture;
        }
    );
    
    camera.position.z = 5;
}

function animateHero() {
    if(heroAnimationStarted) return;
    heroAnimationStarted = true;

    // Timeline de animação da câmera e texto
    const tlHero = gsap.timeline();
    tlHero.from(camera.position, {
        z: 15,
        y: 2,
        duration: 3,
        ease: 'power3.inOut'
    }).from('#hero-title', {
        opacity: 0,
        y: 50,
        duration: 1.5,
        ease: 'power3.out'
    }, "-=1");

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
    initScrollAnimations(); // Inicia as animações de scroll depois que o hero está pronto
}

initHero3D(); // Inicia a cena 3D, mas a animação espera o preloader

// Lida com o redimensionamento da janela
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
