import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

export class Planet {
    constructor(scene, radius, widthSegment, heightSegment, color, orbit, angle, name, imageUrl = "") {
        this.scene = scene;
        this.radius = radius;
        this.widthSegment = widthSegment;
        this.heightSegment = heightSegment;
        this.color = color;
        this.orbit = orbit;
        this.angle = angle;
        this.name = name;
        //this.infoText = infoText;
        this.imageUrl = imageUrl;
        
        this.geometry = new THREE.SphereGeometry(this.radius, this.widthSegment, this.heightSegment);
        this.material = new THREE.MeshBasicMaterial({ color: this.color });
        this.mesh = new THREE.Mesh(this.geometry, this.material);        

        this.mesh.userData = {
            planet: this,
            originalColor: this.color,
            orbit: this.orbit,
            //infoText: this.infoText,
            imageUrl: this.imageUrl,
        };

        const fontLoader = new FontLoader();
        fontLoader.load('../Roboto_Regular.json', (font) => {
            const textGeometry = new TextGeometry(this.name, {
                font: font,
                size: 4,
                height: 0.1,
                curveSegments: 12,
                bevelEnabled: false,
            });
            const textMaterial = new THREE.MeshBasicMaterial({ color: "white", transparent: true });
            this.textMesh = new THREE.Mesh(textGeometry, textMaterial);
            this.textMesh.position.set(this.radius + 0.5, this.radius + 0.5, 0);
            this.textMesh.userData = {
                originalColor: textMaterial.color.getHex(),
            };
            this.mesh.add(this.textMesh);
        });

        this.addPlanet();
    }

    updatePosition() {
        const x = this.orbit.radius * Math.cos(this.angle) + this.orbit.aX;
        const y = this.orbit.radius * Math.sin(this.angle) + this.orbit.aY;
        this.mesh.position.set(x, y, 0);
        // Не нужно обновлять позицию textMesh, так как она дочерний элемент планеты и перемещается вместе с ней
    }

    addPlanet() {
        this.scene.add(this.mesh);
    }
    
    faceCamera(camera) {
        if (this.textMesh) {
            this.textMesh.quaternion.copy(camera.quaternion);
        }
    }
}
