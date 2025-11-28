// MUDANÇA CRÍTICA: Envolvemos todo o código no evento 'load'.
// Isso garante que o script só rode depois que TUDO na página (imagens, fontes, etc.) estiver 100% carregado.
window.addEventListener("load", () => {
  // Se as bibliotecas externas não carregarem, removemos o preloader
  // e mostramos o título principal para evitar tela totalmente preta.
  const preloader = document.getElementById("preloader");
  if (typeof gsap === "undefined") {
    if (preloader) preloader.style.display = "none";
    const fallbackTitle = document.querySelector(".hero-title");
    if (fallbackTitle) fallbackTitle.style.opacity = 1;
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // --- PRELOADER ---
  // Esta parte já estava no lugar certo, mas agora faz parte do bloco principal.
  if (preloader) {
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
  }

  // --- CURSOR CUSTOMIZADO ---
  const cursor = document.querySelector(".cursor");
  if (cursor) {
    document.addEventListener("mousemove", (e) => {
      // Usar GSAP para uma animação mais suave
      gsap.to(cursor, { duration: 0.2, x: e.clientX, y: e.clientY });
    });
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("expand"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("expand"));
    });
  }

  // --- CENA HERO THREE.JS ---
  const canvas = document.getElementById("bg-3d");
  if (canvas) {
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
    // AVISO: Certifique-se que o caminho 'models/signature-hole.glb' está correto!
    loader.load(
      "models/signature-hole.glb",
      (gltf) => {
        scene.add(gltf.scene);
        render();
      },
      undefined,
      (error) => {
        console.error("Erro ao carregar o modelo 3D do Hero:", error);
      },
    );

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
      if (title) {
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
  }

  // --- ANIMAÇÕES DO TOPO E CARTÕES ---
  const topbar = document.querySelector(".topbar");
  if (topbar) {
    ScrollTrigger.create({
      start: "top -20",
      end: 99999,
      onUpdate: (self) => {
        const opa = Math.min(1, self.progress * 2);
        topbar.style.background = `rgba(15, 15, 15, ${0.85 * opa})`;
        topbar.style.borderBottomColor = `rgba(192, 160, 98, ${0.08 * opa})`;
      },
    });
  }
  gsap.utils.toArray(".card, .slot").forEach((el) => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      },
    });
  });

  // --- ANIMAÇÕES 'O TRACADO' ---
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

  // --- ANIMAÇÃO LOTTIE ---
  const lottieContainer = document.getElementById("lottie-animation");
  if (lottieContainer) {
    const lottieAnim = lottie.loadAnimation({
      container: lottieContainer,
      renderer: "svg",
      loop: false,
      autoplay: false,
      // AVISO: Certifique-se que o caminho 'lottie/swing-animation.json' está correto!
      path: "lottie/swing-animation.json",
    });
    lottieContainer.addEventListener("mouseenter", () =>
      lottieAnim.goToAndPlay(0, true),
    );
    lottieContainer.addEventListener("mouseleave", () => lottieAnim.stop());
  }

  // --- CENA 3D INTERATIVA ---
  const canvas2 = document.getElementById("interactive-hole");
  if (canvas2) {
    const scene2 = new THREE.Scene();
    const camera2 = new THREE.PerspectiveCamera(
      45,
      canvas2.clientWidth / canvas2.clientHeight,
      0.1,
      1000,
    );
    const renderer2 = new THREE.WebGLRenderer({ canvas: canvas2, alpha: true });
    renderer2.setSize(canvas2.clientWidth, canvas2.clientHeight);
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

    const loader2 = new THREE.GLTFLoader();
    // AVISO: Certifique-se que o caminho 'models/signature-hole.glb' está correto!
    loader2.load(
      "models/signature-hole.glb",
      (gltf) => {
        scene2.add(gltf.scene.clone());
      },
      undefined,
      (error) => {
        console.error("Erro ao carregar o modelo 3D interativo:", error);
      },
    );

    function animateInteractive() {
      requestAnimationFrame(animateInteractive);
      controls.update();
      renderer2.render(scene2, camera2);
    }
    animateInteractive();
  }

  // --- ANIMAÇÃO HOVER ÍCONES FOOTER ---
  document.querySelectorAll("footer .socials a").forEach((icon) => {
    icon.addEventListener("mouseenter", () =>
      gsap.to(icon, { scale: 1.2, duration: 0.3 }),
    );
    icon.addEventListener("mouseleave", () =>
      gsap.to(icon, { scale: 1, duration: 0.3 }),
    );
  });
});
