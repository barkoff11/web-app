var width = 40;
var height = 24;
var map = [];

// Генерация пустой карты (все стены)
function generateMap() {
    map = [];

    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < width; x++) {
            map[y][x] = "W"; // Заполняем всю карту стенами
        }
    }
}


// Создание случайных комнат
function generateRooms() {
    let roomCount = Math.floor(Math.random() * 6) + 5; // От 5 до 10 комнат

    for (let i = 0; i < roomCount; i++) {
        let roomWidth = Math.floor(Math.random() * 6) + 3;  // 3 - 8 клеток ширины
        let roomHeight = Math.floor(Math.random() * 6) + 3; // 3 - 8 клеток высоты
        let x = Math.floor(Math.random() * (width - roomWidth - 2)) + 1;
        let y = Math.floor(Math.random() * (height - roomHeight - 2)) + 1;

        for (let ry = y; ry < y + roomHeight; ry++) {
            for (let rx = x; rx < x + roomWidth; rx++) {
                map[ry][rx] = "floor"; // Делаем свободные зоны
            }
        }
    }
}

// Получение случайной пустой клетки
function getRandomEmptyCell() {
    var x, y;
    do {
        x = randomInt(0, width - 1);
        y = randomInt(0, height - 1);
    } while (map[y][x] !== ".");
    return { x, y };
}
