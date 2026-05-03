let audioCtx, layers={}, gains={}, panner, timer;

// INIT
function init(){
  audioCtx=new (window.AudioContext||window.webkitAudioContext)();

  create("rain","sounds/rain.mp3");
  create("cafe","sounds/cafe.mp3");
  create("wind","sounds/wind.mp3");
  create("thunder","sounds/thunder.mp3");
  create("drone","sounds/drone.mp3");

  panner=audioCtx.createStereoPanner();

  Object.values(layers).forEach(l=>{
    l.source.connect(panner).connect(audioCtx.destination);
    l.audio.play();
    l.gain.gain.value=0;
  });

  gains.rain.gain.value=0.5;
}

// CREATE
function create(name,file){
  let a=new Audio(file);
  a.loop=true;

  let s=audioCtx.createMediaElementSource(a);
  let g=audioCtx.createGain();

  s.connect(g);

  layers[name]={audio:a,source:s,gain:g};
  gains[name]=g;
}

// START
function toggle(){
  if(!audioCtx) init();
  else audioCtx.state==="running"?audioCtx.suspend():audioCtx.resume();
}

// MODE
function applyMode(m){
  reset();

  if(m==="sleep"){
    fade(gains.rain,0.3);
    fade(gains.drone,0.2);
  }

  if(m==="focus"){
    fade(gains.rain,0.5);
    fade(gains.cafe,0.2);
  }

  if(m==="relax"){
    fade(gains.rain,0.4);
    fade(gains.wind,0.2);
  }

  if(m==="anxiety"){
    fade(gains.rain,0.2);
  }
}

// FADE
function fade(gain,target){
  let step=(target-gain.gain.value)/20;
  let i=0;

  let f=setInterval(()=>{
    gain.gain.value+=step;
    i++;
    if(i>=20) clearInterval(f);
  },50);
}

// RESET
function reset(){
  Object.values(gains).forEach(g=>fade(g,0));
}

// VOLUME
function setVolume(name,val){
  fade(gains[name],val);
}

// PAN
document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("pan").addEventListener("input",e=>{
    if(panner) panner.pan.value=e.target.value;
  });
});

// TIMER
function setTimer(m){
  clearInterval(timer);
  let t=m*60;

  timer=setInterval(()=>{
    t--;
    Object.values(gains).forEach(g=>{
      g.gain.value*=0.999;
    });
    if(t<=0) clearInterval(timer);
  },1000);
}
