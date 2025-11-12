window.cardProductFunc = function() {

  const initSwiper = (container) => {
    const mediaCount = parseInt(container.dataset.mediaCount);
    if (mediaCount < 1) return;

    const isDesktop = window.innerWidth > 989;
    const initialSlide = isDesktop && container.dataset.start === "1" ? 1 : 0;

    return new Swiper(container.querySelector(".swiper"), {
      lazy: {
        loadPrevNext: true,
        loadOnTransitionStart: true,
      },
      watchSlidesProgress: true,
      spaceBetween: 30,
      slidesPerView: 1,
      loop: mediaCount > 1,
      initialSlide: initialSlide,
      navigation: {
        nextEl: container.querySelector(".swiper-button-next"),
        prevEl: container.querySelector(".swiper-button-prev"),
      },
      pagination: {
        el: container.querySelector(".swiper-pagination"),
      },
      on: {
        init: function () {
          container.classList.add("swiper-initialized");
          container.setAttribute("aria-hidden", "false");
        },
      },
    });
  };

  const initColorSwatches = (card) => {
    const swatches = card.querySelectorAll('.--color-swatch');
    swatches.forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const url = swatch.getAttribute('href') || swatch.dataset.url;
        if (url) {
          window.location.href = url;
        }
      });
    });
  };

  const processProductCards = () => {
    document.querySelectorAll('.product-card').forEach(card => {
      try {
        const swiperContainer = card.querySelector('.swiper-container--lazy');
        if (swiperContainer) {
          initSwiper(swiperContainer);
        }
        initColorSwatches(card);
      } catch (error) {
        console.error('Error processing product card:', error);
      }
    });
  };

  if (document.readyState !== 'loading') {
    processProductCards();
  } else {
    document.addEventListener('DOMContentLoaded', processProductCards);
  }
};

window.cardProductFunc();
