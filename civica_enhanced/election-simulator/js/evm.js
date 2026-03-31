// CivicaQuest v2.0 - EVM, Voting Booth & Results Module

// ============================================
// BOOTH STATE
// ============================================
let boothState = { step: 1, voter: null, inkApplied: false, form17Signed: false };

// ============================================
// POLLING BOOTH SETUP
// ============================================
function renderVotingSection() {
    const el = document.getElementById('votingContent');
    if (!el) return;

    // Check phase
    if (APP_STATE.currentPhase !== 7) {
        el.innerHTML = `<div class="verification-box error">
            <i class="fas fa-lock" style="font-size:2rem"></i>
            <div>
                <strong>Polling Booth is Closed</strong>
                <p>The polling booth is only open during the <strong>Polling Day</strong> phase (Phase 7). Current phase: <strong>${PHASES_DATA.find(p => p.id === APP_STATE.currentPhase)?.name}</strong>.</p>
                <p style="margin-top:0.5rem">Please ask the Admin to advance to Phase 7 (Polling Day).</p>
            </div>
        </div>`;
        return;
    }

    // Multi-step booth flow
    el.innerHTML = `
        <div class="booth-steps">
            <div class="booth-step-nav ${boothState.step >= 1 ? (boothState.step > 1 ? 'done' : 'active') : ''}">
                <i class="fas fa-fingerprint"></i> 1. Verify Identity
            </div>
            <div class="booth-step-nav ${boothState.step >= 2 ? (boothState.step > 2 ? 'done' : 'active') : ''}">
                <i class="fas fa-droplet"></i> 2. Ink & Form 17A
            </div>
            <div class="booth-step-nav ${boothState.step >= 3 ? 'active' : ''}">
                <i class="fas fa-vote-yea"></i> 3. Vote on EVM
            </div>
        </div>

        <div id="boothStep1" class="booth-step-content ${boothState.step === 1 ? 'active' : ''}">
            <div class="info-card">
                <h3><i class="fas fa-fingerprint"></i> Voter Identity Verification</h3>
                <div class="form-grid" style="margin-top:1rem">
                    <div class="form-group">
                        <label><i class="fas fa-id-card"></i> Voter ID (EPIC Number)</label>
                        <input type="text" id="boothVoterID" placeholder="e.g. DL-ABC1234567" value="${boothState.voter?.id || ''}">
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-calendar"></i> Date of Birth</label>
                        <input type="date" id="boothDOB">
                    </div>
                </div>
                <button class="btn-primary" onclick="verifyBoothVoter()"><i class="fas fa-shield-check"></i> Verify Voter</button>
                <div id="boothVerifyResult" style="margin-top:1rem"></div>
            </div>
        </div>

        <div id="boothStep2" class="booth-step-content ${boothState.step === 2 ? 'active' : ''}">
            <div class="info-card">
                <h3><i class="fas fa-droplet"></i> Step 2: Indelible Ink & Form 17A</h3>
                <div class="ink-simulation">
                    <div class="ink-finger" id="inkFinger">☝️</div>
                    <p style="color:var(--text-muted);font-size:0.88rem;margin:1rem 0;">Click the button to apply indelible ink on the left index finger</p>
                    <button class="btn-primary" onclick="applyInk()" id="inkBtn"><i class="fas fa-droplet"></i> Apply Indelible Ink</button>
                    <div id="inkStatus" style="margin-top:0.75rem"></div>
                </div>
                <div class="form17-block" id="form17Block" style="display:none">
                    <h4><i class="fas fa-file-signature"></i> Form 17A – Voter's Register</h4>
                    <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:0.75rem">
                        <strong>Serial No.:</strong> ${Math.floor(Math.random() * 9000) + 1000} &nbsp;|&nbsp;
                        <strong>Voter:</strong> ${boothState.voter?.name || '—'} &nbsp;|&nbsp;
                        <strong>ID:</strong> ${boothState.voter?.id || '—'}
                    </p>
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="form17Check" onchange="checkBoothReady()">
                            <span>I, <strong>${boothState.voter?.name || ''}</strong>, confirm my identity and wish to cast my vote. I have not voted before in this election.</span>
                        </label>
                    </div>
                    <button class="btn-primary" id="proceedEVMBtn" onclick="openEVM()" disabled style="margin-top:1rem">
                        <i class="fas fa-arrow-right"></i> Proceed to EVM
                    </button>
                </div>
            </div>
        </div>

        <div id="boothStep3" class="booth-step-content ${boothState.step === 3 ? 'active' : ''}">
            <div class="verification-box success">
                <i class="fas fa-check-circle" style="font-size:2rem"></i>
                <div>
                    <strong>Vote Cast Successfully!</strong>
                    <p>Thank you for participating in democracy. Your vote has been securely recorded.</p>
                </div>
            </div>
            <button class="btn-secondary" onclick="resetBooth()" style="margin-top:1.5rem"><i class="fas fa-redo"></i> Next Voter</button>
        </div>`;
}

