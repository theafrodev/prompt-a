let countDate;
let dayText = 0;
let hourText = 0;
let minuteText = 0;
let secondText = 0;
let message = "";
let overtime;
let stat = "";
var newWin;
let msgBox = document.querySelector(".message-box");
let wrapper = document.querySelector('.wrapper');
let countwrap = document.querySelector('.countdown-wrap');
const bc = new BroadcastChannel("present");

//Open only one instance of presentation tab
function opentab() {
    newWin = window.open("./present.html", "Present_Tab", fullscreen = 1);
}


//Show and hide count
function hideCount(){
    countwrap.classList.add('hide');
    wrapper.classList.add('time');
}

function showCount(){
    countwrap.classList.remove('hide');
    wrapper.classList.remove('time');
}

function showMessage(){
    msgBox.classList.remove('hide');
}

function hideMessage(){
    if (!msgBox.classList.contains('hide')){
         msgBox.classList.add('hide');
    }
}


//Clear Message
function clearMessage(){
    document.getElementById('message').value = '' ;
    sendMessage();
}

//Countdown Functionality
function countdown() {
    const now = new Date().getTime();
    let difference;

    console.log(countDate);

    //regular time
    if ((countDate - now) >= 0) {
        difference = countDate - now;
        stat = '';
        overtime = true;
    } else {
        //overtime
        difference = now - countDate;
        stat = "Time's up";
        overtime = false;
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
    document.querySelector('.status').innerText = stat;

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

        [dayText, hourText, minuteText, secondText, message, stat, overtime]

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

        if(e.data[4] === ''){
            hideMessage();
        }else{
            showMessage();
        }
        
        if(!e.data[6]){
            hideCount();
        }else{
            showCount();
        }
    });

}

//Send message every second
setInterval(sendbroadcast, 1000);

//Receive message every second
function collect() {
    setInterval(receivebroadcast, 1000);
}