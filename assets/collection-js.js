document.addEventListener("DOMContentLoaded", function () {
  const sortOpener = document.querySelector("[sort-opener]");
  const sortBody = document.querySelector("[sort-body]");
  const sortClose = document.querySelector("[sort-close]");

  function openSortBody() {
    sortBody.classList.add("open");
  }

  function closeSortBody() {
    sortBody.classList.remove("open");
  }

  sortOpener.addEventListener("click", function (event) {
    event.stopPropagation();
    if (sortBody.classList.contains("open")) {
      closeSortBody();
    } else {
      openSortBody();
    }
  });

  sortClose.addEventListener("click", function (event) {
    event.stopPropagation();
    closeSortBody();
  });

  document.addEventListener("click", function (event) {
    if (
      !sortBody.contains(event.target) &&
      sortBody.classList.contains("open")
    ) {
      closeSortBody();
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const collectionsLists = document.querySelectorAll(".collections__list");

  if (collectionsLists.length > 0) {
    collectionsLists.forEach((container) => {
      const activeLink = container.querySelector("a.active");

      if (activeLink) {
        const scrollPosition =
          activeLink.offsetLeft -
          container.offsetWidth / 2 +
          activeLink.offsetWidth / 2;

        container.scrollTo({ left: scrollPosition, behavior: "smooth" });
      }
    });
  }
});

window.initWrapperHeightSync = function () {
  const image = document.querySelector('.card__media img');
  const wrappers = document.querySelectorAll('.--collection-promotion-card-wrapper');
  const switchButtons = document.querySelectorAll('.column__switch-lg-wrapper button');

  if (!image) return;

  window.setAllWrapperHeights = function () {
    const imgHeight = image.offsetHeight;
    wrappers.forEach(wrapper => {
      wrapper.style.height = `${imgHeight}px`;
    });
  };

  if (image.complete) {
    window.setAllWrapperHeights();
  } else {
    image.addEventListener('load', window.setAllWrapperHeights);
  }

  window.addEventListener('resize', window.setAllWrapperHeights);

  switchButtons.forEach(button => {
    button.addEventListener('click', window.setAllWrapperHeights);
  });
};

document.addEventListener('DOMContentLoaded', function () {
  window.initWrapperHeightSync();
});


window.loadMore = () =>{
  const loadMoreButton = document.getElementById('load-more-button');
  const productGrid = document.getElementById('product-grid');
  const showingCount = document.getElementById('showing-count');

  if (!loadMoreButton || !productGrid) return;

  let isLoading = false;
  let currentPage = parseInt(loadMoreButton.dataset.currentPage);
  const totalPages = parseInt(loadMoreButton.dataset.totalPages);
  const totalItems = parseInt(loadMoreButton.dataset.totalItems);
  const itemsPerPage = parseInt(loadMoreButton.dataset.itemsPerPage);
  const collectionHandle = window.location.pathname.split('/collections/')[1]?.split('/')[0] || '';

  loadMoreButton.addEventListener('click', function() {
    if (isLoading || currentPage >= totalPages) return;
    
    isLoading = true;
    loadMoreButton.textContent = 'Loading...';
    
    currentPage++;
    const url = buildUrl();
    
    fetch(url)
      .then(response => response.text())
      .then(text => {
        const parser = new DOMParser();
        const html = parser.parseFromString(text, 'text/html');
        const newItems = html.getElementById('product-grid')?.innerHTML || '';
        
        if (newItems) {
          productGrid.insertAdjacentHTML('beforeend', newItems);
          
          const newShowingCount = Math.min(currentPage * itemsPerPage, totalItems);
          showingCount.textContent = newShowingCount;
          
          if (currentPage >= totalPages) {
            loadMoreButton.style.display = 'none';
          } else {
            loadMoreButton.textContent = 'Load More';
          }
        }
      })
      .catch(error => {
        console.error('Error loading more products:', error);
        loadMoreButton.textContent = 'Error - Try Again';
      })
      .finally(() => {
        isLoading = false;
        window.initWrapperHeightSync();
        window.cardProductFunc();
      });
  });

  function buildUrl() {
    const baseUrl = `/collections/${collectionHandle}`;
    const params = new URLSearchParams(window.location.search);
    params.set('page', currentPage);
    params.set('view', 'ajax');
    return `${baseUrl}?${params.toString()}`;
  }
}
document.addEventListener('DOMContentLoaded', function() {
  window.loadMore();
});
