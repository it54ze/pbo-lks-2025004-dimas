import { booksApi, categoriesApi } from '../api.js';

export async function renderDashboard(container) {
  let totalBooks = 0;
  let totalCategories = 0;

  try {
    const [booksRes, categoriesRes] = await Promise.all([
      booksApi.list(),
      categoriesApi.list()
    ]);
    totalBooks = booksRes.data?.length || 0;
    totalCategories = categoriesRes.data?.length || 0;
  } catch (e) {
    console.error('Gagal mengambil data statistik', e);
  }

  container.innerHTML = `
    <div class="page-enter space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p class="text-sm text-gray-500">Ringkasan data sistem perpustakaan.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Total Buku</p>
            <h3 class="text-3xl font-bold text-gray-800 mt-1">${totalBooks}</h3>
          </div>
          <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl">
            📚
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Total Kategori</p>
            <h3 class="text-3xl font-bold text-gray-800 mt-1">${totalCategories}</h3>
          </div>
          <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold text-xl">
            🏷️
          </div>
        </div>
      </div>
    </div>
  `;
}