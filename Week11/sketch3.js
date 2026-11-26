
let synth, filter, delay, waveform, limiter;

let audioReady = false;
let audioLoading = false;
let playing = false;

// Sound parameters
let frequency = 55;
let cutoff = 1500;
let delaySpeed = 0.4;

// Visual parameters
let rotationAngle = 0;
let rotationSpeed = 0.005;

let energy = 0;
let symbolSize = 150;

let values = [];

let statusText = "CLICK TO BEGIN";


// SETUP

function setup() {

    createCanvas(windowWidth, windowHeight);

    textFont("monospace");

    noFill();
}


// AUDIO SYSTEM

async function startAudio() {

    if (audioReady) return true;
    if (audioLoading) return false;

    audioLoading = true;

    try {

        await Tone.start();


        // Fat oscillator

        synth = new Tone.Synth({

            oscillator: {
                type: "fatsine",
                count: 5,
                spread: 30
            },

            envelope: {
                attack: 0.8,
                decay: 0.5,
                sustain: 0.8,
                release: 1.5
            }

        });

        synth.volume.value = -20;


        // Low-pass filter

        filter = new Tone.Filter({

            frequency: cutoff,
            type: "lowpass",
            rolloff: -24,
            Q: 1

        });


        // Feedback delay

        delay = new Tone.FeedbackDelay({

            delayTime: delaySpeed,
            feedback: 0.45,
            wet: 0.35

        });


        // Waveform analyzer

        waveform = new Tone.Waveform(1024);


        // Audio limiter

        limiter = new Tone.Limiter(-6);


        // Audio routing

        synth.connect(filter);

        filter.connect(delay);

        delay.connect(limiter);

        limiter.toDestination();

        limiter.connect(waveform);


        audioReady = true;

    } catch (error) {

        console.error(error);

        statusText = "AUDIO ERROR";

        let nodes = [
            synth, filter, delay,
            waveform, limiter
        ];

        for (let node of nodes) {
            if (node) node.dispose();
        }

    }

    audioLoading = false;

    return audioReady;
}


// MAIN DRAW FUNCTION

function draw() {

    background(9, 5, 7);

    updateSound();

    analyzeWaveform();

    drawBackground();

    drawSymbols();

    drawCentralFlower();

    drawWaveform();

    drawInterface();
}


// MOUSE CONTROL

function updateSound() {

    // Mouse X controls pitch

    frequency = 55 * pow(

        2,

        map(
            mouseX,
            0, width,
            0, 3,
            true
        )
    );


    // Mouse Y controls delay time

    delaySpeed = map(

        mouseY,
        0, height,
        0.01, 0.9,
        true

    );


    // Mouse X controls filter frequency

    cutoff = map(

        mouseX,
        0, width,
        300, 5000,
        true

    );


    // Rotation speed

    rotationSpeed = map(

        mouseX,
        0, width,
        0.002, 0.035,
        true

    );


    // Symbol size

    symbolSize = map(

        mouseY,
        0, height,
        100, 210,
        true

    );


    rotationAngle += rotationSpeed;


    // Smooth audio transitions

    if (audioReady && playing) {

        synth.frequency.rampTo(
            frequency,
            0.1
        );

        filter.frequency.rampTo(
            cutoff,
            0.1
        );

        delay.delayTime.rampTo(
            delaySpeed,
            0.1
        );
    }
}


// ANALYZE WAVEFORM

function analyzeWaveform() {

    let amplitude = 0;

    if (audioReady) {

        values = waveform.getValue();

        // Calculate RMS amplitude

        for (let i = 0; i < values.length; i++) {

            amplitude += values[i] * values[i];

        }

        amplitude = sqrt(
            amplitude / values.length
        );
    }


    // Smooth visual movement

    energy = lerp(
        energy,
        amplitude,
        0.15
    );
}


// BACKGROUND

function drawBackground() {

    strokeWeight(1);


    // Background grid

    stroke(70, 25, 35, 25);

    for (let x = 0; x < width; x += 60) {

        line(x, 0, x, height);
    }

    for (let y = 0; y < height; y += 60) {

        line(0, y, width, y);
    }


    // Small background particles

    randomSeed(20);

    noStroke();

    for (let i = 0; i < 120; i++) {

        let x = random(width);

        let y = random(height);

        let alpha = random(10, 60);

        fill(150, 40, 65, alpha);

        ellipse(
            x,
            y,
            random(1, 3)
        );
    }


    // Moving particles

    for (let i = 0; i < 30; i++) {

        let x = noise(
            i * 10,
            frameCount * 0.003
        ) * width;

        let y = noise(
            i * 20 + 500,
            frameCount * 0.004
        ) * height;

        fill(
            180,
            65,
            80,
            30 + energy * 500
        );

        ellipse(
            x,
            y,
            2 + energy * 30
        );
    }
}


// CENTRAL SYMBOLS

