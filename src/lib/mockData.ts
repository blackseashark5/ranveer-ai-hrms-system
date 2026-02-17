import { setAll, getAll, KEYS } from './storage';
import { simpleHash } from './auth';

const employees = [
  { id:'emp_001', empId:'E-1001', firstName:'Ranveer', lastName:'Raj', email:'ranveer@company.test', phone:'+91-9800000001', department:'Engineering', designation:'SDE II', role:'employee', salary:{basic:50000,hra:10000,allowance:5000,deductions:1500}, joinDate:'2024-01-15', status:'active' },
  { id:'emp_002', empId:'E-1002', firstName:'Priya', lastName:'Sharma', email:'priya@company.test', phone:'+91-9800000002', department:'HR', designation:'HR Manager', role:'hr', salary:{basic:60000,hra:12000,allowance:6000,deductions:2000}, joinDate:'2023-06-01', status:'active' },
  { id:'emp_003', empId:'E-1003', firstName:'Amit', lastName:'Patel', email:'amit@company.test', phone:'+91-9800000003', department:'Finance', designation:'Sr. Accountant', role:'employee', salary:{basic:45000,hra:9000,allowance:4500,deductions:1200}, joinDate:'2023-09-10', status:'active' },
  { id:'emp_004', empId:'E-1004', firstName:'Neha', lastName:'Gupta', email:'neha@company.test', phone:'+91-9800000004', department:'Marketing', designation:'Marketing Lead', role:'employee', salary:{basic:55000,hra:11000,allowance:5500,deductions:1700}, joinDate:'2024-03-20', status:'active' },
  { id:'emp_005', empId:'E-1005', firstName:'Vikram', lastName:'Singh', email:'vikram@company.test', phone:'+91-9800000005', department:'Engineering', designation:'Tech Lead', role:'employee', salary:{basic:80000,hra:16000,allowance:8000,deductions:3000}, joinDate:'2022-11-01', status:'active' },
  { id:'emp_006', empId:'E-1006', firstName:'Ananya', lastName:'Reddy', email:'ananya@company.test', phone:'+91-9800000006', department:'Design', designation:'UI/UX Designer', role:'employee', salary:{basic:48000,hra:9600,allowance:4800,deductions:1400}, joinDate:'2024-05-12', status:'active' },
  { id:'emp_007', empId:'E-1007', firstName:'Rohan', lastName:'Mehta', email:'rohan@company.test', phone:'+91-9800000007', department:'Sales', designation:'Sales Executive', role:'employee', salary:{basic:42000,hra:8400,allowance:4200,deductions:1100}, joinDate:'2024-07-01', status:'active' },
  { id:'emp_008', empId:'E-1008', firstName:'Kavitha', lastName:'Nair', email:'kavitha@company.test', phone:'+91-9800000008', department:'Operations', designation:'Ops Manager', role:'employee', salary:{basic:65000,hra:13000,allowance:6500,deductions:2200}, joinDate:'2023-02-15', status:'active' },
  { id:'emp_009', empId:'E-1009', firstName:'Arjun', lastName:'Kumar', email:'arjun@company.test', phone:'+91-9800000009', department:'Engineering', designation:'SDE I', role:'employee', salary:{basic:35000,hra:7000,allowance:3500,deductions:900}, joinDate:'2025-01-10', status:'active' },
  { id:'emp_010', empId:'E-1010', firstName:'Divya', lastName:'Iyer', email:'divya@company.test', phone:'+91-9800000010', department:'HR', designation:'HR Executive', role:'employee', salary:{basic:38000,hra:7600,allowance:3800,deductions:1000}, joinDate:'2024-08-20', status:'active' },
  { id:'emp_011', empId:'E-1011', firstName:'Suresh', lastName:'Pandey', email:'suresh@company.test', phone:'+91-9800000011', department:'Finance', designation:'Finance Manager', role:'admin', salary:{basic:75000,hra:15000,allowance:7500,deductions:2800}, joinDate:'2022-04-01', status:'active' },
  { id:'emp_012', empId:'E-1012', firstName:'Meera', lastName:'Joshi', email:'meera@company.test', phone:'+91-9800000012', department:'Marketing', designation:'Content Writer', role:'employee', salary:{basic:32000,hra:6400,allowance:3200,deductions:800}, joinDate:'2025-02-01', status:'active' },
  { id:'emp_013', empId:'E-1013', firstName:'Rajesh', lastName:'Verma', email:'rajesh@company.test', phone:'+91-9800000013', department:'Engineering', designation:'DevOps Engineer', role:'employee', salary:{basic:62000,hra:12400,allowance:6200,deductions:2100}, joinDate:'2023-10-15', status:'active' },
  { id:'emp_014', empId:'E-1014', firstName:'Sneha', lastName:'Choudhary', email:'sneha@company.test', phone:'+91-9800000014', department:'Design', designation:'UX Researcher', role:'employee', salary:{basic:46000,hra:9200,allowance:4600,deductions:1300}, joinDate:'2024-04-01', status:'active' },
  { id:'emp_015', empId:'E-1015', firstName:'Karthik', lastName:'Rajan', email:'karthik@company.test', phone:'+91-9800000015', department:'Sales', designation:'Sales Manager', role:'employee', salary:{basic:58000,hra:11600,allowance:5800,deductions:1900}, joinDate:'2023-08-01', status:'inactive' },
];

