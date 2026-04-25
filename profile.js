import { state } from './state.js';
import { t } from './i18n.js';
import { showToast } from './utils.js';

export function renderProfile() {
  const container = document.createElement('div');
  container.className = 'profile-container fade-in';
  const user = state.getCurrentUser();

  if (!user) return container;

  container.innerHTML = `
    <!-- Top Decorative Aura -->
    <div style="position: fixed; top: -10%; left: 50%; transform: translateX(-50%); width: 80%; height: 40%; background: radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%); pointer-events: none; z-index: 0;"></div>

    <div class="page-header" style="text-align: center; margin-top: 4rem; position: relative; z-index:1;">
      <h1 style="font-family: 'Playfair Display', serif; font-size: 4.5rem; font-weight: 900; letter-spacing: -2px; margin-bottom: 0;">Identity</h1>
      <div style="width: 60px; height: 3px; background: var(--color-primary); margin: 15px auto; border-radius: 10px;"></div>
      <p style="color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 5px; font-size: 0.7rem; opacity: 0.8;">Command & Control Matrix</p>
    </div>

    <div class="card" style="max-width: 850px; margin: 4rem auto; padding: 5rem 4rem; border-radius: 40px; background: rgba(10, 17, 32, 0.7); backdrop-filter: blur(30px); border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 40px 100px rgba(0,0,0,0.8); position: relative;">
      
      <div class="profile-avatar-section" style="margin-bottom: 5rem; text-align: center;">
        <div style="position: relative; display: inline-block;">
            <div id="avatar-preview-container" class="profile-avatar-display" style="width: 160px; height: 160px; font-size: 4.5rem; background: #000; border: 4px solid var(--color-primary); box-shadow: 0 0 50px rgba(212, 175, 55, 0.3); position: relative; z-index: 2; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center;">
              ${user.profilePic ? `<img src="${user.profilePic}" style="width:100%; height:100%; object-fit:cover;">` : (user.name || 'U')[0].toUpperCase()}
            </div>
            
            <!-- Camera Upload Action -->
            <label for="avatar-input" style="position: absolute; bottom: 5px; right: 5px; width: 45px; height: 45px; background: var(--color-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; border: 4px solid #0a1120; transition: all 0.3s ease; box-shadow: 0 5px 15px rgba(0,0,0,0.5);">
              <i class="fa-solid fa-camera" style="color: #000; font-size: 1.1rem;"></i>
            </label>
            <input type="file" id="avatar-input" hidden accept="image/*">

            <!-- Decorative Ring -->
            <div style="position: absolute; top: -10px; left: -10px; right: -10px; bottom: -10px; border: 1px dashed rgba(212, 175, 55, 0.4); border-radius: 50%; animation: spin 20s linear infinite;"></div>
        </div>
        
        <h2 style="font-family: 'Playfair Display', serif; font-size: 2.8rem; color: #fff; margin-top: 2rem; margin-bottom: 0.5rem;">${user.name}</h2>
        <span style="font-size: 0.75rem; color: var(--color-primary); font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">Verified ${user.role} Level</span>
      </div>

      <form id="profile-form" style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem;">
        
        <div class="form-group" style="grid-column: span 2;">
          <label class="form-label" style="font-size: 0.7rem; color: var(--color-primary); margin-bottom: 12px; font-weight: 800; display: block; letter-spacing: 2px;">FULL NAME / SIGNATURE</label>
          <div style="position: relative;">
            <input type="text" id="prof-name" class="form-input" value="${user.name}" style="background: rgba(0,0,0,0.4); border-radius: 18px; padding: 1.5rem 1.5rem 1.5rem 60px; font-size: 1.1rem; border-color: rgba(255,255,255,0.05);" required>
            <i class="fa-solid fa-signature" style="position: absolute; left: 22px; top: 50%; transform: translateY(-50%); color: var(--color-primary); font-size: 1.2rem; opacity: 0.8;"></i>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" style="font-size: 0.7rem; color: rgba(255,255,255,0.4); margin-bottom: 12px; font-weight: 800; display: block; letter-spacing: 2px;">SECURE EMAIL</label>
          <div style="position: relative;">
            <input type="email" id="prof-email" class="form-input" value="${user.email}" readonly style="background: rgba(0,0,0,0.2); border-radius: 18px; padding: 1.5rem 1.5rem 1.5rem 60px; opacity: 0.5; border-style: dashed;">
            <i class="fa-solid fa-shield-halved" style="position: absolute; left: 22px; top: 50%; transform: translateY(-50%); color: var(--color-primary); font-size: 1.2rem; opacity: 0.6;"></i>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" style="font-size: 0.7rem; color: rgba(255,255,255,0.4); margin-bottom: 12px; font-weight: 800; display: block; letter-spacing: 2px;">MOBILE INTEL</label>
          <div style="position: relative;">
            <input type="text" id="prof-phone" class="form-input" value="${user.phone || ''}" placeholder="Contact Link" style="background: rgba(0,0,0,0.4); border-radius: 18px; padding: 1.5rem 1.5rem 1.5rem 60px;">
            <i class="fa-solid fa-satellite-dish" style="position: absolute; left: 22px; top: 50%; transform: translateY(-50%); color: var(--color-primary); font-size: 1.2rem; opacity: 0.8;"></i>
          </div>
        </div>

        <div class="form-group" style="grid-column: span 2;">
          <label class="form-label" style="font-size: 0.7rem; color: rgba(255,255,255,0.4); margin-bottom: 12px; font-weight: 800; display: block; letter-spacing: 2px;">AUTHENTICATION OVERRIDE</label>
          <div style="position: relative;">
            <input type="password" id="prof-pass" class="form-input" placeholder="Input new access key to overwrite..." style="background: rgba(0,0,0,0.4); border-radius: 18px; padding: 1.5rem 1.5rem 1.5rem 60px;">
            <i class="fa-solid fa-key" style="position: absolute; left: 22px; top: 50%; transform: translateY(-50%); color: var(--color-primary); font-size: 1.2rem; opacity: 0.8;"></i>
          </div>
        </div>

        <div style="grid-column: span 2; margin-top: 1rem;">
          <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1.8rem; border-radius: 20px; font-size: 1.1rem; letter-spacing: 5px; box-shadow: 0 20px 40px rgba(212, 175, 55, 0.2); position: relative; overflow: hidden; border: none;">
            <span style="position: relative; z-index: 2;">SYNCHRONIZE PROTOCOL</span>
            <div style="position: absolute; top:0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); animation: shine 3s infinite;"></div>
          </button>
        </div>
      </form>
    </div>

    <style>
      @keyframes spin { from {transform: rotate(0deg);} to {transform: rotate(360deg);} }
      @keyframes shine { 100% { left: 100%; } }
      .form-input:focus { transform: scale(1.01); border-color: var(--color-primary) !important; box-shadow: 0 0 20px rgba(212, 175, 55, 0.1) !important; }
      label[for="avatar-input"]:hover { transform: scale(1.1) rotate(15deg); background: #fff !important; }
    </style>
  `;

  // Image Upload Logic
  const avatarInput = container.querySelector('#avatar-input');
  const avatarPreview = container.querySelector('#avatar-preview-container');

  avatarInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        avatarPreview.innerHTML = `<img src="${event.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
        state.setSync('temp_avatar', event.target.result); // Save Base64 temporarily
      };
      reader.readAsDataURL(file);
    }
  });

  const form = container.querySelector('#profile-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = form.querySelector('button');
    const originalText = saveBtn.innerHTML;
    
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fa-solid fa-sync fa-spin"></i> SYNCHRONIZING...';

    const updatedData = {
      name: container.querySelector('#prof-name').value,
      phone: container.querySelector('#prof-phone').value,
      password: container.querySelector('#prof-pass').value || user.password,
      profilePic: state.getSync('temp_avatar') || user.profilePic
    };
    
    try {
      const result = await state.updateProfile(updatedData);
      if (result) {
        showToast('Matrix Synchronized Successfully', 'success');
        state.setSync('temp_avatar', null); // Clear temp
        setTimeout(() => window.location.reload(), 1000);
      } else {
        showToast('Synchronization Failed', 'error');
      }
    } catch (err) {
      showToast('System Error', 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = originalText;
    }
  });

  return container;
}
