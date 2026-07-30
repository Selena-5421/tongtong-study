/**
 * 英语学习：单词 + 短句跟读 + 小动画 + 找不同 + 自然拼读
 */

let englishTab = 'words';

function renderEnglish() {
  const html = `
    <div class="page-title">🔤 英语学习</div>
    <div class="page-subtitle">单词 · 短句 · 自然拼读 · 找不同</div>
    
    <div class="tabs">
      <div class="tab ${englishTab==='words'?'active':''}" onclick="switchEnglishTab('words')">学单词</div>
      <div class="tab ${englishTab==='sentences'?'active':''}" onclick="switchEnglishTab('sentences')">短句跟读</div>
      <div class="tab ${englishTab==='animation'?'active':''}" onclick="switchEnglishTab('animation')">英语动画</div>
      <div class="tab ${englishTab==='spotdiff'?'active':''}" onclick="switchEnglishTab('spotdiff')">找不同</div>
      <div class="tab ${englishTab==='phonics'?'active':''}" onclick="switchEnglishTab('phonics')">自然拼读</div>
    </div>
    
    <div id="english-content"></div>
  `;
  $('#page-english').innerHTML = html;
  renderEnglishContent();
}

function switchEnglishTab(tab) {
  englishTab = tab;
  renderEnglish();
}

function renderEnglishContent() {
  if (englishTab === 'words') renderWords();
  else if (englishTab === 'sentences') renderSentences();
  else if (englishTab === 'animation') renderAnimation();
  else if (englishTab === 'spotdiff') renderSpotDiff();
  else if (englishTab === 'phonics') renderPhonics();
}

// ============ 单词学习 ============
let wordIndex = 0;
function renderWords() {
  const words = ENGLISH_DATA.words;
  const w = words[wordIndex];
  const learned = Store.get('stats').learnedWords;
  const isLearned = learned.includes(w.en);
  
  $('#english-content').innerHTML = `
    <div class="card">
      <div class="card-title">
        <span>📖 学单词 ${wordIndex+1}/${words.length}</span>
        <span style="font-size:12px;color:var(--text-light)">分类：${w.category}</span>
      </div>
      <div class="word-card">
        <div class="word-emoji">${w.emoji}</div>
        <div class="word-en">${w.en}</div>
        <div class="word-cn">${w.cn}</div>
      </div>
      <div style="margin-top:12px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
        <button class="btn" onclick="speakEn('${w.en}')">🔊 朗读</button>
        <button class="btn btn-secondary" onclick="speakEnSlow('${w.en}')">🐢 慢速读</button>
        <button class="btn btn-success" onclick="markWordLearned()" ${isLearned?'disabled':''}>${isLearned?'✅ 已学':'✅ 跟读打卡'}</button>
      </div>
    </div>
    
    <div style="display:flex;gap:8px;margin-bottom:12px">
      <button class="btn btn-sm" onclick="wordPrev()">⬅️ 上一个</button>
      <button class="btn btn-sm" onclick="wordNext()">下一个 ➡️</button>
    </div>
    
    <div class="card">
      <div class="card-title">📋 分类选择</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        ${['水果','动物','颜色','数字','食物','物品'].map(cat => `
          <div class="tab" onclick="jumpToCategory('${cat}')">${cat}</div>
        `).join('')}
      </div>
    </div>
    
    <div class="card">
      <div class="card-title">📊 已学单词：${learned.length}/${words.length}</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${learned.length/words.length*100}%"></div>
      </div>
    </div>
  `;
}

function speakEnSlow(text) {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.5;
    speechSynthesis.speak(u);
  }
}

function markWordLearned() {
  const w = ENGLISH_DATA.words[wordIndex];
  const learned = Store.get('stats').learnedWords;
  if (!learned.includes(w.en)) {
    learned.push(w.en);
    Store.save('stats.learnedWords', learned);
    const r = CatSystem.recordTask(true, 'english');
    CatSystem.showTaskReward(r);
    vibrate(30);
    renderWords();
  }
}

function wordNext() {
  wordIndex = (wordIndex + 1) % ENGLISH_DATA.words.length;
  renderWords();
}

function wordPrev() {
  wordIndex = (wordIndex - 1 + ENGLISH_DATA.words.length) % ENGLISH_DATA.words.length;
  renderWords();
}

function jumpToCategory(cat) {
  const idx = ENGLISH_DATA.words.findIndex(w => w.category === cat);
  if (idx >= 0) { wordIndex = idx; renderWords(); }
}

