import { BASE_URL } from "./config.js";

export class ThemeService {
  async getThemeById(id) {
    try {
      const response = await fetch(`${BASE_URL}/themes/${id}`);
      const theme = await response.json();
      return theme;
    } catch (error) {
      throw new Error("Ocorreu um erro ao buscar por este tema.");
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

  saveSelected(themeId) {
    localStorage.setItem("themeId", themeId);
  }

  getSelectedTheme() {
    const themeId = localStorage.getItem("themeId");
    return themeId;
  }

  async remove(themeId) {
    const themeSelectedId = this.getSelectedTheme();
    try {
      if (themeSelectedId === themeId) {
        throw new Error("Um tema selecionado não pode ser removido.");
      }

      const response = await fetch(`${BASE_URL}/themes/${themeId}`, {
        method: "DELETE",
      });
      return response;
    } catch (error) {
      throw new Error(
        `Ocorreu um erro ao tentar excluir tema. (${error.message})`
      );
    }
  }
}
