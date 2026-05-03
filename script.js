let isPlaying = false;
let timerId = null;

const sounds = {
  rain: new Audio("sounds/rain.mp3"),
  cafe: new Audio("sounds/cafe.mp3"),
  wind: new Audio("sounds/wind.mp3"),
  thunder: new Audio("sounds/thunder.mp3"),
  drone: new Audio("sounds/drone.mp3")
};

// 초기 세팅
Object.values(sounds).forEach(a=>{
  a.loop = true;
  a.volume = 0;
});

document.addEventListener("DOMContentLoaded", ()=>{

  console.log("RainMind loaded");

  // ▶ Start / Stop
  const mainBtn = document.getElementById("mainBtn");

  if(mainBtn){
    mainBtn.addEventListener("click", async ()=>{

      if(!isPlaying){
        for(let a of Object.values(sounds)){
          try{ await a.play(); }catch(e){}
        }
        mainBtn.innerText = "⏸ Stop";
        mainBtn.classList.add("active");
        isPlaying = true;
      }else{
        stopAll();
      }

    });
  }

  // 🎚 BAR (슬라이더)
  document.querySelectorAll("input[type=range]").forEach(slider=>{
    slider.addEventListener("input", (e)=>{
      const key = e.target.dataset.sound;
      if(sounds[key]){
        sounds[key].volume = parseFloat(e.target.value);
      }
    });
  });

  // 🎯 프리셋 버튼 강제 연결 (핵심)
  document.querySelectorAll(".preset-row button, .grid button").forEach(btn=>{
    const txt = btn.innerText.toLowerCase();

    if(txt.includes("sleep")) btn.onclick = ()=>applyPresetUI(btn,"sleep");
    if(txt.includes("focus")) btn.onclick = ()=>applyPresetUI(btn,"focus");
    if(txt.includes("relax")) btn.onclick = ()=>applyPresetUI(btn,"relax");
    if(txt.includes("anxiety")) btn.onclick = ()=>applyPresetUI(btn,"anxiety");

    // timer 버튼
    if(txt.includes("30m")) btn.onclick = ()=>timerUI(btn,30);
    if(txt.includes("1h")) btn.onclick = ()=>timerUI(btn,60);
    if(txt.includes("2h")) btn.onclick = ()=>timerUI(btn,120);
    if(txt.includes("4h")) btn.onclick = ()=>timerUI(btn,240);
    if(txt.includes("8h")) btn.onclick = ()=>timerUI(btn,480);
  });

});

// ⛔ stop
function stopAll(){
  Object.values(sounds).forEach(a=>a.pause());

  const btn = document.getElementById("mainBtn");
  if(btn){
    btn.innerText = "▶ Start";
    btn.classList.remove("active");
  }

  isPlaying = false;
  clearTimeout(timerId);
}

// 🎯 preset
function applyPresetUI(el,mode){

  document.querySelectorAll("button").forEach(b=>{
    if(b.classList) b.classList.remove("active");
  });

  el.classList.add("active");

  const presets = {
    sleep:{rain:0.7, wind:0.2},
    focus:{rain:0.5, cafe:0.3},
    relax:{rain:0.6, wind:0.3},
    anxiety:{rain:0.8, drone:0.3}
  };

  Object.keys(sounds).forEach(k=>sounds[k].volume=0);

  for(let k in presets[mode]){
    sounds[k].volume = presets[mode][k];
  }

  updateSliders();
}

// ⏱ timer
function timerUI(el,min){

  document.querySelectorAll(".grid button").forEach(b=>{
    b.classList.remove("active");
  });

  el.classList.add("active");

  clearTimeout(timerId);

  timerId = setTimeout(()=>{
    fadeOut();
  }, min*60000);
}

// 🌙 fade
function fadeOut(){

  let i = setInterval(()=>{

    let done = true;

    Object.values(sounds).forEach(a=>{
      if(a.volume > 0.01){
        a.volume -= 0.01;
        done = false;
      }
    });

    if(done){
      clearInterval(i);
      stopAll();
    }

  },200);
}

// 🎚 sync
function updateSliders(){
  document.querySelectorAll("input[type=range]").forEach(s=>{
    const k = s.dataset.sound;
    if(sounds[k]) s.value = sounds[k].volume;
  });
}
