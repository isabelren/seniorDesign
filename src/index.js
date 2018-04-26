import { WebGLRenderer, Scene, PerspectiveCamera, Vector3, PointLight } from 'three'
import loop from 'raf-loop'
import WAGNER from '@superguigui/wagner'
import BloomPass from '@superguigui/wagner/src/passes/bloom/MultiPassBloomPass'
import FXAAPass from '@superguigui/wagner/src/passes/fxaa/FXAAPass'
import resize from 'brindille-resize'
import Cube from './objects/Cube'
import Floor from './objects/Floor'
import Building from './objects/Building'
import Room from './objects/Room'
import Torus from './objects/Torus'
import Icosahedron from './objects/Icosahedron'
import WireframeIcosahedron from './objects/WireframeIcosahedron'
import { BSPBuilding, RoomMerge, FloorMerge } from './objects/BSPBuilding'
import OrbitControls from './controls/OrbitControls'
import { gui } from './utils/debug'
import ExtrudedSurface from './objects/ExtrudedSurface'
import createGraph from './objects/ParametricSurface'
import CubePath from './objects/CubePath'
import Lsystem, {LinkedListToString} from './LSystem'
import Turtle from './turtle'

const THREE = require('three');


var uMax = .95;
var numCubes = 15;
var boost = 0;
var prevBoost = 0;

// Array of buildings for easy access
var cubeArr = [];

//Color Values
var rVal = 249
var gVal = 228
var bVal = 255

var iso;
var wireIso;
var wireIso2;
var wireIsoScale = 1;



/* Custom settings */
const SETTINGS = {
  useComposer: false
}

/* Init renderer and canvas */
const container = document.body
const renderer = new WebGLRenderer({antialias: true})
//renderer.setClearColor(0xf9e4ff)
var cColor = new THREE.Color(rVal/255,gVal/255,bVal/255)
renderer.setClearColor(0x000000)

container.style.overflow = 'hidden'
container.style.margin = 0
container.appendChild(renderer.domElement)

/* Composer for special effects */
const composer = new WAGNER.Composer(renderer)
const bloomPass = new BloomPass()
const fxaaPass = new FXAAPass()

/* Main scene and camera */
const scene = new Scene()
const camera = new PerspectiveCamera(50, resize.width / resize.height, 0.1, 1000)

const controls = new OrbitControls(camera, {element: renderer.domElement, parent: renderer.domElement, 
  distance: 64, 
  phi: 1.479,
  theta: Math.PI / 2,
  /*distance: 40,
  phi: 1.1, 
  theta: 2,*/
  target: new Vector3(-15,60,0)})

/* Lights */
const frontLight = new PointLight(0xFFFFFF, 2, 100)
const backLight = new PointLight(0xFFFFFF, 2, 100)
const lowLight =  new PointLight(0xFFFFFF, 1, 100)
const lowLight2 =  new PointLight(0xFFFFFF, 2, 100)
const icosLight =  new PointLight(0xFFFFFF, 1, 100)


var light = new THREE.AmbientLight( 0x292929 ); // soft white light
scene.add( light );

var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
scene.add( directionalLight );
directionalLight.position.set(55, 60, 0)
var targetObject = new THREE.Object3D();
scene.add(targetObject);
targetObject.position.set(50,80,10)
directionalLight.target = targetObject;


scene.add(frontLight);
//scene.add(backLight)
//scene.add(lowLight)
//scene.add(lowLight2)
scene.add(icosLight)

icosLight.position.set(-80, 120, -5)
frontLight.position.set(30, 80, -25)
backLight.position.set(-30, 80, 25)
lowLight.position.set(60, 50, 0)
lowLight2.position.set(55, 30, 0)


var t = new Torus();
scene.add(t)
t.position.set(55, 60, 0);
var t = new Torus();
scene.add(t)
t.position.set(50, 65, 0);

iso = new Icosahedron(6, 0);
scene.add(iso)
iso.position.set(-100, 90, 0);


wireIso = new WireframeIcosahedron(8, 0);
scene.add(wireIso)

wireIso2 = new WireframeIcosahedron(10, 0);
scene.add(wireIso2)

wireIso.position.set(-100, 90, 0);
wireIso2.position.set(-100, 90, 0);
wireIso2.rotateOnAxis(new Vector3(0, 1, 0), 1.5);



var lsys = new Lsystem();
var turtle = new Turtle();

/*var building1 = doLsystem(lsys, 6, turtle);
building1.mesh.position.set(-15,60,0)
scene.add(building1)

var building2 = doLsystem(lsys, 6, turtle);
building2.mesh.position.set(-15,60,10)
scene.add(building2)
var building3 = doLsystem(lsys, 6, turtle);
building3.mesh.position.set(-15,60,-10)
scene.add(building3)*/

/* Actual content of the scene */
addObjectsToScene(scene, lsys);

//turtle will create a building given number of floors and heights. each floor is a new room
//each building will have at least 3 floors
//rules for room transformations
//rules for room size
//rules for kinds of rooms

