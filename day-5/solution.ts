type Range = [number, number];

export class Solution {
  private readonly freshRanges: Range[];
  private readonly ingredients: number[];

  constructor(inp: string) {
    const [rangesStr, ingrStr] = inp.trim().split("\n\n");
    this.freshRanges = rangesStr
      .trim()
      .split("\n")
      .map((r) => r.split("-").map((el) => parseInt(el)) as Range);
    this.ingredients = ingrStr
      .trim()
      .split("\n")
      .map((r) => parseInt(r));
  }

  getSolution(): number {
    // return this.getFirstSolution(this.freshRanges, this.ingredients).length;
    return this.getFirstAdvSolution(this.freshRanges);
  }

  private getFirstSolution(
    freshRanges: Range[],
    ingredientIds: number[]
  ): number[] {
    const res: number[] = [];

    const sortedRanges = [...freshRanges];
    sortedRanges.sort((a, b) => {
      if (a[0] !== b[0]) return a[0] - b[0];
      return a[1] - b[1];
    });

    igrLoop: for (const id of ingredientIds) {
      let curRangeIdx = 0;
      while (
        curRangeIdx < sortedRanges.length &&
        sortedRanges[curRangeIdx][0] <= id
      ) {
        const curRange = sortedRanges[curRangeIdx];
        if (curRange[1] >= id) {
          res.push(id);
          continue igrLoop;
        }

        curRangeIdx++;
      }
    }

    return res;
  }

  private getFirstAdvSolution(freshRanges: Range[]): number {
    let res = 0;

    const sortedRanges = [...freshRanges];
    sortedRanges.sort((a, b) => {
      if (a[0] !== b[0]) return a[0] - b[0];
      return a[1] - b[1];
    });

    let lastIgrId: number = Infinity;

    const addToAllIgrs = (range: Range) => {
      res += range[1] - range[0] + 1;
      lastIgrId = range[1];
    };

    for (let i = 0; i < sortedRanges.length; i++) {
      const curRange = sortedRanges[i];
      if (i === 0) {
        addToAllIgrs(curRange);
        continue;
      }

      if (curRange[0] > lastIgrId) {
        addToAllIgrs(curRange);
        continue;
      }

      if (curRange[0] <= lastIgrId) {
        if (curRange[1] > lastIgrId) {
          addToAllIgrs([lastIgrId + 1, curRange[1]]);
          continue;
        }
      }
    }

    return res;
  }
}
