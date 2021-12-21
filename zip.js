const fs = require("fs");
const archiver = require("archiver");

const output = fs.createWriteStream(__dirname + "/build.zip");
const archive = archiver("zip", { zlib: { level: 9 } });
archive.pipe(output);

archive.glob("**", {
  cwd: __dirname,
  dot: true,
  ignore: [
    ".git/**",
    "node_modules/**",
    ".vscode/**",
    "__test__/**",
    "build.zip",
  ],
});
archive.finalize();
