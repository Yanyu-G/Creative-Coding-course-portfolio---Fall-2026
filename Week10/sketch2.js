
const soundNames = [
  "Sound 1",
  "Lucky-Lucky",
  "Short Alert",
  "Lullaby of Enchantment"
];

const soundPaths = [
  "sound/sound1.mp3",
  "sound/sound2.mp3",
  "sound/sound3.mp3",
  "sound/sound4.mp3"
];

let audioContext;
let tracks = [];
let singleButtons = [];
let mixButtons = [];
let currentSingle = -1;

let singleStatus;
let mixStatus;

// ==================================
// SETUP
// ==================================

function setup() {
  noCanvas();

  let container = createDiv();
  container.style("margin", "50px 20px");
  container.style("color", "#2F4F4D");

  createElement("h2", "Sound Playground")
    .parent(container);

  // ==================================
  // PART 1: SINGLE SOUND PLAYBACK
  // ==================================

  createElement("h3", "Single Sound Playback")
    .parent(container);

  createP("Click a button to play one sound")
    .parent(container);

  let singleContainer = createDiv();
  singleContainer.parent(container);
  styleRow(singleContainer);

  for (let i = 0; i < 4; i++) {
    let btn = createButton(i + 1);
    btn.parent(singleContainer);
    styleButton(btn);

    btn.mousePressed(() => playSingle(i));
    singleButtons.push(btn);
  }

  singleStatus = createP("Stopped");
  singleStatus.parent(container);

  // ==================================
  // DIVIDER
  // ==================================

  let divider = createDiv();
  divider.parent(container);
  divider.style("border-top", "1px solid #C8D8D1");
  divider.style("margin", "40px 0 30px");

  // ==================================
  // PART 2: SOUND MIXING & EFFECTS
  // ==================================

  createElement("h2", "Sound Mixing & Effects")
    .parent(container);

  createP("Select sounds to loop and adjust their effects.")
    .parent(container);

  let mixContainer = createDiv();
  mixContainer.parent(container);
  styleRow(mixContainer);

  for (let i = 0; i < 4; i++) {
    let btn = createButton(i + 1);
    btn.parent(mixContainer);
    styleButton(btn);

    btn.mousePressed(() => toggleMix(i));
    mixButtons.push(btn);
  }

  mixStatus = createP("No sounds selected");
  mixStatus.parent(container);

  // ==================================
  // INDIVIDUAL SOUND EFFECTS
  // ==================================

  createElement("h3", "Individual Sound Effects")
    .parent(container);

  for (let i = 0; i < 4; i++) {
    createEffectPanel(container, i);
  }

  // ==================================
  // STOP ALL
  // ==================================

  let stopBtn = createButton("Stop All Sounds");
  stopBtn.parent(container);
  styleButton(stopBtn);
  stopBtn.style("width", "180px");
  stopBtn.style("font-size", "16px");
  stopBtn.style("margin-top", "25px");
  stopBtn.mousePressed(stopAll);

  // Create audio elements
  for (let i = 0; i < 4; i++) {
    let audio = new Audio(soundPaths[i]);
    audio.preload = "auto";

    let track = {
      audio: audio,
      mixing: false,
      volume: 0.35,
      rate: 1,
      reverb: 0,
      filter: 10000,
      nodes: null
    };

    tracks.push(track);

    audio.addEventListener("ended", () => {
      if (currentSingle === i) {
        currentSingle = -1;
        updateButtons();
      }
    });
  }

  updateButtons();
}

// ==================================
// AUDIO ENGINE
// ==================================

async function initAudio() {
  if (!audioContext) {
    audioContext = new (
      window.AudioContext ||
      window.webkitAudioContext
    )();

    tracks.forEach(track => {
      let source =
        audioContext.createMediaElementSource(track.audio);

      let gain = audioContext.createGain();
      let filter = audioContext.createBiquadFilter();

      let dry = audioContext.createGain();
      let wet = audioContext.createGain();
      let reverb = audioContext.createConvolver();

      filter.type = "lowpass";
      filter.frequency.value = track.filter;

      gain.gain.value = track.volume;

      // Generate a reverb impulse
      let seconds = 2.2;
      let length = Math.floor(
        audioContext.sampleRate * seconds
      );

      let impulse = audioContext.createBuffer(
        2, length, audioContext.sampleRate
      );

      for (let channel = 0; channel < 2; channel++) {
        let data = impulse.getChannelData(channel);

        for (let j = 0; j < length; j++) {
          let decay = Math.pow(1 - j / length, 3);
          data[j] = (Math.random() * 2 - 1) * decay;
        }
      }

      reverb.buffer = impulse;

      // Audio routing
      source.connect(gain);
      gain.connect(filter);

      filter.connect(dry);
      filter.connect(reverb);
      reverb.connect(wet);

      dry.connect(audioContext.destination);
      wet.connect(audioContext.destination);

      track.nodes = { gain, filter, dry, wet };

      updateTrackEffects(track);
    });
  }

  if (audioContext.state !== "running") {
    await audioContext.resume();
  }
}

function updateTrackEffects(track) {
  if (!track.nodes) return;

  let n = track.nodes;

  n.gain.gain.value = track.volume;
  n.filter.frequency.value = track.filter;

  n.dry.gain.value = 1 - track.reverb;
  n.wet.gain.value = track.reverb;

  track.audio.playbackRate = track.rate;
}

// ==================================
// SINGLE PLAYBACK
// ==================================

