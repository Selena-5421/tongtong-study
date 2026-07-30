/**
 * 每日拓展：小知识、动手实验、故事、儿歌、每日挑战
 */

let dailyTab = 'knowledge';

function renderDaily() {
  const tabs = [
    {key:'knowledge', icon:'💡', name:'小知识'},
    {key:'experiment', icon:'🔬', name:'动手实验'},
    {key:'story', icon:'📖', name:'故事'},
    {key:'nursery', icon:'🎵', name:'儿歌'},
    {key:'challenge', icon:'🏆', name:'每日挑战'},
  ];
  
  const html = `
    <div class="page-title">🌟 每日拓展</div>
    <div class="page-subtitle">小知识 · 实验 · 故事 · 儿歌 · 挑战</div>
    
    <div class="tabs">
      ${tabs.map(t => `<div class="tab ${dailyTab===t.key?'active':''}" onclick="switchDailyTab('${t.key}')">${t.icon} ${t.name}</div>`).join('')}
    </div>
    
    <div id="daily-content"></div>
  `;
  $('#page-daily').innerHTML = html;
  renderDailyContent();
}

function switchDailyTab(tab) {
  dailyTab = tab;
  renderDaily();
}

function renderDailyContent() {
  if (dailyTab === 'knowledge') renderKnowledge();
  else if (dailyTab === 'experiment') renderExperiment();
  else if (dailyTab === 'story') renderStory();
  else if (dailyTab === 'nursery') renderNursery();
  else if (dailyTab === 'challenge') renderChallenge();
}

// 小知识
let knowledgeIndex = 0;
function renderKnowledge() {
  const item = DAILY_DATA.knowledge[knowledgeIndex];
  $('#daily-content').innerHTML = `
    <div class="card">
      <div class="card-title">💡 小知识 ${knowledgeIndex+1}/${DAILY_DATA.knowledge.length}</div>
      <div style="text-align:center;font-size:48px;margin:12px 0">🤔</div>
      <h3 style="text-align:center;color:var(--primary);margin-bottom:12px">${item.title}</h3>
      <div style="background:#fff9c4;padding:16px;border-radius:12px;font-size:15px;line-height:1.8;color:var(--text)">
        ${item.content}
      </div>
      <div style="margin-top:12px;display:flex;gap:8px;justify-content:center">
        <button class="btn btn-sm" onclick="speak('${item.title}${item.content}')">🔊 朗读</button>
        <button class="btn btn-sm btn-success" onclick="knowledgeNext()">⏭️ 下一个</button>
      </div>
    </div>
  `;
}

function knowledgeNext() {
  const r = CatSystem.recordTask(true, 'knowledge');
  CatSystem.showTaskReward(r);
  knowledgeIndex = (knowledgeIndex + 1) % DAILY_DATA.knowledge.length;
  renderKnowledge();
}

// 动手实验
let expIndex = 0;
function renderExperiment() {
  const item = DAILY_DATA.experiment[expIndex];
  $('#daily-content').innerHTML = `
    <div class="card">
      <div class="card-title">🔬 动手实验 ${expIndex+1}/${DAILY_DATA.experiment.length}</div>
      <h3 style="text-align:center;color:var(--primary);margin:12px 0">${item.title}</h3>
      <div style="background:#e3f2fd;padding:12px;border-radius:8px;margin-bottom:12px">
        <b>🧰 需要材料：</b>${item.mat}
      </div>
      <div style="font-size:15px;line-height:2">
        <b>📝 实验步骤：</b>
        ${item.steps.map((s,i) => `<div style="margin:8px 0;padding:10px;background:#f5f5f5;border-radius:8px">${i+1}. ${s}</div>`).join('')}
      </div>
      <div style="margin-top:12px;display:flex;gap:8px;justify-content:center">
        <button class="btn btn-sm" onclick="speak('${item.steps.join('')}')">🔊 读步骤</button>
        <button class="btn btn-sm btn-success" onclick="expNext()">✅ 做完了</button>
      </div>
    </div>
  `;
}

function expNext() {
  const r = CatSystem.recordTask(true, 'experiment');
  CatSystem.showTaskReward(r);
  expIndex = (expIndex + 1) % DAILY_DATA.experiment.length;
  renderExperiment();
}

// 故事
let storyIndex = 0;
function renderStory() {
  const item = DAILY_DATA.story[storyIndex];
  $('#daily-content').innerHTML = `
    <div class="card">
      <div class="card-title">📖 故事时间 ${storyIndex+1}/${DAILY_DATA.story.length}</div>
      <div style="text-align:center;font-size:48px;margin:12px 0">📚</div>
      <h3 style="text-align:center;color:var(--primary);margin-bottom:12px">${item.title}</h3>
      <div style="background:linear-gradient(135deg,#f3e5f5,#fce4ec);padding:16px;border-radius:12px;font-size:15px;line-height:2;color:var(--text)">
        ${item.content}
      </div>
      <div style="margin-top:12px;display:flex;gap:8px;justify-content:center">
        <button class="btn btn-sm" onclick="speak('${item.title}${item.content}')">🔊 讲故事</button>
        <button class="btn btn-sm btn-success" onclick="storyNext()">⏭️ 下一个</button>
      </div>
    </div>
  `;
}

