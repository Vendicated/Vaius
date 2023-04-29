import esbuild from "esbuild";
import { readdir } from "fs/promises";

/**
 * @type {esbuild.Plugin}
 */
const makeAllPackagesExternalPlugin = {
    name: "make-all-packages-external",
    setup(build) {
        const filter = /^[^./]|^\.[^./]|^\.\.[^/]/; // Must not start with "/" or "./" or "../"
        build.onResolve({ filter }, args => ({ path: args.path, external: true }));
    },
};

/**
 * @type {esbuild.Plugin}
 */
const globCommandsPlugin = {
    name: "glob-commands-plugin",
    setup(build) {
        const filter = /^~commands$/;

        build.onResolve(
            { filter },
            args => ({
                path: args.path,
                namespace: "commands"
            })
        );

        build.onLoad({ filter, namespace: "commands" }, async () => {
            const files = await readdir("./src/commands");
            return {
                contents: files.map(f => `import "./${f.replace(".ts", "")}"`).join("\n"),
                resolveDir: "./src/commands"
            };
        });
    }
};

await esbuild.build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    plugins: [globCommandsPlugin, makeAllPackagesExternalPlugin],
    outfile: "dist/index.js",
    minify: false,
    treeShaking: true,
    target: "esnext",
    platform: "node",
    sourcemap: "linked",
    logLevel: "info"
});
