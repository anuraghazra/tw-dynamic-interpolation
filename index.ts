import { getWhitelist } from "./src/getWhitelist";
import { createInMemoryProgram, flatten } from "./src/utils";
import { getAsAssertedSourceCode } from "./src/transformAs";
import glob from "glob";
import path from "path";
import fs from "fs";

const targetSource = "target.tsx";
const newSource = "target-new.tsx";

// TODO: Refactor
export default function purgeFromTs(contents: string[]) {
  try {
    let whitelist = [];

    contents.forEach((globPattern) => {
      const files: string[] = glob.sync(globPattern, {});

      const whitelistMap = files.map((fileString) => {
        const filepath = path.resolve(process.cwd(), fileString);
        const content = fs.readFileSync(filepath, {
          encoding: "utf-8",
        });
        const program = createInMemoryProgram([
          { name: targetSource, content: content },
        ]);
        const newSourceCode = getAsAssertedSourceCode(program, targetSource);
        // return array of css selectors
        return getWhitelist([{ name: newSource, content: newSourceCode }]);
      });
      whitelist.push(whitelistMap);
    });
    return flatten(whitelist);
  } catch (err) {
    console.log(err);
  }
}

// const t = purgeFromTs(["./examples/example2.tsx"]);
// console.log(t);
