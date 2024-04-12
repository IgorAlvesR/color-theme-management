import "../icons-config.js";
import { ThemeService } from "../services/ThemeService.js";
import { ThemeDOM } from "../ThemeDOM.js";
import { Modal } from "../Modal.js";

addEventListener("DOMContentLoaded", async () => {
  try {
    const service = new ThemeService();
    const themes = await service.listAllThemes();
    const themeDOM = new ThemeDOM(service);
    themeDOM.mountThemeList(themes);
    themeDOM.handleFilterTheme();
  } catch (error) {
    const errorDialog = new Modal("Erro!", error.message);
    const confirm = await errorDialog.onConfirm();
    if (confirm) errorDialog.close();
  }
});
