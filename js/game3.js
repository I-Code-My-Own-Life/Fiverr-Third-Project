let canvas = document.getElementById("canvas2");
let c = canvas.getContext('2d');
canvas.height = innerHeight;
canvas.width = innerWidth;
let bg = document.getElementById('bg4');
let jump = document.getElementById("jump")
let hit = document.getElementById("hit");
let shoot = document.getElementById("shoot");
let gameover = document.getElementById('gameover')
let push = false;
let arrows = [];
let targets = [];
let particles = [];
let colors = ["red", "blue", "gray", "green", "purple", "black", "pink", "yelllow"]
let background = new Image();
background.src = "/Sprites/bg6.jpg";
let playeridle = new Image();
playeridle.src = "/Sprites/playeridle.png"
let playerjump = new Image();
playerjump.src = "/Sprites/playerjump.png"
let playerrun = new Image();
playerrun.src = "/Sprites/playerrun.png";
let playershoot = new Image();
playershoot.src = "/Sprites/playershoot.png";
let arrowimg = new Image();
arrowimg.src = "/Sprites/arrow.png";
let targetCount = 3;
let particleCount = 45;
let gameFrame = 0;
let frameX = 0;
let frameY = 0;
let staggerFrames = 6;
let framesforplayer = 2;
const playeridlewidth = 1024;
const playeridleheight = 1024;
let sp = false;
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
class Particle {
    constructor(x, y, radius, dx, dy, color) {
        this.x = x;
        this.y = y;
        this.radius = radius
        this.dx = dx;
        this.dy = dy;
        this.color = color
    }
    makeParticle() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill()
        c.stroke()
        c.closePath();
    }
    spawnParticles() {
        this.makeParticle();
        this.x += this.dx;
        this.x -= this.dy;
        this.y -= this.dy;
        this.x += this.dy;
        if (this.radius > 0) {
            this.radius -= 0.05
        }
        if (this.radius <= 0 || this.radius < 1 || this.x > innerWidth || this.y > innerHeight) {
            particles.splice(particles.indexOf(this), 1)
        }
    }
}
let particle;
class Arrow {
    constructor(img,x,y, dx, dy, width, height, dir, angle) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.width = width;
        this.height = height;
        this.dir = dir;
        this.angle = angle;
    }
    throw() {
        // c.save()
        // c.translate(this.x,this.y);
        // c.rotate(this.angle);
        // c.drawImage(this.img,this.x,this.y,this.width,this.height);
        // this.x += this.dx;
        // this.y += this.dy;
        // c.restore();
        c.drawImage(this.img, this.x, this.y, this.width, this.height);
        this.x += this.dx;
    }
}
class Target {
    constructor(x, y, radius, dx, dy,color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.color = color
    }
    spawn() {
        c.beginPath()
        c.arc(this.x, this.y,this.radius,0,Math.PI * 2,false);
        // c.arc(this.x + 100, this.y,this.radius,0,Math.PI * 2,false);
        c.fillRect(this.x + 10,this.y,this.width,this.height)
        c.fillStyle = this.color;
        c.fill()
        c.stroke()
        c.closePath();
    }
    move() {
        this.spawn()
        this.y += this.dy;
    }
}
class Rect {
    constructor(x, y,width,height,dx, dy){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dx = dx;
        this.dy = dy;
    }
    spawn() {
        c.beginPath()
        // c.arc(this.x, this.y,this.radius,0,Math.PI * 2,false);
        // c.arc(this.x + 100, this.y,this.radius,0,Math.PI * 2,false);
        c.fillRect(this.x,this.y,this.width,this.height)
        // c.closePath();
        c.stroke()
    }
    move() {
        this.spawn()
        this.y += this.dy;
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
    // arrow.x += arrow.dx;
    bg.play()
    bg.loop = true;
    c.drawImage(background, 0, 0,innerWidth,innerHeight);
    // console.log(arrows);
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
    for (let i = 0; i < arrows.length; i++) {
        arrows[i].throw()
        if(arrows[i].x > innerWidth){
            arrows.splice(i,1)
        }
        for (let j = 0; j < targets.length; j++) {
            if (arrows[i] != undefined && targets[j] != undefined) {
                // console.log(targets[j].x)
                if (arrows[i].x + arrows[i].width >= targets[j].x &&
                    arrows[i].x <= targets[j].x + targets[j].width &&
                    arrows[i].y + arrows[i].height >= targets[j].y &&
                    arrows[i].y <= targets[j].y + targets[j].height) {
                        hit.play()
                    sp = true;
                    // score++;
                    arrows.splice(i, 1)
                    targets.splice(j, 1)
                    console.log("jdfjd")
                }
                // console.log(arrows[i].x,targets[j].x)
            }
        }
    }
    if(sp){
        for (let i = 0; i < particleCount; i++) {
            let radius = 3;
            let dx = randomIntFromInterval(-25, 25);
            let dy = randomIntFromInterval(-20, 20);
            particles.push(new Particle(canvas.width / 2 + 100, canvas.height/2, radius, dx, dy, colors[Math.floor(Math.random() * colors.length)]))
        }
        sp = false;
    }
    for (let i = 0; i < particles.length; i++) {
        console.log(particles)
        particles[i].spawnParticles()
    }
    if(push){
        arrows.push(new Arrow(arrowimg,player.x,player.y,20,10,100,100,1,"angle"))
            push = false;
        }
        if(arrows[0] != undefined){
            // console.log(arrows[0].x)
        }
    for(let i = 0; i < targets.length; i++){
        targets[i].move()
    }
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
        case " ":
            shoot.play()
            let dx = 20;
            let angle = "angle";
            framesforplayer = 21;
            staggerFrames = 3;
            player.img = playershoot;
            // console.log(player.x,player.y)
            push = true;
            // console.log(arrows)
            break;
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
        case " ":
            framesforplayer = 2;
            staggerFrames = 6;
            player.img = playeridle
            break;
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
let arr = [0,1]
setInterval(() => {
    for(let i = 0; i < targetCount; i++){
        let x = randomIntFromInterval(400, innerWidth)
        let r = arr[Math.floor(Math.random() * arr.length)]
        let y; 
        let dy;
        if(r == 0){
            y = innerHeight
            // y = 100
            dy = randomIntFromInterval(-8,-15) 
        }
        else if(r == 1){
            y = 0
            // y = 500
            dy = randomIntFromInterval(8,15)
        }
        // let radius = randomIntFromInterval(6,12)
        let width = randomIntFromInterval(25,40)
        let height = randomIntFromInterval(25,40)
        let dx = randomIntFromInterval(8,15)
        targets.push(new Rect(x,y,width,height,dx,dy));
    }
    // console.log(targets)
}, 2000);