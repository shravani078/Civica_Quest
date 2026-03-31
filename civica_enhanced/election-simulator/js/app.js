// CivicaQuest v2.0 - Main Application Module
// Extends original app.js with full feature set

// ============================================
// APP STATE (extended from original)
// ============================================
const APP_STATE = {
    currentPhase: 1,
    currentUser: null,
    userRole: null,
    voters: [],
    candidates: [],
    votes: [],
    constituencies: [],
    admin: { username: 'admin', password: 'admin123' }
};

let selectedCandidateSymbol = null;

// ============================================
// INITIALIZATION
// ============================================
window.onload = function () { initializeApp(); };

function initializeApp() {
    const loadingMsgs = ['Loading Electoral Roll...', 'Initialising EVM Module...', 'Setting Up Constituencies...', 'Configuring Admin Panel...', 'Democracy Ready!'];
    let progress = 0, msgIdx = 0;
    const bar = document.getElementById('loadProgress');
    const txt = document.getElementById('loadingText');

    const interval = setInterval(() => {
        progress += 5;
        if (bar) bar.style.width = progress + '%';
        if (progress % 20 === 0 && txt && loadingMsgs[msgIdx]) { txt.textContent = loadingMsgs[msgIdx++]; }
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                document.getElementById('loadingScreen').style.display = 'none';
                document.getElementById('app').style.display = 'block';
                document.getElementById('loginScreen').style.display = 'flex';
                generateAshokaChakra();
                initDataAndUI();
            }, 400);
        }
    }, 80);
}

function initDataAndUI() {
    loadFromLocalStorage();
    populateStateDDs();
    populateCandidateConstituencies();
    populateVoterConstituencies();
    updatePhaseIndicator();
    updateHeaderPhase();
    refreshDashboard();
    // Check admin session persistence
    const session = lsGetObj(LS.adminSession);
    if (session.loggedIn && Date.now() - session.time < 3600000) {
        APP_STATE.userRole = 'admin';
        APP_STATE.currentUser = { name: 'Admin', role: 'admin' };
        document.getElementById('currentUserName').textContent = 'Admin';
    }
}

function generateAshokaChakra() {
    ['spokes', 'spokes2'].forEach(id => {
        const g = document.getElementById(id);
        if (!g) return;
        const cx = id === 'spokes' ? 100 : 50, cy = cx, ir = id === 'spokes' ? 15 : 8, or = id === 'spokes' ? 88 : 44;
        for (let i = 0; i < 24; i++) {
            const angle = (i * 15) * Math.PI / 180;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', cx + ir * Math.cos(angle));
            line.setAttribute('y1', cy + ir * Math.sin(angle));
            line.setAttribute('x2', cx + or * Math.cos(angle));
            line.setAttribute('y2', cy + or * Math.sin(angle));
            line.setAttribute('stroke', '#000080');
            line.setAttribute('stroke-width', id === 'spokes' ? '2' : '1');
            g.appendChild(line);
        }
    });
}

// ============================================
// NAVIGATION & DASHBOARD
// ============================================
function showLogin(role) {
    if (role === 'admin') showModal('adminLoginModal');
    else if (role === 'voter') { showModal('voterRegistrationModal'); initVoterModal(); }
    else if (role === 'candidate') { showModal('candidateNominationModal'); populateCandidateConstituencies(); }
}

function showDashboard(section, event) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainDashboard').style.display = 'block';
    document.querySelectorAll('.dashboard-section').forEach(s => s.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    const sectionMap = {
        overview: 'overviewDashboard', admin: 'adminDashboard', register: 'registerDashboard',
        candidates: 'candidatesDashboard', voters: 'votersDashboard', nomination: 'nominationDashboard',
        campaign: 'campaignDashboard', voting: 'votingDashboard', results: 'resultsDashboard',
        schedule: 'scheduleDashboard', education: 'educationDashboard'
    };
    const el = document.getElementById(sectionMap[section]);
    if (el) el.style.display = 'block';
    if (event) {
        const navItem = event.target?.closest?.('.nav-item');
        if (navItem) navItem.classList.add('active');
    } else {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(n => { if (n.getAttribute('onclick')?.includes(`'${section}'`)) n.classList.add('active'); });
    }
    // Section-specific setup
    if (section === 'overview') refreshDashboard();
    if (section === 'admin') initAdminSection();
    if (section === 'register') { renderRecentVoters(); }
    if (section === 'candidates') { renderCandidatesList(); populateCandListFilter(); populateResultsConstFilter('candListConst'); }
    if (section === 'voters') { renderVotersList(); populateResultsConstFilter('voterListConst'); }
    if (section === 'nomination') renderNominations();
    if (section === 'voting') renderVotingSection();
    if (section === 'results') { renderResults(); populateResultsConstFilter('resultsConstFilter'); }
    if (section === 'schedule') renderSchedule();
    if (section === 'campaign') renderCampaignSection();
}

