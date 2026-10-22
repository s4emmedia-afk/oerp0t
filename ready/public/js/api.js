const j=async(u,o)=>{const r=await fetch(u,o&&{method:o.m,headers:{'Content-Type':'application/json'},body:JSON.stringify(o.b)});return r.ok?r.json():null};
const API={me:()=>j('/api/me'),offers:()=>j('/api/offers'),tickets:()=>j('/api/tickets'),ticket:i=>j('/api/tickets/'+i),adminTickets:()=>j('/api/admin/tickets'),
addOffer:b=>j('/api/admin/offers',{m:'POST',b}),delOffer:i=>j('/api/admin/offers/'+i,{m:'DELETE'}),buttons:()=>j('/api/admin/buttons'),saveButtons:b=>j('/api/admin/buttons',{m:'POST',b}),
sendPanel:b=>j('/api/admin/panel',{m:'POST',b}),login:()=>location.href='/auth/login',logout:()=>location.href='/auth/logout'};
