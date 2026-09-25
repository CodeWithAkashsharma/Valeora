import { state } from '../state.js';
import { setModalAuthTab } from '../components/authModal.js';

export function renderAuthPage() {
  setTimeout(() => {
    setModalAuthTab('login');
    state.toggleAuthModal(true);
    state.setRoute('home');
  }, 10);
  return '';
}

export function bindAuthPageEvents() {}
