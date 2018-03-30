const THREE = require('three');
const ThreeBSP = require('three-js-csg')(THREE);

export default class Floor extends THREE.Object3D {
  	constructor (mesh, height) {
		super()
		this.height = height;
		this.add(mesh)
	}
}