function storyNext() {
  const r = CatSystem.recordTask(true, 'story');
  CatSystem.showTaskReward(r);
  storyIndex = (storyIndex + 1) % DAILY_DATA.story.length;
  renderStory();
}

// 儿歌
let nurseryIndex = 0;
function renderNursery() {
  const item = DAILY_DATA.nursery[nurseryIndex];
  $('#daily-content').innerHTML = `
    <div class="card">
      <div class="card-title">🎵 儿歌 ${nurseryIndex+1}/${DAILY_DATA.nursery.length}</div>
      <div style="text-align:center;font-size:48px;margin:12px 0">🎶</div>
      <h3 style="text-align:center;color:var(--primary);margin-bottom:12px">${item.title}</h3>
      <div style="background:linear-gradient(135deg,#fff9c4,#ffe0b2);padding:20px;border-radius:12px;font-size:17px;line-height:2.2;text-align:center;color:var(--text)">
        ${item.content}
      </div>
      <div style="margin-top:12px;display:flex;gap:8px;justify-content:center">
        <button class="btn btn-sm" onclick="speak('${item.title}${item.content}')">🔊 唱歌</button>
        <button class="btn btn-sm btn-success" onclick="nurseryNext()">⏭️ 下一首</button>
      </div>
    </div>
  `;
}

function nurseryNext() {
  const r = CatSystem.recordTask(true, 'nursery');
  CatSystem.showTaskReward(r);
  nurseryIndex = (nurseryIndex + 1) % DAILY_DATA.nursery.length;
  renderNursery();
}

// 每日挑战
let challengeIndex = 0;
function renderChallenge() {
  const item = DAILY_DATA.challenge[challengeIndex];
  $('#daily-content').innerHTML = `
    <div class="card">
      <div class="card-title">🏆 每日挑战 ${challengeIndex+1}/${DAILY_DATA.challenge.length}</div>
      <div style="text-align:center;font-size:40px;margin:12px 0">🤓</div>
      <div class="quiz-question" style="font-size:16px;line-height:1.8">${item.q}</div>
      <input type="text" class="answer-input" id="challenge-answer" placeholder="输入你的答案" onkeypress="if(event.key==='Enter')checkChallenge()">
      <div style="margin-top:12px;display:flex;gap:8px">
        <button class="btn btn-success" onclick="checkChallenge()">✅ 提交</button>
        <button class="btn btn-warning" onclick="showChallengeHint()">💡 提示</button>
      </div>
      <div id="challenge-fb"></div>
    </div>
  `;
  $('#challenge-answer').focus();
}

function checkChallenge() {
  const input = $('#challenge-answer').value.trim();
  if (!input) { showToast('请输入答案~','warning'); return; }
  const item = DAILY_DATA.challenge[challengeIndex];
  const fb = $('#challenge-fb');
  
  // 挑战题允许文字答案，只要有关键信息就算对
  const correctStr = String(item.a);
  const isCorrect = input.includes(correctStr) || correctStr.includes(input) || 
    (correctStr === '25' && input.includes('25')) ||
    (correctStr === '6' && (input.includes('6') || input === '六个')) ||
    (correctStr === '8' && (input.includes('8') || input === '八')) ||
    (correctStr === '4' && (input.includes('4') || input === '四'));
  
  if (isCorrect) {
    fb.innerHTML = `<div class="method-tip" style="background:#c8e6c9;border-color:var(--success)">🎉 太聪明了！答案：${item.a}</div>`;
    const r = CatSystem.recordTask(true, 'challenge');
    CatSystem.showTaskReward(r);
    vibrate(30);
    setTimeout(() => { challengeIndex = (challengeIndex+1) % DAILY_DATA.challenge.length; renderChallenge(); }, 2000);
  } else {
    fb.innerHTML = `<div class="method-tip" style="background:#ffcdd2;border-color:var(--danger)">❌ 再想想~提示：${item.hint}</div>`;
    CatSystem.recordTask(false, 'challenge');
    setTimeout(() => { challengeIndex = (challengeIndex+1) % DAILY_DATA.challenge.length; renderChallenge(); }, 3000);
  }
}

function showChallengeHint() {
  showToast(`💡 ${DAILY_DATA.challenge[challengeIndex].hint}`, 'info');
}
