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

  // Shader material for better-looking particles with dynamic lighting
  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      pointTexture: { value: createParticleTexture() },
      dayFactor: { value: 1.0 }, // 1.0 = day, 0.0 = night
    },
    vertexShader: `
      attribute float size;
      attribute float alpha;
      varying vec3 vColor;
      varying float vAlpha;
      uniform float time;
      uniform float dayFactor;
      
      void main() {
        vColor = color;
        vAlpha = alpha;
        
        // More complex animation with multiple frequency components
        vec3 pos = position;
        float slowWave = sin(time * 0.0005 + position.x * 0.01 + position.z * 0.01) * 2.0;
        float medWave = sin(time * 0.001 + position.x * 0.03 + position.z * 0.02) * 1.0;
        float fastWave = sin(time * 0.002 + position.x * 0.05 + position.z * 0.04) * 0.5;
        
        // Combine waves for more organic motion
        float yOffset = slowWave + medWave + fastWave;
        pos.y += yOffset;
        
        // Add subtle horizontal drift
        pos.x += sin(time * 0.0003 + position.y * 0.02) * 1.0;
        pos.z += cos(time * 0.0004 + position.y * 0.02) * 1.0;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        
        // Adjust size based on camera distance and day/night
        float sizeFactor = mix(1.5, 1.0, dayFactor); // Larger at night
        gl_PointSize = size * sizeFactor * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D pointTexture;
      uniform float dayFactor;
      varying vec3 vColor;
      varying float vAlpha;
      
      void main() {
        // Apply the particle texture
        vec4 texColor = texture2D(pointTexture, gl_PointCoord);
        
        // Custom twinkling effect based on dayFactor
        float twinkleIntensity = mix(1.2, 0.9, dayFactor); // More intense at night
        
        gl_FragColor = vec4(vColor * twinkleIntensity, vAlpha) * texColor;
        if (gl_FragColor.a < 0.1) discard;
      }
    `,
    blending: THREE.AdditiveBlending,
    depthTest: true,
    transparent: true,
    vertexColors: true,
  });

  // Create the particle system
  const particlePoints = new THREE.Points(particles, particleMaterial);

  // Add update function with time-based animation
  particlePoints.userData = {
    update: function (elapsedTime, timeOfDay = 12) {
      // Update time uniform
      particleMaterial.uniforms.time.value = elapsedTime * 1000;

      // Update day/night factor uniform based on time of day
      const isDaytime = timeOfDay > 6 && timeOfDay < 18;
      const transitionZone = 1.5; // Hours for transition

      let dayFactor = 1.0; // Default to full day

      if (timeOfDay < 6) {
        // Night before dawn
        dayFactor = 0.0;
      } else if (timeOfDay < 6 + transitionZone) {
        // Dawn transition
        dayFactor = (timeOfDay - 6) / transitionZone;
      } else if (timeOfDay >= 18 - transitionZone && timeOfDay < 18) {
        // Dusk transition
        dayFactor = (18 - timeOfDay) / transitionZone;
      } else if (timeOfDay >= 18) {
        // Night after dusk
        dayFactor = 0.0;
      }

      particleMaterial.uniforms.dayFactor.value = dayFactor;
    },
  };

  particleSystem.add(particlePoints);

  // Optional: Add special decorative particles for "floating hieroglyphs" above major pyramids
  if (scaleFactor >= 0.9) {
    addHieroglyphParticles(particleSystem, color, height, scale);
  }
}

