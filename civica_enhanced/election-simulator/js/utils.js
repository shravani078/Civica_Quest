// CivicaQuest v2.0 - Utils & Data Layer

// ============================================
// INDIA GEO DATA
// ============================================
const INDIA_GEO = {
    'Andhra Pradesh': { districts: ['Visakhapatnam', 'Krishna', 'Guntur', 'East Godavari', 'West Godavari'] },
    'Bihar': { districts: ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga'] },
    'Delhi': { districts: ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'South Delhi', 'West Delhi'] },
    'Gujarat': { districts: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'] },
    'Haryana': { districts: ['Gurugram', 'Faridabad', 'Hisar', 'Rohtak', 'Ambala'] },
    'Karnataka': { districts: ['Bengaluru Urban', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru', 'Belagavi'] },
    'Kerala': { districts: ['Thiruvananthapuram', 'Ernakulam', 'Kozhikode', 'Thrissur', 'Kollam'] },
    'Madhya Pradesh': { districts: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'] },
    'Maharashtra': { districts: ['Mumbai City', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'] },
    'Punjab': { districts: ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Bathinda'] },
    'Rajasthan': { districts: ['Jaipur', 'Jodhpur', 'Kota', 'Ajmer', 'Udaipur'] },
    'Tamil Nadu': { districts: ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'] },
    'Telangana': { districts: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'] },
    'Uttar Pradesh': { districts: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Allahabad', 'Meerut'] },
    'West Bengal': { districts: ['Kolkata', 'Howrah', 'North 24 Parganas', 'South 24 Parganas', 'Asansol'] }
};

const CONSTITUENCY_MAP = {
    'Central Delhi': ['Chandni Chowk', 'Delhi Sadar', 'Ballimaran'],
    'East Delhi': ['East Delhi PC', 'Laxmi Nagar', 'Vishwas Nagar'],
    'New Delhi': ['New Delhi PC', 'Mehrauli', 'Chhatarpur'],
    'North Delhi': ['North West Delhi', 'North East Delhi'],
    'South Delhi': ['South Delhi PC', 'Okhla', 'Kalkaji'],
    'West Delhi': ['West Delhi PC', 'Dwarka', 'Janakpuri'],
    'Mumbai City': ['Mumbai South', 'Mumbai North Central', 'Colaba'],
    'Pune': ['Pune PC', 'Khadakwasla', 'Hadapsar'],
    'Nagpur': ['Nagpur PC', 'Nagpur West', 'Nagpur East'],
    'Lucknow': ['Lucknow PC', 'Lucknow Cantt', 'Lucknow Central'],
    'Kanpur': ['Kanpur PC', 'Kanpur Cantonment'],
    'Varanasi': ['Varanasi PC', 'Varanasi North', 'Varanasi South'],
    'Chennai': ['Chennai North', 'Chennai South', 'Chennai Central'],
    'Patna': ['Patna Sahib', 'Patna Central'],
    'Bengaluru Urban': ['Bangalore North', 'Bangalore South', 'Bangalore Central'],
    'Hyderabad': ['Hyderabad PC', 'Secunderabad'],
    'Ahmedabad': ['Ahmedabad East', 'Ahmedabad West'],
    'Jaipur': ['Jaipur PC', 'Jaipur Rural'],
    'Kolkata': ['Kolkata North', 'Kolkata South']
};

// ============================================
// PHASE DATA
// ============================================
const PHASES_DATA = [
    { id: 1, name: 'Election Announcement', short: 'Announcement', icon: 'fa-megaphone', desc: 'ECI announces election schedule and dates', color: '#FF9933' },
    { id: 2, name: 'MCC Enforcement', short: 'MCC', icon: 'fa-gavel', desc: 'Model Code of Conduct comes into effect', color: '#FFA500' },
    { id: 3, name: 'Nomination Filing', short: 'Nomination', icon: 'fa-file-signature', desc: 'Candidates file nomination papers with Returning Officer', color: '#138808' },
    { id: 4, name: 'Scrutiny of Nominations', short: 'Scrutiny', icon: 'fa-search', desc: 'Returning Officer examines all nomination papers', color: '#000080' },
    { id: 5, name: 'Withdrawal of Candidature', short: 'Withdrawal', icon: 'fa-minus-circle', desc: 'Last date for withdrawal by candidates', color: '#6f42c1' },
    { id: 6, name: 'Election Campaigning', short: 'Campaign', icon: 'fa-bullhorn', desc: 'Political parties campaign for votes', color: '#dc3545' },
    { id: 7, name: 'Polling Day', short: 'Polling', icon: 'fa-vote-yea', desc: 'Voters cast their votes at polling booths', color: '#17a2b8' },
    { id: 8, name: 'Vote Counting', short: 'Counting', icon: 'fa-calculator', desc: 'Votes are counted under strict supervision', color: '#fd7e14' },
    { id: 9, name: 'Result Declaration', short: 'Results', icon: 'fa-landmark', desc: 'Winners declared, government formation begins', color: '#28a745' }
];

// ============================================
// LOCAL STORAGE HELPERS
// ============================================
const LS = {
    voters: 'civicaQuest_voters_v2',
    candidates: 'civicaQuest_candidates_v2',
    votes: 'civicaQuest_votes_v2',
    phase: 'civicaQuest_phase_v2',
    constituencies: 'civicaQuest_constituencies_v2',
    resultsDeclared: 'civicaQuest_results_declared',
    adminSession: 'civicaQuest_admin_session',
    userXP: 'civicaQuest_xp'
};

function lsGet(key, def = []) {
    try { return JSON.parse(localStorage.getItem(key)) || def; } catch { return def; }
}
function lsGetObj(key, def = {}) {
    try { return JSON.parse(localStorage.getItem(key)) || def; } catch { return def; }
}
function lsSet(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const el = document.createElement('div');
    el.className = `toast-notif ${type}`;
    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
    el.innerHTML = `<i class="fas ${icons[type] || 'fa-info-circle'}"></i> ${message}`;
    container.appendChild(el);
    setTimeout(() => { el.style.animation = 'toastOut 0.35s ease forwards'; setTimeout(() => el.remove(), 350); }, duration);
}

// Legacy compatibility
function showToastLegacy(message, type = 'info') { showToast(message, type === 'error' ? 'error' : type === 'success' ? 'success' : 'info'); }

// ============================================
// FORMATTING HELPERS
// ============================================
function formatAadhaar(input) {
    let v = input.value.replace(/\D/g, '').slice(0, 12);
    let parts = v.match(/.{1,4}/g);
    input.value = parts ? parts.join(' ') : v;
}

function formatCurrency(amount) {
    if (!amount && amount !== 0) return '—';
    return '₹' + Number(amount).toLocaleString('en-IN');
}

function formatDate(dateString) {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

function calcAge(dob) {
    if (!dob) return 0;
    const d = new Date(dob), n = new Date();
    let age = n.getFullYear() - d.getFullYear();
    if (n.getMonth() < d.getMonth() || (n.getMonth() === d.getMonth() && n.getDate() < d.getDate())) age--;
    return age;
}

function generateEPIC(stateCode) {
    const alpha = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    let letters = '';
    for (let i = 0; i < 3; i++) letters += alpha[Math.floor(Math.random() * alpha.length)];
    const nums = Math.floor(Math.random() * 9000000 + 1000000);
    return `${stateCode || 'IN'}-${letters}${nums}`;
}

function simpleHash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) { h = ((h << 5) + h) ^ str.charCodeAt(i); h = h & h; }
    return Math.abs(h).toString(36).toUpperCase().padStart(10, '0');
}

function assignBooth(constituency) {
    const num = Math.abs(simpleHash(constituency || 'DEFAULT').charCodeAt(0) * 7) % 300 + 1;
    return `BOOTH-${constituency.replace(/\s+/g, '').slice(0, 3).toUpperCase()}-${String(num).padStart(3, '0')}`;
}

// ============================================
// GEO HELPERS
// ============================================
function getConstituenciesForDistrict(district) {
    return CONSTITUENCY_MAP[district] || [district + ' Constituency', district + ' North', district + ' South'];
}

function populateDistricts(prefix) {
    const state = document.getElementById(`${prefix}State`).value;
    const districtEl = document.getElementById(`${prefix}District`);
    const constEl = document.getElementById(`${prefix}Constituency`);
    if (districtEl) { districtEl.innerHTML = '<option value="">Select District</option>'; }
    if (constEl) { constEl.innerHTML = '<option value="">Select Constituency</option>'; }
    if (!state) return;
    const data = INDIA_GEO[state];
    if (data && districtEl) {
        data.districts.forEach(d => { districtEl.innerHTML += `<option value="${d}">${d}</option>`; });
    }
}

function populateConstituencies(prefix) {
    const district = document.getElementById(`${prefix}District`)?.value;
    const constEl = document.getElementById(`${prefix}Constituency`);
    const constDL = document.getElementById(`${prefix}ConstList`);
    const boothEl = document.getElementById(`${prefix}Booth`);
    if (!district) return;
    const consts = getConstituenciesForDistrict(district);
    // Update datalist if present (new text-input mode)
    if (constDL) {
        constDL.innerHTML = '';
        consts.forEach(c => { constDL.innerHTML += `<option value="${c}">`; });
    }
    // Update select if present (legacy)
    if (constEl && constEl.tagName === 'SELECT') {
        constEl.innerHTML = '<option value="">Select Constituency</option>';
        consts.forEach(c => { constEl.innerHTML += `<option value="${c}">${c}</option>`; });
    }
    if (constEl) {
        constEl.addEventListener('change', () => {
            if (boothEl) boothEl.value = assignBooth(constEl.value);
        }, { once: false });
        constEl.addEventListener('input', () => {
            if (boothEl && constEl.value) boothEl.value = assignBooth(constEl.value);
        });
    }
}

// Populate candidate constituency datalist from saved constituencies + India data
function populateCandidateConstituencies() {
    const dl = document.getElementById('candidateConstList');
    if (!dl) return;
    dl.innerHTML = '';
    const saved = lsGet(LS.constituencies, []);
    const consts = saved.length > 0 ? saved.map(c => c.name) : Object.values(CONSTITUENCY_MAP).flat();
    consts.forEach(c => { dl.innerHTML += `<option value="${c}">`; });
}

// Populate voter constituency datalist
function populateVoterConstituencies() {
    const dl = document.getElementById('voterConstList');
    if (!dl) return;
    dl.innerHTML = '';
    const saved = lsGet(LS.constituencies, []);
    const consts = saved.length > 0 ? saved.map(c => c.name) : Object.values(CONSTITUENCY_MAP).flat();
    consts.forEach(c => { dl.innerHTML += `<option value="${c}">`; });
}

// Populate state dropdowns throughout the app
function populateStateDDs() {
    ['voterState', 'newConstState'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = '<option value="">Select State</option>';
        Object.keys(INDIA_GEO).forEach(s => { el.innerHTML += `<option value="${s}">${s}</option>`; });
    });
}

// ============================================
// XP SYSTEM
// ============================================
function addXP(points) {
    let xp = parseInt(localStorage.getItem(LS.userXP) || '0') + points;
    localStorage.setItem(LS.userXP, xp);
    const el = document.getElementById('userXP');
    if (el) el.textContent = xp;
}

// ============================================
// CONFETTI
// ============================================
function launchConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ['#FF9933', '#FFFFFF', '#138808', '#000080', '#FFD700'];
    let particles = [];
    for (let i = 0; i < 150; i++) {
        particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height - canvas.height, r: Math.random() * 7 + 3, d: Math.random() * 10 + 5, color: colors[Math.floor(Math.random() * colors.length)], tilt: Math.random() * 10 - 10, tiltAngle: 0, tiltInc: Math.random() * 0.07 + 0.05 });
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, i) => {
            ctx.beginPath(); ctx.lineWidth = p.r / 2; ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.r, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r); ctx.stroke();
            p.tiltAngle += p.tiltInc;
            p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
            p.tilt = Math.sin(p.tiltAngle - i / 3) * 15;
            if (p.y > canvas.height) particles.splice(i, 1);
        });
        if (particles.length > 0) requestAnimationFrame(draw);
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    draw();
}

function showBadgeEarned(name, icon) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `<div class="modal-content" style="text-align:center;max-width:400px;">
        <h2>🎉 Achievement Unlocked!</h2>
        <div style="font-size:5rem;margin:1.5rem 0;">${icon}</div>
        <h3 style="color:var(--saffron);">${name}</h3>
        <p style="margin:1rem 0;color:var(--text-muted);">You've earned the "<strong>${name}</strong>" badge!</p>
        <p style="font-size:1.2rem;color:var(--green);font-weight:700;">+50 XP</p>
        <button class="btn-primary" style="margin-top:1rem" onclick="this.closest('.modal').remove()">Awesome! 🎊</button>
    </div>`;
    document.body.appendChild(modal);
    addXP(50);
}

// ============================================
// VOTER CARD RENDERER
// ============================================
function renderVoterCard(voter) {
    return `<div class="voter-id-card">
        <div class="voter-card-header">
            <div class="voter-card-logo">
                <svg viewBox="0 0 60 60" width="40" height="40">
                    <circle cx="30" cy="30" r="28" fill="#FF9933"/>
                    <circle cx="30" cy="30" r="18" fill="white"/>
                    <circle cx="30" cy="30" r="9" fill="#138808"/>
                </svg>
            </div>
            <div class="voter-card-title">
                <h4>Election Commission of India</h4>
                <h3>EPIC – Voter ID Card</h3>
            </div>
        </div>
        <div class="voter-epic">${voter.id}</div>
        <div class="voter-card-row"><span class="voter-card-label">Name:</span><span class="voter-card-value">${voter.name}</span></div>
        <div class="voter-card-row"><span class="voter-card-label">DOB:</span><span class="voter-card-value">${voter.dob}</span></div>
        <div class="voter-card-row"><span class="voter-card-label">Gender:</span><span class="voter-card-value">${voter.gender}</span></div>
        <div class="voter-card-row"><span class="voter-card-label">Constituency:</span><span class="voter-card-value">${voter.constituency || '—'}</span></div>
        <div class="voter-card-row"><span class="voter-card-label">Booth:</span><span class="voter-card-value">${voter.booth || '—'}</span></div>
        <div class="voter-card-row"><span class="voter-card-label">State:</span><span class="voter-card-value">${voter.state || '—'}</span></div>
        <div class="voter-card-row" style="margin-top:0.5rem;"><span class="voter-card-label">Status:</span><span class="voter-card-value"><span class="status-pill status-${voter.status}">${voter.status.toUpperCase()}</span></span></div>
        <div class="voter-card-row"><span class="voter-card-label">Has Voted:</span><span class="voter-card-value">${voter.hasVoted ? '✅ Yes' : '❌ No'}</span></div>
    </div>`;
}

// ============================================
// EDUCATION TOGGLE
// ============================================
function toggleEduCard(card) { card.classList.toggle('active'); }
