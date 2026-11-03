import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Archive,
  ArrowDown,
  ArrowUp,
  Bell,
  BellRing,
  BookOpen,
  Box,
  BriefcaseBusiness,
  Building2,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  CloudOff,
  Download,
  FileBarChart,
  FileClock,
  FileText,
  Filter,
  Flame,
  Gauge,
  HardHat,
  LayoutDashboard,
  ListFilter,
  LockKeyhole,
  LogOut,
  Menu,
  MoreHorizontal,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  Radio,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Siren,
  SlidersHorizontal,
  Sparkles,
  Timer,
  UserRound,
  Users,
  Video,
  Wifi,
  Wrench,
  X,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type NavItem = { label: string; icon: typeof Activity; section?: string; badge?: string }

const navGroups: { label: string; items: NavItem[] }[] = [
  { label: 'Overview', items: [{ label: 'Executive Dashboard', icon: LayoutDashboard }] },
  { label: 'Monitoring', items: [
    { label: 'Live Site View', icon: Video, badge: 'LIVE' },
    { label: 'Real-Time Alerts', icon: BellRing, badge: '12' },
    { label: 'Alert Triage Workbench', icon: ListFilter },
  ] },
  { label: 'Safety Analytics', items: [
    { label: 'PPE Compliance', icon: HardHat },
    { label: 'Contractor Performance', icon: Users },
    { label: 'Activity Dashboards', icon: Activity },
  ] },
  { label: 'Operations', items: [
    { label: 'Camera Management', icon: Camera },
    { label: 'Work-Front Registry', icon: BriefcaseBusiness },
    { label: 'Detection Registry', icon: Sparkles },
    { label: 'Evidence Vault', icon: Archive },
    { label: 'Shift Handover', icon: FileClock },
    { label: 'Training Sandbox', icon: BookOpen },
  ] },
  { label: 'Reports', items: [
    { label: 'MIS & Report Builder', icon: FileBarChart },
    { label: 'Acceptance & SLA Console', icon: ClipboardCheck },
  ] },
  { label: 'Administration', items: [
    { label: 'User Management', icon: UserRound },
    { label: 'Roles & Permissions', icon: LockKeyhole },
    { label: 'System Health', icon: Gauge },
    { label: 'Audit Logs', icon: FileText },
    { label: 'Settings', icon: Settings },
  ] },
]

const alertsSeed = [
  { id: 'ALT-2048', title: 'No helmet detected', detection: 'D01', severity: 'Critical', camera: 'CAM-042', site: 'North Plant', zone: 'Boiler House B', contractor: 'Apex Industrial', time: '10:42:18', confidence: 98, status: 'Raised', sla: '01:42', accent: 'red' },
  { id: 'ALT-2047', title: 'Person inside exclusion zone', detection: 'D18', severity: 'High', camera: 'CAM-017', site: 'North Plant', zone: 'Crane Bay 2', contractor: 'BuildRight JV', time: '10:40:02', confidence: 94, status: 'Acknowledged', sla: '04:18', accent: 'amber' },
  { id: 'ALT-2046', title: 'Hot work without fire watch', detection: 'D31', severity: 'High', camera: 'CAM-088', site: 'East Expansion', zone: 'Fabrication Yard', contractor: 'Nova Steelworks', time: '10:37:45', confidence: 91, status: 'Assigned', sla: '08:05', accent: 'amber' },
  { id: 'ALT-2045', title: 'Harness not connected', detection: 'D27', severity: 'Medium', camera: 'CAM-061', site: 'North Plant', zone: 'Stack Access', contractor: 'Apex Industrial', time: '10:35:11', confidence: 89, status: 'Action Taken', sla: '18:24', accent: 'blue' },
  { id: 'ALT-2044', title: 'Cylinder unsecured', detection: 'D04', severity: 'Medium', camera: 'CAM-023', site: 'South Yard', zone: 'Gas Store', contractor: 'SafeCore Services', time: '10:32:09', confidence: 96, status: 'Raised', sla: '22:10', accent: 'blue' },
  { id: 'ALT-2043', title: 'Missing safety shoes', detection: 'D02', severity: 'Low', camera: 'CAM-011', site: 'North Plant', zone: 'Gate 1', contractor: 'BuildRight JV', time: '10:29:55', confidence: 87, status: 'False Positive', sla: 'Closed', accent: 'slate' },
]

