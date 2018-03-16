import { Object3D, BoxBufferGeometry, MeshStandardMaterial, MeshLambertMaterial, Mesh, Vector3, Matrix4 } from 'three'



export default class Cube extends Object3D {
  constructor (height, curvePath, u) {
    super()
    this.height = height;
    this.u = u;
    this.curvePath = curvePath;

    var position = curvePath.curve.getPoint(u);
    
    var lookAtPoint = curvePath.curve.getPoint((u + .01) % 1);
    lookAtPoint.setY(lookAtPoint.y + height / 2);

    const geometry = new BoxBufferGeometry(1, height, 1)
    this.geometry = geometry;
    const material = new MeshLambertMaterial({color: 0xff66b3})
    const mesh = new Mesh(geometry, material)
    
	var initRotationTheta = Math.PI / 20;

	mesh.translateX(position.x);
	mesh.translateY(position.y + height/2);
	mesh.translateZ(position.z);
	mesh.lookAt(lookAtPoint);
	this.add(mesh)
	
  }

  incrementU() {
  	this.u += 0.001;
  	if (this.u > .6) {
  		this.u = .05;
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



    var initRotationTheta = 0;
	var rotMatrix = (new Matrix4()).makeRotationX(initRotationTheta);
	var translate = (new Matrix4()).makeTranslation(0, 0, -10);

	var transformationMatrix = (new Matrix4()).multiplyMatrices(rotMatrix, translate);
	var point = (new Vector3()).applyMatrix4(transformationMatrix);

	var translationVector = point.sub(new Vector3()).normalize();
	