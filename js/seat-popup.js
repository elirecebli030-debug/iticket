(() => {
  const style = document.createElement("style");
  style.textContent = `
    .seat-popup {
      position: fixed;
      inset: 0;
      z-index: 2147483000;
      display: grid;
      place-items: center;
      padding: 24px;
      background: rgb(0 0 0 / 55%);
    }
    .seat-popup[hidden] { display: none; }
    .seat-popup__panel {
      position: relative;
      width: min(100%, 760px);
      height: min(88vh, 850px);
      overflow: hidden;
      border-radius: 16px;
      background: #f2f2f3;
      box-shadow: 0 20px 60px rgb(0 0 0 / 30%);
    }
    .seat-popup__frame {
      display: block;
      width: 100%;
      height: 100%;
      border: 0;
    }
    @media (max-width: 640px) {
      .seat-popup { padding: 0; }
      .seat-popup__panel {
        width: 100%;
        height: 100%;
        border-radius: 0;
      }
    }
  `;
  document.head.append(style);

  const popup = document.createElement("div");
  popup.className = "seat-popup";
  popup.hidden = true;
  popup.setAttribute("aria-hidden", "true");
  popup.innerHTML = `
    <section class="seat-popup__panel" role="dialog" aria-modal="true" aria-label="Oturacaq seçimi">
      <iframe class="seat-popup__frame" title="Oturacaq seçimi" src="about:blank"></iframe>
    </section>
  `;
  document.body.append(popup);

  const frame = popup.querySelector("iframe");
  const scriptUrl = document.currentScript.src;
  const seatPickerUrl = new URL("../yer.html", scriptUrl).href;

  function closePopup() {
    if (popup.hidden) return;
    popup.hidden = true;
    popup.setAttribute("aria-hidden", "true");
    document.body.style.removeProperty("overflow");
    frame.src = "about:blank";
  }

  function openPopup() {
    frame.src = seatPickerUrl;
    popup.hidden = false;
    popup.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const button = target.closest(".hero-d-cta, .event-mobile-info__cta");
    if (!button || !/bilet\s+al/i.test(button.textContent || "")) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    openPopup();
  }, true);

  popup.addEventListener("click", (event) => {
    if (event.target === popup) closePopup();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePopup();
  });

  window.addEventListener("message", (event) => {
    if (event.source !== frame.contentWindow) return;

    if (event.data === "close-seat-sheet") {
      closePopup();
    } else if (event.data === "checkout-seat-sheet") {
      window.location.href = new URL("../checkout.html", scriptUrl).href;
    }
  });
})();
