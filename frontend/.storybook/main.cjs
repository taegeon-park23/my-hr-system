const path = require("path");
const tsconfigPaths = require("vite-tsconfig-paths").default;

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        "@storybook/addon-onboarding",
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
    ],
    framework: {
        name: "@storybook/react-vite",
        options: {},
    },
    docs: {
        autodocs: "tag",
    },
    staticDirs: ["../public"],
    viteFinal: async (config) => {
        config.plugins?.push(
            tsconfigPaths({
                projects: [path.resolve(__dirname, "../tsconfig.json")],
            })
        );
        return config;
    },
};
module.exports = config;
