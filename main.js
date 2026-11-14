const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const CONTROLS_URL = "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/controls/OrbitControls.js";
const CSS2D_URL = "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/renderers/CSS2DRenderer.js";

const COPY = {
  overview: {
    kicker: { zh: "简历", en: "Profile" },
    title: { zh: "从这棵树看经历", en: "Read the work from the tree" },
    body: {
      zh: "西南财经大学市场营销本科生（2028 届），做过短视频与图文、热点洞察、用户反馈分析、AIGC 工具评测和跨境电商。雅思 7.5。",
      en: "Marketing undergraduate at Southwestern University of Finance and Economics (class of 2028), with work in short video and image-text, trend sensing, user feedback, AIGC tool evaluation, and cross-border e-commerce. IELTS 7.5.",
    },
  },
  content: {
    kicker: { zh: "内容运营", en: "Content" },
    title: { zh: "内容运营", en: "Content operations" },
    points: {
      zh: ["抖音 / 小红书热点追踪、评论分析、内容策划，以及传播数据复盘。"],
      en: ["Douyin and Xiaohongshu trend tracking, comment analysis, content planning, and reviews of how posts travel."],
    },
    tags: { zh: ["抖音", "小红书"], en: ["Douyin", "Xiaohongshu"] },
  },
  douyin: {
    kicker: { zh: "项目", en: "Project" },
    title: { zh: "抖音热点内容", en: "Douyin trend content" },
    points: {
      zh: [
        "结合平台推荐机制和用户情绪设计视频开场 Hook 与评论互动，再按传播数据持续改内容。",
        "单条视频 500 万+ 播放、19 万+ 点赞、37 万+ 转发。",
      ],
      en: [
        "Designed opening hooks and comment prompts around how the platform recommends videos and how viewers feel, then kept revising from the distribution data.",
        "One video reached 5M+ views, 190K+ likes, and 370K+ shares.",
      ],
    },
    tags: { zh: ["500万+", "19万+ 赞", "37万+ 转发"], en: ["5M+ views", "190K likes", "370K shares"] },
  },
  xhs: {
    kicker: { zh: "项目", en: "Project" },
    title: { zh: "小红书 AIGC 图文", en: "Xiaohongshu AIGC posts" },
    points: {
      zh: ["用 Prompt 引导大语言模型辅助图文创作。", "多篇内容 1,500+ 点赞，单篇最高浏览 15 万+。"],
      en: ["Used prompts to steer large language models while making image-and-text posts.", "Several posts earned 1,500+ likes, and one reached 150K+ views."],
    },
    tags: { zh: ["Prompt", "1,500+ 赞", "15万+"], en: ["Prompt", "1,500+ likes", "150K views"] },
  },
  review: {
    kicker: { zh: "方法", en: "Practice" },
    title: { zh: "评论与传播复盘", en: "Comments and distribution reviews" },
    points: {
      zh: [
        "抖音内容按播放、点赞和转发持续回看并改 Hook。",
        "在铨丰用 Coze 采集抖音、小红书热销内容和评论，提炼需求痛点后再选品。",
        "在富皇美运用 Coze 抓取并分析 Reddit 讨论，提炼摄影配件的使用痛点。",
      ],
      en: [
        "Douyin pieces were revised from views, likes, and shares, including the opening hook.",
        "At Quanfeng, Coze collected bestselling Douyin and Xiaohongshu posts and comments so pain points could shape what to sell.",
        "At Fuhuang Meiyun, a Coze workflow captured Reddit threads and pulled out pain points around photography accessories.",
      ],
    },
    tags: { zh: ["评论分析", "数据复盘"], en: ["Comments", "Data review"] },
  },
  aigc: {
    kicker: { zh: "AIGC", en: "AIGC" },
    title: { zh: "AIGC 与数据工具", en: "AIGC and data tools" },
    points: {
      zh: ["熟悉 Gemini、Coze、即梦、可灵、Stable Diffusion、Cursor、Codex。做过工具评测、Prompt、工作流，以及 Python 基础。"],
      en: ["Comfortable with Gemini, Coze, Jimeng, Kling, Stable Diffusion, Cursor, and Codex. Work covers tool evaluation, prompts, workflows, and Python fundamentals."],
    },
    tags: { zh: ["Gemini", "Coze", "Cursor", "Codex"], en: ["Gemini", "Coze", "Cursor", "Codex"] },
  },
  coze: {
    kicker: { zh: "实习", en: "Internships" },
    title: { zh: "Coze 工作流", en: "Coze workflows" },
    points: {
      zh: [
        "新网银行（2025.03–2025.06）：搭建工作流监控抖音、快手热点，并按热点产出 50+ 条数字人新闻。",
        "铨丰环保科技（2025.07–2025.09）：采集热销内容与评论，筛选商品并对接 1688 工厂定制。男士蝴蝶颈链上架后销量 100+。",
        "深圳市富皇美运（2024.12–2025.02）：抓取并分析 Reddit 讨论，支持摄影配件选品与铺货。相关项目营业额 100 万+。",
      ],
      en: [
        "Xinwang Bank (Mar–Jun 2025): built a workflow to watch Douyin and Kuaishou trends and turned them into 50+ digital-human news clips.",
        "Quanfeng Environmental Technology (Jul–Sep 2025): collected bestselling posts and comments, shortlisted products, and coordinated custom production with 1688 factories. A men’s butterfly necklace sold 100+ units.",
        "Shenzhen Fuhuang Meiyun (Dec 2024–Feb 2025): captured and analyzed Reddit discussions to support selection and assortment of photography accessories. Related projects reached 1M+ RMB in revenue.",
      ],
    },
    tags: { zh: ["Coze", "50+ 条", "100万+"], en: ["Coze", "50+ clips", "1M+ RMB"] },
  },
  vision: {
    kicker: { zh: "实习", en: "Internship" },
    title: { zh: "即梦与可灵", en: "Jimeng and Kling" },
    points: {
      zh: [
        "在铨丰用即梦、可灵制作并迭代商品图，单个商品流量提升 50%+。",
        "在新网银行依据工具评测参与图像和数字人素材，相关内容全网累计播放 50 万+。",
      ],
      en: [
        "At Quanfeng, product images were made and iterated in Jimeng and Kling. Traffic for one product rose by 50%+.",
        "At Xinwang Bank, those evaluations fed image creation and digital-human assets. Related work passed 500K+ views across the web.",
      ],
    },
    tags: { zh: ["即梦", "可灵", "50%+"], en: ["Jimeng", "Kling", "50%+"] },
  },
  models: {
    kicker: { zh: "实习", en: "Internship" },
    title: { zh: "大模型与生成工具评测", en: "Model and generator evaluations" },
    points: {
      zh: [
        "新网银行 AI 工具调研助理：横向对比通义千问、文心一言、ChatGPT，以及 Stable Diffusion、即梦、可灵，整理功能特点和适用场景，供工具选型参考。",
        "个人常用工具还包括 Gemini。",
      ],
      en: [
        "AI tools research assistant at Xinwang Bank: compared Tongyi Qianwen, ERNIE Bot, and ChatGPT, plus Stable Diffusion, Jimeng, and Kling, and wrote up what each one is good for so the team could choose tools.",
        "Gemini is also part of the everyday toolkit.",
      ],
    },
    tags: { zh: ["通义千问", "文心一言", "ChatGPT", "Stable Diffusion"], en: ["Qwen", "ERNIE Bot", "ChatGPT", "Stable Diffusion"] },
  },
  cursor: {
    kicker: { zh: "项目", en: "Project" },
    title: { zh: "NMIXX 互动网页", en: "NMIXX interactive page" },
    points: {
      zh: ["用 Cursor 辅助完成网页设计与开发，再在小红书二次传播，获得 1,500+ 浏览。工具清单里还有 Codex。"],
      en: ["Used Cursor to help design and build the page, then shared it again on Xiaohongshu, where it picked up 1,500+ views. Codex is also in the tool set."],
    },
    links: [
      { href: "https://duimalves94-beep.github.io/NMIXX/", zh: "线上页面", en: "Live site" },
      { href: "https://github.com/duimalves94-beep/NMIXX", zh: "GitHub 仓库", en: "GitHub repo" },
    ],
    tags: { zh: ["Cursor", "Codex", "Vibe Coding"], en: ["Cursor", "Codex", "Vibe Coding"] },
  },
  practice: {
    kicker: { zh: "实践", en: "Practice" },
    title: { zh: "商业实践", en: "Commercial practice" },
    points: {
      zh: ["电商运营、跨境选品，以及面向大模型和具身智能赛道的人才寻访。"],
      en: ["E-commerce operations, cross-border product selection, and talent search in large-model and embodied-intelligence tracks."],
    },
    tags: { zh: ["电商", "跨境", "猎头"], en: ["Commerce", "Cross-border", "Search"] },
  },
  ecom: {
    kicker: { zh: "实习", en: "Internship" },
    title: { zh: "铨丰环保科技 · 电商运营", en: "Quanfeng · e-commerce" },
    points: {
      zh: ["2025.07–2025.09。用 Coze 采集抖音、小红书热销内容与评论，提炼痛点，筛选商品并对接 1688 工厂。", "男士蝴蝶颈链销量 100+。即梦、可灵商品图使单个商品流量提升 50%+。"],
      en: ["Jul–Sep 2025. Coze collected bestselling Douyin and Xiaohongshu posts and comments, pain points were distilled, and custom production was lined up with 1688 factories.", "The men’s butterfly necklace sold 100+ units. Jimeng and Kling images lifted one product’s traffic by 50%+."],
    },
    tags: { zh: ["2025.07–09", "1688", "100+"], en: ["Jul–Sep 2025", "1688", "100+ sold"] },
  },
  cross: {
    kicker: { zh: "实习", en: "Internship" },
    title: { zh: "富皇美运 · 跨境电商", en: "Fuhuang Meiyun · cross-border" },
    points: {
      zh: ["2024.12–2025.02，深圳市富皇美运，跨境电商运营。", "Coze 工作流分析 Reddit 上的摄影配件讨论，支持选品与铺货。相关项目营业额 100 万+。"],
      en: ["Dec 2024–Feb 2025, cross-border e-commerce operations at Shenzhen Fuhuang Meiyun.", "A Coze workflow analyzed Reddit talk about photography accessories and supported selection and assortment. Related projects reached 1M+ RMB in revenue."],
    },
    tags: { zh: ["Reddit", "100万+"], en: ["Reddit", "1M+ RMB"] },
  },
  talent: {
    kicker: { zh: "实习", en: "Internship" },
    title: { zh: "TTC · AI 猎头顾问实习生", en: "TTC · AI headhunting intern" },
    points: {
      zh: [
        "2026.04–2026.05。围绕大模型、具身智能等赛道，按岗位需求梳理人才画像并构建行业人才地图，支持定向寻访。",
        "用 AI 搜索和自动化初筛做候选人背景调研与多渠道寻访，并参与优化候选人交付漏斗。",
        "跟踪人才流动、薪酬变化和赛道动态，为团队的寻访策略提供参考。",
      ],
      en: [
        "Apr–May 2026. For tracks such as large models and embodied intelligence, turned role needs into talent profiles and an industry talent map, and supported targeted search.",
        "Used AI search and automated screening to research backgrounds and source across channels, and helped improve the candidate delivery funnel.",
        "Followed talent movement, pay shifts, and sector news so the team could adjust its search strategy.",
      ],
    },
    tags: { zh: ["大模型", "具身智能", "人才地图"], en: ["Large models", "Embodied AI", "Talent map"] },
  },
  ecofact: {
    kicker: { zh: "项目", en: "Project" },
    title: { zh: "EcoFact 事实核查", en: "EcoFact fact-checking" },
    points: {
      zh: ["2026.09，法国南特黑客松。", "围绕环保信息核查梳理使用场景，设计了多源信息获取、大模型事实核查和可信度评分，并完成 MVP 方案。"],
      en: ["Sep 2026, Nantes Hackathon, France.", "Mapped how people would check environmental claims, designed multi-source retrieval, large-model fact-checking, and a credibility score, and completed an MVP proposal."],
    },
    tags: { zh: ["南特", "MVP", "可信度评分"], en: ["Nantes", "MVP", "Credibility score"] },
  },
  profile: {
    kicker: { zh: "履历", en: "Background" },
    title: { zh: "教育、语言与奖项", en: "Study, languages, and awards" },
    points: {
      zh: ["西南财经大学市场营销本科，法国南特高等商学院交换。雅思 7.5，英语六级 552，法语可作基础交流。"],
      en: ["B.A. Marketing at SWUFE, with an exchange at Audencia Business School in Nantes. IELTS 7.5, CET-6 552, and basic conversational French."],
    },
    tags: { zh: ["GPA 3.5", "雅思 7.5"], en: ["GPA 3.5", "IELTS 7.5"] },
  },
  languages: {
    kicker: { zh: "语言", en: "Languages" },
    title: { zh: "语言", en: "Languages" },
    points: {
      zh: ["雅思 7.5。", "英语六级 552。", "法语基础交流。"],
      en: ["IELTS 7.5.", "CET-6 score 552.", "Basic conversational French."],
    },
    tags: { zh: ["雅思 7.5", "六级 552", "法语"], en: ["IELTS 7.5", "CET-6 552", "French"] },
  },
  education: {
    kicker: { zh: "教育", en: "Education" },
    title: { zh: "教育背景", en: "Education" },
    points: {
      zh: [
        "西南财经大学，市场营销（金融服务营销）本科，2024.09–2028.06。GPA 3.5/4.0，专业前 17%。",
        "相关课程：数字化商业营销、人工智能与现代科技、Python、计算机与大数据基础、概率论与数理统计。",
        "法国南特高等商学院交换，2026.02–2026.07。参与跨文化商业与技术协作，并关注国际市场与海外社媒内容。",
      ],
      en: [
        "Southwestern University of Finance and Economics, B.A. Marketing (Financial Services Marketing), Sep 2024–Jun 2028. GPA 3.5/4.0, top 17% of the major.",
        "Coursework: Digital Business Marketing, Artificial Intelligence and Modern Technology, Python, Foundations of Computing and Big Data, Probability and Mathematical Statistics.",
        "Exchange at Audencia Business School, Nantes, Feb–Jul 2026. Joined cross-cultural work on business and technology, and followed international markets and overseas social content.",
      ],
    },
    tags: { zh: ["西南财经大学", "南特高商", "Python"], en: ["SWUFE", "Audencia", "Python"] },
  },
  awards: {
    kicker: { zh: "奖项", en: "Awards" },
    title: { zh: "竞赛与奖项", en: "Awards" },
    points: {
      zh: [
        "2025 香港大学生商业分析大赛二等奖（前 5%）。提出「AI 前置 + 情绪触发 + 人工接入」三层智能服务模型。",
        "2025 CMAU 四川省二等奖。",
        "2025 西南财经大学管理咨询大赛二等奖。",
      ],
      en: [
        "Second prize, top 5%, 2025 Hong Kong University Student Business Analytics Competition. Proposed a three-layer service model: AI up front, an emotion trigger, and a human handoff.",
        "Second prize, 2025 CMAU Sichuan.",
        "Second prize, 2025 SWUFE Management Consulting Competition.",
      ],
    },
    tags: { zh: ["前 5%", "二等奖"], en: ["Top 5%", "Second prize"] },
  },
};

