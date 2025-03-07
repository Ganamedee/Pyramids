import * as THREE from "three";

// Create the pyramids with their accurate relative positions and dimensions
export function createPyramids(scene) {
    // Create pyramids with appropriate dimensions (scaled down from real life)
    // The Great Pyramid of Khufu (Cheops)
    const khufuPyramid = createPyramid({
        name: "Khufu (Great Pyramid)",
        baseLength: 230,
        height: 146,
        position: { x: 0, y: 0, z: 0 },
        color: 0xd2b48c, // Light sandstone color
        details: {
            builtBy: "Pharaoh Khufu",
            period: "Fourth Dynasty (c. 2580–2560 BC)",
            originalHeight: "146.5 meters (481 feet)",
            baseLength: "230.4 meters (756 feet)",
            facts: [
                "Only remaining structure of the Seven Wonders of the Ancient World",
                "Contains about 2.3 million stone blocks",
                "Original entrance is on the north face",
                "Interior chambers include the King's Chamber, Queen's Chamber, and Grand Gallery"
            ]
        },
        coincidences: [
            {
                title: "Speed of Light Correlation",
                description: "The latitude of the Great Pyramid (29.9792458° N) closely matches the speed of light in a vacuum (299,792,458 meters per second)."
            },
            {
                title: "Golden Ratio",
                description: "The ratio of the slant height to half the base length approximates the golden ratio (1.618)."
            },
            {
                title: "Alignment with True North",
                description: "The pyramid is aligned with true north with remarkable accuracy, off by only 0.067 degrees."
            },
            {
                title: "Earth Measurements",
                description: "The perimeter of the base divided by twice the height approximates the value of π (3.14159)."
            }
        ]
    });
    scene.add(khufuPyramid);
    
    // The Pyramid of Khafre
    const khafrePyramid = createPyramid({
        name: "Khafre",
        baseLength: 215,
        height: 136,
        position: { x: 400, y: 0, z: 200 },
        color: 0xc9ae7e, // Slightly darker sandstone
        details: {
            builtBy: "Pharaoh Khafre",
            period: "Fourth Dynasty (c. 2570 BC)",
            originalHeight: "136.4 meters (448 feet)",
            baseLength: "215.5 meters (707 feet)",
            facts: [
                "Appears taller than Khufu's pyramid due to steeper angle and higher ground",
                "Still retains some of its original smooth limestone casing at the apex",
                "Connected to the Sphinx via a causeway",
                "Has two entrances leading to the burial chamber"
            ]
        },
        coincidences: [
            {
                title: "Pi and Phi Connection",
                description: "Like Khufu's pyramid, Khafre's dimensions incorporate both π and φ (phi) mathematical constants."
            },
            {
                title: "Solstice Alignment",
                description: "The pyramid casts no shadow at noon during the spring and autumn equinoxes."
            }
        ]
    });
    scene.add(khafrePyramid);
    
    // The Pyramid of Menkaure
    const menkaurePyramid = createPyramid({
        name: "Menkaure",
        baseLength: 108,
        height: 65,
        position: { x: 700, y: 0, z: 400 },
        color: 0xbda683, // Different sandstone shade
        details: {
            builtBy: "Pharaoh Menkaure",
            period: "Fourth Dynasty (c. 2510 BC)",
            originalHeight: "65 meters (213 feet)",
            baseLength: "108.5 meters (356 feet)",
            facts: [
                "Smallest of the three main Giza pyramids",
                "Lower portion was cased with granite rather than limestone",
                "Has a more complex mortuary temple than the others",
                "Contains a unique burial chamber design with a vaulted ceiling"
            ]
        },
        coincidences: [
            {
                title: "Orion Correlation",
                description: "The three main Giza pyramids are positioned to reflect the alignment of the three stars in Orion's Belt."
            },
            {
                title: "Mathematical Sequence",
                description: "The heights of the three pyramids follow a mathematical sequence, possibly representing intentional planning."
            }
        ]
    });
    scene.add(menkaurePyramid);
    
    // Create three satellite pyramids (Queens' Pyramids) for Khufu
    const queen1 = createPyramid({
        name: "Queen's Pyramid G1-a",
        baseLength: 45,
        height: 30,
        position: { x: 100, y: 0, z: 150 },
        color: 0xc2a575
    });
    scene.add(queen1);
    
    const queen2 = createPyramid({
        name: "Queen's Pyramid G1-b",
        baseLength: 40,
        height: 27,
        position: { x: 160, y: 0, z: 150 },
        color: 0xc2a575
    });
    scene.add(queen2);
    
    const queen3 = createPyramid({
        name: "Queen's Pyramid G1-c",
        baseLength: 35,
        height: 25,
        position: { x: 220, y: 0, z: 150 },
        color: 0xc2a575
    });
    scene.add(queen3);
    
    // Return all the pyramids for future reference
    return {
        khufu: khufuPyramid,
        khafre: khafrePyramid,
        menkaure: menkaurePyramid,
        queens: [queen1, queen2, queen3]
    };
}

