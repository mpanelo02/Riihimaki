// alert("hello world");
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

const scene = new THREE.Scene();
const canvas = document.getElementById("experience-canvas");
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


// let exhaustFan = null;
// let videoMesh = null;
let modelsLoaded = 0;
const totalModelsToLoad = 7;

let floorOneModel = null;
let floorTwoModel = null;
let floorThreeModel = null;
let floorFourModel = null;
let floorFiveModel = null;
let floorSixModel = null;
let isFloorOneHidden = false;
let isFloorTwoHidden = false;
let isFloorThreeHidden = false;
let isFloorFourHidden = false;
let isFloorFiveHidden = false;
let isFloorSixHidden = false;

let touchHappened = false;

let buttonSound = null;
let enterSound = null;
let isAudioLoaded = false;

// let video;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize( sizes.width, sizes.height );
renderer.setPixelRatio(Math.min( window.devicePixelRatio, 2));
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

// Some of our DOM elements, others are scattered in the file
let isModalOpen = false;
const modal = document.querySelector(".modal");
const modalbgOverlay = document.querySelector(".modal-bg-overlay");
const modalTitle = document.querySelector(".modal-title");
const modalDescription = document.querySelector(".modal-description");
const modalExitButton = document.querySelector(".modal-exit-button");
const modalVisitButton = document.querySelector(".modal-visit-button");


const modalContent = {
    Billboard: {
        title: "Contact Person 👋👩🏻‍🍳",
        content: "Mark Johnson Panelo is a CIC program master's student at Metropolia University of Applied Sciences. He is currently working on the Digital Twin project for the UrbanFarmLab. For more information about Mark, CLICK the link above.",
        link:"https://www.linkedin.com/in/mark-johnson-panelo-82030a325",
        image: "meCartoon.jpg",
    },
    Bulbasaur: {
        title: "Bulbasaur 🌱",
        content: "Is a Grass/Poison-type Pokémon introduced in Generation 1. It evolves into Ivysaur starting at level 16, which evolves into Venusaur starting at level 32. Bulbasaur is known as the Seed Pokémon.",
        // link:"https://www.metropolia.fi/en/rdi/collaboration-platforms/urbanfarmlab",
        // image: "Teacher.jpg",
    },
    Snorlax: {
        title: "Snorlax 🐼",
        content: "Is a Normal-type Pokémon introduced in Generation 1. It is known for its large size and its tendency to sleep in inconvenient locations. Snorlax is often considered a 'blocker' Pokémon due to its massive bulk.",
        // link:"https://www.metropolia.fi/en/rdi/collaboration-platforms/urbanfarmlab",
    },
    Pikachu: {
        title: "Pikachu 🐭",
        content: "Is an Electric-type Pokémon introduced in Generation 1. It is known for its small size and its ability to generate electricity. Pikachu is often considered the mascot of the Pokémon franchise.",
        // link:"https://www.metropolia.fi/en/rdi/collaboration-platforms/urbanfarmlab",
    },
};

function showModal(id) {
  playButtonSound();
  
  const content = modalContent[id];
  if (content) {
    modalTitle.textContent = content.title;
    modalDescription.textContent = content.content;

    if (content.link) {
      modalVisitButton.href = content.link;
      modalVisitButton.classList.remove("hidden");
    } else {
      modalVisitButton.classList.add("hidden");
    }
    modal.classList.remove("hidden");
    modalbgOverlay.classList.remove("hidden");
    isModalOpen = true;
  }
}

function hideModal() {
  isModalOpen = false;
  modal.classList.add("hidden");
  modalbgOverlay.classList.add("hidden");
  if (!isMuted) {
    playSound("projectsSFX");
  }
}

function onMouseMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  touchHappened = false;
}

function onTouchEnd(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  touchHappened = true;
  handleInteraction();
}

// Our Intersecting objects
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let intersectObject = "";
const intersectObjects = [];
const intersectObjectsNames = [
    "Billboard",
    "Bulbasaur",
    "Snorlax",
    "Pikachu",
    // "DashPartners",
    // "DashAbout",
    // "Thermometer",
    // "StrawBerries1",
];

