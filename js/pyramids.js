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
    color: 0xdac9b3, // Improved sandstone color
    details: {
      builtBy: "Pharaoh Khufu",
      period: "Fourth Dynasty (c. 2580–2560 BC)",
      originalHeight: "146.5 meters (481 feet)",
      baseLength: "230.4 meters (756 feet)",
      facts: [
        "Only remaining structure of the Seven Wonders of the Ancient World",
        "Contains about 2.3 million stone blocks",
        "Original entrance is on the north face",
        "Interior chambers include the King's Chamber, Queen's Chamber, and Grand Gallery",
      ],
    },
    coincidences: [
      {
        title: "Speed of Light Correlation",
        description:
          "The latitude of the Great Pyramid (29.9792458° N) closely matches the speed of light in a vacuum (299,792,458 meters per second).",
      },
      {
        title: "Golden Ratio",
        description:
          "The ratio of the slant height to half the base length approximates the golden ratio (1.618).",
      },
      {
        title: "Alignment with True North",
        description:
          "The pyramid is aligned with true north with remarkable accuracy, off by only 0.067 degrees.",
      },
      {
        title: "Earth Measurements",
        description:
          "The perimeter of the base divided by twice the height approximates the value of π (3.14159).",
      },
    ],
    chambers: [
      {
        name: "King's Chamber",
        description:
          "Located at the heart of the pyramid, this granite-lined chamber contains Khufu's sarcophagus. The chamber's ceiling features five relieving chambers to distribute the enormous weight above it.",
        position: { x: 0, y: 65, z: 0 },
        dimensions: { width: 20, height: 15, depth: 40 },
        color: 0x8b4513,
      },
      {
        name: "Queen's Chamber",
        description:
          "Despite its name, this chamber was not meant for a queen but possibly housed a statue of Khufu. It features a unique gabled ceiling and two shafts that extend toward the exterior.",
        position: { x: 0, y: 43, z: -15 },
        dimensions: { width: 17, height: 12, depth: 17 },
        color: 0x9b7653,
      },
      {
        name: "Grand Gallery",
        description:
          "An impressive ascending corridor with a corbeled ceiling rising to a height of 8.6 meters. Its precise engineering has amazed visitors for centuries.",
        position: { x: 0, y: 35, z: -40 },
        dimensions: { width: 8, height: 26, depth: 47 },
        color: 0xa0522d,
      },
      {
        name: "Subterranean Chamber",
        description:
          "Carved into the bedrock beneath the pyramid, this unfinished chamber's purpose remains mysterious.",
        position: { x: 0, y: -15, z: 0 },
        dimensions: { width: 16, height: 12, depth: 27 },
        color: 0x654321,
      },
    ],
  });
  scene.add(khufuPyramid);

  // The Pyramid of Khafre - adjusted position for more accurate layout
  const khafrePyramid = createPyramid({
    name: "Khafre",
    baseLength: 215,
    height: 136,
    position: { x: 375, y: 0, z: 250 }, // Adjusted for more accurate layout
    color: 0xd2c3a3, // Slightly darker sandstone
    details: {
      builtBy: "Pharaoh Khafre",
      period: "Fourth Dynasty (c. 2570 BC)",
      originalHeight: "136.4 meters (448 feet)",
      baseLength: "215.5 meters (707 feet)",
      facts: [
        "Appears taller than Khufu's pyramid due to steeper angle and higher ground",
        "Still retains some of its original smooth limestone casing at the apex",
        "Connected to the Sphinx via a causeway",
        "Has two entrances leading to the burial chamber",
      ],
    },
    coincidences: [
      {
        title: "Pi and Phi Connection",
        description:
          "Like Khufu's pyramid, Khafre's dimensions incorporate both π and φ (phi) mathematical constants.",
      },
      {
        title: "Solstice Alignment",
        description:
          "The pyramid casts no shadow at noon during the spring and autumn equinoxes.",
      },
    ],
    chambers: [
      {
        name: "Burial Chamber",
        description:
          "The main burial chamber features a simple design with a granite sarcophagus. Unlike Khufu's pyramid, Khafre's burial chamber has only one level and is accessible from two entrances.",
        position: { x: 0, y: 20, z: 0 },
        dimensions: { width: 22, height: 14, depth: 45 },
        color: 0x8b4513,
      },
      {
        name: "Lower Entrance Passage",
        description:
          "The lower entrance passage provides direct access to the burial chamber from the north face of the pyramid.",
        position: { x: 0, y: 10, z: -60 },
        dimensions: { width: 5, height: 5, depth: 60 },
        color: 0x9b7653,
      },
      {
        name: "Upper Entrance Passage",
        description:
          "A second entrance passage that connects to the main burial chamber, possibly added for ceremonial purposes.",
        position: { x: 30, y: 50, z: -40 },
        dimensions: { width: 5, height: 5, depth: 60 },
        angle: Math.PI / 6,
        color: 0xa0522d,
      },
    ],
  });
  scene.add(khafrePyramid);

  // The Pyramid of Menkaure - adjusted position for more accurate layout
  const menkaurePyramid = createPyramid({
    name: "Menkaure",
    baseLength: 108,
    height: 65,
    position: { x: 650, y: 0, z: 425 }, // Adjusted for more accurate layout
    color: 0xc9b8a1, // Different sandstone shade
    details: {
      builtBy: "Pharaoh Menkaure",
      period: "Fourth Dynasty (c. 2510 BC)",
      originalHeight: "65 meters (213 feet)",
      baseLength: "108.5 meters (356 feet)",
      facts: [
        "Smallest of the three main Giza pyramids",
        "Lower portion was cased with granite rather than limestone",
        "Has a more complex mortuary temple than the others",
        "Contains a unique burial chamber design with a vaulted ceiling",
      ],
    },
    coincidences: [
      {
        title: "Orion Correlation",
        description:
          "The three main Giza pyramids are positioned to reflect the alignment of the three stars in Orion's Belt.",
      },
      {
        title: "Mathematical Sequence",
        description:
          "The heights of the three pyramids follow a mathematical sequence, possibly representing intentional planning.",
      },
    ],
    chambers: [
      {
        name: "Upper Burial Chamber",
        description:
          "The main burial chamber features a unique design with a carved ceiling to imitate wooden beams. It contains a basalt sarcophagus that was lost at sea during transport to England.",
        position: { x: 0, y: 25, z: 0 },
        dimensions: { width: 15, height: 12, depth: 20 },
        color: 0x8b4513,
      },
      {
        name: "Lower Burial Chamber",
        description:
          "An unusual second chamber below the main burial chamber, possibly intended for grave goods or as an earlier burial location.",
        position: { x: 0, y: 10, z: 0 },
        dimensions: { width: 12, height: 8, depth: 16 },
        color: 0x9b7653,
      },
      {
        name: "Entrance Passage",
        description:
          "A descending corridor with granite paneling that leads to the burial chambers.",
        position: { x: 0, y: 20, z: -30 },
        dimensions: { width: 4, height: 4, depth: 30 },
        color: 0xa0522d,
      },
    ],
  });
  scene.add(menkaurePyramid);

  // Create three satellite pyramids (Queens' Pyramids) for Khufu with detailed information
  const queen1 = createPyramid({
    name: "Queen's Pyramid G1-a",
    baseLength: 45,
    height: 30,
    position: { x: 115, y: 0, z: 165 }, // Adjusted position
    color: 0xcfbfa8,
    details: {
      builtBy: "Built during Khufu's reign",
      period: "Fourth Dynasty (c. 2580–2560 BC)",
      originalHeight: "30 meters (98.4 feet)",
      baseLength: "45.8 meters (150 feet)",
      facts: [
        "Known as G1-a or Eastern Queen's Pyramid",
        "Believed to be the tomb of Queen Hetepheres I, Khufu's mother",
        "Contains a burial chamber with a sarcophagus and canopic chest",
        "The most intact of the three queens' pyramids",
      ],
    },
    coincidences: [
      {
        title: "Familial Alignment",
        description:
          "The three queens' pyramids are aligned precisely in relation to the Great Pyramid, possibly representing family relationships.",
      },
    ],
    chambers: [
      {
        name: "Burial Chamber",
        description:
          "A simple chamber that housed a sarcophagus and canopic chest containing the queen's organs. Artifacts from this tomb provided valuable insights into royal burial practices.",
        position: { x: 0, y: 10, z: 0 },
        dimensions: { width: 10, height: 8, depth: 12 },
        color: 0x8b4513,
      },
      {
        name: "Entrance Passage",
        description:
          "A descending corridor that leads to the burial chamber from the north face.",
        position: { x: 0, y: 15, z: -20 },
        dimensions: { width: 3, height: 3, depth: 20 },
        color: 0x9b7653,
      },
    ],
  });
  scene.add(queen1);

  const queen2 = createPyramid({
    name: "Queen's Pyramid G1-b",
    baseLength: 40,
    height: 27,
    position: { x: 175, y: 0, z: 165 }, // Adjusted position
    color: 0xd0c2ab,
    details: {
      builtBy: "Built during Khufu's reign",
      period: "Fourth Dynasty (c. 2580–2560 BC)",
      originalHeight: "27.5 meters (90 feet)",
      baseLength: "41.5 meters (136 feet)",
      facts: [
        "Known as G1-b or Middle Queen's Pyramid",
        "Likely tomb of Queen Meritites I, one of Khufu's principal wives",
        "Features a simpler design than G1-a",
        "Connected to a small cult temple for offerings",
      ],
    },
    coincidences: [
      {
        title: "Proportional Design",
        description:
          "The dimensions of this pyramid maintain the same proportional ratio as the Great Pyramid, suggesting a deliberate mathematical relationship.",
      },
    ],
    chambers: [
      {
        name: "Burial Chamber",
        description:
          "A modest chamber designed to house the queen's sarcophagus. Much of the interior was damaged by tomb robbers in antiquity.",
        position: { x: 0, y: 8, z: 0 },
        dimensions: { width: 8, height: 7, depth: 10 },
        color: 0x8b4513,
      },
      {
        name: "Entrance Passage",
        description:
          "A simple descending corridor leading to the burial chamber.",
        position: { x: 0, y: 12, z: -15 },
        dimensions: { width: 2.5, height: 2.5, depth: 15 },
        color: 0x9b7653,
      },
    ],
  });
  scene.add(queen2);

  const queen3 = createPyramid({
    name: "Queen's Pyramid G1-c",
    baseLength: 35,
    height: 25,
    position: { x: 235, y: 0, z: 165 }, // Adjusted position
    color: 0xd2c4ad,
    details: {
      builtBy: "Built during Khufu's reign",
      period: "Fourth Dynasty (c. 2580–2560 BC)",
      originalHeight: "24.5 meters (80 feet)",
      baseLength: "35.5 meters (116 feet)",
      facts: [
        "Known as G1-c or Western Queen's Pyramid",
        "Believed to be the tomb of Queen Henutsen, another of Khufu's wives",
        "The smallest of the three queens' pyramids",
        "Later converted into a temple to Isis during the 21st Dynasty",
      ],
    },
    coincidences: [
      {
        title: "Astronomical Alignment",
        description:
          "This pyramid forms part of a precise astronomical alignment with the other pyramids, possibly representing stars in the ancient Egyptian sky maps.",
      },
    ],
    chambers: [
      {
        name: "Burial Chamber",
        description:
          "A simple burial chamber that was repurposed in later dynasties as part of the Temple of Isis. Archaeological evidence suggests multiple phases of use.",
        position: { x: 0, y: 8, z: 0 },
        dimensions: { width: 7, height: 6, depth: 9 },
        color: 0x8b4513,
      },
      {
        name: "Entrance Passage",
        description:
          "A modest corridor leading to the burial chamber, later modified when the structure was converted to a temple.",
        position: { x: 0, y: 10, z: -12 },
        dimensions: { width: 2, height: 2, depth: 12 },
        color: 0x9b7653,
      },
    ],
  });
  scene.add(queen3);

  // Return all the pyramids for future reference
  return {
    khufu: khufuPyramid,
    khafre: khafrePyramid,
    menkaure: menkaurePyramid,
    queens: [queen1, queen2, queen3],
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
    coincidences,
    chambers,
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
    isInteractive: true,
    chambers: chambers || [],
  };

  // Create a detailed block-based pyramid
  createBlockBasedPyramid(pyramidGroup, name, baseLength, height);

  // Add a shadow mesh below the pyramid
  addPyramidShadow(pyramidGroup, baseLength);

  // Add interactive indicator
  addInteractiveIndicator(pyramidGroup, baseLength, height);

  // Add entrance (simplified) as particles
  if (name === "Khufu (Great Pyramid)") {
    addParticleEntrance(pyramidGroup, baseLength);
  }

  // Create internal chambers if specified
  if (chambers && chambers.length > 0) {
    createInternalChambers(pyramidGroup, chambers);
  }

  return pyramidGroup;
}