const BRANCHES = [
  {
    id: "content",
    angle: -1.15,
    y: 2.35,
    radius: 1.7,
    children: [
      { id: "douyin", da: -0.48, up: 0.95, reach: 1.45 },
      { id: "xhs", da: 0.42, up: 0.15, reach: 1.55 },
      { id: "review", da: -0.02, up: 0.62, reach: 1.7 },
    ],
  },
  {
    id: "aigc",
    angle: 1.15,
    y: 2.5,
    radius: 1.65,
    children: [
      { id: "coze", da: 0.5, up: 0.85, reach: 1.45 },
      { id: "vision", da: 0.12, up: 0.1, reach: 1.6 },
      { id: "models", da: -0.22, up: 1.15, reach: 1.35 },
      { id: "cursor", da: -0.55, up: 0.45, reach: 1.5 },
    ],
  },
  {
    id: "practice",
    angle: Math.PI,
    y: 1.45,
    radius: 1.55,
    children: [
      { id: "ecom", da: -0.55, up: 0.35, reach: 1.45 },
      { id: "cross", da: -0.12, up: -0.25, reach: 1.55 },
      { id: "talent", da: 0.28, up: 0.7, reach: 1.4 },
      { id: "ecofact", da: 0.62, up: 0.2, reach: 1.35 },
    ],
  },
  {
    id: "profile",
    angle: -2.55,
    y: 3.45,
    radius: 1.35,
    children: [
      { id: "languages", da: -0.5, up: 0.55, reach: 1.35 },
      { id: "education", da: 0.02, up: 0.15, reach: 1.55 },
      { id: "awards", da: 0.52, up: 0.62, reach: 1.3 },
    ],
  },
];