// Loading screen and loading manager
const loadingScreen = document.getElementById("loadingScreen");
const enterButton = document.querySelector(".enter-button");

const manager = new THREE.LoadingManager();

manager.onLoad = function () {
  const t1 = gsap.timeline();

  t1.to(enterButton, {
    opacity: 1,
    duration: 0,
  });
  animateObjectsGrowth();
//   setupArrowButtonListeners();
};

const loader = new GLTFLoader();

loader.load( './RiihimakiEverything.glb', function ( glb ) {
  
  glb.scene.traverse((child) => {

    if (intersectObjectsNames.includes(child.name)) {
      intersectObjects.push(child);
    }

    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }

  });
  scene.add( glb.scene );
  modelsLoaded++;
  checkAllModelsLoaded();
}, undefined, function ( error ) {
  console.error( error );
  modelsLoaded++;
  checkAllModelsLoaded();
} );

loader.load('./Riihimaki1F.glb', function(gltf) {
  floorOneModel = gltf.scene;
  floorOneModel.traverse((child) => {

    if (intersectObjectsNames.includes(child.name)) {
      intersectObjects.push(child);
    }

    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }

  });
  scene.add(floorOneModel);
  modelsLoaded++;
  checkAllModelsLoaded();
}, undefined, function ( error ) {
  console.error( error );
  modelsLoaded++;
  checkAllModelsLoaded();
});
loader.load('./Riihimaki2F.glb', function(gltf) {
  floorTwoModel = gltf.scene;
  floorTwoModel.traverse((child) => {

    if (intersectObjectsNames.includes(child.name)) {
      intersectObjects.push(child);
    }

    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }

  });
  scene.add(floorTwoModel);
  modelsLoaded++;
  checkAllModelsLoaded();
}, undefined, function ( error ) {
  console.error( error );
  modelsLoaded++;
  checkAllModelsLoaded();
});
loader.load('./Riihimaki3F.glb', function(gltf) {
  floorThreeModel = gltf.scene;
  floorThreeModel.traverse((child) => {

    if (intersectObjectsNames.includes(child.name)) {
      intersectObjects.push(child);
    }

    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }

  });
  scene.add(floorThreeModel);
  modelsLoaded++;
  checkAllModelsLoaded();
}, undefined, function ( error ) {
  console.error( error );
  modelsLoaded++;
  checkAllModelsLoaded();
});
loader.load('./Riihimaki4F.glb', function(gltf) {
  floorFourModel = gltf.scene;
  floorFourModel.traverse((child) => {


    if (intersectObjectsNames.includes(child.name)) {
      intersectObjects.push(child);
    }

    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }


  });
  scene.add(floorFourModel);
  modelsLoaded++;
  checkAllModelsLoaded();
}, undefined, function ( error ) {
  console.error( error );
  modelsLoaded++;
  checkAllModelsLoaded();
});
loader.load('./Riihimaki5F.glb', function(gltf) {
  floorFiveModel = gltf.scene;
  floorFiveModel.traverse((child) => {

    if (intersectObjectsNames.includes(child.name)) {
      intersectObjects.push(child);
    }

    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }

  });
  scene.add(floorFiveModel);
  modelsLoaded++;
  checkAllModelsLoaded();
}, undefined, function ( error ) {
  console.error( error );
  modelsLoaded++;
  checkAllModelsLoaded();
});
loader.load('./Riihimaki6F.glb', function(gltf) {
  floorSixModel = gltf.scene;
  floorSixModel.traverse((child) => {

    if (intersectObjectsNames.includes(child.name)) {
      intersectObjects.push(child);
    }

    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }

  });
  scene.add(floorSixModel);
  modelsLoaded++;
  checkAllModelsLoaded();
}, undefined, function ( error ) {
  console.error( error );
  modelsLoaded++;
  checkAllModelsLoaded();
});


const sun = new THREE.DirectionalLight( 0xFFFFFF );
sun.castShadow = true;
// sun.position.set( -2, 5, -2 );
sun.position.set( -40, 40, 40 );
sun.target.position.set( 0, 0, 0 );
sun.shadow.mapSize.width = 4096;
sun.shadow.mapSize.height = 4096;
sun.shadow.camera.left = -50;
sun.shadow.camera.right = 50;
sun.shadow.camera.top = 50;
sun.shadow.camera.bottom = -50;
sun.shadow.normalBias = 0.2;
scene.add( sun );