// Create a block-based representation of the pyramid
function createBlockBasedPyramid(pyramidGroup, name, baseLength, height) {
  // Define block sizes - historical blocks were about 1-1.5 meters tall
  const blockHeight = 3; // Slightly larger to make more visible
  const blockWidth = 4; // Increased for visibility

  // Accurate colors for Egyptian pyramids - improved color palette
  let baseColor, casingColor;
  if (name === "Khufu (Great Pyramid)") {
    baseColor = new THREE.Color(0xc9b099); // Improved limestone
    casingColor = new THREE.Color(0xf0e6d2); // Lighter limestone for casing
  } else if (name === "Khafre") {
    baseColor = new THREE.Color(0xbea684); // Slightly darker brown
    casingColor = new THREE.Color(0xe8dac0); // Light casing material
  } else if (name === "Menkaure") {
    baseColor = new THREE.Color(0xa08972); // Darker brown/granite
    casingColor = new THREE.Color(0xd4c4ad); // Darker casing
  } else {
    baseColor = new THREE.Color(0xb89f83); // Default brown
    casingColor = new THREE.Color(0xe2d4be); // Default casing
  }

  // Calculate number of layers based on height and block size
  const numLayers = Math.floor(height / blockHeight);

  // First, create the entire pyramid structure with blocks - increased particle density
  const totalParticles = baseLength * height * 25; // Higher density for better visuals
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

    // For top layers with limestone casing that may still remain
    const isTopCasingLayer =
      name === "Khufu (Great Pyramid)" && layerFraction > 0.95;
    const isTopPartialCasingLayer = name === "Khafre" && layerFraction > 0.85;
    const isMenkaureGranite = name === "Menkaure" && layerFraction < 0.3; // Lower portion in granite

    // Calculate y position for this layer
    const layerY = layer * blockHeight;

    // Create visible blocks along the perimeter
    for (let side = 0; side < 4; side++) {
      for (let b = 0; b < blocksPerSide; b++) {
        // Calculate block position along this side
        const t = b / blocksPerSide;
        let blockX, blockZ;

        // Position blocks along the four sides
        switch (side) {
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

        // Create multiple particles for each block - increased for better visuals
        const particlesPerBlock = 60;

        for (let p = 0; p < particlesPerBlock; p++) {
          if (particleIndex >= totalParticles) continue; // Safety check

          // Random position within the block dimensions - with improved spacing for cleaner blocks
          const offsetX = (Math.random() - 0.5) * blockWidth * 0.85;
          const offsetY = (Math.random() - 0.5) * blockHeight * 0.85;
          const offsetZ = (Math.random() - 0.5) * blockWidth * 0.85;

          // Modify offsets to create clear block edges - concentrate particles at edges
          const isEdge = Math.random() < 0.45; // 45% chance of edge particle

          let finalOffsetX = offsetX;
          let finalOffsetZ = offsetZ;

          if (isEdge) {
            // Choose an edge
            const edge = Math.floor(Math.random() * 4);
            switch (edge) {
              case 0:
                finalOffsetX = blockWidth * 0.42;
                break;
              case 1:
                finalOffsetX = -blockWidth * 0.42;
                break;
              case 2:
                finalOffsetZ = blockWidth * 0.42;
                break;
              case 3:
                finalOffsetZ = -blockWidth * 0.42;
                break;
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
          } else if (isMenkaureGranite) {
            // Dark granite for Menkaure's lower portion
            particleColor = new THREE.Color(0x695548);
          } else {
            // Add subtle variation between blocks for more realism
            const blockVariation =
              (blockX * 13.4 + blockZ * 7.9 + layer * 3.7) % 1.0;
            particleColor = new THREE.Color(
              baseColor.r * (0.92 + blockVariation * 0.16),
              baseColor.g * (0.92 + blockVariation * 0.16),
              baseColor.b * (0.92 + blockVariation * 0.16)
            );
          }

          // Adjust for weathering and shadows - improved natural look
          const height_factor = layer / numLayers;
          const weathering = Math.random() * 0.25 * (1 - height_factor * 0.5); // Less weathering at top
          const shadow = side * 0.06; // Different lighting per side

          colors[particleIndex * 3] =
            particleColor.r * (1 - weathering - shadow);
          colors[particleIndex * 3 + 1] =
            particleColor.g * (1 - weathering - shadow);
          colors[particleIndex * 3 + 2] =
            particleColor.b * (1 - weathering - shadow);

          // Edge particles are slightly larger to emphasize block structure
          sizes[particleIndex] = isEdge
            ? 1.9 + Math.random() * 0.4
            : 1.4 + Math.random() * 0.4;

          particleIndex++;
        }
      }
    }

    // Add particles for visible face blocks with improved distribution
    if (layer < numLayers * 0.65) {
      // More visible face particles
      const facesParticleCount = Math.floor(layerSize * layerSize * 0.6);
      for (let f = 0; f < facesParticleCount; f++) {
        if (particleIndex >= totalParticles) continue;

        // Choose one of the four triangular faces
        const face = Math.floor(Math.random() * 4);
        let faceX, faceZ;

        // Calculate position on the face - improved distribution
        const u = Math.random() * 0.9 + 0.05; // How far from edge to center (avoiding extreme edges)
        const v = (Math.random() * 0.9 + 0.05) * (1 - u); // How far up the face

        // Position based on face
        switch (face) {
          case 0: // Front face
            faceX = (u - 0.5) * layerSize;
            faceZ = (-layerSize / 2) * (1 - v);
            break;
          case 1: // Right face
            faceX = (layerSize / 2) * (1 - v);
            faceZ = (u - 0.5) * layerSize;
            break;
          case 2: // Back face
            faceX = (0.5 - u) * layerSize;
            faceZ = (layerSize / 2) * (1 - v);
            break;
          case 3: // Left face
            faceX = (-layerSize / 2) * (1 - v);
            faceZ = (0.5 - u) * layerSize;
            break;
        }

        // Y position depends on how far up the face we are
        const faceY = layerY + v * blockHeight * 2;

        // Store position
        positions[particleIndex * 3] = faceX;
        positions[particleIndex * 3 + 1] = faceY;
        positions[particleIndex * 3 + 2] = faceZ;

        // Face color with improved shading based on the face direction
        let faceShading = 0;
        switch (face) {
          case 0:
            faceShading = 0.12;
            break; // North - less sun
          case 1:
            faceShading = 0.02;
            break; // East - more sun
          case 2:
            faceShading = 0.18;
            break; // South - less sun in morning
          case 3:
            faceShading = 0.22;
            break; // West - less sun until afternoon
        }

        // Determine material type for face particles
        let faceColor;
        if (isMenkaureGranite && faceY < height * 0.3) {
          // Granite for lower portion of Menkaure
          faceColor = new THREE.Color(0x695548);
        } else {
          faceColor = baseColor;
        }

        colors[particleIndex * 3] = faceColor.r * (1 - faceShading);
        colors[particleIndex * 3 + 1] = faceColor.g * (1 - faceShading);
        colors[particleIndex * 3 + 2] = faceColor.b * (1 - faceShading);

        sizes[particleIndex] = 1.4 + Math.random() * 0.5;

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

    pyramidGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(trimmedPositions, 3)
    );
    pyramidGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(trimmedColors, 3)
    );
    pyramidGeometry.setAttribute(
      "size",
      new THREE.BufferAttribute(trimmedSizes, 1)
    );
  } else {
    pyramidGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    pyramidGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    pyramidGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
  }

  // Create material with improved settings
  const pyramidMaterial = new THREE.PointsMaterial({
    size: 1.7,
    vertexColors: true,
    transparent: true,
    opacity: 0.98,
    blending: THREE.NormalBlending,
    sizeAttenuation: true,
    depthWrite: false,
  });

  const pyramidParticles = new THREE.Points(pyramidGeometry, pyramidMaterial);
  pyramidGroup.add(pyramidParticles);
}

// Add a shadow mesh under the pyramid - improved for better shadows
function addPyramidShadow(pyramidGroup, baseLength) {
  // Create a plane slightly larger than the pyramid base
  const shadowSize = baseLength * 1.5; // Larger shadow for better effect
  const shadowGeometry = new THREE.PlaneGeometry(shadowSize, shadowSize);
  shadowGeometry.rotateX(-Math.PI / 2); // Lay flat
  shadowGeometry.translate(0, 0.1, 0); // Slightly above ground to prevent z-fighting

  // Create shadow material - semi-transparent black
  const shadowMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.5, // Increased opacity for stronger shadow
    depthWrite: false,
  });

  const shadowMesh = new THREE.Mesh(shadowGeometry, shadowMaterial);
  pyramidGroup.add(shadowMesh);

  // Store reference for possible animation
  pyramidGroup.userData.shadowMesh = shadowMesh;
}

