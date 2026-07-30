/**
 * 数据文件 B：英语、算术、思维训练、每日拓展数据
 */

// ============ 英语单词数据 ============
const ENGLISH_DATA = {
  words: [
    {en:'apple',cn:'苹果',emoji:'🍎',category:'水果'},
    {en:'banana',cn:'香蕉',emoji:'🍌',category:'水果'},
    {en:'orange',cn:'橙子',emoji:'🍊',category:'水果'},
    {en:'grape',cn:'葡萄',emoji:'🍇',category:'水果'},
    {en:'pear',cn:'梨',emoji:'🍐',category:'水果'},
    {en:'cat',cn:'猫',emoji:'🐱',category:'动物'},
    {en:'dog',cn:'狗',emoji:'🐶',category:'动物'},
    {en:'pig',cn:'猪',emoji:'🐷',category:'动物'},
    {en:'cow',cn:'牛',emoji:'🐄',category:'动物'},
    {en:'duck',cn:'鸭',emoji:'🦆',category:'动物'},
    {en:'fish',cn:'鱼',emoji:'🐟',category:'动物'},
    {en:'bird',cn:'鸟',emoji:'🐦',category:'动物'},
    {en:'rabbit',cn:'兔子',emoji:'🐰',category:'动物'},
    {en:'horse',cn:'马',emoji:'🐴',category:'动物'},
    {en:'sheep',cn:'羊',emoji:'🐑',category:'动物'},
    {en:'bear',cn:'熊',emoji:'🐻',category:'动物'},
    {en:'red',cn:'红色',emoji:'🔴',category:'颜色'},
    {en:'blue',cn:'蓝色',emoji:'🔵',category:'颜色'},
    {en:'yellow',cn:'黄色',emoji:'🟡',category:'颜色'},
    {en:'green',cn:'绿色',emoji:'🟢',category:'颜色'},
    {en:'black',cn:'黑色',emoji:'⚫',category:'颜色'},
    {en:'white',cn:'白色',emoji:'⚪',category:'颜色'},
    {en:'one',cn:'一',emoji:'1️⃣',category:'数字'},
    {en:'two',cn:'二',emoji:'2️⃣',category:'数字'},
    {en:'three',cn:'三',emoji:'3️⃣',category:'数字'},
    {en:'four',cn:'四',emoji:'4️⃣',category:'数字'},
    {en:'five',cn:'五',emoji:'5️⃣',category:'数字'},
    {en:'six',cn:'六',emoji:'6️⃣',category:'数字'},
    {en:'seven',cn:'七',emoji:'7️⃣',category:'数字'},
    {en:'eight',cn:'八',emoji:'8️⃣',category:'数字'},
    {en:'nine',cn:'九',emoji:'9️⃣',category:'数字'},
    {en:'ten',cn:'十',emoji:'🔟',category:'数字'},
    {en:'bread',cn:'面包',emoji:'🍞',category:'食物'},
    {en:'milk',cn:'牛奶',emoji:'🥛',category:'食物'},
    {en:'egg',cn:'鸡蛋',emoji:'🥚',category:'食物'},
    {en:'cake',cn:'蛋糕',emoji:'🍰',category:'食物'},
    {en:'rice',cn:'米饭',emoji:'🍚',category:'食物'},
    {en:'water',cn:'水',emoji:'💧',category:'食物'},
    {en:'book',cn:'书',emoji:'📖',category:'物品'},
    {en:'pen',cn:'笔',emoji:'🖊️',category:'物品'},
    {en:'bag',cn:'书包',emoji:'🎒',category:'物品'},
    {en:'ball',cn:'球',emoji:'⚽',category:'物品'},
  ],
  // 短句跟读
  sentences: [
    {en:'Hello, I am Tongtong.',cn:'你好，我是彤彤。'},
    {en:'Good morning, teacher!',cn:'早上好，老师！'},
    {en:'How are you?',cn:'你好吗？'},
    {en:'I am fine, thank you.',cn:'我很好，谢谢你。'},
    {en:'What is your name?',cn:'你叫什么名字？'},
    {en:'My name is Tongtong.',cn:'我的名字叫彤彤。'},
    {en:'I like apples.',cn:'我喜欢苹果。'},
    {en:'I love my family.',cn:'我爱我的家人。'},
    {en:'Let us play together.',cn:'让我们一起玩吧。'},
    {en:'It is a beautiful day.',cn:'今天是美好的一天。'},
    {en:'I can read and write.',cn:'我会读书和写字。'},
    {en:'Stand up, please.',cn:'请站起来。'},
    {en:'Sit down, please.',cn:'请坐下。'},
    {en:'Open your book.',cn:'打开你的书。'},
    {en:'Look at the blackboard.',cn:'看黑板。'},
  ],
  // 自然拼读
  phonics: [
    {letter:'Aa',sound:'/æ/',words:['apple','ant','alligator'],emoji:'🍎'},
    {letter:'Bb',sound:'/b/',words:['book','ball','bird'],emoji:'🐻'},
    {letter:'Cc',sound:'/k/',words:['cat','cake','cup'],emoji:'🐱'},
    {letter:'Dd',sound:'/d/',words:['dog','duck','door'],emoji:'🐶'},
    {letter:'Ee',sound:'/e/',words:['egg','elephant','eight'],emoji:'🐘'},
    {letter:'Ff',sound:'/f/',words:['fish','flower','four'],emoji:'🐟'},
    {letter:'Gg',sound:'/g/',words:['goat','girl','green'],emoji:'🐐'},
    {letter:'Hh',sound:'/h/',words:['hat','house','horse'],emoji:'🏠'},
    {letter:'Ii',sound:'/ɪ/',words:['ice','igloo','ink'],emoji:'🧊'},
    {letter:'Jj',sound:'/dʒ/',words:['juice','jump','jelly'],emoji:'🧃'},
    {letter:'Kk',sound:'/k/',words:['kite','key','kangaroo'],emoji:'🪁'},
    {letter:'Ll',sound:'/l/',words:['lion','leaf','lamp'],emoji:'🦁'},
    {letter:'Mm',sound:'/m/',words:['moon','monkey','milk'],emoji:'🌙'},
    {letter:'Nn',sound:'/n/',words:['nose','nut','nine'],emoji:'👃'},
    {letter:'Oo',sound:'/ɒ/',words:['orange','ox','octopus'],emoji:'🍊'},
    {letter:'Pp',sound:'/p/',words:['pig','pen','panda'],emoji:'🐷'},
    {letter:'Qq',sound:'/kw/',words:['queen','quilt','question'],emoji:'👑'},
    {letter:'Rr',sound:'/r/',words:['rabbit','rain','red'],emoji:'🐰'},
    {letter:'Ss',sound:'/s/',words:['sun','snake','star'],emoji:'☀️'},
    {letter:'Tt',sound:'/t/',words:['tiger','tree','two'],emoji:'🐯'},
    {letter:'Uu',sound:'/ʌ/',words:['umbrella','up','uncle'],emoji:'☂️'},
    {letter:'Vv',sound:'/v/',words:['violin','van','vest'],emoji:'🎻'},
    {letter:'Ww',sound:'/w/',words:['water','wolf','window'],emoji:'💧'},
    {letter:'Xx',sound:'/ks/',words:['box','fox','six'],emoji:'📦'},
    {letter:'Yy',sound:'/j/',words:['yellow','yo-yo','yogurt'],emoji:'🟡'},
    {letter:'Zz',sound:'/z/',words:['zebra','zoo','zero'],emoji:'🦓'},
  ],
  // 找不同游戏（两幅图用emoji表示）
  spotDiff: [
    {set1:['🍎','🍌','🍊','🍇','🐱','🐶','⭐','🌈'],set2:['🍎','🍌','🍊','🍐','🐱','🐶','🌙','🌈']},
    {set1:['⬆️','⬇️','⬅️','➡️','🔴','🟢','🔵','🟡'],set2:['⬆️','⬇️','⬅️','⬅️','🔴','🟠','🔵','🟡']},
    {set1:['🌞','🌙','⭐','☁️','🌧️','🌈','⚡','❄️'],set2:['🌞','🌍','⭐','☁️','🌧️','🌈','💫','❄️']},
  ]
};