const users = [
  { id:'user_admin', name:'Admin User', email:'admin@company.test', role:'admin', employeeId:'emp_011', password: simpleHash('Password123!'), createdAt:'2022-01-01T00:00:00Z' },
  { id:'user_hr', name:'Priya Sharma', email:'hr@company.test', role:'hr', employeeId:'emp_002', password: simpleHash('Password123!'), createdAt:'2023-06-01T00:00:00Z' },
  { id:'user_emp', name:'Ranveer Raj', email:'emp@company.test', role:'employee', employeeId:'emp_001', password: simpleHash('Password123!'), createdAt:'2024-01-15T00:00:00Z' },
];

const today = new Date().toISOString().split('T')[0];
const attendance = Array.from({ length: 15 }, (_, i) => ({
  id: `att_${today}_emp_${String(i+1).padStart(3,'0')}`,
  userId: `emp_${String(i+1).padStart(3,'0')}`,
  date: today,
  clockIn: i < 12 ? `${today}T09:${String(Math.floor(Math.random()*30)).padStart(2,'0')}:00` : '',
  clockOut: i < 10 ? `${today}T18:${String(Math.floor(Math.random()*30)).padStart(2,'0')}:00` : '',
  status: i < 12 ? 'present' : i < 14 ? 'absent' : 'leave',
  notes: i < 5 ? 'on time' : i < 10 ? 'slightly late' : '',
}));

const leaves = [
  { id:'leave_001', userId:'emp_001', type:'sick', from:'2026-03-01', to:'2026-03-03', days:3, reason:'Fever and cold', status:'pending', appliedAt:'2026-02-25T10:00:00Z', decisionAt:null, approverId:'emp_002' },
  { id:'leave_002', userId:'emp_003', type:'casual', from:'2026-02-20', to:'2026-02-21', days:2, reason:'Family function', status:'approved', appliedAt:'2026-02-15T09:00:00Z', decisionAt:'2026-02-16T11:00:00Z', approverId:'emp_002' },
  { id:'leave_003', userId:'emp_005', type:'paid', from:'2026-03-10', to:'2026-03-14', days:5, reason:'Vacation trip', status:'pending', appliedAt:'2026-02-28T14:00:00Z', decisionAt:null, approverId:'emp_002' },
  { id:'leave_004', userId:'emp_007', type:'sick', from:'2026-02-10', to:'2026-02-11', days:2, reason:'Doctor appointment', status:'approved', appliedAt:'2026-02-08T08:00:00Z', decisionAt:'2026-02-09T10:00:00Z', approverId:'emp_002' },
  { id:'leave_005', userId:'emp_009', type:'casual', from:'2026-02-25', to:'2026-02-25', days:1, reason:'Personal work', status:'rejected', appliedAt:'2026-02-20T11:00:00Z', decisionAt:'2026-02-21T09:00:00Z', approverId:'emp_002' },
  { id:'leave_006', userId:'emp_004', type:'unpaid', from:'2026-04-01', to:'2026-04-05', days:5, reason:'Travel abroad', status:'pending', appliedAt:'2026-03-15T10:00:00Z', decisionAt:null, approverId:'emp_002' },
  { id:'leave_007', userId:'emp_006', type:'sick', from:'2026-01-15', to:'2026-01-16', days:2, reason:'Migraine', status:'approved', appliedAt:'2026-01-14T16:00:00Z', decisionAt:'2026-01-14T17:00:00Z', approverId:'emp_002' },
  { id:'leave_008', userId:'emp_008', type:'casual', from:'2026-02-05', to:'2026-02-06', days:2, reason:'Home repairs', status:'approved', appliedAt:'2026-02-01T09:00:00Z', decisionAt:'2026-02-02T10:00:00Z', approverId:'emp_011' },
  { id:'leave_009', userId:'emp_010', type:'paid', from:'2026-03-20', to:'2026-03-22', days:3, reason:'Wedding ceremony', status:'pending', appliedAt:'2026-03-01T10:00:00Z', decisionAt:null, approverId:'emp_002' },
  { id:'leave_010', userId:'emp_012', type:'sick', from:'2026-02-12', to:'2026-02-12', days:1, reason:'Stomach ache', status:'approved', appliedAt:'2026-02-12T07:00:00Z', decisionAt:'2026-02-12T08:00:00Z', approverId:'emp_002' },
  { id:'leave_011', userId:'emp_002', type:'casual', from:'2026-03-05', to:'2026-03-06', days:2, reason:'Personal errand', status:'pending', appliedAt:'2026-02-28T10:00:00Z', decisionAt:null, approverId:'emp_011' },
  { id:'leave_012', userId:'emp_013', type:'paid', from:'2026-04-10', to:'2026-04-15', days:6, reason:'Annual vacation', status:'pending', appliedAt:'2026-03-10T09:00:00Z', decisionAt:null, approverId:'emp_002' },
  { id:'leave_013', userId:'emp_014', type:'sick', from:'2026-01-20', to:'2026-01-21', days:2, reason:'Back pain', status:'approved', appliedAt:'2026-01-19T18:00:00Z', decisionAt:'2026-01-20T08:00:00Z', approverId:'emp_002' },
  { id:'leave_014', userId:'emp_011', type:'casual', from:'2026-02-28', to:'2026-02-28', days:1, reason:'Bank visit', status:'approved', appliedAt:'2026-02-25T09:00:00Z', decisionAt:'2026-02-25T10:00:00Z', approverId:'emp_002' },
  { id:'leave_015', userId:'emp_015', type:'unpaid', from:'2026-03-01', to:'2026-03-10', days:10, reason:'Extended leave', status:'rejected', appliedAt:'2026-02-20T10:00:00Z', decisionAt:'2026-02-22T11:00:00Z', approverId:'emp_011' },
];

