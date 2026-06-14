// ─── Requests Module ───
// تست شده - بدون ضرورت تغییر ندهید

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

