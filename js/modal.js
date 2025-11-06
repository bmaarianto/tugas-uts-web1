(function () {
  // Simple modal helper that injects DOM nodes and reuses existing .modal/.modal-content styles
  function ensureContainer() {
    ensureStyles();
    if (document.getElementById("globalModalContainer")) return;
    const container = document.createElement("div");
    container.id = "globalModalContainer";
    document.body.appendChild(container);
  }

  // Inject basic modal styles so the injected modal looks consistent on pages
  // that don't include shared modal CSS.
  function ensureStyles() {
    if (document.getElementById("globalModalStyles")) return;
    const style = document.createElement("style");
    style.id = "globalModalStyles";
    // scope styles to injected modal container to avoid affecting page's own .modal elements
    const sel = "#globalModalContainer .injected-modal";
    style.innerHTML = `
      ${sel} { display: flex; position: fixed; z-index: 10000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); align-items: center; justify-content: center; padding: 20px; }
      ${sel} .modal-content { background: #fff; margin: 0 auto; padding: 24px; border-radius: 10px; width: 100%; max-width: 480px; position: relative; box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
      ${sel} .close { position: absolute; right: 16px; top: 12px; font-size: 28px; font-weight: bold; color: #aaa; cursor: pointer; }
      ${sel} .close:hover { color: #000; }
      ${sel} h2 { color: #333; margin-bottom: 12px; }
      ${sel} p { color: #333; margin: 0; }
      ${sel} .modal-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:18px; }
      ${sel} .btn-submit { padding: 10px 16px; background: #667eea; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
      ${sel} .btn-submit[style] { /* allow inline override */ }
      ${sel} .btn-submit.secondary { background: #ccc; color: #000; }
    `;
    document.head.appendChild(style);
  }

  function createModalNode(title, message, isConfirm) {
    ensureContainer();
    const overlay = document.createElement("div");
    // this class is intentionally different from page .modal to avoid showing page modals
    overlay.className = "injected-modal";
    overlay.style.display = "block";

    const dialog = document.createElement("div");
    dialog.className = "modal-content";
    dialog.style.maxWidth = "480px";

    const closeBtn = document.createElement("span");
    closeBtn.className = "close";
    closeBtn.innerHTML = "&times;";
    closeBtn.style.cursor = "pointer";

    const h2 = document.createElement("h2");
    h2.textContent = title || "";

    const content = document.createElement("div");
    content.style.margin = "10px 0 20px 0";
    content.innerHTML =
      typeof message === "string"
        ? '<p style="white-space:pre-wrap">' + message + "</p>"
        : "";

    const actions = document.createElement("div");
    actions.className = "modal-actions";

    const btnCancel = document.createElement("button");
    btnCancel.className = "btn-submit secondary";
    btnCancel.textContent = "Batal";

    const btnOk = document.createElement("button");
    btnOk.className = "btn-submit";
    btnOk.textContent = isConfirm ? "Ya" : "OK";

    actions.appendChild(isConfirm ? btnCancel : document.createElement("span"));
    if (isConfirm) actions.appendChild(btnOk);
    if (!isConfirm) {
      // for alert, show single OK on right
      actions.innerHTML = "";
      actions.appendChild(btnOk);
    }

    dialog.appendChild(closeBtn);
    if (title) dialog.appendChild(h2);
    dialog.appendChild(content);
    dialog.appendChild(actions);
    overlay.appendChild(dialog);

    return { overlay, btnOk, btnCancel, closeBtn };
  }

  function showAlert(message, title) {
    return new Promise((resolve) => {
      const { overlay, btnOk, closeBtn } = createModalNode(
        title,
        message,
        false
      );
      function cleanup() {
        overlay.remove();
      }
      btnOk.addEventListener("click", () => {
        cleanup();
        resolve();
      });
      closeBtn.addEventListener("click", () => {
        cleanup();
        resolve();
      });
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          cleanup();
          resolve();
        }
      });
      document.getElementById("globalModalContainer").appendChild(overlay);
    });
  }

  function showConfirm(message, title) {
    return new Promise((resolve) => {
      const { overlay, btnOk, btnCancel, closeBtn } = createModalNode(
        title,
        message,
        true
      );
      function cleanup() {
        overlay.remove();
      }
      btnOk.addEventListener("click", () => {
        cleanup();
        resolve(true);
      });
      btnCancel.addEventListener("click", () => {
        cleanup();
        resolve(false);
      });
      closeBtn.addEventListener("click", () => {
        cleanup();
        resolve(false);
      });
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          cleanup();
          resolve(false);
        }
      });
      document.getElementById("globalModalContainer").appendChild(overlay);
    });
  }

  window.showAlert = showAlert;
  window.showConfirm = showConfirm;
})();
