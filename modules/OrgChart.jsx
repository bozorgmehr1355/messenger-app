// ─── OrgChart Module ───
// تست شده - بدون ضرورت تغییر ندهید

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


