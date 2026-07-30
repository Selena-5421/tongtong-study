/**
 * 思维训练：数字规律、图形推理、生活数学、拼图思维、比较大小、时间认知
 */

let thinkingTab = 'numberPattern';
let thinkingIndex = {numberPattern:0, shapePattern:0, lifeMath:0, puzzleMath:0, compare:0, time:0};

function renderThinking() {
  const tabs = [
    {key:'numberPattern', icon:'🔢', name:'数字规律'},
    {key:'shapePattern', icon:'🔷', name:'图形推理'},
    {key:'lifeMath', icon:'🏠', name:'生活数学'},
    {key:'puzzleMath', icon:'🧩', name:'拼图思维'},
    {key:'compare', icon:'⚖️', name:'比较大小'},
    {key:'time', icon:'🕐', name:'时间认知'},
  ];
  
  const html = `
    <div class="page-title">🧩 思维训练</div>
    <div class="page-subtitle">6大类型，天天练，越练越聪明</div>
    
    <div class="tabs">
      ${tabs.map(t => `<div class="tab ${thinkingTab===t.key?'active':''}" onclick="switchThinkingTab('${t.key}')">${t.icon} ${t.name}</div>`).join('')}
    </div>
    
    <div id="thinking-content"></div>
  `;
  $('#page-thinking').innerHTML = html;
  renderThinkingContent();
}

function switchThinkingTab(tab) {
  thinkingTab = tab;
  renderThinking();
}

function renderThinkingContent() {
  const idx = thinkingIndex[thinkingTab];
  const data = THINKING_DATA[thinkingTab];
  
  if (thinkingTab === 'numberPattern') renderNumberPattern(data[idx]);
  else if (thinkingTab === 'shapePattern') renderShapePattern(data[idx]);
  else if (thinkingTab === 'lifeMath') renderLifeMath(data[idx]);
  else if (thinkingTab === 'puzzleMath') renderPuzzleMath(data[idx]);
  else if (thinkingTab === 'compare') renderCompare(data[idx]);
  else if (thinkingTab === 'time') renderTime(data[idx]);
}

function thinkingNext() {
  const data = THINKING_DATA[thinkingTab];
  thinkingIndex[thinkingTab] = (thinkingIndex[thinkingTab] + 1) % data.length;
  renderThinkingContent();
}

function thinkingRecord(correct, q, answer, correctAnswer) {
  if (correct) {
    const r = CatSystem.recordTask(true, 'thinking');
    CatSystem.showTaskReward(r);
    vibrate(30);
    setTimeout(thinkingNext, 1200);
  } else {
    CatSystem.recordTask(false, 'thinking');
    CatSystem.recordWrong(q, answer, correctAnswer, '思维训练');
    showToast('❌ 再想想~', 'error');
    setTimeout(thinkingNext, 2000);
  }
}

// 数字规律
function renderNumberPattern(item) {
  $('#thinking-content').innerHTML = `
    <div class="card">
      <div class="card-title">🔢 找规律填数</div>
      <div class="quiz-question">
        <div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap">
          ${item.seq.map(n => `<div style="font-size:28px;font-weight:700;min-width:40px;padding:8px 12px;background:${n==='?'?'#fff9c4':'white'};border-radius:8px;border:2px solid ${n==='?'?'var(--accent)':'var(--border)'}">${n}</div>`).join('')}
        </div>
      </div>
      <div style="font-size:12px;color:var(--text-light);text-align:center;margin-bottom:12px">❓ 问号处应该填什么数？</div>
      <input type="number" class="answer-input" id="thinking-answer" placeholder="输入答案" onkeypress="if(event.key==='Enter')checkNumberPattern()">
      <div style="margin-top:12px;display:flex;gap:8px">
        <button class="btn btn-success" onclick="checkNumberPattern()">✅ 提交</button>
        <button class="btn btn-warning" onclick="showToast('💡 ${item.hint}','info')">💡 提示</button>
      </div>
      <div id="thinking-fb"></div>
    </div>
  `;
  $('#thinking-answer').focus();
}