const payrolls = [
  { id:'pay_001', userId:'emp_001', month:'2026-01', basic:50000, hra:10000, allowance:5000, bonus:0, deductions:1500, tax:5000, pf:2000, netPay:56500, status:'paid', paidAt:'2026-02-01T00:00:00Z' },
  { id:'pay_002', userId:'emp_002', month:'2026-01', basic:60000, hra:12000, allowance:6000, bonus:0, deductions:2000, tax:6500, pf:2400, netPay:67100, status:'paid', paidAt:'2026-02-01T00:00:00Z' },
  { id:'pay_003', userId:'emp_005', month:'2026-01', basic:80000, hra:16000, allowance:8000, bonus:5000, deductions:3000, tax:10000, pf:3200, netPay:92800, status:'paid', paidAt:'2026-02-01T00:00:00Z' },
  { id:'pay_004', userId:'emp_003', month:'2026-01', basic:45000, hra:9000, allowance:4500, bonus:0, deductions:1200, tax:4200, pf:1800, netPay:51300, status:'paid', paidAt:'2026-02-01T00:00:00Z' },
  { id:'pay_005', userId:'emp_004', month:'2026-01', basic:55000, hra:11000, allowance:5500, bonus:2000, deductions:1700, tax:5800, pf:2200, netPay:63800, status:'paid', paidAt:'2026-02-01T00:00:00Z' },
  { id:'pay_006', userId:'emp_006', month:'2026-01', basic:48000, hra:9600, allowance:4800, bonus:0, deductions:1400, tax:4500, pf:1920, netPay:54580, status:'paid', paidAt:'2026-02-01T00:00:00Z' },
  { id:'pay_007', userId:'emp_007', month:'2026-01', basic:42000, hra:8400, allowance:4200, bonus:1000, deductions:1100, tax:3800, pf:1680, netPay:49020, status:'paid', paidAt:'2026-02-01T00:00:00Z' },
  { id:'pay_008', userId:'emp_008', month:'2026-01', basic:65000, hra:13000, allowance:6500, bonus:0, deductions:2200, tax:7500, pf:2600, netPay:72200, status:'paid', paidAt:'2026-02-01T00:00:00Z' },
  { id:'pay_009', userId:'emp_009', month:'2026-01', basic:35000, hra:7000, allowance:3500, bonus:0, deductions:900, tax:3000, pf:1400, netPay:40200, status:'pending', paidAt:null },
  { id:'pay_010', userId:'emp_010', month:'2026-01', basic:38000, hra:7600, allowance:3800, bonus:0, deductions:1000, tax:3300, pf:1520, netPay:43580, status:'pending', paidAt:null },
  { id:'pay_011', userId:'emp_011', month:'2026-01', basic:75000, hra:15000, allowance:7500, bonus:3000, deductions:2800, tax:9200, pf:3000, netPay:85500, status:'paid', paidAt:'2026-02-01T00:00:00Z' },
  { id:'pay_012', userId:'emp_012', month:'2026-01', basic:32000, hra:6400, allowance:3200, bonus:0, deductions:800, tax:2500, pf:1280, netPay:37020, status:'pending', paidAt:null },
  { id:'pay_013', userId:'emp_013', month:'2026-01', basic:62000, hra:12400, allowance:6200, bonus:0, deductions:2100, tax:7000, pf:2480, netPay:69020, status:'paid', paidAt:'2026-02-01T00:00:00Z' },
  { id:'pay_014', userId:'emp_014', month:'2026-01', basic:46000, hra:9200, allowance:4600, bonus:0, deductions:1300, tax:4300, pf:1840, netPay:52360, status:'paid', paidAt:'2026-02-01T00:00:00Z' },
  { id:'pay_015', userId:'emp_015', month:'2026-01', basic:58000, hra:11600, allowance:5800, bonus:0, deductions:1900, tax:6200, pf:2320, netPay:64980, status:'paid', paidAt:'2026-02-01T00:00:00Z' },
];

