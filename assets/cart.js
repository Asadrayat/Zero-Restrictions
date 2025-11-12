function initswiperincart() {
 
  console.log("Start 1")
  new Swiper(".swiper-cart-slider", {
    slidesPerView: 1.2,
    spaceBetween: 10,
    touchMoveStopPropagation: true,
    navigation: {
      nextEl: ".next-cart",
      prevEl: ".prev-cart",
    },
    scrollbar: {
      el: ".swiper-scrollbar-cart",
      draggable: true,
      hide: true,
    },
    breakpoints: {
      600: {
        slidesPerView: 1.8,
        spaceBetween: 10,
      },
    },
  });
   cardProductFunc();
    // getDeliveryWindow()
   console.log("End 1")
}
// function getDeliveryWindow() {
//   const today = new Date();

//   const startDate = new Date(today);
//   startDate.setDate(today.getDate() + 4);

//   const endDate = new Date(today);
//   endDate.setDate(today.getDate() + 7);

//   const options = { month: 'short', day: 'numeric' };

//   const formattedStart = startDate.toLocaleDateString('en-US', options);
//   const formattedEnd = endDate.toLocaleDateString('en-US', options);

//   // return `${formattedStart} - ${formattedEnd}`;
//   const deliveryDateText = `${formattedStart} - ${formattedEnd}`;
//   const deliverySpans = document.querySelectorAll('.--delivery-date');
//   deliverySpans.forEach(span => {
//     span.textContent = deliveryDateText;
//   });
// }

// document.addEventListener('DOMContentLoaded', () => {
//   const deliverySpans = document.querySelectorAll('.--delivery-date');
//   const deliveryDateText = getDeliveryWindow();

//   deliverySpans.forEach(span => {
//     span.textContent = deliveryDateText;
//   });
// });


class CartRemoveButton extends HTMLElement {
  constructor() {
    super();

    this.addEventListener("click", (event) => {
      event.preventDefault();
      const cartItems =
        this.closest("cart-items") || this.closest("cart-drawer-items");
      cartItems.updateQuantity(this.dataset.index, 0);
    });
  }
}

customElements.define("cart-remove-button", CartRemoveButton);

class CartItems extends HTMLElement {
  constructor() {
    super();
    this.lineItemStatusElement =
      document.getElementById("shopping-cart-line-item-status") ||
      document.getElementById("CartDrawer-LineItemStatus");

    const debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, ON_CHANGE_DEBOUNCE_TIMER);

