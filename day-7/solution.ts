type Point = [number, number];

export class Solution {
  private grid: string[][];

  private readonly SPLITTER = "^";
  private readonly STARTING_POINT = "S";

  constructor(inp: string) {
    this.grid = inp
      .trim()
      .split("\n")
      .map((row) => row.split(""));
  }

  getSolution(): number {
    // return this.firstSolution(this.grid);
    return this.firstAdvSolution(this.grid);
  }

  private firstSolution(grid: string[][]): number {
    const alreadyVisitedSplitters = new Map<string, boolean>();

    const addToMap = (idx: Point) => {
      alreadyVisitedSplitters.set(`${idx[0]}, ${idx[1]}`, true);
    };

    const isInMap = (idx: Point) =>
      alreadyVisitedSplitters.has(`${idx[0]}, ${idx[1]}`);

    const propagateBeam = (startingPoint: Point) => {
      if (!this.isInBounds(startingPoint)) return;

      const splitPoint = this.getFirstSplitterBelow(startingPoint);
      if (splitPoint === null || isInMap(splitPoint)) return;

      addToMap(splitPoint);
      const [xSplit, ySplit] = splitPoint;
      propagateBeam([xSplit - 1, ySplit]);
      propagateBeam([xSplit + 1, ySplit]);
    };

    const start = this.getStartingPoint();
    propagateBeam(start);
    return alreadyVisitedSplitters.size;
  }

  private firstAdvSolution(grid: string[][]): number {
    const alreadyVisitedSplitters = new Map<string, number>();

    const addToMap = (idx: Point, branchCount: number) => {
      alreadyVisitedSplitters.set(`${idx[0]}, ${idx[1]}`, branchCount);
    };

    const isInMap = (idx: Point) =>
      alreadyVisitedSplitters.has(`${idx[0]}, ${idx[1]}`);

    const getFromMap = (idx: Point) =>
      alreadyVisitedSplitters.get(`${idx[0]}, ${idx[1]}`);

    const propagateBeam = (startingPoint: Point): number => {
      if (!this.isInBounds(startingPoint)) return 0;
      if (isInMap(startingPoint)) {
        return getFromMap(startingPoint)!;
      }

      const splitPoint = this.getFirstSplitterBelow(startingPoint);
      if (splitPoint === null) {
        return 1;
      }
      const [xSplit, ySplit] = splitPoint;
      const l = propagateBeam([xSplit - 1, ySplit]);
      const r = propagateBeam([xSplit + 1, ySplit]);
      addToMap(startingPoint, l + r);
      return l + r;
    };

    const start = this.getStartingPoint();
    const res = propagateBeam(start);
    return res;
  }

  private getFirstSplitterBelow(idx: Point): Point | null {
    let [x, y] = idx;
    y++;
    const point: Point = [x, y];
    while (this.isInBounds(point)) {
      if (this.getEl(point) === this.SPLITTER) {
        return point;
      }
      point[1]++;
    }

    return null;
  }

  private getStartingPoint(): Point {
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        if (this.getEl([x, y]) === this.STARTING_POINT) return [x, y];
      }
    }

    throw new Error("Starting point not found");
  }

  private isInBounds(idx: Point): boolean {
    const [x, y] = idx;
    return y >= 0 && y < this.grid.length && x >= 0 && x < this.grid[y].length;
  }

  private getEl(idx: Point): string {
    const [x, y] = idx;
    return this.grid[y][x];
  }
}
