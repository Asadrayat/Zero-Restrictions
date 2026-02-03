// comment

class ProductInformation extends HTMLElement {
  constructor() {
    super();
    this.data = {};
    this.productId = this.dataset.productId;
    this.sectionId = this.dataset.sectionId;
    this.initThumbSlider();
    this.handleEvents();
    this.handleActionPopup();
    this.initFAQToggle();
    
    // this.handleSizeOption();
    this.addEventListener("click", function (e) {
      let p__btn = e.target.classList.contains("p-info-size-btn")
        ? e.target
        : e.target.closest(".p-info-size-btn");
      if (p__btn) {
        document.querySelector(".pqa-popup").classList.add("active");
        document.querySelector("body").style.height = "100svh";
        document.querySelector("body").style.overflow = "hidden";
        // window.closeOnOutsideClick();
      }
    });
    this.currentZoom = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.initialDistance = 0;
    this.initialZoom = 1;
    this.lastTouchX = 0;
    this.lastTouchY = 0;
    this.zoomSwiper = null;
    this.zoomPopup = null;
    this.customCursor = null;
  }

  connectedCallback() {
    this.querySelector("product-variant-picker").addEventListener(
      "input",
      (e) => {
        this.handleVariantInput(e);
      }
    );

    // this.attachVariantPickerListener();

    new Accordion(".prod-info-accrodion-" + this.productId, {
      closeAll: true,
      initOpenIndex: 1,
      duration: 700,
      activeClass: "active",
    });

    this.initZoomListeners();
    // No need for preloaded data - we'll fetch on demand
    this.handleActiveSlide(this.dataset.selectedImage);

    if (typeof scrolltoReviewSection === 'function') {
      window.scrolltoReviewSection(5, 1000);
    } else {
      console.error('scrolltoReviewSection function is not defined');
    }

    this.removeHiddenQuantitySelector();
    window.addEventListener("resize", () => this.removeHiddenQuantitySelector());
    this.initQuantitySelector();
    this.variantLabelHover();
  }

  attachVariantPickerListener() {
    const variantPicker = this.querySelector("product-variant-picker");
    if (variantPicker) {
      variantPicker.addEventListener("input", (e) => {
        this.handleVariantInput(e);
      });
    }
  }


  variantLabelHover() {
    if (window.innerWidth < 989) return;

    const variantInners = this.querySelectorAll('.pinfo-variant-inner');
    
    variantInners.forEach((variantInner) => {
      const selectedValue = variantInner.querySelector('.pinfo-selected-value');
      if (!selectedValue) return;
      
      const originalText = selectedValue.textContent;
      const variantValues = variantInner.querySelectorAll('.p-info-variant-value');
      
      variantValues.forEach((variantValue) => {
        const input = variantValue.querySelector('input');
        if (!input) return;
        
        variantValue.addEventListener('mouseenter', () => {
          const inputValue = input.value;
          if (inputValue) selectedValue.textContent = inputValue;
        });
        
        variantValue.addEventListener('mouseleave', () => {
          selectedValue.textContent = originalText;
        });
      });
    });
  }

  initFAQToggle() {
    const reviewApp = this.querySelector('.p-info-review-app');
    if (!reviewApp) return;

    const faqWrap = document.querySelector('.faq__wrapp-review');
    if (!faqWrap) return;

    const faqTitle = faqWrap.querySelector('[data-faq-title]');
    if (!faqTitle) return;

    reviewApp.addEventListener('click', (e) => {
      if (!faqTitle.classList.contains('active')) {
        faqTitle.click();
      }
    });
  }


  removeHiddenQuantitySelector() {
    const isMobile = window.innerWidth <= 1200;

    if (isMobile) {
      const desktopWrapper = this.querySelector('.quantity-selector-wrapper.sm-hide');
      if (desktopWrapper) desktopWrapper.remove();
    } else {
      const mobileWrapper = this.querySelector('.quantity-selector-wrapper.lg-hide');
      if (mobileWrapper) mobileWrapper.remove();
    }
  }



  initQuantitySelector() {
    const qtyWrapper = this.querySelector('[data-quantity-selector]');
    if (!qtyWrapper) return;
    const input = qtyWrapper.querySelector('.qty-input');
    const decreaseBtn = qtyWrapper.querySelector('.decrease');
    const increaseBtn = qtyWrapper.querySelector('.increase');
    decreaseBtn.addEventListener('click', () => {
      let currentVal = parseInt(input.value) || 1;
      if (currentVal > parseInt(input.min || 1)) {
        input.value = currentVal - 1;
        this.dispatchQuantityChange(input.value);
      }
    });
    increaseBtn.addEventListener('click', () => {
      let currentVal = parseInt(input.value) || 1;
      input.value = currentVal + 1;
      this.dispatchQuantityChange(input.value);
    });
    input.addEventListener('input', () => {
      if (input.value < 1) input.value = 1;
      this.dispatchQuantityChange(input.value);
    });
  }

