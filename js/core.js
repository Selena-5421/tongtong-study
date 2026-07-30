/**
 * 核心系统：本地存储管理 + 猫咪宠物系统 + 激励机制
 */

const Store = {
  // 默认数据
  defaults: {
    cat: {
      name: '咪咪',
      stage: 0,       // 0=宝宝, 1=小, 2=大, 3=英雄
      exp: 0,
      mood: 'happy',  // happy, hungry, excited
      lastFeed: null,
    },
    foods: { fish: 0, milk: 0, cake: 0 },  // 食物库存
    stats: {
      totalTasks: 0,
      correctTasks: 0,
      streakDays: 0,
      lastCheckIn: null,
      checkInDates: [],  // 打卡日期
      learnedPoems: [],  // 已学古诗
      learnedHanzi: [],  // 已学汉字
      learnedWords: [],  // 已学单词
      todayTasks: {},    // 今日各科目完成情况 {chinese: true, math: true, ...}
      lastTaskDate: null,// 今日任务记录的日期
      allDoneRewarded: false, // 今日是否已领全勤蛋糕
    },
    wrongBook: [],   // 错题本
    memo: {          // 备忘录
      groups: [
        {id:'g1', name:'今日学习', items:[{id:'i1',text:'完成语文打卡',done:false},{id:'i2',text:'做10道算术题',done:false}]},
        {id:'g2', name:'习惯养成', items:[{id:'i3',text:'每天阅读15分钟',done:false}]},
      ]
    },
    progress: {
      hanziWeek: 1,       // 语文当前周
      poemWeek: 1,        // 古诗当前周
      phonicsIndex: 0,    // 自然拼读进度
      dailyIndex: 0,      // 每日拓展索引
    },
    gameScores: {
      match: 0,    // 对对碰
      goose: 0,    // 抓大鹅
    }
  },

  // 读取
  get(key) {
    const data = JSON.parse(localStorage.getItem('tongtong_data') || '{}');
    if (key) {
      return this._getDeep(data, key, this.defaults[key]);
    }
    return {...this.defaults, ...data};
  },

  _getDeep(obj, path, def) {
    const keys = path.split('.');
    let cur = obj;
    for (const k of keys) {
      if (cur[k] === undefined) return def;
      cur = cur[k];
    }
    return cur;
  },

  // 保存
  save(key, value) {
    const data = JSON.parse(localStorage.getItem('tongtong_data') || '{}');
    if (key.includes('.')) {
      const keys = key.split('.');
      let cur = data;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!cur[keys[i]]) cur[keys[i]] = {};
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
    } else {
      data[key] = value;
    }
    localStorage.setItem('tongtong_data', JSON.stringify(data));
  },

  // 重置
  reset() {
    localStorage.removeItem('tongtong_data');
  }
};

