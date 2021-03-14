import ts from "typescript";
import * as vfs from "@typescript/vfs";

const compilerOptions: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
};

export type InMemoryFiles = { name: string; content: string }[];

export function createInMemoryProgram(files: InMemoryFiles) {
  const fsMap = vfs.createDefaultMapFromNodeModules(compilerOptions);
  files.forEach((file) => {
    fsMap.set(file.name, file.content);
  });

  const system = vfs.createSystem(fsMap);
  const env = vfs.createVirtualTypeScriptEnvironment(
    system,
    [...fsMap.keys()],
    ts,
    compilerOptions
  );

  return env.languageService.getProgram();
}

export function flatten<T extends any[][]>(arr: T) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(
      Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten
    );
  }, []);
}
