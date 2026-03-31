// CivicaQuest v2.0 - Campaign Module
// Candidates approach voters and ask for votes through their manifestos

// ============================================
// CAMPAIGN STATE
// ============================================
let campaignState = {
    activeCandidate: null,
    targetVoter: null,
    interactionLog: [],
    manifestos: {}  // candidateId -> manifesto text
};

// Sample manifesto templates per party type
const MANIFESTO_TEMPLATES = {
    default: [
        "Jobs & Employment", "Education for All", "Healthcare Access",
        "Infrastructure Development", "Women Empowerment", "Farmers Welfare",
        "Digital India", "Clean Energy", "Anti-Corruption", "Rural Development"
    ],
    promises: [
        "₹5 lakh health insurance per family",
        "Free education till Class 12",
        "₹6000/year for every farmer",
        "50 lakh new jobs in 5 years",
        "Smart city development",
        "Zero-tolerance anti-corruption policy",
        "24×7 electricity in all villages",
        "Women safety task force",
        "Free skill training for youth",
        "Clean drinking water for all"
    ]
};

// ============================================
// RENDER CAMPAIGN SECTION
// ============================================
function renderCampaignSection() {
    const el = document.getElementById('campaignContent');
    if (!el) return;

    const approvedCands = APP_STATE.candidates.filter(c => c.status === 'approved');
    const approvedVoters = APP_STATE.voters.filter(v => v.status === 'approved');

    if (APP_STATE.currentPhase < 6) {
        el.innerHTML = `<div class="verification-box error">
            <i class="fas fa-lock" style="font-size:2rem"></i>
            <div>
                <strong>Campaigning Not Yet Started</strong>
                <p>Campaigns begin during <strong>Phase 6 – Election Campaigning</strong>. Current phase: <strong>${PHASES_DATA.find(p => p.id === APP_STATE.currentPhase)?.name || 'Unknown'}</strong>.</p>
                <p style="margin-top:0.5rem">Ask the Admin to advance to Phase 6 to begin campaigning.</p>
            </div>
        </div>`;
        return;
    }

    if (approvedCands.length === 0) {
        el.innerHTML = `<div class="verification-box error">
            <i class="fas fa-user-tie" style="font-size:2rem"></i>
            <div><strong>No Approved Candidates</strong><p>Admin must approve at least one candidate before campaigns can begin.</p></div>
        </div>`;
        return;
    }

    if (approvedVoters.length === 0) {
        el.innerHTML = `<div class="verification-box error">
            <i class="fas fa-users" style="font-size:2rem"></i>
            <div><strong>No Approved Voters</strong><p>Admin must approve at least one voter before campaigns can run.</p></div>
        </div>`;
        return;
    }

    el.innerHTML = `
        <div class="campaign-layout">
            <!-- LEFT: Candidate Selector & Manifesto Builder -->
            <div class="campaign-left">
                <div class="info-card" style="margin-bottom:1.25rem">
                    <h3><i class="fas fa-user-tie" style="color:var(--saffron)"></i> Select Candidate</h3>
                    <select id="campaignCandSelect" onchange="onCandidateSelected()" style="width:100%;margin-top:0.75rem;padding:0.6rem;border-radius:8px;border:1.5px solid var(--border);background:var(--bg-card);color:var(--text-primary);font-size:0.95rem">
                        <option value="">-- Choose Candidate --</option>
                        ${approvedCands.map(c => `<option value="${c.id}">${c.symbol} ${c.name} (${c.party}) · ${c.constituency}</option>`).join('')}
                    </select>
                </div>

                <div id="candidateManifestoPanel" style="display:none">
                    <div class="info-card" style="margin-bottom:1.25rem">
                        <h3><i class="fas fa-scroll" style="color:var(--navy)"></i> Manifesto Builder</h3>
                        <p style="color:var(--text-muted);font-size:0.85rem;margin:0.5rem 0 0.75rem">Select key promises for the manifesto (click to toggle):</p>
                        <div class="manifesto-tags" id="manifestoTags">
                            ${MANIFESTO_TEMPLATES.default.map(tag =>
                                `<span class="manifesto-tag" onclick="toggleManifestoTag(this,'${tag}')">${tag}</span>`
                            ).join('')}
                        </div>
                        <div class="form-group" style="margin-top:1rem">
                            <label><i class="fas fa-pen"></i> Custom Promise / Manifesto Point</label>
                            <input type="text" id="customManifestoInput" placeholder="Add your own promise..." style="width:100%">
                            <button class="btn-secondary" style="margin-top:0.5rem;width:100%" onclick="addCustomManifestoTag()">
                                <i class="fas fa-plus"></i> Add Custom Point
                            </button>
                        </div>
                        <div style="margin-top:0.75rem">
                            <label style="font-size:0.85rem;color:var(--text-muted)"><i class="fas fa-microphone"></i> Campaign Speech (optional):</label>
                            <textarea id="campaignSpeech" rows="3" placeholder="Write your campaign speech to voters..." style="width:100%;margin-top:0.4rem;padding:0.6rem;border-radius:8px;border:1.5px solid var(--border);background:var(--bg-secondary);color:var(--text-primary);resize:vertical;font-size:0.88rem"></textarea>
                        </div>
                    </div>

                    <div class="info-card">
                        <h3><i class="fas fa-users" style="color:var(--green)"></i> Approach Voters</h3>
                        <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:0.75rem">Select a voter to approach, or run a full constituency campaign:</p>
                        <select id="campaignVoterSelect" style="width:100%;margin-bottom:0.75rem;padding:0.6rem;border-radius:8px;border:1.5px solid var(--border);background:var(--bg-card);color:var(--text-primary);font-size:0.9rem">
                            <option value="">-- All voters in constituency --</option>
                            ${approvedVoters.map(v => `<option value="${v.id}">${v.name} · ${v.constituency || 'General'}</option>`).join('')}
                        </select>
                        <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
                            <button class="btn-primary" style="flex:1" onclick="approachVoter()">
                                <i class="fas fa-handshake"></i> Approach Selected Voter
                            </button>
                            <button class="btn-secondary" style="flex:1" onclick="runConstituencyCampaign()">
                                <i class="fas fa-bullhorn"></i> Full Constituency Drive
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT: Campaign Feed / Interaction Log -->
            <div class="campaign-right">
                <div class="info-card" style="height:100%">
                    <h3 style="margin-bottom:1rem"><i class="fas fa-rss" style="color:var(--saffron)"></i> Campaign Feed</h3>
                    <div id="campaignFeed" style="min-height:300px;max-height:520px;overflow-y:auto">
                        <div style="text-align:center;color:var(--text-muted);padding:3rem 1rem">
                            <i class="fas fa-bullhorn" style="font-size:3rem;opacity:0.3"></i>
                            <p style="margin-top:1rem">Select a candidate and approach voters to see the campaign unfold here...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Campaign Stats -->
        <div class="campaign-stats-row" id="campaignStats" style="display:none;margin-top:1.5rem">
            <div class="stat-card-mini"><i class="fas fa-handshake"></i><div><span id="cs-approached">0</span><small>Voters Approached</small></div></div>
            <div class="stat-card-mini"><i class="fas fa-thumbs-up"></i><div><span id="cs-positive">0</span><small>Positive Responses</small></div></div>
            <div class="stat-card-mini"><i class="fas fa-thumbs-down"></i><div><span id="cs-negative">0</span><small>Undecided / Negative</small></div></div>
            <div class="stat-card-mini"><i class="fas fa-chart-line"></i><div><span id="cs-support">0%</span><small>Support Rate</small></div></div>
        </div>
    `;

    // Restore saved manifesto if any
    const candSel = document.getElementById('campaignCandSelect');
    if (campaignState.activeCandidate) {
        candSel.value = campaignState.activeCandidate;
        onCandidateSelected(true);
    }

    // Replay log
    replayCampaignFeed();
}