function checkNumberPattern() {
  const ans = parseInt($('#thinking-answer').value);
  if (isNaN(ans)) { showToast('请输入数字~','warning'); return; }
  const item = THINKING_DATA.numberPattern[thinkingIndex.numberPattern];
  const fb = $('#thinking-fb');
  if (ans === item.answer) {
    fb.innerHTML = `<div class="method-tip" style="background:#c8e6c9;border-color:var(--success)">🎉 正确！${item.hint}</div>`;
    thinkingRecord(true);
  } else {
    fb.innerHTML = `<div class="method-tip" style="background:#ffcdd2;border-color:var(--danger)">❌ 答案是 ${item.answer}。${item.hint}</div>`;
    thinkingRecord(false, '找规律', ans, item.answer);
  }
}

// 图形推理
function renderShapePattern(item) {
  $('#thinking-content').innerHTML = `
    <div class="card">
      <div class="card-title">🔷 图形推理</div>
      <div class="quiz-question">
        <div style="display:flex;justify-content:center;gap:6px;flex-wrap:wrap">
          ${item.seq.map(s => `<div style="font-size:32px;padding:4px 8px">${s}</div>`).join('')}
          <div style="font-size:32px;padding:4px 8px;background:#fff9c4;border-radius:8px">?</div>
        </div>
      </div>
      <div style="font-size:12px;color:var(--text-light);text-align:center;margin-bottom:12px">下一个应该是什么？</div>
      <div class="quiz-options">
        ${item.options.map((opt, i) => `<div class="quiz-option" style="font-size:28px" onclick="checkShapePattern(${i})">${opt}</div>`).join('')}
      </div>
      <div id="thinking-fb"></div>
    </div>
  `;
}

function checkShapePattern(idx) {
  const item = THINKING_DATA.shapePattern[thinkingIndex.shapePattern];
  const options = $$('#thinking-content .quiz-option');
  options.forEach(o => o.onclick = null);
  if (idx === item.answer) {
    options[idx].classList.add('correct');
    $('#thinking-fb').innerHTML = `<div class="method-tip" style="background:#c8e6c9;border-color:var(--success)">🎉 正确！${item.hint}</div>`;
    thinkingRecord(true);
  } else {
    options[idx].classList.add('wrong');
    options[item.answer].classList.add('correct');
    $('#thinking-fb').innerHTML = `<div class="method-tip" style="background:#ffcdd2;border-color:var(--danger)">❌ ${item.hint}</div>`;
    thinkingRecord(false, '图形推理', item.options[idx], item.options[item.answer]);
  }
}

// 生活数学
function renderLifeMath(item) {
  $('#thinking-content').innerHTML = `
    <div class="card">
      <div class="card-title">🏠 生活数学</div>
      <div class="quiz-question" style="font-size:16px;line-height:1.8">${item.q}</div>
      <div class="quiz-options">
        ${item.options.map((opt, i) => `<div class="quiz-option" onclick="checkLifeMath(${i})">${opt}</div>`).join('')}
      </div>
      <div id="thinking-fb"></div>
    </div>
  `;
}

function checkLifeMath(idx) {
  const item = THINKING_DATA.lifeMath[thinkingIndex.lifeMath];
  const options = $$('#thinking-content .quiz-option');
  options.forEach(o => o.onclick = null);
  if (idx.toString() === item.a.toString()) {
    options[idx].classList.add('correct');
    $('#thinking-fb').innerHTML = `<div class="method-tip" style="background:#c8e6c9;border-color:var(--success)">🎉 正确！${item.hint}</div>`;
    thinkingRecord(true);
  } else {
    options[idx].classList.add('wrong');
    options[parseInt(item.a)].classList.add('correct');
    $('#thinking-fb').innerHTML = `<div class="method-tip" style="background:#ffcdd2;border-color:var(--danger)">❌ ${item.hint}</div>`;
    thinkingRecord(false, item.q, item.options[idx], item.options[parseInt(item.a)]);
  }
}

// 拼图思维
function renderPuzzleMath(item) {
  const cleanQ = item.q.replace(/🟦/g, '◻️');
  $('#thinking-content').innerHTML = `
    <div class="card">
      <div class="card-title">🧩 数一数</div>
      <div class="quiz-question" style="font-size:18px;line-height:2;white-space:pre-line">${cleanQ}</div>
      <input type="number" class="answer-input" id="thinking-answer" placeholder="输入答案" onkeypress="if(event.key==='Enter')checkPuzzleMath()">
      <div style="margin-top:12px;display:flex;gap:8px">
        <button class="btn btn-success" onclick="checkPuzzleMath()">✅ 提交</button>
        <button class="btn btn-warning" onclick="showToast('💡 ${item.hint}','info')">💡 提示</button>
      </div>
      <div id="thinking-fb"></div>
    </div>
  `;
  $('#thinking-answer').focus();
}

