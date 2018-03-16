//import { Object3D, Matrix4, LineBasicMaterial, Line, BufferGeometry, MeshStandardMaterial, Mesh, Vector3, CubicBezierCurve3 } from 'three'
import { DoubleSide, Object3D, Vector2, Vector3, Matrix4, Mesh, LineCurve, Shape, ExtrudeGeometry, MeshLambertMaterial } from 'three'
import Cube from './Cube'

var surfaceScale = 50;
var width = 40;
var controlPt = .352284749831;

var xAxis = new Vector2(1,0);

var zAxis = new Vector3(0,0,1);
var angle = -Math.PI / 4;
var startPoint = (new Vector3(-surfaceScale, 0, 0)).applyAxisAngle(zAxis, angle);
var controlPoint1 = (new Vector3(-surfaceScale, controlPt * surfaceScale, 0)).applyAxisAngle(zAxis, angle);
var controlPoint2 = (new Vector3( -controlPt * surfaceScale, surfaceScale, 0)).applyAxisAngle(zAxis, angle);
var endPoint = (new Vector3(0, surfaceScale, 0)).applyAxisAngle(zAxis, angle);

var extrudeSettings = {
	curveSegments: 100,
	amount: width,
	bevelEnabled: false
}

export default class CubicBezierSurface extends Object3D {
  constructor () {
    super()

    var path = new Shape();
    path.moveTo(startPoint.x, startPoint.y);
    path.bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endPoint.x, endPoint.y);

    var shape3d = new ExtrudeGeometry(path, extrudeSettings);

    const material = new MeshLambertMaterial({color: 0xff66b3, side: DoubleSide})
    const mesh = new Mesh(shape3d, material);
    mesh.translateZ(-width / 2);

    this.add(mesh)
  }

  
}