function onCandidateSelected(skipClear = false) {
    const id = document.getElementById('campaignCandSelect').value;
    if (!id) {
        document.getElementById('candidateManifestoPanel').style.display = 'none';
        return;
    }
    campaignState.activeCandidate = id;
    document.getElementById('candidateManifestoPanel').style.display = 'block';

    // Restore saved manifesto tags
    const saved = campaignState.manifestos[id] || [];
    document.querySelectorAll('.manifesto-tag').forEach(t => {
        t.classList.toggle('selected', saved.includes(t.textContent));
    });
}

function toggleManifestoTag(el, tag) {
    el.classList.toggle('selected');
    syncManifestoState();
}

function addCustomManifestoTag() {
    const inp = document.getElementById('customManifestoInput');
    const val = inp.value.trim();
    if (!val) { showToast('Enter a manifesto point first', 'warning'); return; }
    const container = document.getElementById('manifestoTags');
    const span = document.createElement('span');
    span.className = 'manifesto-tag selected custom-tag';
    span.textContent = val;
    span.onclick = function() { toggleManifestoTag(this, val); };
    container.appendChild(span);
    inp.value = '';
    syncManifestoState();
    showToast('Manifesto point added!', 'success');
}

function syncManifestoState() {
    const id = campaignState.activeCandidate;
    if (!id) return;
    const selected = [...document.querySelectorAll('.manifesto-tag.selected')].map(t => t.textContent);
    campaignState.manifestos[id] = selected;
}