const cameras = [
  { id: 'CAM-042', name: 'Boiler House B', site: 'North Plant', state: 'alert', people: 12, last: '2 sec ago', color: 'from-slate-700 to-slate-950' },
  { id: 'CAM-017', name: 'Crane Bay 2', site: 'North Plant', state: 'online', people: 8, last: '1 sec ago', color: 'from-blue-950 to-slate-900' },
  { id: 'CAM-088', name: 'Fabrication Yard', site: 'East Expansion', state: 'online', people: 23, last: '3 sec ago', color: 'from-amber-950 to-slate-900' },
  { id: 'CAM-061', name: 'Stack Access', site: 'North Plant', state: 'stale', people: 4, last: '2 min ago', color: 'from-slate-800 to-blue-950' },
  { id: 'CAM-023', name: 'Gas Store', site: 'South Yard', state: 'online', people: 6, last: '1 sec ago', color: 'from-emerald-950 to-slate-900' },
  { id: 'CAM-011', name: 'Gate 1', site: 'North Plant', state: 'offline', people: 0, last: '14 min ago', color: 'from-slate-900 to-slate-950' },
]

const trends = [42, 58, 46, 68, 55, 74, 62, 81, 69, 88, 77, 91]

function StatusDot({ state }: { state: string }) {
  return <span className={cn('inline-block size-2 rounded-full', state === 'online' ? 'bg-emerald-400' : state === 'alert' ? 'bg-red-400' : state === 'stale' ? 'bg-amber-400' : 'bg-slate-500')} />
}

function MetricCard({ label, value, change, icon: Icon, tone = 'blue', detail }: { label: string; value: string; change?: string; icon: React.ElementType; tone?: string; detail?: string }) {
  return <div className="metric-card">
    <div className="flex items-start justify-between"><div className={cn('metric-icon', `metric-${tone}`)}><Icon /></div>{change && <span className={cn('metric-change', change.startsWith('-') ? 'text-red-600' : 'text-emerald-600')}>{change.startsWith('-') ? <ArrowDown /> : <ArrowUp />}{change}</span>}</div>
    <div className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">{value}</div>
    <div className="mt-1 text-xs font-medium text-slate-500">{label}</div>
    {detail && <div className="mt-3 border-t border-slate-100 pt-2 text-[11px] text-slate-400">{detail}</div>}
  </div>
}

function TrendChart({ compact = false }: { compact?: boolean }) {
  return <div className={cn('trend-chart', compact && 'h-28')}>
    <div className="chart-grid"><span /><span /><span /><span /></div>
    <svg viewBox="0 0 600 170" preserveAspectRatio="none" className="relative z-10 h-full w-full" aria-label="Safety trend chart">
      <defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#2563eb" stopOpacity=".2" /><stop offset="100%" stopColor="#2563eb" stopOpacity="0" /></linearGradient></defs>
      <path d="M0 145 L55 112 L110 127 L165 84 L220 104 L275 62 L330 86 L385 41 L440 64 L495 26 L550 49 L600 14 L600 170 L0 170 Z" fill="url(#area)" />
      <path d="M0 145 L55 112 L110 127 L165 84 L220 104 L275 62 L330 86 L385 41 L440 64 L495 26 L550 49 L600 14" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    {!compact && <div className="chart-labels"><span>01 Nov</span><span>08 Nov</span><span>15 Nov</span><span>22 Nov</span><span>30 Nov</span></div>}
  </div>
}