const light = new THREE.AmbientLight( 0x404040, 4 );
scene.add( light );

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 1000 );
camera.position.set(-30, 17, 45); // <-- Initial / Start position (X, Y, Z)
camera.lookAt(0, 7, 0); // <-- Where the camera is pointing (X, Y, Z)

const controls = new OrbitControls( camera, canvas );
controls.target.set(0, 1.5, 0);
controls.update();


function onResize() {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    const aspect = sizes.width / sizes.height;
    camera.left = -aspect * 50;
    camera.right = aspect * 50;
    camera.top = 50;
    camera.bottom = -50;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min( window.devicePixelRatio, 2));
}

function onClick() {
  if (touchHappened) return;
  handleInteraction();
}

function handleInteraction() {
  if (!modal.classList.contains("hidden")) {
    return;
  }

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(intersectObjects);

  if (intersects.length > 0) {
    intersectObject = intersects[0].object.parent.name;
  } else {
    intersectObject = "";
  }

  if (intersectObject !== "") {
    if (
      [
        // "Bulbasaur",
        // "Chicken",
        // "Pikachu",
        // "Charmander",
        // "Squirtle",
        // "Snorlax",
      ].includes(intersectObject)
    ) {
      if (isCharacterReady) {
        if (!isMuted) {
          playSound("pokemonSFX");
        }
        jumpCharacter(intersectObject);
        isCharacterReady = false;
      }
    } else {
      if (intersectObject) {
        showModal(intersectObject);
        if (!isMuted) {
          playSound("projectsSFX");
        }
      }
    }
  }
}



// Modal exit button
modalExitButton.addEventListener("click", function() {
    playButtonSound();
    hideModal();
});
modalbgOverlay.addEventListener("click", hideModal);
window.addEventListener("resize", onResize);
window.addEventListener("click", onClick);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("touchend", onTouchEnd, { passive: false });

const threeDToggleButton = document.getElementById('threeDToggleButton');
let is3DMode = true;

// Add this function to handle the 2D/3D toggle
function toggleViewMode() {
    is3DMode = !is3DMode;

    threeDToggleButton.textContent = is3DMode ? '3D' : '2D';

    if (is3DMode) {
        // Switch to 3D mode
        // camera.position.set(-15, 10, 30);
        camera.lookAt(0, 7, 0);
        threeDToggleButton.style.backgroundColor = '#717dad';
    } else {
        // Switch to 2D mode (top-down view)
        // camera.position.set(0, 30, 0);
        camera.lookAt(0, 0, 0);
        threeDToggleButton.style.backgroundColor = '#455bb5';
    }
    
    // Update controls target
    controls.target.set(0, is3DMode ? 1.5 : 0, 0);
    controls.update();
}

// Add event listeners for the 2D/3D buttons
threeDToggleButton.addEventListener('click', function() {
    playButtonSound();
    toggleViewMode();
});


function checkAllModelsLoaded() {
  if (modelsLoaded >= totalModelsToLoad) {
    setupArrowButtonListeners();
  }
}

