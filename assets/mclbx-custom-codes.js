window.initializeQuickViewButtons = () => {
    document.querySelectorAll(".--quick-add-trigger").forEach(button => {
      button.addEventListener("click", e => {
        e.preventDefault();     
        console.log('clicked')
        // Get the product URL from the button's data attribute
        // const productUrl = button.getAttribute("data-product-url");
        
       
       
        // const productUrl = button.closest('.--product-card-v3')?.querySelector('a.--product-card-url')?.getAttribute('href') || '';   
        const productUrl = button.dataset.url;  
       if(productUrl){
          console.log("Url Found")
        } else {

          console.log("Url not Found");
          return;
        }

        const xproductUrl = `${productUrl}`;
        // const xproductUrl = `${productUrl}&section_id=template--17226260938818__info`;
      







        console.log("Fetch Url", xproductUrl);
        

        // Check if quick view is already open
        if (document.body.classList.contains("adding-to-cart")) {
          return;
        }
         
        if (productUrl) {
          document.body.classList.add("adding-to-cart");

          fetch(xproductUrl)
            .then((res) => res.text())
            .then((res) => {

  
              const wholehtml = new DOMParser().parseFromString(res, "text/html");
            //   const html = wholehtml.querySelector('#--custom-product-section');
            // const html = wholehtml.querySelector('#MainContent').firstElementChild;
            const html = wholehtml.querySelector('#MainContent').querySelector('section.--product-section');

              console.log("wholehtml: ",wholehtml)
              if(!html){
                console.log("html missing")
                return;
              }
              // Remove unnecessary elements
              if (html.querySelector(".pinfo-bundle-wrapper")) {
                html.querySelector(".pinfo-bundle-wrapper").remove();
              }
              if (html.querySelector(".product-faq-wrapper")) {
                html.querySelector(".product-faq-wrapper").remove();
              }
            //  Remove only for mobile
              if (window.innerWidth < 600) {
                if (html.querySelector(".pdp-media-lg")) {
                  html.querySelector(".pdp-media-lg").remove();
                }
                 if (html.querySelector(".pinfo-breadcrumb")) {
                // html.querySelector(".pinfo-breadcrumb").remove();
              }
              if (html.querySelector(".pd-shipping__info")) {
                html.querySelector(".pd-shipping__info").remove();
              }
              if (html.querySelector(".product__description.mb")) {
                html.querySelector(".product__description.mb").remove();
              }
              if (html.querySelector(".pinfo-size-guide.openPopup")) {
                html.querySelector(".pinfo-size-guide.openPopup").remove();
              }
              }
              
              if (html.querySelector("product-information")) {
                html.querySelector("product-information").setAttribute("data-update-url", "false");
              }

              // Open the product quick view and render content
              if (!productQuickView.container.classList.contains("open")) {
                productQuickView.container.open();
              }

              productQuickView.container.renderContent(
                html.querySelector("#product-information-container").innerHTML
              );
              console.log("Printed values", html);

              if (typeof window.initFaqAccordions === "function") {
                window.initFaqAccordions();
              }
              if (typeof window.sizeGuide === "function") {
                window.sizeGuide();
              }
              
              // window.viewerCountPastDay();
              // window.getDeliveryWindow();
            })
            .catch((err) => console.log(err))
            .finally(() => {
              // document.body.classList.remove("adding-to-cart");
            });
        }
      });
    });
  };

  document.addEventListener("DOMContentLoaded", initializeQuickViewButtons);





window.setEqualHeightv2 = function(sectionSelector, selector) {
  // setEqualHeightv2(".sec-{{ id }}", ".--card-content-wrapper")
  let section = document.querySelector(sectionSelector);
  if(!section){
    return;
  }
  let divs = section.querySelectorAll(selector);
  let max = 0;

  // First pass: Calculate the maximum height
  divs.forEach((div) => {
    // let height = div.clientHeight;
    let temp = window.getComputedStyle(div);
    let height = parseFloat(temp.getPropertyValue("height"));
    
    if (height > max) {
      // console.log("Height: ", height, " Max: ", max)
      max = height;
    } else {
      // console.log("Lesser Height: ", height, " Max: ", max)
    }
  });

  // Second pass: Set all divs to the max height
  divs.forEach((div) => {
    // console.log( "Set  Max: ", max)
    div.style.height = `${max}px`;
  });
}


