/* ═══════════════════════════════════════════════════════════
   SURVIVOR'S GAMBIT — GAME ENGINE
   Players keep 3 traits and CAN reuse them each round.
   Strategy = choosing the RIGHT trait, not rationing them.
   ═══════════════════════════════════════════════════════════ */

const ROUNDS    = 4;
const DEAL_SIZE = 5;
const KEEP_SIZE = 3;
const PTS       = { strong:3, partial:1, weak:0 };

const game = {
  players: [
    { id:0, name:'Player 1', avatar:'🦁', score:0, hand:[], usedThisRound:[] },
    { id:1, name:'Player 2', avatar:'🐺', score:0, hand:[], usedThisRound:[] }
  ],
  challenges:  [],
  roundIndex:  0,
  history:     [],
  roundPicks:  [null, null],
  phase:       'setup',

  /* ── reset ── */
  reset() {
    this.players = [
      { id:0, name:'Player 1', avatar:'🦁', score:0, hand:[], usedThisRound:[] },
      { id:1, name:'Player 2', avatar:'🐺', score:0, hand:[], usedThisRound:[] }
    ];
    this.challenges  = [];
    this.roundIndex  = 0;
    this.history     = [];
    this.roundPicks  = [null, null];
    this.phase       = 'setup';
  },

  setName(idx, name)  { this.players[idx].name   = name.trim() || ('Player '+(idx+1)); },
  setAvatar(idx, av)  { this.players[idx].avatar  = av; },

  /* Deal 5 unique traits to each player */
  dealForDraft() {
    const ids = shuffle(TRAITS.map(t => t.id));
    this.players[0].hand = ids.slice(0, DEAL_SIZE);
    this.players[1].hand = ids.slice(DEAL_SIZE, DEAL_SIZE * 2);
    console.log('Dealt P0:', this.players[0].hand);
    console.log('Dealt P1:', this.players[1].hand);
  },

  /* Set final 3 keepers — NO usedIds tracking across rounds */
  setHand(idx, ids) {
    this.players[idx].hand         = ids.slice(0, KEEP_SIZE);
    this.players[idx].usedThisRound = [];
    console.log('Hand set P'+idx+':', this.players[idx].hand);
  },

  /* Pick 4 random challenges */
  startGame() {
    this.challenges = shuffle([...CHALLENGES]).slice(0, ROUNDS);
    this.roundIndex = 0;
    this.roundPicks = [null, null];
    this.history    = [];
    this.phase      = 'pick0';
    /* Clear per-round used tracker */
    this.players.forEach(p => p.usedThisRound = []);
    console.log('Game started:', this.challenges.map(c => c.title));
  },

  get currentChallenge() { return this.challenges[this.roundIndex] || null; },
  get roundNumber()      { return this.roundIndex + 1; },

  /*
   * REUSE RULE:
   * A player cannot pick the SAME trait twice in the SAME round
   * (i.e. they must pick one of their 3, and both players reveal simultaneously).
   * Traits ARE available again in the next round.
   * usedThisRound is cleared at the start of each new round.
   */
  canPick(pIdx, traitId) {
    /* Trait must be in hand */
    if (!this.players[pIdx].hand.includes(traitId)) return false;
    /* Cannot change pick once confirmed (handled by UI) */
    return true;
  },

  setPick(pIdx, traitId) {
    this.roundPicks[pIdx] = traitId;
  },

  getOutcome(traitId, challenge) {
    if (challenge.strongIds.includes(traitId)) return 'strong';
    if (challenge.weakIds.includes(traitId))   return 'weak';
    return 'partial';
  },

  resolveRound() {
    const ch = this.currentChallenge;
    const results = this.roundPicks.map((traitId, pi) => {
      const outcome = this.getOutcome(traitId, ch);
      const score   = PTS[outcome];
      this.players[pi].score += score;
      const trait = TRAITS.find(t => t.id === traitId);
      return { playerIdx:pi, traitId, trait, outcome, score };
    });

    const entry = {
      roundNum:       this.roundNumber,
      challengeTitle: ch.title,
      challengeIcon:  ch.icon,
      results
    };
    this.history.push(entry);
    this.phase = 'result';
    return entry;
  },

  nextRound() {
    this.roundIndex++;
    /* Clear picks — traits are fully available again next round */
    this.roundPicks = [null, null];
    this.players.forEach(p => p.usedThisRound = []);
    this.phase = (this.roundIndex >= ROUNDS) ? 'end' : 'pick0';
  },

  getWinner() {
    const s0 = this.players[0].score;
    const s1 = this.players[1].score;
    if (s0 > s1) return 0;
    if (s1 > s0) return 1;
    return -1;
  }
};