  dispatchQuantityChange(value) {
    this.dispatchEvent(new CustomEvent('quantity-change', {
      detail: { quantity: Number(value) },
      bubbles: true
    }));
  }

  handleActionPopup() {
    const openButtons = this.querySelectorAll("[open-action-popup]");
    const closeButtons = this.querySelectorAll("[close-action-popup]");
    const popup = this.querySelector(".action__popup");
    const body = document.body;
    let isProcessing = false;

    const waitForTransition = (element, property) => {
      return new Promise((resolve) => {
        const handler = (e) => {
          if (
            e.target === element &&
            (!property || e.propertyName === property)
          ) {
            element.removeEventListener("transitionend", handler);
            resolve();
          }
        };
        element.addEventListener("transitionend", handler);
        setTimeout(resolve, 1000);
      });
    };

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const openPopup = async () => {
      if (isProcessing || popup.classList.contains("active")) return;
      isProcessing = true;

      const existingOverlay = document.querySelector(".custom-overlay");
      if (existingOverlay) existingOverlay.remove();
      const overlay = document.createElement("div");
      overlay.className = "custom-overlay";
      document.body.appendChild(overlay);

      overlay.classList.add("active");
      await waitForTransition(overlay, "opacity");

      popup.classList.add("active");
      await waitForTransition(popup, "max-height");

      closeButtons.forEach((btn) => btn.classList.add("visible"));
      await waitForTransition(closeButtons[0], "opacity");

      await delay(150);
      body.classList.add("overflow-hidden");

      await delay(150);
      const video = popup.querySelector(".action-video");
      if (video) {
        video.currentTime = 0;
        video.play().catch((error) => console.log("Video play failed:", error));
      }

      isProcessing = false;
    };

    const closePopup = async () => {
      if (isProcessing || !popup.classList.contains("active")) return;
      isProcessing = true;

      const video = popup.querySelector(".action-video");
      if (video) video.pause();

      popup.classList.remove("active");
      await waitForTransition(popup, "max-height");

      closeButtons.forEach((btn) => btn.classList.remove("visible"));
      await waitForTransition(closeButtons[0], "opacity");

      await delay(150);
      body.classList.remove("overflow-hidden");

      const overlay = document.querySelector(".custom-overlay");
      if (overlay) {
        overlay.classList.remove("active");
        await waitForTransition(overlay, "opacity");
        overlay.remove();
      }

      isProcessing = false;
    };

    openButtons.forEach((button) => {
      button.addEventListener("click", openPopup);
    });

    closeButtons.forEach((button) => {
      button.addEventListener("click", closePopup);
    });

    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("custom-overlay")) {
        closePopup();
      }
    });
  }

  handleSizeOption() {
    this.pqaOpener = this.querySelectorAll("[open-pqa-popup]");
    this.pqaPopUp = document.querySelector(".pqa-popup");

    if (this.pqaOpener && this.pqaPopUp) {
      this.pqaOpener.forEach((opener) => {
        opener.addEventListener("click", () => {
          if (!this.pqaPopUp.classList.contains("active")) {
            this.pqaPopUp.classList.add("active");
            document.querySelector("body").style.height = "100svh";
            document.querySelector("body").style.overflow = "hidden";
          }
        });
      });
    }
  }
  /*
  handlePreloadData() {
    try {
      let scriptTag = document.querySelector(
        `script[type="application/json-${this.dataset.productId}"]`
      );
      let jsonData = JSON.parse(scriptTag.textContent);
      return jsonData;
    } catch (err) {
      return null;
    }
  }
  */

  /*
  hadnlePreloadVariantsData() {
    if (this.productData) {
      this.productData?.variants?.map(async (variant) => {
        const response = await fetch(
          this.dataset.url + "?variant=" + variant.id
        );
        const data = await response.text();
        const html = new DOMParser().parseFromString(data, "text/html");
        variant.parse_html = data;
      });
    }
  }
  */

  handleEvents() {
    this.querySelector("form").addEventListener(
      "submit",
      this.handleAddToCart.bind(this)
    );
  }

  handleAddToCart(e) {
    e.preventDefault();

    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn ? btn.textContent : null;

    if (btn) {
      btn.classList.add("loading");
      btn.textContent = "Adding To Bag ...";
      btn.style.pointerEvents = "none";
      btn.style.opacity = ".7";
    }

    this.cart =
      document.querySelector("cart-notification") ||
      document.querySelector("cart-drawer");

    const addToCartForm = this.querySelector('form[action$="/cart/add"]');
    const formData = new FormData(addToCartForm);

    const qtyInput = this.querySelector('.quantity-selector .qty-input');
    if (qtyInput) {
      formData.set('quantity', qtyInput.value);
    }





    if (this.cart) {
      formData.append(
        "sections",
        this.cart.getSectionsToRender().map((section) => section.id)
      );
    }

    fetch(window.Shopify.routes.root + "cart/add.js", {
      method: "POST",
      body: formData,
    })
      .then((r) => r.json())
      .then((response) => {
        this.cart.renderContents(response);
      })
      .finally(() => {
        if (btn) {
          btn.classList.remove("loading");
          btn.textContent = originalText ?? "Add To Bag";
          btn.style.pointerEvents = "";
          btn.style.opacity = "";
        }

        const cartIcon = document.querySelector(".header__icon--cart");
        if (cartIcon) cartIcon.click();

        if (this.cart && this.cart.classList.contains("is-empty")) {
          this.cart.classList.remove("is-empty");
        }
      });
  }


  handleVariantInput(e) {
    const { url, imageId } = e.target?.dataset;

    // Get current variant immediately for notifications
    if (document.querySelector("stock-notify")) {
      const currentVariant = this.getCurrentVariant();
      if (currentVariant) {
        notifyPopup(currentVariant);
      }
    }

    this.handleOptions(url, imageId);
  }

  getCurrentVariant() {
    try {
      // Get selected variant ID from the form
      const variantIdInput = this.querySelector('input[name="id"]');
      if (!variantIdInput || !variantIdInput.value) {
        console.warn("No variant selected");
        return null;
      }

      // Use window.productVariants (already available in your liquid template)
      if (!window.productVariants || !window.productVariants.length) {
        console.error("Product variants not available");
        return null;
      }

      const variantId = parseInt(variantIdInput.value);
      const matchingVariant = window.productVariants.find(
        (variant) => variant.id === variantId
      );

      if (!matchingVariant) {
        console.warn("No matching variant found for ID:", variantId);
      }
      return matchingVariant || null;
    } catch (error) {
      console.error("Error in getCurrentVariant:", error);
      return null;
    }
  }

  handleOptions(url = null, imageId = null) {
    if (imageId && imageId !== null) this.handleActiveSlide(imageId);
    if (url && url !== null) this.handleOptionsUrl(url);
  }

  handleOptionsUrl(url) {
    if (!url || url === null) return;

    this.updateURL(url);
    this.handleQuickAdd(url);
    // this.render(url);
  }

  handleQuickAdd(url) {
    // Extract variant ID from URL
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const variantId = urlParams.get('variant');
    if (!variantId) return;

    // Find variant from window.productVariants
    const variant = window.productVariants?.find(
      (v) => v.id.toString() === variantId
    );
    
    if (variant) {
      this.fetchAndRender(url, variant.id);
    }
  }

  // updateURL(url) {
  //   if (this.dataset.updateUrl === "false") return null;
  //   window.history.pushState({}, "", url);
  // }

  updateURL(url) {
    if (this.dataset.updateUrl === "false") return null;
    
    const collectionHandle = this.dataset.collectionHandle;
    
    if (collectionHandle && this.dataset.withinCollection) {
      const urlObj = new URL(url, window.location.origin);
      const variantParam = urlObj.searchParams.get('variant');
      const productHandle = url.split('?')[0].split('/').pop();
      const newUrl = `/collections/${collectionHandle}/products/${productHandle}${variantParam ? '?variant=' + variantParam : ''}`;
      
      window.history.pushState({}, "", newUrl);
    } else {
      window.history.pushState({}, "", url);
    }
  }

  async newRender(variantOrId) {
    const variantId = typeof variantOrId === 'object' ? variantOrId.id : variantOrId;
    const url = `${this.dataset.url}?variant=${variantId}`;
    
    await this.fetchAndRender(url, variantId);
  }


