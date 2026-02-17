import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAll, setAll, remove, add, update, KEYS, exportCSV, downloadFile } from '@/lib/storage';
import { getCurrentUser } from '@/lib/auth';
import { Search, Plus, Download, Trash2, Edit, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface Employee {
  id: string; empId: string; firstName: string; lastName: string; email: string; phone: string;
  department: string; designation: string; role: string; salary: any; joinDate: string; status: string;
}

const DEPARTMENTS = ['Engineering','HR','Finance','Marketing','Operations','Design','Sales'];
const PER_PAGE = 8;

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', department:'Engineering', designation:'', role:'employee', joinDate:'', status:'active', basic:'', hra:'', allowance:'', deductions:'' });
  const user = getCurrentUser();
  const canEdit = user?.role === 'admin' || user?.role === 'hr';

  const load = () => setEmployees(getAll<Employee>(KEYS.EMPLOYEES));
  useEffect(load, []);

  const filtered = employees.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${e.firstName} ${e.lastName} ${e.email} ${e.empId} ${e.department}`.toLowerCase().includes(q);
    const matchDept = !deptFilter || e.department === deptFilter;
    const matchStatus = !statusFilter || e.status === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openAdd = () => {
    setEditId(null);
    setForm({ firstName:'', lastName:'', email:'', phone:'', department:'Engineering', designation:'', role:'employee', joinDate:new Date().toISOString().split('T')[0], status:'active', basic:'', hra:'', allowance:'', deductions:'' });
    setShowModal(true);
  };

  const openEdit = (emp: Employee) => {
    setEditId(emp.id);
    setForm({ firstName: emp.firstName, lastName: emp.lastName, email: emp.email, phone: emp.phone, department: emp.department, designation: emp.designation, role: emp.role, joinDate: emp.joinDate, status: emp.status, basic: String(emp.salary?.basic || ''), hra: String(emp.salary?.hra || ''), allowance: String(emp.salary?.allowance || ''), deductions: String(emp.salary?.deductions || '') });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email) {
      toast.error('Please fill required fields');
      return;
    }
    const salary = { basic: Number(form.basic) || 0, hra: Number(form.hra) || 0, allowance: Number(form.allowance) || 0, deductions: Number(form.deductions) || 0 };
    if (editId) {
      update(KEYS.EMPLOYEES, editId, { ...form, salary });
      toast.success('Employee updated');
    } else {
      const newEmp: Employee = { ...form, salary, id: 'emp_' + Date.now(), empId: 'E-' + (1000 + employees.length + 1) };
      add(KEYS.EMPLOYEES, newEmp);
      toast.success('Employee added');
    }
    setShowModal(false);
    load();
  };

  const handleDelete = () => {
    if (deleteId) {
      remove(KEYS.EMPLOYEES, deleteId);
      toast.success('Employee deleted');
      setDeleteId(null);
      load();
    }
  };

  const handleExportCSV = () => {
    const csv = exportCSV(filtered, [
      { key: 'empId', label: 'Emp ID' }, { key: 'firstName', label: 'First Name' }, { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email' }, { key: 'department', label: 'Department' }, { key: 'designation', label: 'Designation' },
      { key: 'status', label: 'Status' }, { key: 'joinDate', label: 'Join Date' },
    ]);
    downloadFile(csv, 'employees.csv', 'text/csv');
    toast.success('CSV exported');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="page-header mb-0">Employees</h1>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="btn-ghost text-xs"><Download size={16} /> CSV</button>
          {canEdit && <button onClick={openAdd} className="btn-primary text-xs"><Plus size={16} /> Add Employee</button>}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="input-field pl-9" placeholder="Search employees..." />
        </div>
        <select value={deptFilter} onChange={e => { setDeptFilter(e.target.value); setPage(1); }} className="input-field w-auto">
          <option value="">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="input-field w-auto">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="data-table overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left p-3 font-medium text-muted-foreground">Emp ID</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
              <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Department</th>
              <th className="text-left p-3 font-medium text-muted-foreground hidden lg:table-cell">Designation</th>
              <th className="text-left p-3 font-medium text-muted-foreground hidden lg:table-cell">Email</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(emp => (
              <tr key={emp.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="p-3 font-mono text-xs">{emp.empId}</td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/30 flex items-center justify-center text-xs font-bold text-accent-foreground shrink-0">
                      {emp.firstName[0]}{emp.lastName[0]}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{emp.firstName} {emp.lastName}</div>
                      <div className="text-xs text-muted-foreground md:hidden">{emp.department}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-muted-foreground hidden md:table-cell">{emp.department}</td>
                <td className="p-3 text-muted-foreground hidden lg:table-cell">{emp.designation}</td>
                <td className="p-3 text-muted-foreground hidden lg:table-cell">{emp.email}</td>
                <td className="p-3">
                  <span className={emp.status === 'active' ? 'badge-active' : 'badge-inactive'}>{emp.status}</span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link to={`/employee/${emp.id}`} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"><Eye size={15} /></Link>
                    {canEdit && <button onClick={() => openEdit(emp)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"><Edit size={15} /></button>}
                    {canEdit && <button onClick={() => setDeleteId(emp.id)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-primary"><Trash2 size={15} /></button>}
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No employees found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages} ({filtered.length} results)</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost p-2"><ChevronLeft size={16} /></button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-ghost p-2"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-foreground/30 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-card rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">{editId ? 'Edit Employee' : 'Add Employee'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-muted rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-foreground mb-1">First Name *</label><input value={form.firstName} onChange={e => setForm(f => ({...f, firstName: e.target.value}))} className="input-field" /></div>
                <div><label className="block text-xs font-medium text-foreground mb-1">Last Name *</label><input value={form.lastName} onChange={e => setForm(f => ({...f, lastName: e.target.value}))} className="input-field" /></div>
              </div>
              <div><label className="block text-xs font-medium text-foreground mb-1">Email *</label><input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="input-field" /></div>
              <div><label className="block text-xs font-medium text-foreground mb-1">Phone</label><input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} className="input-field" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-foreground mb-1">Department</label>
                  <select value={form.department} onChange={e => setForm(f => ({...f, department: e.target.value}))} className="input-field">
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-medium text-foreground mb-1">Designation</label><input value={form.designation} onChange={e => setForm(f => ({...f, designation: e.target.value}))} className="input-field" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-foreground mb-1">Join Date</label><input type="date" value={form.joinDate} onChange={e => setForm(f => ({...f, joinDate: e.target.value}))} className="input-field" /></div>
                <div><label className="block text-xs font-medium text-foreground mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))} className="input-field">
                    <option value="active">Active</option><option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="border-t border-border pt-3 mt-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">Salary Components</p>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs text-muted-foreground mb-1">Basic</label><input type="number" value={form.basic} onChange={e => setForm(f => ({...f, basic: e.target.value}))} className="input-field" /></div>
                  <div><label className="block text-xs text-muted-foreground mb-1">HRA</label><input type="number" value={form.hra} onChange={e => setForm(f => ({...f, hra: e.target.value}))} className="input-field" /></div>
                  <div><label className="block text-xs text-muted-foreground mb-1">Allowance</label><input type="number" value={form.allowance} onChange={e => setForm(f => ({...f, allowance: e.target.value}))} className="input-field" /></div>
                  <div><label className="block text-xs text-muted-foreground mb-1">Deductions</label><input type="number" value={form.deductions} onChange={e => setForm(f => ({...f, deductions: e.target.value}))} className="input-field" /></div>
                </div>
              </div>
              <div className="flex gap-2 pt-3">
                <button type="submit" className="btn-primary flex-1">{editId ? 'Update' : 'Add Employee'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-foreground/30 z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-card rounded-xl shadow-xl w-full max-w-sm p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-foreground mb-2">Delete Employee?</h3>
            <p className="text-sm text-muted-foreground mb-5">This action cannot be undone. The employee record will be permanently removed.</p>
            <div className="flex gap-2">
              <button onClick={handleDelete} className="btn-primary flex-1">Delete</button>
              <button onClick={() => setDeleteId(null)} className="btn-ghost flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
