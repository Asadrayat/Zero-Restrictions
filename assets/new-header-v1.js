document.addEventListener("DOMContentLoaded", () => {
  const announcement = document.querySelector(".section__annoucement");
  const header = document.querySelector(".site__header");
  const navLinks = document.querySelectorAll(".header__nav-ul a.has__mega-menu");
  const megaMenuItems = document.querySelectorAll(".mega__menu-item");
  const headerNav = document.querySelector(".header__nav");
  const body = document.body;
  const closeButtons = document.querySelectorAll(".close__mega-menu");
  const headerNavLogo = document.querySelector(".header__nav-logo");

  const updateHeaderPosition = () => {
    const announcementParentHeight = announcement.parentElement.offsetHeight;
    const scrollPosition = window.scrollY;
    if (!document.querySelector("predictive-search-new")?.classList.contains("open")) {
      header.parentElement.style.top = scrollPosition >= announcementParentHeight ? "0" : `${announcementParentHeight}px`;
    }
  };

  if (announcement && header) {
    header.parentElement.classList.add("site-header-parent");
    updateHeaderPosition();
    window.addEventListener("scroll", updateHeaderPosition);
    window.addEventListener("resize", updateHeaderPosition);
  }

  const handleNavLinkClick = (e) => {
    e.preventDefault();
    const link = e.currentTarget;
    const menuValue = link.dataset.menu;
    const matchedMega = [...megaMenuItems].find(m => m.dataset.mega === menuValue);
    if (!matchedMega) {
      window.location.href = link.getAttribute("href");
      return;
    }
    navLinks.forEach(l => l.classList.remove("active"));
    megaMenuItems.forEach(m => m.classList.remove("active"));
    link.classList.add("active");
    matchedMega.classList.add("active");
    headerNavLogo.classList.add("float-item");
    header.parentElement.style.top = "0";
    const h = announcement.parentElement.offsetHeight;
    announcement.parentElement.style.marginTop = `${h}px`;
    body.style.overflow = "hidden";
    addOverlay();
  };

  navLinks.forEach(link => link.addEventListener("mouseover", handleNavLinkClick));

  const handleCloseButtonClick = () => {
    navLinks.forEach((link) => link.classList.remove("active"));
    megaMenuItems.forEach((menuItem) => menuItem.classList.remove("active"));
    body.style.overflow = "visible";
    headerNavLogo.classList.remove("float-item");
    const announcementParentHeight = announcement.parentElement.offsetHeight;
    announcement.parentElement.style.marginTop = "0";
    if (header.parentElement.getBoundingClientRect().top <= announcementParentHeight) {
      header.parentElement.style.top = `${announcementParentHeight}px`;
    }
    removeOverlay();
  };

  closeButtons.forEach((closeButton) => closeButton.addEventListener("click", handleCloseButtonClick));

  const noMegaMenuLinks = document.querySelectorAll(".header__nav-ul a.no__mega-menu");

  noMegaMenuLinks.forEach(link => {
    link.addEventListener("mouseover", () => {
      megaMenuItems.forEach(menuItem => {
        menuItem.classList.remove("active");
      });
      navLinks.forEach(link => {
        link.classList.remove("active");
      });
      body.style.overflow = "visible";
      headerNavLogo.classList.remove("float-item");

      const announcementParentHeight = announcement.parentElement.offsetHeight;
      announcement.parentElement.style.marginTop = "0";
      
      const scrollPosition = window.scrollY;
      if (scrollPosition >= announcementParentHeight) {
        header.parentElement.style.top = "0";
      } else {
        header.parentElement.style.top = `${announcementParentHeight}px`;
      }
      removeOverlay();
    });
  });

  megaMenuItems.forEach(menuItem => {
    let closeTimeout;

    menuItem.addEventListener("mouseleave", (e) => {
      closeTimeout = setTimeout(() => {
        if (!headerNav.contains(e.relatedTarget)) {
          closeMenu(menuItem);
        }
      }, 200);
    });

    menuItem.addEventListener("mouseenter", () => {
      clearTimeout(closeTimeout);
    });
  });

  headerNav.addEventListener("mouseenter", () => {
    megaMenuItems.forEach(menuItem => {
      if (menuItem.classList.contains("active")) {
        menuItem.classList.add("active");
      }
    });
  });

  function closeMenu(menuItem) {
    if (menuItem.classList.contains("active")) {
      menuItem.classList.remove("active");
      navLinks.forEach(link => link.classList.remove("active"));
      body.style.overflow = "visible";
      headerNavLogo.classList.remove("float-item");

      const announcementParentHeight = announcement.parentElement.offsetHeight;
      announcement.parentElement.style.marginTop = "0";

      const scrollPosition = window.scrollY;
      if (scrollPosition >= announcementParentHeight) {
        header.parentElement.style.top = "0";
      } else {
        header.parentElement.style.top = `${announcementParentHeight}px`;
      }
      removeOverlay();
    }
  }

  function addOverlay() {
    if (!document.querySelector(".custom-overlay-megamenu")) {
      const overlay = document.createElement("div");
      overlay.classList.add("custom-overlay-megamenu");
      document.body.appendChild(overlay);
    }
  }

  function removeOverlay() {
    const overlay = document.querySelector(".custom-overlay-megamenu");
    if (overlay) {
      overlay.remove();
    }
  }
});


