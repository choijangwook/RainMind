let isPlaying = false;

function toggle() {
  const btn = document.getElementById("mainBtn");

  if (!btn) return;

  if (isPlaying) {
    btn.innerText = "▶ Start";
    isPlaying = false;
  } else {
    btn.innerText = "⏸ Stop";
    isPlaying = true;
  }
}