function verifyBoothVoter() {
    const vid = document.getElementById('boothVoterID').value.trim().toUpperCase();
    const dob = document.getElementById('boothDOB').value;
    const resultEl = document.getElementById('boothVerifyResult');
    if (!vid || !dob) { showToast('Enter Voter ID and Date of Birth', 'warning'); return; }
    const voter = APP_STATE.voters.find(v => v.id.toUpperCase() === vid);
    if (!voter) { resultEl.innerHTML = `<div class="verification-box error"><i class="fas fa-times-circle"></i><div><strong>Voter Not Found</strong><p>No voter registered with ID: ${vid}. Please check the Voter ID.</p></div></div>`; return; }
    if (voter.dob !== dob) { resultEl.innerHTML = `<div class="verification-box error"><i class="fas fa-times-circle"></i><div><strong>DOB Mismatch</strong><p>Date of birth does not match records. Please try again.</p></div></div>`; return; }
    if (voter.status !== 'approved') { resultEl.innerHTML = `<div class="verification-box error"><i class="fas fa-times-circle"></i><div><strong>Not Approved</strong><p>Your registration is <strong>${voter.status}</strong>. Only approved voters can vote. Contact the Returning Officer.</p></div></div>`; return; }
    if (voter.hasVoted) { resultEl.innerHTML = `<div class="verification-box error"><i class="fas fa-ban"></i><div><strong>Already Voted</strong><p>Voter ${voter.name} has already cast their vote in this election. Multiple voting is not permitted.</p></div></div>`; return; }
    // Success
    boothState.voter = voter;
    boothState.step = 2;
    resultEl.innerHTML = `<div class="verification-box success"><i class="fas fa-check-circle"></i><div><strong>Identity Verified!</strong><p>Welcome, ${voter.name}. Please proceed to Step 2.</p></div></div>`;
    setTimeout(() => renderVotingSection(), 800);
}

function applyInk() {
    boothState.inkApplied = true;
    const finger = document.getElementById('inkFinger');
    const status = document.getElementById('inkStatus');
    const btn = document.getElementById('inkBtn');
    if (finger) { finger.style.filter = 'hue-rotate(200deg)'; finger.style.transform = 'scale(1.2)'; }
    if (status) status.innerHTML = '<span style="color:var(--success);font-weight:600"><i class="fas fa-check-circle"></i> Indelible ink applied on left index finger.</span>';
    if (btn) { btn.disabled = true; btn.style.opacity = '0.5'; }
    const form17 = document.getElementById('form17Block');
    if (form17) form17.style.display = 'block';
    showToast('Indelible ink applied!', 'success');
}

function checkBoothReady() {
    const checked = document.getElementById('form17Check')?.checked;
    const btn = document.getElementById('proceedEVMBtn');
    if (btn) btn.disabled = !(boothState.inkApplied && checked);
}

