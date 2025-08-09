import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollTo from 'gsap/ScrollToPlugin';
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

const mainContent = document.querySelector('#main-content');

/* --- INÍCIO DA SUBSTITUIÇÃO: LÓGICA DO MENU --- */
const menuToggle = document.querySelector('.menu-toggle');
const navOverlay = document.querySelector('.nav-overlay');
const navLinks = gsap.utils.toArray('.nav-link'); // Converte para um array GSAP

menuToggle.addEventListener('click', () => {
    const isActive = menuToggle.classList.toggle('active');
    navOverlay.classList.toggle('active', isActive);

    if (isActive) {
        // Animação de entrada dos links
        gsap.to(navLinks, {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power3.out',
            delay: 0.4 // Espera a transição do overlay começar
        });
    } else {
        // Esconde os links imediatamente ao fechar
        gsap.set(navLinks, { opacity: 0, y: 30 });
    }
});

// Fecha o menu e rola suavemente ao clicar em um link
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        menuToggle.classList.remove('active');
        navOverlay.classList.remove('active');
        gsap.set(navLinks, { opacity: 0, y: 30 });

        const targetId = link.getAttribute('href');
        gsap.to(window, {
            duration: 1.5,
            scrollTo: targetId,
            ease: 'power2.inOut'
        });
    });
});

// Adiciona o plugin ScrollTo ao GSAP
gsap.registerPlugin(ScrollTo);
/* --- FIM DA SUBSTITUIÇÃO: LÓGICA DO MENU --- */

/* --- INÍCIO DA SUBSTITUIÇÃO: ANIMAÇÃO DE ENTRADA --- */
const tlPreloader = gsap.timeline({
    onComplete: () => {
        document.querySelector('#preloader').style.display = 'none';
        
        // Sequência de entrada do site principal
        const tlIntro = gsap.timeline();
        tlIntro
            .to(mainContent, { opacity: 1, duration: 0.1 })
            .from('.menu-toggle', { y: -100, opacity: 0, duration: 1, ease: 'power3.out' })
            .add(animateHero); // Inicia a animação do HERO
    }
});

tlPreloader
    .from('#preloader-text', { y: 100, opacity: 0, duration: 1.5, ease: 'expo.out' })
    .to('#preloader', { opacity: 0, duration: 1, delay: 0.5 });

// O main-content começa invisível para uma transição suave
gsap.set(mainContent, { opacity: 0 });
/* --- FIM DA SUBSTITUIÇÃO: ANIMAÇÃO DE ENTRADA --- */

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

    // Efeito de revelação e "zoom out" para a imagem do clubhouse
    gsap.fromTo(".clubhouse-image img", 
        { scale: 1.4 }, 
        {
            scale: 1,
            scrollTrigger: {
                trigger: "#clubhouse",
                start: "top 80%",
                end: "bottom top",
                scrub: true
            }
        }
    );
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
