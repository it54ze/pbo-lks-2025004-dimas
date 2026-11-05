import { renderDashboard } from './pages/dashboard.js';
import { renderBooks } from './pages/books.js';
import { renderCategories } from './pages/categories.js';

const routes = {
  '': renderDashboard,
  '#dashboard': renderDashboard,
  '#books': renderBooks,
  '#categories': renderCategories,
};

async function router() {
  const hash = window.location.hash || '#dashboard';
  const viewFunction = routes[hash] || renderDashboard;

  const app = document.getElementById('app');
  app.innerHTML = '<div class="text-center py-16 text-gray-400">Memuat halaman...</div>';

  try {
    await viewFunction(app);
    updateActiveNav(hash);
  } catch (error) {
    app.innerHTML = `
      <div class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center">
        <h2 class="text-lg font-bold mb-2">Gagal Memuat Halaman</h2>
        <p class="text-sm">${error.message}</p>
      </div>
    `;
  }
}

function updateActiveNav(hash) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === hash || (hash === '' && href === '#dashboard')) {
      link.classList.add('bg-blue-700');
    } else {
      link.classList.remove('bg-blue-700');
    }
  });
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);