// ============ 短句跟读 ============
let sentenceIndex = 0;
function renderSentences() {
  const s = ENGLISH_DATA.sentences[sentenceIndex];
  $('#english-content').innerHTML = `
    <div class="card">
      <div class="card-title">💬 短句跟读 ${sentenceIndex+1}/${ENGLISH_DATA.sentences.length}</div>
      <div class="word-card">
        <div class="word-en" style="font-size:22px">${s.en}</div>
        <div class="word-cn" style="margin-top:8px">${s.cn}</div>
      </div>
      <div style="margin-top:12px;display:flex;gap:8px;justify-content:center">
        <button class="btn" onclick="speakEn('${s.en}')">🔊 朗读</button>
        <button class="btn btn-secondary" onclick="speakEnSlow('${s.en}')">🐢 慢速</button>
        <button class="btn btn-success" onclick="sentenceRead()">✅ 跟读打卡</button>
      </div>
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-sm" onclick="sentencePrev()">⬅️ 上一句</button>
      <button class="btn btn-sm" onclick="sentenceNext()">下一句 ➡️</button>
    </div>
  `;
}

function sentenceRead() {
  const r = CatSystem.recordTask(true, 'sentence');
  CatSystem.showTaskReward(r);
  sentenceNext();
}

function sentenceNext() {
  sentenceIndex = (sentenceIndex + 1) % ENGLISH_DATA.sentences.length;
  renderSentences();
}

function sentencePrev() {
  sentenceIndex = (sentenceIndex - 1 + ENGLISH_DATA.sentences.length) % ENGLISH_DATA.sentences.length;
  renderSentences();
}

// ============ 英语小动画 ============
let animIndex = 0;
function renderAnimation() {
  const sentences = ENGLISH_DATA.sentences;
  const s = sentences[animIndex];
  
  $('#english-content').innerHTML = `
    <div class="card">
      <div class="card-title">🎬 英语小动画 ${animIndex+1}/${sentences.length}</div>
      <div class="english-animation" id="anim-stage">
        <div style="padding-top:10px">
          <div class="speech-bubble" id="anim-bubble">${s.en}</div>
        </div>
        <div class="anim-character" id="anim-char">👧</div>
      </div>
      <div style="margin-top:12px;text-align:center;font-size:14px;color:var(--text-light)">${s.cn}</div>
      <div style="margin-top:12px;display:flex;gap:8px;justify-content:center">
        <button class="btn" onclick="playAnimation()">▶️ 播放动画</button>
        <button class="btn btn-secondary" onclick="speakEn('${s.en}')">🔊 读句子</button>
        <button class="btn btn-success" onclick="animNext()">⏭️ 下一个</button>
      </div>
    </div>
    <div class="card">
      <div style="font-size:13px;color:var(--text-light);text-align:center">点击"播放动画"，看小女孩走动说话！</div>
    </div>
  `;
}

function playAnimation() {
  const char = $('#anim-char');
  const bubble = $('#anim-bubble');
  char.classList.remove('walk');
  bubble.style.opacity = '0';
  
  setTimeout(() => {
    char.classList.add('walk');
    setTimeout(() => {
      bubble.style.opacity = '1';
      bubble.style.transition = 'opacity 0.3s';
      const s = ENGLISH_DATA.sentences[animIndex];
      speakEn(s.en);
    }, 1500);
  }, 100);
}

function animNext() {
  animIndex = (animIndex + 1) % ENGLISH_DATA.sentences.length;
  renderAnimation();
}

// ============ 找不同 ============
let diffIndex = 0;
let diffFound = [];
function renderSpotDiff() {
  const item = ENGLISH_DATA.spotDiff[diffIndex];
  diffFound = [];
  
  // 找出不同项
  const diffs = [];
  for (let i = 0; i < item.set1.length; i++) {
    if (item.set1[i] !== item.set2[i]) diffs.push(i);
  }
  
  $('#english-content').innerHTML = `
    <div class="card">
      <div class="card-title">🔍 找不同 ${diffIndex+1}/${ENGLISH_DATA.spotDiff.length}</div>
      <div style="font-size:13px;color:var(--text-light);margin-bottom:10px">找出两组图片中不同的地方！共${diffs.length}处不同</div>
      <div style="font-size:13px;color:var(--primary);margin-bottom:10px">已找到：<span id="diff-count">0</span>/${diffs.length}</div>
      
      <div style="font-size:14px;font-weight:600;margin-bottom:6px">第一组：</div>
      <div class="diff-set" id="diff-set1">
        ${item.set1.map((e, i) => `<div class="diff-item" data-idx="${i}" data-set="1" onclick="checkDiff(${i})">${e}</div>`).join('')}
      </div>
      
      <div style="font-size:14px;font-weight:600;margin:12px 0 6px">第二组：</div>
      <div class="diff-set" id="diff-set2">
        ${item.set2.map((e, i) => `<div class="diff-item" data-idx="${i}" data-set="2" onclick="checkDiff2(${i})">${e}</div>`).join('')}
      </div>
      
      <div id="diff-fb" style="margin-top:12px"></div>
    </div>
  `;
  
  // 存储正确答案
  window._diffs = diffs;
}

