// ─── Admin Module ───
// تست شده - بدون ضرورت تغییر ندهید

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



