const questions = [
  {
    text: "在社交场合中，你通常会主动与陌生人交流。",
    trait: "extroversion",
    direction: 1,
  },
  {
    text: "在人群中你更容易感到兴奋和投入。",
    trait: "extroversion",
    direction: 1,
  },
  {
    text: "长时间独处会让你感到精力下降。",
    trait: "extroversion",
    direction: 1,
  },
  {
    text: "你更倾向于在交流中表达观点，而不是仅倾听。",
    trait: "extroversion",
    direction: 1,
  },
  {
    text: "你喜欢把事情安排得井井有条，再开始行动。",
    trait: "conscientiousness",
    direction: 1,
  },
  {
    text: "你倾向于在截止时间前提前完成任务。",
    trait: "conscientiousness",
    direction: 1,
  },
  {
    text: "当计划被打乱时，你会感到明显的不适。",
    trait: "conscientiousness",
    direction: -1,
  },
  {
    text: "你会把复杂目标拆分成可执行的小步骤。",
    trait: "conscientiousness",
    direction: 1,
  },
  {
    text: "你愿意尝试新鲜事物，即便它有些不确定性。",
    trait: "openness",
    direction: 1,
  },
  {
    text: "你常常关注艺术、文化或抽象话题。",
    trait: "openness",
    direction: 1,
  },
  {
    text: "你乐于接受与既有经验不同的观点。",
    trait: "openness",
    direction: 1,
  },
  {
    text: "面对变化，你更容易兴奋而非担心。",
    trait: "openness",
    direction: 1,
  },
  {
    text: "遇到压力时，你能较快调整并保持冷静。",
    trait: "stability",
    direction: 1,
  },
  {
    text: "遇到冲突时，你容易被情绪影响。",
    trait: "stability",
    direction: -1,
  },
  {
    text: "你的情绪起伏通常比较稳定。",
    trait: "stability",
    direction: 1,
  },
  {
    text: "面对突发状况，你仍能保持思路清晰。",
    trait: "stability",
    direction: 1,
  },
  {
    text: "你愿意站在他人角度理解问题。",
    trait: "agreeableness",
    direction: 1,
  },
  {
    text: "在团队中你更愿意促进和谐而非争胜。",
    trait: "agreeableness",
    direction: 1,
  },
  {
    text: "你会优先考虑他人的感受与需求。",
    trait: "agreeableness",
    direction: 1,
  },
  {
    text: "你能在保持原则的同时与人友好相处。",
    trait: "agreeableness",
    direction: 1,
  },
];

const options = [
  { label: "非常不符合", value: 1 },
  { label: "不太符合", value: 2 },
  { label: "一般", value: 3 },
  { label: "比较符合", value: 4 },
  { label: "非常符合", value: 5 },
];

const traitMeta = {
  extroversion: { name: "外向", color: "#60a5fa" },
  conscientiousness: { name: "尽责", color: "#34d399" },
  openness: { name: "开放", color: "#fbbf24" },
  stability: { name: "情绪稳定", color: "#a78bfa" },
  agreeableness: { name: "亲和", color: "#fb7185" },
};

const state = {
  currentIndex: 0,
  answers: Array(questions.length).fill(null),
};

const startBtn = document.getElementById("start-btn");
const quizSection = document.getElementById("quiz");
const introSection = document.getElementById("intro");
const resultSection = document.getElementById("result");
const questionContainer = document.getElementById("question-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const scoreSummary = document.getElementById("score-summary");
const resultText = document.getElementById("result-text");
const restartBtn = document.getElementById("restart-btn");

const showSection = (sectionToShow) => {
  [introSection, quizSection, resultSection].forEach((section) => {
    section.classList.toggle("hidden", section !== sectionToShow);
  });
};

const renderQuestion = () => {
  const question = questions[state.currentIndex];
  const selectedValue = state.answers[state.currentIndex];

  progressText.textContent = `第 ${state.currentIndex + 1} / ${
    questions.length
  } 题`;
  progressFill.style.width = `${((state.currentIndex + 1) / questions.length) *
    100}%`;

  questionContainer.innerHTML = `
    <p class="question">${question.text}</p>
    <div class="options">
      ${options
        .map(
          (option) => `
            <div class="option ${
              selectedValue === option.value ? "selected" : ""
            }" data-value="${option.value}">
              ${option.label}
            </div>
          `
        )
        .join("")}
    </div>
  `;

  prevBtn.disabled = state.currentIndex === 0;
  nextBtn.textContent =
    state.currentIndex === questions.length - 1 ? "提交结果" : "下一题";
  nextBtn.disabled = selectedValue === null;
};

