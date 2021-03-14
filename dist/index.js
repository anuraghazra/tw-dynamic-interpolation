"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getWhitelist_1 = require("./src/getWhitelist");
const utils_1 = require("./src/utils");
const transformAs_1 = require("./src/transformAs");
const glob_1 = __importDefault(require("glob"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const targetSource = "target.tsx";
const newSource = "target-new.tsx";
// TODO: Refactor
function purgeFromTs(contents) {
    try {
        let whitelist = [];
        contents.forEach((globPattern) => {
            const files = glob_1.default.sync(globPattern, {});
            const whitelistMap = files.map((fileString) => {
                const filepath = path_1.default.resolve(process.cwd(), fileString);
                const content = fs_1.default.readFileSync(filepath, {
                    encoding: "utf-8",
                });
                const program = utils_1.createInMemoryProgram([
                    { name: targetSource, content: content },
                ]);
                const newSourceCode = transformAs_1.getAsAssertedSourceCode(program, targetSource);
                // return array of css selectors
                return getWhitelist_1.getWhitelist([{ name: newSource, content: newSourceCode }]);
            });
            whitelist.push(whitelistMap);
        });
        return utils_1.flatten(whitelist);
    }
    catch (err) {
        console.log(err);
    }
}
exports.default = purgeFromTs;
// const t = purgeFromTs(["./examples/example2.tsx"]);
// console.log(t);
//# sourceMappingURL=index.js.map