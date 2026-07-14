const player = document.getElementById("player");

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

const urlInput = document.getElementById("url");
const loadBtn = document.getElementById("load");

const title = document.getElementById("videoTitle");

const settingsBtn = document.getElementById("settings");
const settingsMenu = document.getElementById("settingsMenu");
const settingsContent = document.getElementById("settingsContent");

const tabSpeed = document.getElementById("tabSpeed");
const tabAudio = document.getElementById("tabAudio");
const tabQuality = document.getElementById("tabQuality");
const tabSubtitle = document.getElementById("tabSubtitle");
const closeSettings = document.getElementById("closeSettings");

const subtitleTrack = document.getElementById("subtitleTrack");
const subtitleFile = document.getElementById("subtitleFile");

let hls = null;
let audioContext;
let sourceNode;
let gainNode;
let hideTimer;

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

async function initAudioBoost() {

    if (!audioContext) {

        audioContext = new (window.AudioContext || window.webkitAudioContext)();

        sourceNode = audioContext.createMediaElementSource(player);

        gainNode = audioContext.createGain();

        gainNode.gain.value = 1;

        sourceNode.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // IMPORTANT
        player.muted = false;
        player.volume = 1;

    }

    if (audioContext.state === "suspended") {
        await audioContext.resume();
    }
}

loadBtn.onclick = async () => {

const url=urlInput.value.trim();

if(!url) return;

title.innerText = decodeURIComponent(
    url.split("/").pop().split("?")[0]
);

if(hls){

hls.destroy();

hls=null;

}

if(url.endsWith(".m3u8")){

if(Hls.isSupported()){

hls=new Hls();

hls.loadSource(url);

hls.attachMedia(player);

hls.on(Hls.Events.MANIFEST_PARSED, async () => {

    await player.play();
    await initAudioBoost();

});
hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, () => {

    console.log("Audio Tracks:", hls.audioTracks);

});

hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, () => {

    console.log("Subtitle Tracks:", hls.subtitleTracks);

});

}else{

player.src = url;

await player.play();

await initAudioBoost();

}
    
}else{

player.src = url;

await player.play();

await initAudioBoost();

}

};
/* ---------- PLAY / PAUSE ---------- */

