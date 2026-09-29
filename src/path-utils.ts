import * as path from "path";

export function getPathRelativeToHome(filePath: string, homePath: string): string | undefined {
  const relativePath = path.relative(homePath, filePath);
  const isOutsideHome = relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath);
  if (isOutsideHome) {
    return undefined;
  }
  return relativePath || ".";
}

export function getFileOrDirectoryName(filePath: string): string {
  return path.basename(filePath);
}