document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" || event.key === "Esc") {
    if (productQuickView.container.classList.contains("open")) {
                productQuickView.container.close();
    }
    
  }
});



// document.addEventListener(
//   "click",
//   function (event) {
//     const quickView = document.querySelector("product-quick-view.open");
//     if (!quickView) return;

//     const closeButton = quickView.querySelector(".pqv-close-btn");
//     if (!closeButton) return;

//     // Use composedPath to be robust even if nodes are removed by other handlers
//     const path = typeof event.composedPath === "function" ? event.composedPath() : null;

//     // Did we click inside the quick view container?
//     const clickedInsideContainer =
//       !!event.target.closest("product-quick-view.open .pqv-container");

//     // Did we click inside the overlay (which is OUTSIDE quickView)?
//     // Prefer composedPath so it still matches even if overlay gets removed immediately.
//     const clickedInsideZoom = path
//       ? path.some(
//           (n) => n instanceof Element && n.classList?.contains("popup-overlay")
//         )
//       : (() => {
//           const ov = document.querySelector(".popup-overlay");
//           return ov ? ov.contains(event.target) : false;
//         })();

//     // Close ONLY if the click was outside BOTH the container and the overlay
//     if (!clickedInsideContainer && !clickedInsideZoom) {
//       closeButton.click();
//     }
//   },
//   // Capture phase so we run before most bubbling handlers that might remove nodes
//   { capture: true }
// );





window.setupSectionNavigatorScroll = function() {
    // Select all anchor elements with the specified class
    const anchors = document.querySelectorAll('.--section-navigator');
    
    // Determine if the device is mobile based on window width
    const isMobile = window.innerWidth <= 768;
    const offset = isMobile ? 280 : 150;
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default anchor behavior
            const targetId = this.getAttribute('href').substring(1); // Get target ID without #
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: elementPosition - offset,
                    behavior: 'smooth'
                });
            }
        });
    });
};

//  window.enableStickyATC = function (){
//     const pqaNewElement = document.querySelector('pqa-new');
//     const targetElement = document.querySelector('.pinfo-form-wrapper');
//     const footer = document.querySelector('.footer__section');
//     let lastScrollY = window.scrollY;

//     if (!targetElement || !pqaNewElement) {
//       console.error('Required elements not found');
//       return;
//     }

//     function getScrollDirection() {
//       const currentScrollY = window.scrollY;
//       const direction = currentScrollY > lastScrollY ? 'down' : 'up';
//       lastScrollY = currentScrollY;
//       return direction;
//     }

//     const BOTTOM_THRESHOLD_PX = 12;
//     function isAtBottom() {
//       const doc = document.documentElement;
//       const scrolledBottom = Math.ceil(window.scrollY + window.innerHeight);
//       return scrolledBottom >= (doc.scrollHeight - BOTTOM_THRESHOLD_PX);
//     }

