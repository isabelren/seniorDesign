import { Object3D, CurvePath, CubicBezierCurve3, BufferGeometry, Line, LineBasicMaterial, MeshLambertMaterial, Mesh, Vector3, Matrix4 } from 'three'
const THREE = require('three');


var surfaceScale = 70;
var zAxis = new Vector3(0,0,1);
var angle = -Math.PI / 4;
var controlPt = .352284749831;

export default class SinWave extends Object3D {
  constructor (y, z) {
    super();

    var curve = new THREE.SplineCurve( [
        new THREE.Vector2( y, z ),
        new THREE.Vector2( y, z + 1 ),
        new THREE.Vector2( y, z ),
        new THREE.Vector2( y, z - 1 ),
        new THREE.Vector2( y, z )
    ] );

    var points = curve.getPoints( 50 );
    var geometry = new THREE.BufferGeometry().setFromPoints( points );

    var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

    // Create the final object to add to the scene
    var splineObject = new THREE.Line( geometry, material );
    this.curve = curve;
    this.add(splineObject)
  }

}


