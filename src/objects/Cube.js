import { Object3D, Geometry, BoxGeometry, LineSegments, LineBasicMaterial, EdgesGeometry, RepeatWrapping, TextureLoader, BoxBufferGeometry, MeshStandardMaterial, MeshLambertMaterial, Mesh, Vector3, Matrix4 } from 'three'


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
  constructor (height, curvePath, u, uMax) {
    super()
    this.height = height;
    this.u = u;
    this.uMax = uMax;
    this.curvePath = curvePath;

    var position = curvePath.curve.getPoint(u);
    
    var lookAtPoint = curvePath.curve.getPoint((u + .01) % 1);
    lookAtPoint.setY(lookAtPoint.y + height / 2);

    const black = new MeshLambertMaterial({
        color: 0x000000 // Top?
      })

    const texture = textures[Math.floor((Math.random() * 2))];
    const material = new MeshLambertMaterial({map: texture})

    var materials = [
      material,
      material,
      black, //top
      material, //bottom
      material, //left
      material
    ];

    var box1 = new BoxGeometry(2, height, 2);
    var mesh1 = new Mesh(box1, materials);

    var box2 = new BoxGeometry(1, height/2, 1);
    var mesh2 = new Mesh(box2, materials);
    mesh2.position.y = height/2;

    var geometry = new Geometry();

    mesh2.updateMatrix();
    geometry.merge(mesh1.geometry, mesh1.matrix);
    geometry.merge(mesh2.geometry, mesh2.matrix);
    const mesh = new Mesh(geometry, material)


    //wireframe
    /*const geometry = new EdgesGeometry(new BoxBufferGeometry(2, height, 2))
    const material = new MeshLambertMaterial({color: 0xff69b4})
    var mat = new LineBasicMaterial( { color: 0xFF0000, linewidth: 2})
    var mesh = new LineSegments(geometry, mat)*/

/*
    const geometry = new BoxBufferGeometry(2, height, 2)
    const material = new MeshLambertMaterial({map: texture})
    const mesh = new Mesh(geometry, material)
*/


    this.geometry = geometry;
  	var initRotationTheta = Math.PI / 20;
  	mesh.translateX(position.x);
  	mesh.translateY(position.y + height/2);
  	mesh.translateZ(position.z);
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
  	mesh.position.x = newPosition.x;
  	mesh.position.y = newPosition.y + this.height / 2;
  	mesh.position.z = newPosition.z;
  	var lookAtPoint = this.curvePath.curve.getPoint((this.u + .01) % 1);
  	lookAtPoint.setY(lookAtPoint.y + this.height / 2);

	   mesh.lookAt(lookAtPoint);
  }

  changeColor(boost) {
    this.children[0].material.color.setRGB(boost, 0.4 * boost, .70 * boost);
  }
}

/*s
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



    var initRotationTheta = 0;
	var rotMatrix = (new Matrix4()).makeRotationX(initRotationTheta);
	var translate = (new Matrix4()).makeTranslation(0, 0, -10);

	var transformationMatrix = (new Matrix4()).multiplyMatrices(rotMatrix, translate);
	var point = (new Vector3()).applyMatrix4(transformationMatrix);

	var translationVector = point.sub(new Vector3()).normalize();
	