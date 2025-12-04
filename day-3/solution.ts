export class Solution {
  private readonly batteryPacks: string[][];
  constructor(inp: string) {
    this.batteryPacks = inp
      .trim()
      .split("\n")
      .map((el) => el.split(""));
  }

  getSolution(): number {
    // return this.getFirstSolution(this.batteryPacks);
    // return this.getFirstSolution(["234234234234278".split("")]);
    return this.getFirstAdvSolution(this.batteryPacks);
    // return this.getFirstAdvSolution(["234234234234278".split("")]);
  }

  private getFirstSolution(batteryPacks: string[][]): number {
    let totalVoltage = 0;
    for (const pack of batteryPacks) {
      let maxNum: number = parseInt(
        pack[pack.length - 2] + pack[pack.length - 1]
      );
      const maxLArr: string[] = [];
      for (let i = 0; i < pack.length; i++) {
        if (i == 0) {
          maxLArr.push(pack[i]);
        } else {
          maxLArr.push(
            String.fromCharCode(
              Math.max(
                maxLArr[maxLArr.length - 1].charCodeAt(0),
                pack[i].charCodeAt(0)
              )
            )
          );
        }
      }

      let curMaxRight = pack[pack.length - 1];
      for (let i = pack.length - 2; i >= 0; i--) {
        const num = parseInt(maxLArr[i] + curMaxRight);
        maxNum = Math.max(maxNum, num);
        curMaxRight = String.fromCharCode(
          Math.max(curMaxRight.charCodeAt(0), pack[i].charCodeAt(0))
        );
      }

      totalVoltage += maxNum;
    }

    return totalVoltage;
  }

  private getFirstAdvSolution(batteryPacksStr: string[][]): number {
    const batteryPacks = batteryPacksStr.map((pack) =>
      pack.map((n) => parseInt(n))
    );
    let totalVoltage = 0;
    const N = 12;
    for (const pack of batteryPacks) {
      const resPtrs: number[] = Array.from({ length: N });
      if (pack.length < N) continue;

      for (let i = 0; i < N; i++) {
        if (i === 0) {
          // First ptr
          const searchArea = [0, pack.length - N];
          const maxPtrIdx = this.getMaxElIndex(
            pack,
            searchArea[0],
            searchArea[1]
          );
          resPtrs[i] = maxPtrIdx;
          continue;
        }

        const searchArea = [resPtrs[i - 1] + 1, pack.length - (N - i)];
        const maxPtrIdx = this.getMaxElIndex(
          pack,
          searchArea[0],
          searchArea[1]
        );
        resPtrs[i] = maxPtrIdx;
      }

      totalVoltage += parseInt(resPtrs.map((ptrIdx) => pack[ptrIdx]).join(""));
    }

    return totalVoltage;
  }

  private getMaxElIndex(arr: number[], l: number, r: number): number {
    let maxEl = arr[l],
      maxElIdx = l;
    for (let i = l; i <= r; i++) {
      if (arr[i] > maxEl) {
        maxEl = arr[i];
        maxElIdx = i;
      }
    }

    return maxElIdx;
  }
}
