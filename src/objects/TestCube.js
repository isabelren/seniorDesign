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

    var mat = new THREE.LineBasicMaterial( { color: 0xFF0000, linewidth: 2})

    var box1 = new THREE.BoxGeometry(2, height, 2);
    var mesh1 = new THREE.Mesh(box1, mat);

    var box2 = new THREE.BoxGeometry(1, height/2, 1);
    var mesh2 = new THREE.Mesh(box2, mat);
    mesh2.position.y = height/2;
/*
    var singleGeometry = new Geometry();
    
    mesh1.updateMatrix()
    singleGeometry.merge(mesh1.geometry, mesh1.matrix)

    mesh2.updateMatrix();
    singleGeometry.merge(mesh2.geometry, mesh2.matrix);*/

    var resultCSG = csg1.subtract(csg2);
    var singleGeometry = resultCSG.toMesh();

    const texture = textures[Math.floor((Math.random() * 3))];
    const material = new THREE.MeshLambertMaterial({map: texture})
    var wireframe = new THREE.Mesh(singleGeometry, material);


//UNCOMMENT FOR WIREFRAME
/*    const geometry = new EdgesGeometry(new BoxBufferGeometry(2, height, 2))
    this.geometry = geometry;

    var mat = new LineBasicMaterial( { color: 0xFF0000, linewidth: 2})
    var wireframe = new LineSegments(geometry, mat)
*/
    /*
    
    console.log(texture)

    const material = new MeshLambertMaterial({map: texture})
    const red wireframe = new MeshLambertMaterial({
        color: 0xFF0000, // Top?,
        wireframe:true
      })
    const yellow = new MeshLambertMaterial({
        color: 0xFFFF00 // Top?
      })
    var materials = [
      material,
      material,
      white, //top
      material, //bottom
      material, //left
      material
    ];
    */
    //const mesh = new Mesh(geometry, materials)
    
	//mesh.translateY(55);

	//this.add(mesh)

  wireframe.translateY(55)

  //this.add(wireframe)
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

/*
export default class Cube extends Object3D {
  constructor (cubeNum) {
    super()

    const geometry = new BoxBufferGeometry(1, 1, 1)
    //const material = new MeshStandardMaterial({color: 0xb3ccff, roughness: 0.18, metalness: 0.5})
    const material = new MeshLambertMaterial({color: 0xff66b3})
    const mesh = new Mesh(geometry, material)
    
	var initRotationTheta = Math.PI / 20;
	mesh.rotateX(- initRotationTheta * cubeNum);
	mesh.translateZ(10.5);

	this.add(mesh)
  }
}*/
