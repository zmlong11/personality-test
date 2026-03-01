const questions = [
  {
    text: "在社交场合中，你通常会主动与陌生人交流。",
    trait: "extroversion",
    direction: 1,
  },
  {
    text: "你喜欢把事情安排得井井有条，再开始行动。",
    trait: "conscientiousness",
    direction: 1,
  },
  {
    text: "你愿意尝试新鲜事物，即便它有些不确定性。",
    trait: "openness",
    direction: 1,
  },
  {
    text: "遇到压力时，你能较快调整并保持冷静。",
    trait: "stability",
    direction: 1,
  },
  {
    text: "长时间独处会让你感到精力下降。",
    trait: "extroversion",
    direction: 1,
  },
  {
    text: "当计划被打乱时，你会感到明显的不适。",
    trait: "conscientiousness",
    direction: -1,
  },
  {
    text: "你常常关注艺术、文化或抽象话题。",
    trait: "openness",
    direction: 1,
  },
  {
    text: "遇到冲突时，你容易被情绪影响。",
    trait: "stability",
    direction: -1,
  },
  {
    text: "在人群中你更容易感到兴奋和投入。",
    trait: "extroversion",
    direction: 1,
  },
  {
    text: "你倾向于在截止时间前提前完成任务。",
    trait: "conscientiousness",
    direction: 1,
  },
];

const options = [
  { label: "非常不符合", value: 1 },
  { label: "不太符合", value: 2 },
  { label: "比较符合", value: 3 },
  { label: "非常符合", value: 4 },
];

const traitMeta = {
  extroversion: { name: "外向", color: "#60a5fa" },
  conscientiousness: { name: "尽责", color: "#34d399" },
  openness: { name: "开放", color: "#fbbf24" },
  stability: { name: "情绪稳定", color: "#a78bfa" },
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
  };

  questions.forEach((question, index) => {
    const answer = state.answers[index];
    const normalized = question.direction === 1 ? answer : 5 - answer;
    scores[question.trait] += normalized;
  });

  const counts = questions.reduce((acc, q) => {
    acc[q.trait] += 1;
    return acc;
  }, { extroversion: 0, conscientiousness: 0, openness: 0, stability: 0 });

  return Object.fromEntries(
    Object.entries(scores).map(([trait, value]) => [
      trait,
      Math.round((value / (counts[trait] * 4)) * 100),
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

  const lines = [
    `你最突出的特质是「${traitMeta[strongest.trait].name}」（${strongest.value}%），说明你在这一维度上表现明显。`,
    `其次是「${traitMeta[secondary.trait].name}」（${secondary.value}%），为你的行为风格提供了稳定支撑。`,
    `相对较低的是「${traitMeta[lowest.trait].name}」（${lowest.value}%），这是你在特定情境下可能需要关注的方向。`,
  ];

  if (strongest.trait === "extroversion") {
    lines.push("你更容易从人与人的互动中获得能量，适合需要协作或表达的环境。");
  }
  if (strongest.trait === "conscientiousness") {
    lines.push("你对目标和流程更在意，擅长规划与执行，适合需要结构化推进的任务。");
  }
  if (strongest.trait === "openness") {
    lines.push("你对新体验保持开放，容易产生创意和灵感，适合探索与创新型的工作。");
  }
  if (strongest.trait === "stability") {
    lines.push("你更容易保持情绪平衡，在压力中也能稳住节奏，是团队中的稳定力量。");
  }

  if (lowest.trait === "stability") {
    lines.push("建议在高压时段留出恢复空间，或通过运动、记录情绪来帮助稳定心态。");
  }
  if (lowest.trait === "extroversion") {
    lines.push("独处能够让你恢复能量，同时也可以选择小范围交流来建立连接感。");
  }
  if (lowest.trait === "conscientiousness") {
    lines.push("可以尝试使用清单或小目标拆分，让行动更聚焦并减少拖延。");
  }
  if (lowest.trait === "openness") {
    lines.push("适度接触新内容或新活动，能帮助你拓展视野并提升适应性。");
  }

  return lines.join(" ");
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

  resultText.textContent = buildSummary(scores);
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