// ============ 算术题库 ============
const MATH_DATA = {
  // 40以内加减法生成器
  generateAdd: function(max=40) {
    const a = Math.floor(Math.random()*max/2)+1;
    const b = Math.floor(Math.random()*(max-a))+1;
    return {question:`${a} + ${b} = ?`, answer: a+b, a, b, op:'+'};
  },
  generateSub: function(max=40) {
    const a = Math.floor(Math.random()*max/2)+max/4;
    const b = Math.floor(Math.random()*a)+1;
    return {question:`${a} - ${b} = ?`, answer: a-b, a, b, op:'-'};
  },
  // 破十法：十几减几，先用10减
  breakTen: [
    {question:'12 - 5 = ?', answer:7, method:'破十法：12分成10和2，用10-5=5，再用5+2=7'},
    {question:'13 - 6 = ?', answer:7, method:'破十法：13分成10和3，用10-6=4，再用4+3=7'},
    {question:'14 - 8 = ?', answer:6, method:'破十法：14分成10和4，用10-8=2，再用2+4=6'},
    {question:'15 - 7 = ?', answer:8, method:'破十法：15分成10和5，用10-7=3，再用3+5=8'},
    {question:'16 - 9 = ?', answer:7, method:'破十法：16分成10和6，用10-9=1，再用1+6=7'},
    {question:'11 - 4 = ?', answer:7, method:'破十法：11分成10和1，用10-4=6，再用6+1=7'},
    {question:'17 - 8 = ?', answer:9, method:'破十法：17分成10和7，用10-8=2，再用2+7=9'},
    {question:'13 - 8 = ?', answer:5, method:'破十法：13分成10和3，用10-8=2，再用2+3=5'},
  ],
  // 凑十法：两个数凑成10
  makeTen: [
    {question:'8 + 5 = ?', answer:13, method:'凑十法：看到8想到2，把5分成2和3，8+2=10，10+3=13'},
    {question:'7 + 6 = ?', answer:13, method:'凑十法：看到7想到3，把6分成3和3，7+3=10，10+3=13'},
    {question:'9 + 4 = ?', answer:13, method:'凑十法：看到9想到1，把4分成1和3，9+1=10，10+3=13'},
    {question:'6 + 5 = ?', answer:11, method:'凑十法：看到6想到4，把5分成4和1，6+4=10，10+1=11'},
    {question:'8 + 7 = ?', answer:15, method:'凑十法：看到8想到2，把7分成2和5，8+2=10，10+5=15'},
    {question:'7 + 4 = ?', answer:11, method:'凑十法：看到7想到3，把4分成3和1，7+3=10，10+1=11'},
    {question:'9 + 6 = ?', answer:15, method:'凑十法：看到9想到1，把6分成1和5，9+1=10，10+5=15'},
    {question:'8 + 4 = ?', answer:12, method:'凑十法：看到8想到2，把4分成2和2，8+2=10，10+2=12'},
  ],
  // 应用题（10以内）
  wordProblems: [
    {q:'树上有3只小鸟，又飞来了4只，现在树上有几只小鸟？',a:7,hint:'3+4=7'},
    {q:'盘子里有8个草莓，彤彤吃了3个，还剩几个？',a:5,hint:'8-3=5'},
    {q:'妈妈买了5个红苹果和2个绿苹果，一共买了几个苹果？',a:7,hint:'5+2=7'},
    {q:'池塘里有6条小鱼，游走了2条，还有几条小鱼？',a:4,hint:'6-2=4'},
    {q:'彤彤有4支铅笔，爸爸又给她买了3支，现在有几支？',a:7,hint:'4+3=7'},
    {q:'花园里有9朵花，摘了4朵，还剩几朵？',a:5,hint:'9-4=5'},
    {q:'教室里有7个男孩和3个女孩，一共有几个小朋友？',a:10,hint:'7+3=10'},
    {q:'篮子里有6个鸡蛋，打碎了1个，还有几个好的？',a:5,hint:'6-1=5'},
    {q:'小猫钓了2条鱼，猫妈妈钓了5条鱼，一共钓了几条？',a:7,hint:'2+5=7'},
    {q:'有10块糖，分给小朋友4块，还剩几块？',a:6,hint:'10-4=6'},
  ]
};

