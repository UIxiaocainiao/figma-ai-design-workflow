# Figma AI Design Workflow

一个围绕 Figma、AI 设计协作、前端实现验证和团队 SOP 沉淀整理的工作区仓库。

这个仓库不是单一业务应用，而是由 4 类内容组成：

- 环境搭建与协作流程文档
- Figma 到前端的示例项目
- 设计与技能资源归档
- 一个最小化的 TypeScript 根项目，用于基础工程化验证

## 适用场景

- 从零搭建 macOS + AI 设计开发环境
- 串联 Codex、Claude Code、Figma MCP 等工具形成设计到代码流程
- 为 UI 设计师和前端工程师沉淀团队内部 SOP
- 保存技能包、设计参考、示例工程和部署文档，作为长期工作台

## 仓库概览

| 路径 | 说明 |
| --- | --- |
| [`Installation Steps/`](./Installation%20Steps) | 从终端环境、AI 工具、团队技能配置到 Figma MCP 和站点部署的完整操作文档 |
| [`DesignBloom/`](./DesignBloom) | 示例项目，包含 `apps/web` 前端与 `apps/api` 后端骨架，用于验证设计还原和页面实现 |
| [`figma/`](./figma) | 仓库内 Figma 设计产物说明、设计来源和迭代记录 |
| [`awesome-design-md/`](./awesome-design-md) | DESIGN.md 设计参考集合，可作为 AI 生成页面时的视觉规范输入 |
| [`skills/`](./skills) | 技能包归档与技能目录集合，包含设计、前端、动画方向素材 |
| [`src/`](./src) | 根目录最小 TypeScript 入口，用于基础环境和 CI 构建检查 |
| [`.github/workflows/`](./.github/workflows) | GitHub Actions 配置，目前只校验根目录 TypeScript 项目构建 |

## 推荐阅读顺序

如果你第一次进入这个仓库，建议按下面顺序阅读：

1. [`Installation Steps/Step1-macos-terminal-setup-guide.md`](./Installation%20Steps/Step1-macos-terminal-setup-guide.md)
   配置终端、Homebrew、Zsh、Node.js、Python 和 Git 等基础环境。
2. [`Installation Steps/Step2-macos-ai-tool-installation-guide.md`](./Installation%20Steps/Step2-macos-ai-tool-installation-guide.md)
   安装 Codex 与 Claude Code，并整理 AI 工具接入方式。
3. [`Installation Steps/Step3-skillsmp-team-setup-guide.md`](./Installation%20Steps/Step3-skillsmp-team-setup-guide.md)
   确定双人团队协作模型以及 UI / 前端动画方向的技能组合。
4. [`Installation Steps/Step4-figmaMcp-setup-guide.md`](./Installation%20Steps/Step4-figmaMcp-setup-guide.md)
   接入 Codex CLI 与 Figma MCP，打通设计上下文读取链路。
5. [`Installation Steps/Step5-site-deployment-guide.md`](./Installation%20Steps/Step5-site-deployment-guide.md)
   了解静态站点部署到七牛云的实际流程。

补充文档：

- [`Installation Steps/Remark/Remark1-github-ssh-setup.md`](./Installation%20Steps/Remark/Remark1-github-ssh-setup.md)：GitHub SSH 配置说明

## 快速开始

### 前置要求

- Node.js 18+
- npm
- macOS 环境下的终端与开发工具链

### 运行根目录最小项目

根目录项目用于基础验证，不是完整业务应用。

```bash
npm install
npm run dev
```

可用命令：

- `npm run dev`：使用 `tsx` 运行 [`src/index.ts`](./src/index.ts)
- `npm run build`：执行 TypeScript 编译
- `npm start`：运行编译后的 `dist/index.js`

### 运行 DesignBloom 示例项目

`DesignBloom` 是仓库中最接近真实产品页面的部分。

```bash
cd DesignBloom
npm install
npm run dev:web
```

如果需要同时启动后端骨架：

```bash
npm run dev:api
```

常用命令：

