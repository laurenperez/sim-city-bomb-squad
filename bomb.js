console.log("javascript running");

var totalTime = 3000;
var timeRemaining = 0;
var gameOver = false;
var wiresToCut = [];
var successSong = null;

var delay = null;
var timer = null;

var wiresCut = {
  blue: false,
  green: false,
  red: false,
  white: false,
  yellow: false
}

var checkForWin = function() {
  return wiresToCut.length > 0 ? false : true;
}

var detonate = function() {
  endGame(false);
}

var endGame = function(win) {
  gameOver = true;
  clearTimeout(delay);
  clearInterval(timer);
  if (win) {
    // we won!!!
    console.log("YOU SAVED THE CITY!!!");
    var yay = document.getElementById('yay');
    yay.addEventListener("ended", function() {
      successSong.play();
    });
    yay.play();
    document.querySelector(".timerbox p").style.color = "green";
  } else {
    // we lost
    console.log("BOOM!!!");
    document.getElementById('explode').play();
    document.body.classList.remove("unexploded");
    document.body.classList.add("exploded");
  }
}

var cutWire = function() {
  if (!wiresCut[this.id] && !gameOver) {
    // do the wire cut stuff and game checking here
    document.getElementById('buzz').play();
    this.src = "img/cut-" + this.id + "-wire.png";
    wiresCut[this.id] = true;
    var wireIndex = wiresToCut.indexOf(this.id);
    if (wireIndex > -1) {
      // This is where the good cut logic goes
      console.log(this.id + " was correct!");
      wiresToCut.splice(wireIndex, 1);
      if (checkForWin()) {
        endGame(true);
      }
    } else {
      // This is where the bad cut logic goes
      delay = setTimeout(detonate, 750);
    }
  }
}

var reset = function() {
  gameOver = false;
  var wireImages = document.getElementsByClassName('imagebox')[0].children;
  for (var i = 0; i < wireImages.length; i++) {
    wireImages[i].src = "img/uncut-" + wireImages[i].id + "-wire.png";
  }
  // Reset background
  document.body.classList.add("unexploded");
  document.body.classList.remove("exploded");
  document.querySelector(".timerbox p").style.color = "red";

  clearTimeout(delay);
  clearInterval(timer);

  successSong.pause(); // RESET
  successSong.currentTime = 0; // RESET

  for (color in wiresCut) {
    wiresCut[color] = false;
  }
  initGame();
}

var updateClock = function() {
  timeRemaining--;
  var seconds = 0;
  var hundredths = 0;

  if (timeRemaining >= 0) {
    seconds = Math.floor(timeRemaining / 100);
    hundredths = timeRemaining - (seconds * 100);
  } else {
    endGame(false);
  }
  var secondsString = seconds >= 10 ? seconds.toString() : "0" + seconds.toString();
  var hundredthsString = hundredths >= 10 ? hundredths.toString() : "0" + hundredths.toString();
  document.querySelector(".timerbox p").textContent = "0:00:" + secondsString + ":" + hundredthsString;
}

var initGame = function() {
  timeRemaining = totalTime;

  var allColors = Object.keys(wiresCut);
  wiresToCut = allColors.filter(function() {
    var rand = Math.random();
    if (rand > 0.5) {
      return true;
    } else {
      return false;
    }
  });
  console.log(wiresToCut);
  timer = setInterval(updateClock, 10);
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("blue").addEventListener('click', cutWire);
  document.getElementById("green").addEventListener('click', cutWire);
  document.getElementById("red").addEventListener('click', cutWire);
  document.getElementById("white").addEventListener('click', cutWire);
  document.getElementById("yellow").addEventListener('click', cutWire);
  successSong = document.getElementById('success');
  document.getElementById("reset").addEventListener('click', reset);
  initGame();
});