// ============================================
// EVM VOTING
// ============================================
function openEVM() {
    if (!boothState.voter) return;
    const constituency = boothState.voter.constituency;
    const approvedCands = APP_STATE.candidates.filter(c => c.constituency === constituency && c.status === 'approved');
    if (approvedCands.length === 0) {
        showToast(`No approved candidates in ${constituency}. Admin must approve candidates first.`, 'warning');
        return;
    }
    // Build EVM UI
    const ballotUnit = document.getElementById('ballotingUnit');
    const constDisp = document.getElementById('evmConstDisplay');
    if (constDisp) constDisp.innerHTML = `<div style="color:#aaa;font-size:0.8rem;margin-top:0.5rem"><i class="fas fa-map-marker-alt"></i> ${constituency}</div>`;
    if (ballotUnit) {
        ballotUnit.innerHTML = approvedCands.map((c, i) => `
            <div class="evm-candidate-row" id="evmRow-${c.id}">
                <div class="evm-serial">${i + 1}</div>
                <div class="evm-symbol-display">${c.symbol}</div>
                <div class="evm-cand-info">
                    <div class="evm-cand-name">${c.name}</div>
                    <div class="evm-cand-party">${c.party}</div>
                </div>
                <button class="evm-vote-btn" id="evmBtn-${c.id}" onclick="castVote('${c.id}')">▶</button>
            </div>`).join('');
    }
    document.getElementById('vvpatUnit').style.display = 'none';
    document.getElementById('vvpatDisplay').innerHTML = '';
    document.getElementById('ballotStatus').innerHTML = '<i class="fas fa-check-circle"></i><span>Ready to Vote</span>';
    showModal('evmModal');
}

function castVote(candidateId) {
    const candidate = APP_STATE.candidates.find(c => c.id === candidateId);
    if (!candidate || !boothState.voter) return;
    // Disable all buttons
    document.querySelectorAll('.evm-vote-btn').forEach(b => b.disabled = true);
    document.getElementById('evmRow-' + candidateId)?.classList.add('selected');
    document.getElementById('ballotStatus').innerHTML = '<i class="fas fa-check-circle" style="color:#00ff00"></i><span style="color:#00ff00">Vote Recorded!</span>';

    // Show VVPAT
    showVVPAT(candidate);

    // Store vote (anonymously - no voter ID in vote record)
    const voteHash = simpleHash(boothState.voter.id + Date.now().toString() + candidateId);
    APP_STATE.votes.push({
        id: voteHash,
        candidateId: candidateId,
        constituency: candidate.constituency,
        party: candidate.party,
        timestamp: new Date().toISOString()
        // NOTE: voter ID deliberately NOT stored for ballot secrecy
    });

    // Mark voter as voted
    const vIdx = APP_STATE.voters.findIndex(v => v.id === boothState.voter.id);
    if (vIdx > -1) APP_STATE.voters[vIdx].hasVoted = true;

    saveToLocalStorage();
    addXP(50);
}

function showVVPAT(candidate) {
    const vvpat = document.getElementById('vvpatUnit');
    const display = document.getElementById('vvpatDisplay');
    const countdown = document.getElementById('vvpatCountdown');
    const fill = document.getElementById('countdownFill');

    vvpat.style.display = 'block';
    display.innerHTML = `
        <div style="font-size:3rem;margin-bottom:0.5rem">${candidate.symbol}</div>
        <strong>${candidate.party}</strong><br>
        <span style="font-size:0.85rem">${candidate.name}</span><br>
        <div style="margin-top:0.75rem;font-size:0.75rem;color:#666">
            Date: ${new Date().toLocaleDateString('en-IN')}<br>
            Time: ${new Date().toLocaleTimeString('en-IN')}<br>
            Serial: ${simpleHash(Date.now().toString())}
        </div>`;

    let secs = 7;
    countdown.textContent = secs;
    if (fill) fill.style.width = '100%';
    const interval = setInterval(() => {
        secs--;
        if (countdown) countdown.textContent = secs;
        if (fill) fill.style.width = (secs / 7 * 100) + '%';
        if (secs <= 0) { clearInterval(interval); completeVote(); }
    }, 1000);
}

