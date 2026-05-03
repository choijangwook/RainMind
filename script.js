let isPlaying = false;

const sounds = {
  rain: new Audio("sounds/rain.mp3"),
  cafe: new Audio("sounds/cafe.mp3"),
  wind: new Audio("sounds/wind.mp3"),
  thunder: new Audio("sounds/thunder.mp3"),
  drone: new Audio("sounds/drone.mp3")
};

// 초기 설정
Object.values(sounds).forEach(audio => {
  audio.loop = true;
  audio.volume = 0;
});

// 🔥 버튼 이벤트 강제 연결
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("mainBtn");

  btn.addEventListener("click", async () => {
    if (!isPlaying) {
      // 모바일 autoplay 정책 대응
      for (let audio of Object.values(sounds)) {
        try {
          await audio.play();
        } catch (e) {}
      }
      btn.innerText = "⏸ Stop";
      isPlaying = true;
    } else {
      Object.values(sounds).forEach(a => a.pause());
      btn.innerText = "▶ Start";
      isPlaying = false;
    }
  });

  // 🎚 슬라이더 이벤트
  document.querySelectorAll("input[type=range]").forEach(slider => {
    slider.addEventListener("input", (e) => {
      const name = e.target.dataset.sound;
      if (sounds[name]) {
        sounds[name].volume = parseFloat(e.target.value);
      }
    });
  });
});
