import * as THREE from "three";
export class Orbit {
    constructor(scene, radius, color, aX = 0, aY =0){
        this.scene = scene

        this.aX = aX;
        this.aY = aY;

        this.radius = radius;
        this.color = color;

        this.curve = new THREE.EllipseCurve(this.aX, this.aY, this.radius, this.radius);
        this.points = this.curve.getPoints( 1024 );

        this.geometry = new THREE.BufferGeometry().setFromPoints(this.points);
        this.material = new THREE.LineBasicMaterial({ color: this.color });
        this.circle = new THREE.Line(this.geometry, this.material);
    }
    
    addOrbit(){
        this.scene.add(this.circle);
    }
}