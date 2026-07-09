const sections = [
  {
    id: "notes",
    title: "每日学习笔记",
    description: "记录每天的学习内容、英语词汇、AI练习和今日任务。",
    href: "sections/notes.html",
    icon: "book",
    label: "学习主线",
    featured: true,
    tone: "cyan"
  },
  {
    id: "projects",
    title: "工作项目",
    description: "沉淀真实项目、产品方案、课程方案、活动流程和复盘。",
    href: "sections/projects.html",
    icon: "layers",
    label: "项目沉淀",
    tone: "violet"
  },
  {
    id: "ai-practice",
    title: "AI实操库",
    description: "保存可复用的 Prompt、AI工具用法和工作提效模板。",
    href: "sections/ai-practice.html",
    icon: "spark",
    label: "AI工作流",
    tone: "blue"
  }
];

const themes = ["theme-blue", "theme-purple", "theme-cyan", "theme-gold", "theme-slate"];

const icons = {
  book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5z"/><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20"/></svg>',
  spark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>',
  layers: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l9 5-9 5-9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 16l9 5 9-5"/></svg>'
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

  dashboard.innerHTML = sections.map((section, index) => {
    const count = content[section.id]?.length || 0;
    const latest = content[section.id]?.[count - 1]?.title || "等待新内容";
    return `
      <a class="module-card reveal ${section.featured ? "featured" : ""} tone-${section.tone}" style="--delay: ${index * 70}ms" href="${section.href}">
        <div class="module-head">
          <span class="module-icon">${icons[section.icon] || ""}</span>
          <span class="module-label">${section.label}</span>
        </div>
        <h3>${section.title}</h3>
        <p>${section.description}</p>
        <div class="latest-line">
          <span>最近更新</span>
          <strong>${latest}</strong>
        </div>
        <div class="module-meta">
          <span>${count} 条内容</span>
          <span>进入</span>
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

function applyTheme(theme) {
  document.body.classList.remove(...themes);
  document.body.classList.add(theme);
  localStorage.setItem("learning-site-theme", theme);
}

function setupThemeToggle() {
  const savedTheme = localStorage.getItem("learning-site-theme") || "theme-blue";
  applyTheme(savedTheme);

  const button = document.querySelector("#theme-toggle");
  if (!button) return;

  button.addEventListener("click", () => {
    const currentTheme = themes.find((theme) => document.body.classList.contains(theme)) || themes[0];
    const nextTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length];
    applyTheme(nextTheme);
  });
}

setupThemeToggle();
loadContent().then(renderDashboard);
