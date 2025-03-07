import * as THREE from "three";

// Set up UI controls and interaction
export function setupControls(camera, renderer, particleSystem, scene) {
  // Get UI elements
  const toggleInfoBtn = document.getElementById("toggle-info");
  const closeInfoBtn = document.getElementById("close-info");
  const infoPanel = document.getElementById("info-panel");
  const toggleParticlesBtn = document.getElementById("toggle-particles");
  const toggleInteriorsBtn = document.getElementById("toggle-interiors");
  const timeSlider = document.getElementById("time-slider");

  // Toggle information panel
  toggleInfoBtn.addEventListener("click", () => {
    infoPanel.classList.toggle("visible");
  });

  // Close information panel
  closeInfoBtn.addEventListener("click", () => {
    infoPanel.classList.remove("visible");
  });

  // Toggle particle effects
  toggleParticlesBtn.addEventListener("click", () => {
    particleSystem.visible = !particleSystem.visible;
    toggleParticlesBtn.textContent = particleSystem.visible
      ? "Hide Particles"
      : "Show Particles";
  });

  // Toggle interior chambers
  let interiorsVisible = false;
  toggleInteriorsBtn.addEventListener("click", () => {
    interiorsVisible = !interiorsVisible;
    toggleInteriorsBtn.textContent = interiorsVisible
      ? "Hide Interiors"
      : "Show Interiors";

    // Toggle visibility of all chamber groups
    scene.traverse((object) => {
      if (object.name === "interiorChambers") {
        object.visible = interiorsVisible;
      }
    });
  });

  // Time of day slider (controls lighting)
  timeSlider.addEventListener("input", (e) => {
    updateLighting(scene, parseFloat(e.target.value));
  });

  // Initialize lighting with default time (noon)
  updateLighting(scene, 12);

  // Set up raycasting for object selection
  setupRaycasting(camera, renderer.domElement, scene);

  // Add keyboard controls
  setupKeyboardControls(camera, particleSystem, interiorsVisible);
}

