import { getByTestId, getByText, queryByText } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { RegisterDOM } from "../js/RegisterDOM.js";
import { ThemeServiceMemory } from "../js/services/ThemeServiceMemory.js";
import { registerPage } from "./pages.js";

const { JSDOM } = require("jsdom");

describe("Página de registro/edição", () => {
  beforeEach(() => {
    const { window } = new JSDOM(registerPage, {
      url: "http://127.0.0.1:5500/src/pages/register-theme.html",
    });
    global.document = window.document;
    global.window = window;
    const serviceThemeMemory = new ThemeServiceMemory();
    const registerDOM = new RegisterDOM(serviceThemeMemory);
    registerDOM.handleSubmitRegister();
  });

  test("deve exibir o formulário de registro de tema", () => {
    const form = getByTestId(document, "form-register");
    expect(form).toBeDefined();
  });

  test("deve exibir mensagem de erro ao enviar nome vazio", async () => {
    const btnRegister = getByText(document, /Salvar/);
    await userEvent.click(btnRegister);
    const error = getByText(document, /Campo é obrigatório/);
    expect(error).toBeDefined();
  });

  test("deve remover mensagem de erro ao enviar nome válido", async () => {
    const btnRegister = getByText(document, /Salvar/);
    await userEvent.click(btnRegister);
    vi.spyOn(window, "alert").mockReturnValue("Tema salvo com sucesso");
    const input = getByTestId(document, "input-theme-name");
    input.value = "tema novo";
    await userEvent.click(btnRegister);
    const error = queryByText(document, /Campo é obrigatório/);
    expect(error).toBeNull();
  });

  test("deve verificar se chegou na mensagem de sucesso ao registrar um tema", async () => {
    const spyAlert = vi
      .spyOn(window, "alert")
      .mockReturnValue("Tema salvo com sucesso");
    const input = getByTestId(document, "input-theme-name");
    input.value = "tema novo";
    const btnRegister = getByText(document, /Salvar/);
    await userEvent.click(btnRegister);
    expect(spyAlert).toHaveBeenCalled();
  });
});