const tickets = [
  { id:'ticket_001', title:'WiFi not working', createdBy:'emp_002', assignedTo:'emp_013', priority:'high', status:'open', category:'IT', messages:[{from:'emp_002',text:'No connectivity since morning',at:'2026-02-16T09:00:00Z'}], createdAt:'2026-02-16T09:00:00Z' },
  { id:'ticket_002', title:'AC not cooling in 3rd floor', createdBy:'emp_004', assignedTo:'emp_008', priority:'medium', status:'in_progress', category:'Facilities', messages:[{from:'emp_004',text:'Temperature too high in our bay',at:'2026-02-15T10:00:00Z'}], createdAt:'2026-02-15T10:00:00Z' },
  { id:'ticket_003', title:'Laptop screen flickering', createdBy:'emp_009', assignedTo:'emp_013', priority:'high', status:'open', category:'IT', messages:[{from:'emp_009',text:'Screen flickers every few minutes',at:'2026-02-14T11:00:00Z'}], createdAt:'2026-02-14T11:00:00Z' },
  { id:'ticket_004', title:'Payslip discrepancy', createdBy:'emp_007', assignedTo:'emp_003', priority:'high', status:'open', category:'Finance', messages:[{from:'emp_007',text:'My bonus was not included in last payslip',at:'2026-02-13T14:00:00Z'}], createdAt:'2026-02-13T14:00:00Z' },
  { id:'ticket_005', title:'Request for standing desk', createdBy:'emp_006', assignedTo:'emp_008', priority:'low', status:'resolved', category:'Facilities', messages:[{from:'emp_006',text:'Would like a standing desk for ergonomics',at:'2026-02-10T09:00:00Z'},{from:'emp_008',text:'Approved. Desk will be delivered next week.',at:'2026-02-11T10:00:00Z'}], createdAt:'2026-02-10T09:00:00Z' },
  { id:'ticket_006', title:'VPN access issue', createdBy:'emp_001', assignedTo:'emp_013', priority:'medium', status:'in_progress', category:'IT', messages:[{from:'emp_001',text:'Cannot connect to VPN from home',at:'2026-02-12T08:00:00Z'}], createdAt:'2026-02-12T08:00:00Z' },
  { id:'ticket_007', title:'Parking spot allocation', createdBy:'emp_005', assignedTo:'emp_008', priority:'low', status:'open', category:'Facilities', messages:[{from:'emp_005',text:'Need a dedicated parking spot',at:'2026-02-11T09:00:00Z'}], createdAt:'2026-02-11T09:00:00Z' },
  { id:'ticket_008', title:'Software license renewal', createdBy:'emp_013', assignedTo:'emp_011', priority:'medium', status:'open', category:'IT', messages:[{from:'emp_013',text:'Figma license expiring next week',at:'2026-02-15T11:00:00Z'}], createdAt:'2026-02-15T11:00:00Z' },
  { id:'ticket_009', title:'ID card replacement', createdBy:'emp_010', assignedTo:'emp_002', priority:'low', status:'resolved', category:'HR', messages:[{from:'emp_010',text:'Lost my ID card, need replacement',at:'2026-02-08T09:00:00Z'},{from:'emp_002',text:'New card issued.',at:'2026-02-09T14:00:00Z'}], createdAt:'2026-02-08T09:00:00Z' },
  { id:'ticket_010', title:'Leave policy clarification', createdBy:'emp_012', assignedTo:'emp_002', priority:'low', status:'open', category:'HR', messages:[{from:'emp_012',text:'How many casual leaves per quarter?',at:'2026-02-16T10:00:00Z'}], createdAt:'2026-02-16T10:00:00Z' },
  { id:'ticket_011', title:'Printer jam on 2nd floor', createdBy:'emp_003', assignedTo:'emp_008', priority:'medium', status:'resolved', category:'Facilities', messages:[{from:'emp_003',text:'Printer keeps jamming',at:'2026-02-07T13:00:00Z'}], createdAt:'2026-02-07T13:00:00Z' },
  { id:'ticket_012', title:'Email not syncing on phone', createdBy:'emp_014', assignedTo:'emp_013', priority:'medium', status:'in_progress', category:'IT', messages:[{from:'emp_014',text:'Outlook not syncing on mobile since yesterday',at:'2026-02-15T16:00:00Z'}], createdAt:'2026-02-15T16:00:00Z' },
  { id:'ticket_013', title:'Reimbursement delay', createdBy:'emp_004', assignedTo:'emp_003', priority:'high', status:'open', category:'Finance', messages:[{from:'emp_004',text:'Travel reimbursement from last month still pending',at:'2026-02-14T09:00:00Z'}], createdAt:'2026-02-14T09:00:00Z' },
  { id:'ticket_014', title:'Meeting room booking conflict', createdBy:'emp_005', assignedTo:'emp_008', priority:'medium', status:'open', category:'Facilities', messages:[{from:'emp_005',text:'Room 301 double booked for tomorrow 2pm',at:'2026-02-16T15:00:00Z'}], createdAt:'2026-02-16T15:00:00Z' },
  { id:'ticket_015', title:'New joiner onboarding kit', createdBy:'emp_002', assignedTo:'emp_010', priority:'medium', status:'in_progress', category:'HR', messages:[{from:'emp_002',text:'Prepare onboarding kit for 3 new joiners next week',at:'2026-02-13T10:00:00Z'}], createdAt:'2026-02-13T10:00:00Z' },
];

