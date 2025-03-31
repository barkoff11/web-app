function attachControls(hero, game) {
    if (!hero) {
        console.error("Ошибка: hero не определён в attachControls!");
        return;
    }

    console.log("Управление подключено. Герой:", hero);

    $(document).on("keydown", (event) => {
        if (game.isGameOver) {
            console.log("Игра окончена. Герой не может двигаться.");
            return;  // Если игра окончена, не обрабатываем движения
        }

        let dx = 0, dy = 0;
        switch (event.key) {
            case "w": dy = -1; break;
            case "s": dy = 1; break;
            case "a": dx = -1; break;
            case "d": dx = 1; break;
            case "ц": dy = -1; break;
            case "ы": dy = 1; break;
            case "ф": dx = -1; break;
            case "в": dx = 1; break;
            case " ":
                game.attack(hero, game);
                break;
        }

        let newX = hero.x + dx;
        let newY = hero.y + dy;


        const walkableTiles = ["floor", "SW", "HP"];


        if (game.map[newY] && game.map[newY][newX] && walkableTiles.includes(game.map[newY][newX])) {
            if (game.map[newY][newX] === "SW") {
                game.pickUpSword(hero);
            }
            // Если на новом месте зелье — восстанавливаем здоровье
            if (game.map[newY][newX] === "HP") {
                game.healHero(hero);
            }

            game.map[hero.y][hero.x] = "floor";
            hero.x = newX;
            hero.y = newY;
            // Помечаем героя на карте
            game.map[hero.y][hero.x] = "P";
            game.renderMap();
        }
        // Двигаем врагов
        game.moveEnemies(game);
    });
}
