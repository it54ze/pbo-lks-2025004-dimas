import { categoriesApi } from '../api.js';
import { escapeHtml, showToast, confirmAction } from '../utils.js';

export async function renderCategories(container) {
  container.innerHTML = `
    <div class="page-enter space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Kelola Kategori</h2>
          <p class="text-sm text-gray-500">Daftar kategori buku perpustakaan.</p>
        </div>
        <button id="btn-add-category" class="bg-primary hover:bg-blue-900 text-white px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm">
          + Tambah Kategori
        </button>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 text-gray-600 text-xs uppercase font-semibold border-b border-gray-100">
                <th class="p-4">Nama Kategori</th>
                <th class="p-4">Deskripsi</th>
                <th class="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody id="categories-tbody" class="divide-y divide-gray-100 text-sm text-gray-700">
              <tr><td colspan="3" class="p-6 text-center text-gray-400">Memuat data kategori...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div id="category-modal" class="fixed inset-0 bg-black/50 z-50 hidden flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
        <h3 id="category-modal-title" class="text-lg font-bold text-gray-800">Tambah Kategori</h3>
        <form id="category-form" class="space-y-4">
          <input type="hidden" id="category-id">
          <div>
            <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Nama Kategori</label>
            <input type="text" id="category-nama" required class="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Deskripsi</label>
            <textarea id="category-deskripsi" rows="3" class="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm"></textarea>
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" id="category-modal-close" class="px-4 py-2 border rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Batal</button>
            <button type="submit" class="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-blue-900">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  `;

  const tbody = document.getElementById('categories-tbody');
  const modal = document.getElementById('category-modal');
  const form = document.getElementById('category-form');

  async function loadCategories() {
    try {
      const res = await categoriesApi.list();
      const categories = res.data || [];
      if (categories.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="p-6 text-center text-gray-400">Belum ada data kategori.</td></tr>`;
        return;
      }
      tbody.innerHTML = categories.map(c => `
        <tr class="hover:bg-gray-50/50 transition">
          <td class="p-4 font-medium text-gray-800">${escapeHtml(c.nama)}</td>
          <td class="p-4 text-gray-500">${escapeHtml(c.deskripsi || '-')}</td>
          <td class="p-4 text-right space-x-2">
            <button data-edit='${JSON.stringify(c)}' class="btn-edit text-blue-600 hover:underline font-medium text-xs">Edit</button>
            <button data-id="${c.id}" class="btn-delete text-red-600 hover:underline font-medium text-xs">Hapus</button>
          </td>
        </tr>
      `).join('');
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="3" class="p-6 text-center text-red-500">Gagal memuat data.</td></tr>`;
    }
  }

  document.getElementById('btn-add-category').onclick = () => {
    form.reset();
    document.getElementById('category-id').value = '';
    document.getElementById('category-modal-title').textContent = 'Tambah Kategori';
    modal.classList.remove('hidden');
  };

  document.getElementById('category-modal-close').onclick = () => modal.classList.add('hidden');

  tbody.onclick = async (e) => {
    if (e.target.classList.contains('btn-delete')) {
      const id = e.target.dataset.id;
      if (confirmAction('Yakin ingin menghapus kategori ini?')) {
        try {
          await categoriesApi.destroy(id);
          showToast('Kategori berhasil dihapus', 'success');
          loadCategories();
        } catch (err) {
          showToast(err.message, 'error');
        }
      }
    }
    if (e.target.classList.contains('btn-edit')) {
      const c = JSON.parse(e.target.dataset.edit);
      document.getElementById('category-id').value = c.id;
      document.getElementById('category-nama').value = c.nama;
      document.getElementById('category-deskripsi').value = c.deskripsi || '';
      document.getElementById('category-modal-title').textContent = 'Edit Kategori';
      modal.classList.remove('hidden');
    }
  };

  form.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('category-id').value;
    const data = {
      nama: document.getElementById('category-nama').value,
      deskripsi: document.getElementById('category-deskripsi').value,
    };

    try {
      if (id) {
        await categoriesApi.update(id, data);
        showToast('Kategori berhasil diperbarui', 'success');
      } else {
        await categoriesApi.create(data);
        showToast('Kategori berhasil ditambahkan', 'success');
      }
      modal.classList.add('hidden');
      loadCategories();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  await loadCategories();
}