async fetchAndRender(url, variantId) {
  try {
    // Show loading state
    const variantPicker = this.querySelector("product-variant-picker");
    if (variantPicker) {
      variantPicker.style.opacity = "0.6";
      variantPicker.style.pointerEvents = "none";
    }


    const quickSectionEl   = document.querySelector('.pdp-quick-add-section');
    const detailsSectionEl = document.querySelector('.pdp-details-section');

    const quickKey   = quickSectionEl   ? quickSectionEl.dataset.quickSectionId   : null;
    const detailsKey = detailsSectionEl ? detailsSectionEl.dataset.detailsSectionId : null;

    // Fetch multiple sections in one request
    const sections = [
      this.sectionId,
      quickKey,
      detailsKey
    ].join(',');
    
    const sectionUrl = `${url}&sections=${sections}`;
    const response = await fetch(sectionUrl);
    const data = await response.json(); // Returns JSON object with section HTML
    // Parse each section
    const mainSectionHtml = new DOMParser().parseFromString(
      data[this.sectionId], 
      "text/html"
    );
    const quickAddHtml = new DOMParser().parseFromString(
      data[quickKey], 
      "text/html"
    );
    const detailsHtml = new DOMParser().parseFromString(
      data[detailsKey], 
      "text/html"
    );

    console.log(mainSectionHtml, quickAddHtml, detailsHtml);
    // Update variant picker (from main section)
    if (
      this.querySelector("product-variant-picker") &&
      mainSectionHtml.querySelector("product-variant-picker")
    ) {
      this.querySelector("product-variant-picker").innerHTML =
        mainSectionHtml.querySelector("product-variant-picker").innerHTML;

      // this.attachVariantPickerListener();
    }

    // Update media (from main section)
    if (
      this.querySelector(".p-info-media") &&
      mainSectionHtml.querySelector(".p-info-media")
    ) {
      this.querySelector(".p-info-media").innerHTML =
        mainSectionHtml.querySelector(".p-info-media").innerHTML;
    }
    
    this.initThumbSlider();
    this.handleActionPopup();
    
    // Update product details feature image (from details section)
    if (
      document.querySelector(".product-details-new .pd__feature-image") &&
      detailsHtml.querySelector(".product-details-new .pd__feature-image")
    ) {
      document.querySelector(".product-details-new .pd__feature-image").innerHTML =
        detailsHtml.querySelector(".product-details-new .pd__feature-image").innerHTML;
    }

    // Update price (from main section)
    if (this.querySelectorAll(".p-info-price-wrapper")) {
      this.querySelectorAll(".p-info-price-wrapper").forEach((el) => {
        const priceWrapper = mainSectionHtml.querySelector(".p-info-price-wrapper");
        if (priceWrapper) {
          el.innerHTML = priceWrapper.innerHTML;
        }
      });
    }
    
    // Update discount code container (from main section)
    if (
      this.querySelector(".--discount-code-container") &&
      mainSectionHtml.querySelector(".--discount-code-container")
    ) {
      this.querySelector(".--discount-code-container").innerHTML =
        mainSectionHtml.querySelector(".--discount-code-container").innerHTML;
    }
    
    // Update form (from main section)
    /*
    if (this.querySelector("product-info-form")) {
      const formHtml = mainSectionHtml.querySelector("product-info-form");
      if (formHtml) {
        this.querySelector("product-info-form").innerHTML = formHtml.innerHTML;
        if (window.Shopify && Shopify.PaymentButton) {
          Shopify.PaymentButton.init();
        }
      }
    }
    */


        // Update form (from main section)
    const productInfoForm = this.querySelector("product-info-form");

    if (productInfoForm) {
      const formHtml = mainSectionHtml.querySelector("product-info-form");

      if (formHtml) {
        productInfoForm.innerHTML = formHtml.innerHTML;

        if (window.Shopify && Shopify.PaymentButton) {
          Shopify.PaymentButton.init();
        }

        const addToCartBtns = productInfoForm.querySelectorAll(".p-info-add-to-cart");
        const qtySelectors = document.querySelectorAll(".quantity-selector-wrapper");

        let shouldHideQty = false;

        addToCartBtns.forEach(btn => {
          if (btn.classList.contains("hidden")) {
            shouldHideQty = true;
          }
        });

        qtySelectors.forEach(qty => {
          qty.classList.toggle("hidden", shouldHideQty);
        });
      }
    }



    // Update PQA (from quick-add section)
    if (document.querySelector("pqa-new")) {
      const pqaHtml = quickAddHtml.querySelector("pqa-new");
      if (pqaHtml) {
        document.querySelector("pqa-new").innerHTML = pqaHtml.innerHTML;
      }
    }

    // Update inventory status (from main section)
    if (
      this.querySelector(".--inventory-status-wrapper") &&
      mainSectionHtml.querySelector(".--inventory-status-wrapper")
    ) {
      this.querySelector(".--inventory-status-wrapper").innerHTML = 
        mainSectionHtml.querySelector(".--inventory-status-wrapper").innerHTML;
    }

    // Update model info (from main section)
    if (
      this.querySelector(".p-model-info.desktop-model") &&
      mainSectionHtml.querySelector(".p-model-info.desktop-model")
    ) {
      this.querySelector(".p-model-info.desktop-model").innerHTML = 
        mainSectionHtml.querySelector(".p-model-info.desktop-model").innerHTML;
    }

    // Re-initialize everything
    this.handleEvents();
    this.initZoomListeners();
    
    if (typeof scrolltoReviewSection === 'function') {
      scrolltoReviewSection();
    }
    
    if (typeof sizeGuide === 'function') {
      sizeGuide();
    }

    if (typeof initAccordion === 'function') {
      initAccordion();
    }
    if (typeof initAccordion === 'function') {
      initAccordion();
    }
    if (typeof window.globalAtcRemoveFunc === 'function') {
      window.globalAtcRemoveFunc();
    }

    this.variantLabelHover();
    
    this.initFAQToggle();
    
    if (typeof yotpoWidgetsContainer !== 'undefined') {
      yotpoWidgetsContainer.initWidgets();
    }

    // Dispatch variant change event
    if (variantId) {
      document.dispatchEvent(
        new CustomEvent('variant:change', { detail: { variantId } })
      );
    }

  } catch (error) {
    console.error('Error fetching variant data:', error);
  } finally {
    // Remove loading state
    const variantPicker = this.querySelector("product-variant-picker");
    if (variantPicker) {
      variantPicker.style.opacity = "1";
      variantPicker.style.pointerEvents = "inherit";
    }
  }
}

 

  handleActiveSlide(imageId) {
    if (!imageId || imageId === null) return;
    let activeSlide = this.querySelector(
      `.p-info-thumb .swiper-slide[data-image-id="${imageId}"]`
    );
    // if (activeSlide) this.gotoActiveSlide(activeSlide.dataset?.index);
  }

  gotoActiveSlide(index) {
    // if (index && this.thumbSwiper) this.thumbSwiper.slideTo(index);
  }

  initThumbSlider() {
    const thumbEl = this.querySelector('.p-info-thumb');
    if (!thumbEl) return;

    const hasSingleSlide = !!thumbEl.querySelector('[data-single-slide], [data-single-slide="true"]');

    const baseConfig = {
      slidesPerView: 'auto',
      spaceBetween: 0,
      autoHeight: true,
      loop: true,
      grabCursor: true,
      freeMode: true,
      pagination: {
        el: '.swiper-pagination',
        type: 'fraction', // Adds pagination counter (e.g., 1/5)
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        0:   { slidesPerView: 1.2, autoHeight: true, spaceBetween: 1 },
        500: { slidesPerView: 1.5, autoHeight: true, spaceBetween: 0 },
        769: { slidesPerView: 'auto', spaceBetween: 0 },
      },
    };

    const singleSlideOverrides = hasSingleSlide ? {
      slidesPerView: 1,
      loop: false,
      breakpoints: {
        0:   { slidesPerView: 1, autoHeight: true, spaceBetween: 0 },
        500: { slidesPerView: 1, autoHeight: true, spaceBetween: 0 },
        769: { slidesPerView: 1, autoHeight: true, spaceBetween: 0 },
      },
    } : {};

    this.thumbSwiperConfig = { ...baseConfig, ...singleSlideOverrides };
    this.thumbSwiper = new Swiper(thumbEl, this.thumbSwiperConfig);
  }