const SCROLL_THRESHOLD = 100;

function handleScrollPosition() {
    const scrollY = window.scrollY || window.pageYOffset;
    const headerStickyTop = document.querySelectorAll('.header-sticky-top');
    const announcementBar = document.querySelector('.announcement-bar-section');

    if (scrollY > SCROLL_THRESHOLD) {
        applyScrolledStyles(headerStickyTop);
    } else {
        applyDefaultStyles(headerStickyTop, announcementBar);
    }
}

function applyScrolledStyles(headerStickyTop) {
    headerStickyTop.forEach(item => {
        item.style.top = '0px';
    });
}

function applyDefaultStyles(headerStickyTop, announcementBar) {
    const announcementHeight = announcementBar ? announcementBar.offsetHeight + 'px' : '0px';
    headerStickyTop.forEach(item => {
        item.style.top = announcementHeight;
    });
}

function initializeScrollHandler() {
    handleScrollPosition();
    window.addEventListener('scroll', handleScrollPosition);
}

document.addEventListener('DOMContentLoaded', initializeScrollHandler);




/*
const SCROLL_THRESHOLD = 100;

function handleScrollPosition() {
    const scrollY = window.scrollY || window.pageYOffset;
    const headerLogo = document.querySelector('.header__logo-sm');
    const mobileDrawers = document.querySelectorAll('.mobile-drawer-open-top, .new-header-cart-icon-top');

    if (scrollY > SCROLL_THRESHOLD) {
        applyScrolledStyles(headerLogo, mobileDrawers);
    } else {
        applyDefaultStyles(headerLogo, mobileDrawers);
    }
}

function applyScrolledStyles(headerLogo, mobileDrawers) {
    if (headerLogo) headerLogo.style.top = '30px';
    mobileDrawers.forEach(drawer => {
        drawer.style.top = '25px';
    });
}

function applyDefaultStyles(headerLogo, mobileDrawers) {
    if (headerLogo) headerLogo.style.top = '50px';
    mobileDrawers.forEach(drawer => {
        drawer.style.top = '45px';
    });
}

function initializeScrollHandler() {
    handleScrollPosition();
    window.addEventListener('scroll', handleScrollPosition);
}

document.addEventListener('DOMContentLoaded', initializeScrollHandler);
*/


// function handleCartCounterDisplay() {
//   const lgCounter = document.querySelector('.cart__counter-lg');
//   const smCounter = document.querySelector('.cart__counter-sm');
//   const screenWidth = window.innerWidth;

//   if (screenWidth > 1200) {
//     if (smCounter) smCounter.remove();
//   } else if (screenWidth < 1201) {
//     if (lgCounter) lgCounter.remove();
//   }
// }

// handleCartCounterDisplay();
// window.addEventListener('resize', handleCartCounterDisplay);


