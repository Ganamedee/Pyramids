// Setup information panel with mathematical coincidences
export function setupInfoPanel(pyramids) {
  // Populate the coincidence container with general information
  const coincidenceContainer = document.getElementById("coincidence-container");

  // Add introduction section
  const introSection = document.createElement("div");
  introSection.innerHTML = `
        <h3 class="section-title">Welcome to the Great Pyramids Explorer</h3>
        <p>Click on pyramids to learn more about them and their mathematical mysteries.</p>
        <p>Use the controls to change lighting and toggle particle effects or interior chambers.</p>
        <div class="coincidence-card">
            <h3>Mathematical Precision</h3>
            <p>The ancient Egyptians built these pyramids with remarkable mathematical precision, 
            incorporating various mathematical principles that have fascinated scholars for centuries.</p>
        </div>
        <div class="coincidence-card">
            <h3>Astronomical Alignment</h3>
            <p>The Giza Pyramid complex is aligned with astronomical precision. 
            The sides of the Great Pyramid are aligned almost exactly with the four cardinal directions, 
            with an error of less than 0.1 degrees.</p>
        </div>
    `;
  coincidenceContainer.appendChild(introSection);

  // Add Orion Correlation Theory section
  const orionSection = document.createElement("div");
  orionSection.className = "coincidence-card";
  orionSection.innerHTML = `
        <h3>Orion Correlation Theory</h3>
        <p>The three main pyramids at Giza align precisely with the three stars of Orion's Belt: 
        Alnitak, Alnilam, and Mintaka. The relative sizes of the pyramids even correlate with the 
        relative brightness of these stars.</p>
    `;
  coincidenceContainer.appendChild(orionSection);

  // Add Queens' Pyramids section
  const queensSection = document.createElement("div");
  queensSection.innerHTML = `
        <h3 class="section-title">The Queens' Pyramids</h3>
        <p>To the east of Khufu's Great Pyramid stand three smaller pyramids known as the "Queens' Pyramids." 
        Despite their name, these structures were likely built for important royal women who may have been Khufu's 
        mother (Hetepheres I) and wives (Meritites I and Henutsen).</p>
        
        <div class="info-card">
            <h3>Eastern Pyramid (G1-a)</h3>
            <p>The easternmost and largest of the three Queens' Pyramids is believed to be the tomb of Queen Hetepheres I, 
            Khufu's mother. Archaeological findings in this area provided valuable insights into royal burials of the 
            Fourth Dynasty, including jewelry, furniture, and ceremonial items.</p>
        </div>
        
        <div class="info-card">
            <h3>Middle Pyramid (G1-b)</h3>
            <p>The middle pyramid is attributed to Queen Meritites I, one of Khufu's principal wives. 
            This pyramid follows the same architectural principles as the larger pyramids but on a smaller scale, 
            demonstrating the importance of mathematical proportions in Egyptian architecture.</p>
        </div>
        
        <div class="info-card">
            <h3>Western Pyramid (G1-c)</h3>
            <p>The western and smallest Queens' Pyramid is associated with Queen Henutsen, another wife of Khufu. 
            Interestingly, this structure was later converted into a temple dedicated to Isis, the goddess of healing and magic, 
            during the 21st Dynasty (around 1070-945 BCE), showing the evolving religious significance of these monuments.</p>
        </div>
    `;
  coincidenceContainer.appendChild(queensSection);

  // Add Interior Chambers section
  const interiorSection = document.createElement("div");
  interiorSection.innerHTML = `
        <h3 class="section-title">Interior Chambers</h3>
        <p>The Great Pyramids contain fascinating internal structures that were designed with precise engineering and 
        astronomical alignments. Click the "Show Interiors" button to view these internal chambers and passages.</p>
        
        <div class="chamber-highlight">
            <h3>Khufu's Chambers</h3>
            <p>The Great Pyramid of Khufu contains several chambers connected by corridors. The King's Chamber, made entirely 
            of granite, features an engineering marvel called "relieving chambers" that distribute the enormous weight above it. 
            The Queen's Chamber (not actually for the queen) and the Grand Gallery, with its precise corbeled ceiling, 
            demonstrate incredible architectural achievement.</p>
        </div>
        
        <div class="chamber-highlight">
            <h3>Khafre's Chambers</h3>
            <p>Khafre's pyramid has a simpler internal structure with two entrance passages leading to a single burial chamber. 
            Unlike Khufu's pyramid, this structure doesn't have multiple chambers above ground level.</p>
        </div>
        
        <div class="chamber-highlight">
            <h3>Menkaure's Chambers</h3>
            <p>The smallest of the three major pyramids, Menkaure's contains an upper and lower burial chamber. The upper chamber 
            features a unique design with a ceiling carved to resemble wooden beams, blending symbolic and structural elements.</p>
        </div>
    `;
  coincidenceContainer.appendChild(interiorSection);

  // Add general information about the mathematical coincidences
  const mathCoincidences = [
    {
      title: "The Relationship to Pi (π)",
      description:
        "If you divide the perimeter of the Great Pyramid by twice its height, you get a value remarkably close to π (3.14159...). The value comes out to approximately 3.142, showing that the ancient Egyptians may have understood this fundamental mathematical constant thousands of years before it was 'officially' calculated.",
    },
    {
      title: "The Golden Ratio (φ)",
      description:
        "The ratio of the slant height to half the base length of the Great Pyramid is approximately 1.618, which is very close to the Golden Ratio (φ). This ratio appears throughout nature and is considered aesthetically pleasing.",
    },
    {
      title: "Speed of Light Coincidence",
      description:
        "The geographical coordinates of the Great Pyramid (29.9792458° N) closely match the speed of light in a vacuum (299,792,458 meters per second). While this is likely a coincidence, it has fueled much speculation.",
    },
    {
      title: "Earth's Dimensions",
      description:
        "When the height of the Great Pyramid is multiplied by 1,000,000,000, it approximates the distance from Earth to the Sun. Additionally, the perimeter of the base divided by 25.052 equals the circumference of Earth at the equator.",
    },
  ];

  // Create a dedicated section for mathematical coincidences
  const mathSection = document.createElement("div");
  mathSection.innerHTML = `<h3 class="section-title">Mathematical Coincidences</h3>`;
  coincidenceContainer.appendChild(mathSection);

  mathCoincidences.forEach((item) => {
    const card = document.createElement("div");
    card.className = "coincidence-card";
    card.innerHTML = `
            <h3>${item.title}</h3>
            <p>${item.description}</p>
        `;
    coincidenceContainer.appendChild(card);
  });

  // Add disclaimer
  const disclaimer = document.createElement("div");
  disclaimer.innerHTML = `
        <p class="disclaimer" style="margin-top: 20px; font-style: italic; font-size: 0.9em;">
            Note: While some of these mathematical relationships are based on precise measurements, 
            others are approximate or may be coincidental. Modern scholarship continues to debate 
            the intentionality behind these mathematical properties.
        </p>
    `;
  coincidenceContainer.appendChild(disclaimer);

  // Add keyboard shortcuts information with improved styling
  const keyboardInfo = document.createElement("div");
  keyboardInfo.className = "keyboard-shortcuts";
  keyboardInfo.innerHTML = `
        <h3>Keyboard Shortcuts</h3>
        <ul>
            <li><strong>I</strong> Toggle info panel</li>
            <li><strong>P</strong> Toggle particle effects</li>
            <li><strong>C</strong> Toggle interior chambers</li>
            <li><strong>ESC</strong> Close info panel</li>
            <li><strong>R</strong> Reset camera position</li>
            <li><strong>1-4</strong> Set time (Sunrise, Noon, Sunset, Night)</li>
        </ul>
    `;
  coincidenceContainer.appendChild(keyboardInfo);

  // Add time markers to slider
  addTimeMarkers();
}

// Add time markers below the slider
function addTimeMarkers() {
  const sliderContainer = document.querySelector(".slider-container");

  // Create time markers container
  const timeMarkers = document.createElement("div");
  timeMarkers.className = "time-markers";

  // Add markers for midnight, dawn, noon, dusk, midnight
  const markers = [
    { value: "0h", label: "Midnight" },
    { value: "6h", label: "Dawn" },
    { value: "12h", label: "Noon" },
    { value: "18h", label: "Dusk" },
    { value: "24h", label: "Midnight" },
  ];

  markers.forEach((marker) => {
    const markerElement = document.createElement("div");
    markerElement.className = "time-marker";
    markerElement.textContent = marker.label;
    timeMarkers.appendChild(markerElement);
  });

  // Add markers after the slider
  sliderContainer.appendChild(timeMarkers);
}
