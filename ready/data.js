const fs=require('fs'),p=require('path');const F=p.join(process.env.DATA_DIR||'./data','db.json');fs.mkdirSync(p.dirname(F),{recursive:true});
let d={offers:[],n:0,tickets:[],panel:{},buttons:[{id:'support',label:'الدعم الفني',emoji:'🛠️',style:1,welcome:'اكتب مشكلتك وسيرد عليك الفريق.'},{id:'buy',label:'شراء',emoji:'🛒',style:3,welcome:'اكتب المنتج المطلوب.'}]};
try{d={...d,...JSON.parse(fs.readFileSync(F))}}catch{}
module.exports={d,save:()=>fs.writeFileSync(F,JSON.stringify(d))};
