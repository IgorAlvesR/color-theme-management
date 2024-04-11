import { BASE_URL } from "./config.js";

export class ThemeService {
  async getThemeById(id) {
    try {
      const response = await fetch(`${BASE_URL}/themes/${id}`);
      const theme = await response.json();
      return theme;
    } catch (error) {
      throw new Error("Ocorreu um erro ao buscar pelos temas.");
    }
  }

  async listAllThemes() {
    try {
      const response = await fetch(`${BASE_URL}/themes`);
      const themes = await response.json();
      return themes;
    } catch (error) {
      throw new Error("Ocorreu um erro ao buscar pelos temas.");
    }
  }

  save(themeId) {
    localStorage.setItem("themeId", themeId);
  }
}
