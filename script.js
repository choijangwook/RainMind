let isPlaying = false;

const sounds = {
  rain: new Audio("sounds/rain.mp3"),
  cafe: new Audio("sounds/cafe.mp3"),
  wind: new Audio("sounds/wind.mp3"),
  thunder: new Audio("sounds/thunder.mp3"),
  drone: new Audio("sounds/drone.mp3")
};

Object.values(sounds).forEach(audio => {
  audio.loop = true;
  audio.volume = 0;
});

document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("mainBtn");

  btn.addEventListener("click", async () => {

    if (!isPlaying) {
      for (let audio of Object.values(sounds)) {
        try { await audio.play(); } catch(e) {}
      }
      btn.innerText = "⏸ Stop";
      isPlaying = true;
    } else {
      Object.values(sounds).forEach(a => a.pause());
      btn.innerText = "▶ Start";
      isPlaying = false;
    }

  });

  document.querySelectorAll("input[type=range]").forEach(slider => {
    slider.addEventListener("input", (e) => {
      const name = e.target.dataset.sound;
      if (sounds[name]) {
        sounds[name].volume = parseFloat(e.target.value);
      }
    });
  });

});
