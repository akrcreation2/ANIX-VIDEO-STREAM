const player = document.getElementById("player");
const playBtn = document.getElementById("play");
const rewind = document.getElementById("rewind");
const forward = document.getElementById("forward");
const seek = document.getElementById("seek");
const current = document.getElementById("current");
const duration = document.getElementById("duration");
const volumeBtn = document.getElementById("volumeBtn");
const volume = document.getElementById("volume");
const fullscreen = document.getElementById("fullscreen");
const pip = document.getElementById("pip");
const url = document.getElementById("url");
const load = document.getElementById("load");
const title = document.getElementById("videoTitle");

const settings = document.getElementById("settings");
const settingsMenu = document.getElementById("settingsMenu");
const settingsContent = document.getElementById("settingsContent");

const speed = document.getElementById("speed");
const audioTrack = document.getElementById("audioTrack");
const subtitleFile = document.getElementById("subtitleFile");
const subtitleToggle = document.getElementById("subtitleToggle");
const subtitleTrack = document.getElementById("subtitleTrack");

let hls = null;
let subtitleEnabled = true;

function formatTime(sec){

    if(isNaN(sec)) return "00:00";

    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);

    if(h > 0){
        return `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
    }

    return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

load.onclick = () => {

    const videoUrl = url.value.trim();

    if(!videoUrl) return;

    title.innerText = videoUrl.split("/").pop();

    if(hls){
        hls.destroy();
        hls = null;
    }

    if(videoUrl.endsWith(".m3u8") && Hls.isSupported()){

        hls = new Hls();

        hls.loadSource(videoUrl);

        hls.attachMedia(player);

    }else{

        player.src = videoUrl;

    }

    player.play();

};

playBtn.onclick = () => {

    if(player.paused){

        player.play();

    }else{

        player.pause();

    }

};

player.onplay = () => {

    playBtn.innerHTML =
    '<i class="fa-solid fa-pause"></i>';

};

player.onpause = () => {

    playBtn.innerHTML =
    '<i class="fa-solid fa-play"></i>';

};

rewind.onclick = () => {

    player.currentTime -= 10;

};

forward.onclick = () => {

    player.currentTime += 10;

};

player.ontimeupdate = () => {

    seek.max = player.duration || 0;
    seek.value = player.currentTime;

    current.textContent = formatTime(player.currentTime);
    duration.textContent = formatTime(player.duration);

};

seek.oninput = () => {

    player.currentTime = seek.value;

};

volumeBtn.onclick = () => {

    volume.style.display =
        volume.style.display === "block"
        ? "none"
        : "block";

};

volume.oninput = () => {

    player.volume = volume.value;

    if(player.volume == 0){

        volumeBtn.innerHTML =
        '<i class="fa-solid fa-volume-xmark"></i>';

    }else{

        volumeBtn.innerHTML =
        '<i class="fa-solid fa-volume-high"></i>';

    }

};

fullscreen.onclick = () => {

    if(!document.fullscreenElement){

        player.requestFullscreen();

    }else{

        document.exitFullscreen();

    }

};

pip.onclick = async () => {

    if(document.pictureInPictureEnabled){

        try{

            await player.requestPictureInPicture();

        }catch(e){}

    }

};

function showSpeedMenu() {

settingsContent.innerHTML = "";

const speeds = [0.5,0.75,1,1.25,1.5,1.75,2];

const list = document.createElement("div");
list.className = "settings-list";

speeds.forEach(rate=>{

const btn = document.createElement("button");

btn.textContent = rate===1 ? "Normal" : rate+"x";

if(player.playbackRate===rate){
btn.classList.add("active");
}

btn.onclick=()=>{

player.playbackRate=rate;
settingsContent.innerHTML="";
showSpeedMenu();

};

list.appendChild(btn);

});

settingsContent.appendChild(list);

}

function showAudioMenu(){

settingsContent.innerHTML="";

const list=document.createElement("div");
list.className="settings-list";

if(player.audioTracks && player.audioTracks.length){

for(let i=0;i<player.audioTracks.length;i++){

const track=player.audioTracks[i];

const btn=document.createElement("button");

btn.textContent=track.label || "Audio "+(i+1);

btn.onclick=()=>{

for(let j=0;j<player.audioTracks.length;j++){

player.audioTracks[j].enabled=false;

}

track.enabled=true;

};

list.appendChild(btn);

}

}else{

const btn=document.createElement("button");
btn.textContent="No Audio Tracks";
btn.disabled=true;
list.appendChild(btn);

}

settingsContent.appendChild(list);

}

function showSubtitleMenu(){

settingsContent.innerHTML="";

const list=document.createElement("div");
list.className="settings-list";

const loadBtn=document.createElement("button");
loadBtn.innerHTML="Load Subtitle (.vtt)";
loadBtn.onclick=()=>subtitleFile.click();

list.appendChild(loadBtn);

const toggleBtn=document.createElement("button");
toggleBtn.innerHTML=subtitleEnabled ? "Subtitle : ON" : "Subtitle : OFF";

toggleBtn.onclick=()=>{

subtitleEnabled=!subtitleEnabled;

player.textTracks[0].mode=
subtitleEnabled?"showing":"hidden";

showSubtitleMenu();

};

list.appendChild(toggleBtn);

settingsContent.appendChild(list);

}

settings.onclick=()=>{

settingsMenu.style.display=
settingsMenu.style.display==="block"
?"none":"block";

showSpeedMenu();

};

tabSpeed.onclick=()=>{

document.querySelectorAll(".tab")
.forEach(t=>t.classList.remove("active"));

tabSpeed.classList.add("active");

showSpeedMenu();

};

tabAudio.onclick=()=>{

document.querySelectorAll(".tab")
.forEach(t=>t.classList.remove("active"));

tabAudio.classList.add("active");

showAudioMenu();

};

tabSubtitle.onclick=()=>{

document.querySelectorAll(".tab")
.forEach(t=>t.classList.remove("active"));

tabSubtitle.classList.add("active");

showSubtitleMenu();

};

closeSettings.onclick=()=>{

settingsMenu.style.display="none";

};

subtitleFile.onchange=(e)=>{

const file=e.target.files[0];

if(!file)return;

subtitleTrack.src=URL.createObjectURL(file);

player.textTracks[0].mode="showing";

subtitleEnabled=true;

};

document.addEventListener("click",(e)=>{

if(!settingsMenu.contains(e.target) &&
!settings.contains(e.target)){

settingsMenu.style.display="none";

}

});

/* ---------- SETTINGS DEFAULT ---------- */

showSpeedMenu();

/* ---------- KEYBOARD SHORTCUTS ---------- */

document.addEventListener("keydown",(e)=>{

switch(e.code){

case "Space":
e.preventDefault();

if(player.paused){
player.play();
}else{
player.pause();
}
break;

case "ArrowLeft":
player.currentTime-=10;
break;

case "ArrowRight":
player.currentTime+=10;
break;

case "ArrowUp":
player.volume=Math.min(1,player.volume+0.1);
volume.value=player.volume;
break;

case "ArrowDown":
player.volume=Math.max(0,player.volume-0.1);
volume.value=player.volume;
break;

case "KeyF":
fullscreen.click();
break;

case "KeyM":
player.muted=!player.muted;

volumeBtn.innerHTML=player.muted
?'<i class="fa-solid fa-volume-xmark"></i>'
:'<i class="fa-solid fa-volume-high"></i>';

break;

}

});


/* ---------- AUTO HIDE CONTROLS ---------- */

const controls=document.querySelector(".controls");

let hideTimer;

function showControls(){

controls.style.opacity="1";

clearTimeout(hideTimer);

hideTimer=setTimeout(()=>{

if(!player.paused){

controls.style.opacity="0";

}

},3000);

}

document.addEventListener("mousemove",showControls);
document.addEventListener("touchstart",showControls);

player.addEventListener("pause",showControls);

player.addEventListener("play",showControls);

showControls();

