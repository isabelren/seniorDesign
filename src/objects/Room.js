const THREE = require('three');
const ThreeBSP = require('three-js-csg')(THREE);

export default class Room extends THREE.Object3D {
  	constructor (height, xLength, yLength, s, xTrans, yTrans, heightTrans) {
		super()
		this.height = height;
		var squareShape = new THREE.Shape();
		squareShape.moveTo( xLength / 2, yLength / 2 );
		squareShape.lineTo( -xLength / 2, yLength / 2);
		squareShape.lineTo( -xLength / 2, -yLength / 2 );
		squareShape.lineTo( xLength / 2, -yLength / 2);

		var extrudeSettings = { amount: height, bevelEnabled: false, steps: 2};

		var geometry = new THREE.ExtrudeGeometry( squareShape, extrudeSettings );

		const material = new THREE.MeshLambertMaterial({color: 0xffcccc, side: THREE.DoubleSide})
		var mesh = new THREE.Mesh( geometry );
		mesh.rotation.set(Math.PI / 2, 0, 0);
    	mesh.position.set(xTrans, 55 - heightTrans, yTrans);
    	//mesh.scale.set(s, s, s);
    	this.mesh = mesh
		this.add(mesh)
	}

}