// Create interior chambers for the pyramid
function createInternalChambers(pyramidGroup, chambers) {
  // Create a group to hold all chambers
  const chambersGroup = new THREE.Group();
  chambersGroup.name = "interiorChambers";
  chambersGroup.visible = false; // Hidden by default
  pyramidGroup.add(chambersGroup);

  // Add each chamber
  chambers.forEach((chamber) => {
    const { name, position, dimensions, color, angle } = chamber;

    // Create chamber geometry
    const chamberGeometry = new THREE.BoxGeometry(
      dimensions.width,
      dimensions.height,
      dimensions.depth
    );

    // Create chamber material - semi-transparent to see inside
    const chamberMaterial = new THREE.MeshPhongMaterial({
      color: color || 0x8b4513,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide, // See inside and outside
      specular: 0x333333,
      shininess: 30,
    });

    // Create chamber mesh
    const chamberMesh = new THREE.Mesh(chamberGeometry, chamberMaterial);
    chamberMesh.position.set(position.x, position.y, position.z);

    // Apply rotation if specified
    if (angle) {
      chamberMesh.rotation.y = angle;
    }

    chamberMesh.name = name;
    chamberMesh.userData = { description: chamber.description };

    // Add wireframe outline for better visibility
    const wireframeGeometry = new THREE.EdgesGeometry(chamberGeometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 1,
    });
    const wireframe = new THREE.LineSegments(
      wireframeGeometry,
      wireframeMaterial
    );
    chamberMesh.add(wireframe);

    // Add to chambers group
    chambersGroup.add(chamberMesh);

    // Create connecting passages if needed
    if (chamber.name.includes("Chamber") && position.z !== 0) {
      createPassageToChamber(chambersGroup, position, dimensions, color);
    }
  });

  // Store the chambers group for future reference
  pyramidGroup.userData.chambersGroup = chambersGroup;
}

