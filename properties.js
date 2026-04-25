import { state } from './state.js?v=1.1.2';
import { t } from './i18n.js';

export function renderProperties() {
  const container = document.createElement('div');
  container.className = 'container';
  
  const user = state.getCurrentUser();
  const isAdminOrOwner = user && (user.role === 'admin' || user.role === 'owner');
  let currentFilter = 'All';

  function renderHeader() {
    return `
      <div class="page-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1>${t('properties')}</h1>
          <p>Explore our premium real estate portfolio</p>
        </div>
        ${isAdminOrOwner ? `<button id="add-property-btn" class="btn btn-primary"><i class="fa-solid fa-plus-circle"></i> Add New Property</button>` : ''}
      </div>
      <div class="filters" id="property-filters">
        <input type="text" id="search-input" class="form-input" style="width: 250px;" placeholder="Search Properties...">
        <button class="filter-btn active" data-type="All">${t('all')}</button>
        <button class="filter-btn" data-type="Apartments">${t('apartments')}</button>
        <button class="filter-btn" data-type="Villas">${t('villas')}</button>
        <button class="filter-btn" data-type="Offices">${t('offices')}</button>
        <button class="filter-btn" data-type="Shops">${t('shops')}</button>
      </div>
      
      <div id="property-modal" class="modal-overlay" style="display: none;">
        <div class="card modal-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h2 id="modal-title" style="font-family:'Playfair Display'; font-size:1.8rem;">Property Details</h2>
            <button class="btn-icon" id="close-modal-btn"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <form id="property-form">
            <input type="hidden" id="p-id">
            <div class="form-group"><label class="form-label">Title</label><input type="text" id="p-title" class="form-input" required></div>
            <div class="grid-2">
              <div class="form-group"><label class="form-label">Type</label><select id="p-type" class="form-input"><option value="Apartments">Apartments</option><option value="Villas">Villas</option><option value="Offices">Offices</option><option value="Shops">Shops</option></select></div>
              <div class="form-group"><label class="form-label">Area (m²)</label><input type="number" id="p-area" class="form-input" required></div>
            </div>
            <div class="grid-2">
              <div class="form-group"><label class="form-label">Total Price (EGP)</label><input type="number" id="p-price" class="form-input" required></div>
              <div class="form-group"><label class="form-label">Owner</label><input type="text" id="p-owner" class="form-input" required></div>
            </div>
            <div class="form-group"><label class="form-label">Location</label><input type="text" id="p-location" class="form-input"></div>
            <div class="form-group"><label class="form-label">Maps Embed Code</label><textarea id="p-map" class="form-input" rows="2"></textarea></div>
            <div class="form-group"><label class="form-label">Property Images</label><input type="file" id="p-images" class="form-input" multiple accept="image/*"><div id="modal-image-preview" style="display:flex; gap:0.5rem; margin-top:10px;"></div></div>
            <button type="submit" class="btn btn-primary" style="width:100%; padding:1.2rem; margin-top:1rem;">PUBLISH PROPERTY</button>
          </form>
        </div>
      </div>
    `;
  }

  function renderGrid() {
    const all = state.get('properties') || [];
    const search = container.querySelector('#search-input')?.value.toLowerCase() || '';
    let filtered = all.filter(p => p && !p.parent_building_id && ((p.title||'').toLowerCase().includes(search) || (p.owner||'').toLowerCase().includes(search)) && (currentFilter === 'All' || p.type === currentFilter));
    
    return `
      <div class="grid-3">
        ${filtered.map(p => {
          const isSold = p.status === 'sold';
          // Robust Price Calculation
          const priceValue = parseFloat(p.price) || parseFloat(p.totalprice) || parseFloat(p.totalPrice) || 0;
          const total = priceValue.toLocaleString();
          return `
          <div class="card property-card" data-id="${p.id}" style="${isSold ? 'opacity:0.6; filter:grayscale(1);' : ''}">
            <img src="${p.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'}">
            <div class="property-info">
              <h3 class="property-title">${p.title}</h3>
              <p style="color:var(--color-text-muted); font-size:0.9rem; margin-bottom:1rem;"><i class="fa-solid fa-location-dot"></i> ${p.location || 'New Cairo'}</p>
              <div class="property-price">EGP ${total}</div>
              <div style="display:flex; gap:0.75rem;">
                <button class="btn btn-outline btn-view" style="flex:1;">View</button>
                ${isAdminOrOwner ? `
                  <button class="btn btn-outline btn-edit" style="width:50px; padding:0;"><i class="fa-solid fa-pen"></i></button>
                  <button class="btn btn-outline btn-delete" style="width:50px; padding:0; border-color:#e74c3c; color:#e74c3c;"><i class="fa-solid fa-trash"></i></button>
                ` : ''}
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>
    `;
  }

  function updateView() {
    container.innerHTML = renderHeader() + renderGrid();
    const modal = container.querySelector('#property-modal');
    const form = container.querySelector('#property-form');
    const imgPreview = container.querySelector('#modal-image-preview');

    container.querySelector('#search-input')?.addEventListener('input', () => {
      const grid = container.querySelector('.grid-3');
      if (grid) grid.outerHTML = renderGrid();
      attachGridEvents();
    });

    container.querySelectorAll('.filter-btn').forEach(btn => {
      btn.onclick = () => {
        container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.type;
        updateView();
      };
    });

    const addBtn = container.querySelector('#add-property-btn');
    if (addBtn) addBtn.onclick = () => {
      form.reset(); container.querySelector('#p-id').value = '';
      container.querySelector('#modal-title').textContent = 'Add New Property';
      imgPreview.innerHTML = ''; modal.style.display = 'flex';
    };
    const closeBtn = container.querySelector('#close-modal-btn');
    if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';

    form.onsubmit = async (e) => {
      e.preventDefault();
      const id = container.querySelector('#p-id').value;
      const area = parseFloat(container.querySelector('#p-area').value) || 0;
      const price = parseFloat(container.querySelector('#p-price').value) || 0;

      const data = {
        title: container.querySelector('#p-title').value,
        type: container.querySelector('#p-type').value,
        area, 
        pricePerMeter: area > 0 ? price / area : 0, 
        owner: container.querySelector('#p-owner').value,
        location: container.querySelector('#p-location').value, 
        mapEmbed: container.querySelector('#p-map').value,
        totalprice: price, 
        status: 'available', 
        createdBy: user ? user.id : 1
      };

      if (id) data.id = parseInt(id);

      const result = await state.saveData('properties', data);
      if (result.status === 'success') {
        modal.style.display = 'none'; 
        updateView();
      }
    };

    function attachGridEvents() {
      container.querySelectorAll('.btn-view').forEach(btn => btn.onclick = (e) => window.location.hash = `/property/${e.target.closest('.property-card').dataset.id}`);
      container.querySelectorAll('.btn-edit').forEach(btn => btn.onclick = (e) => {
        const id = parseInt(e.target.closest('.property-card').dataset.id);
        const p = (state.get('properties') || []).find(x => x.id === id);
        if (p) {
          container.querySelector('#modal-title').textContent = 'Edit Property';
          container.querySelector('#p-id').value = p.id;
          container.querySelector('#p-title').value = p.title;
          container.querySelector('#p-type').value = p.type;
          container.querySelector('#p-area').value = p.area;
          container.querySelector('#p-price').value = p.totalprice || p.price || 0;
          container.querySelector('#p-owner').value = p.owner;
          container.querySelector('#p-location').value = p.location || '';
          container.querySelector('#p-map').value = p.mapEmbed || '';
          imgPreview.innerHTML = (p.images || []).map(src => `<img src="${src}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;">`).join('');
          modal.style.display = 'flex';
        }
      });

      container.querySelectorAll('.btn-sold-toggle').forEach(btn => btn.onclick = async (e) => {
        const id = parseInt(e.target.closest('.property-card').dataset.id);
        const all = state.get('properties') || [];
        const p = all.find(x => x.id === id);
        if (p) {
          const nextStatus = p.status === 'sold' ? 'available' : 'sold';
          await state.saveData('properties', { ...p, status: nextStatus });
          updateView();
        }
      });

      container.querySelectorAll('.btn-delete').forEach(btn => btn.onclick = async (e) => {
        if (confirm('Delete property?')) {
          const id = parseInt(e.target.closest('.property-card').dataset.id);
          await state.deleteData('properties', id);
          updateView();
        }
      });

    }
    attachGridEvents();
  }

  updateView();
  return container;
}
