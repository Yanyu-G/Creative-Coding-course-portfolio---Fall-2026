
let sound1, luckySound, alertSound, lullabySound;

let sounds = [];
let buttons = [];
let currentSound = null;

function preload() {
  sound1 = loadSound("sound/sound1.mp3");
  luckySound = loadSound("sound/sound2.mp3");
  alertSound = loadSound("sound/sound3.mp3");
  lullabySound = loadSound("sound/sound4.mp3");
}

function setup() {
  noCanvas();

  sounds = [
    sound1,
    luckySound,
    alertSound,
    lullabySound
  ];

  // Main container
  let container = createDiv();
  container.style("margin", "60px 20px");
  container.style("color", "#2F4F4D");

  // Title
  let title = createElement("h2", "Sound Playground");
  title.parent(container);

  let description = createP("Click a button to play a sound");
  description.parent(container);

  // Button container
  let buttonContainer = createDiv();
  buttonContainer.parent(container);

  buttonContainer.style("display", "flex");
  buttonContainer.style("gap", "20px");
  buttonContainer.style("flex-wrap", "wrap");
  buttonContainer.style("margin-top", "30px");

  // Create four buttons
  for (let i = 0; i < 4; i++) {
    let btn = createButton(i + 1);

    btn.parent(buttonContainer);
    btn.size(70, 50);

    btn.style("background-color", "#F5FFFA");
    btn.style("color", "#2F4F4D");
    btn.style("border", "2px solid #2F4F4D");
    btn.style("font-size", "20px");
    btn.style("cursor", "pointer");

    btn.mousePressed(() => playSound(i));

    buttons.push(btn);
  }

  // Sound status
  statusText = createP("Stopped");
  statusText.parent(container);
  statusText.style("margin-top", "40px");
  statusText.style("font-size", "18px");
}

// Play / Stop sound
function playSound(index) {
  let selectedSound = sounds[index];

  if (currentSound === selectedSound) {
    selectedSound.stop();
    currentSound = null;
  } else {
    if (currentSound !== null) {
      currentSound.stop();
    }

    selectedSound.play();
    currentSound = selectedSound;
  }

  updateButtons();
}

// Update button appearance
function updateButtons() {
  for (let i = 0; i < buttons.length; i++) {
    if (sounds[i] === currentSound) {
      buttons[i].style("background-color", "#2F4F4D");
      buttons[i].style("color", "#FFFFFF");
    } else {
      buttons[i].style("background-color", "#F5FFFA");
      buttons[i].style("color", "#2F4F4D");
    }
  }

  if (currentSound !== null) {
    let index = sounds.indexOf(currentSound);
    statusText.html("Playing Sound " + (index + 1));
  } else {
    statusText.html("Stopped");
  }
}
