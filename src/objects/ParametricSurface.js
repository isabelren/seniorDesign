import { ParametricGeometry, Vector3, Color, Mesh, Face3, MeshLambertMaterial, DoubleSide } from 'three'


const wireMaterial = new MeshLambertMaterial({color: 0xff66b3, side: DoubleSide})

var uMin, uMax, vMin, vMax, 
xFuncText, yFuncText, zFuncText, 
uRange, vRange, zRange, segments, 
xFunc, yFunc, zFunc, a, b, c, d,
graphMesh;
uMin = 0;
//degrees
uMax = 3.14 / 2;
vMin = 0;
//length of cylinder
vMax = 10;

//a is the radius of cylinder
a = 10;
b = 1;
c = 1;
d = 1;
segments = 40;


export default function createGraph()
{
	uRange = uMax - uMin;
	vRange = vMax - vMin;
	var meshFunction = function(u0, v0) 
	{
		var u = uRange * u0 + uMin;
		var v = vRange * v0 + vMin;
		var z = Math.cos(u)*(a + b * Math.cos(u));
		var x = v;
		var y = Math.sin(u)*(a + b * Math.cos(u));
		if ( isNaN(x) || isNaN(y) || isNaN(z) )
			return new Vector3(0,0,0); // TODO: better fix
		else
			return new Vector3(x, y, z);
	};
	
	// true => sensible image tile repeat...
	var graphGeometry = new ParametricGeometry( meshFunction, segments, segments, true );
	
	///////////////////////////////////////////////
	// calculate vertex colors based on Z values //
	///////////////////////////////////////////////
	graphGeometry.computeBoundingBox();
	var zMin = graphGeometry.boundingBox.min.z;
	var zMax = graphGeometry.boundingBox.max.z;
	zRange = zMax - zMin;
	var color, point, face, numberOfSides, vertexIndex;
	// faces are indexed using characters
	var faceIndices = [ 'a', 'b', 'c', 'd' ];
	// first, assign colors to vertices as desired
	for ( var i = 0; i < graphGeometry.vertices.length; i++ ) 
	{
		point = graphGeometry.vertices[ i ];
		color = new Color( 0x0000ff );
		color.setHSL( 0.7 * (zMax - point.z) / zRange, 1, 0.5 );
		graphGeometry.colors[i] = color; // use this array for convenience
	}
	// copy the colors as necessary to the face's vertexColors array.
	for ( var i = 0; i < graphGeometry.faces.length; i++ ) 
	{
		face = graphGeometry.faces[ i ];
		numberOfSides = ( face instanceof Face3 ) ? 3 : 4;
		for( var j = 0; j < numberOfSides; j++ ) 
		{
			vertexIndex = face[ faceIndices[ j ] ];
			face.vertexColors[ j ] = graphGeometry.colors[ vertexIndex ];
		}
	}
	///////////////////////
	// end vertex colors //
	///////////////////////
	
	var xMin = graphGeometry.boundingBox.min.x;
	var xMax = graphGeometry.boundingBox.max.x;
	var yMin = graphGeometry.boundingBox.min.y;
	var yMax = graphGeometry.boundingBox.max.y;
	
	// material choices: vertexColorMaterial, wireMaterial , normMaterial , shadeMaterial
	
	if (graphMesh) 
	{
		scene.remove( graphMesh );
		// renderer.deallocateObject( graphMesh );
	}
	
	graphMesh = new Mesh( graphGeometry, wireMaterial );
	graphMesh.doubleSided = true;
	return graphMesh;
}
