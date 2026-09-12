(() => {
  'use strict';
  const SUPABASE_URL = 'https://mcnmkhlmplzcacyuaitq.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_UeKXJgDg1NEFqCTn_Ux6rQ_UpCxfuYU';
  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
  });

  const $ = id => document.getElementById(id);
  const rank = { high: 0, medium: 1, low: 2 };
  let leads = [];
  let currentUser = null;

  function esc(v = '') {
    return String(v).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  }
  function dt(v) {
    return v ? new Date(v).toLocaleString([], { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '—';
  }
  function today(v) { return !!v && new Date(v).toDateString() === new Date().toDateString(); }
  function overdue(c) { return c.status === 'pending' && c.followup_at && new Date(c.followup_at) < new Date(); }
  function sorted(a) {
    return [...a].sort((x,y) => (new Date(x.followup_at || '2999-01-01') - new Date(y.followup_at || '2999-01-01')) || ((rank[x.priority] ?? 9) - (rank[y.priority] ?? 9)));
  }
  function errorText(e) { return e?.message || e?.details || e?.hint || 'Unknown database error'; }
  function showToast(message, type = 'info') {
    const old = document.querySelector('.toast'); if (old) old.remove();
    const el = document.createElement('div'); el.className = `toast ${type}`; el.textContent = message; document.body.appendChild(el);
    setTimeout(() => el.remove(), 4200);
  }
  function row(c) {
    const id = esc(c.id);
    return `<tr>
      <td><b>${esc(c.name)}</b><div>${esc(c.source || '')}</div></td>
      <td>${esc(c.phone)}</td>
      <td>${esc(c.location || c.property_type || c.profile?.project || '—')}</td>
      <td><span class="priority ${esc(c.priority || 'medium')}">${esc(c.priority || 'medium')}</span></td>
      <td>${dt(c.followup_at)}</td>
      <td><span class="badge">${esc(c.status || 'pending')}</span></td>
      <td><div class="actions">
        <button class="small" data-action="view" data-id="${id}">View</button>
        <button class="small" data-action="edit" data-id="${id}">Edit</button>
        <button class="small" data-action="done" data-id="${id}">Done</button>
        <button class="small" data-action="wa" data-id="${id}">WhatsApp</button>
        <button class="small danger" data-action="delete" data-id="${id}">Delete</button>
      </div></td>
    </tr>`;
  }
  function table(list) {
    return list.length ? `<table><thead><tr><th>Customer</th><th>WhatsApp</th><th>Project</th><th>Priority</th><th>Follow-Up</th><th>Status</th><th>Actions</th></tr></thead><tbody>${sorted(list).map(row).join('')}</tbody></table>` : '<div class="empty">No leads found.</div>';
  }
  async function load() {
    const { data, error } = await client.from('leads').select('*').order('followup_at', { ascending:true, nullsFirst:false }).order('created_at', { ascending:false });
    if (error) { console.error('[Linva CRM] load failed', error); throw error; }
    leads = data || []; render();
  }
  function render() {
    $('total').textContent = leads.length;
    $('today').textContent = leads.filter(c => c.status === 'pending' && today(c.followup_at)).length;
    $('overdue').textContent = leads.filter(overdue).length;
    $('high').textContent = leads.filter(c => c.status === 'pending' && c.priority === 'high').length;
    $('upcoming').innerHTML = table(sorted(leads.filter(c => c.status === 'pending' && c.followup_at)).slice(0,8));
    const q = ($('search')?.value || '').toLowerCase(), src = $('source')?.value || 'all', st = $('status')?.value || 'all';
    $('leadTable').innerHTML = table(leads.filter(c => (!q || [c.name,c.phone,c.location,c.property_type,c.message].join(' ').toLowerCase().includes(q)) && (src === 'all' || c.source === src) && (st === 'all' || c.status === st)));
    const r = $('range')?.value || 'all', fp = $('fp')?.value || 'all';
    let f = leads.filter(c => c.status === 'pending' && c.followup_at && (fp === 'all' || c.priority === fp));
    if (r === 'today') f = f.filter(c => today(c.followup_at));
    if (r === 'overdue') f = f.filter(overdue);
    if (r === 'next7') { const n = Date.now() + 7 * 864e5; f = f.filter(c => new Date(c.followup_at) >= new Date() && new Date(c.followup_at) <= new Date(n)); }
    $('followTable').innerHTML = table(f);
  }
  function profileHtml(c) {
    return `<div><small>WhatsApp</small><b>${esc(c.phone)}</b></div><div><small>Source</small><b>${esc(c.source)}</b></div><div><small>Priority</small><b>${esc(c.priority)}</b></div><div><small>Status</small><b>${esc(c.status)}</b></div><div><small>Upcoming Follow-Up</small><b>${dt(c.followup_at)}</b></div><div><small>Last Follow-Up</small><b>${dt(c.last_followup_at)}</b></div><div class="wide"><small>Requirement</small><b>${esc(c.requirement || c.property_type || c.profile?.project || '—')}</b></div><div class="wide"><small>Message</small><b>${esc(c.message || '—')}</b></div>${c.profile ? `<div class="wide"><small>Design Profile</small><pre>${esc(JSON.stringify(c.profile, null, 2))}</pre></div>` : ''}`;
  }
  function openLead(id) {
    const c = leads.find(x => String(x.id) === String(id)); if (!c) return;
    $('mname').textContent = c.name || 'Lead'; $('details').innerHTML = profileHtml(c); $('modal').classList.remove('hidden'); $('modal').dataset.id = c.id;
  }
  function editLead(id) {
    const c = leads.find(x => String(x.id) === String(id)); if (!c) return;
    $('editId').value = c.id; $('editName').value = c.name || ''; $('editPhone').value = c.phone || ''; $('editSource').value = c.source || 'Manual'; $('editPriority').value = c.priority || 'medium'; $('editStatus').value = c.status || 'pending'; $('editFollowup').value = c.followup_at ? new Date(c.followup_at).toISOString().slice(0,16) : ''; $('editRequirement').value = c.requirement || ''; $('editMessage').value = c.message || '';
    $('editModal').classList.remove('hidden');
  }
  async function saveEdit(e) {
    e.preventDefault();
    const id = $('editId').value;
    const payload = { name:$('editName').value.trim(), phone:$('editPhone').value.replace(/\D/g,''), source:$('editSource').value, priority:$('editPriority').value, status:$('editStatus').value, followup_at:$('editFollowup').value ? new Date($('editFollowup').value).toISOString() : null, requirement:$('editRequirement').value.trim() || null, message:$('editMessage').value.trim() || null };
    if (!payload.name || payload.phone.length < 10) { showToast('Enter a valid customer name and WhatsApp number.', 'error'); return; }
    const { error } = await client.from('leads').update(payload).eq('id', id);
    if (error) { console.error('[Linva CRM] update failed', error); showToast(`Could not update lead: ${errorText(error)}`, 'error'); return; }
    $('editModal').classList.add('hidden'); showToast('Lead updated.', 'success'); await load();
  }
  async function done(id) {
    const { error } = await client.from('leads').update({ status:'completed', last_followup_at:new Date().toISOString() }).eq('id', id);
    if (error) { console.error('[Linva CRM] complete failed', error); showToast(`Could not update lead: ${errorText(error)}`, 'error'); return; }
    showToast('Lead marked completed.', 'success'); await load();
  }
  async function deleteLead(id) {
    const c = leads.find(x => String(x.id) === String(id)); if (!c) return;
    const ok = window.confirm(`Delete this lead permanently?\n\nCustomer: ${c.name || 'Unknown'}\nWhatsApp: ${c.phone || '—'}\n\nThis cannot be undone.`);
    if (!ok) return;
    const { error } = await client.from('leads').delete().eq('id', id);
    if (error) {
      console.error('[Linva CRM] delete failed', error);
      showToast(`Could not delete lead: ${errorText(error)}`, 'error');
      return;
    }
    showToast('Lead deleted permanently.', 'success');
    $('modal').classList.add('hidden'); $('editModal').classList.add('hidden');
    await load();
  }
  function wa(id) {
    const c = leads.find(x => String(x.id) === String(id)); if (!c) return;
    let p = String(c.phone || '').replace(/\D/g,''); if (p.length === 10) p = '91' + p;
    window.open(`https://wa.me/${p}?text=${encodeURIComponent('Hi '+(c.name || '')+', this is Linva Interiors. Following up regarding your interior enquiry.')}`, '_blank', 'noopener');
  }
  async function addLead() {
    const name = prompt('Customer name'); if (!name) return;
    const phone = prompt('WhatsApp number'); if (!phone) return;
    const clean = phone.replace(/\D/g,''); if (clean.length < 10) { showToast('Please enter a valid WhatsApp number.', 'error'); return; }
    const { error } = await client.from('leads').insert({ source:'Manual', name:name.trim(), phone:clean, priority:'medium', status:'pending', followup_at:new Date(Date.now()+864e5).toISOString() });
    if (error) { console.error('[Linva CRM] manual insert failed', error); showToast(`Could not add lead: ${errorText(error)}`, 'error'); return; }
    showToast('Lead added.', 'success'); await load();
  }
  function showLogin(message = '') {
    document.body.innerHTML = `<main class="login-page"><form id="login" class="login-card"><img src="../images/linva-interiors-logo.webp" alt="Linva Interiors"><h1>Linva Interiors CRM</h1><p>Sign in to manage leads.</p><input id="email" type="email" autocomplete="username" placeholder="CRM email" required><input id="password" type="password" autocomplete="current-password" placeholder="CRM password" required><button type="submit">Sign in</button><p id="loginError" class="login-error">${esc(message)}</p></form></main>`;
    $('login').onsubmit = async e => { e.preventDefault(); const btn = e.target.querySelector('button'); btn.disabled = true; btn.textContent = 'Signing in…'; const { error } = await client.auth.signInWithPassword({ email:$('email').value.trim(), password:$('password').value }); if (error) { $('loginError').textContent = errorText(error); btn.disabled = false; btn.textContent = 'Sign in'; return; } location.reload(); };
  }
  function bind() {
    document.querySelectorAll('.nav button').forEach(b => b.onclick = () => { document.querySelectorAll('.nav button').forEach(x => x.classList.remove('active')); b.classList.add('active'); ['dashboard','leads','followups'].forEach(v => $(v).classList.add('hidden')); const v=b.dataset.view; $(v).classList.remove('hidden'); $('title').textContent=v==='dashboard'?'Lead Dashboard':v==='leads'?'Customers & Leads':'Follow-Ups'; render(); });
    ['search','source','status','range','fp'].forEach(id => $(id).addEventListener('input', render));
    $('close').onclick = () => $('modal').classList.add('hidden'); $('modal').onclick = e => { if(e.target.id === 'modal') $('modal').classList.add('hidden'); }; $('modalDelete').onclick = () => { const id = $('modal').dataset.id; if (id) deleteLead(id); };
    $('editClose').onclick = () => $('editModal').classList.add('hidden'); $('editModal').onclick = e => { if(e.target.id === 'editModal') $('editModal').classList.add('hidden'); };
    $('editForm').onsubmit = saveEdit; $('editCancel').onclick = () => $('editModal').classList.add('hidden'); $('editDelete').onclick = () => { const id = $('editId').value; if (id) deleteLead(id); }; $('add').onclick = addLead; $('logout').onclick = async () => { await client.auth.signOut(); location.reload(); };
    document.addEventListener('click', e => { const b=e.target.closest('[data-action]'); if(!b) return; const id=b.dataset.id; if(b.dataset.action==='view') openLead(id); if(b.dataset.action==='edit') editLead(id); if(b.dataset.action==='done') done(id); if(b.dataset.action==='wa') wa(id); if(b.dataset.action==='delete') deleteLead(id); });
  }
  (async () => {
    const { data: { session }, error } = await client.auth.getSession();
    if (error) { showLogin(errorText(error)); return; }
    if (!session) { showLogin(); return; }
    currentUser = session.user;
    client.auth.onAuthStateChange((event, next) => { if (event === 'SIGNED_OUT' || !next) location.reload(); });
    try { bind(); await load(); }
    catch (e) { console.error('[Linva CRM] database load failed', e); document.body.insertAdjacentHTML('afterbegin', `<div class="db-error"><b>CRM database could not be loaded.</b><span>${esc(errorText(e))}</span><button onclick="location.reload()">Retry</button></div>`); }
  })();
})();
