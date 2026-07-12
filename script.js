const video = document.getElementById("player");

const playBtn = document.getElementById("play");
const rewindBtn = document.getElementById("rewind");
const forwardBtn = document.getElementById("forward");
const seek = document.getElementById("seek");

const current = document.getElementById("current");
const duration = document.getElementById("duration");

const volumeSlider = document.getElementById("volume");
const volumeBtn = document.getElementById("volumeBtn");

const fullscreenBtn = document.getElementById("fullscreen");
const pipBtn = document.getElementById("pip");

const urlInput = document.getElementById("url");
const loadBtn = document.getElementById("load");

const speed = document.getElementById("speed");

function formatTime(time){

    if(isNaN(time)) return "00:00";

    const h = Math.floor(time/3600);
    const m = Math.floor((time%3600)/60);
    const s = Math.floor(time%60);

    if(h>0){

        return `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

    }

    return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

}

loadBtn.onclick=()=>{

    const src=urlInput.value.trim();

    if(src==="") return;

    if(src.endsWith(".m3u8")){

        if(Hls.isSupported()){

            const hls=new Hls();

            hls.loadSource(src);

            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED,function(){

                video.play();

            });

        }else{

            video.src=src;

            video.play();

        }

    }else{

        video.src=src;

        video.play();

    }

};

// ==========================
// PLAYER CONTROLS
// ==========================

playBtn.addEventListener("click", () => {

    if (video.paused) {

        video.play();

    } else {

        video.pause();

    }

});

video.addEventListener("play", () => {

    playBtn.innerHTML =
        '<i class="fa-solid fa-pause"></i>';

});

video.addEventListener("pause", () => {

    playBtn.innerHTML =
        '<i class="fa-solid fa-play"></i>';

});

// ==========================
// SEEK BAR
// ==========================

video.addEventListener("loadedmetadata", () => {

    seek.max = Math.floor(video.duration);

    duration.textContent = formatTime(video.duration);

});

video.addEventListener("timeupdate", () => {

    seek.value = Math.floor(video.currentTime);

    current.textContent = formatTime(video.currentTime);

});

seek.addEventListener("input", () => {

    video.currentTime = seek.value;

});

// ==========================
// 10 SEC BACK
// ==========================

rewindBtn.addEventListener("click", () => {

    video.currentTime = Math.max(0, video.currentTime - 10);

});

// ==========================
// 10 SEC FORWARD
// ==========================

forwardBtn.addEventListener("click", () => {

    video.currentTime = Math.min(

        video.duration,

        video.currentTime + 10

    );

});

// ==========================
// VOLUME
// ==========================

volumeSlider.addEventListener("input", () => {

    video.volume = volumeSlider.value;

});

volumeBtn.addEventListener("click", () => {

    video.muted = !video.muted;

    if (video.muted) {

        volumeBtn.innerHTML =
            '<i class="fa-solid fa-volume-xmark"></i>';

    } else {

        volumeBtn.innerHTML =
            '<i class="fa-solid fa-volume-high"></i>';

    }

});

// ==========================
// SPEED
// ==========================

speed.addEventListener("change", () => {

    video.playbackRate = parseFloat(speed.value);

});

// ==========================
// FULLSCREEN
// ==========================

fullscreenBtn.addEventListener("click", async () => {

    if (!document.fullscreenElement) {

        try {

            await video.requestFullscreen();

        } catch (e) {
            console.log(e);
        }

    } else {

        document.exitFullscreen();

    }

});

// ==========================
// PICTURE IN PICTURE
// ==========================

pipBtn.addEventListener("click", async () => {

    try {

        if (document.pictureInPictureEnabled &&
            document.pictureInPictureElement !== video) {

            await video.requestPictureInPicture();

        }

    } catch (e) {

        console.log(e);

    }

});

// ==========================
// AUTO HIDE CONTROLS
// ==========================

const controls = document.querySelector(".controls");

let hideTimer;

function showControls() {

    controls.style.opacity = "1";
    controls.style.pointerEvents = "auto";

    clearTimeout(hideTimer);

    hideTimer = setTimeout(() => {

        if (!video.paused) {

            controls.style.opacity = "0";

            controls.style.pointerEvents = "none";

        }

    }, 3000);

}

video.addEventListener("mousemove", showControls);
video.addEventListener("touchstart", showControls);
video.addEventListener("play", showControls);

video.addEventListener("pause", () => {

    controls.style.opacity = "1";
    controls.style.pointerEvents = "auto";

});

showControls();

// ==========================
// KEYBOARD SHORTCUTS
// ==========================

document.addEventListener("keydown", (e) => {

    switch (e.code) {

        case "Space":

            e.preventDefault();

            playBtn.click();

            break;

        case "ArrowLeft":

            rewindBtn.click();

            break;

        case "ArrowRight":

            forwardBtn.click();

            break;

        case "KeyF":

            fullscreenBtn.click();

            break;

        case "KeyM":

            volumeBtn.click();

            break;

    }

});

/* ===========================
   SETTINGS PANEL
=========================== */

const settingsBtn = document.getElementById("settings");
const settingsMenu = document.getElementById("settingsMenu");
const settingsContent = document.getElementById("settingsContent");

const tabSpeed = document.getElementById("tabSpeed");
const tabAudio = document.getElementById("tabAudio");
const tabSubtitle = document.getElementById("tabSubtitle");
const closeSettings = document.getElementById("closeSettings");

settingsBtn.onclick = () => {
    settingsMenu.style.display = "block";
    showSpeed();
};

closeSettings.onclick = () => {
    settingsMenu.style.display = "none";
};

function activeTab(tab){
    document.querySelectorAll(".tab").forEach(t=>{
        t.classList.remove("active");
    });
    tab.classList.add("active");
}

/* ---------- SPEED ---------- */

function showSpeed(){

    activeTab(tabSpeed);

    settingsContent.innerHTML=`
        <div class="setting-list">

            <div class="setting-item" data-speed="0.25">0.25x</div>
            <div class="setting-item" data-speed="0.5">0.5x</div>
            <div class="setting-item" data-speed="0.75">0.75x</div>
            <div class="setting-item active-speed" data-speed="1">• 1x</div>
            <div class="setting-item" data-speed="1.25">1.25x</div>
            <div class="setting-item" data-speed="1.5">1.5x</div>
            <div class="setting-item" data-speed="2">2x</div>

        </div>
    `;

    document.querySelectorAll(".setting-item").forEach(item=>{

        item.onclick=()=>{

            document.querySelectorAll(".setting-item")
            .forEach(i=>i.classList.remove("active-speed"));

            item.classList.add("active-speed");

            player.playbackRate=parseFloat(item.dataset.speed);

        };

    });

}

/* ---------- AUDIO ---------- */

function showAudio(){

    activeTab(tabAudio);

    let html='<div class="setting-list">';

    if(player.audioTracks && player.audioTracks.length){

        for(let i=0;i<player.audioTracks.length;i++){

            html+=`
            <div class="setting-item"
            onclick="selectAudio(${i})">
            Audio ${i+1}
            </div>
            `;

        }

    }else{

        html+=`
        <div class="setting-item">
        No Audio Tracks
        </div>
        `;

    }

    html+='</div>';

    settingsContent.innerHTML=html;

}

/* ---------- SUBTITLE ---------- */

function showSubtitle(){

    activeTab(tabSubtitle);

    settingsContent.innerHTML=`

    <div class="setting-list">

        <label class="setting-item">

            Load Subtitle (.vtt)

            <input
            type="file"
            id="subtitleFile"
            accept=".vtt"
            hidden>

        </label>

        <div
        class="setting-item"
        id="disableSubtitle">

        Disable Subtitle

        </div>

    </div>

    `;

}

/* ---------- TAB CLICK ---------- */

tabSpeed.onclick=showSpeed;

tabAudio.onclick=showAudio;

tabSubtitle.onclick=showSubtitle;

const settingsBtn = document.getElementById("settings");
const settingsMenu = document.getElementById("settingsMenu");
const closeSettings = document.getElementById("closeSettings");

settingsBtn.addEventListener("click", () => {

    settingsMenu.style.display =
        settingsMenu.style.display === "block"
        ? "none"
        : "block";

});

closeSettings.addEventListener("click", () => {

    settingsMenu.style.display = "none";

});

/* ===========================
   AUDIO TRACKS
=========================== */

const audioTrack = document.getElementById("audioTrack");

function loadAudioTracks(){

const tracks = player.audioTracks;

audioTrack.innerHTML = "";

if(!tracks || tracks.length===0){

const op=document.createElement("option");
op.text="Default Audio";
audioTrack.appendChild(op);

return;
}

for(let i=0;i<tracks.length;i++){

const option=document.createElement("option");

option.value=i;

option.text=
tracks[i].label ||
tracks[i].language ||
`Track ${i+1}`;

audioTrack.appendChild(option);

}

audioTrack.onchange=()=>{

for(let i=0;i<tracks.length;i++){

tracks[i].enabled=(i==audioTrack.value);

}

};

}

player.addEventListener("loadedmetadata",loadAudioTracks);


/* ===========================
   SUBTITLE SUPPORT
=========================== */

const subtitleInput=document.getElementById("subtitleFile");

const subtitleTrack=document.getElementById("subtitleTrack");

const subtitleToggle=document.getElementById("subtitleToggle");

subtitleInput.addEventListener("change",e=>{

const file=e.target.files[0];

if(!file) return;

subtitleTrack.src=URL.createObjectURL(file);

subtitleTrack.track.mode="showing";

});

subtitleToggle.onclick=()=>{

const track=subtitleTrack.track;

track.mode=
track.mode==="showing"
?
"hidden"
:
"showing";

};
