class ProductCard extends HTMLElement {
  constructor() {
    super();
    this.mediaEl = this.querySelector(".pc-media-swiper .swiper-wrapper");
    this.thisEl = this;
    this.initSwipers();
    this.attachEventListeners();
  }

  initSwipers() {
    this.mediaSwiper = new Swiper(
      this.querySelector(".swiper-" + this.dataset.id),
      {
        slidesPerView: 1,
        autoplay: false,
        effect: "fade",
        slideToClickedSlide: false,
        allowTouchMove: false,
      }
    );

    this.colorVariantSwiper = new Swiper(this.querySelector(".pc-cv-swiper"), {
      slidesPerView: 5.5,
      spaceBetween: 5,
      speed: 500,
      grabCursor: true,
      nested: true,
      freeMode: {
        enabled: true,
        sticky: false,
        momentumBounce: false,
      },
      mousewheel: {
        enabled: true,
        sensitivity: 4,
      },
      // navigation: {
      //   nextEl: ".swiper-button-next-",
      //   prevEl: ".swiper-button-prev-",
      // },
    });
  }

  /*
  initSwipers() {
    this.mediaSwiper = new Swiper(
      this.querySelector(".swiper-" + this.dataset.id),
      {
        slidesPerView: 1,
        autoplay: false,
        effect: "fade",
        slideToClickedSlide: false,
        allowTouchMove: false,
      }
    );

    this.colorVariantSwiper = new Swiper(this.querySelector(".pc-cv-swiper"), {
      slidesPerView: 5.5,
      spaceBetween: 5,
      speed: 500,
      grabCursor: true,
      nested: true, // Prevents parent swiper from moving
      touchMoveStopPropagation: true, // Stops bubbling but allows child Swiper to work
      freeMode: {
        enabled: true,
        sticky: false,
        momentumBounce: false,
      },
      mousewheel: {
        enabled: true,
        sensitivity: 4,
      },
    });

    const colorVariantSwiperEl = this.querySelector(".pc-cv-swiper");

    if (colorVariantSwiperEl) {
      const debouncedAlert = this.debounce((event) => {}, 300); 

      colorVariantSwiperEl.addEventListener("touchmove", (e) => {
        e.stopPropagation();
        debouncedAlert(e);
      });
      colorVariantSwiperEl.addEventListener("transitionend", () => {});
    } else {
      console.error("Element '.pc-cv-swiper' not found");
    }
  }

  debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
  */
  attachEventListeners() {
    // this.querySelector("card-media").addEventListener(
    //   "mouseenter",
    //   this.handleMouseEnterEvent.bind(this)
    // );
    // this.querySelector("card-media").addEventListener(
    //   "mouseleave",
    //   this.handleMouseLeaveEvent.bind(this)
    // );

    // Attach event listener to all color variants inside this product card
    this.querySelector("pc-color-variant").addEventListener(
      "input",
      this.handleColorVariantInput.bind(this)
    );

    // quick view
    if (this.querySelector(".pc-quick-add-btn")) {
      this.querySelector(".pc-quick-add-btn").addEventListener(
        "click",
        this.handleQuickViewEvent.bind(this)
      );
    }
  }

  handleMouseEnterEvent() {
    if (this.mediaSwiper) {
      this.mediaSwiper.slideTo(1);
    }
  }

  handleMouseLeaveEvent() {
    if (this.mediaSwiper) {
      this.mediaSwiper.slideTo(0);
    }
  }

  handleColorVariantInput(e) {
    const { productId } = e.target?.dataset || null;

    if (!productId) {
      console.error("Product ID not found in dataset:", e.target);
      return;
    }

    const productJsonData = this.getStructuredData(productId) || {};
    const optionsData = this.getStructureOptionsData(productId) || {};

    if (this.querySelector(".pc-quick-add-btn")) {
      this.querySelector(".pc-quick-add-btn").setAttribute(
        "data-product-handle",
        productJsonData.handle
      );
    }

    if (this.querySelector(".pc-media-swiper")) {
      this.querySelector(".pc-media-swiper").setAttribute(
        "href",
        "/products/" + productJsonData.handle
      );
    }

    // console.log("optionsData", optionsData)
    // console.log("productJsonData", productJsonData)

    if (optionsData && optionsData?.values) {
      this.updateCardSizeVariants(optionsData);
    }

    if (productJsonData && productJsonData?.images) {
      this.updateCardMedia(productJsonData?.images);
    }
  }

