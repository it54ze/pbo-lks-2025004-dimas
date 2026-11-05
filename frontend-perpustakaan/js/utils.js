export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str ?? '');
  return div.innerHTML;
}

export function formatDateTime(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };
  const toast = document.createElement('div');
  toast.className = `${colors[type] || colors.info} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 opacity-0 translate-y-2 max-w-sm font-medium`;
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('opacity-0', 'translate-y-2');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

export function confirmAction(message) {
  return window.confirm(message);
}