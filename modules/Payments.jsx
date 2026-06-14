// ─── Payments Module ───
// تست شده - بدون ضرورت تغییر ندهید

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