// Update scene lighting based on time of day
function updateLighting(scene, timeOfDay) {
  // Find the directional light (sun)
  const sunLight = scene.children.find(
    (child) =>
      child instanceof THREE.DirectionalLight &&
      child.name !== "fillLight" &&
      child.name !== "bounceLight"
  );

  if (!sunLight) return;

  // Get the sun sphere
  const sunSphere = scene.getObjectByName("sunSphere");

  // Get the stars
  const stars = scene.getObjectByName("stars");

  // Calculate sun position based on time (0-24 hours)
  // Convert to radians: 0h = midnight, 6h = sunrise, 12h = noon, 18h = sunset
  const angle = ((timeOfDay - 6) / 24) * Math.PI * 2;

  // Update sun position
  const radius = 3000;
  const sunX = Math.cos(angle) * radius;
  const sunY = Math.sin(angle) * radius;
  const sunZ = 0;

  // Update directional light position
  sunLight.position.set(sunX, Math.max(0, sunY), sunZ);

  // Update sun sphere position
  if (sunSphere) {
    sunSphere.position.set(sunX, Math.max(10, sunY), sunZ);

    // Hide sun at night
    sunSphere.visible = timeOfDay > 5 && timeOfDay < 19;

    // Adjust sun color and size based on height
    const sunHeight = Math.sin(angle);

    if (sunHeight < 0.2 && sunHeight > 0) {
      // Dawn/dusk - orange sun
      sunSphere.material.color.setHex(0xff7e33);
      sunSphere.scale.set(1.2, 1.2, 1.2); // Larger sun near horizon
    } else {
      // Day - yellow sun
      sunSphere.material.color.setHex(0xffee88);
      sunSphere.scale.set(1, 1, 1); // Normal size
    }
  }

  // Show stars at night
  if (stars) {
    // Stars visible from sunset to sunrise (18-6)
    const isNight = timeOfDay < 5 || timeOfDay > 19;
    const isTwilight =
      (timeOfDay >= 5 && timeOfDay < 7) || (timeOfDay > 17 && timeOfDay <= 19);

    stars.visible = isNight || isTwilight;

    // Adjust star opacity for twilight
    if (isTwilight) {
      const twilightFactor =
        timeOfDay < 12
          ? 1 - (timeOfDay - 5) / 2 // morning
          : (timeOfDay - 17) / 2; // evening

      stars.material.opacity = twilightFactor * 0.8;
    } else if (isNight) {
      stars.material.opacity = 1.0;
    }
  }

  // Update light intensity based on time
  // Highest at noon, lowest at midnight with smooth transitions
  const baseIntensity = Math.max(0, Math.sin(angle));

  sunLight.intensity = baseIntensity * 1.5;

  // Update light color based on time of day
  if (timeOfDay > 5 && timeOfDay < 8) {
    // Sunrise - warmer light
    sunLight.color.setHex(0xffa54f);
  } else if (timeOfDay >= 8 && timeOfDay <= 16) {
    // Day - neutral light
    sunLight.color.setHex(0xffffff);
  } else if (timeOfDay > 16 && timeOfDay < 19) {
    // Sunset - warm orange light
    sunLight.color.setHex(0xff8c38);
  } else {
    // Night - dim blue moonlight
    sunLight.color.setHex(0x4070a0);
  }

  // Update ambient light
  const ambientLight = scene.children.find(
    (child) => child instanceof THREE.AmbientLight
  );

  if (ambientLight) {
    // Adjust ambient light for day/night cycle
    if (timeOfDay > 5 && timeOfDay < 19) {
      // Daytime - brighter ambient light
      ambientLight.intensity = 0.2 + baseIntensity * 0.3;
      ambientLight.color.setHex(0x404040); // Neutral color
    } else {
      // Nighttime - dim blue ambient light
      ambientLight.intensity = 0.15;
      ambientLight.color.setHex(0x101030); // Blue tint
    }
  }

  // Update hemisphere light
  const hemiLight = scene.children.find(
    (child) => child instanceof THREE.HemisphereLight
  );

  if (hemiLight) {
    if (timeOfDay > 5 && timeOfDay < 19) {
      // Daytime
      hemiLight.intensity = 0.3 + baseIntensity * 0.5;
      hemiLight.skyColor.setHex(0xffeeb1); // Warm sky
      hemiLight.groundColor.setHex(0x080820); // Dark ground
    } else {
      // Nighttime
      hemiLight.intensity = 0.1;
      hemiLight.skyColor.setHex(0x103060); // Night sky
      hemiLight.groundColor.setHex(0x050510); // Very dark ground
    }
  }

  // Update sky color based on time of day
  const sky = scene.getObjectByName("sky");

  if (sky && sky.material && sky.material.uniforms) {
    if (timeOfDay >= 5 && timeOfDay < 8) {
      // Sunrise
      const t = (timeOfDay - 5) / 3;
      sky.material.uniforms.topColor.value = new THREE.Color().lerpColors(
        new THREE.Color(0x0a1a3f), // Dark blue
        new THREE.Color(0x0a2351), // Deep blue
        t
      );
      sky.material.uniforms.middleColor.value = new THREE.Color().lerpColors(
        new THREE.Color(0x431e3f), // Purple-ish
        new THREE.Color(0x4c7bd9), // Mid blue
        t
      );
      sky.material.uniforms.bottomColor.value = new THREE.Color().lerpColors(
        new THREE.Color(0x321708), // Dark orange-brown
        new THREE.Color(0xff7e00), // Bright orange
        t
      );
    } else if (timeOfDay >= 8 && timeOfDay <= 16) {
      // Day
      const t = Math.min(1, (timeOfDay - 8) / 4); // Peaks at noon
      sky.material.uniforms.topColor.value = new THREE.Color(0x0a2351); // Deep blue
      sky.material.uniforms.middleColor.value = new THREE.Color(0x4c7bd9); // Mid blue
      sky.material.uniforms.bottomColor.value = new THREE.Color().lerpColors(
        new THREE.Color(0xf7c987), // Light orange at morning
        new THREE.Color(0x87ceeb), // Sky blue at noon
        t
      );
    } else if (timeOfDay > 16 && timeOfDay < 19) {
      // Sunset
      const t = (timeOfDay - 16) / 3;
      sky.material.uniforms.topColor.value = new THREE.Color().lerpColors(
        new THREE.Color(0x0a2351), // Deep blue
        new THREE.Color(0x0a1a3f), // Dark blue
        t
      );
      sky.material.uniforms.middleColor.value = new THREE.Color().lerpColors(
        new THREE.Color(0x4c7bd9), // Mid blue
        new THREE.Color(0x431e3f), // Purple-ish
        t
      );
      sky.material.uniforms.bottomColor.value = new THREE.Color().lerpColors(
        new THREE.Color(0x87ceeb), // Sky blue
        new THREE.Color(0xff7e00), // Bright orange
        t
      );
    } else {
      // Night
      const isLateNight =
        (timeOfDay >= 0 && timeOfDay < 5) ||
        (timeOfDay >= 19 && timeOfDay <= 24);
      sky.material.uniforms.topColor.value = new THREE.Color(0x000000); // Black
      sky.material.uniforms.middleColor.value = new THREE.Color(0x0a1a3f); // Very dark blue
      sky.material.uniforms.bottomColor.value = new THREE.Color(0x061224); // Near black with blue tint
    }
  }

  // Update fog color based on time
  if (scene.fog) {
    if (timeOfDay >= 5 && timeOfDay < 8) {
      // Sunrise fog
      const t = (timeOfDay - 5) / 3;
      scene.fog.color = new THREE.Color().lerpColors(
        new THREE.Color(0x221910), // Dark dawn
        new THREE.Color(0xd9b38c), // Light sand
        t
      );
    } else if (timeOfDay >= 8 && timeOfDay <= 16) {
      // Daytime fog
      scene.fog.color = new THREE.Color(0xd9b38c);
    } else if (timeOfDay > 16 && timeOfDay < 19) {
      // Sunset fog
      const t = (timeOfDay - 16) / 3;
      scene.fog.color = new THREE.Color().lerpColors(
        new THREE.Color(0xd9b38c), // Light sand
        new THREE.Color(0x221910), // Dark dusk
        t
      );
    } else {
      // Nighttime fog
      scene.fog.color = new THREE.Color(0x0a1a3f);
    }
  }

  // Update shadow properties based on time
  const shadowCatcher = scene.getObjectByName("shadowCatcher");
  if (shadowCatcher) {
    // Shadows are stronger during day, softer at dawn/dusk, and minimal at night
    if (timeOfDay > 7 && timeOfDay < 17) {
      // Day - strongest shadows
      shadowCatcher.material.opacity = 0.5;
    } else if (
      (timeOfDay >= 5 && timeOfDay <= 7) ||
      (timeOfDay >= 17 && timeOfDay <= 19)
    ) {
      // Dawn/Dusk - softer shadows
      const dawnFactor =
        timeOfDay < 12
          ? (timeOfDay - 5) / 2 // morning
          : (19 - timeOfDay) / 2; // evening

      shadowCatcher.material.opacity = 0.3 * dawnFactor;
    } else {
      // Night - minimal shadows
      shadowCatcher.material.opacity = 0.05;
    }
  }
}

