
(function(){
'use strict';
var DEMO_PASS='Essi@2026', RESET_CODE='123456';
var $=function(id){return document.getElementById(id)};
var MEM={};
function lsGet(k,d){try{var v=localStorage.getItem(k);if(v)return JSON.parse(v)}catch(e){}return (k in MEM)?JSON.parse(MEM[k]):d}
function lsSet(k,v){var j=JSON.stringify(v);MEM[k]=j;try{localStorage.setItem(k,j)}catch(e){}}
function lsDel(k){delete MEM[k];try{localStorage.removeItem(k)}catch(e){}}
// demo-grade hash (client-side only; a real portal verifies on the server)
function H(s){s='essi|'+s;var h1=0xdeadbeef,h2=0x41c6ce57;for(var i=0,c;i<s.length;i++){c=s.charCodeAt(i);h1=Math.imul(h1^c,2654435761);h2=Math.imul(h2^c,1597334677)}
h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);return (4294967296*(2097151&h2)+(h1>>>0)).toString(36)}

var DIRS={'Karachi Central':'City Directorate','Karachi East':'SITE East Directorate','Karachi South':'City Directorate','Karachi West':'SITE West Directorate','Korangi':'Landhi Directorate','Malir':'Landhi Directorate','Keamari':'SITE West Directorate'};

var SEEDS=[
 {id:'seedp1',status:'pending',appNo:'REG-2026-10001',submitted:'18 Nov 2026 10:20',employerNo:'',variant:'data',ph:H(DEMO_PASS),cnic:'42301-7788991-3',mobile:'0345-7788991',email:'office@karachisteel.example',dir:'SITE West Directorate',
  co:{employer:'Karachi Steel Works',btype:'Private Limited Company',secp:'0789012',ntn:'3344556-7',srb:'SRB-000912',addr:'Plot 9, SITE Area, Karachi',province:'Sindh',district:'Karachi West',gps:'24.9056Â° N, 66.9889Â° E',person:'Omar Farooq',desig:'Director',mobile:'0345-7788991',email:'office@karachisteel.example',phone:'021-32550000'},docs:10,workers:'120'},
 {id:'abc',employerNo:'3-61-0001',variant:'data',ph:H(DEMO_PASS),cnic:'42101-9876543-1',mobile:'0300-1234567',email:'accounts@abcmanufacturing.example',dir:'Landhi Directorate',
  co:{employer:'ABC Manufacturing',btype:'Private Limited Company',secp:'0123456',ntn:'1234567-8',srb:'SRB-000123',addr:'Plot 25, Sector 12-B, Landhi Industrial Area, Karachi',province:'Sindh',district:'Karachi',gps:'24.8441Â° N, 67.2038Â° E',person:'Ali Hassan',desig:'Accounts Manager',mobile:'0300-1234567',email:'accounts@abcmanufacturing.example',phone:'021-35000000'}},
 {id:'sunrise',employerNo:'3-61-0002',variant:'empty',ph:H(DEMO_PASS),cnic:'42201-5551234-5',mobile:'0321-5551234',email:'info@sunrisetraders.example',dir:'City Directorate',
  co:{employer:'Sunrise Traders',btype:'Sole Proprietorship',secp:'0456789',ntn:'7654321-0',srb:'SRB-000456',addr:'Shop 4, Saddar Commercial Area, Karachi',province:'Sindh',district:'Karachi South',gps:'24.8607Â° N, 67.0011Â° E',person:'Sara Khan',desig:'Owner',mobile:'0321-5551234',email:'info@sunrisetraders.example',phone:'021-32000000'}}
];
function stat(a){return a.status||'approved'}
/* ---------- application tracking ---------- */
var STAGES=[['Application submitted','We received your application and uploaded documents.'],['Documents verification','ESSI officers check your SECP, NTN, SRB and CNIC documents.'],['Directorate review / inspection','Your area directorate reviews the establishment details.'],['Final approval','Your Employer No. is issued and you can log in.']];
var EVL={submitted:'Application submitted',docs:'Documents verified',inspect:'Directorate review completed',final:'Approved',rejected:'Rejected'};
function stageDone(a){ var s=a.status||'approved'; if(s==='approved') return 4; return Math.max(1,Math.min(3,a.stage||1)) }
function trackOf(a){
  if(a.track&&a.track.length) return a.track;
  var t=[{s:'submitted',t:a.submitted||'',n:'Application '+a.appNo+' received.'}];
  var s=a.status||'approved';
  if(s==='approved') t.push({s:'final',t:a.approved||'',n:'Approved. Employer No. '+(a.employerNo||'')+' assigned.'});
  if(s==='rejected') t.push({s:'rejected',t:a.rejectedAt||'',n:a.reason||''});
  return t;
}
function addTrack(a,s,n){ a.track=trackOf(a).slice(); a.track.push({s:s,t:nowStr(),n:n||''}) }
function trackHTML(a){
  var st=a.status||'approved', done=stageDone(a), rej=st==='rejected', ev=trackOf(a), last=ev[ev.length-1];
  var steps=STAGES.map(function(g,i){
    var cls=i<done?'done':(i===done?(rej?'bad':'cur'):''), tag=i<done?'Completed':(i===done?(rej?'Stopped here':'In progress'):'Waiting');
    return '<li class="tl-i '+cls+'"><span class="tl-dot">'+(i<done?'\u2713':(rej&&i===done?'!':(i+1)))+'</span><div><span class="tl-t">'+esc(g[0])+'</span><span class="tl-tag">'+tag+'</span><div class="tl-d">'+esc(g[1])+'</div></div></li>';
  }).join('');
  var log=ev.slice().reverse().map(function(e){return '<div class="tl-ev"><b>'+esc(EVL[e.s]||e.s)+'</b> \u2014 '+esc(e.t)+(e.n?'<small>'+esc(e.n)+'</small>':'')+'</div>'}).join('');
  return '<ol class="tl">'+steps+'</ol><div class="tl-log"><h4>Activity log <span style="font-weight:400;color:#5b6b60">(last updated '+esc(last.t||'-')+')</span></h4>'+log+'</div>';
}
function nowStr(){return new Date().toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}
function accounts(){
  var list=lsGet('essi:accounts',[]);
  SEEDS.forEach(function(s){ if(!list.some(function(a){return a.id===s.id})) list.push(s); });
  lsSet('essi:accounts',list); return list;
}
function saveAccounts(l){lsSet('essi:accounts',l)}
function digits(s){return String(s||'').replace(/\D/g,'')}
function findAcc(idv){
  idv=String(idv||'').trim().toLowerCase(); if(!idv) return null; var d=digits(idv);
  return accounts().filter(function(a){
    return (a.employerNo&&a.employerNo.toLowerCase()===idv) || String(a.email).toLowerCase()===idv ||
      (d.length===13 && digits(a.cnic)===d) || (d.length>=10 && d.length<=11 && digits(a.mobile)===d);
  })[0]||null;
}
function session(){return lsGet('essi:session',null)}
function sessAcc(){var s=session(); if(!s) return null; return accounts().filter(function(a){return a.id===s.id})[0]||null}

/* ---------- views ---------- */
var VIEWS=['login','register','welcome','dash','inbox','admin'], cur=null, timer=null;
function show(name){
  VIEWS.forEach(function(v){ $('v-'+v).classList.toggle('on',v===name) });
  if(name!=='register') $('v-register').innerHTML='';
  if(name!=='dash') $('v-dash').innerHTML='';
  if(timer&&name!=='welcome'){clearInterval(timer);timer=null}
  window.scrollTo(0,0); cur=name;
}
function mount(id,html){
  var f=document.createElement('iframe'); f.className='app'; f.setAttribute('title',id==='v-dash'?'Employer dashboard':'Employer registration');
  $(id).innerHTML=''; $(id).appendChild(f); f.srcdoc=html; return f;
}
function route(){
  var h=(memRoute!==null?memRoute:(location.hash||'#/')).replace(/^#\/?/,'').split('?')[0]||'';
  var acc=sessAcc();
  if(h==='dashboard'){ if(!acc){ go('login'); return; } openDash(acc); return; }
  if(h==='welcome'){ openWelcome(); return; }
  if(h==='inbox'){ openInbox(); return; }
  if(h==='admin'){ openAdmin(); return; }
  if(h==='register'){ openReg(); return; }
  if(h==='login'||h===''){ if(acc&&h===''){ go('dashboard'); return; } openLogin(); return; }
  go('login');
}
/* Some viewers/previews (sandboxed frames) silently block URL-hash changes, so the app
   also keeps its current view in memory and routes directly when the hash cannot change. */
var memRoute=null;
function go(p){
  var t='#/'+p;
  if(location.hash===t){ memRoute=null; route(); return }
  memRoute=null; try{ location.hash=t }catch(e){}
  if(location.hash!==t){ memRoute=t; route() }
}
window.addEventListener('hashchange',function(){ memRoute=null; route() });
document.addEventListener('click',function(e){
  var a=e.target&&e.target.closest?e.target.closest('a[href^="#/"]'):null;
  if(!a||e.defaultPrevented||e.button>0||e.ctrlKey||e.metaKey||e.shiftKey) return;
  e.preventDefault(); go(a.getAttribute('href').slice(2));
});

/* ---------- dashboard assembly ---------- */
function clean(s){return String(s==null?'':s).replace(/[<>&"'\\{}$`]/g,'').trim()}
function jsonInner(s){return JSON.stringify(s).slice(1,-1).replace(/</g,'\\u003c')}
function dashHTML(acc){
  var co={}; Object.keys(acc.co).forEach(function(k){co[k]=clean(acc.co[k])});
  var h=BUNDLES[acc.variant==='empty'?'empty':'data'];
  function sub(a,b){h=h.split(a).join(jsonInner(b))}
  sub('__CO_BASE__',JSON.stringify(co));
  sub('__CO_NAME__',co.employer); sub('__EMPNO__',acc.employerNo); sub('__PERSON__',co.person||'Employer');
  sub('__DIR__',clean(acc.dir)||'City Directorate'); sub('__ACC__',String(acc.id).replace(/[^a-z0-9]/gi,''));
  return h;
}
function openDash(acc){ show('dash'); var fr=mount('v-dash',dashHTML(acc)); watch(fr); document.title='Dashboard â€“ '+acc.co.employer+' | ESSI Sindh'; }
function watch(fr){
  var t0=Date.now(), iv=setInterval(function(){
    if(!fr.isConnected){clearInterval(iv);return}
    var ok=false; try{ok=fr.contentDocument.body&&fr.contentDocument.body.innerText.length>50}catch(e){ok=true}
    if(ok){clearInterval(iv);return}
    if(Date.now()-t0>8000){clearInterval(iv);
      var d=document.createElement('div');d.style.cssText='position:fixed;left:16px;right:16px;top:16px;z-index:200;background:#fdecea;border:1px solid #f3b9b3;color:#b00020;border-radius:8px;padding:14px;font-size:15px';
      d.innerHTML='The dashboard did not load in this viewer. Please save the file and open it directly in Chrome, Edge or Firefox. <button style="margin-left:8px" onclick="location.reload()">Retry</button>';document.body.appendChild(d)}
  },500);
}
function openReg(){ show('register'); mount('v-register',BUNDLES.reg); document.title='Employer Registration | ESSI Sindh'; }
function openWelcome(){
  var id=lsGet('essi:lastapp',null), a=id&&accounts().filter(function(x){return x.id===id})[0];
  if(!a){ go('login'); return }
  show('welcome'); document.title='Application submitted | ESSI Sindh';
  $('w-name').textContent=a.co.employer; $('w-app').textContent=a.appNo; $('w-time').textContent=a.submitted;
  drawWelcome();
}
function drawWelcome(){
  var id=lsGet('essi:lastapp',null), a=id&&accounts().filter(function(x){return x.id===id})[0]; if(!a) return;
  var s=stat(a), m={pending:['Pending approval','#fff4d6','#8a5200','Application submitted \u2014 waiting for approval'],approved:['Approved','#dff3e5','#0b4d24','Application approved'],rejected:['Rejected','#fdecea','#b00020','Application not approved']}[s];
  var el=$('w-status'); el.textContent=m[0]; el.style.background=m[1]; el.style.color=m[2];
  $('w-h1').textContent=m[3];
  $('w-emp').textContent=s==='approved'?a.employerNo:(s==='rejected'?'Not assigned':'Assigned after approval');
  var h=trackHTML(a); if($('w-track').getAttribute('data-h')!==h){ $('w-track').innerHTML=h; $('w-track').setAttribute('data-h',h) }
}
setInterval(function(){ if($('v-welcome').classList.contains('on')) drawWelcome() },3000);

/* ---------- messages from embedded apps ---------- */
window.addEventListener('message',function(e){
  var d=e.data; if(!d||typeof d!=='object'||!d.essi) return;
  var fr=document.querySelector('iframe.app'); if(!fr||e.source!==fr.contentWindow) return;
  if(d.essi==='nav'){ go(d.to) }
  else if(d.essi==='logout'){ logout() }
  else if(d.essi==='registered'){ register(d.f||{}) }
});
function logout(){ lsDel('essi:session'); flash='You have been logged out successfully.'; go('login') }

function register(f){
  var list=accounts(), cd=digits(f.ac), dist=f.dist||'Karachi';
  var appNo='REG-2026-'+String(10000+list.filter(function(a){return a.appNo}).length+1+Math.floor(Math.random()*80000));
  var acc={id:'r'+cd, status:'pending', stage:1, track:[{s:'submitted',t:nowStr(),n:'Application '+appNo+' received.'}], appNo:appNo, submitted:nowStr(), employerNo:'', variant:'data', ph:H(f.ap||''),
    cnic:cd.slice(0,5)+'-'+cd.slice(5,12)+'-'+cd.slice(12), mobile:f.am||'', email:String(f.ae||'').trim(), dir:DIRS[dist]||'City Directorate', workers:f.wk||'', docs:10,
    co:{employer:f.en||'My Company',btype:f.bt||'',secp:f.secp||'',ntn:f.ntn||'',srb:f.srb||'',addr:f.ba||'',province:'Sindh',district:dist,gps:f.gps||'',person:f.pn||f.an||'',desig:f.pd||'',mobile:f.pm||f.am||'',email:f.pe||f.ae||'',phone:f.ph||''}};
  list=list.filter(function(a){return a.id!==acc.id}); list.push(acc); saveAccounts(list);
  lsDel('essi:session'); lsSet('essi:lastapp',acc.id);
  sendMsg(acc,'Application received','ESSI Sindh: Dear '+(f.an||'applicant')+', your employer registration for '+acc.co.employer+' was received. Application No. '+appNo+'. You will be notified after verification.');
  go('welcome');
}

/* ---------- demo outbox (stands in for real SMS / email) ---------- */
function sendMsg(acc,subject,body){
  var ob=lsGet('essi:outbox',[]);
  ob.unshift({t:nowStr(),mobile:acc.mobile,email:acc.email,subject:subject,body:body});
  lsSet('essi:outbox',ob);
}
function esc(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function openInbox(){
  show('inbox'); document.title='Demo inbox | ESSI Sindh';
  function draw(){
    var q=$('in-q').value.trim().toLowerCase(), qd=digits(q);
    var l=lsGet('essi:outbox',[]).filter(function(m){return !q||String(m.email).toLowerCase()===q||(qd.length>=10&&digits(m.mobile)===qd)});
    $('in-list').innerHTML=l.length?l.map(function(m){return '<div class="panel" style="margin-top:14px"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;font-size:13px;color:#4d6654"><span>To: <b>'+esc(m.mobile)+'</b> (SMS) Â· <b>'+esc(m.email)+'</b> (email)</span><span>'+esc(m.t)+'</span></div><h3 style="margin:8px 0 4px">'+esc(m.subject)+'</h3><div style="font-size:15px;line-height:1.5">'+esc(m.body)+'</div></div>'}).join(''):'<p style="color:#4d6654">No messages yet.</p>';
  }
  $('in-q').oninput=draw; draw();
}

/* ---------- admin ---------- */
var adTab='pending';
function adminOn(){return !!lsGet('essi:admin',null)}
function openAdmin(){
  show('admin'); document.title='Admin Panel | ESSI Sindh'; adErr('');
  var on=adminOn(); $('ad-login').style.display=on?'none':''; $('ad-panel').style.display=on?'':'none';
  $('ad-out').style.display=on?'':'none'; $('ad-back').style.display=on?'none':''; $('ad-who').textContent=on?'Signed in as admin':'';
  if(on) drawAdmin();
}
function adErr(m){var e=$('ad-err');e.textContent=m||'';e.classList.toggle('on',!!m)}
$('ad-form').addEventListener('submit',function(e){e.preventDefault();
  if($('ad-u').value.trim().toLowerCase()==='admin'&&$('ad-p').value==='Admin@2026'){lsSet('essi:admin',{t:Date.now()});$('ad-p').value='';openAdmin()}
  else adErr('Wrong admin ID or password.')});
$('ad-go').addEventListener('click',function(e){e.preventDefault();fireSubmit($('ad-form'))});
$('ad-form').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();fireSubmit($('ad-form'))}});
$('ad-out').onclick=function(e){e.preventDefault();lsDel('essi:admin');openAdmin()};
function nextEmpNo(){
  var max=0; accounts().forEach(function(a){var m=/^3-61-(\d+)$/.exec(a.employerNo||''); if(m) max=Math.max(max,+m[1])});
  return '3-61-'+String(max+1).padStart(4,'0');
}
function drawAdmin(){
  var all=accounts().filter(function(a){return a.appNo}), cnt={pending:0,approved:0,rejected:0};
  all.forEach(function(a){cnt[stat(a)]++});
  $('ad-next').textContent=nextEmpNo();
  $('ad-tabs').innerHTML=['pending','approved','rejected'].map(function(k){return '<button class="btn '+(k===adTab?'':'ghost')+'" data-tab="'+k+'" style="min-height:40px">'+k.charAt(0).toUpperCase()+k.slice(1)+' ('+cnt[k]+')</button>'}).join('');
  [].forEach.call($('ad-tabs').querySelectorAll('button'),function(b){b.onclick=function(){adTab=b.getAttribute('data-tab');drawAdmin()}});
  var rows=all.filter(function(a){return stat(a)===adTab});
  var th='padding:10px;border:1px solid #cfe4d5;text-align:left;', hd='<tr style="background:#e8f2ec">'+['Application No.','Company','Applicant','CNIC','Submitted',adTab==='pending'?'Action':'Employer No.'].map(function(x){return '<th style="'+th+'">'+x+'</th>'}).join('')+'</tr>';
  $('ad-tbl').innerHTML=hd+(rows.length?rows.map(function(a){return '<tr>'+[a.appNo,a.co.employer,a.co.person,a.cnic,a.submitted].map(function(x){return '<td style="'+th+'">'+esc(x)+'</td>'}).join('')+'<td style="'+th+'">'+(adTab==='pending'?'<button class="btn" data-rv="'+a.id+'" style="min-height:38px;padding:0 16px">Review</button><br><small>Step '+(stageDone(a)+1)+' of 4: '+esc(STAGES[stageDone(a)][0])+'</small>':esc(a.employerNo||'â€”')+(adTab==='rejected'?'<br><small>'+esc(a.reason||'')+'</small>':''))+'</td></tr>'}).join(''):'<tr><td colspan="6" style="'+th+'color:#4d6654;padding:18px">No '+adTab+' applications.</td></tr>');
  [].forEach.call($('ad-tbl').querySelectorAll('[data-rv]'),function(b){b.onclick=function(){openReview(b.getAttribute('data-rv'))}});
}
var rvId=null;
function openReview(id){
  var a=accounts().filter(function(x){return x.id===id})[0]; if(!a) return; rvId=id;
  var c=a.co, rows=[['Application No.',a.appNo],['Submitted',a.submitted],['Company',c.employer],['Business type',c.btype],['Address',c.addr+', '+c.district],['SECP / NTN / SRB',c.secp+' / '+c.ntn+' / '+c.srb],['Applicant',c.person+' ('+c.desig+')'],['CNIC',a.cnic],['Mobile / Email',a.mobile+' / '+a.email],['Expected workers',a.workers||'-'],['Documents',(a.docs||10)+' uploaded'],['Directorate',a.dir]];
  $('rv-body').innerHTML='<div class="kv" style="grid-template-columns:150px 1fr;max-width:none;margin:12px 0 0">'+rows.map(function(r){return '<div>'+esc(r[0])+'</div><div>'+esc(r[1])+'</div>'}).join('')+'</div>';
  var ctl='';
  if(stat(a)==='pending'){
    var dn=stageDone(a);
    ctl='<div style="margin-top:14px;padding:12px;border:1px solid #cfe4d5;border-radius:10px;background:#f6fbf8"><b style="font-size:14px">Post a progress update</b><div class="f" style="margin-top:8px"><select class="inp" id="rv-stage"><option value="2"'+(dn<2?' selected':'')+'>Documents verified</option><option value="3"'+(dn>=2?' selected':'')+'>Directorate review / inspection completed</option></select></div><div class="f"><input class="inp" id="rv-note" placeholder="Note for the applicant (optional)"></div><button class="btn ghost" id="rv-post" type="button" style="min-height:40px">Post update &amp; notify applicant</button></div>';
  }
  $('rv-body').innerHTML+=ctl+'<h3 style="font-size:15px;margin:16px 0 0;color:#10331d">Application progress</h3>'+trackHTML(a);
  if($('rv-post')) $('rv-post').onclick=function(){
    var l=accounts(), x=l.filter(function(y){return y.id===rvId})[0]; if(!x) return;
    var v=+$('rv-stage').value, note=$('rv-note').value.trim();
    x.stage=Math.max(x.stage||1,v); addTrack(x,v===2?'docs':'inspect',note||(v===2?'Your documents have been verified.':'Directorate review has been completed.')); saveAccounts(l);
    sendMsg(x,'Application update','ESSI Sindh: Application '+x.appNo+' \u2014 '+STAGES[v-1][0]+' completed.'+(note?' '+note+'.':'')+' You can track your application any time from the login page.');
    openReview(rvId); drawAdmin();
    var ok=$('ad-ok'); ok.textContent='Update posted for '+x.co.employer+'. The applicant was notified by SMS and email (see Demo SMS / email inbox).'; ok.classList.add('on');
  };
  $('rv-rej').style.display='none'; $('rv-err').classList.remove('on'); $('rv-reason').value='';
  $('rv-btns').innerHTML='<button class="btn ghost" id="rv-close">Close</button><button class="btn" id="rv-rejbtn" style="background:#b00020">Reject</button><button class="btn" id="rv-ok">Approve &amp; assign Employer No.</button>';
  $('rv-close').onclick=function(){$('rv').classList.remove('on')};
  $('rv-ok').onclick=approve; $('rv-rejbtn').onclick=reject; $('rv').classList.add('on');
}
function approve(){
  var l=accounts(), a=l.filter(function(x){return x.id===rvId})[0], no=nextEmpNo();
  addTrack(a,'final','Approved. Employer No. '+no+' assigned.'); a.status='approved'; a.stage=4; a.employerNo=no; a.approved=nowStr(); saveAccounts(l);
  sendMsg(a,'Registration approved','ESSI Sindh: Congratulations! '+a.co.employer+' is approved. Your Employer No. is '+no+'. Log in at the Employer Portal with your Employer No. (or CNIC / email) and the password you created at registration.');
  $('rv').classList.remove('on'); adTab='approved'; drawAdmin();
  var ok=$('ad-ok'); ok.textContent='Approved '+a.co.employer+'. Employer No. '+no+' was assigned and an SMS and email were sent (see Demo SMS / email inbox).'; ok.classList.add('on');
}
function reject(){
  var r=$('rv-reason'); if($('rv-rej').style.display==='none'){$('rv-rej').style.display='';r.focus();return}
  if(r.value.trim().length<5){var e=$('rv-err');e.textContent='Enter a reason (at least 5 characters).';e.classList.add('on');return}
  var l=accounts(), a=l.filter(function(x){return x.id===rvId})[0];
  addTrack(a,'rejected',r.value.trim()); a.status='rejected'; a.rejectedAt=nowStr(); a.reason=r.value.trim(); saveAccounts(l);
  sendMsg(a,'Registration needs correction','ESSI Sindh: Your application '+a.appNo+' could not be approved. Reason: '+a.reason+'. Please register again with corrected details.');
  $('rv').classList.remove('on'); adTab='rejected'; drawAdmin();
}

/* ---------- track application ---------- */
$('lg-track').onclick=function(){$('tr-err').classList.remove('on');$('tr-res').innerHTML='';$('tr').classList.add('on');$('tr-a').focus()};
$('tr-go').onclick=function(){
  var an=$('tr-a').value.trim().toUpperCase(), cd=digits($('tr-c').value), e=$('tr-err');
  var a=accounts().filter(function(x){return x.appNo&&x.appNo.toUpperCase()===an&&digits(x.cnic)===cd})[0];
  if(!a){e.textContent='No application found for that Application No. and CNIC.';e.classList.add('on');$('tr-res').innerHTML='';return}
  e.classList.remove('on'); var st=stat(a), m={pending:['Pending approval','#fff4d6','#8a5200','ESSI is verifying your documents. Check again later.'],approved:['Approved','#dff3e5','#0b4d24','Your Employer No. is <b>'+esc(a.employerNo)+'</b>. Log in with it (or your CNIC / email) and the password you created.'],rejected:['Rejected','#fdecea','#b00020','Reason: '+esc(a.reason||'-')+'. Please register again with corrected details.']}[st];
  $('tr-res').innerHTML='<div style="background:'+m[1]+';color:'+m[2]+';border-radius:8px;padding:12px 14px;margin-bottom:14px"><b>'+m[0]+'</b> â€” '+esc(a.co.employer)+'<br><span style="font-size:14px;color:#25324a">'+m[3]+'</span></div>'+trackHTML(a);
};

/* ---------- login ---------- */
function fireSubmit(f){ f.dispatchEvent(new Event('submit',{cancelable:true})) }
$('lg-go').addEventListener('click',function(e){e.preventDefault();fireSubmit($('lg-form'))});
$('lg-form').addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.tagName==='INPUT'){e.preventDefault();fireSubmit($('lg-form'))}});
var flash='', capVal='', fails=lsGet('essi:fails',{n:0,until:0}), lockT=null;
function newCap(){
  var ch='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',s='';for(var i=0;i<5;i++)s+=ch.charAt(Math.floor(Math.random()*ch.length));
  capVal=s; var box=$('lg-capimg'); box.innerHTML='';
  s.split('').forEach(function(c){var sp=document.createElement('span');sp.textContent=c;sp.style.transform='rotate('+(Math.random()*24-12).toFixed(0)+'deg) translateY('+(Math.random()*6-3).toFixed(0)+'px)';box.appendChild(sp)});
  $('lg-cap').value='';
}
function lgErr(m){var e=$('lg-err');e.textContent=m||'';e.classList.toggle('on',!!m)}
function lgOk(m){var e=$('lg-ok');e.textContent=m||'';e.classList.toggle('on',!!m)}
function lockTick(){
  var left=Math.ceil((fails.until-Date.now())/1000);
  if(left>0){ $('lg-go').disabled=true; lgErr('Too many failed attempts. Try again in '+left+' second'+(left===1?'':'s')+'.'); }
  else { clearInterval(lockT);lockT=null;fails={n:0,until:0};lsSet('essi:fails',fails);$('lg-go').disabled=false;lgErr('') }
}
function openLogin(){
  show('login'); document.title='Employer Login | ESSI Sindh'; accounts();
  lgErr(''); lgOk(flash); flash=''; $('lg-pw').value=''; newCap();
  if(fails.until>Date.now()){ lockTick(); if(!lockT) lockT=setInterval(lockTick,1000) } else $('lg-go').disabled=false;
  setTimeout(function(){ try{$('lg-id').focus()}catch(e){} },30);
}
$('lg-rf').onclick=newCap;
$('lg-show').onclick=function(){var p=$('lg-pw'),s=p.type==='password';p.type=s?'text':'password';this.textContent=s?'Hide':'Show'};
document.querySelectorAll('[data-fill]').forEach(function(b){b.onclick=function(){ $('lg-id').value=b.getAttribute('data-fill'); $('lg-pw').value=DEMO_PASS; $('lg-cap').focus(); lgErr('') }});
$('lg-form').addEventListener('submit',function(ev){
  ev.preventDefault(); lgOk('');
  if(fails.until>Date.now()) return;
  var idv=$('lg-id').value.trim(), pw=$('lg-pw').value, cap=$('lg-cap').value.trim().toUpperCase();
  if(!idv||!pw){ lgErr('Enter your login ID and password.'); return }
  if(!cap){ lgErr('Enter the security code shown in the image.'); return }
  if(cap!==capVal){ lgErr('The security code is incorrect. A new code has been generated.'); newCap(); return }
  var acc=findAcc(idv);
  if(!acc||acc.ph!==H(pw)){
    fails.n++; var left=5-fails.n;
    if(left<=0){ fails.until=Date.now()+60000; lsSet('essi:fails',fails); lockTick(); lockT=setInterval(lockTick,1000) }
    else { lsSet('essi:fails',fails); lgErr('Invalid login ID or password. '+left+' attempt'+(left===1?'':'s')+' remaining.') }
    newCap(); $('lg-pw').value=''; return;
  }
  fails={n:0,until:0}; lsSet('essi:fails',fails);
  if(stat(acc)==='pending'){ lgErr('Your application '+acc.appNo+' is still waiting for ESSI approval. You can log in once an Employer No. is assigned. Use â€œTrack my applicationâ€ to check the status.'); newCap(); return }
  if(stat(acc)==='rejected'){ lgErr('Your application '+acc.appNo+' was rejected. Reason: '+(acc.reason||'-')+'. Please register again.'); newCap(); return }
  lsSet('essi:session',{id:acc.id,t:Date.now()});
  lgErr(''); lgOk('Login successful. Opening your dashboardâ€¦'); $('lg-go').disabled=true; $('lg-go').textContent='Signing inâ€¦';
  setTimeout(function(){ $('lg-go').textContent='Log in'; go('dashboard') },400);
});

