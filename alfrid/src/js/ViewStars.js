// ViewStars.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';
import vs from '../shaders/stars.vert';
import fs from '../shaders/tile.frag';
var random = function(min, max) { return min + Math.random() * (max - min);	}

const Y_SCALE = 3;

class ViewStars extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {

		const positions = [];
		const coords = [];
		const indices = [];
		let index = 0;

		const num = 24;
		const r = 1;
		const h = 20 * Y_SCALE;

		const getPosition = function(i, j) {
			let a = i/num * Math.PI * 2.0;
			let x = Math.cos(a) * r;
			let y = j == 0 ? -h : h;
			let z = Math.sin(a) * r;
			return [x, y, z];
		}

		for(let i=0; i<num; i++) {
			for(let j=0; j<2; j++) {
				positions.push(getPosition(i, j));
				positions.push(getPosition(i+1, j));
				positions.push(getPosition(i+1, j+1));
				positions.push(getPosition(i, j+1));

				coords.push([i/num, 0]);
				coords.push([(i+1)/num, 0]);
				coords.push([(i+1)/num, 1]);
				coords.push([i/num, 1]);

				indices.push(index*4 + 0);
				indices.push(index*4 + 1);
				indices.push(index*4 + 2);
				indices.push(index*4 + 0);
				indices.push(index*4 + 2);
				indices.push(index*4 + 3);

				index++;
			}
		}

		this.mesh = new alfrid.Mesh();
		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoord(coords);
		this.mesh.bufferIndex(indices);

		this.numLayers = 0;
		this.radius = [];

		while( !!Assets.get(`stars${this.numLayers}`)) {
			this.numLayers++;
			this.radius.push(random(65, 75));
		}

		console.log('Num Layers : ', this.numLayers);

	}


	render() {
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		
		this.shader.uniform("uUVScale", "vec2", [5, Y_SCALE]);
		

		this.radius.forEach((r, i) => {
			Assets.get(`stars${i}`).bind(0);
			this.shader.uniform("uRadius", "float", r);	
			GL.draw(this.mesh);
		});
		
	}


}

export default ViewStars;