// Set up raycasting for selecting objects
function setupRaycasting(camera, domElement, scene) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Event listener for clicks
  domElement.addEventListener("click", (event) => {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray
    raycaster.setFromCamera(mouse, camera);

    // Check for chamber intersections first (when visible)
    let chamberIntersections = [];

    scene.traverse((object) => {
      if (object.name === "interiorChambers" && object.visible) {
        // Get all meshes within the chambers group
        const chamberMeshes = [];
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            chamberMeshes.push(child);
          }
        });

        // Test for intersections with chamber meshes
        if (chamberMeshes.length > 0) {
          chamberIntersections = raycaster.intersectObjects(
            chamberMeshes,
            false
          );
        }
      }
    });

    // If we hit a chamber, show info about it
    if (chamberIntersections.length > 0) {
      displayChamberInfo(chamberIntersections[0].object);
      return;
    }

    // Get interactive objects (pyramids and sphinx)
    const interactiveObjects = scene.children.filter(
      (child) =>
        child.userData &&
        (child.userData.details || child.userData.coincidences)
    );

    // Check for intersections
    const intersects = raycaster.intersectObjects(interactiveObjects, true);

    if (intersects.length > 0) {
      // Find the parent group (pyramid or sphinx)
      let selectedObject = intersects[0].object;
      while (
        selectedObject.parent &&
        !selectedObject.userData.details &&
        !selectedObject.userData.coincidences
      ) {
        selectedObject = selectedObject.parent;
      }

      if (
        selectedObject.userData.details ||
        selectedObject.userData.coincidences
      ) {
        displayObjectInfo(selectedObject);
      }
    }
  });

  // Add hover effect
  domElement.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Check for chamber intersections first (when visible)
    let chamberIntersections = [];
    let chamberMeshes = [];

    scene.traverse((object) => {
      if (object.name === "interiorChambers" && object.visible) {
        // Get all meshes within the chambers group
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            chamberMeshes.push(child);
          }
        });
      }
    });

    // Test for intersections with chamber meshes
    if (chamberMeshes.length > 0) {
      chamberIntersections = raycaster.intersectObjects(chamberMeshes, false);
    }

    // Check for interactions with pyramids
    const interactiveObjects = scene.children.filter(
      (child) =>
        child.userData &&
        (child.userData.details || child.userData.coincidences)
    );

    const pyramidIntersects = raycaster.intersectObjects(
      interactiveObjects,
      true
    );

    // Reset cursor
    document.body.style.cursor = "default";

    // Set cursor for chamber intersections
    if (chamberIntersections.length > 0) {
      document.body.style.cursor = "pointer";
    }
    // Set cursor for pyramid intersections
    else if (pyramidIntersects.length > 0) {
      document.body.style.cursor = "pointer";
    }
  });
}

