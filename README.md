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
- `src/content/interests/*.md`：每项兴趣一份文件，图片可以使用公开 URL
- `public/assets/`：论文、项目、头像与学校标识等静态资源

新增内容时复制同目录下任意 Markdown 文件并修改 frontmatter。文件名会自动成为稳定的内容标识，不需要修改 React 组件。

项目卡片中的 `stars` 是构建时使用的静态快照。需要更新时直接修改对应 Markdown 文件中的数值。这样不会受到 GitHub 公共 API 限流影响，离线访问也能保持完整。

目前提供的资料中没有实习公司信息，因此页面没有虚构经历。`src/content/profile/about.md` 内已经保留一段注释模板，补充公司名称、职位和时间后会自动出现在 Affiliations 区域。

## GitHub Pages

仓库包含 `.github/workflows/deploy.yml`。在 GitHub 仓库设置中将 Pages 的 Source 设为 `GitHub Actions`，之后推送到 `main` 即可触发构建与发布。

Vite 的 `base` 使用相对路径，因此也可部署到其他静态托管平台。当前站点没有前端路由，刷新和深链接不会依赖服务端重写。
