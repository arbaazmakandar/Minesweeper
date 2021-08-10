let bombIcon = `<i class="fas fa-bomb"></i>`;
let modalButton = document.getElementById("modalButton");
let restartButton = document.getElementById("restartButton");
let closeButton = document.getElementById("closeButton");
let scoreClick = 0;
let dimension = 10;
let count = 0;
let gameOn = true;
let score = document.getElementById("score");
let flag = document.getElementById("flagged");
let flagCount = 0;

const disableInstructions = function () {
  initGame();

  document.getElementById("instructions").classList.add("hide");
  document.getElementById("header").style.display = "block";
  score.style.display = "inline-block";
  flag.style.display = " inline-block";
  document.getElementById("game-container").classList.remove("hide");
};

const numberOfBombsAddjacent = function (cell) {
  let arr = [];
  arr[0] = document.getElementById((Number(cell.id) - 11).toString());
  arr[1] = document.getElementById((Number(cell.id) - 10).toString());
  arr[2] = document.getElementById((Number(cell.id) - 9).toString());
  arr[3] = document.getElementById((Number(cell.id) + 1).toString());
  arr[4] = document.getElementById((Number(cell.id) + 11).toString());
  arr[5] = document.getElementById((Number(cell.id) + 10).toString());
  arr[6] = document.getElementById((Number(cell.id) + 9).toString());
  arr[7] = document.getElementById((Number(cell.id) - 1).toString());
  if (cell.id === "0") {
    arr[0] = null;
    arr[1] = null;
    arr[2] = null;
    arr[6] = null;
    arr[7] = null;
  }
  if (cell.id === "9") {
    arr[0] = null;
    arr[1] = null;
    arr[2] = null;
    arr[3] = null;
    arr[4] = null;
  }
  if (cell.id === "90") {
    arr[0] = null;
    arr[4] = null;
    arr[5] = null;
    arr[6] = null;
    arr[7] = null;
  }
  if (cell.id === "99") {
    arr[2] = null;
    arr[3] = null;
    arr[4] = null;
    arr[5] = null;
    arr[6] = null;
  }
  let j;
  //left border

  for (j = 0; j < dimension; j++) {
    if (Number(cell.id[1]) === 0) {
      arr[0] = null;
      arr[7] = null;
      arr[6] = null;
    }
  }
  //right border
  for (j = 0; j < dimension; j++) {
    if (Number(cell.id[1]) === 9) {
      arr[2] = null;
      arr[3] = null;
      arr[4] = null;
    }
  }
  //top border
  for (j = 0; j < dimension; j++) {
    if (Number(cell.id) > 0 && Number(cell.id) < 9) {
      arr[0] = null;
      arr[1] = null;
      arr[2] = null;
    }
  }
  //bottom border
  for (j = 0; j < dimension; j++) {
    if (
      Number(cell.id[0]) === 9 &&
      Number(cell.id[1]) > 0 &&
      Number(cell.id[1]) < 9
    ) {
      arr[4] = null;
      arr[5] = null;
      arr[6] = null;
    }
  }
  let c = 0;
  for (let k = 0; k < 8; k++) {
    if (arr[k] != null && arr[k].classList.contains("bomb")) {
      c++;
    }
  }
  cell.data = c;
  cell.innerHTML = c;
  console.log(cell.innerHTML);
};

const flagUpdater = function () {
  let flagEl = document.getElementsByClassName("flag");
  flagCount = flagEl.length;
  flag.innerHTML = `Flags: ${flagCount}`;
};

const generateBombs = function () {
  let bombloc = Math.floor(Math.random() * (dimension * dimension - 1));

  let loc = document.getElementById(bombloc.toString());
  if (!loc.classList.contains("bomb")) {
    loc.classList.add("bomb");
    loc.classList.remove("flag");
  } else {
    // if the cell already has a bomb call the function again
    generateBombs();
  }
  flagUpdater();
};

const gameOver = function () {
  if (gameOn) {
    for (let i = 0; i < dimension * dimension; i++) {
      let loc = document.getElementById(i.toString());
      if (loc.classList.contains("bomb")) {
        loc.innerHTML = bombIcon;
        loc.classList.remove("flag");
        loc.classList.add("checked");
        loc.style.backgroundColor = "red";
        gameOn = false;
      }
      if (loc.classList.contains("valid")) {
      }
    }

    document.getElementById("modalHead").innerHTML = "Game Over";
    document.getElementById(
      "scoreModal"
    ).innerHTML = `Your Score is: ${scoreClick}.`;
    document.getElementById("modalText").innerHTML = "You lose!!";
    modalButton.click();
  }
  flagUpdater();
};

const handleClick = function (cell) {
  if (cell.classList.contains("valid") && gameOn && !cell.selected) {
    cell.selected = true;
    cell.classList.add("checked");

    scoreClick++;
    score.innerHTML = `Score: ${scoreClick}`;
  }
  if (scoreClick === 90) {
    numberOfBombsAddjacent(cell);

    document.getElementById("modalHead").innerHTML = "Congratulations";

    document.getElementById("modalText").innerHTML = "You have won the Game!!";
    modalButton.click();
    document.getElementById(
      "scoreModal"
    ).innerHTML = `Your Score is: ${scoreClick}.`;
    gameOn = false;
    score.innerHTML = `Score: ${scoreClick}`;

    console.log("Congratulations you won the game!");
  }
  if (cell.classList.contains("valid") && gameOn) {
    numberOfBombsAddjacent(cell);
  }
  if (cell.classList.contains("bomb")) {
    gameOver();
  }
  flagUpdater();
};

const setNormal = function () {
  for (let i = 0; i < dimension * dimension; i++) {
    let loc = document.getElementById(i.toString());
    if (!loc.classList.contains("bomb")) {
      loc.classList.add("valid");
    }
  }
};

const initGame = () => {
  count = 0;
  scoreClick = 0;
  flagCount = 0;
  gameOn = true;
  score.innerHTML = `Score: ${scoreClick}`;

  let gameContainer = document.getElementById("game-container");

  for (let i = 0; i < dimension; i++) {
    let row = document.createElement("div");
    row.className = "row";
    for (let j = 0; j < dimension; j++) {
      let cell = document.createElement("div");
      cell.addEventListener("click", () => handleClick(cell, i, j));
      cell.addEventListener(
        "contextmenu",
        function (event) {
          event.preventDefault();
          if (!cell.selected && gameOn && !cell.classList.contains("flag")) {
            cell.classList.add("flag");
            cell.innerHTML = `<span style="color:red;">!</span>`;
          } else if (
            !cell.selected &&
            gameOn &&
            cell.classList.contains("flag")
          ) {
            cell.classList.remove("flag");
            cell.innerHTML = "";
          }
          flagUpdater();
          return false;
        },
        false
      );
      cell.className = "cell";
      cell.data = 0;
      cell.id = count.toString();
      row.appendChild(cell);
      count++;
    }
    gameContainer.appendChild(row);
  }
  for (let i = 0; i < 10; i++) {
    generateBombs();
  }
  setNormal();
  flagUpdater();
};

restartButton.addEventListener("click", () => {
  document.getElementById("game-container").innerHTML = "";

  initGame();

  closeButton.click();
});

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});