/*
document.addEventListener("DOMContentLoaded", () => {
  const drawer = document.querySelector('.mbl__drawer');
  const closeButtons = document.querySelectorAll('[mbl-drawer-close]');
  const drawerOpener = document.querySelectorAll('[mobile-drawer-opener]');
  const body = document.body;
  const html = document.documentElement;

  const toggleDrawer = () => {
    const isOpening = !drawer.classList.contains('open');
    drawer.classList.toggle('open');
    
    body.style.overflow = isOpening ? 'hidden' : 'visible';
    html.style.overflow = isOpening ? 'hidden' : 'visible';

    drawerOpener.forEach(opener => {
      if (isOpening) {
        opener.removeAttribute('mobile-drawer-opener');
        opener.setAttribute('mbl-drawer-close', '');
      } else {
        opener.removeAttribute('mbl-drawer-close');
        opener.setAttribute('mobile-drawer-opener', '');
      }
    });
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    body.style.overflow = 'visible';
    html.style.overflow = 'visible';
    
    drawerOpener.forEach(opener => {
      opener.removeAttribute('mbl-drawer-close');
      opener.setAttribute('mobile-drawer-opener', '');
    });
  };

  drawerOpener.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      toggleDrawer();
    });
  });

  document.addEventListener('click', (e) => {
    if (e.target.matches('[mbl-drawer-close]')) {
      e.preventDefault();
      closeDrawer();
    }
  });
});


// JavaScript for the menu functionality

document.addEventListener('DOMContentLoaded', function() {
  // Cache elements
  const drawerHeader = document.querySelector('.mbl__drawer-header');
  const drawerContents = document.querySelector('.mbl__drawer-contents');
  const TRANSITION_DELAY = 200; // 0.2 seconds in milliseconds

  if (!drawerHeader || !drawerContents) return;

  // Handle click on open-menu buttons
  const openMenuButtons = document.querySelectorAll('.open-menu');
  if (openMenuButtons.length) {
    openMenuButtons.forEach(openMenuBtn => {
      openMenuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const triggerValue = this.dataset.trigger;
        const childMenus = document.querySelectorAll('.child__menu');
        
        // Find matching child menu
        childMenus.forEach(childMenu => {
          if (childMenu.dataset.drawer === triggerValue) {
            // First add unvisible
            drawerHeader.classList.add('unvisible');
            drawerContents.classList.add('unvisible');
            
            // Then after delay, add active
            setTimeout(() => {
              childMenu.classList.add('active');
            }, TRANSITION_DELAY);
          }
        });
      });
    });
  }
  
  // Handle click on back buttons inside child menus
  const backButtons = document.querySelectorAll('.child__menu .back-button');
  if (backButtons.length) {
    backButtons.forEach(backBtn => {
      backBtn.addEventListener('click', function() {
        const childMenu = this.closest('.child__menu');
        
        // First remove active
        childMenu.classList.remove('active');
        
        // Then after delay, remove unvisible
        setTimeout(() => {
          
          drawerHeader.classList.remove('unvisible');
          drawerContents.classList.remove('unvisible');
        }, TRANSITION_DELAY);
      });
    });
  }
});


document.addEventListener('DOMContentLoaded', function() {
  const childMenuItems = document.querySelectorAll('.child__menu-inner');
  if (!childMenuItems.length) return;

  const openChildMenu = (menuItem) => {
    const content = menuItem.querySelector('.grandchild__menu-wrapper');
    if (!content) return;
    
    menuItem.classList.add('active');
    content.style.maxHeight = content.scrollHeight + 'px';
  };

  const closeChildMenu = (menuItem) => {
    const content = menuItem.querySelector('.grandchild__menu-wrapper');
    if (!content) return;
    
    menuItem.classList.remove('active');
    content.style.maxHeight = null;
  };

  childMenuItems.forEach((menuItem) => {
    const submenuBtn = menuItem.querySelector('.open-submenu');
    if (!submenuBtn) return;
    
    submenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      const content = menuItem.querySelector('.grandchild__menu-wrapper');
      if (!content) return;
      
      if (content.style.maxHeight) {
        closeChildMenu(menuItem);
      } else {
        // Close all other open menus first
        childMenuItems.forEach((item) => closeChildMenu(item));
        openChildMenu(menuItem);
      }
    });
  });

  // Optional: Open first accordion by default
  // if (childMenuItems.length > 0) {
  //   openChildMenu(childMenuItems[0]);
  // }
});




// JavaScript for Currency Drawer
document.addEventListener('DOMContentLoaded', function() {
  const currencyButton = document.querySelector('.mbl-currency-button');
  const currencyBackButton = document.querySelector('[currency-back-button]');
  const currencySelector = document.querySelector('.mbl__currency-selector');
  const drawerContents = document.querySelector('.mbl__drawer-contents');

  if (currencyButton) {
    currencyButton.addEventListener('click', function(e) {
      e.preventDefault();
      drawerContents.classList.add('active');
      currencySelector.classList.add('active');
    });
  }

  if (currencyBackButton) {
    currencyBackButton.addEventListener('click', function(e) {
      e.preventDefault();
      drawerContents.classList.remove('active');
      currencySelector.classList.remove('active');
    });
  }

  // Handle currency selection
  const currencyItems = document.querySelectorAll('.currency-list li');
  currencyItems.forEach(item => {
    item.addEventListener('click', function() {
      const countryCode = this.getAttribute('data-value');
      document.querySelector('.selected-country-code').value = countryCode;
      document.querySelector('.country-selector-form').submit();
    });
  });
});

*/