// Display information about selected chamber
function displayChamberInfo(chamberObject) {
  const infoPanel = document.getElementById("info-panel");
  const coincidenceContainer = document.getElementById("coincidence-container");
  const panelHeader = document.querySelector(".panel-header h2");
  const panelContent = document.querySelector(".panel-content p");

  // Show the info panel
  infoPanel.classList.add("visible");

  // Update panel title
  panelHeader.textContent = chamberObject.name || "Chamber";

  // Clear previous content
  coincidenceContainer.innerHTML = "";

  // Add chamber description
  if (chamberObject.userData && chamberObject.userData.description) {
    panelContent.innerHTML = `<p>${chamberObject.userData.description}</p>`;
  } else {
    panelContent.innerHTML = `<p>Interior chamber of the pyramid</p>`;
  }

  // Find the pyramid containing this chamber
  let pyramidParent = chamberObject;
  while (pyramidParent.parent && !pyramidParent.userData.details) {
    pyramidParent = pyramidParent.parent;
  }

  // Add link to parent pyramid
  if (pyramidParent.userData && pyramidParent.userData.details) {
    const pyramidLink = document.createElement("div");
    pyramidLink.className = "coincidence-card";
    pyramidLink.innerHTML = `
            <h3>Part of ${pyramidParent.name}</h3>
            <p>This chamber is an internal structure of the ${pyramidParent.name} pyramid.</p>
        `;
    coincidenceContainer.appendChild(pyramidLink);
  }
}