function completeVote() {
    closeModal('evmModal');
    launchConfetti();
    boothState.step = 3;
    renderVotingSection();
    showToast('Vote cast successfully! Thank you for participating!', 'success');
    refreshDashboard();
    setTimeout(() => showBadgeEarned('First Vote', '🗳️'), 800);
}

function resetBooth() {
    boothState = { step: 1, voter: null, inkApplied: false, form17Signed: false };
    renderVotingSection();
}

// ============================================
// RESULTS
// ============================================
let barChartObj = null, pieChartObj = null;

function renderResults() {
    const el = document.getElementById('resultsContent');
    const chartsDiv = document.getElementById('resultsCharts');
    const filterEl = document.getElementById('resultsConstFilter');
    if (!el) return;

    const declared = localStorage.getItem(LS.resultsDeclared) === 'true';
    if (!declared) {
        el.innerHTML = `<div class="no-results-msg">
            <i class="fas fa-clock"></i>
            <h3>Results Not Yet Declared</h3>
            <p>Vote counting has not been initiated. Admin must complete polling phase and initiate counting from the Admin Panel → Counting tab.</p>
        </div>`;
        if (chartsDiv) chartsDiv.style.display = 'none';
        return;
    }

    const approvedCands = APP_STATE.candidates.filter(c => c.status === 'approved');
    if (approvedCands.length === 0) {
        el.innerHTML = `<div class="no-results-msg"><i class="fas fa-user-tie"></i><h3>No Approved Candidates</h3><p>No candidates have been approved yet.</p></div>`;
        if (chartsDiv) chartsDiv.style.display = 'none';
        return;
    }

    // Get distinct constituencies
    const allConsts = [...new Set(approvedCands.map(c => c.constituency))];

    // Populate filter dropdown
    if (filterEl) {
        const curVal = filterEl.value;
        filterEl.innerHTML = '<option value="">All Constituencies</option>' + allConsts.map(c => `<option value="${c}" ${c === curVal ? 'selected' : ''}>${c}</option>`).join('');
    }

    const filterConst = filterEl?.value || '';
    const constsToShow = filterConst ? [filterConst] : allConsts;

    let html = '';
    let allLabels = [], allVoteData = [], allColors = [];
    const colors = ['#FF9933', '#138808', '#000080', '#dc3545', '#6f42c1', '#fd7e14', '#17a2b8', '#e83e8c'];

    constsToShow.forEach(con => {
        const cands = approvedCands.filter(c => c.constituency === con);
        const constVotes = APP_STATE.votes.filter(v => v.constituency === con);
        const total = constVotes.length;
        const results = cands.map(c => ({ cand: c, count: constVotes.filter(v => v.candidateId === c.id).length }));
        results.sort((a, b) => b.count - a.count);
        const winner = results[0];
        const pct = v => total > 0 ? ((v / total) * 100).toFixed(1) : '0.0';

        allLabels.push(...results.map(r => r.cand.name));
        allVoteData.push(...results.map(r => r.count));
        allColors.push(...results.map((_, i) => colors[i % colors.length]));

        html += `<div class="result-constituency-block">
            <h3 style="color:var(--navy);margin-bottom:1rem"><i class="fas fa-map-marker-alt" style="color:var(--saffron)"></i> ${con}</h3>
            <div class="result-winner-block">
                <div class="winner-trophy">🏆</div>
                <div class="winner-info">
                    <h3>${winner.cand.symbol} ${winner.cand.name}</h3>
                    <p>${winner.cand.party} &nbsp;·&nbsp; <strong>${winner.count}</strong> votes &nbsp;·&nbsp; <strong>${pct(winner.count)}%</strong></p>
                </div>
            </div>
            <div class="table-wrapper" style="margin-bottom:1rem">
                <table class="data-table">
                    <thead><tr><th>Rank</th><th>Candidate</th><th>Party</th><th>Votes</th><th>%</th></tr></thead>
                    <tbody>${results.map((r, i) => `<tr>
                        <td><strong>${i + 1}</strong></td>
                        <td>${r.cand.symbol} <strong>${r.cand.name}</strong></td>
                        <td>${r.cand.party}</td>
                        <td><strong>${r.count}</strong></td>
                        <td><strong>${pct(r.count)}%</strong></td>
                    </tr>`).join('')}
                    <tr style="background:var(--bg-secondary)"><td colspan="3"><strong>Total</strong></td><td><strong>${total}</strong></td><td>100%</td></tr>
                    </tbody>
                </table>
            </div>
            <div>${results.map((r, i) => `
                <div class="vote-bar-row">
                    <div class="vote-bar-label" title="${r.cand.name}">${r.cand.symbol} ${r.cand.name}</div>
                    <div class="vote-bar-track"><div class="vote-bar-fill ${i === 0 ? 'winner' : 'other'}" style="width:${pct(r.count)}%"></div></div>
                    <div class="vote-bar-count">${r.count} (${pct(r.count)}%)</div>
                </div>`).join('')}
            </div>
        </div>`;
    });

    el.innerHTML = html || '<div class="no-results-msg"><i class="fas fa-info-circle"></i><p>No results for selected constituency.</p></div>';

    if (chartsDiv) {
        chartsDiv.style.display = 'block';
        renderResultCharts(allLabels, allVoteData, allColors);
    }
}

