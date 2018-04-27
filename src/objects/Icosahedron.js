const THREE = require('three');


export default class Icosahedron extends THREE.Object3D {
  constructor ( radius=1, detail=0, color=0xffffff,) {
    super()

    const geometry = new THREE.IcosahedronBufferGeometry(radius, detail)
    const material = new THREE.MeshLambertMaterial({color: color})
    const mesh = new THREE.Mesh(geometry, material)

    this.material = material
    this.add(mesh)
  }
}