import { renderHomePage, bindHomePageEvents } from './pages/home.js';
import { renderShopPage, bindShopPageEvents } from './pages/shop.js';
import { renderSciencePage } from './pages/science.js';
import { renderAboutPage, bindAboutPageEvents } from './pages/about.js';
import { renderContactPage, bindContactPageEvents } from './pages/contact.js';
import { renderProfilePage, bindProfilePageEvents } from './pages/profile.js';
import { renderNotFoundPage, bindNotFoundPageEvents } from './pages/notFound.js';
import { ScrollCanvasEngine } from './scrollAnimation.js';
import { state } from './state.js';

export function renderCurrentPage(route) {
  const container = document.getElementById('app-main-content');
  if (!container) return;

  switch (route) {
    case 'shop':
      container.innerHTML = renderShopPage();
      bindShopPageEvents();
      break;

    case 'science':
      container.innerHTML = renderSciencePage();
      break;

    case 'about':
      container.innerHTML = renderAboutPage();
      bindAboutPageEvents();
      break;

    case 'contact':
      container.innerHTML = renderContactPage();
      bindContactPageEvents();
      break;

    case 'profile':
      if (state.user) {
        container.innerHTML = renderProfilePage();
        bindProfilePageEvents();
      } else {
        container.innerHTML = renderHomePage();
        bindHomePageEvents();
        setTimeout(() => state.toggleAuthModal(true), 50);
      }
      break;

    case '404':
      container.innerHTML = renderNotFoundPage();
      bindNotFoundPageEvents();
      break;

    case 'home':
      container.innerHTML = renderHomePage();
      bindHomePageEvents();
      setTimeout(() => {
        new ScrollCanvasEngine('scroll-canvas');
      }, 50);
      break;

    default:
      container.innerHTML = renderNotFoundPage();
      bindNotFoundPageEvents();
      break;
  }
}

