export default (path: string) =>
  path.replace(/\\/g, "/").split("/").pop()!.split(".")[0];
