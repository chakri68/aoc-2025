export class Solution {
  private readonly grid: string[][];
  private readonly PAPER_ROLL = "@";
  private readonly EMPTY_SPACE = ".";

  constructor(inp: string) {
    this.grid = inp
      .trim()
      .split("\n")
      .map((row) => row.trim().split(""));
  }

  getSolution(): number {
    // return this.getFirstSolution(this.grid);
    return this.getFirstAdvSolution(this.grid);
  }

  private getFirstSolution(grid: string[][]): number {
    return this.getAccessibleRolls(grid).length;
  }

  private getAccessibleRolls(grid: string[][]): [number, number][] {
    const accessibleRolls: [number, number][] = [];
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (
          this.getSurroundingPaperRolls(grid, i, j) < 4 &&
          grid[i][j] === this.PAPER_ROLL
        ) {
          accessibleRolls.push([i, j]);
        }
      }
    }

    return accessibleRolls;
  }

  // DFS
  private getFirstAdvSolution(grid: string[][]): number {
    let accessibleRolls = this.getAccessibleRolls(grid);
    let res = 0;

    const checkAndRemoveRoll = (grid: string[][], row: number, col: number) => {
      if (grid[row][col] === this.EMPTY_SPACE) return;
      res++;
      grid[row][col] = this.EMPTY_SPACE;
      for (const [r, c] of this.getSurroundingBoxes(grid, row, col)) {
        if (
          grid[r][c] === this.PAPER_ROLL &&
          this.getSurroundingPaperRolls(grid, r, c) < 4
        ) {
          checkAndRemoveRoll(grid, r, c);
        }
      }
    };

    for (const [r, c] of accessibleRolls) {
      checkAndRemoveRoll(grid, r, c);
    }

    return res;
  }

  private getSurroundingPaperRolls(
    grid: string[][],
    row: number,
    col: number
  ): number {
    let res = 0;
    for (const [r, c] of this.getSurroundingBoxes(grid, row, col)) {
      if (grid[r][c] === this.PAPER_ROLL) res++;
    }

    return res;
  }

  private isInbounds(grid: string[][], row: number, col: number): boolean {
    return row < grid.length && row >= 0 && col >= 0 && col < grid[row].length;
  }

  private getSurroundingBoxes(
    grid: string[][],
    row: number,
    col: number
  ): [number, number][] {
    const DIRS = [-1, 0, 1];
    return DIRS.flatMap((rowDir) =>
      DIRS.map((colDir) => {
        if (!this.isInbounds(grid, row + rowDir, col + colDir)) return null;
        if (rowDir === 0 && colDir === 0) return null;
        return [row + rowDir, col + colDir] as [number, number];
      })
    ).filter((el) => el !== null);
  }
}
