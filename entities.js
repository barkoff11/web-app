var hero = { x: 0, y: 0 };
var enemies = [];

function placeHero() {
    let emptyCells = [];

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (map[y][x] === "floor") {
                emptyCells.push({ x, y });
            }
        }
    }

    if (emptyCells.length === 0) {
        console.error("Ошибка: Нет свободного места для героя!");
        return null;
    }

    let pos = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    map[pos.y][pos.x] = "P"; // Помечаем героя на карте
    let hero = { x: pos.x, y: pos.y, health: 100, attack: 10 };

    console.log("Герой создан:", hero);
    return hero;
}



// Размещение предметов
function placeItems(type, count) {
    for (var i = 0; i < count; i++) {
        var pos = getRandomEmptyCell();
        map[pos.y][pos.x] = type;
    }
}

// Размещение врагов
function placeEnemies() {
    for (var i = 0; i < 10; i++) {
        var pos = getRandomEmptyCell();
        map[pos.y][pos.x] = "E";
        enemies.push({ x: pos.x, y: pos.y });
    }
}