const LABEL = {
  content: { zh: "内容运营", en: "Content" },
  douyin: { zh: "抖音热点", en: "Douyin" },
  xhs: { zh: "小红书", en: "Xiaohongshu" },
  review: { zh: "评论复盘", en: "Reviews" },
  aigc: { zh: "AIGC", en: "AIGC" },
  coze: { zh: "Coze", en: "Coze" },
  vision: { zh: "即梦 / 可灵", en: "Jimeng / Kling" },
  models: { zh: "模型评测", en: "Model eval" },
  cursor: { zh: "Cursor", en: "Cursor" },
  practice: { zh: "商业实践", en: "Practice" },
  ecom: { zh: "电商运营", en: "E-commerce" },
  cross: { zh: "跨境电商", en: "Cross-border" },
  talent: { zh: "人才寻访", en: "Headhunting" },
  ecofact: { zh: "EcoFact", en: "EcoFact" },
  profile: { zh: "履历", en: "Background" },
  languages: { zh: "语言", en: "Languages" },
  education: { zh: "教育", en: "Education" },
  awards: { zh: "奖项", en: "Awards" },
};

let selected = "overview";
const labelButtons = new Map();
const nodeMeshes = new Map();

function isEnglish() {
  return document.documentElement.classList.contains("lang-en");
}