function Header({ collapsed, setCollapsed, page }: { collapsed: boolean; setCollapsed: (v: boolean) => void; page: string }) {
  const [role, setRole] = useState('Safety Operator')
  return <header className="app-header">
    <div className="flex items-center gap-3"><button onClick={() => setCollapsed(!collapsed)} className="icon-button lg:hidden"><Menu /></button><div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex"><span>Operations</span><ChevronRight className="size-3" /><span className="font-medium text-slate-600">{page}</span></div></div>
    <div className="flex items-center gap-2 sm:gap-4"><div className="search-box hidden md:flex"><Search /><input placeholder="Search alerts, cameras, people..." aria-label="Global search" /><kbd>⌘ K</kbd></div><button className="icon-button"><Bell /><span className="notification-dot" /></button><div className="role-switch"><UserRound /><select value={role} onChange={(e) => setRole(e.target.value)} aria-label="Demo role"><option>Safety Operator</option><option>Administrator</option><option>Management</option></select><ChevronDown /></div><div className="avatar">SO</div></div>
  </header>
}

function Sidebar({ collapsed, active, onNavigate }: { collapsed: boolean; active: string; onNavigate: (v: string) => void }) {
  return <aside className={cn('app-sidebar', collapsed && 'collapsed')}>
    <div className="brand"><div className="brand-mark"><ShieldCheck /></div><div className="brand-copy"><strong>Sentinel<span>AI</span></strong><small>SAFETY INTELLIGENCE</small></div><button className="collapse-button" onClick={() => onNavigate('__collapse')}><PanelLeftClose /></button></div>
    <div className="site-selector"><div className="site-symbol"><Building2 /></div><div className="min-w-0"><div className="truncate text-xs font-semibold text-white">North Plant Complex</div><div className="truncate text-[10px] text-slate-400">3 projects · 128 cameras</div></div><ChevronDown className="ml-auto size-3 text-slate-500" /></div>
    <nav className="sidebar-nav">{navGroups.map((group) => <div key={group.label} className="nav-group"><div className="nav-group-label">{group.label}</div>{group.items.map((item) => <button key={item.label} onClick={() => onNavigate(item.label)} className={cn('nav-item', active === item.label && 'active')}><item.icon /><span>{item.label}</span>{item.badge && <em className={cn(item.badge === 'LIVE' ? 'live-badge' : 'count-badge')}>{item.badge}</em>}</button>)}</div>)}</nav>
    <div className="sidebar-footer"><div className="health-pill"><span className="health-dot" /><span>All systems operational</span></div><div className="flex items-center gap-2 text-[11px] text-slate-500"><CloudOff className="size-3" /> Last sync 10:42:21</div></div>
  </aside>
}

function FilterBar({ onFilter }: { onFilter?: (value: string) => void }) {
  return <div className="filter-bar"><div className="filter-search"><Search /><input onChange={(e) => onFilter?.(e.target.value)} placeholder="Search this view..." /></div><button className="filter-button"><Building2 /> All sites <ChevronDown /></button><button className="filter-button hidden sm:flex"><HardHat /> All contractors <ChevronDown /></button><button className="filter-button hidden lg:flex"><Clock3 /> Last 24 hours <ChevronDown /></button><button className="filter-button"><Filter /> <span className="hidden sm:inline">Filters</span><span className="filter-count">3</span></button></div>
}

function LiveView() {
  const [layout, setLayout] = useState(6)
  return <PageFrame eyebrow="MONITORING / LIVE FEED" title="Live Site View" description="Operational camera coverage across active work fronts." action={<><Button variant="outline" className="gap-2"><Download data-icon="inline-start" /> Export view</Button><Button className="gap-2 bg-blue-600 hover:bg-blue-700"><Radio data-icon="inline-start" /> Focus mode</Button></>}>
    <FilterBar />
    <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-3 text-xs text-slate-500"><span className="flex items-center gap-1.5"><StatusDot state="online" /> 118 online</span><span className="flex items-center gap-1.5"><StatusDot state="stale" /> 6 stale</span><span className="flex items-center gap-1.5"><StatusDot state="offline" /> 4 offline</span></div><div className="layout-toggle">{[1, 4, 9, 16].map((n) => <button key={n} onClick={() => setLayout(n)} className={layout === n ? 'selected' : ''}>{n}</button>)}</div></div>
    <div className={cn('camera-grid', layout === 1 && 'one', layout === 4 && 'four', layout >= 9 && 'nine')}>{cameras.slice(0, layout).map((camera, index) => <CameraTile key={camera.id} camera={camera} index={index} />)}</div>
  </PageFrame>
}