// Add "floating hieroglyphs" effect above main pyramids
function addHieroglyphParticles(particleSystem, color, height, scale) {
  const hieroglyphCount = 200;
  const hieroglyphGeometry = new THREE.BufferGeometry();

  const positions = new Float32Array(hieroglyphCount * 3);
  const colors = new Float32Array(hieroglyphCount * 3);
  const sizes = new Float32Array(hieroglyphCount);

  const colorObj = new THREE.Color(color);
  const lighterColor = new THREE.Color(color).multiplyScalar(1.5); // Brighter version

  // Create hieroglyphs in a disc above the pyramid
  for (let i = 0; i < hieroglyphCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = (Math.random() * 0.5 + 0.2) * scale;

    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = height + 20 + Math.random() * 40; // Above the pyramid
    positions[i * 3 + 2] = Math.sin(angle) * radius;

    // Alternate between color and brighter color
    const useLight = Math.random() > 0.6;
    const glyphColor = useLight ? lighterColor : colorObj;

    colors[i * 3] = glyphColor.r;
    colors[i * 3 + 1] = glyphColor.g;
    colors[i * 3 + 2] = glyphColor.b;

    // Larger particles for hieroglyphs
    sizes[i] = 4 + Math.random() * 6;
  }

  hieroglyphGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  hieroglyphGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(colors, 3)
  );
  hieroglyphGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  // Special shader for hieroglyphs
  const hieroglyphMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      pointTexture: { value: createHieroglyphTexture() },
      dayFactor: { value: 1.0 }, // Add day factor for time-based effects
    },
    vertexShader: `
      attribute float size;
      varying vec3 vColor;
      uniform float time;
      uniform float dayFactor;
      
      void main() {
        vColor = color;
        
        // Circular floating motion
        vec3 pos = position;
        float angle = time * 0.0003 + position.y * 0.05;
        pos.x += sin(angle) * 5.0;
        pos.z += cos(angle) * 5.0;
        pos.y += sin(time * 0.0005 + position.x * 0.01) * 4.0;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        
        // Adjust size based on time of day
        float sizeMultiplier = mix(1.2, 1.0, dayFactor);
        gl_PointSize = size * sizeMultiplier * (200.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D pointTexture;
      varying vec3 vColor;
      uniform float time;
      uniform float dayFactor;
      
      void main() {
        vec4 texColor = texture2D(pointTexture, gl_PointCoord);
        
        // Pulsing effect intensified at night
        float pulse = mix(
          0.7 + 0.3 * sin(time * 0.001), // Night - more pronounced
          0.9 + 0.1 * sin(time * 0.001), // Day - subtle
          dayFactor
        );
        
        gl_FragColor = vec4(vColor * pulse, 1.0) * texColor;
        if (gl_FragColor.a < 0.3) discard;
      }
    `,
    blending: THREE.AdditiveBlending,
    depthTest: true,
    transparent: true,
    vertexColors: true,
  });

  const hieroglyphParticles = new THREE.Points(
    hieroglyphGeometry,
    hieroglyphMaterial
  );

  // Add update function that accepts time of day
  hieroglyphParticles.userData = {
    update: function (elapsedTime, timeOfDay = 12) {
      hieroglyphMaterial.uniforms.time.value = elapsedTime * 1000;

      // Calculate day factor based on time of day
      let dayFactor = 1.0;
      if (timeOfDay < 6) {
        dayFactor = 0.0; // Night
      } else if (timeOfDay < 7.5) {
        dayFactor = (timeOfDay - 6) / 1.5; // Dawn transition
      } else if (timeOfDay > 16.5 && timeOfDay < 18) {
        dayFactor = (18 - timeOfDay) / 1.5; // Dusk transition
      } else if (timeOfDay >= 18) {
        dayFactor = 0.0; // Night
      }

      hieroglyphMaterial.uniforms.dayFactor.value = dayFactor;
    },
  };

  particleSystem.add(hieroglyphParticles);
}

// Create a circular particle texture for better-looking particles
function createParticleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;

  const context = canvas.getContext("2d");

  // Create radial gradient with improved fall-off
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

// Create a hieroglyph texture
function createHieroglyphTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;

  const context = canvas.getContext("2d");

  // Create a background
  context.fillStyle = "rgba(0, 0, 0, 0)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw a simple hieroglyph shape
  context.strokeStyle = "rgba(255, 255, 255, 0.9)";
  context.lineWidth = 3;

  // Pick a random simple hieroglyph-like shape
  const shapeType = Math.floor(Math.random() * 5);

  switch (shapeType) {
    case 0: // Ankh-like symbol
      context.beginPath();
      context.moveTo(64, 30);
      context.lineTo(64, 90);
      context.stroke();

      context.beginPath();
      context.arc(64, 40, 20, 0, Math.PI, false);
      context.stroke();

      context.beginPath();
      context.moveTo(44, 40);
      context.lineTo(84, 40);
      context.stroke();
      break;

    case 1: // Eye of Horus-like
      context.beginPath();
      context.moveTo(30, 64);
      context.quadraticCurveTo(64, 40, 98, 64);
      context.quadraticCurveTo(64, 88, 30, 64);
      context.stroke();

      context.beginPath();
      context.arc(64, 64, 10, 0, Math.PI * 2);
      context.stroke();
      break;

    case 2: // Simple bird-like
      context.beginPath();
      context.moveTo(30, 64);
      context.lineTo(98, 64);
      context.stroke();

      context.beginPath();
      context.moveTo(40, 64);
      context.lineTo(40, 40);
      context.stroke();

      context.beginPath();
      context.moveTo(40, 45);
      context.lineTo(70, 45);
      context.stroke();
      break;

    case 3: // Square with lines
      context.beginPath();
      context.rect(40, 40, 48, 48);
      context.stroke();

      context.beginPath();
      context.moveTo(40, 64);
      context.lineTo(88, 64);
      context.stroke();
      break;

    case 4: // Simple cross
      context.beginPath();
      context.moveTo(64, 30);
      context.lineTo(64, 98);
      context.stroke();

      context.beginPath();
      context.moveTo(30, 64);
      context.lineTo(98, 64);
      context.stroke();
      break;
  }

  // Add a glow effect
  const glowGradient = context.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    30,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2
  );

  glowGradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
  glowGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  context.fillStyle = glowGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  return texture;
}
