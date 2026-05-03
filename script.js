let ctx, audioCtx;
let layers = {}, gains = {};
let panner, timer, autoPanInterval;

// 초기화
function init() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  createLayer("rain","sounds/rain.mp3",0.5);
  createLayer("cafe","sounds/cafe.mp3",0);
  createLayer("wind","sounds/wind.mp3",0);
  createLayer("thunder","sounds/thunder.mp3",0);
  createLayer("drone","sounds/drone.mp3",0);

  panner = audioCtx.createStereoPanner();

  Object.values(layers).forEach(l=>{
    l.source.connect(panner).connect(audioCtx.destination);
    l.audio.play();
  });

  load();
  initFX();
}

// 레이어 생성
function createLayer(name,file,vol){
  let audio=new Audio(file);
  audio.loop=true;

  let source=audioCtx.createMediaElementSource(audio);
  let gain=audioCtx.createGain();
  gain.gain.value=vol;

  source.connect(gain);

  layers[name]={audio,source,gain};
  gains[name]=gain;
}

// 토글
function toggle(){
  if(!audioCtx) init();
  else audioCtx.state==="running"?audioCtx.suspend():audioCtx.resume();
}

// ===== MODE =====
function applyMode(mode){
  reset();

  if(mode==="sleep"){
    gains.rain.gain.value=0.3;
    gains.drone.gain.value=0.2;
    slowFade();
  }

  if(mode==="focus"){
    gains.rain.gain.value=0.5;
    gains.cafe.gain.value=0.2;
  }

  if(mode==="relax"){
    gains.rain.gain.value=0.4;
    gains.wind.gain.value=0.2;
  }

  if(mode==="anxiety"){
    gains.rain.gain.value=0.2;
    stablePattern();
  }
}

// ===== EMOTION =====
function applyEmotion(e){
  if(e==="calm") gains.rain.gain.value*=0.9;
  if(e==="deep") gains.rain.gain.value*=1.2;
  if(e==="warm") gains.drone.gain.value=0.2;
  if(e==="lowvar") stablePattern();
}

// ===== 3D =====
function setPan(v){
  if(panner) panner.pan.value=v;
}

document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("pan").addEventListener("input",e=>{
    setPan(e.target.value);
  });
});

function autoPan(){
  clearInterval(autoPanInterval);
  autoPanInterval=setInterval(()=>{
    panner.pan.value=Math.sin(Date.now()/2000);
  },100);
}

// ===== 패턴 =====
function slowFade(){
  setInterval(()=>{
    gains.rain.gain.value*=0.9995;
  },1000);
}

function stablePattern(){
  setInterval(()=>{
    gains.rain.gain.value=0.25;
  },2000);
}

// ===== TIMER =====
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

// ===== 저장 =====
function save(){
  let data={
    rain:gains.rain.gain.value,
    pan:panner.pan.value
  };
  localStorage.setItem("rainmind",JSON.stringify(data));
}

function load(){
  let d=JSON.parse(localStorage.getItem("rainmind"));
  if(!d) return;
  gains.rain.gain.value=d.rain;
  panner.pan.value=d.pan;
}

// ===== 리셋 =====
function reset(){
  Object.values(gains).forEach(g=>g.gain.value=0);
}

// ===== 인터랙션 FX =====
function initFX(){
  const canvas=document.getElementById("rainFX");
  ctx=canvas.getContext("2d");

  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;

  window.addEventListener("click",e=>{
    drawRipple(e.clientX,e.clientY);
  });
}

function drawRipple(x,y){
  let r=0;
  let anim=setInterval(()=>{
    ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.strokeStyle="rgba(255,255,255,0.2)";
    ctx.stroke();
    r+=5;
    if(r>200) clearInterval(anim);
  },30);
}