const computeScores = () => {
  const scores = {
    extroversion: 0,
    conscientiousness: 0,
    openness: 0,
    stability: 0,
    agreeableness: 0,
  };

  questions.forEach((question, index) => {
    const answer = state.answers[index];
    const normalized = question.direction === 1 ? answer : 6 - answer;
    scores[question.trait] += normalized;
  });

  const counts = questions.reduce((acc, q) => {
    acc[q.trait] += 1;
    return acc;
  }, {
    extroversion: 0,
    conscientiousness: 0,
    openness: 0,
    stability: 0,
    agreeableness: 0,
  });

  return Object.fromEntries(
    Object.entries(scores).map(([trait, value]) => [
      trait,
      Math.round((value / (counts[trait] * 5)) * 100),
    ])
  );
};

const buildSummary = (scores) => {
  const traits = Object.entries(scores)
    .map(([trait, value]) => ({ trait, value }))
    .sort((a, b) => b.value - a.value);

  const strongest = traits[0];
  const secondary = traits[1];
  const lowest = traits[traits.length - 1];

  const levelLabel = (value) => {
    if (value >= 75) return "高";
    if (value >= 60) return "中高";
    if (value >= 45) return "中等";
    return "偏低";
  };

  const traitDescriptions = {
    extroversion: {
      high: "更容易从互动中获得能量，表达与协作会让你更投入。",
      mid: "在社交与独处之间能较好平衡，场合不同切换自然。",
      low: "更偏好独处或小范围交流，深度思考型环境更舒适。",
    },
    conscientiousness: {
      high: "目标感强、执行稳定，擅长规划、把控节奏。",
      mid: "既能推进计划，也保留一定灵活度。",
      low: "更容易被新鲜想法吸引，建议用清单提升行动聚焦。",
    },
    openness: {
      high: "对新体验开放，创意与探索动机强。",
      mid: "对新事物保持理性兴趣，偏好稳中求新。",
      low: "更注重熟悉与可控，适合需要稳定流程的情境。",
    },
    stability: {
      high: "情绪稳定，在压力下仍能保持节奏。",
      mid: "多数情况下稳定，极端情境可能波动。",
      low: "容易被情绪影响，建议通过休息与复盘稳定状态。",
    },
    agreeableness: {
      high: "同理心强，重视关系与团队氛围。",
      mid: "能在合作与坚持原则之间取得平衡。",
      low: "更看重效率与结果，沟通时注意表达方式。",
    },
  };

  const describeTrait = (trait, value) => {
    const label = levelLabel(value);
    const key = value >= 70 ? "high" : value >= 50 ? "mid" : "low";
    return `「${traitMeta[trait].name}」${label}（${value}%）：${traitDescriptions[trait][key]}`;
  };

  const jobSuggestions = [];
  if (scores.extroversion >= 70) {
    jobSuggestions.push("需要表达与协作的岗位：市场/销售、商务拓展、客户成功、培训讲师。");
  } else if (scores.extroversion <= 40) {
    jobSuggestions.push("偏深度专注的岗位：研发/数据分析、设计、写作、研究类工作。");
  }
  if (scores.conscientiousness >= 70) {
    jobSuggestions.push("结构化与执行导向岗位：项目管理、运营管理、财务/审计、质量管理。");
  }
  if (scores.openness >= 70) {
    jobSuggestions.push("创新与探索导向岗位：产品经理、内容策划、交互/视觉设计、研发。");
  }
  if (scores.stability >= 70) {
    jobSuggestions.push("节奏稳定型岗位：运营支持、客户服务、现场支持、团队管理。");
  }
  if (scores.agreeableness >= 70) {
    jobSuggestions.push("关系与支持导向岗位：教育培训、人力资源、咨询、社区运营。");
  }
  if (jobSuggestions.length === 0) {
    jobSuggestions.push("你的特质较均衡，可根据兴趣选择岗位，并用优势维度补足短板。");
  }

  const focusTips = [];
  if (lowest.trait === "stability") {
    focusTips.push("高压时期留出恢复空间，通过运动或记录情绪稳定节奏。");
  }
  if (lowest.trait === "extroversion") {
    focusTips.push("选择小范围交流建立连接感，避免过度社交消耗。");
  }
  if (lowest.trait === "conscientiousness") {
    focusTips.push("用清单或时间块管理提升执行力。");
  }
  if (lowest.trait === "openness") {
    focusTips.push("适度尝试新内容，提升适应变化的弹性。");
  }
  if (lowest.trait === "agreeableness") {
    focusTips.push("沟通时多表达意图与边界，减少误解。");
  }

  return `
    <p>你最突出的特质是「${traitMeta[strongest.trait].name}」（${strongest.value}%），其次是「${traitMeta[secondary.trait].name}」（${secondary.value}%）。</p>
    <div class="result-section">
      <h3>核心特质解读</h3>
      <ul>
        <li>${describeTrait("extroversion", scores.extroversion)}</li>
        <li>${describeTrait("conscientiousness", scores.conscientiousness)}</li>
        <li>${describeTrait("openness", scores.openness)}</li>
        <li>${describeTrait("stability", scores.stability)}</li>
        <li>${describeTrait("agreeableness", scores.agreeableness)}</li>
      </ul>
    </div>
    <div class="result-section">
      <h3>优势与关注点</h3>
      <ul>
        <li>优势方向：${traitMeta[strongest.trait].name}带来明显支撑。</li>
        <li>潜在关注：${traitMeta[lowest.trait].name}相对较低。</li>
        ${focusTips.map((tip) => `<li>${tip}</li>`).join("")}
      </ul>
    </div>
    <div class="result-section">
      <h3>可能更适合的工作环境</h3>
      <ul>
        ${jobSuggestions.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </div>
    <p class="result-note">说明：该结果用于自我了解，并非专业心理评估。</p>
  `;
};

