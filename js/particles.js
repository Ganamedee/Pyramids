import * as THREE from "three";

// Create particle effects for the pyramids with improved visuals
export function setupParticles(scene, pyramids) {
  // Create a group to hold all particle systems
  const particleGroup = new THREE.Group();
  particleGroup.name = "particleEffects";
  particleGroup.visible = false; // Start with particles disabled
  scene.add(particleGroup);

  // Create particles for each major pyramid with unique colors
  createPyramidParticles(pyramids.khufu, 0xffd700, particleGroup); // Gold particles
  createPyramidParticles(pyramids.khafre, 0x7df9ff, particleGroup); // Cyan particles
  createPyramidParticles(pyramids.menkaure, 0xff9dab, particleGroup); // Pink particles

  // Add particles for the queens' pyramids (smaller systems)
  createPyramidParticles(pyramids.queens[0], 0xf0e68c, particleGroup, 0.6); // Light yellow
  createPyramidParticles(pyramids.queens[1], 0xc0c0ff, particleGroup, 0.5); // Light blue
  createPyramidParticles(pyramids.queens[2], 0xffb6c1, particleGroup, 0.4); // Light pink

  return particleGroup;
}

function createPyramidParticles(
  pyramid,
  color,
  parentGroup,
  scaleFactor = 1.0
) {
  // Get pyramid position and size from userData
  const position = pyramid.position;
  const baseLength = pyramid.userData.baseLength || 200; // Fallback value
  const height = pyramid.userData.height || 100; // Fallback value

  // Scale to match the pyramid
  const scale = (baseLength / Math.sqrt(2)) * scaleFactor; // Approximation for the pyramid's "radius"

  // Create a group for this pyramid's particles with random offset for animation
  const particleSystem = new THREE.Group();
  particleSystem.position.copy(position);
  particleSystem.userData = {
    offset: Math.random() * Math.PI * 2,
    scale: scaleFactor,
  };
  parentGroup.add(particleSystem);

  // Create particles around the pyramid - increased counts for more density
  const particleCount = Math.floor(7000 * scaleFactor);
  const particles = new THREE.BufferGeometry();

  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const alphas = new Float32Array(particleCount); // For opacity variation

  const colorObj = new THREE.Color(color);
  let vertex = new THREE.Vector3();

  for (let i = 0; i < particleCount; i++) {
    // Generate particles in pyramid shape with some randomness
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * scale;
    const heightPos = Math.random() * height;

    // Adjust radius based on height to create pyramid shape - improved curve
    const adjustedRadius = radius * Math.pow(1 - heightPos / height, 0.8);

    vertex.x = adjustedRadius * Math.cos(angle);
    vertex.z = adjustedRadius * Math.sin(angle);
    vertex.y = heightPos;

    positions[i * 3] = vertex.x;
    positions[i * 3 + 1] = vertex.y;
    positions[i * 3 + 2] = vertex.z;

    // Color with improved variation for more vibrant particles
    const shade = 0.8 + Math.random() * 0.4;
    const colorVariation = (Math.random() - 0.5) * 0.15; // Add variation to each channel

    colors[i * 3] = Math.min(
      1,
      Math.max(0, colorObj.r * shade + colorVariation)
    );
    colors[i * 3 + 1] = Math.min(
      1,
      Math.max(0, colorObj.g * shade + colorVariation)
    );
    colors[i * 3 + 2] = Math.min(
      1,
      Math.max(0, colorObj.b * shade + colorVariation)
    );

    // Random sizes with more variation for a more natural look
    sizes[i] = (2 + Math.random() * 6) * scaleFactor;

    // Random alpha values for twinkling effect
    alphas[i] = 0.3 + Math.random() * 0.7;
  }

  particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  particles.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
  particles.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));

  // Use a simpler material to avoid shader issues
  const particleMaterial = new THREE.PointsMaterial({
    size: 3,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  // Create the particle system
  const particlePoints = new THREE.Points(particles, particleMaterial);

  // Add update function with time-based animation
  particlePoints.userData = {
    update: function (elapsedTime, timeOfDay = 12) {
      // Simple animation - make particles float up and down
      const positions = particles.attributes.position.array;

      for (let i = 0; i < particleCount; i++) {
        // Get original y position (calculated based on i)
        const baseY = positions[i * 3 + 1];

        // Add floating effect
        const floatOffset = Math.sin(elapsedTime * 0.5 + i * 0.01) * 2;
        positions[i * 3 + 1] = baseY + floatOffset;
      }

      particles.attributes.position.needsUpdate = true;

      // Day/night transition effect
      const isDaytime = timeOfDay > 6 && timeOfDay < 18;
      particleMaterial.opacity = isDaytime ? 0.7 : 0.9;
    },
  };

  particleSystem.add(particlePoints);

  // Add decorative particles if this is a major pyramid
  if (scaleFactor >= 0.9) {
    addDecorativeParticles(particleSystem, color, height, scale);
  }

  return particleSystem;
}

// Add decorative particles above main pyramids
function addDecorativeParticles(particleSystem, color, height, scale) {
  const particleCount = 200;
  const geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  const colorObj = new THREE.Color(color);
  const brighterColor = new THREE.Color(color).multiplyScalar(1.5);

  // Create particles in a disc above the pyramid
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = (Math.random() * 0.5 + 0.2) * scale;

    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = height + 20 + Math.random() * 40; // Above the pyramid
    positions[i * 3 + 2] = Math.sin(angle) * radius;

    // Alternate between color and brighter color
    const useLight = Math.random() > 0.6;
    const particleColor = useLight ? brighterColor : colorObj;

    colors[i * 3] = particleColor.r;
    colors[i * 3 + 1] = particleColor.g;
    colors[i * 3 + 2] = particleColor.b;

    // Larger particles
    sizes[i] = 4 + Math.random() * 6;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  // Simple material for compatibility
  const decorativeMaterial = new THREE.PointsMaterial({
    size: 4,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const decorativeParticles = new THREE.Points(geometry, decorativeMaterial);

  // Add update function
  decorativeParticles.userData = {
    update: function (elapsedTime, timeOfDay = 12) {
      // Make particles float in a circular pattern
      const positions = geometry.attributes.position.array;

      for (let i = 0; i < particleCount; i++) {
        // Circular floating motion
        const angle = elapsedTime * 0.3 + i * 0.01;
        positions[i * 3] += Math.sin(angle) * 0.1;
        positions[i * 3 + 2] += Math.cos(angle) * 0.1;

        // Slow upward drift with reset
        positions[i * 3 + 1] += 0.05;

        // Reset particles that drift too high
        if (positions[i * 3 + 1] > height + 80) {
          positions[i * 3 + 1] = height + 20;
        }
      }

      geometry.attributes.position.needsUpdate = true;

      // Day/night effect
      decorativeMaterial.opacity = timeOfDay < 6 || timeOfDay > 18 ? 0.9 : 0.7;
    },
  };

  particleSystem.add(decorativeParticles);
}

// Create a texture for particles
function createParticleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;

  const context = canvas.getContext("2d");

  // Create radial gradient
  const gradient = context.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2
  );

  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.8)");
  gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.5)");
  gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.2)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  return texture;
}