/*
document.addEventListener("DOMContentLoaded", () => {
  const drawer = document.querySelector('.mbl__drawer');
  const closeButtons = document.querySelectorAll('[mbl-drawer-close]');
  const drawerOpener = document.querySelectorAll('[mobile-drawer-opener]');
  const body = document.body;
  const html = document.documentElement;
  const drawerHeader = document.querySelector('.mbl__drawer-header');
  const drawerContents = document.querySelector('.mbl__drawer-contents');
  const TRANSITION_DELAY = 200;
  const currencyButton = document.querySelector('.mbl-currency-button');
  const currencyBackButton = document.querySelector('[currency-back-button]');
  const currencySelector = document.querySelector('.mbl__currency-selector');

  function resetFadeAnimations(container) {
    if (container) {
      container.querySelectorAll('[data-fade].animate').forEach(el => {
        el.classList.remove('animate');
      });
    }
  }

  function animateFadeElements(container, delayIncrement = 100) {
    const fadeElements = container.querySelectorAll('[data-fade]');
    fadeElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animate');
      }, index * delayIncrement);
    });
  }

  // REMOVED: closeAllGrandchildMenus function is no longer needed

  const toggleDrawer = () => {
    const isOpening = !drawer.classList.contains('open');
    drawer.classList.toggle('open');
    
    body.style.overflow = isOpening ? 'hidden' : 'visible';
    html.style.overflow = isOpening ? 'hidden' : 'visible';

    drawerOpener.forEach(opener => {
      if (isOpening) {
        opener.removeAttribute('mobile-drawer-opener');
        opener.setAttribute('mbl-drawer-close', '');
      } else {
        opener.removeAttribute('mbl-drawer-close');
        opener.setAttribute('mobile-drawer-opener', '');
      }
    });

    if (isOpening) {
      resetFadeAnimations(drawerContents);
      setTimeout(() => {
        animateFadeElements(drawerContents);
      }, 300);
      
      document.querySelectorAll('.child__menu.active, .mbl__currency-selector.active').forEach(menu => {
        menu.classList.remove('active');
      });
      drawerHeader.classList.remove('unvisible');
      drawerContents.classList.remove('unvisible');

      // Add drawer-active to body if sticky-visible exists
      if (document.querySelector('.sticky-visible')) {
        body.classList.add('drawer-active');
      }
    } else {
      // REMOVED: closeAllGrandchildMenus() call
      resetFadeAnimations(drawer);

      // Remove drawer-active from body if sticky-visible exists
      if (document.querySelector('.sticky-visible')) {
        body.classList.remove('drawer-active');
      }
    }
  };

  const closeDrawer = () => {
    // REMOVED: closeAllGrandchildMenus() call
    
    resetFadeAnimations(drawer);
    document.querySelectorAll('.child__menu.active, .mbl__currency-selector.active').forEach(menu => {
      menu.classList.remove('active');
    });
    
    drawerHeader.classList.remove('unvisible');
    drawerContents.classList.remove('unvisible');
    drawer.classList.remove('open');
    body.style.overflow = 'visible';
    html.style.overflow = 'visible';
    
    drawerOpener.forEach(opener => {
      opener.removeAttribute('mbl-drawer-close');
      opener.setAttribute('mobile-drawer-opener', '');
    });

    // Remove drawer-active from body if sticky-visible exists
    if (document.querySelector('.sticky-visible')) {
      body.classList.remove('drawer-active');
    }
  };

  drawerOpener.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      toggleDrawer();
    });
  });

  closeButtons.forEach(close => {
    close.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
    });
  });

  if (drawerHeader && drawerContents) {
    const openMenuButtons = document.querySelectorAll('.open-menu');
    if (openMenuButtons.length) {
      openMenuButtons.forEach(openMenuBtn => {
        openMenuBtn.addEventListener('click', function(e) {
          e.preventDefault();
          
          resetFadeAnimations(drawerContents);
          
          const triggerValue = this.dataset.trigger;
          const childMenus = document.querySelectorAll('.child__menu');
          
          childMenus.forEach(childMenu => {
            if (childMenu.dataset.drawer === triggerValue) {
              resetFadeAnimations(childMenu);
              
              drawerHeader.classList.add('unvisible');
              drawerContents.classList.add('unvisible');
              
              setTimeout(() => {
                childMenu.classList.add('active');
                animateFadeElements(childMenu, 100);
              }, TRANSITION_DELAY);
            }
          });
        });
      });
    }
    
    const backButtons = document.querySelectorAll('.child__menu .back-button');
    if (backButtons.length) {
      backButtons.forEach(backBtn => {
        backBtn.addEventListener('click', function() {
          const childMenu = this.closest('.child__menu');
          // REMOVED: closeAllGrandchildMenus() call
          
          resetFadeAnimations(childMenu);
          childMenu.classList.remove('active');
          
          setTimeout(() => {
            drawerHeader.classList.remove('unvisible');
            drawerContents.classList.remove('unvisible');
            resetFadeAnimations(drawerContents);
            animateFadeElements(drawerContents);
          }, TRANSITION_DELAY);
        });
      });
    }
  }

  // NEW: Open all grandchild menus by default on page load
  const initializeGrandchildMenus = () => {
    const childMenuItems = document.querySelectorAll('.child__menu-inner');
    childMenuItems.forEach((menuItem) => {
      const content = menuItem.querySelector('.grandchild__menu-wrapper');
      if (content) {
        menuItem.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  };

  // Call initialization function
  initializeGrandchildMenus();

  const childMenuItems = document.querySelectorAll('.child__menu-inner');
  if (childMenuItems.length) {
    // REMOVED: openChildMenu function and closeAllGrandchildMenus call

    childMenuItems.forEach((menuItem) => {
      const submenuBtn = menuItem.querySelector('.open-submenu');
      if (!submenuBtn) return;
      
      submenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const content = menuItem.querySelector('.grandchild__menu-wrapper');
        if (!content) return;
        
        // Toggle individual menu without affecting others
        if (content.style.maxHeight) {
          menuItem.classList.remove('active');
          content.style.maxHeight = null;
          resetFadeAnimations(content);
        } else {
          menuItem.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
          
          resetFadeAnimations(content);
          const grandchildItems = content.querySelectorAll('[data-fade]');
          grandchildItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('animate');
            }, index * 80);
          });
        }
      });
    });
  }

  if (currencyButton && currencySelector) {
    currencyButton.addEventListener('click', function(e) {
      e.preventDefault();
      resetFadeAnimations(drawerContents);
      
      drawerHeader.classList.add('unvisible');
      drawerContents.classList.add('unvisible');
      
      setTimeout(() => {
        currencySelector.classList.add('active');
        resetFadeAnimations(currencySelector);
        animateFadeElements(currencySelector, 50);
      }, TRANSITION_DELAY);
    });
  }

  if (currencyBackButton) {
    currencyBackButton.addEventListener('click', function(e) {
      e.preventDefault();
      currencySelector.classList.remove('active');
      
      setTimeout(() => {
        drawerHeader.classList.remove('unvisible');
        drawerContents.classList.remove('unvisible');
        resetFadeAnimations(drawerContents);
        animateFadeElements(drawerContents);
      }, TRANSITION_DELAY);
    });
  }

  const currencyItems = document.querySelectorAll('.currency-list li[data-value]');
  currencyItems.forEach(item => {
    item.addEventListener('click', function() {
      const countryCode = this.getAttribute('data-value');
      const form = document.querySelector('.country-selector-form');
      if (form) {
        document.querySelector('.selected-country-code').value = countryCode;
        form.submit();
      }
    });
  });
});

*/

