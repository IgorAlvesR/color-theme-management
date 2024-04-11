export class ThemeDOM {
  #themeService = null;
  constructor(themeService) {
    this.#themeService = themeService;
  }

  #createListItem(theme) {
    return `
      <div data-id="${theme.id}" class="card-theme">
        <header class="card-title">${theme.name}</header>

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

  populateThemes(themes) {
    const listTheme = document.querySelector(".list-theme");
    const themesItem = [];

    for (const theme of themes) {
      const li = document.createElement("li");
      li.innerHTML = this.#createListItem(theme);
      themesItem.push(li);
    }
    listTheme.append(...themesItem);
  }

  handleSelectedTheme() {
    const cardsTheme = document.querySelectorAll(".card-theme");
    const service = this.#themeService;
    for (const cardTheme of cardsTheme) {
      cardTheme.addEventListener("click", async () => {
        this.#removeCardSelected();
        const id = cardTheme.getAttribute("data-id");
        const theme = await service.getThemeById(id);
        this.#applyTheme(theme);
        this.#themeService.save(theme.id);
      });
    }
  }

  #removeCardSelected() {
    const cards = document.querySelectorAll(".card-selected");
    if (!cards.length) return;
    for (const card of cards) {
      card.classList.remove("card-selected");
    }
  }

  #applyTheme(theme) {
    const headerMain = document.querySelector(".header-main");
    const card = document.querySelector(`[data-id="${theme.id}"]`);
    const primary = theme.colors.primary;
    card.classList.add("card-selected");
    headerMain.style.background = primary;
    headerMain.style.color = "white";
  }
}