function setupArrowButtonListeners() {
  const arrowDownButton = document.getElementById('arrowDownToggleButton');
  const arrowUpButton = document.getElementById('arrowUpToggleButton');
  const levelContainer = document.getElementById('level-container');
  
  arrowDownButton.addEventListener('click', () => {
    playButtonSound();

    if (!isFloorSixHidden) {
      // First click: Hide the roof
      if (floorSixModel) {
        floorSixModel.visible = false;
        isFloorSixHidden = true;
        levelContainer.textContent = '5F';
      }
    } else if (!isFloorFiveHidden) {
      // Second click: Hide the fifth floor
      if (floorFiveModel) {
        floorFiveModel.visible = false;
        isFloorFiveHidden = true;
        levelContainer.textContent = '4F';
      }
    } else if (!isFloorFourHidden) {
      // Third click: Hide the fourth floor
      if (floorFourModel) {
        floorFourModel.visible = false;
        isFloorFourHidden = true;
        levelContainer.textContent = '3F';
      }
    } else if (!isFloorThreeHidden) {
      // Fourth click: Hide the third floor
      if (floorThreeModel) {
        floorThreeModel.visible = false;
        isFloorThreeHidden = true;
        levelContainer.textContent = '2F';
      }
    } else if (!isFloorTwoHidden) {
      // Fifth click: Hide the second floor
      if (floorTwoModel) {
        floorTwoModel.visible = false;
        isFloorTwoHidden = true;
        levelContainer.textContent = 'GF';
      }
    } else if (!isFloorOneHidden) {
      // Second click: Hide the first floor
      if (floorOneModel) {
        floorOneModel.visible = false;
        isFloorOneHidden = true;
        levelContainer.textContent = 'LG';
      }
    } else {
      // Third click: Nothing happens (both are already hidden)
      // arrowDownButton.textContent = arrowDownPin;
    }
  });
  
  arrowUpButton.addEventListener('click', () => {
    playButtonSound();

    if (isFloorOneHidden) {
      // First click: Show the second floor
      if (floorOneModel) {
        floorOneModel.visible = true;
        isFloorOneHidden = false;
        levelContainer.textContent = 'GF';
      }
    } else if (isFloorTwoHidden) {
      // Second click: Show the roof
      if (floorTwoModel) {
        floorTwoModel.visible = true;
        isFloorTwoHidden = false;
        levelContainer.textContent = '2F';
      }
    } else if (isFloorThreeHidden) {
      // Second click: Show the roof
      if (floorThreeModel) {
        floorThreeModel.visible = true;
        isFloorThreeHidden = false;
        levelContainer.textContent = '3F';
      }
    } else if (isFloorFourHidden) {
      // Second click: Show the roof
      if (floorFourModel) {
        floorFourModel.visible = true;
        isFloorFourHidden = false;
        levelContainer.textContent = '4F';
      }
    } else if (isFloorFiveHidden) {
      // Second click: Show the roof
      if (floorFiveModel) {
        floorFiveModel.visible = true;
        isFloorFiveHidden = false;
        levelContainer.textContent = '5F';
      }
    } else if (isFloorSixHidden) {
      // Second click: Show the roof
      if (floorSixModel) {
        floorSixModel.visible = true;
        isFloorSixHidden = false;
        levelContainer.textContent = 'RD';
      }
    } else {
      // If both are already visible, do nothing or reset text
      // arrowUpButton.textContent = arrowUpPin;
    }
  });
}


// Codes for Display of Time and Date
function updateDateTime() {
    const now = new Date();
    const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString(undefined, optionsDate);

    const formattedTime = now.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    document.getElementById('vantaa-date').textContent = formattedDate;
    document.getElementById('vantaa-clock').textContent = formattedTime;
}

updateDateTime();
setInterval(updateDateTime, 1000);

enterButton.addEventListener("click", () => {
  playEnterSound();
    playButtonSound();

    gsap.to(loadingScreen, {
        opacity: 0,
        duration: 1,
        onComplete: () => {
          
            loadingScreen.remove();
            document.getElementById("mainContent").style.display = "block";

            // Start growth animation after 500 milliseconds
            setTimeout(() => {
                animateObjectsGrowth();
            }, 500);
        },
    });

});

const themeToggleButton = document.querySelector(".theme-mode-toggle-button");
const firstIcon = document.querySelector(".first-icon");
const secondIcon = document.querySelector(".second-icon");

let isBright = true;