document.addEventListener("DOMContentLoaded", () => {
  const drawer = document.querySelector('.mbl__drawer');
  const closeButtons = document.querySelectorAll('[mbl-drawer-close]');
  const drawerOpener = document.querySelectorAll('[mobile-drawer-opener]');
  const body = document.body;
  const html = document.documentElement;
  const drawerHeader = document.querySelector('.mbl__drawer-header');
  const drawerContents = document.querySelector('.mbl__drawer-contents');
  const TRANSITION_DELAY = 200;
  const currencyButton = document.querySelector('.mbl-currency-button');
  const currencyBackButton = document.querySelector('[currency-back-button]');
  const currencySelector = document.querySelector('.mbl__currency-selector');

  function getDrawerHeaderHeight() {
    return drawerHeader ? drawerHeader.offsetHeight : 0;
  }

  function setChildMenuPositions() {
    const headerHeight = getDrawerHeaderHeight();
    const childMenus = document.querySelectorAll('.child__menu');
    
    childMenus.forEach(menu => {
      menu.style.top = `${headerHeight}px`;
    });
    
    if (currencySelector) {
      currencySelector.style.top = `${headerHeight}px`;
    }
  }

  function resetFadeAnimations(container) {
    if (container) {
      container.querySelectorAll('[data-fade].animate').forEach(el => {
        el.classList.remove('animate');
      });
    }
  }

  function animateFadeElements(container, delayIncrement = 100) {
    const fadeElements = container.querySelectorAll('[data-fade]');
    fadeElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animate');
      }, index * delayIncrement);
    });
  }

  const toggleDrawer = () => {
    const isOpening = !drawer.classList.contains('open');
    drawer.classList.toggle('open');
    
    body.style.overflow = isOpening ? 'hidden' : 'visible';
    html.style.overflow = isOpening ? 'hidden' : 'visible';

    drawerOpener.forEach(opener => {
      if (isOpening) {
        opener.removeAttribute('mobile-drawer-opener');
        opener.setAttribute('mbl-drawer-close', '');
      } else {
        opener.removeAttribute('mbl-drawer-close');
        opener.setAttribute('mobile-drawer-opener', '');
      }
    });

    if (isOpening) {
      setChildMenuPositions();
      resetFadeAnimations(drawerContents);
      setTimeout(() => {
        animateFadeElements(drawerContents);
      }, 300);
      
      document.querySelectorAll('.child__menu.active, .mbl__currency-selector.active').forEach(menu => {
        menu.classList.remove('active');
      });
      drawerContents.classList.remove('unvisible');

      if (document.querySelector('.sticky-visible')) {
        body.classList.add('drawer-active');
      }
    } else {
      resetFadeAnimations(drawer);

      if (document.querySelector('.sticky-visible')) {
        body.classList.remove('drawer-active');
      }
    }
  };

  const closeDrawer = () => {
    resetFadeAnimations(drawer);
    document.querySelectorAll('.child__menu.active, .mbl__currency-selector.active').forEach(menu => {
      menu.classList.remove('active');
    });
    
    drawerContents.classList.remove('unvisible');
    drawer.classList.remove('open');
    body.style.overflow = 'visible';
    html.style.overflow = 'visible';
    
    drawerOpener.forEach(opener => {
      opener.removeAttribute('mbl-drawer-close');
      opener.setAttribute('mobile-drawer-opener', '');
    });

    if (document.querySelector('.sticky-visible')) {
      body.classList.remove('drawer-active');
    }
  };

  drawerOpener.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      toggleDrawer();
    });
  });

  closeButtons.forEach(close => {
    close.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
    });
  });

  if (drawerHeader && drawerContents) {
    const openMenuButtons = document.querySelectorAll('.open-menu');
    if (openMenuButtons.length) {
      openMenuButtons.forEach(openMenuBtn => {
        openMenuBtn.addEventListener('click', function(e) {
          e.preventDefault();
          
          resetFadeAnimations(drawerContents);
          
          const triggerValue = this.dataset.trigger;
          const childMenus = document.querySelectorAll('.child__menu');
          
          childMenus.forEach(childMenu => {
            if (childMenu.dataset.drawer === triggerValue) {
              resetFadeAnimations(childMenu);
              
              drawerContents.classList.add('unvisible');
              
              setTimeout(() => {
                childMenu.classList.add('active');
                animateFadeElements(childMenu, 100);
              }, TRANSITION_DELAY);
            }
          });
        });
      });
    }
    
    const backButtons = document.querySelectorAll('.child__menu .back-button');
    if (backButtons.length) {
      backButtons.forEach(backBtn => {
        backBtn.addEventListener('click', function() {
          const childMenu = this.closest('.child__menu');
          
          resetFadeAnimations(childMenu);
          childMenu.classList.remove('active');
          
          setTimeout(() => {
            drawerContents.classList.remove('unvisible');
            resetFadeAnimations(drawerContents);
            animateFadeElements(drawerContents);
          }, TRANSITION_DELAY);
        });
      });
    }
  }

  const initializeGrandchildMenus = () => {
    const childMenuItems = document.querySelectorAll('.child__menu-inner');
    childMenuItems.forEach((menuItem) => {
      const content = menuItem.querySelector('.grandchild__menu-wrapper');
      if (content) {
        menuItem.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  };

  initializeGrandchildMenus();

  const childMenuItems = document.querySelectorAll('.child__menu-inner');
  if (childMenuItems.length) {
    childMenuItems.forEach((menuItem) => {
      const submenuBtn = menuItem.querySelector('.open-submenu');
      if (!submenuBtn) return;
      
      submenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const content = menuItem.querySelector('.grandchild__menu-wrapper');
        if (!content) return;
        
        if (content.style.maxHeight) {
          menuItem.classList.remove('active');
          content.style.maxHeight = null;
          resetFadeAnimations(content);
        } else {
          menuItem.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
          
          resetFadeAnimations(content);
          const grandchildItems = content.querySelectorAll('[data-fade]');
          grandchildItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('animate');
            }, index * 80);
          });
        }
      });
    });
  }

  if (currencyButton && currencySelector) {
    currencyButton.addEventListener('click', function(e) {
      e.preventDefault();
      resetFadeAnimations(drawerContents);
      
      drawerContents.classList.add('unvisible');
      
      setTimeout(() => {
        currencySelector.classList.add('active');
        resetFadeAnimations(currencySelector);
        animateFadeElements(currencySelector, 50);
      }, TRANSITION_DELAY);
    });
  }

  if (currencyBackButton) {
    currencyBackButton.addEventListener('click', function(e) {
      e.preventDefault();
      currencySelector.classList.remove('active');
      
      setTimeout(() => {
        drawerContents.classList.remove('unvisible');
        resetFadeAnimations(drawerContents);
        animateFadeElements(drawerContents);
      }, TRANSITION_DELAY);
    });
  }

  const currencyItems = document.querySelectorAll('.currency-list li[data-value]');
  currencyItems.forEach(item => {
    item.addEventListener('click', function() {
      const countryCode = this.getAttribute('data-value');
      const form = document.querySelector('.country-selector-form');
      if (form) {
        document.querySelector('.selected-country-code').value = countryCode;
        form.submit();
      }
    });
  });

  window.addEventListener('resize', setChildMenuPositions);
  setChildMenuPositions();
});