function checkDiff(idx) {
  doCheckDiff(idx, 1);
}

function checkDiff2(idx) {
  doCheckDiff(idx, 2);
}

function doCheckDiff(idx, setNum) {
  if (diffFound.includes(idx)) return;
  const diffs = window._diffs;
  
  if (diffs.includes(idx)) {
    diffFound.push(idx);
    // 标记两组对应位置
    $$(`#diff-set1 .diff-item`)[idx].classList.add('found');
    $$(`#diff-set2 .diff-item`)[idx].classList.add('found');
    $('#diff-count').textContent = diffFound.length;
    speakEn(ENGLISH_DATA.spotDiff[diffIndex][`set${setNum}`][idx].replace(/[^a-zA-Z]/g,''));
    
    if (diffFound.length >= diffs.length) {
      const r = CatSystem.recordTask(true, 'spotdiff');
      CatSystem.showTaskReward(r);
      $('#diff-fb').innerHTML = `<div class="method-tip" style="background:#c8e6c9;border-color:var(--success)">🎉 全部找到了！太棒了！</div>`;
      showToast('🎉 全部找到！', 'success');
      vibrate(30);
      setTimeout(() => {
        diffIndex = (diffIndex + 1) % ENGLISH_DATA.spotDiff.length;
        renderSpotDiff();
      }, 1500);
    }
  } else {
    showToast('这里没有不同哦~', 'info');
  }
}

// ============ 自然拼读 ============
function renderPhonics() {
  const progress = Store.get('progress');
  const idx = progress.phonicsIndex;
  const p = ENGLISH_DATA.phonics[idx];
  
  $('#english-content').innerHTML = `
    <div class="card">
      <div class="card-title">
        <span>🔤 自然拼读 ${idx+1}/${ENGLISH_DATA.phonics.length}</span>
      </div>
      <div class="word-card">
        <div class="word-emoji">${p.emoji}</div>
        <div style="font-size:48px;font-weight:700;color:var(--primary)">${p.letter}</div>
        <div style="font-size:18px;color:var(--secondary)">发音：${p.sound}</div>
      </div>
      <div style="margin-top:12px;display:flex;gap:8px;justify-content:center">
        <button class="btn" onclick="speakEn('${p.letter.toLowerCase()}')">🔊 读字母</button>
        <button class="btn btn-secondary" onclick="speakEn('${p.sound.replace(/\//g,'')}')">🔊 读发音</button>
      </div>
    </div>
    
    <div class="card">
      <div class="card-title">📖 含此字母的单词</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
        ${p.words.map(w => {
          const wordData = ENGLISH_DATA.words.find(wd => wd.en === w);
          return `
            <div style="text-align:center;padding:12px;background:#e3f2fd;border-radius:8px;cursor:pointer" onclick="speakEn('${w}')">
              <div style="font-size:28px">${wordData ? wordData.emoji : '🔤'}</div>
              <div style="font-size:14px;font-weight:600;color:var(--secondary);margin-top:4px">${w}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
    
    <div class="card">
      <div class="card-title">✏️ 拼读练习</div>
      <div style="font-size:14px;color:var(--text-light);margin-bottom:10px">把字母和发音连起来读</div>
      <div style="display:flex;justify-content:center;align-items:center;gap:12px;padding:20px;background:linear-gradient(135deg,#fff9c4,#ffe0b2);border-radius:12px">
        <div style="font-size:36px;font-weight:700;color:var(--primary)" onclick="speakEn('${p.letter.toLowerCase()}')">${p.letter}</div>
        <div style="font-size:24px;color:var(--text-light)">→</div>
        <div style="font-size:24px;color:var(--secondary)" onclick="speakEn('${p.sound.replace(/\//g,'')}')">${p.sound}</div>
      </div>
    </div>
    
    <div style="display:flex;gap:8px">
      ${idx > 0 ? '<button class="btn btn-sm" onclick="phonicsPrev()">⬅️ 上一个</button>' : ''}
      <button class="btn btn-sm btn-success" onclick="phonicsNext()">✅ 学会了，下一个 ➡️</button>
    </div>
  `;
}

function phonicsNext() {
  const r = CatSystem.recordTask(true, 'phonics');
  CatSystem.showTaskReward(r);
  const progress = Store.get('progress');
  progress.phonicsIndex = (progress.phonicsIndex + 1) % ENGLISH_DATA.phonics.length;
  Store.save('progress', progress);
  renderPhonics();
}

function phonicsPrev() {
  const progress = Store.get('progress');
  progress.phonicsIndex = (progress.phonicsIndex - 1 + ENGLISH_DATA.phonics.length) % ENGLISH_DATA.phonics.length;
  Store.save('progress', progress);
  renderPhonics();
}
