const video = document.getElementById("player");

const playBtn = document.getElementById("play");
const rewindBtn = document.getElementById("rewind");
const forwardBtn = document.getElementById("forward");

const seek = document.getElementById("seek");

const current = document.getElementById("current");
const duration = document.getElementById("duration");

const volumeBtn = document.getElementById("volumeBtn");
const volumeSlider = document.getElementById("volume");

const fullscreenBtn = document.getElementById("fullscreen");
const pipBtn = document.getElementById("pip");

const loadBtn = document.getElementById("load");
const urlInput = document.getElementById("url");

const settingsBtn = document.getElementById("settings");
const settingsMenu = document.getElementById("settingsMenu");
const settingsContent = document.getElementById("settingsContent");

const tabSpeed = document.getElementById("tabSpeed");
const tabAudio = document.getElementById("tabAudio");
const tabSubtitle = document.getElementById("tabSubtitle");
const closeSettings = document.getElementById("closeSettings");

const title = document.getElementById("videoTitle");
const subtitleTrack = document.getElementById("subtitleTrack");
const subtitleFile = document.getElementById("subtitleFile");

let player;
let controlsTimer;
/* ---------- PLAY / PAUSE ---------- */

playBtn.onclick = ()=>{

if(video.paused){

video.play();

}else{

video.pause();

}

};

video.onplay=()=>{

playBtn.innerHTML=
'<i class="fa-solid fa-pause"></i>';

};

video.onpause=()=>{

playBtn.innerHTML=
'<i class="fa-solid fa-play"></i>';

};

/* ---------- SEEK ---------- */

video.addEventListener("loadedmetadata",()=>{

seek.max=video.duration;

duration.textContent=formatTime(video.duration);

});

video.ontimeupdate=()=>{

seek.value=video.currentTime;

current.textContent=formatTime(video.currentTime);

};

seek.oninput=()=>{

video.currentTime=seek.value;

};

/* ---------- REWIND ---------- */

rewindBtn.onclick=()=>{

video.currentTime=Math.max(0,video.currentTime-10);

};

/* ---------- FORWARD ---------- */

forwardBtn.onclick=()=>{

video.currentTime=Math.min(video.duration,video.currentTime+10);

};

/* ---------- VOLUME ---------- */

volumeBtn.onclick=()=>{

volumeSlider.style.display=
volumeSlider.style.display==="block"
?"none":"block";

};

volumeSlider.oninput=()=>{

video.volume=volumeSlider.value;

if(video.volume==0){

volumeBtn.innerHTML=
'<i class="fa-solid fa-volume-xmark"></i>';

}else{

volumeBtn.innerHTML=
'<i class="fa-solid fa-volume-high"></i>';

}

};

/* ---------- FULLSCREEN ---------- */

fullscreenBtn.onclick=()=>{

if(!document.fullscreenElement){

video.requestFullscreen();

}else{

document.exitFullscreen();

}

};

/* ---------- PiP ---------- */

pipBtn.onclick=async()=>{

if(document.pictureInPictureEnabled){

try{

await video.requestPictureInPicture();

}catch(e){

console.log(e);

}

}

};
/* ---------- FORMAT TIME ---------- */

