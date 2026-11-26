
let mic;
let pitch;
let filter;
let delay;
let waveform;
let output;

let startButton;
let started = false;

let cutoff = 1500;
let delaySpeed = 0.8;

function setup() {
    createCanvas(windowWidth, windowHeight);

    textAlign(CENTER, CENTER);

    startButton = createButton("START LISTENING");

    startButton.position(width / 2 - 85, height * 0.75);
    startButton.size(170, 40);

    startButton.style("background", "#101a15");
    startButton.style("color", "#9dbda7");
    startButton.style("border", "1px solid #536c5b");

    startButton.mousePressed(startAudio);
}


async function startAudio() {

    startButton.attribute("disabled", "");

    try {
        // Activate the audio context
        await Tone.start();

        // Microphone input
        mic = new Tone.UserMedia();

        // Change the pitch of the voice
        pitch = new Tone.PitchShift(-6);

        // Remove higher frequencies
        filter = new Tone.Filter(1500, "lowpass");

        // Create an echo effect
        delay = new Tone.FeedbackDelay({
            delayTime: 0.8,
            feedback: 0.45,
            wet: 1
        });

        // Collect waveform data
        waveform = new Tone.Waveform(1024);

        // Reduce output volume
        output = new Tone.Volume(-18);

        // Connect the audio modules
        mic.connect(pitch);
        pitch.connect(filter);
        filter.connect(delay);

        delay.connect(waveform);
        delay.connect(output);

        output.toDestination();

        // Open the microphone
        await mic.open();

        started = true;

        startButton.html("STOP LISTENING");
        startButton.mousePressed(stopAudio);

    } catch (error) {
        console.error(error);
        disposeAudio();
        startButton.html("TRY AGAIN");
    }

    startButton.removeAttribute("disabled");
}


function draw() {

    background(8, 12, 10);

    // Draw the title
    noStroke();
    fill(180, 210, 190);

    textSize(32);
    text("CAN YOU HEAR ME?", width / 2, height * 0.15);

    textSize(14);
    fill(110, 150, 125);
    text("Something is listening.", width / 2, height * 0.21);


    // Draw a background grid
    stroke(30, 55, 40);
    strokeWeight(1);

    for (let x = 0; x < width; x += 40) {
        line(x, height * 0.3, x, height * 0.65);
    }

    for (let y = height * 0.3; y < height * 0.65; y += 40) {
        line(0, y, width, y);
    }


    if (started) {

        // Mouse X controls the filter frequency
        cutoff = map(mouseX, 0, width, 200, 5000, true);

        // Mouse Y controls the delay time
        delaySpeed = map(mouseY, 0, height, 0.1, 1, true);

        // Smoothly change audio parameters
        filter.frequency.rampTo(cutoff, 0.1);

        delay.delayTime.rampTo(delaySpeed, 0.1);


        // Get waveform data
        let values = waveform.getValue();

        noFill();
        stroke(100, 210, 150);
        strokeWeight(2);

        beginShape();

        for (let i = 0; i < values.length; i++) {

            let x = map(i, 0, values.length - 1, 0, width);

            let y = height * 0.475
                + values[i] * height * 0.17;

            vertex(x, y);
        }

        endShape();


    } else {

        // Draw an inactive waveform
        stroke(80, 130, 100);

        line(
            0, height * 0.475,
            width, height * 0.475
        );
    }


    // Display audio parameters
    noStroke();
    fill(130, 170, 145);
    textSize(14);

    text(
        "FILTER: " + floor(cutoff) + " Hz",
        width * 0.2,
        height * 0.9
    );

    text(
        "PITCH: -6",
        width * 0.5,
        height * 0.9
    );

    text(
        "DELAY: " + delaySpeed.toFixed(2) + "s",
        width * 0.8,
        height * 0.9
    );
}


function stopAudio() {

    started = false;

    disposeAudio();

    startButton.html("START LISTENING");
    startButton.mousePressed(startAudio);
}


function disposeAudio() {

    if (mic) mic.close();

    let nodes = [
        mic, pitch, filter,
        delay, waveform, output
    ];

    for (let node of nodes) {
        if (node) node.dispose();
    }

    mic = pitch = filter = delay = waveform = output = null;
}


function windowResized() {

    resizeCanvas(windowWidth, windowHeight);

    startButton.position(
        width / 2 - 85,
        height * 0.75
    );
}
