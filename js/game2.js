let canvas = document.getElementById("canvas1");
let c = canvas.getContext('2d');
canvas.height = innerHeight;
canvas.width = innerWidth;
let scoreElem = document.querySelector("h1");
let heading = document.querySelector("h2");
let bg = document.getElementById('bg3');
let jump = document.getElementById("jump")
let hit = document.getElementById("hit");
let shoot = document.getElementById("shoot");
let gameover = document.getElementById('gameover')
let transparentballs = [];
let sp = false;
let particleCount = 45;
let gameFrame = 0;
let frameX = 0;
let frameY = 0;
let staggerFrames = 6;
let framesforplayer = 2;
const playeridlewidth = 1024;
const playeridleheight = 1024;
let arrows = [];
let targets = [];
let particles = [];
let colors = ["red", "blue", "gray", "green", "purple", "black", "pink", "yelllow"]
let background = new Image();
background.src = "/Sprites/bg1.png"
let playeridle = new Image();
playeridle.src = "/Sprites/playeridle.png"
let playerjump = new Image();
playerjump.src = "/Sprites/playerjump.png"
let playerrun = new Image();
playerrun.src = "/Sprites/playerrun.png"
let doorimg = new Image();
doorimg.src = "/Sprites/door.png"
let arrowimg = new Image();
arrowimg.src = "/Sprites/arrow.png";
let ballimg = new Image();
ballimg.src = "/Sprites/ball.png";
let score = 0;
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

class Door {
    constructor(img, width, height, x, y) {
        this.img = img;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }
    appear() {
        c.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
}
class TransparentBall {
    constructor(x, y, width, height, dx, dy, angle) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dx = dx;
        this.dy = dy;
        this.angle = angle;
    }
    go() {
        c.beginPath();
        c.fillStyle = "rgba(0,0,0,0.01)"
        c.fillRect(this.x, this.y, this.width, this.height)
        c.fill()
        c.closePath()
        this.x += (this.dx) - 2.5;
        this.y += (this.dy) - 2.5; 
    }
}

