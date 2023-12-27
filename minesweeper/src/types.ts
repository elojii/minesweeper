export type Tile = {
    element: HTMLDivElement;
    x: number;
    y: number;
    mine: boolean;
    status: string | undefined;
  };
  
export  type Position = {
    x: number;
    y: number;
  };