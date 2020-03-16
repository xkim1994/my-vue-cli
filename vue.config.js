const path = require("path");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const AutoDllPlugin = require("autodll-webpack-plugin");

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    assetsDir: "h5",
    devServer: {
        proxy: {
            '/api': {
                target: '<url>',
                ws: true,
                changeOrigin: true
            },
            '/foo': {
                target: '<other_url>'
            }
        }
    },
    configureWebpack: config => {
        Object.assign(config.resolve.alias, {
            "@utils": resolve("src/utils"),
            "@libs": resolve("src/libs"),
            "@api": resolve("src/api"),
            "@components": resolve("src/components"),
            "@assets": resolve("src/assets"),
            "@css": resolve("src/assets/css"),
            "@images": resolve("src/assets/images"),
            "@views": resolve("src/views"),
            "@mixins": resolve("src/mixins")
        });

        if (process.env.NODE_ENV !== "production") {
            config.plugins.push(
                new HardSourceWebpackPlugin(),
                new AutoDllPlugin({
                    inject: true,
                    debug: true,
                    filename: "[name]_[hash].js",
                    path: "./dll" + Date.parse(new Date()),
                    entry: {
                        vendor_vue: ["vue", "vuex", "vue-router"],
                        vendor_tools: ["axios", "core-js"]
                    }
                })
            );
        }
    }
};
