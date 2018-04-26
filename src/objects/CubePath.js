import { Object3D, CurvePath, CubicBezierCurve3, BufferGeometry, Line, LineBasicMaterial, MeshLambertMaterial, Mesh, Vector3, Matrix4 } from 'three'


var surfaceScale = 70;
var zAxis = new Vector3(0,0,1);
var angle = -Math.PI / 4;
var controlPt = .352284749831;

export default class CubePath extends Object3D {
  constructor (z) {
    super();

    var startPoint = (new Vector3(-surfaceScale, 0, z)).applyAxisAngle(zAxis, angle);
	var controlPoint1 = (new Vector3(-surfaceScale, controlPt * surfaceScale, z)).applyAxisAngle(zAxis, angle);
	var controlPoint2 = (new Vector3( -controlPt * surfaceScale, surfaceScale, z)).applyAxisAngle(zAxis, angle);
	var endPoint = (new Vector3(0, surfaceScale, z)).applyAxisAngle(zAxis, angle);

    var curve = new CurvePath();
    curve.add(
    	new CubicBezierCurve3(
	    	startPoint,
	    	controlPoint1,
	    	controlPoint2,
	    	endPoint
    ));

    var points = curve.getPoints(50);
    var geometry = new BufferGeometry().setFromPoints( points );
    var material = new LineBasicMaterial( { color : 0xff0000 } );
    const mesh = new Line(geometry, material)
    this.curve = curve;

    this.add(mesh);
  }

}




/*
export default class CubePath extends Object3D {
  constructor () {
    super();

    var curve = new CurvePath();
    curve.add(
    	new CubicBezierCurve3(
	    	new Vector3(0, 0, - surfaceScale),
	    	new Vector3(0, .552284749831 * surfaceScale, -surfaceScale),
	    	new Vector3(0, surfaceScale, -.552284749831 * surfaceScale),
	    	new Vector3(0, surfaceScale, 0))
    );

    var points = curve.getPoints(50);
    var geometry = new BufferGeometry().setFromPoints( points );
    var material = new LineBasicMaterial( { color : 0xff0000 } );
    const mesh = new Line(geometry, material)
    mesh.translateY(0.5);
    mesh.rotateX(Math.PI / 4);
    this.curve = curve;

    this.add(mesh);
  }

}*/
