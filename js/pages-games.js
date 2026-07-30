/**
 * 游戏模块：1.拼音文字对对碰 2.英语单词实物抓大鹅
 */

let gameTab = 'match';

function renderGames() {
  const html = `
    <div class="page-title">🎮 闯关游戏</div>
    <div class="page-subtitle">边玩边学，越玩越聪明</div>
    
    <div class="tabs">
      <div class="tab ${gameTab==='match'?'active':''}" onclick="switchGameTab('match')">🎯 拼音对对碰</div>
      <div class="tab ${gameTab==='goose'?'active':''}" onclick="switchGameTab('goose')">🦆 抓大鹅</div>
    </div>
    
    <div id="game-content"></div>
  `;
  $('#page-games').innerHTML = html;
  renderGameContent();
}

function switchGameTab(tab) {
  gameTab = tab;
  renderGames();
}

function renderGameContent() {
  if (gameTab === 'match') renderMatchGame();
  else if (gameTab === 'goose') renderGooseGame();
}

// ============ 拼音文字对对碰 ============
let matchState = {
  level: 1,
  score: 0,
  flipped: [],
  matched: [],
  pairs: [],
  cards: [],
  locked: false,
};

function renderMatchGame() {
  const scores = Store.get('gameScores');
  matchState.score = scores.match || 0;
  
  $('#game-content').innerHTML = `
    <div class="card">
      <div class="game-header">
        <div>
          <div style="font-size:16px;font-weight:700;color:var(--primary)">🎯 拼音文字对对碰</div>
          <div class="game-level">第 <span id="match-level">${matchState.level}</span> 关 · 配对拼音和汉字</div>
        </div>
        <div class="game-score">⭐ <span id="match-score">${matchState.score}</span></div>
      </div>
      <div style="font-size:13px;color:var(--text-light);margin-bottom:12px">
        翻开卡片，找到<b>拼音</b>和对应的<b>汉字</b>配对！
      </div>
      <div class="match-grid" id="match-grid"></div>
      <div id="match-fb" style="margin-top:12px;text-align:center"></div>
      <div style="margin-top:12px;display:flex;gap:8px;justify-content:center">
        <button class="btn btn-sm" onclick="startMatchGame()">🔄 重新开始</button>
        <button class="btn btn-sm btn-warning" onclick="nextMatchLevel()">⏭️ 下一关</button>
      </div>
    </div>
    <div class="card">
      <div style="font-size:13px;color:var(--text-light);text-align:center">
        🎮 玩法：点击两张卡片，拼音和汉字配对成功就消除！全部配对完成通关！
      </div>
    </div>
  `;
  startMatchGame();
}

function startMatchGame() {
  // 根据关卡选择汉字
  const pairsPerLevel = [4, 6, 8][Math.min(matchState.level - 1, 2)] || 8;
  const allHanzi = HANZI_DATA.flatMap(w => w.list);
  const selected = pickRandom(allHanzi, pairsPerLevel);
  
  matchState.pairs = selected.map(h => ({pinyin: h.pinyin, zi: h.zi, emoji: h.emoji}));
  matchState.cards = [];
  matchState.pairs.forEach((p, i) => {
    matchState.cards.push({id: i, type: 'pinyin', value: p.pinyin, display: p.pinyin});
    matchState.cards.push({id: i, type: 'zi', value: p.zi, display: p.zi});
  });
  matchState.cards = shuffle(matchState.cards);
  matchState.flipped = [];
  matchState.matched = [];
  matchState.locked = false;
  
  renderMatchGrid();
}

function renderMatchGrid() {
  const grid = $('#match-grid');
  if (!grid) return;
  grid.innerHTML = matchState.cards.map((card, idx) => {
    const isFlipped = matchState.flipped.includes(idx);
    const isMatched = matchState.matched.includes(card.id);
    return `
      <div class="match-card ${isFlipped||isMatched?'flipped':''} ${isMatched?'matched':''}" onclick="flipMatchCard(${idx})">
        <div class="card-back">${isMatched ? '✅' : '❓'}</div>
        <div class="card-front">${card.display}</div>
      </div>
    `;
  }).join('');
}

function flipMatchCard(idx) {
  if (matchState.locked) return;
  if (matchState.flipped.includes(idx)) return;
  if (matchState.matched.includes(matchState.cards[idx].id)) return;
  if (matchState.flipped.length >= 2) return;
  
  matchState.flipped.push(idx);
  renderMatchGrid();
  
  // 朗读
  speak(matchState.cards[idx].display);
  
  if (matchState.flipped.length === 2) {
    matchState.locked = true;
    setTimeout(checkMatch, 800);
  }
}

