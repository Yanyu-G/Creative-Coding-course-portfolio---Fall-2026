
let piano, pitchShift, reverb;

let audioReady = false;
let audioLoading = false;
let statusText = "Click to activate";


// XY control pad
let padX = 55;
let padY = 70;
let padSize = 160;

let ballX = padX + padSize / 2;
let ballY = padY + padSize;

let ballSize = 18;
let dragging = false;

let pitchValue = 0;
let reverbValue = 0;


// Piano keys
let whiteKeys = [];
let blackKeys = [];

let activeNotes = new Set();
let heldKeys = new Map();

let currentNote = "--";
let mouseNote = null;
let pianoDragging = false;


// Computer keyboard
let keyboardMap = {

    // Black keys
    "q": "C#3",
    "w": "D#3",
    "e": "F#3",
    "r": "G#3",
    "t": "A#3",

    "y": "C#4",
    "u": "D#4",
    "i": "F#4",
    "o": "G#4",
    "p": "A#4",

    // White keys
    "a": "C4",
    "s": "D4",
    "d": "E4",
    "f": "F4",
    "g": "G4",
    "h": "A4",
    "k": "B4",
    "l": "C5"
};


function setup() {

    createCanvas(1000, 600);

    textFont("Georgia");

    createPianoKeys();
}


// Create audio system
async function startAudio() {

    if (audioReady || audioLoading) return;

    audioLoading = true;
    statusText = "Loading piano...";

    try {

        await Tone.start();

        // Pitch shifting
        pitchShift = new Tone.PitchShift({
            pitch: 0,
            wet: 1
        });

        // Reverb effect
        reverb = new Tone.Reverb({
            decay: 4,
            wet: 0
        }).toDestination();

        // Load real piano samples
        piano = new Tone.Sampler({

            urls: {
                C3: "C3.mp3",
                "D#3": "Ds3.mp3",
                "F#3": "Fs3.mp3",
                A3: "A3.mp3",

                C4: "C4.mp3",
                "D#4": "Ds4.mp3",
                "F#4": "Fs4.mp3",
                A4: "A4.mp3",

                C5: "C5.mp3"
            },

            release: 1,

            baseUrl:
                "https://tonejs.github.io/audio/salamander/"
        });

        piano.volume.value = -12;

        // Audio routing
        piano.connect(pitchShift);
        pitchShift.connect(reverb);

        await Tone.loaded();
        await reverb.ready;

        audioReady = true;
        statusText = "Ready";

    } catch (error) {

        console.error(error);

        statusText = "Audio loading failed";

        if (piano) piano.dispose();
        if (pitchShift) pitchShift.dispose();
        if (reverb) reverb.dispose();

    }

    audioLoading = false;
}


// Create black and white piano keys
function createPianoKeys() {

    let whiteNotes = [
        "C", "D", "E", "F", "G", "A", "B"
    ];

    let blackNotes = [
        "C#", "D#", null, "F#", "G#", "A#", null
    ];

    let pianoX = 40;
    let pianoY = 300;

    let keyWidth = 920 / 14;
    let keyHeight = 250;


    // White keys
    for (let octave = 0; octave < 2; octave++) {

        for (let i = 0; i < 7; i++) {

            let index = octave * 7 + i;

            whiteKeys.push({

                note: whiteNotes[i] + (octave + 3),

                x: pianoX + index * keyWidth,
                y: pianoY,

                w: keyWidth,
                h: keyHeight
            });
        }
    }


    // Black keys
    for (let octave = 0; octave < 2; octave++) {

        for (let i = 0; i < 7; i++) {

            if (blackNotes[i] === null) continue;

            let index = octave * 7 + i;

            blackKeys.push({

                note: blackNotes[i] + (octave + 3),

                x: pianoX
                    + (index + 1) * keyWidth
                    - keyWidth * 0.3,

                y: pianoY,

                w: keyWidth * 0.6,
                h: keyHeight * 0.62
            });
        }
    }
}


