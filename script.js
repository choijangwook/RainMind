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

document.addEventListener("DOMContentLoaded", ()=>{

  const mainBtn = document.getElementById("mainBtn");

  // ▶ Start / Stop (Brave 대응: user gesture 유지)
  if(mainBtn){
    mainBtn.addEventListener("click", async ()=>{

      if(!isPlaying){

        for(let a of Object.values(sounds)){
          try{
            await a.play();
          }catch(e){
            console.log("audio blocked:", e);
          }
        }

        mainBtn.innerText = "⏸ Stop";
        mainBtn.classList.add("active");
        isPlaying = true;

      }else{
        stopAll();
      }

    });
  }

  // 🎚 sliders
  document.querySelectorAll("input[type=range]").forEach(slider=>{
    slider.addEventListener("input", (e)=>{
      const key = e.target.dataset.sound;
      if(sounds[key]){
        sounds[key].volume = parseFloat(e.target.value);
      }
    });
  });

  // 🎯 버튼 자동 연결
  document.querySelectorAll("button").forEach(btn=>{

    const t = btn.innerText.toLowerCase();

    if(t.includes("sleep")) btn.onclick = ()=>applyPreset(btn,"sleep");
    if(t.includes("focus")) btn.onclick = ()=>applyPreset(btn,"focus");
    if(t.includes("relax")) btn.onclick = ()=>applyPreset(btn,"relax");
    if(t.includes("anxiety")) btn.onclick = ()=>applyPreset(btn,"anxiety");

    if(t === "30m") btn.onclick = ()=>timerUI(btn,30);
    if(t === "1h") btn.onclick = ()=>timerUI(btn,60);
    if(t === "2h") btn.onclick = ()=>timerUI(btn,120);
    if(t === "4h") btn.onclick = ()=>timerUI(btn,240);
    if(t === "8h") btn.onclick = ()=>timerUI(btn,480);

    // 💾 SAVE / LOAD UX 개선
    if(t.includes("save")) btn.onclick = saveMix;
    if(t.includes("load")) btn.onclick = loadMix;

  });

});

// ⛔ stop
function stopAll(){
  Object.values(sounds).forEach(a=>a.pause());

  const mainBtn = document.getElementById("mainBtn");
  if(mainBtn){
    mainBtn.innerText = "▶ Start";
    mainBtn.classList.remove("active");
  }

  isPlaying = false;
  clearTimeout(timerId);
}

// 🎯 preset
function applyPreset(el,mode){

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

  document.querySelectorAll("button").forEach(b=>{
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

// 💾 SAVE (🔥 alert 제거 → UX 개선)
function saveMix(){

  let data = {};
  Object.keys(sounds).forEach(k=>{
    data[k] = sounds[k].volume;
  });

  try {
    localStorage.setItem("rainmix", JSON.stringify(data));

    // 🔵 버튼 시각 피드백
    const btns = document.querySelectorAll("button");
    btns.forEach(b=>{
      if(b.innerText.toLowerCase().includes("save")){
        b.classList.add("active");
        setTimeout(()=>b.classList.remove("active"),800);
      }
    });

  } catch(e){
    console.log("save failed", e);
  }
}

// 📂 LOAD (UX 개선)
function loadMix(){

  try {

    let data = localStorage.getItem("rainmix");
    if(!data) return;

    let obj = JSON.parse(data);

    Object.keys(obj).forEach(k=>{
      if(sounds[k]) sounds[k].volume = obj[k];
    });

    updateSliders();

    // 🔵 시각 피드백
    document.querySelectorAll("button").forEach(b=>{
      if(b.innerText.toLowerCase().includes("load")){
        b.classList.add("active");
        setTimeout(()=>b.classList.remove("active"),800);
      }
    });

  } catch(e){
    console.log("load failed", e);
  }
}

// 🎚 sync
function updateSliders(){
  document.querySelectorAll("input[type=range]").forEach(s=>{
    const k = s.dataset.sound;
    if(sounds[k]) s.value = sounds[k].volume;
  });
}
