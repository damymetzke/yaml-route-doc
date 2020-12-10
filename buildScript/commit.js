const { spawn } = require("child_process");

function spawnAndResolve(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["ignore", process.stdout, process.stderr],
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
  await spawnAndResolve("npm", ["run", "build"]);
  await spawnAndResolve("npm", ["run", "lint"]);
  await spawnAndResolve("npm", ["run", "lint-prettier"]);
  await spawnAndResolve("git", ["commit", "-v"]);
}

run();
