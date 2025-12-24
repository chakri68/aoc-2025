import util from "util";

type Point = [number, number, number];

// @ts-ignore
console._log = console.log;
console.log = (...data: any[]) =>
  // @ts-ignore
  console._log(
    util.inspect(data, {
      depth: null,
      colors: true,
    })
  );

export class Circuit {
  public readonly junctionBoxes: Set<number>;
  constructor(initialNodes: number[] = []) {
    this.junctionBoxes = new Set(initialNodes);
  }

  public addToCircuit(idx1: number, idx2: number) {
    const hasIdx1 = this.junctionBoxes.has(idx1);
    const hasIdx2 = this.junctionBoxes.has(idx2);

    if (hasIdx1 && hasIdx2)
      throw new Error(
        `Circuit already contains connection between ${idx1} and ${idx2}`
      );

    if (hasIdx1) {
      this.junctionBoxes.add(idx2);
    }

    if (hasIdx2) {
      this.junctionBoxes.add(idx1);
    }
  }

  get size() {
    return this.junctionBoxes.size;
  }
}

export class CircuitManager {
  public readonly circuits: Set<Circuit>;
  // Values are ptrs/refs
  private nodeToCircuitMap: Map<number, Circuit>;

  constructor(initialNodes: number[]) {
    this.nodeToCircuitMap = new Map();
    this.circuits = new Set(
      initialNodes.map((n) => {
        const c = new Circuit([n]);
        this.nodeToCircuitMap.set(n, c);
        return c;
      })
    );
  }

  public addConnection(idx1: number, idx2: number) {
    const c1 = this.nodeToCircuitMap.get(idx1)!;
    const c2 = this.nodeToCircuitMap.get(idx2)!;

    if (c1 === c2) {
      // Already in the same circuit, perfect
      return;
    }

    this.circuits.delete(c1);
    this.circuits.delete(c2);

    const newEls = [...c1.junctionBoxes.keys(), ...c2.junctionBoxes.keys()];
    const newCircuit = new Circuit(newEls);

    for (const el of newEls) {
      this.nodeToCircuitMap.set(el, newCircuit);
    }

    this.circuits.add(newCircuit);
  }
}

export class Solution {
  readonly junctionBoxes: Point[];
  private distances: number[][] | null = null;

  private readonly PAIRS_TO_CONSIDER = 1000;
  private readonly NUM_LARGEST_CIRCUITS = 3;

  constructor(inp: string) {
    this.junctionBoxes = inp
      .trim()
      .split("\n")
      .map((r) => r.split(",").map((el) => parseInt(el)) as Point);
  }

  getSolution(): number {
    // return this.getFirstSolution(this.junctionBoxes);
    return this.getFirstAdvSolution(this.junctionBoxes);
  }

  private getFirstSolution(points: Point[]): number {
    const n = points.length;
    // Get all the distances
    const distances: { pt1: number; pt2: number; distance: number }[] = [];

    for (let y = 0; y < n; y++) {
      for (let x = y + 1; x < n; x++) {
        distances.push({
          pt1: y,
          pt2: x,
          distance: this.getSquaredDistancePts(y, x),
        });
      }
    }

    // Sort the distances
    distances.sort((a, b) => a.distance - b.distance);

    const cm = new CircuitManager(Array.from({ length: n }, (_, idx) => idx));
    for (let i = 0; i < this.PAIRS_TO_CONSIDER; i++) {
      const { pt1, pt2 } = distances[i];
      cm.addConnection(pt1, pt2);
    }

    const cSizes = [...cm.circuits.keys()].map((c) => c.size);
    cSizes.sort((a, b) => b - a);
    return cSizes
      .slice(0, this.NUM_LARGEST_CIRCUITS)
      .reduce((acc, s) => acc * s);
  }

  private getFirstAdvSolution(points: Point[]): number {
    const n = points.length;
    // Get all the distances
    const distances: { pt1: number; pt2: number; distance: number }[] = [];

    for (let y = 0; y < n; y++) {
      for (let x = y + 1; x < n; x++) {
        distances.push({
          pt1: y,
          pt2: x,
          distance: this.getSquaredDistancePts(y, x),
        });
      }
    }

    // Sort the distances
    distances.sort((a, b) => a.distance - b.distance);

    const cm = new CircuitManager(Array.from({ length: n }, (_, idx) => idx));
    for (let i = 0; i < distances.length; i++) {
      const { pt1, pt2 } = distances[i];
      cm.addConnection(pt1, pt2);
      if (cm.circuits.size === 1) {
        return points[pt1][0] * points[pt2][0];
      }
    }

    throw new Error("Circuit couldn't be completed");
  }

  private computeDistanceGrid(points: Point[]): number[][] {
    const n = points.length;
    const res = Array.from({ length: n }, () =>
      Array.from({ length: n }, () => 0)
    );
    // Only fill the top half
    for (let y = 0; y < n; y++) {
      for (let x = y; x < n; x++) {
        res[y][x] = this.getSquaredDistance(points[y], points[x]);
      }
    }

    return res;
  }

  private getSquaredDistancePts(idx1: number, idx2: number): number {
    if (this.distances === null) {
      this.distances = this.computeDistanceGrid(this.junctionBoxes);
    }

    const y = Math.min(idx1, idx2);
    const x = Math.max(idx1, idx2);
    return this.distances[y][x];
  }

  private getSquaredDistance(pt1: Point, pt2: Point): number {
    const [x1, y1, z1] = pt1;
    const [x2, y2, z2] = pt2;
    return (
      (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2)
    );
  }
}
