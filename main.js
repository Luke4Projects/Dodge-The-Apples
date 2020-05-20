var canvas = document.getElementById("canv");
var c = canvas.getContext("2d");

window.onload = function () {
    this.start();
    this.setInterval(update, 10);
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 30;
        this.h = 60;

        this.ySpeed = 3;
        this.gravity = 0.1;
        this.canJump = false;

        this.xSpeed = 0;
    }
    show() {
        c.fillStyle = 'orange';
        c.fillRect(this.x, this.y, this.w, this.h);
        //left eye
        c.fillStyle = 'black'
        c.fillRect(this.x + 5, this.y + 7, 5, 10)
        //right eye
        c.fillRect(this.x + this.w - 10, this.y + 7, 5, 10);
        //mouth
        c.fillRect(this.x + 5, this.y + 35, this.w - 10, 5);
        c.fillRect(this.x, this.y + 30, 5, 5);
        c.fillRect(this.x + this.w - 5, this.y + 30, 5, 5);
    }
    update() {

        this.x += this.xSpeed;

        this.y += this.ySpeed;
        this.ySpeed += this.gravity;

        if (this.y + this.h >= 770) {
            this.canJump = true;
            this.ySpeed = 0;
        } else {
            this.canJump = false;
        }
    }
}

class Apple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = 15;

        this.type = (Math.floor(Math.random() * 10) === 1) ? "green" : "red";

        this.ySpeed = 3;
        this.gravity = 0.1;

        this.touched = false;

        this.visible = true;

        this.pickXspeed = Math.floor(Math.random() * 15);

        this.xSpeed;

        if (this.pickXspeed === 0) {
            if (p.x > this.x) {
                this.xSpeed = 5;
            }
            if (p.x < this.x) {
                this.xSpeed = -5;
            }
        } else {
            this.xSpeed = 0;
        }
    }
    show() {
        if (this.visible) {
            //stem of apple
            c.fillStyle = 'green';
            c.fillRect(this.x - 2.5, this.y - 30, 5, 20);
            //apple
            c.fillStyle = (this.type === "red") ? "red" : "green";
            c.beginPath();
            c.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
            c.fill();
        }
    }
    update() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        this.ySpeed += this.gravity;
        //collision detection
        if (this.x + this.r / 2 > p.x && this.x - this.r / 2 < p.x + p.w && this.y + this.r / 2 > p.y && this.y - this.r / 2 < p.y + p.h) {
            if (this.type === "red") {
                atDeathMenu = true;
            }
            if (this.type === "green" && !this.touched) {
                score += 5;
                document.getElementById("score").innerHTML = "Score: " + score;
                this.visible = false;
                this.touched = true;
            }
        }
    }
}

var p;

var apples = [];

//time is in milliseconds
var timeBetweenAppleSpawn = 1500;

var score = 0;

var atMainMenu = true;
var atDeathMenu = false;

function start() {
    p = new Player(380, 500);
}

function update() {
    if (atMainMenu) {
        //hide elements
        document.getElementById("score").style.display = "none";
        //show elements
        //main menu background
        c.fillStyle = 'slategray';
        c.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    } else if (atDeathMenu) {
        //hide elements
        document.getElementById("score").style.display = "none";
        //show elements
        document.getElementById("deathText").style.display = "block";
        document.getElementById("backToMenuButton").style.display = "block";
        //death menu background
        c.fillStyle = 'slategray';
        c.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    } else {
        //hide elements
        //show elements
        document.getElementById("score").style.display = "block";
        //background
        c.fillStyle = 'lightblue';
        c.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        //ground
        c.fillStyle = 'green';
        c.fillRect(0, 770, 800, 50);
        //player
        p.show();
        p.update();
        //apples
        for (let i = 0; i < apples.length; i++) {
            apples[i].show();
            apples[i].update();
        }
    }
}

function keyDown(e) {
    switch (e.keyCode) {
        case 39:
            p.xSpeed = 5;
            break;
        case 37:
            p.xSpeed = -5;
            break;
    }
    if (e.keyCode === 38 && p.canJump) {
        p.ySpeed = -3;
    }
}

function keyUp(e) {
    switch (e.keyCode) {
        case 39:
            p.xSpeed = 0;
            break;
        case 37:
            p.xSpeed = 0;
            break;
    }
}

document.onkeydown = keyDown;
document.onkeyup = keyUp;

function spawnApple() {
    var apple = new Apple(Math.floor(Math.random() * 800), -100);
    apples.push(apple);
    setTimeout(spawnApple, timeBetweenAppleSpawn);
}

//dtb = decrease time between
function dtbAppleSpawn() {
    if (timeBetweenAppleSpawn >= 200) {
        timeBetweenAppleSpawn -= 100;
    }
}

function play() {
    atMainMenu = false;
    document.getElementById("playButton").style.display = "none";
    document.getElementById("backButton").style.display = "none";
    document.getElementById("mainText").style.display = "none";
    document.getElementById("score").style.disply = "block";
    //NICE
    spawnApple();
    setInterval(dtbAppleSpawn, 1000);

    //add to score;
    setInterval(function () {
        score += 1;
        document.getElementById("score").innerHTML = "Score: " + score;
    }, 1000);
}

function refresh() {
    location.reload();
}