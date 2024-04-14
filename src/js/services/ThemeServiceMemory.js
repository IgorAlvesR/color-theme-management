export class ThemeServiceMemory {
  getThemeById(id) {
    return {
      name: "Tema teste",
      colors: {
        primary: "#ff0000",
        secondary: "#000",
        success: "#000",
        danger: "#000",
        warning: "#000",
      },
    };
  }

  listAllThemes() {
    return [
      {
        name: "Tema teste",
        colors: {
          primary: "#ff0000",
          secondary: "#000",
          success: "#000",
          danger: "#000",
          warning: "#000",
        },
      },
    ];
  }

  saveSelected(themeId) {}

  getSelectedTheme() {
    return 1;
  }

  register(theme) {}

  update(theme) {}

  remove(themeId) {}
}
