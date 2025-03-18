/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../bizzy/core/shared/ui/components/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/addon-a11y"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  "features": {
    "interactionsDebugger": true,
    "storyStoreV7": true
  },
  "viteFinal": (config) => {
    // Configure Vite to handle JSX in .js files
    if (!config.esbuild) {
      config.esbuild = {};
    }
    
    config.esbuild = {
      ...config.esbuild,
      include: /\.[jt]sx?$/,
      exclude: [],
      jsx: 'automatic',
    };
    
    // Ensure proper module resolution
    if (!config.resolve) {
      config.resolve = {};
    }
    
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }
    
    // Add any other configuration you need
    
    return config;
  }
};
export default config;