function populateResultsConstFilter(selectId) {
    const el = document.getElementById(selectId);
    if (!el) return;
    const consts = [...new Set(APP_STATE.candidates.filter(c => c.status === 'approved').map(c => c.constituency))];
    const cur = el.value;
    el.innerHTML = '<option value="">All Constituencies</option>' + consts.map(c => `<option value="${c}" ${c === cur ? 'selected' : ''}>${c}</option>`).join('');
}

function initAdminSection() {
    if (APP_STATE.userRole !== 'admin') {
        // Check persistent session
        const session = lsGetObj(LS.adminSession);
        if (!(session.loggedIn && Date.now() - session.time < 3600000)) {
            showModal('adminLoginModal');
            return;
        }
        APP_STATE.userRole = 'admin';
        APP_STATE.currentUser = { name: 'Admin', role: 'admin' };
    }
    renderPhaseControlGrid();
    renderVoterApprovals();
    renderCandidateApprovals();
    renderConstituenciesList();
    populateStateDDs();
    // Show first tab
    document.querySelectorAll('.admin-tab-panel').forEach(p => p.style.display = 'none');
    const first = document.getElementById('adminTab-phases');
    if (first) first.style.display = 'block';
    document.querySelectorAll('.admin-tab-btn').forEach((b, i) => b.classList[i === 0 ? 'add' : 'remove']('active'));
}

// ============================================
// VOTER REGISTRATION
// ============================================
function initVoterModal() {
    populateStateDDs();
    populateVoterConstituencies();
    document.getElementById('voterRegistrationForm')?.reset();
    document.getElementById('ageVerification').style.display = 'none';
}

function calculateAge() {
    const dob = document.getElementById('voterDOB').value;
    const age = calcAge(dob);
    const verDiv = document.getElementById('ageVerification');
    const successDiv = document.getElementById('ageSuccess');
    const errorDiv = document.getElementById('ageError');
    const btn = document.getElementById('submitVoterBtn');
    verDiv.style.display = 'block';
    if (age >= 18) {
        successDiv.style.display = 'flex'; errorDiv.style.display = 'none';
        document.getElementById('calculatedAge').textContent = age;
        if (btn) btn.disabled = false;
    } else {
        successDiv.style.display = 'none'; errorDiv.style.display = 'flex';
        document.getElementById('calculatedAgeError').textContent = age;
        if (btn) btn.disabled = true;
    }
}

function registerVoter(event) {
    event.preventDefault();
    const name = document.getElementById('voterFullName').value.trim();
    const dob = document.getElementById('voterDOB').value;
    const gender = document.getElementById('voterGender').value;
    const aadhaar = document.getElementById('voterAadhaar').value.replace(/\s/g, '');
    const mobile = document.getElementById('voterMobile').value.trim();
    const address = document.getElementById('voterAddress').value.trim();
    const state = document.getElementById('voterState').value;
    const district = document.getElementById('voterDistrict').value;
    const constituency = document.getElementById('voterConstituency').value;
    const booth = document.getElementById('voterBooth').value || assignBooth(constituency || district);
    const consent = document.getElementById('voterConsent').checked;

    if (!consent) { showToast('Please accept the declaration', 'warning'); return; }
    if (aadhaar.length !== 12 || !/^\d+$/.test(aadhaar)) { showToast('Aadhaar must be exactly 12 digits', 'error'); return; }
    if (!/^\d{10}$/.test(mobile)) { showToast('Mobile must be exactly 10 digits', 'error'); return; }
    const age = calcAge(dob);
    if (age < 18) { showToast('Not eligible to vote. Age must be 18 or above.', 'error'); return; }
    if (APP_STATE.voters.find(v => v.aadhaar === aadhaar)) { showToast('This Aadhaar number is already registered!', 'error'); return; }

    const stateCode = state ? state.substring(0, 2).toUpperCase() : 'IN';
    const voter = {
        id: generateEPIC(stateCode),
        name, dob, gender, aadhaar, mobile, address, state, district,
        constituency: constituency || district,
        booth: booth || assignBooth(constituency || district || 'DEFAULT'),
        age, status: 'pending', hasVoted: false,
        registeredDate: new Date().toISOString()
    };

    APP_STATE.voters.push(voter);
    saveToLocalStorage();
    closeModal('voterRegistrationModal');
    document.getElementById('voterRegistrationForm').reset();
    document.getElementById('ageVerification').style.display = 'none';
    showToast(`Registration submitted! Your Voter ID: ${voter.id}. Awaiting Admin approval.`, 'success', 6000);
    refreshDashboard();
    renderRecentVoters();

    // Show EPIC card
    setTimeout(() => {
        document.getElementById('voterCardContent').innerHTML = renderVoterCard(voter) +
            `<div class="info-box" style="margin-top:1rem"><i class="fas fa-info-circle"></i> Your Voter ID is <strong>${voter.id}</strong>. Keep this safe – you need it to vote!</div>`;
        showModal('voterCardModal');
    }, 500);
    addXP(20);
}

