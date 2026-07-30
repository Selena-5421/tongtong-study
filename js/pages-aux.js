/**
 * 辅助功能：错题本 + 计划备忘录 + 奖励中心
 */

// ============ 错题本 ============
function renderWrongBook() {
  const wrongBook = Store.get('wrongBook');
  const unmastered = wrongBook.filter(w => !w.mastered);
  const mastered = wrongBook.filter(w => w.mastered);
  
  const html = `
    <div class="page-title">📕 错题本</div>
    <div class="page-subtitle">自动收集做错的题目，温故知新</div>
    
    <div class="card">
      <div class="reward-grid">
        <div class="reward-stat">
          <div class="reward-stat-num">${wrongBook.length}</div>
          <div class="reward-stat-label">总错题</div>
        </div>
        <div class="reward-stat">
          <div class="reward-stat-num">${unmastered.length}</div>
          <div class="reward-stat-label">待复习</div>
        </div>
        <div class="reward-stat">
          <div class="reward-stat-num">${mastered.length}</div>
          <div class="reward-stat-label">已掌握</div>
        </div>
      </div>
      ${wrongBook.length > 0 ? `
        <div style="display:flex;gap:8px;margin-top:12px;justify-content:center">
          <button class="btn btn-sm btn-warning" onclick="clearMasteredWrong()">🗑️ 清除已掌握</button>
          <button class="btn btn-sm btn-danger" onclick="clearAllWrong()">🗑️ 清空所有</button>
        </div>
      ` : ''}
    </div>
    
    ${unmastered.length > 0 ? `
      <div class="card">
        <div class="card-title">📖 待复习 (${unmastered.length})</div>
        ${unmastered.slice().reverse().map(w => `
          <div class="wrong-item">
            <div class="wrong-q">${w.question}</div>
            <div class="wrong-a">❌ 你的答案：${w.answer}</div>
            <div class="wrong-correct">✅ 正确答案：${w.correctAnswer}</div>
            <div class="wrong-module">📚 ${w.module} · ${new Date(w.date).toLocaleDateString()}</div>
            <button class="btn btn-sm btn-success" style="margin-top:8px" onclick="markMastered(${w.id})">✅ 我会了</button>
          </div>
        `).join('')}
      </div>
    ` : ''}
    
    ${mastered.length > 0 ? `
      <div class="card">
        <div class="card-title">✅ 已掌握 (${mastered.length})</div>
        ${mastered.slice().reverse().map(w => `
          <div class="wrong-item" style="border-left-color:var(--success);opacity:0.7">
            <div class="wrong-q">${w.question}</div>
            <div class="wrong-correct">✅ 正确答案：${w.correctAnswer}</div>
            <div class="wrong-module">📚 ${w.module}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}
    
    ${wrongBook.length === 0 ? `
      <div class="empty-state">
        <div class="empty-state-icon">🎉</div>
        <div class="empty-state-text">还没有错题，继续加油！</div>
      </div>
    ` : ''}
  `;
  
  $('#page-wrongbook').innerHTML = html;
}

function markMastered(id) {
  const wrongBook = Store.get('wrongBook');
  const item = wrongBook.find(w => w.id === id);
  if (item) {
    item.mastered = true;
    Store.save('wrongBook', wrongBook);
    showToast('🎉 标记为已掌握！', 'success');
    renderWrongBook();
  }
}

function clearMasteredWrong() {
  if (!confirm('确定清除已掌握的错题吗？')) return;
  const wrongBook = Store.get('wrongBook');
  Store.save('wrongBook', wrongBook.filter(w => !w.mastered));
  showToast('已清除', 'info');
  renderWrongBook();
}

function clearAllWrong() {
  if (!confirm('确定清空所有错题吗？此操作不可恢复！')) return;
  Store.save('wrongBook', []);
  showToast('已清空', 'info');
  renderWrongBook();
}

// ============ 计划备忘录 ============
function renderMemo() {
  const memo = Store.get('memo');
  
  const html = `
    <div class="page-title">📝 计划备忘录</div>
    <div class="page-subtitle">可分组、可勾选、可添加删除</div>
    
    <div class="card">
      <div class="card-title">➕ 添加新分组</div>
      <div style="display:flex;gap:8px">
        <input type="text" class="memo-add-input" id="new-group-name" placeholder="输入分组名称，如：本周计划">
        <button class="btn" onclick="addMemoGroup()">添加</button>
      </div>
    </div>
    
    ${memo.groups.map(g => {
      const doneCount = g.items.filter(i => i.done).length;
      return `
        <div class="card">
          <div class="card-title">
            <span>📋 ${g.name} (${doneCount}/${g.items.length})</span>
            <span style="font-size:18px;cursor:pointer;color:var(--danger)" onclick="deleteMemoGroup('${g.id}')">🗑️</span>
          </div>
          <div class="progress-bar" style="margin-bottom:12px">
            <div class="progress-fill" style="width:${g.items.length>0?doneCount/g.items.length*100:0}%"></div>
          </div>
          ${g.items.map(item => `
            <div class="memo-item">
              <div class="memo-checkbox ${item.done?'checked':''}" onclick="toggleMemoItem('${g.id}','${item.id}')"></div>
              <div class="memo-text ${item.done?'done':''}">${item.text}</div>
              <span class="memo-delete" onclick="deleteMemoItem('${g.id}','${item.id}')">✕</span>
            </div>
          `).join('')}
          <div style="display:flex;gap:8px;margin-top:8px">
            <input type="text" class="memo-add-input" id="new-item-${g.id}" placeholder="添加新任务..." 
              onkeypress="if(event.key==='Enter')addMemoItem('${g.id}')">
            <button class="btn btn-sm" onclick="addMemoItem('${g.id}')">添加</button>
          </div>
        </div>
      `;
    }).join('')}
  `;
  
  $('#page-memo').innerHTML = html;
}

function addMemoGroup() {
  const name = $('#new-group-name').value.trim();
  if (!name) { showToast('请输入分组名称','warning'); return; }
  const memo = Store.get('memo');
  memo.groups.push({id: 'g' + Date.now(), name, items: []});
  Store.save('memo', memo);
  renderMemo();
}

function deleteMemoGroup(gid) {
  if (!confirm('确定删除这个分组吗？')) return;
  const memo = Store.get('memo');
  memo.groups = memo.groups.filter(g => g.id !== gid);
  Store.save('memo', memo);
  renderMemo();
}

function addMemoItem(gid) {
  const input = $(`#new-item-${gid}`);
  const text = input.value.trim();
  if (!text) return;
  const memo = Store.get('memo');
  const group = memo.groups.find(g => g.id === gid);
  if (group) {
    group.items.push({id: 'i' + Date.now(), text, done: false});
    Store.save('memo', memo);
    renderMemo();
  }
}

function toggleMemoItem(gid, iid) {
  const memo = Store.get('memo');
  const group = memo.groups.find(g => g.id === gid);
  if (group) {
    const item = group.items.find(i => i.id === iid);
    if (item) {
      item.done = !item.done;
      Store.save('memo', memo);
      renderMemo();
    }
  }
}

function deleteMemoItem(gid, iid) {
  const memo = Store.get('memo');
  const group = memo.groups.find(g => g.id === gid);
  if (group) {
    group.items = group.items.filter(i => i.id !== iid);
    Store.save('memo', memo);
    renderMemo();
  }
}

// ============ 奖励中心 ============
function renderReward() {
  const cat = CatSystem.getCat();
  const stageInfo = CatSystem.getStageInfo();
  const progress = CatSystem.getProgress();
  const foods = Store.get('foods');
  const stats = Store.get('stats');
  const gameScores = Store.get('gameScores');
  
  const html = `
    <div class="page-title">🎁 奖励中心</div>
    <div class="page-subtitle">看看彤彤的成就和宝藏</div>
    
    <!-- 猫咪等级 -->
    <div class="cat-display-wrapper">
      <div class="cat-display">${stageInfo.emoji}</div>
      <div class="cat-name">${cat.name}</div>
      <div class="cat-stage">${stageInfo.name}</div>
      <div class="exp-bar">
        <div class="exp-fill" style="width:${progress.percent}%"></div>
      </div>
      <div class="exp-text">${progress.isMax ? '满级啦！🎉' : `经验 ${progress.current} / ${progress.max}`}</div>
    </div>
    
    <!-- 食物库存 -->
    <div class="card">
      <div class="card-title">🍎 食物库存</div>
      <div class="reward-grid">
        <div class="reward-stat" style="background:#e3f2fd">
          <div style="font-size:40px">🐟</div>
          <div class="reward-stat-num">${foods.fish}</div>
          <div class="reward-stat-label">小鱼干 +5exp</div>
        </div>
        <div class="reward-stat" style="background:#fff9c4">
          <div style="font-size:40px">🥛</div>
          <div class="reward-stat-num">${foods.milk}</div>
          <div class="reward-stat-label">牛奶 +8exp</div>
        </div>
        <div class="reward-stat" style="background:#fce4ec">
          <div style="font-size:40px">🍰</div>
          <div class="reward-stat-num">${foods.cake}</div>
          <div class="reward-stat-label">蛋糕 +15exp</div>
        </div>
      </div>
    </div>
    
    <!-- 成长阶段 -->
    <div class="card">
      <div class="card-title">🏆 成长阶段</div>
      ${CatSystem.stages.map((s, i) => `
        <div style="display:flex;align-items:center;padding:10px;background:${i<=cat.stage?'#c8e6c9':'#f5f5f5'};border-radius:10px;margin-bottom:6px">
          <div style="font-size:36px">${s.emoji}</div>
          <div style="flex:1;margin-left:12px">
            <div style="font-weight:700;font-size:15px">${s.name} ${i===cat.stage?'👈 当前':''}</div>
            <div style="font-size:12px;color:var(--text-light)">${s.desc} · 需${s.minExp}经验</div>
          </div>
          ${i<=cat.stage?'✅':'🔒'}
        </div>
      `).join('')}
    </div>
    
    <!-- 学习统计 -->
    <div class="card">
      <div class="card-title">📊 学习统计</div>
      <div class="reward-grid">
        <div class="reward-stat">
          <div class="reward-stat-num">${stats.totalTasks}</div>
          <div class="reward-stat-label">总答题数</div>
        </div>
        <div class="reward-stat">
          <div class="reward-stat-num">${stats.correctTasks}</div>
          <div class="reward-stat-label">答对题数</div>
        </div>
        <div class="reward-stat">
          <div class="reward-stat-num">${stats.totalTasks>0?Math.round(stats.correctTasks/stats.totalTasks*100):0}%</div>
          <div class="reward-stat-label">正确率</div>
        </div>
        <div class="reward-stat">
          <div class="reward-stat-num">${stats.streakDays}</div>
          <div class="reward-stat-label">连续打卡</div>
        </div>
        <div class="reward-stat">
          <div class="reward-stat-num">${stats.checkInDates.length}</div>
          <div class="reward-stat-label">总打卡天数</div>
        </div>
        <div class="reward-stat">
          <div class="reward-stat-num">${stats.learnedHanzi.length}</div>
          <div class="reward-stat-label">已学汉字</div>
        </div>
        <div class="reward-stat">
          <div class="reward-stat-num">${stats.learnedWords.length}</div>
          <div class="reward-stat-label">已学单词</div>
        </div>
        <div class="reward-stat">
          <div class="reward-stat-num">${stats.learnedPoems.length}</div>
          <div class="reward-stat-label">已学古诗</div>
        </div>
        <div class="reward-stat">
          <div class="reward-stat-num">${gameScores.match}</div>
          <div class="reward-stat-label">对对碰分数</div>
        </div>
      </div>
    </div>
    
    <!-- 已学古诗 -->
    <div class="card">
      <div class="card-title">📜 已学古诗 (${stats.learnedPoems.length}/${ALL_POEMS.length})</div>
      ${stats.learnedPoems.length > 0 ? `
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${stats.learnedPoems.map(title => `<span class="poem-tag">${title}</span>`).join('')}
        </div>
      ` : '<div style="color:var(--text-light);font-size:13px">还没有学完古诗，加油！</div>'}
    </div>
    
    <!-- 重置数据 -->
    <div class="card">
      <button class="btn btn-danger" style="width:100%" onclick="resetAllData()">⚠️ 重置所有数据</button>
      <div style="font-size:11px;color:var(--text-light);text-align:center;margin-top:8px">（会清空所有进度，谨慎操作）</div>
    </div>
  `;
  
  $('#page-reward').innerHTML = html;
}

function resetAllData() {
  if (!confirm('确定要重置所有数据吗？所有进度将清空！')) return;
  if (!confirm('再次确认：真的要重置吗？')) return;
  Store.reset();
  showToast('已重置所有数据', 'info');
  renderHome();
  switchPage('home');
}
