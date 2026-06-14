// ─── Notifications Module ───
// تست شده - بدون ضرورت تغییر ندهید

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

