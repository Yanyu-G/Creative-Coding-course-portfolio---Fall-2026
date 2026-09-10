let y = 0;
function setup(){
    createCanvas(windowWidth,windowHeight)
}
function draw(){
    background(200);
    rect(0,y,50,50);
    y++;
    print(y)
}