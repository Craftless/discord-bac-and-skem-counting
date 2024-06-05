export default (name: string) => {
  if (!name) console.log("WTF", name);
  return name
    .toLowerCase()
    .replace(" ", "_")
    .replace(/^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/, "");
};
