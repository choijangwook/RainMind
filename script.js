document.addEventListener("DOMContentLoaded", () => {

  let isPlaying = false;
  const btn = document.getElementById("mainBtn");

  btn.addEventListener("click", () => {

    if (!isPlaying) {
      btn.innerText = "⏸ Stop";
      isPlaying = true;
    } else {
      btn.innerText = "▶ Start";
      isPlaying = false;
    }

  });

});
