import { state } from './state.js';
import { t } from './i18n.js';
import { showToast, exportToExcel, exportToPDF } from './utils.js';

export function renderAdminDashboard() {
  const container = document.createElement('div');
  container.className = 'container';

  const currentUser = state.getCurrentUser();
  if (!currentUser) return container;

  const isOwner = currentUser.role === 'owner';
  const allUsers = state.get('users') || [];
  const properties = state.get('properties') || [];
  const tasks = state.get('tasks') || [];
  const leads = state.get('leads') || [];

  const staffCount = allUsers.filter(u => u.role !== 'owner').length;
  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;

  container.innerHTML = `
    <!-- Header Section -->
    <div class="page-header" style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom: 3rem; flex-wrap: wrap; gap: 1rem;">
      <div>
        <span class="badge" style="background: linear-gradient(90deg, rgba(212,175,55,0.2) 0%, rgba(0,0,0,0) 100%); color: var(--color-primary); margin-bottom: 1rem; display: inline-flex; align-items: center; gap: 10px; font-weight: 800; letter-spacing: 2px; padding: 0.5rem 1rem; border-left: 2px solid var(--color-primary);">
          <i class="fa-solid fa-satellite-dish"></i> SECURE NETWORK ACTIVE
        </span>
        <h1 style="font-family: 'Playfair Display', serif; font-size: 3rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 1rem; text-shadow: 0 5px 15px rgba(0,0,0,0.5);">
          ${isOwner ? '<i class="fa-solid fa-crown" style="color:var(--color-primary); font-size: 2.2rem; filter: drop-shadow(0 0 10px rgba(212,175,55,0.5));"></i> Director Terminal' : '<i class="fa-solid fa-shield-halved" style="color:var(--color-primary); font-size: 2.2rem; filter: drop-shadow(0 0 10px rgba(212,175,55,0.5));"></i> Admin Terminal'}
        </h1>
        <p style="color: var(--color-text-muted); font-size: 1.1rem; max-width: 600px; line-height: 1.6;">Welcome back, <strong style="color: #fff; border-bottom: 1px dashed var(--color-primary); padding-bottom: 2px;">${currentUser.name}</strong>. Central command overview is fully operational and awaiting your directives.</p>
      </div>
      <div style="background: rgba(10, 15, 25, 0.8); backdrop-filter: blur(10px); border: 1px solid rgba(212, 175, 55, 0.3); color: var(--color-primary); padding: 0.8rem 1.8rem; border-radius: 50px; font-weight: 800; font-size: 0.85rem; letter-spacing: 2px; display: flex; align-items: center; gap: 0.8rem; box-shadow: 0 10px 25px rgba(0,0,0,0.5), inset 0 0 15px rgba(212, 175, 55, 0.1);">
        <div style="width: 8px; height: 8px; background: #2ecc71; border-radius: 50%; box-shadow: 0 0 10px #2ecc71;"></div> ROLE: ${currentUser.role.toUpperCase()}
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="grid-3" style="margin-bottom: 4rem; gap: 2rem;">
      <div class="card stat-card" style="display:flex; align-items:center; justify-content:space-between; padding:2.5rem; position: relative; overflow: hidden; background: linear-gradient(145deg, rgba(30, 35, 45, 0.8) 0%, rgba(20, 25, 30, 0.9) 100%); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;" onmouseover="this.style.transform='translateY(-10px)'; this.style.boxShadow='0 20px 40px rgba(0,0,0,0.5)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
        <div style="position: absolute; top: -20px; right: -20px; font-size: 10rem; opacity: 0.02; color: white; transform: rotate(15deg);"><i class="fa-solid fa-users"></i></div>
        <div style="z-index: 1;">
          <h4 style="color:var(--color-text-muted); font-size:0.9rem; text-transform:uppercase; letter-spacing:3px; margin-bottom:0.5rem; display:flex; align-items:center; gap:8px;"><div style="width:6px;height:6px;background:var(--color-primary);border-radius:50%;"></div> ACTIVE STAFF</h4>
          <p style="font-size:3.5rem; font-weight:900; color:#fff; line-height:1; font-family:'Playfair Display', serif; text-shadow: 0 5px 15px rgba(0,0,0,0.3);">${staffCount}</p>
        </div>
        <div style="width:80px; height:80px; border-radius:50%; background:linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(0,0,0,0) 100%); border: 1px solid rgba(212,175,55,0.3); display:flex; align-items:center; justify-content:center; font-size:2rem; color:var(--color-primary); z-index: 1; box-shadow: inset 0 0 20px rgba(212,175,55,0.1);">
          <i class="fa-solid fa-users"></i>
        </div>
      </div>
      
      <div class="card stat-card" style="display:flex; align-items:center; justify-content:space-between; padding:2.5rem; position: relative; overflow: hidden; background: linear-gradient(145deg, rgba(30, 35, 45, 0.8) 0%, rgba(20, 25, 30, 0.9) 100%); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;" onmouseover="this.style.transform='translateY(-10px)'; this.style.boxShadow='0 20px 40px rgba(0,0,0,0.5)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
        <div style="position: absolute; top: -20px; right: -20px; font-size: 10rem; opacity: 0.02; color: white; transform: rotate(-15deg);"><i class="fa-solid fa-building"></i></div>
        <div style="z-index: 1;">
          <h4 style="color:var(--color-text-muted); font-size:0.9rem; text-transform:uppercase; letter-spacing:3px; margin-bottom:0.5rem; display:flex; align-items:center; gap:8px;"><div style="width:6px;height:6px;background:var(--color-primary);border-radius:50%;"></div> PORTFOLIO</h4>
          <p style="font-size:3.5rem; font-weight:900; color:#fff; line-height:1; font-family:'Playfair Display', serif; text-shadow: 0 5px 15px rgba(0,0,0,0.3);">${properties.length}</p>
        </div>
        <div style="width:80px; height:80px; border-radius:50%; background:linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(0,0,0,0) 100%); border: 1px solid rgba(212,175,55,0.3); display:flex; align-items:center; justify-content:center; font-size:2rem; color:var(--color-primary); z-index: 1; box-shadow: inset 0 0 20px rgba(212,175,55,0.1);">
          <i class="fa-solid fa-building"></i>
        </div>
      </div>

      <div class="card stat-card" style="display:flex; align-items:center; justify-content:space-between; padding:2.5rem; position: relative; overflow: hidden; background: linear-gradient(145deg, rgba(30, 35, 45, 0.8) 0%, rgba(20, 25, 30, 0.9) 100%); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;" onmouseover="this.style.transform='translateY(-10px)'; this.style.boxShadow='0 20px 40px rgba(0,0,0,0.5)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
        <div style="position: absolute; top: -20px; right: -20px; font-size: 10rem; opacity: 0.02; color: white; transform: rotate(15deg);"><i class="fa-solid fa-list-check"></i></div>
        <div style="z-index: 1;">
          <h4 style="color:var(--color-text-muted); font-size:0.9rem; text-transform:uppercase; letter-spacing:3px; margin-bottom:0.5rem; display:flex; align-items:center; gap:8px;"><div style="width:6px;height:6px;background:#e74c3c;border-radius:50%; box-shadow: 0 0 10px #e74c3c;"></div> PENDING</h4>
          <p style="font-size:3.5rem; font-weight:900; color:#fff; line-height:1; font-family:'Playfair Display', serif; text-shadow: 0 5px 15px rgba(0,0,0,0.3);">${pendingTasks}</p>
        </div>
        <div style="width:80px; height:80px; border-radius:50%; background:linear-gradient(135deg, rgba(231,76,60,0.15) 0%, rgba(0,0,0,0) 100%); border: 1px solid rgba(231,76,60,0.3); display:flex; align-items:center; justify-content:center; font-size:2rem; color:#e74c3c; z-index: 1; box-shadow: inset 0 0 20px rgba(231,76,60,0.1);">
          <i class="fa-solid fa-list-check"></i>
        </div>
      </div>
    </div>

    <!-- Leads Management (Owner) - HIGH PRIORITY -->
    ${isOwner ? `
      <div class="card" style="margin-bottom: 4rem; padding: 2.5rem; border-top: 4px solid var(--color-primary); background: linear-gradient(180deg, rgba(212,175,55,0.03) 0%, rgba(0,0,0,0) 200px);">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid var(--glass-border); padding-bottom: 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <h3 style="font-family:'Playfair Display', serif; font-size:1.8rem; margin: 0; color: #fff;"><i class="fa-solid fa-address-book" style="color:var(--color-primary); margin-right:10px;"></i> ${t('leadsManagement')}</h3>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-outline" id="btn-export-leads-excel" title="Export Excel" style="padding: 0.6rem 1.2rem; border-radius: 8px;"><i class="fa-solid fa-file-excel" style="margin-right: 5px;"></i> EXCEL</button>
            <button class="btn btn-outline" id="btn-export-leads-pdf" title="Export PDF" style="padding: 0.6rem 1.2rem; border-radius: 8px;"><i class="fa-solid fa-file-pdf" style="margin-right: 5px;"></i> PDF</button>
          </div>
        </div>
        <div class="table-container" style="overflow-x:auto;">
          <table style="width:100%; border-collapse:separate; border-spacing: 0 8px; min-width: 800px;">
            <thead>
              <tr style="text-align:left;">
                <th style="padding:1.2rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;">${t('clientName')}</th>
                <th style="padding:1.2rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;">${t('clientPhone')}</th>
                <th style="padding:1.2rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;">${t('instagram')}</th>
                <th style="padding:1.2rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;">${t('submittedBy')}</th>
                <th style="padding:1.2rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;">${t('status')}</th>
                <th style="padding:1.2rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px; text-align: right;">${t('action')}</th>
              </tr>
            </thead>
            <tbody>
              ${leads.slice().reverse().map(l => {
    const submitter = allUsers.find(u => u.id === l.from);
    return `
                  <tr style="background: rgba(255,255,255,0.02); transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" onmouseover="this.style.background='rgba(255,255,255,0.05)'; this.style.transform='scale(1.01)';" onmouseout="this.style.background='rgba(255,255,255,0.02)'; this.style.transform='scale(1)';">
                    <td style="padding:1.5rem; font-weight:700; font-size: 1.1rem; color: #fff; border-top-left-radius: 12px; border-bottom-left-radius: 12px; border-left: 3px solid var(--color-primary);">${l.clientName}</td>
                    <td style="padding:1.5rem; font-family: monospace; font-size: 1.1rem; color: var(--color-primary);">${l.clientPhone}</td>
                    <td style="padding:1.5rem;">
                      ${l.clientIG ? `<a href="${l.clientIG}" target="_blank" style="color:#e1306c; text-decoration:none; display:flex; align-items:center; gap:8px; font-weight: 600; background: rgba(225, 48, 108, 0.1); padding: 5px 10px; border-radius: 20px; width: fit-content;"><i class="fa-brands fa-instagram" style="font-size: 1.2rem;"></i> Profile</a>` : '<span style="opacity:0.3;">-</span>'}
                    </td>
                    <td style="padding:1.5rem;">
                      <div style="display:flex; align-items:center; gap:10px;">
                        <div style="width: 35px; height: 35px; border-radius: 50%; background: #222; display:flex; align-items:center; justify-content:center; font-size: 0.8rem; color: var(--color-primary); border: 1px solid rgba(212,175,55,0.3); box-shadow: 0 0 10px rgba(212,175,55,0.1);">${submitter ? submitter.name[0].toUpperCase() : '?'}</div>
                        <span style="font-size:0.95rem; color:var(--color-text-muted); font-weight: 600;">${submitter ? submitter.name : 'Unknown'}</span>
                      </div>
                    </td>
                    <td style="padding:1.5rem;">
                      <span class="badge" style="background:${l.status === 'done' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(212, 175, 55, 0.1)'}; color:${l.status === 'done' ? '#2ecc71' : 'var(--color-primary)'}; border: 1px solid ${l.status === 'done' ? '#2ecc71' : 'var(--color-primary)'}; box-shadow: 0 0 10px ${l.status === 'done' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(212, 175, 55, 0.2)'}; padding: 8px 15px;">
                        ${l.status === 'done' ? t('leadStatusDone') : t('leadStatusPending')}
                      </span>
                    </td>
                    <td style="padding:1.5rem; text-align: right; border-top-right-radius: 12px; border-bottom-right-radius: 12px;">
                      ${l.status !== 'done' ? `
                        <button class="btn btn-primary btn-sm btn-lead-done" data-id="${l.id}" style="padding:0.6rem 1.2rem; font-size:0.85rem; border-radius: 8px; box-shadow: 0 5px 15px rgba(212,175,55,0.3);">
                          <i class="fa-solid fa-check"></i> ${t('markAsDone')}
                        </button>
                      ` : '<div style="display:flex; align-items:center; justify-content: flex-end; gap:8px; color:#2ecc71; font-weight:800; text-transform: uppercase; letter-spacing: 1px; font-size: 0.85rem;"><i class="fa-solid fa-check-double"></i> Handled</div>'}
                    </td>
                  </tr>
                `;
  }).join('')}
              ${leads.length === 0 ? '<tr><td colspan="6" style="text-align:center; padding:5rem; opacity:0.5; font-size: 1.1rem;"><i class="fa-regular fa-folder-open" style="font-size: 4rem; margin-bottom: 1rem; display: block; color: var(--color-primary);"></i> No leads collected yet.</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}

    <div class="grid-2" style="display:grid; grid-template-columns: 1.5fr 1fr; gap:3rem; align-items: start; margin-bottom: 3rem;">
      <!-- Staff List -->
      <div class="card" style="padding: 2.5rem; border-top: 4px solid var(--color-primary); background: linear-gradient(180deg, rgba(212,175,55,0.03) 0%, rgba(0,0,0,0) 200px);">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid var(--glass-border); padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
          <h3 style="font-family:'Playfair Display', serif; font-size:1.6rem; margin: 0; color: #fff;"><i class="fa-solid fa-users-gear" style="color:var(--color-primary); margin-right:10px;"></i> Command Staff</h3>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-outline" id="btn-export-staff-excel" title="Export Excel" style="padding: 0.5rem 1rem;"><i class="fa-solid fa-file-excel"></i></button>
            ${isOwner ? `<button class="btn btn-primary" id="btn-add-user" style="padding: 0.5rem 1.2rem; box-shadow: 0 5px 15px rgba(212,175,55,0.3);"><i class="fa-solid fa-plus"></i> Add Staff</button>` : ''}
          </div>
        </div>
        <div class="table-container" style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse;">
            <thead>
              <tr style="text-align:left; background: rgba(0,0,0,0.2);">
                <th style="padding:1rem; border-top-left-radius: 8px; color: var(--color-text-muted);">Personnel</th>
                <th style="padding:1rem; color: var(--color-text-muted);">Clearance Role</th>
                <th style="padding:1rem; border-top-right-radius: 8px; color: var(--color-text-muted); text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${allUsers.filter(u => u.id !== currentUser.id).map(u => {
    let roleColor = 'var(--color-text-muted)';
    let roleBg = 'rgba(255,255,255,0.05)';
    if(u.role === 'owner') { roleColor = 'var(--color-primary)'; roleBg = 'rgba(212,175,55,0.1)'; }
    if(u.role === 'admin') { roleColor = '#3498db'; roleBg = 'rgba(52, 152, 219, 0.1)'; }

    return `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.03); transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                  <td style="padding:1rem;">
                    <div style="display:flex; align-items:center; gap: 1rem;">
                      <div style="width: 40px; height: 40px; border-radius: 50%; background: #111; border: 1px solid var(--color-border); display:flex; align-items:center; justify-content:center; font-weight: 800; color: #fff;">${u.name.substring(0,2).toUpperCase()}</div>
                      <div>
                        <div style="font-weight:700; font-size: 1.05rem;">${u.name}</div>
                        <div style="font-size:0.8rem; color:var(--color-text-muted);"><i class="fa-solid fa-envelope" style="font-size: 0.7rem; margin-right: 3px;"></i> ${u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style="padding:1rem;">
                    ${isOwner ? `
                      <select class="role-select" data-id="${u.id}" style="background:${roleBg}; color: ${roleColor}; border:1px solid ${roleColor}; border-radius:30px; font-size:0.75rem; font-weight:800; padding:6px 15px; cursor:pointer; outline: none; appearance: none; -webkit-appearance: none; text-align: center;">
                        <option value="employee" ${u.role === 'employee' ? 'selected' : ''}>EMPLOYEE</option>
                        <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>ADMIN</option>
                        <option value="owner" ${u.role === 'owner' ? 'selected' : ''}>OWNER</option>
                      </select>
                    ` : `<span class="badge" style="background:${roleBg}; color:${roleColor}; border: 1px solid ${roleColor};">${u.role.toUpperCase()}</span>`}
                  </td>
                  <td style="padding:1rem; text-align: right;">
                    ${isOwner ? `
                      <div style="display:flex; gap:0.5rem; justify-content: flex-end;">
                        <button class="btn-icon btn-edit-user" data-id="${u.id}" style="width: 35px; height: 35px; color:var(--color-primary); border-color: rgba(212,175,55,0.3);"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="btn-icon btn-del-user" data-id="${u.id}" style="width: 35px; height: 35px; color:#e74c3c; border-color: rgba(231, 76, 60, 0.3);"><i class="fa-solid fa-trash"></i></button>
                      </div>
                    ` : '<i class="fa-solid fa-shield-cat" style="color: var(--color-text-muted); opacity: 0.5; font-size: 1.2rem;"></i>'}
                  </td>
                </tr>
              `}).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tasks Section -->
      <div class="card" style="padding: 2.5rem; display:flex; flex-direction:column; height: 100%; border-top: 4px solid var(--color-primary); background: linear-gradient(180deg, rgba(212,175,55,0.03) 0%, rgba(0,0,0,0) 200px);">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid var(--glass-border); padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
          <h3 style="font-family:'Playfair Display', serif; font-size:1.6rem; margin: 0; color: #fff;"><i class="fa-solid fa-list-check" style="color:var(--color-primary); margin-right:10px;"></i> Active Missions</h3>
          <button class="btn btn-primary" id="btn-assign-task" style="padding: 0.5rem 1.2rem; box-shadow: 0 5px 15px rgba(212,175,55,0.3);"><i class="fa-solid fa-plus"></i> Deploy</button>
        </div>
        <div style="display:flex; flex-direction:column; gap:1rem; flex: 1; overflow-y:auto; padding-right:10px; max-height: 500px;">
          ${tasks.length > 0 ? tasks.slice().reverse().map(task => {
    const assignedTo = task.assigned_to;
    let assigneeNames = '';
    if (assignedTo === 'all') {
      assigneeNames = t('all');
    } else if (assignedTo) {
      const ids = assignedTo.split(',').map(id => parseInt(id.trim()));
      assigneeNames = allUsers.filter(u => ids.includes(u.id)).map(u => u.name).join(', ');
    } else {
      assigneeNames = 'None';
    }
    
    const isCompleted = task.status === 'completed';

    return `
            <div style="background: rgba(0,0,0,0.2); padding:1.5rem; border-radius:12px; border: 1px solid var(--glass-border); border-left:4px solid ${isCompleted ? '#2ecc71' : 'var(--color-primary)'}; transition: transform 0.3s ease, box-shadow 0.3s ease;" onmouseover="this.style.transform='translateX(5px)'; this.style.boxShadow='0 5px 15px rgba(0,0,0,0.3)';" onmouseout="this.style.transform='translateX(0)'; this.style.boxShadow='none';">
              <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:10px;">
                <div style="font-weight:800; font-size:1.1rem; color: #fff; ${isCompleted ? 'text-decoration: line-through; opacity: 0.5;' : ''}">${task.title}</div>
                <span class="badge" style="background: ${isCompleted ? 'rgba(46, 204, 113, 0.1)' : 'rgba(212, 175, 55, 0.1)'}; color: ${isCompleted ? '#2ecc71' : 'var(--color-primary)'};">${task.status.toUpperCase()}</span>
              </div>
              <div style="font-size:0.85rem; color:var(--color-text-muted); margin-bottom:10px; line-height: 1.5;">
                ${task.description || 'No description provided.'}
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px; margin-top: 10px;">
                <div style="font-size:0.8rem; color:var(--color-text-muted); display:flex; align-items:center; gap: 5px;">
                  <i class="fa-solid fa-user-tag"></i> ${assigneeNames}
                </div>
                ${task.due_date ? `<div style="font-size:0.8rem; color:#e74c3c; font-weight: 600; display:flex; align-items:center; gap: 5px;"><i class="fa-solid fa-clock"></i> ${task.due_date}</div>` : ''}
              </div>
            </div>`;
  }).join('') : '<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; opacity:0.3;"><i class="fa-solid fa-check-double" style="font-size: 4rem; margin-bottom: 1rem;"></i><p>All clear. No active missions.</p></div>'}
        </div>
      </div>
    </div>

    <!-- Communication & Forms Section -->
    <div class="grid-2" style="display:grid; grid-template-columns: 1fr 1fr; gap:3rem; align-items: start; margin-bottom: 4rem;">
       <!-- Messaging Center -->
      <div class="card" style="padding: 2.5rem; min-height: 450px; display:flex; flex-direction:column; border-top: 4px solid var(--color-primary); background: linear-gradient(180deg, rgba(212,175,55,0.03) 0%, rgba(0,0,0,0) 200px);">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid var(--glass-border); padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
          <h3 style="font-family:'Playfair Display', serif; font-size:1.6rem; margin: 0; color: #fff;"><i class="fa-solid fa-tower-cell" style="color:var(--color-primary); margin-right:10px;"></i> Secure Comm Channel</h3>
        </div>
        
        <div id="messages-container" style="flex:1; overflow-y:auto; margin-bottom:1.5rem; display:flex; flex-direction:column; gap:1.5rem; padding-right:10px;">
           ${(state.get('messages') || []).filter(m => m.is_read == 0).map(msg => {
    const sender = allUsers.find(u => u.id == msg.sender_id);
    const receiverText = msg.receiver_id === 'all' ? t('all') : (allUsers.find(u => u.id == msg.receiver_id)?.name || 'Unknown');
    const isMine = msg.sender_id == currentUser.id;

    return `
                <div style="background:${isMine ? 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%)' : 'rgba(0,0,0,0.3)'}; padding:1.2rem; border-radius:12px; border:1px solid ${isMine ? 'rgba(212,175,55,0.3)' : 'var(--color-border)'}; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <div style="display:flex; align-items:center; gap: 8px;">
                      <div style="width:24px; height:24px; border-radius:50%; background: ${isMine ? 'var(--color-primary)' : '#444'}; color: ${isMine ? '#000' : '#fff'}; display:flex; align-items:center; justify-content:center; font-size:0.6rem; font-weight:900;">${sender ? sender.name[0].toUpperCase() : '?'}</div>
                      <span style="font-weight:700; font-size:0.85rem; color:${isMine ? 'var(--color-primary)' : '#fff'};">${sender ? sender.name : 'Unknown'} <i class="fa-solid fa-arrow-right" style="font-size:0.7rem; opacity:0.5; margin:0 5px;"></i> ${receiverText}</span>
                    </div>
                    <button class="btn-seen" data-id="${msg.id}" style="background:none; border:none; color:var(--color-text-muted); cursor:pointer; font-size:0.75rem; transition: color 0.2s;" onmouseover="this.style.color='var(--color-primary)'" onmouseout="this.style.color='var(--color-text-muted)'"><i class="fa-solid fa-eye-slash"></i> Mark Read</button>
                  </div>
                  <p style="font-size:0.95rem; margin:0; line-height: 1.6; color: #eee;">${msg.content}</p>
                </div>
              `;
  }).join('')}
           ${(state.get('messages') || []).filter(m => m.is_read == 0).length === 0 ? '<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; opacity:0.3;"><i class="fa-regular fa-comments" style="font-size: 3rem; margin-bottom: 1rem;"></i><p>Comm channel is silent.</p></div>' : ''}
        </div>
        
        <form id="form-send-message" style="display:flex; flex-direction:column; gap:1rem; border-top:1px solid var(--glass-border); padding-top:1.5rem;">
          <div style="display:flex; gap:0.8rem;">
            <select id="msg-recipient" class="form-input" style="flex:0.4; font-size:0.9rem;">
              <option value="all">Broadcast (All Staff)</option>
              ${allUsers.filter(u => u.id !== currentUser.id).map(u => `<option value="${u.id}">${u.name}</option>`).join('')}
            </select>
            <input type="text" id="msg-content" class="form-input" style="flex:1; font-size:0.9rem;" placeholder="Transmit message..." required>
            <button type="submit" class="btn btn-primary" style="padding:0 1.5rem; border-radius: 12px;"><i class="fa-solid fa-paper-plane"></i></button>
          </div>
        </form>
      </div>

      <!-- Lead Submission (If not owner) -->
      ${!isOwner ? `
        <div class="card" style="padding:2.5rem; display:flex; flex-direction:column; justify-content:center;">
          <h3 style="margin-bottom:2rem; text-align:center; font-family:'Playfair Display', serif; font-size: 1.8rem;"><i class="fa-solid fa-bolt" style="color:var(--color-primary); margin-right:10px;"></i> Register New Lead</h3>
          <form id="admin-submit-lead-form" style="display:flex; flex-direction:column; gap:1.5rem;">
            <div class="form-group" style="margin:0;"><label style="font-size:0.9rem; letter-spacing:1px; text-transform:uppercase;">${t('clientName')}</label><input type="text" id="l-name" class="form-input" placeholder="Enter client's full name" required></div>
            <div class="form-group" style="margin:0;"><label style="font-size:0.9rem; letter-spacing:1px; text-transform:uppercase;">${t('clientPhone')}</label><input type="tel" id="l-phone" class="form-input" placeholder="+20 1..." required></div>
            <div class="form-group" style="margin:0;"><label style="font-size:0.9rem; letter-spacing:1px; text-transform:uppercase;">${t('clientIG')}</label><input type="url" id="l-ig" class="form-input" placeholder="https://instagram.com/..."></div>
            <button type="submit" class="btn btn-primary" style="height:55px; margin-top:1rem; font-weight:800; font-size:1.1rem; letter-spacing:2px;">TRANSMIT LEAD <i class="fa-solid fa-satellite-dish" style="margin-left: 10px;"></i></button>
          </form>
        </div>
      ` : ''}
    </div>

    <!-- Modals -->
    <div id="modal-user" class="modal-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; z-index:2000; align-items:center; justify-content:center; padding: 20px;">
      <div class="card modal-card" style="width:100%; max-width:500px; padding:3rem; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 5px; background: var(--color-primary);"></div>
        <h2 id="modal-user-title" style="margin-bottom:2rem; font-family:'Playfair Display', serif; font-size: 2rem;">Add Staff</h2>
        <form id="form-user">
          <input type="hidden" id="u-id">
          <div class="form-group"><label>Full Name</label><input type="text" id="u-name" class="form-input" placeholder="e.g. John Doe" required></div>
          <div class="form-group"><label>Email Address</label><input type="email" id="u-email" class="form-input" placeholder="name@company.com" required></div>
          <div class="form-group"><label>Access Password</label><input type="text" id="u-pass" class="form-input" placeholder="Secure password" required></div>
          <div class="form-group"><label>Clearance Level</label>
            <select id="u-role" class="form-input">
              <option value="employee">Level 1 - Employee</option>
              <option value="admin">Level 2 - Administrator</option>
              <option value="owner">Level 3 - Director (Owner)</option>
            </select>
          </div>
          <div style="display:flex; gap:1rem; margin-top:2.5rem;">
            <button type="submit" class="btn btn-primary" style="flex:1; padding: 1rem;">Authorize</button>
            <button type="button" class="btn btn-outline btn-close-modal" style="flex:1; padding: 1rem;">Abort</button>
          </div>
        </form>
      </div>
    </div>

    <div id="modal-task" class="modal-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; z-index:2000; align-items:center; justify-content:center; padding: 20px;">
      <div class="card modal-card" style="width:100%; max-width:500px; padding:3rem; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 5px; background: var(--color-primary);"></div>
        <h2 style="margin-bottom:2rem; font-family:'Playfair Display', serif; font-size: 2rem;">Assign Mission</h2>
        <form id="form-task">
          <div class="form-group"><label>Mission Title</label><input type="text" id="t-title" class="form-input" placeholder="Brief objective name" required></div>
          <div class="form-group"><label>Parameters / Description</label><textarea id="t-desc" class="form-input" rows="3" placeholder="Detailed mission parameters..." required></textarea></div>
          <div class="form-group"><label>Operational Deadline</label><input type="date" id="t-deadline" class="form-input"></div>
          <div class="form-group"><label>Assigned Operatives</label>
            <select id="t-assignees" class="form-input" multiple style="height:120px; padding: 0.5rem;">
              <option value="all" style="font-weight: 800; color: var(--color-primary); margin-bottom: 5px;">[ Broadcast to All ]</option>
              ${allUsers.filter(u => u.id !== currentUser.id && (isOwner || u.role === 'employee')).map(u => `<option value="${u.id}" style="padding: 5px;">${u.name} (${u.role})</option>`).join('')}
            </select>
            <small style="opacity:0.6; display: block; margin-top: 5px;"><i class="fa-solid fa-keyboard"></i> Hold CTRL to select multiple targets.</small>
          </div>
          <div style="display:flex; gap:1rem; margin-top:2.5rem;">
            <button type="submit" class="btn btn-primary" style="flex:1; padding: 1rem;">Deploy</button>
            <button type="button" class="btn btn-outline btn-close-modal" style="flex:1; padding: 1rem;">Abort</button>
          </div>
        </form>
      </div>
    </div>
  `;

  attachEvents(container, isOwner, currentUser);
  return container;
}

function attachEvents(container, isOwner, currentUser) {
  const modalUser = container.querySelector('#modal-user');
  const modalTask = container.querySelector('#modal-task');

  container.querySelectorAll('.btn-close-modal').forEach(btn => {
    btn.onclick = () => { if (modalUser) modalUser.style.display = 'none'; if (modalTask) modalTask.style.display = 'none'; };
  });

  if (isOwner && container.querySelector('#btn-add-user')) {
    container.querySelector('#btn-add-user').onclick = () => {
      container.querySelector('#modal-user-title').textContent = 'Add New Staff';
      container.querySelector('#u-id').value = '';
      container.querySelector('#form-user').reset();
      modalUser.style.display = 'flex';
    };

    container.querySelectorAll('.btn-edit-user').forEach(btn => {
      btn.onclick = (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        const users = state.get('users') || [];
        const u = users.find(x => x.id === id);
        if (u) {
          container.querySelector('#modal-user-title').textContent = 'Edit Staff Member';
          container.querySelector('#u-id').value = u.id;
          container.querySelector('#u-name').value = u.name;
          container.querySelector('#u-email').value = u.email;
          container.querySelector('#u-pass').value = u.password;
          container.querySelector('#u-role').value = u.role;
          modalUser.style.display = 'flex';
        }
      };
    });

    container.querySelector('#form-user').onsubmit = async (e) => {
      e.preventDefault();
      const id = container.querySelector('#u-id').value;
      const userData = {
        name: container.querySelector('#u-name').value,
        email: container.querySelector('#u-email').value,
        password: container.querySelector('#u-pass').value,
        role: container.querySelector('#u-role').value
      };

      if (id) userData.id = parseInt(id);

      const result = await state.saveData('users', userData);
      if (result.status === 'success') {
        modalUser.style.display = 'none';
        // If editing self, update current session if needed
        if (userData.id === currentUser.id) {
          const upUser = (state.get('users') || []).find(u => u.id === userData.id);
          if (upUser) state.setSync('currentUser', upUser);
        }
        window.dispatchEvent(new Event('hashchange'));
        showToast(id ? 'User updated successfully!' : 'User added successfully!', 'success');
      } else {
        showToast('Error saving user: ' + result.message, 'error');
      }
    };

    container.querySelectorAll('.btn-del-user').forEach(btn => {
      btn.onclick = async (e) => {
        if (confirm('Remove user?')) {
          const id = parseInt(e.currentTarget.dataset.id);
          await state.deleteData('users', id);
          window.dispatchEvent(new Event('hashchange'));
        }
      };
    });

    // Handle role changes
    container.querySelectorAll('.role-select').forEach(select => {
      select.onchange = async (e) => {
        const id = parseInt(e.target.dataset.id);
        const newRole = e.target.value;
        const users = state.get('users') || [];
        const u = users.find(u => u.id === id);
        if (u) {
          await state.saveData('users', { ...u, role: newRole });
          showToast(`Role updated to ${newRole.toUpperCase()}`, 'success');
          window.dispatchEvent(new Event('hashchange'));
        }
      };
    });
  }

  if (container.querySelector('#btn-assign-task')) {
    container.querySelector('#btn-assign-task').onclick = () => modalTask.style.display = 'flex';
    container.querySelector('#form-task').onsubmit = async (e) => {
      e.preventDefault();
      const select = container.querySelector('#t-assignees');
      const selectedOptions = Array.from(select.selectedOptions).map(opt => opt.value);

      let assignedTo = '';
      if (selectedOptions.includes('all')) {
        assignedTo = 'all';
      } else {
        assignedTo = selectedOptions.join(',');
      }

      const taskData = {
        title: container.querySelector('#t-title').value,
        description: container.querySelector('#t-desc').value,
        due_date: container.querySelector('#t-deadline').value,
        assigned_to: assignedTo,
        assigned_by: currentUser.id,
        status: 'pending'
      };
      await state.saveData('tasks', taskData);
      modalTask.style.display = 'none';
      window.dispatchEvent(new Event('hashchange'));
      showToast('Task assigned successfully!', 'success');
    };
  }

  // Messaging events
  const msgForm = container.querySelector('#form-send-message');
  if (msgForm) {
    msgForm.onsubmit = async (e) => {
      e.preventDefault();
      const msgData = {
        sender_id: currentUser.id,
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

  // Lead Submission (Admin)
  const leadForm = container.querySelector('#admin-submit-lead-form');
  if (leadForm) {
    leadForm.onsubmit = async (e) => {
      e.preventDefault();
      const newLead = {
        from: currentUser.id,
        clientName: leadForm.querySelector('#l-name').value,
        clientPhone: leadForm.querySelector('#l-phone').value,
        clientIG: leadForm.querySelector('#l-ig').value,
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      };
      await state.saveData('leads', newLead);
      leadForm.reset();
      showToast('Lead submitted successfully!', 'success');
      window.dispatchEvent(new Event('hashchange'));
    };
  }

  // Lead Done (Owner)
  container.querySelectorAll('.btn-lead-done').forEach(btn => {
    btn.onclick = async (e) => {
      const id = parseInt(e.target.dataset.id);
      const leads = state.get('leads') || [];
      const l = leads.find(l => l.id === id);
      if (l) {
        await state.saveData('leads', { ...l, status: 'done' });
        showToast('Lead marked as handled', 'success');
        window.dispatchEvent(new Event('hashchange'));
      }
    };
  });

  // Export Events
  const exlLeadsBtn = container.querySelector('#btn-export-leads-excel');
  if (exlLeadsBtn) {
    exlLeadsBtn.onclick = () => {
      const data = (state.get('leads') || []).map(l => ({
        Name: l.clientName || '',
        Phone: l.clientPhone || '',
        Instagram: l.clientIG || 'N/A',
        Status: l.status || '',
        Date: l.date || 'N/A'
      }));
      exportToExcel(data, 'MapCom_Leads');
    };
  }

  const pdfLeadsBtn = container.querySelector('#btn-export-leads-pdf');
  if (pdfLeadsBtn) {
    pdfLeadsBtn.onclick = () => {
      const data = state.get('leads') || [];
      const cols = ['Name', 'Phone', 'Instagram', 'Status', 'Date'];
      const rows = data.map(l => [l.clientName, l.clientPhone, l.clientIG || 'N/A', l.status, l.date || 'N/A']);
      exportToPDF(cols, rows, 'MapCom_Leads_Report');
    };
  }

  const exlStaffBtn = container.querySelector('#btn-export-staff-excel');
  if (exlStaffBtn) {
    exlStaffBtn.onclick = () => {
      const data = (state.get('users') || []).map(u => ({
        ID: u.id,
        Name: u.name,
        Email: u.email,
        Role: u.role,
        Phone: u.phone || 'N/A'
      }));
      exportToExcel(data, 'MapCom_Staff_List');
    };
  }

}
