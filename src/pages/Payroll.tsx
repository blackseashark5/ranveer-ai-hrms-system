import { useEffect, useState } from 'react';
import { getAll, KEYS, exportCSV, downloadFile } from '@/lib/storage';
import { getCurrentUser } from '@/lib/auth';
import { Download, FileText } from 'lucide-react';
import { toast } from 'sonner';

const Payroll = () => {
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin' || user?.role === 'hr';

  useEffect(() => {
    const p = getAll(KEYS.PAYROLLS);
    const e = getAll(KEYS.EMPLOYEES);
    setPayrolls(isAdmin ? p : p.filter((pay: any) => pay.userId === (user?.employeeId || user?.id)));
    setEmployees(e);
  }, []);

  const getEmpName = (id: string) => {
    const emp = employees.find((e: any) => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : id;
  };

  const handleExport = () => {
    const csv = exportCSV(payrolls, [
      { key: 'userId', label: 'Employee ID' }, { key: 'month', label: 'Month' },
      { key: 'basic', label: 'Basic' }, { key: 'hra', label: 'HRA' }, { key: 'allowance', label: 'Allowance' },
      { key: 'tax', label: 'Tax' }, { key: 'pf', label: 'PF' }, { key: 'netPay', label: 'Net Pay' }, { key: 'status', label: 'Status' },
    ]);
    downloadFile(csv, 'payroll.csv', 'text/csv');
    toast.success('Exported');
  };

  const printPayslip = (pay: any) => {
    const emp = employees.find((e: any) => e.id === pay.userId);
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(`
        <html><head><title>Payslip - ${emp?.firstName} ${emp?.lastName}</title>
        <style>body{font-family:sans-serif;padding:40px;max-width:700px;margin:auto}h1{color:#58b0e6}table{width:100%;border-collapse:collapse;margin:20px 0}td,th{padding:10px;border:1px solid #ddd;text-align:left}.total{font-weight:bold;font-size:18px;color:#e63946}</style></head>
        <body><h1>Payslip</h1><p><strong>${emp?.firstName} ${emp?.lastName}</strong> (${emp?.empId})<br>${emp?.designation} · ${emp?.department}<br>Month: ${pay.month}</p>
        <table><tr><th>Component</th><th>Amount (₹)</th></tr>
        <tr><td>Basic</td><td>${pay.basic?.toLocaleString()}</td></tr>
        <tr><td>HRA</td><td>${pay.hra?.toLocaleString()}</td></tr>
        <tr><td>Allowance</td><td>${pay.allowance?.toLocaleString()}</td></tr>
        <tr><td>Bonus</td><td>${pay.bonus?.toLocaleString()}</td></tr>
        <tr><td>Deductions</td><td>-${pay.deductions?.toLocaleString()}</td></tr>
        <tr><td>Tax</td><td>-${pay.tax?.toLocaleString()}</td></tr>
        <tr><td>PF</td><td>-${pay.pf?.toLocaleString()}</td></tr>
        <tr><td class="total">Net Pay</td><td class="total">${pay.netPay?.toLocaleString()}</td></tr></table>
        <p style="color:#999;font-size:12px">Generated on ${new Date().toLocaleDateString()}</p></body></html>
      `);
      w.document.close();
      w.print();
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="page-header mb-0">Payroll</h1>
        <button onClick={handleExport} className="btn-ghost text-xs"><Download size={16} /> Export CSV</button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-xs text-muted-foreground">Total Payroll</p>
          <p className="text-xl font-bold text-foreground">₹{payrolls.reduce((s, p) => s + (p.netPay || 0), 0).toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground">Paid</p>
          <p className="text-xl font-bold text-emerald-600">{payrolls.filter(p => p.status === 'paid').length}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground">Pending</p>
          <p className="text-xl font-bold text-amber-500">{payrolls.filter(p => p.status === 'pending').length}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground">Avg. Net Pay</p>
          <p className="text-xl font-bold text-foreground">₹{payrolls.length ? Math.round(payrolls.reduce((s, p) => s + (p.netPay || 0), 0) / payrolls.length).toLocaleString() : 0}</p>
        </div>
      </div>

      {/* Table */}
      <div className="data-table overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left p-3 font-medium text-muted-foreground">Employee</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Month</th>
            <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Basic</th>
            <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">HRA</th>
            <th className="text-left p-3 font-medium text-muted-foreground hidden lg:table-cell">Tax</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Net Pay</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
            <th className="text-right p-3 font-medium text-muted-foreground">Payslip</th>
          </tr></thead>
          <tbody>
            {payrolls.map(p => (
              <tr key={p.id} className="border-b border-border hover:bg-muted/30">
                <td className="p-3 font-medium">{getEmpName(p.userId)}</td>
                <td className="p-3">{p.month}</td>
                <td className="p-3 hidden md:table-cell">₹{p.basic?.toLocaleString()}</td>
                <td className="p-3 hidden md:table-cell">₹{p.hra?.toLocaleString()}</td>
                <td className="p-3 hidden lg:table-cell">₹{p.tax?.toLocaleString()}</td>
                <td className="p-3 font-semibold">₹{p.netPay?.toLocaleString()}</td>
                <td className="p-3"><span className={p.status === 'paid' ? 'badge-approved' : 'badge-pending'}>{p.status}</span></td>
                <td className="p-3 text-right">
                  <button onClick={() => printPayslip(p)} className="p-1.5 hover:bg-muted rounded-lg text-accent" title="View Payslip"><FileText size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payroll;
