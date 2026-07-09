async function loadSectionContent() {
  const list = document.querySelector("[data-section]");
  if (!list) return;

  const sectionId = list.dataset.section;

  try {
    const response = await fetch("../data/content.json", { cache: "no-store" });
    if (!response.ok) throw new Error("content data not found");
    const content = await response.json();
    const items = content[sectionId] || [];

    if (items.length === 0) {
      list.innerHTML = '<article class="content-card empty">这个板块还没有内容。</article>';
      return;
    }

    list.innerHTML = items.map((item) => `
      <a class="content-card" href="../${item.url}">
        <span class="date">${item.date || "未设置日期"}</span>
        <h2>${item.title}</h2>
        <p>${item.description || "点击查看正文。"}</p>
      </a>
    `).join("");
  } catch {
    list.innerHTML = '<article class="content-card empty">目录还没有生成，等 Actions 运行完成后再刷新。</article>';
  }
}

loadSectionContent();
