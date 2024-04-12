export class Modal {
  constructor(title, content, textConfirm = "OK") {
    this.modal = document.querySelector("dialog");
    this.#setTitle(title);
    this.#setContent(content);
    this.#setTextConfirm(textConfirm);
    this.#onClose();
    this.modal.showModal();
  }

  #setTextConfirm(text) {
    const btnConfirm = this.modal.querySelector(".dialog-footer .btn");
    btnConfirm.textContent = text;
  }

  #onClose() {
    this.closeBtn = this.modal.querySelector("dialog .close-btn");
    this.closeBtn.addEventListener("click", this.close.bind(this));
    window.addEventListener("click", this.outsideClick.bind(this));
  }

  #setTitle(text) {
    const title = this.modal.querySelector(".dialog-title");
    title.textContent = text;
  }

  #setContent(content) {
    const dialogContent = this.modal.querySelector(".content-dialog");
    dialogContent.innerHTML = content ? content : "";
  }

  async onConfirm() {
    const btnConfirm = this.modal.querySelector(".dialog-footer button");
    return new Promise((resolve) => {
      btnConfirm.addEventListener("click", () => {
        resolve(true);
      });
    });
  }

  close() {
    this.modal.close();
  }

  outsideClick(e) {
    if (e.target === this.modal) {
      this.close();
    }
  }
}
