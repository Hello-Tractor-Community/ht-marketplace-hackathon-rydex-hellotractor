declare module "@mui/material/styles" {
  interface Palette {
    pink: Palette["primary"];
    yellow: Palette["primary"];
    orange: Palette["primary"];
    green: Palette["primary"];
  }

  interface PaletteOptions {
    pink?: PaletteOptions["primary"];
    yellow?: PaletteOptions["primary"];
    orange?: PaletteOptions["primary"];
    green?: PaletteOptions["primary"];
  }
}

export {};
