import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function initScene() {
    // Get the container
    const container = document.getElementById('canvas-container');
    
    // Create the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    // Create fog for atmospheric effect (desert haze)
    scene.fog = new THREE.FogExp2(0xd9b38c, 0.0005); // Reduced fog density for better visibility
    
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
        powerPreference: "high-performance" 
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
    
    // Add directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(500, 300, 0);
    directionalLight.castShadow = true;
    
    // Configure shadow quality
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 2000;
    directionalLight.shadow.camera.left = -1000;
    directionalLight.shadow.camera.right = 1000;
    directionalLight.shadow.camera.top = 1000;
    directionalLight.shadow.camera.bottom = -1000;
    directionalLight.shadow.bias = -0.0005;
    
    scene.add(directionalLight);
    
    // Add hemisphere light for sky/ground color gradient lighting
    const hemisphereLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 0.8);
    scene.add(hemisphereLight);
    
    // Create skybox (environment)
    createSkybox(scene);
    
    // Create desert ground
    createGround(scene);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
    
    return { scene, camera, renderer, controls };
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
    uniform vec3 bottomColor;
    uniform float offset;
    uniform float exponent;
    varying vec3 vWorldPosition;
    void main() {
        float h = normalize(vWorldPosition + offset).y;
        gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
    }
    `;
    
    // More desert-appropriate sky colors
    const uniforms = {
        "topColor": { value: new THREE.Color(0x1a3c86) }, // Deep blue
        "bottomColor": { value: new THREE.Color(0xf0b470) }, // Desert horizon (more orange)
        "offset": { value: 10 },
        "exponent": { value: 0.6 }
    };
    
    // Create a very large sphere for the sky
    const skyGeo = new THREE.SphereGeometry(10000, 32, 32);
    const skyMat = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.BackSide
    });
    
    const sky = new THREE.Mesh(skyGeo, skyMat);
    sky.name = "sky";
    scene.add(sky);
}

// Unified function to create the desert ground
function createGround(scene) {
    // Create a unified desert landscape
    createDesertTerrain(scene);
}

function createDesertTerrain(scene) {
    // Create a continuous desert surface with dunes
    const terrainSize = 12000; // Much larger area
    
    // Calculate the center of the pyramid complex
    // Khufu is at (0,0,0), Khafre at (400,0,200), and Menkaure at (700,0,400)
    const centerX = 350; // Approximate center along X
    const centerZ = 200; // Approximate center along Z
    
    // Define the plateau radius where the pyramids will be placed
    const plateauRadius = 1000; // Increased radius to ensure all pyramids are well within it
    const plateauHeight = 0; // Height of the flat plateau
    
    // Create multiple overlapping particle systems for dense coverage
    const layerCount = 3; // Multiple layers for depth
    
    for (let layer = 0; layer < layerCount; layer++) {
        const particlesPerLayer = layer === 0 ? 150000 : 80000; // More particles in base layer
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particlesPerLayer * 3);
        const colors = new Float32Array(particlesPerLayer * 3);
        const sizes = new Float32Array(particlesPerLayer);
        
        // Sand colors - warm desert tones
        const sandColors = [
            new THREE.Color(0xd2b48c), // Classic sand
            new THREE.Color(0xc19a6b), // Darker sand
            new THREE.Color(0xe6c39f), // Lighter sand
            new THREE.Color(0xb38867)  // Brown sand
        ];
        
        // Create a coherent noise field for dune heights
        // Using multiple sine waves as a simple alternative to Perlin noise
        const noiseScale = 0.001 + layer * 0.0005; // Different scale per layer
        const noiseScale2 = 0.002 - layer * 0.0005;
        
        for (let i = 0; i < particlesPerLayer; i++) {
            // Random position across the terrain
            let x, z;
            
            // Distribution strategy depends on layer
            if (layer === 0) {
                // Base layer - uniform distribution with higher density near center
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.pow(Math.random(), 0.5) * terrainSize * 0.5; // Higher concentration near center
                x = Math.cos(angle) * distance + centerX;
                z = Math.sin(angle) * distance + centerZ;
            } else {
                // Outer layers - focus on adding detail to dunes
                x = (Math.random() - 0.5) * terrainSize + centerX;
                z = (Math.random() - 0.5) * terrainSize + centerZ;
                
                // Focus more particles in the outer regions to fill gaps
                const distFromCenter = Math.sqrt((x - centerX)*(x - centerX) + (z - centerZ)*(z - centerZ));
                if (distFromCenter < plateauRadius && Math.random() < 0.7) {
                    // Regenerate position to focus on outer areas
                    const angle = Math.random() * Math.PI * 2;
                    const distance = plateauRadius + Math.random() * (terrainSize * 0.5 - plateauRadius);
                    x = Math.cos(angle) * distance + centerX;
                    z = Math.sin(angle) * distance + centerZ;
                }
            }
            
            // Calculate distance from pyramid complex center
            const distanceFromCenter = Math.sqrt((x - centerX)*(x - centerX) + (z - centerZ)*(z - centerZ));
            
            // Calculate height based on distance from center
            let height;
            
            if (distanceFromCenter < plateauRadius) {
                // Inside the plateau - completely flat
                height = plateauHeight;
                
                // Add very subtle noise to the plateau for natural look
                // But keep it very small to maintain flatness
                height += (Math.random() - 0.5) * 1.5;
            } 
            else {
                // Outside the plateau - create dunes
                // Calculate height based on multiple overlapping sine waves for natural dunes
                const nx = x * noiseScale;
                const nz = z * noiseScale;
                const nx2 = x * noiseScale2;
                const nz2 = z * noiseScale2;
                
                // Create a smooth transition from plateau to dunes
                const transitionZone = 200; // Width of transition zone
                const transitionFactor = Math.min(1.0, (distanceFromCenter - plateauRadius) / transitionZone);
                
                // Calculate dune height using multiple frequencies
                const duneHeight = 
                    Math.sin(nx * 1.0 + nz * 1.3) * 25 + 
                    Math.sin(nx * 2.3 + nz * 0.7) * 15 + 
                    Math.sin(nx * 0.5 + nz * 0.9 + layer) * 20;
                
                // Apply smooth transition from plateau to full dunes
                height = plateauHeight + duneHeight * transitionFactor;
                
                // Add larger dunes in the distance
                if (distanceFromCenter > plateauRadius + 1000) {
                    // Add larger dunes in the distance
                    height += Math.sin(nx2 * 3.0 + nz2 * 2.7) * 40 * 
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
            
            // Sand gets lighter at dune peaks and darker in troughs
            const heightFactor = Math.max(0, Math.min(1, (height + 30) / 60));
            const brightnessVariation = 0.7 + heightFactor * 0.5;
            
            colors[i * 3] = baseColor.r * brightnessVariation;
            colors[i * 3 + 1] = baseColor.g * brightnessVariation;
            colors[i * 3 + 2] = baseColor.b * brightnessVariation;
            
            // Size varies by layer and distance
            const sizeByDistance = 1.0 - Math.min(0.4, distanceFromCenter / terrainSize);
            const baseSize = layer === 0 ? 4 : 5;
            sizes[i] = baseSize * sizeByDistance + Math.random() * 2;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: layer === 0 ? 4 : 5,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            sizeAttenuation: true,
            depthWrite: false
        });
        
        const particleSystem = new THREE.Points(geometry, material);
        particleSystem.name = `desertLayer_${layer}`;
        scene.add(particleSystem);
    }
    
    // Add a subtle edge transition between plateau and dunes
    addPlateauEdge(scene, plateauRadius, plateauHeight, centerX, centerZ);
    
    // Add distant horizon dunes (simplified, just for visual completeness)
    addHorizonDunes(scene, terrainSize, centerX, centerZ);
}

// Add a subtle edge to the plateau for a more natural transition
function addPlateauEdge(scene, plateauRadius, plateauHeight, centerX, centerZ) {
    const edgeParticleCount = 30000;
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
        
        // Concentrate particles near the edge
        const distance = plateauRadius + (Math.random() - 0.5) * 60;
        
        positions[i * 3] = Math.cos(angle) * distance + centerX;
        
        // Variable height based on how close to edge
        const edgeFactor = Math.abs(distance - plateauRadius) / 30;
        positions[i * 3 + 1] = plateauHeight - edgeFactor * 3 + (Math.random() - 0.5) * 2;
        
        positions[i * 3 + 2] = Math.sin(angle) * distance + centerZ;
        
        // Color with slight variation
        const shade = 0.8 + Math.random() * 0.3;
        colors[i * 3] = edgeColor.r * shade;
        colors[i * 3 + 1] = edgeColor.g * shade;
        colors[i * 3 + 2] = edgeColor.b * shade;
        
        // Size varies to create more detail at edge
        sizes[i] = 2 + Math.random() * 3;
    }
    
    edgeGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    edgeGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    edgeGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const edgeMaterial = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        sizeAttenuation: true,
        depthWrite: false
    });
    
    const edgeParticles = new THREE.Points(edgeGeometry, edgeMaterial);
    edgeParticles.name = "plateauEdge";
    scene.add(edgeParticles);
}

function addHorizonDunes(scene, terrainSize, centerX, centerZ) {
    // Create a ring of distant dunes to close the horizon
    const horizonGeometry = new THREE.BufferGeometry();
    const horizonParticleCount = 30000;
    const positions = new Float32Array(horizonParticleCount * 3);
    const colors = new Float32Array(horizonParticleCount * 3);
    const sizes = new Float32Array(horizonParticleCount);
    
    const horizonColor = new THREE.Color(0xd6c4a0); // Slightly lighter for distance haze
    const horizonRadius = terrainSize * 0.6;
    
    for (let i = 0; i < horizonParticleCount; i++) {
        // Position particles in a ring around the scene
        const angle = Math.random() * Math.PI * 2;
        const radiusVariation = Math.random() * 600 - 300;
        const radius = horizonRadius + radiusVariation;
        
        positions[i * 3] = Math.cos(angle) * radius + centerX;
        
        // Create rolling dunes for the horizon
        const segmentAngle = Math.floor(angle / (Math.PI / 8)) * (Math.PI / 8);
        const duneHeight = Math.sin(segmentAngle * 8) * 100 + Math.random() * 50;
        positions[i * 3 + 1] = duneHeight;
        
        positions[i * 3 + 2] = Math.sin(angle) * radius + centerZ;
        
        // Add atmospheric perspective - lighter color for distant objects
        const haze = 0.3 + Math.random() * 0.2;
        colors[i * 3] = horizonColor.r * haze;
        colors[i * 3 + 1] = horizonColor.g * haze;  
        colors[i * 3 + 2] = horizonColor.b * haze;
        
        // Larger particles for better visibility at distance
        sizes[i] = 6 + Math.random() * 4;
    }
    
    horizonGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    horizonGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    horizonGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const horizonMaterial = new THREE.PointsMaterial({
        size: 7,
        vertexColors: true,
        transparent: true,
        opacity: 0.7, // Less opaque for distance effect
        sizeAttenuation: true,
        depthWrite: false
    });
    
    const horizonParticles = new THREE.Points(horizonGeometry, horizonMaterial);
    horizonParticles.name = "horizonDunes";
    scene.add(horizonParticles);
}

// Simplified environment function since we're handling terrain separately
function createEnvironment(scene) {
    // Empty implementation - all landscape elements are handled by createDesertTerrain
}

export function animate(scene, camera, renderer, controls, particleSystems) {
    function loop() {
        requestAnimationFrame(loop);
        
        // Update controls
        controls.update();
        
        // Update particle systems if active
        if (particleSystems && particleSystems.visible) {
            particleSystems.rotation.y += 0.001;
            
            // Update each particle group
            for (const system of particleSystems.children) {
                // Simulate floating effect
                system.position.y = Math.sin(Date.now() * 0.001 + system.userData.offset) * 5;
                
                // Update particles
                if (system.userData.update) {
                    system.userData.update();
                }
            }
        }
        
        // Animate interactive indicators
        scene.traverseVisible(object => {
            if (object.userData && object.userData.isInteractive) {
                // Animate the indicator if it exists
                if (object.userData.interactiveIndicator) {
                    const indicator = object.userData.interactiveIndicator;
                    
                    // Pulse effect
                    indicator.userData.pulseTime += 0.05 * indicator.userData.pulseSpeed;
                    const scale = 0.8 + Math.sin(indicator.userData.pulseTime) * 0.2;
                    indicator.scale.set(scale, scale, scale);
                    
                    // Also make it glow/change color
                    const r = 0.0;
                    const g = 0.5 + Math.sin(indicator.userData.pulseTime) * 0.5;
                    const b = 0.5 + Math.cos(indicator.userData.pulseTime * 0.7) * 0.5;
                    indicator.material.color.setRGB(r, g, b);
                    
                    // Make the text label bob up and down
                    if (object.userData.interactiveSprite) {
                        const sprite = object.userData.interactiveSprite;
                        sprite.position.y = object.userData.interactiveIndicator.position.y + 30 + Math.sin(Date.now() * 0.002) * 5;
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