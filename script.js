let audioCtx, layers={}, gains={}, panner, timer;
let isPlaying=false;

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

// START/STOP
function toggle(){
  if(!audioCtx){
    init();
    isPlaying=true;
  } else if(audioCtx.state==="running"){
    audioCtx.suspend();
    isPlaying=false;
  } else {
    audioCtx.resume();
    isPlaying=true;
  }

  document.getElementById("mainBtn").innerText =
    isPlaying ? "⏸ Stop" : "▶ Start";
}

// MODE + ACTIVE UI
function applyMode(btn,mode){
  document.querySelectorAll(".btn-group button")
    .forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");

  reset();

  if(mode==="sleep"){
    fade(gains.rain,0.3);
    fade(gains.drone,0.25);
  }

  if(mode==="focus"){
    fade(gains.rain,0.5);
    fade(gains.cafe,0.25);
  }

  if(mode==="relax"){
    fade(gains.rain,0.4);
    fade(gains.wind,0.25);
  }

  if(mode==="anxiety"){
    fade(gains.rain,0.2);
  }
}

// VOLUME
function setVolume(name,val){
  fade(gains[name],parseFloat(val));
}

// FADE
function fade(g,target){
  let step=(target-g.gain.value)/20;
  let i=0;

  let f=setInterval(()=>{
    g.gain.value+=step;
    i++;
    if(i>=20) clearInterval(f);
  },30);
}

// RESET (완전 무음)
function reset(){
  Object.values(gains).forEach(g=>g.gain.value=0);
}

// TIMER
function setTimer(min){
  clearInterval(timer);
  let t=min*60;

  timer=setInterval(()=>{
    t--;

    if(t<=0){
      fadeOutAll();
      clearInterval(timer);
    }
  },1000);
}

// 전체 페이드 아웃
function fadeOutAll(){
  Object.values(gains).forEach(g=>{
    fade(g,0);
  });
}
