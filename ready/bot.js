const {Client,GatewayIntentBits:G,ActionRowBuilder:R,ButtonBuilder:B,EmbedBuilder:Em,ChannelType:C,PermissionFlagsBits:P}=require('discord.js');
const {d,save}=require('./data');const E=process.env;
const c=new Client({intents:[G.Guilds,G.GuildMembers,G.GuildMessages,G.MessageContent]});
const isAdmin=async id=>{try{const m=await(await c.guilds.fetch(E.GUILD_ID)).members.fetch(id);return m.roles.cache.has(E.ADMIN_ROLE_ID)}catch{return false}};
const rows=()=>{const r=[];for(let i=0;i<d.buttons.length;i+=5)r.push(new R().addComponents(d.buttons.slice(i,i+5).map(b=>new B().setCustomId('t:open:'+b.id).setLabel(b.label).setEmoji(b.emoji||'🎫').setStyle(b.style||1))));return r.slice(0,5)};
async function sendPanel(chId,title,desc){const ch=await c.channels.fetch(chId);return ch.send({embeds:[new Em().setColor(0xff7a1a).setTitle(title||'مركز الدعم — أوربت').setDescription(desc||'اختر نوع التذكرة من الأزرار بالأسفل.').setThumbnail(c.user.displayAvatarURL())],components:rows()})}
async function closeTicket(t,ch){t.status='closed';t.closedAt=Date.now();save();try{await ch.send('🔒 تم إغلاق التذكرة، المحادثة محفوظة في موقع أوربت. سيُحذف الروم بعد 5 ثوانٍ.');setTimeout(()=>ch.delete().catch(()=>{}),5000)}catch{}}
c.on('interactionCreate',async i=>{if(!i.isButton())return;const[,a,x]=i.customId.split(':');
 if(a==='open'){const b=d.buttons.find(q=>q.id===x);if(!b)return i.reply({content:'الزر غير موجود',ephemeral:true});
  if(d.tickets.find(t=>t.userId===i.user.id&&t.status==='open'))return i.reply({content:'عندك تذكرة مفتوحة بالفعل',ephemeral:true});
  await i.deferReply({ephemeral:true});const n=++d.n;
  const ch=await i.guild.channels.create({name:'ticket-'+n,type:C.GuildText,parent:E.TICKET_CATEGORY_ID||null,permissionOverwrites:[{id:i.guild.id,deny:[P.ViewChannel]},{id:i.user.id,allow:[P.ViewChannel,P.SendMessages,P.AttachFiles]},{id:E.ADMIN_ROLE_ID,allow:[P.ViewChannel,P.SendMessages]}]});
  d.tickets.push({id:n,userId:i.user.id,userName:i.user.globalName||i.user.username,channelId:ch.id,type:b.label,status:'open',createdAt:Date.now(),messages:[]});save();
  await ch.send({content:`<@${i.user.id}> <@&${E.ADMIN_ROLE_ID}>`,embeds:[new Em().setColor(0xff7a1a).setTitle(`تذكرة #${n} — ${b.label}`).setDescription(b.welcome||'تفضل اشرح طلبك.')],components:[new R().addComponents(new B().setCustomId('t:close').setLabel('إغلاق التذكرة').setEmoji('🔒').setStyle(4))]});
  i.editReply('تم فتح تذكرتك: '+ch.toString()+' — تقدر تشوفها بالموقع من «تذاكري»')}
 if(a==='close'){const t=d.tickets.find(q=>q.channelId===i.channelId&&q.status==='open');if(!t)return;
  if(i.user.id!==t.userId&&!await isAdmin(i.user.id))return i.reply({content:'ما عندك صلاحية',ephemeral:true});await i.deferUpdate();closeTicket(t,i.channel)}});
c.on('messageCreate',async m=>{
 if(m.content==='!panel'&&m.guild&&await isAdmin(m.author.id)){await sendPanel(m.channelId);return m.delete().catch(()=>{})}
 const t=d.tickets.find(q=>q.channelId===m.channelId&&q.status==='open');if(!t)return;
 t.messages.push({a:m.member?.displayName||m.author.username,av:m.author.displayAvatarURL({size:64}),bot:m.author.bot,c:m.content||(m.attachments.size?'[مرفق] '+m.attachments.first().url:'[رسالة مضمّنة]'),t:Date.now()});save()});
c.once('ready',()=>console.log('Bot ready:',c.user.tag));c.login(E.BOT_TOKEN);
module.exports={isAdmin,sendPanel,closeTicket,c};
