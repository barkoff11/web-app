function Game() {
    this.hero = null;
    this.enemies = [];
    this.map = [];

    this.init = function () {
        this.generateMap();
        this.generateRooms();
        this.hero = this.placeHero();
        if (!this.hero) {
            console.error("Ошибка: Не удалось создать героя!");
            return;
        }
        this.placeItems("SW", 2);
        this.placeItems("HP", 10);
        this.enemies = this.placeEnemies();

        this.renderMap();
        attachControls(this.hero, this);
    };

    // Универсальная функция для перемещения
    this.moveEntity = function(entity, direction) {
        let newX = entity.x;
        let newY = entity.y;

        switch (direction) {
            case 0: newY -= 1; break;  // Вверх
            case 1: newY += 1; break;  // Вниз
            case 2: newX -= 1; break;  // Влево
            case 3: newX += 1; break;  // Вправо
        }

        if (newX >= 0 && newX < width && newY >= 0 && newY < height && this.map[newY][newX] === "floor") {
            this.map[entity.y][entity.x] = "floor";
            entity.x = newX;
            entity.y = newY;
            this.map[entity.y][entity.x] = entity === this.hero ? "P" : "E";
        }
    };
    this.attack = function(hero, game) {
        if (this.isGameOver) return;
        let attackArea = [
            { x: hero.x - 1, y: hero.y },  // Слева
            { x: hero.x + 1, y: hero.y },  // Справа
            { x: hero.x, y: hero.y - 1 },  // Сверху
            { x: hero.x, y: hero.y + 1 }   // Снизу
        ];

        attackArea.forEach(pos => {
            if (pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height) {
                if (game.map[pos.y][pos.x] === "E") {
                    game.map[pos.y][pos.x] = "floor";  
                    game.enemies = game.enemies.filter(enemy => !(enemy.x === pos.x && enemy.y === pos.y)); 
                    hero.health -= 25;
                    console.log(`Атака! Текущее здоровье: ${hero.health}, атака: ${hero.attack}`);
                }
            }
        });
        game.checkHeroHealth();
        game.renderMap();
    };

    this.gameOver = function() {
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
        }
        this.isGameOver = true;
        console.log("Игра окончена!");
    };

    this.checkHeroHealth = function() {
        if (this.hero.health <= 0) {
            this.map[this.hero.y][this.hero.x] = "floor";  
            console.log("Вы умерли!");
    
            this.gameOver();
        }
    };

    this.generateMap = function () {
        this.map = Array.from({ length: height }, () => Array(width).fill("W"));
    };

    this.generateRooms = function () {
        let roomCount = Math.floor(Math.random() * 6) + 6;
        let rooms = [];
    
        for (let i = 0; i < roomCount; i++) {
            let roomWidth = Math.floor(Math.random() * 6) + 3;
            let roomHeight = Math.floor(Math.random() * 6) + 3;
            let x = Math.floor(Math.random() * (width - roomWidth - 2)) + 1;
            let y = Math.floor(Math.random() * (height - roomHeight - 2)) + 1;
    
            for (let ry = y; ry < y + roomHeight; ry++) {
                for (let rx = x; rx < x + roomWidth; rx++) {
                    this.map[ry][rx] = "floor";
                }
            }
    
            rooms.push({ x: Math.floor(x + roomWidth / 2), y: Math.floor(y + roomHeight / 2) });
        }
    
        this.generatePassages(rooms);
    };
    
    this.generatePassages = function (rooms) {
        for (let i = 0; i < rooms.length - 1; i++) {
            let roomA = rooms[i];
            let roomB = rooms[i + 1];
    
            let x1 = roomA.x, y1 = roomA.y;
            let x2 = roomB.x, y2 = roomB.y;

                while (x1 !== x2) {
                this.map[y1][x1] = "floor";
                x1 += x1 < x2 ? 1 : -1;
            }
    
            while (y1 !== y2) {
                this.map[y1][x1] = "floor";
                y1 += y1 < y2 ? 1 : -1;
            }
        }
    };

    this.getRandomEmptyCell = function () {
        let emptyCells = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (this.map[y][x] === "floor") {
                    emptyCells.push({ x, y });
                }
            }
        }
        if (emptyCells.length === 0) return null;
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    };

    this.placeHero = function () {
        let pos = this.getRandomEmptyCell();
        if (!pos) {
            console.error("Ошибка: Нет свободного места для героя!");
            return null;
        }
        this.map[pos.y][pos.x] = "P";
        return { x: pos.x, y: pos.y, health: 100, attack: 10 };
    };

    this.placeItems = function (type, count) {
        for (let i = 0; i < count; i++) {
            let pos = this.getRandomEmptyCell();
            if (pos) this.map[pos.y][pos.x] = type;
        }
    };

    this.placeEnemies = function () {
        let enemies = [];
        for (let i = 0; i < 10; i++) {
            let pos = this.getRandomEmptyCell();
            if (!pos) break;
            this.map[pos.y][pos.x] = "E";
            enemies.push({ x: pos.x, y: pos.y });
        }
        return enemies;
    };

    this.moveEnemies = function () {
        this.enemies.forEach(enemy => {
            let direction = Math.floor(Math.random() * 4);
            this.moveEntity(enemy, direction);
        });
    
        this.renderMap();
    };

    this.renderMap = function () {
        let field = $(".field");
        field.empty();

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let tileClass = "tile tile" + this.map[y][x];
                let tile = $("<div>").addClass(tileClass).css({ left: x * 50, top: y * 50 });

                if (this.hero && this.hero.x === x && this.hero.y === y) {
                    tile.addClass("tileP");
                }

                this.enemies.forEach(enemy => {
                    if (enemy.x === x && enemy.y === y) {
                        tile.addClass("tileE");
                    }
                });

                field.append(tile);
            }
        }
    };
}
