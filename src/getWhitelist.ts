import ts from "typescript";
import { createInMemoryProgram, InMemoryFiles } from "./utils";

export function extractWhitelistFromNode(
  node: ts.Node,
  checker: ts.TypeChecker
) {
  const templateLiteralType = checker.getTypeAtLocation(node);

  // We cannot do `checker.typeToString`
  // because it will give excerpted output
  // (eg: `bg-red-100 | bg-blue-100 .. 4 more ..`)
  // @ts-ignore
  const unionType: string[] = templateLiteralType.types.map(
    (t: any) => t.value
  );

  const bundle = unionType.reduce((prev, curr) => `${prev} ${curr}`, "");

  const whitelist = Array.from(new Set(bundle.split(" "))).filter(Boolean);
  return whitelist;
}

export function visitNodeForWhitelist(
  node: ts.Node,
  checker: ts.TypeChecker,
  cache: string[] = []
) {
  if (ts.isTemplateExpression(node)) {
    const whitelist = extractWhitelistFromNode(node, checker);
    cache.push(...whitelist);
  } else {
    ts.forEachChild(node, (node) => {
      visitNodeForWhitelist(node, checker, cache);
    });
  }

  return cache;
}

export function getWhitelist(files: InMemoryFiles) {
  // Setup and create virtual directory list
  const program2 = createInMemoryProgram(files);
  const checker = program2.getTypeChecker();

  const whitelist = [];
  for (const sourceFile of program2.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      // Visit every sourceFile in the program
      ts.forEachChild(sourceFile, (node) => {
        whitelist.push(...visitNodeForWhitelist(node, checker));
      });
    }
  }
  return whitelist;
}
