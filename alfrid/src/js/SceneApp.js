// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewObjModel from './ViewObjModel';
import Assets from './Assets';
import VIVEUtils from './utils/VIVEUtils';
import ViewSky from './ViewSky';
import ViewStars from './ViewStars';
import ViewPlanets from './ViewPlanets';
import Planet from './Planet';

const scissor = function(x, y, w, h) {
	GL.scissor(x, y, w, h);
	GL.viewport(x, y, w, h);
}

var random = function(min, max) { return min + Math.random() * (max - min);	}

const RAD = Math.PI/180;

class SceneApp extends Scene {
	constructor() {
		super();
		
		//	ORBITAL CONTROL
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.1;
		this.orbitalControl.radius.value = 5;
		this.camera.setPerspective(75 * RAD, GL.aspectRatio, .5, 100);


		//	VR CAMERA
		this.cameraVR = new alfrid.Camera();

		//	MODEL MATRIX
		this._modelMatrix = mat4.create();
		console.log('Has VR :', VIVEUtils.hasVR);

		if(VIVEUtils.hasVR) {
			mat4.translate(this._modelMatrix, this._modelMatrix, vec3.fromValues(0, 0, -2));
			GL.enable(GL.SCISSOR_TEST);
			this.toRender();

			this.resize();
		}
	}

	_initTextures() {
		console.log('init textures');
	}


	_initViews() {
		console.log('init views');
		this._bCopy = new alfrid.BatchCopy();
		// this._vModel = new ViewObjModel();
		this._vSky = new ViewSky();
		this._vStars = new ViewStars();
		this._vPlanets = new ViewPlanets();

		this._planets = [];
		let i=0;
		while(Assets.get(`planet${i}`)) {
			const p = new Planet(random(.1, 2), random(8, 20), random(-5, 5), `planet${i}`);
			this._planets.push(p);
			i++;
		}

		console.table(this._planets);
	}


	render() {
		if(!VIVEUtils.hasVR) { this.toRender(); }
	}


	toRender() {
		if(VIVEUtils.hasVR) {	VIVEUtils.vrDisplay.requestAnimationFrame(()=>this.toRender());	}		


		if(VIVEUtils.hasVR) {
			VIVEUtils.getFrameData();
			const w2 = GL.width/2;
			VIVEUtils.setCamera(this.cameraVR, 'left');

			scissor(0, 0, w2, GL.height);
			GL.setMatrices(this.cameraVR);
			GL.rotate(this._modelMatrix);
			this.renderScene();


			VIVEUtils.setCamera(this.cameraVR, 'right');
			scissor(w2, 0, w2, GL.height);
			GL.setMatrices(this.cameraVR);
			GL.rotate(this._modelMatrix);
			this.renderScene();

			VIVEUtils.submitFrame();

			//	re-render whole
			scissor(0, 0, GL.width, GL.height);

			GL.clear(0, 0, 0, 0);
			mat4.copy(this.cameraVR.projection, this.camera.projection);

			GL.setMatrices(this.cameraVR);
			GL.rotate(this._modelMatrix);
			this.renderScene();

		} else {
			GL.setMatrices(this.camera);
			GL.rotate(this._modelMatrix);
			this.renderScene();
		}
	}


	renderScene() {
		GL.clear(0, 0, 0, 0);
		// this._bSky.draw(Assets.get('bg'));
		this._vSky.render();
		this._vStars.render();
		this._vPlanets.render(this._planets, Assets.get('studio_radiance'), Assets.get('irr'));
		
		// this._vModel.render(Assets.get('studio_radiance'), Assets.get('irr'), Assets.get('aomap'));
	}


	resize() {
		const scale = VIVEUtils.hasVR ? 2 : 1;
		GL.setSize(window.innerWidth * scale, window.innerHeight * scale);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;