'use strict';

const toggleActive = (element) => {
  if (element) element.classList.toggle('active');
};

const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');

if (sidebar && sidebarBtn) {
  sidebarBtn.addEventListener('click', () => toggleActive(sidebar));
}

const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

navigationLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const target = link.textContent.trim().toLowerCase();

    pages.forEach((page) => {
      page.classList.toggle('active', page.dataset.page === target);
    });

    navigationLinks.forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

const select = document.querySelector('[data-select]');
const selectValue = document.querySelector('[data-selecct-value]');
const selectItems = document.querySelectorAll('[data-select-item]');
const filterButtons = document.querySelectorAll('[data-filter-btn]');
const filterItems = document.querySelectorAll('[data-filter-item]');
const researchItems = document.querySelectorAll('[data-research-item]');
const photoItems = Array.from(document.querySelectorAll('[data-photo-item]'));

const filterResearch = (selectedValue) => {
  const normalizedValue = selectedValue.toLowerCase();

  filterItems.forEach((item) => {
    const categories = item.dataset.category.split(' ');
    const isVisible = normalizedValue === 'all' || categories.includes(normalizedValue);
    item.classList.toggle('active', isVisible);
  });
};

if (select) {
  select.addEventListener('click', () => toggleActive(select));
}

selectItems.forEach((item) => {
  item.addEventListener('click', () => {
    const selectedValue = item.innerText.trim();
    if (selectValue) selectValue.innerText = selectedValue;
    if (select) select.classList.remove('active');
    filterResearch(selectedValue);

    filterButtons.forEach((button) => {
      button.classList.toggle('active', button.innerText.trim() === selectedValue);
    });
  });
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedValue = button.innerText.trim();
    if (selectValue) selectValue.innerText = selectedValue;
    filterResearch(selectedValue);

    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
  });
});

researchItems.forEach((item) => {
  const toggleItem = () => {
    const willExpand = !item.classList.contains('expanded');

    researchItems.forEach((otherItem) => {
      otherItem.classList.remove('expanded');
      otherItem.setAttribute('aria-expanded', 'false');
    });

    item.classList.toggle('expanded', willExpand);
    item.setAttribute('aria-expanded', willExpand ? 'true' : 'false');
  };

  item.setAttribute('aria-expanded', 'false');

  item.addEventListener('click', (event) => {
    if (event.target.closest('a')) return;
    toggleItem();
  });

  item.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    toggleItem();
  });
});

const photoModalContainer = document.querySelector('[data-photo-modal-container]');
const photoOverlay = document.querySelector('[data-photo-overlay]');
const photoCloseBtn = document.querySelector('[data-photo-close-btn]');
const photoPrevBtn = document.querySelector('[data-photo-prev]');
const photoNextBtn = document.querySelector('[data-photo-next]');
const photoZoomBtn = document.querySelector('[data-photo-zoom-btn]');
const photoModalImage = document.querySelector('[data-photo-modal-image]');
const photoModalTitle = document.querySelector('[data-photo-modal-title]');
const photoModalTime = document.querySelector('[data-photo-modal-time]');
const photoModalPlace = document.querySelector('[data-photo-modal-place]');
const photoModalCounter = document.querySelector('[data-photo-modal-counter]');
const photoThumbs = document.querySelector('[data-photo-thumbs]');

let activePhotoGroup = [];
let activePhotoIndex = 0;

const renderPhotoModal = () => {
  if (!activePhotoGroup.length || !photoModalImage) return;

  const currentPhoto = activePhotoGroup[activePhotoIndex];
  const hasMultiplePhotos = activePhotoGroup.length > 1;

  photoModalImage.src = currentPhoto.dataset.photoSrc;
  photoModalImage.alt = currentPhoto.dataset.photoTitle;
  photoModalImage.classList.remove('zoomed');

  if (photoModalTitle) photoModalTitle.textContent = currentPhoto.dataset.photoTitle;
  if (photoModalTime) photoModalTime.textContent = `Photo time: ${currentPhoto.dataset.photoTime}`;
  if (photoModalPlace) photoModalPlace.textContent = `Place: ${currentPhoto.dataset.photoPlace}`;
  if (photoModalCounter) photoModalCounter.textContent = `${activePhotoIndex + 1} / ${activePhotoGroup.length}`;
  if (photoZoomBtn) photoZoomBtn.textContent = 'Zoom';

  if (photoPrevBtn) photoPrevBtn.classList.toggle('is-hidden', !hasMultiplePhotos);
  if (photoNextBtn) photoNextBtn.classList.toggle('is-hidden', !hasMultiplePhotos);

  if (photoThumbs) {
    photoThumbs.innerHTML = '';

    activePhotoGroup.forEach((photoItem, index) => {
      const thumbButton = document.createElement('button');
      thumbButton.type = 'button';
      thumbButton.className = 'photo-thumb';
      if (index === activePhotoIndex) thumbButton.classList.add('active');
      thumbButton.setAttribute('aria-label', `Open ${photoItem.dataset.photoTitle}`);

      const thumbImage = document.createElement('img');
      thumbImage.src = photoItem.dataset.photoSrc;
      thumbImage.alt = photoItem.dataset.photoTitle;

      thumbButton.appendChild(thumbImage);
      thumbButton.addEventListener('click', () => {
        activePhotoIndex = index;
        renderPhotoModal();
      });

      photoThumbs.appendChild(thumbButton);
    });
  }
};

const openPhotoModal = (clickedItem) => {
  const groupName = clickedItem.dataset.photoGroup;
  activePhotoGroup = photoItems.filter((item) => item.dataset.photoGroup === groupName);
  activePhotoIndex = activePhotoGroup.findIndex((item) => item === clickedItem);

  renderPhotoModal();
  if (photoModalContainer && photoOverlay) {
    photoModalContainer.classList.add('active');
    photoOverlay.classList.add('active');
  }
};

const closePhotoModal = () => {
  if (photoModalContainer && photoOverlay) {
    photoModalContainer.classList.remove('active');
    photoOverlay.classList.remove('active');
  }

  if (photoModalImage) {
    photoModalImage.classList.remove('zoomed');
  }
};

const movePhoto = (direction) => {
  if (activePhotoGroup.length <= 1) return;

  activePhotoIndex = (activePhotoIndex + direction + activePhotoGroup.length) % activePhotoGroup.length;
  renderPhotoModal();
};

photoItems.forEach((item) => {
  item.addEventListener('click', () => openPhotoModal(item));
});

if (photoCloseBtn) {
  photoCloseBtn.addEventListener('click', closePhotoModal);
}

if (photoPrevBtn) {
  photoPrevBtn.addEventListener('click', () => movePhoto(-1));
}

if (photoNextBtn) {
  photoNextBtn.addEventListener('click', () => movePhoto(1));
}

if (photoZoomBtn && photoModalImage) {
  photoZoomBtn.addEventListener('click', () => {
    const isZoomed = photoModalImage.classList.toggle('zoomed');
    photoZoomBtn.textContent = isZoomed ? 'Reset' : 'Zoom';
  });

  photoModalImage.addEventListener('click', () => {
    const isZoomed = photoModalImage.classList.toggle('zoomed');
    photoZoomBtn.textContent = isZoomed ? 'Reset' : 'Zoom';
  });
}

document.addEventListener('keydown', (event) => {
  if (!photoModalContainer || !photoModalContainer.classList.contains('active')) return;

  if (event.key === 'Escape') closePhotoModal();
  if (event.key === 'ArrowLeft') movePhoto(-1);
  if (event.key === 'ArrowRight') movePhoto(1);
});

filterResearch('all');
