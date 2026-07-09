const sections = [
  {
    id: "notes",
    title: "每日学习笔记",
    description: "记录每天的课程、复盘、问题和收获。",
    href: "sections/notes.html",
    icon: "book",
    label: "Learning Notes",
    featured: true,
    tone: "cyan"
  },
  {
    id: "ai-practice",
    title: "AI实操",
    description: "保存AI工具入口、提示词、操作流程和实操结果。",
    href: "sections/ai-practice.html",
    icon: "spark",
    label: "AI Practice",
    tone: "blue"
  },
  {
    id: "learning-camp",
    title: "Learning Camp",
    description: "整理训练营课程、阶段任务和学习资料。",
    href: "sections/learning-camp.html",
    icon: "route",
    label: "Camp",
    tone: "violet"
  },
  {
    id: "projects",
    title: "工作项目",
    description: "记录真实项目资料、方案、进展和复盘。",
    href: "sections/projects.html",
    icon: "layers",
    label: "Projects",
    tone: "cyan"
  },
  {
    id: "english",
    title: "今日英语",
    description: "汇总每天学到的英文单词、中文解释和使用场景。",
    href: "sections/english.html",
    icon: "text",
    label: "English",
    tone: "blue"
  }
];

const icons = {
  book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5z"/><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20"/></svg>',
  spark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>',
  route: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M9 6h4a5 5 0 0 1 0 10h-2"/></svg>',
  layers: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l9 5-9 5-9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 16l9 5 9-5"/></svg>',
  text: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7V5h16v2"/><path d="M9 19h6"/><path d="M12 5v14"/></svg>'
};

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

  const total = sections.reduce((sum, section) => sum + (content[section.id]?.length || 0), 0);
  const totalCount = document.querySelector("#total-count");
  if (totalCount) totalCount.textContent = total;

  dashboard.innerHTML = sections.map((section) => {
    const count = content[section.id]?.length || 0;
    const latest = content[section.id]?.[count - 1]?.title || "等待新内容";
    return `
      <a class="module-card reveal ${section.featured ? "featured" : ""} tone-${section.tone}" href="${section.href}">
        <div class="module-head">
          <span class="module-icon">${icons[section.icon] || ""}</span>
          <span class="module-label">${section.label}</span>
        </div>
        <h3>${section.title}</h3>
        <p>${section.description}</p>
        <div class="latest-line">
          <span>Latest</span>
          <strong>${latest}</strong>
        </div>
        <div class="module-meta">
          <span>${count} 条内容</span>
          <span>Open</span>
        </div>
      </a>
    `;
  }).join("");

  setupReveal();
  setupMagneticButtons();
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach((item) => observer.observe(item));
}

function setupMagneticButtons() {
  document.querySelectorAll(".magnetic").forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });
  });
}

loadContent().then(renderDashboard);
