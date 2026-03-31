// CivicaQuest v2.0 - Admin Panel Module

// ============================================
// ADMIN AUTH
// ============================================
const ADMIN_CREDS = { username: 'admin', password: 'admin123' };

function adminLogin(event) {
    event.preventDefault();
    const u = document.getElementById('adminUsername').value.trim();
    const p = document.getElementById('adminPassword').value;
    if (u === ADMIN_CREDS.username && p === ADMIN_CREDS.password) {
        lsSet(LS.adminSession, { loggedIn: true, time: Date.now() });
        APP_STATE.userRole = 'admin';
        APP_STATE.currentUser = { name: 'Admin', role: 'admin' };
        document.getElementById('currentUserName').textContent = 'Admin';
        closeModal('adminLoginModal');
        showDashboard('admin', null);
        showToast('Welcome, Election Commission Admin!', 'success');
    } else {
        showToast('Invalid credentials. Try admin / admin123', 'error');
    }
}

// ============================================
// PHASE MANAGEMENT
// ============================================
function renderPhaseControlGrid() {
    const grid = document.getElementById('phaseControlGrid');
    if (!grid) return;
    grid.innerHTML = PHASES_DATA.map(p => `
        <div class="phase-ctrl-card ${APP_STATE.currentPhase === p.id ? 'active-phase' : ''}" onclick="setPhase(${p.id})">
            <i class="fas ${p.icon}"></i>
            <h4>${p.short}</h4>
            <p>${p.desc.substring(0, 50)}...</p>
            ${APP_STATE.currentPhase === p.id ? '<span class="status-pill status-approved" style="margin-top:0.5rem">ACTIVE</span>' : ''}
        </div>`).join('');
    const lbl = document.getElementById('adminCurrentPhase');
    if (lbl) lbl.textContent = PHASES_DATA.find(p => p.id === APP_STATE.currentPhase)?.name || '';
}

function setPhase(phaseId) {
    APP_STATE.currentPhase = phaseId;
    lsSet(LS.phase, phaseId);
    updatePhaseIndicator();
    renderPhaseControlGrid();
    updateHeaderPhase();
    showToast(`Phase set to: ${PHASES_DATA.find(p => p.id === phaseId)?.name}`, 'success');
}

function advancePhase() {
    if (APP_STATE.currentPhase < 9) {
        setPhase(APP_STATE.currentPhase + 1);
    } else {
        showToast('Election process complete! All phases done.', 'info');
    }
}

function resetElection() {
    if (!confirm('⚠️ This will delete ALL election data including voters, candidates, votes and reset all phases. This cannot be undone. Continue?')) return;
    Object.values(LS).forEach(key => localStorage.removeItem(key));
    APP_STATE.voters = []; APP_STATE.candidates = []; APP_STATE.votes = [];
    APP_STATE.currentPhase = 1; APP_STATE.constituencies = [];
    showToast('Election reset successfully!', 'success');
    setTimeout(() => location.reload(), 1000);
}

function updatePhaseIndicator() {
    document.querySelectorAll('.phase-item').forEach(item => {
        const ph = parseInt(item.dataset.phase);
        item.classList.remove('active', 'completed');
        if (ph === APP_STATE.currentPhase) item.classList.add('active');
        else if (ph < APP_STATE.currentPhase) item.classList.add('completed');
    });
}

function updateHeaderPhase() {
    const phase = PHASES_DATA.find(p => p.id === APP_STATE.currentPhase);
    const txt = document.getElementById('headerPhaseText');
    if (txt && phase) txt.textContent = phase.short + ' Phase';
    const nm = document.getElementById('currentPhaseName');
    const desc = document.getElementById('currentPhaseDescription');
    if (nm) nm.textContent = phase?.name || '';
    if (desc) desc.textContent = phase?.desc || '';
}

