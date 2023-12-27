import {
  TILE_STATUSES,
  createBoard,
  markTile,
  revealTile,
  checkWin,
  checkLose,
} from "./minesweeper";
import { Tile } from "./types";

let BOARD_SIZE: number;
let NUMBER_OF_MINES: number;
let board: Tile[][] = [];
let lose: boolean;
let win: boolean;
const boardElement = document.querySelector(".board") as HTMLElement;
const minesLeftText = document.querySelector(
  "[data-mine-count]"
) as HTMLSpanElement;
const cSize = document.getElementById("cSize") as HTMLInputElement;
const cMines = document.getElementById("cMines") as HTMLInputElement;
const cCustom = document.getElementById("cCustom") as HTMLButtonElement;
const messagetext = document.querySelector(".subtext");
const easy = document.getElementById("easy") as HTMLButtonElement;
const medium = document.getElementById("medium") as HTMLButtonElement;
const hard = document.getElementById("hard") as HTMLButtonElement;
const custom = document.getElementById("custom") as HTMLButtonElement;

easy.addEventListener("click", () => {
  BOARD_SIZE = 10;
  NUMBER_OF_MINES = 10;
  messagetext!.textContent = "";
  cCustom.classList.remove("cCustom");
  resetGame(BOARD_SIZE, NUMBER_OF_MINES);
});

medium.addEventListener("click", () => {
  BOARD_SIZE = 20;
  NUMBER_OF_MINES = 20;
  messagetext!.textContent = "";
  resetGame(BOARD_SIZE, NUMBER_OF_MINES);
});

hard.addEventListener("click", () => {
  BOARD_SIZE = 25;
  NUMBER_OF_MINES = 99;
  messagetext!.textContent = "";
  resetGame(BOARD_SIZE, NUMBER_OF_MINES);
});

custom.addEventListener("click", () => {
  messagetext!.textContent = "";
  cSize.classList.toggle("cSize");
  cMines.classList.toggle("cMines");
  cCustom.classList.toggle("cCustom");
  resetGame(0, 0)
});

cCustom.addEventListener('click',()=>{
  const size = parseInt(cSize.value);
  const mines = parseInt(cMines.value);
  console.log(size)
  if (!isNaN(size) && !isNaN(mines)) {
    resetGame(size, mines);
  }

})

const resetGame = (BOARD_SIZE: number, NUMBER_OF_MINES: number) => {
  lose = false;
  win = false;
  chooseDifficulty(BOARD_SIZE, NUMBER_OF_MINES);
};

const chooseDifficulty = (BOARD_SIZE: number, NUMBER_OF_MINES: number) => {
  boardElement.innerHTML = "";
  board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
  boardElement.style.setProperty("--size", BOARD_SIZE.toString());
  minesLeftText.textContent = NUMBER_OF_MINES.toString();
  board.forEach((row) => {
    row.forEach((tile) => {
      boardElement.append(tile.element);
      tile.element.addEventListener("click", () => {
        if (!win && !lose) {
          revealTile(board, tile);
          checkGameEnd();
        }
      });
      tile.element.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (!win && !lose) {
          markTile(tile);
          listMinesLeft();
        }
      });
    });
  });
};

const listMinesLeft = () => {
  const markedTilesCount = board.reduce((count, row) => {
    return (
      count + row.filter((tile) => tile.status === TILE_STATUSES.MARKED).length
    );
  }, 0);

  minesLeftText.textContent = (NUMBER_OF_MINES - markedTilesCount).toString();
};

const checkGameEnd = () => {
  lose = checkLose(board);
  win = checkWin(board);

  if (win || lose) {
    boardElement.removeEventListener("click", stopProp);
    boardElement.removeEventListener("contextmenu", stopProp);
  }

  if (win) {
    messagetext!.textContent = "Перемога";
  }

  if (lose) {
    messagetext!.textContent = "Програш";
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.status === TILE_STATUSES.MARKED) markTile(tile);
        if (tile.mine) revealTile(board, tile);
      });
    });
  }
};

const stopProp = (e: MouseEvent) => {
  e.stopImmediatePropagation();
};
