var context;
var source, sourceJs;
var analyser;
var url = 'src/audio/trimmedkhalid.mp3';
var array = new Array();
var boost = 0;


//TODO: Preload and then play

window.addEventListener('load', init, false);
function init() {
  try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }
}

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
      musicBuffer = buffer;
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
  source.loop = true          // tell the source which sound to play
  
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
    console.log(boost)
  };
  source.start(0);                           // play the source now
                                             // note: on older systems, may have to use deprecated noteOn(time);
}


