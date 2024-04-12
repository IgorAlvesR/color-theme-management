export class ThemeDOM {
  #themeService = null;
  constructor(themeService) {
    this.#themeService = themeService;
  }

  #createListItem(theme) {
    return `
      <div data-id="${theme.id}" class="card-theme">
        <header class="card-title">
          ${theme.name}
          <svg class="icon-trash" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${theme.colors.danger}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
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

  mountThemeList(themes) {
    this.#populateThemes(themes);
    this.#handleSelectedTheme();
    this.#handleRemoveTheme();
    this.#handleRegisterTheme();
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
      li.innerHTML = this.#createListItem(theme);
      themesItem.push(li);
    }

    listTheme.append(...themesItem);
  }

  #handleSelectedTheme() {
    const cardsTheme = document.querySelectorAll(".card-theme");
    const service = this.#themeService;
    for (const cardTheme of cardsTheme) {
      cardTheme.addEventListener("click", async () => {
        this.#removeZoomCardSelected();
        const id = cardTheme.getAttribute("data-id");
        const theme = await service.getThemeById(id);
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
        const cardElement = header.parentElement;
        const themeId = cardElement.getAttribute("data-id");

        try {
          const confirm = window.confirm("Confirma a exclusão deste tema ?");
          if (confirm) {
            const response = await this.#themeService.remove(themeId);
            if (response) {
              const themes = await this.#themeService.listAllThemes();
              this.mountThemeList(themes);
              this.handleFilterTheme(themes);
            }
          }
        } catch (error) {
          alert(error.message);
        }
      });
    }
  }

  #handleRegisterTheme() {
    const btnRegister = document.querySelector(".btn-add-theme");
    btnRegister.addEventListener("click", () => {
      window.location.href = "../pages/register-theme.html";
    });
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
}
