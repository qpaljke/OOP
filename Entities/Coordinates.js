import fs from 'fs'
import { pass } from 'three/examples/jsm/nodes/Nodes.js';

export class Coordinates {
    constructor() {
        this.coordinates_txt = [];
        this.coordinates_json = [];
    }
    
    async read_txt(filename) {
        const response = await fetch(filename);
        const data = await response.text();
        const lines = data.split('\n');
        lines.forEach(element => {
            this.coordinates_txt.push(element);
        });
        return this.coordinates_txt;
    }

    async read_json(filename) {
        const response = await fetch(filename);
        const data = await response.json();
        const planets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
        planets.forEach(element => {
            this.coordinates_json.push(data[element].Ra);
        });
        return this.coordinates_json;
    }
}