    this.addEventListener("change", debouncedOnChange.bind(this));
  }

  cartUpdateUnsubscriber = undefined;

  connectedCallback() {
    this.cartUpdateUnsubscriber = subscribe(
      PUB_SUB_EVENTS.cartUpdate,
      (event) => {
        if (event.source === "cart-items") {
          return;
        }
        this.onCartUpdate();
      }
    );
  }

  disconnectedCallback() {
    if (this.cartUpdateUnsubscriber) {
      this.cartUpdateUnsubscriber();
    }
  }

  resetQuantityInput(id) {
    const input = this.querySelector(`#Quantity-${id}`);
    input.value = input.getAttribute("value");
    this.isEnterPressed = false;
  }

  setValidity(event, index, message) {
    event.target.setCustomValidity(message);
    event.target.reportValidity();
    this.resetQuantityInput(index);
    event.target.select();
  }

  validateQuantity(event) {
    const inputValue = parseInt(event.target.value);
    const index = event.target.dataset.index;
    let message = "";

    if (inputValue < event.target.dataset.min) {
      message = window.quickOrderListStrings.min_error.replace(
        "[min]",
        event.target.dataset.min
      );
    } else if (inputValue > parseInt(event.target.max)) {
      message = window.quickOrderListStrings.max_error.replace(
        "[max]",
        event.target.max
      );
    } else if (inputValue % parseInt(event.target.step) !== 0) {
      message = window.quickOrderListStrings.step_error.replace(
        "[step]",
        event.target.step
      );
    }

    if (message) {
      this.setValidity(event, index, message);
    } else {
      event.target.setCustomValidity("");
      event.target.reportValidity();
      this.updateQuantity(
        index,
        inputValue,
        document.activeElement.getAttribute("name"),
        event.target.dataset.quantityVariantId
      );
    }
  }

  onChange(event) {
    this.validateQuantity(event);
  }

  onCartUpdate() {
    if (this.tagName === "CART-DRAWER-ITEMS") {
      fetch(`${routes.cart_url}?section_id=cart-drawer`)
        .then((response) => response.text())
        .then((responseText) => {
          const html = new DOMParser().parseFromString(
            responseText,
            "text/html"
          );
          const selectors = ["cart-drawer-items", ".cart-drawer__footer"];
          for (const selector of selectors) {
            const targetElement = document.querySelector(selector);
            const sourceElement = html.querySelector(selector);
            if (targetElement && sourceElement) {
              targetElement.replaceWith(sourceElement);
            }
          }
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          console.log("Test 1");
          initswiperincart();
        });
    } else {
      fetch(`${routes.cart_url}?section_id=main-cart-items`)
        .then((response) => response.text())
        .then((responseText) => {
          const html = new DOMParser().parseFromString(
            responseText,
            "text/html"
          );
          const sourceQty = html.querySelector("cart-items");
          this.innerHTML = sourceQty.innerHTML;
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          // console.log("Test 2");
          // initSwiperInCart();
        });
    }
  }

  getSectionsToRender() {
    return [
      {
        id: "main-cart-items",
        section: document.getElementById("main-cart-items").dataset.id,
        selector: ".js-contents",
      },
      {
        id: "cart-icon-bubble",
        section: "cart-icon-bubble",
        selector: ".shopify-section",
      },
      {
        id: "cart-icon-bubble-1",
        section: "cart-icon-bubble-1",
        selector: ".shopify-section",
      },
      {
        id: "cart-icon-bubble-2",
        section: "cart-icon-bubble-2",
        selector: ".shopify-section",
      },
      // {
      //   id: "cart-icon-bubble-3",
      //   section: "cart-icon-bubble-3",
      //   selector: ".shopify-section",
      // },
      {
        id: "cart-live-region-text",
        section: "cart-live-region-text",
        selector: ".shopify-section",
      },
      {
        id: "main-cart-footer",
        section: document.getElementById("main-cart-footer").dataset.id,
        selector: ".js-contents",
      },
    ];
  }

  updateQuantity(line, quantity, name, variantId) {
    this.enableLoading(line);

    const body = JSON.stringify({
      line,
      quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname,
    });

    fetch(`${routes.cart_change_url}`, { ...fetchConfig(), ...{ body } })
      .then((response) => {
        
        return response.text();
        
      })
      .then((state) => {
        const parsedState = JSON.parse(state);
        
        const quantityElement =
          document.getElementById(`Quantity-${line}`) ||
          document.getElementById(`Drawer-quantity-${line}`);
          
        const items = document.querySelectorAll(".cart-item");
        console.log('parsedState', parsedState)
        if (parsedState.errors) {
          quantityElement.value = quantityElement.getAttribute("value");
          console.log('quantityElement.value', quantityElement.value)
          this.updateLiveRegions(line, parsedState.errors);
          return;
        }

        this.classList.toggle("is-empty", parsedState.item_count === 0);
        const cartDrawerWrapper = document.querySelector("cart-drawer");
        const cartFooter = document.getElementById("main-cart-footer");

        if (cartFooter)
          cartFooter.classList.toggle("is-empty", parsedState.item_count === 0);
        if (cartDrawerWrapper)
          cartDrawerWrapper.classList.toggle(
            "is-empty",
            parsedState.item_count === 0
          );

        this.getSectionsToRender().forEach((section) => {
          const elementToReplace =
            document
              .getElementById(section.id)
              .querySelector(section.selector) ||
            document.getElementById(section.id);
          elementToReplace.innerHTML = this.getSectionInnerHTML(
            parsedState.sections[section.section],
            section.selector
          );
        });
        const updatedValue = parsedState.items[line - 1]
          ? parsedState.items[line - 1].quantity
          : undefined;
        let message = "";
        if (
          items.length === parsedState.items.length &&
          updatedValue !== parseInt(quantityElement.value)
        ) {
          if (typeof updatedValue === "undefined") {
            message = window.cartStrings.error;
          } else {
            message = window.cartStrings.quantityError.replace(
              "[quantity]",
              updatedValue
            );
          }
        }
        this.updateLiveRegions(line, message);

        const lineItem =
          document.getElementById(`CartItem-${line}`) ||
          document.getElementById(`CartDrawer-Item-${line}`);
        if (lineItem && lineItem.querySelector(`[name="${name}"]`)) {
          cartDrawerWrapper
            ? trapFocus(
                cartDrawerWrapper,
                lineItem.querySelector(`[name="${name}"]`)
              )
            : lineItem.querySelector(`[name="${name}"]`).focus();
        } else if (parsedState.item_count === 0 && cartDrawerWrapper) {
          trapFocus(
            cartDrawerWrapper.querySelector(".drawer__inner-empty"),
            cartDrawerWrapper.querySelector("a")
          );
        } else if (document.querySelector(".cart-item") && cartDrawerWrapper) {
          trapFocus(
            cartDrawerWrapper,
            document.querySelector(".cart-item__name")
          );
        }

        publish(PUB_SUB_EVENTS.cartUpdate, {
          source: "cart-items",
          cartData: parsedState,
          variantId: variantId,
        });
      })
      .catch(() => {
        this.querySelectorAll(".loading__spinner").forEach((overlay) =>
          overlay.classList.add("hidden")
        );
        const errors =
          document.getElementById("cart-errors") ||
          document.getElementById("CartDrawer-CartErrors");
        errors.textContent = window.cartStrings.error;
      })
      .finally(() => {
        this.disableLoading(line);
        initswiperincart();
      });
  }

  updateLiveRegions(line, message) {
    const lineItemError =
      document.getElementById(`Line-item-error-${line}`) ||
      document.getElementById(`CartDrawer-LineItemError-${line}`);
    if (lineItemError)
      lineItemError.querySelector(".cart-item__error-text").textContent =
        message;

    this.lineItemStatusElement.setAttribute("aria-hidden", true);

    const cartStatus =
      document.getElementById("cart-live-region-text") ||
      document.getElementById("CartDrawer-LiveRegionText");
    cartStatus.setAttribute("aria-hidden", false);

    setTimeout(() => {
      cartStatus.setAttribute("aria-hidden", true);
    }, 1000);
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, "text/html")
      .querySelector(selector).innerHTML;
  }

  enableLoading(line) {
    const mainCartItems =
      document.getElementById("main-cart-items") ||
      document.getElementById("CartDrawer-CartItems");
    mainCartItems.classList.add("cart__items--disabled");

    const cartItemElements = this.querySelectorAll(
      `#CartItem-${line} .loading__spinner`
    );
    const cartDrawerItemElements = this.querySelectorAll(
      `#CartDrawer-Item-${line} .loading__spinner`
    );

    [...cartItemElements, ...cartDrawerItemElements].forEach((overlay) =>
      overlay.classList.remove("hidden")
    );

    document.activeElement.blur();
    this.lineItemStatusElement.setAttribute("aria-hidden", false);
  }

  disableLoading(line) {
    const mainCartItems =
      document.getElementById("main-cart-items") ||
      document.getElementById("CartDrawer-CartItems");
    mainCartItems.classList.remove("cart__items--disabled");

    const cartItemElements = this.querySelectorAll(
      `#CartItem-${line} .loading__spinner`
    );
    const cartDrawerItemElements = this.querySelectorAll(
      `#CartDrawer-Item-${line} .loading__spinner`
    );

    cartItemElements.forEach((overlay) => overlay.classList.add("hidden"));
    cartDrawerItemElements.forEach((overlay) =>
      overlay.classList.add("hidden")
    );
  }
}

