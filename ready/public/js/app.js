const h=(t,a={},...k)=>{const e=document.createElement(t);for(const[x,v]of Object.entries(a))x.startsWith('on')?e.addEventListener(x.slice(2),v):x==='class'?e.className=v:e.setAttribute(x,v);e.append(...k.flat().filter(v=>v!=null&&v!==false));return e};
let me,tab='home',sub='offers';const when=t=>new Date(t).toLocaleString('ar-SA');
const toast=m=>{const e=h('div',{class:'toast'},m);document.body.append(e);setTimeout(()=>e.remove(),2500)};
const st=s=>h('span',{class:'pill '+s},s==='open'?'مفتوحة':'مغلقة');
async function init(){me=await API.me();me?shell():login()}
function login(){document.body.replaceChildren(h('div',{class:'login'},
 h('div',{class:'lside'},h('div',{class:'orbit'},h('i',{class:'ring r1'}),h('i',{class:'ring r2'}),h('i',{class:'ring r3'}),h('img',{src:'assets/logo.png',class:'core'}))),
 h('div',{class:'lbox'},h('img',{src:'assets/logo.png',width:60}),h('h1',{},'هلا فيك في ',h('b',{},'أوربت')),
 h('p',{},'لازم تربط حسابك بالديسكورد أول ما تدخل. بعد الربط تشوف العروض وتذاكرك ومحادثاتها كلها بمكان واحد.'),
 h('button',{class:'btn big',onclick:API.login},'ربط الحساب بالديسكورد'),h('p',{class:'m'},'دخول آمن عن طريق ديسكورد'))))}
function shell(){const nav=h('nav');const tabs=[['home','الرئيسية'],['tickets','تذاكري'],...(me.admin?[['admin','لوحة الإدارة']]:[])];
 tabs.forEach(([k,l])=>nav.append(h('a',{class:tab===k?'on':'',onclick:()=>{tab=k;shell()}},l)));
 const main=h('main');document.body.replaceChildren(h('header',{},h('div',{class:'logo'},h('img',{src:'assets/logo.png'}),'أوربت'),nav,
 h('div',{class:'me'},h('img',{src:me.avatar||'assets/logo.png'}),me.name,h('button',{class:'btn ghost',onclick:API.logout},'خروج'))),main);
 ({home,tickets,admin})[tab](main)}
async function home(m){const[o,t]=await Promise.all([API.offers(),API.tickets()]);
 m.append(h('div',{class:'hero'},h('img',{src:me.avatar||'assets/logo.png'}),h('div',{},h('h2',{},'أهلاً '+me.name),h('small',{},'حسابك مربوط بنجاح'),h('br'),h('span',{class:'tag'},me.admin?'إدارة':'عضو'))),
 h('div',{class:'grid'},h('div',{class:'card stat'},h('span',{},'تذاكري'),h('b',{},t.length)),h('div',{class:'card stat'},h('span',{},'المفتوحة'),h('b',{},t.filter(x=>x.status==='open').length)),h('div',{class:'card stat'},h('span',{},'العروض المتاحة'),h('b',{},o.length))),
 h('h2',{class:'t'},'عروض أوربت'),o.length?h('div',{class:'grid'},o.map(x=>h('div',{class:'card offer'},h('h3',{},x.title),h('div',{class:'m'},x.desc),h('div',{class:'price'},x.price),x.code&&h('span',{class:'code'},'كود: '+x.code)))):h('div',{class:'empty'},'لا توجد عروض حالياً'))}
function chat(t){const box=h('div',{class:'chat'},t.messages.length?t.messages.map(x=>h('div',{class:'msg'},h('img',{src:x.av||'assets/logo.png'}),h('div',{},h('b',{},x.a),x.bot&&h('span',{class:'bot'},'BOT'),h('time',{},when(x.t)),h('p',{},x.c)))):h('div',{class:'empty'},'لا توجد رسائل'));
 const md=h('div',{class:'modal',onclick:e=>e.target===md&&md.remove()},h('div',{class:'mbox'},h('div',{class:'mh'},h('b',{},`المحادثة — تذكرة #${t.id} (${t.type})`),h('button',{class:'btn ghost',onclick:()=>md.remove()},'✕')),box));document.body.append(md)}