function draw() {

    background(30, 25, 22);

    drawPianoBody();
    drawControlPad();
    drawDisplay();
    drawPianoKeys();

}


// Piano body
function drawPianoBody() {

    stroke(105, 83, 60);
    strokeWeight(2);

    fill(50, 40, 33);
    rect(20, 20, 960, 560, 15);

    fill(25, 24, 22);
    rect(35, 35, 930, 235, 8);

    noStroke();

    fill(215, 190, 145);
    textAlign(CENTER);

    textSize(30);
    text("N O C T U R N E", 610, 95);

    fill(150, 135, 110);
    textSize(13);

    text("INTERACTIVE PIANO", 610, 120);
}


// XY control pad
function drawControlPad() {

    fill(18, 24, 20);
    stroke(110, 120, 90);

    rect(padX, padY, padSize, padSize, 4);


    // Grid
    stroke(45, 60, 45);

    for (let i = 0; i <= 4; i++) {

        let p = i * padSize / 4;

        line(
            padX + p, padY,
            padX + p, padY + padSize
        );

        line(
            padX, padY + p,
            padX + padSize, padY + p
        );
    }


    // Crosshair
    stroke(110, 125, 90);

    line(ballX, padY, ballX, padY + padSize);
    line(padX, ballY, padX + padSize, ballY);


    // Glowing control ball
    noStroke();

    fill(220, 185, 110, 30);
    ellipse(ballX, ballY, 42);

    fill(220, 185, 110, 70);
    ellipse(ballX, ballY, 30);

    fill(220, 190, 130);
    ellipse(ballX, ballY, ballSize);


    // Labels
    fill(170, 155, 120);
    textSize(11);

    textAlign(LEFT);

    text("LOW PITCH", padX, padY - 10);

    textAlign(RIGHT);

    text(
        "HIGH PITCH",
        padX + padSize,
        padY - 10
    );

    textAlign(LEFT);

    text(
        "MORE REVERB",
        padX + padSize + 10,
        padY + 10
    );

    text(
        "LESS REVERB",
        padX + padSize + 10,
        padY + padSize
    );


    // Map ball position to audio parameters
    pitchValue = round(
        map(ballX, padX, padX + padSize, -12, 12)
    );

    reverbValue = map(
        ballY,
        padY,
        padY + padSize,
        1, 0
    );


    // Change audio parameters
    if (audioReady) {

        pitchShift.pitch = pitchValue;

        reverb.wet.rampTo(reverbValue, 0.1);
    }
}


// Instrument display
function drawDisplay() {

    fill(12, 18, 14);
    stroke(80, 85, 65);

    rect(360, 145, 500, 90, 5);

    noStroke();

    fill(130, 155, 115);
    textAlign(LEFT);
    textSize(12);

    text("CURRENT NOTE", 385, 170);
    text("PITCH SHIFT", 555, 170);
    text("REVERB", 720, 170);

    fill(180, 215, 155);
    textSize(24);

    text(currentNote, 385, 205);

    let sign = pitchValue > 0 ? "+" : "";

    text(sign + pitchValue + " st", 555, 205);

    text(round(reverbValue * 100) + "%", 720, 205);


    fill(150, 135, 110);
    textSize(11);
    textAlign(CENTER);

    text(statusText, 610, 255);
}


