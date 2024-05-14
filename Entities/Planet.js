import * as THREE from "three";
import {FontLoader, TextGeometry} from "three/addons";
import { Orbit } from "./Orbit";

export class Planet {
    constructor(scene, radius, widthSegment, heightSegment, color, orbit , angle, name, infoText = "", glowing = false) {
        this.scene = scene

        this.radius = radius;
        this.widthSegment = widthSegment;
        this.heightSegment = heightSegment;
        this.color = color;
        this.orbit = orbit;
        this.angle = angle;
        this.name = name; 
        this.glowing = glowing;
        this.infoText = infoText;
        
        // Геометрия планеты
        this.geometry = new THREE.SphereGeometry(this.radius, this.widthSegment, this.heightSegment);
        this.material = new THREE.MeshBasicMaterial({ color: this.color });
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        if (glowing) {
            this.pointLight = new THREE.PointLight(0xffffff, 100, 1)
            this.pointLight.position.set(0, 0, 2)
            this.mesh.add(this.pointLight)
        }

        if (this.name == 'Saturn') { 
            const circleGeometry = new THREE.CircleGeometry(this.radius + 2, 1024); 
            circleGeometry.rotateX(Math.PI / 1.234); 
            this.circle = new THREE.LineLoop(circleGeometry, new THREE.LineBasicMaterial({ color: '#b5835a' }));
            this.mesh.add(this.circle); 
        }

        this.mesh.userData.onMouseOver = () => {
            this.showInfoHint();
        };
        this.mesh.userData.onMouseOut = () => {
            this.hideInfoHint();
        };

        this.addPlanet();
    }

    updatePosition() {
        // Параметрическое уравнение эллипса для орбиты
        const x = this.orbit.radius * Math.cos(this.angle) + this.orbit.aX;
        const y = this.orbit.radius * Math.sin(this.angle) + this.orbit.aY;

        // Обновляем позицию планеты
        this.mesh.position.set(x, y, 0);
    }

    addPlanet() {
        this.scene.add(this.mesh);
    }

    showInfoHint() {
        if (this.infoText) {
            const hintElement = document.createElement("div");
            hintElement.classList.add("planet-hint");
            hintElement.textContent = this.infoText;

            // Позиционируем подсказку рядом с планетой
            const rect = this.mesh.getBoundingClientRect();
            hintElement.style.top = `${rect.top}px`;
            hintElement.style.left = `${rect.left}px`;

            // Добавляем подсказку на страницу
            document.body.appendChild(hintElement);

            this.hintElement = hintElement;
        }
    }

    // Метод для скрытия всплывающей подсказки
    hideInfoHint() {
        if (this.hintElement) {
            this.hintElement.parentNode.removeChild(this.hintElement);
            this.hintElement = null;
        }
    }
}