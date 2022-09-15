let canvas = document.getElementById("canvas");
let c = canvas.getContext('2d');
canvas.height = innerHeight;
canvas.width = innerWidth;
let con = document.querySelector('.container');
let heading = document.querySelector('h1');
let bg = document.getElementById('bg1');
let jump = document.getElementById("jump")
let hit = document.getElementById("hit");
let shoot = document.getElementById("shoot");
let gameover = document.getElementById('gameover');
// bg.play()
// Here we are going to make an array of our tiles : 
let tiles = [];
let arrows = [];
let enemyarrows = [];
let enemies = [];
let particles = [];
let colors = ["red", "blue", "gray", "green", "purple", "black", "pink", "yelllow"]
let particleCount = 80;
let hited = 0;
let gameFrame = 0;
let frameX = 0;
let frameY = 0;
let frameX2 = 0;
let frameY2 = 0;
let frameX3 = 0;
let frameY3 = 0;
let staggerFrames = 6;
let staggerFrames2 = 6;
let staggerFrames3 = 6;
let framesforplayer = 2;
let framesforenemy = 5;
let framesforexplosion = 6;
let gameFrame2 = 0;
let gameFrame3 = 0;
const playeridlewidth = 1024;
const playeridleheight = 1024;
const enemywalkingwidth = 108.83333333;
const enemywalkingheight = 137;
const explosionwidth = 109;
const explosionheight = 172;
let background = new Image();
background.src = "bg.jpg"
let playeridle = new Image();
playeridle.src = "playeridle.png"
let enemyidle = new Image();
enemyidle.src = "enemyidle.png"
let playerjump = new Image();
playerjump.src = "playerjump.png"
let playerrun = new Image();
playerrun.src = "playerrun.png"
let enemywalking = new Image();
enemywalking.src = "enemywalking.png";
let doorimg = new Image();
doorimg.src = "door.png";
let arrowimg = new Image();
arrowimg.src = "arrow.png";
let arrowenemyimg = new Image();
arrowenemyimg.src = "arrowenemyimg.png"
let tileimg = new Image();
tileimg.src = "tile.png";
let explosion = new Image();
explosion.src = "explosion.png";
let explosion2 = new Image();
explosion2.src = "explosion2.jpg";
let playershoot = new Image();
playershoot.src = "playershoot.png";
let destroyed = false;
let destroyed1 = false;
let destroyed2 = false;
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
    },
    j: {
        pressed: false
    }
}
// Some Utility Functions : 
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
// We are going to have two main classes in our game. 
// First is the class Player and the other one is Enemy : 
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
        if (this.y + this.height > innerHeight) {
            this.dy = 0;
        }
        if (this.y + this.width <= 0) {
            this.dy = 0;
        }
    }
}
class Enemy {
    constructor(img, x, y, width, height, dx, dy, offset) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dx = dx;
        this.dy = dy;
        this.offset = offset;
    }
    draw() {
        c.drawImage(this.img, frameX2 * enemywalkingwidth, frameY2 * enemywalkingheight, enemywalkingwidth, enemywalkingheight, this.x, this.y, this.width, this.height);
    }
    attack() {
        this.draw()
        // this.y += this.dy;
        if (this.x + this.width > innerWidth || this.x - this.width < this.offset - 120) {
            this.dx = -this.dx
        }
        this.x += this.dx;
        if (this.y + this.height < 150) {
            keys.arrowUp.pressed = false
            this.dy = 0;
        }
        if (this.y + this.height > innerHeight) {
            this.dy = 0;
        }
        if (this.y + this.width <= 0) {
            this.dy = 0;
        }
    }
}
// Here is our another important class in the game : 
class Tile {
    constructor(img, x, y, width, height, color) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color
    }
    render() {
        c.drawImage(this.img, this.x, this.y, this.width, this.height);
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
class Explosion {
    constructor(img, x, y, width, height) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    explode() {
        // c.drawImage(this.img,frameX3 * explosionwidth,frameY3 * explosionheight,explosionwidth,explosionheight,this.x,this.y,this.width,this.height);
        c.drawImage(this.img, this.x, this.y, this.width, this.height)
        this.width += 1
        this.height += 1
    }
}
let door = new Door(doorimg, 150, 150, innerWidth - 150, 0);
let player = new Player(playeridle, 20, 10, 120, 120, 0, 20);
// let enemy2 = new Enemy(enemywalking,320,450,120,120,2,0)
let tile = new Tile(tileimg, 300, 500, innerWidth, 30, "blue");
let tile1 = new Tile(tileimg, 600, 350, innerWidth, 30, "green");
let tile2 = new Tile(tileimg, 800, 150, innerWidth, 30, "red");
let enemy = new Enemy(enemywalking, 320, tile.y - 100, 120, 120, 3.5, 2, 320);
let enemy1 = new Enemy(enemywalking, 580, tile1.y - 100, 120, 120, 1, 2, 580);
let enemy2 = new Enemy(enemywalking, 580, innerHeight - enemy.width + 20, 120, 120, 2, 2, 580);
let explosion1 = new Explosion(explosion2, 200, 300, 50, 100)
enemies.push(enemy);
enemies.push(enemy1)
enemies.push(enemy2)
let h = 0;
let h1 = 0;
let h2 = 0;
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
let op = 1;
function animate() {
    bg.play();
    console.log(hited)
    // console.log(player.y,enemy2.y)
    if (hited > 30) {
        setTimeout(() => {
            location.href = "gamover.html"
        }, 800)
        bg.volume = 0.1
        gameover.play()
    }
    c.drawImage(background, 0, 0, innerWidth, innerHeight);
    setTimeout(() => {
        op -= 0.01;
        heading.style.opacity = `${op}`
    }, 1000)
    // arrows.x = player.x
    // arrows.y = player.y  
    if (gameFrame % staggerFrames == 0) {
        if (frameX < framesforplayer) {
            frameX++;
        }
        else {
            frameX = 0;
        }
    }
    if (gameFrame2 % staggerFrames2 == 0) {
        if (frameX2 < framesforenemy) {
            frameX2++;
        }
        else {
            frameX2 = 0;
        }
    }
    if (gameFrame3 % staggerFrames3 == 0) {
        if (frameX3 < framesforexplosion) {
            frameX3++;
        }
        else {
            frameX3 = 0;
        }
    }
    gameFrame3++;
    gameFrame2++;
    gameFrame++;
    player.update();
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].attack()
    }
    // explosion1.explode()
    tile.render();
    tile1.render();
    tile2.render();
    door.appear();
    for (let i = 0; i < particles.length; i++) {
        if (!destroyed || !destroyed || !destroyed2) {
            particles[i].spawnParticles()
        }
    }
    for (let i = 0; i < arrows.length; i++) {
        arrows[i].throw()
        if (arrows[i].x > innerWidth) {
            arrows.splice(i, 1)
        }
    }
    for (let i = 0; i < enemyarrows.length; i++) {
        enemyarrows[i].throw()
        if (enemyarrows[i].x > innerWidth) {
            enemyarrows.splice(i, 1)
        }
    }
    if (player.x + player.width <= tile.x && player.y + player.height < innerHeight) {
        player.dy = 15
    }
    if (player.x + player.width <= tile1.x && player.y + player.height < innerHeight) {
        player.dy = 15
    }
    if (player.x + player.width <= tile2.x && player.y + player.height < innerHeight) {
        player.dy = 15
    }

    if (enemy.x + enemy.width <= tile.x && enemy.y + playeenemy.height < innerHeight) {
        player.dy = 15
    }
    if (enemy.x + enemy.width <= tile1.x && enemy.y + enemy.height < innerHeight) {
        enemy.dy = 15
    }
    if (enemy.x + enemy.width <= tile2.x && enemy.y + enemy.height < innerHeight) {
        enemy.dy = 15
    }
    // Tile (Platform) collision detection for our player : 
    if (player.y + player.height <= tile.y && player.y + player.height + player.dy - 8 >= tile.y && player.x + player.width >= tile.x && player.x <= tile.x + tile.width && player.y <= tile.y + tile.height) {
        player.dy = 0;
    }
    if (player.y + player.height <= tile1.y && player.y + player.height + player.dy - 8 > tile1.y && player.x + player.width >= tile1.x && player.x <= tile1.x + tile1.width) {
        player.dy = 0;
    }
    if (player.y + player.height <= tile2.y && player.y + player.height + player.dy - 8 > tile2.y && player.x + player.width >= tile2.x && player.x <= tile2.x + tile2.width) {
        player.dy = 0;
    }
    // Tile (Platform) collision detection for our enemy : 
    if (enemy.y + enemy.height <= tile.y && enemy.y + enemy.height + enemy.dy - 8 >= tile.y && playeenemy.x + enemy.width >= tile.x && enemy.x <= tile.x + tile.width && enemy.y <= tile.y + tile.height) {
        enemy.dy = 0;
    }
    if (enemy.y + enemy.height <= tile1.y && enemy.y + enemy.height + enemy.dy - 8 > tile1.y && player.x + enemy.width >= tile1.x && enemy.x <= tile1.x + tile1.width) {
        enemy.dy = 0;
    }
    if (enemy.y + enemy.height <= tile2.y && enemy.y + enemy.height + enemy.dy - 8 > tile2.y && enemy.x + playeenemy.width >= tile2.x && enemy.x <= tile2.x + tile2.width) {
        enemy.dy = 0;
    }
    // Player's Arrow Collision Detection is here :

    for (let i = 0; i < arrows.length; i++) {
        if (arrows[i].x != undefined) {
            // hit.play()
            if (arrows[i].x + arrows[i].width >= enemy2.x &&
                arrows[i].x <= enemy2.x + enemy2.width &&
                arrows[i].y + arrows[i].height >= enemy2.y &&
                arrows[i].y <= enemy2.y + enemy2.height) {
                arrows.splice(i, 1);
                h++;
                enemy2.x += 40
                // 3rd Number enemy : 
                hit.play()
                if (h > 2) {
                    destroyed2 = true;
                    for (let i = 0; i < particleCount; i++) {
                        let radius = 3;
                        let dx = randomIntFromInterval(-25, 25);
                        let dy = randomIntFromInterval(-20, 20);
                        particles.push(new Particle(enemy2.x, enemy2.y, radius, dx, dy, "red"))
                    }
                    enemies.splice(enemies.indexOf(enemy2), 1)
                }
                continue
            }
        }
        // 1st Number enemy : 
        if (arrows[i].x != undefined) {
            // hit.play()
            if (arrows[i].x + arrows[i].width >= enemy1.x &&
                arrows[i].x <= enemy1.x + enemy1.width &&
                arrows[i].y + arrows[i].height >= enemy1.y &&
                arrows[i].y <= enemy1.y + enemy1.height) {
                h1++;
                enemy1.x += 40
                hit.play()
                if (h1 > 2) {
                    destroyed1 = true;
                    for (let i = 0; i < particleCount; i++) {
                        let radius = 3;
                        let dx = randomIntFromInterval(-25, 25);
                        let dy = randomIntFromInterval(-20, 20);
                        particles.push(new Particle(enemy1.x, enemy1.y, radius, dx, dy, "red"))
                    }
                    enemies.splice(enemies.indexOf(enemy1), 1)
                }
                arrows.splice(i, 1);
                continue
            }
        }
        // 2nd Number enemy : 
        if (arrows[i].x != undefined) {
            // hit.play()
            if (arrows[i].x + arrows[i].width >= enemy.x &&
                arrows[i].x <= enemy.x + enemy.width &&
                arrows[i].y + arrows[i].height >= enemy.y &&
                arrows[i].y <= enemy.y + enemy.height) {
                h2++;
                enemy.x += 40
                hit.play()
                if (h2 > 2) {
                    destroyed = true;
                    for (let i = 0; i < particleCount; i++) {
                        let radius = 3;
                        let dx = randomIntFromInterval(-25, 25);
                        let dy = randomIntFromInterval(-20, 20);
                        particles.push(new Particle(enemy.x, enemy.y, radius, dx, dy, "red"))
                    }
                    enemies.splice(enemies.indexOf(enemy), 1)
                }
                arrows.splice(i, 1);
            }
        }
    }
    // Enemy's Arrow Collision Detection is here : 
    for (let i = 0; i < enemyarrows.length; i++) {
        if (enemyarrows[i].x + enemyarrows[i].width >= player.x &&
            enemyarrows[i].x <= player.x + player.width &&
            enemyarrows[i].y + enemyarrows[i].height >= player.y &&
            enemyarrows[i].y <= player.y + player.height) {
            hit.play()
            hited += 1
            player.x -= 5
        }
    }
    if (player.x + player.width >= door.x &&
        player.x <= door.x + door.width &&
        player.y + player.height >= door.y &&
        player.y <= door.y + door.height && destroyed && destroyed1 && destroyed2) {
        location.href = "level2.html";
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
    // c.fillStyle = "black"
    // c.fillRect(0,0,canvas.width,canvas.height)
    requestAnimationFrame(animate);
}
animate();
let arrow;
addEventListener("keydown", (e) => {
    switch (e.key) {
        case " ":
            shoot.play();
            let dx = 20;
            let angle = "angle";
            framesforplayer = 21;
            staggerFrames = 3;
            player.img = playershoot;
            arrows.push(new Arrow(arrowimg, player.x, player.y, dx, 0, 100, 100, 1, angle))
            break;
        case "ArrowUp":
            jump.play()
            bg.volume = 0.8;
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
            bg.volume = 1.0
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
// Resize event listener : 

addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});
// addEventListener("click",(e)=>{
//     let angle = Math.atan2(e.clientY - player.y,e.clientX - player.x);
//     let dx = Math.cos(angle) * 10 ;
//     let dy = Math.sin(angle) * 10 ;
//     arrows.push(new Arrow(arrowimg,canvas.width / 2,canvas.height/2,dx,dy,100,100,1,angle))
//     console.log(player.y)
// })
let r = [1, 2, 3, 4, 5, 6]
setInterval(() => {
    let rand = r[Math.floor(Math.random() * r.length)]
    let rand1 = r[Math.floor(Math.random() * r.length)]
    if (rand == 1 || rand == 4) {
        if (!destroyed) {
            enemyarrows.push(new Arrow(arrowenemyimg, enemy.x, enemy.y, -20, 10, 100, 100, 1, 1));
        }
    }
    if (rand == 2 || rand == 5) {
        if (!destroyed1) {
            enemyarrows.push(new Arrow(arrowenemyimg, enemy1.x, enemy1.y, -20, 10, 100, 100, 1, 1));
        }
    }
    if (rand == 3 || rand == 6) {
        if (!destroyed2) {
            enemyarrows.push(new Arrow(arrowenemyimg, enemy2.x, enemy2.y, -20, 10, 100, 100, 1, 1));
        }
    }
}, 3000)