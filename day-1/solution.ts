import { positiveModulo } from "../utils/math";

type Direction = "L" | "R";

export class Solution {
  private currRotation = 50;
  private readonly TOTAL_ROTATIONS = 100;

  constructor(private inputStr: string) {}

  getSolution(): number {
    // return this.firstSolution();
    return this.firstAdvSolution();
  }

  private firstAdvSolution(): number {
    const data = this.inputStr.trim().split("\n");
    let zeroRotationCount = 0;
    for (const rotation of data) {
      const [dir, num] = this.parseRow(rotation);

      const willGoZero = this.checkForZeroDuringRotation(dir, num);
      zeroRotationCount += willGoZero;
      this.currRotation = this.rotate(dir, num);
    }
    return zeroRotationCount;
  }

  private firstSolution(): number {
    const data = this.inputStr.trim().split("\n");
    let zeroRotationCount = 0;
    for (const rotation of data) {
      const [dir, num] = this.parseRow(rotation);

      this.currRotation = this.rotate(dir, num);
      if (this.currRotation === 0) zeroRotationCount++;
    }

    return zeroRotationCount;
  }

  private parseRow(str: string): [Direction, number] {
    return [str[0] as Direction, parseInt(str.slice(1))];
  }

  private rotate(dir: Direction, amount: number): number {
    if (dir === "L")
      return positiveModulo(this.currRotation - amount, this.TOTAL_ROTATIONS);
    else
      return positiveModulo(this.currRotation + amount, this.TOTAL_ROTATIONS);
  }

  private checkForZeroDuringRotation(dir: Direction, amount: number): number {
    let totalZeros = 0;
    const totalRotations = Math.floor(amount / this.TOTAL_ROTATIONS);
    totalZeros = totalRotations;
    const remainingRotations = positiveModulo(amount, this.TOTAL_ROTATIONS);
    if (remainingRotations === 0 || this.currRotation === 0) return totalZeros;
    if (dir === "L") {
      if (this.currRotation - remainingRotations <= 0) totalZeros++;
    } else {
      if (this.currRotation + remainingRotations >= this.TOTAL_ROTATIONS)
        totalZeros++;
    }

    return totalZeros;
  }
}
