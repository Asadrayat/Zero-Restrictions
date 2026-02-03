document.addEventListener("DOMContentLoaded", () => {
  const announcement = document.querySelector(".section__annoucement");
  const header = document.querySelector(".site__header");
  const navLinks = document.querySelectorAll(".header__nav-ul a");
  const megaMenuItems = document.querySelectorAll(".mega__menu-item");
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
    navLinks.forEach((l) => l.classList.remove("active"));
    megaMenuItems.forEach((m) => m.classList.remove("active"));
    const menuValue = e.target.dataset.menu;
    megaMenuItems.forEach((megaItem) => {
      if (megaItem.dataset.mega === menuValue) {
        e.target.classList.add("active");
        megaItem.classList.add("active");
        headerNavLogo.classList.add("float-item");
        header.parentElement.style.top = "0";
        const announcementParentHeight = announcement.parentElement.offsetHeight;
        announcement.parentElement.style.marginTop = `${announcementParentHeight}px`;
      }
    });
    body.style.overflow = "hidden";
  };

  navLinks.forEach((link) => link.addEventListener("click", handleNavLinkClick));

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
  };

  closeButtons.forEach((closeButton) => closeButton.addEventListener("click", handleCloseButtonClick));
});

/*
document.addEventListener("DOMContentLoaded", () => {
  const drawer = document.querySelector('.mbl__drawer');
  const closeButton = document.querySelector('[mbl-drawer-close]');
  const drawerOpener = document.querySelectorAll('[mobile-drawer-opener]');
  const body = document.body;
  const html = document.documentElement;

  const toggleDrawer = () => {
    drawer.classList.toggle('open');
    const isOpen = drawer.classList.contains('open');
    body.style.overflow = isOpen ? 'hidden' : 'visible';
    html.style.overflow = isOpen ? 'hidden' : 'visible';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    body.style.overflow = 'visible';
    html.style.overflow = 'visible';
  };

  const handleSubmenuToggle = (e) => {
    const submenu = e.target.closest('.menu__item').querySelector('.submenu');
    submenu.classList.toggle('open');
  };

  const handleGrandchildToggle = (e) => {
    const grandchildMenu = e.target.closest('.submenu-item').querySelector('.grand__submenu');
    grandchildMenu.classList.toggle('open');
  };

  const handleBackButton = (e) => {
    const backButton = e.target;

    if (backButton.classList.contains('child__back')) {
      const submenu = backButton.closest('.submenu');
      submenu.classList.remove('open');
    }

    if (backButton.classList.contains('grand__child-back')) {
      const grandchildMenu = backButton.closest('.grand__submenu');
      grandchildMenu.classList.remove('open');
    }
  };

  drawerOpener.forEach(anchor => anchor.addEventListener('click', (e) => { e.preventDefault(); toggleDrawer(); }));
  closeButton && closeButton.addEventListener('click', closeDrawer);

  document.querySelectorAll('.open-submenu').forEach(button => button.addEventListener('click', handleSubmenuToggle));
  document.querySelectorAll('.toggle-grandchild').forEach(button => button.addEventListener('click', handleGrandchildToggle));

  document.querySelectorAll('.child__back').forEach(button => button.addEventListener('click', (e) => {
    if (e.target === button) {
      handleBackButton(e);
    }
  }));

  document.querySelectorAll('.grand__child-back').forEach(button => button.addEventListener('click', (e) => {
    if (e.target === button) {
      handleBackButton(e);
    }
  }));
});
*/


document.addEventListener("DOMContentLoaded", () => {
  const drawer = document.querySelector('.mbl__drawer');
  const closeButton = document.querySelector('[mbl-drawer-close]');
  const drawerOpener = document.querySelectorAll('[mobile-drawer-opener]');
  const body = document.body;
  const html = document.documentElement;
  const toggleDrawer = () => {
    drawer.classList.toggle('open');
    const isOpen = drawer.classList.contains('open');
    body.style.overflow = isOpen ? 'hidden' : 'visible';
    html.style.overflow = isOpen ? 'hidden' : 'visible';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    body.style.overflow = 'visible';
    html.style.overflow = 'visible';
  };

  drawerOpener.forEach(anchor => anchor.addEventListener('click', (e) => { e.preventDefault(); toggleDrawer(); }));
  closeButton && closeButton.addEventListener('click', closeDrawer);

});


