/**
 * 语文学习模块：每日10字 + 拼音拼读 + 阅读理解
 */

let chineseTab = 'hanzi';
let hanziCarouselIndex = 0;

function renderChinese() {
  const html = `
    <div class="page-title">📚 语文学习</div>
    <div class="page-subtitle">每日10个字 · 拼音拼读 · 阅读理解</div>
    
    <div class="tabs">
      <div class="tab ${chineseTab==='hanzi'?'active':''}" onclick="switchChineseTab('hanzi')">每日识字</div>
      <div class="tab ${chineseTab==='pinyin'?'active':''}" onclick="switchChineseTab('pinyin')">拼音拼读</div>
      <div class="tab ${chineseTab==='reading'?'active':''}" onclick="switchChineseTab('reading')">阅读理解</div>
    </div>
    
    <div id="chinese-content"></div>
  `;
  $('#page-chinese').innerHTML = html;
  renderChineseContent();
}

function switchChineseTab(tab) {
  chineseTab = tab;
  renderChinese();
}

function renderChineseContent() {
  const container = $('#chinese-content');
  if (chineseTab === 'hanzi') renderHanzi();
  else if (chineseTab === 'pinyin') renderPinyin();
  else if (chineseTab === 'reading') renderReading();
}

// ============ 每日识字 ============
function renderHanzi() {
  const progress = Store.get('progress');
  const weekData = HANZI_DATA.find(w => w.week === progress.hanziWeek) || HANZI_DATA[0];
  const learned = Store.get('stats').learnedHanzi;
  const container = $('#chinese-content');
  
  let html = `
    <div class="card">
      <div class="card-title">
        <span>第${progress.hanziWeek}周的汉字</span>
        <span style="font-size:12px;color:var(--text-light)">已学${learned.length}字</span>
      </div>
      <div class="carousel">
        <div class="carousel-track" id="hanzi-track">
          ${weekData.list.map((h, i) => `
            <div class="carousel-slide">
              <div class="hanzi-card">
                <div class="hanzi-big">${h.zi}</div>
                <div class="hanzi-pinyin">${h.pinyin}</div>
                <div class="hanzi-emoji">${h.emoji}</div>
                <div class="hanzi-word">组词：${h.word}</div>
                <div class="hanzi-phrase">例句：${h.phrase}</div>
                <div style="margin-top:12px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
                  <button class="btn btn-sm" onclick="speakHanzi(${i})">🔊 朗读</button>
                  <button class="btn btn-sm btn-secondary" onclick="readAlong(${i})">🎤 跟读</button>
                  <button class="btn btn-sm btn-success" onclick="markHanziLearned(${i})">✅ 打卡</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="carousel-nav">
        <button class="btn btn-sm" onclick="hanziPrev()">⬅️ 上一个</button>
        <div class="carousel-dots" id="hanzi-dots">
          ${weekData.list.map((_,i) => `<div class="carousel-dot ${i===hanziCarouselIndex?'active':''}" onclick="hanziGoto(${i})"></div>`).join('')}
        </div>
        <button class="btn btn-sm" onclick="hanziNext()">下一个 ➡️</button>
      </div>
    </div>
    
    <div class="card">
      <div class="card-title">📋 本周全部汉字</div>
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px">
        ${weekData.list.map((h,i) => `
          <div style="text-align:center;padding:8px;background:${learned.includes(h.zi)?'#c8e6c9':'#f5f5f5'};border-radius:8px;cursor:pointer" onclick="hanziGoto(${i})">
            <div style="font-size:24px;font-weight:700">${h.zi}</div>
            <div style="font-size:10px;color:var(--text-light)">${h.pinyin}</div>
            ${learned.includes(h.zi)?'<div style="font-size:10px;color:var(--success)">✅</div>':''}
          </div>
        `).join('')}
      </div>
    </div>
    
    <div style="display:flex;gap:8px;margin-top:12px">
      ${progress.hanziWeek > 1 ? `<button class="btn btn-sm" onclick="changeHanziWeek(-1)">⬅️ 上一周</button>` : ''}
      ${progress.hanziWeek < HANZI_DATA.length ? `<button class="btn btn-sm" onclick="changeHanziWeek(1)">下一周 ➡️</button>` : ''}
    </div>
  `;
  
  container.innerHTML = html;
  updateHanziCarousel();
}

function speakHanzi(index) {
  const progress = Store.get('progress');
  const weekData = HANZI_DATA.find(w => w.week === progress.hanziWeek) || HANZI_DATA[0];
  const h = weekData.list[index];
  speak(`${h.zi}，${h.pinyin}，${h.word}，${h.phrase}`);
  vibrate(20);
}

function readAlong(index) {
  speakHanzi(index);
  showToast('🎤 请跟着读一遍吧~', 'info');
  // 跟读打卡也算完成
  const progress = Store.get('progress');
  const weekData = HANZI_DATA.find(w => w.week === progress.hanziWeek) || HANZI_DATA[0];
  const h = weekData.list[index];
  const learned = Store.get('stats').learnedHanzi;
  if (!learned.includes(h.zi)) {
    learned.push(h.zi);
    Store.save('stats.learnedHanzi', learned);
    const r = CatSystem.recordTask(true, 'chinese');
    CatSystem.showTaskReward(r);
  }
}

function markHanziLearned(index) {
  const progress = Store.get('progress');
  const weekData = HANZI_DATA.find(w => w.week === progress.hanziWeek) || HANZI_DATA[0];
  const h = weekData.list[index];
  const learned = Store.get('stats').learnedHanzi;
  if (learned.includes(h.zi)) {
    showToast('这个字已经学过啦~', 'info');
    return;
  }
  learned.push(h.zi);
  Store.save('stats.learnedHanzi', learned);
  const r = CatSystem.recordTask(true, 'chinese');
  CatSystem.showTaskReward(r);
  vibrate(30);
  renderHanzi();
}

function hanziNext() {
  const progress = Store.get('progress');
  const weekData = HANZI_DATA.find(w => w.week === progress.hanziWeek) || HANZI_DATA[0];
  hanziCarouselIndex = (hanziCarouselIndex + 1) % weekData.list.length;
  updateHanziCarousel();
}

function hanziPrev() {
  const progress = Store.get('progress');
  const weekData = HANZI_DATA.find(w => w.week === progress.hanziWeek) || HANZI_DATA[0];
  hanziCarouselIndex = (hanziCarouselIndex - 1 + weekData.list.length) % weekData.list.length;
  updateHanziCarousel();
}

function hanziGoto(i) {
  hanziCarouselIndex = i;
  updateHanziCarousel();
}

function updateHanziCarousel() {
  const track = $('#hanzi-track');
  if (track) {
    track.style.transform = `translateX(-${hanziCarouselIndex * 100}%)`;
    $$('#hanzi-dots .carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === hanziCarouselIndex);
    });
  }
}

function changeHanziWeek(delta) {
  const progress = Store.get('progress');
  progress.hanziWeek += delta;
  if (progress.hanziWeek < 1) progress.hanziWeek = 1;
  if (progress.hanziWeek > HANZI_DATA.length) progress.hanziWeek = HANZI_DATA.length;
  Store.save('progress', progress);
  hanziCarouselIndex = 0;
  renderHanzi();
}

// ============ 拼音拼读 ============
function renderPinyin() {
  const html = `
    <div class="card">
      <div class="card-title">🔤 声母（23个）</div>
      <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px">
        ${PINYIN_DATA.shengmu.map(p => `
          <div style="text-align:center;padding:10px;background:#e3f2fd;border-radius:8px;cursor:pointer;font-size:18px;font-weight:600;color:var(--secondary)" onclick="speak('${p}')">${p}</div>
        `).join('')}
      </div>
    </div>
    
    <div class="card">
      <div class="card-title">🎵 韵母（24个）</div>
      <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px">
        ${PINYIN_DATA.yunmu.map(p => `
          <div style="text-align:center;padding:10px;background:#f3e5f5;border-radius:8px;cursor:pointer;font-size:16px;font-weight:600;color:#ab47bc" onclick="speak('${p}')">${p}</div>
        `).join('')}
      </div>
    </div>
    
    <div class="card">
      <div class="card-title">⭐ 整体认读音节（16个）</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">
        ${PINYIN_DATA.zhengti.map(p => `
          <div style="text-align:center;padding:10px;background:#fff9c4;border-radius:8px;cursor:pointer;font-size:16px;font-weight:600;color:#f57f17" onclick="speak('${p}')">${p}</div>
        `).join('')}
      </div>
    </div>
    
    <div class="card">
      <div class="card-title">📖 拼读练习</div>
      <div style="font-size:12px;color:var(--text-light);margin-bottom:10px">点读音节，再点读词语</div>
      <div id="pinyin-quiz"></div>
    </div>
  `;
  $('#chinese-content').innerHTML = html;
  renderPinyinQuiz();
}

let pinyinQuizIndex = 0;
function renderPinyinQuiz() {
  const item = PINYIN_DATA.spellPractice[pinyinQuizIndex];
  const parts = item.pinyin.split('-');
  
  $('#pinyin-quiz').innerHTML = `
    <div style="text-align:center;padding:20px;background:linear-gradient(135deg,#e3f2fd,#f3e5f5);border-radius:12px">
      <div style="display:flex;justify-content:center;gap:12px;margin-bottom:16px">
        ${parts.map((p,i) => i < parts.length-1 ? `
          <div style="font-size:32px;font-weight:700;color:var(--primary);cursor:pointer" onclick="speak('${p}')">${p}</div>
          <div style="font-size:32px;color:var(--text-light)">+</div>
        ` : `<div style="font-size:32px;font-weight:700;color:var(--success);cursor:pointer" onclick="speak('${p}')">${p}</div>`).join('')}
      </div>
      <div style="font-size:48px;margin:12px 0">${item.emoji}</div>
      <div style="font-size:36px;font-weight:700;color:var(--secondary);cursor:pointer" onclick="speak('${item.word}')">${item.word}</div>
      <div style="margin-top:16px;display:flex;gap:8px;justify-content:center">
        <button class="btn btn-sm" onclick="speak('${item.pinyin.replace(/-/g,'')}')">🔊 拼读</button>
        <button class="btn btn-sm btn-success" onclick="pinyinQuizNext()">✅ 学会了</button>
      </div>
    </div>
    <div style="text-align:center;margin-top:8px;font-size:12px;color:var(--text-light)">
      ${pinyinQuizIndex + 1} / ${PINYIN_DATA.spellPractice.length}
    </div>
  `;
}

function pinyinQuizNext() {
  const r = CatSystem.recordTask(true, 'pinyin');
  CatSystem.showTaskReward(r);
  pinyinQuizIndex = (pinyinQuizIndex + 1) % PINYIN_DATA.spellPractice.length;
  renderPinyinQuiz();
}

// ============ 阅读理解 ============
let readingIndex = 0;
let readingQIndex = 0;

function renderReading() {
  const item = READING_DATA[readingIndex];
  const html = `
    <div class="card">
      <div class="card-title">📖 阅读理解 ${readingIndex+1}/${READING_DATA.length}</div>
      <div style="background:#fff9c4;padding:16px;border-radius:12px;font-size:15px;line-height:2;color:var(--text)">
        ${item.passage}
      </div>
      <button class="btn btn-sm" style="margin-top:10px" onclick="speak('${item.passage.replace(/'/g,'')}')">🔊 朗读全文</button>
    </div>
    
    <div class="card">
      <div class="card-title">❓ 问题（${readingQIndex+1}/${item.questions.length}）</div>
      <div id="reading-quiz"></div>
    </div>
  `;
  $('#chinese-content').innerHTML = html;
  renderReadingQuiz();
}

function renderReadingQuiz() {
  const item = READING_DATA[readingIndex];
  const q = item.questions[readingQIndex];
  $('#reading-quiz').innerHTML = `
    <div class="quiz-question">${q.q}</div>
    <div class="quiz-options">
      ${q.options.map((opt, i) => `
        <div class="quiz-option" onclick="answerReading(${i})">${opt}</div>
      `).join('')}
    </div>
  `;
}

function answerReading(idx) {
  const item = READING_DATA[readingIndex];
  const q = item.questions[readingQIndex];
  const options = $$('#reading-quiz .quiz-option');
  options.forEach(o => o.onclick = null);
  
  if (idx === q.a) {
    options[idx].classList.add('correct');
    const r = CatSystem.recordTask(true, 'reading');
    CatSystem.showTaskReward(r);
    vibrate(30);
    setTimeout(() => {
      readingQIndex++;
      if (readingQIndex >= item.questions.length) {
        readingQIndex = 0;
        readingIndex = (readingIndex + 1) % READING_DATA.length;
        showToast('🎉 这篇读完了，下一篇！', 'success');
        renderReading();
      } else {
        renderReadingQuiz();
      }
    }, 1200);
  } else {
    options[idx].classList.add('wrong');
    options[q.a].classList.add('correct');
    CatSystem.recordTask(false, 'reading');
    CatSystem.recordWrong(q.q, q.options[idx], q.options[q.a], '阅读理解');
    showToast('❌ 再想想~', 'error');
    setTimeout(() => {
      readingQIndex++;
      if (readingQIndex >= item.questions.length) {
        readingQIndex = 0;
        readingIndex = (readingIndex + 1) % READING_DATA.length;
        renderReading();
      } else {
        renderReadingQuiz();
      }
    }, 2000);
  }
}
