/**
 * 古诗100首：译文、标签、朗读、搜索、每周一首进度
 */

let poemSearchQuery = '';
let poemFilterTag = '';

function renderPoems() {
  const progress = Store.get('progress');
  const learned = Store.get('stats').learnedPoems;
  const currentWeekPoem = ALL_POEMS.find(p => p.week === progress.poemWeek) || ALL_POEMS[0];
  
  // 获取所有标签
  const allTags = [...new Set(ALL_POEMS.flatMap(p => p.tags))];
  
  // 过滤
  let filtered = ALL_POEMS;
  if (poemSearchQuery) {
    filtered = filtered.filter(p => 
      p.title.includes(poemSearchQuery) || 
      p.author.includes(poemSearchQuery) ||
      p.content.includes(poemSearchQuery)
    );
  }
  if (poemFilterTag) {
    filtered = filtered.filter(p => p.tags.includes(poemFilterTag));
  }
  
  const html = `
    <div class="page-title">📜 古诗${ALL_POEMS.length}首</div>
    <div class="page-subtitle">每周一首 · 译文注释 · 语音朗读</div>
    
    <!-- 本周古诗 -->
    <div class="card">
      <div class="card-title">
        <span>⭐ 本周古诗（第${progress.poemWeek}周）</span>
        <span style="font-size:12px;color:var(--text-light)">已学${learned.length}首</span>
      </div>
      <div class="poem-card">
        <div class="poem-title">${currentWeekPoem.title}</div>
        <div class="poem-author">[${currentWeekPoem.dynasty}] ${currentWeekPoem.author}</div>
        <div class="poem-content">${currentWeekPoem.content}</div>
        <div style="margin-top:12px;display:flex;gap:8px;justify-content:center">
          <button class="btn btn-sm" onclick="speakPoem('${currentWeekPoem.title}','${currentWeekPoem.content}')">🔊 朗读</button>
          <button class="btn btn-sm btn-success" onclick="markPoemLearned(${currentWeekPoem.week})" ${learned.includes(currentWeekPoem.title)?'disabled':''}>${learned.includes(currentWeekPoem.title)?'✅ 已学':'✅ 学会了'}</button>
        </div>
        <div class="poem-tags">
          ${currentWeekPoem.tags.map(t => `<span class="poem-tag">${t}</span>`).join('')}
        </div>
      </div>
      <div class="poem-translation">
        <b>📝 译文：</b>${currentWeekPoem.translation}
      </div>
      <div class="poem-translation" style="margin-top:8px">
        <b>💡 赏析：</b>${currentWeekPoem.appre}
      </div>
    </div>
    
    <!-- 搜索和过滤 -->
    <div class="card">
      <div class="card-title">🔍 搜索古诗</div>
      <input type="text" class="search-box" placeholder="搜索标题、作者、诗句..." 
        value="${poemSearchQuery}" oninput="poemSearch(this.value)">
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px">
        <div class="tab ${!poemFilterTag?'active':''}" onclick="poemFilterByTag('')">全部</div>
        ${allTags.map(t => `<div class="tab ${poemFilterTag===t?'active':''}" onclick="poemFilterByTag('${t}')">${t}</div>`).join('')}
      </div>
      <div style="font-size:13px;color:var(--text-light)">共${filtered.length}首</div>
    </div>
    
    <!-- 古诗列表 -->
    <div class="card">
      <div class="card-title">📋 古诗列表</div>
      <div id="poem-list">
        ${filtered.length === 0 ? '<div class="empty-state"><div class="empty-state-icon">📜</div><div class="empty-state-text">没有找到相关古诗</div></div>' :
          filtered.map(p => `
            <div class="list-item" onclick="showPoemDetail(${ALL_POEMS.indexOf(p)})">
              <div class="list-item-icon">${learned.includes(p.title)?'✅' : '📜'}</div>
              <div class="list-item-content">
                <div class="list-item-title">${p.title}</div>
                <div class="list-item-desc">[${p.dynasty}] ${p.author} · ${p.content.substring(0,15)}...</div>
              </div>
              <div style="font-size:12px;color:var(--text-light)">第${p.week}周</div>
            </div>
          `).join('')
        }
      </div>
    </div>
  `;
  
  $('#page-poems').innerHTML = html;
}

function poemSearch(q) {
  poemSearchQuery = q;
  renderPoems();
  // 保持焦点
  setTimeout(() => {
    const input = $('.search-box');
    if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
  }, 0);
}

function poemFilterByTag(tag) {
  poemFilterTag = tag;
  renderPoems();
}

function markPoemLearned(week) {
  const poem = ALL_POEMS.find(p => p.week === week);
  if (!poem) return;
  const learned = Store.get('stats').learnedPoems;
  if (!learned.includes(poem.title)) {
    learned.push(poem.title);
    Store.save('stats.learnedPoems', learned);
    const r = CatSystem.recordTask(true, 'poem');
    CatSystem.showTaskReward(r);
    vibrate(30);
  }
  // 推进到下一周
  const progress = Store.get('progress');
  if (week === progress.poemWeek) {
    progress.poemWeek++;
    if (progress.poemWeek > ALL_POEMS.length) progress.poemWeek = ALL_POEMS.length;
    Store.save('progress', progress);
  }
  renderPoems();
}

function speakPoem(title, content) {
  speak(`${title}。${content}`);
}

function showPoemDetail(idx) {
  const p = ALL_POEMS[idx];
  const learned = Store.get('stats').learnedPoems;
  
  const modal = document.createElement('div');
  modal.className = 'reward-overlay';
  modal.style.cursor = 'pointer';
  modal.innerHTML = `
    <div style="background:white;border-radius:20px;padding:20px;max-width:90%;width:400px;max-height:80vh;overflow-y:auto;cursor:default" onclick="event.stopPropagation()">
      <div style="text-align:right;font-size:24px;cursor:pointer;color:var(--text-light)" onclick="this.closest('.reward-overlay').remove()">✕</div>
      <div class="poem-card">
        <div class="poem-title">${p.title}</div>
        <div class="poem-author">[${p.dynasty}] ${p.author}</div>
        <div class="poem-content">${p.content}</div>
        <div class="poem-tags">
          ${p.tags.map(t => `<span class="poem-tag">${t}</span>`).join('')}
        </div>
      </div>
      <div class="poem-translation">
        <b>📝 译文：</b>${p.translation}
      </div>
      <div class="poem-translation" style="margin-top:8px">
        <b>💡 赏析：</b>${p.appre}
      </div>
      <div style="margin-top:16px;display:flex;gap:8px;justify-content:center">
        <button class="btn" onclick="speakPoem('${p.title}','${p.content}')">🔊 朗读</button>
        <button class="btn btn-success" onclick="markPoemLearned(${p.week});this.closest('.reward-overlay').remove()" ${learned.includes(p.title)?'disabled':''}>${learned.includes(p.title)?'✅ 已学':'✅ 学会了'}</button>
      </div>
    </div>
  `;
  modal.onclick = () => modal.remove();
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('show'), 10);
}
