const THREE = require('three');
const ThreeBSP = require('three-js-csg')(THREE);

export default class Room extends THREE.Object3D {
  	constructor (height, xLength, yLength, s, xTrans, yTrans) {
		super()
		this.height = height;
		var squareShape = new THREE.Shape();
		squareShape.moveTo( xLength / 2, yLength / 2 );
		squareShape.lineTo( -xLength / 2, yLength / 2);
		squareShape.lineTo( -xLength / 2, -yLength / 2 );
		squareShape.lineTo( xLength / 2, -yLength / 2);

		var extrudeSettings = { amount: height, bevelEnabled: false, steps: 2};

		var geometry = new THREE.ExtrudeGeometry( squareShape, extrudeSettings );

		const material = new THREE.MeshLambertMaterial({color: 0xffffff, side: THREE.DoubleSide})
		var mesh = new THREE.Mesh( geometry );


		// wireframe
		var geo = new THREE.EdgesGeometry( mesh.geometry ); // or WireframeGeometry
		var mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );
		var wireframe = new THREE.LineSegments( geo, mat );
		mesh.add( wireframe );

		mesh.rotation.set(Math.PI / 2, 0, 0);
    	mesh.position.set(xTrans, 0, yTrans);
    	//mesh.scale.set(s, s, s);
    	this.mesh = mesh
		this.add(mesh)
	}

}
