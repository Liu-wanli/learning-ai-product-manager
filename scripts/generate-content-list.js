const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const outputFile = path.join(rootDir, "data", "content.json");

const sections = [
  { id: "notes", dir: "notes" },
  { id: "ai-practice", dir: "ai-practice" },
  { id: "learning-camp", dir: "learning-camp" },
  { id: "projects", dir: "projects" },
  { id: "english", dir: "english" }
];

function cleanText(value) {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function readMeta(html, fileName) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const description = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["'][^>]*>/i);
  const day = fileName.match(/day\s*0*(\d+)/i);

  return {
    title: cleanText(h1?.[1] || title?.[1] || fileName.replace(/\.html$/i, "")),
    description: cleanText(description?.[1] || "点击查看正文。"),
    date: day ? `Day${String(day[1]).padStart(2, "0")}` : ""
  };
}

function sortFiles(a, b) {
  const aDay = a.match(/day\s*0*(\d+)/i);
  const bDay = b.match(/day\s*0*(\d+)/i);
  if (aDay && bDay) return Number(aDay[1]) - Number(bDay[1]);
  if (aDay) return -1;
  if (bDay) return 1;
  return a.localeCompare(b, "zh-CN");
}

const content = {};

for (const section of sections) {
  const sectionDir = path.join(rootDir, section.dir);

  if (!fs.existsSync(sectionDir)) {
    content[section.id] = [];
    continue;
  }

  content[section.id] = fs
    .readdirSync(sectionDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => entry.name)
    .sort(sortFiles)
    .map((fileName) => {
      const filePath = path.join(sectionDir, fileName);
      const html = fs.readFileSync(filePath, "utf8");
      const meta = readMeta(html, fileName);

      return {
        ...meta,
        url: `${section.dir}/${fileName}`
      };
    });
}

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, `${JSON.stringify(content, null, 2)}\n`, "utf8");
console.log(`Generated data/content.json`);
