class ProductInformation extends HTMLElement {
  constructor() {
    super();
    this.initThumbSlider();
  }

  connectedCallback() {
    this.querySelector("color-variant").addEventListener(
      "input",
      this.handleColorVariantProduct.bind(this)
    );
    this.querySelector("size-variant-picker").addEventListener(
      "input",
      this.handleSizeVariant.bind(this)
    );
  }

  handleColorVariantProduct(e) {
    const { value } = e.target;
    const { selectedColor } = e.target?.dataset;

    this.handleOptions();
  }

  handleSizeVariant(e) {
    const { value } = e.target;

    this.handleOptions();
  }

  handleOptions() {
    this.getSelectedOption();
    this.getCurrentVariant(this.getStructuredData());
    this.updateURL();
    this.generateURL();
    this.render();
  }

  getSelectedOption() {
    const selectedColorInput = this.querySelector(
      'color-variant input[type="radio"]:checked'
    );
    const selectedSizeInput = this.querySelector(
      'size-variant-picker input[type="radio"]:checked'
    );

    const colorProductHandle = selectedColorInput
      ? selectedColorInput.value
      : null;
    const selectedSize = selectedSizeInput ? selectedSizeInput.value : null;

    const productId = selectedColorInput?.dataset?.productId;
    const selectedColor = selectedColorInput?.dataset?.selectedColor;

    this.options = {
      productId: productId,
      handle: colorProductHandle,
      size: selectedSize,
      color: selectedColor,
      variantId: null,
    };
  }

  generateURL() {
    let url = this.options.handle;
    if (this.options.variantId)
      url = `${this.options.handle}?variant=${this.options.variantId}`;
    this.url = url;
  }

  updateURL() {
    if (!this.options.handle || this.dataset.updateUrl === "false") return null;
    const newUrl = this.options.handle;
    const urlObj = new URL(window.location.origin + newUrl);

    if (this.options?.variantId) {
      urlObj.searchParams.set("variant", this.options?.variantId);
    } else {
      urlObj.searchParams.delete("variant");
    }

    if (window.history.pushState) {
      window.history.pushState({ path: urlObj.href }, "", urlObj.href);
    }
  }

  async render() {
    const response = await fetch(this.url);
    const data = await response.text();
    const html = new DOMParser().parseFromString(data, "text/html");

    if (this.querySelector("color-variant")) {
      this.querySelector("color-variant").innerHTML =
        html.querySelector("color-variant").innerHTML;
    }

    if (this.querySelector(".p-info-thumb .swiper-wrapper")) {
      this.querySelector(".p-info-thumb .swiper-wrapper").innerHTML =
        html.querySelector(".p-info-thumb .swiper-wrapper").innerHTML;

      if (this.thumbSwiper) this.thumbSwiper.destroy(true, true);
      this.initThumbSlider();
    }

    if (this.querySelector("size-variant-picker")) {
      this.querySelector("size-variant-picker").innerHTML = html.querySelector(
        "size-variant-picker"
      ).innerHTML;
    }

    if (this.querySelectorAll(".p-info-title")) {
      this.querySelectorAll(".p-info-title").forEach((el) => {
        el.innerHTML = html.querySelector(".p-info-title").innerHTML;
      });
    }
    if (this.querySelectorAll(".p-info-price")) {
      this.querySelectorAll(".p-info-price").forEach((el) => {
        el.innerHTML = html.querySelector(".p-info-price").innerHTML;
      });
    }

    if (this.querySelector("product-info-form")) {
      this.querySelector("product-info-form").innerHTML =
        html.querySelector("product-info-form").innerHTML;
      if (window.Shopify && Shopify.PaymentButton) {
        Shopify.PaymentButton.init();
      }
    }
    window.sizeGuide();
  }

  getCurrentVariant(product) {
    if (!product || !product.variants) {
      console.error("Invalid product data");
      return null;
    }

    const { color, size } = this.options;
    console.log(color, size);

    if (!color || !size) {
      console.error("Missing color or selectedSize");
      return null;
    }

    const variant = product.variants.find(
      (variant) => variant.title.includes(color) && variant.title.includes(size)
    );

    if (variant) {
      this.options.variantId = variant.id;
      this.currentVariant = variant;
    }
  }

  getStructuredData() {
    const productId = this.options?.productId;
    const scriptTag = document.querySelector(
      `script[type="application/ld+json-${productId}"]`
    );

    if (scriptTag) {
      try {
        // Parse the JSON data inside the script tag
        return JSON.parse(scriptTag.textContent.trim());
      } catch (error) {
        console.error("Error parsing JSON:", error);
        return null;
      }
    } else {
      console.error(
        "Structured data script not found for product ID:",
        productId
      );
      return null;
    }
  }

  initThumbSlider() {
    this.thumbSwiperConfig = {
      slidesPerView: 2.5,
      spaceBetween: 0,
      loop: true,
      // autoplay: {
      //   delay: 5000,
      // },
      // grabCursor: true,
      breakpoints: {
        100: {
          slidesPerView: 1,
        },
        500: {
          slidesPerView: 1.5,
        },
        769: {
          slidesPerView: 3,
        },
      },
    };
    this.thumbSwiper = new Swiper(
      this.querySelector(".p-info-thumb"),
      this.thumbSwiperConfig
    );
  }
}

customElements.define("product-information", ProductInformation);
