import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getById, getAll, KEYS } from '@/lib/storage';
import { ArrowLeft, Mail, Phone, Building, Calendar, Briefcase } from 'lucide-react';

const EmployeeProfile = () => {
  const { id } = useParams();
  const [emp, setEmp] = useState<any>(null);
  const [tab, setTab] = useState('personal');
  const [attendance, setAttendance] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [payrolls, setPayrolls] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      setEmp(getById(KEYS.EMPLOYEES, id));
      setAttendance(getAll(KEYS.ATTENDANCE).filter((a: any) => a.userId === id));
      setLeaves(getAll(KEYS.LEAVES).filter((l: any) => l.userId === id));
      setPayrolls(getAll(KEYS.PAYROLLS).filter((p: any) => p.userId === id));
    }
  }, [id]);

  if (!emp) return <div className="p-8 text-center text-muted-foreground">Employee not found</div>;

  const tabs = [
    { key: 'personal', label: 'Personal Info' },
    { key: 'attendance', label: 'Attendance' },
    { key: 'leaves', label: 'Leave History' },
    { key: 'payroll', label: 'Payroll' },
  ];

  return (
    <div className="space-y-5">
      <Link to="/employees" className="inline-flex items-center gap-1 text-sm text-accent hover:underline"><ArrowLeft size={16} /> Back to Employees</Link>

      {/* Header */}
      <div className="card-section flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-16 h-16 rounded-xl bg-accent/30 flex items-center justify-center text-2xl font-bold text-accent-foreground">
          {emp.firstName[0]}{emp.lastName[0]}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">{emp.firstName} {emp.lastName}</h1>
          <p className="text-sm text-muted-foreground">{emp.designation} · {emp.department}</p>
          <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Mail size={13} /> {emp.email}</span>
            <span className="flex items-center gap-1"><Phone size={13} /> {emp.phone}</span>
            <span className="flex items-center gap-1"><Calendar size={13} /> Joined {emp.joinDate}</span>
            <span className="flex items-center gap-1"><Briefcase size={13} /> {emp.empId}</span>
          </div>
        </div>
        <span className={emp.status === 'active' ? 'badge-active' : 'badge-inactive'}>{emp.status}</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? 'border-accent text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {tab === 'personal' && (
          <div className="card-section">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                ['First Name', emp.firstName], ['Last Name', emp.lastName], ['Email', emp.email], ['Phone', emp.phone],
                ['Department', emp.department], ['Designation', emp.designation], ['Role', emp.role], ['Join Date', emp.joinDate],
                ['Status', emp.status], ['Employee ID', emp.empId],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-muted-foreground mb-1">{label}</p>
                  <p className="text-sm font-medium text-foreground capitalize">{value}</p>
                </div>
              ))}
            </div>
            {emp.salary && (
              <div className="mt-6 pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground mb-3">Salary Breakdown</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><p className="text-xs text-muted-foreground">Basic</p><p className="font-medium text-foreground">₹{emp.salary.basic?.toLocaleString()}</p></div>
                  <div><p className="text-xs text-muted-foreground">HRA</p><p className="font-medium text-foreground">₹{emp.salary.hra?.toLocaleString()}</p></div>
                  <div><p className="text-xs text-muted-foreground">Allowance</p><p className="font-medium text-foreground">₹{emp.salary.allowance?.toLocaleString()}</p></div>
                  <div><p className="text-xs text-muted-foreground">Deductions</p><p className="font-medium text-primary">₹{emp.salary.deductions?.toLocaleString()}</p></div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'attendance' && (
          <div className="data-table overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Clock In</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Clock Out</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              </tr></thead>
              <tbody>
                {attendance.map((a: any) => (
                  <tr key={a.id} className="border-b border-border">
                    <td className="p-3">{a.date}</td>
                    <td className="p-3">{a.clockIn ? new Date(a.clockIn).toLocaleTimeString() : '—'}</td>
                    <td className="p-3">{a.clockOut ? new Date(a.clockOut).toLocaleTimeString() : '—'}</td>
                    <td className="p-3"><span className={a.status === 'present' ? 'badge-active' : a.status === 'absent' ? 'badge-inactive' : 'badge-pending'}>{a.status}</span></td>
                  </tr>
                ))}
                {attendance.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No attendance records</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'leaves' && (
          <div className="data-table overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                <th className="text-left p-3 font-medium text-muted-foreground">From</th>
                <th className="text-left p-3 font-medium text-muted-foreground">To</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Days</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              </tr></thead>
              <tbody>
                {leaves.map((l: any) => (
                  <tr key={l.id} className="border-b border-border">
                    <td className="p-3 capitalize">{l.type}</td>
                    <td className="p-3">{l.from}</td>
                    <td className="p-3">{l.to}</td>
                    <td className="p-3">{l.days}</td>
                    <td className="p-3"><span className={l.status === 'approved' ? 'badge-approved' : l.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}>{l.status}</span></td>
                  </tr>
                ))}
                {leaves.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No leave records</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'payroll' && (
          <div className="data-table overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Month</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Basic</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Net Pay</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              </tr></thead>
              <tbody>
                {payrolls.map((p: any) => (
                  <tr key={p.id} className="border-b border-border">
                    <td className="p-3">{p.month}</td>
                    <td className="p-3">₹{p.basic?.toLocaleString()}</td>
                    <td className="p-3 font-medium">₹{p.netPay?.toLocaleString()}</td>
                    <td className="p-3"><span className={p.status === 'paid' ? 'badge-approved' : 'badge-pending'}>{p.status}</span></td>
                  </tr>
                ))}
                {payrolls.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No payroll records</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfile;
