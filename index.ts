import * as ts from "typescript";
import * as vfs from "@typescript/vfs";
import { visitNodeForWhitelist } from "./src/getWhitelist";
import { transformTemplateExpressions } from "./src/transformAs";

/*
1. Find all template expressions
2. Find all interpolations (eg: `bg-{variant}-500`)
3. Get their type values (eg: Variant = "red" | "green" | "blue")
4. combine them and emit
*/

const compilerOptions = {
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS,
};
const filename = "example.tsx";
const newSource = "newSource.tsx";
const program = ts.createProgram([filename], compilerOptions);

const printer = ts.createPrinter();

function getAsAssertedSourceCode() {
  const asTransformedNode = transformTemplateExpressions(
    program.getSourceFile(filename)
  );
  const sourceCode = printer.printNode(
    ts.EmitHint.Unspecified,
    asTransformedNode,
    undefined
  );
  return sourceCode;
}

function getWhiteListProgram(newSourceCode: string) {
  // Setup and create virtual directory list
  const fsMap = vfs.createDefaultMapFromNodeModules(compilerOptions);
  fsMap.set(newSource, newSourceCode);

  const system = vfs.createSystem(fsMap);
  const env = vfs.createVirtualTypeScriptEnvironment(
    system,
    [...fsMap.keys()],
    ts,
    program.getCompilerOptions()
  );

  const program2 = env.languageService.getProgram();
  const checker = program2.getTypeChecker();

  for (const sourceFile of program2.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      // Visit every sourceFile in the program
      ts.forEachChild(sourceFile, (node) =>
        visitNodeForWhitelist(node, checker)
      );
    }
  }
}

const newSourceCode = getAsAssertedSourceCode();
getWhiteListProgram(newSourceCode);
