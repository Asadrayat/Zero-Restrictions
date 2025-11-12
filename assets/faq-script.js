document.addEventListener("DOMContentLoaded", function () {
  function getCategories() {
    var faqCategoryTitles = document.querySelectorAll(".cf__category_title");
    var categoryWrapper = document.querySelector(".faq__banner-section .category__wrapper");

    if (categoryWrapper) {
      faqCategoryTitles.forEach((faqCategoryTitle, index) => {
        let categoryName = faqCategoryTitle.textContent.trim(); // Get the text inside the category title

        let navigationBtn = document.createElement("div");
        navigationBtn.className = `navigation__btn ${
          index === 0 ? "active" : ""
        }`;
        navigationBtn.setAttribute("data-banner-category", "");
        navigationBtn.setAttribute("data-category", categoryName);
        navigationBtn.textContent = categoryName;

        categoryWrapper.appendChild(navigationBtn);
      });
    } else {
      console.error("Category wrapper not found!");
    }
  }

  function setCategoriesActive() {
    var faqBannerCategories = document.querySelectorAll(
      "[data-banner-category]"
    );

    faqBannerCategories.forEach((faqBannerCategory) => {
      faqBannerCategory.addEventListener("click", function () {
        var categoryBannerDataset = this.dataset.category.trim(); // Get clicked category dataset

        // Get all category blocks
        var categoryBlocks = document.querySelectorAll("[data-category-block]");

        // Remove 'active' class from all blocks first
        categoryBlocks.forEach((categoryBlock) => {
          categoryBlock.classList.remove("active");
        });

        // Add 'active' to the matching block
        categoryBlocks.forEach((categoryBlock) => {
          var categoryBlockDataset = categoryBlock.dataset.category.trim();
          if (categoryBlockDataset === categoryBannerDataset) {
            categoryBlock.classList.add("active");
          }
        });

        // Remove 'active' from all banner buttons
        faqBannerCategories.forEach((item) => {
          item.classList.remove("active");
        });

        // Set clicked banner as active
        this.classList.add("active");
      });
    });
  }

  getCategories();
  setCategoriesActive();
});
