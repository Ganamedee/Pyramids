import * as THREE from "three";

// Set up UI controls and interaction
export function setupControls(camera, renderer, particleSystem, scene) {
    // Get UI elements
    const toggleInfoBtn = document.getElementById('toggle-info');
    const closeInfoBtn = document.getElementById('close-info');
    const infoPanel = document.getElementById('info-panel');
    const toggleParticlesBtn = document.getElementById('toggle-particles');
    const timeSlider = document.getElementById('time-slider');
    
    // Toggle information panel
    toggleInfoBtn.addEventListener('click', () => {
        infoPanel.classList.toggle('visible');
    });
    
    // Close information panel
    closeInfoBtn.addEventListener('click', () => {
        infoPanel.classList.remove('visible');
    });
    
    // Toggle particle effects
    toggleParticlesBtn.addEventListener('click', () => {
        particleSystem.visible = !particleSystem.visible;
        toggleParticlesBtn.textContent = particleSystem.visible ? 
            'Hide Particles' : 'Show Particles';
    });
    
    // Time of day slider (controls lighting)
    timeSlider.addEventListener('input', (e) => {
        updateLighting(scene, parseFloat(e.target.value));
    });
    
    // Initialize lighting with default time (noon)
    updateLighting(scene, 12);
    
    // Set up raycasting for object selection
    setupRaycasting(camera, renderer.domElement, scene);
    
    // Add keyboard controls
    setupKeyboardControls(camera, particleSystem);
}

// Update scene lighting based on time of day
function updateLighting(scene, timeOfDay) {
    // Find the directional light (sun)
    const sunLight = scene.children.find(child => 
        child instanceof THREE.DirectionalLight);
    
    if (!sunLight) return;
    
    // Calculate sun position based on time (0-24 hours)
    // Convert to radians: 0h = sunset, 6h = midnight, 12h = sunrise, 18h = noon
    const angle = ((timeOfDay - 6) / 24) * Math.PI * 2;
    
    // Update sun position
    const radius = 1000;
    sunLight.position.x = Math.cos(angle) * radius;
    sunLight.position.y = Math.sin(angle) * radius;
    
    // Update light intensity based on time
    // Highest at noon, lowest at midnight
    const baseIntensity = Math.max(0.05, Math.sin(angle)); // Min 0.05 for slight night lighting
    sunLight.intensity = baseIntensity * 2;
    
    // Update ambient light
    const ambientLight = scene.children.find(child => 
        child instanceof THREE.AmbientLight);
    
    if (ambientLight) {
        ambientLight.intensity = 0.2 + baseIntensity * 0.3;
    }
    
    // Update sky color based on time of day
    const sky = scene.children.find(child => child.name === "sky");
    if (sky && sky.material && sky.material.uniforms) {
        // Morning: blue to orange
        // Noon: deep blue
        // Evening: orange to dark blue
        // Night: dark blue to black
        
        let topColor, bottomColor;
        
        if (timeOfDay >= 5 && timeOfDay <= 8) {
            // Morning
            const t = (timeOfDay - 5) / 3;
            topColor = new THREE.Color(0x1e3877);
            bottomColor = new THREE.Color().lerpColors(
                new THREE.Color(0xff7e00),
                new THREE.Color(0x87ceeb),
                t
            );
        } else if (timeOfDay > 8 && timeOfDay <= 16) {
            // Day
            topColor = new THREE.Color(0x1e3877);
            bottomColor = new THREE.Color(0x87ceeb);
        } else if (timeOfDay > 16 && timeOfDay <= 19) {
            // Evening
            const t = (timeOfDay - 16) / 3;
            topColor = new THREE.Color(0x1e3877);
            bottomColor = new THREE.Color().lerpColors(
                new THREE.Color(0x87ceeb),
                new THREE.Color(0xff7e00),
                t
            );
        } else {
            // Night
            const isLateNight = (timeOfDay >= 0 && timeOfDay < 5) || (timeOfDay > 21);
            const darkness = isLateNight ? 0.9 : 0.5;
            topColor = new THREE.Color(0x000000);
            bottomColor = new THREE.Color(0x0a1a3f).multiplyScalar(1 - darkness);
        }
        
        sky.material.uniforms.topColor.value = topColor;
        sky.material.uniforms.bottomColor.value = bottomColor;
    }
    
    // Update fog color based on time
    if (scene.fog) {
        if (timeOfDay >= 6 && timeOfDay <= 18) {
            // Daytime fog color
            scene.fog.color = new THREE.Color(0xd9b38c);
        } else {
            // Nighttime fog color
            scene.fog.color = new THREE.Color(0x0a1a3f);
        }
    }
}