function renderResultCharts(labels, data, colors) {
    if (barChartObj) barChartObj.destroy();
    if (pieChartObj) pieChartObj.destroy();
    const barCtx = document.getElementById('resultsBarChart');
    const pieCtx = document.getElementById('resultsPieChart');
    if (barCtx && labels.length > 0) {
        barChartObj = new Chart(barCtx, {
            type: 'bar',
            data: { labels, datasets: [{ label: 'Votes', data, backgroundColor: colors, borderRadius: 8 }] },
            options: { responsive: true, plugins: { legend: { display: false }, title: { display: true, text: 'Votes Per Candidate', font: { size: 14 } } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
        });
    }
    if (pieCtx && labels.length > 0) {
        pieChartObj = new Chart(pieCtx, {
            type: 'doughnut',
            data: { labels, datasets: [{ data, backgroundColor: colors }] },
            options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { padding: 15 } }, title: { display: true, text: 'Vote Share Distribution', font: { size: 14 } } } }
        });
    }
}

function exportResultsCSV() {
    const declared = localStorage.getItem(LS.resultsDeclared) === 'true';
    if (!declared) { showToast('Results not yet declared', 'warning'); return; }
    const lines = ['Constituency,Candidate,Party,Symbol,Votes,Percentage,Result'];
    const consts = [...new Set(APP_STATE.candidates.filter(c => c.status === 'approved').map(c => c.constituency))];
    consts.forEach(con => {
        const cands = APP_STATE.candidates.filter(c => c.constituency === con && c.status === 'approved');
        const total = APP_STATE.votes.filter(v => v.constituency === con).length;
        const results = cands.map(c => ({ c, count: APP_STATE.votes.filter(v => v.candidateId === c.id).length })).sort((a, b) => b.count - a.count);
        results.forEach((r, i) => {
            const pct = total > 0 ? ((r.count / total) * 100).toFixed(1) : '0.0';
            lines.push(`"${con}","${r.c.name}","${r.c.party}","${r.c.symbol}",${r.count},${pct}%,${i === 0 ? 'WINNER' : ''}`);
        });
    });
    downloadFile(lines.join('\n'), 'election_results.csv', 'text/csv');
    showToast('Results exported to CSV!', 'success');
}