function checkPuzzleMath() {
  const ans = parseInt($('#thinking-answer').value);
  if (isNaN(ans)) { showToast('请输入数字~','warning'); return; }
  const item = THINKING_DATA.puzzleMath[thinkingIndex.puzzleMath];
  const fb = $('#thinking-fb');
  if (ans === item.a) {
    fb.innerHTML = `<div class="method-tip" style="background:#c8e6c9;border-color:var(--success)">🎉 正确！${item.hint}</div>`;
    thinkingRecord(true);
  } else {
    fb.innerHTML = `<div class="method-tip" style="background:#ffcdd2;border-color:var(--danger)">❌ 答案是 ${item.a}。${item.hint}</div>`;
    thinkingRecord(false, '数方块', ans, item.a);
  }
}

// 比较大小
function renderCompare(item) {
  $('#thinking-content').innerHTML = `
    <div class="card">
      <div class="card-title">⚖️ 比较大小</div>
      <div class="quiz-question" style="font-size:28px">${item.q.replace('○','?')}</div>
      <div style="font-size:13px;color:var(--text-light);text-align:center;margin-bottom:12px">圆圈里应该填什么？</div>
      <div class="quiz-options">
        <div class="quiz-option" style="font-size:24px" onclick="checkCompare('>')">&gt;</div>
        <div class="quiz-option" style="font-size:24px" onclick="checkCompare('<')">&lt;</div>
        <div class="quiz-option" style="font-size:24px" onclick="checkCompare('=')">=</div>
      </div>
      <div id="thinking-fb"></div>
    </div>
  `;
}

function checkCompare(ans) {
  const item = THINKING_DATA.compare[thinkingIndex.compare];
  const options = $$('#thinking-content .quiz-option');
  options.forEach(o => o.onclick = null);
  const symMap = {'>':0, '<':1, '=':2};
  if (ans === item.answer) {
    options[symMap[ans]].classList.add('correct');
    $('#thinking-fb').innerHTML = `<div class="method-tip" style="background:#c8e6c9;border-color:var(--success)">🎉 正确！${item.a} ${item.answer} ${item.b}</div>`;
    thinkingRecord(true);
  } else {
    options[symMap[ans]].classList.add('wrong');
    options[symMap[item.answer]].classList.add('correct');
    $('#thinking-fb').innerHTML = `<div class="method-tip" style="background:#ffcdd2;border-color:var(--danger)">❌ ${item.a} ${item.answer} ${item.b}</div>`;
    thinkingRecord(false, item.q, ans, item.answer);
  }
}

// 时间认知
function renderTime(item) {
  $('#thinking-content').innerHTML = `
    <div class="card">
      <div class="card-title">🕐 时间认知</div>
      <div class="quiz-question" style="font-size:16px;line-height:1.8">${item.q}</div>
      <div class="quiz-options">
        ${item.options.map((opt, i) => `<div class="quiz-option" onclick="checkTime(${i})">${opt}</div>`).join('')}
      </div>
      <div id="thinking-fb"></div>
    </div>
  `;
}

function checkTime(idx) {
  const item = THINKING_DATA.time[thinkingIndex.time];
  const options = $$('#thinking-content .quiz-option');
  options.forEach(o => o.onclick = null);
  const correctIdx = item.options.indexOf(item.a);
  if (idx === correctIdx) {
    options[idx].classList.add('correct');
    $('#thinking-fb').innerHTML = `<div class="method-tip" style="background:#c8e6c9;border-color:var(--success)">🎉 正确！${item.hint}</div>`;
    thinkingRecord(true);
  } else {
    options[idx].classList.add('wrong');
    options[correctIdx].classList.add('correct');
    $('#thinking-fb').innerHTML = `<div class="method-tip" style="background:#ffcdd2;border-color:var(--danger)">❌ ${item.hint}</div>`;
    thinkingRecord(false, item.q, item.options[idx], item.a);
  }
}
