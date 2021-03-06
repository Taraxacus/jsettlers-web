import {MouseCaster} from "../../../von-grid/MouseCaster.js";
// import {OrbitControls} from "../../../von-grid/OrbitControls.js";
// var OrbitControls = require("../../../von-grid/OrbitControls.js")(THREE);

/*
	Sets up and manages a THREEjs container, camera, and light, making it easy to get going.
	Also provides camera control.

 */
export class Scene {
	constructor(element) {
		this.renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true
		});
		this.renderer.setClearColor('#fff', 0);
		this.renderer.sortObjects = false;

		this.width = element.clientWidth;
		this.height = element.clientHeight;

		this.orthoZoom = 4;

		this.scene = new THREE.Scene();
		this.scene.add(new THREE.AmbientLight(0x606060), 1);

		this.light1 = new THREE.DirectionalLight(0x606060, 1)
		this.light1.position.set(10, 10, 10).normalize();
		this.scene.add(this.light1);

		this.light2 = new THREE.DirectionalLight(0x606060, 1)
		this.light2.position.set(-10, 10, -10).normalize();
		this.scene.add(this.light2);

		this.light3 = new THREE.DirectionalLight(0x606060, 1)
		this.light3.position.set(0, 10, 0).normalize();
		this.scene.add(this.light3);

		this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 1, 5000);

		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
		this.controls.minDistance = 10;
		this.controls.maxDistance = 1000;
		this.controls.zoomSpeed = 2;
		this.controls.noZoom = false;

		this.camera.position.copy({ x:-150, y:150, z:0 });

		window.addEventListener('resize', this._onWindowResize.bind(this), false);

		element.style.width = this.width + 'px';
		element.style.height = this.height + 'px';
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.width, this.height);
		element.appendChild(this.renderer.domElement);

		this.mouse = new MouseCaster(this.scene, this.camera, element);

        this.fpsInterval = 0;
        this.now = null;
        this.then = null;
		this.elapsed = null;
		
		this.paused = false;
		this.disposed = false;
	}
	_onWindowResize() {
		this.width = element.clientWidth;
		this.height = element.clientHeight;
		this.camera.aspect = this.width / this.height;

		this.camera.updateProjectionMatrix();
		this.renderer.setSize(this.width, this.height);
	}
    
    startAnimating(fps) {
        this.fpsInterval = 1000 / fps;
        this.then = window.performance.now();
        this.animate();
    }

    animate(newtime) {
		if (this.disposed) {
			return;
		}
        window.requestAnimationFrame(this.animate.bind(this));
        this.now = newtime;
        this.elapsed = this.now - this.then;
    
        if (this.elapsed > this.fpsInterval && !this.paused) {
            // Get ready for next frame by setting then=now, but...
            // Also, adjust for fpsInterval not being multiple of 16.67
            this.then = this.now - (this.elapsed % this.fpsInterval);
    
            this.mouse.update();
            this.render();
        }
	}
	
	add(mesh) {
		this.scene.add(mesh);
	}

	remove(mesh) {
		this.scene.remove(mesh);
	}

	render() {
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
	}

	focusOn(obj) {
		this.camera.lookAt(obj.position);
	}
	dispose() {
		this.disposed = true;
		this.mouse.dispose();
		this.renderer = null;
		this.mouse = null;
		this.light1 = null;
		this.light2 = null;
		this.light3 = null;
		this.scene = null;
		this.camera = null;
		window.removeEventListener('resize', this._onWindowResize.bind(this), false);
		this.element = null;
	}
}
