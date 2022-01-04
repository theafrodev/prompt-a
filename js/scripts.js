let countDate;
let dayText = 0;
let hourText = 0;
let minuteText = 0;
let secondText = 0;
let message = "";
let status = "";
var newWin;
const bc = new BroadcastChannel("present");

//Open only one instance of presentation tab
function opentab() {
    newWin = window.open("./present.html", "Present_Tab", fullscreen = 1);
}



//Countdown Functionality
function countdown() {
    const now = new Date().getTime();
    let difference;

    console.log(countDate);

    //regular time
    if ((countDate - now) >= 0) {
        difference = countDate - now;
    } else {
        //overtime
        difference = now - countDate;
        status = "Time's up"
    }

    //time logic
    const seconds = 1000;
    const minutes = seconds * 60;
    const hours = minutes * 60;
    const days = hours * 24;

    dayText = Math.floor(difference / days);
    hourText = Math.floor((difference % days) / hours);
    minuteText = Math.floor((difference % hours) / minutes);
    secondText = Math.floor((difference % minutes) / seconds);

    //display values
    document.querySelector('.days').innerText = dayText;
    document.querySelector('.hours').innerText = hourText;
    document.querySelector('.minutes').innerText = minuteText;
    document.querySelector('.seconds').innerText = secondText;
    document.querySelector('.status').innerText = status;

}


//Get inputs from form
function getInputs() {

    let secs = 0;
    let mins = 0;
    let hrs = 0;
    let dys = 0;

    const daysInput = document.getElementById("daysInput").value;
    const hoursInput = document.getElementById("hoursInput").value;
    const minutesInput = document.getElementById("minutesInput").value;
    const secondsInput = document.getElementById("secondsInput").value;

    console.log(daysInput, hoursInput, minutesInput, secondsInput);

    secs = secondsInput * 1000;
    mins = minutesInput * 60000;
    hrs = (hoursInput * 60) * 60000;
    dys = ((daysInput * 24) * 60) * 60000;

    countDate = (new Date().getTime()) + dys + hrs + mins + secs;

    //on form submit, start countdown and refresh every half second
    setInterval(countdown, 500);

}


//Send messages to speaker
function sendMessage() {
    message = document.querySelector("#message").value;

    document.querySelector(".display-message").innerText = message;
}



//Send information to presentation screen
function sendbroadcast() {

    //Send message
    bc.postMessage(

        [dayText, hourText, minuteText, secondText, message, status]

        // [1, 2, 3, 4, 5]

    );


}

//Receive information from control screen
function receivebroadcast() {

    //receive message
    bc.addEventListener("message", function(e) {
        document.querySelector('.b-days').innerText = e.data[0];
        document.querySelector('.b-hours').innerText = e.data[1];
        document.querySelector('.b-minutes').innerText = e.data[2];
        document.querySelector('.b-seconds').innerText = e.data[3];
        document.querySelector('.display-message').innerText = e.data[4];
        document.querySelector('.status').innerText = e.data[5];
    });

}

//Send message every second
setInterval(sendbroadcast, 1000);

//Receive message every second
function collect() {
    setInterval(receivebroadcast, 1000);
}