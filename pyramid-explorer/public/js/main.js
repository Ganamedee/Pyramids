import * as THREE from "three";
import { initScene, animate } from './scene.js';
import { createPyramids } from './pyramids.js';
import { setupControls } from './controls.js';
import { setupParticles } from './particles.js';
import { setupInfoPanel } from './info-panel.js';

// Particle intro animation function
function addParticleIntroAnimation(scene, camera) {
    // Create a swirl of particles coming from the sky to form the pyramids
    const introParticleCount = 5000;
    const introGeometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(introParticleCount * 3);
    const colors = new Float32Array(introParticleCount * 3);
    const sizes = new Float32Array(introParticleCount);
    
    // Define destination positions (will animate toward pyramids)
    const destinations = new Float32Array(introParticleCount * 3);
    
    // Assign random starting positions high in the sky
    for (let i = 0; i < introParticleCount; i++) {
        // Start high and scattered
        positions[i * 3] = (Math.random() - 0.5) * 2000;     // x
        positions[i * 3 + 1] = Math.random() * 1000 + 500;  // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2000; // z
        
        // Define destinations around pyramid areas
        // Group particles to target the three main pyramids
        const targetGroup = Math.random();
        
        if (targetGroup < 0.4) {
            // Great Pyramid (Khufu)
            destinations[i * 3] = 0 + (Math.random() - 0.5) * 300;
            destinations[i * 3 + 1] = Math.random() * 150;
            destinations[i * 3 + 2] = 0 + (Math.random() - 0.5) * 300;
        } else if (targetGroup < 0.7) {
            // Khafre Pyramid
            destinations[i * 3] = 400 + (Math.random() - 0.5) * 250;
            destinations[i * 3 + 1] = Math.random() * 140;
            destinations[i * 3 + 2] = 200 + (Math.random() - 0.5) * 250;
        } else {
            // Menkaure Pyramid
            destinations[i * 3] = 700 + (Math.random() - 0.5) * 150;
            destinations[i * 3 + 1] = Math.random() * 70;
            destinations[i * 3 + 2] = 400 + (Math.random() - 0.5) * 150;
        }
        
        // Random colors ranging from gold to blue
        const colorChoice = Math.random();
        if (colorChoice < 0.6) {
            // Gold/yellow
            colors[i * 3] = 0.9 + Math.random() * 0.1;
            colors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
            colors[i * 3 + 2] = 0.0 + Math.random() * 0.2;
        } else {
            // Blue/cyan
            colors[i * 3] = 0.0 + Math.random() * 0.2;
            colors[i * 3 + 1] = 0.5 + Math.random() * 0.5;
            colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
        }
        
        // Varying particle sizes
        sizes[i] = 2 + Math.random() * 3;
    }
    
    introGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    introGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    introGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const introMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    const introParticles = new THREE.Points(introGeometry, introMaterial);
    introParticles.name = "introParticles";
    scene.add(introParticles);
    
    // Animation variables
    const animationDuration = 8000; // 8 seconds
    const startTime = Date.now();
    
    // Camera animation track
    const cameraStartPosition = new THREE.Vector3().copy(camera.position);
    const cameraEndPosition = new THREE.Vector3(500, 300, 700);
    
    // Animation function
    function animateIntro() {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / animationDuration, 1.0);
        
        // Easing function for smooth animation
        const easedProgress = 1 - Math.cos((progress * Math.PI) / 2);
        
        // Update particle positions
        const positions = introGeometry.attributes.position.array;
        
        for (let i = 0; i < introParticleCount; i++) {
            positions[i * 3] = (1 - easedProgress) * positions[i * 3] + easedProgress * destinations[i * 3];
            positions[i * 3 + 1] = (1 - easedProgress) * positions[i * 3 + 1] + easedProgress * destinations[i * 3 + 1];
            positions[i * 3 + 2] = (1 - easedProgress) * positions[i * 3 + 2] + easedProgress * destinations[i * 3 + 2];
        }
        
        introGeometry.attributes.position.needsUpdate = true;
        
        // Update camera position
        camera.position.lerpVectors(cameraStartPosition, cameraEndPosition, easedProgress);
        
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
        const fadeDuration = 2000; // 2 seconds
        
        function fadeOut() {
            const now = Date.now();
            const elapsed = now - fadeStartTime;
            const progress = Math.min(elapsed / fadeDuration, 1.0);
            
            // Fade opacity
            introMaterial.opacity = 0.8 * (1 - progress);
            
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

// Add analytics for user interaction tracking
function addIntroAnimation() {
    const textureLoader = new THREE.TextureLoader();
    
    // Create an overlay
    const overlay = document.createElement('div');
    overlay.id = 'intro-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'black';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.color = 'white';
    overlay.style.zIndex = '2000';
    overlay.style.transition = 'opacity 1.5s ease-in-out';
    
    // Add a title
    const title = document.createElement('h1');
    title.textContent = 'THE GREAT PYRAMIDS OF GIZA';
    title.style.fontSize = '3rem';
    title.style.fontFamily = 'serif';
    title.style.margin = '0 0 20px 0';
    title.style.opacity = '0';
    title.style.transform = 'translateY(20px)';
    title.style.transition = 'opacity 1s ease-in-out, transform 1s ease-in-out';
    
    // Add subtitle
    const subtitle = document.createElement('h2');
    subtitle.textContent = 'EXPLORE THE MATHEMATICAL MYSTERIES';
    subtitle.style.fontSize = '1.5rem';
    subtitle.style.fontFamily = 'sans-serif';
    subtitle.style.fontWeight = 'normal';
    subtitle.style.margin = '0 0 40px 0';
    subtitle.style.opacity = '0';
    subtitle.style.transform = 'translateY(20px)';
    subtitle.style.transition = 'opacity 1s ease-in-out, transform 1s ease-in-out';
    subtitle.style.transitionDelay = '0.5s';
    
    // Add a start button
    const button = document.createElement('button');
    button.textContent = 'BEGIN EXPLORATION';
    button.style.padding = '12px 24px';
    button.style.fontSize = '1.2rem';
    button.style.backgroundColor = '#ffd700';
    button.style.color = 'black';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.opacity = '0';
    button.style.transform = 'translateY(20px)';
    button.style.transition = 'opacity 1s ease-in-out, transform 1s ease-in-out, background-color 0.3s';
    button.style.transitionDelay = '1s';
    
    button.onmouseover = () => {
        button.style.backgroundColor = '#ffea00';
    };
    
    button.onmouseout = () => {
        button.style.backgroundColor = '#ffd700';
    };
    
    // Add all elements to the overlay
    overlay.appendChild(title);
    overlay.appendChild(subtitle);
    overlay.appendChild(button);
    
    // Add overlay to the body
    document.body.appendChild(overlay);
    
    // Trigger animations after short delay
    setTimeout(() => {
        title.style.opacity = '1';
        title.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            subtitle.style.opacity = '1';
            subtitle.style.transform = 'translateY(0)';
        }, 500);
        
        setTimeout(() => {
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        }, 1000);
    }, 500);
    
    return new Promise((resolve) => {
        // When button is clicked, fade out overlay and resolve promise
        button.onclick = () => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(overlay);
                resolve(); // Resolve promise when intro animation is complete
            }, 1500);
        };
    });
}

