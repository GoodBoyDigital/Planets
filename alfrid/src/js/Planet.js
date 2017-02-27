// Planet.js

import Assets from './Assets';
import { Scheduler } from 'alfrid';

var random = function(min, max) { return min + Math.random() * (max - min);	}

class Planet {
	constructor(mSize, mRadius, mY, mTexture) {
		this._size = mSize;
		this._radius = mRadius;
		this._y = mY;
		this._textureName = mTexture;
		this._angle = Math.random() * Math.PI * 2.0;

		this._x = Math.cos(this._angle) * this._radius;
		this._z = Math.sin(this._angle) * this._radius;
		this._position = vec3.fromValues(this._x, this._y, this._z);

		this._uvOffset = [0, 0];
		this._speed = random(0.001, 0.005);

		Scheduler.addEF(()=>this.update());
	}


	update() {
		this._uvOffset[0] -= this._speed;
	}


	get size() {
		return this._size;
	}

	get position() {
		return this._position;
	}

	get texture() {
		return Assets.get(this._textureName);
	}


	get uvOffset() {
		return this._uvOffset;
	}


}


export default Planet;