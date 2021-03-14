"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAsAssertedSourceCode = exports.transformTemplateExpressions = void 0;
const typescript_1 = __importDefault(require("typescript"));
function transformTemplateExpressions(sourceFile) {
    const transformerFactory = (context) => {
        return (rootNode) => {
            function visit(node) {
                node = typescript_1.default.visitEachChild(node, visit, context);
                if (typescript_1.default.isTemplateExpression(node)) {
                    // `as const`
                    const statement = typescript_1.default.factory.createAsExpression(node, typescript_1.default.factory.createTypeReferenceNode(typescript_1.default.factory.createIdentifier("const")));
                    return statement;
                }
                else {
                    return node;
                }
            }
            return typescript_1.default.visitNode(rootNode, visit);
        };
    };
    const transformationResult = typescript_1.default.transform(sourceFile, [transformerFactory]);
    const transformedSourceFile = transformationResult.transformed[0];
    return transformedSourceFile;
}
exports.transformTemplateExpressions = transformTemplateExpressions;
function getAsAssertedSourceCode(program, filename) {
    const printer = typescript_1.default.createPrinter();
    const asTransformedNode = transformTemplateExpressions(program.getSourceFile(filename));
    return printer.printNode(typescript_1.default.EmitHint.Unspecified, asTransformedNode, undefined);
}
exports.getAsAssertedSourceCode = getAsAssertedSourceCode;
//# sourceMappingURL=transformAs.js.map