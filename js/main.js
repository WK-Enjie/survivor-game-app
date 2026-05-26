/* ═══════════════════════════════════════════════════════════
   SURVIVOR'S GAMBIT — MAIN
   All event listeners wired here
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Init visuals ── */
  buildStars();
  buildAvatarPickers();

  /* ════════════════════════════════════
     LANDING
     ════════════════════════════════════ */
  on('btn-go-setup', 'click', () => {
    Audio.tap();
    game.reset();
    /* Reset name inputs and avatars */
    ['0','1'].forEach(i => {
      const inp = document.getElementById('name-' + i);
      if (inp) inp.value = '';
      const av = document.getElementById('current-avatar-' + i);
      if (av) av.textContent = i === '0' ? '🦁' : '🐺';
    });
    show('setup');
  });

  on('btn-go-rules', 'click', () => { Audio.tap(); show('rules'); });
  on('btn-go-edu',   'click', () => { Audio.tap(); show('edu');   });

  /* ════════════════════════════════════
     BACK BUTTONS (data-target attribute)
     ════════════════════════════════════ */
  document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      Audio.tap();
      show(btn.dataset.target || 'landing');
    });
  });

  /* ════════════════════════════════════
     RULES PAGE
     ════════════════════════════════════ */
  on('btn-rules-play', 'click', () => {
    Audio.tap();
    game.reset();
    ['0','1'].forEach(i => {
      const inp = document.getElementById('name-' + i);
      if (inp) inp.value = '';
      const av = document.getElementById('current-avatar-' + i);
      if (av) av.textContent = i === '0' ? '🦁' : '🐺';
    });
    show('setup');
  });

  /* ════════════════════════════════════
     SETUP → DEAL
     ════════════════════════════════════ */
  on('btn-go-draft', 'click', () => {
    Audio.tap();
    /* Read names */
    [0,1].forEach(i => {
      const val = (document.getElementById('name-' + i) || {}).value || '';
      game.setName(i, val);
      const av = (document.getElementById('current-avatar-' + i) || {}).textContent || '';
      if (av) game.setAvatar(i, av);
    });
    /* Deal and show draft */
    initDraft();
  });

  /* Live name sync */
  [0,1].forEach(i => {
    const inp = document.getElementById('name-' + i);
    if (inp) inp.addEventListener('input', e => game.setName(i, e.target.value));
  });

  /* ════════════════════════════════════
     DRAFT
     ════════════════════════════════════ */
  on('btn-draft-confirm', 'click', () => {
    Audio.lock();
    confirmDraft();
  });

  /* Privacy wall — player 2 is ready to draft */
  on('btn-pw-ready', 'click', () => {
    Audio.tap();
    hidePrivacyWall();
    draftStep = 1;
    showDraftForPlayer(1);
  });

  /* ════════════════════════════════════
     GAME — pick phase 0
     ════════════════════════════════════ */
  on('btn-confirm-pick-0', 'click', () => {
    if (game.roundPicks[0] === null) return;
    Audio.lock();
    showHandoff();
  });

  /* ════════════════════════════════════
     GAME — handoff → pick phase 1
     ════════════════════════════════════ */
  on('btn-handoff-ready', 'click', () => {
    Audio.tap();
    startPickPhase(1);
  });

  /* ════════════════════════════════════
     GAME — pick phase 1
     ════════════════════════════════════ */
  on('btn-confirm-pick-1', 'click', () => {
    if (game.roundPicks[1] === null) return;
    Audio.lock();
    showRevealPhase();
  });

  /* ════════════════════════════════════
     GAME — reveal
     ════════════════════════════════════ */
  on('btn-reveal', 'click', () => {
    Audio.reveal();
    const entry = game.resolveRound();
    showResultPhase(entry);
  });

  /* ════════════════════════════════════
     GAME — next round
     ════════════════════════════════════ */
  on('btn-next-round', 'click', () => {
    Audio.tap();
    game.nextRound();
    if (game.phase === 'end') {
      renderEndScreen();
      show('end');
    } else {
      renderChallenge(game.currentChallenge);
      startPickPhase(0);
    }
  });

  /* ════════════════════════════════════
     END SCREEN
     ════════════════════════════════════ */
  on('btn-play-again', 'click', () => {
    Audio.tap();
    game.reset();
    ['0','1'].forEach(i => {
      const inp = document.getElementById('name-' + i);
      if (inp) inp.value = '';
      const av = document.getElementById('current-avatar-' + i);
      if (av) av.textContent = i === '0' ? '🦁' : '🐺';
    });
    show('setup');
  });

  on('btn-end-home', 'click', () => {
    Audio.tap();
    game.reset();
    show('landing');
  });

  on('btn-prompt-prev', 'click', () => {
    Audio.tap();
    promptIdx = (promptIdx - 1 + DISCUSSION_PROMPTS.length) % DISCUSSION_PROMPTS.length;
    renderPrompt();
  });

  on('btn-prompt-next', 'click', () => {
    Audio.tap();
    promptIdx = (promptIdx + 1) % DISCUSSION_PROMPTS.length;
    renderPrompt();
  });

  /* ════════════════════════════════════
     HELPER
     ════════════════════════════════════ */
  function on(id, event, handler) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener(event, handler);
    } else {
      console.warn('Element not found for listener:', id);
    }
  }

});