// Create connecting passage between chambers
function createPassageToChamber(chambersGroup, position, dimensions, color) {
  // Only create passage if chamber is not at center (0, 0, 0)
  if (position.z === 0) return;

  const passageWidth = Math.min(dimensions.width * 0.5, 4);
  const passageHeight = Math.min(dimensions.height * 0.5, 4);
  const passageLength = Math.abs(position.z);

  const passageGeometry = new THREE.BoxGeometry(
    passageWidth,
    passageHeight,
    passageLength
  );

  const passageMaterial = new THREE.MeshPhongMaterial({
    color: color || 0x8b4513,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
    specular: 0x333333,
    shininess: 30,
  });

  const passageMesh = new THREE.Mesh(passageGeometry, passageMaterial);

  // Position the passage to connect to the chamber
  passageMesh.position.set(position.x, position.y, position.z / 2);

  // Add wireframe outline
  const wireframeGeometry = new THREE.EdgesGeometry(passageGeometry);
  const wireframeMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    linewidth: 1,
  });
  const wireframe = new THREE.LineSegments(
    wireframeGeometry,
    wireframeMaterial
  );
  passageMesh.add(wireframe);

  // Add to chambers group
  chambersGroup.add(passageMesh);
}

function addParticleEntrance(pyramidGroup, baseLength) {
  const entranceParticleCount = 800; // Increased density
  const entranceGeometry = new THREE.BufferGeometry();
  const entrancePositions = new Float32Array(entranceParticleCount * 3);
  const entranceColors = new Float32Array(entranceParticleCount * 3);
  const entranceSizes = new Float32Array(entranceParticleCount);

  const entranceColor = new THREE.Color(0x000000);
  const highlightColor = new THREE.Color(0x333333);

  // Create tunnel entrance with improved visual
  for (let i = 0; i < entranceParticleCount; i++) {
    // Position particles in a tunnel shape
    const t = Math.random(); // 0-1 along tunnel
    const angle = Math.random() * Math.PI * 2;
    const radius = 5.5 * Math.random(); // Tunnel radius - slightly larger

    // Tunnel starts at edge and goes toward center
    entrancePositions[i * 3] = 0 + Math.cos(angle) * radius;
    entrancePositions[i * 3 + 1] = 23 + Math.random() * 6; // Height of entrance
    entrancePositions[i * 3 + 2] =
      -baseLength / 2 + 5 + t * 35 + Math.sin(angle) * radius;

    // Dark color for entrance
    const isHighlight = Math.random() < 0.3;
    const colorToUse = isHighlight ? highlightColor : entranceColor;
    entranceColors[i * 3] = colorToUse.r;
    entranceColors[i * 3 + 1] = colorToUse.g;
    entranceColors[i * 3 + 2] = colorToUse.b;

    // Small particles for entrance
    entranceSizes[i] = 1.0 + Math.random() * 0.6;
  }

  entranceGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(entrancePositions, 3)
  );
  entranceGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(entranceColors, 3)
  );
  entranceGeometry.setAttribute(
    "size",
    new THREE.BufferAttribute(entranceSizes, 1)
  );

  const entranceMaterial = new THREE.PointsMaterial({
    size: 1.0,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    sizeAttenuation: true,
  });

  const entranceParticles = new THREE.Points(
    entranceGeometry,
    entranceMaterial
  );
  pyramidGroup.add(entranceParticles);
}

// Add a visible indicator showing this is an interactive object
function addInteractiveIndicator(pyramidGroup, baseLength, height) {
  // Create a floating icon/indicator above the pyramid
  const indicatorGeometry = new THREE.SphereGeometry(8, 8, 8);
  const indicatorMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.7,
  });

  const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
  indicator.position.set(0, height + 25, 0);

  // Add pulsing animation data
  indicator.userData.pulsing = true;
  indicator.userData.pulseTime = 0;
  indicator.userData.pulseSpeed = 1 + Math.random() * 0.5;

  // Add a text hint
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const context = canvas.getContext("2d");

  // Set up text appearance
  context.fillStyle = "rgba(0, 0, 0, 0)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = "24px Arial";
  context.fillStyle = "rgba(255, 255, 255, 0.9)";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("CLICK", canvas.width / 2, canvas.height / 2);

  // Create sprite with text
  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
  });

  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(50, 25, 1);
  sprite.position.set(0, height + 50, 0);

  // Add indicator and label to pyramid group
  pyramidGroup.add(indicator);
  pyramidGroup.add(sprite);

  // Store references for animation
  pyramidGroup.userData.interactiveIndicator = indicator;
  pyramidGroup.userData.interactiveSprite = sprite;
}
