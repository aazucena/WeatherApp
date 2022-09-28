import { contrastColor } from 'contrast-color';
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
    presetColors: [
      {
        title: "primary",
        color: "#d7286c",
      },
      {
        title: "secondary",
        color: "#6CD728",
      },
      {
        title: "tetriary",
        color: "#286CD7",
      },
    ]
  },
}