const container = document.querySelector(".container"),
  musicImg = container.querySelector(".img-area img"),
  musicName = container.querySelector(".song-details .name"),
  musicArtist = container.querySelector(".song-details .artist"),
  mainAudio = container.querySelector("#main-audio"),
  playpauseBtn = container.querySelector(".play-pause"),
  nextBtn = container.querySelector("#next"),
  prevBtn = container.querySelector("#prev"),
  progressArea = container.querySelector(".progress-area"),
  progressBar = container.querySelector(".progress-bar"),
  musicList = container.querySelector(".music-list"),
  moreMusicBtn = container.querySelector("#more-music"),
  closemoreMusic = container.querySelector("#close");

let musicIndex = 1;

window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playingSong();
});

// load music function

function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

// play music function
function playMusic() {
  container.classList.add("paused");
  document.getElementById("playpause").src = "icons/pause.svg";
  mainAudio.play();
}

// pause music function
function pauseMusic() {
  container.classList.remove("paused");
  document.getElementById("playpause").src = "icons/play.svg";
  mainAudio.pause();
}
// next music function
function nextMusic() {
  musicIndex++;
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

// prev music function
function prevMusic() {
  musicIndex--;
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}
//play pause button
playpauseBtn.addEventListener("click", () => {
  const isMusicPaused = container.classList.contains("paused");
  isMusicPaused ? pauseMusic() : playMusic();
});

//next music button
nextBtn.addEventListener("click", () => {
  nextMusic();
});

//prev music button
prevBtn.addEventListener("click", () => {
  prevMusic();
});

// update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime; //getting playing song current time
  const duration = e.target.duration; //getting playing total song duration
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = container.querySelector(".current-time"),
    musicDuration = container.querySelector(".max-duration");

  mainAudio.addEventListener("loadeddata", () => {
    //update song total duration

    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });

  //update playing song current time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// update playing song current width according to the progress bar width

progressArea.addEventListener("click", (e) => {
  let progressWidth = progressArea.clientWidth; //getting width of progress bar
  let clickedOffsetX = e.offsetX; //getting offset x value
  let songDuration = mainAudio.duration; //getting song total duration

  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic();
});

//change loop, shuffle, repeat icon on click
const repeatBtn = container.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  let getSrc = document.getElementById("repeat-plist").getAttribute("src");
  switch (getSrc) {
    case "icons/repeat.svg":
      repeatBtn.setAttribute("src", "icons/repeatOne.svg");
      repeatBtn.setAttribute("title", "song looped");
      break;
    case "icons/repeatOne.svg":
      repeatBtn.setAttribute("src", "icons/shuffle.svg");
      repeatBtn.setAttribute("title", "playback shuffled");
      break;
    case "icons/shuffle.svg":
      repeatBtn.setAttribute("src", "icons/repeat.svg");
      repeatBtn.setAttribute("title", "playlist looped");
      break;
  } // we just change icon here
});

//What to do when song ends?
mainAudio.addEventListener("ended", () => {
  let getSrc = document.getElementById("repeat-plist").getAttribute("src");
  switch (getSrc) {
    case "icons/repeat.svg":
      nextMusic(); //calling next music function
      break;
    case "icons/repeatOne.svg":
      mainAudio.currentTime = 0; //setting audio current time to 0
      loadMusic(musicIndex); //calling load music function with current song index value
      playMusic();
      break;
    case "icons/shuffle.svg":
      let randIndex = Math.floor(Math.random() * allMusic.length + 1);
      do {
        randIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex == randIndex); //this loop runs till the next random index is NOT same as the current music index
      musicIndex = randIndex;
      loadMusic(musicIndex);
      playMusic();
      playingSong();
      break;
  }
});

//show the music list on click music icon

moreMusicBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

closemoreMusic.addEventListener("click", () => {
  moreMusicBtn.click();
});

const ulTag = container.querySelector("ul");

//creating li tags according to array length for list

for (let i = 0; i < allMusic.length; i++) {
  let liTag = `<li li-index="${i + 1}">
  <div class="row">
    <span>${allMusic[i].name}</span>
    <p>${allMusic[i].artist}</p>
  </div>
  <audio class="${allMusic[i].src} " src="songs/${allMusic[i].src}.mp3"></audio>
  <span id="${allMusic[i].src}" class="audio-duration">0</span>
</li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag);

  let liAudioDurationTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  if (liAudioTag) {
    liAudioTag.addEventListener("loadeddata", () => {
      let duration = liAudioTag.duration;
      let totalMin = Math.floor(duration / 60);
      let totalSec = Math.floor(duration % 60);
      if (totalSec < 10) {
        //if sec is less than 10 then add 0 before it
        totalSec = `0${totalSec}`;
      }

      liAudioDurationTag.innerText = `${totalMin}:${totalSec}`;
      //adding t-duration attribute with total duration value
      liAudioDurationTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
  }
}
// play particular song from the list on click of li tags

const allLiTags = ulTag.querySelectorAll("li");
function playingSong() {
  for (let j = 0; j < allLiTags.length; j++) {
    let audioTag = allLiTags[j].querySelector(".audio-duration");
    //remove playing class from all other li except the last one which is clicked
    if (allLiTags[j].classList.contains("playing")) {
      allLiTags[j].classList.remove("playing");
      // get the t-duration and pass to .audio-duration inner text
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    // if there is an li tag whose li index is equal to musicIndex
    // then this music is playing now
    if (allLiTags[j].getAttribute("li-index") == musicIndex) {
      allLiTags[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    //adding on click attribute to all li tags
    allLiTags[j].setAttribute("onclick", "clicked(this)");
  }
}

//lets play song on click list li
function clicked(element) {
  //getting li index of particular clicked li tag
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}
