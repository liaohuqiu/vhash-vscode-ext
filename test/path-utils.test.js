const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");

const { getFileOrDirectoryName, getPathRelativeToHome } = require("../dist/path-utils");

test("returns a path relative to home", () => {
  const homePath = path.join(path.parse(process.cwd()).root, "Users", "demo");
  const filePath = path.join(homePath, "git", "project", "src", "app.ts");
  assert.equal(getPathRelativeToHome(filePath, homePath), path.join("git", "project", "src", "app.ts"));
});

test("returns dot for the home directory", () => {
  const homePath = path.join(path.parse(process.cwd()).root, "Users", "demo");
  assert.equal(getPathRelativeToHome(homePath, homePath), ".");
});

test("rejects a path outside home", () => {
  const rootPath = path.parse(process.cwd()).root;
  assert.equal(getPathRelativeToHome(path.join(rootPath, "tmp", "app.ts"), path.join(rootPath, "Users", "demo")), undefined);
});

test("returns a file or directory basename", () => {
  assert.equal(getFileOrDirectoryName(path.join("git", "project", "src", "app.ts")), "app.ts");
  assert.equal(getFileOrDirectoryName(path.join("git", "project", "src")), "src");
});