// ============ 思维训练6类 ============
const THINKING_DATA = {
  // 数字规律
  numberPattern: [
    {seq:[1,2,3,4,'?'],answer:5,hint:'每次加1'},
    {seq:[2,4,6,8,'?'],answer:10,hint:'每次加2'},
    {seq:[10,9,8,7,'?'],answer:6,hint:'每次减1'},
    {seq:[1,3,5,7,'?'],answer:9,hint:'单数递增'},
    {seq:[2,4,8,'?'],answer:16,hint:'每次翻倍'},
    {seq:[5,10,15,'?'],answer:20,hint:'每次加5'},
  ],
  // 图形推理
  shapePattern: [
    {seq:['⭕','⬜','⭕','⬜','⭕','?'],options:['⬜','⭕','🔺'],answer:0,hint:'圆形和方形交替'},
    {seq:['🔺','🔺','⭕','🔺','🔺','?'],options:['⭕','🔺','⬜'],answer:0,hint:'两个三角一个圆'},
    {seq:['⭐','🌙','⭐','🌙','⭐','?'],options:['🌙','⭐','☀️'],answer:0,hint:'星星月亮交替'},
    {seq:['🍎','🍌','🍎','🍌','?'],options:['🍌','🍎','🍇'],answer:0,hint:'苹果香蕉交替'},
  ],
  // 生活数学
  lifeMath: [
    {q:'彤彤早上7点起床，8点上学，从起床到上学有几分钟？',a:60,options:['30','60','90'],hint:'1小时=60分钟'},
    {q:'一个西瓜切4刀，最多能切成几块？',a:11,options:['4','8','11'],hint:'想想怎么切最多'},
    {q:'一只手有5个手指，两只手有几个手指？',a:10,options:['5','10','15'],hint:'5+5=10'},
    {q:'一周有几天？',a:7,options:['5','7','30'],hint:'周一到周日'},
    {q:'彤彤排第3，后面还有2人，一共有几人？',a:5,options:['3','5','6'],hint:'3+2=5'},
  ],
  // 拼图思维（数方块）
  puzzleMath: [
    {q:'数一数，有几个方块？🟦🟦\n🟦🟦\n🟦',a:5,hint:'一层层数'},
    {q:'数一数，有几个方块？🟦🟦🟦\n🟦🟦',a:5,hint:'上面3个下面2个'},
    {q:'数一数，有几个方块？🟦\n🟦🟦\n🟦🟦🟦',a:6,hint:'1+2+3'},
  ],
  // 比较大小
  compare: [
    {a:15,b:8,answer:'>',q:'比较大小：15 ○ 8'},
    {a:6,b:9,answer:'<',q:'比较大小：6 ○ 9'},
    {a:20,b:20,answer:'=',q:'比较大小：20 ○ 20'},
    {a:12,b:21,answer:'<',q:'比较大小：12 ○ 21'},
    {a:30,b:25,answer:'>',q:'比较大小：30 ○ 25'},
    {a:7,b:17,answer:'<',q:'比较大小：7 ○ 17'},
  ],
  // 时间认知
  time: [
    {q:'钟表上时针指向8，分针指向12，是几点？',a:'8:00',options:['8:00','3:00','12:00'],hint:'分针指向12是整点'},
    {q:'钟表上时针指向3，分针指向12，是几点？',a:'3:00',options:['3:00','9:00','6:00'],hint:'分针指向12是整点'},
    {q:'一天有几个小时？',a:'24',options:['12','24','60'],hint:'一天是24小时'},
    {q:'一小时等于几分钟？',a:'60',options:['30','60','100'],hint:'1小时=60分钟'},
    {q:'一分钟等于几秒？',a:'60',options:['30','60','100'],hint:'1分钟=60秒'},
  ]
};

