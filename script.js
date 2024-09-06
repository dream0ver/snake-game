class Game {
  buttonMap = {
    W: { x: -1, y: 0, opposite: "S" },
    S: { x: 1, y: 0, opposite: "W" },
    A: { x: 0, y: -1, opposite: "D" },
    D: { x: 0, y: 1, opposite: "A" },
  };
  constructor(n) {
    if (Game.instance) return Game.instance;
    Game.instance = this;
    this.n = n;
    this.score = 0;
    this.snake = [];
    this.lastPressedKey;
    this.moveInterval;
    this.gameBoard = document.getElementById("game-board");
    this.gameBoard.classList.add("maze-container");
    this.init();
  }

  init() {
    this.drawBoard();
    this.spawnFruit();
    this.spawnSnake();
    this.registerSnakeMoveEvent();
  }

  spawnFruit() {
    this.clearFruit();
    this.fruit = this.getRandomPoint();
    this.getCell(this.fruit).classList.add("fruit");
  }

  clearFruit() {
    this.getCell(this.fruit)?.classList.remove("fruit");
  }

  spawnSnake() {
    this.snake[0] = this.getRandomPoint();
    this.getCell(this.snake[0]).classList.add("snake");
  }

  isOutofBound() {
    const { x, y } = this.snake[0];
    return x < 0 || x > this.n - 1 || y < 0 || y > this.n - 1;
  }

  isFruitInSnakeMouth() {
    const { x: xSnake, y: ySnake } = this.snake[0];
    const { x: xFruit, y: yFruit } = this.fruit;
    return xSnake == xFruit && ySnake == yFruit;
  }

  drawBoard() {
    for (let i = 0; i < this.n; i++) {
      const row = document.createElement("div");
      row.classList.add("maze-row");
      row.id = `row-${i}`;
      for (let j = 0; j < this.n; j++) {
        const cell = document.createElement("div");
        cell.classList.add("maze-cell");
        cell.id = `${row.id}-col-${j}`;
        row.append(cell);
      }
      this.gameBoard.append(row);
    }
  }

  getCell(coords = {}) {
    const { x, y } = coords;
    return document.getElementById(`row-${x}-col-${y}`);
  }

  getRandomPoint() {
    return {
      x: Math.floor(Math.random() * this.n),
      y: Math.floor(Math.random() * this.n),
    };
  }

  registerSnakeMoveEvent(e) {
    document.body.addEventListener("keypress", (e) => {
      const pressedKey = e.key.toUpperCase();

      if (!Object.keys(this.buttonMap).includes(pressedKey)) return;
      if (this.lastPressedKey == pressedKey) return;
      if (this.lastPressedKey == this.buttonMap[pressedKey].opposite) return;

      clearInterval(this.moveInterval);

      this.moveInterval = setInterval(() => {
        this.lastPressedKey = pressedKey;
        const { x: dx, y: dy } = this.buttonMap[pressedKey];
        this.getCell(this.snake[0]).classList.remove("snake");
        this.snake[0].x += dx;
        this.snake[0].y += dy;
        if (this.isOutofBound()) {
          clearInterval(this.moveInterval);
          this.spawnFruit();
          this.spawnSnake();
          this.score = 0;
          this.lastPressedKey = null;
          return;
        }
        if (this.isFruitInSnakeMouth()) {
          this.score += 1;
          this.spawnFruit();
        }
        this.getCell(this.snake[0]).classList.add("snake");
      }, 100);
    });
  }
}

const game = new Game(20);