- `npm run dev:web`：启动 React + Vite 前端
- `npm run dev:api`：启动 Node.js API 服务
- `npm run build:web`：构建前端产物
- `npm run deploy`：构建前端并执行 `scripts/deploy-qiniu.cjs`

## 工作流组成

### 1. 安装与协作 SOP

[`Installation Steps/`](./Installation%20Steps) 是整个仓库的核心入口，覆盖以下主题：

- macOS 开发环境初始化
- Codex / Claude Code 等 AI 工具安装
- 团队技能配置与角色分工
- Figma MCP 接入
- 静态站点部署流程

如果你的目标是复用这套流程，而不是直接运行代码，优先阅读这一部分。

### 2. 设计到代码示例工程

[`DesignBloom/`](./DesignBloom) 用来验证设计稿落地效果，目前已拆成前后端分层结构：

- `apps/web`：React + Vite 前端页面
- `apps/api`：Node.js 后端服务骨架
- `docs/architecture.md`：项目结构说明
- `scripts/deploy-qiniu.cjs`：站点部署脚本

相关文档：

- [`DesignBloom/README.md`](./DesignBloom/README.md)
- [`DesignBloom/docs/architecture.md`](./DesignBloom/docs/architecture.md)

### 3. Figma 交付与设计演进记录

[`figma/`](./figma) 用于记录仓库内 Figma 文件的来源、参考规范和设计迭代。

当前已整理内容：

- [`figma/designbloom-spotify-refresh/README.md`](./figma/designbloom-spotify-refresh/README.md)：基于 Spotify 风格对 DesignBloom 首页进行刷新设计的说明

### 4. 设计规范与技能资源

除了示例工程，仓库还保留了两类便于复用的素材：

- [`awesome-design-md/`](./awesome-design-md)：收录多套 `DESIGN.md` 设计风格参考
- [`skills/`](./skills)：整理设计、前端、动画方向技能包，同时保留一个技能索引集合 `skills/awesome-openclaw-skills/`

这两部分更像“资产库”，不是直接运行的应用代码。

## 环境变量

根目录最小项目当前只读取两个环境变量：

```bash
FIGMA_ACCESS_TOKEN=
GITHUB_TOKEN=
```

示例文件见 [`.env.example`](./.env.example)。

它们目前用于检查配置状态，不代表整个仓库的所有流程都仅依赖这两个变量。

## CI

仓库包含一个 GitHub Actions 工作流 [`ci.yml`](./.github/workflows/ci.yml)。

当前行为：

- 在 `push` 到 `main` 时触发
- 在 `pull_request` 时触发
- 安装根目录依赖
- 执行 `npm run build`

需要注意：

- 当前 CI 只覆盖根目录 TypeScript 项目
- `DesignBloom` 子项目目前不在根目录 CI 的构建范围内

## 当前边界与说明

- 根目录 [`src/index.ts`](./src/index.ts) 只是最小化启动入口，当前只输出项目就绪状态和环境变量配置结果。
- 真正的示例产品代码位于 [`DesignBloom/`](./DesignBloom)。
- 仓库顶层存在 `deploy` 脚本定义，但实际部署脚本位于 `DesignBloom/scripts/deploy-qiniu.cjs`；如果你要部署页面，应优先参考 `DesignBloom` 子项目和部署文档。
- `skills/awesome-openclaw-skills/` 内含独立上游仓库内容与 `.git` 目录，使用时更适合视作本地归档资源，而不是当前根仓库的核心代码模块。

## 你可以如何使用这个仓库

### 作为团队 SOP 仓库

从 `Installation Steps` 开始，按步骤搭建环境、配置工具并沉淀协作流程。

### 作为设计到代码实验台

在 `figma/` 记录设计来源，在 `DesignBloom/` 验证页面实现，并结合 `awesome-design-md/` 调整视觉方向。

### 作为技能与参考资料库

把 `skills/` 和 `awesome-design-md/` 当作长期维护的设计与工程素材集合。

## License

仓库中包含多个不同来源的子目录与资源集合。使用前请分别查看对应目录内的许可证与说明文件。
