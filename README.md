# Pyramids Explorer: Mathematical Mysteries

Embark on a virtual journey to the Giza plateau with this interactive 3D web application. Explore the Great Pyramids and delve into the fascinating mathematical properties and potential "coincidences" associated with their ancient construction.

**Live Demo:** [https://pyramids-ten.vercel.app](https://pyramids-ten.vercel.app)

## What it Does

Pyramids Explorer uses Three.js to render a 3D scene featuring the Khufu, Khafre, Menkaure, and Queens' Pyramids. Users can navigate the environment, click on structures to learn historical facts, and explore intriguing mathematical concepts like the potential encoding of Pi (π), the Golden Ratio (φ), astronomical alignments (Orion Correlation), and even debated connections to the speed of light. The application features dynamic lighting that simulates the passage of time from sunrise to sunset and night.

## Key Features

*   **Interactive 3D Scene:** Navigate a detailed 3D model of the Giza pyramid complex.
*   **Dynamic Day/Night Cycle:** Control time with a slider, affecting sunlight direction, color, shadows, fog, sky appearance, and even revealing stars at night.
*   **Pyramid Information:** Click on individual pyramids (Khufu, Khafre, Menkaure, Queens') to open an info panel detailing their history, dimensions, and key facts.
*   **Mathematical Mysteries:** Explore descriptions of potential mathematical coincidences embedded in the pyramids' design (Pi, Phi, Speed of Light, etc.).
*   **Interior Visualization:** Toggle a special view to see simplified internal chambers and passages within the major pyramids.
*   **Atmospheric Effects:** Optional particle effects add to the scene's ambiance.
*   **Keyboard Shortcuts:** Use keys for quick navigation and control (toggle info, particles, interiors, reset view, set time).
*   **Cinematic Intro:** An engaging introduction sets the stage before exploration begins.

## How it Works

*   **3D Engine:** Leverages the power of Three.js (a JavaScript 3D library) to create and render the scene, including geometry, materials, lighting, and camera controls.
*   **Frontend:** Built entirely with HTML, CSS, and JavaScript (using ES Modules). Interaction, controls, and dynamic updates are handled client-side.
*   **Graphics:** Utilizes WebGL via Three.js for hardware-accelerated graphics rendering in the browser.
*   **Data:** Pyramid details and mathematical information are likely hardcoded within the JavaScript files.