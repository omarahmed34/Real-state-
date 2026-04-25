import { state } from './state.js';
import { t } from './i18n.js';

export function renderPropertyDetails(params) {
  const container = document.createElement('div');
  container.className = 'container';
  
  const properties = state.get('properties') || [];
  const propertyId = parseInt(params.id);
  const property = properties.find(p => p.id === propertyId);
  const user = state.getCurrentUser();
  const isAdmin = user && user.role === 'admin';

  if (!property) {
    container.innerHTML = `
      <div style="text-align: center; padding: 5rem 0;">
        <h2>Property Not Found</h2>
        <button class="btn btn-primary" style="margin-top: 1rem;" id="btn-back">
          Back to Properties
        </button>
      </div>
    `;
    setTimeout(() => {
      container.querySelector('#btn-back')?.addEventListener('click', () => router.navigate('/properties'));
    }, 0);
    return container;
  }

  const imgs = property.images && property.images.length > 0 ? property.images : [property.image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'];
  // Robust Price Calculation
  const priceValue = parseFloat(property.price) || parseFloat(property.totalprice) || parseFloat(property.totalPrice) || 0;
  const totalPriceStr = priceValue.toLocaleString();
  const pricePerMeterStr = (parseFloat(property.price_per_meter) || parseFloat(property.pricePerMeter) || 0).toLocaleString();

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
      <button class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.9rem;" id="btn-back">
        <i class="fa-solid fa-arrow-left"></i> ${t('back')}
      </button>
      ${isAdmin ? `<button class="btn btn-primary" id="btn-edit-property"><i class="fa-solid fa-pen"></i> Edit Property</button>` : ''}
    </div>

    <div class="property-detail-header">
      <span class="badge" style="background: rgba(212, 175, 55, 0.1); color: var(--color-accent); margin-bottom: 1rem;">${property.type || 'Property'}</span>
      <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem;">${property.title || 'Untitled'}</h1>
      <p style="color: var(--color-text-muted); font-size: 1.1rem;"><i class="fa-solid fa-location-dot"></i> ${property.location || 'New Cairo'}</p>
    </div>

    <div class="image-slider card-slider" style="position: relative; height: 500px; border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 2rem;" data-current="0">
      ${imgs.map((img, i) => `<img src="${img}" alt="${property.title}" class="slide-img" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: ${i === 0 ? 1 : 0}; transition: opacity 0.3s ease;">`).join('')}
      ${imgs.length > 1 ? `
        <button class="slider-btn slider-prev" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; width: 3rem; height: 3rem; cursor: pointer; z-index: 10; font-size: 1.2rem;">&#10094;</button>
        <button class="slider-btn slider-next" style="position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; width: 3rem; height: 3rem; cursor: pointer; z-index: 10; font-size: 1.2rem;">&#10095;</button>
        <div style="position: absolute; bottom: 1rem; right: 1rem; background: rgba(0,0,0,0.5); color: #fff; padding: 0.5rem 1rem; border-radius: 999px; font-size: 0.8rem; backdrop-filter: blur(4px); z-index: 10;">
          <i class="fa-regular fa-images"></i> <span class="slide-indicator">1</span> / ${imgs.length}
        </div>
      ` : ''}
    </div>

    <div class="detail-grid" style="display:grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
      <!-- Main Content -->
      <div>
        <h3 style="margin-bottom: 1rem; font-size: 1.5rem;">Description</h3>
        <p style="color: var(--color-text-muted); line-height: 1.8; margin-bottom: 2rem;">
          ${property.description || `Experience unparalleled luxury with this exquisite property located in ${property.location || 'New Cairo'}. Modern architecture, premium finishes, and breathtaking views make this ${property.type || 'Property'} the perfect choice.`}
        </p>

        <h3 style="margin-bottom: 1rem; font-size: 1.5rem;">Amenities</h3>
        <div class="grid-2" style="gap: 1rem; display:grid; grid-template-columns: 1fr 1fr;">
          <div style="display: flex; align-items: center; gap: 0.75rem;"><i class="fa-solid fa-square-check" style="color: var(--color-accent);"></i> Premium Finishing</div>
          <div style="display: flex; align-items: center; gap: 0.75rem;"><i class="fa-solid fa-square-check" style="color: var(--color-accent);"></i> 24/7 Security</div>
          <div style="display: flex; align-items: center; gap: 0.75rem;"><i class="fa-solid fa-square-check" style="color: var(--color-accent);"></i> Smart Home System</div>
          <div style="display: flex; align-items: center; gap: 0.75rem;"><i class="fa-solid fa-square-check" style="color: var(--color-accent);"></i> Private Parking</div>
        </div>

        ${property.mapEmbed ? `
        <h3 style="margin-top: 3rem; margin-bottom: 1rem; font-size: 1.5rem;"><i class="fa-solid fa-map-location-dot" style="color: var(--color-accent);"></i> Location Map</h3>
        <div class="map-container" style="border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--color-border); height: 400px;">
          ${property.mapEmbed}
        </div>
        ` : ''}
      </div>

      <!-- Sidebar -->
      <div>
        <div class="card detail-sidebar" style="padding: 2rem; position: sticky; top: 2rem;">
          <div style="text-align: center; margin-bottom: 2rem;">
            <p style="color: var(--color-text-muted); font-size: 0.9rem;">Total Price</p>
            <h2 style="color: var(--color-accent); font-size: 2.25rem;">EGP ${totalPriceStr}</h2>
          </div>

          <div style="margin-bottom: 2rem;">
            <div style="display:flex; justify-content:space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--color-border);">
              <span style="color: var(--color-text-muted);">Price per m²</span>
              <span style="font-weight: 600;">EGP ${pricePerMeterStr}</span>
            </div>
            <div style="display:flex; justify-content:space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--color-border);">
              <span style="color: var(--color-text-muted);">Area</span>
              <span style="font-weight: 600;">${property.area || 0} m²</span>
            </div>
            <div style="display:flex; justify-content:space-between; padding: 0.75rem 0;">
              <span style="color: var(--color-text-muted);">Owner</span>
              <span style="font-weight: 600;">${property.owner || 'N/A'}</span>
            </div>
          </div>

          <button id="btn-download" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;">
            <i class="${property.driveLink ? 'fa-brands fa-google-drive' : 'fa-solid fa-cloud-arrow-down'}"></i> ${property.driveLink ? 'Open Drive Link' : 'Download Images'}
          </button>
          
          <button id="btn-contact-owner" class="btn btn-outline" style="width: 100%;">
            <i class="fa-solid fa-phone"></i> Contact Owner
          </button>
        </div>
      </div>
    </div>
    
    ${(() => {
      const units = properties.filter(u => u.parent_building_id == property.id);
      if (units.length === 0) return '';
      return `
        <div style="margin-top: 4rem;">
          <h2 style="margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem;">
            <i class="fa-solid fa-layer-group" style="color: var(--color-accent);"></i> Units in this Building
          </h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
            ${units.map(u => `
              <div class="card" style="padding: 1.5rem; display: flex; align-items: center; gap: 1.5rem; transition: transform 0.3s ease; cursor: pointer;" onclick="window.location.hash='/property/${u.id}'">
                <div style="width: 80px; height: 80px; border-radius: 12px; overflow: hidden; flex-shrink: 0;">
                  <img src="${u.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=200&q=80'}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 0.5rem 0;">${u.title.split(' - ')[1] || u.title}</h4>
                  <div style="display: flex; gap: 1rem; font-size: 0.85rem; color: var(--color-text-muted);">
                    <span><i class="fa-solid fa-vector-square"></i> ${u.area} m²</span>
                    <span><i class="fa-solid fa-tag"></i> EGP ${(parseFloat(u.price) || parseFloat(u.totalprice) || parseFloat(u.totalPrice) || 0).toLocaleString()}</span>
                  </div>
                </div>
                <i class="fa-solid fa-chevron-right" style="opacity: 0.3;"></i>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    })()}

    <!-- Edit Modal -->
    <div id="edit-property-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 2000; align-items: center; justify-content: center; backdrop-filter: blur(5px);">
      <div class="card" style="width: 90%; max-width: 600px; padding: 2rem; max-height: 90vh; overflow-y: auto;">
        <h2 style="margin-bottom: 1.5rem;">Edit Property</h2>
        <form id="edit-property-form">
          <div class="form-group"><label>Title</label><input type="text" id="edit-title" class="form-input" value="${property.title || ''}"></div>
          <div class="form-group"><label>Location</label><input type="text" id="edit-location" class="form-input" value="${property.location || ''}"></div>
          <div class="form-group"><label>Area (m²)</label><input type="number" id="edit-area" class="form-input" value="${property.area || 0}"></div>
          <div class="form-group"><label>Total Price (EGP)</label><input type="number" id="edit-price" class="form-input" value="${property.totalprice || property.price || 0}"></div>
          <div style="display:flex; gap:1rem; margin-top:2rem;">
            <button type="submit" class="btn btn-primary" style="flex:1;">Update Changes</button>
            <button type="button" id="btn-close-edit" class="btn btn-outline" style="flex:1;">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Attach Events
  container.querySelector('#btn-back').onclick = () => window.location.hash = '/properties';
  
  if (isAdmin) {
    const modal = container.querySelector('#edit-property-modal');
    container.querySelector('#btn-edit-property').onclick = () => modal.style.display = 'flex';
    container.querySelector('#btn-close-edit').onclick = () => modal.style.display = 'none';
    
    container.querySelector('#edit-property-form').onsubmit = async (e) => {
      e.preventDefault();
      const area = parseFloat(container.querySelector('#edit-area').value) || 0;
      const totalPrice = parseFloat(container.querySelector('#edit-price').value) || 0;

      const updatedData = {
        id: propertyId,
        title: container.querySelector('#edit-title').value,
        location: container.querySelector('#edit-location').value,
        area: area,
        pricePerMeter: area > 0 ? totalPrice / area : 0,
        totalprice: totalPrice
      };
      
      const result = await state.saveData('properties', updatedData);
      if (result.status === 'success') {
        showToast('Property updated!', 'success');
        modal.style.display = 'none';
        window.dispatchEvent(new Event('hashchange')); // Reload view
      } else {
        showToast('Error: ' + result.message, 'error');
      }
    };
  }

  container.querySelector('#btn-download').onclick = () => {
    if (property.driveLink) return window.open(property.driveLink, '_blank');
    imgs.forEach((src, i) => {
      const a = document.createElement('a'); a.href = src; a.download = `property-${i}.jpg`; a.click();
    });
  };

  const btnContact = container.querySelector('#btn-contact-owner');
  btnContact.onclick = () => {
    const phone = property.ownerPhone || 'No phone number';
    btnContact.innerHTML = `<i class="fa-solid fa-phone"></i> ${phone}`;
    if (property.ownerPhone) navigator.clipboard.writeText(property.ownerPhone).then(() => showToast('Copied!', 'success'));
  };

  // Slider Logic
  const slider = container.querySelector('.card-slider');
  if (slider && imgs.length > 1) {
    const prev = slider.querySelector('.slider-prev'), next = slider.querySelector('.slider-next');
    const indicator = slider.querySelector('.slide-indicator'), slideImgs = slider.querySelectorAll('.slide-img');
    const update = (idx) => { slideImgs.forEach(i => i.style.opacity = 0); slideImgs[idx].style.opacity = 1; indicator.textContent = idx+1; slider.dataset.current = idx; };
    prev.onclick = () => { let c = parseInt(slider.dataset.current); update((c-1+imgs.length)%imgs.length); };
    next.onclick = () => { let c = parseInt(slider.dataset.current); update((c+1)%imgs.length); };
  }

  return container;
}