function CameraTile({ camera, index }: { camera: typeof cameras[number]; index: number }) {
  return <div className={cn('camera-tile', camera.state === 'alert' && 'tile-alert')}><div className={cn('camera-visual bg-gradient-to-br', camera.color)}><div className="camera-noise" /><div className="camera-topline"><span className="flex items-center gap-1.5"><StatusDot state={camera.state} /> {camera.state === 'offline' ? 'OFFLINE' : camera.state === 'stale' ? 'STALE FRAME' : 'LIVE SIMULATION'}</span><span>{camera.last}</span></div>{camera.state !== 'offline' && <><div className="detection-box box-one"><span>PPE 98%</span></div><div className="detection-box box-two"><span>PERSON 94%</span></div>{camera.state === 'alert' && <div className="alert-overlay"><AlertTriangle /> CRITICAL ALERT</div>}<div className="camera-watermark">SENTINEL<span>AI</span> · DEMO FEED</div></>}</div><div className="camera-meta"><div><div className="text-xs font-semibold text-slate-800">{camera.id} · {camera.name}</div><div className="mt-1 text-[10px] text-slate-400">{camera.site} · {camera.people} active tracks · Zone mapped</div></div><button className="icon-button small"><MoreHorizontal /></button></div></div>
}

function AlertDashboard({ triage = false }: { triage?: boolean }) {
  const [alerts, setAlerts] = useState(alertsSeed)
  const [selected, setSelected] = useState(alertsSeed[0])
  const [search, setSearch] = useState('')
  const filtered = alerts.filter((a) => `${a.id} ${a.title} ${a.camera} ${a.contractor}`.toLowerCase().includes(search.toLowerCase()))
  const updateStatus = (status: string) => { setAlerts(alerts.map((a) => a.id === selected.id ? { ...a, status } : a)); setSelected({ ...selected, status }) }
  return <PageFrame eyebrow={triage ? 'MONITORING / OPERATOR QUEUE' : 'MONITORING / EVENT STREAM'} title={triage ? 'Alert Triage Workbench' : 'Real-Time Alerts'} description={triage ? 'Keyboard-first review queue for fast, consistent adjudication.' : 'AI detections requiring review across all active sites.'} action={<><Button variant="outline" className="gap-2"><SlidersHorizontal data-icon="inline-start" /> Configure view</Button><Button className="gap-2 bg-blue-600 hover:bg-blue-700"><Download data-icon="inline-start" /> Export log</Button></>}>
    <div className="alert-summary"><div><span className="summary-label">OPEN QUEUE</span><strong>12</strong><small>+3 since 09:00</small></div><div><span className="summary-label">CRITICAL</span><strong className="text-red-600">03</strong><small>1 requires action</small></div><div><span className="summary-label">AVG. ACK TIME</span><strong>01:48</strong><small className="text-emerald-600">↓ 12% vs yesterday</small></div><div><span className="summary-label">SLA AT RISK</span><strong className="text-amber-600">02</strong><small>Next in 01:42</small></div></div>
    <div className="filter-bar"><div className="filter-search flex-1"><Search /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search alert ID, detection, camera or contractor..." /></div><button className="filter-button"><span className="severity-dot critical" /> Severity <ChevronDown /></button><button className="filter-button hidden md:flex">Status <ChevronDown /></button><button className="filter-button hidden md:flex">Detection ID <ChevronDown /></button></div>
    <div className="alert-workspace"><div className="alert-list">{filtered.map((alert) => <button key={alert.id} onClick={() => setSelected(alert)} className={cn('alert-row', selected.id === alert.id && 'selected')}><div className={cn('severity-rail', alert.accent)} /><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="text-[11px] font-bold text-slate-900">{alert.id}</span><Badge tone={alert.severity === 'Critical' ? 'red' : alert.severity === 'High' ? 'amber' : 'blue'}>{alert.severity}</Badge></div><div className="mt-1 truncate text-xs font-medium text-slate-700">{alert.title}</div><div className="mt-1.5 flex gap-2 text-[10px] text-slate-400"><span>{alert.camera}</span><span>·</span><span>{alert.time}</span></div></div><div className="text-right"><div className="text-[10px] font-semibold text-slate-500">{alert.status}</div><div className={cn('mt-1 text-[10px] font-bold', alert.sla === 'Closed' ? 'text-slate-400' : 'text-red-500')}>{alert.sla}</div></div></button>)}</div><AlertDetail alert={selected} updateStatus={updateStatus} triage={triage} /></div>
  </PageFrame>
}