function generateVoterID(stateCode) { return generateEPIC(stateCode); } // legacy compatibility

// ============================================
// VOTER LOOKUP & SEARCH
// ============================================
function quickVoterLookup() {
    const q = document.getElementById('quickLookupInput').value.trim().toUpperCase();
    const resultEl = document.getElementById('quickLookupResult');
    if (!q) return;
    const voter = APP_STATE.voters.find(v => v.id.toUpperCase() === q || v.aadhaar === q.replace(/\s/g, ''));
    if (voter) { resultEl.innerHTML = renderVoterCard(voter); }
    else { resultEl.innerHTML = `<div class="verification-box error" style="margin-top:0.75rem"><i class="fas fa-times-circle"></i><div><strong>Not Found</strong><p>No voter registered with ID/Aadhaar: ${q}</p></div></div>`; }
}

function checkVoterStatus() {
    const q = document.getElementById('voterStatusInput').value.trim().toUpperCase();
    const resultEl = document.getElementById('voterStatusResult');
    if (!q) return;
    const voter = APP_STATE.voters.find(v => v.id.toUpperCase() === q || v.aadhaar === q.replace(/\s/g, ''));
    if (voter) { resultEl.innerHTML = renderVoterCard(voter); }
    else { resultEl.innerHTML = `<div class="verification-box error" style="margin-top:0.5rem"><i class="fas fa-times-circle"></i><div><strong>Not Found</strong><p>No voter found with this ID or Aadhaar.</p></div></div>`; }
}

function renderRecentVoters() {
    const el = document.getElementById('recentVotersList');
    if (!el) return;
    const recent = APP_STATE.voters.slice(-10).reverse();
    if (recent.length === 0) { el.innerHTML = '<p style="color:var(--text-muted)">No voters registered yet.</p>'; return; }
    el.innerHTML = recent.map(v => `
        <div class="recent-voter-item">
            <div>
                <strong>${v.name}</strong> &nbsp;
                <span style="color:var(--text-muted);font-size:0.8rem">${v.id} · ${v.constituency || v.state || '—'}</span>
            </div>
            <span class="status-pill status-${v.status}">${v.status.toUpperCase()}</span>
        </div>`).join('');
}

// ============================================
// CANDIDATE NOMINATION
// ============================================
function calculateCandidateAge() {
    const dob = document.getElementById('candidateDOB').value;
    const age = calcAge(dob);
    const ageInput = document.getElementById('candidateAge');
    const checkDiv = document.getElementById('candidateAgeCheck');
    if (ageInput) ageInput.value = age;
    if (checkDiv) {
        checkDiv.style.display = 'block';
        checkDiv.innerHTML = age >= 25 ?
            `<div class="verification-box success"><i class="fas fa-check-circle"></i><div><strong>Eligible for Lok Sabha</strong><p>Age: ${age} years (Minimum: 25)</p></div></div>` :
            `<div class="verification-box error"><i class="fas fa-times-circle"></i><div><strong>Not Eligible</strong><p>Age: ${age} years. Minimum required: 25 years for Lok Sabha.</p></div></div>`;
    }
}

function selectSymbol(symbol, name) {
    document.querySelectorAll('.symbol-option').forEach(o => o.classList.remove('selected'));
    event.target.closest('.symbol-option').classList.add('selected');
    document.getElementById('selectedSymbol').value = symbol;
    document.getElementById('selectedSymbolName').value = name;
    selectedCandidateSymbol = { symbol, name };
}

