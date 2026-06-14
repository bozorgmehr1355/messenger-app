// ─── components.jsx ───
// کامپوننت‌های UI مشترک که در همه ماژول‌ها استفاده می‌شن

function Av({user,size=36}) {
  if (!user) return <div style={{width:size,height:size,borderRadius:"50%",background:C.surfaceAlt,flexShrink:0}}/>;
  return (
    <div style={{width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,${C.teal},#A66B0A)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.38,fontWeight:700,color:"#fff",flexShrink:0,position:"relative"}}>
      {user.av || user.avatar}
      {user.online!==undefined && <div style={{position:"absolute",bottom:1,right:1,width:size*0.27,height:size*0.27,borderRadius:"50%",background:user.online?C.online:C.textDim,border:`2px solid ${C.bg}`}}/>}
    </div>
  );
}

function Badge({status}) {
  const map = {
    pending:["در انتظار",C.warning],approved:["تأیید شد",C.success],rejected:["رد شد",C.danger],
    inprogress:["در جریان",C.teal],done:["تکمیل",C.success],
    high:["مهم",C.danger],medium:["متوسط",C.warning],low:["عادی",C.textMuted],
  };
  const [lbl,col] = map[status]||[status,C.textMuted];
  return <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:col+"22",color:col,fontWeight:600}}>{lbl}</span>;
}

function Progress({tasks}) {
  const done = tasks.filter(t=>t.status==="done").length;
  const pct  = tasks.length ? Math.round(done/tasks.length*100) : 0;
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.textMuted,marginBottom:4}}><span>{done}/{tasks.length}</span><span>{pct}%</span></div>
      <div style={{height:3,background:C.border,borderRadius:3,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:pct===100?C.success:C.teal,transition:"width 0.3s"}}/>
      </div>
    </div>
  );
}

