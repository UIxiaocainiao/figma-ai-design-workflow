# macOS 安装说明

这份说明教你在 Mac 上安装：

- **Codex**
- **Claude Code（接入智谱）**

---

## 一、安装 Codex

### 步骤

1. 打开 Codex 官网  
   `https://developers.openai.com/codex/app`

2. 下载 **macOS** 版本


### 提示

- 一般直接用 **ChatGPT 账号** 登录即可（某鱼购买）

---

## 二、安装 Claude Code（接入智谱）

### 安装前准备

先准备好这几样：

- 一台 Mac
- 能联网
- 已安装 **Node.js 18 以上版本**

---

### 第 1 步：安装 Claude Code

打开终端，输入下面命令（一定要有一个可用的梯子，比如日本节点）：

```bash
npm install -g @anthropic-ai/claude-code
```

安装完成后，可以输入下面命令检查：

```bash
claude --version
```

如果能看到版本号，说明安装成功。

---

### 第 2 步：运行智谱配置脚本

1. 打开智谱官网，购买开发者专区里面的
   `https://bigmodel.cn/special_area`

继续在终端输入：

```bash
curl -O "https://cdn.bigmodel.cn/install/claude_code_env.sh" && bash ./claude_code_env.sh
```

如果过程里提示你输入 API key：

**请输入你在智谱平台购买套餐后创建的 API key**

---

### 第 3 步：重新打开终端

脚本执行完后：

1. 关闭终端
2. 重新打开终端

---

### 第 4 步：启动 Claude

先进入你的项目文件夹，然后输入：

```bash
claude
```

如果看到提示：

```text
Do you want to use this API key
```

输入：

```text
Yes
```

就可以了。

---


## 四、常见问题

### 1. 终端是什么？（前面已经安装了 Hyper 终端可以忽略）

终端就是 Mac 自带的命令窗口。  
打开方法：

- 按 **Command + 空格**
- 输入 **Terminal**
- 回车

### 2. `claude` 运行不了怎么办？

先检查：

- Node.js 有没有装好
- 网络是否正常
- 前面的命令有没有执行成功

### 3. API key 填哪个？

填 **智谱平台** 的。  
不是别的平台 key。

---

## 五、一句话总结

- **Codex**：官网下载安装，登录后直接用
- **Claude Code**：先安装，再运行智谱脚本，最后输入购买后的 API key