customElements.define("cart-items", CartItems);

if (!customElements.get("cart-note")) {
  customElements.define(
    "cart-note",
    class CartNote extends HTMLElement {
      constructor() {
        super();

        this.addEventListener(
          "input",
          debounce((event) => {
            const body = JSON.stringify({ note: event.target.value });
            fetch(`${routes.cart_update_url}`, {
              ...fetchConfig(),
              ...{ body },
            });
          }, ON_CHANGE_DEBOUNCE_TIMER)
        );
      }
    }
  );
}



window.applyCartDiscount = function() {

  const discountCodeForm = document.querySelector('#cart-discount-form');
  const discountCodeInput = document.querySelector('#discount-code-input');
  const discountCodeSuccess = document.querySelector('#discount-code-success');
  const discountCodeError = document.querySelector('#discount-code-error');

  // / Hide both success and error messages initially
  const hideMessages = () => {
    discountCodeSuccess.style.display = "none";
    discountCodeError.style.display = "none";
  };

  // Function to display error messages
  const showError = (msg) => {
    discountCodeError.textContent = msg;
    discountCodeError.style.removeProperty('display');
  };

  // Function to display success messages
  const showSuccess = (msg) => {
    discountCodeSuccess.textContent = msg;
    discountCodeSuccess.style.removeProperty('display');
  };

  // Request data from the server. Throw a labeled error if it fails.
  const fetchOrShowError = async (label, url) => {
    const localeAwareUrl = window.Shopify.routes.root + url;
    const response = await fetch(localeAwareUrl);
    if (!response.ok) {
      throw new Error(`${label} failed: ${response.status} ${response.statusText}`);
    }
    return response;
  };

  // New helper for applying discounts via update.js
  const applyDiscount = async (code) => {
    const response = await fetch(window.Shopify.routes.root + 'cart/update.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ discount: code })
    });
    if (!response.ok) {
      throw new Error(`Discount application failed: ${response.status} ${response.statusText}`);
    }
    return response;
  };

  // Check the cart to see if a specific discount code has been applied.
  const checkForDiscount = (cart, code) => {
    
    // Check for order-level discounts
    if (cart.cart_level_discount_applications
        && cart.cart_level_discount_applications.some((app) => app.title.toLowerCase() === code.toLowerCase() )) {
      return true;
    }

    // Check for line item discounts
    if (cart.items.some((item) => item.discounts?.some((discount) => discount.title.toLowerCase() === code.toLowerCase()))) {
      return true;
    }

    return false;
  };

  // Intercept the form being submitted and apply the discount code.
  discountCodeForm.onsubmit = async (e) => {
    e.preventDefault();
    hideMessages();

    // Field must not be empty
    const code = discountCodeInput.value.trim();
    if (!code) {
      showError('Enter a discount code');
      return;
    }

    try {
      await applyDiscount(code);

      // Check if the discount was actually applied instead just assuming it
      // succeeded.
      const cartResponse = await fetchOrShowError('Cart fetch', 'cart.js');
      const cart = await cartResponse.json();
      
      if (checkForDiscount(cart, code)) {
        showSuccess('Discount applied!');
        update_cart_total();
        document.querySelector('cart-drawer-items').onCartUpdate()
      } else {
       
        showError('Enter a valid discount code', cart);
      }
    } catch(e) {
      showError(e);
    }
  };

    
};


// After any cart update (add to cart, remove, etc.)
window.applyCartDiscount();



window.update_cart_total = () => {
  fetch(`${routes.cart_url}?section_id=cart-drawer`)
    .then((response) => response.text())
    .then((responseText) => {
      const html = new DOMParser().parseFromString(responseText, "text/html");
      const selectors = ["button#CartDrawer-Checkout",".cart-drawer__footer"];
      
      for (const selector of selectors) {
        const targetElement = document.querySelector(selector);
        const sourceElement = html.querySelector(selector);
        
        if (targetElement && sourceElement) {
          // Replace the button
          targetElement.replaceWith(sourceElement);

          // Re-attach event listeners if needed
          const newButton = document.querySelector(selector);
          if (newButton) {
            newButton.addEventListener('click', () => {
              // Handle checkout logic here if needed
            });
          }
        }
      }
    })
    .catch((e) => {
      console.error(e);
    })
    .finally(() => {
      console.log('Cart Total Updated');
    });
};