import { booksApi, categoriesApi } from '../api.js';
import { escapeHtml, showToast, confirmAction } from '../utils.js';

export async function renderBooks(container) {
  container.innerHTML = `
    <div class="page-enter space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Kelola Buku</h2>
          <p class="text-sm text-gray-500">Daftar koleksi buku perpustakaan.</p>
        </div>
        <button id="btn-add-book" class="bg-primary hover:bg-blue-900 text-white px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm">
          + Tambah Buku
        </button>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 text-gray-600 text-xs uppercase font-semibold border-b border-gray-100">
                <th class="p-4">Judul</th>
                <th class="p-4">Penulis</th>
                <th class="p-4">Kategori</th>
                <th class="p-4">Stok</th>
                <th class="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody id="books-tbody" class="divide-y divide-gray-100 text-sm text-gray-700">
              <tr><td colspan="5" class="p-6 text-center text-gray-400">Memuat data buku...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <div id="book-modal" class="fixed inset-0 bg-black/50 z-50 hidden flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
        <h3 id="modal-title" class="text-lg font-bold text-gray-800">Tambah Buku</h3>
        <form id="book-form" class="space-y-4">
          <input type="hidden" id="book-id">
          <div>
            <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Judul Buku</label>
            <input type="text" id="book-judul" required class="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Penulis</label>
            <input type="text" id="book-penulis" required class="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Kategori</label>
            <select id="book-category-id" required class="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm bg-white">
              <option value="">Pilih Kategori</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Tahun Terbit</label>
              <input type="number" id="book-tahun" required class="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm">
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Stok</label>
              <input type="number" id="book-stok" required class="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm">
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" id="modal-close" class="px-4 py-2 border rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Batal</button>
            <button type="submit" class="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-blue-900">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  `;

  const tbody = document.getElementById('books-tbody');
  const modal = document.getElementById('book-modal');
  const form = document.getElementById('book-form');
  const categorySelect = document.getElementById('book-category-id');

  let categoriesList = [];

  async function loadCategoriesDropdown() {
    try {
      const res = await categoriesApi.list();
      categoriesList = res.data || [];
      categorySelect.innerHTML = '<option value="">Pilih Kategori</option>' + 
        categoriesList.map(c => `<option value="${c.id}">${escapeHtml(c.nama)}</option>`).join('');
    } catch (e) {
      console.error(e);
    }
  }

  async function loadBooks() {
    try {
      const res = await booksApi.list();
      const books = res.data || [];
      if (books.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-gray-400">Belum ada data buku.</td></tr>`;
        return;
      }
      tbody.innerHTML = books.map(b => `
        <tr class="hover:bg-gray-50/50 transition">
          <td class="p-4 font-medium text-gray-800">${escapeHtml(b.judul)}</td>
          <td class="p-4">${escapeHtml(b.penulis)}</td>
          <td class="p-4">${escapeHtml(b.kategori_nama || b.category_name || '-')}</td>
          <td class="p-4">${b.stok}</td>
          <td class="p-4 text-right space-x-2">
            <button data-edit='${JSON.stringify(b)}' class="btn-edit text-blue-600 hover:underline font-medium text-xs">Edit</button>
            <button data-id="${b.id}" class="btn-delete text-red-600 hover:underline font-medium text-xs">Hapus</button>
          </td>
        </tr>
      `).join('');
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-red-500">Gagal memuat data.</td></tr>`;
    }
  }

  document.getElementById('btn-add-book').onclick = () => {
    form.reset();
    document.getElementById('book-id').value = '';
    document.getElementById('modal-title').textContent = 'Tambah Buku';
    modal.classList.remove('hidden');
  };

  document.getElementById('modal-close').onclick = () => modal.classList.add('hidden');

  tbody.onclick = async (e) => {
    if (e.target.classList.contains('btn-delete')) {
      const id = e.target.dataset.id;
      if (confirmAction('Yakin ingin menghapus buku ini?')) {
        try {
          await booksApi.destroy(id);
          showToast('Buku berhasil dihapus', 'success');
          loadBooks();
        } catch (err) {
          showToast(err.message, 'error');
        }
      }
    }
    if (e.target.classList.contains('btn-edit')) {
      const b = JSON.parse(e.target.dataset.edit);
      document.getElementById('book-id').value = b.id;
      document.getElementById('book-judul').value = b.judul;
      document.getElementById('book-penulis').value = b.penulis;
      document.getElementById('book-category-id').value = b.category_id || b.kategori_id || '';
      document.getElementById('book-tahun').value = b.tahun_terbit || b.tahun || '';
      document.getElementById('book-stok').value = b.stok;
      document.getElementById('modal-title').textContent = 'Edit Buku';
      modal.classList.remove('hidden');
    }
  };

  form.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('book-id').value;
    const data = {
      judul: document.getElementById('book-judul').value,
      penulis: document.getElementById('book-penulis').value,
      category_id: document.getElementById('book-category-id').value,
      tahun_terbit: parseInt(document.getElementById('book-tahun').value),
      stok: parseInt(document.getElementById('book-stok').value),
    };

    try {
      if (id) {
        await booksApi.update(id, data);
        showToast('Buku berhasil diperbarui', 'success');
      } else {
        await booksApi.create(data);
        showToast('Buku berhasil ditambahkan', 'success');
      }
      modal.classList.add('hidden');
      loadBooks();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  await loadCategoriesDropdown();
  await loadBooks();
}