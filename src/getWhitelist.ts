import * as ts from "typescript";

export function getWhitelist(node: ts.Node, checker: ts.TypeChecker) {
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

export function visitNodeForWhitelist(node: ts.Node, checker: ts.TypeChecker) {
  if (ts.isTemplateExpression(node)) {
    const whitelist = getWhitelist(node, checker);
    console.log(whitelist);
  } else {
    ts.forEachChild(node, (node) => visitNodeForWhitelist(node, checker));
  }
}
