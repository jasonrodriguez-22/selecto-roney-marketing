import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, BriefcaseBusiness, CalendarDays, Megaphone, Video,
  Image as ImageIcon, ChartNoAxesColumn, Settings, Search, Bell, Plus,
  FileText, Download, CheckCircle2, Clock3, CircleAlert, Trash2, X,
  Menu, ShoppingCart, Pencil, Filter, LockKeyhole, UserRound, LogOut, Eye, EyeOff
} from "lucide-react";

const starterJobs = [
  { id: 1, title: "Flyer de ofertas de la semana", type: "Diseño gráfico", date: "2026-10-16", due: "2026-10-16", status: "Terminado", notes: "Promoción de productos seleccionados" },
  { id: 2, title: "Video Jueves Cervecero", type: "Video", date: "2026-10-15", due: "2026-10-17", status: "En proceso", notes: "Formato vertical para redes sociales" },
  { id: 3, title: "Banner de gran formato", type: "Impresión", date: "2026-10-14", due: "2026-10-19", status: "Pendiente", notes: "Revisar medidas finales antes de imprimir" },
  { id: 4, title: "Publicación de redes sociales", type: "Redes sociales", date: "2026-10-13", due: "2026-10-18", status: "Aprobado", notes: "Contenido para Facebook" },
  { id: 5, title: "Diseño de temporada", type: "Diseño gráfico", date: "2026-10-12", due: "2026-10-20", status: "En proceso", notes: "Concepto visual de temporada" }
];
const starterCampaigns = [
  { id: 1, name: "Ofertas especiales", channel: "Tienda y redes sociales", start: "2026-10-15", end: "2026-10-31", status: "Activa", goal: "Promocionar productos seleccionados" },
  { id: 2, name: "Jueves Cervecero", channel: "Redes sociales", start: "2026-10-01", end: "2026-10-31", status: "Activa", goal: "Impulsar la promoción semanal" },
  { id: 3, name: "Campaña de temporada", channel: "Tienda y redes sociales", start: "2026-10-20", end: "2026-11-10", status: "Planificada", goal: "Aumentar el alcance de las promociones" }
];
const navItems = [
  ["Inicio", LayoutDashboard], ["Trabajos", BriefcaseBusiness], ["Calendario", CalendarDays],
  ["Campañas", Megaphone], ["Videos", Video], ["Diseños", ImageIcon], ["Reportes", ChartNoAxesColumn]
];
const today = new Date().toISOString().slice(0, 10);
const emptyJob = { title: "", type: "Diseño gráfico", date: today, due: today, status: "Pendiente", notes: "" };
const emptyCampaign = { name: "", channel: "Redes sociales", start: today, end: today, status: "Planificada", goal: "" };
const fmt = (date) => date ? new Date(date + "T12:00:00").toLocaleDateString("es-NI", { day: "2-digit", month: "short", year: "numeric" }) : "—";