const renderResult = () => {
  const scores = computeScores();
  scoreSummary.innerHTML = "";

  Object.entries(scores).forEach(([trait, value]) => {
    const item = document.createElement("div");
    item.className = "score-item";
    item.innerHTML = `
      <span>${traitMeta[trait].name}</span>
      <div class="score-bar">
        <div class="score-fill" style="width: ${value}%; background: ${
      traitMeta[trait].color
    }"></div>
      </div>
      <strong>${value}%</strong>
    `;
    scoreSummary.appendChild(item);
  });

  resultText.innerHTML = buildSummary(scores);
};

startBtn.addEventListener("click", () => {
  state.currentIndex = 0;
  state.answers = Array(questions.length).fill(null);
  showSection(quizSection);
  renderQuestion();
});

questionContainer.addEventListener("click", (event) => {
  const option = event.target.closest(".option");
  if (!option) return;

  const value = Number(option.dataset.value);
  state.answers[state.currentIndex] = value;
  renderQuestion();
});

prevBtn.addEventListener("click", () => {
  if (state.currentIndex === 0) return;
  state.currentIndex -= 1;
  renderQuestion();
});

nextBtn.addEventListener("click", () => {
  if (state.answers[state.currentIndex] === null) return;

  if (state.currentIndex === questions.length - 1) {
    renderResult();
    showSection(resultSection);
    return;
  }

  state.currentIndex += 1;
  renderQuestion();
});

restartBtn.addEventListener("click", () => {
  showSection(introSection);
});
