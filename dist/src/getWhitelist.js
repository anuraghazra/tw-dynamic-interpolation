"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWhitelist = exports.visitNodeForWhitelist = exports.extractWhitelistFromNode = void 0;
const typescript_1 = __importDefault(require("typescript"));
const utils_1 = require("./utils");
function extractWhitelistFromNode(node, checker) {
    const templateLiteralType = checker.getTypeAtLocation(node);
    // We cannot do `checker.typeToString`
    // because it will give excerpted output
    // (eg: `bg-red-100 | bg-blue-100 .. 4 more ..`)
    // @ts-ignore
    const unionType = templateLiteralType.types.map((t) => t.value);
    const bundle = unionType.reduce((prev, curr) => `${prev} ${curr}`, "");
    const whitelist = Array.from(new Set(bundle.split(" "))).filter(Boolean);
    return whitelist;
}
exports.extractWhitelistFromNode = extractWhitelistFromNode;
function visitNodeForWhitelist(node, checker, cache = []) {
    if (typescript_1.default.isTemplateExpression(node)) {
        const whitelist = extractWhitelistFromNode(node, checker);
        cache.push(...whitelist);
    }
    else {
        typescript_1.default.forEachChild(node, (node) => {
            visitNodeForWhitelist(node, checker, cache);
        });
    }
    return cache;
}
exports.visitNodeForWhitelist = visitNodeForWhitelist;
function getWhitelist(files) {
    // Setup and create virtual directory list
    const program2 = utils_1.createInMemoryProgram(files);
    const checker = program2.getTypeChecker();
    const whitelist = [];
    for (const sourceFile of program2.getSourceFiles()) {
        if (!sourceFile.isDeclarationFile) {
            // Visit every sourceFile in the program
            typescript_1.default.forEachChild(sourceFile, (node) => {
                whitelist.push(...visitNodeForWhitelist(node, checker));
            });
        }
    }
    return whitelist;
}
exports.getWhitelist = getWhitelist;
//# sourceMappingURL=getWhitelist.js.map