// ============================================
// APPROACH VOTER
// ============================================
function approachVoter() {
    const candId = campaignState.activeCandidate;
    const voterSel = document.getElementById('campaignVoterSelect')?.value;
    if (!candId) { showToast('Please select a candidate first', 'warning'); return; }

    const candidate = APP_STATE.candidates.find(c => c.id === candId);
    const manifestoPoints = campaignState.manifestos[candId] || [];
    if (manifestoPoints.length === 0) {
        showToast('Please select at least one manifesto point before approaching voters!', 'warning');
        return;
    }

    let voter;
    if (voterSel) {
        voter = APP_STATE.voters.find(v => v.id === voterSel);
    } else {
        // Pick random voter from constituency or any approved voter
        const pool = APP_STATE.voters.filter(v => v.status === 'approved' && !v.hasVoted);
        voter = pool[Math.floor(Math.random() * pool.length)];
    }

    if (!voter) { showToast('No eligible voter found', 'warning'); return; }

    const speech = document.getElementById('campaignSpeech')?.value?.trim() || '';
    simulateCampaignApproach(candidate, voter, manifestoPoints, speech);
}

function runConstituencyCampaign() {
    const candId = campaignState.activeCandidate;
    if (!candId) { showToast('Select a candidate first', 'warning'); return; }
    const candidate = APP_STATE.candidates.find(c => c.id === candId);
    const manifestoPoints = campaignState.manifestos[candId] || [];
    if (manifestoPoints.length === 0) { showToast('Build a manifesto first!', 'warning'); return; }

    const pool = APP_STATE.voters.filter(v =>
        v.status === 'approved' &&
        (v.constituency === candidate.constituency || !v.constituency)
    );

    if (pool.length === 0) { showToast('No approved voters in this constituency', 'warning'); return; }

    const speech = document.getElementById('campaignSpeech')?.value?.trim() || '';
    const batchSize = Math.min(pool.length, 5);
    let idx = 0;

    addFeedEntry({ type: 'campaign-start', candidate, count: pool.length });
    showToast(`Starting constituency-wide campaign for ${candidate.name}...`, 'info');

    const run = () => {
        if (idx >= batchSize) {
            addFeedEntry({ type: 'campaign-end', candidate, total: batchSize });
            updateCampaignStats();
            addXP(25 * batchSize);
            return;
        }
        simulateCampaignApproach(candidate, pool[idx], manifestoPoints, speech, true);
        idx++;
        setTimeout(run, 900);
    };
    run();
}

function simulateCampaignApproach(candidate, voter, manifestoPoints, speech, silent = false) {
    // Simulate voter reaction based on constituency match, manifesto relevance, random factor
    const constituencyMatch = voter.constituency === candidate.constituency;
    const baseChance = constituencyMatch ? 0.65 : 0.45;
    const manifestoBonus = Math.min(manifestoPoints.length * 0.04, 0.25);
    const speechBonus = speech.length > 30 ? 0.08 : 0;
    const finalChance = baseChance + manifestoBonus + speechBonus;
    const reaction = Math.random();

    let response, responseType;
    if (reaction < finalChance * 0.6) {
        response = 'positive';
        responseType = pickRandom([
            `"Your points on ${pickRandom(manifestoPoints)} are exactly what we need!"`,
            `"${candidate.party} has my full support. Well said!"`,
            `"I will definitely vote for you. Thank you for coming!"`,
            `"Your manifesto addresses our real problems. Count me in!"`,
            `"Finally a candidate who talks about ${pickRandom(manifestoPoints)}. You have my vote!"`,
        ]);
    } else if (reaction < finalChance) {
        response = 'neutral';
        responseType = pickRandom([
            `"I'll think about it. Your stance on ${pickRandom(manifestoPoints)} is interesting."`,
            `"I'm still deciding. Can you tell me more about your plans?"`,
            `"I've heard from other candidates too. Will consider."`,
            `"Your message is good, but I need to see action, not just promises."`,
        ]);
    } else {
        response = 'negative';
        responseType = pickRandom([
            `"I'm voting for someone else this time. Sorry."`,
            `"You need stronger policies on ${pickRandom(MANIFESTO_TEMPLATES.default)}."`,
            `"I've voted for the opposition for years. Not changing."`,
            `"Your party hasn't delivered before. Why should I trust you now?"`,
        ]);
    }

    const entry = {
        type: 'approach',
        candidate,
        voter: { name: voter.name, constituency: voter.constituency || 'General', id: voter.id },
        manifestoPoints,
        speech,
        response,
        responseText: responseType,
        timestamp: new Date().toLocaleTimeString('en-IN')
    };

    campaignState.interactionLog.push(entry);
    addFeedEntry(entry);
    if (!silent) updateCampaignStats();
    if (!silent) addXP(10);
}

