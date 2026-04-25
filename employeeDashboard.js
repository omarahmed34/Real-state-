import { state } from './state.js';
import { showToast } from './utils.js';
import { t } from './i18n.js';

export function renderEmployeeDashboard() {
  const container = document.createElement('div');
  container.className = 'container';
  
  const user = state.getCurrentUser();
  const allTasks = state.get('tasks') || [];
  const allUsers = state.get('users') || [];
  
  // Filter tasks: if assigned_to is 'all' or contains user.id
  const tasks = allTasks.filter(t => {
      if (t.assigned_to === 'all') return true;
      if (!t.assigned_to) return false;
      const ids = t.assigned_to.split(',').map(id => id.trim());
      return ids.includes(user.id.toString());
  });

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const doneTasks = tasks.filter(t => t.status === 'done' || t.status === 'completed');

  const allMessages = state.get('messages') || [];
  // Filter messages: to user or to 'all', and not read
  const userMessages = allMessages.filter(m => (m.receiver_id == user.id || m.receiver_id === 'all') && m.is_read == 0);

  function renderTaskCards(taskList) {
    return taskList.map(task => `
      <div class="card" style="background: rgba(0,0,0,0.4); border: 1px solid var(--glass-border); border-left: 3px solid var(--color-primary); border-radius:12px; padding:1.5rem; margin-bottom:1rem; position:relative; overflow:hidden; transition: transform 0.2s ease, box-shadow 0.2s ease;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(0,0,0,0.3)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
        <h4 style="margin-bottom: 0.5rem; color: #fff; font-size: 1.05rem;">${task.title}</h4>
        <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1rem; line-height: 1.5;">${task.description}</p>
        
        ${task.due_date ? `<div style="font-size:0.75rem; color:#e74c3c; margin-bottom:1rem; font-weight: 600;"><i class="fa-solid fa-clock"></i> ${t('deadline')}: ${task.due_date}</div>` : ''}

        <div style="display: flex; gap: 0.5rem; flex-wrap:wrap; justify-content: space-between; align-items: center;">
          <span class="badge" style="font-size:0.65rem; background: rgba(255,255,255,0.05); color: var(--color-text-muted); border: 1px solid rgba(255,255,255,0.1);">${t(task.status === 'in-progress' ? 'inProgress' : task.status).toUpperCase()}</span>
          
          <div style="display:flex; gap: 0.5rem;">
            ${task.status === 'pending' ? `
              <button class="btn btn-outline btn-sm status-update-btn" data-id="${task.id}" data-status="in-progress" style="padding: 4px 10px; font-size: 0.75rem; color: #f1c40f; border-color: rgba(241, 196, 15, 0.3);">
                 <i class="fa-solid fa-play"></i> START
              </button>
            ` : ''}

            ${task.status !== 'done' ? `
              <button class="btn btn-primary btn-sm status-update-btn" data-id="${task.id}" data-status="done" style="padding: 4px 10px; font-size: 0.75rem; background: rgba(46, 204, 113, 0.1); border: 1px solid #2ecc71; color: #2ecc71;">
                 <i class="fa-solid fa-check"></i> COMPLETE
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `).join('') || `<div style="text-align: center; padding: 2rem 0; opacity: 0.3;"><i class="fa-solid fa-check-double" style="font-size: 2rem; margin-bottom: 1rem;"></i><p style="font-size: 0.85rem;">${t('noTasks')}</p></div>`;
  }

  container.innerHTML = `
    <!-- Header Section -->
    <div class="page-header" style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom: 3rem; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 1rem; font-family:'Playfair Display', serif;">
          <i class="fa-solid fa-user-tie" style="color:var(--color-primary); font-size: 2rem;"></i> Agent Dashboard
        </h1>
        <p style="color: var(--color-text-muted); font-size: 1.1rem;">Welcome back, <strong style="color: #fff;">${user.name}</strong>. Awaiting your commands.</p>
      </div>
      <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: var(--color-text-muted); padding: 0.6rem 1.5rem; border-radius: 50px; font-weight: 800; font-size: 0.85rem; letter-spacing: 2px; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 0 20px rgba(0,0,0,0.2);">
        <i class="fa-solid fa-fingerprint"></i> ID: #00${user.id}
      </div>
    </div>

    <div class="grid-2" style="display:grid; grid-template-columns: 1.4fr 1fr; gap:3rem; align-items: start;">
      <!-- Task Board -->
      <div class="card" style="padding: 2.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid var(--glass-border); padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
          <h3 style="font-family:'Playfair Display', serif; font-size:1.5rem; margin: 0;"><i class="fa-solid fa-list-check" style="color: var(--color-primary); margin-right: 10px;"></i> Operational Objectives</h3>
        </div>
        
        <div class="kanban-board" style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:1.5rem;">
          
          <!-- Pending Lane -->
          <div class="kanban-column" style="background: linear-gradient(180deg, rgba(231, 76, 60, 0.05) 0%, rgba(0,0,0,0) 100%); border-radius:15px; padding:1.2rem; border: 1px solid rgba(231, 76, 60, 0.1);">
            <div class="kanban-header" style="padding-bottom:1rem; border-bottom:1px solid rgba(231, 76, 60, 0.2); margin-bottom:1.5rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight:800; color: #e74c3c; font-size: 0.9rem; letter-spacing: 1px;">PENDING</span>
              <span class="badge" style="background: rgba(231, 76, 60, 0.1); color:#e74c3c; border: 1px solid #e74c3c;">${pendingTasks.length}</span>
            </div>
            <div class="kanban-tasks">
              ${renderTaskCards(pendingTasks)}
            </div>
          </div>

          <!-- In Progress Lane -->
          <div class="kanban-column" style="background: linear-gradient(180deg, rgba(241, 196, 15, 0.05) 0%, rgba(0,0,0,0) 100%); border-radius:15px; padding:1.2rem; border: 1px solid rgba(241, 196, 15, 0.1);">
            <div class="kanban-header" style="padding-bottom:1rem; border-bottom:1px solid rgba(241, 196, 15, 0.2); margin-bottom:1.5rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight:800; color: #f1c40f; font-size: 0.9rem; letter-spacing: 1px;">ACTIVE</span>
              <span class="badge" style="background: rgba(241, 196, 15, 0.1); color:#f1c40f; border: 1px solid #f1c40f;">${inProgressTasks.length}</span>
            </div>
            <div class="kanban-tasks">
              ${renderTaskCards(inProgressTasks)}
            </div>
          </div>

          <!-- Done Lane -->
          <div class="kanban-column" style="background: linear-gradient(180deg, rgba(46, 204, 113, 0.05) 0%, rgba(0,0,0,0) 100%); border-radius:15px; padding:1.2rem; border: 1px solid rgba(46, 204, 113, 0.1);">
            <div class="kanban-header" style="padding-bottom:1rem; border-bottom:1px solid rgba(46, 204, 113, 0.2); margin-bottom:1.5rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight:800; color: #2ecc71; font-size: 0.9rem; letter-spacing: 1px;">CLEARED</span>
              <span class="badge" style="background: rgba(46, 204, 113, 0.1); color:#2ecc71; border: 1px solid #2ecc71;">${doneTasks.length}</span>
            </div>
            <div class="kanban-tasks">
              ${renderTaskCards(doneTasks)}
            </div>
          </div>

        </div>
      </div>

      <!-- Right Column: Messages and Data Form -->
      <div style="display: flex; flex-direction: column; gap: 3rem;">
        
        <!-- Messaging Center -->
        <div class="card" style="padding: 2.5rem; min-height: 450px; display:flex; flex-direction:column;">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid var(--glass-border); padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
            <h3 style="font-family:'Playfair Display', serif; font-size:1.5rem; margin: 0;"><i class="fa-solid fa-tower-cell" style="color:var(--color-primary); margin-right:10px;"></i> Direct Comms</h3>
          </div>
          
          <div id="messages-container" style="flex:1; overflow-y:auto; margin-bottom:1.5rem; display:flex; flex-direction:column; gap:1rem; padding-right:10px;">
             ${userMessages.slice().reverse().map(msg => {
                const sender = allUsers.find(u => u.id == msg.sender_id);
                return `
                  <div style="background:rgba(0,0,0,0.3); padding:1.2rem; border-radius:12px; border:1px solid var(--color-border); box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                      <div style="display:flex; align-items:center; gap: 8px;">
                        <div style="width:24px; height:24px; border-radius:50%; background: #444; color: #fff; display:flex; align-items:center; justify-content:center; font-size:0.6rem; font-weight:900;">${sender ? sender.name[0].toUpperCase() : '?'}</div>
                        <span style="font-weight:700; font-size:0.85rem; color:#fff;">${sender ? sender.name : 'System'}</span>
                      </div>
                      <button class="btn-seen" data-id="${msg.id}" style="background:none; border:none; color:var(--color-text-muted); cursor:pointer; font-size:0.75rem; transition: color 0.2s;" onmouseover="this.style.color='var(--color-primary)'" onmouseout="this.style.color='var(--color-text-muted)'"><i class="fa-solid fa-eye-slash"></i> Mark Read</button>
                    </div>
                    <p style="font-size:0.95rem; margin:0; line-height: 1.6; color: #eee;">${msg.content}</p>
                    <div style="font-size:0.65rem; color:var(--color-text-muted); text-align:right; margin-top:10px;"><i class="fa-regular fa-clock"></i> ${new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </div>
                `;
             }).join('')}
             ${userMessages.length === 0 ? '<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; opacity:0.3;"><i class="fa-regular fa-comments" style="font-size: 3rem; margin-bottom: 1rem;"></i><p>Comm channel is silent.</p></div>' : ''}
          </div>
          
          <form id="form-send-message" style="display:flex; flex-direction:column; gap:1rem; border-top:1px solid var(--glass-border); padding-top:1.5rem;">
            <div style="display:flex; gap:0.8rem;">
              <select id="msg-recipient" class="form-input" style="flex:0.4; font-size:0.9rem;">
                <option value="all">Broadcast</option>
                ${allUsers.filter(u => u.id !== user.id).map(u => `<option value="${u.id}">${u.name}</option>`).join('')}
              </select>
              <input type="text" id="msg-content" class="form-input" style="flex:1; font-size:0.9rem;" placeholder="Transmit..." required>
              <button type="submit" class="btn btn-primary" style="padding:0 1.5rem; border-radius: 12px;"><i class="fa-solid fa-paper-plane"></i></button>
            </div>
          </form>
        </div>

        <!-- Add Data Form -->
        <div class="card" style="padding: 2.5rem; display:flex; flex-direction:column; justify-content:center; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -50px; right: -30px; font-size: 12rem; opacity: 0.02; color: var(--color-primary); transform: rotate(-15deg); pointer-events: none;"><i class="fa-solid fa-satellite-dish"></i></div>
          <h3 style="margin-bottom:2rem; text-align:center; font-family:'Playfair Display', serif; font-size: 1.8rem; position: relative; z-index: 1;"><i class="fa-solid fa-bolt" style="color:var(--color-primary); margin-right:10px;"></i> Transmit New Lead</h3>
          <form id="submit-data-form" style="display:flex; flex-direction:column; gap:1.5rem; position: relative; z-index: 1;">
            <div class="form-group" style="margin:0;"><label style="font-size:0.9rem; letter-spacing:1px; text-transform:uppercase;">${t('clientName')}</label><input type="text" id="client-name" class="form-input" placeholder="e.g. Ahmed Ali" required></div>
            <div class="form-group" style="margin:0;"><label style="font-size:0.9rem; letter-spacing:1px; text-transform:uppercase;">${t('clientPhone')}</label><input type="tel" id="client-phone" class="form-input" placeholder="+20 1..." required></div>
            <div class="form-group" style="margin:0;"><label style="font-size:0.9rem; letter-spacing:1px; text-transform:uppercase;">${t('clientIG')} (Optional)</label><input type="url" id="client-ig" class="form-input" placeholder="https://instagram.com/..."></div>
            <button type="submit" class="btn btn-primary" style="height:55px; margin-top:1rem; font-weight:800; font-size:1.1rem; letter-spacing:2px;">TRANSMIT LEAD <i class="fa-solid fa-satellite-dish" style="margin-left: 10px;"></i></button>
          </form>
        </div>

      </div>
    </div>
  `;

  // Status update
  container.querySelectorAll('.status-update-btn').forEach(btn => {
      btn.onclick = async (e) => {
          const id = e.currentTarget.dataset.id;
          const status = e.currentTarget.dataset.status;
          await state.saveData('tasks', { id, status });
          showToast(`Status updated to ${status}`, 'success');
          window.dispatchEvent(new Event('hashchange'));
      };
  });

  // Messaging events
  const msgForm = container.querySelector('#form-send-message');
  if (msgForm) {
      msgForm.onsubmit = async (e) => {
          e.preventDefault();
          const msgData = {
              sender_id: user.id,
              receiver_id: msgForm.querySelector('#msg-recipient').value,
              content: msgForm.querySelector('#msg-content').value
          };
          const result = await state.saveData('messages', msgData);
          if (result.status === 'success') {
              msgForm.querySelector('#msg-content').value = '';
              showToast('Message sent', 'success');
              window.dispatchEvent(new Event('hashchange'));
          }
      };
  }

  container.querySelectorAll('.btn-seen').forEach(btn => {
      btn.onclick = async (e) => {
          const id = e.currentTarget.dataset.id;
          await state.saveData('messages', { action: 'markSeen', id });
          window.dispatchEvent(new Event('hashchange'));
      };
  });

  // Handle form submission
  const form = container.querySelector('#submit-data-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const clientName = form.querySelector('#client-name').value;
    const clientPhone = form.querySelector('#client-phone').value;
    const clientIG = form.querySelector('#client-ig').value;
    
    // UI state
    const btn = form.querySelector('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Submitting...';
    btn.disabled = true;

    const leadData = {
      from: user.id,
      clientName,
      clientPhone,
      clientIG,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    
    const result = await state.saveData('leads', leadData);
    
    if (result.status === 'success') {
      showToast(`Data submitted successfully to admin!`, 'success');
      form.reset();
    } else {
      showToast('Error submitting data: ' + result.message, 'error');
    }
    
    btn.innerHTML = originalText;
    btn.disabled = false;
    window.dispatchEvent(new Event('hashchange'));
  });


  return container;
}