function text(entry) {
  return entry[isEnglish() ? "en" : "zh"];
}

function applyLang(lang) {
  const en = lang === "en";
  const root = document.documentElement;
  root.classList.toggle("lang-en", en);
  root.classList.toggle("lang-zh", !en);
  root.lang = en ? "en" : "zh-CN";
  document.title = en ? "Yitian Chen · Skill tree" : "陈怡天 · 技能树";
  const btn = document.getElementById("lang-toggle");
  if (btn) {
    btn.setAttribute("aria-pressed", en ? "true" : "false");
    btn.setAttribute("aria-label", en ? "Switch to Chinese" : "切换到英文");
  }
  try { localStorage.setItem("resume-lang", en ? "en" : "zh"); } catch (e) {}
  labelButtons.forEach(function (button, id) {
    button.textContent = text(LABEL[id]);
  });
  renderDetail(selected);
}

function renderDetail(id) {
  const data = COPY[id] || COPY.overview;
  const panel = document.getElementById("detail");
  const lang = isEnglish() ? "en" : "zh";
  const points = (data.points && data.points[lang]) || [];
  const links = data.links || [];
  const tags = (data.tags && data.tags[lang]) || [];
  panel.innerHTML = "";
  const kicker = document.createElement("p");
  kicker.className = "detail-kicker";
  kicker.textContent = data.kicker[lang];
  const title = document.createElement("h2");
  title.textContent = data.title[lang];
  panel.append(kicker, title);
  if (data.body) {
    const p = document.createElement("p");
    p.textContent = data.body[lang];
    panel.append(p);
  }
  if (points.length) {
    const list = document.createElement("ul");
    points.forEach(function (line) {
      const li = document.createElement("li");
      li.textContent = line;
      list.append(li);
    });
    panel.append(list);
  }
  if (links.length) {
    const row = document.createElement("p");
    links.forEach(function (link, index) {
      if (index) row.append(" · ");
      const a = document.createElement("a");
      a.href = link.href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = link[lang];
      row.append(a);
    });
    panel.append(row);
  }
  if (tags.length) {
    const row = document.createElement("ul");
    row.className = "tags";
    tags.forEach(function (tag) {
      const li = document.createElement("li");
      li.textContent = tag;
      row.append(li);
    });
    panel.append(row);
  }
}