document.addEventListener("DOMContentLoaded", function () {
  const siteHeader = document.querySelector(".site__header");
  if (siteHeader) {
    const templateName = siteHeader.dataset.template || "";
    const suffixName = siteHeader.dataset.suffix || "";
    const allowedTemplates = siteHeader.dataset.allowed || "";

    setUpTopSpacing(allowedTemplates, templateName, suffixName);
  }
});

function setUpTopSpacing(allowedTemplates, templateName, suffixName) {
  const siteHeader = document.querySelector(".site__header");
  const announcementBar = document.querySelector(".announcement-bar-section");
  
  if (!siteHeader || !announcementBar) return;

  let allowedTemplatesArray = [];
  if (allowedTemplates) {
    const cleanedTemplates = allowedTemplates.replace(/\s/g, "");
    allowedTemplatesArray = cleanedTemplates.split(",");
  }

  const isAllowedTemplate = allowedTemplatesArray.length && 
    (allowedTemplatesArray.includes(templateName) || allowedTemplatesArray.includes(suffixName));

  const shopifySection = siteHeader.closest(".shopify-section");

  function updateSpacing() {
    const mainContent = document.querySelector("main#MainContent");
    if (!mainContent || !mainContent.firstElementChild || isAllowedTemplate) return;

    if (window.innerWidth > 1200) {
      let totalHeight = 0;

      if (announcementBar) {
        totalHeight += announcementBar.offsetHeight;
      }

      if (shopifySection) {
        totalHeight += shopifySection.offsetHeight;
      }

      mainContent.firstElementChild.style.paddingTop = `${totalHeight}px`;
      mainContent.firstElementChild.style.marginTop = "0";
    } else {
      mainContent.firstElementChild.style.paddingTop = "65px";
      mainContent.firstElementChild.style.marginTop = "0";
    }
  }

  updateSpacing();

  window.addEventListener("resize", updateSpacing);
}