function AlertDetail({ alert, updateStatus, triage }: { alert: typeof alertsSeed[number]; updateStatus: (s: string) => void; triage: boolean }) {
  return <div className="alert-detail"><div className="detail-header"><div><div className="flex items-center gap-2"><span className="text-xs font-bold text-slate-900">{alert.id}</span><Badge tone={alert.severity === 'Critical' ? 'red' : 'amber'}>{alert.severity}</Badge></div><h3>{alert.title}</h3></div><button className="icon-button small"><MoreHorizontal /></button></div><div className="detail-evidence"><div className="evidence-scene"><div className="evidence-grid" /><div className="person-silhouette" /><div className="evidence-box"><span>NO HELMET · 98%</span></div><div className="scene-label">{alert.camera} · {alert.time} · FRAME 4K</div></div><div className="evidence-actions"><Button variant="outline" size="sm" className="gap-2"><Play data-icon="inline-start" /> Play clip</Button><Button variant="outline" size="sm" className="gap-2"><Download data-icon="inline-start" /> Evidence</Button></div></div><div className="detail-facts"><Fact label="Detection" value={`${alert.detection} · PPE / Head protection`} /><Fact label="Confidence" value={`${alert.confidence}% · High confidence`} /><Fact label="Location" value={`${alert.site} · ${alert.zone}`} /><Fact label="Attribution" value={`${alert.contractor} · 92% confidence`} /><Fact label="AI model" value="SafetyVision 4.8.2 · Rule r16" /><Fact label="SLA countdown" value={alert.sla} danger /></div><div className="rule-callout"><ShieldCheck /><div><strong>Violated safety rule</strong><p>All persons entering PPE-required contexts must wear approved head protection.</p></div></div><div className="detail-timeline"><div className="timeline-title">Lifecycle <span>Updated just now</span></div><div className="timeline-steps">{['Raised', 'Acknowledged', 'Assigned', 'Action Taken', 'Closed'].map((step, i) => <div key={step} className={cn('timeline-step', ['Raised', 'Acknowledged', 'Assigned', 'Action Taken'].indexOf(alert.status) >= i || alert.status === 'Closed' ? 'done' : '')}><span>{i < 3 && <Check />}</span><label>{step}</label></div>)}</div></div><div className="detail-actions">{triage ? <><Button variant="outline" onClick={() => updateStatus('False Positive')} className="flex-1 gap-2 text-slate-600"><X data-icon="inline-start" /> False positive</Button><Button onClick={() => updateStatus('Action Taken')} className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"><Check data-icon="inline-start" /> Valid & action</Button></> : <><Button variant="outline" onClick={() => updateStatus('Acknowledged')} className="flex-1">Acknowledge</Button><Button onClick={() => updateStatus('Assigned')} className="flex-1 bg-blue-600 hover:bg-blue-700">Assign to me</Button></>}</div></div>
}

function Fact({ label, value, danger }: { label: string; value: string; danger?: boolean }) { return <div><span>{label}</span><strong className={danger ? 'text-red-600' : ''}>{value}</strong></div> }
function Badge({ children, tone = 'blue' }: { children: React.ReactNode; tone?: string }) { return <span className={cn('badge', `badge-${tone}`)}>{children}</span> }

function AnalyticsPage({ type = 'executive' }: { type?: string }) {
  const isPpe = type === 'ppe'; const isContractor = type === 'contractor'; const title = isPpe ? 'PPE Compliance' : isContractor ? 'Contractor Performance' : 'Executive Dashboard'; const eyebrow = isPpe ? 'SAFETY ANALYTICS / PPE' : isContractor ? 'SAFETY ANALYTICS / CONTRACTORS' : 'OVERVIEW / MANAGEMENT VIEW'
  return <PageFrame eyebrow={eyebrow} title={title} description={isPpe ? 'Compliance intelligence across required protective equipment.' : isContractor ? 'Audited safety performance by contractor and work front.' : 'Safety intelligence across the North Plant portfolio.'} action={<><Button variant="outline" className="gap-2"><Clock3 data-icon="inline-start" /> 01–30 Nov 2026</Button><Button className="gap-2 bg-blue-600 hover:bg-blue-700"><Download data-icon="inline-start" /> Export summary</Button></>}>
    <FilterBar />
    <div className="metric-grid">{isPpe ? <><MetricCard label="Overall PPE compliance" value="94.8%" change="+2.4%" icon={HardHat} tone="green" detail="Target 95.0%" /><MetricCard label="People assessed" value="18,492" change="+8.1%" icon={Users} detail="92.4% of observations" /><MetricCard label="Open violations" value="28" change="-18.2%" icon={AlertTriangle} tone="amber" detail="Across 7 zones" /><MetricCard label="Unassessable" value="3.6%" change="-0.8%" icon={EyeIcon} tone="slate" detail="Blurred or occluded" /></> : isContractor ? <><MetricCard label="Contractors assessed" value="18" icon={Users} detail="Across 3 active projects" /><MetricCard label="Avg. valid violations" value="4.2" change="-11.6%" icon={ShieldCheck} tone="green" detail="Per 100 person tracks" /><MetricCard label="Attribution confidence" value="91.4%" change="+1.9%" icon={Network} detail="Audited sample" /><MetricCard label="Disputes pending" value="03" icon={AlertCircle} tone="amber" detail="EIC review required" /></> : <><MetricCard label="Total alerts" value="1,284" change="-8.4%" icon={BellRing} detail="Last 30 days" /><MetricCard label="Critical incidents" value="07" change="-22.2%" icon={Siren} tone="red" detail="1 open · 6 closed" /><MetricCard label="Safety compliance" value="96.2%" change="+3.1%" icon={ShieldCheck} tone="green" detail="Portfolio average" /><MetricCard label="Avg. closure time" value="18m 42s" change="-12.0%" icon={Timer} detail="SLA target 30m" /></>}</div>
    <div className="analytics-grid"><div className="panel chart-panel"><div className="panel-heading"><div><h3>{isPpe ? 'Compliance trend' : 'Safety performance trend'}</h3><p>Daily aggregated score · all active sites</p></div><div className="chart-legend"><span><i className="bg-blue-600" /> Current period</span><span><i className="bg-slate-300" /> Prior period</span></div></div><TrendChart /></div><div className="panel"><div className="panel-heading"><div><h3>{isContractor ? 'Contractor ranking' : isPpe ? 'Item-wise compliance' : 'Risk distribution'}</h3><p>{isContractor ? 'Valid violations per 100 person tracks' : 'Current reporting period'}</p></div><button className="text-xs font-semibold text-blue-600">View all</button></div>{(isContractor ? [['Apex Industrial','2.4','96.8%'],['SafeCore Services','3.1','95.2%'],['Nova Steelworks','4.8','92.7%'],['BuildRight JV','6.2','89.4%']] : isPpe ? [['Helmet','98.4%','Target 98%'],['Safety shoes','96.2%','Target 98%'],['Hi-vis clothing','95.8%','Target 95%'],['Eye protection','92.1%','Target 95%']] : [['PPE & access','42%','540 alerts'],['Work at height','27%','347 alerts'],['Material handling','18%','231 alerts'],['Hot work','13%','166 alerts']]).map(([name, value, sub], i) => <div className="rank-row" key={name}><div className="rank-icon">{i + 1}</div><div className="min-w-0 flex-1"><div className="flex justify-between text-xs font-semibold text-slate-700"><span>{name}</span><span>{value}</span></div><div className="progress-track"><div className={cn('progress-fill', i === 3 ? 'bg-amber-500' : 'bg-blue-600')} style={{ width: `${isContractor ? Math.max(20, 100 - i * 18) : parseInt(value)}%` }} /></div><div className="mt-1 text-[10px] text-slate-400">{sub}</div></div></div>)}</div></div>
    <div className="panel table-panel"><div className="panel-heading"><div><h3>Top risk locations</h3><p>Zones requiring attention this period</p></div><Button variant="outline" size="sm">View report</Button></div><div className="data-table"><div className="table-head"><span>Location</span><span>Open alerts</span><span>Compliance</span><span>Trend</span></div>{[['Boiler House B','08','91.2%','+4.2%'],['Crane Bay 2','05','93.8%','+1.1%'],['Fabrication Yard','04','94.1%','-2.8%'],['Stack Access','03','95.4%','+0.8%']].map((row) => <div className="table-row" key={row[0]}><strong>{row[0]}</strong><span className="text-red-600">{row[1]}</span><span>{row[2]}</span><span className={row[3].startsWith('-') ? 'text-red-600' : 'text-emerald-600'}>{row[3]}</span></div>)}</div></div>
  </PageFrame>
}

function OperationsPage({ title }: { title: string }) {
  const registry = title.includes('Registry'); const health = title.includes('Health'); const report = title.includes('Report'); const evidence = title.includes('Evidence');
  return <PageFrame eyebrow={`OPERATIONS / ${title.toUpperCase()}`} title={title} description={registry ? 'Configure and govern the operational control plane.' : health ? 'Live status of camera infrastructure and core services.' : 'Structured workflows for safety operations and governance.'} action={<><Button variant="outline" className="gap-2"><RefreshCw data-icon="inline-start" /> Refresh</Button><Button className="gap-2 bg-blue-600 hover:bg-blue-700"><Zap data-icon="inline-start" /> {report ? 'New report' : registry ? 'Add new' : 'Create workflow'}</Button></>}>
    <FilterBar /><div className="metric-grid"><MetricCard label={health ? 'Cameras online' : report ? 'Reports this month' : evidence ? 'Evidence objects' : 'Active records'} value={health ? '118 / 128' : report ? '24' : evidence ? '48,204' : '1,842'} change="+4.2%" icon={health ? Camera : report ? FileBarChart : evidence ? Archive : Wrench} tone="blue" /><MetricCard label={health ? 'Central services' : 'Awaiting review'} value={health ? '8 / 8' : '12'} icon={health ? Network : Clock3} tone="green" detail="No critical blockers" /><MetricCard label="SLA compliance" value="98.6%" change="+1.1%" icon={ShieldCheck} tone="green" detail="Last 30 days" /><MetricCard label="Changes today" value="18" icon={Activity} tone="amber" detail="Audit logged" /></div>
    <div className="panel table-panel"><div className="panel-heading"><div><h3>{health ? 'Infrastructure status' : title.includes('Detection') ? 'Detection catalogue · D01–D54' : title.includes('Work-Front') ? 'Active work fronts' : 'Recent activity'}</h3><p>Last updated 10:42:21 · Demo data is clearly labelled</p></div><button className="icon-button small"><MoreHorizontal /></button></div><div className="data-table"><div className="table-head"><span>Record</span><span>Owner / status</span><span>Last updated</span><span>Action</span></div>{(health ? [['CAM-042 · Boiler House B','Online · 98%','2 sec ago','Inspect'],['CAM-061 · Stack Access','Stale · 2 min','2 min ago','Open ticket'],['CAM-011 · Gate 1','Offline · 14 min','14 min ago','Assign fault'],['AI Core · Detection service','Healthy · v4.8.2','30 sec ago','View logs']] : title.includes('Detection') ? [['D01 · Helmet compliance','Production · Tier 1','Today 09:40','Configure'],['D18 · Exclusion zone','Production · Tier 1','Today 09:38','Configure'],['D31 · Hot work fire watch','Advisory · Tier 2','Yesterday','Review'],['D54 · Demolition dust','Advisory · Tier 3','31 Oct 2026','Promote']] : title.includes('Work-Front') ? [['WF-014 · Boiler House B','Apex Industrial · Active','10:12 today','Edit'],['WF-021 · Crane Bay 2','BuildRight JV · Active','09:44 today','Edit'],['WF-033 · Fabrication Yard','Nova Steelworks · Active','Yesterday','Edit'],['WF-042 · Gas Store','SafeCore Services · Pending','31 Oct 2026','Review']] : [['Configuration change · D18 threshold','Administrator · Completed','10:38 today','View'],['Evidence export · ALT-2039','Safety Operator · Completed','10:22 today','View'],['Shift handover · Day → Evening','Safety Operator · Pending','10:00 today','Open'],['Model promotion · v4.8.2','Administrator · Approved','Yesterday','View']]).map((row) => <div className="table-row" key={row[0]}><strong>{row[0]}</strong><span>{row[1]}</span><span className="text-slate-400">{row[2]}</span><Button variant="ghost" size="sm" className="justify-self-start px-2 text-blue-600">{row[3]}</Button></div>)}</div></div>
  </PageFrame>
}

function PageFrame({ eyebrow, title, description, action, children }: { eyebrow: string; title: string; description: string; action: React.ReactNode; children: React.ReactNode }) { return <main className="page-content"><div className="page-title"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div><div className="page-actions">{action}</div></div>{children}</main> }
function EyeIcon() { return <Activity /> }

const routeByLabel: Record<string, string> = {
  'Executive Dashboard': '/',
  'Live Site View': '/monitoring/live',
  'Real-Time Alerts': '/monitoring/alerts',
  'Alert Triage Workbench': '/monitoring/triage',
  'PPE Compliance': '/analytics/ppe',
  'Contractor Performance': '/analytics/contractors',
  'Activity Dashboards': '/analytics/activity',
}
const labelByRoute = Object.fromEntries(Object.entries(routeByLabel).map(([label, route]) => [route, label]))

export default function Page() {
  const location = useLocation(); const routerNavigate = useNavigate()
  const [active, setActive] = useState(labelByRoute[location.pathname] ?? 'Executive Dashboard'); const [collapsed, setCollapsed] = useState(false)
  useEffect(() => { const saved = window.localStorage.getItem('sentinel-active'); if (saved && !labelByRoute[location.pathname]) setActive(saved) }, [location.pathname])
  const navigate = (value: string) => { if (value === '__collapse') { setCollapsed((v) => !v); return }; setActive(value); window.localStorage.setItem('sentinel-active', value); routerNavigate(routeByLabel[value] ?? `/operations/${value.toLowerCase().replaceAll(' ', '-')}`) }
  const content = useMemo(() => { if (active === 'Live Site View') return <LiveView />; if (active === 'Real-Time Alerts') return <AlertDashboard />; if (active === 'Alert Triage Workbench') return <AlertDashboard triage />; if (active === 'PPE Compliance') return <AnalyticsPage type="ppe" />; if (active === 'Contractor Performance') return <AnalyticsPage type="contractor" />; if (active === 'Executive Dashboard') return <AnalyticsPage />; if (active === 'Activity Dashboards') return <AnalyticsPage type="contractor" />; return <OperationsPage title={active} /> }, [active])
  return <div className="app-shell"><Sidebar collapsed={collapsed} active={active} onNavigate={navigate} /><div className="app-main"><Header collapsed={collapsed} setCollapsed={setCollapsed} page={active} /><div className="system-strip"><span><span className="health-dot" /> SYSTEM OPERATIONAL</span><span className="strip-divider" /><span>AI inference latency <strong>184ms</strong></span><span className="strip-divider hidden sm:inline" /><span className="hidden sm:inline">Last event <strong>10:42:18</strong></span><span className="ml-auto">DEMO ENVIRONMENT <span className="demo-dot" /></span></div>{content}</div></div>
}
