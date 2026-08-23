import { renderHomePage, bindHomePageEvents } from './pages/home.js';
import { renderShopPage, bindShopPageEvents } from './pages/shop.js';
import { renderSciencePage } from './pages/science.js';
import { renderAboutPage } from './pages/about.js';
import { renderContactPage, bindContactPageEvents } from './pages/contact.js';
import { renderProfilePage, bindProfilePageEvents } from './pages/profile.js';
import { ScrollCanvasEngine } from './scrollAnimation.js';

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
      break;

    case 'contact':
      container.innerHTML = renderContactPage();
      bindContactPageEvents();
      break;

    case 'profile':
      container.innerHTML = renderProfilePage();
      bindProfilePageEvents();
      break;

    case 'home':
    default:
      container.innerHTML = renderHomePage();
      bindHomePageEvents();

      // Initialize Scroll Canvas Engine on Home Page
      setTimeout(() => {
        new ScrollCanvasEngine('scroll-canvas');
      }, 50);
      break;
  }
}
