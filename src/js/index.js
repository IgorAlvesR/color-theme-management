import "./icons-config.js";
import { ThemeService } from "./ThemeService.js";
import { ThemeDOM } from "./ThemeDOM.js";

const service = new ThemeService();

addEventListener("DOMContentLoaded", async () => {
  try {
    const themes = await service.listAllThemes();
    const themeDOM = new ThemeDOM(service);
    themeDOM.populateThemes(themes);
  } catch (error) {
    alert(error.message);
  }
});
