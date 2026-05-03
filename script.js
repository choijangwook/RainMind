let isPlaying = false;
let timerId = null;

// 🎧 사운드
const sounds = {
  rain: new Audio("sounds/rain.mp3"),
  cafe: new Audio("sounds/cafe.mp3"),
  wind: new Audio("sounds/wind.mp3"),
  thunder: new Audio("sounds/thunder.mp3"),
  drone: new Audio("sounds/drone.mp3")
};

// 초기 설정
Object.values(sounds).forEach(a => {
  a.loop = true;
  a.volume = 0;
});

// ▶ Start / Stop
document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("mainBtn");

  btn.addEventListener("click", async () => {

    if (!isPlaying) {
      for (let a of Object.values(sounds)) {
        try { await a.play(); } catch(e){}
      }
      btn.innerText = "⏸ Stop";
      isPlaying = true;
    } else {
      stopAll();
    }

  });

  // 🎚 슬라이더
  document.querySelectorAll("input[type=range]").forEach(slider => {
    slider.addEventListener("input", (e) => {
      const name = e.target.dataset.sound;
      sounds[name].volume = parseFloat(e.target.value);
    });
  });

});

// ⛔ 정지
function stopAll(){
  Object.values(sounds).forEach(a => a.pause());
  document.getElementById("mainBtn").innerText = "▶ Start";
  isPlaying = false;
  clearTimeout(timerId);
}

// 🎯 프리셋
function applyPreset(mode){

  const presets = {
    sleep:   {rain:0.7, wind:0.2, drone:0.2},
    focus:   {rain:0.5, cafe:0.3},
    relax:   {rain:0.6, wind:0.3},
    anxiety: {rain:0.8, drone:0.3}
  };

  const p = presets[mode];

  // 전체 0 초기화
  Object.keys(sounds).forEach(k => sounds[k].volume = 0);

  // 적용
  for (let k in p) sounds[k].volume = p[k];

  // 슬라이더 반영
  document.querySelectorAll("input[type=range]").forEach(slider=>{
    const name = slider.dataset.sound;
    slider.value = sounds[name].volume;
  });

}

// ⏱ 타이머
function setTimer(min){

  clearTimeout(timerId);

  timerId = setTimeout(()=>{
    stopAll();
    alert("Timer finished");
  }, min * 60 * 1000);

}
