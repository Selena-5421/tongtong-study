/**
 * 算术天地：40以内加减法 + 破十法 + 凑十法 + 应用题
 */

let mathTab = 'practice';
let mathQuiz = null;

function renderMath() {
  const html = `
    <div class="page-title">🔢 算术天地</div>
    <div class="page-subtitle">40以内加减 · 破十法 · 凑十法 · 应用题</div>
    
    <div class="tabs">
      <div class="tab ${mathTab==='practice'?'active':''}" onclick="switchMathTab('practice')">加减练习</div>
      <div class="tab ${mathTab==='breakten'?'active':''}" onclick="switchMathTab('breakten')">破十法</div>
      <div class="tab ${mathTab==='maketen'?'active':''}" onclick="switchMathTab('maketen')">凑十法</div>
      <div class="tab ${mathTab==='word'?'active':''}" onclick="switchMathTab('word')">应用题</div>
    </div>
    
    <div id="math-content"></div>
  `;
  $('#page-math').innerHTML = html;
  renderMathContent();
}

function switchMathTab(tab) {
  mathTab = tab;
  renderMath();
}

function renderMathContent() {
  if (mathTab === 'practice') renderMathPractice();
  else if (mathTab === 'breakten') renderBreakTen();
  else if (mathTab === 'maketen') renderMakeTen();
  else if (mathTab === 'word') renderWordProblem();
}

// ============ 加减练习 ============
function renderMathPractice() {
  if (!mathQuiz || mathTab !== 'practice') {
    newMathQuiz();
  }
  $('#math-content').innerHTML = `
    <div class="card">
      <div class="card-title">
        <span>🧮 做一做</span>
        <span style="font-size:12px;color:var(--text-light)">答对得食物哦</span>
      </div>
      <div class="quiz-question" style="font-size:36px">${mathQuiz.question}</div>
      <input type="number" class="answer-input" id="math-answer" placeholder="输入答案" 
        onkeypress="if(event.key==='Enter')checkMathAnswer()">
      <div style="margin-top:12px;display:flex;gap:8px">
        <button class="btn btn-success" onclick="checkMathAnswer()">✅ 提交</button>
        <button class="btn btn-secondary" onclick="speakMath()">🔊 读题</button>
        <button class="btn btn-warning" onclick="newMathQuiz();renderMathPractice()">🔄 换一题</button>
      </div>
      <div id="math-feedback"></div>
    </div>
  `;
  $('#math-answer').focus();
}

function newMathQuiz() {
  const type = Math.random() > 0.5 ? 'add' : 'sub';
  mathQuiz = type === 'add' ? MATH_DATA.generateAdd(40) : MATH_DATA.generateSub(40);
}

function checkMathAnswer() {
  const input = $('#math-answer');
  const ans = parseInt(input.value);
  if (isNaN(ans)) {
    showToast('请输入数字~', 'warning');
    return;
  }
  
  const fb = $('#math-feedback');
  if (ans === mathQuiz.answer) {
    fb.innerHTML = `<div class="method-tip" style="background:#c8e6c9;border-color:var(--success)">🎉 答对了！太棒了！</div>`;
    const r = CatSystem.recordTask(true, 'math');
    CatSystem.showTaskReward(r);
    vibrate(30);
    setTimeout(() => { newMathQuiz(); renderMathPractice(); }, 1200);
  } else {
    fb.innerHTML = `<div class="method-tip" style="background:#ffcdd2;border-color:var(--danger)">❌ 再算算，正确答案是 ${mathQuiz.answer}</div>`;
    CatSystem.recordTask(false, 'math');
    CatSystem.recordWrong(mathQuiz.question, ans, mathQuiz.answer, '算术');
    showToast('❌ 答错了，继续加油！', 'error');
    setTimeout(() => { newMathQuiz(); renderMathPractice(); }, 2000);
  }
}

function speakMath() {
  speak(mathQuiz.question.replace('=?', '等于几'));
}

