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

filterResearch('all');
