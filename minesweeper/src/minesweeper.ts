import { Tile, Position } from "./types";
export const TILE_STATUSES = {
  HIDDEN: "hidden",
  MINE: "mine",
  NUMBER: "number",
  MARKED: "marked",
};
export const createBoard = (boardSize: number, numberOfMines: number) => {
  const board: Tile[][] = [];
  const minePosition = getMinePositions(boardSize, numberOfMines);
  for (let x = 0; x < boardSize; x++) {
    const row: Tile[] = [];
    for (let y = 0; y < boardSize; y++) {
      const element = document.createElement("div") as HTMLDivElement;
      element.dataset.status = TILE_STATUSES.HIDDEN;
      const tile: Tile = {
        element,
        x,
        y,
        mine: minePosition.some((p) => p.x === x && p.y === y),
        get status() {
          return this.element.dataset.status;
        },
        set status(value) {
          this.element.dataset.status = value;
        },
      };
      row.push(tile);
    }
    board.push(row);
  }
  return board;
};

const getMinePositions = (boardSize: number, numberOfMines: number) => {
  const positions: Position[] = [];

  while (positions.length < numberOfMines) {
    const position: Position = {
      x: randomNumber(boardSize),
      y: randomNumber(boardSize),
    };
    if (!positions.some((p) => positionMatch(p, position))) {
      positions.push(position);
    }
  }
  return positions;
};

const positionMatch = (a: Position, b: Position) => {
  return a.x === b.x && a.y === b.y;
};

const randomNumber = (size: number): number => {
  return Math.floor(Math.random() * size);
};

export const markTile = (tile: Tile) => {
  if (
    tile.status !== TILE_STATUSES.HIDDEN &&
    tile.status !== TILE_STATUSES.MARKED
  )
    return;
  if (tile.status === TILE_STATUSES.MARKED) {
    tile.status = TILE_STATUSES.HIDDEN;
  } else {
    tile.status = TILE_STATUSES.MARKED;
  }
};

export const revealTile = (board: Tile[][], tile: Tile) => {
  if (tile.status !== TILE_STATUSES.HIDDEN) return;
  if (tile.mine) {
    tile.status = TILE_STATUSES.MINE;
    return;
  }
  tile.status = TILE_STATUSES.NUMBER;
  const adjacentTiles = nearByTiles(board, tile);
  const mines = adjacentTiles.filter((t) => t.mine);
  if (mines.length === 0) {
    adjacentTiles.forEach((tile) => revealTile(board, tile));
  } else {
    tile.element.textContent = mines.length.toString();
  }
  if (tile.status === TILE_STATUSES.MINE) {
  }
};

const nearByTiles = (board: Tile[][], { x, y }: Tile): Tile[] => {
  const tiles = [];
  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = board[x + xOffset]?.[y + yOffset];
      if (tile) tiles.push(tile);
    }
  }
  return tiles;
};

export const checkWin = (board: Tile[][]) => {
  return board.every((row) => {
    return row.every((tile) => {
      return (
        tile.status === TILE_STATUSES.NUMBER ||
        (tile.mine &&
          (tile.status === TILE_STATUSES.HIDDEN ||
            tile.status === TILE_STATUSES.MARKED))
      );
    });
  });
};

export const checkLose = (board: Tile[][]) => {
  return board.some((row) => {
    return row.some((tile) => {
      return tile.status === TILE_STATUSES.MINE;
    });
  });
};