// ============ 破十法 ============
let breakTenIndex = 0;
function renderBreakTen() {
  const item = MATH_DATA.breakTen[breakTenIndex];
  $('#math-content').innerHTML = `
    <div class="card">
      <div class="card-title">
        <span>💔 破十法 ${breakTenIndex+1}/${MATH_DATA.breakTen.length}</span>
      </div>
      <div class="quiz-question" style="font-size:32px">${item.question}</div>
      <div class="method-tip">💡 ${item.method}</div>
      <input type="number" class="answer-input" id="breakten-answer" placeholder="输入答案" 
        onkeypress="if(event.key==='Enter')checkBreakTen()">
      <div style="margin-top:12px;display:flex;gap:8px">
        <button class="btn btn-success" onclick="checkBreakTen()">✅ 提交</button>
        <button class="btn btn-secondary" onclick="speak('${item.question.replace(/=/g,'等于').replace(/\?/g,'几')}')">🔊 读题</button>
      </div>
      <div id="breakten-feedback"></div>
    </div>
    <div class="card">
      <div class="card-title">📖 破十法小课堂</div>
      <div style="font-size:14px;line-height:1.8;color:var(--text)">
        <p>💡 <b>破十法</b>是用来计算<b>十几减几</b>的好方法！</p>
        <p>步骤：</p>
        <p>1️⃣ 把十几分成 <b>10</b> 和 <b>几</b></p>
        <p>2️⃣ 用 <b>10</b> 去减减数</p>
        <p>3️⃣ 再把结果加上剩下的几</p>
        <p>📌 例：12 - 5 = ?</p>
        <p>12 = 10 + 2</p>
        <p>10 - 5 = 5</p>
        <p>5 + 2 = <b>7</b> ✅</p>
      </div>
    </div>
  `;
  $('#breakten-answer').focus();
}

function checkBreakTen() {
  const ans = parseInt($('#breakten-answer').value);
  if (isNaN(ans)) { showToast('请输入数字~', 'warning'); return; }
  const item = MATH_DATA.breakTen[breakTenIndex];
  const fb = $('#breakten-feedback');
  if (ans === item.answer) {
    fb.innerHTML = `<div class="method-tip" style="background:#c8e6c9;border-color:var(--success)">🎉 答对了！</div>`;
    const r = CatSystem.recordTask(true, 'breakten');
    CatSystem.showTaskReward(r);
    setTimeout(() => { breakTenIndex = (breakTenIndex+1) % MATH_DATA.breakTen.length; renderBreakTen(); }, 1200);
  } else {
    fb.innerHTML = `<div class="method-tip" style="background:#ffcdd2;border-color:var(--danger)">❌ 答案是 ${item.answer}，看看上面的方法~</div>`;
    CatSystem.recordTask(false, 'breakten');
    CatSystem.recordWrong(item.question, ans, item.answer, '破十法');
    setTimeout(() => { breakTenIndex = (breakTenIndex+1) % MATH_DATA.breakTen.length; renderBreakTen(); }, 2000);
  }
}

// ============ 凑十法 ============
let makeTenIndex = 0;
function renderMakeTen() {
  const item = MATH_DATA.makeTen[makeTenIndex];
  $('#math-content').innerHTML = `
    <div class="card">
      <div class="card-title">
        <span>🤝 凑十法 ${makeTenIndex+1}/${MATH_DATA.makeTen.length}</span>
      </div>
      <div class="quiz-question" style="font-size:32px">${item.question}</div>
      <div class="method-tip">💡 ${item.method}</div>
      <input type="number" class="answer-input" id="maketen-answer" placeholder="输入答案" 
        onkeypress="if(event.key==='Enter')checkMakeTen()">
      <div style="margin-top:12px;display:flex;gap:8px">
        <button class="btn btn-success" onclick="checkMakeTen()">✅ 提交</button>
        <button class="btn btn-secondary" onclick="speak('${item.question.replace(/=/g,'等于').replace(/\?/g,'几')}')">🔊 读题</button>
      </div>
      <div id="maketen-feedback"></div>
    </div>
    <div class="card">
      <div class="card-title">📖 凑十法小课堂</div>
      <div style="font-size:14px;line-height:1.8;color:var(--text)">
        <p>💡 <b>凑十法</b>是用来计算<b>进位加法</b>的好方法！</p>
        <p>口诀：看大数，分小数，凑成十，加剩数</p>
        <p>📌 例：8 + 5 = ?</p>
        <p>看到8想到2</p>
        <p>把5分成2和3</p>
        <p>8 + 2 = 10</p>
        <p>10 + 3 = <b>13</b> ✅</p>
        <p>🎵 凑十歌：</p>
        <p>一九一九好朋友，二八二八手拉手</p>
        <p>三七三七真亲密，四六四六一起走</p>
        <p>五五凑成一双手！</p>
      </div>
    </div>
  `;
  $('#maketen-answer').focus();
}

