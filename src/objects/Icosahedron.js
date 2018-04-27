const THREE = require('three');


export default class Icosahedron extends THREE.Object3D {
  constructor ( radius=1, detail=0, color=0xFAB1FF,) {
    super()

    const geometry = new THREE.IcosahedronBufferGeometry(radius, detail)
    const material = new THREE.MeshLambertMaterial({color: color, roughness: 0.18})
    const mesh = new THREE.Mesh(geometry, material)

    this.add(mesh)
  }
}