// Load everything when the DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Get loading screen element
    const loadingScreen = document.getElementById('loading-screen');
    
    try {
        // Initialize the scene
        const { scene, camera, renderer, controls } = initScene();
        
        // Add pyramids to the scene
        const pyramids = createPyramids(scene);
        
        // Setup particles for each pyramid
        const particleSystem = setupParticles(scene, pyramids);
        
        // Setup UI controls and keyboard navigation
        setupControls(camera, renderer, particleSystem, scene);
        
        // Setup information panel with mathematical coincidences
        setupInfoPanel(pyramids);
        
        // Start animation loop
        animate(scene, camera, renderer, controls, particleSystem);
        
        // Hide loading screen when everything is ready
        setTimeout(() => {
            loadingScreen.style.opacity = 0;
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                
                // Show intro animation after loading screen disappears
                addIntroAnimation().then(() => {
                    // Start particle intro animation after the intro overlay is closed
                    addParticleIntroAnimation(scene, camera);
                    
                    // Add click instruction element to guide users
                    const clickInstruction = document.createElement('div');
                    clickInstruction.className = 'click-instruction';
                    clickInstruction.textContent = 'Click on pyramids to explore their mathematical mysteries';
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
        console.error('Error initializing the application:', error);
        loadingScreen.innerHTML = `
            <h2>Error Loading</h2>
            <p>There was a problem loading the application. Please try again.</p>
        `;
    }
});