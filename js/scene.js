import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function initScene() {
  // Get the container
  const container = document.getElementById("canvas-container");

  // Create the scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // Create fog for atmospheric effect (desert haze)
  scene.fog = new THREE.FogExp2(0xd9b38c, 0.0004); // Reduced fog density for better visibility

  // Setup camera
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    15000 // Increased far plane for larger terrain
  );
  camera.position.set(500, 300, 700);

  // Setup renderer with antialiasing and high pixel ratio for better quality
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // Add orbit controls with damping for smooth camera movement
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 100;
  controls.maxDistance = 3000; // Increased for better landscape views
  controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent camera from going below ground
  controls.target.set(350, 0, 200); // Center view on the pyramid complex

  // Add ambient light for base illumination
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);

  // Add directional light (sun) with improved shadow settings
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
  directionalLight.position.set(500, 800, 300);
  directionalLight.castShadow = true;

  // Configure shadow quality - much higher resolution for better shadows
  directionalLight.shadow.mapSize.width = 4096;
  directionalLight.shadow.mapSize.height = 4096;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 3500;
  directionalLight.shadow.camera.left = -1500;
  directionalLight.shadow.camera.right = 1500;
  directionalLight.shadow.camera.top = 1500;
  directionalLight.shadow.camera.bottom = -1500;
  directionalLight.shadow.bias = -0.0003;
  directionalLight.shadow.normalBias = 0.02;
  directionalLight.shadow.radius = 2; // Softens the shadow edges

  scene.add(directionalLight);

  // Add hemisphere light for sky/ground color gradient lighting
  const hemisphereLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 0.8);
  scene.add(hemisphereLight);

  // Add a secondary fill light to soften shadows
  const fillLight = new THREE.DirectionalLight(0xc9e6ff, 0.35); // Slightly blue for sky reflection
  fillLight.position.set(-300, 400, -500);
  scene.add(fillLight);

  // Add a warm ground bounce light
  const bounceLight = new THREE.DirectionalLight(0xffd6aa, 0.2); // Warm color for sand reflection
  bounceLight.position.set(0, -100, 0);
  scene.add(bounceLight);

  // Create skybox (environment)
  createSkybox(scene);

  // Create desert ground
  createGround(scene);

  // Create a physical sun sphere
  createSunSphere(scene);

  // Handle window resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  return { scene, camera, renderer, controls };
}

// Create a physical sun sphere that will move with the time slider
function createSunSphere(scene) {
  const sunGeometry = new THREE.SphereGeometry(120, 32, 32);
  const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffee88,
    transparent: true,
    opacity: 0.9,
  });

  const sunSphere = new THREE.Mesh(sunGeometry, sunMaterial);
  sunSphere.position.set(2000, 800, 0); // Starting position
  sunSphere.name = "sunSphere";

  // Add glow effect
  const sunGlowGeometry = new THREE.SphereGeometry(180, 32, 32);
  const sunGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffdd55,
    transparent: true,
    opacity: 0.3,
    side: THREE.BackSide,
  });

  const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
  sunSphere.add(sunGlow);

  scene.add(sunSphere);
}

function createSkybox(scene) {
  // Create a gradient sky using a large sphere with shader material
  const vertexShader = `
    varying vec3 vWorldPosition;
    void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `;

  const fragmentShader = `
    uniform vec3 topColor;
    uniform vec3 middleColor;
    uniform vec3 bottomColor;
    uniform float offset;
    uniform float exponent;
    varying vec3 vWorldPosition;
    void main() {
        float h = normalize(vWorldPosition + offset).y;
        
        // Three-zone coloring for more realistic sky
        vec3 finalColor;
        if (h > 0.5) {
            // Top zone - blend between top and middle
            float t = (h - 0.5) * 2.0;
            finalColor = mix(middleColor, topColor, pow(t, exponent));
        } else {
            // Bottom zone - blend between middle and bottom
            float t = h * 2.0;
            finalColor = mix(bottomColor, middleColor, pow(t, exponent));
        }
        
        gl_FragColor = vec4(finalColor, 1.0);
    }
    `;

  // More realistic desert sky colors
  const uniforms = {
    topColor: { value: new THREE.Color(0x0a2351) }, // Deep blue for zenith
    middleColor: { value: new THREE.Color(0x4c7bd9) }, // Mid-sky blue
    bottomColor: { value: new THREE.Color(0xf7c987) }, // Desert horizon
    offset: { value: 10 },
    exponent: { value: 0.6 },
  };

  // Create a very large sphere for the sky
  const skyGeo = new THREE.SphereGeometry(10000, 32, 32);
  const skyMat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.BackSide,
  });

  const sky = new THREE.Mesh(skyGeo, skyMat);
  sky.name = "sky";
  scene.add(sky);

  // Add stars for night sky
  createStars(scene);
}

