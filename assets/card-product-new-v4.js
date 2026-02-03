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
      spaceBetween: 0,
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

  const initVideoControls = (card) => {
    const videoWrapper = card.querySelector('.product-card__video-wrapper');
    if (!videoWrapper) return;

    const video = videoWrapper.querySelector('.product-card__primary-video');
    const toggleButton = videoWrapper.querySelector('.product-card__video-toggle');
    const parentLink = videoWrapper.closest('.product-card__image-link');
    
    if (!video || !toggleButton) return;

    const updateButtonState = () => {
      if (video.paused) {
        toggleButton.classList.add('paused');
      } else {
        toggleButton.classList.remove('paused');
      }
    };

    const togglePlayPause = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (video.paused) {
        video.play().catch(err => {
          console.error('Error playing video:', err);
        });
      } else {
        video.pause();
      }
    };

    // Single click listener - FIXED!
    toggleButton.addEventListener('click', togglePlayPause);

    video.addEventListener('pause', updateButtonState);
    video.addEventListener('play', updateButtonState);
    video.addEventListener('playing', updateButtonState);

    if (parentLink) {
      parentLink.addEventListener('click', (e) => {
        if (e.target === toggleButton || toggleButton.contains(e.target)) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
    }

    setTimeout(updateButtonState, 100);
  };

  const processProductCards = () => {
    document.querySelectorAll('.product-card').forEach(card => {
      // Prevent reinitialization - ADDED!
      if (card.dataset.initialized === 'true') return;
      card.dataset.initialized = 'true';
      
      try {
        const swiperContainer = card.querySelector('.swiper-container--lazy');
        if (swiperContainer) {
          initSwiper(swiperContainer);
        }
        initColorSwatches(card);
        initVideoControls(card);
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