// ============================================
// VOTER APPROVALS
// ============================================
function renderVoterApprovals() {
    const el = document.getElementById('voterApprovalsList');
    if (!el) return;
    const search = (document.getElementById('voterSearchInput')?.value || '').toLowerCase();
    const filter = document.getElementById('voterFilterStatus')?.value || '';
    let voters = APP_STATE.voters;
    if (search) voters = voters.filter(v => v.name.toLowerCase().includes(search) || v.id.toLowerCase().includes(search) || (v.aadhaar || '').includes(search));
    if (filter) voters = voters.filter(v => v.status === filter);

    const badge = document.getElementById('pendingVotersBadge');
    if (badge) badge.textContent = APP_STATE.voters.filter(v => v.status === 'pending').length;

    if (voters.length === 0) { el.innerHTML = '<p style="color:var(--text-muted);padding:1rem">No voters found matching criteria.</p>'; return; }

    el.innerHTML = `<div class="table-wrapper"><table class="data-table">
        <thead><tr><th>Voter ID</th><th>Name</th><th>DOB / Age</th><th>Constituency</th><th>Status</th><th>Voted</th><th>Actions</th></tr></thead>
        <tbody>${voters.map(v => `<tr>
            <td><strong>${v.id}</strong></td>
            <td>${v.name}<br><small style="color:var(--text-muted)">${v.gender}</small></td>
            <td>${v.dob}<br><small style="color:var(--text-muted)">Age: ${v.age}</small></td>
            <td>${v.constituency || '—'}<br><small style="color:var(--text-muted)">${v.state || ''}</small></td>
            <td><span class="status-pill status-${v.status}">${v.status.toUpperCase()}</span></td>
            <td>${v.hasVoted ? '<span style="color:var(--success)">✅ Yes</span>' : '❌ No'}</td>
            <td><div class="action-btns">
                ${v.status === 'pending' ? `<button class="btn-success btn-sm" onclick="approveVoter('${v.id}')"><i class="fas fa-check"></i> Approve</button>
                <button class="btn-danger btn-sm" onclick="rejectVoter('${v.id}')"><i class="fas fa-times"></i> Reject</button>` : ''}
                ${v.status !== 'pending' ? `<button class="btn-secondary btn-sm" onclick="viewVoterCard('${v.id}')"><i class="fas fa-id-card"></i></button>` : ''}
            </div></td>
        </tr>`).join('')}</tbody>
    </table></div>`;
}

function approveVoter(id) {
    const idx = APP_STATE.voters.findIndex(v => v.id === id);
    if (idx > -1) { APP_STATE.voters[idx].status = 'approved'; saveToLocalStorage(); renderVoterApprovals(); refreshDashboard(); showToast('Voter approved successfully!', 'success'); }
}
function rejectVoter(id) {
    const idx = APP_STATE.voters.findIndex(v => v.id === id);
    if (idx > -1) { APP_STATE.voters[idx].status = 'rejected'; saveToLocalStorage(); renderVoterApprovals(); refreshDashboard(); showToast('Voter registration rejected.', 'warning'); }
}
function viewVoterCard(id) {
    const v = APP_STATE.voters.find(v => v.id === id);
    if (!v) return;
    document.getElementById('voterCardContent').innerHTML = renderVoterCard(v);
    showModal('voterCardModal');
}

// ============================================
// CANDIDATE APPROVALS
// ============================================
function renderCandidateApprovals() {
    const el = document.getElementById('candidateApprovalsList');
    if (!el) return;
    const search = (document.getElementById('candidateSearchInput')?.value || '').toLowerCase();
    const filter = document.getElementById('candidateFilterStatus')?.value || '';
    let cands = APP_STATE.candidates;
    if (search) cands = cands.filter(c => c.name.toLowerCase().includes(search) || c.party.toLowerCase().includes(search) || c.constituency.toLowerCase().includes(search));
    if (filter) cands = cands.filter(c => c.status === filter);

    const badge = document.getElementById('pendingCandidatesBadge');
    if (badge) badge.textContent = APP_STATE.candidates.filter(c => c.status === 'pending').length;

    if (cands.length === 0) { el.innerHTML = '<p style="color:var(--text-muted);padding:1rem">No candidates found.</p>'; return; }

    el.innerHTML = `<div class="table-wrapper"><table class="data-table">
        <thead><tr><th>Candidate</th><th>Party & Symbol</th><th>Constituency</th><th>Age</th><th>Criminal</th><th>Assets</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>${cands.map(c => `<tr>
            <td><strong>${c.name}</strong><br><small style="color:var(--text-muted)">${c.gender}</small></td>
            <td>${c.symbol} ${c.party}</td>
            <td>${c.constituency}</td>
            <td>${c.age}</td>
            <td>${c.criminalCases === 'Yes' ? '<span style="color:var(--danger)">⚠️ Yes</span>' : '✅ No'}</td>
            <td>${formatCurrency(c.assets)}</td>
            <td><span class="status-pill status-${c.status}">${c.status.toUpperCase()}</span></td>
            <td><div class="action-btns">
                ${c.status === 'pending' ? `
                    <button class="btn-success btn-sm" onclick="approveCandidate('${c.id}')"><i class="fas fa-check"></i></button>
                    <button class="btn-danger btn-sm" onclick="rejectCandidate('${c.id}')"><i class="fas fa-times"></i></button>` : ''}
                ${c.status === 'approved' ? `<button class="btn-warning btn-sm" onclick="withdrawCandidate('${c.id}')"><i class="fas fa-minus"></i> Withdraw</button>` : ''}
            </div></td>
        </tr>`).join('')}</tbody>
    </table></div>`;
}