// Add stars for night sky
function createStars(scene) {
  const starCount = 2000;
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);
  const starSizes = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    // Random position on the celestial sphere
    const theta = Math.random() * Math.PI * 2; // Azimuthal angle
    const phi = Math.acos(2 * Math.random() - 1); // Polar angle
    const radius = 9500; // Just inside the skybox

    starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = Math.abs(radius * Math.cos(phi)); // Keep stars above horizon
    starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

    // Star color (white to slightly blue/yellow)
    const colorType = Math.random();
    if (colorType < 0.7) {
      // White star
      starColors[i * 3] = 1.0;
      starColors[i * 3 + 1] = 1.0;
      starColors[i * 3 + 2] = 1.0;
    } else if (colorType < 0.85) {
      // Bluish star
      starColors[i * 3] = 0.8;
      starColors[i * 3 + 1] = 0.9;
      starColors[i * 3 + 2] = 1.0;
    } else {
      // Yellowish star
      starColors[i * 3] = 1.0;
      starColors[i * 3 + 1] = 1.0;
      starColors[i * 3 + 2] = 0.8;
    }

    // Star size - some larger for brighter stars
    starSizes[i] =
      Math.random() < 0.05 ? 5 + Math.random() * 3 : 1 + Math.random() * 2;
  }

  starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(starPositions, 3)
  );
  starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3));
  starGeometry.setAttribute("size", new THREE.BufferAttribute(starSizes, 1));

  // Create star material with custom shader for better twinkling
  const starMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      pointTexture: { value: createStarTexture() },
    },
    vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            
            void main() {
                vColor = color;
                
                // Add subtle twinkling based on position and time
                float twinkle = sin(time * 0.5 + position.x * 0.01 + position.y * 0.01 + position.z * 0.01);
                float sizeMultiplier = 0.8 + 0.2 * twinkle;
                
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * sizeMultiplier * (100.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
    fragmentShader: `
            uniform sampler2D pointTexture;
            varying vec3 vColor;
            
            void main() {
                gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
                if (gl_FragColor.a < 0.3) discard;
            }
        `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexColors: true,
  });

  const stars = new THREE.Points(starGeometry, starMaterial);
  stars.name = "stars";
  stars.visible = false; // Initially hidden during daytime

  // Add animation function to userData
  stars.userData = {
    update: function (time) {
      starMaterial.uniforms.time.value = time;
    },
  };

  scene.add(stars);
}

// Create a star texture for better-looking stars
function createStarTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;

  const context = canvas.getContext("2d");

  // Create radial gradient for star
  const gradient = context.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2
  );

  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.1, "rgba(255, 255, 255, 0.8)");
  gradient.addColorStop(0.25, "rgba(255, 255, 255, 0.5)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  return texture;
}

// Unified function to create the desert ground
function createGround(scene) {
  // Create a more detailed desert landscape
  createDesertTerrain(scene);
}