async function playSingle(index) {
  await initAudio();

  stopMixing();

  if (currentSingle === index) {
    tracks[index].audio.pause();
    tracks[index].audio.currentTime = 0;
    currentSingle = -1;
  } else {
    if (currentSingle !== -1) {
      let old = tracks[currentSingle].audio;
      old.pause();
      old.currentTime = 0;
    }

    let audio = tracks[index].audio;

    audio.pause();
    audio.currentTime = 0;
    audio.loop = false;

    try {
      await audio.play();
      currentSingle = index;
    } catch (error) {
      console.error("Playback failed:", error);
      currentSingle = -1;
    }
  }

  updateButtons();
}

// ==================================
// SOUND MIXING
// ==================================

async function toggleMix(index) {
  await initAudio();

  // Stop single playback
  if (currentSingle !== -1) {
    let audio = tracks[currentSingle].audio;
    audio.pause();
    audio.currentTime = 0;
    currentSingle = -1;
  }

  let track = tracks[index];

  if (track.mixing) {
    track.audio.pause();
    track.audio.currentTime = 0;
    track.audio.loop = false;
    track.mixing = false;
  } else {
    track.audio.pause();
    track.audio.currentTime = 0;
    track.audio.loop = true;

    try {
      await track.audio.play();
      track.mixing = true;
    } catch (error) {
      console.error("Loop failed:", error);
      track.mixing = false;
    }
  }

  updateButtons();
}

function stopMixing() {
  tracks.forEach(track => {
    if (track.mixing) {
      track.audio.pause();
      track.audio.currentTime = 0;
      track.audio.loop = false;
      track.mixing = false;
    }
  });
}

function stopAll() {
  tracks.forEach(track => {
    track.audio.pause();
    track.audio.currentTime = 0;
    track.audio.loop = false;
    track.mixing = false;
  });

  currentSingle = -1;
  updateButtons();
}

// ==================================
// EFFECT PANELS
// ==================================

function createEffectPanel(parent, index) {
  let panel = createDiv();
  panel.parent(parent);

  panel.style("border", "1px solid #C8D8D1");
  panel.style("padding", "15px");
  panel.style("margin-bottom", "12px");
  panel.style("max-width", "500px");

  let header = createDiv();
  header.parent(panel);
  header.style("display", "flex");
  header.style("justify-content", "space-between");
  header.style("align-items", "center");

  let title = createElement("h4", soundNames[index]);
  title.parent(header);
  title.style("margin", "0");

  let expandBtn = createButton("+");
  expandBtn.parent(header);
  styleButton(expandBtn);
  expandBtn.style("width", "35px");
  expandBtn.style("height", "35px");

  let content = createDiv();
  content.parent(panel);
  content.style("display", "none");
  content.style("margin-top", "20px");

  expandBtn.mousePressed(() => {
    let opened = content.style("display") !== "none";

    content.style("display", opened ? "none" : "block");
    expandBtn.html(opened ? "+" : "-");
  });

  // Volume
  addSlider(
    content, "Volume", 0, 1, 0.35, 0.01,
    value => {
      tracks[index].volume = value;
      updateTrackEffects(tracks[index]);
    }
  );

  // Playback speed
  addSlider(
    content, "Playback Speed", 0.25, 3, 1, 0.05,
    value => {
      tracks[index].rate = value;
      tracks[index].audio.playbackRate = value;
    }
  );

  // Reverb
  addSlider(
    content, "Reverb Mix", 0, 1, 0, 0.05,
    value => {
      tracks[index].reverb = value;
      updateTrackEffects(tracks[index]);
    }
  );

  // Low-pass filter
  addSlider(
    content, "Low-Pass Filter (Hz)",
    200, 10000, 10000, 100,
    value => {
      tracks[index].filter = value;
      updateTrackEffects(tracks[index]);
    }
  );
}

function addSlider(
  parent, label, min, max, start, step, callback
) {
  let row = createDiv();
  row.parent(parent);
  row.style("margin-bottom", "18px");

  let labelRow = createDiv();
  labelRow.parent(row);
  labelRow.style("display", "flex");
  labelRow.style("justify-content", "space-between");

  let name = createSpan(label);
  name.parent(labelRow);

  let valueText = createSpan(String(start));
  valueText.parent(labelRow);

  let slider = createSlider(min, max, start, step);
  slider.parent(row);
  slider.style("width", "100%");
  slider.style("margin-top", "10px");

  slider.input(() => {
    let value = Number(slider.value());
    valueText.html(String(value));
    callback(value);
  });
}

// ==================================
// STYLING
// ==================================

function styleRow(container) {
  container.style("display", "flex");
  container.style("gap", "20px");
  container.style("flex-wrap", "wrap");
  container.style("margin", "25px 0");
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
// UPDATE BUTTON COLORS
// ==================================

function updateButtons() {
  for (let i = 0; i < 4; i++) {
    let singleActive = currentSingle === i;
    let mixActive = tracks[i].mixing;

    setButtonActive(singleButtons[i], singleActive);
    setButtonActive(mixButtons[i], mixActive);
  }

  if (currentSingle === -1) {
    singleStatus.html("Stopped");
  } else {
    singleStatus.html(
      "Playing Sound " + (currentSingle + 1)
    );
  }

  let count = tracks.filter(t => t.mixing).length;

  mixStatus.html(
    count === 0
      ? "No sounds selected"
      : count + " sound(s) looping"
  );
}

function setButtonActive(btn, active) {
  btn.style(
    "background-color",
    active ? "#2F4F4D" : "#F5FFFA"
  );

  btn.style(
    "color",
    active ? "#FFFFFF" : "#2F4F4D"
  );
}
