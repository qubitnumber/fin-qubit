import "@mui/material/styles/createPalette";

declare module "@mui/material/styles/createPalette" {
  interface PaletteColor {
    [key: string]: string;
  }
  export interface Palette {
    tertiary: PaletteColor
  }
}

// declare module "@mui/material/styles/createPalette" {
//   interface PaletteColor {
//     [key: string]: string;
//   }

//   interface Palette {
//     tertiary: PaletteColor;
//   }
// }