function formatTime(sec){

if(isNaN(sec)) return "00:00";

const h=Math.floor(sec/3600);
const m=Math.floor((sec%3600)/60);
const s=Math.floor(sec%60);

if(h>0){
return `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

}

/* ---------- SETTINGS ---------- */

settingsBtn.onclick=()=>{

settingsMenu.style.display=
settingsMenu.style.display==="block"
?"none":"block";

showSpeedMenu();

};

/* ---------- SPEED ---------- */

function showSpeedMenu(){

tabSpeed.classList.add("active");
tabAudio.classList.remove("active");
tabSubtitle.classList.remove("active");

settingsContent.innerHTML="";

const speeds=[0.5,0.75,1,1.25,1.5,1.75,2];

const box=document.createElement("div");
box.className="settings-list";

speeds.forEach(rate=>{

const btn=document.createElement("button");

btn.textContent=rate==1?"Normal":rate+"x";

if(video.playbackRate===rate){
btn.classList.add("active");
}

btn.onclick=()=>{

video.playbackRate=rate;

showSpeedMenu();

};

box.appendChild(btn);

});

settingsContent.appendChild(box);

}

/* ---------- AUDIO TRACKS ---------- */

async function loadAudioTracks(){

if(!player) return;

const tracks=player.getVariantTracks();

window.audioVariants=tracks;

}

function showAudioMenu(){

tabAudio.classList.add("active");
tabSpeed.classList.remove("active");
tabSubtitle.classList.remove("active");

settingsContent.innerHTML="";

const box=document.createElement("div");
box.className="settings-list";

if(!window.audioVariants || window.audioVariants.length===0){

const btn=document.createElement("button");
btn.textContent="No Audio Tracks";
box.appendChild(btn);

}else{

window.audioVariants.forEach(track=>{

const btn=document.createElement("button");

btn.textContent =
(track.language || "Unknown") +
(track.label ? " - " + track.label : "");

btn.onclick=()=>{

player.selectVariantTrack(track, true);
video.play();

};

box.appendChild(btn);

});

}

settingsContent.appendChild(box);

}

/* ---------- SUBTITLE ---------- */

function showSubtitleMenu(){

tabSubtitle.classList.add("active");
tabSpeed.classList.remove("active");
tabAudio.classList.remove("active");

settingsContent.innerHTML="";

const box=document.createElement("div");
box.className="settings-list";

const loadBtn=document.createElement("button");
loadBtn.textContent="Load Subtitle (.vtt)";

loadBtn.onclick=()=>{

subtitleFile.click();

};

box.appendChild(loadBtn);

settingsContent.appendChild(box);

}

subtitleFile.onchange=(e)=>{

const file=e.target.files[0];

if(!file) return;

subtitleTrack.src=URL.createObjectURL(file);

video.textTracks[0].mode="showing";

};

/* ---------- TAB EVENTS ---------- */

tabSpeed.onclick=showSpeedMenu;

tabAudio.onclick=showAudioMenu;

tabSubtitle.onclick=showSubtitleMenu;

closeSettings.onclick=()=>{

settingsMenu.style.display="none";

};

/* ---------- CLOSE OUTSIDE ---------- */

document.addEventListener("click",(e)=>{

if(
!settingsMenu.contains(e.target) &&
!settingsBtn.contains(e.target)
){

settingsMenu.style.display="none";

}

});

/* ---------- AUTO HIDE ---------- */

const controls=document.querySelector(".controls");

function showControls(){

controls.classList.remove("hide");

clearTimeout(controlsTimer);

controlsTimer=setTimeout(()=>{

if(!video.paused){

controls.classList.add("hide");

}

},3000);

}

document.addEventListener("mousemove",showControls);
document.addEventListener("touchstart",showControls);

video.addEventListener("play",showControls);
video.addEventListener("pause",showControls);

showControls();

/* ---------- KEYBOARD ---------- */

document.addEventListener("keydown",(e)=>{

switch(e.code){

case "Space":

e.preventDefault();

video.paused ? video.play() : video.pause();

break;

case "ArrowLeft":

video.currentTime-=10;

break;

case "ArrowRight":

video.currentTime+=10;

break;

case "KeyF":

fullscreenBtn.click();

break;

case "KeyM":

video.muted=!video.muted;

break;

}

});

/* ---------- START ---------- */

showSpeedMenu();





async function initPlayer(){

shaka.polyfill.installAll();

if(!shaka.Player.isBrowserSupported()){

alert("Browser not supported");

return;

}

player = new shaka.Player(video);

player.addEventListener("error",(e)=>{

console.error(e);

});

}

initPlayer();
loadBtn.onclick = async ()=>{

const url = urlInput.value.trim();

if(!url) return;

try{

await player.load(url);

const variants = player.getVariantTracks();

console.log(variants);

window.audioVariants = variants;

await video.play();

title.innerText =
url.split("/").pop();
player.addEventListener("error", (event) => {
    console.error("Shaka Error:", event.detail);
    alert("Shaka Error Code: " + event.detail.code);
});
  
loadAudioTracks();

catch(err){
    console.error(err);
    alert(err.message || JSON.stringify(err));
}

};
