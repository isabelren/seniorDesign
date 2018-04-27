import { Object3D, Geometry, BoxGeometry, LineSegments, LineBasicMaterial, EdgesGeometry, RepeatWrapping, TextureLoader, BoxBufferGeometry, MeshStandardMaterial, MeshLambertMaterial, Mesh, Vector3, Matrix4 } from 'three'
const THREE = require('three');

export default class Sphere extends Object3D {
  constructor (curvePath) {
    super()
    this.u = 0;
    this.curvePath = curvePath;

    var geometry = new THREE.SphereGeometry( 0.5, 32, 32 );
    const material = new THREE.MeshLambertMaterial({
                color: 0xffffff, 
                side: THREE.DoubleSide,
            })
    const mesh = new THREE.Mesh(geometry, material)

    var position = curvePath.curve.getPoint(0);
    console.log(position)
    mesh.position.set(position.x, position.y, 0);
    this.mesh = mesh

    this.add(mesh)
    
  
  }

  incrementU() {
    this.u += 0.0001;
    if (this.u > 1) {
      this.u = 0;
    }
    var mesh = this.children[0]

    var newPosition = this.curvePath.curve.getPoint(this.u);
    mesh.position.set(newPosition.x, newPosition.y,0);
  }


}




  