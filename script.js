const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('#mobile-nav');
const copyButton = document.querySelector('#copy-link');
const copyStatus = document.querySelector('#copy-status');
const printButton = document.querySelector('#print-page');
const expandableRoles = [...document.querySelectorAll('details.role-secondary')];
const menuLabel = menuButton.querySelector('.sr-only');

function setMenuState(isOpen) {
  menuButton.setAttribute('aria-expanded', String(isOpen));
  mobileNav.hidden = !isOpen;
  menuLabel.textContent = isOpen ? 'Закрыть меню' : 'Открыть меню';
}

function closeMenu({ restoreFocus = false } = {}) {
  setMenuState(false);
  if (restoreFocus) menuButton.focus();
}

function focusSection(hash) {
  const target = document.querySelector(hash);
  if (!target) return;
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
  target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
}

menuButton.addEventListener('click', () => {
  const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  setMenuState(willOpen);
});

mobileNav.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!link) return;
  closeMenu();
  window.requestAnimationFrame(() => focusSection(link.hash));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu({ restoreFocus: true });
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 820) closeMenu();
});

async function copyCurrentUrl() {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(window.location.href);
    return;
  }
  const field = document.createElement('textarea');
  field.value = window.location.href;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.append(field);
  field.select();
  const copied = document.execCommand('copy');
  field.remove();
  if (!copied) throw new Error('Copy command failed');
}

let copyStatusTimer;
copyButton.addEventListener('click', async () => {
  window.clearTimeout(copyStatusTimer);
  try {
    await copyCurrentUrl();
    copyStatus.textContent = 'Ссылка скопирована.';
  } catch (error) {
    copyStatus.textContent = 'Не удалось скопировать ссылку. Скопируйте адрес из строки браузера.';
  }
  copyStatusTimer = window.setTimeout(() => { copyStatus.textContent = ''; }, 4000);
});

printButton.addEventListener('click', () => window.print());

let roleOpenState = [];
let printPrepared = false;
window.addEventListener('beforeprint', () => {
  if (printPrepared) return;
  roleOpenState = expandableRoles.map((item) => item.open);
  expandableRoles.forEach((item) => { item.open = true; });
  printPrepared = true;
});
window.addEventListener('afterprint', () => {
  if (!printPrepared) return;
  expandableRoles.forEach((item, index) => { item.open = roleOpenState[index]; });
  printPrepared = false;
});
