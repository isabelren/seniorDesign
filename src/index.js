import { WebGLRenderer, Scene, PerspectiveCamera, Vector3, PointLight } from 'three'
import loop from 'raf-loop'
import WAGNER from '@superguigui/wagner'
import BloomPass from '@superguigui/wagner/src/passes/bloom/MultiPassBloomPass'
import FXAAPass from '@superguigui/wagner/src/passes/fxaa/FXAAPass'
import resize from 'brindille-resize'
import Torus from './objects/Torus'
import Cube from './objects/Cube'
import Cube2 from './objects/Cube2'
import Floor from './objects/Floor'
import Building from './objects/Building'
import Room from './objects/Room'
import TestCube from './objects/TestCube'
import { BSPBuilding, RoomMerge, FloorMerge } from './objects/BSPBuilding'
import OrbitControls from './controls/OrbitControls'
import { gui } from './utils/debug'
import ExtrudedSurface from './objects/ExtrudedSurface'
import createGraph from './objects/ParametricSurface'
import CubePath from './objects/CubePath'


var uMax = .85;
var numCubes = 30;
var boost = 0;

/* Custom settings */
const SETTINGS = {
  useComposer: false
}

/* Init renderer and canvas */
const container = document.body
const renderer = new WebGLRenderer({antialias: true})
renderer.setClearColor(0xD7E4FF)
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
  distance: 40, 
  phi: 1.52, 
  theta: Math.PI / 2,
  target: new Vector3(-15,43,0)})

/* Lights */
const frontLight = new PointLight(0xFFFFFF, 3, 100)
const backLight = new PointLight(0xFFFFFF, 3, 100)
const lowLight =  new PointLight(0xFFFFFF, 1, 100)
scene.add(frontLight)
scene.add(backLight)
scene.add(lowLight)
frontLight.position.set(30, 70, -25)
backLight.position.set(-30, 70, 25)
lowLight.position.set(60, 40, 0)

/* Actual content of the scene */
//addObjectsToScene(scene);


//parameters - max height, min height
//scale (determined by max and min height?)

function generateRoom(height, scale=1, xTrans = 0, yTrans = 0, minHeight = 0, maxHeight = 4) {
  var xLength = scale + Math.floor((Math.random() * 4 * scale) + 1);
  var yLength = scale + Math.floor((Math.random() * 4 * scale) + 1);
  return new Room(height, xLength, yLength, 1, xTrans, yTrans);
}

//invoked at the end of each LSystem
//number of rooms, height
//loop through number of rooms
//list of Transform objects (MAKE TRANSFORM OBJECT! to hold translation and x/y scales)
function generateFloor(floor=1) {
  var randHeight = 3 + Math.floor((Math.random() * 8) + 1);
  const room1 = generateRoom(randHeight, floor);
  const room2 = generateRoom(randHeight, floor, 0.5, 0.5);
  return new Floor(RoomMerge(room1.mesh, room2.mesh), randHeight);
}

for (var i = 0; i <= 4; i++) {
  var numFloors = Math.floor((Math.random() * 5) + 1);
  const building = new Building();

  for (var j = 0; j <= numFloors; j++) {
    var randHeight = 3 + Math.floor((Math.random() * 8) + 1);

    var numRooms = Math.floor((Math.random() * 4) + 1);

    for (var r = 0; r <= numRooms; r++) {
      var randTransX = -2 + (Math.random() * 4);
      var randTransY = -2 + (Math.random() * 4);
      building.CreateRoom(randHeight, randTransX, randTransY);
    }

    building.CreateFloor();
  }

  building.translateX(30 * i);
  
  scene.add(building)
}

/*
const floorRoom1 = new Room(4, 1, 3, 1, 0, 0);
const floorRoom2 = new Room(4, 2, 1, 1, 0.5, 0.5);
const floor1 = new Floor(RoomMerge(floorRoom1.mesh, floorRoom2.mesh), 4);

const building = new Building(floor1);

const floorMesh3 = new Room(4, 4, 3, 1, 0, 0);
const floorMesh4 = new Room(4, 2, 3, 1, 0.5, 3);
const floor2 = new Floor(RoomMerge(floorMesh3.mesh, floorMesh4.mesh), 4);

building.AddFloor(floor2)
scene.add(building)*/


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


  //loopAndUpdatePositions(scene);
  if (boost != 0) {
    var boostPercentage = ((100 - (boost * .8)) / 110) * 4
    loopAndUpdateColor(scene, boostPercentage);
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
  for (var i = 0; i < scene.children.length; i++) {
    if (scene.children[i] instanceof Cube) {
      Cube.prototype.incrementU.call(scene.children[i]);

    }
    if (scene.children[i] instanceof Cube2) {
      Cube2.prototype.incrementU.call(scene.children[i]);

    }
  }
}

function loopAndUpdateColor(scene, boostPercentage) {
  for (var i = 0; i < scene.children.length; i++) {
    if (scene.children[i] instanceof Cube) {
      Cube.prototype.changeColor.call(scene.children[i], boostPercentage);

    }
    if (scene.children[i] instanceof Cube2) {
      Cube2.prototype.changeColor.call(scene.children[i], boostPercentage);

    }
  }
}

function addObjectsToScene(scene) {
  var surface = new ExtrudedSurface();

  var cubePathL = new CubePath(-5);
  var cubePathR = new CubePath(5);

  // Uncomment to add paths to scene
  //scene.add(cubePathR);
  //scene.add(cubePathL);

  for (var i = 0; i < numCubes; i++) {
    var u = i/ (numCubes-1);
    if (u < uMax) {
      if (i % 2 == 0) {
        var lHeight = generateHeight();
        var cubeL = new Cube(lHeight, cubePathL, u, uMax);
        scene.add(cubeL)

        var rHeight = generateHeight();
        var cubeR = new Cube(rHeight, cubePathR, u, uMax);
        scene.add(cubeR)
      } else {
        var lHeight = generateHeight();
        var cubeL = new Cube2(lHeight, cubePathL, u, uMax, -1);
        scene.add(cubeL)

        var rHeight = generateHeight();
        var cubeR = new Cube2(rHeight, cubePathR, u, uMax, 1);
        scene.add(cubeR)
      }
      
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
    array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    boost = 0;
    for (var i = 0; i < array.length; i++) {
        boost += array[i];
    }
    boost = boost / array.length;

  };
  source.start(0);                           // play the source now
                                             // note: on older systems, may have to use deprecated noteOn(time);
}
