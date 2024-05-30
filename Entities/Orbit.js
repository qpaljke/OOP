import * as THREE from "three";
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';

export class Orbit {
    constructor(scene, radius, color, aX = 0, aY = 0) {
        this.scene = scene;

        this.aX = aX;
        this.aY = aY;

        this.radius = radius;
        this.color = color;

        this.curve = new THREE.EllipseCurve(this.aX, this.aY, this.radius, this.radius);
        this.points = this.curve.getPoints(256);

        // Convert points to flat array of coordinates
        const positions = [];
        for (let i = 0; i < this.points.length; i++) {
            positions.push(this.points[i].x, this.points[i].y, 0);
        }

        this.geometry = new LineGeometry();
        this.geometry.setPositions(positions);

        this.material = new LineMaterial({
            color: this.color,
            linewidth: 0.0015, // Line width in world units
        });

        this.circle = new Line2(this.geometry, this.material);
        this.circle.computeLineDistances();

        this.circle.userData = {
            orbit: this,
            originalColor: new THREE.Color(this.color)
        };
    }

    addOrbit() {
        this.scene.add(this.circle);
    }
}