function checkMatch() {
  const [i1, i2] = matchState.flipped;
  const c1 = matchState.cards[i1];
  const c2 = matchState.cards[i2];
  
  if (c1.id === c2.id && c1.type !== c2.type) {
    // 配对成功
    matchState.matched.push(c1.id);
    matchState.score += 10;
    Store.save('gameScores.match', matchState.score);
    $('#match-score').textContent = matchState.score;
    showToast('🎉 配对成功！+10分', 'success');
    vibrate(30);
    
    matchState.flipped = [];
    matchState.locked = false;
    renderMatchGrid();
    
    // 检查通关
    if (matchState.matched.length === matchState.pairs.length) {
      const r = CatSystem.recordTask(true, 'matchgame');
      // 游戏通关固定奖励小鱼干
      CatSystem.addFood('fish', 1);
      $('#match-fb').innerHTML = `<div class="method-tip" style="background:#c8e6c9;border-color:var(--success)">🎉 通关了！太棒了！获得小鱼干🐟</div>`;
      setTimeout(() => {
        matchState.level++;
        $('#match-level').textContent = matchState.level;
        startMatchGame();
      }, 2000);
    }
  } else {
    // 配对失败
    showToast('❌ 不匹配，再试试~', 'error');
    matchState.flipped = [];
    matchState.locked = false;
    renderMatchGrid();
  }
}

function nextMatchLevel() {
  matchState.level++;
  $('#match-level').textContent = matchState.level;
  startMatchGame();
}

// ============ 英语单词抓大鹅 ============
let gooseState = {
  level: 1,
  score: 0,
  target: null,    // 目标单词
  targetCn: null,
  geese: [],       // 当前大鹅列表
  caught: 0,
  needed: 5,       // 需要抓几只
  timer: null,
  timeLeft: 30,
  running: false,
};

function renderGooseGame() {
  const scores = Store.get('gameScores');
  gooseState.score = scores.goose || 0;
  
  $('#game-content').innerHTML = `
    <div class="card">
      <div class="game-header">
        <div>
          <div style="font-size:16px;font-weight:700;color:var(--primary)">🦆 单词抓大鹅</div>
          <div class="game-level">第 ${gooseState.level} 关</div>
        </div>
        <div class="game-score">⭐ <span id="goose-score">${gooseState.score}</span></div>
      </div>
      <div style="font-size:13px;color:var(--text-light);margin-bottom:12px">
        看到中文，点击对应英文单词的大鹅！
      </div>
      <div id="goose-target" style="text-align:center;font-size:20px;font-weight:700;color:var(--primary);padding:12px;background:#fff9c4;border-radius:12px;margin-bottom:12px">
        点击下方"开始游戏"
      </div>
      <div class="goose-game-area" id="goose-area" style="position:relative;min-height:300px">
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:white;text-align:center">
          <div style="font-size:60px">🦆</div>
          <div>点击开始游戏</div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:12px;font-size:14px">
        <div>⏱️ 时间：<span id="goose-time">30</span>s</div>
        <div>🏆 已抓：<span id="goose-caught">0</span>/${gooseState.needed}</div>
      </div>
      <div style="margin-top:12px;display:flex;gap:8px;justify-content:center">
        <button class="btn btn-success" onclick="startGooseGame()">▶️ 开始游戏</button>
        <button class="btn btn-sm" onclick="stopGooseGame()">⏹️ 停止</button>
      </div>
      <div id="goose-fb" style="margin-top:12px;text-align:center"></div>
    </div>
    <div class="card">
      <div style="font-size:13px;color:var(--text-light);text-align:center">
        🎮 玩法：看顶部的中文提示，在限定时间内点击对应的英文单词大鹅！抓够${gooseState.needed}只通关！
      </div>
    </div>
  `;
}

function startGooseGame() {
  if (gooseState.running) return;
  gooseState.running = true;
  gooseState.caught = 0;
  gooseState.timeLeft = 30;
  
  // 设置目标单词
  setGooseTarget();
  
  // 倒计时
  if (gooseState.timer) clearInterval(gooseState.timer);
  gooseState.timer = setInterval(() => {
    gooseState.timeLeft--;
    const timeEl = $('#goose-time');
    if (timeEl) timeEl.textContent = gooseState.timeLeft;
    if (gooseState.timeLeft <= 0) {
      endGooseGame(false);
    }
  }, 1000);
  
  // 生成大鹅
  spawnGeese();
}

