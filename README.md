# Figma AI Design Workflow

`figma-ai-design-workflow` 是一个围绕 Figma 设计协作、AI 工具接入、技能组合配置和前端落地整理的工作流仓库。

仓库当前包含三类内容：

- 一套从 macOS 环境准备到站点部署的完整操作文档
- 一个用于验证设计还原与动画实现的前端示例项目 `DesignBloom`
- 一个最小化的 TypeScript 根项目，用来承载基础脚手架与 CI 构建检查

## 这个仓库适合谁

- 想从零搭建 macOS + AI 设计开发环境的人
- 想把 Codex / Claude / Figma MCP 串起来做设计到代码协作的人
- 想整理 UI 设计师和前端动效工程师协作流程的人
- 想保留技能包、安装步骤和示例项目作为团队内部 SOP 的人

## 推荐阅读顺序

建议按 `Installation Steps` 里的 5 个步骤顺序阅读和执行：

1. [Step1-macos-terminal-setup-guide.md](./Installation%20Steps/Step1-macos-terminal-setup-guide.md)
   配置 Hyper、Homebrew、Oh My Zsh、Node.js、Python、Git 等 macOS 基础环境。
2. [Step2-macos-ai-tool-installation-guide.md](./Installation%20Steps/Step2-macos-ai-tool-installation-guide.md)
   安装 Codex 与 Claude Code，并完成 Claude Code 的智谱接入。
3. [Step3-skillsmp-team-setup-guide.md](./Installation%20Steps/Step3-skillsmp-team-setup-guide.md)
   规划双人团队协作模型，并整理 UI 设计与前端动画方向的技能组合。
4. [Step4-figmaMcp-setup-guide.md](./Installation%20Steps/Step4-figmaMcp-setup-guide.md)
   安装 Codex CLI、登录，并接入 Figma MCP 供设计上下文读取使用。
5. [Step5-site-deployment-guide.md](./Installation%20Steps/Step5-site-deployment-guide.md)
   将静态站点通过阿里云域名 + 七牛云 Kodo/CDN 的方式上线。

补充说明：

- [Remark1-github-ssh-setup.md](./Installation%20Steps/Remark/Remark1-github-ssh-setup.md)
  用命令生成 SSH key、连接 GitHub，并把已有仓库 remote 改成 SSH。

## 仓库结构

```text
.
├── Installation Steps/    # 5 步工作流文档 + GitHub SSH 补充说明
├── Skills Manage/         # 按设计、前端、动画分类保存的技能包压缩文件
├── DesignBloom/           # 基于 Figma 设计稿重建的 React + Vite 示例项目
├── src/                   # 根目录最小 TypeScript 示例入口
├── .github/workflows/     # CI 配置
└── README.md
```

## 目录说明

### `Installation Steps`

这是仓库的核心内容，定位是可复用的 SOP 文档库。

- `Step1` 解决 macOS 基础开发环境问题
- `Step2` 解决 AI 工具安装与账号接入问题
- `Step3` 解决团队角色与技能组合问题
- `Step4` 解决 Codex CLI 与 Figma MCP 联动问题
- `Step5` 解决静态站点部署问题

### `Skills Manage`

这个目录保存了不同方向的技能包归档，当前分为：

- `skills-design`
- `skills-frontend`
- `skills-animation`

适合做团队内部技能清单、备份或后续二次整理。

### `DesignBloom`

`DesignBloom` 是仓库里的前端示例项目，用于展示 Figma 设计稿落地为网页的结果。

当前特征：

- 技术栈：React + Vite
- 动效能力：GSAP + ScrollTrigger
- 字体依赖：`@fontsource/archivo`、`@fontsource/space-mono`
- 目标：验证深色品牌首页、视觉层级和轻量交互的实现方式

### 根目录 TypeScript 项目

根目录不是完整业务应用，而是一个最小化脚手架。

- 入口文件为 `src/index.ts`
- 当前逻辑会检测 `FIGMA_ACCESS_TOKEN` 和 `GITHUB_TOKEN` 是否存在
- 主要价值是提供一个可构建、可跑通的基础项目和 CI 检查目标

## 快速开始

### 1. 阅读并执行环境搭建

先从 `Installation Steps` 开始，按 1 到 5 的顺序执行。

### 2. 运行根目录脚手架

```bash
npm install
npm run dev
```

可用命令：

- `npm run dev`：使用 `tsx` 运行 `src/index.ts`
- `npm run build`：执行 TypeScript 编译
- `npm start`：运行编译后的 `dist/index.js`

### 3. 运行 DesignBloom 示例

```bash
cd DesignBloom
npm install
npm run dev
```

如果要生成发布产物：

```bash
npm run build
npm run preview
```

## 环境变量

根目录脚手架目前会读取以下变量：

- `FIGMA_ACCESS_TOKEN`
- `GITHUB_TOKEN`

它们目前主要用于检查配置状态，不代表仓库所有文档步骤都依赖这两个变量。

## CI

仓库包含一个 GitHub Actions 工作流：

- 触发时机：`push` 到 `main`，或任意 `pull_request`
- 当前行为：安装根目录依赖并执行 `npm run build`

注意：当前 CI 校验的是根目录 TypeScript 项目，不包含 `DesignBloom` 子项目的构建。

## 项目定位总结

如果把这个仓库看成一个整体，它更接近一个“设计到开发协作手册 + 示例工程 + 技能包归档”的组合仓库，而不是单一业务应用。

最适合的使用方式是：

1. 用 `Installation Steps` 搭环境和流程
2. 用 `Skills Manage` 维护团队技能资产
3. 用 `DesignBloom` 验证 Figma 到前端实现的效果
4. 用根目录项目和 CI 保持仓库具备基本工程化能力
