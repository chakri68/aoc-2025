import fs from "fs";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const dayNum = process.argv[2];
  if (!dayNum) {
    console.error("Please provide a day number.");
    process.exit(1);
  }

  const dataDir = path.join(__dirname, "data", "day", dayNum);
  const inputFilePath = path.join(dataDir, "input.txt");

  // Fetch input if it doesn't exist
  if (!fs.existsSync(inputFilePath)) {
    console.log(`Fetching input for day ${dayNum}...`);
    const session = process.env.AOC_SESSION;
    if (!session) {
      console.error(
        "AOC_SESSION not found in .env file. Please add it to fetch inputs."
      );
      process.exit(1);
    }

    try {
      const response = await axios.get<string>(
        `https://adventofcode.com/2025/day/${dayNum}/input`,
        {
          headers: {
            Cookie: `session=${session}`,
            "User-Agent":
              "github.com/chakradharreddy/advent-of-code-2025 by chakridevireddy69@gmail.com", // Good practice for AOC
          },
          responseType: "text",
        }
      );

      fs.mkdirSync(dataDir, { recursive: true });
      // Usually AOC inputs have a trailing newline, keeping it is often safer or trimming it depends on preference.
      // I'll keep it as is to be faithful to the source, or maybe trim the *final* newline if it's just one.
      // Let's just save exactly what we get.
      fs.writeFileSync(inputFilePath, response.data);
      console.log(`Input saved to ${inputFilePath}`);
    } catch (error: any) {
      console.error("Error fetching input:", error.message);
      if (error.response) {
        console.error("Status:", error.response.status);
      }
      process.exit(1);
    }
  } else {
    console.log(`Using existing input file at ${inputFilePath}`);
  }

  // Run Solution
  const solutionDir = path.join(__dirname, `day-${dayNum}`);
  const solutionPath = path.join(solutionDir, "solution.ts");

  if (!fs.existsSync(solutionPath)) {
    console.error(`Solution file not found at ${solutionPath}`);
    process.exit(1);
  }

  try {
    const inputData = fs.readFileSync(inputFilePath, "utf-8");

    // Dynamic import of the solution class
    // We need to handle the default export or named export.
    // The prompt implies a named export or just "class Solution".
    // Let's assume named export "Solution" based on "creating an object of the class Solution".
    const module = await import(solutionPath);
    const Solution = module.Solution;

    if (!Solution) {
      console.error(`Class 'Solution' not exported from ${solutionPath}`);
      process.exit(1);
    }

    const solutionInstance = new Solution(inputData);
    console.log(`Running solution for Day ${dayNum}...`);
    const result = solutionInstance.getSolution();
    if (result !== undefined) {
      console.log("Result:", result);
    }
  } catch (error) {
    console.error("Error running solution:", error);
    process.exit(1);
  }
}

main();