class PredictiveSearchNew extends HTMLElement {
  constructor() {
    super();
    this.header = this.querySelector(".site__header")?.parentElement || document.querySelector(".site__header")?.parentElement;
    this.searchInput = this.querySelector("#predictive-search");
    this.resultsContainer = this.querySelector("#predictive-results");
    this.closeButton = document.querySelectorAll(".close-search");
    this.debounceTimer = null;
    this.siteLogo = document.querySelector("[site-logo]");
    this.headerAnnouncement = document.querySelector(".section__annoucement")?.parentElement || document.querySelector(".section__annoucement")?.parentElement;
    this.body = document.body;
    this.searchPopular = this.querySelector(".search-popular");
    this.fetchPredictiveResults = this.fetchPredictiveResults.bind(this);
    this.debounce = this.debounce.bind(this);
    this.handleInput = this.debounce(this.fetchPredictiveResults, 300);
    this.triggers = document.querySelectorAll("[header-search]");
  }

  connectedCallback() {
    this.classList.add("predictive-search-new");
    this.triggers.forEach(trigger => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        this.classList.toggle("open");
        this.toggleSearch(this.classList.contains("open"));
      });
    });

    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.handleInput(e.target.value.trim());
      });
    }

    this.closeButton.forEach(button => {
      button.addEventListener("click", () => {
        this.closeSearch();
      });
    });
  }

  toggleSearch(isOpen) {
    if (isOpen) {
      this.openSearch();
    } else {
      this.closeSearch();
    }
  }

  openSearch() {
    if (this.header) this.header.style.top = "0";
    if (this.siteLogo) this.siteLogo.classList.add("float-item");
    if (this.body) this.body.style.overflow = "hidden";
    if (this.headerAnnouncement) this.headerAnnouncement.style.marginTop = `-${this.headerAnnouncement.offsetHeight}px`;
    if (this.searchPopular) this.searchPopular.classList.remove("hidden");
    this.closeButton.forEach(btn => btn.classList.add("active"));

    this.searchInput.style.display = "block";
    this.searchInput.style.opacity = "1";
    this.searchInput.style.visibility = "visible";

    // Simple focus like Code 2 - just wait 50ms and focus
    if (this.searchInput) {
      setTimeout(() => this.searchInput.focus(), 50);
    }
  }

  closeSearch() {
    this.classList.remove("open");
    this.resultsContainer.classList.remove("show");
    this.searchInput.value = "";

    const announcementHeight = this.headerAnnouncement?.offsetHeight || 0;
    const scrollPosition = window.scrollY;
    if (this.header) {
      this.header.style.top = scrollPosition < announcementHeight ? `${announcementHeight}px` : "0";
    }

    if (this.siteLogo) this.siteLogo.classList.remove("float-item");
    if (this.body) this.body.style.overflow = "visible";
    if (this.headerAnnouncement) this.headerAnnouncement.style.marginTop = "0";
    if (this.searchPopular) this.searchPopular.classList.remove("hidden");
    this.closeButton.forEach(btn => btn.classList.remove("active"));
  }

  async fetchPredictiveResults(query) {
    if (!query) {
      this.resultsContainer.innerHTML = "";
      this.resultsContainer.classList.remove("show");
      if (this.searchPopular) this.searchPopular.classList.remove("hidden");
      return;
    }

    try {
      const response = await fetch(
        `/search/suggest?q=${encodeURIComponent(query)}&section_id=predictive-search-new&resources[type]=product,collection,page,article&resources[limit]=12`
      );
      const text = await response.text();
      this.resultsContainer.innerHTML = text;
      this.resultsContainer.classList.add("show");
      if (this.searchPopular) this.searchPopular.classList.add("hidden");
      window.cardProductFunc?.();
    } catch (error) {
      this.resultsContainer.innerHTML = "<p>Error loading results</p>";
      this.resultsContainer.classList.add("show");
      if (this.searchPopular) this.searchPopular.classList.add("hidden");
      window.cardProductFunc?.();
    }
  }

  debounce(func, wait) {
    return (...args) => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => func.apply(this, args), wait);
    };
  }

  disconnectedCallback() {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  }
}