function createDesertTerrain(scene) {
  // Create a continuous desert surface with dunes
  const terrainSize = 12000; // Much larger area

  // Calculate the center of the pyramid complex - adjusted for new layout
  const centerX = 325; // Adjusted center along X
  const centerZ = 215; // Adjusted center along Z

  // Define the plateau radius where the pyramids will be placed
  const plateauRadius = 1100; // Increased radius to ensure all pyramids are well within it
  const plateauHeight = 0; // Height of the flat plateau

  // Create multiple overlapping particle systems for dense coverage
  const layerCount = 4; // Additional layer for more depth

  for (let layer = 0; layer < layerCount; layer++) {
    const particlesPerLayer = layer === 0 ? 180000 : 100000; // More particles for better density
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesPerLayer * 3);
    const colors = new Float32Array(particlesPerLayer * 3);
    const sizes = new Float32Array(particlesPerLayer);

    // Improved sand colors - more natural desert palette
    const sandColors = [
      new THREE.Color(0xd2b48c), // Classic sand
      new THREE.Color(0xc19a6b), // Darker sand
      new THREE.Color(0xe6c39f), // Lighter sand
      new THREE.Color(0xb38867), // Brown sand
      new THREE.Color(0xdbc5a9), // Light beige
      new THREE.Color(0xb7956b), // Taupe
    ];

    // Create a coherent noise field for dune heights
    // Using multiple sine waves as a simple alternative to Perlin noise
    const noiseScale = 0.0008 + layer * 0.0004;
    const noiseScale2 = 0.0015 - layer * 0.0004;

    for (let i = 0; i < particlesPerLayer; i++) {
      // Random position across the terrain
      let x, z;

      // Distribution strategy depends on layer
      if (layer === 0) {
        // Base layer - uniform distribution with higher density near center
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.pow(Math.random(), 0.5) * terrainSize * 0.5;
        x = Math.cos(angle) * distance + centerX;
        z = Math.sin(angle) * distance + centerZ;
      } else {
        // Outer layers - focus on adding detail to dunes
        x = (Math.random() - 0.5) * terrainSize + centerX;
        z = (Math.random() - 0.5) * terrainSize + centerZ;

        // Focus more particles in the mid to outer regions
        const distFromCenter = Math.sqrt(
          (x - centerX) * (x - centerX) + (z - centerZ) * (z - centerZ)
        );
        if (distFromCenter < plateauRadius * 0.8 && Math.random() < 0.75) {
          // Regenerate position to focus on mid to outer areas
          const angle = Math.random() * Math.PI * 2;
          const distance =
            plateauRadius * 0.8 +
            Math.random() * (terrainSize * 0.5 - plateauRadius * 0.8);
          x = Math.cos(angle) * distance + centerX;
          z = Math.sin(angle) * distance + centerZ;
        }
      }

      // Calculate distance from pyramid complex center
      const distanceFromCenter = Math.sqrt(
        (x - centerX) * (x - centerX) + (z - centerZ) * (z - centerZ)
      );

      // Calculate height based on distance from center
      let height;

      if (distanceFromCenter < plateauRadius) {
        // Inside the plateau - slightly undulating rather than perfectly flat
        const flatness = 1.0 - distanceFromCenter / plateauRadius; // More flat at center
        const microdunes =
          Math.sin(x * 0.05 + z * 0.07) * 0.6 +
          Math.sin(x * 0.03 - z * 0.02) * 0.4;

        height = plateauHeight + microdunes * (1.0 - flatness * 0.8);

        // Add very subtle noise for natural look
        height += (Math.random() - 0.5) * 1.0;
      } else {
        // Outside the plateau - create more varied dunes
        // Calculate height based on multiple overlapping sine waves for natural dunes
        const nx = x * noiseScale;
        const nz = z * noiseScale;
        const nx2 = x * noiseScale2;
        const nz2 = z * noiseScale2;

        // Create a smooth transition from plateau to dunes
        const transitionZone = 250; // Width of transition zone
        const transitionFactor = Math.min(
          1.0,
          (distanceFromCenter - plateauRadius) / transitionZone
        );

        // Calculate dune height using multiple frequencies
        const duneHeight =
          Math.sin(nx * 1.0 + nz * 1.3) * 25 +
          Math.sin(nx * 2.3 + nz * 0.7) * 15 +
          Math.sin(nx * 0.5 + nz * 0.9 + layer) * 20 +
          Math.sin(nx2 * 3.7 + nz2 * 2.2) * 8; // Higher frequency detail

        // Apply smooth transition from plateau to full dunes
        height = plateauHeight + duneHeight * transitionFactor;

        // Add larger dunes in the distance
        if (distanceFromCenter > plateauRadius + 1000) {
          // Add larger dunes in the distance with improved variety
          height +=
            (Math.sin(nx2 * 3.0 + nz2 * 2.7) * 40 +
              Math.sin(nx * 0.8 - nz * 1.2) * 30) *
            Math.min(1, (distanceFromCenter - (plateauRadius + 1000)) / 2000);
        }

        // Add small-scale variation
        height += (Math.random() - 0.5) * 5;
      }

      // Store position
      positions[i * 3] = x;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = z;

      // Color based on height and position
      const colorIndex = Math.floor(Math.random() * sandColors.length);
      const baseColor = sandColors[colorIndex];

      // Sand gets lighter at dune peaks and darker in troughs - more pronounced effect
      const heightFactor = Math.max(0, Math.min(1, (height + 30) / 60));
      const brightnessVariation = 0.68 + heightFactor * 0.64;

      colors[i * 3] = baseColor.r * brightnessVariation;
      colors[i * 3 + 1] = baseColor.g * brightnessVariation;
      colors[i * 3 + 2] = baseColor.b * brightnessVariation;

      // Size varies by layer and distance
      const sizeByDistance =
        1.0 - Math.min(0.4, distanceFromCenter / terrainSize);
      const layerSizeFactor = layer === 0 ? 1.0 : 1.1 - layer * 0.15;
      const baseSize = 3.8 * layerSizeFactor;
      sizes[i] = baseSize * sizeByDistance * (0.9 + Math.random() * 0.2);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: layer === 0 ? 3.8 : 4.2 - layer * 0.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      sizeAttenuation: true,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(geometry, material);
    particleSystem.name = `desertLayer_${layer}`;

    // Make the system receiveShadow-compatible (for directional light shadows)
    particleSystem.receiveShadow = true;

    scene.add(particleSystem);
  }

  // Add a subtle edge transition between plateau and dunes
  addPlateauEdge(scene, plateauRadius, plateauHeight, centerX, centerZ);

  // Add distant horizon dunes (enhanced for better visuals)
  addHorizonDunes(scene, terrainSize, centerX, centerZ);

  // Add a solid ground plane for shadow casting
  addShadowCatcher(scene, plateauRadius, centerX, centerZ);
}

