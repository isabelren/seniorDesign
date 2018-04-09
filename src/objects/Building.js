const THREE = require('three');
const ThreeBSP = require('three-js-csg')(THREE);
import { FloorMerge, RoomMerge, MeshSubtract } from './BSPBuilding'
import Room from './Room'
import Floor from './Floor'


//to create a floor: call CreateRoom with parameters and then call createFloor()
export default class Building extends THREE.Object3D {
  	constructor (floorHeights=[], totalHeight=0) {
		super()
		this.floorHeights = floorHeights;
		this.totalHeight = totalHeight;

		if (floorHeights.length == 0) {
			this.AutoGenerateFloorHeights();
		}

		this.currentRooms = []
		//TODO: store max x trans and max y trans
	}

	//TODO: can store heights in turtle?
	AutoGenerateFloorHeights() {
		var lowerFloorBound = 3
	    var upperFloorBound = 8

	    var lowerHeightBound = 1;
	    var upperHeightBound = 8;

	    //generate number of floors
	    var numFloors = Math.floor((Math.random() * upperFloorBound) + lowerFloorBound);

	    //generate height of each floor in an array
	    var floorHeights = [];
	    var totalHeight = 0;
	    for (var i = 0; i < numFloors; i++) {
	      var newHeight = lowerHeightBound + Math.floor((Math.random() * upperHeightBound));
	      floorHeights.push(newHeight);
	      totalHeight += newHeight;
	    }
	    this.floorHeights = floorHeights;
	    this.totalHeight = totalHeight;

	}

	RemoveAndReplaceMesh(newMesh) {
		if (this.mesh) {
			this.remove(this.mesh);

			const newBuildingMesh = newMesh;
			this.add(newBuildingMesh)
			this.mesh = newBuildingMesh
		} else { //Add first floor
			this.add(newMesh);
			this.mesh = newMesh;
		}
	}

	CreateBuildingFromRooms () {

		if (this.currentRooms.length > 1) {
			var currentMesh = this.currentRooms[0].mesh;

			for (var i = 1; i < this.currentRooms.length; i++) {
				var currentRoom = this.currentRooms[i];
				currentMesh = RoomMerge(currentMesh, currentRoom.mesh);
			}
			currentMesh.rotation.set(-Math.PI / 2, 0, 0);
			currentMesh.position.set(0,0,0);
			const material = new THREE.MeshLambertMaterial({color: 0xffcccc, side: THREE.DoubleSide})
      		currentMesh.material = material;

			this.RemoveAndReplaceMesh(currentMesh)
		}



		this.currentRooms = []
	}


	CreateRoom (height, xTrans, yTrans, heightTrans, scale=1, minHeight = 0, maxHeight = 4, minLength = 0) {
		var xLength = minLength + Math.floor((Math.random() * 4 * scale) + 1);
  		var yLength = minLength + Math.floor((Math.random() * 4 * scale) + 1);
  		this.currentRooms.push(new Room(height, xLength, yLength, 1, xTrans, yTrans, heightTrans));

	}
}