// Set up raycasting for selecting objects
function setupRaycasting(camera, domElement, scene) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // Event listener for clicks
    domElement.addEventListener('click', (event) => {
        // Calculate mouse position in normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update the picking ray
        raycaster.setFromCamera(mouse, camera);
        
        // Get interactive objects (pyramids and sphinx)
        const interactiveObjects = scene.children.filter(
            child => child.userData && (
                child.userData.details || 
                child.userData.coincidences
            )
        );
        
        // Check for intersections
        const intersects = raycaster.intersectObjects(interactiveObjects, true);
        
        if (intersects.length > 0) {
            // Find the parent group (pyramid or sphinx)
            let selectedObject = intersects[0].object;
            while (selectedObject.parent && 
                   !selectedObject.userData.details && 
                   !selectedObject.userData.coincidences) {
                selectedObject = selectedObject.parent;
            }
            
            if (selectedObject.userData.details || selectedObject.userData.coincidences) {
                displayObjectInfo(selectedObject);
            }
        }
    });
    
    // Add hover effect
    domElement.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        
        const interactiveObjects = scene.children.filter(
            child => child.userData && (
                child.userData.details || 
                child.userData.coincidences
            )
        );
        
        const intersects = raycaster.intersectObjects(interactiveObjects, true);
        
        // Reset cursor
        document.body.style.cursor = 'default';
        
        if (intersects.length > 0) {
            document.body.style.cursor = 'pointer';
        }
    });
}

// Display information about selected object
function displayObjectInfo(object) {
    const infoPanel = document.getElementById('info-panel');
    const coincidenceContainer = document.getElementById('coincidence-container');
    const panelHeader = document.querySelector('.panel-header h2');
    const panelContent = document.querySelector('.panel-content p');
    
    // Show the info panel
    infoPanel.classList.add('visible');
    
    // Update panel title
    panelHeader.textContent = object.name || 'Selected Object';
    
    // Clear previous content
    coincidenceContainer.innerHTML = '';
    
    // Add basic information
    if (object.userData.details) {
        const details = object.userData.details;
        
        // Create HTML content
        let detailsHTML = '';
        
        if (details.builtBy) {
            detailsHTML += `<p><strong>Built by:</strong> ${details.builtBy}</p>`;
        }
        
        if (details.period) {
            detailsHTML += `<p><strong>Period:</strong> ${details.period}</p>`;
        }
        
        if (details.originalHeight) {
            detailsHTML += `<p><strong>Original Height:</strong> ${details.originalHeight}</p>`;
        }
        
        if (details.baseLength) {
            detailsHTML += `<p><strong>Base Length:</strong> ${details.baseLength}</p>`;
        }
        
        if (details.dimensions) {
            detailsHTML += `<p><strong>Dimensions:</strong> ${details.dimensions}</p>`;
        }
        
        if (details.facts && details.facts.length > 0) {
            detailsHTML += `<p><strong>Key Facts:</strong></p><ul>`;
            details.facts.forEach(fact => {
                detailsHTML += `<li>${fact}</li>`;
            });
            detailsHTML += `</ul>`;
        }
        
        panelContent.innerHTML = detailsHTML;
    } else {
        panelContent.innerHTML = `<p>Information about ${object.name}</p>`;
    }
    
    // Add mathematical coincidences
    if (object.userData.coincidences && object.userData.coincidences.length > 0) {
        coincidenceContainer.innerHTML = '<h3>Mathematical Coincidences</h3>';
        
        object.userData.coincidences.forEach(coincidence => {
            const card = document.createElement('div');
            card.className = 'coincidence-card';
            card.innerHTML = `
                <h3>${coincidence.title}</h3>
                <p>${coincidence.description}</p>
            `;
            coincidenceContainer.appendChild(card);
        });
    }
}

// Set up keyboard navigation
function setupKeyboardControls(camera, particleSystem) {
    window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'i':
            case 'I':
                // Toggle info panel
                document.getElementById('toggle-info').click();
                break;
                
            case 'p':
            case 'P':
                // Toggle particles
                particleSystem.visible = !particleSystem.visible;
                document.getElementById('toggle-particles').textContent = 
                    particleSystem.visible ? 'Hide Particles' : 'Show Particles';
                break;
                
            case 'Escape':
                // Close info panel
                document.getElementById('info-panel').classList.remove('visible');
                break;
                
            case 'r':
            case 'R':
                // Reset camera
                camera.position.set(500, 300, 700);
                break;
        }
    });
}
