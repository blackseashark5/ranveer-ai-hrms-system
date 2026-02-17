import { useEffect, useState } from 'react';
import { getAll, add, update, KEYS, exportCSV, downloadFile } from '@/lib/storage';
import { getCurrentUser } from '@/lib/auth';
import { Clock, Download, LogIn, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const Attendance = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [todayRecord, setTodayRecord] = useState<any>(null);
  const user = getCurrentUser();
  const today = new Date().toISOString().split('T')[0];
  const isAdmin = user?.role === 'admin' || user?.role === 'hr';

  const load = () => {
    const att = getAll(KEYS.ATTENDANCE);
    const emps = getAll(KEYS.EMPLOYEES);
    setRecords(att);
    setEmployees(emps);
    const myRecord = att.find((a: any) => a.date === today && a.userId === (user?.employeeId || user?.id));
    setTodayRecord(myRecord || null);
  };

  useEffect(load, []);

  const clockIn = () => {
    const now = new Date();
    const id = `att_${today}_${user?.employeeId || user?.id}`;
    const record = { id, userId: user?.employeeId || user?.id, date: today, clockIn: now.toISOString(), clockOut: '', status: 'present', notes: '' };
    add(KEYS.ATTENDANCE, record);
    toast.success('Clocked in at ' + now.toLocaleTimeString());
    load();
  };

  const clockOut = () => {
    if (todayRecord) {
      update(KEYS.ATTENDANCE, todayRecord.id, { clockOut: new Date().toISOString() });
      toast.success('Clocked out at ' + new Date().toLocaleTimeString());
      load();
    }
  };

  const handleExport = () => {
    const csv = exportCSV(records, [
      { key: 'userId', label: 'Employee ID' }, { key: 'date', label: 'Date' },
      { key: 'clockIn', label: 'Clock In' }, { key: 'clockOut', label: 'Clock Out' }, { key: 'status', label: 'Status' },
    ]);
    downloadFile(csv, `attendance_${today}.csv`, 'text/csv');
    toast.success('Exported');
  };

  const todayRecords = records.filter((r: any) => r.date === today);
  const getEmpName = (id: string) => {
    const emp = employees.find((e: any) => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : id;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-header mb-0">Attendance</h1>
        <button onClick={handleExport} className="btn-ghost text-xs"><Download size={16} /> Export CSV</button>
      </div>

      {/* Clock In/Out Card */}
      <div className="card-section">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="text-center">
            <Clock size={40} className="text-accent mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex gap-3">
            {!todayRecord ? (
              <button onClick={clockIn} className="btn-primary"><LogIn size={16} /> Clock In</button>
            ) : !todayRecord.clockOut ? (
              <button onClick={clockOut} className="btn-primary"><LogOut size={16} /> Clock Out</button>
            ) : (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Today's shift completed</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(todayRecord.clockIn).toLocaleTimeString()} — {new Date(todayRecord.clockOut).toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>
          {todayRecord && (
            <div className="text-sm">
              <span className="badge-active">Clocked In</span>
              <p className="text-xs text-muted-foreground mt-1">at {new Date(todayRecord.clockIn).toLocaleTimeString()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Today's Records (Admin) */}
      {isAdmin && (
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Today's Attendance ({todayRecords.length} records)</h2>
          <div className="data-table overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Employee</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Clock In</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Clock Out</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              </tr></thead>
              <tbody>
                {todayRecords.map((r: any) => (
                  <tr key={r.id} className="border-b border-border">
                    <td className="p-3 font-medium">{getEmpName(r.userId)}</td>
                    <td className="p-3">{r.clockIn ? new Date(r.clockIn).toLocaleTimeString() : '—'}</td>
                    <td className="p-3">{r.clockOut ? new Date(r.clockOut).toLocaleTimeString() : '—'}</td>
                    <td className="p-3"><span className={r.status === 'present' ? 'badge-active' : r.status === 'absent' ? 'badge-inactive' : 'badge-pending'}>{r.status}</span></td>
                  </tr>
                ))}
                {todayRecords.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No attendance records for today</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
