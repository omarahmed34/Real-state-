import { state } from './state.js';
import { showToast } from './utils.js';
import { t } from './i18n.js';

export function renderMap() {
  const container = document.createElement('div');
  container.className = 'map-page-container';
  
  const user = state.getCurrentUser();
  const isAdminOrOwner = user && (user.role === 'admin' || user.role === 'owner');

  container.innerHTML = `
    <div class="map-main-area">
      <div class="map-header">
        <div><h1 class="page-title">MapCom Map System</h1><p class="text-muted">Interactive Property Management</p></div>
        <div class="map-actions">
          <button class="btn btn-outline" id="btn-back"><i class="fa-solid fa-arrow-left"></i> Back</button>
          ${isAdminOrOwner ? `<button class="btn btn-primary" id="btn-add-property"><i class="fa-solid fa-plus"></i> Draw Property</button>` : ''}
        </div>
      </div>

      <div class="map-controls-modern">
        <div class="search-box"><i class="fa-solid fa-search"></i><input type="text" id="map-search" placeholder="Search buildings, owners..."></div>
        <div class="filter-box"><i class="fa-solid fa-vector-square"></i><input type="number" id="map-filter-area" placeholder="Min Area (m²)"></div>
        <div class="filter-box">
          <i class="fa-solid fa-filter"></i>
          <select id="map-filter-type">
            <option value="all">All Types (الكل)</option>
            <option value="Building">Building (عمارة)</option>
            <option value="Villa">Villa (فيلا)</option>
            <option value="Apartment">Apartment (شقة)</option>
            <option value="Office">Office (مكتب)</option>
            <option value="Shop">Shop (محل)</option>
            <option value="Property">Property (عقار)</option>
          </select>
        </div>
      </div>
      <div class="map-wrapper"><div id="wecomm-map" class="interactive-map"></div></div>
    </div>

    <div class="map-sidebar hidden" id="property-sidebar">
      <div class="sidebar-header"><h2>Property Info</h2><button class="btn-close" id="btn-close-sidebar"><i class="fa-solid fa-times"></i></button></div>
      <form id="property-form" class="sidebar-body">
        <input type="hidden" id="prop-id"><input type="hidden" id="prop-polygon"><input type="hidden" id="prop-centroid">
        <div class="form-group">
          <label>Category</label>
          <select id="prop-category-selector-select" class="form-input" style="font-size: 0.9rem; padding: 0.8rem;">
            <option value="Building">Building (عمارة)</option>
            <option value="Villa">Villa (فيلا)</option>
            <option value="Apartment">Apartment (شقة)</option>
            <option value="Office">Office (مكتب)</option>
            <option value="Shop">Shop (محل)</option>
            <option value="Property">Property (عقار)</option>
          </select>
          <input type="hidden" id="prop-type" value="Building">
        </div>
        <div class="form-group"><label>Property Name</label><input type="text" id="prop-title" class="form-input" required></div>
        <div class="form-group"><label>Location</label><input type="text" id="prop-location" class="form-input" placeholder="e.g. New Cairo" required></div>
        <div class="unit-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
          <div class="form-group"><label>Area (m²)</label><input type="number" id="prop-building-area" class="form-input" required></div>
          <div class="form-group"><label>Total Price (EGP)</label><input type="number" id="prop-price-meter" class="form-input" required></div>
        </div>
        <div class="unit-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
          <div class="form-group"><label>Owner Name</label><input type="text" id="prop-owner" class="form-input"></div>
          <div class="form-group"><label>Owner Phone</label><input type="tel" id="prop-owner-phone" class="form-input"></div>
        </div>
        <div class="form-group"><label>Google Drive Link</label><input type="url" id="prop-drive" class="form-input" placeholder="https://drive.google.com/..."></div>
        <div class="form-group">
          <label>Photos</label>
          <input type="file" id="prop-image-input" class="form-input" accept="image/*" multiple style="padding: 0.5rem;">
          <div id="prop-img-preview" style="display:flex; gap:0.5rem; margin-top:0.5rem; flex-wrap:wrap;"></div>
          <input type="hidden" id="prop-images-data">
        </div>

        <!-- Sub-units section -->
        <div id="sub-units-section" style="margin-top: 1.5rem; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 10px; border: 1px dashed rgba(255,255,255,0.1);">
          <h4 style="margin: 0 0 1rem 0; font-size: 0.9rem; color: var(--color-primary);">Units / Offices (Optional)</h4>
          <div id="units-list" style="display: flex; flex-direction: column; gap: 0.75rem;"></div>
          <button type="button" id="btn-add-unit" class="btn btn-outline w-100" style="margin-top: 1rem; font-size: 0.8rem; padding: 0.5rem;">
            <i class="fa-solid fa-plus-circle"></i> Add Office/Unit
          </button>
        </div>

        <button type="submit" class="btn btn-primary w-100" style="padding:1rem; font-weight:700; margin-top:1.5rem;">SAVE TO PROPERTIES</button>
      </form>
    </div>
  `;

  setTimeout(() => initMap(container), 0);
  return container;
}