// Add a shadow-catching ground plane
function addShadowCatcher(scene, plateauRadius, centerX, centerZ) {
  const groundSize = plateauRadius * 2.5;
  const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
  groundGeometry.rotateX(-Math.PI / 2);

  const groundMaterial = new THREE.ShadowMaterial({
    opacity: 0.5, // Higher opacity for stronger shadows
    color: 0x000000,
  });

  const groundPlane = new THREE.Mesh(groundGeometry, groundMaterial);
  groundPlane.receiveShadow = true;
  groundPlane.position.set(centerX, -0.1, centerZ); // Slightly below ground level
  groundPlane.name = "shadowCatcher";

  scene.add(groundPlane);
}

// Add a subtle edge to the plateau for a more natural transition
function addPlateauEdge(scene, plateauRadius, plateauHeight, centerX, centerZ) {
  const edgeParticleCount = 40000; // Increased for better detail
  const edgeGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(edgeParticleCount * 3);
  const colors = new Float32Array(edgeParticleCount * 3);
  const sizes = new Float32Array(edgeParticleCount);

  // Edge color - slightly darker than regular sand
  const edgeColor = new THREE.Color(0xb8a179);

  // Create particles around the edge of the plateau
  for (let i = 0; i < edgeParticleCount; i++) {
    // Position particles in a ring around the plateau edge
    const angle = Math.random() * Math.PI * 2;

    // Concentrate particles near the edge with improved distribution
    const distance = plateauRadius + (Math.random() - 0.5) * 70;

    positions[i * 3] = Math.cos(angle) * distance + centerX;

    // Variable height based on how close to edge - smoother transition
    const edgeFactor = Math.abs(distance - plateauRadius) / 35;
    const sineVariation = Math.sin(angle * 8) * 2; // Slight variation around edge
    positions[i * 3 + 1] =
      plateauHeight -
      edgeFactor * 2.8 +
      sineVariation * 0.4 +
      (Math.random() - 0.5) * 1.8;

    positions[i * 3 + 2] = Math.sin(angle) * distance + centerZ;

    // Color with slight variation for more natural look
    const shade = 0.8 + Math.random() * 0.3;
    colors[i * 3] = edgeColor.r * shade;
    colors[i * 3 + 1] = edgeColor.g * shade;
    colors[i * 3 + 2] = edgeColor.b * shade;

    // Size varies to create more detail at edge
    sizes[i] = 2 + Math.random() * 2.5;
  }

  edgeGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  edgeGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  edgeGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const edgeMaterial = new THREE.PointsMaterial({
    size: 2.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    sizeAttenuation: true,
    depthWrite: false,
  });

  const edgeParticles = new THREE.Points(edgeGeometry, edgeMaterial);
  edgeParticles.name = "plateauEdge";
  scene.add(edgeParticles);
}

