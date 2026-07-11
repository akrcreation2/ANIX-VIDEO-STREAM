const video = document.getElementById("player");

const playBtn = document.getElementById("play");
const rewindBtn = document.getElementById("rewind");
const forwardBtn = document.getElementById("forward");
const fullscreenBtn = document.getElementById("fullscreen");

const seek = document.getElementById("seek");

const current = document.getElementById("current");
const duration = document.getElementById("duration");

const loadBtn = document.getElementById("load");
const urlInput = document.getElementById("url");

// Load Video
loadBtn.onclick = () => {
    if(urlInput.value.trim()!==""){
        video.src = urlInput.value.trim();
        video.load();
        video.play();
    }
};

// URL Parameter
const params = new URLSearchParams(window.location.search);
const url = params.get("video");

if(url){
    urlInput.value = decodeURIComponent(url);
    video.src = decodeURIComponent(url);
    video.load();
}

// Play Pause
playBtn.onclick = () => {

    if(video.paused){

        video.play();

        playBtn.innerHTML="⏸";

    }else{

        video.pause();

        playBtn.innerHTML="▶";

    }

};

// Update Button
video.onplay=()=>playBtn.innerHTML="⏸";

video.onpause=()=>playBtn.innerHTML="▶";

// Rewind
rewindBtn.onclick=()=>{

    video.currentTime-=10;

};

// Forward
forwardBtn.onclick=()=>{

    video.currentTime+=10;

};

// Duration
video.onloadedmetadata=()=>{

    duration.innerHTML=format(video.duration);

    seek.max=Math.floor(video.duration);

};

// Timer
video.ontimeupdate=()=>{

    seek.value=Math.floor(video.currentTime);

    current.innerHTML=format(video.currentTime);

};

// Seek
seek.oninput=()=>{

    video.currentTime=seek.value;

};

// Fullscreen
fullscreenBtn.onclick=()=>{

    if(video.requestFullscreen){

        video.requestFullscreen();

    }

};

// Format Time
function format(time){

    const min=Math.floor(time/60);

    const sec=Math.floor(time%60);

    return String(min).padStart(2,"0")+":"+String(sec).padStart(2,"0");

};

const volume=document.getElementById("volume");
const speed=document.getElementById("speed");
const pip=document.getElementById("pip");

// Volume
volume.oninput=()=>{
    video.volume=volume.value;
};

// Playback Speed
speed.onchange=()=>{
    video.playbackRate=parseFloat(speed.value);
};

// Picture in Picture
pip.onclick=async()=>{

    if(document.pictureInPictureEnabled){

        try{
            await video.requestPictureInPicture();
        }catch(e){
            console.log(e);
        }

    }

};
