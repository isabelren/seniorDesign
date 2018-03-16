import { WebGLRenderer, Scene, PerspectiveCamera, Vector3, PointLight } from 'three'
import loop from 'raf-loop'
import WAGNER from '@superguigui/wagner'
import BloomPass from '@superguigui/wagner/src/passes/bloom/MultiPassBloomPass'
import FXAAPass from '@superguigui/wagner/src/passes/fxaa/FXAAPass'
import resize from 'brindille-resize'
import Torus from './objects/Torus'
import Cube from './objects/Cube'
import OrbitControls from './controls/OrbitControls'
import { gui } from './utils/debug'
import ExtrudedSurface from './objects/ExtrudedSurface'
import createGraph from './objects/ParametricSurface'
import CubePath from './objects/CubePath'

var numCubes = 30;
/* Custom settings */
const SETTINGS = {
  useComposer: false
}

/* Init renderer and canvas */
const container = document.body
const renderer = new WebGLRenderer({antialias: true})
renderer.setClearColor(0xe6f2ff)
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
  distance: 14.12, 
  phi: 1.29, 
  theta: 1.58,
  target: new Vector3(-15,43,0)})


/* Lights */
const frontLight = new PointLight(0xFFFFFF, 1, 100)
const backLight = new PointLight(0xFFFFFF, 0.75, 100)
scene.add(frontLight)
scene.add(backLight)
frontLight.position.set(20, 65, -10)
backLight.position.set(-20, 65, 10)

/* Actual content of the scene */

//var surface2 = createGraph();
scene.add(createGraph())

var surface = new ExtrudedSurface();
var i;


var cubePathL = new CubePath(-5);
scene.add(cubePathL);

var cubePathR = new CubePath(5);
scene.add(cubePathR);

for (i = 0; i < numCubes; i++) {
  var u = i/numCubes
  if (u > .05 && u < .6) {
    var lHeight = generateHeight();
    var cubeL = new Cube(lHeight, cubePathL, u);
    scene.add(cubeL)

    var rHeight = generateHeight();
    var cubeR = new Cube(rHeight, cubePathR, u);
    scene.add(cubeR)
  }
  
}

scene.add(surface)

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


  loopAndUpdateChildren(scene);
  //console.log(controls.phi)

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

function loopAndUpdateChildren(scene) {
  for (var i = 0; i < scene.children.length; i++) {
    if (scene.children[i] instanceof Cube) {
      Cube.prototype.incrementU.call(scene.children[i]);
    }
  }
}

function generateHeight() {
  return Math.floor((Math.random() * 8) + 1);
}