function exportResultsPDF() {
    showToast('Opening print dialog for PDF export...', 'info');
    setTimeout(() => window.print(), 500);
}

// ============================================
// CANDIDATES LIST VIEW
// ============================================
function renderCandidatesList() {
    const el = document.getElementById('candidatesListContent');
    if (!el) return;
    const search = (document.getElementById('candListSearch')?.value || '').toLowerCase();
    const filterConst = document.getElementById('candListConst')?.value || '';
    let cands = APP_STATE.candidates;
    if (search) cands = cands.filter(c => c.name.toLowerCase().includes(search) || c.party.toLowerCase().includes(search));
    if (filterConst) cands = cands.filter(c => c.constituency === filterConst);
    if (cands.length === 0) { el.innerHTML = '<p style="color:var(--text-muted);padding:1.5rem">No candidates found.</p>'; return; }
    el.innerHTML = cands.map(c => `
        <div class="candidate-card">
            <div class="cand-symbol">${c.symbol}</div>
            <div class="cand-info">
                <h4>${c.name} <span class="status-pill status-${c.status}" style="font-size:0.7rem">${c.status.toUpperCase()}</span></h4>
                <p>${c.party} &nbsp;·&nbsp; ${c.constituency}</p>
                <div class="cand-meta">
                    <span><i class="fas fa-user"></i> Age ${c.age}</span>
                    <span><i class="fas fa-graduation-cap"></i> ${c.education || '—'}</span>
                    <span><i class="fas fa-rupee-sign"></i> Assets: ${formatCurrency(c.assets)}</span>
                    <span><i class="fas fa-gavel"></i> Criminal: ${c.criminalCases}</span>
                    <span><i class="fas fa-calendar"></i> Filed: ${formatDate(c.nominationDate)}</span>
                </div>
            </div>
        </div>`).join('');
}

// Populate filter for candidates list
function populateCandListFilter() {
    const el = document.getElementById('candListConst');
    if (!el) return;
    const consts = [...new Set(APP_STATE.candidates.map(c => c.constituency))];
    el.innerHTML = '<option value="">All Constituencies</option>' + consts.map(c => `<option value="${c}">${c}</option>`).join('');
}

// ============================================
// VOTERS LIST VIEW
// ============================================
function renderVotersList() {
    const el = document.getElementById('votersListContent');
    if (!el) return;
    const search = (document.getElementById('voterListSearch')?.value || '').toLowerCase();
    const filterConst = document.getElementById('voterListConst')?.value || '';
    let voters = APP_STATE.voters;
    if (search) voters = voters.filter(v => v.name.toLowerCase().includes(search) || v.id.toLowerCase().includes(search));
    if (filterConst) voters = voters.filter(v => v.constituency === filterConst);
    if (voters.length === 0) { el.innerHTML = '<p style="color:var(--text-muted);padding:1.5rem">No voters found.</p>'; return; }
    el.innerHTML = `<div class="table-wrapper"><table class="data-table">
        <thead><tr><th>Voter ID</th><th>Name</th><th>DOB</th><th>Gender</th><th>Constituency</th><th>Status</th><th>Voted</th></tr></thead>
        <tbody>${voters.slice(0, 100).map(v => `<tr>
            <td><strong>${v.id}</strong></td>
            <td>${v.name}</td>
            <td>${v.dob}</td>
            <td>${v.gender}</td>
            <td>${v.constituency || '—'}</td>
            <td><span class="status-pill status-${v.status}">${v.status.toUpperCase()}</span></td>
            <td>${v.hasVoted ? '✅' : '❌'}</td>
        </tr>`).join('')}</tbody>
    </table></div>${voters.length > 100 ? `<p style="padding:0.75rem;color:var(--text-muted);font-size:0.82rem">Showing first 100 of ${voters.length} voters.</p>` : ''}`;
}

// ============================================
// FILE DOWNLOAD UTILITY
// ============================================
function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
}
