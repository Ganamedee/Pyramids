// Setup information panel with mathematical coincidences
export function setupInfoPanel(pyramids) {
    // Populate the coincidence container with general information
    const coincidenceContainer = document.getElementById('coincidence-container');
    
    // Add introduction section
    const introSection = document.createElement('div');
    introSection.innerHTML = `
        <h3>Welcome to the Great Pyramids Explorer</h3>
        <p>Click on pyramids to learn more about them and their mathematical mysteries.</p>
        <p>Use the controls to change lighting and toggle particle effects.</p>
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
    const orionSection = document.createElement('div');
    orionSection.className = 'coincidence-card';
    orionSection.innerHTML = `
        <h3>Orion Correlation Theory</h3>
        <p>The three main pyramids at Giza align precisely with the three stars of Orion's Belt: 
        Alnitak, Alnilam, and Mintaka. The relative sizes of the pyramids even correlate with the 
        relative brightness of these stars.</p>
    `;
    coincidenceContainer.appendChild(orionSection);
    
    // Add general information about the mathematical coincidences
    const mathCoincidences = [
        {
            title: "The Relationship to Pi (π)",
            description: "If you divide the perimeter of the Great Pyramid by twice its height, you get a value remarkably close to π (3.14159...). The value comes out to approximately 3.142, showing that the ancient Egyptians may have understood this fundamental mathematical constant thousands of years before it was 'officially' calculated."
        },
        {
            title: "The Golden Ratio (φ)",
            description: "The ratio of the slant height to half the base length of the Great Pyramid is approximately 1.618, which is very close to the Golden Ratio (φ). This ratio appears throughout nature and is considered aesthetically pleasing."
        },
        {
            title: "Speed of Light Coincidence",
            description: "The geographical coordinates of the Great Pyramid (29.9792458° N) closely match the speed of light in a vacuum (299,792,458 meters per second). While this is likely a coincidence, it has fueled much speculation."
        },
        {
            title: "Earth's Dimensions",
            description: "When the height of the Great Pyramid is multiplied by 1,000,000,000, it approximates the distance from Earth to the Sun. Additionally, the perimeter of the base divided by 25.052 equals the circumference of Earth at the equator."
        }
    ];
    
    mathCoincidences.forEach(item => {
        const card = document.createElement('div');
        card.className = 'coincidence-card';
        card.innerHTML = `
            <h3>${item.title}</h3>
            <p>${item.description}</p>
        `;
        coincidenceContainer.appendChild(card);
    });
    
    // Add disclaimer
    const disclaimer = document.createElement('div');
    disclaimer.innerHTML = `
        <p class="disclaimer" style="margin-top: 20px; font-style: italic; font-size: 0.9em;">
            Note: While some of these mathematical relationships are based on precise measurements, 
            others are approximate or may be coincidental. Modern scholarship continues to debate 
            the intentionality behind these mathematical properties.
        </p>
    `;
    coincidenceContainer.appendChild(disclaimer);
    
    // Add keyboard shortcuts information
    const keyboardInfo = document.createElement('div');
    keyboardInfo.style.marginTop = '20px';
    keyboardInfo.style.padding = '15px';
    keyboardInfo.style.border = '1px dashed rgba(255, 215, 0, 0.3)';
    keyboardInfo.style.borderRadius = '5px';
    keyboardInfo.innerHTML = `
        <h3>Keyboard Shortcuts</h3>
        <ul style="list-style-type: none; padding-left: 5px;">
            <li><strong>I</strong> - Toggle info panel</li>
            <li><strong>P</strong> - Toggle particle effects</li>
            <li><strong>ESC</strong> - Close info panel</li>
            <li><strong>R</strong> - Reset camera position</li>
        </ul>
    `;
    coincidenceContainer.appendChild(keyboardInfo);
}
