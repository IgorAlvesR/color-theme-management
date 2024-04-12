import "../icons-config.js";
import { RegisterDOM } from "../RegisterDOM.js";
import { ThemeService } from "../services/ThemeService.js";

addEventListener("DOMContentLoaded", async () => {
  try {
    const service = new ThemeService();

    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const themeId = params.get("themeId");
    const register = new RegisterDOM(service);

    if (themeId) {
      const theme = await service.getThemeById(themeId);
      register.populateFields(theme);
    }

    register.handleSubmitRegister(themeId);
  } catch (error) {
    alert(error.message);
  }
});