const jobs = [
  { id:'job_001', title:'Frontend Developer', department:'Engineering', location:'Bangalore', experience:'2-4 years', description:'Build responsive web applications using React.', status:'open', postedAt:'2026-02-01T00:00:00Z' },
  { id:'job_002', title:'HR Coordinator', department:'HR', location:'Mumbai', experience:'1-3 years', description:'Manage HR operations and employee relations.', status:'open', postedAt:'2026-02-05T00:00:00Z' },
  { id:'job_003', title:'Data Analyst', department:'Finance', location:'Delhi', experience:'2-5 years', description:'Analyze financial data and create reports.', status:'open', postedAt:'2026-02-10T00:00:00Z' },
  { id:'job_004', title:'Graphic Designer', department:'Design', location:'Remote', experience:'1-3 years', description:'Create visual assets for marketing campaigns.', status:'closed', postedAt:'2026-01-15T00:00:00Z' },
  { id:'job_005', title:'Sales Representative', department:'Sales', location:'Chennai', experience:'0-2 years', description:'Drive sales and manage client relationships.', status:'open', postedAt:'2026-02-12T00:00:00Z' },
];

const applicants = [
  { id:'app_001', jobId:'job_001', name:'Aditya Verma', email:'aditya.v@email.com', phone:'+91-9900000001', status:'screening', appliedAt:'2026-02-03T00:00:00Z', notes:'Strong React skills' },
  { id:'app_002', jobId:'job_001', name:'Sanya Kapoor', email:'sanya.k@email.com', phone:'+91-9900000002', status:'interview', appliedAt:'2026-02-04T00:00:00Z', notes:'Good portfolio' },
  { id:'app_003', jobId:'job_001', name:'Rahul Nair', email:'rahul.n@email.com', phone:'+91-9900000003', status:'applied', appliedAt:'2026-02-08T00:00:00Z', notes:'' },
  { id:'app_004', jobId:'job_002', name:'Tanya Singh', email:'tanya.s@email.com', phone:'+91-9900000004', status:'offer', appliedAt:'2026-02-06T00:00:00Z', notes:'Excellent communication' },
  { id:'app_005', jobId:'job_002', name:'Mohit Das', email:'mohit.d@email.com', phone:'+91-9900000005', status:'rejected', appliedAt:'2026-02-07T00:00:00Z', notes:'Insufficient experience' },
  { id:'app_006', jobId:'job_003', name:'Deepika Rao', email:'deepika.r@email.com', phone:'+91-9900000006', status:'screening', appliedAt:'2026-02-11T00:00:00Z', notes:'Strong SQL skills' },
  { id:'app_007', jobId:'job_003', name:'Varun Jha', email:'varun.j@email.com', phone:'+91-9900000007', status:'interview', appliedAt:'2026-02-12T00:00:00Z', notes:'Tableau expert' },
  { id:'app_008', jobId:'job_005', name:'Ishita Bhatt', email:'ishita.b@email.com', phone:'+91-9900000008', status:'applied', appliedAt:'2026-02-13T00:00:00Z', notes:'' },
  { id:'app_009', jobId:'job_005', name:'Kunal Saxena', email:'kunal.s@email.com', phone:'+91-9900000009', status:'screening', appliedAt:'2026-02-14T00:00:00Z', notes:'Previous sales experience' },
  { id:'app_010', jobId:'job_001', name:'Nisha Malik', email:'nisha.m@email.com', phone:'+91-9900000010', status:'applied', appliedAt:'2026-02-15T00:00:00Z', notes:'' },
  { id:'app_011', jobId:'job_003', name:'Siddharth Pal', email:'sid.p@email.com', phone:'+91-9900000011', status:'applied', appliedAt:'2026-02-14T00:00:00Z', notes:'' },
  { id:'app_012', jobId:'job_002', name:'Ritu Agarwal', email:'ritu.a@email.com', phone:'+91-9900000012', status:'interview', appliedAt:'2026-02-09T00:00:00Z', notes:'Great references' },
  { id:'app_013', jobId:'job_005', name:'Ajay Mishra', email:'ajay.m@email.com', phone:'+91-9900000013', status:'applied', appliedAt:'2026-02-15T00:00:00Z', notes:'' },
  { id:'app_014', jobId:'job_001', name:'Pooja Sethi', email:'pooja.s@email.com', phone:'+91-9900000014', status:'rejected', appliedAt:'2026-02-02T00:00:00Z', notes:'No React experience' },
  { id:'app_015', jobId:'job_004', name:'Manish Tiwari', email:'manish.t@email.com', phone:'+91-9900000015', status:'offer', appliedAt:'2026-01-20T00:00:00Z', notes:'Hired' },
];