//     setTimeout(() => {
//       if (isAtBottom()) {
//         pqaNewElement.classList.remove('sticky-visible');
//         return;
//       }
//       const targetRect = targetElement.getBoundingClientRect();
//       const pqaRect = pqaNewElement.getBoundingClientRect();
//       const scrollPosition = window.scrollY + window.innerHeight;
//       if (scrollPosition >= targetRect.top + window.scrollY && targetRect.top > pqaRect.bottom) {
//         pqaNewElement.classList.add('sticky-visible');
//       }
//     }, 100);

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (isAtBottom()) {
//           pqaNewElement.classList.remove('sticky-visible');
//           return;
//         }
//         const scrollDirection = getScrollDirection();
//         entries.forEach((entry) => {
//           if (!entry.isIntersecting) {
//             if (scrollDirection === 'down') {
//               pqaNewElement.classList.add('sticky-visible');
//             }
//           } else {
//             pqaNewElement.classList.remove('sticky-visible');
//           }
//         });
//       },
//       {
//         root: null,
//         threshold: 0,
//       }
//     );

//     observer.observe(targetElement);

//     window.addEventListener('scroll', () => {
//       if (isAtBottom()) pqaNewElement.classList.remove('sticky-visible');
//     }, { passive: true });
//   }


// Call the function after defining it
document.addEventListener('DOMContentLoaded', function() {
    window.setupSectionNavigatorScroll();
});


// // Review Scroll in pdp
// window.scrolltoReviewSection = function() {
// const buttons = document.querySelectorAll('.yotpo-sr-bottom-line-button');

// if (!buttons.length) {
  

//   // scroll & touchmove: passive true; once true
//   document.addEventListener('scroll', scrollToReviewSection, { once: true, passive: true });
//   document.addEventListener('touchmove', scrollToReviewSection, { once: true, passive: true });

//   // click: passive অপ্রযোজ্য, তাই শুধু once
//   document.addEventListener('click', scrollToReviewSection, { once: true });
// }

// // const buttons = document.querySelectorAll('.p-info-price-wrapper .p-info-app-block ');

//   if (buttons) {
//     buttons.forEach(button=>{
//     button.addEventListener('click', () => {
//       console.log("button", button)
//       const reviewSection = document.querySelector('.faq__wrapp.faq__wrapp-review');
//        console.log("reviewSection",reviewSection)
//       const targetIntro = reviewSection.querySelector('[data-faq-title]');
//       const targetContent = reviewSection.querySelector('[data-faq-content]');
//       console.log("reviewSection",reviewSection)
//       if (reviewSection) {
//         // reviewSection.click();
//         if (!targetIntro.classList.contains('active')) {
//           targetIntro.classList.add('active');
//           targetContent.classList.add('active');
//           targetContent.style.maxHeight = `${targetContent.scrollHeight}px`;
//           targetContent.setAttribute('aria-hidden', 'false');
//           targetIntro.setAttribute('aria-expanded', 'true');
//         }
//       }
//     });
//     })
    
//   }



// }

window.scrolltoReviewSection = function (retries = 5, delay = 100) {
  const buttons = document.querySelectorAll('.yotpo-sr-bottom-line-button');

  // If buttons are not found and retries remain, retry after a delay
  if (buttons.length < 4 && retries > 0) {
    console.log(`Buttons not found, retrying... (${retries} retries left)`);
    setTimeout(() => {
      window.scrolltoReviewSection(retries - 1, delay); // Recursive call with decremented retries
    }, delay);
    return; // Exit to prevent further execution until buttons are found
  }

  // If buttons are found, set up click listeners (no recursion)
  if (buttons.length) {
    // console.log('Buttons found:', buttons);
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        console.log('Button clicked:', button);
        const reviewSection = document.querySelector('.faq__wrapp.faq__wrapp-review');
        console.log('reviewSection:', reviewSection);

        if (reviewSection) {
          const targetIntro = reviewSection.querySelector('[data-faq-title]');
          const targetContent = reviewSection.querySelector('[data-faq-content]');
          console.log('targetIntro:', targetIntro, 'targetContent:', targetContent);

          // Scroll to the review section
          reviewSection.scrollIntoView({ behavior: 'smooth' });

          // Expand the review section if not already active
          if (targetIntro && targetContent && !targetIntro.classList.contains('active')) {
            targetIntro.classList.add('active');
            targetContent.classList.add('active');
            targetContent.style.maxHeight = `${targetContent.scrollHeight}px`;
            targetContent.setAttribute('aria-hidden', 'false');
            targetIntro.setAttribute('aria-expanded', 'true');
          }
        }
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // window.scrolltoReviewSection();
});


// Bind once
window.closeOnOutsideClick = function () {
  if (window.innerWidth > 768 || window.__pqaOutsideBound) return;

  const handler = (event) => {
    // Optional: don't close if a trigger was clicked
    if (event.target.closest('.p-info-size-btn')) return;
    if (event.target.closest('.pqa__popup-opener')) return;

    document.querySelectorAll('.pqa-popup.active').forEach((popup) => {
      if (!popup.contains(event.target)) popup.classList.remove('active');
    });
  };

  document.addEventListener('click', handler, { passive: true });
  document.addEventListener('touchstart', handler, { passive: true });
  window.__pqaOutsideBound = true;
};

