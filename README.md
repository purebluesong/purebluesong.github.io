# purebluesong.github.io

瑞鹏（purebluesong）的个人博客，基于 [Astro](https://astro.build/) 静态站点，托管于 GitHub Pages。

**Site:** https://purebluesong.github.io

## Commands

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Install dependencies                         |
| `npm run dev`     | Start local dev server at `localhost:4321`   |
| `npm run build`   | Build production site to `./dist/`           |
| `npm run preview` | Preview the production build locally         |

## Content

Write posts as Markdown/MDX under `src/content/blog/`. Site config lives in `astro.config.mjs` (`site` / `base` for GitHub Pages user site).

Deploy is handled by `.github/workflows/deploy.yml` on pushes to `main`.