function initMap(container) {
  const mapEl = container.querySelector('#wecomm-map');
  if (!mapEl) return;
  const map = L.map(mapEl, { center: [30.0131, 31.4243], zoom: 13 });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  
  const drawLayer = new L.FeatureGroup().addTo(map);
  const savedLayer = new L.FeatureGroup().addTo(map);
  const user = state.getCurrentUser();
  const isAdminOrOwner = user && (user.role === 'admin' || user.role === 'owner');

  if (isAdminOrOwner && typeof L.Control.Draw !== 'undefined') {
    try {
      new L.Control.Draw({
        edit: { featureGroup: drawLayer, remove: true },
        draw: { polygon: { shapeOptions: { color: '#d4af37' } }, polyline: false, circle: false, rectangle: false, circlemarker: false, marker: false }
      }).addTo(map);
    } catch (e) {
      console.warn("Leaflet.Draw control init failed:", e);
    }
  }

  const renderSavedProperties = () => {
    savedLayer.clearLayers();
    const properties = state.get('mapLocations') || [];
    const search = container.querySelector('#map-search').value.toLowerCase();
    const typeFilter = container.querySelector('#map-filter-type').value;

    properties.forEach(p => {
      if (!p) return;
      if (typeFilter !== 'all' && p.type !== typeFilter) return;
      if (search && !(p.title||'').toLowerCase().includes(search) && !(p.owner||'').toLowerCase().includes(search)) return;
      if (p.parent_building_id) return; // Hide units from global map view

      const isSold = p.status === 'sold';
      const color = isSold ? '#333' : '#d4af37';
      
      if (p.polygon && Array.isArray(p.polygon) && p.polygon.length > 0) {
        try {
           L.polygon(p.polygon, { color, fillOpacity: isSold?0.5:0.3, weight: 2 }).addTo(savedLayer);
        } catch (e) { console.error("Error rendering polygon for property:", p.id); }
      }
      
      if (p.centroid) {
        const marker = L.marker([p.centroid.lat, p.centroid.lng], {
          icon: L.divIcon({
            className: 'custom-marker',
            html: `<div style="background:${isSold?'#000':'#d4af37'}; width:30px; height:30px; border-radius:50%; border:2px solid white; display:flex; align-items:center; justify-content:center; color:white;"><i class="fa-solid fa-building"></i></div>`,
            iconSize: [30, 30], iconAnchor: [15, 15]
          })
        }).addTo(savedLayer);

        const creator = (state.get('users') || []).find(u => u.id === p.createdBy);
        
        marker.bindPopup(`
          <div class="map-popup" style="min-width:260px; padding:0; overflow:hidden; border-radius:12px;">
            ${p.images && p.images[0] ? `<img src="${p.images[0]}" style="width:100%; height:140px; object-fit:cover; display:block;">` : ''}
            <div style="padding:15px;">
              ${isSold ? `<div style="background:black; color:white; text-align:center; padding:4px; margin-bottom:8px; border-radius:4px; font-weight:700; font-size:0.7rem;">SOLD</div>` : ''}
              <h3 style="margin:0 0 5px 0; font-size:1.1rem;">${p.title}</h3>
              <p style="font-size:0.75rem; color:#888; margin-bottom:10px;">Added by: ${creator ? creator.name : 'System Admin'}</p>
              <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px; font-size:0.85rem; margin-bottom:15px;">
                <div style="margin-bottom:4px;"><i class="fa-solid fa-user" style="color:var(--color-primary); width:15px;"></i> Owner: ${p.owner || 'N/A'}</div>
                <div style="margin-bottom:4px;"><i class="fa-solid fa-phone" style="color:var(--color-primary); width:15px;"></i> Phone: ${p.ownerPhone || 'N/A'}</div>
                <div><i class="fa-solid fa-vector-square" style="color:var(--color-primary); width:15px;"></i> Area: ${p.buildingArea || p.area}m²</div>
              </div>
              
              ${(() => {
                const units = (state.get('properties') || []).filter(u => u.parent_building_id == p.id);
                if (units.length === 0) return '';
                return `
                  <div style="margin-bottom:15px;">
                    <p style="font-size:0.75rem; font-weight:700; color:var(--color-primary); margin-bottom:5px; text-transform:uppercase;">Units inside this building:</p>
                    <div style="max-height:100px; overflow-y:auto; display:flex; flex-direction:column; gap:4px; padding-right:5px;">
                      ${units.map(u => `
                        <a href="#/property/${u.id}" style="display:flex; justify-content:space-between; padding:6px 10px; background:rgba(212,175,55,0.1); border-radius:6px; font-size:0.8rem; text-decoration:none; color:white;">
                          <span>${u.title.split(' - ')[1] || u.title}</span>
                          <span style="opacity:0.7;">${u.area}m²</span>
                        </a>
                      `).join('')}
                    </div>
                  </div>
                `;
              })()}
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                ${isAdminOrOwner ? `<button class="btn btn-primary btn-pop-edit" style="padding:0.5rem; font-size:0.8rem;">Edit</button>` : ''}
                <button class="btn btn-outline btn-pop-view" style="padding:0.5rem; font-size:0.8rem;">View Details</button>
              </div>
              ${isAdminOrOwner ? `
                <button class="btn btn-outline btn-pop-sold-toggle" style="width:100%; margin-top:10px; border-color:${isSold?'var(--color-primary)':'#e74c3c'}; color:${isSold?'var(--color-primary)':'#e74c3c'}; font-size:0.8rem;">
                  ${isSold ? '<i class="fa-solid fa-rotate-left"></i> Make Available' : '<i class="fa-solid fa-check-double"></i> Mark as Sold'}
                </button>
              ` : ''}
            </div>
          </div>
        `);

        marker.on('popupopen', () => {
          const pop = marker.getPopup().getElement();
          if (pop.querySelector('.btn-pop-edit')) {
            pop.querySelector('.btn-pop-edit').onclick = () => { marker.closePopup(); openEditSidebar(p); };
          }
          pop.querySelector('.btn-pop-view').onclick = () => window.location.hash = `/property/${p.id}`;
          
          if (pop.querySelector('.btn-pop-sold-toggle')) {
            pop.querySelector('.btn-pop-sold-toggle').onclick = () => {
              const all = state.get('mapLocations') || [];
              const idx = all.findIndex(x => x.id === p.id);
              if (idx !== -1) {
                const nextStatus = all[idx].status === 'sold' ? 'available' : 'sold';
                all[idx].status = nextStatus;
                state.set('mapLocations', all);
                
                // Also sync to main properties
                let props = state.get('properties') || [];
                const pIdx = props.findIndex(x => x.id === p.id);
                if (pIdx !== -1) { props[pIdx].status = nextStatus; state.set('properties', props); }
                
                renderSavedProperties();
              }
            };
          }
        });
      }
    });
  };

  const sidebar = container.querySelector('#property-sidebar');
  const openEditSidebar = (p) => {
    container.querySelector('#prop-id').value = p.id;
    container.querySelector('#prop-polygon').value = JSON.stringify(p.polygon);
    container.querySelector('#prop-centroid').value = JSON.stringify(p.centroid);
    container.querySelector('#prop-title').value = p.title;
    container.querySelector('#prop-location').value = p.location || '';
    container.querySelector('#prop-owner').value = p.owner || '';
    container.querySelector('#prop-owner-phone').value = p.ownerPhone || '';
    container.querySelector('#prop-building-area').value = p.buildingArea || p.area || '';
    container.querySelector('#prop-price-meter').value = p.pricePerMeter || '';
    container.querySelector('#prop-drive').value = p.driveLink || '';
    container.querySelector('#prop-images-data').value = JSON.stringify(p.images || []);
    
    // Refresh preview
    const preview = container.querySelector('#prop-img-preview');
    preview.innerHTML = (p.images || []).map(img => `<img src="${img}" style="width:50px; height:50px; border-radius:5px; object-fit:cover;">`).join('');
    
    sidebar.classList.remove('hidden');
  };

  map.on(L.Draw.Event.CREATED, (e) => {
    drawLayer.clearLayers(); drawLayer.addLayer(e.layer);
    container.querySelector('#property-form').reset(); container.querySelector('#prop-id').value = '';
    container.querySelector('#prop-polygon').value = JSON.stringify(e.layer.getLatLngs()[0].map(l => [l.lat, l.lng]));
    container.querySelector('#prop-centroid').value = JSON.stringify(e.layer.getBounds().getCenter());
    container.querySelector('#prop-images-data').value = '[]';
    container.querySelector('#prop-img-preview').innerHTML = '';
    sidebar.classList.remove('hidden');
  });

  // Handle Image Upload
  container.querySelector('#prop-image-input').onchange = (e) => {
    const files = Array.from(e.target.files);
    const preview = container.querySelector('#prop-img-preview');
    const imagesData = [];
    preview.innerHTML = '';
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        imagesData.push(ev.target.result);
        container.querySelector('#prop-images-data').value = JSON.stringify(imagesData);
        preview.innerHTML += `<img src="${ev.target.result}" style="width:50px; height:50px; border-radius:5px; object-fit:cover;">`;
      };
      reader.readAsDataURL(file);
    });
  };

  container.querySelector('#property-form').onsubmit = async (e) => {
    e.preventDefault();
    const idInput = container.querySelector('#prop-id').value;
    const area = parseFloat(container.querySelector('#prop-building-area').value) || 0;
    const pricePerMeter = parseFloat(container.querySelector('#prop-price-meter').value) || 0;
    const images = JSON.parse(container.querySelector('#prop-images-data').value || '[]');
    
    const data = {
      polygon: JSON.parse(container.querySelector('#prop-polygon').value),
      centroid: JSON.parse(container.querySelector('#prop-centroid').value),
      title: container.querySelector('#prop-title').value, 
      location: container.querySelector('#prop-location').value,
      owner: container.querySelector('#prop-owner').value,
      ownerPhone: container.querySelector('#prop-owner-phone').value,
      type: container.querySelector('#prop-type').value, 
      buildingArea: area,
      pricePerMeter: area > 0 ? pricePerMeter / area : 0,
      totalprice: pricePerMeter,
      driveLink: container.querySelector('#prop-drive').value,
      images: images,
      createdBy: user.id, status: 'available'
    };
    
    if (idInput) data.id = parseInt(idInput);

    // Save main property
    const result = await state.saveData('properties', data);
    
    if (result.status === 'success') {
      // --- Handling Sub-units ---
      const unitItems = container.querySelectorAll('.unit-item');
      for (const item of unitItems) {
        const uName = item.querySelector('.u-name').value;
        const uType = item.querySelector('.u-type').value;
        const uArea = parseFloat(item.querySelector('.u-area').value) || 0;
        const uPrice = parseFloat(item.querySelector('.u-price').value) || 0;
        const uImage = item.querySelector('.u-img-data').value;
        
        if (uName) {
          const su = {
            title: `${data.title} - ${uName}`,
            location: data.location,
            owner: data.owner,
            ownerPhone: data.ownerPhone,
            type: uType,
            area: uArea,
            buildingArea: uArea,
            pricePerMeter: uArea > 0 ? uPrice / uArea : 0,
            totalprice: uPrice,
            images: uImage ? [uImage] : [],
            polygon: data.polygon,
            centroid: data.centroid,
            createdBy: user.id,
            status: 'available',
            parent_building_id: result.data || data.id // Use returned ID if available
          };
          await state.saveData('properties', su);
        }
      }
      
      sidebar.classList.add('hidden'); 
      renderSavedProperties();
      showToast('Asset and units saved successfully!', 'success');
    } else {
      showToast('Error saving asset: ' + result.message, 'error');
    }
  };

  // Unit logic
  const unitsList = container.querySelector('#units-list');
  container.querySelector('#btn-add-unit').onclick = () => {
    const unitDiv = document.createElement('div');
    unitDiv.className = 'unit-item';
    unitDiv.style = 'background: rgba(255,255,255,0.05); padding: 0.75rem; border-radius: 8px; position: relative;';
    unitDiv.innerHTML = `
      <button type="button" class="btn-remove-unit" style="position:absolute; top:5px; right:5px; background:none; border:none; color:#e74c3c; cursor:pointer;"><i class="fa-solid fa-circle-xmark"></i></button>
      <div class="form-group" style="margin-bottom:0.5rem;"><input type="text" class="form-input u-name" placeholder="Unit Name (e.g. 101)" required style="font-size:0.8rem; padding: 0.5rem;"></div>
      <div class="form-group" style="margin-bottom:0.5rem;">
        <select class="form-input u-type" style="font-size:0.8rem; padding: 0.5rem;">
          <option value="Office">Office (مكتب)</option>
          <option value="Apartment">Apartment (شقة)</option>
          <option value="Shop">Shop (محل)</option>
          <option value="Villa">Villa (فيلا)</option>
          <option value="Building">Building (عمارة)</option>
        </select>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
        <input type="number" class="form-input u-area" placeholder="Area m²" style="font-size:0.8rem; padding: 0.5rem;">
        <input type="number" class="form-input u-price" placeholder="Total Price" style="font-size:0.8rem; padding: 0.5rem;">
      </div>
      <div style="margin-top:0.5rem; display:flex; align-items:center; gap:0.5rem;">
        <input type="file" class="u-img-input" accept="image/*" style="font-size:0.7rem; width:120px; color: var(--color-text-muted);">
        <div class="u-preview" style="width:30px; height:30px; border-radius:4px; background:#222; overflow:hidden;"></div>
        <input type="hidden" class="u-img-data">
      </div>
    `;
    
    unitDiv.querySelector('.btn-remove-unit').onclick = () => unitDiv.remove();
    
    unitDiv.querySelector('.u-img-input').onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          unitDiv.querySelector('.u-img-data').value = ev.target.result;
          unitDiv.querySelector('.u-preview').innerHTML = `<img src="${ev.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
        };
        reader.readAsDataURL(file);
      }
    };

    unitsList.appendChild(unitDiv);
  };

  container.querySelector('#btn-close-sidebar').onclick = () => sidebar.classList.add('hidden');
  container.querySelector('#btn-back').onclick = () => window.location.hash = '/properties';
  
  const addPropBtn = container.querySelector('#btn-add-property');
  if (addPropBtn) {
    addPropBtn.onclick = () => {
      // Trigger Leaflet Draw Polygon tool programmatically
      const polyDrawer = new L.Draw.Polygon(map, { shapeOptions: { color: '#d4af37' } });
      polyDrawer.enable();
      showToast('Click on map to start drawing the property area', 'info');
    };
  }
  
  container.querySelector('#prop-category-selector-select').onchange = (e) => {
    container.querySelector('#prop-type').value = e.target.value;
  };

  renderSavedProperties();
}