// Draw piano keyboard
function drawPianoKeys() {

    // White keys
    for (let k of whiteKeys) {

        stroke(90, 85, 75);

        if (activeNotes.has(k.note)) {
            fill(195, 170, 115);
        } else {
            fill(240, 235, 220);
        }

        rect(k.x, k.y, k.w - 1, k.h, 0, 0, 4, 4);

        noStroke();
        fill(130, 120, 105);

        textAlign(CENTER);
        textSize(12);

        text(
            k.note,
            k.x + k.w / 2,
            k.y + k.h - 15
        );
    }


    // Black keys
    for (let k of blackKeys) {

        stroke(10);

        if (activeNotes.has(k.note)) {
            fill(150, 115, 65);
        } else {
            fill(20);
        }

        rect(k.x, k.y, k.w, k.h, 0, 0, 4, 4);

        noStroke();
        fill(55);

        rect(
            k.x + 4,
            k.y + 3,
            k.w - 8,
            k.h - 15,
            2
        );

        fill(180);
        textSize(10);
        textAlign(CENTER);

        text(
            k.note,
            k.x + k.w / 2,
            k.y + k.h - 22
        );
    }
}


// Detect which piano key is clicked
function getPianoNote() {

    // Check black keys first
    for (let k of blackKeys) {

        if (
            mouseX >= k.x &&
            mouseX <= k.x + k.w &&
            mouseY >= k.y &&
            mouseY <= k.y + k.h
        ) {
            return k.note;
        }
    }


    // Check white keys
    for (let k of whiteKeys) {

        if (
            mouseX >= k.x &&
            mouseX <= k.x + k.w &&
            mouseY >= k.y &&
            mouseY <= k.y + k.h
        ) {
            return k.note;
        }
    }

    return null;
}


// Play a piano note
function playNote(note) {

    if (!audioReady || !note) return;

    if (activeNotes.has(note)) return;

    piano.triggerAttack(note);

    activeNotes.add(note);

    currentNote = note;
}


// Release a piano note
function stopNote(note) {

    if (!audioReady || !note) return;

    piano.triggerRelease(note);

    activeNotes.delete(note);
}


// Mouse pressed
function mousePressed() {

    // Click or drag directly inside the XY pad
    if (
        mouseX >= padX &&
        mouseX <= padX + padSize &&
        mouseY >= padY &&
        mouseY <= padY + padSize
    ) {

        dragging = true;

        moveBall();

        startAudio();

        return;
    }


    // Click the piano
    let note = getPianoNote();

    if (!audioReady) {

        startAudio();
        return;
    }

    if (note) {

        pianoDragging = true;
        mouseNote = note;

        playNote(note);
    }
}


// Drag the ball or slide across piano keys
function mouseDragged() {

    if (dragging) {

        moveBall();

    } else if (pianoDragging) {

        let note = getPianoNote();

        if (note !== mouseNote) {

            if (!Array.from(heldKeys.values()).includes(mouseNote)) {
                stopNote(mouseNote);
            }

            mouseNote = note;

            playNote(mouseNote);
        }
    }
}


// Release mouse
function mouseReleased() {

    dragging = false;
    pianoDragging = false;

    if (!Array.from(heldKeys.values()).includes(mouseNote)) {
        stopNote(mouseNote);
    }

    mouseNote = null;
}


// Update ball position
function moveBall() {

    ballX = constrain(
        mouseX,
        padX,
        padX + padSize
    );

    ballY = constrain(
        mouseY,
        padY,
        padY + padSize
    );
}


// Play with computer keyboard
function keyPressed() {

    let inputKey = key.toLowerCase();

    let note = keyboardMap[inputKey];

    if (!note) return;

    if (!audioReady) {

        startAudio();
        return;
    }

    if (heldKeys.has(inputKey)) return;

    heldKeys.set(inputKey, note);

    playNote(note);

    return false;
}


// Release computer keyboard
function keyReleased() {

    let inputKey = key.toLowerCase();
    let note = heldKeys.get(inputKey);

    if (note) {

        heldKeys.delete(inputKey);

        if (mouseNote !== note) {
            stopNote(note);
        }
    }
}


// Stop notes when leaving the window
window.addEventListener("blur", function() {

    if (audioReady) piano.releaseAll();

    activeNotes.clear();
    heldKeys.clear();

    mouseNote = null;
    dragging = false;
    pianoDragging = false;
});
