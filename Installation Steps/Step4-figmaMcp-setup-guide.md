# Codex + Figma MCP 安装步骤

适用：**macOS**

## 1）安装 Codex

优先用 Homebrew：

```bash
brew install --cask codex
```

如果你不用 Homebrew，也可以用 npm：

```bash
npm install -g @openai/codex
```

如果 npm 安装时报 `EACCES`，执行下面这组修复命令后再重装：

```bash
mkdir -p ~/.npm-global
npm config set prefix ~/.npm-global
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.zprofile
source ~/.zprofile
npm install -g @openai/codex
```

---

## 2）登录 Codex

```bash
codex --login
```

浏览器会打开登录页，按提示登录 ChatGPT。

---

## 3）接入 Figma MCP

```bash
codex mcp add figma --url https://mcp.figma.com/mcp
codex mcp list
```

如果列表里出现 `figma`，说明接入成功。

---

## 4）开始使用

先启动 Codex：

```bash
codex
```

然后把 Figma 链接贴进去，例如：

```text
请根据这个 Figma 页面帮我生成 React + Tailwind 代码：
<粘贴 Figma 链接>
```

---

## 最短流程

只想直接照做，就按这个顺序执行：

```bash
brew install --cask codex
codex --login
codex mcp add figma --url https://mcp.figma.com/mcp
codex
```
