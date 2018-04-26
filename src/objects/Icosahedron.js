const THREE = require('three');


export default class Torus extends THREE.Object3D {
  constructor (radius=1, detail=0) {
    super()

    const geometry = new THREE.IcosahedronBufferGeometry(radius, detail)
    const material = new THREE.MeshStandardMaterial({color: 0xA197C9, roughness: 0.18, metalness: 0.5})
    const mesh = new THREE.Mesh(geometry, material)

    this.add(mesh)
  }
}