function addHorizonDunes(scene, terrainSize, centerX, centerZ) {
  // Create a ring of distant dunes to close the horizon
  const horizonGeometry = new THREE.BufferGeometry();
  const horizonParticleCount = 40000; // Increased for better detail
  const positions = new Float32Array(horizonParticleCount * 3);
  const colors = new Float32Array(horizonParticleCount * 3);
  const sizes = new Float32Array(horizonParticleCount);

  const horizonColor = new THREE.Color(0xd6c4a0); // Slightly lighter for distance haze
  const horizonRadius = terrainSize * 0.6;

  for (let i = 0; i < horizonParticleCount; i++) {
    // Position particles in a ring around the scene
    const angle = Math.random() * Math.PI * 2;
    const radiusVariation = Math.random() * 800 - 400; // Greater variation for more natural horizon
    const radius = horizonRadius + radiusVariation;

    positions[i * 3] = Math.cos(angle) * radius + centerX;

    // Create rolling dunes for the horizon - more pronounced
    const segmentAngle = Math.floor(angle / (Math.PI / 12)) * (Math.PI / 12);
    const duneHeight =
      Math.sin(segmentAngle * 12) * 150 +
      Math.sin(segmentAngle * 6) * 80 +
      Math.random() * 60;
    positions[i * 3 + 1] = duneHeight;

    positions[i * 3 + 2] = Math.sin(angle) * radius + centerZ;

    // Add atmospheric perspective - lighter color for distant objects
    const haze = 0.3 + Math.random() * 0.2;
    colors[i * 3] = horizonColor.r * haze;
    colors[i * 3 + 1] = horizonColor.g * haze;
    colors[i * 3 + 2] = horizonColor.b * haze;

    // Larger particles for better visibility at distance
    sizes[i] = 6 + Math.random() * 5;
  }

  horizonGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  horizonGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  horizonGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const horizonMaterial = new THREE.PointsMaterial({
    size: 7,
    vertexColors: true,
    transparent: true,
    opacity: 0.7, // Less opaque for distance effect
    sizeAttenuation: true,
    depthWrite: false,
  });

  const horizonParticles = new THREE.Points(horizonGeometry, horizonMaterial);
  horizonParticles.name = "horizonDunes";
  scene.add(horizonParticles);
}

export function animate(scene, camera, renderer, controls, particleSystems) {
  // Track time for various animations
  let clock = new THREE.Clock();
  let elapsedTime = 0;

  function loop() {
    requestAnimationFrame(loop);

    // Update time
    const delta = clock.getDelta();
    elapsedTime += delta;

    // Update controls
    controls.update();

    // Update particle systems if active
    if (particleSystems && particleSystems.visible) {
      particleSystems.rotation.y += 0.0008; // Slightly slower rotation

      // Update each particle group
      for (const system of particleSystems.children) {
        // Simulate floating effect
        system.position.y =
          Math.sin(elapsedTime * 0.8 + system.userData.offset) * 4;

        // Update particles
        if (system.userData.update) {
          system.userData.update(elapsedTime);
        }
      }
    }

    // Update stars if they exist
    const stars = scene.getObjectByName("stars");
    if (stars && stars.userData.update) {
      stars.userData.update(elapsedTime);
    }

    // Animate interactive indicators
    scene.traverseVisible((object) => {
      if (object.userData && object.userData.isInteractive) {
        // Animate the indicator if it exists
        if (object.userData.interactiveIndicator) {
          const indicator = object.userData.interactiveIndicator;

          // Pulse effect
          indicator.userData.pulseTime += 0.04 * indicator.userData.pulseSpeed;
          const scale = 0.85 + Math.sin(indicator.userData.pulseTime) * 0.15;
          indicator.scale.set(scale, scale, scale);

          // Also make it glow/change color
          const r = 0.0;
          const g = 0.5 + Math.sin(indicator.userData.pulseTime) * 0.5;
          const b = 0.5 + Math.cos(indicator.userData.pulseTime * 0.7) * 0.5;
          indicator.material.color.setRGB(r, g, b);

          // Make the text label bob up and down
          if (object.userData.interactiveSprite) {
            const sprite = object.userData.interactiveSprite;
            sprite.position.y =
              object.userData.interactiveIndicator.position.y +
              30 +
              Math.sin(elapsedTime * 2) * 4;
          }
        }
      }
    });

    // Render the scene
    renderer.render(scene, camera);
  }

  // Start animation loop
  loop();
}
