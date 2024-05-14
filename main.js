import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Planet } from "/Entities/Planet";
import { Orbit } from '/Entities/Orbit';
import { Coordinates } from './Entities/Coordinates';

import './style.css'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 3000 );
camera.position.z = 150;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const orbitColor = '#2A2A2A'

const canvas = document.querySelector('.canvas');

const mercuryOrbit = new Orbit(scene, 11, orbitColor, -2, 0.5)
const mercury = new Planet(scene, 0.4, 512, 512, '#b5835a', mercuryOrbit, Math.PI/2, 'Mercury');

const venusOrbit = new Orbit(scene, 21, orbitColor, 1, -0.5);
const venus = new Planet(scene, 0.95, 512, 512, '#ffa348', venusOrbit, 0, 'Venus');


const earthOrbit = new Orbit(scene, 30, orbitColor, 1, -1);
const earth = new Planet(scene, 1, 512, 512, '#19430f', earthOrbit, 0, 'Earth');

const marsOrbit = new Orbit(scene, 45, orbitColor, -1, -1);
const mars = new Planet(scene, 0.53, 512, 512, '#63452c', marsOrbit, 0, 'Mars');

const sunGeometry = new Planet(scene, 2, 512, 512, 0xffff00, {radius: 0}, 0, 'Sun', true);
sunGeometry.addPlanet();


const jupiterOrbit = new Orbit(scene, 100, orbitColor, 5, 5);
const jupiter = new Planet(scene, 1.5, 512, 512, '#cdab8f', jupiterOrbit, 0, 'Jupiter');

const saturnOrbit = new Orbit(scene, 175, orbitColor);
const saturn = new Planet(scene, 1.3, 512, 512, '#63452c', saturnOrbit, 0, 'Saturn');

const uranusOrbit = new Orbit(scene, 350, orbitColor, -20, -20);
const uranus = new Planet(scene, 1, 512, 512, '#63452c', uranusOrbit, 0, 'Uranus');

const neptuneOrbit = new Orbit(scene, 450, orbitColor, 20, 20);
const neptune = new Planet(scene, 0.8, 512, 512, '#63452c', neptuneOrbit, 0, 'Neptune');

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

increaseSpeedButton.addEventListener('click', () => {
  if (speedMultiplier == 1)
    speedMultiplier = 3;
  else if (speedMultiplier == 3)
    speedMultiplier = 10;
  else if(speedMultiplier == 10)
    speedMultiplier = 30;
  else if(speedMultiplier == 30)
    speedMultiplier = 60;
  else if (speedMultiplier == 60)
    speedMultiplier = 300;
  else if (speedMultiplier == 300)
    speedMultiplier = 600;
  else if (speedMultiplier == 600)
    speedMultiplier = 1800;
  else if (speedMultiplier == 1800)
    speedMultiplier = 3600;
  else if(speedMultiplier == 3600)
    speedMultiplier = 3 * 3600;
  else if(speedMultiplier == 3 * 3600)
    speedMultiplier = 10 * 3600;
  else if(speedMultiplier == 10 * 3600)
    speedMultiplier = 24 * 3600;
  else if (speedMultiplier == 24 * 3600)
    speedMultiplier = 5 * 24 * 3600;
  else if (speedMultiplier == 5 * 24 * 3600)
    speedMultiplier = 7 * 24 * 3600;
  else if (speedMultiplier == 7 * 24 * 3600)
    speedMultiplier = 3 * 7 * 24 * 3600;
  else if (speedMultiplier == 3 * 7 * 24 * 3600)
    speedMultiplier = 30 * 24 * 3600;
  else if (speedMultiplier == 30 * 24 * 3600)
    speedMultiplier = 3 * 30 * 24 * 3600;
  else if (speedMultiplier == 3 * 30 * 24 * 3600)
    speedMultiplier = 6 * 30 * 24 * 3600;
  else if (speedMultiplier == 6 * 30 * 24 * 3600)
    speedMultiplier = 12 * 30 * 24 * 3600;
  else if (speedMultiplier == 12 * 30 * 24 * 3600)
    speedMultiplier = 3 * 12 * 30 * 24 * 3600;



    //speedMultiplier *= 2; 
    updateButtonAppearance(increaseSpeedButton);
    updateSpeedLabel();
});

