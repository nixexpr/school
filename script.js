window.addEventListener('load', function () {
    const canvas = this.document.getElementById('main-canvas');
    canvas.width = 1500;
    canvas.height = 500;      

    const context = canvas.getContext('2d');
    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0; // stores a value of timestamp from the previous animation loop

    // animation loop
    function animate(currentTime) {
        const deltaTime = currentTime - lastTime;
        context.clearRect(0, 0, canvas.width, canvas.height);
        game.draw(context);
        game.update(deltaTime);
        lastTime = currentTime;
        requestAnimationFrame(animate);
    }

    animate(0);
})

class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.player = new Player(this);
        this.background = new Background(this);
        this.keys = new Set();
        this.input = new InputHandler(this);
        this.building = new Building(this);
        this.enemy = new Enemy(this);
        this.corridor_index = 0;
        this.room_index = -1;
    }
    update(deltaTime) {
        this.background.update();
        this.building.update(deltaTime);
        this.player.update(deltaTime);
    }
    draw(context) {
         this.background.draw(context);
         this.building.draw(context);
         this.player.draw(context); 
         //this.enemy.draw(context);
    }
}

class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 25;
        this.fontFamily = 'Helvetica';
        this.color = 'yellow';
        this.imageHeartEmpty = document.getElementById('heart_empty');
        this.imageHeartFull = document.getElementById('heart_full');
    }
}

class Background {
    constructor(game) {
        this.game = game;
    }
    update() {
        //this.layers_all.forEach(layer => layer.update());
    }
    draw(context) {
        //this.layers_bg.forEach(layer => layer.draw(context));
    }
}

// класс обработчиков клавиатуры
class InputHandler {
    constructor(game) {
        this.game = game;
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                this.game.keys.add(e.key);
            }
            else if (e.key === 'd') {
                this.game.debug = !this.game.debug;
            }
        });
        window.addEventListener('keyup', (e) => {
            this.game.keys.delete(e.key);
        });
    }
}

class Player {
    constructor(game) {
        this.game = game;
        this.width = 120;
        this.height = 190;
        this.x = 750;
        this.y = 250;
        this.speed = 0;
        this.maxSpeed = 3;
        this.maxLives = 3;
        this.lives = this.maxLives;
        this.color = 'green';
        //this.image = document.getElementById('player');
    }
    update(deltaTime) {
        // движение игрока
        if (this.game.keys.has('ArrowLeft')) this.speed = -this.maxSpeed
        else if (this.game.keys.has('ArrowRight')) this.speed = this.maxSpeed
        else this.speed = 0;

        this.x += this.speed;

        // ограничение движения игорока
        if (this.x > this.game.width - this.width * 1) 
            this.x = this.game.width - this.width * 1;
        else 
        if (this.x < -this.width * 0) 
            this.x = -this.width * 0;

    }
    draw(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.strokeRect(this.x, this.y, this.width, this.height);

        // жизнь игрока - картинки
        for (let i = 0; i < this.maxLives; ++i) {
            if (i < this.lives)
                context.fillRect(1300 + 55 * i, 20, 50, 80);
            else
                context.fillRect(1300 + 55 * i, 20, 50, 80);
        }
    }
}

class Building {
    constructor(game) {
        this.game = game;
        this.corridor = new Corridor(this.game);
    }
    update(deltaTime) {
        this.corridor.update(deltaTime);
    }
    draw(context) {
        this.corridor.draw(context);
    }
}

class Corridor {
    constructor(game) {
        this.game = game;
        this.room = new Room(this.game);
        this.doors = [];
        this.doors.push(new Door(this.game, 300, 160));
        this.doors.push(new Door(this.game, 500, 160));
    }
    update(deltaTime) {
        this.doors.forEach(door => door.update(deltaTime));
    }
    draw(context) {
        this.doors.forEach(door => door.draw(context));
    }
}

class Room {
    constructor(game) {
        this.game = game;

    }
    update(deltaTime) {
    }
    draw(context) {
    }
}

class Door {
    constructor(game, x, y) {
        this.game = game;
        this.width = 200;
        this.height = 280;
        this.x = x;
        this.y = y;
        this.color = 'blue';
    }
    update(deltaTime) {
    }
    draw(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}
class Enemy {
    constructor(game) {
        this.game = game;
        this.width = 150;
        this.height = 250;
        this.x = 300;
        this.y = 190;
        this.color = 'red';
        this.speedX = -(Math.random() * 1.5 + 3.5); // 3.5 - 5.0
        this.markedForDeletion = false;
    }
    update(deltaTime) {
        // Обновляем x-координату врага (уменьшаем ее на величину speedX)
        this.x += this.speedX;
        // Помечаем врага как удаленного, если он полностью пересечет левую границу игрового поля
        if (this.x + this.width < 0 || this.x > this.game.width - this.width) this.markedForDeletion = true;
    }
    draw(context) { 
        context.fillStyle = this.color;
        if (this.markedForDeletion == false)
            context.fillRect(this.x, this.y, this.width, this.height);
    }
}