// JavaScript for the menu functionality
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.open-submenu').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const trigger = this.getAttribute('data-trigger');
      const targetMenu = document.querySelector(`.menu__wrapper[data-drawer="${trigger}"]`);
      if (!targetMenu) return;
      const currentWrapper = this.closest('.menu__wrapper');
      if (currentWrapper.classList.contains('menu__wrapper-parent')) {
        currentWrapper.classList.add('active');
        targetMenu.classList.add('active');
      } else if (currentWrapper.classList.contains('menu__wrapper-child')) {
        currentWrapper.classList.add('grand-active');
        targetMenu.classList.add('active');
      }
    });
  });
  
  document.querySelectorAll('.child__back').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const childWrapper = this.closest('.menu__wrapper-child');
      const parentWrapper = document.querySelector('.menu__wrapper-parent');
      childWrapper.classList.remove('active');
      parentWrapper.classList.remove('active');
    });
  });
  
  document.querySelectorAll('.grand__child-back').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const grandWrapper = this.closest('.menu__wrapper-grand');
      const childWrapper = document.querySelector('.menu__wrapper-child.active');
      grandWrapper.classList.remove('active');
      if (childWrapper) {
        childWrapper.classList.remove('grand-active');
      }
    });
  });
  
  document.querySelector('[mbl-drawer-close]').addEventListener('click', function() {
    document.querySelectorAll('.menu__wrapper').forEach(wrapper => {
      wrapper.classList.remove('active', 'grand-active');
    });
  });
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


class PredictiveSearchNew extends HTMLElement {
  constructor() {
    super();
    this.header =
      this.querySelector(".site__header")?.parentElement ||
      document.querySelector(".site__header").parentElement;
    this.searchInput = this.querySelector("#predictive-search");
    this.resultsContainer = this.querySelector("#predictive-results");
    this.closeButton = this.querySelector(".close-search");
    this.debounceTimer = null;
    this.siteLogo = document.querySelector("[site-logo]");
    this.headerAnnouncement =
      document.querySelector(".section__annoucement")?.parentElement ||
      document.querySelector(".section__annoucement").parentElement;
    this.body = document.body;
    this.searchPopular = this.querySelector(".search-popular");
    this.fetchPredictiveResults = this.fetchPredictiveResults.bind(this);
    this.debounce = this.debounce.bind(this);
    this.handleInput = this.debounce(this.fetchPredictiveResults, 300);
    this.triggers = document.querySelectorAll("[header-search]"); // Get all search triggers
  }
  
  connectedCallback() {
    // Add click event to all triggers
    this.triggers.forEach(trigger => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        this.classList.toggle("open");
  
        if (this.classList.contains("open")) {
          if (this.header) this.header.style.top = "0";
          this.searchInput.focus();
          if (this.siteLogo) this.siteLogo.classList.add("float-item");
          if (this.body) this.body.style.overflow = 'hidden';
          if (this.headerAnnouncement)
            this.headerAnnouncement.style.marginTop = `-${this.headerAnnouncement.offsetHeight}px`;
          if (this.searchPopular) this.searchPopular.classList.remove("hidden");
        } else {
          const announcementHeight = this.headerAnnouncement.offsetHeight;
          const scrollPosition = window.scrollY;
          if (scrollPosition < announcementHeight) {
            this.header.style.top = `${announcementHeight}px`;
          } else {
            this.header.style.top = "0";
          }
          if (this.siteLogo) this.siteLogo.classList.remove("float-item");
          if (this.body) this.body.style.overflow = 'visible';
          if (this.headerAnnouncement)
            this.headerAnnouncement.style.marginTop = "0";
          if (this.searchPopular) this.searchPopular.classList.remove("hidden");
        }
      });
    });
  
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.handleInput(e.target.value.trim());
      });
    }
  
    if (this.closeButton) {
      this.closeButton.addEventListener("click", () => {
        this.classList.remove("open");
        this.resultsContainer.classList.remove("show");
        this.searchInput.value = "";
  
        const announcementHeight = this.headerAnnouncement.offsetHeight;
        const scrollPosition = window.scrollY;
        if (scrollPosition < announcementHeight) {
          this.header.style.top = `${announcementHeight}px`;
        } else {
          this.header.style.top = "0";
        }
  
        if (this.siteLogo) this.siteLogo.classList.remove("float-item");
        if (this.body) this.body.style.overflow = 'visible';
        if (this.headerAnnouncement)
          this.headerAnnouncement.style.marginTop = "0";
        if (this.searchPopular) this.searchPopular.classList.remove("hidden");
      });
    }
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
        `/search/suggest?q=${encodeURIComponent(
          query
        )}&section_id=predictive-search-new&resources[type]=product,collection,page,article&resources[limit]=5`
      );
      const text = await response.text();
      this.resultsContainer.innerHTML = text;
      this.resultsContainer.classList.add("show");
      if (this.searchPopular) this.searchPopular.classList.add("hidden");
    } catch (error) {
      console.error("Error fetching predictive search:", error);
      this.resultsContainer.innerHTML = "<p>Error loading results</p>";
      this.resultsContainer.classList.add("show");
      if (this.searchPopular) this.searchPopular.classList.add("hidden");
    }
  }

  debounce(func, wait) {
    return (...args) => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => func.apply(this, args), wait);
    };
  }

  disconnectedCallback() {}
}

customElements.define("predictive-search-new", PredictiveSearchNew);


