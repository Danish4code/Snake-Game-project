const board = document.querySelector(".board");
const StartButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGame = document.querySelector(".start-game");
const gameOver = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart");

const highscoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

const blockheight = 50;
const blockwidth = 50;

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = "00-00";

highscoreElement.innerText = highScore;

const cols = Math.floor(board.clientWidth / blockwidth);
const rows = Math.floor(board.clientHeight / blockheight);
const blocks = {};
let snake = [{
    x: 1, y: 3
}];
let direction = "down";
let intervalId = null;
let timerintervalId = null;
function generateFood() {
    let newFood;
    while(true) {
        newFood = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
        let isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
        if(!isOnSnake) break;
    }
    return newFood;
}
let food = generateFood();

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
}
function render() {
    let head = null;

    blocks[`${food.x}-${food.y}`].classList.add("food")

    if (direction === "left") {
        head = { x: snake[0].x, y: snake[0].y - 1 }
    } else if (direction === "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 }
    } else if (direction === "down") {
        head = { x: snake[0].x + 1, y: snake[0].y }
    } else if (direction === "up") {
        head = { x: snake[0].x - 1, y: snake[0].y }
    }
    // Wall Collision Logic
    if(head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(intervalId);
        clearInterval(timerintervalId);
        modal.style.display = "flex";
        startGame.style.display = "none";
        gameOver.style.display = "flex";
        return;
    }
    // Food Consume Logic
    if (head.x == food.x && head.y == food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("food")
        food = generateFood();
        blocks[`${food.x}-${food.y}`].classList.add("food")
        snake.unshift(head);

        score += 10;
        scoreElement.innerText = score;

        if(score > highScore){
            highScore = score;
            localStorage.setItem("highScore", highScore.toString());
        }
    }

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill", "head");
    });
    snake.unshift(head);
    snake.pop();
    snake.forEach((segment, index) => {
        if(index === 0) {
            blocks[`${segment.x}-${segment.y}`].classList.add("head");
        } else {
            blocks[`${segment.x}-${segment.y}`].classList.add("fill");
        }
    });
}

addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
        direction = "up"
    }
    else if (event.key === "ArrowDown") {
        direction = "down"
    }
    else if (event.key === "ArrowLeft") {
        direction = "left"
    }
    else if (event.key === "ArrowRight") {
        direction = "right"
    }
})

StartButton.addEventListener("click", ()=>{
    modal.style.display = "none"
    intervalId = setInterval(() => { render() }, 300);
    timerintervalId = setInterval(() =>{
        let [min, sec] = time.split("-").map(Number)
        if(sec == 59){
            min += 1;
            sec = 0;
        }
            else{
                sec +=1;
            }
            time = `${min}-${sec}`;
            timeElement.innerText = time;
    },1000)
})

restartButton.addEventListener("click", restartGame)

function restartGame(){
    
    blocks[`${food.x}-${food.y}`].classList.remove("food")
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill", "head");
    });
    score = 0;
    time = "00-00";
    
    scoreElement.innerText = score;
    timeElement.innerText = time;
    highscoreElement.innerText = highScore;
    
    modal.style.display = "none";
    direction = "down";
    snake = [ { x: 1, y: 3 } ];
    food = generateFood();
    
    clearInterval(intervalId);
    clearInterval(timerintervalId);
    intervalId = setInterval(() => { render() }, 300);
    timerintervalId = setInterval(() =>{
        let [min, sec] = time.split("-").map(Number)
        if(sec == 59){
            min += 1;
            sec = 0;
        } else {
            sec +=1;
        }
        time = `${min < 10 ? '0'+min : min}-${sec < 10 ? '0'+sec : sec}`;
        timeElement.innerText = time;
    },1000)
}