// ============ 每日拓展 ============
const DAILY_DATA = {
  // 小知识
  knowledge: [
    {title:'为什么天是蓝色的？',content:'阳光穿过大气层时，蓝色的光最容易散射，所以我们看到的天空是蓝色的。'},
    {title:'为什么萤火虫会发光？',content:'萤火虫腹部有发光器，通过化学反应发光，主要用来吸引同伴。'},
    {title:'为什么会有彩虹？',content:'雨后空气中有小水珠，阳光照射后发生折射和反射，就形成了七色彩虹。'},
    {title:'鱼为什么不眨眼？',content:'因为鱼没有眼睑（眼皮），所以它们睡觉时也睁着眼睛。'},
    {title:'为什么树叶是绿色的？',content:'树叶里有叶绿素，它反射绿光，所以树叶看起来是绿色的。'},
    {title:'为什么打雷有声音？',content:'闪电让周围空气迅速膨胀收缩，产生震动，就形成了雷声。'},
    {title:'蜜蜂怎么采蜜？',content:'蜜蜂用长舌头吸食花蜜，储存在蜜囊里，带回蜂巢酿成蜂蜜。'},
    {title:'为什么会有四季？',content:'地球绕太阳转，因为地轴是倾斜的，所以有春夏秋冬四季变化。'},
  ],
  // 动手实验
  experiment: [
    {title:'彩虹牛奶',steps:['准备一个盘子倒入牛奶','滴入几滴不同颜色的色素','用棉签蘸洗洁精点一下色素','观察颜色像彩虹一样散开！'],mat:'牛奶、色素、洗洁精、棉签、盘子'},
    {title:'会跳舞的葡萄',steps:['准备一杯透明汽水（雪碧）','放入几粒葡萄','观察葡萄上下跳舞！'],mat:'雪碧、葡萄、透明杯'},
    {title:'魔法小喷泉',steps:['瓶口套上气球','瓶子里装苏打粉','气球里装白醋','把气球套上瓶口，看喷泉！'],mat:'小瓶子、气球、小苏打、白醋'},
    {title:'纸桥承重',steps:['用纸折成瓦楞形','架在两本书之间','看看能放几枚硬币'],mat:'A4纸、硬币、书'},
  ],
  // 故事
  story: [
    {title:'小猫钓鱼',content:'猫妈妈带着小猫去钓鱼。小猫看到蜻蜓去追，看到蝴蝶去追，一条鱼也没钓到。猫妈妈专心钓鱼，钓了很多。小猫学着妈妈专心钓鱼，终于钓到了一条大鱼！'},
    {title:'龟兔赛跑',content:'兔子和乌龟赛跑。兔子跑得快，跑到一半在树下睡着了。乌龟一步一步慢慢爬，不停歇，最后乌龟赢了！'},
    {title:'乌鸦喝水',content:'一只乌鸦口渴了，看到瓶子里有水但够不着。聪明的乌鸦叼来小石子放进瓶子里，水慢慢升高，乌鸦喝到了水。'},
    {title:'小马过河',content:'小马要过河，老牛说水很浅，松鼠说水很深。小马回家问妈妈，妈妈说："自己去试试就知道了。"小马试了试，水不深也不浅，顺利过了河。'},
  ],
  // 儿歌
  nursery: [
    {title:'两只老虎',content:'两只老虎，两只老虎，跑得快，跑得快。一只没有耳朵，一只没有尾巴，真奇怪，真奇怪。'},
    {title:'小星星',content:'一闪一闪亮晶晶，满天都是小星星。挂在天上放光明，好像许多小眼睛。'},
    {title:'找朋友',content:'找呀找呀找朋友，找到一个好朋友。敬个礼，握握手，你是我的好朋友。'},
    {title:'小白兔',content:'小白兔，白又白，两只耳朵竖起来。爱吃萝卜爱吃菜，蹦蹦跳跳真可爱。'},
  ],
  // 每日挑战
  challenge: [
    {q:'用1、2、3三个数字，能组成几个不同的两位数？',a:6,hint:'12,13,21,23,31,32'},
    {q:'一个西瓜切3刀，最多切成几块？',a:8,hint:'想想切西瓜的方法'},
    {q:'彤彤比妈妈小25岁，5年后彤彤比妈妈小几岁？',a:25,hint:'年龄差不变'},
    {q:'一只青蛙几张嘴几只眼睛几条腿？',a:'1张嘴2只眼睛4条腿',hint:'想想青蛙的样子'},
    {q:'一根绳子剪3次，能剪成几段？',a:4,hint:'每次剪多一段'},
  ]
};

// ============ 阅读理解 ============
const READING_DATA = [
  {
    passage:'春天来了，草地变绿了，花儿开了。小鸟在树上唱歌，蝴蝶在花丛中飞舞。彤彤和妈妈去公园放风筝，风筝飞得很高很高。彤彤开心地笑了。',
    questions:[
      {q:'什么季节来了？',options:['春天','夏天','秋天'],a:0},
      {q:'草地变成了什么颜色？',options:['红色','绿色','黄色'],a:1},
      {q:'谁在树上唱歌？',options:['蝴蝶','小鸟','彤彤'],a:1},
      {q:'彤彤和妈妈去公园做什么？',options:['跑步','放风筝','看书'],a:1},
    ]
  },
  {
    passage:'早上，彤彤起床后先刷牙洗脸，然后吃早饭。今天的早饭是牛奶和面包。吃完早饭，彤彤背上书包去上学。到了学校，她和同学们一起读书。彤彤是个好孩子。',
    questions:[
      {q:'彤彤起床后先做什么？',options:['吃饭','刷牙洗脸','上学'],a:1},
      {q:'今天的早饭是什么？',options:['米饭','牛奶和面包','面条'],a:1},
      {q:'吃完早饭彤彤去哪里？',options:['公园','学校','超市'],a:1},
      {q:'彤彤是个怎样的孩子？',options:['好孩子','坏孩子','懒孩子'],a:0},
    ]
  },
  {
    passage:'小白兔有一双红红的眼睛，一对长长的耳朵，还有一条短短的尾巴。它最爱吃胡萝卜和青菜。小白兔蹦蹦跳跳的，真可爱！',
    questions:[
      {q:'小白兔的眼睛是什么颜色？',options:['白色','红色','黑色'],a:1},
      {q:'小白兔的耳朵是怎样的？',options:['长长的','短短的','圆圆的'],a:0},
      {q:'小白兔爱吃什么？',options:['肉','胡萝卜和青菜','鱼'],a:1},
      {q:'小白兔是怎么走路的？',options:['爬行','蹦蹦跳跳','飞'],a:1},
    ]
  }
];

if (typeof window !== 'undefined') {
  window.ENGLISH_DATA = ENGLISH_DATA;
  window.MATH_DATA = MATH_DATA;
  window.THINKING_DATA = THINKING_DATA;
  window.DAILY_DATA = DAILY_DATA;
  window.READING_DATA = READING_DATA;
}
