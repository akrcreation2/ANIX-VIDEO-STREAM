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
// Keyboard Shortcuts
document.addEventListener("keydown",(e)=>{

    switch(e.key){

        case " ":
            e.preventDefault();

            if(video.paused){
                video.play();
            }else{
                video.pause();
            }
        break;

        case "ArrowLeft":
            video.currentTime-=10;
        break;

        case "ArrowRight":
            video.currentTime+=10;
        break;

        case "f":
        case "F":
            if(document.fullscreenElement){
                document.exitFullscreen();
            }else{
                video.requestFullscreen();
            }
        break;

        case "m":
        case "M":
            video.muted=!video.muted;
        break;

    }

});
video.ondblclick=()=>{

    if(document.fullscreenElement){

        document.exitFullscreen();

    }else{

        video.requestFullscreen();

    }

};

const controls=document.querySelector(".controls");

let hideTimer;

function showControls(){

    controls.style.opacity="1";

    clearTimeout(hideTimer);

    hideTimer=setTimeout(()=>{

        if(!video.paused){

            controls.style.opacity="0";

        }

    },3000);

}

video.addEventListener("mousemove",showControls);

video.addEventListener("touchstart",showControls);

video.addEventListener("play",showControls);

video.addEventListener("pause",()=>{

    controls.style.opacity="1";

});

const title=document.getElementById("videoTitle");

function updateTitle(url){

    try{

        let name=url.split("/").pop();

        name=decodeURIComponent(name);

        title.innerHTML=name;

    }catch{

        title.innerHTML="Unknown Video";

    }

}

loadBtn.onclick=()=>{

    if(urlInput.value){

        video.src=urlInput.value;

        updateTitle(urlInput.value);

        video.load();

        video.play();

    }

};

if(url){

    updateTitle(url);

}

const audio=document.getElementById("audioTrack");

video.addEventListener("loadedmetadata",()=>{

    audio.innerHTML="";

    if(video.audioTracks){

        for(let i=0;i<video.audioTracks.length;i++){

            let option=document.createElement("option");

            option.value=i;

            option.text=video.audioTracks[i].label || ("Track "+(i+1));

            audio.appendChild(option);

        }

    }

});

audio.onchange=()=>{

    if(video.audioTracks){

        for(let i=0;i<video.audioTracks.length;i++){

            video.audioTracks[i].enabled=(i==audio.value);

        }

    }

};
