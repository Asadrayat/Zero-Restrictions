document.addEventListener("DOMContentLoaded", () => {
  initMegaMenus();
  initHeaderDrawer();
  initSubmenuNavigation();
});

function initMegaMenus() {
  document.querySelectorAll(".mega__menu").forEach((menu) => {
    const childItems = [...menu.querySelectorAll("[mega__child-li]")];
    const grandWrappers = [...menu.querySelectorAll(".mega__grand-wrapper")];

    const firstMatch = findFirstMatch(childItems, grandWrappers);
    if (firstMatch) setActive(firstMatch.child, firstMatch.wrapper);

    childItems.forEach((child) =>
      child.addEventListener("mouseenter", () =>
        handleMouseEnter(child, childItems, grandWrappers)
      )
    );
  });
}

function findFirstMatch(childItems, grandWrappers) {
  return (
    childItems
      .map((child) => ({
        child,
        wrapper: grandWrappers.find(
          (wrapper) =>
            wrapper.getAttribute("data-child") ===
            child.getAttribute("data-child")
        ),
      }))
      .find((match) => match.wrapper) || null
  );
}

function setActive(child, wrapper) {
  child?.classList.add("active");
  wrapper?.classList.add("active");
}

function removeActive(childItems, grandWrappers) {
  childItems.forEach((item) => item.classList.remove("active"));
  grandWrappers.forEach((wrapper) => wrapper.classList.remove("active"));
}

function handleMouseEnter(child, childItems, grandWrappers) {
  removeActive(childItems, grandWrappers);
  const matchedWrapper = grandWrappers.find(
    (wrapper) =>
      wrapper.getAttribute("data-child") === child.getAttribute("data-child")
  );
  if (matchedWrapper) setActive(child, matchedWrapper);
}

function initHeaderDrawer() {
  const headerDrawer = document.querySelector(".header__drawer");
  const toggleButton = document.querySelector("[header-drawer-opener]");
  const closeButton = document.querySelector("[header-drawer-close]");
  const html = document.documentElement;
  const body = document.body;
  if (!headerDrawer || !toggleButton || !closeButton) return;

  const toggleDrawer = (event) => {
    event.preventDefault();
    headerDrawer.classList.toggle("active");
    html.classList.toggle(
      "overflow-hidden",
      headerDrawer.classList.contains("active")
    );
    body.classList.toggle(
      "overflow-hidden",
      headerDrawer.classList.contains("active")
    );
  };

  const closeDrawer = () => {
    headerDrawer.classList.remove("active");
    html.classList.remove("overflow-hidden");
    body.classList.remove("overflow-hidden");
  };

  toggleButton.addEventListener("click", toggleDrawer);
  closeButton.addEventListener("click", closeDrawer);

  document.addEventListener("click", (e) => {
    if (
      headerDrawer.classList.contains("active") &&
      !headerDrawer.contains(e.target) &&
      !toggleButton.contains(e.target)
    ) {
      closeDrawer();
    }
  });
}

function initSubmenuNavigation() {
  const openButtons = document.querySelectorAll(".open-submenu");
  const backButtons = document.querySelectorAll(".back-button");
  const grandchildToggles = document.querySelectorAll(".toggle-grandchild");
  let openGrandchildMenu = null;

  openButtons.forEach((button) =>
    button.addEventListener("click", () => {
      const submenu = button.closest("li").querySelector(".submenu");
      submenu?.classList.add("active");
    })
  );

  backButtons.forEach((button) =>
    button.addEventListener("click", () => {
      const submenu = button.closest(".submenu");
      submenu?.classList.remove("active");
    })
  );

  grandchildToggles.forEach((toggle) =>
    toggle.addEventListener("click", () => {
      const grandchildMenu = toggle
        .closest(".submenu-item")
        .querySelector(".grandchild-menu");
      const subMenuItem = grandchildMenu.closest(".has-grandchildren");

      if (grandchildMenu) {
        if (openGrandchildMenu && openGrandchildMenu !== grandchildMenu) {
          openGrandchildMenu.style.height = "0px";
          openGrandchildMenu.classList.remove("open");

          // Remove open class from previously opened parent .has-grandchildren
          const previousSubMenuItem =
            openGrandchildMenu.closest(".has-grandchildren");
          previousSubMenuItem?.classList.remove("open");
        }

        if (grandchildMenu.classList.contains("open")) {
          grandchildMenu.style.height = "0px";
          grandchildMenu.classList.remove("open");

          // Remove open class from the closest .has-grandchildren
          subMenuItem?.classList.remove("open");

          openGrandchildMenu = null;
        } else {
          grandchildMenu.style.height = `${grandchildMenu.scrollHeight}px`;
          grandchildMenu.classList.add("open");

          // Add open class to the closest .has-grandchildren
          subMenuItem?.classList.add("open");

          openGrandchildMenu = grandchildMenu;
        }
      }
    })
  );
}

function setupFixedHeader(isSticky) {
  const mainHeader = document.querySelector(".site__header");
  if (!mainHeader) return;

  if (!isSticky) return;

  const headerSection = mainHeader.closest(".shopify-section");
  if (!headerSection) return;

  function adjustFixedPosition() {
    if (window.scrollY > 300) {
      headerSection.classList.remove("not__fixed");
      headerSection.classList.add("fixed__header");
    } else {
      headerSection.classList.add("not__fixed");
      headerSection.classList.remove("fixed__header");
    }
  }

  adjustFixedPosition();
  window.addEventListener("scroll", adjustFixedPosition);
  window.addEventListener("resize", adjustFixedPosition);
}

document.addEventListener("DOMContentLoaded", function () {
  const drawerLogo = document.querySelector(".drawer__logo");
  const drawerMenu = document.querySelector(".drawer-menu");
  const drawerUtensils = document.querySelector(".drawer__utensils");
  const submenus = document.querySelectorAll(".submenu");
  const siteHeader = document.querySelector(".site__header");
  if (siteHeader) {
    const isSticky = siteHeader.dataset.sticky === "true";
    setupFixedHeader(isSticky);
  }

  if (drawerLogo && drawerMenu && drawerUtensils) {
    const logoHeight = drawerLogo.offsetHeight;
    const utensilsHeight = drawerUtensils.offsetHeight;
    drawerMenu.style.height = `calc(100% - ${logoHeight + utensilsHeight}px)`;
  }

  if (drawerLogo && submenus.length > 0) {
    const logoHeight = drawerLogo.offsetHeight;
    submenus.forEach((submenu) => {
      submenu.style.top = `${logoHeight}px`;
      submenu.style.height = `calc(100% - ${logoHeight}px)`;
    });
  }
});
