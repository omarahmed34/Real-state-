import { state } from './state.js';


export function renderHome() {
  const container = document.createElement('div');
  container.className = 'container';
  
  const user = state.getCurrentUser();

  container.innerHTML = `
    <!-- Hero Section -->
    <div class="hero-modern" style="display: flex; align-items: center; gap: 4rem; min-height: 80vh; padding: 2rem 0; position: relative; overflow: hidden;">
      
      <!-- Decorative Background Elements -->
      <div style="position: absolute; top: -10%; left: -10%; width: 40vw; height: 40vw; background: radial-gradient(circle, rgba(212,175,55,0.1) 0%, rgba(0,0,0,0) 70%); border-radius: 50%; pointer-events: none; z-index: 0;"></div>
      <div style="position: absolute; bottom: -20%; right: -10%; width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(212,175,55,0.05) 0%, rgba(0,0,0,0) 70%); border-radius: 50%; pointer-events: none; z-index: 0;"></div>

      <div class="hero-text" style="flex: 1.2; position: relative; z-index: 1;">
        <span class="badge" style="background: linear-gradient(90deg, rgba(212,175,55,0.2) 0%, rgba(0,0,0,0) 100%); color: var(--color-primary); margin-bottom: 1.5rem; display: inline-flex; align-items: center; gap: 10px; font-weight: 800; letter-spacing: 2px; padding: 0.5rem 1rem; border-left: 2px solid var(--color-primary);">
          <i class="fa-solid fa-crown"></i> COMMAND CENTER
        </span>
        <h1 style="font-family: 'Playfair Display', serif; font-size: 4.5rem; line-height: 1.1; margin-bottom: 2rem; color: #fff; text-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          Master Your <br><span style="color: var(--color-primary); font-style: italic;">Real Estate</span> Empire.
        </h1>
        <p style="font-size: 1.15rem; line-height: 1.8; margin-bottom: 3rem; color: var(--color-text-muted); max-width: 550px;">
          Deploy assets, track leads, and oversee your entire luxury portfolio through an ultra-secure, centralized intelligence dashboard.
        </p>
        <div style="display: flex; gap: 1.5rem; align-items: center;">
          <button id="btn-properties" class="btn btn-primary" style="padding: 1.2rem 2.5rem; font-size: 1.1rem; font-weight: 800; letter-spacing: 1px; border-radius: 12px; box-shadow: 0 10px 25px rgba(212,175,55,0.3); display: flex; align-items: center; gap: 10px; transition: transform 0.3s ease;" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
            <i class="fa-solid fa-building-shield"></i> ENTER PORTFOLIO
          </button>
          <button id="btn-dashboard" class="btn btn-outline" style="padding: 1.2rem 2.5rem; font-size: 1.1rem; font-weight: 700; border-radius: 12px; border-color: rgba(255,255,255,0.1); color: #fff; display: flex; align-items: center; gap: 10px; transition: all 0.3s ease;" onmouseover="this.style.borderColor='var(--color-primary)'; this.style.background='rgba(212,175,55,0.05)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.1)'; this.style.background='transparent'">
            <i class="fa-solid fa-fingerprint"></i> INITIATE HQ
          </button>
        </div>
      </div>

      <div class="hero-image-container" style="flex: 1; position: relative; z-index: 1;">
        <!-- Backdrop Box -->
        <div style="position: absolute; top: -30px; right: -30px; width: 100%; height: 100%; border: 1px solid rgba(212,175,55,0.3); border-radius: 20px; z-index: 0; background: repeating-linear-gradient(45deg, rgba(212,175,55,0.02), rgba(212,175,55,0.02) 10px, transparent 10px, transparent 20px);"></div>
        
        <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80" alt="Luxury Real Estate" style="width: 100%; height: 600px; object-fit: cover; border-radius: 20px; position: relative; z-index: 1; box-shadow: 0 20px 50px rgba(0,0,0,0.5); filter: brightness(0.9) contrast(1.1);">
        
        <!-- Floating Glassmorphism Card -->
        <div class="card" style="position: absolute; bottom: -40px; left: -50px; z-index: 2; padding: 1.5rem 2rem; display: flex; align-items: center; gap: 1.5rem; background: rgba(10, 15, 25, 0.7); backdrop-filter: blur(15px); border: 1px solid var(--glass-border); border-left: 4px solid var(--color-primary); box-shadow: 0 15px 35px rgba(0,0,0,0.4); animation: float 6s ease-in-out infinite;">
          <div style="width: 3.5rem; height: 3.5rem; background: rgba(212,175,55,0.1); color: var(--color-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; border: 1px solid rgba(212,175,55,0.2);">
            <i class="fa-solid fa-gem"></i>
          </div>
          <div>
            <h4 style="margin: 0; font-size: 1.8rem; font-family: 'Playfair Display', serif; color: #fff;">$1.2B+</h4>
            <p style="margin: 0; font-size: 0.85rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 1px;">Assets Under Management</p>
          </div>
        </div>
        
        <!-- Second Floating Card -->
        <div class="card" style="position: absolute; top: 40px; right: -40px; z-index: 2; padding: 1rem 1.5rem; display: flex; align-items: center; gap: 1rem; background: rgba(10, 15, 25, 0.7); backdrop-filter: blur(15px); border: 1px solid var(--glass-border); box-shadow: 0 15px 35px rgba(0,0,0,0.4); animation: float 8s ease-in-out infinite reverse; border-radius: 50px;">
          <div style="width: 10px; height: 10px; background: #2ecc71; border-radius: 50%; box-shadow: 0 0 10px #2ecc71;"></div>
          <span style="color: #fff; font-size: 0.9rem; font-weight: 600; letter-spacing: 1px;">SYSTEM ONLINE</span>
        </div>
      </div>
    </div>
    
    <!-- Feature Grid Section -->
    <div style="margin-top: 6rem; padding-top: 4rem; border-top: 1px solid rgba(255,255,255,0.05); position: relative;">
      <div style="text-align: center; margin-bottom: 4rem;">
        <h2 style="font-family: 'Playfair Display', serif; font-size: 2.5rem; color: #fff;">Executive Capabilities</h2>
        <div style="width: 50px; height: 3px; background: var(--color-primary); margin: 1rem auto;"></div>
      </div>
      
      <div class="grid-3" style="gap: 2rem;">
        <!-- Feature 1 -->
        <div class="card" style="padding: 3rem 2rem; text-align: center; background: linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0) 100%); border: 1px solid rgba(255,255,255,0.05); transition: transform 0.3s ease, border-color 0.3s ease;" onmouseover="this.style.transform='translateY(-10px)'; this.style.borderColor='var(--color-primary)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255,255,255,0.05)';">
          <div style="width: 80px; height: 80px; margin: 0 auto 1.5rem; background: rgba(212,175,55,0.05); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <i class="fa-solid fa-building-columns" style="font-size: 2rem; color: var(--color-primary);"></i>
          </div>
          <h3 style="font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 1rem; color: #fff;">Premium Assets</h3>
          <p style="color: var(--color-text-muted); line-height: 1.6;">Maintain comprehensive oversight of all high-end properties, villas, and commercial spaces globally.</p>
        </div>
        
        <!-- Feature 2 -->
        <div class="card" style="padding: 3rem 2rem; text-align: center; background: linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0) 100%); border: 1px solid rgba(255,255,255,0.05); transition: transform 0.3s ease, border-color 0.3s ease;" onmouseover="this.style.transform='translateY(-10px)'; this.style.borderColor='var(--color-primary)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255,255,255,0.05)';">
          <div style="width: 80px; height: 80px; margin: 0 auto 1.5rem; background: rgba(212,175,55,0.05); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <i class="fa-solid fa-satellite-dish" style="font-size: 2rem; color: var(--color-primary);"></i>
          </div>
          <h3 style="font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 1rem; color: #fff;">Lead Intel</h3>
          <p style="color: var(--color-text-muted); line-height: 1.6;">Capture and securely route client communications and requests directly to the administration.</p>
        </div>
        
        <!-- Feature 3 -->
        <div class="card" style="padding: 3rem 2rem; text-align: center; background: linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0) 100%); border: 1px solid rgba(255,255,255,0.05); transition: transform 0.3s ease, border-color 0.3s ease;" onmouseover="this.style.transform='translateY(-10px)'; this.style.borderColor='var(--color-primary)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255,255,255,0.05)';">
          <div style="width: 80px; height: 80px; margin: 0 auto 1.5rem; background: rgba(212,175,55,0.05); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <i class="fa-solid fa-shield-halved" style="font-size: 2rem; color: var(--color-primary);"></i>
          </div>
          <h3 style="font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 1rem; color: #fff;">Secure Comms</h3>
          <p style="color: var(--color-text-muted); line-height: 1.6;">Utilize encrypted internal channels for director-to-agent task assignments and intelligence sharing.</p>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#btn-properties').addEventListener('click', () => {
    window.location.hash = '/properties';
  });

  container.querySelector('#btn-dashboard').addEventListener('click', () => {
    window.location.hash = '/dashboard';
  });

  return container;
}