function drawSymbols() {

    push();

    translate(
        width / 2,
        height * 0.45
    );


    let size = min(

        symbolSize,
        width * 0.23,
        height * 0.23

    );

    size += energy * 180;


    noFill();

    strokeWeight(1.2);


    // Outer circles

    for (let i = 0; i < 4; i++) {

        stroke(

            160 + energy * 200,
            35,
            50,
            100 + i * 25

        );

        ellipse(

            0,
            0,
            size * 2 + i * 24

        );
    }


    // Rotating triangle

    push();

    rotate(rotationAngle);

    stroke(190, 55, 65, 200);

    drawPolygon(
        0, 0,
        size,
        3
    );

    pop();


    // Reverse rotating triangle

    push();

    rotate(
        -rotationAngle + PI
    );

    stroke(130, 35, 45, 150);

    drawPolygon(

        0, 0,
        size * 0.9,
        3

    );

    pop();


    // Rotating square

    push();

    rotate(rotationAngle * 0.5);

    stroke(150, 40, 55, 100);

    drawPolygon(

        0, 0,
        size * 0.75,
        4

    );

    pop();


    // Surrounding mysterious symbols

    for (let i = 0; i < 12; i++) {

        push();

        let angle = TWO_PI / 12 * i;

        rotate(
            angle + rotationAngle * 0.2
        );

        translate(
            0,
            -size - 48
        );

        drawRune(i);

        pop();
    }


    // Circular sound waveform

    drawCircularWaveform(
        size + 20
    );

    pop();


    // Small corner symbols

    drawSmallSymbol(

        width * 0.16,
        height * 0.22,
        30

    );

    drawSmallSymbol(

        width * 0.84,
        height * 0.22,
        30

    );

    drawSmallSymbol(

        width * 0.16,
        height * 0.68,
        30

    );

    drawSmallSymbol(

        width * 0.84,
        height * 0.68,
        30

    );
}


// POLYGON FUNCTION

function drawPolygon(x, y, radius, sides) {

    beginShape();

    for (let i = 0; i < sides; i++) {

        let angle =

            TWO_PI / sides * i
            - HALF_PI;


        let px =

            x + cos(angle) * radius;


        let py =

            y + sin(angle) * radius;


        vertex(px, py);
    }

    endShape(CLOSE);
}


// MYSTERIOUS SYMBOLS

function drawRune(index) {

    stroke(170, 55, 65, 170);

    strokeWeight(1);

    noFill();


    if (index % 4 === 0) {

        line(0, -10, 0, 10);

        line(-6, -4, 6, -4);

        line(-4, 4, 4, 4);

    } else if (index % 4 === 1) {

        triangle(
            0, -9,
            -6, 6,
            6, 6
        );

        line(0, 6, 0, 12);

    } else if (index % 4 === 2) {

        ellipse(0, 0, 10);

        line(0, -12, 0, 12);

    } else {

        line(-6, -8, 6, 8);

        line(6, -8, -6, 8);

        line(0, -12, 0, 12);
    }
}


// SMALL SURROUNDING SYMBOLS

function drawSmallSymbol(x, y, size) {

    push();

    translate(x, y);

    rotate(
        -rotationAngle * 0.5
    );

    noFill();

    stroke(130, 35, 50, 120);

    strokeWeight(1);

    ellipse(0, 0, size * 2);

    drawPolygon(
        0, 0,
        size,
        3
    );

    line(
        -size - 8,
        0,
        size + 8,
        0
    );

    line(
        0,
        -size - 8,
        0,
        size + 8
    );

    ellipse(

        0, 0,

        6 + energy * 60

    );

    pop();
}


// CENTRAL FLOWER