function ConfirmDlg({cfg,onClose}) {
  if (!cfg) return null;
  const cols = {danger:C.danger,warning:C.warning,success:C.success};
  const col  = cols[cfg.type]||C.teal;
  return (
    <div style={{position:"fixed",inset:0,background:"#000C",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200}} onClick={onClose}>
      <div style={{background:C.surface,borderRadius:"20px 20px 0 0",padding:"24px 20px 28px",width:"100%",maxWidth:480,textAlign:"center"}} onClick={e=>e.stopPropagation()}>
        <div style={{width:36,height:4,background:C.border,borderRadius:2,margin:"0 auto 20px"}}/>
        <div style={{fontSize:16,fontWeight:700,marginBottom:8}}>{cfg.title}</div>
        <div style={{fontSize:13,color:C.textMuted,lineHeight:1.7,marginBottom:24}}>{cfg.message}</div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,padding:"13px",borderRadius:10,border:`1px solid ${C.border}`,background:"transparent",color:C.textMuted,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>انصراف</button>
          <button onClick={()=>{cfg.onConfirm();onClose();}} style={{flex:1,padding:"13px",borderRadius:10,border:"none",background:col,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{cfg.confirmLabel||"تأیید"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ───




// ─── Excel Export ───
function exportToCSV(filename, headers, rows) {
  const BOM = "\uFEFF";
  const headerRow = headers.join(",");
  const dataRows = rows.map(r => r.map(cell => {
    const s = String(cell || "").replace(/"/g, '""');
    return s.includes(",") || s.includes("\n") ? `"${s}"` : s;
  }).join(","));
  const csv = BOM + [headerRow, ...dataRows].join("\n");
  const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename + ".csv";
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}


// ─── Drawer Components ───
function DrawerSection({title, children}) {
  return (
    <div style={{borderTop:"1px solid #303030"}}>
      <div style={{fontSize:10,fontWeight:700,color:"#4A4A4A",padding:"10px 16px 4px",letterSpacing:1}}>{title}</div>
      {children}
    </div>
  );
}

function DrawerCollapsible({title, count, children, defaultOpen=false}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{borderTop:"1px solid #303030"}}>
      <div onClick={()=>setOpen(p=>!p)}
        style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px 4px",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
        <div style={{fontSize:10,fontWeight:700,color:"#4A4A4A",letterSpacing:1,flex:1}}>{title}</div>
        <div style={{fontSize:11,color:"#4A4A4A"}}>{open?"▲":"▼"} {count}</div>
      </div>
      {open && children}
    </div>
  );
}

function DrawerItem({icon, label, sub, badge, active, online, danger, onClick}) {
  const C2 = {teal:"#D4880E",tealDim:"#D4880E22",text:"#D1D3D4",textDim:"#4A4A4A",danger:"#C94B3F",surfaceAlt:"#252525"};
  return (
    <div onClick={onClick}
      style={{display:"flex",alignItems:"center",gap:12,padding:"9px 16px",cursor:"pointer",WebkitTapHighlightColor:"transparent",background:active?C2.tealDim:"transparent",color:danger?C2.danger:C2.text}}>
      <div style={{width:36,height:36,borderRadius:"50%",background:typeof icon==="string"?C2.surfaceAlt:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:typeof icon==="string"?18:0,flexShrink:0,position:"relative"}}>
        {typeof icon==="string" ? icon : icon}
        {online&&<div style={{position:"absolute",bottom:1,right:1,width:9,height:9,borderRadius:"50%",background:"#8DB33A",border:"2px solid #131313"}}/>}
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:active?600:400,color:danger?C2.danger:active?C2.teal:C2.text}}>{label}</div>
        {sub&&<div style={{fontSize:11,color:C2.textDim,marginTop:1}}>{sub}</div>}
      </div>
      {badge>0&&<div style={{background:C2.teal,borderRadius:12,minWidth:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",padding:"0 6px",flexShrink:0}}>{faN(badge)}</div>}
    </div>
  );
}


// ─── Workflow Timeline Component ───
function WorkflowTimeline({workflow, users}) {
  if (!workflow || !workflow.length) return null;
  const C2 = {teal:"#D4880E",success:"#8DB33A",warning:"#C8960A",danger:"#C94B3F",surface:"#1C1C1C",border:"#303030",text:"#D1D3D4",textMuted:"#888888",textDim:"#4A4A4A"};
  const actionColor = {submitted:"#3B82F6",sent:"#3B82F6",received:C2.teal,approved:C2.success,rejected:C2.danger,pending:C2.warning};
  const actionLabel = {submitted:"ثبت شد",sent:"ارسال شد",received:"دریافت شد",approved:"تأیید شد",rejected:"رد شد",pending:"در انتظار"};
  const currentStep = workflow.filter(w=>w.done).length;

  return (
    <div style={{marginTop:16}}>
      <div style={{fontSize:12,fontWeight:700,color:C2.textMuted,marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
        <span>مسیر گردش کار</span>
        <span style={{fontSize:11,color:C2.teal}}>({faN(currentStep)}/{faN(workflow.length)} مرحله)</span>
      </div>
      {workflow.map((step,i)=>{
        const user = users.find(u=>u.id===step.userId);
        const isLast = i === workflow.length-1;
        const col = step.done ? actionColor[step.action]||C2.success : C2.border;
        return (
          <div key={i} style={{display:"flex",gap:0,position:"relative"}}>
            {/* Line */}
            {!isLast && <div style={{position:"absolute",right:15,top:28,width:2,height:"calc(100% - 4px)",background:step.done?C2.success:C2.border,zIndex:0}}/>}
            {/* Dot */}
            <div style={{width:30,height:30,borderRadius:"50%",background:step.done?col:"transparent",border:`2px solid ${col}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,zIndex:1,marginLeft:12}}>
              {step.done && step.action!=="pending" && <div style={{width:10,height:10,borderRadius:"50%",background:"#fff"}}/>}
              {!step.done && <div style={{width:8,height:8,borderRadius:"50%",background:col}}/>}
            </div>
            {/* Content */}
            <div style={{flex:1,paddingBottom:isLast?0:16,paddingRight:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:2}}>
                <span style={{fontSize:13,fontWeight:600,color:step.done?C2.text:C2.textDim}}>{step.title}</span>
                {step.done && <span style={{fontSize:10,background:col+"22",color:col,padding:"1px 7px",borderRadius:10,fontWeight:600,flexShrink:0,marginRight:6}}>{actionLabel[step.action]}</span>}
              </div>
              {user && <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                <div style={{width:18,height:18,borderRadius:"50%",background:`linear-gradient(135deg,${C2.teal},#005C4B)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#fff",flexShrink:0}}>{user.av}</div>
                <span style={{fontSize:11,color:C2.textMuted}}>{user.name}</span>
              </div>}
              {step.note && <div style={{fontSize:11,color:C2.textMuted,fontStyle:"italic",marginBottom:2}}>"{step.note}"</div>}
              {step.time && <div style={{fontSize:10,color:C2.textDim}}>{step.time}</div>}
              {!step.done && <div style={{fontSize:11,color:C2.warning}}>در انتظار اقدام</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── سازگار با سپیدار ───
// خروجی CSV با ستون‌های استاندارد سپیدار:
// کد طرف حساب، شرح، مبلغ بدهکار، مبلغ بستانکار، شماره سند، تاریخ



const PAYMENT_TYPES = [
  "پرداخت به تامین‌کننده","پرداخت حقوق و دستمزد","پرداخت اجاره",
  "هزینه عملیاتی","هزینه تعمیر و نگهداری","مساعده پرسنلی",
  "پرداخت مالیات","هزینه حمل و نقل","سایر",
];

const CREDS = {
  1:"9999",2:"1111",3:"2222",4:"3333",5:"4444",
  6:"5555",7:"6666",8:"7777",9:"8888",10:"0000",11:"1212",12:"3434",
};

// گردش کار پرداخت
function makeWorkflow(requesterId) {
  return [
    {step:1, title:"ثبت درخواست",        assignedTo:requesterId, role:"requester", status:"done",    note:"",time:""},
    {step:2, title:"تأیید مدیر فروش",    assignedTo:4,           role:"sales",     status:"pending", note:"",time:""},
    {step:3, title:"تأیید مدیر مالی",    assignedTo:3,           role:"finance",   status:"pending", note:"",time:""},
    {step:4, title:"تأیید مدیر عامل",    assignedTo:2,           role:"ceo",       status:"pending", note:"",time:""},
    {step:5, title:"دستور پرداخت",       assignedTo:3,           role:"finance2",  status:"pending", note:"",time:""},
    {step:6, title:"پرداخت توسط خزانه",  assignedTo:12,          role:"treasury",  status:"pending", note:"",time:""},
  ];
}

const SAMPLE_PAYMENTS = [
  {
    id:1, code:"PAY-1401", type:"پرداخت به تامین‌کننده",
    requesterId:6, requesterName:"مجتبی قاسم‌بیک",
    amount:48500000, desc:"خرید قطعات یدکی خط تولید", ref:"INV-2024-089",
    beneficiary:"شرکت صنایع ماشین‌آلات اصفهان", bankAccount:"IR120570028080010957856003",
    date:"۱۴۰۴/۰۳/۱۸", status:"step3", attachments:[],
    workflow:[
      {step:1,title:"ثبت درخواست",assignedTo:6,role:"requester",status:"done",note:"فاکتور شماره INV-2024-089 پیوست است",time:"۱۴۰۴/۰۳/۱۸ · ۰۹:۰۰"},
      {step:2,title:"تأیید مدیر فروش",assignedTo:4,role:"sales",status:"done",note:"تأیید می‌شود",time:"۱۴۰۴/۰۳/۱۸ · ۱۱:۳۰"},
      {step:3,title:"تأیید مدیر مالی",assignedTo:3,role:"finance",status:"pending",note:"",time:""},
      {step:4,title:"تأیید مدیر عامل",assignedTo:2,role:"ceo",status:"pending",note:"",time:""},
      {step:5,title:"دستور پرداخت",assignedTo:3,role:"finance2",status:"pending",note:"",time:""},
      {step:6,title:"پرداخت توسط خزانه",assignedTo:12,role:"treasury",status:"pending",note:"",time:""},
    ],
  },
  {
    id:2, code:"PAY-1402", type:"مساعده پرسنلی",
    requesterId:10, requesterName:"حسین مرادی",
    amount:5000000, desc:"مساعده تیرماه ۱۴۰۴", ref:"",
    beneficiary:"حسین مرادی", bankAccount:"IR890570028080010957856011",
    date:"۱۴۰۴/۰۳/۲۰", status:"paid",
    workflow:[
      {step:1,title:"ثبت درخواست",assignedTo:10,role:"requester",status:"done",note:"",time:"۱۴۰۴/۰۳/۲۰ · ۰۸:۰۰"},
      {step:2,title:"تأیید مدیر فروش",assignedTo:4,role:"sales",status:"done",note:"تأیید",time:"۱۴۰۴/۰۳/۲۰ · ۱۰:۰۰"},
      {step:3,title:"تأیید مدیر مالی",assignedTo:3,role:"finance",status:"done",note:"مبلغ صحیح است",time:"۱۴۰۴/۰۳/۲۰ · ۱۲:۰۰"},
      {step:4,title:"تأیید مدیر عامل",assignedTo:2,role:"ceo",status:"done",note:"موافقت شد",time:"۱۴۰۴/۰۳/۲۰ · ۱۴:۰۰"},
      {step:5,title:"دستور پرداخت",assignedTo:3,role:"finance2",status:"done",note:"دستور پرداخت صادر شد",time:"۱۴۰۴/۰۳/۲۰ · ۱۵:۰۰"},
      {step:6,title:"پرداخت توسط خزانه",assignedTo:12,role:"treasury",status:"done",note:"پرداخت انجام شد — کد پیگیری: ۱۲۳۴۵۶",time:"۱۴۰۴/۰۳/۲۰ · ۱۶:۳۰"},
    ],
  },
];

// ─── Helpers ───
function fmt(n) {
  return Number(n).toLocaleString("fa-IR");
}

function statusLabel(s) {
  const map = {
    step1:"در انتظار تأیید فروش", step2:"در انتظار تأیید فروش",
    step3:"در انتظار تأیید مالی", step4:"در انتظار تأیید مدیر عامل",
    step5:"در انتظار دستور پرداخت", step6:"در انتظار پرداخت",
    paid:"پرداخت شده", rejected:"رد شده",
  };
  return map[s] || s;
}

function statusColor(s) {
  if (s==="paid") return C.success;
  if (s==="rejected") return C.danger;
  return C.warning;
}

function exportSepidaar(payments) {
  const BOM = "\uFEFF";
  // Sepidaar compatible columns
  const headers = ["شماره سند","تاریخ","نوع","شرح","طرف حساب","شماره حساب بانکی","مبلغ (ریال)","وضعیت","درخواست‌کننده","تأیید فروش","تأیید مالی","تأیید مدیر عامل","تاریخ پرداخت","کد پیگیری"];
  const rows = payments.map(p => {
    const salesStep    = p.workflow.find(w=>w.role==="sales");
    const financeStep  = p.workflow.find(w=>w.role==="finance");
    const ceoStep      = p.workflow.find(w=>w.role==="ceo");
    const payStep      = p.workflow.find(w=>w.role==="treasury");
    return [
      p.code, p.date, p.type, p.desc, p.beneficiary,
      p.bankAccount, p.amount * 10, // تبدیل به ریال
      statusLabel(p.status),
      USERS.find(u=>u.id===p.requesterId)?.name || "",
      salesStep?.status==="done" ? "✓" : "",
      financeStep?.status==="done" ? "✓" : "",
      ceoStep?.status==="done" ? "✓" : "",
      payStep?.time || "",
      payStep?.note || "",
    ];
  });
  const csv = BOM + [headers, ...rows].map(r =>
    r.map(c => { const s=String(c||"").replace(/"/g,'""'); return s.includes(",")||s.includes("\n")?`"${s}"`:s; }).join(",")
  ).join("\n");
  const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = "پرداخت‌ها-سپیدار.csv";
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}


function StepBadge({status}) {
  const map = {done:["تأیید",C.success], pending:["در انتظار",C.warning], rejected:["رد شد",C.danger]};
  const [l,col] = map[status]||["—",C.textDim];
  return <span style={{fontSize:10,padding:"2px 8px",borderRadius:10,background:col+"22",color:col,fontWeight:600}}>{l}</span>;
}

// ─── Payment Detail ───
function PaymentDetail({payment, me, onBack, onAction, isAdmin}) {
  const [note, setNote] = useState("");
  const myStep = payment.workflow.find(w => w.assignedTo===me.id && w.status==="pending");
  const currentStepNum = payment.workflow.filter(w=>w.status==="done").length + 1;

  return (
    <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:16}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,paddingBottom:14,borderBottom:`1px solid ${C.border}`}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:C.teal,cursor:"pointer",fontSize:24,lineHeight:1,padding:0}}>‹</button>
        <div style={{flex:1}}>
          <div style={{fontSize:15,fontWeight:700}}>{payment.code}</div>
          <div style={{fontSize:11,color:statusColor(payment.status)}}>{statusLabel(payment.status)}</div>
        </div>
        <div style={{fontSize:16,fontWeight:800,color:C.teal}}>{fmt(payment.amount)} تومان</div>
      </div>

      {/* Info Card */}
      <div style={{background:C.surface,borderRadius:12,padding:14,border:`1px solid ${C.border}`,marginBottom:12}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          {[
            ["نوع",payment.type],["تاریخ",payment.date],
            ["شرح",payment.desc],["شماره مرجع",payment.ref||"—"],
          ].map(([k,v],i)=>(
            <div key={i} style={{gridColumn:i===2||i===3?"1/-1":"auto"}}>
              <div style={{fontSize:10,color:C.textDim,marginBottom:3}}>{k}</div>
              <div style={{fontSize:13,color:C.text,fontWeight:500}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{borderTop:`1px solid ${C.border}`,paddingTop:10}}>
          <div style={{fontSize:10,color:C.textDim,marginBottom:3}}>ذینفع / گیرنده</div>
          <div style={{fontSize:13,fontWeight:600}}>{payment.beneficiary}</div>
          {payment.bankAccount && (
            <div style={{fontSize:11,color:C.textMuted,marginTop:3,direction:"ltr",textAlign:"right"}}>{payment.bankAccount}</div>
          )}
        </div>
      </div>

      {/* Workflow Timeline */}
      <div style={{background:C.surface,borderRadius:12,padding:14,border:`1px solid ${C.border}`,marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:14,color:C.textMuted}}>مسیر تأیید</div>
        {payment.workflow.map((step,i)=>{
          const user = USERS.find(u=>u.id===step.assignedTo);
          const isLast = i===payment.workflow.length-1;
          const isCurrent = step.status==="pending" && (i===0 || payment.workflow[i-1].status==="done");
          const dotColor = step.status==="done"?C.success:step.status==="rejected"?C.danger:isCurrent?C.warning:C.border;
          return (
            <div key={i} style={{display:"flex",gap:12,position:"relative",paddingBottom:isLast?0:4}}>
              {!isLast && <div style={{position:"absolute",right:11,top:28,width:2,bottom:0,background:step.status==="done"?C.success:C.border}}/>}
              <div style={{width:24,height:24,borderRadius:"50%",background:step.status==="done"?dotColor:"transparent",border:`2px solid ${dotColor}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,zIndex:1,marginTop:2}}>
                {step.status==="done" && <span style={{fontSize:10,color:"#fff",fontWeight:700}}>✓</span>}
                {isCurrent && <div style={{width:8,height:8,borderRadius:"50%",background:C.warning}}/>}
              </div>
              <div style={{flex:1,paddingBottom:isLast?0:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
                  <span style={{fontSize:13,fontWeight:600,color:step.status==="done"?C.text:isCurrent?C.warning:C.textDim}}>{step.title}</span>
                  <StepBadge status={step.status}/>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:step.note?4:0}}>
                  <Av user={user} size={18}/>
                  <span style={{fontSize:11,color:C.textMuted}}>{user?.name}</span>
                </div>
                {step.note && <div style={{fontSize:11,color:C.textMuted,background:C.surfaceAlt,borderRadius:6,padding:"5px 8px",marginTop:4,fontStyle:"italic"}}>"{step.note}"</div>}
                {step.time && <div style={{fontSize:10,color:C.textDim,marginTop:3}}>{step.time}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Area - only show to the person whose turn it is */}
      {myStep && (
        <div style={{background:C.surface,borderRadius:12,padding:14,border:`1px solid ${C.warning}44`,marginBottom:12}}>
          <div style={{fontSize:13,fontWeight:700,color:C.warning,marginBottom:10}}>نوبت اقدام شماست</div>
          <div style={{fontSize:12,color:C.textMuted,marginBottom:6}}>{myStep.title}</div>
          <textarea
            style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",color:C.text,fontSize:14,outline:"none",direction:"rtl",boxSizing:"border-box",marginBottom:10,fontFamily:"inherit",lineHeight:1.7,resize:"none",height:80}}
            placeholder="یادداشت (اختیاری)..."
            value={note} onChange={e=>setNote(e.target.value)}
          />
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>{onAction(payment.id,"rejected",myStep.step,note);onBack();}}
              style={{flex:1,padding:"12px",borderRadius:10,border:"none",background:C.danger+"33",color:C.danger,fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:13}}>
              رد درخواست
            </button>
            <button onClick={()=>{onAction(payment.id,"approved",myStep.step,note);onBack();}}
              style={{flex:2,padding:"12px",borderRadius:10,border:"none",background:C.success,color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:14}}>
              {myStep.role==="treasury"?"ثبت پرداخت ✓":"تأیید می‌کنم ✓"}
            </button>
          </div>
        </div>
      )}

      {/* Treasury special - payment details */}
      {payment.status==="paid" && (
        <div style={{background:C.success+"11",borderRadius:12,padding:14,border:`1px solid ${C.success}33`,textAlign:"center"}}>
          <div style={{fontSize:20,marginBottom:6}}>✓</div>
          <div style={{fontSize:14,fontWeight:700,color:C.success}}>پرداخت انجام شده</div>
          <div style={{fontSize:12,color:C.textMuted,marginTop:4}}>
            {payment.workflow.find(w=>w.role==="treasury")?.note}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── New Payment Form ───
function NewPaymentForm({me, onSave, onClose}) {
  const [form, setForm] = useState({
    type:"پرداخت به تامین‌کننده", desc:"", amount:"", ref:"",
    beneficiary:"", bankAccount:"",
  });
  const [err, setErr] = useState("");

  function submit() {
    if (!form.desc.trim())        { setErr("شرح پرداخت را وارد کنید"); return; }
    if (!form.amount || isNaN(Number(form.amount.replace(/,/g,"")))) { setErr("مبلغ را به درستی وارد کنید"); return; }
    if (!form.beneficiary.trim()) { setErr("نام ذینفع را وارد کنید"); return; }
    const newP = {
      id: Date.now(),
      code: "PAY-" + String(Date.now()).slice(-4),
      type: form.type,
      requesterId: me.id,
      requesterName: me.name,
      amount: Number(form.amount.replace(/,/g,"")),
      desc: form.desc,
      ref: form.ref,
      beneficiary: form.beneficiary,
      bankAccount: form.bankAccount,
      date: "امروز",
      status: "step2",
      attachments: [],
      workflow: makeWorkflow(me.id).map((w,i) => i===0 ? {...w, status:"done", time:nowShamsi(), note:"ثبت شد"} : w),
    };
    onSave(newP);
    onClose();
  }

  const fi = {width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",color:C.text,fontSize:15,outline:"none",direction:"rtl",boxSizing:"border-box",marginBottom:10,fontFamily:"inherit",WebkitAppearance:"none"};

  return (
    <div style={{position:"fixed",inset:0,background:"#000A",display:"flex",alignItems:"flex-end",zIndex:99}} onClick={onClose}>
      <div style={{background:C.surface,borderRadius:"20px 20px 0 0",padding:"20px 20px calc(24px + env(safe-area-inset-bottom))",width:"100%",maxWidth:520,margin:"0 auto",maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{width:36,height:4,background:C.border,borderRadius:2,margin:"0 auto 16px"}}/>
        <div style={{fontSize:15,fontWeight:700,marginBottom:16}}>درخواست پرداخت جدید</div>

        <div style={{fontSize:12,color:C.textMuted,marginBottom:4}}>نوع پرداخت</div>
        <select style={fi} value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}>
          {PAYMENT_TYPES.map(t=><option key={t}>{t}</option>)}
        </select>

        <div style={{fontSize:12,color:C.textMuted,marginBottom:4}}>شرح پرداخت</div>
        <textarea style={{...fi,height:80,resize:"none",lineHeight:1.7}} placeholder="توضیح کامل پرداخت..." defaultValue={form.desc} onBlur={e=>setForm(p=>({...p,desc:e.target.value}))}></textarea>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div>
            <div style={{fontSize:12,color:C.textMuted,marginBottom:4}}>مبلغ (تومان)</div>
            <input style={{...fi}} placeholder="مثلاً: ۵۰۰۰۰۰۰" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} type="tel"/>
          </div>
          <div>
            <div style={{fontSize:12,color:C.textMuted,marginBottom:4}}>شماره مرجع / فاکتور</div>
            <input style={{...fi}} placeholder="اختیاری" value={form.ref} onChange={e=>setForm(p=>({...p,ref:e.target.value}))}/>
          </div>
        </div>

        <div style={{fontSize:12,color:C.textMuted,marginBottom:4}}>ذینفع / گیرنده</div>
        <input style={fi} placeholder="نام شرکت یا شخص" value={form.beneficiary} onChange={e=>setForm(p=>({...p,beneficiary:e.target.value}))}/>

        <div style={{fontSize:12,color:C.textMuted,marginBottom:4}}>شماره حساب / شبا (اختیاری)</div>
        <input style={{...fi,direction:"ltr",textAlign:"left"}} placeholder="IR..." value={form.bankAccount} onChange={e=>setForm(p=>({...p,bankAccount:e.target.value}))}/>

        {/* Workflow preview */}
        <div style={{background:C.surfaceAlt,borderRadius:10,padding:"10px 14px",marginBottom:12}}>
          <div style={{fontSize:11,color:C.textDim,marginBottom:8}}>مسیر تأیید این درخواست:</div>
          <div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap",gap:6}}>
            {["شما","اردستانی","سراج‌الدینی","کریم‌لو","سراج‌الدینی","اعرابی"].map((n,i,arr)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:4}}>
                <span style={{fontSize:11,background:C.surface,borderRadius:20,padding:"3px 10px",color:C.textMuted}}>{n}</span>
                {i<arr.length-1 && <span style={{color:C.textDim,fontSize:12}}>←</span>}
              </div>
            ))}
          </div>
        </div>

        {err && <div style={{background:C.danger+"22",borderRadius:8,padding:"9px 12px",fontSize:13,color:C.danger,marginBottom:10,textAlign:"center"}}>{err}</div>}

        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,padding:"12px",borderRadius:10,border:`1px solid ${C.border}`,background:"transparent",color:C.textMuted,cursor:"pointer",fontFamily:"inherit"}}>انصراف</button>
          <button onClick={submit} style={{flex:2,padding:"12px",borderRadius:10,border:"none",background:C.teal,color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:14}}>ارسال برای تأیید</button>
        </div>
      </div>
    </div>
  );
}

// ─── Payment Components (end) ───

function LoginScreen({onLogin}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [screen, setScreen]     = useState("login"); // login | forgot | forgot_result
  const [forgotUser, setForgotUser] = useState("");
  const [forgotResult, setForgotResult] = useState("");
  function handleLogin() {
    if (!username.trim() || !password.trim()) { setError("نام کاربری و رمز عبور را وارد کنید"); return; }
    const found = Object.entries(USER_CREDENTIALS).find(
      ([id, cred]) => cred.username.toLowerCase() === username.trim().toLowerCase() && cred.password === password
    );
    if (found) {
      onLogin(Number(found[0]));
    } else {
      setError("نام کاربری یا رمز عبور اشتباه است");
      setPassword("");
    }
  }

  function handleForgot() {
    if (!forgotUser.trim()) { setError("نام کاربری را وارد کنید"); return; }
    const found = Object.entries(USER_CREDENTIALS).find(
      ([id, cred]) => cred.username.toLowerCase() === forgotUser.trim().toLowerCase()
    );
    if (found) {
      const hint = RECOVERY_HINTS[Number(found[0])];
      setForgotResult(hint);
      setScreen("forgot_result");
      setError("");
    } else {
      setError("نام کاربری یافت نشد");
    }
  }

  const inp = {
    width:"100%", background:"#1C1C1C", border:"1px solid #303030",
    borderRadius:10, padding:"13px 16px", color:"#D1D3D4", fontSize:16,
    outline:"none", direction:"ltr", textAlign:"right", fontFamily:"inherit",
    boxSizing:"border-box",
  };

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100dvh",background:"#131313",color:"#D1D3D4",fontFamily:"'Vazirmatn','Segoe UI',sans-serif",direction:"rtl",padding:"24px 20px",paddingTop:"env(safe-area-inset-top)"}}>

      {/* Logo area */}
      <div style={{marginBottom:32,textAlign:"center"}}>
        <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAxNTk3LjA5IDEyNTYuNzMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE1OTcuMDkgMTI1Ni43MzsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4NCgkuc3Qwe2ZpbGw6I0QxRDNENDt9DQoJLnN0MXtmaWxsOiNGREI5MTM7fQ0KPC9zdHlsZT4NCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zMi4xMiw4MDAuNTVjNS41MSwzNy43OCwyMy42MSw3MS43OSw1Mi4wMiwxMDEuNDJjMjQuNjMsMjUuNjgsNTcuMDIsNDguMDMsOTUuNyw2Ni41OA0KCWMxMjQuOTUsNTkuOTUsMzE1LjUzLDgwLjI3LDUyMS45OCw0NS4xYzE2MS4wMi0yNy40MSwzMDMuMTQtODMuNzIsNDA2LjE5LTE1My45M2MxNS40NS0xMC41Myw0Ljk0LTM3LjA4LTEyLjQzLTMxLjQ2DQoJYy02Ny41MSwyMS44NC0xNDIuMzYsNDAuMzEtMjIxLjcxLDUzLjgzYy0zMDIuMDEsNTEuNDUtNTYyLjMzLDEzLjIzLTYwOC40Mi04NC45MmMtMC40Mi0wLjkxLTAuODItMS44MS0xLjItMi43Mg0KCWMtMi41NS01Ljk1LTQuMzEtMTIuMTMtNS4yMy0xOC41M2MtMTYuNjUtMTEzLjY0LDIzMS42My0yNTAuMzcsNTU0LjU3LTMwNS4zNmMxMTAuMzktMTguOCwyMTUuMjEtMjUuNjIsMzA2LjA4LTIxLjg4DQoJYy0xMTEuNzQtNDMuMjgtMjQ1Ljc3LTY4LjUyLTM4OS44OC02OC41MmMtMTA0LjI1LDAtMjAzLjIyLDEzLjIxLTI5Mi4zLDM2LjkxQzE4My4wNSw0OTkuNzEsMTAuNzksNjU0Ljk0LDMyLjEyLDgwMC41NSIvPg0KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQ3MS4wMiwxMTM3LjJjMTExLjcyLDQzLjI4LDI0NS43LDY4LjQ4LDM4OS43Nyw2OC40OGMxMDQuNDIsMCwyMDMuNTYtMTMuMjMsMjkyLjc0LTM3LjAyDQoJYzI1NC4yMS04Mi43LDQyNi4yMi0yMzcuODUsNDA0Ljg4LTM4My4zOGMtNS41MS0zNy43NS0yMy42MS03MS43OS01Mi4wMi0xMDEuMzhjLTI0LjYxLTI1LjY4LTU3LTQ4LjA1LTk1LjY2LTY2LjYyDQoJYy0xMjQuOTctNTkuOTUtMzE1LjUxLTgwLjI4LTUyMi00NS4xYy0xNjAuOTksMjcuNDMtMzAzLjE0LDgzLjcyLTQwNi4xNywxNTMuOTVjLTE1LjQ1LDEwLjUxLTQuOTYsMzcuMDYsMTIuNDEsMzEuNDQNCgljNjcuNTMtMjEuODQsMTQyLjM4LTQwLjI5LDIyMS43My01My44MWMzMDItNTEuNDUsNTYyLjMzLTEzLjIxLDYwOC40NCw4NC45YzAuNCwwLjkxLDAuNzgsMS44MSwxLjE4LDIuNzINCgljMi41Myw1Ljk3LDQuMywxMi4xNiw1LjIzLDE4LjUzYzE2LjY1LDExMy42NC0yMzEuNjMsMjUwLjM3LTU1NC41NywzMDUuMzhDNjY2LjYzLDExMzQuMSw1NjEuODMsMTE0MC45MSw0NzEuMDIsMTEzNy4yIi8+DQo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOTU4LjUyLDE4MC4zMWMwLDc4LjEtNjMuMzMsMTQxLjQzLTE0MS40MywxNDEuNDNzLTE0MS40My02My4zMy0xNDEuNDMtMTQxLjQzUzczOC45OSwzOC44OCw4MTcuMDksMzguODgNCglDODk1LjE5LDM4Ljg4LDk1OC41MiwxMDIuMjEsOTU4LjUyLDE4MC4zMSIvPg0KPC9zdmc+DQo=" alt="شرکت آذرمهر صنعت" style={{width:140,objectFit:"contain",display:"block",margin:"0 auto 12px"}} />
        <div style={{fontSize:11,color:"#555555",letterSpacing:1}}>سیستم مدیریت داخلی</div>
      </div>

      <div style={{width:"100%",maxWidth:380}}>

        {/* LOGIN */}
        {screen==="login" && (
          <>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:12,color:"#888888",marginBottom:6}}>نام کاربری</div>
              <input style={{...inp,direction:"ltr",textAlign:"left"}}
                placeholder="username"
                value={username}
                onChange={e=>{setUsername(e.target.value);setError("");}}
                onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                autoCapitalize="none" autoCorrect="off" autoComplete="username"
              />
            </div>
            <div style={{marginBottom:6}}>
              <div style={{fontSize:12,color:"#888888",marginBottom:6}}>رمز عبور</div>
              <div style={{position:"relative"}}>
                <input style={{...inp,paddingLeft:44}}
                  type={showPass?"text":"password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e=>{setPassword(e.target.value);setError("");}}
                  onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                  autoComplete="current-password"
                />
                <button onClick={()=>setShowPass(p=>!p)}
                  style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#888888",cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>
                  {showPass?"پنهان":"نمایش"}
                </button>
              </div>
            </div>
            <div style={{textAlign:"left",marginBottom:20}}>
              <button onClick={()=>{setScreen("forgot");setError("");setForgotUser("");}}
                style={{background:"none",border:"none",color:C.teal,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
                فراموشی رمز عبور؟
              </button>
            </div>
            {error && (
              <div style={{background:"#E05A4E22",border:"1px solid #E05A4E44",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#E05A4E",marginBottom:14,textAlign:"center"}}>
                {error}
              </div>
            )}
            <button onClick={handleLogin}
              style={{width:"100%",padding:"14px",borderRadius:12,background:"#D4880E",border:"none",color:"#111",fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"inherit",WebkitTapHighlightColor:"transparent"}}>
              ورود
            </button>
            <div style={{textAlign:"center",marginTop:20,fontSize:11,color:"#363636"}}>
              آذرمهر صنعت · سیستم داخلی
            </div>
          </>
        )}

        {/* FORGOT PASSWORD */}
        {screen==="forgot" && (
          <>
            <div style={{textAlign:"center",marginBottom:24}}>
              <div style={{fontSize:16,fontWeight:700,marginBottom:8}}>فراموشی رمز عبور</div>
              <div style={{fontSize:13,color:"#888888",lineHeight:1.7}}>نام کاربری خود را وارد کنید تا اطلاعات بازیابی نمایش داده شود</div>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:12,color:"#888888",marginBottom:6}}>نام کاربری</div>
              <input style={{...inp,direction:"ltr",textAlign:"left"}}
                placeholder="username"
                value={forgotUser}
                onChange={e=>{setForgotUser(e.target.value);setError("");}}
                autoCapitalize="none"
              />
            </div>
            {error && (
              <div style={{background:"#C94B3F22",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#C94B3F",marginBottom:14,textAlign:"center"}}>{error}</div>
            )}
            <button onClick={handleForgot}
              style={{width:"100%",padding:"14px",borderRadius:12,background:"#D4880E",border:"none",color:"#111",fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"inherit",marginBottom:12}}>
              بازیابی
            </button>
            <button onClick={()=>{setScreen("login");setError("");}}
              style={{width:"100%",padding:"12px",borderRadius:12,background:"transparent",border:"1px solid #303030",color:"#888888",fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>
              بازگشت به ورود
            </button>
          </>
        )}

        {/* FORGOT RESULT */}
        {screen==="forgot_result" && (
          <>
            <div style={{textAlign:"center",marginBottom:24}}>
              <div style={{fontSize:40,marginBottom:12}}>✓</div>
              <div style={{fontSize:16,fontWeight:700,marginBottom:8}}>اطلاعات بازیابی</div>
              <div style={{fontSize:13,color:"#888888",marginBottom:16}}>برای بازیابی رمز عبور با مدیر سیستم تماس بگیرید و اطلاعات زیر را ارائه دهید:</div>
              <div style={{background:"#1C1C1C",border:"1px solid #303030",borderRadius:10,padding:"14px",fontSize:14,color:"#D4880E",direction:"ltr",wordBreak:"break-all"}}>
                {forgotResult}
              </div>
            </div>
            <button onClick={()=>{setScreen("login");setError("");setForgotUser("");setForgotResult("");}}
              style={{width:"100%",padding:"14px",borderRadius:12,background:"#D4880E",border:"none",color:"#111",fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>
              بازگشت به ورود
            </button>
          </>
        )}
      </div>
    </div>
  );
}


export default function App() {
  // ─── AUTH STATE ───
  const [creds, setCreds]         = useState(USER_CREDENTIALS);
  const [loggedIn, setLoggedIn]   = useState(()=>{ try{ return localStorage.getItem("loggedIn")==="1"; }catch{return false;} });
  const [meId, setMeId]           = useState(()=>{ try{ const v=localStorage.getItem("meId"); return v?Number(v):null; }catch{return null;} });
  const [showChangePIN, setShowChangePIN] = useState(false);
  const [changePinStep, setChangePinStep] = useState("old");
  const [changePinVal, setChangePinVal]   = useState({old:"",new1:"",new2:""});
  const [pinChangeMsg, setPinChangeMsg]   = useState("");

  const me      = USERS.find(u=>u.id===meId) || USERS[0];
  const isAdmin = [1,2,3].includes(me.id); // بزرگمهر، کریم‌لو، سراج‌الدینی
  const canSeePayment = (p) =>
    isAdmin ||
    p.requesterId === me.id ||
    p.workflow.some(w => w.assignedTo === me.id);

  function saveCreds(newCreds) { setCreds(newCreds); }

  function handleLogout() {
    setLoggedIn(false);
    setMeId(null);
    try { localStorage.removeItem("loggedIn"); localStorage.removeItem("meId"); } catch{}
  }


  // ─── Get manager from org chart ───
  function getManagerId(userId) {
    const member = orgMembers.find(m => m.id === userId && m.active);
    return member?.mgr || null;
  }

  function canApproveRequest(req) {
    // Admins can always approve
    if (isAdmin) return true;
    // Requester cannot approve their own request
    if (req.fromId === me.id) return false;
    // Check if me is in the workflow steps assigned to me
    const myStep = req.workflow?.find(w =>
      w.assignedTo === me.id &&
      w.status === "pending" &&
      (w.step === 1 || req.workflow[w.step-2]?.status === "done")
    );
    return !!myStep;
  }

  function handleChangePIN() {
    if (changePinStep==="old") {
      if (changePinVal.old !== creds[me.id]?.password) { setPinChangeMsg("رمز عبور فعلی اشتباه است"); return; }
      setChangePinStep("new"); setPinChangeMsg("");
    } else if (changePinStep==="new") {
      if (changePinVal.new1.length<4) { setPinChangeMsg("رمز عبور باید حداقل ۴ کاراکتر باشد"); return; }
      setChangePinStep("confirm"); setPinChangeMsg("");
    } else {
      if (changePinVal.new1!==changePinVal.new2) { setPinChangeMsg("رمزهای عبور مطابقت ندارند"); return; }
      saveCreds({...creds,[me.id]:{...creds[me.id],password:changePinVal.new1}});
      setPinChangeMsg("رمز عبور با موفقیت تغییر کرد");
      setTimeout(()=>{ setShowChangePIN(false); setChangePinStep("old"); setChangePinVal({old:"",new1:"",new2:""}); setPinChangeMsg(""); }, 1200);
    }
  }

  // state
  const [tab,setTab]                     = useState("notifs");
  const [channel,setChannel]             = useState("general");
  const [dm,setDm]                       = useState(null);
  const [msgs,setMsgs]                   = useState(()=>loadLS("msgs", INIT_MSGS));
  const [dmMsgs,setDmMsgs]               = useState(()=>loadLS("dmMsgs", {}));
  const [input,setInput]                 = useState("");
  const [reqs,setReqs]                   = useState(()=>loadLS("reqs", INIT_REQS));
  const [projs,setProjs]                 = useState(()=>loadLS("projs", INIT_PROJECTS));
  const [notifs,setNotifs]               = useState(()=>loadLS("notifs", INIT_NOTIFS));
  const [activeProj,setActiveProj]       = useState(null);
  const [activeTask,setActiveTask]       = useState(null);
  const [sidebar,setSidebar]             = useState(false);
  const [confirm,setConfirm]             = useState(null);
  const [showReqForm,setShowReqForm]     = useState(false);
  const [showProjForm,setShowProjForm]   = useState(false);
  const [showTaskForm,setShowTaskForm]   = useState(false);
  const [newReq,setNewReq]               = useState({type:"مرخصی استحقاقی",note:""});
  const [newProj,setNewProj]             = useState({title:"",manager:2,members:[],endDate:"",priority:"medium"});
  const [newTask,setNewTask]             = useState({title:"",desc:"",assignedTo:1,due:"",priority:"medium"});

  // org chart state
  const [orgMembers,setOrgMembers]       = useState(()=>{
    const saved = loadLS("orgMembers", null);
    if (saved) {
      // Sync names and roles from USERS (single source of truth)
      return saved.map(om => {
        const u = USERS.find(x=>x.id===om.id);
        return u ? {...om, name:u.name, role:u.role, av:u.av} : om;
      });
    }
    return ORG_DATA.map(m=>({...m,active:true}));
  });
  const [orgOpen,setOrgOpen]             = useState(new Set([1,2,3,4]));
  const [orgMode,setOrgMode]             = useState("list");
  const [orgCur,setOrgCur]               = useState(null);
  const [orgForm,setOrgForm]             = useState({name:"",role:"",mgr:"1",av:""});

  // payment states
  const [payments, setPayments]         = useState(()=>loadLS("payments", SAMPLE_PAYMENTS));
  const [openPayment, setOpenPayment]   = useState(null);
  const [showPayForm, setShowPayForm]   = useState(false);
  const [payFilter, setPayFilter]       = useState("all");
  const [paySearch, setPaySearch]       = useState("");

  // crm states
  const [customers, setCustomers]       = useState(()=>loadLS("customers", INIT_CUSTOMERS));
  const [crmOrders, setCrmOrders]       = useState(()=>loadLS("crmOrders", INIT_CRM_ORDERS));
  const [activeCust, setActiveCust]     = useState(null);
  const [crmTab, setCrmTab]             = useState("customers");
  const [showCustForm, setShowCustForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [newCust, setNewCust]           = useState({name:"",type:"کارخانه",city:"",phone:"",contact:"",grade:"معمولی",av:""});
  const [newCrmOrder, setNewCrmOrder]   = useState({customerId:"",product:"",qty:"",unit:"تن",amount:"",status:"ثبت",desc:""});
  const [crmSearch, setCrmSearch]       = useState("");
  const [msgSearch, setMsgSearch]         = useState("");
  const [showMsgSearch, setShowMsgSearch] = useState(false);

  // search & detail states
  const [searchQ, setSearchQ]           = useState("");
  const [openRequest, setOpenRequest]   = useState(null);
  const [openLetterDetail, setOpenLetterDetail] = useState(null);
  const [reqNote, setReqNote]           = useState("");

  // inbox state
  const [letters,setLetters]             = useState(()=>loadLS("letters", INIT_LETTERS));
  const [docs,setDocs]                   = useState(()=>loadLS("docs", INIT_DOCS));
  const [inboxSub,setInboxSub]           = useState("letters"); // letters | docs
  const [openLetter,setOpenLetter]       = useState(null);
  const [showCompose,setShowCompose]     = useState(false);
  const [letterTab,setLetterTab]         = useState("inbox"); // inbox | sent
  const [compose,setCompose]             = useState({to:[],subject:"",body:"",priority:"normal",attachments:[]});
  const [docFilter,setDocFilter]         = useState("همه");

  const msgEnd = useRef(null);

  // ─── Derived from state (after all useState) ───
  const visiblePayments   = payments.filter(canSeePayment);

  // ─── Persist to localStorage ───
  useEffect(()=>{ saveLS("msgs",       msgs);       }, [msgs]);

  // ─── Browser Notification Permission ───
  useEffect(()=>{
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  function playNotifSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o1 = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    const g  = ctx.createGain();
    o1.connect(g); o2.connect(g); g.connect(ctx.destination);
    o1.frequency.setValueAtTime(880, ctx.currentTime);
    o1.frequency.setValueAtTime(1100, ctx.currentTime + 0.1);
    o2.frequency.setValueAtTime(660, ctx.currentTime);
    o2.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    o1.start(ctx.currentTime); o1.stop(ctx.currentTime + 0.4);
    o2.start(ctx.currentTime); o2.stop(ctx.currentTime + 0.4);
  } catch {}
}

function showBrowserNotif(title, body, icon) {
    if ('Notification' in window && Notification.permission === 'granted' && document.hidden) {
      new Notification(title, { body, icon: icon||'', dir:'rtl', lang:'fa' });
    }
  }

  // ─── Supabase Realtime for messages ───
  useEffect(()=>{
    const ws = supaListen('messages', (record) => {
      // Skip own messages
      if (record.from_id === me.id) return;

      if (record.type === 'channel' && record.channel) {
        const newMsg = {
          id: record.id,
          userId: record.from_id,
          text: record.text,
          time: record.created_at ? new Date(record.created_at).toLocaleString('fa-IR') : nowShamsi(),
          fromName: record.from_name,
        };
        setMsgs(prev => {
          const ch = record.channel;
          const existing = (prev[ch]||[]);
          if (existing.find(m=>m.id===record.id)) return prev;
          // Browser notification
          playNotifSound();
          showBrowserNotif(
            `پیام جدید در #${ch}`,
            `${record.from_name}: ${record.text}`,
          );
          // In-app notification
          setNotifs(prev => [{
            id: Date.now(),
            type:'msg',
            title:`پیام جدید در #${ch}`,
            body:`${record.from_name}: ${record.text}`,
            read:false,
            time:nowShamsi(),
          }, ...prev.slice(0,49)]);
          return {...prev, [ch]: [...existing, newMsg]};
        });
      }

      if (record.type === 'dm' && (record.from_id === me.id || record.to_id === me.id)) {
        const newMsg = {
          id: record.id,
          userId: record.from_id,
          text: record.text,
          time: record.created_at ? new Date(record.created_at).toLocaleString('fa-IR') : nowShamsi(),
        };
        setDmMsgs(prev => {
          const key = record.from_id === me.id ? record.to_id : record.from_id;
          const existing = (prev[key]||[]);
          if (existing.find(m=>m.id===record.id)) return prev;
          // Browser notification for DM
          playNotifSound();
          showBrowserNotif(
            `پیام از ${record.from_name}`,
            record.text,
          );
          // In-app notification
          setNotifs(prev => [{
            id: Date.now(),
            type:'dm',
            title:`پیام از ${record.from_name}`,
            body:record.text,
            read:false,
            time:nowShamsi(),
            refId:record.from_id,
          }, ...prev.slice(0,49)]);
          return {...prev, [key]: [...existing, newMsg]};
        });
      }
    });
    return () => ws.close();
  }, [me.id]);
  useEffect(()=>{ saveLS("dmMsgs",     dmMsgs);     }, [dmMsgs]);
  useEffect(()=>{ saveLS("reqs", reqs); }, [reqs]);

  // ─── Load from Supabase on startup ───
  useEffect(()=>{
    // Load requests
    supa('GET','requests','?order=created_at.desc&limit=100').then(data=>{
      if(data&&data.length>0){
        const mapped=data.map(r=>({
          id:r.id, type:r.type, from:r.from_name, fromId:r.from_id,
          detail:r.detail, status:r.status,
          workflow:typeof r.workflow==='string'?JSON.parse(r.workflow):r.workflow||[],
          time:r.created_at?new Date(r.created_at).toLocaleDateString('fa-IR'):nowShamsi(),
        }));
        setReqs(mapped);
      }
    }).catch(()=>{});

    // Load payments
    supa('GET','payments','?order=created_at.desc&limit=100').then(data=>{
      if(data&&data.length>0){
        const mapped=data.map(p=>({
          id:p.id, code:p.code, type:p.type,
          requesterId:p.requester_id, requesterName:p.requester_name,
          amount:p.amount, desc:p.description,
          beneficiary:p.beneficiary, bankAccount:p.bank_account,
          status:p.status,
          workflow:typeof p.workflow==='string'?JSON.parse(p.workflow):p.workflow||[],
          date:p.created_at?new Date(p.created_at).toLocaleDateString('fa-IR'):nowShamsi(),
        }));
        setPayments(mapped);
      }
    }).catch(()=>{});

    // Load CRM customers
    supa('GET','crm_customers','?order=created_at.desc').then(data=>{
      if(data&&data.length>0) setCustomers(data);
    }).catch(()=>{});

    // Load CRM orders
    supa('GET','crm_orders','?order=created_at.desc').then(data=>{
      if(data&&data.length>0) setCrmOrders(data);
    }).catch(()=>{});

  }, []);
  useEffect(()=>{ saveLS("projs",      projs);      }, [projs]);
  useEffect(()=>{ saveLS("notifs",     notifs);     }, [notifs]);
  useEffect(()=>{ saveLS("payments",   payments);   }, [payments]);
  useEffect(()=>{ saveLS("letters",    letters);    }, [letters]);
  useEffect(()=>{ saveLS("docs",       docs);       }, [docs]);
  useEffect(()=>{ saveLS("orgMembers", orgMembers); }, [orgMembers]);
  useEffect(()=>{ saveLS("customers", customers); }, [customers]);
  useEffect(()=>{ saveLS("crmOrders", crmOrders); }, [crmOrders]);
  useEffect(()=>{ try{ if(loggedIn&&meId){ localStorage.setItem("loggedIn","1"); localStorage.setItem("meId",String(meId)); } }catch{} }, [loggedIn,meId]);

  useEffect(()=>{msgEnd.current?.scrollIntoView({behavior:"smooth"});},[msgs,dmMsgs,channel,dm]);

  const unread    = notifs.filter(n=>!n.read).length;
  const pending   = reqs.filter(r=>r.status==="pending").length;
  const myTasks   = me.id ? projs.flatMap(p=>p.tasks).filter(t=>t.assignedTo===me.id&&t.status!=="done") : [];
  const curMsgs   = dm?(dmMsgs[dm]||[]):(msgs[channel]||[]);
  const proj      = activeProj?projs.find(p=>p.id===activeProj)||null:null;
  const taskDet   = (activeTask&&activeTask.pid&&activeTask.tid)?(()=>{try{const p=projs.find(p=>p.id===activeTask.pid);const t=p?.tasks.find(t=>t.id===activeTask.tid);return t?{task:t,project:p}:null;}catch(e){return null;}})():null;
  const orgActive     = orgMembers.filter(m=>m.active);
  const orgInact      = orgMembers.filter(m=>!m.active);
  const activeUserIds = new Set(orgActive.map(m=>m.id));
  let orgRows = []; try { orgRows = buildOrgRows(orgMembers,orgOpen); } catch(e) { orgRows = []; }

  // ─── handlers ───
  function sendMsg() {
    if (!input.trim()) return;
    const m = {id:Date.now(),userId:me.id,text:input,time:nowShamsi()};
    if (dm) setDmMsgs(p=>({...p,[dm]:[...(p[dm]||[]),m]}));
    else setMsgs(p=>({...p,[channel]:[...(p[channel]||[]),m]}));
    // Sync to Supabase realtime
    supa('POST','messages',{type:dm?'dm':'channel',channel:dm?null:channel,from_id:me.id,to_id:dm||null,from_name:me.name,from_avatar:me.avatar,text:input}).catch(()=>{});
    setInput("");
  }

  function approveReq(id,action) {
    const r = reqs.find(x=>x.id===id);
    if (!canApproveRequest(r)) return;
    setConfirm({
      type:action==="approved"?"success":"danger",
      title:action==="approved"?"تأیید درخواست":"رد درخواست",
      message:`درخواست «${r?.type}» از ${r?.from} ${action==="approved"?"تأیید":"رد"} شود؟`,
      confirmLabel:action==="approved"?"بله، تأیید":"بله، رد",
      onConfirm:()=>{
        // Sync to Supabase
        const req = reqs.find(x=>x.id===id);
        if(req) {
          const newWf = (req.workflow||[]).map(w=>w.assignedTo===me.id&&w.status==='pending'?{...w,status:action==='approved'?'done':'rejected',time:nowShamsi()}:w);
          const allDone=newWf.every(w=>w.status==='done');
          const anyRej=newWf.some(w=>w.status==='rejected');
          const newStatus=anyRej?'rejected':allDone?'approved':'pending';
          supa('PATCH','requests',{status:newStatus,workflow:JSON.stringify(newWf)},'?id=eq.'+id).catch(()=>{});
        }
        setReqs(p=>p.map(x=>x.id===id?{...x,status:action,
        workflow:x.workflow?.map(w=>w.assignedTo===me.id&&w.status==="pending"?{...w,status:action==="approved"?"done":"rejected",time:nowShamsi()}:w)
        }:x));
      },
    });
  }

  function updateTask(pid,tid,ns) {
    const p=projs.find(x=>x.id===pid); const t=p?.tasks.find(x=>x.id===tid);
    const lbl={pending:"در انتظار",inprogress:"در جریان",done:"تکمیل"};
    setConfirm({
      type:ns==="done"?"success":"warning",
      title:`تغییر به «${lbl[ns]}»`,
      message:`وظیفه «${t?.title}» به «${lbl[ns]}» تغییر کند؟`,
      confirmLabel:"بله",
      onConfirm:()=>setProjs(ps=>ps.map(p=>p.id!==pid?p:{...p,tasks:p.tasks.map(t=>t.id!==tid?t:{...t,status:ns}),log:[{userId:me.id,text:`"${t?.title}" → ${lbl[ns]}`,time:nowShamsi()},...p.log]})),
    });
  }

  function handlePaymentAction(paymentId, action, stepNum, note) {
    setPayments(ps => ps.map(p => {
      if (p.id !== paymentId) return p;
      const newWf = p.workflow.map(w =>
        w.step !== stepNum ? w : {...w, status:action==="approved"?"done":"rejected", note, time:nowShamsi()}
      );
      const allDone = newWf.every(w=>w.status==="done");
      const anyRej  = newWf.some(w=>w.status==="rejected");
      const cur     = newWf.filter(w=>w.status==="done").length + 1;
      return {...p, workflow:newWf, status:anyRej?"rejected":allDone?"paid":`step${cur}`};
    }));
  }

  function addNotif(uid,type,pid,tid,title,desc) {
    setNotifs(ns=>[{id:Date.now(),type,projectId:pid,taskId:tid,title,desc,time:nowShamsi(),read:false},...ns]);
  }

  function submitReq() {
    // Sync to Supabase
    supa('POST','requests',{type:newReq.type,from_id:me.id,from_name:me.name,detail:newReq.note,status:'pending',workflow:JSON.stringify([])}).catch(()=>{});
    // Save to Supabase
    supa('POST','requests',{
      type:newReq.type, from_id:me.id, from_name:me.name,
      detail:newReq.note, status:'pending', workflow:JSON.stringify(wf||[])
    }).catch(()=>{});
    setReqs(p=>[{id:Date.now(),type:newReq.type,from:me.name,fromId:me.id,detail:newReq.note,status:"pending",time:nowShamsi(),workflow:wf},...p]);
    setShowReqForm(false); setNewReq({type:"مرخصی استحقاقی",note:""});
  }

  function submitProj() {
    if (!newProj.title.trim()) return;
    const p={id:Date.now(),title:newProj.title,manager:Number(newProj.manager),startDate:"امروز",endDate:newProj.endDate||"نامشخص",status:"pending",priority:newProj.priority,members:newProj.members.map(Number),tasks:[],log:[{userId:me.id,text:"پروژه ایجاد شد",time:nowShamsi()}]};
    setProjs(ps=>[p,...ps]);
    setShowProjForm(false); setNewProj({title:"",manager:2,members:[],endDate:"",priority:"medium"});
  }

  function submitTask() {
    if (!newTask.title.trim()||!showTaskForm) return;
    const pid=showTaskForm; const p=projs.find(x=>x.id===pid);
    const t={id:Date.now(),title:newTask.title,desc:newTask.desc,assignedTo:Number(newTask.assignedTo),due:newTask.due||"نامشخص",status:"pending",priority:newTask.priority};
    setProjs(ps=>ps.map(x=>x.id!==pid?x:{...x,tasks:[...x.tasks,t],log:[{userId:me.id,text:`وظیفه "${newTask.title}" به ${USERS.find(u=>u.id===Number(newTask.assignedTo))?.lastName} سپرده شد`,time:nowShamsi()},...x.log]}));
    addNotif(Number(newTask.assignedTo),"task",pid,t.id,`وظیفه جدید: ${newTask.title}`,`پروژه: ${p?.title}`);
    setShowTaskForm(false); setNewTask({title:"",desc:"",assignedTo:1,due:"",priority:"medium"});
  }

  // org handlers
  function orgToggle(id){ setOrgOpen(p=>{const s=new Set(p);s.has(id)?s.delete(id):s.add(id);return s;}); }
  function orgEdit(m){ setOrgCur(m);setOrgForm({name:m.name,role:m.role,mgr:String(m.mgr??""),av:m.av});setOrgMode("edit"); }
  function orgSave(){ setOrgMembers(p=>p.map(m=>m.id!==orgCur.id?m:{...m,name:orgForm.name,role:orgForm.role,mgr:orgForm.mgr===""?null:Number(orgForm.mgr),av:orgForm.av||orgForm.name[0]||"؟"}));setOrgMode("list"); }
  function orgDeact(){ setOrgMembers(p=>p.map(m=>{if(m.id===orgCur.id)return{...m,active:false};if(m.mgr===orgCur.id)return{...m,mgr:orgCur.mgr};return m;}));setOrgMode("list"); }
  function orgReact(id){ setOrgMembers(p=>p.map(m=>m.id===id?{...m,active:true}:m)); }
  function orgAdd(){ if(!orgForm.name.trim())return;const nid=Math.max(...orgMembers.map(m=>m.id))+1;setOrgMembers(p=>[...p,{id:nid,name:orgForm.name,role:orgForm.role,mgr:Number(orgForm.mgr)||1,av:orgForm.av||orgForm.name[0]||"؟",active:true}]);setOrgOpen(p=>new Set([...p,Number(orgForm.mgr)||1]));setOrgMode("list"); }

  // ─── styles ───
  const card = {background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:14,marginBottom:8};
  const btn  = v=>({padding:"9px 16px",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,WebkitTapHighlightColor:"transparent",fontFamily:"inherit",background:v==="p"?C.teal:v==="s"?C.success:v==="d"?C.danger+"33":C.surfaceAlt,color:v==="g"?C.textMuted:v==="d"?C.danger:"#fff"});
  const fi   = {width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:16,outline:"none",direction:"rtl",textAlign:"right",boxSizing:"border-box",marginBottom:12,WebkitAppearance:"none",fontFamily:"inherit",lineHeight:1.8,WebkitUserSelect:"text",userSelect:"text"};
  const lbl  = t=><div style={{fontSize:12,color:C.textMuted,marginBottom:5}}>{t}</div>;

  const Sheet = ({title,onClose,children})=>(
    <div style={{position:"fixed",inset:0,background:"#000A",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100}} onClick={onClose}>
      <div style={{background:C.surface,borderRadius:"20px 20px 0 0",padding:"20px 20px calc(20px + env(safe-area-inset-bottom))",width:"100%",maxWidth:480,maxHeight:"88vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{width:36,height:4,background:C.border,borderRadius:2,margin:"0 auto 16px"}}/>
        <div style={{fontSize:15,fontWeight:700,marginBottom:14}}>{title}</div>
        {children}
      </div>
    </div>
  );

  let topTitle="آذرمهر صنعت", onBack=null;
  if (taskDet){topTitle=taskDet.task.title;onBack=()=>setActiveTask(null);}
  else if (proj){topTitle=proj.title;onBack=()=>setActiveProj(null);}

  const TABS=[
    {id:"notifs",  Icon:Icons.Bell,   badge:unread,         label:"اعلان‌ها"},
    {id:"chat",    Icon:Icons.Chat,   badge:0,              label:"چت"},
    {id:"projects",Icon:Icons.Folder, badge:0,              label:"پروژه‌ها"},
    {id:"tasks",   Icon:Icons.Check,  badge:myTasks.length, label:"وظایف"},
    {id:"crm",      Icon:Icons.CRM,    badge:0, label:"CRM"},
    {id:"payments", Icon:Icons.Pay,    badge:visiblePayments.filter(p=>p.workflow.some(w=>w.assignedTo===me.id&&w.status==="pending"&&(w.step===1||p.workflow[w.step-2]?.status==="done"))).length, label:"پرداخت"},
  ];

  if (!loggedIn) {
    return <LoginScreen onLogin={(id)=>{ setMeId(id); setLoggedIn(true); try{localStorage.setItem("loggedIn","1");localStorage.setItem("meId",String(id));}catch{} }}/>;
  }

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100dvh",background:C.bg,color:C.text,fontFamily:"'Vazirmatn','Segoe UI',sans-serif",direction:"rtl",overflow:"hidden",paddingTop:"env(safe-area-inset-top)"}}>

      {/* Topbar */}
      <div style={{height:58,display:"flex",alignItems:"center",padding:"0 14px",background:C.surface,flexShrink:0,borderBottom:`1px solid ${C.border}`}}>

        {!onBack&&<>
          {/* همبرگر — چسبیده به لبه راست */}
          <button onClick={()=>setSidebar(p=>!p)} style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",padding:"0 14px",height:"100%",display:"flex",alignItems:"center",WebkitTapHighlightColor:"transparent",flexShrink:0}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="5" x2="16" y2="5"/><line x1="2" y1="11" x2="16" y2="11"/><line x1="2" y1="17" x2="16" y2="17"/></svg>
          </button>

          {/* آواتار — فاصله از همبرگر با margin */}
          <div style={{marginLeft:6}}>
            <Av user={{...me,online:true}} size={36}/>
          </div>

          {/* نام و سمت */}
          <div style={{textAlign:"right",margin:"0 8px"}}>
            <div style={{fontSize:13,fontWeight:600,color:C.text,lineHeight:1.3}}>{me.lastName||me.name.split(" ").pop()}</div>
            <div style={{fontSize:11,color:C.teal,lineHeight:1.3}}>{me.role}</div>
          </div>

          <div style={{flex:1}}/>

          <span style={{fontSize:15,fontWeight:700,color:C.text,marginLeft:12,fontFamily:"Arial,sans-serif",whiteSpace:"nowrap"}}>AMS-Group</span>
          <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAxNTk3LjA5IDEyNTYuNzMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE1OTcuMDkgMTI1Ni43MzsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4NCgkuc3Qwe2ZpbGw6I0QxRDNENDt9DQoJLnN0MXtmaWxsOiNGREI5MTM7fQ0KPC9zdHlsZT4NCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zMi4xMiw4MDAuNTVjNS41MSwzNy43OCwyMy42MSw3MS43OSw1Mi4wMiwxMDEuNDJjMjQuNjMsMjUuNjgsNTcuMDIsNDguMDMsOTUuNyw2Ni41OA0KCWMxMjQuOTUsNTkuOTUsMzE1LjUzLDgwLjI3LDUyMS45OCw0NS4xYzE2MS4wMi0yNy40MSwzMDMuMTQtODMuNzIsNDA2LjE5LTE1My45M2MxNS40NS0xMC41Myw0Ljk0LTM3LjA4LTEyLjQzLTMxLjQ2DQoJYy02Ny41MSwyMS44NC0xNDIuMzYsNDAuMzEtMjIxLjcxLDUzLjgzYy0zMDIuMDEsNTEuNDUtNTYyLjMzLDEzLjIzLTYwOC40Mi04NC45MmMtMC40Mi0wLjkxLTAuODItMS44MS0xLjItMi43Mg0KCWMtMi41NS01Ljk1LTQuMzEtMTIuMTMtNS4yMy0xOC41M2MtMTYuNjUtMTEzLjY0LDIzMS42My0yNTAuMzcsNTU0LjU3LTMwNS4zNmMxMTAuMzktMTguOCwyMTUuMjEtMjUuNjIsMzA2LjA4LTIxLjg4DQoJYy0xMTEuNzQtNDMuMjgtMjQ1Ljc3LTY4LjUyLTM4OS44OC02OC41MmMtMTA0LjI1LDAtMjAzLjIyLDEzLjIxLTI5Mi4zLDM2LjkxQzE4My4wNSw0OTkuNzEsMTAuNzksNjU0Ljk0LDMyLjEyLDgwMC41NSIvPg0KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQ3MS4wMiwxMTM3LjJjMTExLjcyLDQzLjI4LDI0NS43LDY4LjQ4LDM4OS43Nyw2OC40OGMxMDQuNDIsMCwyMDMuNTYtMTMuMjMsMjkyLjc0LTM3LjAyDQoJYzI1NC4yMS04Mi43LDQyNi4yMi0yMzcuODUsNDA0Ljg4LTM4My4zOGMtNS41MS0zNy43NS0yMy42MS03MS43OS01Mi4wMi0xMDEuMzhjLTI0LjYxLTI1LjY4LTU3LTQ4LjA1LTk1LjY2LTY2LjYyDQoJYy0xMjQuOTctNTkuOTUtMzE1LjUxLTgwLjI4LTUyMi00NS4xYy0xNjAuOTksMjcuNDMtMzAzLjE0LDgzLjcyLTQwNi4xNywxNTMuOTVjLTE1LjQ1LDEwLjUxLTQuOTYsMzcuMDYsMTIuNDEsMzEuNDQNCgljNjcuNTMtMjEuODQsMTQyLjM4LTQwLjI5LDIyMS43My01My44MWMzMDItNTEuNDUsNTYyLjMzLTEzLjIxLDYwOC40NCw4NC45YzAuNCwwLjkxLDAuNzgsMS44MSwxLjE4LDIuNzINCgljMi41Myw1Ljk3LDQuMywxMi4xNiw1LjIzLDE4LjUzYzE2LjY1LDExMy42NC0yMzEuNjMsMjUwLjM3LTU1NC41NywzMDUuMzhDNjY2LjYzLDExMzQuMSw1NjEuODMsMTE0MC45MSw0NzEuMDIsMTEzNy4yIi8+DQo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOTU4LjUyLDE4MC4zMWMwLDc4LjEtNjMuMzMsMTQxLjQzLTE0MS40MywxNDEuNDNzLTE0MS40My02My4zMy0xNDEuNDMtMTQxLjQzUzczOC45OSwzOC44OCw4MTcuMDksMzguODgNCglDODk1LjE5LDM4Ljg4LDk1OC41MiwxMDIuMjEsOTU4LjUyLDE4MC4zMSIvPg0KPC9zdmc+DQo=" alt="" style={{height:35,objectFit:"contain",flexShrink:0,marginLeft:14}}/>
        </>}

        {onBack&&<>
          <button onClick={onBack} style={{background:"none",border:"none",color:C.teal,cursor:"pointer",padding:"0 14px",height:"100%",display:"flex",alignItems:"center",WebkitTapHighlightColor:"transparent"}}>
            <Icons.Back/>
          </button>
          {taskDet&&<Av user={USERS.find(u=>u.id===taskDet.task.assignedTo)} size={34}/>}
          {proj&&!taskDet&&<Av user={USERS.find(u=>u.id===proj.manager)} size={34}/>}
          <div style={{flex:1,overflow:"hidden",marginRight:8}}>
            <div style={{fontSize:15,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{topTitle}</div>
            {proj&&!taskDet&&<div style={{fontSize:11,color:C.textDim}}>{proj.tasks.filter(t=>t.status==="done").length}/{proj.tasks.length} تکمیل</div>}
          </div>
          {taskDet&&<Badge status={taskDet.task.status}/>}
        </>}

      </div>

      {/* Body */}
      <div style={{display:"flex",flex:1,overflow:"hidden",position:"relative"}}>

        {/* Drawer Overlay */}
        <div onClick={()=>setSidebar(false)} style={{display:sidebar?"block":"none",position:"absolute",inset:0,background:"#000A",zIndex:10}}/>

        {/* Drawer */}
        <div style={{position:"absolute",top:0,right:0,bottom:0,width:280,background:C.surface,overflowY:"auto",WebkitOverflowScrolling:"touch",zIndex:20,transform:sidebar?"translateX(0)":"translateX(100%)",transition:"transform 0.25s ease",zIndex:11,display:"flex",flexDirection:"column"}}>

          {/* Profile */}
          <div style={{background:"linear-gradient(135deg,#1a1a1a,#2a2a2a)",padding:"36px 20px 20px",flexShrink:0}}>
            <img src={LOGO_ICON} alt="" style={{height:50,objectFit:"contain",marginBottom:12,filter:"brightness(1.2)"}}/>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
              <div style={{width:42,height:42,borderRadius:"50%",background:"rgba(253,185,19,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:"#fff",border:"2px solid rgba(253,185,19,0.4)",flexShrink:0}}>
                {me.av}
              </div>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>{me.name}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:1}}>{me.role}</div>
              </div>
            </div>
          </div>

          {/* Section: Channels */}
          <DrawerSection title="کانال‌ها">
            {CHANNELS.map(ch=>(
              <DrawerItem key={ch.id}
                icon={<div style={{width:34,height:34,borderRadius:"50%",background:C.surfaceAlt,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:C.textDim}}>#</div>}
                label={ch.name}
                active={tab==="chat"&&!dm&&channel===ch.id}
                onClick={()=>{setTab("chat");setDm(null);setChannel(ch.id);setSidebar(false);}}
              />
            ))}
          </DrawerSection>

          {/* Section: Direct Messages - collapsed by default */}
          <DrawerCollapsible title="پیام مستقیم" defaultOpen={true} count={USERS.length-1}>
            {USERS.filter(u=>u.id!==me.id&&activeUserIds.has(u.id)).map(u=>(
              <DrawerItem key={u.id}
                icon={<Av user={u} size={34}/>}
                label={u.name.split(' ').pop()}
                sub={u.role}
                active={tab==="chat"&&dm===u.id}
                online={u.online}
                onClick={()=>{setTab("chat");setDm(u.id);setSidebar(false);}}
              />
            ))}
          </DrawerCollapsible>

          {/* Section: Tools */}
          <DrawerSection title="ابزارها">
            <DrawerItem icon="📋" label="درخواست‌ها" badge={pending} onClick={()=>{setTab("requests");setSidebar(false);}}/>
            <DrawerItem icon="📬" label="کارتابل" badge={letters.filter(l=>l.status==="inbox"&&!l.read).length} onClick={()=>{setTab("inbox");setSidebar(false);}}/>
            <DrawerItem icon="🏢" label="چارت سازمانی" onClick={()=>{setTab("org");setSidebar(false);}}/>
            {isAdmin&&<DrawerItem icon="📊" label="پنل مدیریت" onClick={()=>{setTab("admin");setSidebar(false);}}/>}
          </DrawerSection>

          {/* Section: Account */}
          <DrawerSection title="حساب کاربری">
            <DrawerItem icon="🔑" label="تغییر رمز عبور" onClick={()=>{setSidebar(false);setShowChangePIN(true);}}/>
            <DrawerItem icon="🚪" label="خروج" danger onClick={handleLogout}/>
          </DrawerSection>

          <div style={{height:"env(safe-area-inset-bottom)",minHeight:16}}/>
        </div>

        {/* Main */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",width:"100%"}}>

          {/* ─── TASK DETAIL ─── */}
          {taskDet?(
            <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:16}}>
              <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}><Badge status={taskDet.task.priority}/><Badge status={taskDet.task.status}/><span style={{fontSize:11,color:C.textDim,alignSelf:"center"}}>پروژه: {taskDet.project.title}</span></div>
              <div style={{...card,display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                <Av user={USERS.find(u=>u.id===taskDet.task.assignedTo)} size={42}/>
                <div><div style={{fontSize:11,color:C.textDim}}>مسئول اجرا</div><div style={{fontSize:15,fontWeight:700}}>{USERS.find(u=>u.id===taskDet.task.assignedTo)?.name}</div><div style={{fontSize:12,color:C.textMuted}}>{USERS.find(u=>u.id===taskDet.task.assignedTo)?.role}</div></div>
              </div>
              <div style={{...card,marginBottom:16}}>
                <div style={{fontSize:12,color:C.teal,fontWeight:700,marginBottom:8,borderBottom:`1px solid ${C.border}`,paddingBottom:8}}>شرح وظیفه</div>
                <div style={{fontSize:14,lineHeight:1.9}}>{taskDet.task.desc||"توضیحاتی ثبت نشده."}</div>
              </div>
              {taskDet.task.status!=="done"?(
                <div style={{display:"flex",gap:10}}>
                  {taskDet.task.status==="pending"&&<button style={{...btn("g"),flex:1,padding:"13px",border:`1px solid ${C.border}`}} onClick={()=>updateTask(taskDet.project.id,taskDet.task.id,"inprogress")}>شروع</button>}
                  {taskDet.task.status==="inprogress"&&<><button style={{...btn("g"),flex:1,padding:"13px",border:`1px solid ${C.warning+"55"}`,color:C.warning}} onClick={()=>updateTask(taskDet.project.id,taskDet.task.id,"pending")}>بازگشت</button><button style={{...btn("s"),flex:2,padding:"13px"}} onClick={()=>updateTask(taskDet.project.id,taskDet.task.id,"done")}>تکمیل</button></>}
                </div>
              ):(
                <div style={{textAlign:"center"}}>
                  <div style={{color:C.success,fontSize:14,fontWeight:600,marginBottom:10}}>تکمیل شده</div>
                  <button style={{...btn("g"),fontSize:12,color:C.warning,border:`1px solid ${C.warning+"44"}`}} onClick={()=>updateTask(taskDet.project.id,taskDet.task.id,"inprogress")}>بازگشت به «در جریان»</button>
                </div>
              )}
            </div>

          /* ─── PROJECT DETAIL ─── */
          ):proj?(
            <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:14}}>
              <div style={{...card,marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><Av user={USERS.find(u=>u.id===proj.manager)} size={30}/><div><div style={{fontSize:11,color:C.textDim}}>مدیر</div><div style={{fontSize:13,fontWeight:600}}>{USERS.find(u=>u.id===proj.manager)?.name}</div></div></div>
                  <Badge status={proj.status}/>
                </div>
                <div style={{display:"flex",gap:14,fontSize:12,color:C.textMuted,marginBottom:12}}><span>شروع: {proj.startDate}</span><span>پایان: {proj.endDate}</span></div>
                <Progress tasks={proj.tasks}/>
                <div style={{display:"flex",gap:4,marginTop:10,flexWrap:"wrap"}}>{proj.members.map(uid=>{const u=USERS.find(x=>x.id===uid);return u?<div key={uid} style={{display:"flex",alignItems:"center",gap:4,background:C.bg,borderRadius:20,padding:"3px 8px 3px 4px",fontSize:11,color:C.textMuted}}><Av user={u} size={18}/>{u.lastName}</div>:null;})}</div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontWeight:700,fontSize:14}}>وظایف</span>
                <button style={btn("p")} onClick={()=>setShowTaskForm(proj.id)}>افزودن</button>
              </div>
              {["pending","inprogress","done"].map(st=>{
                const grp=proj.tasks.filter(t=>t.status===st);
                if(!grp.length) return null;
                const lbs={pending:"در انتظار",inprogress:"در جریان",done:"تکمیل"};
                return <div key={st} style={{marginBottom:16}}><div style={{fontSize:10,color:C.textDim,fontWeight:700,marginBottom:6}}>{lbs[st]}</div>{grp.map(t=>{const a=USERS.find(u=>u.id===t.assignedTo);return(<div key={t.id} style={{...card,opacity:t.status==="done"?0.55:1,cursor:"pointer",marginBottom:8}} onClick={()=>setActiveTask({pid:proj.id,tid:t.id})}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:13,fontWeight:600,flex:1,marginLeft:8}}>{t.title}</span><Badge status={t.priority}/></div>{t.desc&&<div style={{fontSize:12,color:C.textDim,marginBottom:6,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{t.desc}</div>}<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:6}}><Av user={a} size={20}/><span style={{fontSize:11,color:C.textMuted}}>{a?.lastName}</span><span style={{fontSize:11,color:C.textDim}}>· {t.due}</span></div><span style={{fontSize:11,color:C.teal}}>جزئیات</span></div></div>);})}</div>;
              })}
              <div style={{marginTop:8}}>
                <div style={{fontSize:12,color:C.textDim,fontWeight:700,marginBottom:10}}>تاریخچه</div>
                {proj.log.map((l,i)=>{const u=USERS.find(x=>x.id===l.userId);return(<div key={i} style={{display:"flex",gap:8,marginBottom:10}}><Av user={u} size={28}/><div style={{background:C.surfaceAlt,borderRadius:10,padding:"7px 12px",flex:1}}><div style={{fontSize:11,color:C.teal,marginBottom:2}}>{u?.lastName} · {l.time}</div><div style={{fontSize:13}}>{l.text}</div></div></div>);})}
              </div>
            </div>

          ):(
          <>
            {/* Tab Bar */}
            <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,background:C.surface,flexShrink:0}}>
              {TABS.map(t=>(
                <div key={t.id} onClick={()=>setTab(t.id)}
                  style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"10px 4px 8px",cursor:"pointer",color:tab===t.id?C.teal:C.textDim,position:"relative",WebkitTapHighlightColor:"transparent",minHeight:52}}>
                  <t.Icon/>
                  <span style={{fontSize:9,marginTop:3,fontWeight:tab===t.id?700:400}}>{t.label}</span>
                  {t.badge>0&&<div style={{position:"absolute",top:7,right:"50%",transform:"translateX(10px)",background:C.teal,borderRadius:"50%",width:8,height:8}}/>}
                </div>
              ))}
            </div>

            {/* NOTIFICATIONS */}
            {tab==="notifs"&&(
              <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px 8px"}}>
                  <span style={{fontWeight:700,fontSize:15}}>اعلان‌ها</span>
                  {unread>0&&<button style={{...btn("g"),fontSize:11,padding:"5px 10px"}} onClick={()=>setNotifs(ns=>ns.map(n=>({...n,read:true})))}>همه خوانده شد</button>}
                </div>
                {(()=>{
                  // Group consecutive messages from same sender
                  const grouped = [];
                  notifs.forEach(n=>{
                    const last = grouped[grouped.length-1];
                    if(last && last.type===n.type && last.type==="dm" && last.refId===n.refId && !n.read===!last.read){
                      last.count=(last.count||1)+1;
                      last.time=n.time;
                    } else if(last && last.type===n.type && last.type==="msg" && last.channel===n.channel && !n.read===!last.read){
                      last.count=(last.count||1)+1;
                      last.time=n.time;
                    } else {
                      grouped.push({...n,count:1});
                    }
                  });
                  return grouped;
                })().map(n=>(
                  <div key={n.id} style={{display:"flex",gap:12,padding:"12px 16px",borderBottom:`1px solid ${C.border}`,cursor:"pointer",background:n.read?"transparent":C.tealDim}}
                    onClick={()=>{
  setNotifs(ns=>ns.map(x=>x.id===n.id?{...x,read:true}:x));
  if(n.type==="task"&&n.projectId&&n.taskId){
    setActiveProj(n.projectId);setActiveTask({pid:n.projectId,tid:n.taskId});setTab("projects");
  } else if(n.type==="dm"&&n.refId){
    setTab("chat");setDm(n.refId);
  } else if(n.type==="msg"&&n.channel){
    setTab("chat");setDm(null);setChannel(n.channel);
  } else if(n.type==="request"){
    setTab("requests");
  } else if(n.type==="payment"){
    setTab("payments");
  }
}}>
                    <div style={{position:"relative",flexShrink:0}}>
                      {n.count>1&&<div style={{position:"absolute",top:-4,left:-4,background:C.danger,borderRadius:"50%",width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",zIndex:1}}>{faN(n.count)}</div>}
                      <div style={{width:42,height:42,borderRadius:"50%",background:n.read?C.surfaceAlt:C.tealDim,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:n.read?C.textDim:C.teal}}><Icons.Check/></div>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:13,fontWeight:700}}>{n.title}</span>{!n.read&&<div style={{width:8,height:8,borderRadius:"50%",background:C.teal,flexShrink:0,marginTop:4}}/>}</div>
                      <div style={{fontSize:12,color:C.textMuted}}>{n.desc}</div>
                      <div style={{fontSize:11,color:C.textDim,marginTop:4}}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CHAT */}
            {tab==="chat"&&(
              <>
                <div style={{padding:"8px 14px",borderBottom:`1px solid ${C.border}`,background:C.surface,display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
                  {dm?<><Av user={USERS.find(u=>u.id===dm)} size={34}/><div><div style={{fontSize:13,fontWeight:600}}>{USERS.find(u=>u.id===dm)?.name}</div><button onClick={()=>{setShowMsgSearch(p=>!p);setMsgSearch("");}} style={{background:"none",border:"none",color:showMsgSearch?C.teal:C.textMuted,cursor:"pointer",padding:4,display:"flex",alignItems:"center",WebkitTapHighlightColor:"transparent"}}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></button><div style={{fontSize:11,color:C.teal}}>{USERS.find(u=>u.id===dm)?.role}</div><button onClick={()=>{setShowMsgSearch(p=>!p);setMsgSearch("");}} style={{background:"none",border:"none",color:showMsgSearch?C.teal:C.textMuted,cursor:"pointer",padding:4,display:"flex",alignItems:"center",WebkitTapHighlightColor:"transparent"}}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></button></div><button onClick={()=>{setShowMsgSearch(p=>!p);setMsgSearch("");}} style={{background:"none",border:"none",color:showMsgSearch?C.teal:C.textMuted,cursor:"pointer",padding:4,display:"flex",alignItems:"center",WebkitTapHighlightColor:"transparent"}}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></button></>:<><div style={{width:34,height:34,borderRadius:"50%",background:C.surfaceAlt,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:C.textDim}}>#</div><button onClick={()=>{setShowMsgSearch(p=>!p);setMsgSearch("");}} style={{background:"none",border:"none",color:showMsgSearch?C.teal:C.textMuted,cursor:"pointer",padding:4,display:"flex",alignItems:"center",WebkitTapHighlightColor:"transparent"}}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></button><span style={{fontSize:13,fontWeight:600}}>{CHANNELS.find(x=>x.id===channel)?.name}</span></>}
                </div>
                {showMsgSearch&&<div style={{padding:"6px 14px",background:C.surfaceAlt,flexShrink:0,borderBottom:`1px solid ${C.border}`}}>
                    <input style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:20,padding:"7px 14px",color:C.text,fontSize:14,outline:"none",direction:"rtl",boxSizing:"border-box",fontFamily:"inherit"}} placeholder="جستجو در پیام‌ها..." value={msgSearch} onChange={e=>setMsgSearch(e.target.value)} autoFocus/>
                  </div>}
                <div style={{flex:1,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:2,WebkitOverflowScrolling:"touch",background:C.bg}}>
                  {curMsgs.filter(msg=>!msgSearch||msg.text?.includes(msgSearch)).map(msg=>{const u=USERS.find(x=>x.id===msg.userId);const mine=msg.userId===me.id;return(<div key={msg.id} style={{display:"flex",justifyContent:mine?"flex-start":"flex-end",marginBottom:4}}><div style={{maxWidth:"78%",background:mine?C.myBubble:C.theirBubble,borderRadius:mine?"4px 12px 12px 12px":"12px 4px 12px 12px",padding:"8px 12px 6px"}}>{!mine&&<div style={{fontSize:11,color:C.teal,fontWeight:700,marginBottom:3}}>{u?.lastName}</div>}<div style={{fontSize:14,lineHeight:1.6,color:C.text,wordBreak:"break-word"}}>{msg.text}</div><div style={{fontSize:10,color:C.textDim,marginTop:3,textAlign:"left",display:"flex",alignItems:"center",gap:3,justifyContent:"flex-end"}}>{msg.time}{msg.userId===me.id&&<svg width="18" height="11" viewBox="0 0 18 11" fill="none"><path d="M1 5.5L4.5 9L11 2" stroke={C.success} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 5.5L9.5 9L16 2" stroke={C.success} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div></div></div>);})}
                  <div ref={msgEnd}/>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",paddingBottom:"calc(8px + env(safe-area-inset-bottom))",borderTop:`1px solid ${C.border}`,background:C.surface,flexShrink:0}}>
                  <label style={{width:42,height:42,borderRadius:"50%",background:C.surfaceAlt,border:"none",cursor:"pointer",color:C.textMuted,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Icons.Attach/>
                    <input type="file" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const msg={id:Date.now(),userId:me.id,text:`📎 ${f.name}`,time:nowShamsi(),file:{name:f.name,size:(f.size/1024).toFixed(0)+"KB",data:r.result}};if(dm)setDmMsgs(p=>({...p,[dm]:[...(p[dm]||[]),msg]}));else setMsgs(p=>({...p,[channel]:[...(p[channel]||[]),msg]}));};r.readAsDataURL(f);e.target.value="";}}/>
                  </label>
                  <input style={{flex:1,background:C.surfaceAlt,border:"none",borderRadius:24,padding:"10px 16px",color:C.text,fontSize:16,outline:"none",direction:"rtl",fontFamily:"inherit"}} placeholder="پیام..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()}/>
                  <button style={{width:42,height:42,borderRadius:"50%",background:C.teal,border:"none",cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}} onClick={sendMsg}><Icons.Send/></button>
                </div>
              </>
            )}

            {/* PROJECTS */}
            {tab==="projects"&&(
              <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px 8px"}}>
                  <span style={{fontWeight:700,fontSize:15}}>پروژه‌ها</span>
                  <button style={btn("p")} onClick={()=>setShowProjForm(true)}>پروژه جدید</button>
                </div>
                {projs.map(p=>{const mgr=USERS.find(u=>u.id===p.manager);return(
                  <div key={p.id} style={{...card,margin:"0 14px 8px",cursor:"pointer"}} onClick={()=>setActiveProj(p.id)}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                      <div style={{flex:1,marginLeft:8}}><div style={{fontSize:14,fontWeight:700,marginBottom:4}}>{p.title}</div><div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:C.textMuted}}><Av user={mgr} size={18}/><span>{mgr?.lastName}</span><span style={{color:C.textDim}}>· {p.endDate}</span></div></div>
                      <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}><Badge status={p.status}/><Badge status={p.priority}/></div>
                    </div>
                    <Progress tasks={p.tasks}/>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:11,color:C.textDim}}>
                      <span>{p.tasks.length} وظیفه · {p.tasks.filter(t=>t.status==="done").length} تکمیل</span>
                      <span style={{display:"flex",gap:2}}>{p.members.slice(0,4).map(uid=>{const u=USERS.find(x=>x.id===uid);return u?<Av key={uid} user={u} size={20}/>:null;})}</span>
                    </div>
                  </div>
                );})}
              </div>
            )}

            {/* REQUESTS */}
            {tab==="requests"&&(
              openRequest ? (
                /* Request Detail with Workflow */
                <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:16}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,paddingBottom:14,borderBottom:`1px solid ${C.border}`}}>
                    <button onClick={()=>{setOpenRequest(null);setReqNote("");}} style={{background:"none",border:"none",color:C.teal,cursor:"pointer",fontSize:22,lineHeight:1,padding:0}}>‹</button>
                    <span style={{fontSize:15,fontWeight:700,flex:1}}>{openRequest.type}</span>
                    <Badge status={openRequest.status}/>
                  </div>
                  <div style={{...card,marginBottom:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                      <Av user={USERS.find(u=>u.id===openRequest.fromId)||USERS[0]} size={40}/>
                      <div>
                        <div style={{fontSize:14,fontWeight:700}}>{openRequest.from}</div>
                        <div style={{fontSize:11,color:C.textDim}}>{USERS.find(u=>u.id===openRequest.fromId)?.role} · {openRequest.time}</div>
                      </div>
                    </div>
                    <div style={{fontSize:13,color:C.textMuted,lineHeight:1.7}}>{openRequest.detail}</div>
                  </div>
                  <WorkflowTimeline workflow={openRequest.workflow} users={USERS}/>
                  {openRequest.status==="pending"&&canApproveRequest(openRequest)&&(
                    <div style={{marginTop:16}}>
                      <div style={{fontSize:12,color:C.textMuted,marginBottom:6}}>یادداشت (اختیاری)</div>
                      <textarea style={{...fi,height:70,resize:"none",direction:"rtl",fontFamily:"inherit",lineHeight:1.7}}
                        placeholder="توضیح تأیید یا رد..." defaultValue={reqNote} onBlur={e=>setReqNote(e.target.value)}/>
                      <div style={{display:"flex",gap:10}}>
                        <button style={{...btn("s"),flex:1,padding:"13px",fontSize:14}} onClick={()=>{
                          setReqs(p=>p.map(r=>r.id!==openRequest.id?r:{...r,status:"approved",
                            workflow:r.workflow.map(w=>w.action==="pending"&&!w.done?{...w,action:"approved",done:true,time:nowShamsi(),note:reqNote}:w)
                          }));
                          setOpenRequest(null);setReqNote("");
                        }}>✓ تأیید درخواست</button>
                        <button style={{...btn("d"),flex:1,padding:"13px",fontSize:14}} onClick={()=>{
                          setReqs(p=>p.map(r=>r.id!==openRequest.id?r:{...r,status:"rejected",
                            workflow:r.workflow.map(w=>w.action==="pending"&&!w.done?{...w,action:"rejected",done:true,time:nowShamsi(),note:reqNote||"رد شد"}:w)
                          }));
                          setOpenRequest(null);setReqNote("");
                        }}>✕ رد درخواست</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px 8px"}}>
                    <span style={{fontWeight:700,fontSize:15}}>درخواست‌ها</span>
                    <button style={btn("p")} onClick={()=>setShowReqForm(true)}>+ درخواست</button>
                  </div>
                  {/* Search */}
                  <div style={{padding:"0 14px 10px"}}>
                    <input style={{...fi,marginBottom:0,background:C.surfaceAlt,border:"none",borderRadius:24,padding:"9px 16px"}}
                      placeholder="جستجو در درخواست‌ها..." value={searchQ} onChange={e=>setSearchQ(e.target.value)}/>
                  </div>
                  {/* Filter tabs */}
                  <div style={{display:"flex",gap:6,padding:"0 14px 10px",overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
                    {["همه","در انتظار","تأیید شده","رد شده"].map(f=>(
                      <button key={f} onClick={()=>setSearchQ(f==="همه"?"":f)}
                        style={{padding:"5px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit",whiteSpace:"nowrap",
                          background:searchQ===f||(!searchQ&&f==="همه")?C.teal:C.surfaceAlt,
                          color:searchQ===f||(!searchQ&&f==="همه")?"#fff":C.textMuted}}>
                        {f}
                      </button>
                    ))}
                  </div>
                  {reqs.filter(r=>{
                    if (!searchQ) return true;
                    if (searchQ==="در انتظار") return r.status==="pending";
                    if (searchQ==="تأیید شده") return r.status==="approved";
                    if (searchQ==="رد شده") return r.status==="rejected";
                    return r.from.includes(searchQ)||r.type.includes(searchQ)||r.detail.includes(searchQ);
                  }).map(r=>(
                    <div key={r.id} style={{...card,margin:"0 14px 8px",cursor:"pointer"}} onClick={()=>setOpenRequest(r)}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                        <Av user={USERS.find(u=>u.id===r.fromId)||USERS[0]} size={38}/>
                        <div style={{flex:1}}>
                          <div style={{fontSize:13,fontWeight:700}}>{r.from}</div>
                          <div style={{fontSize:11,color:C.textDim}}>{r.time}</div>
                        </div>
                        <Badge status={r.status}/>
                      </div>
                      <div style={{fontSize:13,color:C.textMuted,display:"flex",alignItems:"center",flexWrap:"wrap",gap:6,marginBottom:8}}>
                        <span style={{background:C.tealDim,color:C.teal,padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:600}}>{r.type}</span>
                        <span>{r.detail}</span>
                      </div>
                      {/* Mini workflow progress */}
                      {r.workflow&&(
                        <div style={{display:"flex",alignItems:"center",gap:4}}>
                          {r.workflow.map((w,i)=>(
                            <div key={i} style={{display:"flex",alignItems:"center",gap:4}}>
                              <div style={{width:20,height:20,borderRadius:"50%",background:w.done?(w.action==="rejected"?C.danger:C.success):C.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",fontWeight:700}}>{w.done?"✓":i+1}</div>
                              {i<r.workflow.length-1&&<div style={{width:16,height:2,background:w.done?C.success:C.border}}/>}
                            </div>
                          ))}
                          <span style={{fontSize:10,color:C.textDim,marginRight:6}}>
                            {faN(r.workflow.filter(w=>w.done).length)}/{faN(r.workflow.length)} مرحله
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}

            {/* TASKS */}
            {tab==="tasks"&&(
              <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
                <div style={{padding:"14px 16px 8px",fontWeight:700,fontSize:15}}>وظایف من</div>
                {myTasks.length===0&&<div style={{textAlign:"center",color:C.textDim,marginTop:60,fontSize:13}}>همه وظایف تکمیل شده‌اند</div>}
                {projs.map(p=>{
                  const myT=p.tasks.filter(t=>t.assignedTo===me.id&&t.status!=="done");
                  if(!myT.length) return null;
                  return(
                    <div key={p.id} style={{marginBottom:16}}>
                      <div style={{fontSize:12,color:C.teal,fontWeight:700,padding:"6px 16px 4px",borderBottom:`1px solid ${C.border}`}}>{p.title}</div>
                      {myT.map(t=>(
                        <div key={t.id} style={{...card,margin:"8px 14px",cursor:"pointer"}} onClick={()=>{setActiveProj(p.id);setActiveTask({pid:p.id,tid:t.id});}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:13,fontWeight:600,flex:1,marginLeft:8}}>{t.title}</span><Badge status={t.priority}/></div>
                          {t.desc&&<div style={{fontSize:12,color:C.textDim,marginBottom:6,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{t.desc}</div>}
                          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:11,color:C.textDim}}>سررسید: {t.due}</span><span style={{fontSize:11,color:C.teal}}>مشاهده و اقدام</span></div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}


            {/* INBOX / KARTEBL */}
            {tab==="inbox"&&(
              <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
                {/* Sub tabs */}
                <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,background:C.surface,flexShrink:0}}>
                  {["letters","docs"].map(s=>(
                    <div key={s} onClick={()=>setInboxSub(s)}
                      style={{flex:1,padding:"11px 8px",textAlign:"center",cursor:"pointer",fontSize:13,fontWeight:600,color:inboxSub===s?C.teal:C.textMuted,borderBottom:inboxSub===s?`2px solid ${C.teal}`:"2px solid transparent",WebkitTapHighlightColor:"transparent"}}>
                      {s==="letters"?"نامه‌ها":"مستندات"}
                    </div>
                  ))}
                </div>

                {/* LETTERS */}
                {inboxSub==="letters"&&(
                  <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
                    <div style={{display:"flex",alignItems:"center",padding:"10px 16px",gap:8,flexShrink:0}}>
                      {["inbox","sent"].map(t=>(
                        <button key={t} onClick={()=>setLetterTab(t)}
                          style={{padding:"5px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit",background:letterTab===t?C.teal:C.surfaceAlt,color:letterTab===t?"#fff":C.textMuted}}>
                          {t==="inbox"?"صندوق ورودی":"ارسال شده"}
                        </button>
                      ))}
                      <div style={{flex:1}}/>
                      <button onClick={()=>{setCompose({to:[],subject:"",body:"",priority:"normal",attachments:[]});setShowCompose(true);}}
                        style={{...btn("p"),fontSize:12}}>+ نامه جدید</button>
                    </div>
                    <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
                      {letters.filter(l=>l.status===letterTab).map(l=>{
                        const sender=USERS.find(u=>u.id===l.from);
                        return(
                          <div key={l.id} style={{display:"flex",gap:12,padding:"12px 16px",borderBottom:`1px solid ${C.border}`,cursor:"pointer",background:!l.read&&l.status==="inbox"?C.tealDim:"transparent"}}
                            onClick={()=>{setOpenLetter(l);setLetters(ls=>ls.map(x=>x.id===l.id?{...x,read:true}:x));}}>
                            <Av user={sender} size={40}/>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                                <span style={{fontSize:13,fontWeight:700,color:!l.read&&l.status==="inbox"?C.text:C.textMuted}}>{sender?.name}</span>
                                <div style={{display:"flex",alignItems:"center",gap:6}}>
                                  {l.priority==="high"&&<span style={{fontSize:10,background:C.danger+"22",color:C.danger,padding:"1px 6px",borderRadius:10,fontWeight:600}}>فوری</span>}
                                  <span style={{fontSize:11,color:C.textDim}}>{l.date}</span>
                                </div>
                              </div>
                              <div style={{fontSize:13,fontWeight:600,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.subject}</div>
                              <div style={{fontSize:12,color:C.textDim,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.body.split("\n")[0]}</div>
                              {l.attachments.length>0&&<div style={{fontSize:11,color:C.teal,marginTop:3}}>📎 {l.attachments.length} پیوست</div>}
                            </div>
                            {!l.read&&l.status==="inbox"&&<div style={{width:8,height:8,borderRadius:"50%",background:C.teal,flexShrink:0,marginTop:6}}/>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* DOCS */}
                {inboxSub==="docs"&&(
                  <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
                    <div style={{padding:"10px 16px",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                      <div style={{display:"flex",gap:6,flex:1,overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
                        {["همه","آیین‌نامه","قراردادها","فرم‌ها","گزارش‌ها"].map(cat=>(
                          <button key={cat} onClick={()=>setDocFilter(cat)}
                            style={{padding:"5px 12px",borderRadius:20,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"inherit",whiteSpace:"nowrap",background:docFilter===cat?C.teal:C.surfaceAlt,color:docFilter===cat?"#fff":C.textMuted}}>
                            {cat}
                          </button>
                        ))}
                      </div>
                      <label style={{...btn("p"),fontSize:12,cursor:"pointer"}}>
                        + آپلود
                        <input type="file" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const ext=f.name.split(".").pop().toLowerCase();const icon=ext==="pdf"?"📄":ext==="xlsx"||ext==="xls"?"📊":ext==="docx"||ext==="doc"?"📝":"📁";setDocs(p=>[{id:Date.now(),name:f.name,category:"سایر",uploadedBy:me.id,date:dateShamsi(new Date()),size:(f.size/1024).toFixed(0)+"KB",icon},...p]);e.target.value="";}}/>
                      </label>
                    </div>
                    <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"0 14px"}}>
                      {docs.filter(d=>docFilter==="همه"||d.category===docFilter).map(d=>{
                        const uploader=USERS.find(u=>u.id===d.uploadedBy);
                        return(
                          <div key={d.id} style={{...card,display:"flex",alignItems:"center",gap:12}}>
                            <div style={{width:44,height:44,borderRadius:10,background:C.surfaceAlt,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{d.icon}</div>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.name}</div>
                              <div style={{display:"flex",gap:8,marginTop:3,fontSize:11,color:C.textDim}}>
                                <span style={{background:C.tealDim,color:C.teal,padding:"1px 8px",borderRadius:10,fontSize:10}}>{d.category}</span>
                                <span>{d.size}</span>
                                <span>{d.date}</span>
                              </div>
                              {uploader&&<div style={{fontSize:11,color:C.textDim,marginTop:2}}>آپلود توسط: {uploader.lastName}</div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}


            {/* ADMIN PANEL */}
            {tab==="admin" && isAdmin && (
              <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"0 0 20px"}}>

                {/* Header */}
                <div style={{padding:"14px 16px 8px",borderBottom:`1px solid ${C.border}`}}>
                  <div style={{fontWeight:700,fontSize:15}}>پنل مدیریت</div>
                  <div style={{fontSize:11,color:C.teal,marginTop:2}}>آذرمهر صنعت</div>
                </div>

                {/* Stats Row */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,padding:"14px 14px 0"}}>
                  {[
                    {label:"کارمندان فعال",  value:USERS.length,          color:C.teal},
                    {label:"پروژه‌های فعال", value:projs.filter(p=>p.status==="inprogress").length, color:"#3B82F6"},
                    {label:"درخواست معلق",  value:reqs.filter(r=>r.status==="pending").length, color:C.warning},
                    {label:"وظایف در جریان",value:projs.flatMap(p=>p.tasks).filter(t=>t.status==="inprogress").length, color:"#8B5CF6"},
                  ].map((s,i)=>(
                    <div key={i} style={{background:C.surface,borderRadius:12,padding:"14px",border:`1px solid ${C.border}`}}>
                      <div style={{fontSize:28,fontWeight:800,color:s.color}}>{faN(s.value)}</div>
                      <div style={{fontSize:12,color:C.textMuted,marginTop:4}}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Employee Performance */}
                <div style={{margin:"14px 14px 0"}}>
                  <div style={{fontWeight:700,fontSize:14,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span>عملکرد کارمندان</span>
                    <button onClick={()=>{
                      const headers=["نام","سمت","وظایف کل","تکمیل شده","در جریان","در انتظار","درصد پیشرفت"];
                      const rows=USERS.map(u=>{
                        const tasks=projs.flatMap(p=>p.tasks).filter(t=>t.assignedTo===u.id);
                        const done=tasks.filter(t=>t.status==="done").length;
                        const inprog=tasks.filter(t=>t.status==="inprogress").length;
                        const pend=tasks.filter(t=>t.status==="pending").length;
                        const pct=tasks.length?Math.round(done/tasks.length*100):0;
                        return [u.name,u.role,tasks.length,done,inprog,pend,pct+"%"];
                      });
                      exportToCSV("عملکرد-کارمندان",headers,rows);
                    }} style={{...btn("p"),fontSize:11,padding:"5px 12px"}}>خروجی Excel</button>
                  </div>
                  {USERS.map(u=>{
                    const tasks=projs.flatMap(p=>p.tasks).filter(t=>t.assignedTo===u.id);
                    const done=tasks.filter(t=>t.status==="done").length;
                    const pct=tasks.length?Math.round(done/tasks.length*100):0;
                    return(
                      <div key={u.id} style={{background:C.surface,borderRadius:10,padding:"11px 14px",border:`1px solid ${C.border}`,marginBottom:8}}>
                        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                          <Av user={u} size={34}/>
                          <div style={{flex:1}}>
                            <div style={{fontSize:13,fontWeight:600}}>{u.name}</div>
                            <div style={{fontSize:11,color:C.textDim}}>{u.role}</div>
                          </div>
                          <div style={{fontSize:13,fontWeight:700,color:pct===100?C.success:C.teal}}>{faN(pct)}%</div>
                        </div>
                        <div style={{height:3,background:C.border,borderRadius:3,overflow:"hidden"}}>
                          <div style={{width:`${pct}%`,height:"100%",background:pct===100?C.success:C.teal}}/>
                        </div>
                        <div style={{display:"flex",gap:12,marginTop:6,fontSize:11,color:C.textDim}}>
                          <span>کل: {faN(tasks.length)}</span>
                          <span style={{color:C.success}}>تکمیل: {faN(done)}</span>
                          <span style={{color:C.copper||C.teal}}>جاری: {faN(tasks.filter(t=>t.status==="inprogress").length)}</span>
                          <span style={{color:C.warning}}>معلق: {faN(tasks.filter(t=>t.status==="pending").length)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Requests Summary */}
                <div style={{margin:"14px 14px 0"}}>
                  <div style={{fontWeight:700,fontSize:14,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span>خلاصه درخواست‌ها</span>
                    <button onClick={()=>{
                      const headers=["نوع","از","وضعیت","جزئیات","تاریخ"];
                      const rows=reqs.map(r=>[r.type,r.from,r.status==="pending"?"در انتظار":r.status==="approved"?"تأیید شد":"رد شد",r.detail,r.time]);
                      exportToCSV("درخواست‌ها",headers,rows);
                    }} style={{...btn("p"),fontSize:11,padding:"5px 12px"}}>خروجی Excel</button>
                  </div>
                  <div style={{background:C.surface,borderRadius:10,border:`1px solid ${C.border}`,overflow:"hidden"}}>
                    {[
                      {label:"در انتظار تأیید",val:reqs.filter(r=>r.status==="pending").length, color:C.warning},
                      {label:"تأیید شده",       val:reqs.filter(r=>r.status==="approved").length,color:C.success},
                      {label:"رد شده",           val:reqs.filter(r=>r.status==="rejected").length,color:C.danger},
                    ].map((item,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",borderBottom:i<2?`1px solid ${C.border}`:"none"}}>
                        <span style={{fontSize:13,color:C.textMuted}}>{item.label}</span>
                        <span style={{fontSize:16,fontWeight:700,color:item.color}}>{item.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projects Summary */}
                <div style={{margin:"14px 14px 0"}}>
                  <div style={{fontWeight:700,fontSize:14,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span>وضعیت پروژه‌ها</span>
                    <button onClick={()=>{
                      const headers=["عنوان","مدیر","وضعیت","اولویت","شروع","پایان","وظایف کل","تکمیل"];
                      const rows=projs.map(p=>{
                        const mgr=USERS.find(u=>u.id===p.manager);
                        const done=p.tasks.filter(t=>t.status==="done").length;
                        return [p.title,mgr?.name||"",p.status,p.priority,p.startDate,p.endDate,p.tasks.length,done];
                      });
                      exportToCSV("پروژه‌ها",headers,rows);
                    }} style={{...btn("p"),fontSize:11,padding:"5px 12px"}}>خروجی Excel</button>
                  </div>
                  {projs.map(p=>{
                    const mgr=USERS.find(u=>u.id===p.manager);
                    const done=p.tasks.filter(t=>t.status==="done").length;
                    const pct=p.tasks.length?Math.round(done/p.tasks.length*100):0;
                    return(
                      <div key={p.id} style={{background:C.surface,borderRadius:10,padding:"12px 14px",border:`1px solid ${C.border}`,marginBottom:8,cursor:"pointer"}} onClick={()=>{setActiveProj(p.id);setTab("projects");}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                          <div style={{flex:1,marginLeft:8}}>
                            <div style={{fontSize:13,fontWeight:700}}>{p.title}</div>
                            <div style={{fontSize:11,color:C.textDim,marginTop:2}}>مدیر: {mgr?.name} · تا {p.endDate}</div>
                          </div>
                          <Badge status={p.status}/>
                        </div>
                        <div style={{height:3,background:C.border,borderRadius:3,overflow:"hidden",marginBottom:6}}>
                          <div style={{width:`${pct}%`,height:"100%",background:pct===100?C.success:C.teal}}/>
                        </div>
                        <div style={{fontSize:11,color:C.textDim}}>{done}/{p.tasks.length} وظیفه · {pct}% پیشرفت</div>
                      </div>
                    );
                  })}
                </div>

                {/* Export All */}
                <div style={{margin:"14px 14px 0",background:C.surface,borderRadius:10,border:`1px solid ${C.border}`,overflow:"hidden"}}>
                  <div style={{padding:"12px 14px",borderBottom:`1px solid ${C.border}`,fontSize:13,fontWeight:700}}>خروجی کامل</div>
                  {[
                    {label:"تمام درخواست‌ها",fn:()=>{const h=["نوع","از","وضعیت","جزئیات","تاریخ"];const r=reqs.map(x=>[x.type,x.from,x.status,x.detail,x.time]);exportToCSV("all-requests",h,r);}},
                    {label:"تمام وظایف پروژه‌ها",fn:()=>{const h=["پروژه","عنوان","مسئول","اولویت","سررسید","وضعیت"];const r=projs.flatMap(p=>p.tasks.map(t=>{const u=USERS.find(x=>x.id===t.assignedTo);return [p.title,t.title,u?.name||"",t.priority,t.due,t.status];}));exportToCSV("all-tasks",h,r);}},
                    {label:"عملکرد کارمندان",fn:()=>{const h=["نام","سمت","وظایف کل","تکمیل","درصد"];const r=USERS.map(u=>{const tasks=projs.flatMap(p=>p.tasks).filter(t=>t.assignedTo===u.id);const done=tasks.filter(t=>t.status==="done").length;return [u.name,u.role,tasks.length,done,tasks.length?Math.round(done/tasks.length*100)+"%":"0%"];});exportToCSV("performance",h,r);}},
                    {label:"لیست کارمندان",fn:()=>{const h=["نام","سمت","نام کاربری"];const r=USERS.map(u=>[u.name,u.role,USER_CREDENTIALS[u.id]?.username||""]);exportToCSV("employees",h,r);}},
                  ].map((item,i,arr)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
                      <span style={{fontSize:13,color:C.textMuted}}>{item.label}</span>
                      <button onClick={item.fn} style={{...btn("p"),fontSize:11,padding:"5px 14px"}}>دانلود</button>
                    </div>
                  ))}
                </div>

              </div>
            )}



            {/* PAYMENTS */}
            {tab==="payments"&&(
              openPayment && !canSeePayment(openPayment) ? (
                <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center"}}>
                  <div>
                    <div style={{fontSize:32,marginBottom:12}}>🔒</div>
                    <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:8}}>دسترسی محدود</div>
                    <div style={{fontSize:12,color:C.textMuted,marginBottom:16}}>شما به این پرداخت دسترسی ندارید</div>
                    <button onClick={()=>setOpenPayment(null)} style={{background:C.teal,border:"none",borderRadius:10,padding:"10px 24px",color:"#fff",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>بازگشت</button>
                  </div>
                </div>
              ) : openPayment ? (
                <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
                  <div style={{height:48,display:"flex",alignItems:"center",padding:"0 14px",background:C.surface,borderBottom:`1px solid ${C.border}`,gap:10,flexShrink:0}}>
                    <button onClick={()=>setOpenPayment(null)} style={{background:"none",border:"none",color:C.teal,cursor:"pointer",fontSize:24,lineHeight:1,padding:0}}>‹</button>
                    <span style={{fontSize:14,fontWeight:700,flex:1}}>جزئیات پرداخت · {openPayment.code}</span>
                    <span style={{fontSize:11,color:statusColor(openPayment.status)}}>{statusLabel(openPayment.status)}</span>
                  </div>
                  <PaymentDetail payment={openPayment} me={me} onBack={()=>setOpenPayment(null)} onAction={handlePaymentAction} isAdmin={isAdmin}/>
                </div>
              ) : (
                <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
                  {/* Header */}
                  <div style={{padding:"12px 16px 8px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
                    <span style={{fontWeight:700,fontSize:15}}>سیستم پرداخت</span>
                    <button onClick={()=>exportSepidaar(visiblePayments)} style={{...btn("g"),fontSize:11,padding:"5px 12px",border:`1px solid ${C.border}`}}>خروجی سپیدار</button>
                  </div>
                  {/* Stats */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,padding:"0 14px 10px",flexShrink:0}}>
                    {[
                      ["کل",visiblePayments.length,C.teal],
                      ["نوبت من",visiblePayments.filter(p=>p.workflow.some(w=>w.assignedTo===me.id&&w.status==="pending"&&(w.step===1||p.workflow[w.step-2]?.status==="done"))).length,C.warning],
                      ["پرداخت شده",visiblePayments.filter(p=>p.status==="paid").length,C.success],
                    ].map(([l,v,col],i)=>(
                      <div key={i} style={{background:C.surface,borderRadius:10,padding:"10px",border:`1px solid ${C.border}`,textAlign:"center"}}>
                        <div style={{fontSize:20,fontWeight:800,color:col}}>{faN(v)}</div>
                        <div style={{fontSize:10,color:C.textDim,marginTop:2}}>{l}</div>
                      </div>
                    ))}
                  </div>
                  {/* Filter */}
                  <div style={{display:"flex",gap:6,padding:"0 14px 8px",overflowX:"auto",WebkitOverflowScrolling:"touch",flexShrink:0}}>
                    {[["all","همه"],["pending","نوبت من"],["mine","درخواست‌های من"],["paid","پرداخت شده"]].map(([id,l])=>(
                      <button key={id} onClick={()=>setPayFilter(id)}
                        style={{padding:"5px 12px",borderRadius:20,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"inherit",whiteSpace:"nowrap",background:payFilter===id?C.teal:C.surfaceAlt,color:payFilter===id?"#fff":C.textMuted,flexShrink:0}}>
                        {l}
                      </button>
                    ))}
                  </div>
                  {/* Search */}
                  <div style={{padding:"0 14px 8px",flexShrink:0}}>
                    <input style={{width:"100%",background:C.surfaceAlt,border:"none",borderRadius:24,padding:"9px 16px",color:C.text,fontSize:15,outline:"none",direction:"rtl",boxSizing:"border-box",fontFamily:"inherit"}}
                      placeholder="جستجو..." value={paySearch} onChange={e=>setPaySearch(e.target.value)}/>
                  </div>
                  {/* List */}
                  <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"0 14px"}}>
                    {visiblePayments.filter(p=>{
                      const mf = payFilter==="all"?true:payFilter==="pending"?p.workflow.some(w=>w.assignedTo===me.id&&w.status==="pending"&&(w.step===1||p.workflow[w.step-2]?.status==="done")):payFilter==="mine"?p.requesterId===me.id:p.status==="paid";
                      const ms = !paySearch||p.code.includes(paySearch)||p.desc.includes(paySearch)||p.beneficiary.includes(paySearch)||p.type.includes(paySearch);
                      return mf&&ms;
                    }).map(p=>{
                      const myStep=p.workflow.find(w=>w.assignedTo===me.id&&w.status==="pending"&&(w.step===1||p.workflow[w.step-2]?.status==="done"));
                      const doneCount=p.workflow.filter(w=>w.status==="done").length;
                      return (
                        <div key={p.id} style={{background:C.surface,borderRadius:12,padding:14,border:`1px solid ${myStep?C.warning:C.border}`,marginBottom:10,cursor:"pointer"}} onClick={()=>setOpenPayment(p)}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                            <div>
                              <div style={{fontSize:13,fontWeight:700}}>{p.code}</div>
                              <div style={{fontSize:11,color:C.textDim}}>{p.type} · {p.date}</div>
                            </div>
                            <div style={{textAlign:"left"}}>
                              <div style={{fontSize:14,fontWeight:800,color:C.teal}}>{Number(p.amount).toLocaleString("fa-IR")}</div>
                              <div style={{fontSize:10,color:C.textDim}}>تومان</div>
                            </div>
                          </div>
                          <div style={{fontSize:12,color:C.textMuted,marginBottom:8}}>{p.desc}</div>
                          <div style={{display:"flex",alignItems:"center",gap:3,marginBottom:myStep?8:0}}>
                            {p.workflow.map((w,i)=>(
                              <div key={i} style={{display:"flex",alignItems:"center",gap:3}}>
                                <div style={{width:20,height:20,borderRadius:"50%",background:w.status==="done"?C.success:w.status==="rejected"?C.danger:C.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",fontWeight:700}}>
                                  {w.status==="done"?"✓":w.status==="rejected"?"✕":faN(w.step)}
                                </div>
                                {i<p.workflow.length-1&&<div style={{width:10,height:2,background:w.status==="done"?C.success:C.border}}/>}
                              </div>
                            ))}
                            <span style={{fontSize:10,color:C.textDim,marginRight:6}}>{faN(doneCount)}/{faN(p.workflow.length)}</span>
                          </div>
                          {myStep&&<div style={{background:C.warning+"22",borderRadius:8,padding:"6px 10px",fontSize:12,color:C.warning,fontWeight:600}}>نوبت شما: {myStep.title}</div>}
                        </div>
                      );
                    })}
                    <div style={{height:80}}/>
                  </div>
                  {/* FAB */}
                  <button onClick={()=>setShowPayForm(true)}
                    style={{position:"absolute",bottom:"calc(70px + env(safe-area-inset-bottom))",left:"50%",transform:"translateX(-50%)",background:C.teal,border:"none",borderRadius:28,padding:"12px 24px",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 4px 20px ${C.teal}66`,display:"flex",alignItems:"center",gap:8,WebkitTapHighlightColor:"transparent",zIndex:5}}>
                    + درخواست پرداخت جدید
                  </button>
                </div>
              )
            )}

            {/* ─── CRM ─── */}
            {tab==="crm"&&(
              <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>

                {/* هدر */}
                <div style={{padding:"12px 16px 8px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
                  <span style={{fontWeight:700,fontSize:15}}>CRM مشتریان</span>
                  <button onClick={()=>setShowCustForm(true)} style={{...btn("p"),fontSize:12,padding:"6px 14px"}}>+ مشتری</button>
                </div>

                {/* آمار */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,padding:"0 14px 10px",flexShrink:0}}>
                  {[
                    ["مشتریان",customers.length,C.teal],
                    ["طلایی",customers.filter(c=>c.grade==="طلایی").length,"#F59E0B"],
                    ["بدهکار",customers.filter(c=>c.debt>0).length,C.danger],
                    ["سفارش",crmOrders.filter(o=>o.status!=="تسویه").length,C.success],
                  ].map(([l,v,col],i)=>(
                    <div key={i} style={{background:C.surface,borderRadius:10,padding:"10px 6px",border:`1px solid ${C.border}`,textAlign:"center"}}>
                      <div style={{fontSize:18,fontWeight:800,color:col}}>{faN(v)}</div>
                      <div style={{fontSize:9,color:C.textDim,marginTop:2}}>{l}</div>
                    </div>
                  ))}
                </div>

                {/* تب‌های داخلی */}
                <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
                  {[["customers","مشتریان"],["orders","سفارشات"],["debt","مطالبات"],["report","گزارش"]].map(([id,lbl])=>(
                    <div key={id} onClick={()=>setCrmTab(id)}
                      style={{flex:1,textAlign:"center",padding:"10px 4px",cursor:"pointer",fontSize:12,
                        color:crmTab===id?C.teal:C.textMuted,
                        borderBottom:crmTab===id?`2px solid ${C.teal}`:"2px solid transparent",
                        fontWeight:crmTab===id?700:400}}>
                      {lbl}
                    </div>
                  ))}
                </div>

                {/* محتوا */}
                <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"10px 14px"}}>

                  {/* مشتریان */}
                  {crmTab==="customers"&&<>
                    <input style={{width:"100%",background:C.surfaceAlt,border:"none",borderRadius:24,padding:"9px 16px",color:C.text,fontSize:15,outline:"none",direction:"rtl",boxSizing:"border-box",fontFamily:"inherit",marginBottom:10}}
                      placeholder="جستجو..." value={crmSearch} onChange={e=>setCrmSearch(e.target.value)}/>
                    {customers.filter(c=>!crmSearch||c.name.includes(crmSearch)||c.city.includes(crmSearch)||c.contact.includes(crmSearch)).map(c=>(
                      <div key={c.id} style={{background:C.surface,borderRadius:12,padding:14,border:`1px solid ${C.border}`,marginBottom:10,cursor:"pointer"}} onClick={()=>setActiveCust(c)}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div style={{width:42,height:42,borderRadius:"50%",background:`linear-gradient(135deg,${C.teal},#A66B0A)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#111",fontWeight:800,fontSize:18,flexShrink:0}}>{c.av||c.name[0]}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                              <span style={{fontSize:14,fontWeight:700}}>{c.name}</span>
                              <span style={{fontSize:10,background:c.grade==="طلایی"?"#F59E0B22":c.grade==="نقره‌ای"?"#8A8A8A22":"#4A4A4A22",color:c.grade==="طلایی"?"#F59E0B":c.grade==="نقره‌ای"?"#8A8A8A":"#4A4A4A",padding:"1px 8px",borderRadius:10,fontWeight:600,flexShrink:0}}>{c.grade}</span>
                            </div>
                            <div style={{fontSize:11,color:C.textMuted}}>{c.type} · {c.city} · {c.contact}</div>
                          </div>
                          <div style={{textAlign:"left",flexShrink:0}}>
                            {c.debt>0
                              ? <div style={{fontSize:11,color:C.danger,fontWeight:600}}>{faN(Math.round(c.debt/1000000))}M بدهی</div>
                              : <div style={{fontSize:11,color:C.success}}>تسویه ✓</div>
                            }
                          </div>
                        </div>
                      </div>
                    ))}
                    <div style={{height:80}}/>
                  </>}

                  {/* سفارشات */}
                  {crmTab==="orders"&&<>
                    <div style={{display:"flex",justifyContent:"flex-start",marginBottom:10}}>
                      <button onClick={()=>setShowOrderForm(true)} style={{...btn("p"),fontSize:12,padding:"6px 14px"}}>+ سفارش جدید</button>
                    </div>
                    {crmOrders.map(o=>{
                      const cust = customers.find(c=>c.id===o.customerId);
                      const sc = {ارسال:C.teal,تسویه:C.success,تولید:C.warning,ثبت:C.textMuted};
                      return (
                        <div key={o.id} style={{background:C.surface,borderRadius:12,padding:14,border:`1px solid ${C.border}`,marginBottom:10}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                            <span style={{fontSize:13,fontWeight:700}}>{cust?.name||"—"}</span>
                            <span style={{fontSize:11,background:(sc[o.status]||C.textMuted)+"22",color:sc[o.status]||C.textMuted,padding:"2px 8px",borderRadius:10,fontWeight:600}}>{o.status}</span>
                          </div>
                          <div style={{fontSize:12,color:C.textMuted,marginBottom:6}}>{o.product} · {faN(o.qty)} {o.unit}</div>
                          <div style={{display:"flex",justifyContent:"space-between"}}>
                            <span style={{fontSize:13,fontWeight:700,color:C.teal}}>{Number(o.amount).toLocaleString("fa-IR")} تومان</span>
                            <span style={{fontSize:11,color:C.textDim}}>{o.date}</span>
                          </div>
                        </div>
                      );
                    })}
                    <div style={{height:80}}/>
                  </>}

                  {/* مطالبات */}
                  {crmTab==="debt"&&<>
                    {customers.filter(c=>c.debt>0).length===0
                      ? <div style={{textAlign:"center",color:C.textDim,marginTop:40,fontSize:13}}>هیچ مطالبه‌ای وجود ندارد ✓</div>
                      : customers.filter(c=>c.debt>0).map(c=>(
                          <div key={c.id} style={{background:C.surface,borderRadius:12,padding:14,border:`1px solid ${C.danger}33`,marginBottom:10}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                              <span style={{fontSize:14,fontWeight:700}}>{c.name}</span>
                              <span style={{fontSize:15,fontWeight:800,color:C.danger}}>{faN(Math.round(c.debt/1000000))} میلیون</span>
                            </div>
                            <div style={{fontSize:11,color:C.textMuted}}>{c.city} · {c.contact} · {c.phone}</div>
                          </div>
                        ))
                    }
                  </>}

                  {/* گزارش */}
                  {crmTab==="report"&&<>
                    <div style={{background:C.surface,borderRadius:12,padding:14,border:`1px solid ${C.border}`,marginBottom:10}}>
                      <div style={{fontSize:13,fontWeight:700,marginBottom:12}}>فروش به تفکیک محصول</div>
                      {Object.entries(crmOrders.reduce((acc,o)=>{
                        acc[o.product]=(acc[o.product]||0)+Number(o.amount); return acc;
                      },{})).map(([prod,total],i,arr)=>{
                        const max=Math.max(...arr.map(([,v])=>v));
                        return (
                          <div key={prod} style={{marginBottom:10}}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                              <span style={{fontSize:12}}>{prod}</span>
                              <span style={{fontSize:12,color:C.teal,fontWeight:600}}>{(total/1000000).toFixed(0)}M</span>
                            </div>
                            <div style={{height:4,background:C.border,borderRadius:4}}>
                              <div style={{width:(total/max*100)+"%",height:"100%",background:C.teal,borderRadius:4}}/>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{background:C.surface,borderRadius:12,padding:14,border:`1px solid ${C.border}`}}>
                      <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>خلاصه</div>
                      {[
                        ["کل فروش", crmOrders.reduce((s,o)=>s+Number(o.amount),0).toLocaleString("fa-IR")+" تومان", C.teal],
                        ["کل مطالبات", customers.reduce((s,c)=>s+c.debt,0).toLocaleString("fa-IR")+" تومان", C.danger],
                        ["سفارشات باز", faN(crmOrders.filter(o=>o.status!=="تسویه").length)+" سفارش", C.warning],
                      ].map(([l,v,col],i)=>(
                        <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<2?`1px solid ${C.border}`:"none"}}>
                          <span style={{fontSize:12,color:C.textMuted}}>{l}</span>
                          <span style={{fontSize:13,fontWeight:700,color:col}}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </>}

                </div>

                {/* پروفایل مشتری */}
                {activeCust&&(
                  <div style={{position:"absolute",inset:0,background:C.bg,zIndex:20,display:"flex",flexDirection:"column"}}>
                    <div style={{height:52,display:"flex",alignItems:"center",padding:"0 14px",background:C.surface,borderBottom:`1px solid ${C.border}`,gap:10,flexShrink:0}}>
                      <button onClick={()=>setActiveCust(null)} style={{background:"none",border:"none",color:C.teal,cursor:"pointer",fontSize:22,padding:0,display:"flex",alignItems:"center"}}><Icons.Back/></button>
                      <span style={{fontSize:14,fontWeight:700,flex:1}}>{activeCust.name}</span>
                      <span style={{fontSize:10,background:activeCust.grade==="طلایی"?"#F59E0B22":"#8A8A8A22",color:activeCust.grade==="طلایی"?"#F59E0B":"#8A8A8A",padding:"2px 10px",borderRadius:10,fontWeight:600}}>{activeCust.grade}</span>
                    </div>
                    <div style={{flex:1,overflowY:"auto",padding:16}}>
                      <div style={{background:C.surface,borderRadius:12,padding:14,border:`1px solid ${C.border}`,marginBottom:12}}>
                        {[
                          ["نوع",activeCust.type],
                          ["شهر",activeCust.city],
                          ["مسئول خرید",activeCust.contact],
                          ["تلفن",activeCust.phone],
                          ["شماره حساب",activeCust.account||"—"],
                        ].map(([k,v])=>(
                          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>
                            <span style={{fontSize:12,color:C.textMuted}}>{k}</span>
                            <span style={{fontSize:12,fontWeight:600,direction:k==="شماره حساب"?"ltr":"rtl"}}>{v}</span>
                          </div>
                        ))}
                        <div style={{display:"flex",justifyContent:"space-between",padding:"7px 0"}}>
                          <span style={{fontSize:12,color:C.textMuted}}>وضعیت مالی</span>
                          <span style={{fontSize:13,fontWeight:700,color:activeCust.debt>0?C.danger:C.success}}>
                            {activeCust.debt>0?faN(Math.round(activeCust.debt/1000000))+" میلیون بدهی":"تسویه ✓"}
                          </span>
                        </div>
                      </div>
                      <div style={{fontWeight:700,fontSize:14,marginBottom:10}}>سفارشات این مشتری</div>
                      {crmOrders.filter(o=>o.customerId===activeCust.id).length===0
                        ? <div style={{color:C.textDim,fontSize:12,textAlign:"center",padding:20}}>سفارشی ثبت نشده</div>
                        : crmOrders.filter(o=>o.customerId===activeCust.id).map(o=>(
                            <div key={o.id} style={{background:C.surface,borderRadius:10,padding:12,border:`1px solid ${C.border}`,marginBottom:8}}>
                              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                                <span style={{fontSize:13,fontWeight:600}}>{o.product}</span>
                                <span style={{fontSize:12,color:C.teal,fontWeight:700}}>{Number(o.amount).toLocaleString("fa-IR")}</span>
                              </div>
                              <div style={{fontSize:11,color:C.textDim}}>{faN(o.qty)} {o.unit} · {o.date} · {o.status}</div>
                            </div>
                          ))
                      }
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ORG CHART */}
            {tab==="org"&&(
              <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
                <div style={{display:"flex",alignItems:"center",padding:"12px 16px 8px",gap:8}}>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:15}}>چارت سازمانی</div><div style={{fontSize:11,color:C.teal}}>{orgActive.length} نفر فعال</div></div>
                  <button onClick={()=>setOrgOpen(new Set(orgMembers.map(m=>m.id)))} style={{fontSize:11,padding:"6px 10px",borderRadius:8,background:"transparent",border:`1px solid ${C.border}`,color:C.textMuted,cursor:"pointer",fontFamily:"inherit"}}>باز همه</button>
                  <button onClick={()=>{setOrgForm({name:"",role:"",mgr:"1",av:""});setOrgMode("add");}} style={btn("p")}>+ عضو</button>
                </div>

                {orgRows.map(({m,depth,isLast,hasKids,isOpen})=>{
                  const col=ORG_LC[Math.min(depth,ORG_LC.length-1)];
                  const mgrName=m.mgr?orgActive.find(x=>x.id===m.mgr)?.name:null;
                  return(
                    <div key={m.id} style={{display:"flex",borderBottom:`1px solid ${C.border}`,alignItems:"stretch"}}>
                      {depth>0&&(
                        <div style={{width:depth*22,flexShrink:0,position:"relative"}}>
                          <div style={{position:"absolute",top:0,bottom:isLast?"50%":0,right:depth*22-11,width:1,background:C.border}}/>
                          <div style={{position:"absolute",top:"50%",right:depth*22-11,width:11,height:1,background:C.border}}/>
                        </div>
                      )}
                      <div style={{flex:1,display:"flex",alignItems:"center",gap:12,padding:"11px 14px",cursor:"pointer"}} onClick={()=>orgEdit(m)}>
                        <div style={{width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${col},${col}77)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:700,color:"#fff",flexShrink:0}}>{m.av}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:14,fontWeight:600}}>{m.name}</div>
                          <div style={{fontSize:11,color:C.textDim,marginTop:1}}>{m.role}</div>
                          {mgrName&&<div style={{fontSize:10,color:col+"99",marginTop:2}}>گزارش به: {mgrName}</div>}
                        </div>
                        {hasKids&&<div onClick={e=>{e.stopPropagation();orgToggle(m.id);}} style={{width:28,height:28,borderRadius:"50%",background:C.surface,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:C.textMuted,cursor:"pointer",flexShrink:0,lineHeight:1}}>{isOpen?"−":"+"}</div>}
                      </div>
                    </div>
                  );
                })}

                {orgInact.length>0&&(
                  <div style={{margin:"12px 14px",background:C.surface,borderRadius:10,border:`1px solid ${C.border}`,overflow:"hidden"}}>
                    <div style={{padding:"10px 14px",fontSize:12,color:C.textDim,borderBottom:`1px solid ${C.border}`}}>غیرفعال ({orgInact.length})</div>
                    {orgInact.map(m=>(
                      <div key={m.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",opacity:0.6}}>
                        <div style={{width:34,height:34,borderRadius:"50%",background:C.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:C.textMuted,flexShrink:0}}>{m.av}</div>
                        <div style={{flex:1}}><div style={{fontSize:13,color:C.textMuted}}>{m.name}</div><div style={{fontSize:11,color:C.textDim}}>{m.role}</div></div>
                        <button onClick={()=>orgReact(m.id)} style={btn("p")}>بازگشت</button>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{height:20}}/>

                {orgMode==="edit"&&<Sheet title="ویرایش عضو" onClose={()=>setOrgMode("list")}>{lbl("نام کامل")}<input style={fi} value={orgForm.name} onChange={e=>setOrgForm(p=>({...p,name:e.target.value}))}/>{lbl("سمت")}<input style={fi} value={orgForm.role} onChange={e=>setOrgForm(p=>({...p,role:e.target.value}))}/>{lbl("مدیر مستقیم")}<select style={fi} value={orgForm.mgr} onChange={e=>setOrgForm(p=>({...p,mgr:e.target.value}))}><option value="">— رأس —</option>{orgActive.filter(m=>m.id!==orgCur?.id).map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select>{lbl("حرف آواتار")}<input style={fi} maxLength={2} value={orgForm.av} onChange={e=>setOrgForm(p=>({...p,av:e.target.value}))}/><div style={{display:"flex",gap:8}}>{orgCur?.mgr!==null&&<button onClick={()=>setOrgMode("confirm")} style={{flex:1,padding:11,borderRadius:10,border:"none",background:C.danger+"33",color:C.danger,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>حذف</button>}<button onClick={()=>setOrgMode("list")} style={{flex:1,padding:11,borderRadius:10,border:`1px solid ${C.border}`,background:"transparent",color:C.textMuted,cursor:"pointer",fontFamily:"inherit"}}>انصراف</button><button onClick={orgSave} style={{flex:2,padding:11,borderRadius:10,border:"none",background:C.teal,color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>ذخیره</button></div></Sheet>}
                {orgMode==="add"&&<Sheet title="عضو جدید" onClose={()=>setOrgMode("list")}>{lbl("نام کامل")}<input style={fi} placeholder="نام و نام خانوادگی" value={orgForm.name} onChange={e=>setOrgForm(p=>({...p,name:e.target.value}))}/>{lbl("سمت")}<input style={fi} placeholder="عنوان شغلی" value={orgForm.role} onChange={e=>setOrgForm(p=>({...p,role:e.target.value}))}/>{lbl("مدیر مستقیم")}<select style={fi} value={orgForm.mgr} onChange={e=>setOrgForm(p=>({...p,mgr:e.target.value}))}>{orgActive.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select>{lbl("حرف آواتار")}<input style={fi} maxLength={2} value={orgForm.av} onChange={e=>setOrgForm(p=>({...p,av:e.target.value}))}/><div style={{display:"flex",gap:8}}><button onClick={()=>setOrgMode("list")} style={{flex:1,padding:11,borderRadius:10,border:`1px solid ${C.border}`,background:"transparent",color:C.textMuted,cursor:"pointer",fontFamily:"inherit"}}>انصراف</button><button onClick={orgAdd} style={{flex:2,padding:11,borderRadius:10,border:"none",background:C.teal,color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>افزودن</button></div></Sheet>}
                {orgMode==="confirm"&&<div style={{position:"fixed",inset:0,background:"#000C",display:"flex",alignItems:"flex-end",zIndex:100}} onClick={()=>setOrgMode("edit")}><div style={{background:C.surface,borderRadius:"20px 20px 0 0",padding:"24px 20px 32px",width:"100%",maxWidth:500,margin:"0 auto",textAlign:"center"}} onClick={e=>e.stopPropagation()}><div style={{width:32,height:4,background:C.border,borderRadius:2,margin:"0 auto 18px"}}/><div style={{fontSize:16,fontWeight:700,marginBottom:8}}>حذف از چارت</div><div style={{fontSize:13,color:C.textMuted,lineHeight:1.7,marginBottom:22}}>غیرفعال می‌شه و زیرمجموعه‌ها منتقل می‌شن.</div><div style={{display:"flex",gap:10}}><button onClick={()=>setOrgMode("edit")} style={{flex:1,padding:12,borderRadius:10,border:`1px solid ${C.border}`,background:"transparent",color:C.textMuted,cursor:"pointer",fontFamily:"inherit"}}>انصراف</button><button onClick={orgDeact} style={{flex:1,padding:12,borderRadius:10,border:"none",background:C.danger,color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>غیرفعال</button></div></div></div>}
              </div>
            )}
          </>)}
        </div>
      </div>

      {/* Global Modals */}
      {showReqForm&&<Sheet title="درخواست جدید" onClose={()=>setShowReqForm(false)}>{lbl("نوع")}<select style={fi} value={newReq.type} onChange={e=>setNewReq(p=>({...p,type:e.target.value}))}>
              <option>مرخصی استحقاقی</option>
              <option>مرخصی استعلاجی</option>
              <option>مرخصی بدون حقوق</option>
              <option>مساعده</option>
              <option>اضافه‌کاری</option>
              <option>مأموریت</option>
              <option>درخواست خرید</option>
              <option>درخواست تجهیزات</option>
              <option>درخواست آموزش</option>
              <option>سایر</option>
            </select>{lbl("توضیحات")}<textarea style={{...fi,height:90,resize:"none",direction:"rtl",textAlign:"right",fontFamily:"inherit",lineHeight:1.8,fontSize:16}} placeholder="توضیحات درخواست..." defaultValue={newReq.note} onBlur={e=>setNewReq(p=>({...p,note:e.target.value}))} key={showReqForm?"open":"closed"}></textarea><div style={{display:"flex",gap:8}}><button style={{...btn("g"),flex:1,border:`1px solid ${C.border}`}} onClick={()=>setShowReqForm(false)}>انصراف</button><button style={{...btn("p"),flex:2}} onClick={submitReq}>ارسال</button></div></Sheet>}

      {showProjForm&&<Sheet title="پروژه جدید" onClose={()=>setShowProjForm(false)}>{lbl("نام پروژه")}<input style={fi} placeholder="عنوان..." value={newProj.title} onChange={e=>setNewProj(p=>({...p,title:e.target.value}))}/>{lbl("مدیر پروژه")}<select style={fi} value={newProj.manager} onChange={e=>setNewProj(p=>({...p,manager:e.target.value}))}>{USERS.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</select>{lbl("اعضا")}<div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>{USERS.map(u=>{const sel=newProj.members.includes(u.id)||newProj.members.includes(String(u.id));return<div key={u.id} onClick={()=>setNewProj(p=>({...p,members:sel?p.members.filter(x=>Number(x)!==u.id):[...p.members,u.id]}))} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:20,cursor:"pointer",fontSize:12,background:sel?C.tealDim:C.surfaceAlt,color:sel?C.teal:C.textMuted,border:`1px solid ${sel?C.teal:C.border}`}}><Av user={u} size={18}/>{u.lastName}</div>;})}</div>{lbl("تاریخ پایان")}<input style={fi} placeholder="۱۴۰۴/۰۶/۳۱" value={newProj.endDate} onChange={e=>setNewProj(p=>({...p,endDate:e.target.value}))}/>{lbl("اولویت")}<select style={fi} value={newProj.priority} onChange={e=>setNewProj(p=>({...p,priority:e.target.value}))}><option value="high">مهم</option><option value="medium">متوسط</option><option value="low">عادی</option></select><div style={{display:"flex",gap:8}}><button style={{...btn("g"),flex:1,border:`1px solid ${C.border}`}} onClick={()=>setShowProjForm(false)}>انصراف</button><button style={{...btn("p"),flex:2}} onClick={submitProj}>ایجاد</button></div></Sheet>}

      {showTaskForm&&<Sheet title="وظیفه جدید" onClose={()=>setShowTaskForm(false)}>{lbl("عنوان")}<input style={fi} placeholder="عنوان وظیفه..." value={newTask.title} onChange={e=>setNewTask(p=>({...p,title:e.target.value}))}/>{lbl("شرح کامل")}<textarea style={{...fi,height:90,resize:"none",direction:"rtl",textAlign:"right",fontFamily:"'Vazirmatn',sans-serif",lineHeight:1.8}} placeholder="توضیح دهید..." defaultValue={newTask.desc} onBlur={e=>setNewTask(p=>({...p,desc:e.target.value}))} key={showTaskForm?"open":"closed"}/>{lbl("مسئول")}<select style={fi} value={newTask.assignedTo} onChange={e=>setNewTask(p=>({...p,assignedTo:e.target.value}))}>{USERS.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</select>{lbl("اولویت")}<select style={fi} value={newTask.priority} onChange={e=>setNewTask(p=>({...p,priority:e.target.value}))}><option value="high">مهم</option><option value="medium">متوسط</option><option value="low">عادی</option></select>{lbl("سررسید")}<input style={fi} placeholder="۱۴۰۴/۰۵/۱۵" value={newTask.due} onChange={e=>setNewTask(p=>({...p,due:e.target.value}))}/><div style={{display:"flex",gap:8}}><button style={{...btn("g"),flex:1,border:`1px solid ${C.border}`}} onClick={()=>setShowTaskForm(false)}>انصراف</button><button style={{...btn("p"),flex:2}} onClick={submitTask}>افزودن</button></div></Sheet>}


      {/* Letter Detail */}
      {openLetter&&(
        <div style={{position:"fixed",inset:0,background:C.bg,zIndex:80,display:"flex",flexDirection:"column",paddingTop:"env(safe-area-inset-top)"}}>
          <div style={{height:52,display:"flex",alignItems:"center",padding:"0 14px",background:C.surface,borderBottom:`1px solid ${C.border}`,gap:12,flexShrink:0}}>
            <button onClick={()=>setOpenLetter(null)} style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",display:"flex"}}><Icons.Back/></button>
            <div style={{flex:1,fontSize:14,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{openLetter.subject}</div>
            {openLetter.priority==="high"&&<span style={{fontSize:11,background:C.danger+"22",color:C.danger,padding:"2px 8px",borderRadius:10,fontWeight:600}}>فوری</span>}
          </div>
          <div style={{flex:1,overflowY:"auto",padding:16}}>
            <div style={{...card,marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,paddingBottom:12,borderBottom:`1px solid ${C.border}`}}>
                <Av user={USERS.find(u=>u.id===openLetter.from)} size={40}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700}}>{USERS.find(u=>u.id===openLetter.from)?.name}</div>
                  <div style={{fontSize:11,color:C.textDim}}>{USERS.find(u=>u.id===openLetter.from)?.role}</div>
                </div>
                <div style={{fontSize:11,color:C.textDim}}>{openLetter.date}</div>
              </div>
              {openLetter.to.length>0&&<div style={{fontSize:12,color:C.textMuted,marginBottom:6}}>به: {openLetter.to.map(id=>USERS.find(u=>u.id===id)?.name).join("، ")}</div>}
              {openLetter.cc.length>0&&<div style={{fontSize:12,color:C.textMuted,marginBottom:6}}>رونوشت: {openLetter.cc.map(id=>USERS.find(u=>u.id===id)?.name).join("، ")}</div>}
            </div>
            <div style={{...card,lineHeight:2,fontSize:14,whiteSpace:"pre-line"}}>{openLetter.body}</div>
            {openLetter.attachments.length>0&&(
              <div style={{...card,marginTop:12}}>
                <div style={{fontSize:12,color:C.teal,fontWeight:700,marginBottom:8}}>پیوست‌ها</div>
                {openLetter.attachments.map((a,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
                    <span style={{fontSize:20}}>📎</span>
                    <span style={{fontSize:13,flex:1}}>{a.name}</span>
                    <span style={{fontSize:11,color:C.textDim}}>{a.size}</span>
                  </div>
                ))}
              </div>
            )}
            {/* Workflow Timeline */}
            {openLetter.workflow&&(
              <div style={{...card,marginTop:12}}>
                <WorkflowTimeline workflow={openLetter.workflow} users={USERS}/>
              </div>
            )}
            <div style={{display:"flex",gap:8,marginTop:16}}>
              <button onClick={()=>{
                // Add referral step to workflow
                const newStep={step:(openLetter.workflow?.length||0)+1,title:"ارجاع داده شد",userId:me.id,action:"sent",time:nowShamsi(),done:true};
                setLetters(ls=>ls.map(l=>l.id===openLetter.id?{...l,workflow:[...(l.workflow||[]),newStep]}:l));
                setCompose({to:openLetter.to,subject:"ارجاع: "+openLetter.subject,body:openLetter.body,priority:openLetter.priority,attachments:[]});
                setShowCompose(true);setOpenLetter(null);
              }} style={{...btn("g"),flex:1,padding:"12px",border:`1px solid ${C.border}`}}>ارجاع</button>
              <button onClick={()=>{
                setCompose({to:[openLetter.from],subject:"پاسخ: "+openLetter.subject,body:"\n\n--- پیام اصلی ---\n"+openLetter.body,priority:"normal",attachments:[]});
                setShowCompose(true);setOpenLetter(null);
              }} style={{...btn("p"),flex:1,padding:"12px"}}>پاسخ</button>
            </div>
          </div>
        </div>
      )}

      {/* Compose Sheet */}
      {showCompose&&(
        <div style={{position:"fixed",inset:0,background:"#000A",display:"flex",alignItems:"flex-end",zIndex:90}}>
          <div style={{background:C.surface,borderRadius:"20px 20px 0 0",padding:"20px 20px calc(20px + env(safe-area-inset-bottom))",width:"100%",maxWidth:520,margin:"0 auto",maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{width:36,height:4,background:C.border,borderRadius:2,margin:"0 auto 16px"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <span style={{fontSize:15,fontWeight:700}}>نامه جدید</span>
              <button onClick={()=>setShowCompose(false)} style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontSize:20}}>×</button>
            </div>
            <div style={{fontSize:12,color:C.textMuted,marginBottom:5}}>گیرنده</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
              {USERS.filter(u=>u.id!==me.id).map(u=>{
                const sel=compose.to.includes(u.id);
                return<div key={u.id} onClick={()=>setCompose(p=>({...p,to:sel?p.to.filter(x=>x!==u.id):[...p.to,u.id]}))}
                  style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px 4px 6px",borderRadius:20,cursor:"pointer",fontSize:12,background:sel?C.tealDim:C.surfaceAlt,color:sel?C.teal:C.textMuted,border:`1px solid ${sel?C.teal:C.border}`}}>
                  <Av user={u} size={20}/>{u.lastName}
                </div>;
              })}
            </div>
            <div style={{fontSize:12,color:C.textMuted,marginBottom:5}}>موضوع</div>
            <input style={{...fi}} placeholder="موضوع نامه..." value={compose.subject} onChange={e=>setCompose(p=>({...p,subject:e.target.value}))}/>
            <div style={{fontSize:12,color:C.textMuted,marginBottom:5}}>اولویت</div>
            <select style={fi} value={compose.priority} onChange={e=>setCompose(p=>({...p,priority:e.target.value}))}>
              <option value="normal">عادی</option>
              <option value="high">فوری</option>
            </select>
            <div style={{fontSize:12,color:C.textMuted,marginBottom:5}}>متن نامه</div>
            <textarea style={{...fi,height:140,resize:"none"}} placeholder="متن نامه را بنویسید..." defaultValue={compose.body} onBlur={e=>setCompose(p=>({...p,body:e.target.value}))}/>
            <label style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",background:C.surfaceAlt,borderRadius:8,cursor:"pointer",marginBottom:12}}>
              <Icons.Attach/><span style={{fontSize:13,color:C.textMuted}}>افزودن پیوست</span>
              <input type="file" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;setCompose(p=>({...p,attachments:[...p.attachments,{name:f.name,size:(f.size/1024).toFixed(0)+"KB"}]}));e.target.value="";}}/>
            </label>
            {compose.attachments.length>0&&<div style={{marginBottom:12}}>{compose.attachments.map((a,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",fontSize:12,color:C.textMuted}}><span>📎</span><span style={{flex:1}}>{a.name}</span><span>{a.size}</span><button onClick={()=>setCompose(p=>({...p,attachments:p.attachments.filter((_,j)=>j!==i)}))} style={{background:"none",border:"none",color:C.danger,cursor:"pointer",fontSize:16}}>×</button></div>)}</div>}
            <div style={{display:"flex",gap:8}}>
              <button style={{...btn("g"),flex:1,border:`1px solid ${C.border}`}} onClick={()=>setShowCompose(false)}>انصراف</button>
              <button style={{...btn("p"),flex:2}} onClick={()=>{
                if(!compose.to.length||!compose.subject.trim()) return;
                const newLetter={id:Date.now(),from:me.id,to:compose.to,cc:[],subject:compose.subject,body:compose.body,status:"sent",priority:compose.priority,date:"همین الان",read:true,attachments:compose.attachments};
                setLetters(p=>[newLetter,...p]);
                setShowCompose(false);
              }}>ارسال نامه</button>
            </div>
          </div>
        </div>
      )}


      {/* Change PIN Sheet */}
      {showChangePIN&&(
        <div style={{position:"fixed",inset:0,background:"#000A",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:110}} onClick={()=>{setShowChangePIN(false);setChangePinStep("old");setChangePinVal({old:"",new1:"",new2:""});setPinChangeMsg("");}}>
          <div style={{background:C.surface,borderRadius:"20px 20px 0 0",padding:"20px 20px calc(28px + env(safe-area-inset-bottom))",width:"100%",maxWidth:480}} onClick={e=>e.stopPropagation()}>
            <div style={{width:36,height:4,background:C.border,borderRadius:2,margin:"0 auto 16px"}}/>
            <div style={{fontSize:15,fontWeight:700,marginBottom:6}}>تنظیمات حساب</div>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 0",borderBottom:`1px solid ${C.border}`,marginBottom:16}}>
              <Av user={me} size={40}/>
              <div><div style={{fontSize:14,fontWeight:700}}>{me.name}</div><div style={{fontSize:12,color:C.textDim}}>{me.role}</div></div>
            </div>
            <div style={{fontSize:13,fontWeight:700,marginBottom:12,color:C.textMuted}}>
              {changePinStep==="old"?"رمز عبور فعلی":changePinStep==="new"?"رمز عبور جدید":"تکرار رمز عبور جدید"}
            </div>
            <div style={{marginBottom:16}}>
              {changePinStep==="old" && (
                <input type="password" style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"11px 14px",color:C.text,fontSize:15,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}
                  placeholder="رمز عبور فعلی" value={changePinVal.old}
                  onChange={e=>setChangePinVal(p=>({...p,old:e.target.value}))}/>
              )}
              {changePinStep==="new" && (
                <input type="password" style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"11px 14px",color:C.text,fontSize:15,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}
                  placeholder="رمز عبور جدید" value={changePinVal.new1}
                  onChange={e=>setChangePinVal(p=>({...p,new1:e.target.value}))}/>
              )}
              {changePinStep==="confirm" && (
                <input type="password" style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"11px 14px",color:C.text,fontSize:15,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}
                  placeholder="تکرار رمز عبور جدید" value={changePinVal.new2}
                  onChange={e=>setChangePinVal(p=>({...p,new2:e.target.value}))}/>
              )}
            </div>
            {pinChangeMsg&&<div style={{textAlign:"center",fontSize:13,color:pinChangeMsg.includes("موفق")?C.success:C.danger,marginBottom:12}}>{pinChangeMsg}</div>}
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{setShowChangePIN(false);setChangePinStep("old");setChangePinVal({old:"",new1:"",new2:""});setPinChangeMsg("");}} style={{flex:1,padding:11,borderRadius:10,border:`1px solid ${C.border}`,background:"transparent",color:C.textMuted,cursor:"pointer",fontFamily:"inherit"}}>انصراف</button>
              <button onClick={handleChangePIN} style={{flex:2,padding:11,borderRadius:10,border:"none",background:C.teal,color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                {changePinStep==="confirm"?"ذخیره رمز عبور":"بعدی"}
              </button>
            </div>

          </div>
        </div>
      )}

      {showPayForm&&<NewPaymentForm me={me} onSave={p=>{setPayments(ps=>[p,...ps]);}} onClose={()=>setShowPayForm(false)}/>}


      {/* ── فرم مشتری جدید ── */}
      {showCustForm&&(
        <div style={{position:"fixed",inset:0,background:"#000A",display:"flex",alignItems:"flex-end",zIndex:99}} onClick={()=>setShowCustForm(false)}>
          <div style={{background:C.surface,borderRadius:"20px 20px 0 0",padding:"20px 20px calc(24px + env(safe-area-inset-bottom))",width:"100%",maxWidth:520,margin:"0 auto",maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:36,height:4,background:C.border,borderRadius:2,margin:"0 auto 16px"}}/>
            <div style={{fontSize:15,fontWeight:700,marginBottom:16}}>مشتری جدید</div>
            {[
              ["نام شرکت/مشتری","name","text"],
              ["شهر","city","text"],
              ["مسئول خرید","contact","text"],
              ["تلفن","phone","tel"],
              ["شماره حساب/شبا","account","text"],
            ].map(([lbl,key,type])=>(
              <div key={key} style={{marginBottom:10}}>
                <div style={{fontSize:12,color:C.textMuted,marginBottom:4}}>{lbl}</div>
                <input style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"11px 14px",color:C.text,fontSize:15,outline:"none",direction:key==="account"?"ltr":"rtl",textAlign:key==="account"?"left":"right",boxSizing:"border-box",fontFamily:"inherit"}}
                  value={newCust[key]||""} onChange={e=>setNewCust(p=>({...p,[key]:e.target.value}))} type={type}/>
              </div>
            ))}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              <div>
                <div style={{fontSize:12,color:C.textMuted,marginBottom:4}}>نوع</div>
                <select style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"11px 14px",color:C.text,fontSize:15,outline:"none",direction:"rtl",boxSizing:"border-box",fontFamily:"inherit",WebkitAppearance:"none"}}
                  value={newCust.type} onChange={e=>setNewCust(p=>({...p,type:e.target.value}))}>
                  {["کارخانه","تاجر","توزیع‌کننده","پیمانکار","سایر"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <div style={{fontSize:12,color:C.textMuted,marginBottom:4}}>درجه</div>
                <select style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"11px 14px",color:C.text,fontSize:15,outline:"none",direction:"rtl",boxSizing:"border-box",fontFamily:"inherit",WebkitAppearance:"none"}}
                  value={newCust.grade} onChange={e=>setNewCust(p=>({...p,grade:e.target.value}))}>
                  {["طلایی","نقره‌ای","معمولی"].map(g=><option key={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setShowCustForm(false)} style={{flex:1,padding:"12px",borderRadius:10,border:`1px solid ${C.border}`,background:"transparent",color:C.textMuted,cursor:"pointer",fontFamily:"inherit"}}>انصراف</button>
              <button onClick={()=>{
                if(!newCust.name.trim()) return;
                const nc = {...newCust, id:Date.now(), debt:0, orders:[], notes:[], createdAt:dateShamsi(new Date()), av:newCust.name[0]};
                supa('POST','crm_customers',{name:nc.name,type:nc.type,city:nc.city,phone:nc.phone,contact:nc.contact,grade:nc.grade,account:nc.account,av:nc.av}).catch(()=>{});
                setCustomers(p=>[nc,...p]);
                setNewCust({name:"",type:"کارخانه",city:"",phone:"",contact:"",grade:"معمولی",account:"",av:""});
                setShowCustForm(false);
              }} style={{flex:2,padding:"12px",borderRadius:10,border:"none",background:C.teal,color:"#111",fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:14}}>ذخیره</button>
            </div>
          </div>
        </div>
      )}

      {/* ── فرم سفارش جدید ── */}
      {showOrderForm&&(
        <div style={{position:"fixed",inset:0,background:"#000A",display:"flex",alignItems:"flex-end",zIndex:99}} onClick={()=>setShowOrderForm(false)}>
          <div style={{background:C.surface,borderRadius:"20px 20px 0 0",padding:"20px 20px calc(24px + env(safe-area-inset-bottom))",width:"100%",maxWidth:520,margin:"0 auto",maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:36,height:4,background:C.border,borderRadius:2,margin:"0 auto 16px"}}/>
            <div style={{fontSize:15,fontWeight:700,marginBottom:16}}>سفارش جدید</div>
            <div style={{fontSize:12,color:C.textMuted,marginBottom:4}}>مشتری</div>
            <select style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"11px 14px",color:C.text,fontSize:15,outline:"none",direction:"rtl",boxSizing:"border-box",fontFamily:"inherit",WebkitAppearance:"none",marginBottom:10}}
              value={newCrmOrder.customerId} onChange={e=>setNewCrmOrder(p=>({...p,customerId:Number(e.target.value)}))}>
              <option value="">انتخاب مشتری...</option>
              {customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {[
              ["محصول","product","text","مثلاً: ورق گرم ۳mm"],
              ["مبلغ (تومان)","amount","tel",""],
            ].map(([lbl,key,type,ph])=>(
              <div key={key} style={{marginBottom:10}}>
                <div style={{fontSize:12,color:C.textMuted,marginBottom:4}}>{lbl}</div>
                <input style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"11px 14px",color:C.text,fontSize:15,outline:"none",direction:"rtl",textAlign:"right",boxSizing:"border-box",fontFamily:"inherit"}}
                  placeholder={ph} value={newCrmOrder[key]||""} onChange={e=>setNewCrmOrder(p=>({...p,[key]:e.target.value}))} type={type}/>
              </div>
            ))}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              <div>
                <div style={{fontSize:12,color:C.textMuted,marginBottom:4}}>مقدار</div>
                <input style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"11px 14px",color:C.text,fontSize:15,outline:"none",direction:"rtl",boxSizing:"border-box",fontFamily:"inherit"}}
                  type="tel" placeholder="۰" value={newCrmOrder.qty||""} onChange={e=>setNewCrmOrder(p=>({...p,qty:e.target.value}))}/>
              </div>
              <div>
                <div style={{fontSize:12,color:C.textMuted,marginBottom:4}}>واحد</div>
                <select style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"11px 14px",color:C.text,fontSize:15,outline:"none",direction:"rtl",boxSizing:"border-box",fontFamily:"inherit",WebkitAppearance:"none"}}
                  value={newCrmOrder.unit} onChange={e=>setNewCrmOrder(p=>({...p,unit:e.target.value}))}>
                  {["تن","کیلوگرم","متر","عدد"].map(u=><option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setShowOrderForm(false)} style={{flex:1,padding:"12px",borderRadius:10,border:`1px solid ${C.border}`,background:"transparent",color:C.textMuted,cursor:"pointer",fontFamily:"inherit"}}>انصراف</button>
              <button onClick={()=>{
                if(!newCrmOrder.customerId||!newCrmOrder.product) return;
                const no = {...newCrmOrder, id:Date.now(), status:"ثبت", date:dateShamsi(new Date())};
                setCrmOrders(p=>[no,...p]);
                setNewCrmOrder({customerId:"",product:"",qty:"",unit:"تن",amount:"",status:"ثبت",desc:""});
                setShowOrderForm(false);
              }} style={{flex:2,padding:"12px",borderRadius:10,border:"none",background:C.teal,color:"#111",fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:14}}>ثبت سفارش</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDlg cfg={confirm} onClose={()=>setConfirm(null)}/>
    </div>
  );
}