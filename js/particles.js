import * as THREE from "three";

// Create particle effects for the pyramids
export function setupParticles(scene, pyramids) {
    // Create a group to hold all particle systems
    const particleGroup = new THREE.Group();
    particleGroup.name = "particleEffects";
    particleGroup.visible = false; // Start with particles disabled
    scene.add(particleGroup);
    
    // Create particles for each major pyramid - using userData stored values instead of geometry parameters
    createPyramidParticles(pyramids.khufu, 0xffd700, particleGroup); // Gold particles
    createPyramidParticles(pyramids.khafre, 0x7df9ff, particleGroup); // Blue particles
    createPyramidParticles(pyramids.menkaure, 0xffb6c1, particleGroup); // Pink particles
    
    return particleGroup;
}

function createPyramidParticles(pyramid, color, parentGroup) {
    // Get pyramid position and size from userData instead of geometry
    const position = pyramid.position;
    const baseLength = pyramid.userData.baseLength || 200; // Fallback value
    const height = pyramid.userData.height || 100; // Fallback value
    
    // Scale to match the pyramid
    const scale = baseLength / Math.sqrt(2); // Approximation for the pyramid's "radius"
    
    // Create a group for this pyramid's particles with random offset for animation
    const particleSystem = new THREE.Group();
    particleSystem.position.copy(position);
    particleSystem.userData = {
        offset: Math.random() * Math.PI * 2
    };
    parentGroup.add(particleSystem);
    
    // Create particles around the pyramid
    const particleCount = 5000;
    const particles = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const colorObj = new THREE.Color(color);
    let vertex = new THREE.Vector3();
    
    for (let i = 0; i < particleCount; i++) {
        // Generate particles in pyramid shape with some randomness
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * scale;
        const heightPos = Math.random() * height;
        
        // Adjust radius based on height to create pyramid shape
        const adjustedRadius = radius * (1 - heightPos / height);
        
        vertex.x = adjustedRadius * Math.cos(angle);
        vertex.z = adjustedRadius * Math.sin(angle);
        vertex.y = heightPos;
        
        positions[i * 3] = vertex.x;
        positions[i * 3 + 1] = vertex.y;
        positions[i * 3 + 2] = vertex.z;
        
        // Color with slight variation
        const shade = 0.8 + Math.random() * 0.2;
        colors[i * 3] = colorObj.r * shade;
        colors[i * 3 + 1] = colorObj.g * shade;
        colors[i * 3 + 2] = colorObj.b * shade;
        
        // Random sizes
        sizes[i] = 2 + Math.random() * 5;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Shader material for better-looking particles
    const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            pointTexture: { value: createParticleTexture() }
        },
        vertexShader: `
            attribute float size;
            varying vec3 vColor;
            uniform float time;
            
            void main() {
                vColor = color;
                
                // Simple animation
                vec3 pos = position;
                float yOffset = sin(time * 0.001 + position.x * 0.05 + position.z * 0.05) * 2.0;
                pos.y += yOffset;
                
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
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
        blending: THREE.AdditiveBlending,
        depthTest: true,
        transparent: true,
        vertexColors: true
    });
    
    // Create the particle system
    const particlePoints = new THREE.Points(particles, particleMaterial);
    
    // Add update function
    particlePoints.userData = {
        update: function() {
            particleMaterial.uniforms.time.value = Date.now();
        }
    };
    
    particleSystem.add(particlePoints);
}

// Create a circular particle texture for better-looking particles
function createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    
    const context = canvas.getContext('2d');
    
    // Create radial gradient
    const gradient = context.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
    );
    
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    
    return texture;
}