function toggleCriminalDetails() {
    const val = document.querySelector('input[name="criminalCases"]:checked')?.value;
    document.getElementById('criminalDetailsGroup').style.display = val === 'Yes' ? 'block' : 'none';
}

function submitNomination(event) {
    event.preventDefault();
    const name = document.getElementById('candidateName').value.trim();
    const dob = document.getElementById('candidateDOB').value;
    const age = parseInt(document.getElementById('candidateAge').value);
    const gender = document.getElementById('candidateGender').value;
    const voterID = document.getElementById('candidateVoterID').value.trim().toUpperCase();
    const constituency = document.getElementById('candidateConstituency').value;
    const party = document.getElementById('candidateParty').value.trim();
    const education = document.getElementById('candidateEducation').value;
    const deposit = document.getElementById('nominationDeposit').value;
    const assets = document.getElementById('candidateAssets').value;
    const liabilities = document.getElementById('candidateLiabilities').value;
    const criminal = document.querySelector('input[name="criminalCases"]:checked')?.value || 'No';
    const criminalDetails = document.getElementById('criminalDetails')?.value || '';
    const proposer = document.getElementById('proposerName').value.trim();
    const proposerID = document.getElementById('proposerVoterID').value.trim().toUpperCase();
    const affidavit = document.getElementById('affidavitCheck').checked;
    const depositCheck = document.getElementById('depositCheck').checked;

    if (age < 25) { showToast('Candidate must be at least 25 years old for Lok Sabha!', 'error'); return; }
    if (!selectedCandidateSymbol) { showToast('Please select a party symbol!', 'error'); return; }
    if (!constituency) { showToast('Please select a constituency', 'error'); return; }

    // Verify candidate is a registered voter
    const candVoter = APP_STATE.voters.find(v => v.id.toUpperCase() === voterID);
    if (!candVoter) { showToast(`Voter ID ${voterID} not found. Candidate must be a registered voter.`, 'error'); return; }

    // Check if already filed nomination
    if (APP_STATE.candidates.find(c => c.voterID === voterID)) { showToast('This voter has already filed a nomination!', 'error'); return; }

    const candidate = {
        id: 'CAND-' + Date.now(),
        name, dob, age, gender,
        voterID,
        constituency, party,
        symbol: selectedCandidateSymbol.symbol,
        symbolName: selectedCandidateSymbol.name,
        education, deposit, assets: Number(assets), liabilities: Number(liabilities),
        criminalCases: criminal, criminalDetails,
        proposer, proposerID,
        affidavit, status: 'pending',
        nominationDate: new Date().toISOString(),
        votes: 0
    };

    APP_STATE.candidates.push(candidate);
    saveToLocalStorage();
    selectedCandidateSymbol = null;
    document.querySelectorAll('.symbol-option').forEach(o => o.classList.remove('selected'));
    closeModal('candidateNominationModal');
    document.getElementById('candidateNominationForm').reset();
    document.getElementById('candidateAgeCheck').style.display = 'none';
    showScrutinyAnimation(candidate);
    addXP(30);
}

function showScrutinyAnimation(candidate) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `<div class="modal-content" style="text-align:center;max-width:480px;">
        <h2><i class="fas fa-search"></i> Nomination Under Scrutiny</h2>
        <div style="margin:2rem 0;">
            <svg class="rotating" viewBox="0 0 200 200" width="100" height="100">
                <circle cx="100" cy="100" r="90" fill="none" stroke="#000080" stroke-width="3"/>
                <circle cx="100" cy="100" r="15" fill="#000080"/>
            </svg>
            <p style="margin-top:1.5rem;color:var(--text-muted)">Nomination for <strong>${candidate.name}</strong> (${candidate.party}) is being reviewed by the Returning Officer...</p>
        </div>
        <div class="info-box"><i class="fas fa-info-circle"></i> Admin must approve this nomination from the Admin Panel → Candidates tab</div>
    </div>`;
    document.body.appendChild(modal);
    setTimeout(() => { modal.remove(); showToast('Nomination filed successfully! Awaiting scrutiny.', 'success'); renderNominations(); }, 3000);
}

