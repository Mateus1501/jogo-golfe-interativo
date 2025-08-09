gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  const word = preloader.querySelector("h1");
  const letters = word.textContent.split("");
  word.innerHTML = letters
    .map((l) => `<span class="letter">${l}</span>`)
    .join("");
  gsap.from("#preloader .letter", {
    y: 50,
    opacity: 0,
    stagger: 0.05,
    duration: 0.6,
    ease: "power2.out",
  });
  gsap.to("#preloader", {
    delay: letters.length * 0.05 + 1,
    opacity: 0,
    pointerEvents: "none",
    duration: 0.5,
    onComplete: () => (preloader.style.display = "none"),
  });
});

// Custom cursor
const cursor = document.querySelector(".cursor");
document.addEventListener("mousemove", (e) => {
  cursor.style.top = `${e.clientY}px`;
  cursor.style.left = `${e.clientX}px`;
});
document.querySelectorAll("a, button").forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("expand"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("expand"));
});

// Hero Three.js scene
const canvas = document.getElementById("bg-3d");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 60, 120);
const ambient = new THREE.AmbientLight(0xc0a062, 1);
scene.add(ambient);
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(50, 50, 0);
scene.add(dirLight);

const loader = new THREE.GLTFLoader();
loader.load("models/signature-hole.glb", (gltf) => {
  scene.add(gltf.scene);
  render();
});

function render() {
  renderer.render(scene, camera);
}

gsap
  .timeline({ onUpdate: render })
  .to(camera.position, {
    x: 0,
    y: 30,
    z: 80,
    duration: 3,
    ease: "power1.inOut",
  })
  .to(camera.position, {
    x: 20,
    y: 20,
    z: 40,
    duration: 4,
    ease: "power1.inOut",
  })
  .call(showHeroTitle);

function showHeroTitle() {
  const title = document.querySelector(".hero-title");
  const chars = title.textContent.split("");
  title.innerHTML = chars.map((c) => `<span class="char">${c}</span>`).join("");
  gsap.from("#hero .char", {
    opacity: 0,
    y: 20,
    stagger: 0.05,
    duration: 0.4,
    ease: "power2.out",
  });
}

gsap.to(camera.position, {
  z: 30,
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "bottom top",
    scrub: true,
  },
  onUpdate: render,
});

// O Tracado animations
gsap.to("#tracado-path", {
  strokeDashoffset: 0,
  scrollTrigger: {
    trigger: "#o-tracado",
    start: "top 80%",
    end: "bottom 60%",
    scrub: true,
  },
});

gsap.to("#o-tracado .marker", {
  opacity: 1,
  scrollTrigger: {
    trigger: "#o-tracado",
    start: "top 80%",
  },
  stagger: 0.2,
});

// Lottie animation
const lottieAnim = lottie.loadAnimation({
  container: document.getElementById("lottie-animation"),
  renderer: "svg",
  loop: false,
  autoplay: false,
  path: "lottie/swing-animation.json",
});
const lottieContainer = document.getElementById("lottie-animation");
lottieContainer.addEventListener("mouseenter", () =>
  lottieAnim.goToAndPlay(0, true),
);
lottieContainer.addEventListener("mouseleave", () => lottieAnim.stop());

// Interactive 3D
const canvas2 = document.getElementById("interactive-hole");
const scene2 = new THREE.Scene();
const camera2 = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer2 = new THREE.WebGLRenderer({ canvas: canvas2, alpha: true });
renderer2.setSize(window.innerWidth, window.innerHeight);
camera2.position.set(0, 40, 80);
const controls = new THREE.OrbitControls(camera2, renderer2.domElement);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 20;
controls.maxDistance = 120;
const ambient2 = new THREE.AmbientLight(0xffffff, 1);
scene2.add(ambient2);
const dirLight2 = new THREE.DirectionalLight(0xffffff, 1);
dirLight2.position.set(0, 50, 50);
scene2.add(dirLight2);
loader.load("models/signature-hole.glb", (gltf) => {
  scene2.add(gltf.scene.clone());
});
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer2.render(scene2, camera2);
}
animate();

// Footer icons hover
document.querySelectorAll("footer .socials a").forEach((icon) => {
  icon.addEventListener("mouseenter", () =>
    gsap.to(icon, { scale: 1.2, duration: 0.3 }),
  );
  icon.addEventListener("mouseleave", () =>
    gsap.to(icon, { scale: 1, duration: 0.3 }),
  );
});