function drawCentralFlower() {

    push();

    translate(
        width / 2,
        height * 0.45
    );


    // Mouse Y controls flower size

    let flowerSize = map(

        mouseY,
        0, height,
        40, 100,
        true

    );


    // Sound amplitude changes flower size

    flowerSize += energy * 200;

    flowerSize = min(
        flowerSize,
        width * 0.12,
        height * 0.14
    );


    let petalLength =

        flowerSize * 1.4;


    let petalWidth =

        flowerSize * 0.65;


    // OUTER PETALS

    for (let i = 0; i < 8; i++) {

        push();

        let angle =

            TWO_PI / 8 * i
            + rotationAngle * 0.4;


        rotate(angle);


        // Waveform changes each petal

        let deformation = 0;

        if (values.length > 0) {

            let index = floor(

                i / 8 * values.length

            );

            deformation =

                values[index] * 120;
        }


        let length = max(

            10,

            petalLength + deformation

        );


        stroke(210, 70, 90, 180);

        strokeWeight(1.5);

        fill(120, 20, 35, 35);


        beginShape();

        vertex(0, 0);


        bezierVertex(

            petalWidth * 0.5,
            -length * 0.25,

            petalWidth * 0.5,
            -length * 0.75,

            0,
            -length

        );


        bezierVertex(

            -petalWidth * 0.5,
            -length * 0.75,

            -petalWidth * 0.5,
            -length * 0.25,

            0,
            0

        );


        endShape(CLOSE);

        pop();
    }


    // INNER PETALS

    for (let i = 0; i < 6; i++) {

        push();

        let angle =

            TWO_PI / 6 * i
            - rotationAngle * 0.6;


        rotate(angle);

        stroke(255, 120, 140, 160);

        strokeWeight(1.2);

        fill(160, 35, 55, 35);


        beginShape();

        vertex(0, 0);


        bezierVertex(

            petalWidth * 0.35,
            -petalLength * 0.18,

            petalWidth * 0.35,
            -petalLength * 0.5,

            0,
            -petalLength * 0.68

        );


        bezierVertex(

            -petalWidth * 0.35,
            -petalLength * 0.5,

            -petalWidth * 0.35,
            -petalLength * 0.18,

            0,
            0

        );


        endShape(CLOSE);

        pop();
    }


    // FLOWER CENTER

    noStroke();

    fill(230, 170, 90, 150);

    ellipse(

        0, 0,

        flowerSize * 0.55
        + energy * 50

    );


    fill(255, 210, 130, 180);

    ellipse(

        0, 0,

        flowerSize * 0.25
        + energy * 25

    );


    // Small rotating center dots

    stroke(255, 220, 140, 160);

    strokeWeight(2);


    for (let i = 0; i < 12; i++) {

        let a =

            TWO_PI / 12 * i
            + frameCount * 0.01;


        let r =

            flowerSize * 0.2
            + energy * 30;


        point(

            cos(a) * r,

            sin(a) * r

        );
    }

    pop();
}


// CIRCULAR WAVEFORM

function drawCircularWaveform(radius) {

    if (values.length === 0) return;


    noFill();

    stroke(210, 75, 95, 180);

    strokeWeight(1.2);


    beginShape();


    for (let i = 0; i < values.length; i += 4) {

        let angle = map(

            i,
            0, values.length,
            0, TWO_PI

        );


        let r = radius

            + values[i] * 160;


        let x = cos(angle) * r;

        let y = sin(angle) * r;


        vertex(x, y);
    }


    endShape(CLOSE);
}


// HORIZONTAL WAVEFORM

function drawWaveform() {

    let centerY = height * 0.88;

    let waveHeight = height * 0.18;


    // Center line

    stroke(100, 35, 50, 100);

    strokeWeight(1);

    line(

        0, centerY,

        width, centerY

    );


    if (values.length === 0) return;


    noFill();

    stroke(230, 100, 120, 220);

    strokeWeight(1.5);


    beginShape();


    for (let i = 0; i < values.length; i++) {

        let x = map(

            i,

            0, values.length - 1,

            0, width

        );


        let y =

            centerY

            + values[i] * waveHeight;


        vertex(x, y);
    }


    endShape();
}


// INTERFACE

function drawInterface() {

    noStroke();

    textAlign(LEFT, TOP);


    // Title

    fill(215, 135, 150);

    textSize(25);

    text(
        "DARK BLOOM",
        30, 25
    );


    fill(145, 90, 105);

    textSize(12);

    text(

        "Audio Reactive Symbols / Sketch 03",

        30, 60

    );


    // System status

    textAlign(RIGHT, TOP);

    fill(180, 90, 105);

    textSize(12);

    text(

        statusText,

        width - 30,

        30

    );


    // Audio parameters

    textAlign(LEFT, CENTER);

    fill(180, 110, 125);

    textSize(13);

    text(

        "FREQUENCY: "
        + frequency.toFixed(1)
        + " Hz",

        30,
        height - 25

    );


    textAlign(CENTER, CENTER);

    text(

        "DELAY: "
        + delaySpeed.toFixed(2)
        + " s",

        width / 2,

        height - 25

    );


    textAlign(RIGHT, CENTER);

    text(

        "FILTER: "
        + floor(cutoff)
        + " Hz",

        width - 30,

        height - 25

    );


    // Instruction

    textAlign(CENTER, CENTER);

    fill(150, 75, 95);

    textSize(12);

    if (!playing) {

        text(

            "CLICK TO ACTIVATE THE SOUND",

            width / 2,

            height * 0.76

        );

    } else {

        text(

            "MOVE YOUR MOUSE TO TRANSFORM THE SOUND",

            width / 2,

            height * 0.76

        );
    }
}


// START OR STOP SOUND

async function mousePressed() {

    if (audioLoading) return;


    if (!audioReady) {

        let ready = await startAudio();

        if (!ready) return;
    }


    playing = !playing;


    if (playing) {

        synth.triggerAttack(frequency);

        statusText = "SIGNAL ACTIVE";

    } else {

        synth.triggerRelease();

        statusText = "SIGNAL INACTIVE";
    }
}


// RESIZE CANVAS

function windowResized() {

    resizeCanvas(
        windowWidth,
        windowHeight
    );
}


// STOP SOUND WHEN LEAVING WINDOW

window.addEventListener("blur", function() {

    if (audioReady && playing) {

        synth.triggerRelease();

        playing = false;

        statusText = "SIGNAL INACTIVE";
    }
});
