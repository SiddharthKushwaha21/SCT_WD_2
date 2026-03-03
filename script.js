let startTime;
let elapsedTime = 0;
let timerInterval;
let running = false;
let laps = [];

const display = document.getElementById("display");
const startPauseBtn = document.getElementById("startPause");
const lapBtn = document.getElementById("lapBtn");
const resetBtn = document.getElementById("resetBtn");
const lapsContainer = document.getElementById("laps");
const statusIndicator = document.getElementById("status");

function formatTime(time){
    let ms = time % 1000;
    let totalSeconds = Math.floor(time / 1000);
    let seconds = totalSeconds % 60;
    let minutes = Math.floor(totalSeconds / 60) % 60;
    let hours = Math.floor(totalSeconds / 3600);

    return (
        String(hours).padStart(2,'0') + ":" +
        String(minutes).padStart(2,'0') + ":" +
        String(seconds).padStart(2,'0') + ":" +
        String(ms).padStart(3,'0')
    );
}

function updateDisplay(){
    display.innerText = formatTime(elapsedTime);
}

function startPause(){
    if(!running){
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(()=>{
            elapsedTime = Date.now() - startTime;
            updateDisplay();
        },10);
        running = true;
        startPauseBtn.innerText = "Pause";
        statusIndicator.style.background = "lime";
        statusIndicator.style.boxShadow = "0 0 10px lime";
    } else {
        clearInterval(timerInterval);
        running = false;
        startPauseBtn.innerText = "Start";
        statusIndicator.style.background = "red";
        statusIndicator.style.boxShadow = "0 0 10px red";
    }
}

function reset(){
    clearInterval(timerInterval);
    running = false;
    elapsedTime = 0;
    laps = [];
    updateDisplay();
    lapsContainer.innerHTML = "";
    startPauseBtn.innerText = "Start";
    statusIndicator.style.background = "red";
}

function addLap(){
    if(!running) return;

    laps.push(elapsedTime);
    renderLaps();
}

function renderLaps(){
    lapsContainer.innerHTML = "";

    let fastest = Math.min(...laps);
    let slowest = Math.max(...laps);

    laps.forEach((lapTime,index)=>{
        let li = document.createElement("li");
        li.innerHTML = `<span>Lap ${index+1}</span> <span>${formatTime(lapTime)}</span>`;

        if(lapTime === fastest) li.classList.add("fastest");
        if(lapTime === slowest) li.classList.add("slowest");

        lapsContainer.appendChild(li);
    });
}

/* Event Listeners */
startPauseBtn.addEventListener("click",startPause);
resetBtn.addEventListener("click",reset);
lapBtn.addEventListener("click",addLap);

/* Keyboard Shortcuts */
document.addEventListener("keydown",(e)=>{
    if(e.code === "Space") startPause();
    if(e.key === "r") reset();
    if(e.key === "l") addLap();
});