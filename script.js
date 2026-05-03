let isPlaying = false;

const sounds = {
  rain: new Audio(),
  cafe: new Audio(),
  wind: new Audio(),
  thunder: new Audio(),
  drone: new Audio()
};

// 🔥 파일 경로 연결
sounds.rain.src = "sounds/rain.mp3";
sounds.cafe.src = "sounds/cafe.mp3";
sounds.wind.src = "sounds/wind.mp3";
sounds.thunder.src = "sounds/thunder.mp3";
sounds.drone.src = "sounds/drone.mp3";

// 🔁 반복 재생
Object.values(sounds).forEach(audio => {
  audio.loop = true;
  audio.volume = 0;
});

// ▶ Start / Stop
function toggle() {
  const btn = document.getElementById("mainBtn");

  if (!isPlaying) {
    Object.values(sounds).forEach(audio => audio.play());
    btn.innerText = "⏸ Stop";
    isPlaying = true;
  } else {
    Object.values(sounds).forEach(audio => audio.pause());
    btn.innerText = "▶ Start";
    isPlaying = false;
  }
}

// 🎚 볼륨 조절
function setVolume(name, value) {
  if (sounds[name]) {
    sounds[name].volume = value;
  }
}
