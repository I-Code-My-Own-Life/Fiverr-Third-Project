let canvas = document.getElementById("canvas2");
let c = canvas.getContext('2d');
canvas.height = innerHeight;
canvas.width = innerWidth;
let background = new Image();
background.src = "bg6.jpg";
let playeridle = new Image();
playeridle.src = "playeridle.png"
let playerjump = new Image();
playerjump.src = "playerjump.png"
let playerrun = new Image();
playerrun.src = "playerrun.png"
let gameFrame = 0;
let frameX = 0;
let frameY = 0;
let staggerFrames = 6;
let framesforplayer = 2;
const playeridlewidth = 1024;
const playeridleheight = 1024;

class Player {
    constructor(img, x, y, width, height, dx, dy) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dx = dx;
        this.dy = dy;
    }
    draw() {
        c.drawImage(this.img, frameX * playeridlewidth, frameY * playeridleheight, playeridlewidth, playeridleheight, this.x, this.y, this.width, this.height);
    }
    update() {
        this.draw()
        this.y += this.dy;
        this.x += this.dx;

        if (this.y + this.height < 150) {
            keys.arrowUp.pressed = false
            this.dy = 0;
        }
        if (this.y + this.height > innerHeight - 160){
            this.dy = 0;
        }
        if (this.y + this.width <= 0) {
            this.dy = 0;
        }
    }
}
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

let keys = {
    arrowLeft: {
        pressed: false
    },
    arrowRight: {
        pressed: false
    },
    arrowDown: {
        pressed: false
    },
    arrowUp: {
        pressed: false
    }
}
// Resize event listener : 
addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});
let player = new Player(playeridle, 20, 10, 120, 120, 0, 20);
function animate() {
    c.drawImage(background, 0, 0,innerWidth,innerHeight);
    if (gameFrame % staggerFrames == 0) {
        if (frameX < framesforplayer) {
            frameX++;
        }
        else {
            frameX = 0;
        }
    }
    gameFrame++;
    player.update();
    if (keys.arrowRight.pressed) {
        player.img = playerrun;
        player.x += 4;
    }
    if (keys.arrowLeft.pressed) {
        player.img = playeridle;
        player.x -= 4;
    }
    if (keys.arrowUp.pressed) {
        player.dy = -20;
        framesforplayer = 1;
        staggerFrames = 12
        player.img = playerjump;
        setTimeout(() => {
            framesforplayer = 2;
            staggerFrames = 8
            player.img = playeridle
        }, 800)
    }
    requestAnimationFrame(animate);
}
animate();
addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            staggerFrames = 20;
            framesforplayer = 9;
            keys.arrowUp.pressed = true;
            player.img = playerjump
            break;
        case "ArrowRight":
            staggerFrames = 4;
            framesforplayer = 21
            keys.arrowRight.pressed = true;
            break;
        case "ArrowLeft":
            keys.arrowLeft.pressed = true;
            break;
    }
})

addEventListener("keyup", (e) => {
    switch (e.key) {
        case "ArrowUp":
            staggerFrames = 6;
            framesforplayer = 2
            keys.arrowUp.pressed = false;
            player.img = playeridle
            player.dy = 15;
            break;
        case "ArrowLeft":
            staggerFrames = 6;
            framesforplayer = 2;
            keys.arrowLeft.pressed = false;
            player.img = playeridle;
            break;
        case "ArrowRight":
            staggerFrames = 6;
            framesforplayer = 2
            keys.arrowRight.pressed = false;
            player.img = playeridle
            break;
    }
})