  updateCardSizeVariants(option) {
    let html = "";
    option?.values?.map((value) => {
      html += `<button ${
        value.available === "false" ? "disabled" : ""
      } data-variant-id="${value.variantId}">${
        value.available === "true" ? value.name : `<s>${value.name}</s>`
      }</button>`;
    });
    if (this.querySelector(".pc-size-variants")) {
      this.querySelector(".pc-size-variants").innerHTML = html;
    }
  }

  updateCardMedia(images = []) {
    let html = images
      .map(
        (image) => `
      <div class="swiper-slide">
        <img src="${image}&width=400" alt="Product Image" width="400" height="400" loading="lazy">
      </div>
    `
      )
      .join("");

    if (this.mediaEl) {
      this.mediaEl.innerHTML = html;
      this.mediaSwiper.update(); // Ensure Swiper updates after DOM changes
    } else {
      console.error("Media element not found:", this);
    }
  }

  handleAddToBag(e) {
    e.preventDefault();
    console.log(e.target);
  }
  /*
  handleQuickViewEvent(e) {
    const { productHandle, variantId } = e.currentTarget.dataset;
    fetch(`/products/${productHandle}`)
      .then((res) => res.text())
      .then((res) => {
        const html = new DOMParser().parseFromString(res, "text/html");
        if (html.querySelector("color-variant"))
          html
            .querySelector("color-variant")
            .setAttribute("data-update-url", "false");
        if (html.querySelector("product-information"))
          html
            .querySelector("product-information")
            .setAttribute("data-update-url", "false");
        productQuickView.container.renderContent(
          html.querySelector("#main-product-information").innerHTML
        );
        window.sizeGuide();
        productQuickView.container.open();
      })
      .catch((err) => console.log(err));
  }
  */
  handleQuickViewEvent(e) {
    const { productHandle, variantId } = e.currentTarget.dataset;
    const loadingAnimation = document.getElementById("loading-animation");
    loadingAnimation.classList.add("visible");

    fetch(`/products/${productHandle}`)
      .then((res) => res.text())
      .then((res) => {
        const html = new DOMParser().parseFromString(res, "text/html");
        if (html.querySelector("color-variant"))
          html
            .querySelector("color-variant")
            .setAttribute("data-update-url", "false");
        if (html.querySelector("product-information"))
          html
            .querySelector("product-information")
            .setAttribute("data-update-url", "false");
        productQuickView.container.renderContent(
          html.querySelector("#main-product-information").innerHTML
        );
        // window.sizeGuide();
        productQuickView.container.open();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        loadingAnimation.classList.remove("visible");
      });
  }
  getStructuredData(productId) {
    const scriptTag = this.querySelector(
      `script[type="application/ld+json-${productId}"]`
    );

    if (scriptTag) {
      try {
        return JSON.parse(scriptTag.textContent.trim());
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error(
        "Structured data script not found for product ID:",
        productId
      );
    }
    return null;
  }
  getStructureOptionsData(productId) {
    const scriptTag = this.querySelector(
      `script[type="application/ld+json-pc-options"]`
    );

    if (scriptTag) {
      try {
        const jsonData = JSON.parse(scriptTag.textContent.trim());
        return jsonData?.products?.find((data) => data.productId === productId);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("Structured options data script not found");
    }
    return null;
  }
}

customElements.define("product-card", ProductCard);

class ProductCardSizeVariant extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", this.handleClickeEvent.bind(this));
  }

  handleClickeEvent(e) {
    if (e.target.tagName.toLowerCase() === "button") {
      const { variantId } = e.target.dataset;
      this.handleAddToBag(variantId);
      // this.closest("product-card").handleAddToBag(e)
    }
  }

  handleAddToBag(variantId) {
    if (!variantId) return;

    if (this.querySelector(".pc-quick-add-btn")) {
      this.querySelector(".pc-quick-add-btn").setAttribute(
        "data-variant-id",
        variantId
      );
    }

    let formData = {
      items: [
        {
          id: variantId,
          quantity: 1,
        },
      ],
    };

    fetch(window.Shopify.routes.root + "cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        console.log("response", response);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        if (document.querySelector(".header__icon--cart"))
          document.querySelector(".header__icon--cart").click();
      });
  }
}
customElements.define("pc-size-variant", ProductCardSizeVariant);
