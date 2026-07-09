# AI产品经理学习中心

这是一个个人学习网站，用来沉淀 AI 产品经理学习过程中的笔记、AI实操、训练营内容、真实项目和英语词汇。

## 网站结构

- `index.html`：首页看板，只展示五个核心入口。
- `style.css`：全站视觉样式。
- `app.js`：首页读取内容数量。
- `sections/`：五个板块的列表页。
- `notes/`：每日学习笔记。
- `ai-practice/`：AI工具、提示词和实操记录。
- `learning-camp/`：训练营课程和任务。
- `projects/`：真实工作项目。
- `english/`：每日英语词汇。
- `scripts/`：自动生成内容目录的脚本。
- `.github/workflows/`：GitHub Actions 自动流程。

## 以后怎么更新内容

新增内容时，把 HTML 文件上传到对应文件夹：

- 学习笔记：`notes/day02.html`
- AI实操：`ai-practice/chatgpt-prompt.html`
- Learning Camp：`learning-camp/camp02.html`
- 工作项目：`projects/project02.html`
- 今日英语：`english/day02.html`

上传后，GitHub Actions 会自动生成 `data/content.json`，对应板块的列表页会自动更新。

## 以后怎么改网站

- 改首页结构：修改 `index.html`
- 改网站风格：修改 `style.css`
- 改板块列表页：修改 `sections/` 里的文件
- 改自动目录规则：修改 `scripts/generate-content-list.js`
- 改自动运行条件：修改 `.github/workflows/generate-content-list.yml`
