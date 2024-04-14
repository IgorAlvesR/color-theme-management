import { test, expect, describe, beforeEach, vi } from "vitest";
import { ThemeDOM } from "../js/ThemeDOM.js";
import { ThemeServiceMemory } from "../js/services/ThemeServiceMemory.js";
import { fireEvent, getByTestId, getByText } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

const { JSDOM } = require("jsdom");

function mountDOM() {
  return `
    <!DOCTYPE html>
      <html lang="pt-BR">

      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="../css/index.css">
        <title>Gerenciamento de temas</title>
      </head>

      <body>
        <dialog data-testid="dialog">
          <section>
            <header>
              <span class="dialog-title">Titulo</span>
              <svg class="close-btn" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </header>

            <main class="content-dialog">
              Conteúdo
            </main>

            <footer class="dialog-footer">
              <button class="btn">Ok</button>
            </footer>
          </section>
        </dialog>

        <header data-testid="header-test" class="header-main">
          <h1>
            Gerenciamento e seleção de temas
            <i data-lucide="palette"></i>
          </h1>
        </header>

        <main class="container-main">
          <label for="filter-input">
            <span>Filtrar</span>
            <input id="filter-input" placeholder="ex: Tema Azul" class="input filter-input-theme" type="text" />
          </label>

          <section class="container-list-themes">
            <button data-testid="btn-register-theme" class="btn btn-add-theme">Novo tema</button>
            <ul class="list-themes">
              Não há temas disponíveis no momento!
            </ul>
          </section>
        </main>

        <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
        <script type="module" src="../js/pages/home.js"></script>
      </body>
    </html>
  `;
}

describe("Página home", () => {
  beforeEach(() => {
    const { window } = new JSDOM(mountDOM(), {
      url: "http://127.0.0.1:5500/src/pages/index.html",
    });
    global.document = window.document;
    global.window = window;
    const serviceThemeMemory = new ThemeServiceMemory();
    const themeDom = new ThemeDOM(serviceThemeMemory);
    const themes = serviceThemeMemory.listAllThemes();
    themeDom.mountThemeList(themes);
  });

  test("deve exibir um card da lista", () => {
    const card = getByText(document, "Tema teste");
    expect(card).toBeDefined();
  });

  test("deve exibir o botão para criar um novo tema", () => {
    const btn = getByTestId(document, "btn-register-theme");
    expect(btn).toBeDefined();
  });

  test("deve adicionar a classe `card-selected` ao clicar em um card", async () => {
    const card = getByTestId(document, "card-theme");
    await userEvent.click(card);
    expect(card.classList.contains("card-selected")).toBe(true);
  });

  test("deve testar se o função que abre o modal foi chamada", () => {
    const dialog = getByTestId(document, "dialog");
    dialog.showModal = vi.fn();
    dialog.close = vi.fn();
    const btnRemove = getByTestId(document, "btn-remove");
    fireEvent.click(btnRemove);
    expect(dialog.showModal).toHaveBeenCalled();
  });

  test("deve fechar o modal após clicar no botão de confirmar remoção", async () => {
    const dialog = getByTestId(document, "dialog");
    dialog.showModal = vi.fn();
    dialog.close = vi.fn();
    dialog.showModal = () => (dialog.open = true);

    const btnRemove = getByTestId(document, "btn-remove");
    fireEvent.click(btnRemove);
    const confirmRemove = getByText(document, /Confirma remoção desse tema ?/);
    expect(confirmRemove).toBeDefined();
    const btnConfirm = getByText(document, /Confirmar/);
    await userEvent.click(btnConfirm);
    expect(dialog.close).toHaveBeenCalled();
  });
});