function setGooseTarget() {
  const word = pickRandom(ENGLISH_DATA.words, 1)[0];
  gooseState.target = word.en;
  gooseState.targetCn = word.cn;
  const tEl = $('#goose-target');
  if (tEl) {
    tEl.innerHTML = `找到这个单词：${word.cn} ${word.emoji}<br><span style="font-size:13px;color:var(--text-light)">点击对应的英文大鹅！</span>`;
  }
}

function spawnGeese() {
  if (!gooseState.running) return;
  const area = $('#goose-area');
  if (!area) return;
  
  area.innerHTML = '';
  
  // 生成5只大鹅，1只是正确的
  const correctWord = ENGLISH_DATA.words.find(w => w.en === gooseState.target);
  const otherWords = ENGLISH_DATA.words.filter(w => w.en !== gooseState.target);
  const wrongWords = pickRandom(otherWords, 4);
  const allWords = shuffle([correctWord, ...wrongWords]);
  
  allWords.forEach((w, i) => {
    const goose = document.createElement('div');
    goose.className = 'goose-cloud';
    goose.textContent = `🦢 ${w.en}`;
    goose.style.fontSize = '24px';
    goose.style.fontWeight = '700';
    goose.style.background = 'white';
    goose.style.padding = '8px 12px';
    goose.style.borderRadius = '20px';
    goose.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    
    // 随机位置
    const x = Math.random() * 70 + 5;
    const y = Math.random() * 60 + 10;
    goose.style.left = x + '%';
    goose.style.top = y + '%';
    
    goose.onclick = () => catchGoose(goose, w.en);
    
    // 飘动动画
    let dx = (Math.random() - 0.5) * 2;
    let dy = (Math.random() - 0.5) * 2;
    let curX = x, curY = y;
    const moveInterval = setInterval(() => {
      if (!gooseState.running || !goose.parentNode) {
        clearInterval(moveInterval);
        return;
      }
      curX += dx * 0.5;
      curY += dy * 0.5;
      if (curX < 2 || curX > 85) dx = -dx;
      if (curY < 5 || curY > 75) dy = -dy;
      goose.style.left = curX + '%';
      goose.style.top = curY + '%';
    }, 200);
    
    area.appendChild(goose);
  });
}

function catchGoose(gooseEl, word) {
  if (!gooseState.running) return;
  
  if (word === gooseState.target) {
    // 抓对了
    gooseEl.classList.add('caught');
    gooseState.caught++;
    gooseState.score += 20;
    Store.save('gameScores.goose', gooseState.score);
    $('#goose-score').textContent = gooseState.score;
    $('#goose-caught').textContent = gooseState.caught;
    speakEn(word);
    showToast(`🎉 对了！${word}`, 'success');
    vibrate(30);
    
    setTimeout(() => gooseEl.remove(), 500);
    
    if (gooseState.caught >= gooseState.needed) {
      endGooseGame(true);
    } else {
      // 换一个目标
      setTimeout(() => {
        setGooseTarget();
        spawnGeese();
      }, 600);
    }
  } else {
    // 抓错了
    showToast(`❌ 这是 ${word}，不是 ${gooseState.target}`, 'error');
    gooseState.score = Math.max(0, gooseState.score - 5);
    Store.save('gameScores.goose', gooseState.score);
    $('#goose-score').textContent = gooseState.score;
    speakEn(word);
  }
}

function endGooseGame(win) {
  gooseState.running = false;
  if (gooseState.timer) clearInterval(gooseState.timer);
  
  const area = $('#goose-area');
  if (area) {
    area.innerHTML = `
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;color:white">
        <div style="font-size:60px">${win?'🏆':'⏰'}</div>
        <div style="font-size:20px;font-weight:700">${win?'通关了！':'时间到！'}</div>
        <div style="margin-top:8px">抓到 ${gooseState.caught} 只大鹅</div>
      </div>
    `;
  }
  
  if (win) {
    CatSystem.recordTask(true, 'goosegame');
    CatSystem.addFood('fish', 1);
    showToast('🎉 通关！获得小鱼干🐟', 'success');
    $('#goose-fb').innerHTML = `<div class="method-tip" style="background:#c8e6c9;border-color:var(--success)">🎉 太棒了！获得小鱼干奖励！</div>`;
    gooseState.level++;
  } else {
    $('#goose-fb').innerHTML = `<div class="method-tip" style="background:#fff9c4;border-color:var(--accent)">⏰ 时间到！再来一次吧~</div>`;
  }
}

function stopGooseGame() {
  endGooseGame(false);
}
