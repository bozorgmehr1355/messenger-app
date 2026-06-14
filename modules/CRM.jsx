// ─── CRM Module ───
// تست شده - بدون ضرورت تغییر ندهید

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