// ============ 猫咪宠物系统 ============
const CatSystem = {
  stages: [
    {name:'宝宝猫',emoji:'🐱',minExp:0,desc:'刚出生的小奶猫'},
    {name:'小猫咪',emoji:'😺',minExp:50,desc:'活泼的小猫咪'},
    {name:'大猫咪',emoji:'😸',minExp:150,desc:'强壮的大猫咪'},
    {name:'英雄猫',emoji:'🦁',minExp:300,desc:'传说中的猫咪英雄！'},
  ],
  foods: {
    fish: {emoji:'🐟',name:'小鱼干',exp:5,color:'#4fc3f7'},
    milk: {emoji:'🥛',name:'牛奶',exp:8,color:'#fff9c4'},
    cake: {emoji:'🍰',name:'蛋糕',exp:15,color:'#f8bbd0'},
  },

  // 获取猫咪状态
  getCat() {
    return Store.get('cat');
  },

  // 喂食
  feed(foodType) {
    const cat = Store.get('cat');
    const foods = Store.get('foods');
    if (foods[foodType] <= 0) {
      return {success:false, msg:'没有这个食物了，快去完成任务获得吧！'};
    }
    foods[foodType]--;
    Store.save('foods', foods);
    
    const food = this.foods[foodType];
    cat.exp += food.exp;
    cat.lastFeed = new Date().toISOString();
    cat.mood = 'excited';
    
    // 检查升级
    let leveledUp = false;
    let oldStage = cat.stage;
    for (let i = this.stages.length - 1; i >= 0; i--) {
      if (cat.exp >= this.stages[i].minExp) {
        cat.stage = i;
        if (i > oldStage) leveledUp = true;
        break;
      }
    }
    Store.save('cat', cat);
    
    return {
      success: true, 
      foodExp: food.exp, 
      newExp: cat.exp, 
      leveledUp, 
      newStage: cat.stage,
      stageInfo: this.stages[cat.stage]
    };
  },

  // 获得食物
  addFood(type, count=1) {
    const foods = Store.get('foods');
    foods[type] = (foods[type]||0) + count;
    Store.save('foods', foods);
  },

  // 获取当前阶段信息
  getStageInfo() {
    const cat = Store.get('cat');
    return this.stages[cat.stage];
  },

  // 获取升级进度
  getProgress() {
    const cat = Store.get('cat');
    const cur = this.stages[cat.stage];
    const next = this.stages[cat.stage + 1];
    if (!next) return {current:cur.exp, max:cur.minExp, percent:100, isMax:true};
    const range = next.minExp - cur.minExp;
    const progress = cat.exp - cur.minExp;
    return {current:cat.exp, max:next.minExp, percent:Math.round(progress/range*100), isMax:false};
  },

  // 6大科目定义（用于"今日全勤"判定）
  subjectTypes: ['chinese','math','thinking','english','poem','daily'],

  // 记录任务完成
  recordTask(correct, type) {
    const stats = Store.get('stats');
    stats.totalTasks++;
    if (correct) stats.correctTasks++;
    
    // 重置今日任务（跨天时）
    const today = new Date().toDateString();
    if (stats.lastTaskDate !== today) {
      stats.todayTasks = {};
      stats.allDoneRewarded = false;
      stats.lastTaskDate = today;
    }
    
    // 记录该科目今日已完成（归类到6大科目）
    const subject = this._mapSubject(type);
    if (correct && subject) {
      stats.todayTasks[subject] = true;
    }
    Store.save('stats', stats);
    
    // 答对奖励：随机小鱼干或牛奶
    let reward = null;
    if (correct) {
      reward = Math.random() < 0.5 ? 'fish' : 'milk';
      this.addFood(reward, 1);
    }
    
    // 检查今日所有科目是否全部完成
    const allDone = this._checkAllDone();
    if (allDone.justCompleted && !allDone.alreadyRewarded) {
      // 今日全部科目完成，奖励蛋糕！
      this.addFood('cake', 1);
      stats.allDoneRewarded = true;
      Store.save('stats', stats);
      return {correct, reward, cakeReward: true};
    }
    
    return {correct, reward, cakeReward: false};
  },

  // 把具体任务类型映射到6大科目
  _mapSubject(type) {
    const map = {
      // 语文
      chinese: 'chinese', pinyin: 'chinese', reading: 'chinese',
      // 算术
      math: 'math', breakten: 'math', maketen: 'math', word: 'math',
      // 思维
      thinking: 'thinking',
      // 英语
      english: 'english', sentence: 'english', spotdiff: 'english', phonics: 'english',
      // 古诗
      poem: 'poem',
      // 每日拓展
      knowledge: 'daily', experiment: 'daily', story: 'daily', nursery: 'daily', challenge: 'daily',
      // 游戏（不算正式科目，但也给奖励）
      matchgame: null, goosegame: null,
    };
    return map[type] !== undefined ? map[type] : null;
  },

  // 检查今日所有科目是否完成
  _checkAllDone() {
    const stats = Store.get('stats');
    const completed = this.subjectTypes.filter(s => stats.todayTasks[s]).length;
    const allDone = completed >= this.subjectTypes.length;
    return {
      allDone,
      completed,
      total: this.subjectTypes.length,
      justCompleted: allDone,
      alreadyRewarded: stats.allDoneRewarded,
    };
  },

  // 获取今日任务进度（供UI展示）
  getTodayProgress() {
    const stats = Store.get('stats');
    const today = new Date().toDateString();
    if (stats.lastTaskDate !== today) {
      return {completed: 0, total: this.subjectTypes.length, subjects: {}, allDone: false, rewarded: false};
    }
    const subjects = {};
    this.subjectTypes.forEach(s => { subjects[s] = !!stats.todayTasks[s]; });
    const completed = this.subjectTypes.filter(s => stats.todayTasks[s]).length;
    return {
      completed,
      total: this.subjectTypes.length,
      subjects,
      allDone: completed >= this.subjectTypes.length,
      rewarded: stats.allDoneRewarded,
    };
  },

  // 记录错题
  recordWrong(question, answer, correctAnswer, module) {
    const wrongBook = Store.get('wrongBook');
    wrongBook.push({
      id: Date.now() + Math.random(),
      question, answer, correctAnswer, module,
      date: new Date().toISOString(),
      mastered: false,
    });
    Store.save('wrongBook', wrongBook);
  },

  // 打卡
  checkIn() {
    const stats = Store.get('stats');
    const today = new Date().toDateString();
    
    if (stats.lastCheckIn === today) {
      return {alreadyChecked:true, streak:stats.streakDays};
    }
    
    // 检查是否连续
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (stats.lastCheckIn === yesterday) {
      stats.streakDays++;
    } else {
      stats.streakDays = 1;
    }
    
    stats.lastCheckIn = today;
    if (!stats.checkInDates.includes(today)) {
      stats.checkInDates.push(today);
    }
    Store.save('stats', stats);
    
    // 打卡奖励：小鱼干或牛奶
    this.addFood(Math.random() < 0.5 ? 'fish' : 'milk', 1);
    if (stats.streakDays % 7 === 0) {
      this.addFood('milk', 1);
    }
    
    return {alreadyChecked:false, streak:stats.streakDays, rewarded:true};
  },

  // 统一的任务奖励提示（各页面调用）
  showTaskReward(result) {
    if (!result || !result.correct) return;
    const foodNames = {fish:'小鱼干🐟', milk:'牛奶🥛', cake:'蛋糕🍰'};
    if (result.reward) {
      showToast(`🎉 答对了！获得${foodNames[result.reward]}`, 'success');
    }
    if (result.cakeReward) {
      vibrate(60);
      setTimeout(() => {
        showReward('cake');
        setTimeout(() => {
          showToast('🎊 太棒了！今日全部科目完成，奖励蛋糕🍰！', 'success');
        }, 800);
      }, 600);
    }
  }
};

