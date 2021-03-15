import { extractor } from "..";

const sourceCode = `
  type T = "red" | "green" | "blue";
  const colors = (t: T) => \`bg-\${t}\-100\`;
`;

describe("Extractor", () => {
  it("should yield correct whitelist", () => {
    expect(extractor(sourceCode)).toEqual([
      "bg-red-100",
      "bg-green-100",
      "bg-blue-100",
    ]);
  });
});