function createPyramid(config) {
    const {
        name,
        baseLength,
        height,
        position,
        color,
        details,
        coincidences
    } = config;
    
    // Create a group to hold the pyramid and any features
    const pyramidGroup = new THREE.Group();
    pyramidGroup.name = name;
    pyramidGroup.position.set(position.x, position.y, position.z);
    
    // Store details and coincidences as user data
    pyramidGroup.userData = {
        details: details || {},
        coincidences: coincidences || [],
        baseLength: baseLength,
        height: height,
        isInteractive: true
    };
    
    // Remove the wireframe/cone structure entirely
    // Instead, create a detailed block-based pyramid
    createBlockBasedPyramid(pyramidGroup, name, baseLength, height);
    
    // Add a shadow mesh below the pyramid
    addPyramidShadow(pyramidGroup, baseLength);
    
    // Add interactive indicator
    addInteractiveIndicator(pyramidGroup, baseLength, height);
    
    // Add entrance (simplified) as particles
    if (name === "Khufu (Great Pyramid)") {
        addParticleEntrance(pyramidGroup, baseLength);
    }
    
    return pyramidGroup;
}

// Create a block-based representation of the pyramid
function createBlockBasedPyramid(pyramidGroup, name, baseLength, height) {
    // Define block sizes - historical blocks were about 1-1.5 meters tall
    const blockHeight = 3; // Slightly larger to make more visible
    const blockWidth = 4;  // Increased for visibility
    
    // Accurate colors for Egyptian pyramids - brownish tones
    let baseColor, casingColor;
    if (name === "Khufu (Great Pyramid)") {
        baseColor = new THREE.Color(0xaa8866); // Brown limestone
        casingColor = new THREE.Color(0xd9c7a0); // Light limestone for casing
    } else if (name === "Khafre") {
        baseColor = new THREE.Color(0x9a7b56); // Slightly darker brown
        casingColor = new THREE.Color(0xd1bc92); // Light casing material
    } else if (name === "Menkaure") {
        baseColor = new THREE.Color(0x8c6c4a); // Darker brown/granite
        casingColor = new THREE.Color(0xbaa989); // Darker casing
    } else {
        baseColor = new THREE.Color(0xa08563); // Default brown
        casingColor = new THREE.Color(0xd1bc92); // Default casing
    }
    
    // Calculate number of layers based on height and block size
    const numLayers = Math.floor(height / blockHeight);
    
    // First, create the entire pyramid structure with blocks
    const totalParticles = baseLength * height * 20; // Significantly increased density
    const pyramidGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(totalParticles * 3);
    const colors = new Float32Array(totalParticles * 3);
    const sizes = new Float32Array(totalParticles);
    
    let particleIndex = 0;
    
    // Create particles for each layer
    for (let layer = 0; layer < numLayers; layer++) {
        // Calculate the size of this layer (gets smaller as we go up)
        const layerFraction = layer / numLayers;
        const layerSize = baseLength * (1 - layerFraction);
        
        // Calculate blocks per side for this layer
        const blocksPerSide = Math.max(1, Math.floor(layerSize / blockWidth));
        
        // For top 5% of Khufu pyramid - add white limestone casing that still remains
        const isTopCasingLayer = name === "Khufu (Great Pyramid)" && layerFraction > 0.95;
        const isTopPartialCasingLayer = name === "Khafre" && layerFraction > 0.85;
        
        // Calculate y position for this layer
        const layerY = layer * blockHeight;
        
        // Create visible blocks along the perimeter
        for (let side = 0; side < 4; side++) {
            for (let b = 0; b < blocksPerSide; b++) {
                // Calculate block position along this side
                const t = b / blocksPerSide;
                let blockX, blockZ;
                
                // Position blocks along the four sides
                switch(side) {
                    case 0: // North side
                        blockX = (t - 0.5) * layerSize;
                        blockZ = -layerSize / 2;
                        break;
                    case 1: // East side
                        blockX = layerSize / 2;
                        blockZ = (t - 0.5) * layerSize;
                        break;
                    case 2: // South side
                        blockX = (0.5 - t) * layerSize;
                        blockZ = layerSize / 2;
                        break;
                    case 3: // West side
                        blockX = -layerSize / 2;
                        blockZ = (0.5 - t) * layerSize;
                        break;
                }
                
                // Create multiple particles for each block
                const particlesPerBlock = 50;
                
                for (let p = 0; p < particlesPerBlock; p++) {
                    if (particleIndex >= totalParticles) continue; // Safety check
                    
                    // Random position within the block dimensions
                    const offsetX = (Math.random() - 0.5) * blockWidth * 0.9;
                    const offsetY = (Math.random() - 0.5) * blockHeight * 0.9;
                    const offsetZ = (Math.random() - 0.5) * blockWidth * 0.9;
                    
                    // Modify offsets to create clear block edges - concentrate particles at edges
                    const isEdge = Math.random() < 0.4; // 40% chance of edge particle
                    
                    let finalOffsetX = offsetX;
                    let finalOffsetZ = offsetZ;
                    
                    if (isEdge) {
                        // Choose an edge
                        const edge = Math.floor(Math.random() * 4);
                        switch(edge) {
                            case 0: finalOffsetX = blockWidth * 0.4; break;
                            case 1: finalOffsetX = -blockWidth * 0.4; break;
                            case 2: finalOffsetZ = blockWidth * 0.4; break;
                            case 3: finalOffsetZ = -blockWidth * 0.4; break;
                        }
                    }
                    
                    // Store particle position
                    positions[particleIndex * 3] = blockX + finalOffsetX;
                    positions[particleIndex * 3 + 1] = layerY + offsetY;
                    positions[particleIndex * 3 + 2] = blockZ + finalOffsetZ;
                    
                    // Determine color based on position and type
                    let particleColor;
                    if (isTopCasingLayer || isTopPartialCasingLayer) {
                        particleColor = casingColor;
                    } else {
                        // Add slight variation between blocks
                        const blockVariation = (blockX * 13.4 + blockZ * 7.9) % 1.0;
                        particleColor = new THREE.Color(
                            baseColor.r * (0.9 + blockVariation * 0.2),
                            baseColor.g * (0.9 + blockVariation * 0.2),
                            baseColor.b * (0.9 + blockVariation * 0.2)
                        );
                    }
                    
                    // Adjust for weathering and shadows
                    const height_factor = layer / numLayers;
                    const weathering = Math.random() * 0.3;
                    const shadow = side * 0.05; // Different lighting per side
                    
                    colors[particleIndex * 3] = particleColor.r * (1 - weathering - shadow);
                    colors[particleIndex * 3 + 1] = particleColor.g * (1 - weathering - shadow);
                    colors[particleIndex * 3 + 2] = particleColor.b * (1 - weathering - shadow);
                    
                    // Edge particles are slightly larger to emphasize block structure
                    sizes[particleIndex] = isEdge ? 2.0 + Math.random() * 0.5 : 1.5 + Math.random() * 0.5;
                    
                    particleIndex++;
                }
            }
        }
        
        // Add some particles for visible face blocks
        if (layer < numLayers * 0.5) { // Only for bottom half - more visible
            const facesParticleCount = Math.floor(layerSize * layerSize * 0.5);
            for (let f = 0; f < facesParticleCount; f++) {
                if (particleIndex >= totalParticles) continue;
                
                // Choose one of the four triangular faces
                const face = Math.floor(Math.random() * 4);
                let faceX, faceZ;
                
                // Calculate position on the face
                const u = Math.random(); // How far from edge to center
                const v = Math.random() * (1 - u); // How far up the face
                
                // Position based on face
                switch(face) {
                    case 0: // Front face
                        faceX = (u - 0.5) * layerSize;
                        faceZ = -layerSize / 2 * (1 - v);
                        break;
                    case 1: // Right face
                        faceX = layerSize / 2 * (1 - v);
                        faceZ = (u - 0.5) * layerSize;
                        break;
                    case 2: // Back face
                        faceX = (0.5 - u) * layerSize;
                        faceZ = layerSize / 2 * (1 - v);
                        break;
                    case 3: // Left face
                        faceX = -layerSize / 2 * (1 - v);
                        faceZ = (0.5 - u) * layerSize;
                        break;
                }
                
                // Y position depends on how far up the face we are
                const faceY = layerY + v * blockHeight * 2;
                
                // Store position
                positions[particleIndex * 3] = faceX;
                positions[particleIndex * 3 + 1] = faceY;
                positions[particleIndex * 3 + 2] = faceZ;
                
                // Face color with shading based on the face direction
                let faceShading = 0;
                switch(face) {
                    case 0: faceShading = 0.1; break; // North - less sun
                    case 1: faceShading = 0.0; break; // East - more sun
                    case 2: faceShading = 0.15; break; // South - less sun in morning
                    case 3: faceShading = 0.2; break; // West - less sun until afternoon
                }
                
                colors[particleIndex * 3] = baseColor.r * (1 - faceShading);
                colors[particleIndex * 3 + 1] = baseColor.g * (1 - faceShading);
                colors[particleIndex * 3 + 2] = baseColor.b * (1 - faceShading);
                
                sizes[particleIndex] = 1.5 + Math.random() * 0.5;
                
                particleIndex++;
            }
        }
    }
    
    // Trim arrays if we didn't use all particles
    if (particleIndex < totalParticles) {
        const trimmedPositions = new Float32Array(particleIndex * 3);
        const trimmedColors = new Float32Array(particleIndex * 3);
        const trimmedSizes = new Float32Array(particleIndex);
        
        for (let i = 0; i < particleIndex * 3; i++) {
            trimmedPositions[i] = positions[i];
            trimmedColors[i] = colors[i];
        }
        
        for (let i = 0; i < particleIndex; i++) {
            trimmedSizes[i] = sizes[i];
        }
        
        pyramidGeometry.setAttribute('position', new THREE.BufferAttribute(trimmedPositions, 3));
        pyramidGeometry.setAttribute('color', new THREE.BufferAttribute(trimmedColors, 3));
        pyramidGeometry.setAttribute('size', new THREE.BufferAttribute(trimmedSizes, 1));
    } else {
        pyramidGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        pyramidGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        pyramidGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    }
    
    // Create material with improved settings
    const pyramidMaterial = new THREE.PointsMaterial({
        size: 1.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: THREE.NormalBlending,
        sizeAttenuation: true,
        depthWrite: false
    });
    
    const pyramidParticles = new THREE.Points(pyramidGeometry, pyramidMaterial);
    pyramidGroup.add(pyramidParticles);
}

