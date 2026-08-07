# Zilong Huang Academic Portfolio

一个使用 Vite、React 与 TypeScript 构建的静态学术个人主页。页面内容由 Markdown 驱动，可直接部署到 GitHub Pages，不依赖服务端。

## 本地开发

```bash
npm install
npm run dev
```

提交前运行完整检查：

```bash
npm run check
```

## 内容维护

内容与页面组件已经分离：

- `src/content/profile/about.md`：姓名、简介、学校、社交链接、动态与经历
- `src/content/publications/*.md`：每篇论文一份文件
- `src/content/projects/*.md`：每个项目一份文件
- `src/content/blogs/*.md`：每篇博客一份文件，frontmatter 用于主页索引，正文按需加载
- `src/content/interests/*.md`：每个兴趣分类一份文件，分类内可维护任意数量的图片条目
- `src/assets/interests/`：由 Vite 打包的本地兴趣图片
- `public/assets/`：论文、项目、头像与学校标识等静态资源

新增内容时复制同目录下任意 Markdown 文件并修改 frontmatter。文件名会自动成为稳定的内容标识，不需要修改 React 组件。

项目卡片中的 `stars` 是构建时使用的静态快照。需要更新时直接修改对应 Markdown 文件中的数值。这样不会受到 GitHub 公共 API 限流影响，离线访问也能保持完整。

个人资料已经包含腾讯混元 3D 实习经历。工作或教育经历都在 `src/content/profile/about.md` 的 `affiliations` 数组中维护，Logo 放在 `public/assets/brand/`。

兴趣画廊中的每个分类包含 `duration` 和 `items`：

- `duration` 控制一轮自动滚动所需的秒数
- `items` 中的每一项包含名称、简短说明、图片 URL、替代文本与可选来源链接
- 远程图片可直接填写 `image: "https://..."`；本地图片放入 `src/assets/interests/` 后，填写相对于该目录的 `image: "local:kpop/example.webp"`
- 增删条目后画廊会自动调整长度，不需要修改组件
- 页面只展示兴趣图片，不渲染分类或单项跳转；分类与条目的来源链接可选，仅作为 Markdown 元数据保留
- 鼠标悬停时滚动会暂停；系统启用“减少动态效果”时会改为手动横向滚动

## 博客写作

在 `src/content/blogs/` 中新增一个小写 kebab-case 命名的 Markdown 文件，例如 `my-first-note.md`：

```md
---
title: "My First Note"
summary: "A concise description shown on the home page."
date: "2026-08-07"
category: "Research Notes"
tags: ["3D Vision", "Tools"]
cover: "./assets/blog/my-cover.webp" # 可选
coverAlt: "Description of the cover" # 使用封面时建议填写
featured: true # 可选，首页以横向大卡片展示
updated: "2026-08-08" # 可选，文章更新日期
draft: false # 可选，设为 true 时不会发布
---

Markdown content starts here.
```

- 不填写 `cover` 时，页面会根据文件名自动绘制一张与主页风格一致的几何 SVG 封面
- 博客图片、封面或自行编写的示意 SVG 可以放在 `public/assets/blog/`，Markdown 中使用 `/assets/blog/example.svg`
- 支持标题目录、稳定锚点、外部链接、图片说明、引用、列表、任务列表、表格、脚注、代码高亮、代码复制与 KaTeX 数学公式
- 阅读时间会在构建时根据中英文内容自动估算，不需要手动维护
- 正文和 Markdown 渲染器会拆分到独立资源，打开主页时只加载轻量元数据
- 每篇文章会在构建时生成 `/blog/<文件名>/index.html`，可在 GitHub Pages 中直接打开或刷新
- 主页 Blog 模块按 `date` 从新到旧排列；设置 `draft: true` 的文章不会出现在主页、静态路径或站点地图中
- 设置 `featured: true` 的文章会横跨两列展示；其他文章会自动组成更紧凑的双列卡片

## GitHub Pages

仓库包含 `.github/workflows/deploy.yml`。在 GitHub 仓库设置中将 Pages 的 Source 设为 `GitHub Actions`，之后推送到 `main` 即可触发构建与发布。

当前仓库是用户主页仓库 `LongHZ140516.github.io`，因此 Vite 的 `base` 设置为 `/`，发布地址为 `https://longhz140516.github.io/`。博客文章由构建过程生成真实静态目录，不依赖服务端路由重写；刷新文章地址和主页锚点都可直接工作。