function selectNode(id) {
  selected = COPY[id] ? id : "overview";
  labelButtons.forEach(function (button, key) {
    button.classList.toggle("is-on", key === selected);
  });
  nodeMeshes.forEach(function (mesh, key) {
    const on = key === selected;
    mesh.material.emissiveIntensity = on ? 0.85 : 0.18;
    mesh.scale.setScalar(on ? 1.35 : 1);
  });
  renderDetail(selected);
}

function showFallback() {
  const box = document.getElementById("tree-fallback");
  const canvas = document.getElementById("tree-canvas");
  if (canvas) canvas.hidden = true;
  box.hidden = false;
  box.innerHTML = "";
  Object.keys(LABEL).forEach(function (id) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text(LABEL[id]);
    button.addEventListener("click", function () { selectNode(id); });
    labelButtons.set(id, button);
    box.append(button);
  });
  selectNode("overview");
}

function place(angle, y, radius) {
  return { x: Math.sin(angle) * radius, y: y, z: Math.cos(angle) * radius };
}

async function initTree() {
  let THREE;
  let OrbitControls;
  let CSS2DRenderer;
  let CSS2DObject;
  try {
    const [core, controls, css2d] = await Promise.all([
      import("three"),
      import(CONTROLS_URL),
      import(CSS2D_URL),
    ]);
    THREE = core;
    OrbitControls = controls.OrbitControls;
    CSS2DRenderer = css2d.CSS2DRenderer;
    CSS2DObject = css2d.CSS2DObject;
  } catch (e) {
    showFallback();
    return;
  }

  const stage = document.getElementById("stage");
  const canvas = document.getElementById("tree-canvas");
  const labelRoot = document.getElementById("tree-labels");
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: window.innerWidth >= 800, alpha: false });
  } catch (e) {
    showFallback();
    return;
  }
  if (!renderer.getContext()) {
    showFallback();
    return;
  }
  try {
  await buildScene(THREE, OrbitControls, CSS2DRenderer, CSS2DObject, renderer);
  } catch (e) {
    showFallback();
  }
}

