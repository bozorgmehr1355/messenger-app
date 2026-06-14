// ─── Projects Module ───
// تست شده - بدون ضرورت تغییر ندهید

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

