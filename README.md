# purebluesong.github.io

purebluesong 的个人站点，基于 [Astro](https://astro.build/) 静态构建，托管于 GitHub Pages。

**Site:** https://purebluesong.github.io

## 四个分区

| 分区 | 路径 | 内容目录 |
| :-- | :-- | :-- |
| 个人思考 | `/thoughts/` | `src/content/thoughts/` |
| 信息整合 | `/hub/` | `src/content/hub/`（可按主题分子目录） |
| 个人作品展示 | `/works/` | `src/content/works/` |
| 个人信息 | `/about/` | 构建时读取 GitHub 公开资料（不含私人邮箱） |

旧路径 `/blog/` 会重定向到 `/thoughts/`。

## Commands

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Install dependencies                         |
| `npm run dev`     | Start local dev server at `localhost:4321`   |
| `npm run build`   | Build production site to `./dist/`           |
| `npm run preview` | Preview the production build locally         |

Deploy is handled by `.github/workflows/deploy.yml` on pushes to `main`.
