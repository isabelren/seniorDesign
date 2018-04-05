//import { Object3D, CSG, Geometry, BoxGeometry, LineSegments, LineBasicMaterial, EdgesGeometry, RepeatWrapping, TextureLoader, BoxBufferGeometry, MeshStandardMaterial, MeshLambertMaterial, Mesh, Vector3, Matrix4 } from 'three'
//import THREE from 'three'
const THREE = require('three');
const ThreeBSP = require('three-js-csg')(THREE);

var texture1 = new THREE.TextureLoader().load( 'http://i.imgur.com/6Ep7TLh.png?1');
    texture1.wrapS = THREE.RepeatWrapping;
    texture1.wrapT = THREE.RepeatWrapping;
    texture1.repeat.set( 4, 4 );

var texture2 = new THREE.TextureLoader().load( 'http://i.imgur.com/2Ha62gu.jpg?1');
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
    texture2.repeat.set( 4, 4 );

var texture3 = new THREE.TextureLoader().load( 'http://i.imgur.com/cYQ3IEb.jpg?1');
    texture3.wrapS = THREE.RepeatWrapping;
    texture3.wrapT = THREE.RepeatWrapping;
    texture3.repeat.set( 4, 4 );

var textures = [texture1, texture2, texture3];

export default class TestCube extends THREE.Object3D {
  	constructor (height) {
		super()
		this.height = height;

		const texture = textures[Math.floor((Math.random() * 3))];
		const material = new THREE.MeshLambertMaterial({map: texture})

		const base = new THREE.Mesh(new THREE.BoxGeometry(2, height, 2));
		const secondary = new THREE.Mesh(new THREE.BoxGeometry(1, height/2, 1));
		secondary.position.y = height/2;

		const bspBase = new ThreeBSP(base);
		const bspSecondary = new ThreeBSP(secondary);

		const sub = bspBase.union(bspSecondary);
		const newMesh = sub.toMesh();
		newMesh.translateY(55);

		newMesh.material = material;

		this.add(newMesh);

	}
}

//returns a MESH of the merged meshes
export function RoomMerge(mesh1, mesh2) {
	const bsp1 = new ThreeBSP(mesh1);
	const bsp2 = new ThreeBSP(mesh2);
	const bsp3 = bsp1.union(bsp2);
	const newMesh = bsp3.toMesh();
	const material = new THREE.MeshLambertMaterial({color: 0xffcccc, side: THREE.DoubleSide})

	newMesh.material = material;
	return newMesh;
}

export function FloorMerge(mesh1, mesh2, height1) {
	var yTransform = -height1;
	mesh2.position.set(0,yTransform + 55,0);

	const bsp1 = new ThreeBSP(mesh1);
	const bsp2 = new ThreeBSP(mesh2);
	const bsp3 = bsp1.union(bsp2);
	const newMesh = bsp3.toMesh();
	const material = new THREE.MeshLambertMaterial({color: 0xffcccc, side: THREE.DoubleSide})

	newMesh.material = material;
	return newMesh;

}

export function MeshSubtract(currentHeight, goalHeight, mesh) {
	const duplicateMesh = mesh.clone()
	duplicateMesh.position.y = duplicateMesh.position.y - goalHeight;

	const bsp = new ThreeBSP(mesh);
	const duplicate = new ThreeBSP(duplicateMesh);
	const bsp2 = bsp.subtract(duplicate);
	const newMesh = bsp2.toMesh();
	const material = new THREE.MeshLambertMaterial({color: 0xffcccc, side: THREE.DoubleSide})

	newMesh.material = material;
	return newMesh;
}

export function MeshIncrease(currentHeight, goalHeight, mesh) {
	const duplicateMesh = mesh.clone()
	duplicateMesh.position.y = duplicateMesh.position.y - goalHeight;

	const bsp = new ThreeBSP(mesh);
	const duplicate = new ThreeBSP(duplicateMesh);
	const bsp2 = bsp.union(duplicate);
	const newMesh = bsp2.toMesh();
	const material = new THREE.MeshLambertMaterial({color: 0xffcccc, side: THREE.DoubleSide})

	newMesh.material = material;
	return newMesh;
}