// Add a shadow mesh under the pyramid
function addPyramidShadow(pyramidGroup, baseLength) {
    // Create a plane slightly larger than the pyramid base
    const shadowSize = baseLength * 1.2;
    const shadowGeometry = new THREE.PlaneGeometry(shadowSize, shadowSize);
    shadowGeometry.rotateX(-Math.PI / 2); // Lay flat
    shadowGeometry.translate(0, 0.1, 0); // Slightly above ground to prevent z-fighting
    
    // Create shadow material - semi-transparent black
    const shadowMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.4,
        depthWrite: false
    });
    
    const shadowMesh = new THREE.Mesh(shadowGeometry, shadowMaterial);
    pyramidGroup.add(shadowMesh);
    
    // Store reference for possible animation
    pyramidGroup.userData.shadowMesh = shadowMesh;
}

function addParticleEntrance(pyramidGroup, baseLength) {
    const entranceParticleCount = 600; // Doubled density
    const entranceGeometry = new THREE.BufferGeometry();
    const entrancePositions = new Float32Array(entranceParticleCount * 3);
    const entranceColors = new Float32Array(entranceParticleCount * 3);
    const entranceSizes = new Float32Array(entranceParticleCount);
    
    const entranceColor = new THREE.Color(0x000000);
    const highlightColor = new THREE.Color(0x333333);
    
    // Create tunnel entrance
    for (let i = 0; i < entranceParticleCount; i++) {
        // Position particles in a tunnel shape
        const t = Math.random(); // 0-1 along tunnel
        const angle = Math.random() * Math.PI * 2;
        const radius = 5 * Math.random(); // Tunnel radius
        
        // Tunnel starts at edge and goes toward center
        entrancePositions[i * 3] = 0 + Math.cos(angle) * radius;
        entrancePositions[i * 3 + 1] = 20 + Math.random() * 5; // Height of entrance
        entrancePositions[i * 3 + 2] = -baseLength/2 + 5 + t * 30 + Math.sin(angle) * radius;
        
        // Dark color for entrance
        const isHighlight = Math.random() < 0.3;
        const colorToUse = isHighlight ? highlightColor : entranceColor;
        entranceColors[i * 3] = colorToUse.r;
        entranceColors[i * 3 + 1] = colorToUse.g;
        entranceColors[i * 3 + 2] = colorToUse.b;
        
        // Small particles for entrance
        entranceSizes[i] = 1.0 + Math.random() * 0.5;
    }
    
    entranceGeometry.setAttribute('position', new THREE.BufferAttribute(entrancePositions, 3));
    entranceGeometry.setAttribute('color', new THREE.BufferAttribute(entranceColors, 3));
    entranceGeometry.setAttribute('size', new THREE.BufferAttribute(entranceSizes, 1));
    
    const entranceMaterial = new THREE.PointsMaterial({
        size: 1.0,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true
    });
    
    const entranceParticles = new THREE.Points(entranceGeometry, entranceMaterial);
    pyramidGroup.add(entranceParticles);
}

// Add a visible indicator showing this is an interactive object
function addInteractiveIndicator(pyramidGroup, baseLength, height) {
    // Create a floating icon/indicator above the pyramid
    const indicatorGeometry = new THREE.SphereGeometry(10, 8, 8);
    const indicatorMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.7
    });
    
    const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
    indicator.position.set(0, height + 30, 0);
    
    // Add pulsing animation data
    indicator.userData.pulsing = true;
    indicator.userData.pulseTime = 0;
    indicator.userData.pulseSpeed = 1 + Math.random() * 0.5;
    
    // Add a text hint
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    
    // Set up text appearance
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = '24px Arial';
    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('CLICK', canvas.width/2, canvas.height/2);
    
    // Create sprite with text
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true
    });
    
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(50, 25, 1);
    sprite.position.set(0, height + 60, 0);
    
    // Add indicator and label to pyramid group
    pyramidGroup.add(indicator);
    pyramidGroup.add(sprite);
    
    // Store references for animation
    pyramidGroup.userData.interactiveIndicator = indicator;
    pyramidGroup.userData.interactiveSprite = sprite;
}