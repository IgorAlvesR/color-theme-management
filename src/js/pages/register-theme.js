import "../icons-config.js";
import { RegisterDOM } from "../RegisterDOM.js";
import { ThemeService } from "../services/ThemeService.js";

addEventListener("DOMContentLoaded", async () => {
  try {
    const service = new ThemeService();
    const register = new RegisterDOM(service);
    register.handleSubmitRegister();
  } catch (error) {
    alert(error.message);
  }
});
