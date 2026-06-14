// ─── Letters Module ───
// تست شده - بدون ضرورت تغییر ندهید

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