initZoomListeners() {
  this.customCursorBreakpoint = 1200;
  this.querySelectorAll('.p-info-thumb-slide').forEach(slide => {
    slide.addEventListener('click', this.handleImageClick.bind(this));
  });
}

createCustomCursor() {
  if (this.customCursor) return;
  if (window.innerWidth < this.customCursorBreakpoint) return;
  
  this.customCursor = document.createElement('div');
  this.customCursor.className = 'custom-zoom-cursor';
  document.body.appendChild(this.customCursor);
  
  this.setCursorPlus();
}

removeCustomCursor() {
  if (this.customCursor) {
    this.customCursor.remove();
    this.customCursor = null;
  }
}

updateCursorPosition(e) {
  if (!this.customCursor) return;
  this.customCursor.style.left = (e.clientX - 16) + 'px';
  this.customCursor.style.top = (e.clientY - 16) + 'px';
}

setCursorPlus() {
  if (!this.customCursor) return;
  this.customCursor.innerHTML = `
    <svg class="cursor-svg" fill="#000000" width="24px" height="24px" viewBox="0 0 24 24" id="plus" data-name="Line Color" xmlns="http://www.w3.org/2000/svg" class="icon line-color"><path id="primary" d="M5,12H19M12,5V19" style="fill: none; stroke: rgb(0, 0, 0); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path></svg>
  `;
}

