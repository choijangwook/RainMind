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

document.addEventListener("DOMContentLoaded",()=>{

  const btn = document.getElementById("mainBtn");

  btn.addEventListener("click", async ()=>{

    if(!isPlaying){
      for(let a of Object.values(sounds)){
        try { await a.play(); } catch(e){}
      }
      btn.innerText = "⏸ Stop";
      isPlaying = true;
    } else {
      stopAll();
    }

  });

  // 슬라이더
  document.querySelectorAll("input[type=range]").forEach(slider=>{
    slider.addEventListener("input",e=>{
      sounds[e.target.dataset.sound].volume = parseFloat(e.target.value);
    });
  });

});

// ⛔ 정지
function stopAll(){
  Object.values(sounds).forEach(a=>a.pause());
  document.getElementById("mainBtn").innerText = "▶ Start";
  isPlaying = false;
  clearTimeout(timerId);
}

// 🎯 프리셋
function applyPreset(mode){

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

// ⏱ 타이머 (기본)
function setTimer(min){
  clearTimeout(timerId);

  timerId = setTimeout(()=>{
    fadeOut();
  }, min * 60 * 1000);
}

// 🌙 페이드아웃
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

// 슬라이더 업데이트
function updateSliders(){
  document.querySelectorAll("input[type=range]").forEach(s=>{
    s.value = sounds[s.dataset.sound].volume;
  });
}
