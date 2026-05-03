let audioCtx, layers={}, gains={}, timer;
let isPlaying=false;

// INIT
function init(){
  audioCtx=new (window.AudioContext||window.webkitAudioContext)();

  ["rain","cafe","wind","thunder","drone"].forEach(n=>{
    let a=new Audio("sounds/"+n+".mp3");
    a.loop=true;

    let s=audioCtx.createMediaElementSource(a);
    let g=audioCtx.createGain();

    s.connect(g).connect(audioCtx.destination);
    a.play();

    layers[n]={audio:a,gain:g};
    gains[n]=g;
    g.gain.value=0;
  });

  autoMode();
  fetchWeather();
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

  mainBtn.innerText = isPlaying ? "⏸ Stop" : "▶ Start";
}

// MODE
function applyMode(btn,mode){
  document.querySelectorAll(".btn-group button")
    .forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");

  reset();

  if(mode==="sleep"){ fade("rain",0.3); fade("drone",0.25); }
  if(mode==="focus"){ fade("rain",0.5); fade("cafe",0.25); }
  if(mode==="relax"){ fade("rain",0.4); fade("wind",0.25); }
  if(mode==="anxiety"){ fade("rain",0.2); }
}

// AUTO MODE (시간)
function autoMode(){
  let h=new Date().getHours();
  if(h<6||h>22) applyModeFake("sleep");
  else if(h<18) applyModeFake("focus");
  else applyModeFake("relax");
}

// 날씨
function fetchWeather(){
  fetch("https://api.open-meteo.com/v1/forecast?latitude=37.5&longitude=127&current_weather=true")
  .then(r=>r.json())
  .then(d=>{
    if(d.current_weather.weathercode<60){
      fade("rain",0.6);
      fade("thunder",0.2);
    }
  });
}

// FADE
function fade(name,val){
  let g=gains[name];
  let step=(val-g.gain.value)/20;
  let i=0;

  let f=setInterval(()=>{
    g.gain.value+=step;
    i++;
    if(i>=20) clearInterval(f);
  },30);
}

// RESET
function reset(){
  Object.values(gains).forEach(g=>g.gain.value=0);
}

// VOLUME
function setVolume(name,val){
  fade(name,parseFloat(val));
}

// TIMER
function setTimer(m){
  clearInterval(timer);
  let t=m*60;

  timer=setInterval(()=>{
    t--;
    if(t<=0){
      Object.keys(gains).forEach(n=>fade(n,0));
      clearInterval(timer);
    }
  },1000);
}

// PRESET
function savePreset(){
  let data={};
  Object.keys(gains).forEach(k=>data[k]=gains[k].gain.value);
  localStorage.setItem("preset",JSON.stringify(data));
}

function loadPreset(){
  let d=JSON.parse(localStorage.getItem("preset"));
  if(!d) return;
  Object.keys(d).forEach(k=>fade(k,d[k]));
}

// auto용
function applyModeFake(m){
  reset();
  if(m==="sleep"){ fade("rain",0.3); fade("drone",0.2); }
  if(m==="focus"){ fade("rain",0.5); fade("cafe",0.2); }
  if(m==="relax"){ fade("rain",0.4); fade("wind",0.2); }
}
