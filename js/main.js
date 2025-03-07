// Debug info - add this to the top of your main.js file temporarily
console.log("main.js loading with module type:", typeof import.meta);
// Add this at the top of your main.js file
if (typeof window !== "undefined" && typeof require === "undefined") {
  window.require = () => {
    console.warn("require() is not available in browser environments");
    return {};
  };
}
import * as THREE from "three";
import { initScene, animate } from "./scene.js";
import { createPyramids } from "./pyramids.js";
import { setupControls } from "./controls.js";
import { setupParticles } from "./particles.js";
import { setupInfoPanel } from "./info-panel.js";

// Particle intro animation function with enhanced particles
function addParticleIntroAnimation(scene, camera) {
  // Create a swirl of particles coming from the sky to form the pyramids
  const introParticleCount = 7000; // Increased particle count
  const introGeometry = new THREE.BufferGeometry();

  const positions = new Float32Array(introParticleCount * 3);
  const colors = new Float32Array(introParticleCount * 3);
  const sizes = new Float32Array(introParticleCount);

  // Define destination positions (will animate toward pyramids)
  const destinations = new Float32Array(introParticleCount * 3);

  // Assign random starting positions high in the sky
  for (let i = 0; i < introParticleCount; i++) {
    // Start high and scattered
    positions[i * 3] = (Math.random() - 0.5) * 2500; // x - wider spread
    positions[i * 3 + 1] = Math.random() * 1200 + 600; // y - higher start
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2500; // z - wider spread

    // Define destinations around pyramid areas with more accurate layout
    const targetGroup = Math.random();

    if (targetGroup < 0.4) {
      // Great Pyramid (Khufu)
      destinations[i * 3] = 0 + (Math.random() - 0.5) * 300;
      destinations[i * 3 + 1] = Math.random() * 150;
      destinations[i * 3 + 2] = 0 + (Math.random() - 0.5) * 300;
    } else if (targetGroup < 0.7) {
      // Khafre Pyramid
      destinations[i * 3] = 375 + (Math.random() - 0.5) * 250;
      destinations[i * 3 + 1] = Math.random() * 140;
      destinations[i * 3 + 2] = 250 + (Math.random() - 0.5) * 250;
    } else if (targetGroup < 0.9) {
      // Menkaure Pyramid
      destinations[i * 3] = 650 + (Math.random() - 0.5) * 150;
      destinations[i * 3 + 1] = Math.random() * 70;
      destinations[i * 3 + 2] = 425 + (Math.random() - 0.5) * 150;
    } else {
      // Queens' Pyramids
      destinations[i * 3] = 175 + (Math.random() - 0.5) * 200;
      destinations[i * 3 + 1] = Math.random() * 50;
      destinations[i * 3 + 2] = 165 + (Math.random() - 0.5) * 100;
    }

    // Enhanced color palette for particles
    const colorChoice = Math.random();
    if (colorChoice < 0.5) {
      // Gold/yellow
      colors[i * 3] = 0.9 + Math.random() * 0.1;
      colors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
      colors[i * 3 + 2] = 0.0 + Math.random() * 0.2;
    } else if (colorChoice < 0.75) {
      // Blue/cyan
      colors[i * 3] = 0.0 + Math.random() * 0.2;
      colors[i * 3 + 1] = 0.5 + Math.random() * 0.5;
      colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
    } else if (colorChoice < 0.9) {
      // Red/orange
      colors[i * 3] = 0.8 + Math.random() * 0.2;
      colors[i * 3 + 1] = 0.3 + Math.random() * 0.4;
      colors[i * 3 + 2] = 0.0 + Math.random() * 0.2;
    } else {
      // Pure white/silver
      const brightness = 0.8 + Math.random() * 0.2;
      colors[i * 3] = brightness;
      colors[i * 3 + 1] = brightness;
      colors[i * 3 + 2] = brightness;
    }

    // Varying particle sizes
    sizes[i] = 2 + Math.random() * 4;
  }

  introGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  introGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  introGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  // Enhanced material with better transparency and glow
  const introMaterial = new THREE.PointsMaterial({
    size: 3,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const introParticles = new THREE.Points(introGeometry, introMaterial);
  introParticles.name = "introParticles";
  scene.add(introParticles);

  // Animation variables
  const animationDuration = 9000; // Longer animation (9 seconds)
  const startTime = Date.now();

  // Camera animation track
  const cameraStartPosition = new THREE.Vector3().copy(camera.position);
  const cameraEndPosition = new THREE.Vector3(500, 300, 700);

  // Animation function with improved easing
  function animateIntro() {
    const now = Date.now();
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / animationDuration, 1.0);

    // Improved easing function for smoother animation
    const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out

    // Update particle positions with swirling effect
    const positions = introGeometry.attributes.position.array;

    for (let i = 0; i < introParticleCount; i++) {
      // Add swirling motion
      const swirl = 0.2 * Math.sin(progress * Math.PI * 2 + i * 0.01);

      // Calculate current position with swirl effect
      positions[i * 3] =
        (1 - easedProgress) * positions[i * 3] +
        easedProgress * destinations[i * 3] +
        swirl * Math.sin(i);

      positions[i * 3 + 1] =
        (1 - easedProgress) * positions[i * 3 + 1] +
        easedProgress * destinations[i * 3 + 1] +
        swirl * Math.cos(i);

      positions[i * 3 + 2] =
        (1 - easedProgress) * positions[i * 3 + 2] +
        easedProgress * destinations[i * 3 + 2] +
        swirl * Math.sin(i * 0.5);
    }

    introGeometry.attributes.position.needsUpdate = true;

    // Update camera position with improved path
    const cameraProgress = Math.min(elapsed / (animationDuration * 0.8), 1.0); // Camera arrives earlier
    const cameraEase = 1 - Math.pow(1 - cameraProgress, 2); // Quadratic ease-out

    // Add slight circular motion to camera path
    const circularMotion = 1 - cameraEase; // More at start, less at end
    const cameraX =
      THREE.MathUtils.lerp(
        cameraStartPosition.x,
        cameraEndPosition.x,
        cameraEase
      ) +
      Math.sin(cameraProgress * Math.PI * 2) * 100 * circularMotion;

    const cameraY =
      THREE.MathUtils.lerp(
        cameraStartPosition.y,
        cameraEndPosition.y,
        cameraEase
      ) +
      Math.sin(cameraProgress * Math.PI * 3) * 50 * circularMotion;

    const cameraZ =
      THREE.MathUtils.lerp(
        cameraStartPosition.z,
        cameraEndPosition.z,
        cameraEase
      ) +
      Math.cos(cameraProgress * Math.PI * 2) * 100 * circularMotion;

    camera.position.set(cameraX, cameraY, cameraZ);

    // Look at the center of the pyramid complex
    camera.lookAt(new THREE.Vector3(325, 0, 215));

    // Continue animation if not complete
    if (progress < 1.0) {
      requestAnimationFrame(animateIntro);
    } else {
      // Animation is complete, fade out and remove intro particles
      fadeOutIntroParticles();
    }
  }

  function fadeOutIntroParticles() {
    const fadeStartTime = Date.now();
    const fadeDuration = 2500; // 2.5 seconds

    function fadeOut() {
      const now = Date.now();
      const elapsed = now - fadeStartTime;
      const progress = Math.min(elapsed / fadeDuration, 1.0);

      // Fade opacity with easing
      const easedProgress = 1 - Math.pow(1 - progress, 2);
      introMaterial.opacity = 0.85 * (1 - easedProgress);

      // Make particles slowly drift upward as they fade
      const positions = introGeometry.attributes.position.array;
      for (let i = 0; i < introParticleCount; i++) {
        positions[i * 3 + 1] += 0.2; // Drift upward
      }
      introGeometry.attributes.position.needsUpdate = true;

      if (progress < 1.0) {
        requestAnimationFrame(fadeOut);
      } else {
        // Remove intro particles when fully faded
        scene.remove(introParticles);
      }
    }

    fadeOut();
  }

  // Start animation
  animateIntro();
}

// Enhanced intro animation
function addIntroAnimation() {
  // Create an overlay
  const overlay = document.createElement("div");
  overlay.id = "intro-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "black";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.color = "white";
  overlay.style.zIndex = "2000";
  overlay.style.transition = "opacity 1.5s ease-in-out";
  overlay.style.backgroundImage =
    "radial-gradient(circle at center, #110e0a 0%, #000000 100%)";

  // Add a title with enhanced styling
  const title = document.createElement("h1");
  title.textContent = "THE GREAT PYRAMIDS OF GIZA";
  title.style.fontSize = "3.5rem";
  title.style.fontFamily = "Georgia, serif";
  title.style.margin = "0 0 20px 0";
  title.style.opacity = "0";
  title.style.transform = "translateY(20px)";
  title.style.transition = "opacity 1s ease-in-out, transform 1s ease-in-out";
  title.style.textShadow = "0 0 15px rgba(255, 215, 0, 0.7)";
  title.style.letterSpacing = "3px";
  title.style.textAlign = "center";

  // Add subtitle
  const subtitle = document.createElement("h2");
  subtitle.textContent = "EXPLORE THE MATHEMATICAL MYSTERIES";
  subtitle.style.fontSize = "1.6rem";
  subtitle.style.fontFamily = "Arial, sans-serif";
  subtitle.style.fontWeight = "normal";
  subtitle.style.margin = "0 0 40px 0";
  subtitle.style.opacity = "0";
  subtitle.style.transform = "translateY(20px)";
  subtitle.style.transition =
    "opacity 1s ease-in-out, transform 1s ease-in-out";
  subtitle.style.transitionDelay = "0.5s";
  subtitle.style.color = "#e6c590";
  subtitle.style.letterSpacing = "2px";
  subtitle.style.textAlign = "center";

  // Add a quote
  const quote = document.createElement("p");
  quote.textContent = '"Man fears time, but time fears the pyramids."';
  quote.style.fontStyle = "italic";
  quote.style.fontSize = "1.2rem";
  quote.style.margin = "0 0 50px 0";
  quote.style.opacity = "0";
  quote.style.transition = "opacity 1s ease-in-out";
  quote.style.transitionDelay = "0.8s";
  quote.style.color = "#d0d0d0";
  quote.style.textAlign = "center";

  // Add a start button with improved styling
  const button = document.createElement("button");
  button.textContent = "BEGIN EXPLORATION";
  button.style.padding = "15px 30px";
  button.style.fontSize = "1.2rem";
  button.style.backgroundColor = "rgba(255, 215, 0, 0.8)";
  button.style.color = "#000";
  button.style.border = "2px solid #ffd700";
  button.style.borderRadius = "6px";
  button.style.cursor = "pointer";
  button.style.opacity = "0";
  button.style.transform = "translateY(20px)";
  button.style.transition =
    "opacity 1s ease-in-out, transform 1s ease-in-out, background-color 0.3s";
  button.style.transitionDelay = "1.2s";
  button.style.fontWeight = "bold";
  button.style.letterSpacing = "1px";
  button.style.boxShadow = "0 0 20px rgba(255, 215, 0, 0.4)";
  button.style.fontFamily = "Arial, sans-serif";

  button.onmouseover = () => {
    button.style.backgroundColor = "rgba(255, 235, 0, 0.9)";
    button.style.boxShadow = "0 0 30px rgba(255, 215, 0, 0.6)";
  };

  button.onmouseout = () => {
    button.style.backgroundColor = "rgba(255, 215, 0, 0.8)";
    button.style.boxShadow = "0 0 20px rgba(255, 215, 0, 0.4)";
  };

  // Add decorative Egyptian symbols
  const symbolContainer = document.createElement("div");
  symbolContainer.style.display = "flex";
  symbolContainer.style.justifyContent = "center";
  symbolContainer.style.margin = "0 0 40px 0";
  symbolContainer.style.opacity = "0";
  symbolContainer.style.transition = "opacity 1.5s ease-in-out";
  symbolContainer.style.transitionDelay = "1.5s";

  const symbols = ["☥", "𓂀", "𓆣", "𓄿", "𓅓"];
  symbols.forEach((symbol) => {
    const span = document.createElement("span");
    span.textContent = symbol;
    span.style.fontSize = "3rem";
    span.style.margin = "0 20px";
    span.style.color = "#ffd700";
    span.style.textShadow = "0 0 10px rgba(255, 215, 0, 0.5)";
    symbolContainer.appendChild(span);
  });

  // Add all elements to the overlay
  overlay.appendChild(symbolContainer);
  overlay.appendChild(title);
  overlay.appendChild(subtitle);
  overlay.appendChild(quote);
  overlay.appendChild(button);

  // Add overlay to the body
  document.body.appendChild(overlay);

  // Trigger animations after short delay
  setTimeout(() => {
    symbolContainer.style.opacity = "1";

    setTimeout(() => {
      title.style.opacity = "1";
      title.style.transform = "translateY(0)";
    }, 300);

    setTimeout(() => {
      subtitle.style.opacity = "1";
      subtitle.style.transform = "translateY(0)";
    }, 800);

    setTimeout(() => {
      quote.style.opacity = "1";
    }, 1100);

    setTimeout(() => {
      button.style.opacity = "1";
      button.style.transform = "translateY(0)";
    }, 1500);
  }, 500);

  return new Promise((resolve) => {
    // When button is clicked, fade out overlay and resolve promise
    button.onclick = () => {
      overlay.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(overlay);
        resolve(); // Resolve promise when intro animation is complete
      }, 1500);
    };
  });
}

