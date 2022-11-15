import esbuild from "esbuild";

const makeAllPackagesExternalPlugin = {
    name: "make-all-packages-external",
    setup(build) {
        const filter = /^[^./]|^\.[^./]|^\.\.[^/]/; // Must not start with "/" or "./" or "../"
        build.onResolve({ filter }, args => ({ path: args.path, external: true }));
    },
};



await esbuild.build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    plugins: [makeAllPackagesExternalPlugin],
    outfile: "dist/index.js",
    minify: true,
    treeShaking: true,
    target: "esnext",
    platform: "node",
    sourcemap: "linked",
    logLevel: "info"
});
