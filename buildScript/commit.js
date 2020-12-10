const { spawn } = require("child_process");

function spawnAndResolve(title, command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["ignore", "pipe", "pipe"],
    });

    child.stdout.on("data", (data) => {
      console.log(`[${title}] ${data.toString().replace(/\n/g, "\n\t")}`);
    });
    child.stderr.on("data", (data) => {
      console.error(`[${title}] ${data}`);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      console.error(
        `command: '${command} ${args}' closed with exit code ${code}`
      );
      reject();
    });
  });
}

async function run() {
  await Promise.all([
    spawnAndResolve("build", "npm", ["run", "build"]),
    spawnAndResolve("eslint", "npm", ["run", "lint"]),
    spawnAndResolve("prettier", "npm", ["run", "lint-prettier"]),
  ]);
  await spawnAndResolve("git", "git", ["commit", "-v"]);
}

run();
