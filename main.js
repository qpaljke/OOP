import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Planet } from "/Entities/Planet";
import { Orbit } from '/Entities/Orbit';
import { Coordinates } from './Entities/Coordinates';
import { RGBELoader } from './RGBELoader';

import './style.css'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 3000 );
camera.position.z = 150;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

new RGBELoader().load(
  './stars4k.hdr',
  (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
  }
)

scene.backgroundColor = new THREE.CubeTexture('./HDR_hazy_nebulae.hdr')

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

async function info_read_json(filename) {
  try {
      const response = await fetch(filename);
      const data = await response.json();
      const planets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
      const planets_info_json = {}; 

      planets.forEach(element => {
          if (data[element] !== undefined) {
              planets_info_json[element.toLowerCase()] = data[element];
          } else {
              console.warn(`Data for ${element} is missing or incomplete.`);
          }
      });

      return planets_info_json;
  } catch (error) {
      console.error(`Error fetching: ${error}`);
      return {};
  }
}


const orbitColor = '#2A2A2A'

const canvas = document.querySelector('.canvas');

const mercuryOrbit = new Orbit(scene, 11, '#857756', -2, 0.5)
const mercury = new Planet(scene, 1, 64, 64, '#857756', mercuryOrbit, Math.PI/2, 'Mercury');

const venusOrbit = new Orbit(scene, 21, '#B9933E', 1, -0.5);
const venus = new Planet(scene, 1, 64, 64, '#B9933E', venusOrbit, 0, 'Venus');


const earthOrbit = new Orbit(scene, 30, '#355C3F', 1, -1);
const earth = new Planet(scene, 1.3, 64, 64, '#355C3F', earthOrbit, 0, 'Earth');

const marsOrbit = new Orbit(scene, 45, '#443723', -1, -1);
const mars = new Planet(scene, 1, 64, 64, '#443723', marsOrbit, 0, 'Mars');

const sunGeometry = new Planet(scene, 3, 64, 64, 0xffff00, {radius: 0}, 0, 'Sun');
sunGeometry.addPlanet();


const jupiterOrbit = new Orbit(scene, 100, '#BDA279', 5, 5);
const jupiter = new Planet(scene, 3, 64, 64, '#BDA279', jupiterOrbit, 0, 'Jupiter');

const saturnOrbit = new Orbit(scene, 175, '#D1BD9F');
const saturn = new Planet(scene, 3, 64, 64, '#D1BD9F', saturnOrbit, 0, 'Saturn');

const uranusOrbit = new Orbit(scene, 350, '#82D5D7', -20, -20);
const uranus = new Planet(scene, 4, 64, 64, '#82D5D7', uranusOrbit, 0, 'Uranus');

const neptuneOrbit = new Orbit(scene, 450, '#4B8DD0', 20, 20);
const neptune = new Planet(scene, 3, 64, 64, '#4B8DD0', neptuneOrbit, 0, 'Neptune');

saturnOrbit.addOrbit();
saturn.addPlanet();

uranusOrbit.addOrbit();
uranus.addPlanet();

neptuneOrbit.addOrbit();
neptune.addPlanet();

jupiterOrbit.addOrbit();
jupiter.addPlanet();

marsOrbit.addOrbit();
mars.addPlanet();

venusOrbit.addOrbit();
venus.addPlanet();

earthOrbit.addOrbit();
earth.addPlanet();

mercuryOrbit.addOrbit();
mercury.addPlanet();

const data = fetch('planets_info.json');
console.log(data);

const planets_objects = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune];
for (let i = 0; i < planets_objects.length; i++){
  planets_objects[i].imageUrl = `./static/planet_${i+1}.jpg`;
}

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
  renderer.render(scene, camera);
});

window.addEventListener('dblclick', () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    canvas.requestFullscreen();
  }
});

const controls = new OrbitControls(camera, renderer.domElement);

const coordinates = new Coordinates();
coordinates.read_json('coordinates.json')
    .then(planet_coordinates => {
        addAngles(planet_coordinates);
        animate();
    })
    .catch(error => {
        console.error('Error fetching coordinates:', error);
    });

function addAngles(planet_coordinates) {
    mercury.angle += planet_coordinates[0];
    venus.angle += planet_coordinates[1];
    earth.angle += planet_coordinates[2];
    mars.angle += planet_coordinates[3];
    jupiter.angle += planet_coordinates[4];
    saturn.angle += planet_coordinates[5];
    uranus.angle += planet_coordinates[6];
    neptune.angle += planet_coordinates[7];

    mercury.updatePosition();
    venus.updatePosition();
    earth.updatePosition();
    mars.updatePosition();
    jupiter.updatePosition();
    saturn.updatePosition();
    uranus.updatePosition();
    neptune.updatePosition();
}

