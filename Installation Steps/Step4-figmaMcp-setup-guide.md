# Codex CLI 安装与 Figma MCP 接入教程

> 适用场景：macOS 终端环境（zsh/bash），通过 **Codex CLI** 安装并接入 **Figma Remote MCP Server**。

---

## 1. 你将完成什么

完成本教程后，你可以：

1. 在本地终端安装并运行 **Codex CLI**
2. 使用 ChatGPT 账号或 OpenAI API Key 登录 Codex
3. 把 **Figma MCP** 添加到 Codex
4. 在 Codex 里读取 Figma 设计上下文，并用于实现、分析或生成代码

---

## 2. 前置条件

请先确认你具备以下条件：

- 一台 macOS 电脑
- 已安装 **Node.js / npm**
- 可用的 **ChatGPT 账号** 或 **OpenAI API Key**
- 可用的 **Figma 账号**
- 能正常打开浏览器完成 OAuth 授权

> 建议优先使用 **Figma Remote MCP Server**，不需要依赖 Figma Desktop App，本身也是 Figma 官方推荐的方式。

---

## 3. 安装 Codex CLI

在终端执行：

```bash
npm i -g @openai/codex
```

安装完成后，先验证是否安装成功：

```bash
which codex
codex --version
```

如果能看到 `codex` 路径和版本号，说明安装成功。

---

## 4. 首次启动并登录 Codex

执行：

```bash
codex
```

首次运行时，Codex 会提示你登录。

你可以使用：

- **ChatGPT 账号**
- **OpenAI API Key**

完成登录后，就可以进入 Codex 交互界面。

---

## 5. 如果安装成功但提示 `command not found: codex`

这通常是因为 npm 的全局可执行目录没有进入 PATH。

先检查全局安装目录：

```bash
npm prefix -g
ls "$(npm prefix -g)/bin" | grep codex
```

如果这里能看到 `codex`，临时修复 PATH：

```bash
export PATH="$(npm prefix -g)/bin:$PATH"
which codex
codex --version
```

如果这样可以了，再把 PATH 永久写入 `~/.zshrc`：

```bash
echo 'export PATH="$(npm prefix -g)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

---

## 6. 添加 Figma MCP（推荐：Remote Server）

Figma 官方推荐优先使用 **Remote MCP Server**。

在普通终端里执行：

```bash
codex mcp add figma --url https://mcp.figma.com/mcp
```

执行后会发生这些事：

1. Codex 把 `figma` MCP server 加入配置
2. 检测到 OAuth 支持
3. 自动生成一个浏览器授权链接
4. 你在浏览器中登录并授权 Figma
5. 授权成功后，终端会显示登录成功

> 这一步通常 **不需要手动粘贴个人 Figma token**。  
> 推荐直接使用 OAuth 流程。

---

## 7. 连接成功的典型提示

如果接入成功，终端里通常会看到类似输出：

```text
Added global MCP server 'figma'.
Detected OAuth support. Starting OAuth flow…
Successfully logged in.
```

这说明：

- Codex 已经识别到 Figma MCP
- OAuth 已完成
- 现在可以在 Codex 中使用 Figma 能力

---

## 8. 再次进入 Codex

完成 MCP 接入后，重新进入你的项目目录：

```bash
cd ~/your-project
codex
```

进入 Codex 后，你就可以开始直接使用 Figma 设计上下文。

---

## 9. 如何在 Codex 中使用 Figma MCP

最常见的方式是：

- 打开一个 Figma 文件或 Frame 链接
- 把链接贴给 Codex
- 让它读取设计上下文并给出分析或实现方案

### 示例提示词 1：读取设计上下文

```text
读取这个 Figma 链接的设计上下文，并总结：
1. 页面结构
2. 颜色与字体层级
3. 可复用组件清单
4. 交互与动效建议
5. React + Tailwind 的实现思路
```

### 示例提示词 2：拆解组件

```text
读取这个 Figma frame，帮我拆成可复用组件，并给出组件树。
```

### 示例提示词 3：前端落地

```text
基于这个 Figma 设计稿，先输出前端实现方案，不要直接写代码。
请包含：
1. 页面结构
2. 组件拆分
3. 样式系统
4. 响应式方案
5. 动效实现建议
```

### 示例提示词 4：设计审查

```text
分析这个 Figma 页面在层级、间距、排版和组件一致性上的问题，并给出优化建议。
```

---

## 10. 查看或管理 MCP 配置

Codex 会把 MCP 配置保存在配置文件中。

默认配置位置通常是：

```text
~/.codex/config.toml
```

你也可以在项目里使用：

```text
.codex/config.toml
```

做项目级配置。

---

## 11. 可选：使用 Figma Desktop 本地 MCP

如果你不想走 Remote MCP，也可以使用 Figma Desktop App 的本地 MCP。

Figma Desktop 本地 MCP 地址通常是：

```text
http://127.0.0.1:3845/mcp
```

如果你已经在 Figma Desktop 里启用了本地 MCP，那么可以这样添加：

```bash
codex mcp add figma-desktop --url http://127.0.0.1:3845/mcp
```

> 但一般情况下，还是建议优先使用 **Remote MCP Server**。

---

## 12. 常见问题排查

### Q1：`zsh: command not found: codex`
原因通常是：
- 没安装成功
- PATH 没配置好

优先执行：

```bash
npm i -g @openai/codex
which codex
codex --version
```

如果仍不行，按上面的 PATH 修复步骤处理。

---

### Q2：浏览器授权后没反应
可以尝试：

1. 重新运行：
```bash
codex mcp add figma --url https://mcp.figma.com/mcp
```

2. 确认浏览器没有拦截回调
3. 关闭代理或隐私插件后重试
4. 重新打开终端，再执行一次

---

### Q3：需要手动填写 Figma Personal Access Token 吗？
通常 **不需要**。

如果你走的是 **Figma Remote MCP + OAuth**，一般不需要手动把个人 token 写进命令行。

---

### Q4：我之前把 token 发出来了怎么办？
建议立刻去 Figma 后台：

1. 撤销旧 token
2. 重新生成新的 token
3. 后续优先走 OAuth 授权，不要再把 token 明文发到聊天或终端截图里

---

## 13. 推荐的完整执行顺序

你可以直接按下面这组命令执行：

```bash
npm i -g @openai/codex
which codex
codex --version
codex
codex mcp add figma --url https://mcp.figma.com/mcp
codex
```

如果 `codex` 找不到，再补这组：

```bash
export PATH="$(npm prefix -g)/bin:$PATH"
echo 'export PATH="$(npm prefix -g)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
which codex
codex --version
```

---

## 14. 最后的建议

建议你后续使用方式固定成下面这个流程：

1. 在项目目录里启动 `codex`
2. 把 Figma 链接贴进去
3. 先让它分析结构、样式和组件
4. 再让它输出实现方案
5. 最后再让它生成代码或改代码

这样比一上来直接“生成整个页面代码”更稳，也更适合设计稿落地。

---

## 15. 一句话总结

- **安装 Codex CLI**：`npm i -g @openai/codex`
- **登录 Codex**：运行 `codex`
- **添加 Figma MCP**：`codex mcp add figma --url https://mcp.figma.com/mcp`
- **推荐方式**：优先使用 **Figma Remote MCP + OAuth**
- **使用方式**：把 Figma 链接贴给 Codex，让它读取设计上下文并协助实现
