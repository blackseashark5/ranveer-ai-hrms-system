import { useEffect, useState } from 'react';
import { KEYS, exportAllJSON, importAllJSON, downloadFile } from '@/lib/storage';
import { getCurrentUser } from '@/lib/auth';
import { Download, Upload, Save, Shield } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const [settings, setSettings] = useState<any>({});
  const [tab, setTab] = useState('general');
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEYS.SETTINGS);
      if (s) setSettings(JSON.parse(s));
    } catch {}
  }, []);

  const saveSettings = () => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    toast.success('Settings saved');
  };

  const handleExport = () => {
    const json = exportAllJSON();
    const date = new Date().toISOString().split('T')[0];
    downloadFile(json, `hr_export_${date}.json`, 'application/json');
    toast.success('Data exported');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          importAllJSON(ev.target?.result as string);
          toast.success('Data imported successfully. Refresh to see changes.');
        } catch {
          toast.error('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const tabs = [
    { key: 'general', label: 'General' },
    { key: 'roles', label: 'Roles & Permissions' },
    { key: 'backup', label: 'Backup & Restore' },
    { key: 'profile', label: 'Profile' },
  ];

  return (
    <div className="space-y-5">
      <h1 className="page-header">Settings</h1>

      <div className="flex gap-1 border-b border-border">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? 'border-accent text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="animate-fade-in">
        {tab === 'general' && (
          <div className="card-section max-w-lg space-y-4">
            <h3 className="font-semibold text-foreground">System Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Work Hours Start</label>
                <input type="time" value={settings.workHoursStart || '09:00'} onChange={e => setSettings((s: any) => ({...s, workHoursStart: e.target.value}))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Work Hours End</label>
                <input type="time" value={settings.workHoursEnd || '18:00'} onChange={e => setSettings((s: any) => ({...s, workHoursEnd: e.target.value}))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Leave Accrual/Month</label>
                <input type="number" step="0.5" value={settings.leaveAccrualPerMonth || 1.5} onChange={e => setSettings((s: any) => ({...s, leaveAccrualPerMonth: Number(e.target.value)}))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Tax %</label>
                <input type="number" value={settings.taxPercentage || 10} onChange={e => setSettings((s: any) => ({...s, taxPercentage: Number(e.target.value)}))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">PF %</label>
                <input type="number" value={settings.pfPercentage || 4} onChange={e => setSettings((s: any) => ({...s, pfPercentage: Number(e.target.value)}))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Session Timeout (min)</label>
                <input type="number" value={settings.sessionTimeout || 30} onChange={e => setSettings((s: any) => ({...s, sessionTimeout: Number(e.target.value)}))} className="input-field" />
              </div>
            </div>
            <button onClick={saveSettings} className="btn-primary"><Save size={16} /> Save Settings</button>
          </div>
        )}

        {tab === 'roles' && (
          <div className="card-section">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Shield size={18} className="text-accent" /> Role Permissions</h3>
            {!isAdmin && <p className="text-sm text-muted-foreground">Only admins can manage roles.</p>}
            {isAdmin && settings.roles && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border">
                    <th className="text-left p-2 font-medium text-muted-foreground">Module</th>
                    {settings.roles.map((r: any) => <th key={r.id} className="text-center p-2 font-medium text-muted-foreground capitalize">{r.name}</th>)}
                  </tr></thead>
                  <tbody>
                    {['employees','attendance','leave','payroll','recruitment','tickets','performance','assets','announcements','settings'].map(mod => (
                      <tr key={mod} className="border-b border-border">
                        <td className="p-2 capitalize font-medium">{mod}</td>
                        {settings.roles.map((r: any) => (
                          <td key={r.id} className="p-2 text-center text-xs text-muted-foreground">{r.permissions?.[mod] || '—'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-muted-foreground mt-3">c = create, r = read, u = update, d = delete</p>
              </div>
            )}
          </div>
        )}

        {tab === 'backup' && (
          <div className="card-section max-w-lg space-y-4">
            <h3 className="font-semibold text-foreground">Backup & Restore</h3>
            <p className="text-sm text-muted-foreground">Export all HRMS data as JSON or import from a previous backup.</p>
            <div className="flex gap-3">
              <button onClick={handleExport} className="btn-secondary"><Download size={16} /> Export JSON</button>
              <button onClick={handleImport} className="btn-secondary"><Upload size={16} /> Import JSON</button>
            </div>
          </div>
        )}

        {tab === 'profile' && (
          <div className="card-section max-w-lg space-y-4">
            <h3 className="font-semibold text-foreground">Your Profile</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">{user?.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="text-sm font-medium text-foreground capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