setCursorMinus() {
  if (!this.customCursor) return;
  this.customCursor.innerHTML = `
    <svg class="cursor-svg" fill="#000000" width="24px" height="24px" viewBox="0 0 24 24" id="minus" data-name="Line Color" xmlns="http://www.w3.org/2000/svg" class="icon line-color"><line id="primary" x1="19" y1="12" x2="5" y2="12" style="fill: none; stroke: rgb(0, 0, 0); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></line></svg>
  `;
}

handleImageClick(e) {
  const slide = e.currentTarget;
  const allSlides = Array.from(this.querySelectorAll('.p-info-thumb-slide'));
  const clickedIndex = allSlides.indexOf(slide);
  this.openZoomPopup(clickedIndex);
}

openZoomPopup(initialIndex) {
  this.zoomPopup = document.createElement('div');
  this.zoomPopup.classList.add('zoom-popup');

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('swiper', 'zoom-swiper');

  const wrapper = document.createElement('div');
  wrapper.classList.add('swiper-wrapper');

  let thumbSlides = Array.from(this.querySelectorAll('.p-info-thumb-slide'));

  thumbSlides.forEach((thumb, idx) => {
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide', 'zoom-slide');
    
    const img = thumb.querySelector('img');
    const lowResSrc = img.currentSrc || img.src;
    const highResSrc = img.dataset.highResSrc || lowResSrc.replace(/width=\d+/, 'width=2048');
    
    const bgDiv = document.createElement('div');
    bgDiv.classList.add('zoom-bg-image');
    bgDiv.style.backgroundImage = `url('${lowResSrc}')`;
    bgDiv.dataset.lowResSrc = lowResSrc;
    bgDiv.dataset.highResSrc = highResSrc;
    bgDiv.dataset.currentRes = 'low';
    
    slide.appendChild(bgDiv);
    wrapper.appendChild(slide);
  });

  swiperContainer.appendChild(wrapper);

  const navWrapper = document.createElement('div');
  navWrapper.classList.add('zoom-swiper-nav');

  const navButtonsWrapper = document.createElement('div');
  navButtonsWrapper.classList.add('zoom-swiper-nav-buttons');

  const prev = document.createElement('div');
  prev.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M19 12L5 12M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>`;
  prev.classList.add('swiper-button-prev');
  navButtonsWrapper.appendChild(prev);

  const next = document.createElement('div');
  next.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                          <path d="M5 12.3H19M19 12.3L12 5.30005M19 12.3L12 19.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>`;
  next.classList.add('swiper-button-next');
  navButtonsWrapper.appendChild(next);

  navWrapper.appendChild(navButtonsWrapper);

  const paginationWrapper = document.createElement('div');
  paginationWrapper.classList.add('zoom-swiper-nav-pagination');

  const pagination = document.createElement('div');
  pagination.classList.add('swiper-pagination');
  paginationWrapper.appendChild(pagination);

  navWrapper.appendChild(paginationWrapper);

  swiperContainer.appendChild(navWrapper);

  const close = document.createElement('button');
  close.classList.add('zoom-close');
  close.innerHTML = `<svg fill="#000000" width="32px" height="32px" viewBox="-6 -6 24 24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin" class="jam jam-close"><path d='M7.314 5.9l3.535-3.536A1 1 0 1 0 9.435.95L5.899 4.485 2.364.95A1 1 0 1 0 .95 2.364l3.535 3.535L.95 9.435a1 1 0 1 0 1.414 1.414l3.535-3.535 3.536 3.535a1 1 0 1 0 1.414-1.414L7.314 5.899z' /></svg>`;
  this.zoomPopup.appendChild(close);

  this.zoomPopup.appendChild(swiperContainer);
  document.body.appendChild(this.zoomPopup);

  const isMobile = window.innerWidth < 990;

  this.zoomSwiper = new Swiper(swiperContainer, {
    initialSlide: initialIndex,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
    },
    loop: false,
    allowTouchMove: true,
    touchRatio: isMobile ? 1 : 0,
  });

  this.zoomSwiper.on('slideChange', () => {
    this.zoomOutIfZoomed();
  });

  close.addEventListener('click', this.closeZoomPopup.bind(this));
  this.zoomPopup.addEventListener('click', (e) => {
    if (e.target === this.zoomPopup) {
      this.closeZoomPopup();
    }
  });

  const slides = swiperContainer.querySelectorAll('.zoom-slide');
  slides.forEach(sl => {
    sl.addEventListener('click', this.toggleZoom.bind(this));
    sl.addEventListener('mousemove', this.handleSlideMouseMove.bind(this));
    sl.addEventListener('mouseleave', this.handleSlideMouseLeave.bind(this));
    sl.addEventListener('touchstart', this.handleTouchStart.bind(this));
    sl.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
  });

  [close, navWrapper].forEach(el => {
    el.addEventListener('mouseenter', this.handleNavMouseEnter.bind(this));
    el.addEventListener('mouseleave', this.handleNavMouseLeave.bind(this));
  });

  swiperContainer.addEventListener('mousemove', this.handleSwiperMouseMove.bind(this));
  swiperContainer.addEventListener('mouseleave', this.handleSwiperMouseLeave.bind(this));

  document.body.classList.add('overflow-hidden');
}


