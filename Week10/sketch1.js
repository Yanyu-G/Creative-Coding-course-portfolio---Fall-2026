
let sound1, luckySound, alertSound, lullabySound;

let sounds = [];
let singleButtons = [];
let mixButtons = [];

let currentSound = null;
let mixing = [false, false, false, false];

let singleStatus;
let mixStatus;

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

  let container = createDiv();
  container.style("margin", "60px 20px");
  container.style("color", "#2F4F4D");

  // MAIN TITLE
  let title = createElement("h2", "Sound Playground");
  title.parent(container);

  // ==================================
  // PART 1: SINGLE SOUND PLAYBACK
  // ==================================

  let singleTitle = createElement("h3", "Single Sound Playback");
  singleTitle.parent(container);

  let description1 = createP("Click a button to play one sound");
  description1.parent(container);

  let singleContainer = createDiv();
  singleContainer.parent(container);
  styleButtonContainer(singleContainer);

  for (let i = 0; i < 4; i++) {
    let btn = createButton(i + 1);

    btn.parent(singleContainer);
    styleButton(btn);

    btn.mousePressed(() => playSingle(i));

    singleButtons.push(btn);
  }

  singleStatus = createP("Stopped");
  singleStatus.parent(container);
  singleStatus.style("margin-top", "25px");

  // ==================================
  // PART 2: SOUND MIXING
  // ==================================

  let divider = createDiv();
  divider.parent(container);
  divider.style("border-top", "1px solid #C8D8D1");
  divider.style("margin", "45px 0 30px");

  let mixTitle = createElement("h2", "Sound Mixing");
  mixTitle.parent(container);

  let description2 = createP(
    "Select multiple sounds to play together in a loop"
  );
  description2.parent(container);

  let mixContainer = createDiv();
  mixContainer.parent(container);
  styleButtonContainer(mixContainer);

  for (let i = 0; i < 4; i++) {
    let btn = createButton(i + 1);

    btn.parent(mixContainer);
    styleButton(btn);

    btn.mousePressed(() => toggleMix(i));

    mixButtons.push(btn);
  }

  mixStatus = createP("No sounds selected");
  mixStatus.parent(container);
  mixStatus.style("margin-top", "25px");

  // STOP ALL BUTTON
  let stopAllButton = createButton("Stop All Sounds");
  stopAllButton.parent(container);

  styleButton(stopAllButton);
  stopAllButton.style("width", "180px");
  stopAllButton.style("font-size", "16px");
  stopAllButton.style("margin-top", "20px");

  stopAllButton.mousePressed(stopAll);

  // Update status when single sounds finish
  for (let i = 0; i < sounds.length; i++) {
    sounds[i].onended(() => {
      if (currentSound === sounds[i]) {
        currentSound = null;
        updateButtons();
      }
    });
  }

  updateButtons();
}

// ==================================
// BUTTON STYLING
// ==================================

function styleButtonContainer(container) {
  container.style("display", "flex");
  container.style("gap", "20px");
  container.style("flex-wrap", "wrap");
  container.style("margin-top", "25px");
}

function styleButton(btn) {
  btn.size(70, 50);
  btn.style("background-color", "#F5FFFA");
  btn.style("color", "#2F4F4D");
  btn.style("border", "2px solid #2F4F4D");
  btn.style("font-size", "20px");
  btn.style("cursor", "pointer");
}

// ==================================
// SINGLE SOUND PLAYBACK
// ==================================

function playSingle(index) {
  let selectedSound = sounds[index];

  // Stop all mixing sounds
  stopMixing();

  if (currentSound === selectedSound) {
    selectedSound.stop();
    currentSound = null;
  } else {
    if (currentSound !== null) {
      currentSound.stop();
    }

    selectedSound.setLoop(false);
    selectedSound.play();

    currentSound = selectedSound;
  }

  updateButtons();
}

// ==================================
// SOUND MIXING
// ==================================

function toggleMix(index) {

  // Stop single sound
  if (currentSound !== null) {
    currentSound.stop();
    currentSound = null;
  }

  let selectedSound = sounds[index];

  if (mixing[index] == false) {

    // Start looping selected sound
    selectedSound.loop();
    mixing[index] = true;

  } else {

    // Stop only this sound
    selectedSound.stop();
    mixing[index] = false;

  }

  updateButtons();
}

// ==================================
// STOP MIXING
// ==================================

function stopMixing() {
  for (let i = 0; i < sounds.length; i++) {
    if (mixing[i]) {
      sounds[i].stop();
      mixing[i] = false;
    }
  }
}

// ==================================
// STOP ALL
// ==================================

function stopAll() {
  for (let i = 0; i < sounds.length; i++) {
    sounds[i].stop();
    mixing[i] = false;
  }

  currentSound = null;
  updateButtons();
}

// ==================================
// UPDATE BUTTON COLORS
// ==================================

function updateButtons() {

  // Single playback button colors
  for (let i = 0; i < singleButtons.length; i++) {

    if (currentSound === sounds[i]) {
      singleButtons[i].style("background-color", "#2F4F4D");
      singleButtons[i].style("color", "#FFFFFF");
    } else {
      singleButtons[i].style("background-color", "#F5FFFA");
      singleButtons[i].style("color", "#2F4F4D");
    }
  }

  // Mixing button colors
  for (let i = 0; i < mixButtons.length; i++) {

    if (mixing[i]) {
      mixButtons[i].style("background-color", "#2F4F4D");
      mixButtons[i].style("color", "#FFFFFF");
    } else {
      mixButtons[i].style("background-color", "#F5FFFA");
      mixButtons[i].style("color", "#2F4F4D");
    }
  }

  // Single playback status
  if (currentSound !== null) {
    let index = sounds.indexOf(currentSound);
    singleStatus.html("Playing Sound " + (index + 1));
  } else {
    singleStatus.html("Stopped");
  }

  // Mixing status
  let count = mixing.filter(value => value).length;

  if (count == 0) {
    mixStatus.html("No sounds selected");
  } else {
    mixStatus.html(count + " sound(s) looping");
  }
}