function approveCandidate(id) {
    const idx = APP_STATE.candidates.findIndex(c => c.id === id);
    if (idx > -1) { APP_STATE.candidates[idx].status = 'approved'; saveToLocalStorage(); renderCandidateApprovals(); refreshDashboard(); renderCandidatesList(); showToast('Candidate nomination approved!', 'success'); }
}
function rejectCandidate(id) {
    const idx = APP_STATE.candidates.findIndex(c => c.id === id);
    if (idx > -1) { APP_STATE.candidates[idx].status = 'rejected'; saveToLocalStorage(); renderCandidateApprovals(); refreshDashboard(); renderCandidatesList(); showToast('Nomination rejected.', 'warning'); }
}
function withdrawCandidate(id) {
    const idx = APP_STATE.candidates.findIndex(c => c.id === id);
    if (idx > -1) { APP_STATE.candidates[idx].status = 'withdrawn'; saveToLocalStorage(); renderCandidateApprovals(); renderCandidatesList(); showToast('Candidature withdrawn.', 'info'); }
}

// ============================================
// CONSTITUENCIES
// ============================================
function addConstituency() {
    const name = document.getElementById('newConstName').value.trim();
    const state = document.getElementById('newConstState').value;
    const booths = parseInt(document.getElementById('newConstBooths').value) || 100;
    if (!name || !state) { showToast('Please enter constituency name and state', 'warning'); return; }
    if (APP_STATE.constituencies.find(c => c.name.toLowerCase() === name.toLowerCase())) { showToast('Constituency already exists', 'warning'); return; }
    APP_STATE.constituencies.push({ id: Date.now().toString(), name, state, booths });
    lsSet(LS.constituencies, APP_STATE.constituencies);
    document.getElementById('newConstName').value = '';
    document.getElementById('newConstBooths').value = '';
    renderConstituenciesList();
    populateCandidateConstituencies();
    populateVoterConstituencies();
    refreshDashboard();
    showToast(`Constituency "${name}" added successfully!`, 'success');
}

function deleteConstituency(id) {
    APP_STATE.constituencies = APP_STATE.constituencies.filter(c => c.id !== id);
    lsSet(LS.constituencies, APP_STATE.constituencies);
    renderConstituenciesList();
    showToast('Constituency removed.', 'info');
}

function renderConstituenciesList() {
    const el = document.getElementById('constituenciesList');
    if (!el) return;
    const all = APP_STATE.constituencies;
    if (all.length === 0) { el.innerHTML = '<p style="color:var(--text-muted)">No custom constituencies added yet. Default India constituencies will be used.</p>'; return; }
    el.innerHTML = `<div class="table-wrapper"><table class="data-table">
        <thead><tr><th>#</th><th>Constituency</th><th>State</th><th>Booths</th><th>Candidates</th><th>Actions</th></tr></thead>
        <tbody>${all.map((c, i) => {
            const cands = APP_STATE.candidates.filter(cd => cd.constituency === c.name && cd.status === 'approved').length;
            return `<tr>
                <td>${i + 1}</td>
                <td><strong>${c.name}</strong></td>
                <td>${c.state}</td>
                <td>${c.booths}</td>
                <td>${cands}</td>
                <td><button class="btn-danger btn-sm" onclick="deleteConstituency('${c.id}')"><i class="fas fa-trash"></i></button></td>
            </tr>`;
        }).join('')}</tbody>
    </table></div>`;
    // Also update the stat
    const totalC = document.getElementById('totalConstituencies');
    if (totalC) totalC.textContent = all.length;
}

