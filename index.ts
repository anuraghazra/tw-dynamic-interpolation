import fs from "fs";
import glob from "glob";
import path from "path";
import { getWhitelist } from "./src/getWhitelist";
import { getAsAssertedSourceCode } from "./src/transformAs";
import { createInMemoryProgram, flatten } from "./src/utils";

const targetSource = "target.tsx";
const newSource = "target-new.tsx";

/**
 * Extract whitelist of classes from the given code
 * @param content source code
 * @returns classlist
 */
export function extractor(content: string) {
  const program = createInMemoryProgram([
    { name: targetSource, content: content },
  ]);
  const newSourceCode = getAsAssertedSourceCode(program, targetSource);
  // return array of css selectors
  return getWhitelist([
    { name: newSource, content: newSourceCode },
  ]) as string[];
}

/**
 * Extract whitelist from multiple files via glob patterns
 * @param contents array of glob patterns
 * @returns extracted whitelist of classes for all the files
 */
export default function globExtractor(contents: string[]) {
  try {
    let whitelist = [];

    contents.forEach((globPattern) => {
      const files: string[] = glob.sync(globPattern, {});

      const whitelistMap = files.map((fileString) => {
        const filepath = path.resolve(process.cwd(), fileString);
        const content = fs.readFileSync(filepath, {
          encoding: "utf-8",
        });
        return extractor(content);
      });
      whitelist.push(whitelistMap);
    });
    return flatten(whitelist);
  } catch (err) {
    console.log(err);
  }
}

// const t = globExtractor(["./examples/example2.tsx"]);
// console.log(t);
