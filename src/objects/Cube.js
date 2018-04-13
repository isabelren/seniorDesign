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
    this.meshArr = []
    this.visibleMesh = 0;

    const mesh = building;
    this.meshArr.push(building.mesh);


    var position = curvePath.curve.getPoint(u);
    var lookAtPoint = curvePath.curve.getPoint((u + .01) % 1);

    //this.createOtherBuildings(position, lookAtPoint);

    mesh.position.set(position.x, position.y, position.z);
    mesh.lookAt(lookAtPoint);

    this.add(mesh)
  
  }

  createOtherBuildings(position, lookAtPoint) {
    var numCopies = 10;
    var dupeMesh = this.meshArr[0].clone();
    var dupeMesh2 = this.meshArr[0].clone();
    var yTransform = .05;

    for (var i = 0; i < numCopies; i++) {
  
      dupeMesh2.position.set(0, yTransform, 0);
      dupeMesh.position.set(0, 0, 0);
      const bsp1 = new ThreeBSP(dupeMesh);
      const bsp2 = new ThreeBSP(dupeMesh2);
      const bsp3 = bsp1.union(bsp2);
      const newMesh = bsp3.toMesh();
      const material = new THREE.MeshLambertMaterial({color: 0xffcccc, side: THREE.DoubleSide})
      newMesh.material = material;

      dupeMesh = newMesh.clone();
      dupeMesh2 = newMesh.clone();

      //newMesh.position.set(position.x, position.y, position.z);
      //newMesh.lookAt(lookAtPoint);
      //newMesh.position.set(0, -yTransform * i, 0);
      newMesh.visible = false;
      this.meshArr.push(newMesh);
      
      this.add(newMesh);
    }
    this.loopVisibleMeshArr();
  }

  loopVisibleMeshArr() {
    /*var booleanVis = true;
    for (var i = 0; i < this.meshArr.length; i ++) {
      this.meshArr[i].visible = booleanVis;
      booleanVis = !booleanVis;
    }*/
    this.meshArr[this.visibleMesh].visible = false;
    if (this.visibleMesh == this.meshArr.length - 1) {
      this.visibleMesh = 1;
    } else {
      this.visibleMesh += 1;
    }
    this.meshArr[this.visibleMesh].visible = true;
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

  changeColor(boost) {
    this.children[0].material.color.setRGB(boost, 0.4 * boost, .70 * boost);
  }
}

  