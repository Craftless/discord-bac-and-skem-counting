export default (path: string) => path.replace(/\\/g, "/").split("/").pop()!;