class Tile {
    constructor(x, y, width, height, color, rendered) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color
        this.rendered = rendered;
    }
    render() {
        this.rendered = true;
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, this.width, this.height)
        c.fill()
    }
}
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
        // if(this.y + this.height < 150 ){
        //     keys.arrowUp.pressed = false
        //     this.dy = 0;
        // }
        if (this.y + this.height > innerHeight) {
            location.href = "gamover.html"
            // this.dy = 0;
        }
        if (this.y + this.width <= 0) {
            // this.dy = 0;
        }
    }
}
class Target {
    constructor(img, x, y, width, height, dx, dy) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dx = dx;
        this.dy = dy;
    }
    spawn() {
        c.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    move() {
        this.spawn()
        this.y += this.dy;
    }
}
class Arrow {
    constructor(img, x, y, dx, dy, width, height, dir, angle) {
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
        c.save()
        c.translate(this.x + 100, this.y - 100);
        c.rotate(this.angle);
        c.drawImage(this.img, this.x, this.y, this.width, this.height);
        this.x += this.dx;
        this.y += this.dy;
        c.restore();
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
let player = new Player(playeridle, 20, 10, 120, 120, 0, 20);
let door = new Door(doorimg, 150, 150, innerWidth - 150, innerHeight - 200);
let tile = new Tile(20, player.height + 100, 200, 20, "red", false)
let tile2 = new Tile(innerWidth - 200, door.y + door.height, 350, 20, "red", false);
let tile3 = new Tile(220, player.height + 400, 200, 20, "blue", false)
let tile4 = new Tile(620, player.height + 500, 200, 20, "green", false)
let y = 10;
let arrow;
let transparentball;
addEventListener("click", (e) => {
    shoot.play()
    let angle = Math.atan2(e.clientY - player.y, e.clientX - player.x)
    let dx = Math.cos(angle) * 12;
    let dy = Math.sin(angle) * 12;
    let dx1 = Math.cos(angle) * 42;
    let dy1 = Math.sin(angle) * 42;
    arrow = new Arrow(arrowimg, player.x, player.y, dx, dy, 100, 100, 1, angle)
    transparentball = new TransparentBall(player.x, player.y, 20, 20, dx1, dy1, angle)
    arrows.push(arrow)
    transparentballs.push(transparentball);
})
let op = 1;
function animate() {
    bg.play()
    bg.loop = true;
    c.drawImage(background, 0, 0,innerWidth,innerHeight);
    setTimeout(()=>{
        op -= 0.01;
        heading.style.opacity = `${op}`
    },1000)
    scoreElem.innerText = score
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
    tile.render();
    tile2.render();
    door.appear();
    // c.clearRect(0,0,canvas.width,canvas.height)
    for (let i = 0; i < targets.length; i++) {
        targets[i].move()
        if (targets[i].y > innerHeight) {
            targets.splice(i, 1)
        }
    }
    for (let i = 0; i < transparentballs.length; i++) {
        transparentballs[i].go()
        if (transparentballs[i].y > innerHeight || transparentballs[i].x > innerWidth) {
            transparentballs.splice(i, 1)
        }
    }
    for(let i = 0; i < arrows.length;i++){
        arrows[i].throw()
        if (arrows[i].y > innerHeight || arrows[i].x > innerWidth) {
            arrows.splice(i, 1)
        }
    }
    // This is the code for collision detection between our player's arrow and the ball which is our target : 
    for (let i = 0; i < arrows.length; i++) {
        for (let j = 0; j < targets.length; j++) {
            if (arrows[i] != undefined && targets[j] != undefined) {
                if (arrows[i].x + arrows[i].width >= targets[j].x &&
                    arrows[i].x <= targets[j].x + targets[j].width &&
                    arrows[i].y + arrows[i].height >= targets[j].y &&
                    arrows[i].y <= targets[j].y + targets[j].height) {
                    hit.play()
                    sp = true;
                    score++;
                    arrows.splice(i, 1)
                    targets.splice(j, 1)
                }
            }
            // console.log(arrows[i].x,targets[j].x)
        }
    }
    for (let i = 0; i < transparentballs.length; i++) {
        for (let j = 0; j < targets.length; j++) {
            if (transparentballs[i] != undefined && targets[j] != undefined) {
                if (transparentballs[i].x + transparentballs[i].width >= targets[j].x &&
                    transparentballs[i].x <= targets[j].x + targets[j].width &&
                    transparentballs[i].y + transparentballs[i].height >= targets[j].y &&
                    transparentballs[i].y <= targets[j].y + targets[j].height) {
                    hit.play()
                    sp = true;
                    score++;
                    transparentballs.splice(i, 1)
                    targets.splice(j, 1)
                }
            }
            // console.log(arrows[i].x,targets[j].x)
        }
    }
    if (sp) {
        for (let i = 0; i < particleCount; i++) {
            let radius = 3;
            let dx = randomIntFromInterval(-25, 25);
            let dy = randomIntFromInterval(-20, 20);
            particles.push(new Particle(canvas.width / 2, canvas.height / 2, radius, dx, dy, colors[Math.floor(Math.random() * colors.length)]))
        }
        sp = false;
    }
    for (let i = 0; i < particles.length; i++) {
        particles[i].spawnParticles()
    }
    if (player.x + player.width <= tile.x && player.y + player.height < innerHeight) {
        player.dy = 15
    }
    if (player.x >= tile.x + tile.width && player.y < innerHeight) {
        player.dy = 15
    }
    if (player.x + player.width <= tile2.x && player.y + player.height < innerHeight) {
        player.dy = 15
    }
    if (player.x >= tile2.x + tile2.width && player.y < innerHeight) {
        player.dy = 15
    }
    if (player.x + player.width <= tile3.x && player.y + player.height < innerHeight) {
        player.dy = 15
    }
    if (player.x >= tile3.x + tile3.width && player.y < innerHeight) {
        player.dy = 15
    }
    if (player.x + player.width <= tile4.x && player.y + player.height < innerHeight) {
        player.dy = 15
    }
    if (player.x >= tile4.x + tile4.width && player.y < innerHeight) {
        player.dy = 15
    }
    if (player.y + player.height <= tile.y && player.y + player.height + player.dy >= tile.y && player.x + player.width >= tile.x && player.x <= tile.x + tile.width && player.y <= tile.y + tile.height) {
        player.dy = 0;
    }
    if (player.y + player.height <= tile2.y && player.y + player.height + player.dy >= tile2.y && player.x + player.width >= tile2.x && player.x <= tile2.x + tile2.width && player.y <= tile2.y + tile2.height) {
        player.dy = 0;
    }
    if (player.y + player.height <= tile3.y && player.y + player.height + player.dy >= tile3.y && player.x + player.width >= tile3.x && player.x <= tile3.x + tile3.width && player.y <= tile3.y + tile3.height && tile3.rendered) {
        player.dy = 0;
    }
    if (player.y + player.height <= tile4.y && player.y + player.height + player.dy >= tile4.y && player.x + player.width >= tile4.x && player.x <= tile4.x + tile4.width && player.y <= tile4.y + tile4.height && tile4.rendered) {
        player.dy = 0;
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
    if (score >= 10) {
        clearInterval(myInterval);
        tile4.render();
        tile3.render();
        if (player.x + player.width >= door.x &&
            player.x <= door.x + door.width &&
            player.y + player.height >= door.y &&
            player.y <= door.y + door.height) {
            location.href = "level3.html";
        }
        // location.href = "level3.html"
    }

    // c.fillStyle = "black"
    // c.fillRect(0,0,canvas.width,canvas.height)
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
let myInterval;
myInterval = setInterval(() => {
    for (let i = 0; i < 4; i++) {
        let x = randomIntFromInterval(250, innerWidth - 350);
        let y = 0;
        let dx = randomIntFromInterval(3, 13);
        let dy = randomIntFromInterval(3, 8);
        // let color = colors[Math.floor(Math.random() * colors.length)]
        // let radius = randomIntFromInterval(5,15)
        targets.push(new Target(ballimg, x, y, 50, 50, dx, dy))
    }
}, 2000);
// function spawnParticles(x,y,amount){

// }
