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
        try {
            const response = await fetch(filename);
            const data = await response.json();
            const planets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
            this.coordinates_json = [];  // Ensure coordinates_json is initialized properly
            planets.forEach(element => {
                if (data[element] && data[element].Deg !== undefined) {
                    this.coordinates_json.push(data[element].Deg);
                } else {
                    console.warn(`Data for ${element} is missing or incomplete.`);
                }
            });
            return this.coordinates_json;
        } catch (error) {
            console.error(`Error fetching coordinates: ${error}`);
            return [];
        }
    }
}