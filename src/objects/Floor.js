const THREE = require('three');
const ThreeBSP = require('three-js-csg')(THREE);
import { RoomMerge } from './BSPBuilding'

export default class Floor extends THREE.Object3D {
  	constructor (mesh, height) {
		super()
		this.height = height;
		this.mesh = mesh;
		this.add(mesh)
	}

	MergeRooms(room1, room2) {
		const newMesh = RoomMerge(room1.mesh, room2.mesh);
		this.remove(this.mesh);
		this.mesh = newMesh;
		this.add(newMesh);
	}
}
