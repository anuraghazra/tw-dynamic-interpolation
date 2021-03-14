"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatten = exports.createInMemoryProgram = void 0;
const typescript_1 = __importDefault(require("typescript"));
const vfs = __importStar(require("@typescript/vfs"));
const compilerOptions = {
    target: typescript_1.default.ScriptTarget.ES5,
    module: typescript_1.default.ModuleKind.CommonJS,
    moduleResolution: typescript_1.default.ModuleResolutionKind.NodeJs,
};
function createInMemoryProgram(files) {
    const fsMap = vfs.createDefaultMapFromNodeModules(compilerOptions);
    files.forEach((file) => {
        fsMap.set(file.name, file.content);
    });
    const system = vfs.createSystem(fsMap);
    const env = vfs.createVirtualTypeScriptEnvironment(system, [...fsMap.keys()], typescript_1.default, compilerOptions);
    return env.languageService.getProgram();
}
exports.createInMemoryProgram = createInMemoryProgram;
function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}
exports.flatten = flatten;
//# sourceMappingURL=utils.js.map