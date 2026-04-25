import { state } from './state.js';
import { t } from './i18n.js';

export function renderFiles() {
  const container = document.createElement('div');
  container.className = 'container';

  const user = state.getCurrentUser();
  const isOwner = user && user.role === 'owner';
  const isAdmin = user && user.role === 'admin';
  const isAdminOrOwner = isOwner || isAdmin;

  function renderHeader() {
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <div>
          <h1 style="font-size: 2rem; color: var(--color-text);">Shared Materials</h1>
          <p style="color: var(--color-text-muted);">Shared documents and company resources</p>
        </div>
        ${isAdminOrOwner ? `
          <button id="btn-open-upload" class="btn btn-primary">
            <i class="fa-solid fa-cloud-arrow-up"></i> Upload Material
          </button>
        ` : ''}
      </div>

      <div id="upload-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 2000; align-items: center; justify-content: center; backdrop-filter: blur(5px);">
        <div class="card" style="width: 90%; max-width: 450px; padding: 2rem;">
          <h2 style="margin-bottom: 1.5rem;">Upload File</h2>
          <form id="upload-form">
            <div class="form-group"><label>Title</label><input type="text" id="file-name" class="form-input" required placeholder="e.g. Sales Report"></div>
            <div class="form-group"><label>File</label><input type="file" id="file-input" class="form-input" required></div>
            <div style="display:flex; gap:1rem; margin-top:1.5rem;">
              <button type="submit" class="btn btn-primary" style="flex:1;">Upload</button>
              <button type="button" id="btn-close-upload" class="btn btn-outline" style="flex:1;">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  function renderFileList() {
    const files = state.get('files') || [];

    if (files.length === 0) {
      return `<div style="text-align:center; padding:5rem; color:var(--color-text-muted);"><i class="fa-solid fa-folder-open" style="font-size:3rem; opacity:0.3; margin-bottom:1rem; display:block;"></i>No files yet.</div>`;
    }

    return `
      <div class="grid-3" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:1.5rem;">
        ${files.map(f => {
      const isExcel = f.type.includes('excel') || f.type.includes('spreadsheet') || f.name.endsWith('.xlsx');
      const isPdf = f.type.includes('pdf');
      const icon = isPdf ? 'fa-file-pdf' : (isExcel ? 'fa-file-excel' : 'fa-file-lines');
      const iconColor = isPdf ? '#e74c3c' : (isExcel ? '#27ae60' : 'var(--color-primary)');

      // Deletion rules: Owner can delete anything. Admin can delete anything EXCEPT Owner's files.
      const canDelete = isOwner || (isAdmin && f.uploadedByRole !== 'owner');

      return `
          <div class="card" style="padding:1.5rem; display:flex; flex-direction:column; gap:1rem;">
            <div style="display:flex; align-items:center; gap:1rem;">
              <div style="width:50px; height:50px; border-radius:10px; background:rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center; color:${iconColor}; font-size:1.5rem;"><i class="fa-solid ${icon}"></i></div>
              <div style="overflow:hidden;">
                <h3 style="font-size:1.1rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${f.name}</h3>
                <span style="font-size:0.75rem; color:var(--color-text-muted);">${f.size} | By: ${f.uploadedByName || 'System'}</span>
              </div>
            </div>
            <div style="display:flex; gap:0.5rem; margin-top:auto;">
              <button class="btn btn-primary btn-download" data-id="${f.id}" style="flex:1; font-size:0.8rem;"><i class="fa-solid fa-download"></i> Download</button>
              ${canDelete ? `<button class="btn btn-outline btn-delete-file" data-id="${f.id}" style="color:#e74c3c; border-color:#e74c3c; padding:0.6rem;"><i class="fa-solid fa-trash"></i></button>` : ''}
            </div>
          </div>`;
    }).join('')}
      </div>
    `;
  }

  function updateView() {
    container.innerHTML = renderHeader() + renderFileList();
    attachEvents();
  }

  function attachEvents() {
    const modal = container.querySelector('#upload-modal');
    if (isAdminOrOwner) {
      container.querySelector('#btn-open-upload').onclick = () => modal.style.display = 'flex';
      container.querySelector('#btn-close-upload').onclick = () => modal.style.display = 'none';

      container.querySelector('#upload-form').onsubmit = async (e) => {
        e.preventDefault();
        const nameInput = container.querySelector('#file-name');
        const fileInput = container.querySelector('#file-input');
        const file = fileInput.files[0];

        if (file) {
          const reader = new FileReader();
          reader.onload = async (v) => {
            const fileData = {
              name: nameInput.value || file.name,
              originalName: file.name,
              type: file.type,
              size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
              date: new Date().toISOString().split('T')[0],
              content: v.target.result,
              uploadedById: user.id,
              uploadedByName: user.name,
              uploadedByRole: user.role
            };

            await state.saveData('files', fileData);
            modal.style.display = 'none';
            updateView();
          };
          reader.readAsDataURL(file);
        }
      };
    }

    container.querySelectorAll('.btn-download').forEach(btn => {
      btn.onclick = (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        const f = (state.get('files') || []).find(x => x.id === id);
        if (f) {
          const a = document.createElement('a');
          a.href = f.content || f.url;
          a.download = f.originalName || f.name;
          a.click();
        }
      };
    });

    container.querySelectorAll('.btn-delete-file').forEach(btn => {
      btn.onclick = async (e) => {
        if (confirm('Delete file permanently?')) {
          const id = parseInt(e.currentTarget.dataset.id);
          await state.deleteData('files', id);
          updateView();
        }
      };
    });

  }

  updateView();
  return container;
}
