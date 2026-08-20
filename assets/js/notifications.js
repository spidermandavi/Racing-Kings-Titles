(() => {
  const CONFIG = window.RK_SUPABASE_CONFIG || window.SUPABASE_CONFIG || null;
  const MAX_NOTIFICATIONS = 20;

  let client = null;
  let user = null;
  let channel = null;
  let panel;
  let list;
  let badge;
  let bell;

  const getClient = () => {
    if (client) return client;
    if (!window.supabase || !CONFIG?.url || !(CONFIG.anonKey || CONFIG.key)) return null;
    client = window.supabase.createClient(CONFIG.url, CONFIG.anonKey || CONFIG.key, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    return client;
  };

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));

  const relativeTime = (value) => {
    const date = new Date(value);
    const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const render = (notifications) => {
    if (!list || !badge) return;
    const unread = notifications.filter(n => !n.read).length;
    badge.textContent = unread > 99 ? '99+' : String(unread);
    badge.hidden = unread === 0;
    bell?.setAttribute('aria-label', unread ? `Notifications, ${unread} unread` : 'Notifications');

    if (!notifications.length) {
      list.innerHTML = '<div class="notification-empty">No notifications yet.</div>';
      return;
    }

    list.innerHTML = notifications.map(n => `
      <button class="notification-item ${n.read ? '' : 'unread'}" type="button" data-id="${escapeHtml(n.id)}" data-link="${escapeHtml(n.link || '')}">
        <span class="notification-item-title">${escapeHtml(n.title || n.type || 'Notification')}</span>
        ${n.body ? `<span class="notification-item-body">${escapeHtml(n.body)}</span>` : ''}
        <span class="notification-item-time">${relativeTime(n.created_at)}</span>
      </button>`).join('');
  };

  const load = async () => {
    const supabase = getClient();
    if (!supabase || !user) return;
    const { data, error } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(MAX_NOTIFICATIONS);
    if (error) {
      console.error('Could not load notifications:', error.message);
      return;
    }
    render(data || []);
  };

  const markRead = async (id) => {
    const supabase = getClient();
    if (!supabase || !user || !id) return;
    const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id).eq('user_id', user.id);
    if (!error) load();
  };

  const subscribe = () => {
    const supabase = getClient();
    if (!supabase || !user || channel) return;
    channel = supabase.channel(`rk-notifications-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, load)
      .subscribe();
  };

  const buildUi = () => {
    if (document.querySelector('.notification-control')) return;
    const headerInner = document.querySelector('.header-inner');
    if (!headerInner) return;

    const control = document.createElement('div');
    control.className = 'notification-control';
    control.innerHTML = `
      <button class="notification-bell" type="button" aria-label="Notifications" aria-expanded="false">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span class="notification-badge" hidden>0</span>
      </button>
      <section class="notification-panel" hidden aria-label="Notifications">
        <div class="notification-panel-header"><strong>Notifications</strong><button type="button" class="notification-mark-all">Mark all read</button></div>
        <div class="notification-list"></div>
      </section>`;

    headerInner.appendChild(control);
    bell = control.querySelector('.notification-bell');
    badge = control.querySelector('.notification-badge');
    panel = control.querySelector('.notification-panel');
    list = control.querySelector('.notification-list');

    bell.addEventListener('click', () => {
      const open = panel.hidden;
      panel.hidden = !open;
      bell.setAttribute('aria-expanded', String(open));
      if (open) load();
    });

    control.querySelector('.notification-mark-all').addEventListener('click', async () => {
      const supabase = getClient();
      if (!supabase || !user) return;
      const { error } = await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false);
      if (!error) load();
    });

    list.addEventListener('click', async (event) => {
      const item = event.target.closest('.notification-item');
      if (!item) return;
      await markRead(item.dataset.id);
      if (item.dataset.link) window.location.href = item.dataset.link;
    });

    document.addEventListener('click', (event) => {
      if (!control.contains(event.target) && !panel.hidden) {
        panel.hidden = true;
        bell.setAttribute('aria-expanded', 'false');
      }
    });
  };

  const init = async () => {
    buildUi();
    const supabase = getClient();
    if (!supabase) return;
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    user = currentUser;
    if (!user) return;
    await load();
    subscribe();
    supabase.auth.onAuthStateChange((_event, session) => {
      user = session?.user || null;
      if (channel) { supabase.removeChannel(channel); channel = null; }
      if (user) { load(); subscribe(); }
      else render([]);
    });
  };

  document.addEventListener('DOMContentLoaded', init);
})();
