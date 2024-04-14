import "../icons-config.js";
import { ThemeService } from "../services/ThemeService.js";
import { ThemeDOM } from "../ThemeDOM.js";
import { Modal } from "../Modal.js";

addEventListener("DOMContentLoaded", async () => {
  const service = new ThemeService();
  const themeDOM = new ThemeDOM(service);
  themeDOM.handleRegisterTheme();
  try {
    const themes = await service.listAllThemes();
    themeDOM.mountThemeList(themes);
    themeDOM.handleFilterTheme();
  } catch (error) {
    const errorDialog = new Modal("Erro!", error.message);
    const confirm = await errorDialog.onConfirm();
    if (confirm) errorDialog.close();
  }
});
