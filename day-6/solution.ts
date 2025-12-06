import { trimSuffix } from "../utils/trim";

type Problem = [number[], Operation];
type Operation = "*" | "+";

export class Solution {
  constructor(private inp: string) {}

  getSolution(): number {
    // return this.getFirstSolution(this.inp);
    return this.getFirstAdvSolution(this.inp);
  }

  private getFirstSolution(inp: string): number {
    const problems = this.parseFirstInput(inp);

    let res = 0;
    for (const problem of problems) {
      const fn = this.getMathOperation(problem[1]);
      res += fn(problem[0]);
    }

    return res;
  }

  private getFirstAdvSolution(inp: string): number {
    const problems = this.parseFirstAdvInput(inp);

    let res = 0;
    for (const problem of problems) {
      console.log({ problem });
      const fn = this.getMathOperation(problem[1]);
      res += fn(problem[0]);
    }

    return res;
  }

  private parseFirstInput(inp: string): Problem[] {
    let problems: Problem[] = [];
    const rows = inp.trim().split("\n");
    for (let r = 0; r < rows.length; r++) {
      const data = rows[r]
        .split(" ")
        .map((c) => c.trim())
        .filter((c) => c !== "");

      if (r === 0) {
        problems = Array.from(
          { length: data.length },
          () => [[], "+"] as Problem
        );
      }

      const isOpsRow = isNaN(parseInt(data[0]));
      if (isOpsRow) {
        for (let i = 0; i < data.length; i++) {
          problems[i][1] = data[i] as Operation;
        }
        continue;
      }
      for (let i = 0; i < data.length; i++) {
        problems[i][0].push(parseInt(data[i]));
      }
    }

    return problems;
  }

  private getMathOperation(op: Operation): (nums: number[]) => number {
    let callbackFunc: (p: number, c: number) => number;
    switch (op) {
      case "*":
        callbackFunc = (acc: number, cur: number) => acc * cur;
        break;
      case "+":
        callbackFunc = (acc: number, cur: number) => acc + cur;
        break;
    }
    return (nums: number[]) => nums.reduce(callbackFunc);
  }

  private parseFirstAdvInput(inp: string): Problem[] {
    const res: Problem[] = [];
    inp = trimSuffix(inp, "\n");

    const rows = inp.split("\n");
    const colLen = rows[0].length;

    let numbers: number[] = [];
    let op: Operation = "+";
    const flush = () => {
      if (numbers.length > 0) {
        res.push([numbers, op]);
      }
      numbers = [];
    };
    for (let c = 0; c < colLen; c++) {
      let col = this.getCol(rows, c).trim();
      if (col === "") {
        // Flush
        flush();
        continue;
      }

      if (isNaN(parseInt(col[col.length - 1]))) {
        // Has a symbol in the end
        op = col[col.length - 1] as Operation;
        col = col.slice(0, col.length - 1);
      }

      numbers.push(parseInt(col));
    }

    flush();
    return res;
  }

  private getCol(charGrid: string[], c: number): string {
    let res = "";
    for (let r = 0; r < charGrid.length; r++) res += charGrid[r][c];
    return res;
  }
}
