import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAll, KEYS } from '@/lib/storage';
import { getCurrentUser } from '@/lib/auth';
import {
  Users,
  Clock,
  CalendarDays,
  Ticket,
  Wallet,
  UserPlus,
  CheckSquare,
  Megaphone,
  PlusCircle,
  Target,
  Building2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';

const DEPT_COLORS = ['hsl(205,100%,75%)','hsl(355,78%,56%)','hsl(150,60%,50%)','hsl(45,100%,60%)','hsl(280,60%,60%)','hsl(30,80%,55%)','hsl(190,70%,50%)'];
const LEAD_SOURCE_COLORS = ['hsl(355,78%,56%)','hsl(30,80%,55%)','hsl(205,100%,60%)','hsl(150,60%,50%)','hsl(280,60%,60%)'];
const ACCOUNT_COLORS = ['hsl(270,60%,70%)','hsl(355,70%,65%)','hsl(30,90%,60%)','hsl(190,70%,50%)','hsl(280,50%,55%)'];

const Dashboard = () => {

  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    pendingLeaves: 0,
    openTickets: 0,
    payrollDue: 0,
    totalLeads: 0,
    totalAccounts: 0
  });

  const [deptData, setDeptData] = useState<{name:string;value:number}[]>([]);
  const [leaveData, setLeaveData] = useState<{name:string;count:number}[]>([]);
  const [activities, setActivities] = useState<{text:string;time:string}[]>([]);
  const [leadSourceData, setLeadSourceData] = useState<{name:string;value:number}[]>([]);
  const [accountTypeData, setAccountTypeData] = useState<{name:string;value:number}[]>([]);
  const [wonLeads, setWonLeads] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<{month:string;hires:number;attrition:number}[]>([]);

  const user = getCurrentUser();

  useEffect(() => {

    const employees = getAll(KEYS.EMPLOYEES);
    const attendance = getAll(KEYS.ATTENDANCE);
    const leaves = getAll(KEYS.LEAVES);
    const tickets = getAll(KEYS.TICKETS);
    const payrolls = getAll(KEYS.PAYROLLS);
    const leads = getAll<any>(KEYS.LEADS);
    const accounts = getAll<any>(KEYS.ACCOUNTS);

    const today = new Date().toISOString().split('T')[0];

    const presentToday = attendance.filter((a:any)=>a.date===today && a.status==='present');
    const pendingLeaves = leaves.filter((l:any)=>l.status==='pending');
    const openTickets = tickets.filter((t:any)=>t.status==='open'||t.status==='in_progress');
    const payrollDue = payrolls.filter((p:any)=>p.status==='pending');

    setStats({
      total: employees.length,
      present: presentToday.length,
      pendingLeaves: pendingLeaves.length,
      openTickets: openTickets.length,
      payrollDue: payrollDue.length,
      totalLeads: leads.length,
      totalAccounts: accounts.length
    });

    const deptMap:Record<string,number>={};
    employees.forEach((e:any)=>{
      deptMap[e.department]=(deptMap[e.department]||0)+1;
    });

    setDeptData(Object.entries(deptMap).map(([name,value])=>({name,value})));

    const leaveMap:Record<string,number>={};
    leaves.forEach((l:any)=>{
      leaveMap[l.type]=(leaveMap[l.type]||0)+1;
    });

    setLeaveData(Object.entries(leaveMap).map(([name,count])=>({name,count})));

    const leadMap:Record<string,number>={};
    leads.forEach((l:any)=>{
      leadMap[l.leadSource]=(leadMap[l.leadSource]||0)+1;
    });

    setLeadSourceData(Object.entries(leadMap).map(([name,value])=>({name,value})));

    const accMap:Record<string,number>={};
    accounts.forEach((a:any)=>{
      accMap[a.accountType]=(accMap[a.accountType]||0)+1;
    });

    setAccountTypeData(Object.entries(accMap).map(([name,value])=>({name,value})));

    setWonLeads(leads.filter((l:any)=>l.status==='Converted'||l.status==='Qualified').slice(0,5));

    setMonthlyData([
      {month:'Sep',hires:3,attrition:1},
      {month:'Oct',hires:5,attrition:2},
      {month:'Nov',hires:2,attrition:1},
      {month:'Dec',hires:4,attrition:0},
      {month:'Jan',hires:6,attrition:1},
      {month:'Feb',hires:3,attrition:2}
    ]);

    const acts:any[]=[];

    employees.slice(-5).reverse().forEach((e:any)=>{
      acts.push({
        text:`${e.firstName} ${e.lastName} joined as ${e.designation}`,
        time:e.joinDate
      });
    });

    setActivities(acts);

  },[]);

  const statCards=[
    {label:'Total Employees',value:stats.total,icon:Users,color:'text-accent',change:'+12%',up:true},
    {label:'Present Today',value:stats.present,icon:Clock,color:'text-emerald-500',change:'+5%',up:true},
    {label:'Pending Leaves',value:stats.pendingLeaves,icon:CalendarDays,color:'text-amber-500',change:'-3%',up:false},
    {label:'Open Tickets',value:stats.openTickets,icon:Ticket,color:'text-primary',change:'+8%',up:true},
    {label:'Payroll Due',value:stats.payrollDue,icon:Wallet,color:'text-violet-500',change:'-2%',up:false},
    {label:'Total Leads',value:stats.totalLeads,icon:Target,color:'text-orange-500',change:'+18%',up:true},
    {label:'Accounts',value:stats.totalAccounts,icon:Building2,color:'text-sky-600',change:'+6%',up:true}
  ];

  return (

    <div className="space-y-6">

      <div>
        <h1 className="page-header mb-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {user?.name}
        </p>
      </div>


      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">

        {statCards.map((card,idx)=>(

          <div key={card.label} className="stat-card">

            <div className="flex justify-between mb-2">

              <card.icon className={card.color} size={20}/>

              <span className={card.up?'text-green-500':'text-red-500'}>
                {card.up?<ArrowUpRight size={10}/>:<ArrowDownRight size={10}/>}
                {card.change}
              </span>

            </div>

            <div className="text-2xl font-bold">
              {card.value}
            </div>

            <div className="text-xs text-muted-foreground">
              {card.label}
            </div>

          </div>

        ))}

      </div>



      <div className="grid lg:grid-cols-2 gap-6">

        <div className="card-section">

          <h3 className="text-sm font-semibold mb-4">
            Recent Activity
          </h3>

          {activities.map((act,i)=>(

            <div key={i} className="text-sm">
              {act.text}
            </div>

          ))}

        </div>



        <div className="card-section">

          <h3 className="text-sm font-semibold mb-4">
            Quick Actions
          </h3>


          <div className="grid grid-cols-2 gap-3">

            <Link to="/employees" className="p-3 bg-muted rounded-lg">
              Add Employee
            </Link>

            <Link to="/leave" className="p-3 bg-muted rounded-lg">
              Approve Leaves
            </Link>

            <Link to="/announcements" className="p-3 bg-muted rounded-lg">
              Announcement
            </Link>

            <Link to="/tickets" className="p-3 bg-muted rounded-lg">
              Raise Ticket
            </Link>

            <Link to="/leads" className="p-3 bg-muted rounded-lg">
              Add Lead
            </Link>

            <Link to="/calendar" className="p-3 bg-muted rounded-lg">
              View Calendar
            </Link>


            <Link to="/voice-agent" className="p-3 bg-muted rounded-lg text-violet-600 font-semibold">
              Open Voice Agent
            </Link>


          </div>

        </div>

      </div>

    </div>

  );

};

export default Dashboard;
