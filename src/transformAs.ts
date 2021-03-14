import ts from "typescript";

export function transformTemplateExpressions(sourceFile: ts.SourceFile) {
  const transformerFactory: ts.TransformerFactory<ts.Node> = (
    context: ts.TransformationContext
  ) => {
    return (rootNode) => {
      function visit(node: ts.Node): ts.Node {
        node = ts.visitEachChild(node, visit, context);
        if (ts.isTemplateExpression(node)) {
          // `as const`
          const statement = ts.factory.createAsExpression(
            node,
            ts.factory.createTypeReferenceNode(
              ts.factory.createIdentifier("const")
            )
          );

          return statement;
        } else {
          return node;
        }
      }

      return ts.visitNode(rootNode, visit);
    };
  };

  const transformationResult = ts.transform(sourceFile, [transformerFactory]);

  const transformedSourceFile = transformationResult.transformed[0];
  return transformedSourceFile;
}

export function getAsAssertedSourceCode(program: ts.Program, filename: string) {
  const printer = ts.createPrinter();

  const asTransformedNode = transformTemplateExpressions(
    program.getSourceFile(filename)
  );

  return printer.printNode(
    ts.EmitHint.Unspecified,
    asTransformedNode,
    undefined
  );
}
