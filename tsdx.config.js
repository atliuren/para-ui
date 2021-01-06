const less = require("rollup-plugin-less");
const postcss = require("rollup-plugin-postcss");
const autoPrefixer = require("autoprefixer");
const cssNano = require("cssnano");

module.exports = {
    rollup(config) {
        // config.plugins.push(less({
        //     output: "dist/para-ui.esm.css"
        // }));
        config.plugins.push(
            postcss({
                plugins: [
                    autoPrefixer(),
                    cssNano({
                        preset: "default",
                    }),
                ],
                inject: false,
                extract: "para-ui.esm.css",
            })
        );
        return config;
    }
};