function renderNominations() {
    const el = document.getElementById('nominationsContent');
    if (!el) return;
    if (APP_STATE.candidates.length === 0) { el.innerHTML = '<p style="color:var(--text-muted)">No nominations filed yet.</p>'; return; }
    el.innerHTML = APP_STATE.candidates.map(c => `
        <div class="candidate-card">
            <div class="cand-symbol">${c.symbol}</div>
            <div class="cand-info">
                <h4>${c.name} <span class="status-pill status-${c.status}" style="font-size:0.7rem">${c.status.toUpperCase()}</span></h4>
                <p>${c.party} · ${c.constituency}</p>
                <div class="cand-meta">
                    <span><i class="fas fa-calendar"></i> ${formatDate(c.nominationDate)}</span>
                    <span><i class="fas fa-rupee-sign"></i> Assets: ${formatCurrency(c.assets)}</span>
                    <span><i class="fas fa-gavel"></i> Criminal: ${c.criminalCases}</span>
                </div>
            </div>
        </div>`).join('');
}

// ============================================
// USER PROFILE & MENU
// ============================================
function toggleUserMenu() { document.getElementById('userMenu').classList.toggle('active'); }

function showUserProfile() {
    closeMenu();
    if (!APP_STATE.currentUser) { showToast('Please login first', 'warning'); return; }
    if (APP_STATE.currentUser.role !== 'voter') { showToast('Profile available for voters only', 'info'); return; }
    const voter = APP_STATE.voters.find(v => v.id === APP_STATE.currentUser.id);
    if (voter) {
        document.getElementById('voterCardContent').innerHTML = renderVoterCard(voter);
        showModal('voterCardModal');
    }
}
function showBadges() { closeMenu(); showToast('Badges coming soon!', 'info'); }
function logout() {
    closeMenu();
    APP_STATE.currentUser = null; APP_STATE.userRole = null;
    lsSet(LS.adminSession, { loggedIn: false });
    document.getElementById('mainDashboard').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('currentUserName').textContent = 'Guest';
    showToast('Logged out successfully!', 'success');
}
function closeMenu() { document.getElementById('userMenu').classList.remove('active'); }
document.addEventListener('click', e => { if (!e.target.closest('#userMenuBtn') && !e.target.closest('#userMenu')) closeMenu(); });

// ============================================
// DASHBOARD STATS & REFRESH
// ============================================
function refreshDashboard() {
    const approved = APP_STATE.voters.filter(v => v.status === 'approved').length;
    const voted = APP_STATE.voters.filter(v => v.hasVoted).length;
    const turnout = approved > 0 ? ((voted / approved) * 100).toFixed(1) : 0;
    const approvedCands = APP_STATE.candidates.filter(c => c.status === 'approved').length;
    const setEl = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
    setEl('totalVoters', APP_STATE.voters.length);
    setEl('approvedVoters', approved);
    setEl('totalCandidates', approvedCands);
    setEl('totalVotes', APP_STATE.votes.length);
    setEl('turnoutPercent', turnout + '%');
    setEl('totalConstituencies', APP_STATE.constituencies.length || Object.values(CONSTITUENCY_MAP).flat().length);
    // Pending badges
    const pVoters = APP_STATE.voters.filter(v => v.status === 'pending').length;
    const pCands = APP_STATE.candidates.filter(c => c.status === 'pending').length;
    const pvb = document.getElementById('pendingVotersBadge');
    const pcb = document.getElementById('pendingCandidatesBadge');
    if (pvb) pvb.textContent = pVoters;
    if (pcb) pcb.textContent = pCands;
    // XP
    const xpEl = document.getElementById('userXP');
    if (xpEl) xpEl.textContent = localStorage.getItem(LS.userXP) || 0;
}

// ============================================
// MODAL HELPERS
// ============================================
function showModal(id) { const m = document.getElementById(id); if (m) m.classList.add('active'); }
function closeModal(id) { const m = document.getElementById(id); if (m) m.classList.remove('active'); }

// Close modals on backdrop click
document.addEventListener('click', e => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// ============================================
// LOCAL STORAGE
// ============================================
function saveToLocalStorage() {
    lsSet(LS.voters, APP_STATE.voters);
    lsSet(LS.candidates, APP_STATE.candidates);
    lsSet(LS.votes, APP_STATE.votes);
    lsSet(LS.phase, APP_STATE.currentPhase);
    lsSet(LS.constituencies, APP_STATE.constituencies);
}

function loadFromLocalStorage() {
    APP_STATE.voters = lsGet(LS.voters, []);
    APP_STATE.candidates = lsGet(LS.candidates, []);
    APP_STATE.votes = lsGet(LS.votes, []);
    APP_STATE.currentPhase = parseInt(lsGetObj(LS.phase, 1)) || 1;
    APP_STATE.constituencies = lsGet(LS.constituencies, []);
}