decreaseSpeedButton.addEventListener('click', () => {
if (speedMultiplier == 3)
  speedMultiplier = 1;
else if(speedMultiplier == 10)
  speedMultiplier = 3;
else if(speedMultiplier == 30)
  speedMultiplier = 10;
else if (speedMultiplier == 60)
  speedMultiplier = 30;
else if (speedMultiplier == 300)
  speedMultiplier = 60;
else if (speedMultiplier == 600)
  speedMultiplier = 300;
else if (speedMultiplier == 1800)
  speedMultiplier = 600;
else if(speedMultiplier == 3600)
  speedMultiplier = 1800;
else if(speedMultiplier == 3 * 3600)
  speedMultiplier = 3600;
else if(speedMultiplier == 10 * 3600)
  speedMultiplier = 3 * 3600;
else if (speedMultiplier == 24 * 3600)
  speedMultiplier = 10 * 3600;
else if (speedMultiplier == 5 * 24 * 3600)
  speedMultiplier = 24 * 3600;
else if (speedMultiplier == 7 * 24 * 3600)
  speedMultiplier = 5 * 24 * 3600;
else if (speedMultiplier == 3 * 7 * 24 * 3600)
  speedMultiplier = 7 * 24 * 3600;
else if (speedMultiplier == 30 * 24 * 3600)
  speedMultiplier = 3 * 7 * 24 * 3600;
else if (speedMultiplier == 3 * 30 * 24 * 3600)
  speedMultiplier = 30 * 24 * 3600;
else if (speedMultiplier == 6 * 30 * 24 * 3600)
  speedMultiplier = 3 * 30 * 24 * 3600;
else if (speedMultiplier == 12 * 30 * 24 * 3600)
  speedMultiplier = 6 * 30 * 24 * 3600;
else if (speedMultiplier == 3 * 12 * 30 * 24 * 3600)
  speedMultiplier = 12 * 30 * 24 * 3600;

    updateButtonAppearance(decreaseSpeedButton);
    updateSpeedLabel();
});

function updateButtonAppearance(button) {
    button.classList.add('active');
    setTimeout(() => {
        button.classList.remove('active');
    }, 350); // Reset button appearance after 1 second
}

function updateSpeedLabel() {
  let speedLabelContent;
  let speedValue;

  if (speedMultiplier > 12 * 30 * 24 * 3600) {
      speedValue = speedMultiplier / (12 * 30 * 24 * 3600); // Convert to years
      speedLabelContent = `${speedValue} YRS/S`;
  } else if (speedMultiplier == 12 * 30 * 24 * 3600) {
      speedValue = speedMultiplier / (12 * 30 * 24 * 3600); // Convert to weeks
      speedLabelContent = `${speedValue} YR/S`;
  } else if (speedMultiplier > 2592000) {
      speedValue = speedMultiplier / 2592000; // Convert to weeks
      speedLabelContent = `${speedValue} MTHS/S`;
  } else if (speedMultiplier == 2592000) {
      speedValue = speedMultiplier / 2592000; // Convert to weeks
      speedLabelContent = `${speedValue} MTH/S`;
  } else if (speedMultiplier > 604800) {
        speedValue = speedMultiplier / 604800; // Convert to weeks
        speedLabelContent = `${speedValue} WKS/S`;
  } else if (speedMultiplier == 604800) {
      speedValue = speedMultiplier / 604800; // Convert to weeks
      speedLabelContent = `${speedValue} WK/S`;
  } else if (speedMultiplier > 86400) {
      speedValue = speedMultiplier / 86400; // Convert to days
      speedLabelContent = `${speedValue} DAYS/S`;
  } else if (speedMultiplier == 86400) {
    speedValue = speedMultiplier / 86400; // Convert to days
    speedLabelContent = `${speedValue} DAY/S`;
  } else if (speedMultiplier > 3600) {
      speedValue = speedMultiplier / 3600; // Convert to hours
      speedLabelContent = `${speedValue} HRS/S`;
  }  else if (speedMultiplier == 3600) {
      speedValue = speedMultiplier / 3600; // Convert to hours
      speedLabelContent = `${speedValue} HR/S`;
  } else if (speedMultiplier == 60) {
        speedValue = speedMultiplier / 60; // Convert to minutes
        speedLabelContent = `${speedValue} MIN/S`;
  } else if (speedMultiplier > 60) {
      speedValue = speedMultiplier / 60; // Convert to minutes
      speedLabelContent = `${speedValue} MINS/S`;
  } else if (speedMultiplier > 1){
    speedValue = speedMultiplier; // Speed is in seconds
    speedLabelContent = `${speedValue} SECS/S`;
  } else {
    speedValue = speedMultiplier; 
    speedLabelContent = `${speedValue} SEC/S`;
  }

  speedLabel.textContent = speedLabelContent;
}

function animate() {
  requestAnimationFrame(animate);

  earth.angle += (1 / 365.25 / 86400 / 30) * speedMultiplier;
    mercury.angle += (1 / 88 / 86400 / 30) * speedMultiplier;
    venus.angle += (1 / 225 / 86400 / 30) * speedMultiplier;
    mars.angle += (1 / 365 / 86400 / 30) * speedMultiplier;
    jupiter.angle += (1 / 4333 / 86400 / 30) * speedMultiplier;
    saturn.angle += (1 / 10759 / 86400 / 30) * speedMultiplier;
    uranus.angle += (1 / 30687 / 86400 / 30) * speedMultiplier;
    neptune.angle += (1 / 60190 / 86400 / 30) * speedMultiplier;

    // Update planet positions
    mercury.updatePosition();
    venus.updatePosition();
    earth.updatePosition();
    mars.updatePosition();
    jupiter.updatePosition();
    saturn.updatePosition();
    uranus.updatePosition();
    neptune.updatePosition();

  renderer.render(scene, camera);
}