customElements.define("predictive-search-new", PredictiveSearchNew);

/*
class PredictiveSearchNew extends HTMLElement {
  constructor() {
    super();
    this.header = this.querySelector(".site__header")?.parentElement || document.querySelector(".site__header")?.parentElement;
    this.searchInput = this.querySelector("#predictive-search");
    this.resultsContainer = this.querySelector("#predictive-results");
    this.closeButton = document.querySelectorAll(".close-search");
    this.debounceTimer = null;
    this.siteLogo = document.querySelector("[site-logo]");
    this.headerAnnouncement = document.querySelector(".section__annoucement")?.parentElement || document.querySelector(".section__annoucement")?.parentElement;
    this.body = document.body;
    this.searchPopular = this.querySelector(".search-popular");
    this.fetchPredictiveResults = this.fetchPredictiveResults.bind(this);
    this.debounce = this.debounce.bind(this);
    this.handleInput = this.debounce(this.fetchPredictiveResults, 300);
    this.triggers = document.querySelectorAll("[header-search]");
  }

  connectedCallback() {
    this.classList.add("predictive-search-new");
    this.triggers.forEach(trigger => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        this.classList.toggle("open");
        this.toggleSearch(this.classList.contains("open"));
      });
    });

    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.handleInput(e.target.value.trim());
      });
    }

    this.closeButton.forEach(button => {
      button.addEventListener("click", () => {
        this.closeSearch();
      });
    });
  }

  toggleSearch(isOpen) {
    if (isOpen) {
      this.openSearch();
    } else {
      this.closeSearch();
    }
  }

  openSearch() {
    if (this.header) this.header.style.top = "0";
    if (this.siteLogo) this.siteLogo.classList.add("float-item");
    if (this.body) this.body.style.overflow = "hidden";
    if (this.headerAnnouncement) this.headerAnnouncement.style.marginTop = `-${this.headerAnnouncement.offsetHeight}px`;
    if (this.searchPopular) this.searchPopular.classList.remove("hidden");
    this.closeButton.forEach(btn => btn.classList.add("active"));

    this.searchInput.style.display = "block";
    this.searchInput.style.opacity = "1";
    this.searchInput.style.visibility = "visible";

    setTimeout(() => {
      this.focusInput();
    }, 10);

    let focusAttempts = 0;
    const focusInterval = setInterval(() => {
      this.focusInput();
      focusAttempts++;
      if (focusAttempts >= 10) clearInterval(focusInterval);
    }, 100);
  }

  focusInput() {
    if (!this.searchInput) return;

    this.searchInput.focus();
    this.searchInput.scrollIntoView({ behavior: 'instant', block: 'center' });
    this.searchInput.setSelectionRange(0, 0);
    this.searchInput.tabIndex = 0;
    this.searchInput.focus();
  }

  closeSearch() {
    this.classList.remove("open");
    this.resultsContainer.classList.remove("show");
    this.searchInput.value = "";

    const announcementHeight = this.headerAnnouncement?.offsetHeight || 0;
    const scrollPosition = window.scrollY;
    if (this.header) {
      this.header.style.top = scrollPosition < announcementHeight ? `${announcementHeight}px` : "0";
    }

    if (this.siteLogo) this.siteLogo.classList.remove("float-item");
    if (this.body) this.body.style.overflow = "visible";
    if (this.headerAnnouncement) this.headerAnnouncement.style.marginTop = "0";
    if (this.searchPopular) this.searchPopular.classList.remove("hidden");
    this.closeButton.forEach(btn => btn.classList.remove("active"));
  }

  async fetchPredictiveResults(query) {
    if (!query) {
      this.resultsContainer.innerHTML = "";
      this.resultsContainer.classList.remove("show");
      if (this.searchPopular) this.searchPopular.classList.remove("hidden");
      return;
    }

    try {
      const response = await fetch(
        `/search/suggest?q=${encodeURIComponent(query)}&section_id=predictive-search-new&resources[type]=product,collection,page,article&resources[limit]=5`
      );
      const text = await response.text();
      this.resultsContainer.innerHTML = text;
      this.resultsContainer.classList.add("show");
      if (this.searchPopular) this.searchPopular.classList.add("hidden");
      window.cardProductFunc?.();
    } catch (error) {
      this.resultsContainer.innerHTML = "<p>Error loading results</p>";
      this.resultsContainer.classList.add("show");
      if (this.searchPopular) this.searchPopular.classList.add("hidden");
      window.cardProductFunc?.();
    }
  }

  debounce(func, wait) {
    return (...args) => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => func.apply(this, args), wait);
    };
  }

  disconnectedCallback() {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  }
}

customElements.define("predictive-search-new", PredictiveSearchNew);
*/