handleSwiperMouseMove(e) {
  if (window.innerWidth < this.customCursorBreakpoint) return;
  
  const target = e.target;
  if (target.closest('.zoom-swiper-nav') || 
      target.closest('.zoom-close')) {
    this.removeCustomCursor();
    return;
  }
  
  if (!target.closest('.zoom-slide')) {
    this.createCustomCursor();
    this.setCursorPlus();
    this.updateCursorPosition(e);
  }
}

handleSwiperMouseLeave() {
  this.removeCustomCursor();
}

handleSlideMouseMove(e) {
  if (window.innerWidth < this.customCursorBreakpoint) return;
  
  const target = e.target;
  if (target.closest('.zoom-swiper-nav') || 
      target.closest('.zoom-close')) {
    this.removeCustomCursor();
    return;
  }
  
  this.createCustomCursor();
  this.updateCursorPosition(e);
  
  const slide = e.currentTarget;
  if (slide.classList.contains('zoomed')) {
    this.setCursorMinus();
    this.panImage(e);
  } else {
    this.setCursorPlus();
  }
}


handleSlideMouseLeave() {
  if (!this.zoomPopup.contains(document.elementFromPoint(event.clientX, event.clientY))) {
    this.removeCustomCursor();
  }
}

handleNavMouseEnter() {
  this.removeCustomCursor();
}

