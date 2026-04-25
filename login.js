import { state } from './state.js';
import { showToast } from './utils.js';

export function renderLogin() {
  const container = document.createElement('div');
  container.className = 'login-page';

  container.innerHTML = `
    <!-- Luxury Background -->
    <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1;">
      <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80" style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.3) blur(5px);">
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(10,15,25,0.9) 0%, rgba(10,15,25,0.6) 100%);"></div>
    </div>

    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 2rem 0; position: relative; z-index: 1;">
      <div class="login-card" style="margin-bottom: auto; margin-top: auto; background: rgba(15, 20, 30, 0.6); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); border: 1px solid rgba(212,175,55,0.2); box-shadow: 0 25px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(212,175,55,0.05); border-radius: 24px; padding: 3rem 2.5rem; width: 100%; max-width: 450px; position: relative; overflow: hidden;">
        
        <!-- Decorative Glow -->
        <div style="position: absolute; top: -50px; left: -50px; width: 150px; height: 150px; background: rgba(212,175,55,0.2); filter: blur(50px); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -50px; right: -50px; width: 150px; height: 150px; background: rgba(212,175,55,0.1); filter: blur(50px); border-radius: 50%;"></div>

        <div class="login-header" style="text-align: center; position: relative; z-index: 2;">
          <div style="margin-bottom: 1.5rem; display: flex; flex-direction: column; align-items: center; width: 100%;">
            <svg width="250" height="130" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 0 10px rgba(212,175,55,0.3));">
              <defs>
                <linearGradient id="metalGradLogin" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
                  <stop offset="50%" style="stop-color:#d4af37;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#aa8a29;stop-opacity:1" />
                </linearGradient>
              </defs>
              <g>
                <text x="135" y="100" text-anchor="middle" style="font: bold 90px sans-serif; fill: url(#metalGradLogin);">C</text>
                <path transform="translate(165, 20) scale(0.95)" d="M35 5 C15 5 0 20 0 35 C0 60 35 90 35 90 C35 90 70 60 70 35 C70 20 55 5 35 5 ZM 35 50 C27 50 20 43 20 35 C20 27 27 20 35 20 C43 20 50 27 50 35 C50 43 43 50 35 50 Z" fill="url(#metalGradLogin)"/>
                <text x="265" y="100" text-anchor="middle" style="font: bold 90px sans-serif; fill: url(#metalGradLogin);">M</text>
                <text x="200" y="150" text-anchor="middle" style="font: 800 15px serif; fill: #ffffff; letter-spacing: 3px; text-transform: uppercase;">Commercial Real Estate</text>
              </g>
            </svg>
          </div>
          <h2 style="font-family: 'Playfair Display', serif; font-size: 1.8rem; margin-bottom: 0.5rem; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">Welcome Back</h2>
          <p style="opacity: 0.6; font-size: 0.95rem; margin-bottom: 2rem;">Authenticate to access the command center</p>
        </div>
        
        <form id="login-form" style="position: relative; z-index: 2;">
          <div class="form-group" style="margin-bottom: 1.5rem;">
            <label class="form-label" style="font-size: 0.8rem; letter-spacing: 1px; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 8px; display: block;">Email Address</label>
            <div style="position: relative;">
              <i class="fa-solid fa-envelope" style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: var(--color-primary); opacity: 0.7;"></i>
              <input type="email" id="email" class="form-input" required placeholder="name@company.com" style="background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); padding-left: 45px; height: 50px; font-size: 1rem; border-radius: 12px; transition: all 0.3s ease;" onfocus="this.style.borderColor='var(--color-primary)'; this.style.background='rgba(0,0,0,0.4)';" onblur="this.style.borderColor='rgba(255,255,255,0.1)'; this.style.background='rgba(0,0,0,0.2)';">
            </div>
          </div>
          
          <div class="form-group" style="margin-bottom: 2.5rem;">
            <label class="form-label" style="font-size: 0.8rem; letter-spacing: 1px; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 8px; display: block;">Access Password</label>
            <div style="position: relative;">
              <i class="fa-solid fa-lock" style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: var(--color-primary); opacity: 0.7;"></i>
              <input type="password" id="password" class="form-input" required placeholder="Enter secure password" style="background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); padding-left: 45px; height: 50px; font-size: 1rem; border-radius: 12px; transition: all 0.3s ease;" onfocus="this.style.borderColor='var(--color-primary)'; this.style.background='rgba(0,0,0,0.4)';" onblur="this.style.borderColor='rgba(255,255,255,0.1)'; this.style.background='rgba(0,0,0,0.2)';">
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary" style="width: 100%; height: 55px; font-size: 1.1rem; font-weight: 800; letter-spacing: 2px; border-radius: 12px; box-shadow: 0 10px 20px rgba(212,175,55,0.2); display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 15px 25px rgba(212,175,55,0.3)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 20px rgba(212,175,55,0.2)';">
            AUTHORIZE <i class="fa-solid fa-arrow-right-to-bracket"></i>
          </button>
        </form>
      </div>

      <div class="login-page-footer" style="width: 100%; text-align: center; color: rgba(255,255,255,0.4); font-size: 0.85rem; padding: 2rem 20px 1rem; position: relative; z-index: 1;">
        <p style="margin-bottom: 0.5rem;">&copy; 2024 Commercial Real Estate. All Rights Reserved.</p>
        <div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: center; align-items: center;">
          <span style="color: rgba(255,255,255,0.6);">Owner: <strong style="color: var(--color-primary);">Ahmed Abbas</strong></span>
          <span style="color: rgba(255,255,255,0.2);">|</span>
          <span style="color: rgba(255,255,255,0.6);">Developed by:</span>
          <a href="https://www.linkedin.com/in/abdelrhman-osama-389834310" target="_blank" style="color: rgba(255,255,255,0.8); text-decoration: none; transition: color 0.3s; display: flex; align-items: center; gap: 5px;" onmouseover="this.style.color='var(--color-primary)'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
            <i class="fa-brands fa-linkedin"></i> Abdelrhman Osama
          </a>
          <a href="https://www.linkedin.com/in/omar-ahmed-78673334a" target="_blank" style="color: rgba(255,255,255,0.8); text-decoration: none; transition: color 0.3s; display: flex; align-items: center; gap: 5px;" onmouseover="this.style.color='var(--color-primary)'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
            <i class="fa-brands fa-linkedin"></i> Omar Ahmed
          </a>
        </div>
      </div>
    </div>
  `;

  const form = container.querySelector('#login-form');
  const emailInput = container.querySelector('#email');
  const passInput = container.querySelector('#password');


  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.querySelector('#email').value;
    const password = form.querySelector('#password').value;
    
    const result = await state.login(email, password);
    if (result.status === 'success') {
      showToast('Welcome back to MapCom!', 'success');
      window.location.hash = '/';
    } else {
      showToast(result.message || 'Invalid credentials.', 'error');
      const card = container.querySelector('.login-card');
      card.style.transform = 'translateX(10px)';
      setTimeout(() => card.style.transform = 'translateX(-10px)', 100);
      setTimeout(() => card.style.transform = 'translateX(10px)', 200);
      setTimeout(() => card.style.transform = 'translateX(0)', 300);
    }
  });


  return container;
}
