import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

async function compileVyper() {
  const contractPath = "contracts/AgentIdentity.vy";
  const bytecodeOutput = "contracts/AgentIdentity_bytecode.txt";
  const abiOutputDir = "src/contracts";
  const abiOutput = join(abiOutputDir, "AgentIdentity_abi.json");

  console.log(`Compiling ${contractPath}...`);

  try {
    // Generate Bytecode
    const bytecode = execSync(`python -m vyper -f bytecode ${contractPath}`, {
      encoding: "utf8",
    }).trim();
    writeFileSync(bytecodeOutput, bytecode);
    console.log(`Bytecode saved to ${bytecodeOutput}`);

    // Ensure ABI output directory exists
    if (!existsSync(abiOutputDir)) {
      mkdirSync(abiOutputDir, { recursive: true });
    }

    // Generate ABI
    const abi = execSync(`python -m vyper -f abi ${contractPath}`, {
      encoding: "utf8",
    }).trim();
    writeFileSync(abiOutput, abi);
    console.log(`ABI saved to ${abiOutput}`);

    console.log("Compilation successful!");
  } catch (error) {
    console.error("Compilation failed:");
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exit(1);
  }
}

compileVyper();
