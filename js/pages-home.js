/**
 * 首页：猫咪展示 + 食物喂养 + 打卡日历 + 快捷入口
 */

function renderHome() {
  const cat = CatSystem.getCat();
  const stageInfo = CatSystem.getStageInfo();
  const progress = CatSystem.getProgress();
  const foods = Store.get('foods');
  const stats = Store.get('stats');
  
  const today = new Date().toDateString();
  const checkedToday = stats.lastCheckIn === today;
  
  // 生成最近30天日历
  let calendarHtml = '';
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dStr = d.toDateString();
    const isChecked = stats.checkInDates.includes(dStr);
    const isToday = dStr === today;
    calendarHtml += `<div class="calendar-day ${isChecked?'checked':''} ${isToday?'today':''}">${d.getDate()}</div>`;
  }
  
  const html = `
    <div class="home-header">
      <div class="home-greeting">👋 彤彤，你好呀！</div>
      <div class="home-date">${formatDate(now)}</div>
    </div>
    
    <!-- 猫咪展示区 -->
    <div class="cat-display-wrapper">
      <div class="cat-display">${stageInfo.emoji}</div>
      <div class="cat-name">${cat.name}</div>
      <div class="cat-stage">${stageInfo.name} · ${stageInfo.desc}</div>
      <div class="exp-bar">
        <div class="exp-fill" style="width:${progress.percent}%"></div>
      </div>
      <div class="exp-text">${progress.isMax ? '满级啦！' : `经验 ${progress.current} / ${progress.max} (${progress.percent}%)`}</div>
      
      <!-- 食物栏 -->
      <div class="food-bar">
        <div class="food-item ${foods.fish<=0?'disabled':''}" onclick="feedCat('fish')">
          <div class="food-emoji">🐟</div>
          <div class="food-count">${foods.fish}</div>
          <div class="food-name">小鱼干 +5</div>
        </div>
        <div class="food-item ${foods.milk<=0?'disabled':''}" onclick="feedCat('milk')">
          <div class="food-emoji">🥛</div>
          <div class="food-count">${foods.milk}</div>
          <div class="food-name">牛奶 +8</div>
        </div>
        <div class="food-item ${foods.cake<=0?'disabled':''}" onclick="feedCat('cake')">
          <div class="food-emoji">🍰</div>
          <div class="food-count">${foods.cake}</div>
          <div class="food-name">蛋糕 +15</div>
        </div>
      </div>
    </div>
    
    <!-- 打卡 -->
    <div class="card">
      <div class="card-title">
        <span>📅 每日打卡</span>
        <span style="font-size:13px;color:var(--text-light)">连续${stats.streakDays}天 🔥</span>
      </div>
      <button class="checkin-btn ${checkedToday?'done':''}" onclick="doCheckIn()" ${checkedToday?'disabled':''}>
        ${checkedToday ? '✅ 今天已打卡' : '🌟 立即打卡（奖励小鱼干）'}
      </button>
      <div style="font-size:11px;color:var(--text-light);margin:8px 0">最近30天打卡记录：</div>
      <div class="calendar">${calendarHtml}</div>
    </div>
    
    ${renderTodayProgress()}
    
    <!-- 快捷入口 -->
    <div class="card">
      <div class="card-title">⚡ 快速开始</div>
      <div class="module-grid">
        <div class="module-card" onclick="switchPage('chinese')">
          <div class="module-icon">📚</div>
          <div class="module-name">今日识字</div>
          <div class="module-desc">10个新字</div>
        </div>
        <div class="module-card" onclick="switchPage('math')">
          <div class="module-icon">🔢</div>
          <div class="module-name">算术练习</div>
          <div class="module-desc">40以内加减</div>
        </div>
        <div class="module-card" onclick="switchPage('english')">
          <div class="module-icon">🔤</div>
          <div class="module-name">英语跟读</div>
          <div class="module-desc">单词+拼读</div>
        </div>
        <div class="module-card" onclick="switchPage('poems')">
          <div class="module-icon">📜</div>
          <div class="module-name">本周古诗</div>
          <div class="module-desc">每周一首</div>
        </div>
        <div class="module-card" onclick="switchPage('games')">
          <div class="module-icon">🎮</div>
          <div class="module-name">闯关游戏</div>
          <div class="module-desc">边玩边学</div>
        </div>
        <div class="module-card" onclick="switchPage('daily')">
          <div class="module-icon">🌟</div>
          <div class="module-name">每日拓展</div>
          <div class="module-desc">小知识+实验</div>
        </div>
      </div>
    </div>
    
    <!-- 今日数据 -->
    <div class="card">
      <div class="card-title">📊 今日小记</div>
      <div class="reward-grid">
        <div class="reward-stat">
          <div class="reward-stat-num">${stats.totalTasks}</div>
          <div class="reward-stat-label">总答题</div>
        </div>
        <div class="reward-stat">
          <div class="reward-stat-num">${stats.correctTasks}</div>
          <div class="reward-stat-label">答对题数</div>
        </div>
        <div class="reward-stat">
          <div class="reward-stat-num">${stats.totalTasks>0?Math.round(stats.correctTasks/stats.totalTasks*100):0}%</div>
          <div class="reward-stat-label">正确率</div>
        </div>
      </div>
    </div>
  `;
  
  $('#page-home').innerHTML = html;
}

