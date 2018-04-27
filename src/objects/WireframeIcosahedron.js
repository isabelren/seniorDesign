const THREE = require('three');


export default class WireIcosahedron extends THREE.Object3D {
  constructor (radius=1, detail=0, color=0xffffff) {
    super()

    const geometry = new THREE.IcosahedronBufferGeometry(radius, detail)

	var geo = new THREE.WireframeGeometry( geometry ); // or WireframeGeometry( geometry )

	var mat = new THREE.LineBasicMaterial( { color: color} );

	var wireframe = new THREE.LineSegments( geo, mat );
	this.material = mat;

	this.add( wireframe );

    //this.add(mesh)
  }
}