module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        ts: {
            app: {
                files: [{
                    src: ["src/\*\*/\*.ts", "!src/.baseDir.ts"],
                    dest: "./dist"
                }],
                options: {
                    module: "commonjs",
                    target: "es5",
                    sourceMap: false,
                    rootDir: "src",
                    experimentalDecorators: true,
                    lib: ["es2015"]
                }
            }
        },
        watch: {
            ts: {
                files: ["src/\*\*/\*.ts"],
                tasks: ["ts"]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-ts");

    grunt.registerTask("default", [
        "ts"
    ]);
};