/* ---------- forgot password ---------- */
var fpAcc=null;
function fpErr(m){var e=$('fp-err');e.textContent=m||'';e.classList.toggle('on',!!m)}
function fpOpen(){fpAcc=null;fpErr('');$('fp-1').style.display='';$('fp-2').style.display='none';$('fp-id').value=$('lg-id').value;$('fp').classList.add('on');$('fp-id').focus()}
function fpClose(){['fp','tr','rv'].forEach(function(i){$(i).classList.remove('on')})}
$('lg-forgot').onclick=fpOpen;
document.querySelectorAll('[data-close]').forEach(function(b){b.onclick=fpClose});
['fp','tr','rv'].forEach(function(i){$(i).addEventListener('click',function(e){if(e.target===this)fpClose()})});
document.addEventListener('keydown',function(e){if(e.key==='Escape')fpClose()});
$('fp-send').onclick=function(){
  var a=findAcc($('fp-id').value); if(!a){ fpErr('No account found for that login ID.'); return }
  fpAcc=a; fpErr(''); var m=digits(a.mobile); $('fp-info').textContent='Code sent to '+m.slice(0,4)+'-XXX'+m.slice(-4)+'. Demo code: '+RESET_CODE;
  $('fp-1').style.display='none'; $('fp-2').style.display=''; $('fp-code').focus();
};
$('fp-save').onclick=function(){
  var c=$('fp-code').value.trim(),p1=$('fp-p1').value,p2=$('fp-p2').value;
  if(c!==RESET_CODE){ fpErr('The code is incorrect.'); return }
  if(p1.length<8||!/[A-Z]/.test(p1)||!/[0-9]/.test(p1)){ fpErr('Password needs at least 8 characters, one capital letter and one number.'); return }
  if(p1!==p2){ fpErr('Passwords do not match.'); return }
  var l=accounts(); l.forEach(function(a){if(a.id===fpAcc.id)a.ph=H(p1)}); saveAccounts(l);
  fails={n:0,until:0}; lsSet('essi:fails',fails); fpClose(); flash='Password changed. Log in with your new password.'; openLogin();
};

accounts(); route();
})();