const assets = [
  { id:'asset_001', type:'Laptop', model:'MacBook Pro 14"', serial:'MBP-2024-001', assignedTo:'emp_001', assignedDate:'2024-01-15', condition:'good', notes:'256GB SSD' },
  { id:'asset_002', type:'Laptop', model:'Dell XPS 15', serial:'DELL-2024-002', assignedTo:'emp_005', assignedDate:'2022-11-01', condition:'good', notes:'512GB SSD' },
  { id:'asset_003', type:'Phone', model:'iPhone 15', serial:'IPH-2024-001', assignedTo:'emp_002', assignedDate:'2023-06-01', condition:'good', notes:'Company phone' },
  { id:'asset_004', type:'Laptop', model:'ThinkPad X1', serial:'LEN-2024-001', assignedTo:'emp_003', assignedDate:'2023-09-10', condition:'fair', notes:'Battery wear 20%' },
  { id:'asset_005', type:'ID Card', model:'RFID Badge', serial:'IDC-2024-001', assignedTo:'emp_004', assignedDate:'2024-03-20', condition:'good', notes:'' },
  { id:'asset_006', type:'Laptop', model:'MacBook Air M2', serial:'MBA-2024-001', assignedTo:'emp_006', assignedDate:'2024-05-12', condition:'good', notes:'8GB RAM' },
  { id:'asset_007', type:'Phone', model:'Samsung S24', serial:'SAM-2024-001', assignedTo:'emp_008', assignedDate:'2023-02-15', condition:'good', notes:'' },
  { id:'asset_008', type:'Laptop', model:'HP EliteBook', serial:'HP-2024-001', assignedTo:'emp_009', assignedDate:'2025-01-10', condition:'good', notes:'New' },
  { id:'asset_009', type:'Badge', model:'Access Badge', serial:'BDG-2024-001', assignedTo:'emp_011', assignedDate:'2022-04-01', condition:'good', notes:'Full access' },
  { id:'asset_010', type:'Laptop', model:'Dell Latitude', serial:'DELL-2024-003', assignedTo:'emp_013', assignedDate:'2023-10-15', condition:'good', notes:'16GB RAM' },
  { id:'asset_011', type:'Laptop', model:'MacBook Pro 16"', serial:'MBP-2024-002', assignedTo:null, assignedDate:null, condition:'good', notes:'In inventory' },
  { id:'asset_012', type:'Phone', model:'iPhone 14', serial:'IPH-2024-002', assignedTo:null, assignedDate:null, condition:'fair', notes:'Refurbished' },
  { id:'asset_013', type:'Laptop', model:'ThinkPad T14', serial:'LEN-2024-002', assignedTo:'emp_012', assignedDate:'2025-02-01', condition:'good', notes:'' },
  { id:'asset_014', type:'Badge', model:'Visitor Badge', serial:'BDG-2024-002', assignedTo:null, assignedDate:null, condition:'good', notes:'10 units available' },
  { id:'asset_015', type:'Laptop', model:'Asus ZenBook', serial:'ASUS-2024-001', assignedTo:'emp_014', assignedDate:'2024-04-01', condition:'good', notes:'Touch screen' },
];