const increaseSpeedButton = document.getElementById('increaseSpeedButton');
const decreaseSpeedButton = document.getElementById('decreaseSpeedButton');
const speedLabel = document.getElementById('speedLabel');
let speedMultiplier = 1;

const speedValues = [
  1, 3, 10, 30, 60, 300, 600, 1800, 3600, 
  3 * 3600, 10 * 3600, 24 * 3600, 5 * 24 * 3600, 
  7 * 24 * 3600, 3 * 7 * 24 * 3600, 30 * 24 * 3600, 
  3 * 30 * 24 * 3600, 6 * 30 * 24 * 3600, 
  12 * 30 * 24 * 3600, 3 * 12 * 30 * 24 * 3600
];

increaseSpeedButton.addEventListener('click', () => {
  let currentIndex = speedValues.indexOf(speedMultiplier);
  if (currentIndex !== -1 && currentIndex < speedValues.length - 1) {
    speedMultiplier = speedValues[currentIndex + 1];
  }
  updateButtonAppearance(increaseSpeedButton);
  updateSpeedLabel();
});

decreaseSpeedButton.addEventListener('click', () => {
  let currentIndex = speedValues.indexOf(speedMultiplier);
  if (currentIndex > 0) {
    speedMultiplier = speedValues[currentIndex - 1];
  }
  updateButtonAppearance(decreaseSpeedButton);
  updateSpeedLabel();
});


function updateButtonAppearance(button) {
    button.classList.add('active');
    setTimeout(() => {
        button.classList.remove('active');
    }, 350); // Reset button appearance after 350 ms
}

function updateSpeedLabel() {
  const units = [
    { value: 12 * 30 * 24 * 3600, singular: 'YR/S', plural: 'YRS/S' },
    { value: 2592000, singular: 'MTH/S', plural: 'MTHS/S' },
    { value: 604800, singular: 'WK/S', plural: 'WKS/S' },
    { value: 86400, singular: 'DAY/S', plural: 'DAYS/S' },
    { value: 3600, singular: 'HR/S', plural: 'HRS/S' },
    { value: 60, singular: 'MIN/S', plural: 'MINS/S' },
    { value: 1, singular: 'SEC/S', plural: 'SECS/S' }
  ];

  for (const unit of units) {
    if (speedMultiplier >= unit.value) {
      const speedValue = speedMultiplier / unit.value;
      const speedLabelContent = `${speedValue} ${speedValue === 1 ? unit.singular : unit.plural}`;
      speedLabel.textContent = speedLabelContent;
      return;
    }
  }
}


let INTERSECTED;

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;

      if (INTERSECTED != intersectedObject) {
          if (INTERSECTED) {
              INTERSECTED.material.color.set(INTERSECTED.userData.originalColor); 
          }
          INTERSECTED = intersectedObject;
          INTERSECTED.material.color.set('#AFA5C5');
      }
  } else {
      if (INTERSECTED) {
          INTERSECTED.material.color.set(INTERSECTED.userData.originalColor);
      }
      INTERSECTED = null;
  }
}

const clickableObjects = [
  mercury.mesh,
  venus.mesh,
  earth.mesh,
  mars.mesh,
  jupiter.mesh,
  saturn.mesh,
  uranus.mesh,
  neptune.mesh
];
let planets_info = {};

info_read_json('planets_info.json').then(data => {
    planets_info = data;
}).catch(error => {
    console.error('Error loading planets information:', error);
});

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(clickableObjects, true);

  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object;
    const planet = intersectedObject.userData.planet;
    const popupContent = document.getElementById('popup-content');
    const popupImage = document.getElementById('popup-image');
      
    if (planet) {
      console.log(`Clicked on planet: ${planet.name.toLowerCase()}`);
      // if (planets_info[planet.name]) {
      popupContent.innerHTML = planets_info[planet.name.toLowerCase()];
      popupImage.src = planet.imageUrl;
      popup.classList.add('show');
    }
    else {
      popup.classList.remove('show');
    }
  }
  else {
    popup.classList.remove('show');
  }
}

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('click', onMouseClick, false);

const planets = [
  { object: mercury, period: 88 },
  { object: venus, period: 225 },
  { object: earth, period: 365.25 },
  { object: mars, period: 365 },
  { object: jupiter, period: 4333 },
  { object: saturn, period: 10759 },
  { object: uranus, period: 30687 },
  { object: neptune, period: 60190 }
];

function animate() {
  requestAnimationFrame(animate);

  planets.forEach(planet => {
    planet.object.angle += (1 / planet.period / 86400 / 30) * speedMultiplier;
    planet.object.updatePosition();
  });

  scene.children.forEach(child => {
    if (child.userData.planet) {
      child.userData.planet.faceCamera(camera);
    }
  });

  renderer.render(scene, camera);
}