// ============================================
// COUNTING & RESULTS
// ============================================
function initiateCounting() {
    const approvedCands = APP_STATE.candidates.filter(c => c.status === 'approved');
    if (approvedCands.length === 0) { showToast('No approved candidates to count votes for!', 'error'); return; }
    if (APP_STATE.currentPhase < 7) { showToast('Polling must be completed before counting begins!', 'warning'); return; }
    lsSet(LS.resultsDeclared, true);
    setPhase(8);
    setTimeout(() => setPhase(9), 1500);
    document.getElementById('countingStatus').innerHTML = `
        <div class="verification-box success">
            <i class="fas fa-check-circle"></i>
            <div><strong>Counting Initiated!</strong><p>${APP_STATE.votes.length} votes counted for ${approvedCands.length} candidates across ${[...new Set(approvedCands.map(c => c.constituency))].length} constituencies.</p></div>
        </div>`;
    showToast('Vote counting completed! Results declared!', 'success');
    renderResults();
}

function exportCountingReport() {
    const declared = lsGetObj(LS.resultsDeclared, false);
    if (!declared) { showToast('Please initiate counting first', 'warning'); return; }
    const lines = ['Constituency,Candidate,Party,Votes,Percentage'];
    const consts = [...new Set(APP_STATE.candidates.filter(c => c.status === 'approved').map(c => c.constituency))];
    consts.forEach(con => {
        const cands = APP_STATE.candidates.filter(c => c.constituency === con && c.status === 'approved');
        const total = APP_STATE.votes.filter(v => v.constituency === con).length;
        cands.forEach(c => {
            const cnt = APP_STATE.votes.filter(v => v.candidateId === c.id).length;
            const pct = total > 0 ? ((cnt / total) * 100).toFixed(1) : 0;
            lines.push(`"${con}","${c.name}","${c.party}",${cnt},${pct}%`);
        });
    });
    downloadFile(lines.join('\n'), 'counting_report.csv', 'text/csv');
    showToast('Counting report downloaded!', 'success');
}

// ============================================
// SCHEDULE
// ============================================
function renderSchedule() {
    const el = document.getElementById('scheduleContent');
    if (!el) return;
    const today = new Date();
    const scheduleRows = PHASES_DATA.map((p, i) => {
        const offset = (i - APP_STATE.currentPhase + 1);
        const date = new Date(today.getTime() + offset * 7 * 24 * 3600 * 1000);
        const status = i + 1 < APP_STATE.currentPhase ? 'completed' : i + 1 === APP_STATE.currentPhase ? 'active' : 'upcoming';
        return { ...p, date, status };
    });
    el.innerHTML = `<div class="info-card">
        <h3><i class="fas fa-calendar-alt"></i> Election Schedule – Simulated Dates</h3>
        <table class="schedule-table">
            <thead><tr><th>#</th><th>Phase</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>${scheduleRows.map((r, i) => `
                <tr class="${r.status === 'active' ? 'current-phase' : ''}">
                    <td>${i + 1}</td>
                    <td><i class="fas ${r.icon}" style="color:${r.color};margin-right:0.5rem"></i>${r.name}</td>
                    <td>${r.date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td><span class="status-pill ${r.status === 'active' ? 'status-approved' : r.status === 'completed' ? 'status-withdrawn' : 'status-pending'}">${r.status.toUpperCase()}</span></td>
                </tr>`).join('')}
            </tbody>
        </table>
    </div>`;
}

// ============================================
// ADMIN TAB SWITCHER
// ============================================
function showAdminTab(tabName, btn) {
    document.querySelectorAll('.admin-tab-panel').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
    const panel = document.getElementById(`adminTab-${tabName}`);
    if (panel) panel.style.display = 'block';
    if (btn) btn.classList.add('active');
    // Refresh relevant content
    if (tabName === 'phases') renderPhaseControlGrid();
    if (tabName === 'voterApprovals') renderVoterApprovals();
    if (tabName === 'candidateApprovals') renderCandidateApprovals();
    if (tabName === 'constituencies') { renderConstituenciesList(); populateStateDDs(); }
    if (tabName === 'counting') {} // counting tab is self-contained
}

// ============================================
// APPROVALS LEGACY (compatibility)
// ============================================
function showApprovals(type) {
    if (type === 'voters') showAdminTab('voterApprovals', null);
    else showAdminTab('candidateApprovals', null);
}