// ============ 工具函数 ============
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

// 语音朗读
function speak(text, lang='zh-CN') {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.8;
    u.pitch = 1.2;
    speechSynthesis.speak(u);
  }
}

function speakEn(text) {
  speak(text, 'en-US');
}

// 打乱数组
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// 随机取n个
function pickRandom(arr, n) {
  return shuffle([...arr]).slice(0, n);
}

// 震动反馈
function vibrate(ms=30) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

// 显示toast
function showToast(msg, type='info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// 显示奖励动画
function showReward(foodType) {
  const food = CatSystem.foods[foodType];
  const overlay = document.createElement('div');
  overlay.className = 'reward-overlay';
  overlay.innerHTML = `
    <div class="reward-bounce">
      <div class="reward-emoji">${food.emoji}</div>
      <div class="reward-text">+${food.exp} 经验！</div>
    </div>
  `;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add('show'), 10);
  setTimeout(() => {
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 500);
  }, 1500);
}

// 食物飞向猫咪动画
function flyFoodToCat(foodType, callback) {
  const food = CatSystem.foods[foodType];
  const catEl = document.querySelector('.cat-display') || document.querySelector('.nav-cat');
  if (!catEl) { callback && callback(); return; }
  
  const catRect = catEl.getBoundingClientRect();
  const fly = document.createElement('div');
  fly.className = 'flying-food';
  fly.textContent = food.emoji;
  fly.style.position = 'fixed';
  fly.style.fontSize = '40px';
  fly.style.zIndex = '9999';
  fly.style.left = '50%';
  fly.style.top = '50%';
  fly.style.transition = 'all 0.8s cubic-bezier(0.5, -0.5, 0.5, 1.5)';
  document.body.appendChild(fly);
  
  requestAnimationFrame(() => {
    fly.style.left = (catRect.left + catRect.width/2) + 'px';
    fly.style.top = (catRect.top + catRect.height/2) + 'px';
    fly.style.transform = 'scale(0.3) rotate(360deg)';
    fly.style.opacity = '0';
  });
  
  setTimeout(() => {
    fly.remove();
    // 猫咪蹦跳
    catEl.classList.add('cat-bounce');
    setTimeout(() => catEl.classList.remove('cat-bounce'), 600);
    callback && callback();
  }, 800);
}
