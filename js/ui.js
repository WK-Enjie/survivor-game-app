/* ═══════════════════════════════════════════════════════════
   SURVIVOR'S GAMBIT — UI
   ═══════════════════════════════════════════════════════════ */

/* ── Screen router ── */
function show(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('screen-' + screenId);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
  } else {
    console.error('Screen not found: screen-' + screenId);
  }
}

/* ── Stars on landing ── */
function buildStars() {
  const zone = document.querySelector('.stars');
  if (!zone) return;
  for (let i = 0; i < 55; i++) {
    const s     = document.createElement('div');
    s.className = 'star';
    const size  = (Math.random() * 2.5 + 0.8).toFixed(1);
    s.style.cssText = [
      'width:'    + size + 'px',
      'height:'   + size + 'px',
      'top:'      + (Math.random() * 100).toFixed(1) + '%',
      'left:'     + (Math.random() * 100).toFixed(1) + '%',
      '--dur:'    + (Math.random() * 3 + 2).toFixed(1) + 's',
      '--delay:'  + (Math.random() * 4).toFixed(1) + 's'
    ].join(';');
    zone.appendChild(s);
  }
}

/* ── Avatar picker ── */
function buildAvatarPickers() {
  [0, 1].forEach(idx => {
    const currentEl = document.getElementById('current-avatar-' + idx);
    const optBox    = document.getElementById('avatar-options-'  + idx);
    const picker    = document.getElementById('avatar-picker-'   + idx);
    if (!currentEl || !optBox || !picker) return;

    optBox.innerHTML = '';
    AVATARS.forEach(av => {
      const span      = document.createElement('span');
      span.className  = 'avatar-option';
      span.textContent = av;
      span.addEventListener('click', e => {
        e.stopPropagation();
        currentEl.textContent = av;
        game.setAvatar(idx, av);
        picker.classList.remove('open');
        Audio.tap();
      });
      optBox.appendChild(span);
    });

    currentEl.addEventListener('click', e => {
      e.stopPropagation();
      document.querySelectorAll('.avatar-picker.open').forEach(p => {
        if (p !== picker) p.classList.remove('open');
      });
      picker.classList.toggle('open');
      Audio.tap();
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.avatar-picker.open')
            .forEach(p => p.classList.remove('open'));
  });
}

/* ════════════════════════════════════════
   DRAFT
   ════════════════════════════════════════ */
let draftStep  = 0;
let draftPicks = [[], []];

function initDraft() {
  game.dealForDraft();
  draftPicks = [[], []];
  draftStep  = 0;
  show('draft');           /* show screen FIRST so DOM is live */
  showDraftForPlayer(0);   /* then render into it */
}

function showDraftForPlayer(pIdx) {
  const player = game.players[pIdx];
  setText('draft-avatar',     player.avatar);
  setText('draft-name',       player.name);
  setText('draft-pick-count', '0');

  const instrEl  = document.getElementById('draft-instruction');
  const confirmEl= document.getElementById('btn-draft-confirm');
  if (instrEl)   instrEl.textContent = 'Tap 3 cards to keep for the whole game.';
  if (confirmEl) confirmEl.classList.add('hidden');

  renderDraftHand(pIdx);
}

function renderDraftHand(pIdx) {
  const container = document.getElementById('draft-hand');
  if (!container) { console.error('draft-hand missing'); return; }
  container.innerHTML = '';

  const hand = game.players[pIdx].hand;
  if (!hand || hand.length === 0) {
    container.innerHTML =
      '<p style="color:#fff;text-align:center;padding:20px">' +
      'No cards dealt — please go back and try again.</p>';
    return;
  }

  hand.forEach(traitId => {
    const trait    = TRAITS.find(t => t.id === traitId);
    if (!trait) { console.warn('Trait missing:', traitId); return; }

    const selected = draftPicks[pIdx].includes(traitId);
    const maxed    = draftPicks[pIdx].length >= KEEP_SIZE && !selected;

    const card = makeTraitCard(trait, {
      selected,
      disabled:  maxed,
      showBadge: true
    });

    card.addEventListener('click', () => {
      if (maxed) return;
      Audio.tap();
      const arr = draftPicks[pIdx];
      const i   = arr.indexOf(traitId);
      if (i > -1) {
        arr.splice(i, 1);
      } else {
        if (arr.length >= KEEP_SIZE) return;
        arr.push(traitId);
        Audio.select();
      }
      setText('draft-pick-count', arr.length);
      const confirmEl = document.getElementById('btn-draft-confirm');
      if (confirmEl) confirmEl.classList.toggle('hidden', arr.length < KEEP_SIZE);
      renderDraftHand(pIdx);
    });

    container.appendChild(card);
  });
}

function confirmDraft() {
  game.setHand(draftStep, draftPicks[draftStep]);

  if (draftStep === 0) {
    /* Show privacy wall so P1 can't see P0's picks */
    const pw = document.getElementById('privacy-wall');
    if (pw) pw.classList.remove('hidden');
    setText('pw-icon',      game.players[1].avatar);
    setText('pw-name',      game.players[0].name);
    setText('pw-next-name', game.players[1].name);
  } else {
    /* Both done — start game */
    game.startGame();
    setupGameScreen();
    show('game');
  }
}

function hidePrivacyWall() {
  const pw = document.getElementById('privacy-wall');
  if (pw) pw.classList.add('hidden');
}

/* ════════════════════════════════════════
   GAME SCREEN
   ════════════════════════════════════════ */
function setupGameScreen() {
  [0, 1].forEach(i => {
    const p = game.players[i];
    setText('g-avatar-' + i, p.avatar);
    setText('g-name-'   + i, p.name);
    setText('g-score-'  + i, '0');
  });
  setText('g-round', game.roundNumber);
  renderChallenge(game.currentChallenge);
  startPickPhase(0);
}

function renderChallenge(ch) {
  if (!ch) return;
  setText('ch-icon',  ch.icon);
  setText('ch-title', ch.title);
  setText('ch-desc',  ch.desc);
  const icon = document.getElementById('ch-icon');
  if (icon) {
    icon.style.animation = 'none';
    void icon.offsetWidth;
    icon.style.animation = '';
  }
}

function updateScoreBar() {
  [0, 1].forEach(i => {
    const el = document.getElementById('g-score-' + i);
    if (!el) return;
    el.textContent = game.players[i].score;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  });
  setText('g-round', game.roundNumber);
}

function hideAllPhases() {
  ['phase-pick-0', 'phase-handoff', 'phase-pick-1',
   'phase-reveal',  'phase-result'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
}

/* ── Phase A: Player picks ── */
function startPickPhase(pIdx) {
  hideAllPhases();
  game.roundPicks[pIdx] = null;

  const player    = game.players[pIdx];
  const phaseEl   = document.getElementById('phase-pick-' + pIdx);
  const confirmEl = document.getElementById('btn-confirm-pick-' + pIdx);

  setText('ph-avatar-' + pIdx, player.avatar);
  setText('ph-name-'   + pIdx, player.name);

  renderPickHand(pIdx);
  if (confirmEl) confirmEl.classList.add('hidden');
  if (phaseEl)   phaseEl.classList.remove('hidden');
}

/*
 * renderPickHand — shows all 3 traits every round.
 * Traits are NEVER greyed out between rounds.
 * Only the currently-selected card in THIS round is highlighted.
 */
function renderPickHand(pIdx) {
  const container = document.getElementById('pick-hand-' + pIdx);
  if (!container) return;
  container.innerHTML = '';

  const player = game.players[pIdx];

  player.hand.forEach(traitId => {
    const trait    = TRAITS.find(t => t.id === traitId);
    if (!trait) return;

    const isPicked = game.roundPicks[pIdx] === traitId;

    /* No 'used' state — all cards always available */
    const card = makeTraitCard(trait, {
      selected:  isPicked,
      showBadge: true
    });

    card.addEventListener('click', () => {
      Audio.select();
      game.setPick(pIdx, traitId);
      renderPickHand(pIdx);
      const confirmEl = document.getElementById('btn-confirm-pick-' + pIdx);
      if (confirmEl) confirmEl.classList.remove('hidden');
    });

    container.appendChild(card);
  });
}

/* ── Phase B: Handoff ── */
function showHandoff() {
  hideAllPhases();
  const done = game.players[0];
  const next = game.players[1];

  setText('ho-icon',  '🔒');
  setText('ho-title', done.avatar + ' ' + done.name + "'s pick is locked!");
  const msgEl = document.getElementById('ho-msg');
  if (msgEl) {
    msgEl.innerHTML =
      'Hand the device to <strong>' + next.name + '</strong>.';
  }

  const el = document.getElementById('phase-handoff');
  if (el) el.classList.remove('hidden');
}

/* ── Phase C: Reveal ── */
function showRevealPhase() {
  hideAllPhases();
  const el = document.getElementById('phase-reveal');
  if (el) el.classList.remove('hidden');
}

/* ── Phase D: Results ── */
function showResultPhase(histEntry) {
  hideAllPhases();

  const ch  = game.currentChallenge;
  const row = document.getElementById('result-cards-row');
  if (row) row.innerHTML = '';

  histEntry.results.forEach((r, i) => {
    /* Column per player */
    const col = document.createElement('div');
    col.className = 'result-player-col';

    /* Player label */
    const lbl = document.createElement('div');
    lbl.className = 'result-player-label rpl-p' + (r.playerIdx + 1);
    lbl.textContent =
      game.players[r.playerIdx].avatar + ' ' +
      game.players[r.playerIdx].name;
    col.appendChild(lbl);

    /* Flip card */
    const wrap  = document.createElement('div');
    wrap.className = 'card-flip-wrap';
    const inner = document.createElement('div');
    inner.className = 'card-flip-inner';

    const back = document.createElement('div');
    back.className   = 'card-back';
    back.textContent = '🌿';

    const front = document.createElement('div');
    front.className = 'card-face';
    front.appendChild(makeTraitCard(r.trait, {
      resultClass: 'tc-' + r.outcome,
      outcome:     r.outcome,
      score:       r.score
    }));

    inner.appendChild(back);
    inner.appendChild(front);
    wrap.appendChild(inner);
    col.appendChild(wrap);
    if (row) row.appendChild(col);

    /* Staggered flip */
    setTimeout(() => {
      inner.classList.add('flipped');
      if      (r.outcome === 'strong') Audio.strong();
      else if (r.outcome === 'weak')   Audio.weak();
      else                              Audio.partial();
    }, i * 350 + 300);
  });

  /* Strong/Weak lists under the challenge card */
  buildRevealLists(ch);

  /* Explanation */
  const expEl = document.getElementById('result-explanation-box');
  if (expEl) {
    const outcomes = histEntry.results.map(r => r.outcome);
    let text = '';
    if (outcomes.includes('strong'))
      text += '<strong>💪 Strong:</strong> ' + ch.explanations.strong + ' ';
    if (outcomes.includes('weak'))
      text += '<strong>💀 Weak:</strong> '   + ch.explanations.weak   + ' ';
    if (outcomes.every(o => o === 'partial'))
      text  = '<strong>⚡ Partial:</strong> ' + ch.explanations.partial;
    expEl.innerHTML = text || ('<strong>⚡ Partial:</strong> ' + ch.explanations.partial);
  }

  /* Score bump after flip */
  setTimeout(() => updateScoreBar(), 900);

  /* Next / Final button label */
  const btnNext = document.getElementById('btn-next-round');
  if (btnNext) {
    btnNext.textContent =
      game.roundIndex >= ROUNDS - 1 ? '🏁 See Final Results!' : 'Next Challenge →';
  }

  const el = document.getElementById('phase-result');
  if (el) el.classList.remove('hidden');
}

/* Show strong/weak lists on the challenge card after reveal */
function buildRevealLists(ch) {
  const listsEl = document.getElementById('ch-reveal-lists');
  if (!listsEl) return;

  listsEl.innerHTML =
    '<div class="ch-list-strong">' +
      '<div class="ch-list-title">💪 Strong Traits</div>' +
      ch.strong.map(n => '<div class="ch-list-item">✅ ' + n + '</div>').join('') +
    '</div>' +
    '<div class="ch-list-weak">' +
      '<div class="ch-list-title">💀 Weak Traits</div>' +
      ch.weak.map(n => '<div class="ch-list-item">❌ ' + n + '</div>').join('') +
    '</div>';

  listsEl.classList.remove('hidden');
}

function hideRevealLists() {
  const listsEl = document.getElementById('ch-reveal-lists');
  if (listsEl) listsEl.classList.add('hidden');
}

/* ════════════════════════════════════════
   END SCREEN
   ════════════════════════════════════════ */
let promptIdx = 0;

function renderEndScreen() {
  const winner = game.getWinner();
  const [p0, p1] = game.players;

  let trophy, headline, sub;
  if (winner === -1) {
    trophy = '🤝'; headline = "It's a Tie!";
    sub = 'Both animals survived equally well. Biodiversity wins!';
    setTimeout(() => Audio.tie(), 400);
  } else {
    const w = game.players[winner];
    trophy = '🏆'; headline = w.name + ' Wins!';
    sub = w.avatar + ' ' + w.name +
          "'s adaptations were the perfect fit for the wild!";
    setTimeout(() => Audio.win(), 400);
    buildConfetti();
  }

  setText('end-trophy',   trophy);
  setText('end-headline', headline);
  setText('end-sub',      sub);

  /* Score cards */
  [p0, p1].forEach((p, i) => {
    const el = document.getElementById('end-card-' + i);
    if (!el) return;
    el.className = 'end-score-card' + (winner === i ? ' winner' : '');
    el.innerHTML =
      '<span class="esc-avatar">' + p.avatar + '</span>' +
      '<div class="esc-name">'   + p.name   + '</div>' +
      '<div class="esc-score">'  + p.score  + '</div>' +
      '<div class="esc-label">'  +
        (winner === i ? '🏆 Winner!' : p.score + ' pts') +
      '</div>';
  });

  /* Round history */
  const histEl = document.getElementById('history-rows');
  if (histEl) {
    histEl.innerHTML = '';
    game.history.forEach(h => {
      const row = document.createElement('div');
      row.className = 'hist-row';

      const num = document.createElement('div');
      num.className   = 'hist-num';
      num.textContent = h.roundNum;
      row.appendChild(num);

      /* Challenge name */
      const chName = document.createElement('div');
      chName.className = 'hist-challenge';
      chName.textContent = h.challengeIcon + ' ' + h.challengeTitle;
      row.appendChild(chName);

      h.results.forEach(r => {
        const entry = document.createElement('div');
        entry.className = 'hist-entry';
        const ptsLabel =
          r.outcome === 'strong'  ? '🌟 +3' :
          r.outcome === 'partial' ? '⚡ +1' : '💀 +0';
        entry.innerHTML =
          '<span class="hist-trait">' +
            r.trait.icon + ' ' + r.trait.name +
          '</span>' +
          '<span class="hist-pts ' + r.outcome + '">' +
            ptsLabel +
          '</span>';
        row.appendChild(entry);
      });

      histEl.appendChild(row);
    });
  }

  /* Trait summary — what each player kept */
  buildTraitSummary();

  promptIdx = 0;
  renderPrompt();
}

/* Show each player's 3 traits on end screen */
function buildTraitSummary() {
  const el = document.getElementById('trait-summary');
  if (!el) return;
  el.innerHTML = '';

  game.players.forEach((p, i) => {
    const col = document.createElement('div');
    col.className = 'ts-col';

    const hdr = document.createElement('div');
    hdr.className = 'ts-header ts-p' + (i + 1);
    hdr.textContent = p.avatar + ' ' + p.name + "'s Traits";
    col.appendChild(hdr);

    p.hand.forEach(traitId => {
      const trait = TRAITS.find(t => t.id === traitId);
      if (!trait) return;
      const row = document.createElement('div');
      row.className = 'ts-trait-row';
      row.innerHTML =
        '<span class="ts-icon">' + trait.icon + '</span>' +
        '<span class="ts-name">' + trait.name + '</span>';
      col.appendChild(row);
    });

    el.appendChild(col);
  });
}

function renderPrompt() {
  const el = document.getElementById('prompt-text');
  if (!el) return;
  el.style.opacity = '0';
  setTimeout(() => {
    el.textContent = DISCUSSION_PROMPTS[promptIdx];
    el.style.opacity = '1';
    const ctr = document.getElementById('prompt-counter');
    if (ctr) ctr.textContent =
      (promptIdx + 1) + '/' + DISCUSSION_PROMPTS.length;
  }, 150);
}

function buildConfetti() {
  const zone = document.getElementById('confetti-zone');
  if (!zone) return;
  zone.innerHTML = '';
  const colours =
    ['#f94144','#f3722c','#f8961e','#90be6d','#43aa8b','#577590','#f9c74f'];
  for (let i = 0; i < 80; i++) {
    const p    = document.createElement('div');
    p.className = 'confetti-piece';
    const col  = colours[Math.floor(Math.random() * colours.length)];
    const size = (Math.random() * 10 + 5).toFixed(0);
    p.style.cssText = [
      'left:'          + (Math.random() * 100).toFixed(1) + '%',
      'background:'    + col,
      'width:'         + size + 'px',
      'height:'        + size + 'px',
      'border-radius:' + (Math.random() > 0.5 ? '50%' : '2px'),
      '--dur:'         + (Math.random() * 2 + 2).toFixed(1) + 's',
      '--delay:'       + (Math.random() * 1.5).toFixed(2)   + 's'
    ].join(';');
    zone.appendChild(p);
  }
}

/* ════════════════════════════════════════
   SHARED CARD BUILDER
   ════════════════════════════════════════ */
function makeTraitCard(trait, opts = {}) {
  const {
    selected    = false,
    disabled    = false,
    used        = false,
    showBadge   = false,
    resultClass = '',
    outcome     = null,
    score       = null
  } = opts;

  const card    = document.createElement('div');
  const classes = ['trait-card'];
  if (selected)    classes.push('tc-selected');
  if (disabled)    classes.push('tc-disabled');
  if (used)        classes.push('tc-used');
  if (resultClass) classes.push(resultClass);
  card.className      = classes.join(' ');
  card.dataset.traitId = trait.id;

  card.innerHTML =
    '<span class="tc-icon">' + trait.icon + '</span>' +
    '<div class="tc-body">' +
      '<div class="tc-name">' + trait.name + '</div>' +
      '<div class="tc-desc">' + trait.desc + '</div>' +
    '</div>' +
    (showBadge
      ? '<span class="tc-badge ' + trait.type + '">' + trait.typeLabel + '</span>'
      : '');

  if (outcome !== null && score !== null) {
    const badge = document.createElement('span');
    badge.className   = 'tc-score-badge';
    badge.textContent =
      outcome === 'strong'  ? '+3 🌟' :
      outcome === 'partial' ? '+1 ⚡' : '+0 💀';
    badge.style.background =
      outcome === 'strong'  ? '#d8f3dc' :
      outcome === 'partial' ? '#fff3e0' : '#ffebee';
    badge.style.color =
      outcome === 'strong'  ? '#1b6230' :
      outcome === 'partial' ? '#e65100' : '#c62828';
    card.appendChild(badge);
  }

  return card;
}

/* ── Tiny helper ── */
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}