const tbl=(rows,adm)=>rows.length?h('table',{},h('thead',{},h('tr',{},['#','النوع',adm&&'العضو','الحالة','الفتح',''].map(x=>h('th',{},x)))),h('tbody',{},rows.map(t=>h('tr',{},h('td',{},'#'+t.id),h('td',{},t.type),adm&&h('td',{},t.userName),h('td',{},st(t.status)),h('td',{},when(t.createdAt)),h('td',{},h('button',{class:'btn ghost',onclick:async()=>chat(await API.ticket(t.id))},'المحادثة')))))):h('div',{class:'empty'},'لا توجد تذاكر. افتح تذكرة من سيرفر الديسكورد وتظهر هنا.');
async function tickets(m){m.append(h('h2',{class:'t'},'تذاكري'),tbl(await API.tickets()))}
async function admin(m){const s=h('div',{class:'sub'});[['offers','العروض'],['buttons','أزرار التذاكر'],['panel','إرسال البانل'],['all','كل التذاكر']].forEach(([k,l])=>s.append(h('a',{class:sub===k?'on':'',onclick:()=>{sub=k;shell()}},l)));
 const b=h('div');m.append(s,b);await({offers:aOffers,buttons:aButtons,panel:aPanel,all:async b=>b.append(tbl(await API.adminTickets(),1))})[sub](b)}
const fld=(l,i)=>h('label',{},l,i);
async function aOffers(b){const f={};const inp=(k,l)=>fld(l,f[k]=h('input'));
 b.append(h('div',{class:'card form'},inp('title','عنوان العرض'),inp('desc','الوصف'),inp('price','السعر / الخصم'),inp('code','كود (اختياري)'),h('button',{class:'btn',onclick:async()=>{await API.addOffer(Object.fromEntries(Object.entries(f).map(([k,v])=>[k,v.value])));toast('تم نشر العرض');shell()}},'نشر العرض')));
 const o=await API.offers();b.append(h('div',{class:'grid'},o.map(x=>h('div',{class:'card offer'},h('h3',{},x.title),h('div',{class:'m'},x.desc),h('div',{class:'price'},x.price),h('button',{class:'btn red',onclick:async()=>{await API.delOffer(x.id);shell()}},'حذف')))))}
async function aButtons(b){let L=await API.buttons();const draw=()=>{b.replaceChildren(...L.map((x,i)=>{const f=(k,l)=>fld(l,h('input',{value:x[k]||'',oninput:e=>x[k]=e.target.value}));
  const sl=h('select',{onchange:e=>x.style=+e.target.value},[[1,'أزرق'],[2,'رمادي'],[3,'أخضر'],[4,'أحمر']].map(([v,n])=>h('option',{value:v,...(x.style==v?{selected:1}:{})},n)));
  return h('div',{class:'card form'},f('label','اسم الزر'),f('emoji','إيموجي'),fld('اللون',sl),f('welcome','رسالة الترحيب داخل التذكرة'),h('button',{class:'btn red',onclick:()=>{L.splice(i,1);draw()}},'حذف'))}),
  h('button',{class:'btn ghost',onclick:()=>{L.push({id:'b'+Date.now(),label:'زر جديد',emoji:'🎫',style:1,welcome:''});draw()}},'+ إضافة زر'),' ',h('button',{class:'btn',onclick:async()=>{await API.saveButtons(L);toast('تم الحفظ — أعد إرسال البانل ليظهر')}},'حفظ الأزرار'))};draw()}
async function aPanel(b){const f={};const i=(k,l,v)=>fld(l,f[k]=h('input',{value:v||''}));
 b.append(h('div',{class:'card form'},i('channelId','آيدي الروم'),i('title','عنوان البانل','مركز الدعم — أوربت'),i('desc','الوصف','اختر نوع التذكرة من الأزرار بالأسفل.'),h('button',{class:'btn',onclick:async()=>{await API.sendPanel(Object.fromEntries(Object.entries(f).map(([k,v])=>[k,v.value])));toast('تم إرسال البانل')}},'إرسال البانل')))}
init();
