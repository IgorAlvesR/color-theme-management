import { Modal } from "./Modal.js";

export class RegisterDOM {
  #themeService = null;
  constructor(themeService) {
    this.#themeService = themeService;
  }

  #clearFields() {
    const formRegister = this.#getFormElement();

    const [name, primary, secondary, success, danger, warning] =
      formRegister.querySelectorAll("input");

    name.value = "";
    primary.value = "#000000";
    secondary.value = "#000000";
    success.value = "#000000";
    danger.value = "#000000";
    warning.value = "#000000";
  }

  #initialConfigPreview(theme) {
    const previewRegisterHeader = document.querySelector(
      ".preview-register header"
    );
    const previewButtonRegister = document.querySelector(
      ".btn-preview-register"
    );

    previewRegisterHeader.style.background = theme.colors.primary;
    previewButtonRegister.style.background = theme.colors.secondary;
  }

  populateFields(theme) {
    const formRegister = this.#getFormElement();
    const title = formRegister.querySelector(".title");
    const [name, primary, secondary, success, danger, warning] =
      formRegister.querySelectorAll("input");

    title.textContent = "Edite seu tema";
    name.value = theme.name;
    primary.value = theme.colors.primary;
    secondary.value = theme.colors.secondary;
    success.value = theme.colors.success;
    danger.value = theme.colors.danger;
    warning.value = theme.colors.warning;

    this.#initialConfigPreview(theme);
  }

  async #saveTheme(theme) {
    if (!!theme.id) {
      const response = await this.#themeService.update({
        id: theme.id,
        name: theme.name,
        colors: {
          primary: theme.colors.primary,
          secondary: theme.colors.secondary,
          success: theme.colors.success,
          danger: theme.colors.danger,
          warning: theme.colors.warning,
        },
      });
      return response;
    }

    const response = await this.#themeService.register({
      name: theme.name,
      colors: {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        success: theme.colors.success,
        danger: theme.colors.danger,
        warning: theme.colors.warning,
      },
    });

    return response;
  }

  handleSubmitRegister(themeId) {
    const formRegister = this.#getFormElement();
    const btnRegister = document.querySelector(".btn-register-theme");
    this.#configPreview(formRegister);

    btnRegister.addEventListener("click", async (event) => {
      event.preventDefault();

      const [name, primary, secondary, success, danger, warning] =
        formRegister.querySelectorAll("input");

      const valid = this.#validateForm(name.value);
      if (!valid) return;

      try {
        this.#toggleLoading(true);

        const theme = {
          id: themeId,
          name: name.value,
          colors: {
            primary: primary.value,
            secondary: secondary.value,
            success: success.value,
            danger: danger.value,
            warning: warning.value,
          },
        };

        const isEdit = !!theme.id;
        const response = await this.#saveTheme(theme);

        if (response.ok) {
          if (isEdit) {
            window.location.assign("../pages/index.html");
          }
          this.#clearFields();
          this.#initialConfigPreview({
            colors: { primary: "#000000", secondary: "#000000" },
          });
          window.alert("Tema salvo com sucesso.");
        }
      } catch (error) {
        const errorDialog = new Modal("Erro!", error.message);
        const confirm = await errorDialog.onConfirm();
        if (confirm) errorDialog.close();
      } finally {
        this.#toggleLoading(false);
      }
    });
  }

  #toggleLoading(active) {
    const btn = document.querySelector(".btn-register-theme");
    btn.innerHTML = active ? "Salvando..." : "Salvar";
    btn.disabled = active;
  }

  #validateForm(themeName) {
    const form = this.#getFormElement();
    const errorElement = form.querySelector(".error");
    if (!themeName) {
      errorElement.innerHTML = "Campo é obrigatório";
      return false;
    }
    errorElement.innerHTML = "";
    return true;
  }

  #getFormElement() {
    return document.querySelector("#form-theme-register");
  }

  #configPreview(form) {
    const previewRegisterHeader = document.querySelector(
      ".preview-register header"
    );
    const previewButtonRegister = document.querySelector(
      ".btn-preview-register"
    );

    const [name, primaryInputColor, secondaryInputColor] =
      form.querySelectorAll("input");

    primaryInputColor.addEventListener("input", (event) => {
      previewRegisterHeader.style.background = event.target.value;
    });

    secondaryInputColor.addEventListener("input", (event) => {
      previewButtonRegister.style.background = event.target.value;
    });
  }
}