function formatDate(d) {
  const days = ['周日','周一','周二','周三','周四','周五','周六'];
  return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日 ${days[d.getDay()]}`;
}

// 喂猫
function feedCat(foodType) {
  const result = CatSystem.feed(foodType);
  if (!result.success) {
    showToast(result.msg, 'warning');
    return;
  }
  
  // 食物飞向猫咪动画
  flyFoodToCat(foodType, () => {
    showReward(foodType);
    
    if (result.leveledUp) {
      setTimeout(() => {
        showToast(`🎉 恭喜！${result.stageInfo.name} 升级啦！`, 'success');
      }, 1000);
    }
    
    setTimeout(renderHome, 1500);
  });
}

// 打卡
function doCheckIn() {
  const result = CatSystem.checkIn();
  if (result.alreadyChecked) {
    showToast('今天已经打卡啦~', 'warning');
    return;
  }
  
  showToast(`🌟 打卡成功！连续${result.streak}天！`, 'success');
  vibrate(50);
  renderHome();
}

// 今日任务进度卡片
function renderTodayProgress() {
  const tp = CatSystem.getTodayProgress();
  const subjectInfo = [
    {key:'chinese', icon:'📚', name:'语文'},
    {key:'math', icon:'🔢', name:'算术'},
    {key:'thinking', icon:'🧩', name:'思维'},
    {key:'english', icon:'🔤', name:'英语'},
    {key:'poem', icon:'📜', name:'古诗'},
    {key:'daily', icon:'🌟', name:'拓展'},
  ];
  
  const percent = Math.round(tp.completed / tp.total * 100);
  
  return `
    <div class="card">
      <div class="card-title">
        <span>🎯 今日任务进度</span>
        <span style="font-size:13px;color:var(--text-light)">${tp.completed}/${tp.total} ${tp.allDone?'🎉 全勤！':''}</span>
      </div>
      <div class="progress-bar" style="height:10px;margin-bottom:12px">
        <div class="progress-fill" style="width:${percent}%"></div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
        ${subjectInfo.map(s => `
          <div style="text-align:center;padding:10px;background:${tp.subjects[s.key]?'#c8e6c9':'#f5f5f5'};border-radius:10px;cursor:pointer" onclick="switchPage('${s.key==='poem'?'poems':s.key==='daily'?'daily':s.key==='math'?'math':s.key==='thinking'?'thinking':s.key==='english'?'english':'chinese'}')">
            <div style="font-size:24px">${tp.subjects[s.key]?'✅':s.icon}</div>
            <div style="font-size:11px;color:var(--text);margin-top:2px">${s.name}</div>
          </div>
        `).join('')}
      </div>
      ${tp.allDone ? 
        (tp.rewarded ? 
          '<div style="margin-top:10px;text-align:center;font-size:13px;color:var(--success);font-weight:600">🍰 今日全勤蛋糕已领取！明天继续加油~</div>' :
          '<div style="margin-top:10px;text-align:center;font-size:13px;color:var(--primary);font-weight:600">🎊 全部科目完成！获得蛋糕奖励🍰</div>'
        ) :
        '<div style="margin-top:10px;text-align:center;font-size:12px;color:var(--text-light)">完成全部6个科目，奖励蛋糕🍰！</div>'
      }
    </div>
  `;
}
