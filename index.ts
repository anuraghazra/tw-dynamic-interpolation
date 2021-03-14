import { getWhitelist } from "./src/getWhitelist";
import { createInMemoryProgram } from "./src/utils";
import { getAsAssertedSourceCode } from "./src/transformAs";

/*
1. Find all template expressions
2. Find all interpolations (eg: `bg-{variant}-500`)
3. Get their type values (eg: Variant = "red" | "green" | "blue")
4. combine them and emit
*/

const targetSource = "target.tsx";
const newSource = "target-new.tsx";

export default function purgeFromTs(content: string) {
  const program = createInMemoryProgram([
    { name: targetSource, content: content },
  ]);

  const newSourceCode = getAsAssertedSourceCode(program, targetSource);
  // return array of css selectors
  return getWhitelist([{ name: newSource, content: newSourceCode }]);
}
