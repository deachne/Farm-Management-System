/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    "../bizzy/core/**/*.mdx",
    "../bizzy/core/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../bizzy/extensions/**/*.mdx",
    "../bizzy/extensions/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
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
};
export default config;