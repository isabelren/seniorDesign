const THREE = require('three');
const ThreeBSP = require('three-js-csg')(THREE);

export default class Building extends THREE.Object3D {
  	constructor (topFloorMesh, height) {
		super()
		this.height = height;
		this.floors = []
		this.floors.push(topFloorMesh)
		this.add(mesh)
	}
}