handleNavMouseLeave(e) {
  if (window.innerWidth < this.customCursorBreakpoint) return;
  
  if (e.relatedTarget && e.relatedTarget.closest('.zoom-slide')) {
    this.createCustomCursor();
    const slide = this.zoomSwiper.slides[this.zoomSwiper.activeIndex];
    if (slide && slide.classList.contains('zoomed')) {
      this.setCursorMinus();
    } else {
      this.setCursorPlus();
    }
  }
}

closeZoomPopup() {
  if (this.zoomSwiper) {
    this.zoomSwiper.destroy(true, true);
  }
  if (this.zoomPopup) {
    this.zoomPopup.remove();
  }
  this.removeCustomCursor();
  document.body.classList.remove('overflow-hidden');
  this.currentZoom = 1;
}

zoomOutIfZoomed() {
  const allSlides = this.zoomSwiper.slides;
  allSlides.forEach(slide => {
    if (slide.classList.contains('zoomed')) {
      const bgDiv = slide.querySelector('.zoom-bg-image');
      slide.classList.remove('zoomed');
      
      const lowResSrc = bgDiv.dataset.lowResSrc;
      if (bgDiv.dataset.currentRes === 'high' && lowResSrc) {
        bgDiv.style.backgroundImage = `url('${lowResSrc}')`;
        bgDiv.dataset.currentRes = 'low';
      }
      
      bgDiv.style.backgroundSize = 'contain';
      bgDiv.style.backgroundPosition = 'center';
    }
  });
  
  this.currentZoom = 1;
  this.updateSwiperTouchMove();
}

updateSwiperTouchMove() {
  const isMobile = window.innerWidth < 990;
  if (this.zoomSwiper) {
    if (isMobile) {
      this.zoomSwiper.params.touchRatio = this.currentZoom > 1 ? 0 : 1;
    } else {
      this.zoomSwiper.params.touchRatio = 0;
    }
    this.zoomSwiper.update();
  }
}

toggleZoom(e) {
  e.preventDefault();
  e.stopPropagation();
  const slide = e.currentTarget;
  const bgDiv = slide.querySelector('.zoom-bg-image');
  if (slide.classList.contains('zoomed')) {
    this.zoomOut(slide, bgDiv);
  } else {
    this.zoomIn(slide, bgDiv);
  }
}

zoomIn(slide, bgDiv) {
  this.currentZoom = 3;
  
  const highResSrc = bgDiv.dataset.highResSrc;
  const currentRes = bgDiv.dataset.currentRes;
  
  if (currentRes === 'low' && highResSrc && highResSrc !== bgDiv.dataset.lowResSrc) {
    const highResImg = new Image();
    highResImg.onload = () => {
      bgDiv.style.backgroundImage = `url('${highResSrc}')`;
      bgDiv.dataset.currentRes = 'high';
    };
    highResImg.src = highResSrc;
  }
  
  bgDiv.style.backgroundSize = `${this.currentZoom * 100}%`;
  bgDiv.style.backgroundPosition = 'center';
  slide.classList.add('zoomed');
  
  if (window.innerWidth >= this.customCursorBreakpoint) {
    this.setCursorMinus();
  }
  this.updateSwiperTouchMove();
}

zoomOut(slide, bgDiv) {
  this.currentZoom = 1;
  
  const lowResSrc = bgDiv.dataset.lowResSrc;
  const currentRes = bgDiv.dataset.currentRes;
  
  if (currentRes === 'high' && lowResSrc) {
    bgDiv.style.backgroundImage = `url('${lowResSrc}')`;
    bgDiv.dataset.currentRes = 'low';
  }
  
  bgDiv.style.backgroundSize = 'contain';
  bgDiv.style.backgroundPosition = 'center';
  slide.classList.remove('zoomed');
  
  if (window.innerWidth >= this.customCursorBreakpoint) {
    this.setCursorPlus();
  }
  this.updateSwiperTouchMove();
}

panImage(e) {
  if (this.currentZoom <= 1) return;
  
  const slide = this.zoomSwiper.slides[this.zoomSwiper.activeIndex];
  const bgDiv = slide.querySelector('.zoom-bg-image');
  const rect = slide.getBoundingClientRect();
  
  const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
  const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
  
  bgDiv.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
}


handleTouchStart(e) {
  if (e.touches.length === 2) {
    this.initialDistance = this.getTouchDistance(e.touches[0], e.touches[1]);
    this.initialZoom = this.currentZoom;
  } else if (e.touches.length === 1) {
    const slide = this.zoomSwiper.slides[this.zoomSwiper.activeIndex];
    const bgDiv = slide.querySelector('.zoom-bg-image');
    
    this.lastTouchX = e.touches[0].clientX;
    this.lastTouchY = e.touches[0].clientY;
    
    const bgPos = bgDiv.style.backgroundPosition || 'center';
    const parts = bgPos.split(' ');
    this.currentBgX = parseFloat(parts[0]) || 50;
    this.currentBgY = parseFloat(parts[1]) || 50;
  }
}