function doLsystem(lsystem, iterations, turtle) {
    var result = lsystem.doIterations(iterations);
    console.log(LinkedListToString(result))
    turtle.renderSymbols(result);
    var building = turtle.getAndResetBuilding()
    building.CreateBuildingFromRooms();
    return building;
}

/* Various event listeners */
resize.addListener(onResize)

/* create and launch main loop */
const engine = loop(render)
engine.start()

/* some stuff with gui */
gui.add(SETTINGS, 'useComposer')

/* -------------------------------------------------------------------------------- */

/**
  Resize canvas
*/
function onResize () {
  camera.aspect = resize.width / resize.height
  camera.updateProjectionMatrix()
  renderer.setSize(resize.width, resize.height)
  composer.setSize(resize.width, resize.height)
}

/**
  Render loop
*/
function render (dt) {
  controls.update()

  iso.rotateOnAxis(new Vector3(0,1,0), 0.05)

  if (boost != 0) {
    var boostPercentage = ((100 - (boost * .8)) / 110) * 4
    loopAndUpdateColor(scene, boostPercentage);
    var scale1 = wireIsoScale * 1 + (boostPercentage * .4);
    var scale2 = wireIsoScale * 1 + (boostPercentage * .05);
    wireIso.scale.set(scale1, scale1, scale1)
    wireIso2.scale.set(scale2, scale2, scale2)
  } else {
    loopAndUpdatePositions(scene);
  }
  

  if (SETTINGS.useComposer) {
    composer.reset()
    composer.render(scene, camera)
    composer.pass(bloomPass)
    composer.pass(fxaaPass)
    composer.toScreen()
  }else {
    renderer.render(scene, camera)
  }
}


function loopAndUpdatePositions(scene) {
  for (var cInd = 0; cInd < cubeArr.length; cInd++) {
      cubeArr[cInd].incrementU();
  }
}

function loopAndUpdateColor(scene, boostPercentage) {
 for (var cInd = 0; cInd < cubeArr.length; cInd++) {
      cubeArr[cInd].incrementAndChangeColor(boostPercentage);
  }
}

function addObjectsToScene(scene, lsys) {
  var surface = new ExtrudedSurface();

  var cubePathL = new CubePath(-9);
  var cubePathR = new CubePath(9);

  // Uncomment to add paths to scene
  //scene.add(cubePathR);
  //scene.add(cubePathL);

  for (var i = 0; i < numCubes; i++) {

    var u = i/ (numCubes-1);
    if (u < uMax) {
      var building1 = doLsystem(lsys, 6, turtle);
      var building2 = doLsystem(lsys, 6, turtle);
      var lHeight = generateHeight();
      var cubeL = new Cube(lHeight, cubePathL, u, uMax, building1);
      scene.add(cubeL)

      var rHeight = generateHeight();
      var cubeR = new Cube(rHeight, cubePathR, u, uMax, building2);
      scene.add(cubeR)

      cubeArr.push(cubeL);
      cubeArr.push(cubeR);
      
      
    } else {
      break;
    }
  
  }
  scene.add(surface)
}

function generateHeight() {
  return Math.floor((Math.random() * 8) + 1);
}


var context;
var source, sourceJs;
var analyser;
var url = 'src/audio/trimmedkhalid.mp3';
var array = new Array();

try {
  // Fix up for prefixing
  window.AudioContext = window.AudioContext||window.webkitAudioContext;
  context = new AudioContext();
}
catch(e) {
  alert('Web Audio API is not supported in this browser');
}

var button = document.querySelector('button');
button.onclick = function() {  
  loadSound(url);
}

function loadSound(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      var musicBuffer = buffer;
      playSound(musicBuffer)
    }, onError);
  }
  request.send();
}

function onError(error) {
  console.error(error)
}


function playSound(buffer) {
  //Script Processor Node handles on how many the onaudiopress event is dispatched
  var sourceJs = context.createScriptProcessor(2048, 1, 1);
  sourceJs.buffer = buffer;
  sourceJs.connect(context.destination);

  //Analyser Node provides real-time frequency and time-domain analysis information
  var analyser = context.createAnalyser();
  analyser.smoothingTimeConstant = 0.6;
  analyser.fftSize = 512;

  //Audio Buffer Source Node for playback
  source = context.createBufferSource();
  source.buffer = buffer;    
           // tell the source which sound to play
  
  source.connect(analyser);
  analyser.connect(sourceJs);
  source.connect(context.destination);  

  //Copy data into unsigned byte array to scale the cubes
  sourceJs.onaudioprocess = function(e) {
    
    /*array = new Float32Array(analyser.fftSize
    analyser.getFloatTimeDomainData(array);*/
    
    /*array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);*/


    array = new Uint8Array(analyser.fftSize); // Uint8Array should be the same length as the fftSize 
    analyser.getByteTimeDomainData(array)
    boost = 0;
    for (var i = 0; i < array.length; i++) {
        boost += array[i] * .5;
    }
    boost = boost / array.length;

  };
  source.start(0);                           // play the source now
                                             // note: on older systems, may have to use deprecated noteOn(time);
}