function readStore(key, fallback) {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem("sr_authenticated") === "true");
  const [loginError, setLoginError] = useState("");
  const [jobs, setJobs] = useState(() => readStore("sr_jobs", starterJobs));
  const [campaigns, setCampaigns] = useState(() => readStore("sr_campaigns", starterCampaigns));
  const [page, setPage] = useState("Inicio");
  const [search, setSearch] = useState("");
  const [showJobForm, setShowJobForm] = useState(false);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [jobForm, setJobForm] = useState(emptyJob);
  const [campaignForm, setCampaignForm] = useState(emptyCampaign);
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [notice, setNotice] = useState("");
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => localStorage.setItem("sr_jobs", JSON.stringify(jobs)), [jobs]);
  useEffect(() => localStorage.setItem("sr_campaigns", JSON.stringify(campaigns)), [campaigns]);

  const filteredJobs = useMemo(() => jobs.filter(j => {
    const matchesSearch = `${j.title} ${j.type} ${j.status}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "Todos" || j.status === filterStatus;
    const matchesPage = page === "Videos" ? j.type === "Video" : page === "Diseños" ? ["Diseño gráfico", "Impresión"].includes(j.type) : true;
    return matchesSearch && matchesStatus && matchesPage;
  }), [jobs, search, filterStatus, page]);

  const completed = jobs.filter(j => j.status === "Terminado" || j.status === "Aprobado").length;
  const inProgress = jobs.filter(j => j.status === "En proceso").length;
  const pending = jobs.filter(j => j.status === "Pendiente").length;
  const activeCampaigns = campaigns.filter(c => c.status === "Activa").length;
  const countType = (type) => jobs.filter(j => j.type === type).length;

  function addJob(e) {
    e.preventDefault();
    if (!jobForm.title.trim()) return;
    setJobs([{ ...jobForm, id: Date.now() }, ...jobs]);
    setJobForm(emptyJob); setShowJobForm(false); setNotice("Trabajo registrado correctamente.");
    setTimeout(() => setNotice(""), 3000);
  }
  function addCampaign(e) {
    e.preventDefault();
    if (!campaignForm.name.trim()) return;
    setCampaigns([{ ...campaignForm, id: Date.now() }, ...campaigns]);
    setCampaignForm(emptyCampaign); setShowCampaignForm(false); setNotice("Campaña registrada correctamente.");
    setTimeout(() => setNotice(""), 3000);
  }
  function updateStatus(id, status) {
    setJobs(jobs.map(j => j.id === id ? { ...j, status } : j));
  }
  function deleteJob(id) {
    if (confirm("¿Eliminar este trabajo?")) setJobs(jobs.filter(j => j.id !== id));
  }
  function handleLogin(username, password) {
    // Demo local: no sustituye autenticación de servidor para datos sensibles.
    if (username.trim().toLowerCase() === "admin" && password === "Selecto2026!") {
      sessionStorage.setItem("sr_authenticated", "true");
      setAuthenticated(true);
      setLoginError("");
      return true;
    }
    setLoginError("Usuario o contraseña incorrectos.");
    return false;
  }
  function handleLogout() {
    sessionStorage.removeItem("sr_authenticated");
    setAuthenticated(false);
    setLoginError("");
  }

  function exportCsv() {
    const rows = [["Trabajo", "Tipo", "Fecha de solicitud", "Fecha de entrega", "Estado", "Notas"], ...jobs.map(j => [j.title, j.type, j.date, j.due, j.status, j.notes])];
    const csv = "\uFEFF" + rows.map(row => row.map(v => `"${String(v ?? "").replaceAll('"', '""')}"`).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a"); a.href = url; a.download = "reporte-selecto-roney.csv"; a.click(); URL.revokeObjectURL(url);
  }

  if (!authenticated) return <LoginScreen onLogin={handleLogin} error={loginError} />;

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
      <div className="brand">
        <div className="brand-mark"><ShoppingCart size={25}/></div>
        <div><strong>Selecto <span>Roney</span></strong><small>DISEÑO & MARKETING</small></div>
        <button className="mobile-close" onClick={() => setMobileNav(false)}><X size={18}/></button>
      </div>
      <div className="nav-label">MENÚ PRINCIPAL</div>
      <nav>{navItems.map(([label, Icon]) => <button key={label} className={`nav-item ${page === label ? "active" : ""}`} onClick={() => { setPage(label); setMobileNav(false); }}>
        <Icon size={19}/><span>{label}</span>{page === label && <span className="nav-dot"/>}
      </button>)}</nav>
      <div className="sidebar-bottom">
        <div className="sidebar-note"><div className="note-icon"><ChartNoAxesColumn size={19}/></div><strong>¡Sigue creando!</strong><p>Cada idea ayuda a hacer crecer la marca.</p></div>
        <div className="profile"><div className="avatar">DG</div><div><strong>Diseño y Marketing</strong><small>Panel de trabajo</small></div><Settings size={17}/></div>
      </div>
    </aside>

    <main className="main-area">
      <header className="topbar">
        <button className="menu-toggle" onClick={() => setMobileNav(!mobileNav)}><Menu/></button>
        <div className="breadcrumb"><span>Área de trabajo</span><b>/</b><strong>{page}</strong></div>
        <div className="top-actions">
          <label className="search-box"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar trabajos..."/></label>
          <button className="icon-button" title="Notificaciones"><Bell size={19}/><i/></button>
          <div className="top-profile"><div className="avatar">SR</div><div><strong>Supermercado Selecto Roney</strong><small>Administrador del área</small></div><button className="logout-button" onClick={handleLogout} title="Cerrar sesión"><LogOut size={16}/><span>Salir</span></button></div>
        </div>
      </header>

      <div className="page-content">
        {notice && <div className="toast"><CheckCircle2 size={18}/>{notice}</div>}
        {page === "Inicio" && <>
          <section className="welcome-banner">
            <div className="welcome-copy"><div className="eyebrow"><span/> PANEL DE CONTROL</div><h1>Diseño Gráfico <span>& Marketing</span></h1><p>Organiza tus ideas, controla tus entregas y da seguimiento a cada campaña de Supermercado Selecto Roney.</p><button className="primary-button" onClick={() => { setPage("Trabajos"); setShowJobForm(true); }}><Plus size={17}/> Registrar trabajo</button></div>
            <div className="banner-art"><div className="art-circle circle-one"/><div className="art-circle circle-two"/><div className="art-card"><Megaphone size={35}/><span>CREATIVIDAD</span><b>que conecta</b></div><div className="art-spark">✦</div></div>
          </section>
          <section className="stats-grid">
            <StatCard label="Trabajos registrados" value={jobs.length} detail="Total en el sistema" icon={BriefcaseBusiness} tone="blue"/>
            <StatCard label="Completados" value={completed} detail="Terminados o aprobados" icon={CheckCircle2} tone="green"/>
            <StatCard label="En proceso" value={inProgress} detail="Actualmente trabajando" icon={Clock3} tone="purple"/>
            <StatCard label="Campañas activas" value={activeCampaigns} detail={`${campaigns.length} campañas en total`} icon={Megaphone} tone="orange"/>
          </section>
          <div className="section-heading"><div><h2>Resumen de actividad</h2><p>Vista general de tu producción creativa</p></div><button className="text-button" onClick={() => setPage("Reportes")}>Ver reportes <span>→</span></button></div>
          <section className="overview-grid">
            <div className="panel production-panel"><PanelTitle title="Trabajos por categoría" subtitle="Cantidad de registros por tipo"/><div className="bars">
              {[["Diseños", countType("Diseño gráfico"), "bar-blue"], ["Videos", countType("Video"), "bar-green"], ["Impresión", countType("Impresión"), "bar-orange"], ["Redes sociales", countType("Redes sociales"), "bar-purple"], ["Otros", countType("Otro"), "bar-cyan"]].map(([label, value, color]) => <div className="bar-item" key={label}><div className="bar-track"><div className={`bar-fill ${color}`} style={{height: `${Math.max(8, value / Math.max(1, jobs.length) * 100)}%`}}/><b>{value}</b></div><span>{label}</span></div>)}
            </div><div className="chart-foot"><span><i className="legend-dot blue"/>Registros actuales</span><small>Se actualiza al registrar trabajos</small></div></div>
            <div className="panel status-panel"><PanelTitle title="Estado de los trabajos" subtitle="Seguimiento de tareas"/><div className="status-list">
              <StatusRow color="green" label="Terminados / aprobados" value={completed} total={jobs.length}/>
              <StatusRow color="purple" label="En proceso" value={inProgress} total={jobs.length}/>
              <StatusRow color="orange" label="Pendientes" value={pending} total={jobs.length}/>
            </div><button className="outline-button full" onClick={() => setPage("Trabajos")}>Administrar trabajos</button></div>
          </section>
          <div className="section-heading lower-heading"><div><h2>Trabajos recientes</h2><p>Lo último que has registrado</p></div><button className="text-button" onClick={() => setPage("Trabajos")}>Ver todos <span>→</span></button></div>
          <JobsTable jobs={jobs.slice(0, 5)} updateStatus={updateStatus} deleteJob={deleteJob} compact/>
        </>}

        {page === "Trabajos" && <PageHeader title="Registro de trabajos" subtitle="Administra solicitudes, fechas de entrega y estado de cada tarea." action={<button className="primary-button" onClick={() => setShowJobForm(true)}><Plus size={17}/> Nuevo trabajo</button>}>
          <div className="filter-row"><span className="muted"><Filter size={16}/> Filtrar por estado</span><select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}><option>Todos</option><option>Pendiente</option><option>En proceso</option><option>Terminado</option><option>Aprobado</option></select><span className="result-count">{filteredJobs.length} trabajos</span></div>
          <JobsTable jobs={filteredJobs} updateStatus={updateStatus} deleteJob={deleteJob}/>
        </PageHeader>}

        {page === "Videos" && <PageHeader title="Producción de videos" subtitle="Controla videos publicitarios, reels y contenido audiovisual." action={<button className="primary-button" onClick={() => {setJobForm({...emptyJob, type:"Video"}); setShowJobForm(true);}}><Plus size={17}/> Nuevo video</button>}>
          <div className="mini-stats"><MiniStat label="Videos registrados" value={countType("Video")}/><MiniStat label="En proceso" value={jobs.filter(j=>j.type==="Video" && j.status==="En proceso").length}/><MiniStat label="Terminados" value={jobs.filter(j=>j.type==="Video" && ["Terminado","Aprobado"].includes(j.status)).length}/></div>
          <JobsTable jobs={filteredJobs} updateStatus={updateStatus} deleteJob={deleteJob}/>
        </PageHeader>}

        {page === "Diseños" && <PageHeader title="Galería y control de diseños" subtitle="Registra diseños gráficos, materiales impresos y piezas creativas." action={<button className="primary-button" onClick={() => {setJobForm({...emptyJob, type:"Diseño gráfico"}); setShowJobForm(true);}}><Plus size={17}/> Registrar diseño</button>}>
          <div className="gallery-note"><ImageIcon size={22}/><div><strong>Tu biblioteca creativa empieza aquí</strong><p>Registra cada pieza y utiliza el campo de notas para guardar la ubicación del archivo o enlace al diseño. Esta versión no sube archivos todavía.</p></div></div>
          <JobsTable jobs={filteredJobs} updateStatus={updateStatus} deleteJob={deleteJob}/>
        </PageHeader>}

        {page === "Calendario" && <PageHeader title="Calendario de entregas" subtitle="Consulta los próximos trabajos y sus fechas de entrega." action={<button className="primary-button" onClick={() => setShowJobForm(true)}><Plus size={17}/> Agregar evento</button>}>
          <div className="calendar-summary"><CalendarDays size={23}/><div><strong>Agenda de entregas</strong><p>Ordenada por fecha de entrega. Registra fechas realistas para evitar cruces.</p></div></div>
          <div className="agenda-list">{[...jobs].sort((a,b) => a.due.localeCompare(b.due)).map(j => <div className="agenda-item" key={j.id}><div className="agenda-date"><b>{new Date(j.due+"T12:00:00").getDate()}</b><span>{new Date(j.due+"T12:00:00").toLocaleDateString("es-NI",{month:"short"})}</span></div><div className="agenda-info"><strong>{j.title}</strong><span>{j.type} · Entrega {fmt(j.due)}</span></div><StatusBadge status={j.status}/></div>)}{jobs.length===0 && <EmptyState text="No hay eventos. Agrega tu primer trabajo para empezar a planificar."/>}</div>
        </PageHeader>}

        {page === "Campañas" && <PageHeader title="Campañas de marketing" subtitle="Organiza promociones, objetivos y canales de difusión." action={<button className="primary-button" onClick={() => setShowCampaignForm(true)}><Plus size={17}/> Nueva campaña</button>}>
          <div className="campaign-grid">{campaigns.map(c => <article className="campaign-card" key={c.id}><div className="campaign-top"><div className="campaign-icon"><Megaphone size={22}/></div><StatusBadge status={c.status}/></div><h3>{c.name}</h3><p>{c.goal || "Sin objetivo descrito."}</p><div className="campaign-meta"><span>Canal</span><strong>{c.channel}</strong></div><div className="campaign-meta"><span>Periodo</span><strong>{fmt(c.start)} — {fmt(c.end)}</strong></div><button className="delete-campaign" onClick={() => {if(confirm("¿Eliminar esta campaña?")) setCampaigns(campaigns.filter(x=>x.id!==c.id));}}><Trash2 size={15}/> Eliminar campaña</button></article>)}{campaigns.length===0 && <EmptyState text="Todavía no hay campañas registradas."/>}</div>
        </PageHeader>}

        {page === "Reportes" && <PageHeader title="Reportes y resultados" subtitle="Consulta tus cifras actuales y exporta los registros para trabajar en Excel.">
          <div className="report-banner"><div className="report-icon"><FileText size={28}/></div><div><h3>Reporte de actividad</h3><p>Exporta todos los trabajos registrados a un archivo CSV que puedes abrir en Excel.</p></div><button className="primary-button" onClick={exportCsv}><Download size={17}/> Exportar CSV</button></div>
          <div className="stats-grid report-stats"><StatCard label="Total de trabajos" value={jobs.length} detail="Registros guardados" icon={BriefcaseBusiness} tone="blue"/><StatCard label="Completados" value={completed} detail="Terminados o aprobados" icon={CheckCircle2} tone="green"/><StatCard label="Pendientes" value={pending} detail="Requieren seguimiento" icon={CircleAlert} tone="orange"/><StatCard label="Campañas" value={campaigns.length} detail={`${activeCampaigns} activas`} icon={Megaphone} tone="purple"/></div>
          <div className="panel report-detail"><PanelTitle title="Desglose por tipo de trabajo" subtitle="Cantidad de registros por categoría"/>{["Diseño gráfico","Video","Impresión","Redes sociales","Otro"].map(type=><StatusRow key={type} color="blue" label={type} value={countType(type)} total={jobs.length}/>)}</div>
          <p className="report-disclaimer">Nota: los datos son los registrados en este navegador. Para un reporte de rendimiento de redes sociales, añade métricas reales como alcance, interacciones, clics y ventas atribuibles a cada campaña.</p>
        </PageHeader>}

        {page === "Configuración" && <PageHeader title="Configuración" subtitle="Información básica del espacio de trabajo."><div className="panel settings-panel"><h3>Supermercado Selecto Roney</h3><p>Área de Diseño Gráfico y Marketing</p><div className="gallery-note"><Settings size={22}/><div><strong>Almacenamiento local</strong><p>Los datos se guardan en este navegador mediante localStorage. No se sincronizan automáticamente con otras computadoras. Exporta tus registros con frecuencia para conservar una copia.</p></div></div><button className="outline-button" onClick={exportCsv}><Download size={16}/> Exportar copia de trabajos</button><button className="danger-button" onClick={() => {if(confirm("¿Borrar todos los trabajos y campañas guardados en este navegador? Esta acción no se puede deshacer.")){setJobs([]);setCampaigns([]);}}}><Trash2 size={16}/> Borrar todos los datos</button></div></PageHeader>}
      </div>
      <footer className="footer"><span>© 2026 Supermercado Selecto Roney</span><span>Diseño Gráfico <i/> Marketing <i/> Creatividad</span></footer>
    </main>

    {mobileNav && <button className="scrim" aria-label="Cerrar menú" onClick={() => setMobileNav(false)}/>}
    {showJobForm && <Modal title="Registrar trabajo" onClose={() => setShowJobForm(false)}><form onSubmit={addJob} className="form-grid">
      <label className="span-two">Nombre del trabajo *<input required value={jobForm.title} onChange={e=>setJobForm({...jobForm,title:e.target.value})} placeholder="Ej. Flyer de ofertas del fin de semana"/></label>
      <label>Tipo de trabajo<select value={jobForm.type} onChange={e=>setJobForm({...jobForm,type:e.target.value})}>{["Diseño gráfico","Video","Impresión","Redes sociales","Otro"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Estado<select value={jobForm.status} onChange={e=>setJobForm({...jobForm,status:e.target.value})}>{["Pendiente","En proceso","Terminado","Aprobado"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Fecha de solicitud<input type="date" value={jobForm.date} onChange={e=>setJobForm({...jobForm,date:e.target.value})}/></label>
      <label>Fecha de entrega<input type="date" value={jobForm.due} onChange={e=>setJobForm({...jobForm,due:e.target.value})}/></label>
      <label className="span-two">Notas / ubicación del archivo<textarea rows="3" value={jobForm.notes} onChange={e=>setJobForm({...jobForm,notes:e.target.value})} placeholder="Detalles, enlace o ubicación del archivo..."/></label>
      <div className="form-actions span-two"><button type="button" className="outline-button" onClick={()=>setShowJobForm(false)}>Cancelar</button><button className="primary-button" type="submit"><Plus size={16}/> Guardar trabajo</button></div>
    </form></Modal>}
    {showCampaignForm && <Modal title="Crear campaña" onClose={() => setShowCampaignForm(false)}><form onSubmit={addCampaign} className="form-grid">
      <label className="span-two">Nombre de la campaña *<input required value={campaignForm.name} onChange={e=>setCampaignForm({...campaignForm,name:e.target.value})} placeholder="Ej. Ofertas de fin de semana"/></label>
      <label>Canal<select value={campaignForm.channel} onChange={e=>setCampaignForm({...campaignForm,channel:e.target.value})}>{["Redes sociales","Tienda física","Tienda y redes sociales","Video","Impresión"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Estado<select value={campaignForm.status} onChange={e=>setCampaignForm({...campaignForm,status:e.target.value})}>{["Planificada","Activa","Finalizada"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Fecha de inicio<input type="date" value={campaignForm.start} onChange={e=>setCampaignForm({...campaignForm,start:e.target.value})}/></label>
      <label>Fecha de finalización<input type="date" value={campaignForm.end} onChange={e=>setCampaignForm({...campaignForm,end:e.target.value})}/></label>
      <label className="span-two">Objetivo de la campaña<textarea rows="3" value={campaignForm.goal} onChange={e=>setCampaignForm({...campaignForm,goal:e.target.value})} placeholder="¿Qué se quiere lograr?"/></label>
      <div className="form-actions span-two"><button type="button" className="outline-button" onClick={()=>setShowCampaignForm(false)}>Cancelar</button><button className="primary-button" type="submit"><Plus size={16}/> Guardar campaña</button></div>
    </form></Modal>}
  </div>;
}

function StatCard({label,value,detail,icon:Icon,tone}) { return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={21}/></div><div className="stat-copy"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div><div className={`stat-decoration ${tone}`}/></div>; }
function PanelTitle({title,subtitle}) { return <div className="panel-title"><div><h3>{title}</h3><p>{subtitle}</p></div><span className="panel-menu">•••</span></div>; }
function StatusRow({color,label,value,total}) { return <div className="status-row"><div className="status-row-label"><i className={`legend-dot ${color}`}/><span>{label}</span><strong>{value}</strong></div><div className="progress-track"><div className={`progress-fill ${color}`} style={{width:`${total ? value/total*100 : 0}%`}}/></div></div>; }
function StatusBadge({status}) { const cls = status==="Terminado"||status==="Aprobado"||status==="Activa" ? "done" : status==="En proceso" ? "progress" : status==="Finalizada" ? "neutral" : status==="Planificada" ? "planned" : "pending"; return <span className={`status-badge ${cls}`}><i/>{status}</span>; }
function JobsTable({jobs,updateStatus,deleteJob,compact=false}) { return <div className="table-wrap"><table><thead><tr><th>Trabajo</th><th>Tipo</th><th>Solicitud</th><th>Entrega</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{jobs.map(j=><tr key={j.id}><td><div className="job-title"><div className="job-thumb"><ImageIcon size={17}/></div><div><strong>{j.title}</strong><small>{j.notes || "Sin notas adicionales"}</small></div></div></td><td><span className="type-pill">{j.type}</span></td><td>{fmt(j.date)}</td><td>{fmt(j.due)}</td><td><select className={`status-select ${j.status==="Terminado"||j.status==="Aprobado"?"select-done":j.status==="En proceso"?"select-progress":"select-pending"}`} value={j.status} onChange={e=>updateStatus(j.id,e.target.value)} aria-label={`Estado de ${j.title}`}>{["Pendiente","En proceso","Terminado","Aprobado"].map(s=><option key={s}>{s}</option>)}</select></td><td><button className="row-action" title="Eliminar trabajo" onClick={()=>deleteJob(j.id)}><Trash2 size={16}/></button></td></tr>)}{jobs.length===0&&<tr><td colSpan="6"><EmptyState text="No hay trabajos que coincidan. Registra uno nuevo para empezar."/></td></tr>}</tbody></table></div>; }
function PageHeader({title,subtitle,action,children}) { return <><div className="page-heading"><div><div className="eyebrow dark"><span/> GESTIÓN DEL ÁREA</div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>{children}</>; }
function MiniStat({label,value}) { return <div className="mini-stat"><span>{label}</span><strong>{value}</strong></div>; }
function EmptyState({text}) { return <div className="empty-state"><ImageIcon size={25}/><p>{text}</p></div>; }
function Modal({title,onClose,children}) { return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><div className="modal"><div className="modal-head"><div><h2>{title}</h2><p>Supermercado Selecto Roney</p></div><button className="icon-button" onClick={onClose}><X size={19}/></button></div>{children}</div></div>; }


function LoginScreen({ onLogin, error }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  function submit(e) {
    e.preventDefault();
    const ok = onLogin(username, password);
    setLocalError(ok ? "" : "Usuario o contraseña incorrectos.");
  }
  return <main className="login-page">
    <div className="login-decoration login-decoration-one"/><div className="login-decoration login-decoration-two"/>
    <section className="login-card">
      <div className="login-brand-mark"><ShoppingCart size={30}/></div>
      <div className="login-eyebrow">SUPERmercado · ÁREA INTERNA</div>
      <h1>Selecto <span>Roney</span></h1>
      <p className="login-subtitle">Diseño Gráfico & Marketing</p>
      <div className="login-divider"/>
      <h2>Bienvenido de nuevo</h2>
      <p className="login-description">Inicia sesión para administrar trabajos, campañas y reportes.</p>
      <form className="login-form" onSubmit={submit}>
        <label>Usuario
          <span className="login-input-wrap"><UserRound size={18}/><input autoComplete="username" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Ingresa tu usuario" required/></span>
        </label>
        <label>Contraseña
          <span className="login-input-wrap"><LockKeyhole size={18}/><input autoComplete="current-password" type={showPassword ? "text" : "password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Ingresa tu contraseña" required/><button type="button" className="password-toggle" onClick={()=>setShowPassword(!showPassword)} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></span>
        </label>
        {(error || localError) && <div className="login-error" role="alert">{error || localError}</div>}
        <button className="login-submit" type="submit">Iniciar sesión <span>→</span></button>
      </form>
      <div className="login-demo"><strong>Acceso de demostración</strong><span>Usuario: <b>admin</b></span><span>Contraseña: <b>Selecto2026!</b></span></div>
      <p className="login-security-note"><LockKeyhole size={13}/> Acceso de prueba para uso local. Configura autenticación de servidor antes de usar datos reales.</p>
    </section>
    <footer className="login-footer">© {new Date().getFullYear()} Supermercado Selecto Roney · Sistema de Diseño y Marketing</footer>
  </main>;
}
