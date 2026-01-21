import { v0_8 } from "@a2ui/lit";

// Define custom theme to match Material UI style
export const theme = {
  // Component-level theming
  components: {
    Button: {
      "layout-pt-2": true,
      "layout-pb-2": true,
      "layout-pl-3": true,
      "layout-pr-3": true,
      "border-br-12": true,
      "color-bgc-p30": true,
      "color-c-n100": true,
    },
    Card: {
      "border-br-9": true,
      "color-bgc-p100": true,
    },
    Text: {
      all: {
        "layout-w-100": true,
      },
    },
  },
  // Element-level theming for HTML elements
  elements: {
    button: {
      "typography-f-sf": true,
      "color-c-n100": true,
    },
  },
};