// Toggle Theme Function
function toggleTheme() {
  isBright = !isBright;

  const isDarkTheme = document.body.classList.contains("dark-theme");
  document.body.classList.toggle("dark-theme");
  document.body.classList.toggle("light-theme");

  if (firstIcon.style.display === "none") {
    firstIcon.style.display = "block";
    secondIcon.style.display = "none";
  } else {
    firstIcon.style.display = "none";
    secondIcon.style.display = "block";
  }

  gsap.to(light.color, {
    r: isDarkTheme ? 1.0 : 0.25,
    g: isDarkTheme ? 1.0 : 0.31,
    // b: isDarkTheme ? 1.0 : 0.78,
    b: isDarkTheme ? 1.0 : 0.48,
    duration: 1,
    ease: "power2.inOut",
  });

  gsap.to(light, {
    intensity: isDarkTheme ? 0.8 : 0.9,
    duration: 1,
    ease: "power2.inOut",
  });

  gsap.to(sun, {
    intensity: isDarkTheme ? 1 : 0.8,
    duration: 1,
    ease: "power2.inOut",
  });

  gsap.to(sun.color, {
    r: isDarkTheme ? 1.0 : 0.25,
    g: isDarkTheme ? 1.0 : 0.21,
    // b: isDarkTheme ? 1.0 : 0.88,
    b: isDarkTheme ? 1.0 : 0.28,
    duration: 1,
    ease: "power2.inOut",
  });

  renderer.setClearColor(isBright ? 0xeeeeee : 0x111111, 1);

  const containers = [
    document.getElementById('vantaa-date-container'),
    document.getElementById('vantaa-time-container'),
    // document.getElementById('level-container'),

  ];  

  const newFontColor = isBright ? 'black' : 'white';
  containers.forEach(container => {
    if (container) {
      container.style.color = newFontColor;
    }
  });
}

// Theme toggle button
themeToggleButton.addEventListener("click", function() {
    playButtonSound();
    toggleTheme();
});

function initAudio() {
    buttonSound = document.getElementById('buttonSound');
    enterSound = document.getElementById('enterSound');

    // Set volume levels (0.0 to 1.0)
    buttonSound.volume = 0.1; // Adjust as needed
    enterSound.volume = 0.05; // Lower volume for PlantsVsZombies sound

    // Set the enterSound to loop continuously
    enterSound.loop = true;
    
    buttonSound.addEventListener('canplaythrough', () => {
        isAudioLoaded = true;
    });

    enterSound.addEventListener('canplaythrough', () => { // Add this event listener
        // You might want to track this separately if needed
    });
    
    buttonSound.addEventListener('error', () => {
        console.error("Error loading audio file");
    });

    enterSound.addEventListener('error', () => { // Add error handling
        console.error("Error loading enter audio file");
    });
    
    // Preload the audio
    buttonSound.load();
    enterSound.load();
}

function playEnterSound() {
    if (enterSound) {
        enterSound.volume = 0.05; // Set volume to 5%
        enterSound.currentTime = 0; // Reset to start
        enterSound.play().catch(e => {
            console.log("Enter audio play failed:", e);
        });
    }
}

function playButtonSound() {
    if (isAudioLoaded && buttonSound) {
        buttonSound.currentTime = 0; // Reset to start
        buttonSound.play().catch(e => {
            console.log("Audio play failed:", e);
        });
    }
}

// Initialize audio when the document is ready
document.addEventListener('DOMContentLoaded', initAudio);

// View Controls
function animate() {
  // View Controls
    if (is3DMode) {
        controls.maxDistance = 90;
        controls.minDistance = 3;
        controls.minPolarAngle = THREE.MathUtils.degToRad(35);
        controls.maxPolarAngle = THREE.MathUtils.degToRad(70);
    } else {
        // 2D mode restrictions - limit movement for top-down view
        controls.maxDistance = 80;
        controls.minDistance = 10;
        controls.minPolarAngle = THREE.MathUtils.degToRad(0);
        controls.maxPolarAngle = THREE.MathUtils.degToRad(0);
    }

  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  if (controls.target.x > 10) controls.target.x = 10;
  if (controls.target.x < -9) controls.target.x = -9;
  if (controls.target.z > 10) controls.target.z = 10;
  if (controls.target.z < -9) controls.target.z = -9;
  if (controls.target.y > 8) controls.target.y = 8;
  if (controls.target.y < 2) controls.target.y = 2;


  controls.update();

  raycaster.setFromCamera( pointer, camera );

	const intersects = raycaster.intersectObjects(intersectObjects);

    if ( intersects.length > 0 ) {
        document.body.style.cursor = 'pointer';
    } else {
        document.body.style.cursor = 'default';
        intersectObject = "";
    }

	for ( let i = 0; i < intersects.length; i ++ ) {
        intersectObject = intersects[0].object.parent.name;
	}


    renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );
