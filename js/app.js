/**
 * 主应用入口：页面切换 + 初始化
 */

// 视口自适应：保证在小视口下也完整显示
function applyViewportScale() {
  const MOBILE_WIDTH = 375;  // iPhone 基准
  const nav = document.querySelector('.navbar');
  const main = document.querySelector('.main');
  if (!main || !nav) return;
  
  const navWidth = nav.offsetWidth;
  const viewportWidth = window.innerWidth;
  const availableWidth = viewportWidth - navWidth;
  
  // 视口 < 移动端基准 时，按比例缩小
  if (viewportWidth < MOBILE_WIDTH) {
    const scale = availableWidth / (MOBILE_WIDTH - navWidth);
    main.style.transformOrigin = 'top left';
    main.style.transform = `scale(${scale})`;
    main.style.paddingBottom = (100 * scale) + 'px';
  } else {
    main.style.transform = '';
    main.style.paddingBottom = '';
  }
}

// 页面切换
function switchPage(page) {
  // 切换导航高亮
  $$('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });
  
  // 切换页面显示
  $$('.page').forEach(p => p.classList.remove('active'));
  const target = $(`#page-${page}`);
  if (target) target.classList.add('active');
  
  // 渲染对应页面
  switch (page) {
    case 'home': renderHome(); break;
    case 'chinese': renderChinese(); break;
    case 'math': renderMath(); break;
    case 'thinking': renderThinking(); break;
    case 'english': renderEnglish(); break;
    case 'poems': renderPoems(); break;
    case 'daily': renderDaily(); break;
    case 'games': renderGames(); break;
    case 'wrongbook': renderWrongBook(); break;
    case 'memo': renderMemo(); break;
    case 'reward': renderReward(); break;
  }
  
  // 滚动到顶部
  window.scrollTo(0, 0);
  
  // 切换页面后重新计算缩放（内容高度可能变化）
  setTimeout(applyViewportScale, 50);
}

// 初始化
function init() {
  // 首次访问检查打卡
  CatSystem.checkIn();
  renderHome();
  // 视口缩放
  applyViewportScale();
  window.addEventListener('resize', applyViewportScale);
  // 切换页面后也调用一次（防止内容变化影响高度）
  setTimeout(applyViewportScale, 100);
}

// DOM加载完成
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
