let isPlaying = false;
let timerId = null;

const sounds = {
  rain: new Audio("sounds/rain.mp3"),
  cafe: new Audio("sounds/cafe.mp3"),
  wind: new Audio("sounds/wind.mp3"),
  thunder: new Audio("sounds/thunder.mp3"),
  drone: new Audio("sounds/drone.mp3")
};

Object.values(sounds).forEach(a=>{
  a.loop = true;
  a.volume = 0;
});

document.addEventListener("DOMContentLoaded",()=>{

  const btn = document.getElementById("mainBtn");

  // ▶ Start
  btn.addEventListener("click", async ()=>{

    if(!isPlaying){
      for(let a of Object.values(sounds)){
        try{await a.play();}catch(e){}
      }
      btn.innerText = "⏸ Stop";
      btn.classList.add("active");
      isPlaying = true;
    }else{
      stopAll();
    }

  });

  // 슬라이더
  document.querySelectorAll("input[type=range]").forEach(s=>{
    s.addEventListener("input",e=>{
      sounds[e.target.dataset.sound].volume = parseFloat(e.target.value);
    });
  });

});

// ⛔ stop
function stopAll(){
  Object.values(sounds).forEach(a=>a.pause());
  const btn = document.getElementById("mainBtn");
  btn.innerText = "▶ Start";
  btn.classList.remove("active");
  isPlaying = false;
  clearTimeout(timerId);
}

// 🎯 프리셋
function presetClick(el,mode){

  document.querySelectorAll(".preset-row button")
    .forEach(b=>b.classList.remove("active"));

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
}

// ⏱ 타이머 (복구 완료)
function timerClick(el,min){

  document.querySelectorAll(".grid button")
    .forEach(b=>b.classList.remove("active"));

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

// 💾 save
function saveMix(){
  let data = {};
  Object.keys(sounds).forEach(k=>data[k]=sounds[k].volume);
  localStorage.setItem("rainmix",JSON.stringify(data));
  alert("Saved");
}

// 📂 load
function loadMix(){
  let data = localStorage.getItem("rainmix");
  if(!data) return;

  let obj = JSON.parse(data);

  Object.keys(obj).forEach(k=>{
    if(sounds[k]) sounds[k].volume = obj[k];
  });
}
