document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelectorAll(".curreny__selector-options")
    .forEach((selector) => {
      const button = selector.querySelector(".country-button");
      const countryList = selector.querySelector(".country-list");
      const countryInput = selector.querySelector(".selected-country-code");
      const form = selector.querySelector(".country-selector-form");

      button.addEventListener("click", function () {
        if (countryList.style.display === "block") {
          countryList.style.display = "none";
          button.classList.remove("active");
        } else {
          countryList.style.display = "block";
          button.classList.add("active");
        }
      });

      selector.querySelectorAll(".country-list li").forEach((item) => {
        item.addEventListener("click", function () {
          const selectedCountry = this.dataset.value;
          const selectedCurrency = this.dataset.currency;
          const selectedSymbol = this.dataset.symbol;
          const flagSrc = this.querySelector(".country-flag").src;

          button.innerHTML = `
          <img class="country-flag" src="${flagSrc}" alt="Flag">
          <span class="country-currency">${selectedCurrency}</span>(${selectedSymbol})
        `;

          countryInput.value = selectedCountry;
          countryList.style.display = "none";
          button.classList.remove("active");
          form.submit();
        });
      });

      document.addEventListener("click", function (event) {
        if (!selector.contains(event.target)) {
          countryList.style.display = "none";
          button.classList.remove("active");
        }
      });
    });
});