const announcements = [
  { id:'ann_001', title:'Company Town Hall - March 2026', body:'Join us for the quarterly town hall meeting on March 5th at 3 PM. We will discuss company performance and upcoming plans.', publishDate:'2026-02-15', expiryDate:'2026-03-06', audience:'all', createdBy:'emp_011', createdAt:'2026-02-15T10:00:00Z' },
  { id:'ann_002', title:'New Health Insurance Policy', body:'We are pleased to announce an upgraded health insurance policy effective April 1st. Details will be shared via email.', publishDate:'2026-02-10', expiryDate:'2026-04-01', audience:'all', createdBy:'emp_002', createdAt:'2026-02-10T09:00:00Z' },
  { id:'ann_003', title:'Engineering Hackathon', body:'Annual hackathon scheduled for March 15-16. All engineering team members are encouraged to participate. Prizes worth ₹1L!', publishDate:'2026-02-12', expiryDate:'2026-03-17', audience:'Engineering', createdBy:'emp_005', createdAt:'2026-02-12T14:00:00Z' },
  { id:'ann_004', title:'Office Closed - Holi', body:'The office will be closed on March 14th for Holi. Wishing everyone a colorful celebration!', publishDate:'2026-02-20', expiryDate:'2026-03-15', audience:'all', createdBy:'emp_011', createdAt:'2026-02-20T09:00:00Z' },
  { id:'ann_005', title:'Salary Revision Effective Feb', body:'Annual salary revisions are effective from February payroll. Check your revised offer letter in the portal.', publishDate:'2026-02-01', expiryDate:'2026-02-28', audience:'all', createdBy:'emp_011', createdAt:'2026-02-01T08:00:00Z' },
  { id:'ann_006', title:'Fire Drill - Feb 20', body:'Mandatory fire drill on February 20th at 11 AM. Please follow evacuation procedures.', publishDate:'2026-02-18', expiryDate:'2026-02-21', audience:'all', createdBy:'emp_008', createdAt:'2026-02-18T10:00:00Z' },
  { id:'ann_007', title:'New Cafeteria Menu', body:'Updated cafeteria menu starting next week. Includes more healthy options and regional cuisines.', publishDate:'2026-02-14', expiryDate:'2026-03-14', audience:'all', createdBy:'emp_008', createdAt:'2026-02-14T12:00:00Z' },
  { id:'ann_008', title:'HR Training Session', body:'Mandatory compliance training for all HR team members on February 25th, 2-4 PM.', publishDate:'2026-02-16', expiryDate:'2026-02-26', audience:'HR', createdBy:'emp_002', createdAt:'2026-02-16T09:00:00Z' },
  { id:'ann_009', title:'Parking Lot Renovation', body:'Parking lot B will be under renovation from March 1-15. Please use Parking lot A during this period.', publishDate:'2026-02-20', expiryDate:'2026-03-16', audience:'all', createdBy:'emp_008', createdAt:'2026-02-20T11:00:00Z' },
  { id:'ann_010', title:'Employee Referral Bonus Increase', body:'Referral bonus increased to ₹50,000 for all engineering positions. Refer qualified candidates!', publishDate:'2026-02-08', expiryDate:'2026-04-30', audience:'all', createdBy:'emp_002', createdAt:'2026-02-08T10:00:00Z' },
  { id:'ann_011', title:'Team Outing - Sales', body:'Sales team outing planned for March 8th at Club Cabana. RSVP by Feb 28.', publishDate:'2026-02-15', expiryDate:'2026-03-09', audience:'Sales', createdBy:'emp_015', createdAt:'2026-02-15T14:00:00Z' },
  { id:'ann_012', title:'IT Maintenance Window', body:'Scheduled IT maintenance on Feb 22nd, 10 PM - 2 AM. Email and VPN may be unavailable.', publishDate:'2026-02-19', expiryDate:'2026-02-23', audience:'all', createdBy:'emp_013', createdAt:'2026-02-19T15:00:00Z' },
  { id:'ann_013', title:'Women\'s Day Celebration', body:'Special Women\'s Day celebration on March 8th. Activities include talks, workshops, and networking lunch.', publishDate:'2026-02-25', expiryDate:'2026-03-09', audience:'all', createdBy:'emp_002', createdAt:'2026-02-25T09:00:00Z' },
  { id:'ann_014', title:'New Project Kickoff - Phoenix', body:'Project Phoenix kickoff meeting on Feb 21st at 10 AM for Engineering and Design teams.', publishDate:'2026-02-17', expiryDate:'2026-02-22', audience:'Engineering', createdBy:'emp_005', createdAt:'2026-02-17T08:00:00Z' },
  { id:'ann_015', title:'Performance Review Cycle', body:'Q4 performance review cycle begins March 1st. Managers please complete reviews by March 20th.', publishDate:'2026-02-20', expiryDate:'2026-03-21', audience:'all', createdBy:'emp_011', createdAt:'2026-02-20T10:00:00Z' },
];

