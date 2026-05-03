let audioCtx, layers={}, gains={}, panner;

// ===== INIT =====
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
    l.gain.gain.value=0; // 🔥 전부 0으로 시작
  });

  gains.rain.gain.value=0.5; // 기본

  load();
}

// ===== CREATE =====
function create(name,file){
  let a=new Audio(file);
  a.loop=true;

  let s=audioCtx.createMediaElementSource(a);
  let g=audioCtx.createGain();

  s.connect(g);

  layers[name]={audio:a,source:s,gain:g};
  gains[name]=g;
}

// ===== TOGGLE =====
function toggle(){
  if(!audioCtx) init();
  else audioCtx.state==="running"?audioCtx.suspend():audioCtx.resume();
}

// ===== VOLUME =====
function setVolume(name,val){
  fadeTo(gains[name], val);
}

// ===== FADE =====
function fadeTo(gainNode, target){
  let step=(target - gainNode.gain.value)/20;
  let i=0;

  let f=setInterval(()=>{
    gainNode.gain.value += step;
    i++;
    if(i>=20) clearInterval(f);
  },50);
}

// ===== MODE =====
function applyMode(m){
  reset();

  if(m==="sleep"){
    fadeTo(gains.rain,0.3);
    fadeTo(gains.drone,0.2);
  }

  if(m==="focus"){
    fadeTo(gains.rain,0.5);
    fadeTo(gains.cafe,0.2);
  }

  if(m==="relax"){
    fadeTo(gains.rain,0.4);
    fadeTo(gains.wind,0.2);
  }

  if(m==="anxiety"){
    fadeTo(gains.rain,0.2);
  }
}

// ===== RESET =====
function reset(){
  Object.values(gains).forEach(g=>fadeTo(g,0));
}

// ===== PAN =====
document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("pan").addEventListener("input",e=>{
    if(panner) panner.pan.value=e.target.value;
  });
});

// ===== SAVE =====
function save(){
  let data={};
  Object.keys(gains).forEach(k=>{
    data[k]=gains[k].gain.value;
  });
  data.pan=panner.pan.value;

  localStorage.setItem("rainmind",JSON.stringify(data));
}

// ===== LOAD =====
function load(){
  let d=JSON.parse(localStorage.getItem("rainmind"));
  if(!d) return;

  Object.keys(gains).forEach(k=>{
    if(d[k]!=undefined) gains[k].gain.value=d[k];
  });

  panner.pan.value=d.pan || 0;
}
