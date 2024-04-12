import { Modal } from "./Modal.js";
export class ThemeDOM {
  #themeService = null;
  constructor(themeService) {
    this.#themeService = themeService;
  }

  mountThemeList(themes) {
    this.#populateThemes(themes);
    this.#handleSelectedTheme();
    this.#handleRemoveTheme();
    this.#handleRegisterTheme();
    this.#handleEditTheme();
  }

  async handleFilterTheme() {
    const themes = await this.#themeService.listAllThemes();
    const filterElement = document.querySelector(".filter-input-theme");

    filterElement.addEventListener("input", (event) => {
      const filterByThemeName = new RegExp(event.target.value, "i");
      const themesFiltered = themes.filter((theme) =>
        filterByThemeName.test(theme.name)
      );
      this.mountThemeList(themesFiltered);
    });
  }

  #createCard(theme) {
    return `
      <div data-id="${theme.id}" class="card-theme">
        <header class="card-title">
          ${theme.name}
          <div class="icons-card">
            <svg class="icon icon-edit" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${theme.colors.secondary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/></svg>
            <svg class="icon icon-trash" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${theme.colors.danger}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </div>
        </header>

        <section class="card-theme-preview">
          <header style="background: ${theme.colors.primary}"></header>
          <main>
            <div class="preview-card" style="border: 1px solid ${theme.colors.secondary}"></div>
            <div class="preview-card" style="border: 1px solid ${theme.colors.secondary}"></div>
            <div class="preview-card" style="border: 1px solid ${theme.colors.secondary}"></div>
            <div class="preview-card" style="border: 1px solid ${theme.colors.secondary}"></div>
          </main>
        </section>

        <footer>
          <span class="tag-color" style="background: ${theme.colors.primary}">
            primary
          </span>

          <span class="tag-color" style="background: ${theme.colors.secondary}">
            secondary
          </span>

          <span class="tag-color" style="background: ${theme.colors.success}">
            success
          </span>

          <span class="tag-color" style="background: ${theme.colors.danger}">
            danger
          </span>

          <span class="tag-color" style="background: ${theme.colors.warning}">
            warning
          </span>
        </footer>
      </div>
    `;
  }

  #populateThemes(themes) {
    const listTheme = document.querySelector(".list-themes");
    listTheme.innerHTML = "";
    this.#themeService.saveSelected(null);
    const themesItem = [];

    if (!themes.length) {
      const title = document.createElement("h1");
      const emptyList = "Não existem temas registrados.";
      title.innerHTML = listTheme.append(emptyList);
      return;
    }

    for (const theme of themes) {
      const li = document.createElement("li");
      li.innerHTML = this.#createCard(theme);
      themesItem.push(li);
    }

    listTheme.append(...themesItem);
  }

  #handleSelectedTheme() {
    const cardsTheme = document.querySelectorAll(".card-theme");
    for (const cardTheme of cardsTheme) {
      cardTheme.addEventListener("click", async () => {
        this.#removeZoomCardSelected();
        const id = cardTheme.getAttribute("data-id");
        const theme = await this.#themeService.getThemeById(id);
        this.#applyTheme(theme);
        this.#themeService.saveSelected(theme.id);
      });
    }
  }

  #removeZoomCardSelected() {
    const cards = document.querySelectorAll(".card-selected");
    if (!cards.length) return;
    for (const card of cards) {
      card.classList.remove("card-selected");
    }
  }

  #applyTheme(theme) {
    const headerMain = document.querySelector(".header-main");
    const card = document.querySelector(`[data-id="${theme.id}"]`);
    const buttonAddTheme = document.querySelector(".btn-add-theme");

    card.classList.add("card-selected");
    headerMain.style.background = theme.colors.primary;
    headerMain.style.color = "white";
    buttonAddTheme.style.background = theme.colors.secondary;
  }

  #handleRemoveTheme() {
    const iconsTrash = document.querySelectorAll(".card-theme .icon-trash");

    for (const icon of iconsTrash) {
      icon.addEventListener("click", async (event) => {
        event.stopImmediatePropagation();
        const header = icon.parentElement;
        const containerIcons = header.parentElement;
        const cardElement = containerIcons.parentElement;
        const themeId = cardElement.getAttribute("data-id");

        const modalConfirm = new Modal(
          "Remover",
          "Confirma remoção desse tema ?",
          "Confirmar"
        );

        const confirm = await modalConfirm.onConfirm();

        try {
          if (!confirm) return;
          const response = await this.#themeService.remove(themeId);
          if (response) {
            const themes = await this.#themeService.listAllThemes();
            this.mountThemeList(themes);
            this.handleFilterTheme(themes);
          }
          modalConfirm.close();
        } catch (error) {
          const errorDialog = new Modal("Erro!", error.message);
          const confirm = await errorDialog.onConfirm();
          if (confirm) errorDialog.close();
        }
      });
    }
  }

  #handleEditTheme() {
    const iconsEdit = document.querySelectorAll(".card-theme .icon-edit");

    for (const icon of iconsEdit) {
      icon.addEventListener("click", async (event) => {
        event.stopImmediatePropagation();
        const header = icon.parentElement;
        const containerIcons = header.parentElement;
        const cardElement = containerIcons.parentElement;
        const themeId = cardElement.getAttribute("data-id");
        window.location.href = `../pages/register-theme.html?themeId=${themeId}`;
      });
    }
  }

  #handleRegisterTheme() {
    const btnRegister = document.querySelector(".btn-add-theme");
    btnRegister.addEventListener("click", () => {
      window.location.href = "../pages/register-theme.html";
    });
  }
}