// Initialize all scene components and UI - separated to ensure proper loading order
async function initializeApplication() {
  try {
    // Initialize the scene
    const { scene, camera, renderer, controls } = initScene();

    // Add pyramids to the scene with improved layout
    const pyramids = createPyramids(scene);

    // Setup particles for each pyramid
    const particleSystem = setupParticles(scene, pyramids);

    // Setup information panel with mathematical coincidences and interior details
    setupInfoPanel(pyramids);

    // Setup UI controls and keyboard navigation - with delayed lighting initialization
    setupControls(camera, renderer, particleSystem, scene);

    // Start animation loop
    animate(scene, camera, renderer, controls, particleSystem);

    return { scene, camera, particleSystem };
  } catch (error) {
    console.error("Error initializing the application:", error);
    throw error;
  }
}

// Load everything when the DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  // Get loading screen element
  const loadingScreen = document.getElementById("loading-screen");

  try {
    // Initialize the application
    const { scene, camera, particleSystem } = await initializeApplication();

    // Hide loading screen when everything is ready
    setTimeout(() => {
      loadingScreen.style.opacity = 0;
      setTimeout(() => {
        loadingScreen.style.display = "none";

        // Show intro animation after loading screen disappears
        addIntroAnimation().then(() => {
          // Start particle intro animation after the intro overlay is closed
          addParticleIntroAnimation(scene, camera);

          // Add click instruction element to guide users
          const clickInstruction = document.createElement("div");
          clickInstruction.className = "click-instruction";
          clickInstruction.textContent =
            "Click on pyramids to explore their mathematical mysteries";
          document.body.appendChild(clickInstruction);

          // Remove instruction after 10 seconds
          setTimeout(() => {
            clickInstruction.style.opacity = 0;
            setTimeout(() => {
              document.body.removeChild(clickInstruction);
            }, 1000);
          }, 10000);
        });
      }, 1000);
    }, 1500);
  } catch (error) {
    console.error("Error initializing the application:", error);
    loadingScreen.innerHTML = `
      <h2>Error Loading</h2>
      <p>There was a problem loading the application. Please try again.</p>
    `;
  }
});
