export const KEYS = {
  USERS: 'hr_users',
  EMPLOYEES: 'hr_employees',
  ATTENDANCE: 'hr_attendance',
  LEAVES: 'hr_leaves',
  PAYROLLS: 'hr_payrolls',
  JOBS: 'hr_jobs',
  APPLICANTS: 'hr_applicants',
  TICKETS: 'hr_tickets',
  ASSETS: 'hr_assets',
  ANNOUNCEMENTS: 'hr_announcements',
  SETTINGS: 'hr_settings',
  LEADS: 'hr_leads',
  ACCOUNTS: 'hr_accounts',
  CONTACTS: 'hr_contacts',
  REPORTS: 'hr_reports',
  CALENDAR_EVENTS: 'hr_calendar_events',
  CURRENT_USER: 'hr_current_user',
} as const;

export function getAll<T = any>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function setAll<T = any>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getById<T extends { id: string }>(key: string, id: string): T | undefined {
  return getAll<T>(key).find(item => item.id === id);
}

export function add<T>(key: string, item: T) {
  const data = getAll(key);
  data.push(item);
  setAll(key, data);
}

export function update(key: string, id: string, updates: Record<string, any>) {
  const data = getAll<any>(key).map((item: any) =>
    item.id === id ? { ...item, ...updates } : item
  );
  setAll(key, data);
}

export function remove(key: string, id: string) {
  const data = getAll<{ id: string }>(key).filter(item => item.id !== id);
  setAll(key, data);
}

export function exportAllJSON(): string {
  const allKeys = Object.values(KEYS).filter(k => k !== KEYS.CURRENT_USER);
  const data: Record<string, any> = {};
  allKeys.forEach(k => { data[k] = getAll(k); });
  return JSON.stringify(data, null, 2);
}

export function importAllJSON(json: string) {
  const data = JSON.parse(json);
  Object.entries(data).forEach(([key, value]) => {
    if (key !== KEYS.CURRENT_USER) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  });
}

export function exportCSV(data: any[], columns: { key: string; label: string }[]): string {
  const header = columns.map(c => c.label).join(',');
  const rows = data.map(item =>
    columns.map(c => {
      const val = String(item[c.key] ?? '').replace(/"/g, '""');
      return `"${val}"`;
    }).join(',')
  );
  return [header, ...rows].join('\n');
}

export function downloadFile(content: string, filename: string, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