// Display information about selected object
function displayObjectInfo(object) {
  const infoPanel = document.getElementById("info-panel");
  const coincidenceContainer = document.getElementById("coincidence-container");
  const panelHeader = document.querySelector(".panel-header h2");
  const panelContent = document.querySelector(".panel-content p");

  // Show the info panel
  infoPanel.classList.add("visible");

  // Update panel title
  panelHeader.textContent = object.name || "Selected Object";

  // Clear previous content
  coincidenceContainer.innerHTML = "";

  // Add basic information
  if (object.userData.details) {
    const details = object.userData.details;

    // Create HTML content
    let detailsHTML = "";

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
      details.facts.forEach((fact) => {
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
    coincidenceContainer.innerHTML = "<h3>Mathematical Coincidences</h3>";

    object.userData.coincidences.forEach((coincidence) => {
      const card = document.createElement("div");
      card.className = "coincidence-card";
      card.innerHTML = `
                <h3>${coincidence.title}</h3>
                <p>${coincidence.description}</p>
            `;
      coincidenceContainer.appendChild(card);
    });
  }

  // Add information about interior chambers if they exist
  if (object.userData.chambers && object.userData.chambers.length > 0) {
    const chamberSection = document.createElement("div");
    chamberSection.innerHTML = "<h3>Interior Chambers</h3>";
    coincidenceContainer.appendChild(chamberSection);

    object.userData.chambers.forEach((chamber) => {
      const card = document.createElement("div");
      card.className = "coincidence-card";
      card.innerHTML = `
                <h3>${chamber.name}</h3>
                <p>${chamber.description}</p>
            `;
      coincidenceContainer.appendChild(card);
    });

    // Add tip about viewing interiors
    const interiorTip = document.createElement("div");
    interiorTip.style.marginTop = "15px";
    interiorTip.style.padding = "10px";
    interiorTip.style.backgroundColor = "rgba(255, 215, 0, 0.1)";
    interiorTip.style.border = "1px dashed rgba(255, 215, 0, 0.3)";
    interiorTip.style.borderRadius = "5px";
    interiorTip.innerHTML = `
            <p><strong>Tip:</strong> Click the "Show Interiors" button to visualize the internal chambers and passageways of the pyramids.</p>
        `;
    coincidenceContainer.appendChild(interiorTip);
  }
}

// Set up keyboard navigation
function setupKeyboardControls(camera, particleSystem, interiorsVisible) {
  window.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "i":
      case "I":
        // Toggle info panel
        document.getElementById("toggle-info").click();
        break;

      case "p":
      case "P":
        // Toggle particles
        document.getElementById("toggle-particles").click();
        break;

      case "c":
      case "C":
        // Toggle interior chambers
        document.getElementById("toggle-interiors").click();
        break;

      case "Escape":
        // Close info panel
        document.getElementById("info-panel").classList.remove("visible");
        break;

      case "r":
      case "R":
        // Reset camera
        camera.position.set(500, 300, 700);
        break;

      case "1":
        // Set time to sunrise
        document.getElementById("time-slider").value = 6;
        document
          .getElementById("time-slider")
          .dispatchEvent(new Event("input"));
        break;

      case "2":
        // Set time to noon
        document.getElementById("time-slider").value = 12;
        document
          .getElementById("time-slider")
          .dispatchEvent(new Event("input"));
        break;

      case "3":
        // Set time to sunset
        document.getElementById("time-slider").value = 18;
        document
          .getElementById("time-slider")
          .dispatchEvent(new Event("input"));
        break;

      case "4":
        // Set time to night
        document.getElementById("time-slider").value = 0;
        document
          .getElementById("time-slider")
          .dispatchEvent(new Event("input"));
        break;
    }
  });
}
