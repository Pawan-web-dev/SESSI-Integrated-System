\
const BASE_EMP = [{"n": "1", "name": "Ahmed Raza", "cnic": "42101-1234567-1", "des": "Production Supervisor", "type": "Permanent", "status": "Active", "mark": "âœ“", "col": "#067a35"}, {"n": "2", "name": "Sana Malik", "cnic": "42201-2345678-2", "des": "Quality Inspector", "type": "Permanent", "status": "Active", "mark": "âœ“", "col": "#067a35"}, {"n": "3", "name": "Imran Shah", "cnic": "42301-3456789-3", "des": "Machine Operator", "type": "Contractual", "status": "Active", "mark": "âœ“", "col": "#067a35"}, {"n": "4", "name": "Bilal Hussain", "cnic": "42101-4567890-4", "des": "Store Keeper", "type": "Permanent", "status": "Inactive", "mark": "âœ—", "col": "#b00020"}, {"n": "5", "name": "Farah Naz", "cnic": "42401-5678901-5", "des": "Accounts Clerk", "type": "Permanent", "status": "Active", "mark": "âœ“", "col": "#067a35"}, {"n": "6", "name": "Kamran Ali", "cnic": "42201-6789012-6", "des": "Helper", "type": "Daily Wages", "status": "Active", "mark": "âœ“", "col": "#067a35"}];\
const EMP_KEY = 'essi:employees:__ACC__';\
const DOCS = [{"name": "SECP Certificate", "req": "Required", "file": "secp_certificate.pdf", "status": "Verified", "has": true, "col": "#067a35"}, {"name": "NTN", "req": "Required", "file": "ntn_certificate.pdf", "status": "Verified", "has": true, "col": "#067a35"}, {"name": "SRB Registration", "req": "Required", "file": "srb_registration.pdf", "status": "Verified", "has": true, "col": "#067a35"}, {"name": "Electricity Bill", "req": "Required", "file": "electricity_bill_oct2026.pdf", "status": "Verified", "has": true, "col": "#067a35"}, {"name": "Gas Bill", "req": "If applicable", "file": "-", "status": "Not applicable", "has": false, "col": "#666"}, {"name": "Partnership Deed", "req": "Where applicable", "file": "-", "status": "Not applicable", "has": false, "col": "#666"}, {"name": "Proprietor/Employer CNIC", "req": "Required", "file": "owner_cnic.jpg", "status": "Verified", "has": true, "col": "#067a35"}, {"name": "Bank Details", "req": "Required", "file": "bank_letter.pdf", "status": "Verified", "has": true, "col": "#067a35"}, {"name": "Company Logo", "req": "Where applicable", "file": "company_logo.png", "status": "Uploaded", "has": true, "col": "#0b5fa8"}, {"name": "Contact Numbers & Email Address", "req": "Required", "file": "contact_details.pdf", "status": "Verified", "has": true, "col": "#067a35"}];\
const CO_BASE = __CO_BASE__;\
const FIELDS = [{"k": "employer", "label": "Employer Name", "doc": "Amended SECP certificate or registration letter", "need": true}, {"k": "btype", "label": "Business Type", "doc": "SECP certificate showing the new business type", "need": true}, {"k": "secp", "label": "SECP Certificate No.", "doc": "New SECP certificate", "need": true}, {"k": "ntn", "label": "NTN", "doc": "NTN certificate", "need": true}, {"k": "srb", "label": "SRB Registration No.", "doc": "SRB registration certificate", "need": true}, {"k": "addr", "label": "Business Address", "doc": "Recent utility bill showing the new address", "need": true}, {"k": "district", "label": "District", "doc": "Recent utility bill showing the new address", "need": true}, {"k": "gps", "label": "GPS Location", "doc": "Optional: photo of the premises", "need": false}, {"k": "person", "label": "Contact Person", "doc": "Optional: authority letter", "need": false}, {"k": "desig", "label": "Designation", "doc": "Optional", "need": false}, {"k": "mobile", "label": "Mobile No.", "doc": "Optional", "need": false}, {"k": "email", "label": "Email Address", "doc": "Optional", "need": false}, {"k": "phone", "label": "Office Phone", "doc": "Optional", "need": false}];\
const SEED_CR = [{"id": "CR-2026-0001", "ref": "CR-2026-0001", "key": "phone", "label": "Office Phone", "oldVal": "021-35000001", "newVal": "021-35000000", "reason": "Office number changed after a phone system upgrade.", "doc": "-", "status": "Approved", "submitted": "02 Nov 2026 11:15", "by": "__PERSON__", "remarks": "", "events": [{"t": "02 Nov 2026 11:15", "text": "Request submitted by __PERSON__", "who": "Employer"}, {"t": "03 Nov 2026 10:00", "text": "Approved by ESSI officer. Company profile updated.", "who": "ESSI"}]}];\
const CR_KEY = 'essi:changes:' + EMP_KEY.split(':')[2];\
const CO_KEY = 'essi:company:' + EMP_KEY.split(':')[2];\
const HAS = true;\
const MONTHS = [{"m":"Jun","amt":95460},{"m":"Jul","amt":97680},{"m":"Aug","amt":99900},{"m":"Sep","amt":102120},{"m":"Oct","amt":106560},{"m":"Nov","amt":106560}];\
const TYPES = [{"name":"Permanent","val":36,"color":"#067a35"},{"name":"Contractual","val":6,"color":"#0b5fa8"},{"name":"Daily Wages","val":4,"color":"#b45309"},{"name":"Others","val":2,"color":"#666666"}];\
const tc = (s) => { s = String(s || ''); return s === s.toUpperCase() ? s.split(' ').map((w) => w ? w.charAt(0) + w.slice(1).toLowerCase() : w).join(' ') : s; };\
const norm = (e) => Object.assign({}, e, { id: e.id || e.cnic, status: tc(e.status), type: tc(e.type), des: tc(e.des) });\
const EMP_DETAILS = [{"father": "Muhammad Raza", "gender": "MALE", "dob": "12/03/1988", "mobile": "0300-1234567", "skill": "Skilled", "wageType": "Monthly", "freq": "Monthly", "joined": "01/02/2019", "wage": "40000", "bank": "0001-1234501"}, {"father": "Abdul Malik", "gender": "FEMALE", "dob": "25/07/1991", "mobile": "0321-2345678", "skill": "Skilled", "wageType": "Monthly", "freq": "Monthly", "joined": "15/06/2020", "wage": "37000", "bank": "0001-1234502"}, {"father": "Shah Nawaz", "gender": "MALE", "dob": "09/11/1985", "mobile": "0333-3456789", "skill": "Semi-Skilled", "wageType": "Monthly", "freq": "Monthly", "joined": "01/09/2021", "wage": "42000", "bank": "0001-1234503"}, {"father": "Rashid Ali", "gender": "MALE", "dob": "30/01/1990", "mobile": "0345-4567890", "skill": "Semi-Skilled", "wageType": "Monthly", "freq": "Monthly", "joined": "10/03/2018", "wage": "37000", "bank": "0001-1234504"}, {"father": "Naz Hussain", "gender": "FEMALE", "dob": "18/05/1994", "mobile": "0345-5678901", "skill": "Skilled", "wageType": "Monthly", "freq": "Monthly", "joined": "05/01/2022", "wage": "37000", "bank": "0001-1234505"}, {"father": "Ali Khan", "gender": "MALE", "dob": "02/12/1996", "mobile": "0312-6789012", "skill": "Unskilled", "wageType": "Daily", "freq": "Daily", "joined": "20/08/2023", "wage": "37000", "bank": "0001-1234506"}];\
const AV = (i, g) => { const bg = ['#cfe8d6', '#cfe0f2', '#f5e1c6', '#e3d7f3', '#f6d3d3', '#d3ecee'][i % 6]; const sk = ['#e0b48f', '#c58f66', '#d9a47c', '#b57c55', '#e8c1a0', '#cf9a72'][i % 6]; const hair = ['#2b1d14', '#1c1410', '#3a2a1c', '#111', '#4a3220', '#22170f'][i % 6]; const sh = ['#067a35', '#0b5fa8', '#b45309', '#6b3fa0', '#a63a3a', '#1c7c86'][i % 6]; const f = g === 'FEMALE'; const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="' + bg + '"/><path d="M12 96c0-20 15-30 36-30s36 10 36 30z" fill="' + sh + '"/><rect x="41" y="52" width="14" height="14" rx="5" fill="' + sk + '"/><ellipse cx="48" cy="38" rx="15" ry="18" fill="' + sk + '"/>' + (f ? '<path d="M31 40c-3-20 8-28 17-28s20 8 17 28c-2-10-6-15-17-15s-15 5-17 15z" fill="' + hair + '"/><path d="M31 38v24c4 0 6-3 6-8zM65 38v24c-4 0-6-3-6-8z" fill="' + hair + '"/>' : '<path d="M33 34c0-14 9-19 15-19s15 5 15 19c-3-7-8-9-15-9s-12 2-15 9z" fill="' + hair + '"/>') + '<circle cx="42" cy="40" r="1.8" fill="#222"/><circle cx="54" cy="40" r="1.8" fill="#222"/><path d="M43 47q5 4 10 0" stroke="#7a3b2e" stroke-width="1.6" fill="none" stroke-linecap="round"/><\u002Fsvg>'; return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg); };\
const resizePhoto = (file, done, fail) => { const r = new FileReader(); r.onerror = () => fail('Could not read that image.'); r.onload = () => { const im = new Image(); im.onerror = () => fail('That file is not a valid image.'); im.onload = () => { const S = 200; const c = document.createElement('canvas'); c.width = S; c.height = S; const x = c.getContext('2d'); const m = Math.min(im.width, im.height); x.fillStyle = '#fff'; x.fillRect(0, 0, S, S); x.drawImage(im, (im.width - m) / 2, (im.height - m) / 2, m, m, 0, 0, S, S); done(c.toDataURL('image/jpeg', 0.82)); }; im.src = r.result; }; r.readAsDataURL(file); };\
const DEFAULT_EMPS = BASE_EMP.map((e, i) => norm(Object.assign({}, e, EMP_DETAILS[i] || {}, { photo: AV(i, (EMP_DETAILS[i] || {}).gender) })));\
const EMPL_KEY = 'essi:emplist:' + EMP_KEY.split(':')[2];\
class Component extends DCLogic {\
getEmps() { const st = this.state || {}; if (st.emps) { return st.emps; } return (st.saved || []).map(norm).concat(DEFAULT_EMPS); }\
persistEmps(list) { try { window.localStorage.setItem(EMPL_KEY, JSON.stringify(list)); } catch (e) {} }\
editEmp(id) {\
const r = this.getEmps().find((e) => e.id === id); if (!r) { return; }\
this.setState({ editId: id, empPanel: null, savedMsg: '', formErr: '', sel: 'Employee Management|Register Employee', form: { ph: r.photo || '', fn: r.name, fa: r.father || '', gender: r.gender || '', cn: r.cnic, dob: r.dob || '', mb: r.mobile || '', ds: r.des || '', sk: r.skill || '', et: r.type || '', wt: r.wageType || '', pf: r.freq || '', dj: r.joined || '', mw: r.wage || '', ba: r.bank || '' } });\
}\
saveEmp() {\
const st = this.state || {}; const f = st.form || {};\
const bad = (v) => !v || String(v).trim() === '' || String(v).indexOf('---') === 0;\
const pick = (v) => (v && String(v).indexOf('---') !== 0) ? v : '';\
const miss = [];\
if (bad(f.fn)) miss.push('Full Name');\
if (bad(f.fa)) miss.push('Fatherâ€™s Name');\
if (bad(f.gender)) miss.push('Gender');\
if (bad(f.cn)) miss.push('CNIC No.');\
if (bad(f.mb)) miss.push('Mobile No.');\
if (bad(f.ds)) miss.push('Designation');\
if (bad(f.et)) miss.push('Employment Type');\
if (miss.length) { this.setState({ formErr: 'Please fill in: ' + miss.join(', ') + '.' }); return; }\
const digits = String(f.cn).replace(/\D/g, '');\
if (digits.length !== 13) { this.setState({ formErr: 'CNIC must have 13 digits, for example 42101-1234567-1.' }); return; }\
const cnic = digits.slice(0, 5) + '-' + digits.slice(5, 12) + '-' + digits.slice(12);\
const emps = this.getEmps(); const editing = st.editId;\
if (emps.some((e) => e.cnic === cnic && e.id !== editing)) { this.setState({ formErr: 'This CNIC is already registered.' }); return; }\
const old = editing ? emps.find((e) => e.id === editing) : null;\
const rec = Object.assign({}, old || {}, { id: cnic, name: String(f.fn).trim(), cnic: cnic, des: String(f.ds).trim(), type: f.et, status: old ? old.status : 'Active', father: f.fa, photo: f.ph || '', gender: f.gender, dob: f.dob || '', mobile: f.mb, skill: pick(f.sk), wageType: pick(f.wt), freq: pick(f.pf), joined: f.dj || '', wage: f.mw || '', bank: f.ba || '' });\
const list = editing ? emps.map((e) => e.id === editing ? rec : e) : [rec].concat(emps);\
this.persistEmps(list);\
this.setState({ emps: list, form: {}, formErr: '', editId: null, empPanel: null, savedMsg: 'Employee ' + rec.name + (editing ? ' was updated.' : ' was saved and added to the list below.'), sel: 'Employee Management|Profile for Contribution' });\
}\
setEmpStatus(id, status) {\
const emps = this.getEmps(); const list = emps.map((e) => e.id === id ? Object.assign({}, e, { status: status }) : e);\
const r = list.find((e) => e.id === id); this.persistEmps(list);\
this.setState({ emps: list, empPanel: null, savedMsg: 'Status of ' + (r ? r.name : 'employee') + ' changed to ' + status + '.' });\
}\
delEmp(id) {\
const emps = this.getEmps(); const r = emps.find((e) => e.id === id); const list = emps.filter((e) => e.id !== id);\
this.persistEmps(list);\
this.setState({ emps: list, empPanel: null, savedMsg: 'Employee ' + (r ? r.name : '') + ' was deleted.' });\
}\
\
nowStr() { const n = new Date(); return n.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + n.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); }\
persistCr(list, co) { try { window.localStorage.setItem(CR_KEY, JSON.stringify(list)); window.localStorage.setItem(CO_KEY, JSON.stringify(co)); } catch (e) {} }\
submitCr() {\
const st = this.state || {}; const f = st.crForm || {}; const co = Object.assign({}, CO_BASE, st.co || {});\
const fd = FIELDS.find((x) => x.k === f.k);\
let err = '';\
if (!fd) { err = 'Choose what you want to change.'; }\
else if (!f.n || !String(f.n).trim()) { err = 'Enter the new value.'; }\
else if (String(f.n).trim() === co[fd.k]) { err = 'The new value is the same as the current value.'; }\
else if (!f.r || String(f.r).trim().length < 10) { err = 'Give a reason (at least 10 characters).'; }\
else if (fd.need && !f.d) { err = 'Attach the supporting document: ' + fd.doc + '.'; }\
if (err) { this.setState({ crErr: err }); return; }\
const list = st.crs || SEED_CR; const ref = 'CR-2026-' + String(list.length + 1).padStart(4, '0'); const t = this.nowStr();\
const rec = { id: ref, ref: ref, key: fd.k, label: fd.label, oldVal: co[fd.k], newVal: String(f.n).trim(), reason: String(f.r).trim(), doc: f.d || '-', status: 'Pending Review', submitted: t, by: '__PERSON__', remarks: '', events: [{ t: t, text: 'Request submitted by __PERSON__', who: 'Employer' }] };\
const next = [rec].concat(list);\
this.persistCr(next, st.co || {});\
this.setState({ crs: next, crForm: {}, crErr: '', crMsg: 'Change request ' + ref + ' was submitted. ESSI will review it and you will be notified.', sel: 'Company Profile|Change Requests' });\
}\
setCrStatus(id, status) {\
const st = this.state || {}; const list = (st.crs || SEED_CR).map((r) => Object.assign({}, r)); const r = list.find((x) => x.id === id); if (!r) { return; }\
const t = this.nowStr(); let co = Object.assign({}, st.co || {});\
r.status = status;\
if (status === 'Under Review') { r.events = r.events.concat([{ t: t, text: 'Assigned to an ESSI officer for review', who: 'ESSI' }]); }\
if (status === 'Approved') { r.events = r.events.concat([{ t: t, text: 'Approved by ESSI officer. Company profile updated.', who: 'ESSI' }]); co[r.key] = r.newVal; }\
if (status === 'Rejected') { r.remarks = 'The supporting document is unclear. Please upload a clearer copy and submit again. (sample remark)'; r.events = r.events.concat([{ t: t, text: 'Rejected by ESSI officer', who: 'ESSI' }]); }\
this.persistCr(list, co);\
this.setState({ crs: list, co: co });\
}\
\
setPw(k, v) { const st = this.state || {}; this.setState({ pw: Object.assign({}, st.pw || {}, { [k]: v }) }); }\
updatePw() {\
const st = this.state || {}; const p = st.pw || {}; let err = '';\
if (!p.cur) { err = 'Enter your current password.'; }\
else if (!p.nw || p.nw.length < 8) { err = 'New password must be at least 8 characters.'; }\
else if (!/[A-Z]/.test(p.nw) || !/[0-9]/.test(p.nw)) { err = 'Use at least one capital letter and one number.'; }\
else if (p.nw !== p.cf) { err = 'New password and confirmation do not match.'; }\
else if (p.nw === p.cur) { err = 'New password must be different from the current password.'; }\
this.setState({ pwErr: err, pwDone: !err, pw: err ? p : {} });\
}\
\
componentDidMount() {\
if (super.componentDidMount) { super.componentDidMount(); }\
try { const raw = window.localStorage.getItem(EMP_KEY); if (raw) { this.setState({ saved: JSON.parse(raw) }); } } catch (e) {}\
try { const r4 = window.localStorage.getItem(EMPL_KEY); if (r4) { this.setState({ emps: JSON.parse(r4).map(norm) }); } } catch (e) {}\
try { const r2 = window.localStorage.getItem(CR_KEY); if (r2) { this.setState({ crs: JSON.parse(r2) }); } const r3 = window.localStorage.getItem(CO_KEY); if (r3) { this.setState({ co: JSON.parse(r3) }); } } catch (e) {}\
}\
setField(k, v) { const st = this.state || {}; this.setState({ form: Object.assign({}, st.form || {}, { [k]: v }) }); }\
saveEmpOld() {\
const st = this.state || {}; const f = st.form || {};\
const bad = (v) => !v || String(v).trim() === '' || String(v).indexOf('---') === 0;\
const miss = [];\
if (bad(f.fn)) miss.push('Full Name');\
if (bad(f.fa)) miss.push('Fatherâ€™s Name');\
if (bad(f.gender)) miss.push('Gender');\
if (bad(f.cn)) miss.push('CNIC No.');\
if (bad(f.mb)) miss.push('Mobile No.');\
if (bad(f.ds)) miss.push('Designation');\
if (bad(f.et)) miss.push('Employment Type');\
if (miss.length) { this.setState({ formErr: 'Please fill in: ' + miss.join(', ') + '.' }); return; }\
const digits = String(f.cn).replace(/\D/g, '');\
if (digits.length !== 13) { this.setState({ formErr: 'CNIC must have 13 digits, for example 42101-1234567-1.' }); return; }\
const cnic = digits.slice(0, 5) + '-' + digits.slice(5, 12) + '-' + digits.slice(12);\
const all = (st.saved || []).concat(BASE_EMP);\
if (all.some((e) => e.cnic === cnic)) { this.setState({ formErr: 'This CNIC is already registered.' }); return; }\
const rec = { name: String(f.fn).trim(), cnic: cnic, des: String(f.ds).trim().toUpperCase(), type: String(f.et).toUpperCase(), status: 'ACTIVE', mark: 'âœ“', col: '#067a35', father: f.fa, photo: f.ph || '', gender: f.gender, dob: f.dob || '', mobile: f.mb, skill: f.sk || '', wageType: f.wt || '', freq: f.pf || '', joined: f.dj || '', wage: f.mw || '', bank: f.ba || '' };\
const list = [rec].concat(st.saved || []);\
try { window.localStorage.setItem(EMP_KEY, JSON.stringify(list)); } catch (e) {}\
this.setState({ saved: list, form: {}, formErr: '', savedMsg: 'Employee ' + rec.name + ' was saved and added to the list below.', sel: 'Employee Management|Profile for Contribution' });\
}\
\
renderVals() {\
const st = this.state || {};\
const open = st.open || { Dashboard: true };\
const sel = st.sel || 'Dashboard|Overview';\
const defs = [\
['Dashboard', ['Overview', 'Contribution Summary'], 'MAIN MENU'],\
['Company Profile', ['Business Information', 'Mandatory Documents', 'Contact & Location', 'Change Requests'], ''],\
['Employee Management', ['Register Employee', 'Profile for Contribution'], ''],\
['Monthly Contributions', ['Monthly Contribution', 'Create Contribution'], ''],\
['Challans & Payments', ['Generate Challan', 'Payment History', 'F-4', 'F-5', 'Return History'], ''],\
['Reports & Statements', ['Contribution Report', 'Employee Report', 'Statement of Account'], ''],\
['Notifications', ['Inbox', 'Alerts'], 'ACCOUNT & SUPPORT'],\
['Help & Support', ['FAQs', 'Raise a Ticket'], ''],\
['Settings', ['Account Settings', 'Change Password', 'Notification Settings'], '']\
];\
const ICONS = {\
'Dashboard': 'M3 3v18h18M7 15l4-4 3 3 5-6',\
'Company Profile': 'M3 8h18v12H3zM9 8V5h6v3M3 13h18',\
'Employee Management': 'M9 11a3 3 0 100-6 3 3 0 000 6zM3 20c0-3.5 2.7-5.5 6-5.5s6 2 6 5.5M16 6a3 3 0 010 5.5M17.5 14.7c2 .6 3.5 2.4 3.5 5.3',\
'Monthly Contributions': 'M4 6h16v14H4zM4 11h16M8 3v4M16 3v4',\
'Challans & Payments': 'M3 6h18v12H3zM3 10h18M7 15h3',\
'Reports & Statements': 'M5 20V10M12 20V4M19 20v-7M3 20h18',\
'Notifications': 'M6 17V11a6 6 0 0112 0v6l2 2H4zM10 21h4',\
'Help & Support': 'M12 21a9 9 0 100-18 9 9 0 000 18zM9.5 9.5a2.5 2.5 0 115 0c0 1.5-2.5 2-2.5 3.5M12 17h.01',\
'Settings': 'M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M6 14v6'\
};\
const groups = defs.map((d) => {\
const isOpen = !!open[d[0]];\
const hasSel = sel.split('|')[0] === d[0];\
return {\
ic: ICONS[d[0]], icc: isOpen ? '#7be3a3' : '#067a35', name: d[0], head: d[2], hasHead: d[2] !== '', isOpen: isOpen, sign: isOpen ? 'âˆ’' : '+',\
bg: isOpen ? '#0b4d24' : '#ffffff', fg: isOpen ? '#ffffff' : '#17321f',\
toggle: () => this.setState({ open: Object.assign({}, open, { [d[0]]: !isOpen }), sel: sel }),\
subs: d[1].map((n) => { const on = sel === d[0] + '|' + n; return { name: n, bg: on ? '#dff3e5' : 'transparent', fg: on ? '#067a35' : '#2d4a35', fw: on ? '700' : '400', pick: () => this.setState({ open: open, sel: d[0] + '|' + n, menuOpen: false, form: {}, formErr: '', savedMsg: '', editId: null, empPanel: null, pwDone: false, pwErr: '', pw: {}, crForm: {}, crErr: '', crMsg: '' }) }; })\
};\
});\
const parts = sel.split('|');\
const mo = !!st.menuOpen; const co = Object.assign({}, CO_BASE, st.co || {});\
const crList = st.crs || SEED_CR;\
const CRCOL = { 'Pending Review': '#b45309', 'Under Review': '#0b5fa8', 'Approved': '#067a35', 'Rejected': '#b00020' };\
const crRows = crList.map((r) => Object.assign({}, r, { col: CRCOL[r.status], view: () => this.setState({ sel: 'Company Profile|Request Details', viewId: r.id }) }));\
const dr = crList.find((r) => r.id === st.viewId) || crList[0];\
const crf = st.crForm || {};\
const fdef = FIELDS.find((x) => x.k === crf.k);\
const d = dr ? Object.assign({}, dr, { col: CRCOL[dr.status], hasRemarks: !!dr.remarks, canAct: dr.status === 'Pending Review' || dr.status === 'Under Review', canReview: dr.status === 'Pending Review' }) : {};\
const saved = st.saved || [];\
const emps = this.getEmps();\
const tcol = { Active: '#067a35', Inactive: '#c2570c', Separated: '#b00020' };\
const allEmp = emps.map((e, i) => Object.assign({}, e, { hasPh: !!e.photo, noPh: !e.photo, n: String(i + 1), scol: tcol[e.status] || '#444444', col: tcol[e.status] || '#444444', mark: e.status === 'Active' ? 'âœ“' : (e.status === 'Inactive' ? 'âœ—' : '-'), canTg: e.status !== 'Separated', noTg: e.status === 'Separated',\
vw: () => this.setState({ empPanel: { mode: 'view', id: e.id }, savedMsg: '' }), ed: () => this.editEmp(e.id), dl: () => this.setState({ empPanel: { mode: 'del', id: e.id }, savedMsg: '' }), sp: () => this.setState({ empPanel: { mode: 'sep', id: e.id }, savedMsg: '' }), tg: () => this.setEmpStatus(e.id, e.status === 'Active' ? 'Inactive' : 'Active') }));\
const pe = st.empPanel || null; const pr = pe ? emps.find((x) => x.id === pe.id) : null; const pm = pr ? pe.mode : '';\
const pFields = pr ? [['Fatherâ€™s name', pr.father], ['Gender', pr.gender], ['Date of birth', pr.dob], ['Mobile', pr.mobile], ['Designation', pr.des], ['Skill level', pr.skill], ['Employment type', pr.type], ['Wage type', pr.wageType], ['Payment frequency', pr.freq], ['Date of joining', pr.joined], ['Monthly wages', pr.wage], ['Bank account', pr.bank], ['Status', pr.status]].map((a) => ({ l: a[0], v: a[1] || '-' })) : [];\
const fm = st.form || {}; const PS = '--- Please Select ---';\
\
const hf = (k) => (e) => this.setField(k, e.target.value);\
const hg = (v) => () => this.setField('gender', v);\
const paid = !!st.paid;\
const NOTIF = [{"text": "Your contribution for November 2026 has been approved. Voucher 2611004512 for PKR 106,600 has been generated.", "time": "18-Nov-2026 02:05 PM", "dot": "#067a35", "hasAct": true}, {"text": "Contribution for November 2026 submitted and pending for approval. Ref. CNTR-2026-00123.", "time": "17-Nov-2026 10:45 AM", "dot": "#067a35", "hasAct": false}, {"text": "Payment received for October 2026. Receipt RCP-2026-008214.", "time": "29-Oct-2026 11:10 AM", "dot": "#067a35", "hasAct": false}];\
const HIST = [{"ch": "CH-2026-004512", "m": "November, 2026", "amt": "106,600", "due": "30-Nov-2026", "paidOn": "â€”", "status": "Unpaid", "col": "#b45309"}, {"ch": "CH-2026-004102", "m": "October, 2026", "amt": "106,600", "due": "31-Oct-2026", "paidOn": "29-Oct-2026", "status": "Paid", "col": "#067a35"}, {"ch": "CH-2026-003688", "m": "September, 2026", "amt": "102,160", "due": "30-Sep-2026", "paidOn": "26-Sep-2026", "status": "Paid", "col": "#067a35"}];\
const histRows = HIST.map((h, i) => { const p = i === 0 && paid; const unpaid = i === 0 && !paid; return Object.assign({}, h, p ? { status: 'Paid', paidOn: '18-Nov-2026', col: '#067a35' } : {}, { hasBtn: i === 0, act: unpaid ? 'Pay Now' : 'View Receipt', go: unpaid ? () => this.setState({ open: open, sel: 'Challans & Payments|Generate Challan' }) : () => this.setState({ open: open, sel: 'Challans & Payments|Receipt' }) }); });\
const fmt = (n) => Number(n).toLocaleString('en-US');\
const paidTotal = MONTHS.filter((x, i) => i < MONTHS.length - 1 || paid).reduce((a, x) => a + x.amt, 0);\
const maxA = Math.max.apply(null, MONTHS.map((x) => x.amt).concat([1]));\
const bars = MONTHS.map((x, i) => ({ label: x.m, val: fmt(x.amt), h: Math.round(x.amt / maxA * 150), fill: (i === MONTHS.length - 1 && !paid) ? '#f0b44c' : '#067a35' }));\
const typeTotal = TYPES.reduce((a, x) => a + x.val, 0);\
const typeBars = TYPES.map((x) => ({ name: x.name, val: x.val, pct: Math.round(x.val / typeTotal * 100), color: x.color }));\
const csKpis = HAS ? [\
{ label: 'Contribution paid (6 months)', value: 'PKR ' + fmt(paidTotal), sub: 'Jun to Nov 2026', fg: '#067a35' },\
{ label: 'Outstanding', value: paid ? 'PKR 0' : 'PKR 106,600', sub: paid ? 'All challans paid' : 'November challan (incl. service charge)', fg: paid ? '#067a35' : '#b45309' },\
{ label: 'Last payment', value: paid ? '18-Nov-2026' : '29-Oct-2026', sub: paid ? 'November contribution' : 'October contribution', fg: '#0b5fa8' },\
{ label: 'Next due date', value: paid ? '31-Dec-2026' : '30-Nov-2026', sub: paid ? 'December contribution' : 'November contribution (last day of month)', fg: '#6b3fa0' }\
] : [\
{ label: 'Contribution paid', value: 'PKR 0', sub: 'No payments yet', fg: '#067a35' },\
{ label: 'Outstanding', value: 'PKR 0', sub: 'Nothing due', fg: '#067a35' },\
{ label: 'Last payment', value: '-', sub: 'No payments yet', fg: '#0b5fa8' },\
{ label: 'Next due date', value: '-', sub: 'Create your first contribution', fg: '#6b3fa0' }];\
const tip = HAS ? (paid ? 'November contribution is paid. Your next contribution is due 31-Dec-2026.' : 'November contribution is approved. Pay challan CH-2026-004512 before 30-Nov-2026.') : 'Register your employees, then create your first monthly contribution.';\
const tipBtn = HAS ? (paid ? 'View Receipt' : 'Pay Challan') : 'Register Employee';\
const tipTarget = HAS ? (paid ? 'Challans & Payments|Receipt' : 'Challans & Payments|Generate Challan') : 'Employee Management|Register Employee';\
const F4MAP = { 'November, 2026': ['RCP-2026-008590', 48], 'October, 2026': ['RCP-2026-008214', 48], 'September, 2026': ['RCP-2026-007731', 46] };\
const f4Rows = HIST.filter((h, i) => h.status === 'Paid' || (i === 0 && paid)).map((h, i) => { const m = F4MAP[h.m] || ['RCP-' + String(h.ch).slice(3), '-']; return { n: String(i + 1), rc: m[0], m: String(h.m).toUpperCase(), emp: String(m[1]), amt: h.amt, mode: '1Bill', pr: () => this.setState({ open: open, sel: 'Challans & Payments|Receipt' }) }; });\
const W = (n) => { const a = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN']; const b = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY']; const h = (x) => { let r = ''; if (x >= 100) { r += a[Math.floor(x / 100)] + ' HUNDRED '; x = x % 100; } if (x >= 20) { r += b[Math.floor(x / 10)] + ' ' + a[x % 10] + ' '; } else if (x > 0) { r += a[x] + ' '; } return r; }; let r = ''; if (n >= 1000000) { r += h(Math.floor(n / 1000000)) + 'MILLION '; n = n % 1000000; } if (n >= 1000) { r += h(Math.floor(n / 1000)) + 'THOUSAND '; n = n % 1000; } r += h(n); return r.replace(/ +/g, ' ').trim(); };\
const lateCalc = (principal, svc, due, paidOn) => { const days = Math.max(0, Math.round((paidOn.getTime() - due.getTime()) / 86400000)); const pct = Math.min(days * 0.5, 50); const inc = Math.round(principal * pct / 100); return { days: days, pct: pct, inc: inc, total: principal + svc + inc }; };\
const LC = lateCalc(99900, 40, new Date(2026, 7, 31), new Date(2026, 8, 7));\
const lv = { month: 'August, 2026', emp: '47', voucher: '2608003977', due: '31/08/2026', paidOn: '07/09/2026', contrib: fmt(99900), svc: '40', days: String(LC.days), pct: String(LC.pct), inc: fmt(LC.inc), total: fmt(LC.total), words: W(LC.total) };\
const f5Rows = HAS ? [{ n: '1', rc: 'RCP-2026-006940', m: 'AUGUST, 2026', emp: lv.emp, amt: lv.total, mode: '1Bill', pr: () => this.setState({ open: open, sel: 'Challans & Payments|F-5 Voucher' }) }] : [];\
return Object.assign({ f5Rows: f5Rows, noF5: f5Rows.length === 0, lv: lv, isF5V: sel === 'Challans & Payments|F-5 Voucher', goF5: () => this.setState({ open: open, sel: 'Challans & Payments|F-5' }), isF4: sel === 'Challans & Payments|F-4', isF5: sel === 'Challans & Payments|F-5', f4Rows: f4Rows, noF4: f4Rows.length === 0, pView: pm === 'view', pDel: pm === 'del', pSep: pm === 'sep', pName: pr ? pr.name : '', pCnic: pr ? pr.cnic : '', pFields: pFields, closeP: () => this.setState({ empPanel: null }), delOk: () => this.delEmp(pr.id), sepOk: () => this.setEmpStatus(pr.id, 'Separated'), editFromPanel: () => this.editEmp(pr.id), regTitle: st.editId ? 'EDIT EMPLOYEE' : 'EMPLOYEE REGISTRATION', saveLabel: st.editId ? 'Update Employee' : 'Save Employee', fv_fn: fm.fn || '', fv_fa: fm.fa || '', fv_cn: fm.cn || '', fv_dob: fm.dob || '', fv_mb: fm.mb || '', fv_ds: fm.ds || '', fv_dj: fm.dj || '', fv_mw: fm.mw || '', fv_ba: fm.ba || '', fv_sk: fm.sk || PS, fv_et: fm.et || PS, fv_wt: fm.wt || PS, fv_pf: fm.pf || PS, gcM: fm.gender === 'MALE', gcF: fm.gender === 'FEMALE', gcT: fm.gender === 'TRANSGENDER', bars: bars, noBars: bars.length === 0, typeBars: typeBars, noType: typeTotal === 0, csKpis: csKpis, paidCount: HAS ? 5 + (paid ? 1 : 0) : 0, unpaidCount: HAS ? (paid ? 0 : 1) : 0, payCol: paid ? '#067a35' : '#b45309', tip: tip, tipBtn: tipBtn, tipGo: () => this.setState({ sel: tipTarget }), isCS: sel === 'Dashboard|Contribution Summary', goCS: () => this.setState({ sel: 'Dashboard|Contribution Summary' }), co: co, crRows: crRows, noCr: crList.length === 0, hasD: !!dr, d: d, isCRL: sel === 'Company Profile|Change Requests', isCRF: sel === 'Company Profile|New Change Request', isCRD: sel === 'Company Profile|Request Details', crMsg: st.crMsg || '', hasCrMsg: !!st.crMsg, crErr: st.crErr || '', hasCrErr: !!st.crErr, crCurrent: fdef ? co[fdef.k] : '-', crHint: fdef ? (fdef.need ? 'required: ' + fdef.doc : fdef.doc) : 'choose a field first', in_crf: (e) => { const fd = FIELDS.find((x) => x.label === e.target.value); this.setState({ crForm: Object.assign({}, (this.state || {}).crForm || {}, { k: fd ? fd.k : '' }) }); }, in_crn: (e) => this.setState({ crForm: Object.assign({}, (this.state || {}).crForm || {}, { n: e.target.value }) }), in_crr: (e) => this.setState({ crForm: Object.assign({}, (this.state || {}).crForm || {}, { r: e.target.value }) }), in_crd: (e) => this.setState({ crForm: Object.assign({}, (this.state || {}).crForm || {}, { d: e.target.files && e.target.files[0] ? e.target.files[0].name : '' }) }), submitCr: () => this.submitCr(), goCRF: () => this.setState({ sel: 'Company Profile|New Change Request', crForm: {}, crErr: '' }), goCRL: () => this.setState({ sel: 'Company Profile|Change Requests', crErr: '' }), dReview: () => this.setCrStatus(d.id, 'Under Review'), dApprove: () => this.setCrStatus(d.id, 'Approved'), dReject: () => this.setCrStatus(d.id, 'Rejected'), docRows: DOCS, isBI: sel === 'Company Profile|Business Information', isMD: sel === 'Company Profile|Mandatory Documents', isCL: sel === 'Company Profile|Contact & Location', isPW: sel === 'Settings|Change Password', pwDone: !!st.pwDone, pwForm: !st.pwDone, pwErr: st.pwErr || '', hasPwErr: !!st.pwErr, in_pc: (e) => this.setPw('cur', e.target.value), in_pn: (e) => this.setPw('nw', e.target.value), in_pf2: (e) => this.setPw('cf', e.target.value), updatePw: () => this.updatePw(), pwAgain: () => this.setState({ pwDone: false, pwErr: '', pw: {} }), empRows: allEmp, pHasPh: !!(pr && pr.photo), pPhoto: (pr && pr.photo) || '', hasFormPhoto: !!(st.form || {}).ph, noFormPhoto: !(st.form || {}).ph, formPhoto: (st.form || {}).ph || '',\
in_photo: (ev) => { const file = ev.target.files && ev.target.files[0]; if (!file) { return; } if (file.size > 5 * 1024 * 1024) { this.setState({ formErr: 'Photo is larger than 5 MB.' }); return; } resizePhoto(file, (url) => this.setState({ form: Object.assign({}, (this.state || {}).form || {}, { ph: url }), formErr: '' }), (m) => this.setState({ formErr: m })); },\
rmPhoto: () => this.setState({ form: Object.assign({}, (this.state || {}).form || {}, { ph: '' }) }), noEmp: allEmp.length === 0, empNote: 'Showing 1â€“' + allEmp.length + ' of ' + (48 + allEmp.length - 6) + ' employees', in_fn: hf('fn'), in_fa: hf('fa'), in_cn: hf('cn'), in_dob: hf('dob'), in_mb: hf('mb'), in_ds: hf('ds'), in_dj: hf('dj'), in_mw: hf('mw'), in_ba: hf('ba'), in_sk: hf('sk'), in_et: hf('et'), in_wt: hf('wt'), in_pf: hf('pf'), gM: hg('MALE'), gF: hg('FEMALE'), gT: hg('TRANSGENDER'), saveEmp: () => this.saveEmp(), cancelEmp: () => this.setState({ form: {}, formErr: '', savedMsg: '', editId: null, sel: 'Employee Management|Profile for Contribution' }), formErr: st.formErr || '', hasErr: !!st.formErr, savedMsg: st.savedMsg || '', hasMsg: !!st.savedMsg, notifRows: NOTIF, histRows: histRows, noHist: HIST.length === 0, hasChallan: true, noChallan: false, payStatus: paid ? 'Paid' : 'Unpaid', isPaidNow: paid, notPaidNow: !paid, isChallan: sel === 'Challans & Payments|Generate Challan', isHist: sel === 'Challans & Payments|Payment History', isRcpt: sel === 'Challans & Payments|Receipt', isNotif: sel === 'Notifications|Inbox', goPay: () => this.setState({ open: open, sel: 'Challans & Payments|Receipt', paid: true }), goReceipt: () => this.setState({ open: open, sel: 'Challans & Payments|Receipt' }), goChallan: () => this.setState({ open: open, sel: 'Challans & Payments|Generate Challan' }), goHist: () => this.setState({ open: open, sel: 'Challans & Payments|Payment History' }), sbOpen: mo ? 'open' : '', bdOn: mo ? 'on' : '', toggleMenu: () => this.setState({ menuOpen: !mo }), logout: () => { try { window.parent.postMessage({ essi: 'logout' }, '*'); } catch (x) {} }, umToggle: () => this.setState({ um: !(this.state || {}).um }), umOpen: !!(this.state || {}).um, groups: groups, isDash: sel === 'Dashboard|Overview', notDash: ['Dashboard|Overview','Employee Management|Register Employee','Employee Management|Profile for Contribution','Monthly Contributions|Monthly Contribution','Monthly Contributions|Create Contribution','Monthly Contributions|Submitted','Challans & Payments|Generate Challan','Challans & Payments|Payment History','Challans & Payments|Receipt','Challans & Payments|F-4','Challans & Payments|F-5','Challans & Payments|F-5 Voucher','Notifications|Inbox','Company Profile|Business Information','Company Profile|Mandatory Documents','Company Profile|Contact & Location','Settings|Change Password','Dashboard|Contribution Summary','Company Profile|Change Requests','Company Profile|New Change Request','Company Profile|Request Details'].indexOf(sel) < 0, isDone: sel === 'Monthly Contributions|Submitted', goDone: () => this.setState({ open: open, sel: 'Monthly Contributions|Submitted' }), isMC: sel === 'Monthly Contributions|Monthly Contribution', isCC: sel === 'Monthly Contributions|Create Contribution', goMC: () => this.setState({ open: open, sel: 'Monthly Contributions|Monthly Contribution' }), goCC: () => this.setState({ open: open, sel: 'Monthly Contributions|Create Contribution' }), isReg: sel === 'Employee Management|Register Employee', isProf: sel === 'Employee Management|Profile for Contribution', goReg: () => this.setState({ open: open, sel: 'Employee Management|Register Employee', form: {}, formErr: '', savedMsg: '', editId: null, empPanel: null }), goProf: () => this.setState({ open: open, sel: 'Employee Management|Profile for Contribution' }), selGroup: parts[0], selName: parts[1],\
goHome: () => this.setState({ open: open, sel: 'Dashboard|Overview' }) }, {"mcRows": [{"a": "November, 2026", "b": "48", "c": "PKR 106,560", "d": "Approved", "e": "Submitted", "f": "CH-2026-004512"}, {"a": "October, 2026", "b": "48", "c": "PKR 106,560", "d": "Approved", "e": "Submitted", "f": "CH-2026-004102"}, {"a": "September, 2026", "b": "46", "c": "PKR 102,120", "d": "Approved", "e": "Submitted", "f": "CH-2026-003688"}], "noMC": false, "ccRows": [{"n": "1", "name": "Ahmed Raza", "cnic": "42101-1234567-1", "mob": "0300-1234567", "type": "PERMANENT", "wage": "40000", "days": "30", "amt": "2220"}, {"n": "2", "name": "Sana Malik", "cnic": "42201-2345678-2", "mob": "0321-2345678", "type": "PERMANENT", "wage": "37000", "days": "30", "amt": "2220"}, {"n": "3", "name": "Imran Shah", "cnic": "42301-3456789-3", "mob": "0333-3456789", "type": "CONTRACTUAL", "wage": "42000", "days": "30", "amt": "2220"}, {"n": "4", "name": "Farah Naz", "cnic": "42401-5678901-5", "mob": "0345-5678901", "type": "PERMANENT", "wage": "37000", "days": "30", "amt": "2220"}, {"n": "5", "name": "Zeeshan Qureshi", "cnic": "42101-7890123-7", "mob": "0312-7890123", "type": "PERMANENT", "wage": "41000", "days": "30", "amt": "2220"}], "noCC": false,"cards": [{"name": "Active Employees", "val": 48, "ic": "M9 11a3 3 0 100-6 3 3 0 000 6zM3 20c0-3.5 2.7-5.5 6-5.5s6 2 6 5.5M16 6a3 3 0 010 5.5M17.5 14.7c2 .6 3.5 2.4 3.5 5.3", "fg": "#067a35", "bg": "#e3f2e8"}, {"name": "Contractual", "val": 6, "ic": "M7 3h8l4 4v14H7zM15 3v4h4M10 13h6M10 17h4", "fg": "#0b5fa8", "bg": "#e4f0fb"}, {"name": "Daily Wages", "val": 4, "ic": "M3 7h18v10H3zM12 14a2 2 0 100-4 2 2 0 000 4zM6 10v.01M18 14v.01", "fg": "#b45309", "bg": "#fdf0dc"}, {"name": "Piece Rated", "val": 0, "ic": "M12 3l8 4v10l-8 4-8-4V7zM4 7l8 4 8-4M12 11v10", "fg": "#6b3fa0", "bg": "#f0e9f9"}, {"name": "Permanent", "val": 36, "ic": "M4 5h16v14H4zM9 11a2 2 0 100-4 2 2 0 000 4zM6 16c0-1.7 1.3-3 3-3s3 1.3 3 3M14 9h4M14 13h4", "fg": "#067a35", "bg": "#e3f2e8"}, {"name": "Others", "val": 2, "ic": "M5 5h4v4H5zM15 5h4v4h-4zM5 15h4v4H5zM15 15h4v4h-4z", "fg": "#555555", "bg": "#eeeeee"}, {"name": "New Joined", "val": 5, "ic": "M10 12a4 4 0 100-8 4 4 0 000 8zM3 21c0-4 3-6 7-6s7 2 7 6M19 8v6M16 11h6", "fg": "#0a7f86", "bg": "#dff3f4"}, {"name": "Inactive", "val": 3, "ic": "M10 12a4 4 0 100-8 4 4 0 000 8zM3 21c0-4 3-6 7-6M16 15v6M20 15v6", "fg": "#c2570c", "bg": "#fde8d8"}, {"name": "Separated", "val": 2, "ic": "M10 12a4 4 0 100-8 4 4 0 000 8zM3 21c0-4 3-6 7-6M16 14l6 6M22 14l-6 6", "fg": "#b00020", "bg": "#fdecea"}], "rows": [{"a": "November, 2026", "b": "48", "c": "PKR 106,560", "d": "Approved", "e": "Unpaid"}], "noRows": false});\
}\
}\
<\u002Fscript><\u002Fbody><\u002Fhtml>"
  