const performance = [
  { id:'perf_001', userId:'emp_001', title:'Improve code quality', description:'Reduce bug count by 30% through better testing', targetMetric:'Bug reduction 30%', deadline:'2026-06-30', progress:45, status:'in_progress', rating:null, feedback:'', createdAt:'2026-01-01T00:00:00Z' },
  { id:'perf_002', userId:'emp_001', title:'Learn TypeScript advanced patterns', description:'Complete advanced TS course and apply to codebase', targetMetric:'Course completion + PR', deadline:'2026-04-30', progress:70, status:'in_progress', rating:null, feedback:'', createdAt:'2026-01-01T00:00:00Z' },
  { id:'perf_003', userId:'emp_005', title:'Team mentoring', description:'Mentor 2 junior developers quarterly', targetMetric:'2 mentees per quarter', deadline:'2026-12-31', progress:50, status:'in_progress', rating:null, feedback:'', createdAt:'2026-01-01T00:00:00Z' },
  { id:'perf_004', userId:'emp_004', title:'Launch Q1 campaign', description:'Execute Q1 marketing campaign for new product', targetMetric:'10K leads generated', deadline:'2026-03-31', progress:80, status:'in_progress', rating:null, feedback:'', createdAt:'2026-01-01T00:00:00Z' },
  { id:'perf_005', userId:'emp_007', title:'Exceed sales target', description:'Achieve 120% of quarterly sales target', targetMetric:'₹50L revenue', deadline:'2026-03-31', progress:60, status:'in_progress', rating:null, feedback:'', createdAt:'2026-01-01T00:00:00Z' },
  { id:'perf_006', userId:'emp_006', title:'Design system overhaul', description:'Redesign component library with new brand guidelines', targetMetric:'50 components', deadline:'2026-06-30', progress:35, status:'in_progress', rating:null, feedback:'', createdAt:'2026-01-01T00:00:00Z' },
  { id:'perf_007', userId:'emp_009', title:'Complete onboarding projects', description:'Successfully deliver 3 assigned onboarding projects', targetMetric:'3 projects delivered', deadline:'2026-04-30', progress:33, status:'in_progress', rating:null, feedback:'', createdAt:'2026-01-01T00:00:00Z' },
  { id:'perf_008', userId:'emp_003', title:'Automate financial reports', description:'Build automated monthly report generation', targetMetric:'100% automation', deadline:'2026-05-31', progress:55, status:'in_progress', rating:null, feedback:'', createdAt:'2026-01-01T00:00:00Z' },
  { id:'perf_009', userId:'emp_013', title:'Zero downtime deployments', description:'Implement CI/CD pipeline with zero downtime', targetMetric:'<1min deploy', deadline:'2026-04-30', progress:75, status:'in_progress', rating:null, feedback:'', createdAt:'2026-01-01T00:00:00Z' },
  { id:'perf_010', userId:'emp_002', title:'Reduce attrition by 15%', description:'Implement retention programs', targetMetric:'Attrition < 10%', deadline:'2026-12-31', progress:40, status:'in_progress', rating:null, feedback:'', createdAt:'2026-01-01T00:00:00Z' },
  { id:'perf_011', userId:'emp_008', title:'Optimize operations costs', description:'Reduce operational costs by 10% through process improvements', targetMetric:'10% cost reduction', deadline:'2026-06-30', progress:25, status:'in_progress', rating:null, feedback:'', createdAt:'2026-01-01T00:00:00Z' },
  { id:'perf_012', userId:'emp_010', title:'Employee engagement survey', description:'Conduct and analyze quarterly engagement survey', targetMetric:'85% participation', deadline:'2026-03-31', progress:90, status:'in_progress', rating:null, feedback:'', createdAt:'2026-01-01T00:00:00Z' },
  { id:'perf_013', userId:'emp_012', title:'Content calendar execution', description:'Publish 20 blog posts per quarter', targetMetric:'20 posts/quarter', deadline:'2026-03-31', progress:65, status:'in_progress', rating:null, feedback:'', createdAt:'2026-01-01T00:00:00Z' },
  { id:'perf_014', userId:'emp_014', title:'User research studies', description:'Conduct 5 user research studies per quarter', targetMetric:'5 studies', deadline:'2026-03-31', progress:40, status:'in_progress', rating:null, feedback:'', createdAt:'2026-01-01T00:00:00Z' },
  { id:'perf_015', userId:'emp_011', title:'Budget planning', description:'Complete annual budget planning and allocation', targetMetric:'Budget finalized', deadline:'2026-03-15', progress:85, status:'in_progress', rating:null, feedback:'', createdAt:'2026-01-01T00:00:00Z' },
];

const settings = {
  workHoursStart: '09:00',
  workHoursEnd: '18:00',
  leaveAccrualPerMonth: 1.5,
  taxPercentage: 10,
  pfPercentage: 4,
  startDayOfWeek: 'Monday',
  sessionTimeout: 30,
  roles: [
    { id: 'admin', name: 'Admin', permissions: { employees: 'crud', attendance: 'crud', leave: 'crud', payroll: 'crud', recruitment: 'crud', tickets: 'crud', performance: 'crud', assets: 'crud', announcements: 'crud', settings: 'crud' } },
    { id: 'hr', name: 'HR', permissions: { employees: 'crud', attendance: 'crud', leave: 'crud', payroll: 'cr', recruitment: 'crud', tickets: 'crud', performance: 'cr', assets: 'cr', announcements: 'crud', settings: 'r' } },
    { id: 'employee', name: 'Employee', permissions: { employees: 'r', attendance: 'cr', leave: 'cr', payroll: 'r', recruitment: 'r', tickets: 'cr', performance: 'r', assets: 'r', announcements: 'r', settings: '' } },
  ],
};

export function initializeMockData() {
  if (getAll(KEYS.USERS).length === 0) {
    setAll(KEYS.USERS, users);
  }
  if (getAll(KEYS.EMPLOYEES).length === 0) {
    setAll(KEYS.EMPLOYEES, employees);
  }
  if (getAll(KEYS.ATTENDANCE).length === 0) {
    setAll(KEYS.ATTENDANCE, attendance);
  }
  if (getAll(KEYS.LEAVES).length === 0) {
    setAll(KEYS.LEAVES, leaves);
  }
  if (getAll(KEYS.PAYROLLS).length === 0) {
    setAll(KEYS.PAYROLLS, payrolls);
  }
  if (getAll(KEYS.JOBS).length === 0) {
    setAll(KEYS.JOBS, jobs);
  }
  if (getAll(KEYS.APPLICANTS).length === 0) {
    setAll(KEYS.APPLICANTS, applicants);
  }
  if (getAll(KEYS.TICKETS).length === 0) {
    setAll(KEYS.TICKETS, tickets);
  }
  if (getAll(KEYS.ASSETS).length === 0) {
    setAll(KEYS.ASSETS, assets);
  }
  if (getAll(KEYS.ANNOUNCEMENTS).length === 0) {
    setAll(KEYS.ANNOUNCEMENTS, announcements);
  }
  if (!localStorage.getItem(KEYS.SETTINGS)) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  }
  if (getAll('hr_performance').length === 0) {
    setAll('hr_performance', performance);
  }
}
