import { designTokens } from "./design-tokens";

export type ThemeKey = keyof typeof designTokens.themes;

export const themeConfig = {
  activeTheme: "peach" as ThemeKey,
  classes: {
    peach: "theme-peach",
    pearl: "theme-pearl"
  }
};

export const activeThemeClass = themeConfig.classes[themeConfig.activeTheme];
