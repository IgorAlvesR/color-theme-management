import { fireEvent, getByTestId, getByText } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { ThemeDOM } from "../js/ThemeDOM.js";
import { ThemeServiceMemory } from "../js/services/ThemeServiceMemory.js";
import { homePage } from "./pages.js";

const { JSDOM } = require("jsdom");

describe("Página home", () => {
  beforeEach(() => {
    const { window } = new JSDOM(homePage, {
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
