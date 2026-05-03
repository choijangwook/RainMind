function toggle() {
  const btn = document.getElementById("mainBtn");

  if (btn.innerText === "▶ Start") {
    btn.innerText = "⏸ Stop";
  } else {
    btn.innerText = "▶ Start";
  }
}
