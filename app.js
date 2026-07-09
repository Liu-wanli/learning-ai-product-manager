const sections = [
  {
    id: "notes",
    title: "每日学习笔记",
    description: "记录每天的课程、复盘、问题和收获。",
    href: "sections/notes.html",
    icon: "N",
    featured: true
  },
  {
    id: "ai-practice",
    title: "AI实操",
    description: "保存AI工具入口、提示词、操作流程和实操结果。",
    href: "sections/ai-practice.html",
    icon: "A"
  },
  {
    id: "learning-camp",
    title: "Learning Camp",
    description: "整理训练营课程、阶段任务和学习资料。",
    href: "sections/learning-camp.html",
    icon: "L"
  },
  {
    id: "projects",
    title: "工作项目",
    description: "记录真实项目资料、方案、进展和复盘。",
    href: "sections/projects.html",
    icon: "P"
  },
  {
    id: "english",
    title: "今日英语",
    description: "汇总每天学到的英文单词、中文解释和使用场景。",
    href: "sections/english.html",
    icon: "E"
  }
];

async function loadContent() {
  try {
    const response = await fetch("data/content.json", { cache: "no-store" });
    if (!response.ok) throw new Error("content data not found");
    return await response.json();
  } catch {
    return {};
  }
}

function renderDashboard(content) {
  const dashboard = document.querySelector("#section-dashboard");
  if (!dashboard) return;

  dashboard.innerHTML = sections.map((section) => {
    const count = content[section.id]?.length || 0;
    return `
      <a class="module-card ${section.featured ? "featured" : ""}" href="${section.href}">
        <div class="module-icon">${section.icon}</div>
        <h2>${section.title}</h2>
        <p>${section.description}</p>
        <div class="module-meta">
          <span>${count} 条内容</span>
          <span>进入板块</span>
        </div>
      </a>
    `;
  }).join("");
}

loadContent().then(renderDashboard);
