import { useEffect, useState } from 'react';
import { getAll, add, update, KEYS } from '@/lib/storage';
import { getCurrentUser } from '@/lib/auth';
import { Plus, Briefcase, Users, X } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_FLOW = ['applied', 'screening', 'interview', 'offer', 'rejected'];

const Recruitment = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobForm, setJobForm] = useState({ title: '', department: 'Engineering', location: '', experience: '', description: '' });
  const user = getCurrentUser();
  const canEdit = user?.role === 'admin' || user?.role === 'hr';

  const load = () => { setJobs(getAll(KEYS.JOBS)); setApplicants(getAll(KEYS.APPLICANTS)); };
  useEffect(load, []);

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title) { toast.error('Title required'); return; }
    add(KEYS.JOBS, { id: 'job_' + Date.now(), ...jobForm, status: 'open', postedAt: new Date().toISOString() });
    toast.success('Job posted');
    setShowJobModal(false);
    setJobForm({ title: '', department: 'Engineering', location: '', experience: '', description: '' });
    load();
  };

  const updateApplicantStatus = (id: string, status: string) => {
    update(KEYS.APPLICANTS, id, { status });
    toast.success('Status updated');
    load();
  };

  const jobApplicants = selectedJob ? applicants.filter(a => a.jobId === selectedJob) : applicants;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="page-header mb-0">Recruitment</h1>
        {canEdit && <button onClick={() => setShowJobModal(true)} className="btn-primary text-xs"><Plus size={16} /> Post Job</button>}
      </div>

      {/* Job Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map(job => {
          const appCount = applicants.filter(a => a.jobId === job.id).length;
          return (
            <div key={job.id} onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)} className={`card-section cursor-pointer transition-all ${selectedJob === job.id ? 'ring-2 ring-accent' : 'hover:shadow-md'}`}>
              <div className="flex items-start justify-between mb-2">
                <Briefcase size={18} className="text-accent mt-0.5" />
                <span className={job.status === 'open' ? 'badge-active' : 'badge-inactive'}>{job.status}</span>
              </div>
              <h3 className="font-semibold text-foreground">{job.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{job.department} · {job.location} · {job.experience}</p>
              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <Users size={13} /> {appCount} applicant{appCount !== 1 ? 's' : ''}
              </div>
            </div>
          );
        })}
      </div>

      {/* Applicants Table */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">
          {selectedJob ? `Applicants for ${jobs.find(j => j.id === selectedJob)?.title}` : 'All Applicants'} ({jobApplicants.length})
        </h2>
        <div className="data-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/50">
              <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
              <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Position</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              {canEdit && <th className="text-right p-3 font-medium text-muted-foreground">Action</th>}
            </tr></thead>
            <tbody>
              {jobApplicants.map(app => (
                <tr key={app.id} className="border-b border-border">
                  <td className="p-3 font-medium">{app.name}</td>
                  <td className="p-3 text-muted-foreground">{app.email}</td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{jobs.find(j => j.id === app.jobId)?.title || '—'}</td>
                  <td className="p-3"><span className={app.status === 'offer' ? 'badge-approved' : app.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}>{app.status}</span></td>
                  {canEdit && (
                    <td className="p-3 text-right">
                      <select value={app.status} onChange={e => updateApplicantStatus(app.id, e.target.value)} className="input-field w-auto text-xs py-1">
                        {STATUS_FLOW.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  )}
                </tr>
              ))}
              {jobApplicants.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No applicants</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-foreground/30 z-50 flex items-center justify-center p-4" onClick={() => setShowJobModal(false)}>
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">Post New Job</h2>
              <button onClick={() => setShowJobModal(false)} className="p-1 hover:bg-muted rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddJob} className="space-y-3">
              <div><label className="block text-sm font-medium text-foreground mb-1">Title *</label><input value={jobForm.title} onChange={e => setJobForm(f => ({...f, title: e.target.value}))} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Department</label>
                <select value={jobForm.department} onChange={e => setJobForm(f => ({...f, department: e.target.value}))} className="input-field">
                  {['Engineering','HR','Finance','Marketing','Operations','Design','Sales'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-foreground mb-1">Location</label><input value={jobForm.location} onChange={e => setJobForm(f => ({...f, location: e.target.value}))} className="input-field" /></div>
                <div><label className="block text-sm font-medium text-foreground mb-1">Experience</label><input value={jobForm.experience} onChange={e => setJobForm(f => ({...f, experience: e.target.value}))} className="input-field" /></div>
              </div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Description</label><textarea value={jobForm.description} onChange={e => setJobForm(f => ({...f, description: e.target.value}))} className="input-field min-h-[80px]" /></div>
              <button type="submit" className="btn-primary w-full">Post Job</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recruitment;
