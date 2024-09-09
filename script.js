class Game {
  buttonMap = {
    W: { x: -1, y: 0, opposite: "S" },
    S: { x: 1, y: 0, opposite: "W" },
    A: { x: 0, y: -1, opposite: "D" },
    D: { x: 0, y: 1, opposite: "A" },
  };
  speed = 83.33;
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
    this.loadAudio();
    this.drawBoard();
    this.spawnFruit();
    this.spawnSnake();
    this.registerEvents();
  }

  createNodes() {
    this.gameBoard = document.createElement("div");
    this.gameBoard.id = "game-board";
    this.gameBoard.append(
      Object.assign(document.createElement("span"), { id: "game-score" }),
      Object.assign(document.createElement("div"), {
        id: "game-scan-lines",
      })
    );
    document.body.append(this.gameBoard);
  }

  loadAudio() {
    this.gameBoard.append(
      Object.assign(document.createElement("audio"), {
        id: "game-audio-bgm",
        src: "./assets/audio/bg.mp3",
        loop: true,
        preload: "auto",
      })
    );

    this.gameBoard.append(
      Object.assign(document.createElement("audio"), {
        id: "game-audio-dead",
        src: "./assets/audio/dead.mp3",
        preload: "auto",
      })
    );

    this.gameBoard.append(
      Object.assign(document.createElement("audio"), {
        id: "game-audio-collect",
        src: "./assets/audio/collect.mp3",
        preload: "auto",
      })
    );
  }

  onNewGame() {
    this.updateMsg({ type: "score", value: this.score });
    this.toggleAudioPlayback({ track: "bgm", action: true });
  }

  spawnFruit() {
    this.clearFruit();
    this.fruit = this.getRandomPoint();
    this.getCell(this.fruit)?.classList.add("fruit");
  }

  clearFruit() {
    this.getCell(this.fruit)?.classList.remove("fruit");
  }

  spawnSnake() {
    this.clearDeadSnake();
    const { x, y } = this.getRandomPoint();
    for (let i = 0; i < 3; i++) {
      this.snake[i] = { x, y: y - i };
      this.getCell(this.snake[i])?.classList.add(
        i == 0 ? "snake-head" : "snake"
      );
    }
  }

  clearDeadSnake() {
    for (let i = 0; i < this.snake.length; i++) {
      this.getCell(this.snake[i])?.classList.remove(
        i == 0 ? "snake-head" : "snake"
      );
    }
    this.snake = [];
  }

  isOutofBound() {
    const { x, y } = this.snake[0];
    return x < 0 || x > this.n - 1 || y < 0 || y > this.n - 1;
  }

  snakeBitItself() {
    const head = this.snake[0];
    for (let i = 1; i < this.snake.length; i++) {
      const { x, y } = this.snake[i];
      if (x == head.x && y == head.y) return true;
    }
    return false;
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
      row?.classList.add("maze-row");
      row.id = `row-${i}`;
      for (let j = 0; j < this.n; j++) {
        const cell = document.createElement("div");
        cell?.classList.add("maze-cell");
        cell.id = `${row.id}-col-${j}`;
        row.append(cell);
      }
      this.gameBoard.append(row);
    }
  }

  toggleAudioPlayback({ track, action }) {
    const audio = document.getElementById(`game-audio-${track}`);
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
    this.toggleAudioPlayback({ track: "bgm", action: false });
    this.toggleAudioPlayback({ track: "dead", action: true });
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
        tag.textContent = "Dream Over";
        break;
      }
      case "instructions": {
        tag.textContent = "Use W, A, S, D to move the snake";
        break;
      }
      case "score": {
        tag.textContent = `Score ${value.toString().padStart(8, 0)}`;
        break;
      }
    }
  }

  handleOnEat() {
    this.toggleAudioPlayback({ track: "collect", action: true });
    this.score += 5;
    this.spawnFruit();
    this.updateMsg({ type: "score", value: this.score });
    this.updateSnakeHead();
  }

  pruneSnakeTail() {
    const currentTailIdx = this.snake.length - 1;
    this.getCell(this.snake[currentTailIdx])?.classList.remove("snake");
    this.snake.splice(currentTailIdx, 1);
  }

  updateSnakeHead() {
    const { x: dx, y: dy } = this.buttonMap[this.lastPressedKey];
    this.getCell(this.snake[0])?.classList.remove("snake-head");
    this.getCell(this.snake[0])?.classList.add("snake");
    const newHead = { ...this.snake[0] };
    newHead.x += dx;
    newHead.y += dy;
    this.snake.unshift(newHead);
    this.getCell(this.snake[0])?.classList.add("snake-head");
  }

  moveSnake() {
    if (this.isOutofBound() || this.snakeBitItself()) return this.resetGame();
    if (this.isFruitInSnakeMouth()) return this.handleOnEat();
    this.pruneSnakeTail();
    this.updateSnakeHead();
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

const game = new Game(24);
