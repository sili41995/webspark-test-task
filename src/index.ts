// types
export interface IPoint {
  x: number;
  y: number;
}

export type Points = IPoint[];

export type Strings = string[];

export interface IGridNavigatorProps {
  gridList: Strings;
  start: IPoint;
  end: IPoint;
}

// constants
const refs = { resultElement: document.getElementById('result') };

const directions = [
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: -1 },
  { x: -1, y: 1 },
  { x: 1, y: -1 },
  { x: 1, y: 1 },
];

// services
class GridNavigator {
  private grid: Strings[];
  private start: IPoint;
  private end: IPoint;

  constructor({ end, gridList, start }: IGridNavigatorProps) {
    this.grid = gridList.map((row) => row.split(''));
    this.start = start;
    this.end = end;
  }

  private isValid(point: IPoint): boolean {
    const { x, y } = point;

    return x >= 0 && y >= 0 && x < this.grid.length && y < this.grid[0].length && this.grid[x][y] === '.';
  }

  private getNeighbors(point: IPoint): Points {
    const neighbors: Points = [];

    for (const item of directions) {
      const x = point.x + item.x;
      const y = point.y + item.y;

      if (this.isValid({ x, y })) {
        neighbors.push({ x, y });
      }
    }

    return neighbors;
  }

  public findShortestPath(): Points {
    const queue: { point: IPoint; path: Points }[] = [{ point: this.start, path: [this.start] }];
    const visited = new Set<string>();
    visited.add(`${this.start.x},${this.start.y}`);

    while (queue.length > 0) {
      const { point, path } = queue.shift()!;

      if (point.x === this.end.x && point.y === this.end.y) {
        return path;
      }

      for (const neighbor of this.getNeighbors(point)) {
        const key = `${neighbor.x},${neighbor.y}`;
        if (!visited.has(key)) {
          visited.add(key);
          queue.push({ point: neighbor, path: [...path, neighbor] });
        }
      }
    }

    return [];
  }
}

export default GridNavigator;

// utils
function runner(gridList: Strings, start: IPoint, end: IPoint): Points {
  const navigator = new GridNavigator({ gridList, start, end });
  return navigator.findShortestPath();
}

function renderResult(result: Points) {
  if (refs.resultElement) {
    refs.resultElement.textContent = JSON.stringify(result);
  }
}

// script
const result = runner(['.X.', '.X.', '...'], { x: 2, y: 1 }, { x: 0, y: 2 });

renderResult(result);
