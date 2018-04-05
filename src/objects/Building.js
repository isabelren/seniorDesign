const THREE = require('three');
const ThreeBSP = require('three-js-csg')(THREE);
import { FloorMerge, RoomMerge, MeshSubtract } from './BSPBuilding'
import Room from './Room'
import Floor from './Floor'


//to create a floor: call CreateRoom with parameters and then call createFloor()
export default class Building extends THREE.Object3D {
  	constructor () {
		super()
		this.heights = [];
		this.height = 0;
		this.floors = [];
		this.currentRooms = []
		//TODO: store max x trans and max y trans
	}

	AddFloor (newFloor) {
		this.floors.push(newFloor)

		if (this.mesh) {
			this.RemoveCurrentMeshAndMerge(newFloor)
		} else { //Add first floor
			this.add(newFloor);
			this.mesh = newFloor.mesh;
		}
		
		this.height = this.height + newFloor.height;
		
	}

	RemoveCurrentMeshAndMerge(newFloor) {
		this.remove(this.mesh);

		const newBuildingMesh = FloorMerge(this.mesh, newFloor.mesh, this.height);
		this.add(newBuildingMesh)
		this.mesh = newBuildingMesh

	}

	//Modify to add room to current mesh. 
	//Currently takes all rooms in currentRooms and creates a floor
	CreateFloorFromRooms () {
		if (this.currentRooms.length == 1) {
			this.AddFloor(new Floor(this.currentRooms[0].mesh, this.currentRooms[0].height));
		}

		if (this.currentRooms.length > 1) {
			var currentMesh = this.currentRooms[0].mesh;

			for (var i = 1; i < this.currentRooms.length; i++) {
				var currentRoom = this.currentRooms[i];
				currentMesh = RoomMerge(currentMesh, currentRoom.mesh);
			}

			this.AddFloor(new Floor(currentMesh, this.currentRooms[0].height))
		}

		this.currentRooms = []

	}

	CreateBuildingFromRooms () {

		if (this.currentRooms.length > 1) {
			var currentMesh = this.currentRooms[0].mesh;

			for (var i = 1; i < this.currentRooms.length; i++) {
				var currentRoom = this.currentRooms[i];
				currentMesh = RoomMerge(currentMesh, currentRoom.mesh);
			}
			
			if (this.mesh) {
				this.remove(this.mesh);

				const newBuildingMesh = currentMesh;
				this.add(newBuildingMesh)
				this.mesh = newBuildingMesh
			} else { //Add first floor
				this.add(currentMesh);
				this.mesh = currentMesh;
			}
			//this.AddFloor(new Floor(currentMesh, this.currentRooms[0].height))
		}

		this.currentRooms = []
	}

	CreateFloorFromPreviousFloor () {
		if (this.floors.length > 0) {
			this.CheckHeightAndSubtract();
			var currentMesh = this.floors[this.floors.length - 1].mesh;

			for (var i = 0; i < this.currentRooms.length; i++) {
				var currentRoom = this.currentRooms[i];
				currentMesh = RoomMerge(currentMesh, currentRoom.mesh);
			}

			this.AddFloor(new Floor(currentMesh, this.currentRooms[0].height))
			this.currentRooms = []
		} else {
			this.CreateFloorFromRooms()
		}

	}

	CheckHeightAndSubtract() {
		var goalHeight = this.currentRooms[this.currentRooms.length - 1].height;
		var floorHeight = this.floors[this.floors.length - 1].height;
		if (goalHeight > floorHeight) {
			console.log("h")
			//TODO: must increase floorHeight through union
		}

		if (floorHeight > goalHeight) {
			//must decrease floorHeight
			console.log("i")
			this.floors[this.floors.length - 1].mesh = MeshSubtract(floorHeight, goalHeight, this.floors[this.floors.length - 1].mesh)

		}

	}

	CreateRoom (height, xTrans, yTrans, heightTrans, scale=1, minHeight = 0, maxHeight = 4, minLength = 0) {
		var xLength = minLength + Math.floor((Math.random() * 4 * scale) + 1);
  		var yLength = minLength + Math.floor((Math.random() * 4 * scale) + 1);
  		this.currentRooms.push(new Room(height, xLength, yLength, 1, xTrans, yTrans, heightTrans));

	}
}