function checkMakeTen() {
  const ans = parseInt($('#maketen-answer').value);
  if (isNaN(ans)) { showToast('请输入数字~', 'warning'); return; }
  const item = MATH_DATA.makeTen[makeTenIndex];
  const fb = $('#maketen-feedback');
  if (ans === item.answer) {
    fb.innerHTML = `<div class="method-tip" style="background:#c8e6c9;border-color:var(--success)">🎉 答对了！</div>`;
    const r = CatSystem.recordTask(true, 'maketen');
    CatSystem.showTaskReward(r);
    setTimeout(() => { makeTenIndex = (makeTenIndex+1) % MATH_DATA.makeTen.length; renderMakeTen(); }, 1200);
  } else {
    fb.innerHTML = `<div class="method-tip" style="background:#ffcdd2;border-color:var(--danger)">❌ 答案是 ${item.answer}，看看上面的方法~</div>`;
    CatSystem.recordTask(false, 'maketen');
    CatSystem.recordWrong(item.question, ans, item.answer, '凑十法');
    setTimeout(() => { makeTenIndex = (makeTenIndex+1) % MATH_DATA.makeTen.length; renderMakeTen(); }, 2000);
  }
}

// ============ 应用题 ============
let wordProblemIndex = 0;
function renderWordProblem() {
  const item = MATH_DATA.wordProblems[wordProblemIndex];
  $('#math-content').innerHTML = `
    <div class="card">
      <div class="card-title">
        <span>📝 应用题 ${wordProblemIndex+1}/${MATH_DATA.wordProblems.length}</span>
      </div>
      <div class="quiz-question" style="font-size:17px;line-height:1.8">${item.q}</div>
      <input type="number" class="answer-input" id="word-answer" placeholder="输入答案" 
        onkeypress="if(event.key==='Enter')checkWord()">
      <div style="margin-top:12px;display:flex;gap:8px">
        <button class="btn btn-success" onclick="checkWord()">✅ 提交</button>
        <button class="btn btn-secondary" onclick="speakWordProblem()">🔊 读题</button>
        <button class="btn btn-warning" onclick="showHint()">💡 提示</button>
      </div>
      <div id="word-feedback"></div>
    </div>
  `;
  $('#word-answer').focus();
}

function checkWord() {
  const ans = parseInt($('#word-answer').value);
  if (isNaN(ans)) { showToast('请输入数字~', 'warning'); return; }
  const item = MATH_DATA.wordProblems[wordProblemIndex];
  const fb = $('#word-feedback');
  if (ans === item.a) {
    fb.innerHTML = `<div class="method-tip" style="background:#c8e6c9;border-color:var(--success)">🎉 答对了！${item.hint}</div>`;
    const r = CatSystem.recordTask(true, 'word');
    CatSystem.showTaskReward(r);
    vibrate(30);
    setTimeout(() => { wordProblemIndex = (wordProblemIndex+1) % MATH_DATA.wordProblems.length; renderWordProblem(); }, 1500);
  } else {
    fb.innerHTML = `<div class="method-tip" style="background:#ffcdd2;border-color:var(--danger)">❌ 再算算~提示：${item.hint}</div>`;
    CatSystem.recordTask(false, 'word');
    CatSystem.recordWrong(item.q, ans, item.a, '应用题');
    setTimeout(() => { wordProblemIndex = (wordProblemIndex+1) % MATH_DATA.wordProblems.length; renderWordProblem(); }, 2500);
  }
}

function speakWordProblem() {
  speak(MATH_DATA.wordProblems[wordProblemIndex].q);
}

function showHint() {
  showToast(`💡 ${MATH_DATA.wordProblems[wordProblemIndex].hint}`, 'info');
}
