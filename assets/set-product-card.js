let bundle_product_cards = document.querySelectorAll(".--set-product");

bundle_product_cards.forEach((card) => {
  let sizes = card.querySelectorAll(".--size-selector .size-radio");
  let open_size_selector = card.querySelector(".--open-size-selector");
  let size_selector = card.querySelector(".--size-selector");

  // Open size selector
  open_size_selector.addEventListener("click", () => {
    size_selector.classList.add("active");
  });

  // Set the first enabled size on load
  let firstEnabledRadio = Array.from(sizes).find((size) => !size.disabled); // Find the first enabled size radio
  if (firstEnabledRadio) {
    const selectedSizeSpans = card.querySelectorAll(".selected_value-display");
    selectedSizeSpans.forEach((size_span) => {
      size_span.textContent = firstEnabledRadio.getAttribute("data-size-value");
    });
  }

  // When a size is clicked
  sizes.forEach((size) => {
    size.addEventListener("click", () => {
      console.log("clicked");
      size_selector.classList.remove("active");

      const selectedSizeSpans = card.querySelectorAll(
        ".selected_value-display"
      );
      const selectedRadio = card.querySelector(".size-radio:checked");

      if (selectedRadio) {
        selectedSizeSpans.forEach((size_span) => {
          size_span.textContent = selectedRadio.getAttribute("data-size-value");
        });
      }
    });
  });
});
// Outside Click
document.addEventListener("click", function (event) {
  let size_selectors = document.querySelectorAll(".--size-selector");

  size_selectors.forEach((size_selector) => {
    // Check if the click target is not inside the size_selector and not inside the open-size-selector
    if (
      !size_selector.contains(event.target) &&
      !event.target.closest(".--open-size-selector")
    ) {
      size_selector.classList.remove("active");
      console.log("Clicked outside the size selector!");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const setEqualHeight21 = (selector) => {
    const divs = document.querySelectorAll(selector);
    const maxHeight = Math.max(...Array.from(divs, (div) => div.offsetHeight));
    divs.forEach((div) => {
      div.style.height = `${maxHeight}px`;
    });
  };

  setEqualHeight21(".--product-details");
});
