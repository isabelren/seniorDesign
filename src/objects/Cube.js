import { Object3D, Geometry, BoxGeometry, LineSegments, LineBasicMaterial, EdgesGeometry, RepeatWrapping, TextureLoader, BoxBufferGeometry, MeshStandardMaterial, MeshLambertMaterial, Mesh, Vector3, Matrix4 } from 'three'
const THREE = require('three');
const ThreeBSP = require('three-js-csg')(THREE);

var texture1 = new TextureLoader().load( 'http://i.imgur.com/6Ep7TLh.png?1');
    texture1.wrapS = THREE.RepeatWrapping;
    texture1.wrapT = THREE.RepeatWrapping;
    texture1.repeat.set( 4, 4 );

var texture2 = new TextureLoader().load( 'http://i.imgur.com/2Ha62gu.jpg?1');
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
    texture2.repeat.set( 4, 4 );


var texture = new TextureLoader().load( 'http://i.imgur.com/6Ep7TLh.png?1');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 4, 4 );

var textures = [texture1, texture2]

export default class Cube extends Object3D {
  constructor (height, curvePath, u, uMax, building) {
    super()
    this.height = height;
    this.u = u;
    this.uMax = uMax;
    this.curvePath = curvePath;

    const mesh = building;


    var position = curvePath.curve.getPoint(u);
    var lookAtPoint = curvePath.curve.getPoint((u + .01) % 1);
    mesh.position.set(position.x, position.y, position.z);
    mesh.lookAt(lookAtPoint);

    this.add(mesh)
  
  }

  incrementU() {
    this.u += 0.001;
    if (this.u > this.uMax) {
      this.u = 0;
    }
    var mesh = this.children[0]

    var newPosition = this.curvePath.curve.getPoint(this.u);
    mesh.position.set(newPosition.x, newPosition.y, newPosition.z);

    var lookAtPoint = this.curvePath.curve.getPoint((this.u + .01) % 1);
    mesh.lookAt(lookAtPoint);
  }

  incrementAndChangeColor(boost) {
    this.u += 0.001;
    if (this.u > this.uMax) {
      this.u = 0;
    }
    var mesh = this.children[0]

    mesh.mesh.material.color.setRGB(boost, 0.4 * boost, .70 * boost);

    var newPosition = this.curvePath.curve.getPoint(this.u);
    mesh.position.set(newPosition.x, newPosition.y, newPosition.z);

    var lookAtPoint = this.curvePath.curve.getPoint((this.u + .01) % 1);
    mesh.lookAt(lookAtPoint);
  }


  changeColor(boost) {
    console.log(this.children[0].mesh)
    
  }


}

  