async function buildScene(THREE, OrbitControls, CSS2DRenderer, CSS2DObject, renderer) {
  const stage = document.getElementById("stage");
  const labelRoot = document.getElementById("tree-labels");
  renderer.setClearColor(0x0f2a1c, 1);
  if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0f2a1c, 0.032);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
  const narrow = window.matchMedia("(max-width: 800px)").matches;
  camera.position.set(0.15, narrow ? 2.45 : 2.65, narrow ? 9.4 : 7.6);

  const labelRenderer = new CSS2DRenderer({ element: labelRoot });
  labelRenderer.domElement.style.position = "absolute";

  scene.add(new THREE.HemisphereLight(0xe7f5c8, 0x14321f, 1.7));
  const sun = new THREE.DirectionalLight(0xfff6dd, 2.5);
  sun.position.set(4, 7, 3);
  scene.add(sun);
  const fill = new THREE.PointLight(0x8fbf6a, 18, 14);
  fill.position.set(-3, 2.5, 2);
  scene.add(fill);

  const bark = new THREE.MeshStandardMaterial({ color: 0x5a4030, roughness: 0.86, metalness: 0.04 });
  const moss = new THREE.MeshStandardMaterial({ color: 0x3d6b45, roughness: 0.8 });
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.26, 2.5, 12), bark);
  trunk.position.y = 1.25;
  const foot = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 12), moss);
  foot.position.y = 0.12;
  foot.scale.y = 0.45;
  const root = new THREE.Group();
  root.scale.setScalar(narrow ? 0.58 : 0.7);
  scene.add(root);
  root.add(trunk, foot);

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(3.4, 40),
    new THREE.MeshStandardMaterial({ color: 0x143222, roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0.01;
  scene.add(ground);

  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x8fbf6a,
    emissive: 0x1d4a2c,
    emissiveIntensity: 0.25,
    roughness: 0.55,
    side: THREE.DoubleSide,
  });
  const leafShape = new THREE.Shape();
  leafShape.moveTo(0, 0);
  leafShape.bezierCurveTo(0.15, 0.1, 0.18, 0.28, 0, 0.46);
  leafShape.bezierCurveTo(-0.18, 0.28, -0.15, 0.1, 0, 0);
  const leafGeo = new THREE.ShapeGeometry(leafShape);

  function addLeaf(point, scale) {
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.set(point.x, point.y, point.z);
    leaf.scale.setScalar(scale);
    leaf.rotation.set(Math.random() * 0.6, Math.random() * Math.PI, Math.random() * 0.4);
    root.add(leaf);
    return leaf;
  }

  function makeLabel(id, bough) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "node-label" + (bough ? " is-bough" : "");
    button.textContent = text(LABEL[id]);
    button.addEventListener("click", function (event) {
      event.stopPropagation();
      selectNode(id);
    });
    labelButtons.set(id, button);
    const object = new CSS2DObject(button);
    return object;
  }

  function addNode(id, point, bough) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(bough ? 0.16 : 0.11, 18, 14),
      new THREE.MeshStandardMaterial({
        color: bough ? 0xe7f5c4 : 0xd7ee9a,
        emissive: 0xc5e38a,
        emissiveIntensity: 0.18,
        roughness: 0.35,
      })
    );
    mesh.position.set(point.x, point.y, point.z);
    mesh.userData.id = id;
    root.add(mesh);
    nodeMeshes.set(id, mesh);
    const label = makeLabel(id, bough);
    const len = Math.hypot(point.x, point.z) || 1;
    label.position.set((point.x / len) * (bough ? 0 : 0.16), bough ? 0.32 : 0.26, (point.z / len) * (bough ? 0 : 0.16));
    mesh.add(label);
    return mesh;
  }

  function connect(a, b, radius) {
    const start = new THREE.Vector3(a.x, a.y, a.z);
    const end = new THREE.Vector3(b.x, b.y, b.z);
    const mid = start.clone().lerp(end, 0.5);
    mid.y += 0.28;
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 16, radius, 6, false),
      bark
    );
    root.add(tube);
    for (let i = 1; i <= 3; i++) addLeaf(curve.getPoint(i / 4), 0.7 + Math.random() * 0.45);
    return curve;
  }

  BRANCHES.forEach(function (branch) {
    const origin = { x: 0, y: branch.y - 0.35, z: 0 };
    const parent = place(branch.angle, branch.y, branch.radius);
    connect(origin, parent, 0.055);
    addNode(branch.id, parent, true);
    branch.children.forEach(function (child) {
      const tip = place(branch.angle + child.da, branch.y + child.up, branch.radius + child.reach);
      connect(parent, tip, 0.032);
      addNode(child.id, tip, false);
    });
  });

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 2.15, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.autoRotate = !reduceMotion;
  controls.autoRotateSpeed = 0.55;
  controls.enablePan = false;
  controls.minDistance = 5.2;
  controls.maxDistance = 15;
  controls.minPolarAngle = 0.55;
  controls.maxPolarAngle = 1.45;
  controls.update();

  let dragging = false;
  controls.addEventListener("start", function () { dragging = true; controls.autoRotate = false; });
  controls.addEventListener("end", function () {
    dragging = false;
    if (!reduceMotion) controls.autoRotate = true;
  });

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let downX = 0;
  let downY = 0;
  renderer.domElement.addEventListener("pointerdown", function (event) {
    downX = event.clientX;
    downY = event.clientY;
  });
  renderer.domElement.addEventListener("pointerup", function (event) {
    if (Math.hypot(event.clientX - downX, event.clientY - downY) > 6) return;
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(Array.from(nodeMeshes.values()));
    if (hits[0] && hits[0].object.userData.id) selectNode(hits[0].object.userData.id);
  });

  function resize() {
    const w = stage.clientWidth || 1;
    const h = stage.clientHeight || 1;
    const pr = Math.min(window.devicePixelRatio || 1, w < 700 ? 1.4 : 1.7);
    renderer.setPixelRatio(pr);
    renderer.setSize(w, h, false);
    labelRenderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  const camFlat = new THREE.Vector3();
  const nodeFlat = new THREE.Vector3();
  const nodeWorld = new THREE.Vector3();
  function updateLabels() {
    camFlat.set(camera.position.x - controls.target.x, 0, camera.position.z - controls.target.z).normalize();
    nodeMeshes.forEach(function (mesh, id) {
      mesh.getWorldPosition(nodeWorld);
      nodeFlat.set(nodeWorld.x - controls.target.x, 0, nodeWorld.z - controls.target.z);
      const dist = nodeFlat.length();
      nodeFlat.normalize();
      const facing = nodeFlat.dot(camFlat);
      const button = labelButtons.get(id);
      const show = id === selected || facing > (dist < 1.15 ? -0.05 : 0.2);
      button.style.opacity = show ? "1" : "0";
      button.style.pointerEvents = show ? "auto" : "none";
    });
  }

  let running = true;
  function frame() {
    if (!running) return;
    requestAnimationFrame(frame);
    controls.update();
    updateLabels();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
  document.addEventListener("visibilitychange", function () {
    running = !document.hidden;
    if (running) requestAnimationFrame(frame);
  });
  selectNode("overview");
}

applyLang(isEnglish() ? "en" : "zh");
document.getElementById("lang-toggle").addEventListener("click", function () {
  applyLang(isEnglish() ? "zh" : "en");
});
initTree();
