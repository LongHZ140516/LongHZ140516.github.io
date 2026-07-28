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
- `src/content/interests/*.md`：每个兴趣分类一份文件，分类内可维护任意数量的图片条目
- `public/assets/`：论文、项目、头像与学校标识等静态资源

新增内容时复制同目录下任意 Markdown 文件并修改 frontmatter。文件名会自动成为稳定的内容标识，不需要修改 React 组件。

项目卡片中的 `stars` 是构建时使用的静态快照。需要更新时直接修改对应 Markdown 文件中的数值。这样不会受到 GitHub 公共 API 限流影响，离线访问也能保持完整。

个人资料已经包含腾讯混元 3D 实习经历。工作或教育经历都在 `src/content/profile/about.md` 的 `affiliations` 数组中维护，Logo 放在 `public/assets/brand/`。

兴趣画廊中的每个分类包含 `duration` 和 `items`：

- `duration` 控制一轮自动滚动所需的秒数
- `items` 中的每一项包含名称、简短说明、图片 URL、替代文本与可选来源链接
- 增删条目后画廊会自动调整长度，不需要修改组件
- 页面只展示兴趣图片，不渲染分类或单项跳转；来源链接仅作为 Markdown 元数据保留
- 鼠标悬停时滚动会暂停；系统启用“减少动态效果”时会改为手动横向滚动

## GitHub Pages

仓库包含 `.github/workflows/deploy.yml`。在 GitHub 仓库设置中将 Pages 的 Source 设为 `GitHub Actions`，之后推送到 `main` 即可触发构建与发布。

Vite 的 `base` 使用相对路径，因此也可部署到其他静态托管平台。当前站点没有前端路由，刷新和深链接不会依赖服务端重写。