// ============================================
// CAMPAIGN FEED RENDERING
// ============================================
function addFeedEntry(entry) {
    const feed = document.getElementById('campaignFeed');
    if (!feed) return;

    // Clear placeholder
    const placeholder = feed.querySelector('div[style*="text-align:center"]');
    if (placeholder) placeholder.remove();

    const div = document.createElement('div');
    div.className = 'campaign-feed-entry';

    if (entry.type === 'campaign-start') {
        div.innerHTML = `<div class="feed-entry-header campaign-drive">
            <i class="fas fa-flag"></i>
            <strong>Constituency Drive Started</strong> – ${entry.candidate.symbol} ${entry.candidate.name}
            <span class="feed-time">Now</span>
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);padding:0.25rem 0 0.5rem 0.25rem">Approaching ${entry.count} voter(s) in <strong>${entry.candidate.constituency}</strong>…</p>`;
    } else if (entry.type === 'campaign-end') {
        div.innerHTML = `<div class="feed-entry-header campaign-end">
            <i class="fas fa-flag-checkered"></i>
            <strong>Drive Complete</strong> – ${entry.candidate.name} approached ${entry.total} voters.
            <span class="feed-time">${new Date().toLocaleTimeString('en-IN')}</span>
        </div>`;
    } else if (entry.type === 'approach') {
        const cls = entry.response === 'positive' ? 'positive' : entry.response === 'negative' ? 'negative' : 'neutral';
        const icon = entry.response === 'positive' ? 'fa-smile' : entry.response === 'negative' ? 'fa-frown' : 'fa-meh';
        const points = entry.manifestoPoints.slice(0, 3).join(', ') + (entry.manifestoPoints.length > 3 ? '...' : '');
        div.innerHTML = `
            <div class="feed-entry-header ${cls}">
                <i class="fas ${icon}"></i>
                <strong>${entry.candidate.symbol} ${entry.candidate.name}</strong> approached <strong>${entry.voter.name}</strong>
                <span class="feed-time">${entry.timestamp}</span>
            </div>
            <div class="feed-entry-body">
                <div class="feed-manifesto-row">
                    <i class="fas fa-scroll" style="color:var(--navy)"></i>
                    <span>Manifesto: <em>${points || 'No points selected'}</em></span>
                </div>
                ${entry.speech ? `<div class="feed-speech-row"><i class="fas fa-microphone" style="color:var(--saffron)"></i> <em>"${entry.speech.substring(0, 120)}${entry.speech.length > 120 ? '...' : ''}"</em></div>` : ''}
                <div class="feed-voter-response ${cls}">
                    <i class="fas fa-comment-dots"></i>
                    <span>${entry.voter.name} (${entry.voter.constituency}): ${entry.responseText}</span>
                </div>
            </div>`;
    }

    feed.insertBefore(div, feed.firstChild);
    document.getElementById('campaignStats').style.display = 'flex';
}

function replayCampaignFeed() {
    if (campaignState.interactionLog.length === 0) return;
    campaignState.interactionLog.slice(-10).reverse().forEach(entry => addFeedEntry(entry));
    updateCampaignStats();
}

function updateCampaignStats() {
    const log = campaignState.interactionLog.filter(e => e.type === 'approach');
    const total = log.length;
    const positive = log.filter(e => e.response === 'positive').length;
    const negative = log.filter(e => e.response !== 'positive').length;
    const pct = total > 0 ? Math.round((positive / total) * 100) : 0;

    const s = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    s('cs-approached', total);
    s('cs-positive', positive);
    s('cs-negative', negative);
    s('cs-support', pct + '%');
    document.getElementById('campaignStats').style.display = 'flex';
}

function startCampaignRound() {
    const id = document.getElementById('campaignCandSelect')?.value;
    if (!id) { showToast('Select a candidate first from the panel below', 'warning'); return; }
    runConstituencyCampaign();
}

// ============================================
// HELPERS
// ============================================
function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
