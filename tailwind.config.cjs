/** @type {import('tailwindcss').Config} */

import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      "white": "#ffffff",
      "black": "#000000",
      "sand": {
        "100": "#F3F2F0",
        "200": "#E6E4E2",
        "300": "#D8D6D3",
        "400": "#B7B4B0",
        "500": "#95918C",
        "600": "#7B7775",
        "700": "#605D5D",
        "800": "#484747",
        "900": "#303030",
      },
      "stackspurple": "#765BFF",
      "midpurple": "#9985FF",
      "lightpurple": "#BBADFF",
      "bloodorange": "#FC6432",
      "bitcoinorange": "#FD9D41",
      "yellow": "#F8F65B",

      // Status
      "success": {
        "100": "#f5fcfa",
        "200": "#d9f4eb",
        "300": "#a9e6d2",
        "400": "#66d2ae",
        "500": "#10b981",
        "600": "#0faa77",
        "700": "#0d9b6c",
        "800": "#0c855d",
        "900": "#096848",
        "1000": "#064a34"
      },
      "warning": {
        "100": "#fff9f6",
        "200": "#fee9da",
        "300": "#fdcdab",
        "400": "#fba56a",
        "500": "#f97316",
        "600": "#e56a14",
        "700": "#d16112",
        "800": "#b35310",
        "900": "#8b400c",
        "1000": "#642e09"
      },
      "danger": {
        "100": "#fef8f8",
        "200": "#fce1e1",
        "300": "#f9bcbc",
        "400": "#f58787",
        "500": "#ef4444",
        "600": "#dc3f3f",
        "700": "#c93939",
        "800": "#ac3131",
        "900": "#862626",
        "1000": "#601b1b"
      },
      "error": {
        "100": "#fef8f8",
        "200": "#fce1e1",
        "300": "#f9bcbc",
        "400": "#f58787",
        "500": "#ef4444",
        "600": "#dc3f3f",
        "700": "#c93939",
        "800": "#ac3131",
        "900": "#862626",
        "1000": "#601b1b"
      }
    },
    backgroundImage: {
      "warning-01": "rgba(248, 246, 91, 0.40);",
      "warning-02": "rgba(248, 246, 248, 0.40);",
    },
    extend: {
      fontFamily: {
        'sans': ['Matter', ...defaultTheme.fontFamily.sans],
        'mono': ['Matter Mono', ...defaultTheme.fontFamily.mono],
      },
    },
  }
}