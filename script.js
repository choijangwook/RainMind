let audioCtx, layers={}, gains={}, panner;
let timer, autoPanInt, listenTime=0;

function init(){
  audioCtx=new (window.AudioContext||window.webkitAudioContext)();

  create("rain","sounds/rain.mp3",0.5);
  create("cafe","sounds/cafe.mp3",0);
  create("wind","sounds/wind.mp3",0);
  create("thunder","sounds/thunder.mp3",0);
  create("drone","sounds/drone.mp3",0);

  panner=audioCtx.createStereoPanner();

  Object.values(layers).forEach(l=>{
    l.source.connect(panner).connect(audioCtx.destination);
    l.audio.play();
  });

  load();
  autoTimeMode();
  fetchWeather();
  trackTime();
  fx();
}

// ===== 생성 =====
function create(n,f,v){
  let a=new Audio(f); a.loop=true;
  let s=audioCtx.createMediaElementSource(a);
  let g=audioCtx.createGain(); g.gain.value=v;
  s.connect(g);
  layers[n]={audio:a,source:s,gain:g};
  gains[n]=g;
}

// ===== 토글 =====
function toggle(){
  if(!audioCtx) init();
  else audioCtx.state==="running"?audioCtx.suspend():audioCtx.resume();
}

// ===== 상태 기반 =====
function applyState(s){
  if(s==="sleepy") applyMode("sleep");
  if(s==="focus") applyMode("focus");
  if(s==="stress") applyMode("anxiety");
}

// ===== 시간 기반 =====
function autoTimeMode(){
  let h=new Date().getHours();
  if(h>=23||h<6) applyMode("sleep");
  else if(h<18) applyMode("focus");
  else applyMode("relax");
}

// ===== 날씨 기반 =====
function fetchWeather(){
  fetch("https://api.open-meteo.com/v1/forecast?latitude=37.5&longitude=127&current_weather=true")
  .then(r=>r.json())
  .then(d=>{
    if(d.current_weather.weathercode<60){
      gains.rain.gain.value+=0.1;
      gains.thunder.gain.value=0.1;
    }
  });
}

// ===== 모드 =====
function applyMode(m){
  reset();

  if(m==="sleep"){
    gains.rain.gain.value=0.3;
    gains.drone.gain.value=0.2;
  }
  if(m==="focus"){
    gains.rain.gain.value=0.5;
    gains.cafe.gain.value=0.2;
  }
  if(m==="relax"){
    gains.rain.gain.value=0.4;
    gains.wind.gain.value=0.2;
  }
  if(m==="anxiety"){
    gains.rain.gain.value=0.2;
  }
}

// ===== 3D =====
document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("pan").addEventListener("input",e=>{
    if(panner) panner.pan.value=e.target.value;
  });
});

function autoPan(){
  clearInterval(autoPanInt);
  autoPanInt=setInterval(()=>{
    panner.pan.value=Math.sin(Date.now()/2000);
  },100);
}

// ===== 타이머 =====
function setTimer(m){
  clearInterval(timer);
  let t=m*60;
  timer=setInterval(()=>{
    t--;
    Object.values(gains).forEach(g=>g.gain.value*=0.999);
    if(t<=0) clearInterval(timer);
  },1000);
}

// ===== 저장 =====
function save(){
  localStorage.setItem("rm",JSON.stringify({
    rain:gains.rain.gain.value,
    pan:panner.pan.value
  }));
}

function load(){
  let d=JSON.parse(localStorage.getItem("rm"));
  if(!d) return;
  gains.rain.gain.value=d.rain;
  panner.pan.value=d.pan;
}

// ===== 통계 =====
function trackTime(){
  setInterval(()=>{
    listenTime++;
    localStorage.setItem("time",(+localStorage.getItem("time")||0)+1);
    updateStats();
  },1000);
}

function updateStats(){
  let t=localStorage.getItem("time")||0;
  document.getElementById("stats").innerText=
  "Total Listening: "+Math.floor(t/60)+" min";
}

// ===== 리셋 =====
function reset(){
  Object.values(gains).forEach(g=>g.gain.value=0);
}

// ===== 인터랙션 =====
function fx(){
  let c=document.getElementById("fx");
  let ctx=c.getContext("2d");
  c.width=innerWidth; c.height=innerHeight;

  window.onclick=e=>{
    let r=0;
    let anim=setInterval(()=>{
      ctx.clearRect(0,0,c.width,c.height);
      ctx.beginPath();
      ctx.arc(e.clientX,e.clientY,r,0,Math.PI*2);
      ctx.strokeStyle="rgba(255,255,255,0.2)";
      ctx.stroke();
      r+=5;
      if(r>200) clearInterval(anim);
    },30);
  };
}
