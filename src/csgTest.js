const THREE = require('three')
var objLoader = new THREE.objLoader()



function CSGShape() {
	var material	= new THREE.MeshNormalMaterial({
				shading: THREE.SmoothShading
			});
			var material	= new THREE.MeshLambertMaterial( { color: 0xaaaaDD, shading: THREE.FlatShading } );

			var cubeMesh	= new THREE.Mesh( new THREE.CubeGeometry( 2, 2, 2 ), material );

			var cubeCsg	= THREE.CSG.toCSG(cubeMesh);
			var resultCsg	= cubeCsg;

			var radius	= 1/4;
			var sphereMesh	= new THREE.Mesh( new THREE.SphereGeometry(radius, 16, 8), material );
			//var sphereMesh	= new THREE.Mesh( new THREE.SphereGeometry(radius, 32, 16), material );

			var o		= 0.6;
			var r		= 1;
			var coordinates	= [
				// Face 6
				[-o, -o, +r],
				[-o,  0, +r],
				[-o, +o, +r],
				[+o, -o, +r],
				[+o,  0, +r],
				[+o, +o, +r],
				// Face 1
				[ 0,  0, -r],
				// Face 4
				[-r, +o, -o],
				[-r, -o, -o],
				[-r, +o, +o],
				[-r, -o, +o],
				// Face 3
				[+r, +o, -o],
				[+r,  0,  0],
				[+r, -o, +o],
				// Face 2
				[+o, +r, -o],
				[-o, +r, +o],
				// Face 5
				[+o, -r, -o],
				[-o, -r, -o],
				[ 0, -r,  0],
				[+o, -r, +o],
				[-o, -r, +o],
			];

			var dots	= new THREE.Geometry();
			for(var i = 0; i < coordinates.length; i++){
				var coords	= coordinates[i];

				sphereMesh.position.x	= coords[0];
				sphereMesh.position.y	= coords[1];
				sphereMesh.position.z	= coords[2];

				THREE.GeometryUtils.merge(dots, sphereMesh);
			}
			var sphereCsg	= THREE.CSG.toCSG(dots);
			
			var operation	= window.location.hash.substr(1) || "substract";
			if( operation === "substract" ){
				var resultCsg	= resultCsg.subtract(sphereCsg);
			}else if( operation === "union" ){
				var resultCsg	= resultCsg.union(sphereCsg);
			}else if( operation === "intersect" ){
				var resultCsg	= resultCsg.intersect(sphereCsg);
			}else{
				var resultCsg	= resultCsg.subtract(sphereCsg);
			}

			var resultGeo	= THREE.CSG.fromCSG( resultCsg );

			THREEx.GeometryUtils.center(resultGeo);	

			mesh = new THREE.Mesh( resultGeo, material );

			scene.add( mesh );
		}
}

export default {
	CSGShape: CSGShape
}