playBtn.onclick = async () => {

    if (player.paused) {

        await player.play();

await initAudioBoost();

if(audioContext){
    audioContext.resume();
}
        
    } else {

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

/* ---------- SEEK ---------- */

player.addEventListener("loadedmetadata", () => {

    seek.max = player.duration;

    duration.textContent = formatTime(player.duration);

});

player.ontimeupdate = () => {

    seek.value = player.currentTime;

    current.textContent = formatTime(player.currentTime);

};

seek.oninput = () => {

    player.currentTime = seek.value;

};

/* ---------- REWIND ---------- */

rewindBtn.onclick = () => {

    player.currentTime = Math.max(0, player.currentTime - 10);

};

/* ---------- FORWARD ---------- */

forwardBtn.onclick = () => {

    player.currentTime = Math.min(player.duration, player.currentTime + 10);

};

/* ---------- VOLUME ---------- */

volumeBtn.onclick = (e) => {

    e.stopPropagation();

    settingsMenu.style.display = "block";

    showBoostMenu();

};

volumeSlider.oninput = () => {

    player.volume = volumeSlider.value;

    player.muted = player.volume == 0;

    volumeBtn.innerHTML = player.muted
        ? '<i class="fa-solid fa-volume-xmark"></i>'
        : '<i class="fa-solid fa-volume-high"></i>';

};

/* ---------- FULLSCREEN ---------- */

const playerBox = document.querySelector(".player-box");

fullscreenBtn.onclick = () => {

    playerBox.classList.toggle("css-fullscreen");

};

/* ---------- PiP ---------- */

pipBtn.onclick = async () => {

    if (document.pictureInPictureEnabled) {

        try {

            await player.requestPictureInPicture();

        } catch (e) {

            console.log(e);

        }

    }

};

/* ---------- SETTINGS ---------- */

settingsBtn.onclick = () => {

    settingsMenu.style.display =
        settingsMenu.style.display === "block"
        ? "none"
        : "block";

    showSpeedMenu();

};

closeSettings.onclick = () => {

    settingsMenu.style.display = "none";

};

/* ---------- SPEED ---------- */

function showSpeedMenu() {

    tabSpeed.classList.add("active");
    tabAudio.classList.remove("active");
    tabSubtitle.classList.remove("active");

    settingsContent.innerHTML = "";

    const box = document.createElement("div");
    box.className = "settings-list";

    [0.5,0.75,1,1.25,1.5,1.75,2].forEach(rate=>{

        const btn=document.createElement("button");

        btn.textContent =
            rate==1 ? "Normal" : rate+"x";

        if(player.playbackRate==rate){
            btn.classList.add("active");
        }

        btn.onclick=()=>{

            player.playbackRate=rate;

            showSpeedMenu();

        };

        box.appendChild(btn);

    });

    settingsContent.appendChild(box);

}

/* ---------- AUDIO ---------- */

function showAudioMenu(){

    tabAudio.classList.add("active");
    tabSpeed.classList.remove("active");
    tabQuality.classList.remove("active");
    tabSubtitle.classList.remove("active");

    settingsContent.innerHTML = "";

    const box = document.createElement("div");
    box.className = "settings-list";

    if(hls && hls.audioTracks && hls.audioTracks.length){

        hls.audioTracks.forEach((track,index)=>{

            const btn=document.createElement("button");

            btn.textContent =
                track.name ||
                track.lang ||
                "Audio " + (index+1);

            if(hls.audioTrack === index){

                btn.classList.add("active");

            }

            btn.onclick=()=>{

                hls.audioTrack=index;

                showAudioMenu();

            };

            box.appendChild(btn);

        });

    }else{

        const btn=document.createElement("button");

        btn.textContent="No Audio Tracks";

        box.appendChild(btn);

    }

    settingsContent.appendChild(box);

}

/* ---------- QUALITY ---------- */
function showQualityMenu(){

    tabQuality.classList.add("active");

    tabSpeed.classList.remove("active");
    tabAudio.classList.remove("active");
    tabSubtitle.classList.remove("active");

    settingsContent.innerHTML="";

    const box=document.createElement("div");
    box.className="settings-list";

    if(hls && hls.levels && hls.levels.length > 0){

        const auto=document.createElement("button");

        auto.textContent="Auto";

        auto.onclick=()=>{

            hls.currentLevel=-1;

        };

        box.appendChild(auto);

        hls.levels.forEach((level,index)=>{

            const btn=document.createElement("button");

            let quality = "Auto";

if (level.height) {
    quality = level.height + "p";
} else if (level.attrs && level.attrs.RESOLUTION) {
    quality = level.attrs.RESOLUTION.split("x")[1] + "p";
} else if (level.bitrate) {
    quality = Math.round(level.bitrate / 1000) + " kbps";
}

btn.textContent = quality;

            btn.onclick=()=>{

                hls.currentLevel=index;

            };

            box.appendChild(btn);

        });

    }else{

        const btn=document.createElement("button");

        btn.textContent="No Quality Available";

        box.appendChild(btn);

    }

    settingsContent.appendChild(box);

}

/* ---------- SUBTITLE ---------- */

function showSubtitleMenu(){

    tabSubtitle.classList.add("active");
    tabSpeed.classList.remove("active");
    tabAudio.classList.remove("active");
    tabQuality.classList.remove("active");

    settingsContent.innerHTML = "";

    const box = document.createElement("div");
    box.className = "settings-list";

    // OFF
    const off = document.createElement("button");
    off.textContent = "Off";

    if(hls && hls.subtitleTrack === -1){
        off.classList.add("active");
    }

    off.onclick = () => {

        if(hls){
            hls.subtitleTrack = -1;
        }

        showSubtitleMenu();

    };

    box.appendChild(off);

    // Subtitle list
    if(hls && hls.subtitleTracks && hls.subtitleTracks.length){

        hls.subtitleTracks.forEach((track,index)=>{

            const btn=document.createElement("button");

            btn.textContent =
                track.name ||
                track.lang ||
                "Subtitle " + (index+1);

            if(hls.subtitleTrack===index){

                btn.classList.add("active");

            }

            btn.onclick=()=>{

                hls.subtitleTrack=index;

                showSubtitleMenu();

            };

            box.appendChild(btn);

        });

    }

    // Local subtitle
    const local=document.createElement("button");

    local.textContent="Load Subtitle (.vtt)";

    local.onclick=()=>{

        subtitleFile.click();

    };

    box.appendChild(local);

    settingsContent.appendChild(box);

}

/* ---------- BOOST ---------- */
function showBoostMenu(){

    settingsContent.innerHTML = "";

    const title = document.createElement("h3");
    title.textContent = "🔊 Volume Boost";
    title.style.marginBottom = "10px";
    title.style.textAlign = "center";

    settingsContent.appendChild(title);

    const box = document.createElement("div");
    box.className = "settings-list";

    [1,1.25,1.5,2,3,4,5].forEach(level=>{

        const btn = document.createElement("button");

        btn.textContent =
            level==1 ? "100% (Normal)" : (level*100)+"%";

        btn.onclick = async () => {

    await initAudioBoost();

    gainNode.gain.value = level;

    settingsMenu.style.display = "none";

};

box.appendChild(btn);

    });

    settingsContent.appendChild(box);

}

tabSpeed.onclick=showSpeedMenu;
tabAudio.onclick=showAudioMenu;
tabQuality.onclick=showQualityMenu;
tabSubtitle.onclick=showSubtitleMenu;

/* ---------- CLOSE SETTINGS OUTSIDE ---------- */

document.addEventListener("click",(e)=>{

if(
!settingsMenu.contains(e.target) &&
!settingsBtn.contains(e.target) &&
!volumeBtn.contains(e.target)
){
settingsMenu.style.display="none";

}

});

/* ---------- AUTO HIDE CONTROLS ---------- */

const controls=document.querySelector(".controls");

function showControls(){

controls.classList.remove("hide");

clearTimeout(hideTimer);

hideTimer=setTimeout(()=>{

if(!player.paused){

controls.classList.add("hide");

}

},3000);

}

document.addEventListener("mousemove",showControls);
document.addEventListener("touchstart",showControls);

player.addEventListener("play",showControls);
player.addEventListener("pause",showControls);

showControls();

/* ---------- KEYBOARD SHORTCUTS ---------- */

document.addEventListener("keydown",(e)=>{

switch(e.code){

case "Space":

e.preventDefault();

player.paused ? player.play() : player.pause();

break;

case "ArrowLeft":

player.currentTime-=10;

break;

case "ArrowRight":

player.currentTime+=10;

break;

case "ArrowUp":

player.volume=Math.min(1,player.volume+0.1);
volumeSlider.value=player.volume;

break;

case "ArrowDown":

player.volume=Math.max(0,player.volume-0.1);
volumeSlider.value=player.volume;

break;

case "KeyF":

fullscreenBtn.click();

break;

case "KeyM":

player.muted=!player.muted;

volumeBtn.innerHTML=player.muted
?'<i class="fa-solid fa-volume-xmark"></i>'
:'<i class="fa-solid fa-volume-high"></i>';

break;

}

});

/* ---------- DOUBLE TAP SEEK ---------- */

let lastTap=0;

player.addEventListener("touchend",(e)=>{

const now=Date.now();

if(now-lastTap<300){

const x=e.changedTouches[0].clientX;

if(x<window.innerWidth/2){

player.currentTime-=10;

}else{

player.currentTime+=10;

}

}

lastTap=now;

});

/* ---------- START ---------- */

showSpeedMenu();

console.log("ANiX Video Stream Loaded");

/* ---------- AUTO LOAD FROM URL ---------- */

window.addEventListener("load", () => {

    const params = new URLSearchParams(window.location.search);

    const videoUrl = params.get("video");

    if (!videoUrl) return;

    urlInput.value = decodeURIComponent(videoUrl);

    loadBtn.click();

});

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        playerBox.classList.remove("css-fullscreen");

    }

});
