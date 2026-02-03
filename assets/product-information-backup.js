
document.addEventListener("DOMContentLoaded", () => {
  window._productInfos = window._productInfos || {};
  
  if (document.querySelector("#selected-size-variant")) {
    _productInfos.selectedSize = document.querySelector(
      "#selected-size-variant"
    ).value;
  }
  if (document.querySelector("#selected-color-variant")) {
    _productInfos.selectedColor = document.querySelector(
      "#selected-color-variant"
    ).value;
  }

  _productInfos.swiperConfig = {
    slidesPerView: 2.5,
    spaceBetween: 0,
    loop: true,
    autoplay: {
      delay: 5000,
    },
    grabCursor: true,
    breakpoints: {
      100: {
        slidesPerView: 1,
      },
      500: {
        slidesPerView: 1.5,
      },
      769: {
        slidesPerView: 2.5,
      },
    },
  }

  _productInfos.thumbSwiper = new Swiper(".p-info-thumb", _productInfos.swiperConfig);

  _productInfos.swiperInit = (index=0) => {
    _productInfos.thumbSwiper = new Swiper(".p-info-thumb", _productInfos.swiperConfig);
  }
  

  _productInfos.updateURL = (productHandle = null, variantId = null) => {
    if (!productHandle && !variantId) {
      return null;
    }

    let newUrl = window.location.pathname;

    if (productHandle) {
      newUrl = productHandle;
    }

    const urlObj = new URL(window.location.origin + newUrl);

    if (variantId) {
      urlObj.searchParams.set("variant", variantId);
    } else {
      urlObj.searchParams.delete("variant");
    }

    if (window.history.pushState) {
      window.history.pushState({ path: urlObj.href }, "", urlObj.href);
    }

    return urlObj.href;
  };

  _productInfos.renderSection = async (url, isColorFilter = false) => {
    const response = await fetch(url);
    const data = await response.text();
    const html = new DOMParser().parseFromString(data, "text/html");

    if (isColorFilter) {
      if (document.querySelector("color-variant")) {
        document.querySelector("color-variant").innerHTML =
          html.querySelector("color-variant").innerHTML;
      }

      if (document.querySelector(".p-info-thumb .swiper-wrapper")) {
        document.querySelector(".p-info-thumb .swiper-wrapper").innerHTML = html.querySelector(".p-info-thumb .swiper-wrapper").innerHTML;
        _productInfos?.thumbSwiper?.destroy(true, true)
        _productInfos?.swiperInit()
      }
    }

    if (document.querySelector("size-variant-picker")) {
      document.querySelector("size-variant-picker").innerHTML =
        html.querySelector("size-variant-picker").innerHTML;
    }

    if (document.querySelector(".p-info-price")) {
      document.querySelector(".p-info-price").innerHTML =
        html.querySelector(".p-info-price").innerHTML;
    }

    if (document.querySelector("product-info-form")) {
      document.querySelector("product-info-form").innerHTML =
        html.querySelector("product-info-form").innerHTML;
      if (window.Shopify && Shopify.PaymentButton) {
        Shopify.PaymentButton.init();
      }
    }
  };

  class ColorFilter extends HTMLElement {
    constructor() {
      super();
      this.updateURL = this.dataset?.updateUrl || "false"
      this.section = this.dataset?.section;
      this.variantId = this.dataset?.variantId;
      this.addEventListener("input", this.handleInputEvent.bind(this));
    }

    handleInputEvent(e) {
      const { value } = e.target;
      const { selectedColor, productId } = e.target.dataset;
      _productInfos.selectedColor = selectedColor;

      const isExistsVaraint = this.getCurrentVariant(
        this.getStructuredData(productId)
      );

      if (isExistsVaraint) {
        this.variantId = isExistsVaraint.id;
      }

      const url = `${value}?section_id=${this.section}&variant=${this.variantId}`;

      if(this.updateURL === 'true' || this.updateURL === true) _productInfos.updateURL(value, this.variantId);
      _productInfos.renderSection(url, true);
    }

    getStructuredData(productId) {
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

    getCurrentVariant(product) {
      if (!product || !product.variants) {
        console.error("Invalid product data");
        return null;
      }

      const { selectedColor, selectedSize } = _productInfos;

      if (!selectedColor || !selectedSize) {
        console.error("Missing selectedColor or selectedSize");
        return null;
      }

      const variant = product.variants.find(
        (variant) =>
          variant.title.toLowerCase().includes(selectedColor.toLowerCase()) &&
          variant.title.toLowerCase().includes(selectedSize.toLowerCase())
      );

      return variant;
    }
  }

  customElements.define("color-variant", ColorFilter);

  class SizeFilter extends HTMLElement {
    constructor() {
      super();
      this.updateURL = this.dataset?.updateUrl || "false"
      this.addEventListener("input", this.handleInputEvent.bind(this));
    }

    handleInputEvent(e) {
      const { value } = e.target;
      const { variant, url } = e.target.dataset;
      _productInfos.selectedSize = value;
      if(this.updateURL === 'true' || this.updateURL === true) _productInfos.updateURL(null, variant);
      _productInfos.renderSection(url, false);
    }
  }
  customElements.define("size-variant-picker", SizeFilter);
});
