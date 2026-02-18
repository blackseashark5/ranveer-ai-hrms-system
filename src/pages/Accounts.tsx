import { useState, useEffect } from 'react';
import { getAll, add, update, remove, KEYS, exportCSV, downloadFile } from '@/lib/storage';
import { Search, Plus, Pencil, Trash2, Download, X, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Account {
  id: string;
  accountName: string;
  accountNumber: string;
  accountOwner: string;
  accountType: string;
  accountSource: string;
  annualRevenue: number;
  createdAt: string;
}

interface Contact {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  createdAt: string;
}

const TYPES = ['Customer', 'Prospect', 'Partner', 'Vendor', 'Other'];
const ACC_SOURCES = ['Website', 'Referral', 'Event', 'Campaign', 'Direct'];

const Accounts = () => {
  const [tab, setTab] = useState<'accounts' | 'contacts'>('accounts');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [accForm, setAccForm] = useState({ accountName: '', accountNumber: '', accountOwner: '', accountType: 'Customer', accountSource: 'Website', annualRevenue: 0 });
  const [conForm, setConForm] = useState({ accountId: '', firstName: '', lastName: '', email: '', phone: '', designation: '' });
  const [page, setPage] = useState(1);
  const perPage = 10;

  const load = () => { setAccounts(getAll<Account>(KEYS.ACCOUNTS)); setContacts(getAll<Contact>(KEYS.CONTACTS)); };
  useEffect(() => { load(); }, []);

  const filteredAccounts = accounts.filter(a => !search || a.accountName.toLowerCase().includes(search.toLowerCase()) || a.accountOwner.toLowerCase().includes(search.toLowerCase()));
  const filteredContacts = contacts.filter(c => !search || c.firstName.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  const items = tab === 'accounts' ? filteredAccounts : filteredContacts;
  const totalPages = Math.ceil(items.length / perPage);
  const paginatedAcc = filteredAccounts.slice((page - 1) * perPage, page * perPage);
  const paginatedCon = filteredContacts.slice((page - 1) * perPage, page * perPage);

  const openAdd = () => {
    setEditId(null);
    if (tab === 'accounts') setAccForm({ accountName: '', accountNumber: '', accountOwner: '', accountType: 'Customer', accountSource: 'Website', annualRevenue: 0 });
    else setConForm({ accountId: accounts[0]?.id || '', firstName: '', lastName: '', email: '', phone: '', designation: '' });
    setShowModal(true);
  };

  const openEditAcc = (a: Account) => { setEditId(a.id); setAccForm({ accountName: a.accountName, accountNumber: a.accountNumber, accountOwner: a.accountOwner, accountType: a.accountType, accountSource: a.accountSource, annualRevenue: a.annualRevenue }); setShowModal(true); };
  const openEditCon = (c: Contact) => { setEditId(c.id); setConForm({ accountId: c.accountId, firstName: c.firstName, lastName: c.lastName, email: c.email, phone: c.phone, designation: c.designation }); setShowModal(true); };

  const save = () => {
    if (tab === 'accounts') {
      if (!accForm.accountName) { toast.error('Account name required'); return; }
      if (editId) { update(KEYS.ACCOUNTS, editId, accForm); toast.success('Account updated'); }
      else { add(KEYS.ACCOUNTS, { ...accForm, id: `acc_${Date.now()}`, createdAt: new Date().toISOString() }); toast.success('Account added'); }
    } else {
      if (!conForm.firstName || !conForm.email) { toast.error('Name and email required'); return; }
      if (editId) { update(KEYS.CONTACTS, editId, conForm); toast.success('Contact updated'); }
      else { add(KEYS.CONTACTS, { ...conForm, id: `con_${Date.now()}`, createdAt: new Date().toISOString() }); toast.success('Contact added'); }
    }
    setShowModal(false); load();
  };

  const del = (key: string, id: string) => { if (confirm('Delete?')) { remove(key, id); load(); toast.success('Deleted'); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="page-header mb-0">Accounts</h1>
        <button onClick={openAdd} className="btn-primary"><Plus size={16} /> New</button>
      </div>

      <div className="flex gap-2 mb-2">
        <button onClick={() => { setTab('accounts'); setPage(1); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'accounts' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>Accounts</button>
        <button onClick={() => { setTab('contacts'); setPage(1); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'contacts' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>Contacts</button>
      </div>

      <div className="card-section">
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className="input-field pl-9" placeholder={`Search ${tab}...`} value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-3">Select ({items.length})</div>

        {tab === 'accounts' ? (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr className="bg-primary/5">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary">Account Name ↕</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary">Account Number ↕</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary">Account Owner ↕</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary">Account Type ↕</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary">Account Source ↕</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary">Annual Revenue</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAcc.map(a => (
                  <tr key={a.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-accent">{a.accountName}</td>
                    <td className="px-4 py-3 text-sm">{a.accountNumber}</td>
                    <td className="px-4 py-3 text-sm">{a.accountOwner}</td>
                    <td className="px-4 py-3 text-sm">{a.accountType}</td>
                    <td className="px-4 py-3 text-sm">{a.accountSource}</td>
                    <td className="px-4 py-3 text-sm">{a.annualRevenue ? `INR ${a.annualRevenue.toLocaleString()}` : '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEditAcc(a)} className="p-1.5 hover:bg-muted rounded-lg"><Pencil size={14} /></button>
                        <button onClick={() => del(KEYS.ACCOUNTS, a.id)} className="p-1.5 hover:bg-red-50 text-destructive rounded-lg"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedAcc.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No accounts found</td></tr>}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr className="bg-primary/5">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary">First Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary">Last Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary">Designation</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary">Account</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCon.map(c => (
                  <tr key={c.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 text-sm">{c.firstName}</td>
                    <td className="px-4 py-3 text-sm">{c.lastName}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{c.email}</td>
                    <td className="px-4 py-3 text-sm">{c.phone}</td>
                    <td className="px-4 py-3 text-sm">{c.designation}</td>
                    <td className="px-4 py-3 text-sm">{accounts.find(a => a.id === c.accountId)?.accountName || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEditCon(c)} className="p-1.5 hover:bg-muted rounded-lg"><Pencil size={14} /></button>
                        <button onClick={() => del(KEYS.CONTACTS, c.id)} className="p-1.5 hover:bg-red-50 text-destructive rounded-lg"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedCon.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No contacts found</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded-lg text-xs font-medium ${page === i + 1 ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-foreground/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-card rounded-xl shadow-xl w-full max-w-lg p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold">{editId ? 'Edit' : 'New'} {tab === 'accounts' ? 'Account' : 'Contact'}</h2>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            {tab === 'accounts' ? (
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-muted-foreground">Account Name *</label><input className="input-field mt-1" value={accForm.accountName} onChange={e => setAccForm({ ...accForm, accountName: e.target.value })} /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Account Number</label><input className="input-field mt-1" value={accForm.accountNumber} onChange={e => setAccForm({ ...accForm, accountNumber: e.target.value })} /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Account Owner</label><input className="input-field mt-1" value={accForm.accountOwner} onChange={e => setAccForm({ ...accForm, accountOwner: e.target.value })} /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Account Type</label><select className="input-field mt-1" value={accForm.accountType} onChange={e => setAccForm({ ...accForm, accountType: e.target.value })}>{TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
                <div><label className="text-xs font-medium text-muted-foreground">Account Source</label><select className="input-field mt-1" value={accForm.accountSource} onChange={e => setAccForm({ ...accForm, accountSource: e.target.value })}>{ACC_SOURCES.map(s => <option key={s}>{s}</option>)}</select></div>
                <div><label className="text-xs font-medium text-muted-foreground">Annual Revenue</label><input className="input-field mt-1" type="number" value={accForm.annualRevenue} onChange={e => setAccForm({ ...accForm, annualRevenue: Number(e.target.value) })} /></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-muted-foreground">First Name *</label><input className="input-field mt-1" value={conForm.firstName} onChange={e => setConForm({ ...conForm, firstName: e.target.value })} /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Last Name</label><input className="input-field mt-1" value={conForm.lastName} onChange={e => setConForm({ ...conForm, lastName: e.target.value })} /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Email *</label><input className="input-field mt-1" type="email" value={conForm.email} onChange={e => setConForm({ ...conForm, email: e.target.value })} /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Phone</label><input className="input-field mt-1" value={conForm.phone} onChange={e => setConForm({ ...conForm, phone: e.target.value })} /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Designation</label><input className="input-field mt-1" value={conForm.designation} onChange={e => setConForm({ ...conForm, designation: e.target.value })} /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Account</label><select className="input-field mt-1" value={conForm.accountId} onChange={e => setConForm({ ...conForm, accountId: e.target.value })}><option value="">-- Select --</option>{accounts.map(a => <option key={a.id} value={a.id}>{a.accountName}</option>)}</select></div>
              </div>
            )}
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-ghost">Cancel</button>
              <button onClick={save} className="btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
