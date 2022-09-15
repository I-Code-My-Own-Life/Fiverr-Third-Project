let canvas = document.getElementById("canvas2");
let c = canvas.getContext('2d');
canvas.height = innerHeight;
canvas.width = innerWidth;
let background = new Image();
background.src = "bg6.jpg";
let playeridle = new Image();
playeridle.src = "playeridle.png"
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
        if(this.y + this.height < 150 ){
            keys.arrowUp.pressed = false
            this.dy = 0;
        }
        if (this.y + this.height > innerHeight - 160) {
            // location.href = "gamover.html"
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
    requestAnimationFrame(animate);
}

animate();