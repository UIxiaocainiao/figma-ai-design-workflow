# figma-ai-design-workflow

`figma-ai-design-workflow` 是一个围绕 Figma 自动化设计、AI 工具协作和前端实现流程整理的项目仓库。当前仓库除了基础的 TypeScript 项目骨架外，也同步维护完整的安装与配置步骤文档，方便从零开始搭建环境。

## 安装与配置总览

整个流程一共规划为 5 步，目前已经整理完成前 3 步：

1. **Step 1: macOS 终端与开发环境准备**  
   先完成 Hyper 终端、Homebrew、Oh My Zsh、powerlevel10k、常用 zsh 插件，以及 Node.js、Python、Git / SSH 的基础配置。  
   详细文档：`Installation Steps/Step1-macos-terminal-setup-guide.md`

2. **Step 2: AI 工具安装**  
   安装 Codex 桌面端，并在 macOS 上安装 Claude Code，完成智谱脚本配置和基础可用性验证。  
   详细文档：`Installation Steps/Step2-macos-ai-tool-installation-guide.md`

3. **Step 3: SkillsMP 团队与技能组合配置**  
   规划 UI 设计师与前端动画工程师的双人协作角色，并整理推荐技能组合，包括 `ui-designer`、`ui-ux-designer`、`mcp-figma-desktop`、`frontend-design`、`web-animation`、`gsap` 和 `interaction-animator`。  
   详细文档：`Installation Steps/Step3-skillsmp-team-setup-guide.md`

4. **Step 4: figmaMCP 设置**  
   待更新。

5. **Step 5: 七牛云和阿里云配置说明**  
   待更新。

## 当前文档状态

- `Installation Steps/` 目录中已经有第 1 步到第 3 步的现有说明文档。
- 整体计划一共 5 步。
- 目前还剩第 4 步 `figmaMCP` 设置，以及第 5 步七牛云和阿里云配置说明待更新。

## 本地开发

```bash
npm install
npm run dev
```

可用命令：

- `npm run dev`：使用 `tsx` 直接运行入口文件
- `npm run build`：将 TypeScript 编译到 `dist`
- `npm start`：运行编译后的产物

## 环境变量

需要接入真实服务时，可将 `.env.example` 复制为 `.env` 后再填写凭据。

## GitHub

仓库已配置基础 GitHub Actions，会在 push 和 pull request 时执行依赖安装与 TypeScript 构建检查。
