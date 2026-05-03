let audioCtx, gains={}, sources={}, timer;
let isPlaying=false;

// INIT
function init(){
  if(audioCtx) return;

  audioCtx=new (window.AudioContext||window.webkitAudioContext)();

  ["rain","cafe","wind","thunder","drone"].forEach(name=>{
    let audio=new Audio("sounds/"+name+".mp3");
    audio.loop=true;

    let src=audioCtx.createMediaElementSource(audio);
    let gain=audioCtx.createGain();

    src.connect(gain).connect(audioCtx.destination);

    gain.gain.value=0;

    audio.play();

    gains[name]=gain;
    sources[name]=audio;
  });

  autoMode();
}

// START/STOP
function toggle(){
  init();

  if(audioCtx.state==="running"){
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
  init();

  document.querySelectorAll(".btn-group button")
    .forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");

  reset();

  if(mode==="sleep"){ fade("rain",0.3); fade("drone",0.25); }
  if(mode==="focus"){ fade("rain",0.5); fade("cafe",0.25); }
  if(mode==="relax"){ fade("rain",0.4); fade("wind",0.25); }
  if(mode==="anxiety"){ fade("rain",0.2); }
}

// AUTO MODE
function autoMode(){
  let h=new Date().getHours();
  if(h<6||h>22) fade("rain",0.3);
  else fade("rain",0.5);
}

// FADE
function fade(name,val){
  let g=gains[name];
  if(!g) return;

  val=Math.max(0,Math.min(1,val));

  g.gain.value=val < 0.01 ? 0 : val;
}

// RESET
function reset(){
  Object.values(gains).forEach(g=>g.gain.value=0);
}

// VOLUME
function setVolume(name,val){
  init();
  fade(name,parseFloat(val));
}

// TIMER
function setTimer(min){
  init();

  clearInterval(timer);

  let t=min*60;

  timer=setInterval(()=>{
    t--;

    if(t<=0){
      reset();
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
