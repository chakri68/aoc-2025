type Range = [string, string];

export class Solution {
  private ranges: Range[];

  constructor(inp: string) {
    this.ranges = inp
      .trim()
      .split(",")
      .map((s) => s.trim())
      .map((s) => s.split("-").map((el) => parseInt(el).toString()) as Range);
  }

  getSolution() {
    // return this.firstAdvSolution([["2", "17"]]);
    return this.firstAdvSolution(this.ranges);
    // return this.firstSolution(this.ranges);
  }

  private firstAdvSolution(data: Range[]): number {
    const visitedNums = new Set<number>();
    let result = 0;
    const resMap = new Map<Range, number[]>();
    for (const range of data) {
      const [l, r] = range;
      const [lNum, rNum] = range.map((el) => parseInt(el));
      const resArr = [];

      for (
        let repeatLen = 1;
        repeatLen <= Math.floor(r.length / 2);
        repeatLen++
      ) {
        let firstNum = this.getFirstNumber(lNum, repeatLen);
        while (firstNum <= rNum) {
          if (visitedNums.has(firstNum)) {
            firstNum = this.getNextNumber(firstNum, repeatLen);
            continue;
          }
          visitedNums.add(firstNum);
          result += firstNum;
          resArr.push(firstNum);
          firstNum = this.getNextNumber(firstNum, repeatLen);
        }
      }
      resMap.set(
        range,
        resArr.sort((a, b) => a - b)
      );
    }

    console.log(JSON.stringify(Object.fromEntries(resMap)));
    return result;
  }

  // FIX THIS FUNCTION TO RETURN SMALLEST REPEATING NUMBER > l
  private getFirstNumber(l: number, repeatingPartLen: number): number {
    const num = l.toString();
    if (num.length === 1) return 11;
    const numParts = Math.ceil(num.length / repeatingPartLen);
    let part: string;
    if (num.length % repeatingPartLen !== 0) {
      part = Math.pow(10, repeatingPartLen - 1).toString();
    } else {
      part = num.slice(0, repeatingPartLen);
    }
    const firstNum = parseInt(this.repeat(part, numParts));
    // console.log({ firstNum, repeatingPartLen, l, part });
    if (firstNum < l) {
      return this.getNextNumber(firstNum, repeatingPartLen);
    }

    return firstNum;
  }

  private getNextNumber(n: number, repeatingPartLen: number): number {
    const num = n.toString();
    const numParts = Math.floor(num.length / repeatingPartLen);
    const smolPart = num.slice(0, repeatingPartLen);

    // console.log({ smolPart, n });

    const nextSmolPart = (parseInt(smolPart) + 1).toString();
    if (nextSmolPart.length > smolPart.length) {
      const newSmolPart = Math.pow(10, repeatingPartLen - 1).toString();
      return parseInt(this.repeat(newSmolPart, numParts + 1));
    }

    return parseInt(this.repeat(nextSmolPart, numParts));
  }

  private firstSolution(data: Range[]): number {
    let result = 0;

    rangeLoop: for (const range of data) {
      const [l, r] = range;
      const [lNum, rNum] = range.map((n) => parseInt(n));

      for (
        let numLen = 2 * Math.ceil(l.length / 2);
        numLen <= 2 * Math.floor(r.length / 2);
        numLen += 2
      ) {
        let startNum = Math.max(Math.pow(10, numLen - 1), lNum);
        startNum = this.makeRepeatedNum(startNum);
        while (startNum <= rNum) {
          console.log({ num: startNum });
          result += startNum;
          try {
            startNum = this.increaseNum(startNum);
          } catch (err) {
            continue rangeLoop;
          }
        }
      }
    }

    return result;
  }

  private increaseNum(num: number): number {
    const len = num.toString().length / 2;
    const newNum = num + 1 + Math.pow(10, len);
    if (newNum.toString().length > len * 2)
      throw new Error("Can't be incremented");
    return newNum;
  }

  private makeRepeatedNum(num: number): number {
    const s = num.toString();
    const len = s.length / 2;
    const p1 = s.slice(0, len);
    const p2 = s.slice(len);

    if (parseInt(p2) > parseInt(p1)) {
      const selectedPart = (parseInt(p1) + 1).toString();
      return parseInt(selectedPart + selectedPart);
    }

    return parseInt(p1 + p1);
  }

  private repeat(str: string, n: number): string {
    return Array.from({ length: n }, () => str).join("");
  }
}
