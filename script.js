class Game {
  buttonMap = {
    W: { x: -1, y: 0, opposite: "S" },
    S: { x: 1, y: 0, opposite: "W" },
    A: { x: 0, y: -1, opposite: "D" },
    D: { x: 0, y: 1, opposite: "A" },
  };
  speed = 100;
  constructor(n) {
    if (Game.instance) return Game.instance;
    Game.instance = this;
    this.n = n;
    this.score = 0;
    this.snake = [];
    this.lastPressedKey;
    this.moveInterval;

    this.init();
  }

  init() {
    this.createNodes();
    this.drawBoard();
    this.spawnFruit();
    this.spawnSnake();
    this.registerEvents();
  }

  createNodes() {
    this.gameBoard = document.createElement("div");
    this.gameBoard.id = "game-board";

    this.gameBoard.append(
      Object.assign(document.createElement("span"), { id: "game-score" })
    );

    this.gameBoard.append(
      Object.assign(document.createElement("div"), {
        id: "game-scan-lines",
      })
    );

    this.gameBoard.append(
      Object.assign(document.createElement("audio"), {
        id: "game-audio",
        src: "./assets/bg.mp3",
        loop: true,
        preload: "auto",
      })
    );

    document.body.append(this.gameBoard);
  }

  onNewGame() {
    this.updateMsg({ type: "score", value: this.score });
    this.toggleAudioPlayback(true);
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
    this.updateMsg({ type: "instructions" });
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

  toggleAudioPlayback(action) {
    const audio = document.getElementById("game-audio");
    audio.currentTime = 0;
    action ? audio.play() : audio.pause();
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

  resetGame() {
    this.updateMsg({ type: "gameover" });
    this.toggleAudioPlayback(false);
    clearInterval(this.moveInterval);
    this.spawnFruit();
    this.spawnSnake();
    this.score = 0;
    this.lastPressedKey = null;
  }

  updateMsg({ type, value }) {
    const tag = document.getElementById("game-score");
    switch (type) {
      case "gameover": {
        tag.textContent = "Game Over";
        break;
      }
      case "instructions": {
        tag.textContent = "Use W, A, S, D to move the snake";
        break;
      }
      case "score": {
        tag.textContent = `Score ${value}`;
        break;
      }
    }
  }

  handleOnEat() {
    this.score += 5;
    this.spawnFruit();
    this.updateMsg({ type: "score", value: this.score });
  }

  moveSnake() {
    const { x: dx, y: dy } = this.buttonMap[this.lastPressedKey];
    this.getCell(this.snake[0]).classList.remove("snake");
    this.snake[0].x += dx;
    this.snake[0].y += dy;
    if (this.isFruitInSnakeMouth()) this.handleOnEat();
    if (this.isOutofBound()) this.resetGame();
    this.getCell(this.snake[0]).classList.add("snake");
  }

  registerEvents(e) {
    document.body.addEventListener("keypress", (e) => {
      const pressedKey = e.key.toUpperCase();

      if (!Object.keys(this.buttonMap).includes(pressedKey)) return;
      if (this.lastPressedKey == pressedKey) return;
      if (this.lastPressedKey == this.buttonMap[pressedKey].opposite) return;

      clearInterval(this.moveInterval);

      if (!this.lastPressedKey) this.onNewGame();

      this.lastPressedKey = pressedKey;
      this.moveInterval = setInterval(() => this.moveSnake(), this.speed);
    });
  }
}

const game = new Game(20);
