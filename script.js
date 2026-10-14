const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('#mobile-nav');
const copyButton = document.querySelector('#copy-link');
const copyStatus = document.querySelector('#copy-status');
const printButton = document.querySelector('#print-page');
const expandableRoles = [...document.querySelectorAll('details.role-secondary')];

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  mobileNav.hidden = true;
}

menuButton.addEventListener('click', () => {
  const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(willOpen));
  mobileNav.hidden = !willOpen;
});

mobileNav.addEventListener('click', (event) => {
  if (event.target.matches('a')) closeMenu();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 820) closeMenu();
});

copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    copyStatus.textContent = 'Ссылка скопирована.';
  } catch (error) {
    copyStatus.textContent = 'Не удалось скопировать ссылку. Скопируйте адрес из строки браузера.';
  }
  window.setTimeout(() => { copyStatus.textContent = ''; }, 4000);
});

printButton.addEventListener('click', () => window.print());

let roleOpenState = [];
window.addEventListener('beforeprint', () => {
  roleOpenState = expandableRoles.map((item) => item.open);
  expandableRoles.forEach((item) => { item.open = true; });
});
window.addEventListener('afterprint', () => {
  expandableRoles.forEach((item, index) => { item.open = roleOpenState[index]; });
});