handleTouchMove(e) {
  e.preventDefault();
  const slide = this.zoomSwiper.slides[this.zoomSwiper.activeIndex];
  const bgDiv = slide.querySelector('.zoom-bg-image');
  const rect = slide.getBoundingClientRect();

  if (e.touches.length === 2) {
    const distance = this.getTouchDistance(e.touches[0], e.touches[1]);
    this.currentZoom = Math.max(1, Math.min(3, this.initialZoom * (distance / this.initialDistance)));
    
    if (this.currentZoom > 1) {
      slide.classList.add('zoomed');
      bgDiv.style.backgroundSize = `${this.currentZoom * 100}%`;
      this.zoomSwiper.params.allowTouchMove = false;
    } else {
      slide.classList.remove('zoomed');
      bgDiv.style.backgroundSize = 'contain';
      bgDiv.style.backgroundPosition = 'center';
      this.zoomSwiper.params.allowTouchMove = true;
    }
  } else if (e.touches.length === 1 && this.currentZoom > 1) {
    const deltaX = e.touches[0].clientX - this.lastTouchX;
    const deltaY = e.touches[0].clientY - this.lastTouchY;
    
    const deltaXPercent = (deltaX / rect.width) * 100 * (this.currentZoom * 0.5);
    const deltaYPercent = (deltaY / rect.height) * 100 * (this.currentZoom * 0.5);
    
    this.currentBgX -= deltaXPercent;
    this.currentBgY -= deltaYPercent;
    
    this.currentBgX = Math.max(0, Math.min(100, this.currentBgX));
    this.currentBgY = Math.max(0, Math.min(100, this.currentBgY));
    
    bgDiv.style.backgroundPosition = `${this.currentBgX}% ${this.currentBgY}%`;
    
    this.lastTouchX = e.touches[0].clientX;
    this.lastTouchY = e.touches[0].clientY;
  }
}

getTouchDistance(t1, t2) {
  return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
}


}

class ProductQuickAdd extends HTMLElement {
  constructor() {
    super();

    this.addEventListener("input", this.handleVariantInput.bind(this));
    this.addEventListener("click", this.handleSubmitEvemt.bind(this));
  }

  handleVariantInput(e) {
    const { value } = e.target;
    if (document.querySelector("product-information"))
      document.querySelector("product-information").handleOptions(value);
  }

  handleSubmitEvemt(e) {
    if (e.target.closest("form")) {
      e.preventDefault();
    }

    if (e.target.tagName === "BUTTON") {
      this.handleAddToCart(e.target.closest("form"), e.target);
    }
    const btnPQA = e.target.classList.contains("pqa-popup-close")
      ? e.target
      : e.target.closest(".pqa-popup-close");
    if (btnPQA) {
      this.classList.remove("active");
      document.querySelector("body").style.height = "auto";
      document.querySelector("body").style.overflow = "auto";
    }
  }

  handleAddToCart(form, btn) {
    if (!form) return;

    if (btn) {
      if (!btn._originalText) {
        btn._originalText = btn.textContent;
      }

      btn.classList.add("loading");
      btn.textContent = "Adding To Bag ...";
      btn.style.pointerEvents = "none";
      btn.style.opacity = ".7";
    }

    this.cart =
      document.querySelector("cart-notification") ||
      document.querySelector("cart-drawer");

    const formData = new FormData(form);

    const qtyInput = document.querySelector(".quantity-selector .qty-input");
    if (qtyInput) {
      formData.set("quantity", qtyInput.value);
    }

    if (this.cart) {
      formData.append(
        "sections",
        this.cart.getSectionsToRender().map(section => section.id)
      );
    }

    fetch(window.Shopify.routes.root + "cart/add.js", {
      method: "POST",
      body: formData,
    })
      .then(response => response.json())
      .then(response => {
        this.cart.renderContents(response);
      })
      .finally(() => {
        if (btn) {
          btn.classList.remove("loading");
          btn.textContent = btn._originalText;
          btn.style.pointerEvents = "unset";
          btn.style.opacity = "1";
        }

        document.querySelectorAll(".pqa-popup-close").forEach(popup__close => {
          popup__close.click();
        });

        document.querySelector(".header__icon--cart")?.click();

        if (this.cart && this.cart.classList.contains("is-empty")) {
          this.cart.classList.remove("is-empty");
        }
      });
  }



}

document.addEventListener("DOMContentLoaded", (e) => {
  customElements.define("product-information", ProductInformation);
  customElements.define("pqa-new", ProductQuickAdd);
});



// Define the global function
window.globalAtcRemoveFunc = function () {
  document.querySelectorAll('.custom__atc-global-btn').forEach(btn => {
    btn.classList.remove('custom__atc-global-btn');
  });
};

// Run it once when the page fully loads
document.addEventListener('DOMContentLoaded', function () {
  window.globalAtcRemoveFunc();
});


