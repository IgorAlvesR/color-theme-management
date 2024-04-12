export class RegisterDOM {
  #themeService = null;
  constructor(themeService) {
    this.#themeService = themeService;
  }

  handleSubmitRegister() {
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
        const response = await this.#themeService.register({
          name: name.value,
          colors: {
            primary: primary.value,
            secondary: secondary.value,
            success: success.value,
            danger: danger.value,
            warning: warning.value,
          },
        });

        if (response.ok) {
          alert("Tema salvo com sucesso!");
        }
      } catch (error) {
        alert(error.message);
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
