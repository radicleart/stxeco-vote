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
      "gray": {
        "100": "#eaeaed",
        "200": "#d5d5db",
        "300": "#c1c0ca",
        "400": "#acabb8",
        "500": "#9796a6",
        "600": "#797885",
        "700": "#5b5a64",
        "800": "#3c3c42",
        "900": "#1F2123",
      },
      "navy": {
        "100": "#cecce0",
        "200": "#9c99c2",
        "300": "#6b66a3",
        "400": "#393385",
        "500": "#080066",
        "600": "#060052",
        "700": "#05003d",
        "800": "#030029",
        "900": "#020014",
      },
      "stacks": {
        "100": "#dddaff",
        "200": "#bbb5ff",
        "300": "#9990ff",
        "400": "#776bff",
        "500": "#5546ff",
        "600": "#4438cc",
        "700": "#332a99",
        "800": "#221c66",
        "900": "#110e33",
      },
      "purple": {
        "100": "#e4d9fc",
        "200": "#cab3f8",
        "300": "#af8cf5",
        "400": "#9566f1",
        "500": "#7a40ee",
        "600": "#6233be",
        "700": "#49268f",
        "800": "#311a5f",
        "900": "#180d30",
      },
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
      "primary-01": "linear-gradient(80deg, #080066 0%, #7A40EE 100%)", // navy to purple
      "purple-fade": "linear-gradient(180deg, rgba(122, 64, 238, 0.60) 0%, rgba(122, 64, 238, 0.10) 100%)" // purple fade
    },
    extend: {
      fontFamily: {
        'sans': ['OpenSauceTwo', ...defaultTheme.fontFamily.sans],
      },
    },
  }
}