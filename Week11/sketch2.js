
let piano, pitchShift, reverb;

let audioReady = false;
let audioLoading = false;
let statusText = "Click to activate";

// XY Control Pad
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


// Computer keyboard mapping
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
    "a": "C3",
    "s": "D3",
    "d": "E3",
    "f": "F3",
    "g": "G3",
    "h": "A3",
    "k": "B3",
    "l": "C4"
};


function setup() {

    createCanvas(1000, 600);

    textFont("Georgia");

    createPianoKeys();
}


// AUDIO SYSTEM

async function startAudio() {

    if (audioReady) return true;
    if (audioLoading) return false;

    audioLoading = true;
    statusText = "Loading piano...";

    try {

        await Tone.start();

        // Pitch shift effect
        pitchShift = new Tone.PitchShift({
            pitch: pitchValue,
            wet: 1
        });

        // Reverb effect
        reverb = new Tone.Reverb({
            decay: 4,
            wet: reverbValue
        }).toDestination();


        // Real piano samples
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

    return audioReady;
}


// GET KEYBOARD LABEL

function getKeyLabel(note) {

    for (let letter in keyboardMap) {

        if (keyboardMap[letter] === note) {

            return letter.toUpperCase();
        }
    }

    return "";
}


// CREATE PIANO KEYS

function createPianoKeys() {

    whiteKeys = [];
    blackKeys = [];

    let whiteNotes = [
        "C", "D", "E", "F", "G", "A", "B"
    ];

    let blackNotes = [
        "C#", "D#", null,
        "F#", "G#", "A#", null
    ];

    let pianoX = 40;
    let pianoY = 300;

    let keyWidth = 920 / 14;
    let keyHeight = 250;


    // Create white keys
    for (let octave = 0; octave < 2; octave++) {

        for (let i = 0; i < 7; i++) {

            let index = octave * 7 + i;

            let note = whiteNotes[i] + (octave + 3);

            whiteKeys.push({

                note: note,

                label: getKeyLabel(note),

                x: pianoX + index * keyWidth,

                y: pianoY,

                w: keyWidth,

                h: keyHeight

            });
        }
    }


    // Create black keys
    for (let octave = 0; octave < 2; octave++) {

        for (let i = 0; i < 7; i++) {

            if (blackNotes[i] === null) continue;

            let index = octave * 7 + i;

            let note = blackNotes[i] + (octave + 3);

            blackKeys.push({

                note: note,

                label: getKeyLabel(note),

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


// MAIN DRAW FUNCTION

function draw() {

    background(30, 25, 22);

    drawPianoBody();

    drawControlPad();

    drawDisplay();

    drawPianoKeys();

}


// PIANO BODY

function drawPianoBody() {

    stroke(105, 83, 60);
    strokeWeight(2);

    fill(50, 40, 33);

    rect(20, 20, 960, 560, 15);


    // Upper control panel
    fill(25, 24, 22);

    rect(35, 35, 930, 235, 8);


    // Title
    noStroke();

    fill(215, 190, 145);

    textAlign(CENTER);
    textSize(30);

    text("N O C T U R N E", 610, 95);


    fill(150, 135, 110);

    textSize(13);

    text("INTERACTIVE PIANO", 610, 120);

}


// XY CONTROL PAD

function drawControlPad() {

    fill(18, 24, 20);

    stroke(110, 120, 90);

    rect(padX, padY, padSize, padSize, 4);


    // Grid lines
    stroke(45, 60, 45);

    for (let i = 0; i <= 4; i++) {

        let p = i * padSize / 4;

        line(
            padX + p,
            padY,
            padX + p,
            padY + padSize
        );

        line(
            padX,
            padY + p,
            padX + padSize,
            padY + p
        );
    }


    // Crosshair
    stroke(110, 125, 90);

    line(
        ballX,
        padY,
        ballX,
        padY + padSize
    );

    line(
        padX,
        ballY,
        padX + padSize,
        ballY
    );


    // Glowing ball
    noStroke();

    fill(220, 185, 110, 30);
    ellipse(ballX, ballY, 42);

    fill(220, 185, 110, 70);
    ellipse(ballX, ballY, 30);

    fill(220, 190, 130);
    ellipse(ballX, ballY, ballSize);


    // Axis labels
    fill(170, 155, 120);

    textSize(11);

    textAlign(LEFT);

    text(
        "LOW PITCH",
        padX,
        padY - 10
    );

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

}


// UPDATE SOUND PARAMETERS

function updateSound() {

    // X controls pitch
    pitchValue = round(
        map(
            ballX,
            padX,
            padX + padSize,
            -12,
            12,
            true
        )
    );


    // Y controls reverb
    reverbValue = map(
        ballY,
        padY,
        padY + padSize,
        1,
        0,
        true
    );


    if (audioReady) {

        pitchShift.pitch = pitchValue;

        // Smooth transition
        reverb.wet.rampTo(
            reverbValue,
            0.1
        );

    }
}


// DIGITAL DISPLAY

function drawDisplay() {

    fill(12, 18, 14);
    stroke(80, 85, 65);

    rect(360, 145, 500, 90, 5);


    // Display labels
    noStroke();

    fill(130, 155, 115);

    textAlign(LEFT);
    textSize(12);

    text("CURRENT NOTE", 385, 170);

    text("PITCH SHIFT", 555, 170);

    text("REVERB", 720, 170);


    // Display values
    fill(180, 215, 155);

    textSize(24);

    text(currentNote, 385, 205);

    let sign = pitchValue > 0 ? "+" : "";

    text(
        sign + pitchValue + " st",
        555,
        205
    );

    text(
        round(reverbValue * 100) + "%",
        720,
        205
    );


    // System status
    fill(150, 135, 110);

    textSize(11);
    textAlign(CENTER);

    text(statusText, 610, 255);

}


// DRAW PIANO KEYS

function drawPianoKeys() {

    // WHITE KEYS
    for (let k of whiteKeys) {

        stroke(90, 85, 75);

        strokeWeight(1);


        // Highlight when pressed
        if (activeNotes.has(k.note)) {

            fill(195, 170, 115);

        } else {

            fill(240, 235, 220);

        }

        rect(
            k.x,
            k.y,
            k.w - 1,
            k.h,
            0, 0, 4, 4
        );


        // Display keyboard letter
        noStroke();

        fill(85, 75, 60);

        textAlign(CENTER);

        textSize(22);

        text(
            k.label,
            k.x + k.w / 2,
            k.y + k.h - 35
        );


        // Display note name
        fill(150, 140, 125);

        textSize(11);

        text(
            k.note,
            k.x + k.w / 2,
            k.y + k.h - 13
        );
    }


    // BLACK KEYS
    for (let k of blackKeys) {

        stroke(10);

        if (activeNotes.has(k.note)) {

            fill(150, 115, 65);

        } else {

            fill(20);

        }

        rect(
            k.x,
            k.y,
            k.w,
            k.h,
            0, 0, 4, 4
        );


        // Black key surface
        noStroke();

        if (activeNotes.has(k.note)) {

            fill(175, 145, 90);

        } else {

            fill(55);

        }

        rect(
            k.x + 4,
            k.y + 3,
            k.w - 8,
            k.h - 15,
            2
        );


        // Display keyboard letter
        fill(230);

        textAlign(CENTER);
        textSize(16);

        text(
            k.label,
            k.x + k.w / 2,
            k.y + k.h - 38
        );


        // Display note name
        fill(160);

        textSize(10);

        text(
            k.note,
            k.x + k.w / 2,
            k.y + k.h - 23
        );
    }
}


// DETECT PIANO KEY

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


// PLAY NOTE

function playNote(note) {

    if (!audioReady || !note) return;

    if (activeNotes.has(note)) return;

    piano.triggerAttack(note);

    activeNotes.add(note);

    currentNote = note;

}


// STOP NOTE

function stopNote(note) {

    if (!audioReady || !note) return;

    if (!activeNotes.has(note)) return;

    piano.triggerRelease(note);

    activeNotes.delete(note);

    if (activeNotes.size === 0) {

        currentNote = "--";

    } else {

        currentNote = Array.from(activeNotes).join(" ");

    }
}


// MOUSE PRESSED

async function mousePressed() {

    // Directly click or drag the control ball
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


    // Click piano keys
    let note = getPianoNote();

    if (note) {

        pianoDragging = true;
        mouseNote = note;

        if (!audioReady) {

            await startAudio();

        }

        if (
            audioReady &&
            pianoDragging &&
            mouseNote
        ) {

            playNote(mouseNote);

        }

    } else if (!audioReady) {

        startAudio();

    }
}


// MOUSE DRAGGED

function mouseDragged() {

    // Move control ball
    if (dragging) {

        moveBall();

    } else if (pianoDragging) {

        // Slide across piano keys
        let note = getPianoNote();

        if (note !== mouseNote) {

            if (
                !Array.from(
                    heldKeys.values()
                ).includes(mouseNote)
            ) {

                stopNote(mouseNote);

            }

            mouseNote = note;

            playNote(mouseNote);

        }
    }
}


// MOUSE RELEASED

function mouseReleased() {

    dragging = false;

    pianoDragging = false;

    if (
        !Array.from(
            heldKeys.values()
        ).includes(mouseNote)
    ) {

        stopNote(mouseNote);

    }

    mouseNote = null;

}


// MOVE CONTROL BALL

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

    updateSound();

}


// COMPUTER KEYBOARD PRESSED

async function keyPressed(event) {

    let inputKey = key.toLowerCase();

    let note = keyboardMap[inputKey];

    if (!note) return;

    if (event && event.repeat) return false;

    if (heldKeys.has(inputKey)) return false;

    heldKeys.set(inputKey, note);


    if (!audioReady) {

        await startAudio();

    }


    // Check if the key is still held
    if (
        audioReady &&
        heldKeys.has(inputKey)
    ) {

        playNote(note);

    }

    return false;
}


// COMPUTER KEYBOARD RELEASED

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


// STOP AUDIO WHEN WINDOW LOSES FOCUS

window.addEventListener("blur", function() {

    if (audioReady) {

        piano.releaseAll();

    }

    activeNotes.clear();

    heldKeys.clear();

    mouseNote = null;

    dragging = false;

    pianoDragging = false;

    currentNote = "--";

});
