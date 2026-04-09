# macOS 开发环境使用文档（Hyper + Zsh + Node + Python）

适用人群：刚接触 macOS 开发环境配置的小白  
适用机器：Apple Silicon / Intel 都可以  
目标：

1. 下载并配置 Hyper 终端
2. 安装 Homebrew、Oh My Zsh、powerlevel10k、语法高亮插件
3. 安装 Node.js + Python 开发环境
4. 可选：一键安装 Git 并配置 SSH

---

## 一、整体思路

先装一个好用的终端（Hyper），再装包管理器（Homebrew），然后配置 Shell（Oh My Zsh + powerlevel10k + 插件），最后安装开发环境（Node.js + Python）。

建议按这个顺序走：

1. 安装 Hyper
2. 安装 Homebrew
3. 安装 Git、curl、wget 等基础工具
4. 安装 Oh My Zsh
5. 安装 powerlevel10k 和常用插件
6. 安装 Node.js 和 Python
7. 可选：配置 Git 和 SSH

---

## 二、安装 Hyper 终端

### 1）下载 Hyper

官网：

```text
https://hyper.is/
```

下载完成后，把 Hyper 拖到 Applications 里，打开运行一次。

### 2）Hyper 配置文件位置(可以不设置)

macOS 下推荐使用这个配置文件：

```bash
~/Library/Application Support/Hyper/.hyper.js
```

如果旧版本存在 `~/.hyper.js`，优先以应用目录里的配置为准。

### 3）修改 Hyper 快捷键（Command 风格、可以不设置）

说明：
- 这里改的是 **Hyper 自己的快捷键**
- 比如新建标签页、关闭窗口、分屏、打开设置
- **不是**改 nano / zsh / vim 里的 `Ctrl` 快捷键

先执行：

```bash
nano ~/Library/Application\ Support/Hyper/.hyper.js
```

找到文件底部的 `keymaps`，替换成下面这一段：

```javascript
keymaps: {
  'window:devtools': 'cmd+alt+o',
  'window:preferences': 'cmd+,',
  'window:new': 'cmd+n',
  'window:close': 'cmd+shift+w',

  'tab:new': 'cmd+t',
  'tab:next': 'cmd+shift+]',
  'tab:prev': 'cmd+shift+[',
  'tab:jump:1': 'cmd+1',
  'tab:jump:2': 'cmd+2',
  'tab:jump:3': 'cmd+3',
  'tab:jump:4': 'cmd+4',
  'tab:jump:5': 'cmd+5',

  'pane:splitRight': 'cmd+d',
  'pane:splitDown': 'cmd+shift+d',
  'pane:close': 'cmd+w',
  'pane:next': 'cmd+alt+right',
  'pane:prev': 'cmd+alt+left',

  'editor:clearBuffer': 'cmd+k',
  'window:hamburgerMenu': 'cmd+shift+h'
},
```

保存后，**完全退出并重新打开 Hyper**。

---

## 三、安装基础环境：Xcode 命令行工具 + Homebrew

### 1）安装 Xcode Command Line Tools（可以不安装）

```bash
xcode-select --install
```

如果系统提示已经安装，可以跳过。

### 2）安装 Homebrew（需科学上网）

直接复制执行：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 3）把 brew 加到 shell 环境里

Apple Silicon（M1 / M2 / M3 / M4）通常执行：

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
source ~/.zprofile
```

如果是 Intel Mac，通常路径是：

```bash
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
source ~/.zprofile
```

### 4）检查 brew 是否成功

```bash
brew --version
```

---

## 四、安装基础工具（推荐）

先装常用基础工具：

```bash
brew install git curl wget
```

再装一些提升终端体验的工具：

```bash
brew install eza bat fd ripgrep fzf zoxide
```

检查：

```bash
git --version
curl --version
wget --version
eza --version
bat --version
fd --version
rg --version
fzf --version （可以后续安装）
zoxide --version
```

---

## 五、安装 Oh My Zsh

### 1）确认当前 shell 是 zsh

```bash
echo $SHELL
zsh --version
```

### 2）安装 Oh My Zsh

直接执行：

```bash
sh -c "$(curl -fsSL https://install.ohmyz.sh/)"
```

安装完成后，重新打开终端，或者执行：

```bash
source ~/.zshrc
```

---

## 六、安装 powerlevel10k 主题

### 1）安装 powerlevel10k

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

### 2）设置主题

编辑 `~/.zshrc`：

```bash
nano ~/.zshrc
```

找到：

```bash
ZSH_THEME="robbyrussell"
```

改成：

```bash
ZSH_THEME="powerlevel10k/powerlevel10k"
```

保存后执行：

```bash
source ~/.zshrc
```

### 3）启动向导（主要是样式DIY）

```bash
p10k configure
```

按提示选择字体、图标和主题样式即可。一般直接按推荐项走就行。

---

## 七、安装 zsh 插件

推荐至少安装这两个：

- `zsh-autosuggestions`：命令自动建议
- `zsh-syntax-highlighting`：命令语法高亮
- `fzf`：命令行里的模糊搜索工具

### 1）安装自动建议插件

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

### 2）安装语法高亮插件

```bash
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

如果提示目录已存在，说明已经装过了，可以用：

```bash
cd ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting && git pull
```

### 3）安装命令行里的模糊搜索工具

```bash
git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
~/.fzf/install
```

### 4）启用插件

编辑 `~/.zshrc`：

```bash
nano ~/.zshrc
```

把 `plugins=(...)` 改成下面这样：

```bash
plugins=(
  git
  extract
  fzf
  zsh-autosuggestions
  zsh-syntax-highlighting
)
```

注意：
- `zsh-syntax-highlighting` 最好放最后

保存后执行：

```bash
source ~/.zshrc
```

### 4）测试是否生效

输入一个不存在的命令，例如：

```bash
abc123
```

如果显示成错误样式，说明插件已经生效。

---

## 八、推荐的 `.zshrc` 基础增强配置

把下面这段追加到 `~/.zshrc` 里：

```bash
# 常用别名
alias ls='eza'
alias la='eza -la'
alias ll='eza -lh'
alias cat='bat'

# fzf
[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

# npm global bin
export PATH="$HOME/.npm-global/bin:$PATH"
```

保存后执行：

```bash
source ~/.zshrc
```

---

## 九、安装 Node.js + Python（新手推荐版）

如果你是新手，建议直接用 Homebrew 安装，最简单。

### 1）安装 Node.js

```bash
brew install node
```

### 2）安装 Python

```bash
brew install python
```

### 3）安装 pnpm

你的环境如果是 Homebrew 安装的新版 Node.js，不要使用 `sudo corepack ...`，否则可能会出现 `corepack: command not found`。

推荐这样安装：

```bash
npm install -g corepack@latest
corepack enable pnpm
hash -r
pnpm -v
```


### 4）检查版本

```bash
node -v
npm -v
pnpm -v
python3 --version
pip3 --version
which node
which python3
```

如果看到版本号，就说明装好了。

---



## 十一、可选：一键安装 Git 并连接 SSH

这一部分适合想用 GitHub / GitLab 拉代码的人。

### 1）安装 Git（如果前面没装）

```bash
brew install git
```

### 2）配置 Git 用户名和邮箱

把下面改成你自己的信息：

```bash
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的邮箱"
git config --global init.defaultBranch main
git config --global core.editor "nano"
git config --global pull.rebase false
git config --global color.ui auto
```

检查：

```bash
git config --global --list
```

### 3）生成 SSH key

```bash
ssh-keygen -t ed25519 -C "你的邮箱"
```

一路回车即可。

### 4）加入 ssh-agent

```bash
eval "$(ssh-agent -s)"
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

### 5）查看公钥（把公钥复制到github的setting页）

```bash
cat ~/.ssh/id_ed25519.pub
```

复制输出内容，去 GitHub：

- 头像
- Settings
- SSH and GPG keys
- New SSH key
- 粘贴进去保存

### 6）测试是否成功

```bash
ssh -T git@github.com
```

如果看到类似下面这句，就说明成功了：

```text
Hi 你的用户名! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## 十二、最终检查命令（建议收藏）

所有配置做完后，执行这一组检查：

```bash
echo "=== shell ==="
echo $SHELL
zsh --version

echo
echo "=== brew ==="
brew --version

echo
echo "=== git ==="
git --version

echo
echo "=== node ==="
node -v
npm -v
pnpm -v

echo
echo "=== python ==="
python3 --version
pip3 --version

echo
echo "=== path ==="
which node
which python3

echo
echo "=== zsh plugins ==="
echo $plugins
```

---

## 十三、常见问题

### 1）`zsh: command not found`
说明命令没有安装，或者 PATH 没配好。  
可以先试：

```bash
source ~/.zprofile
source ~/.zshrc
```

### 2）`git clone` 失败
先检查网络，再检查 GitHub SSH 是否配置正确：

```bash
ssh -T git@github.com
```

### 3）`pnpm: command not found`
执行：

```bash
sudo corepack enable
sudo corepack prepare pnpm@latest --activate
hash -r
pnpm -v
```

### 4）`zsh-syntax-highlighting` 已存在
说明已经安装过，更新即可：

```bash
cd ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting && git pull
```

### 5）powerlevel10k 报 instant prompt 警告
一般是 `~/.zshrc` 启动时有额外输出。  
可以先忽略，不影响使用；如果要安静模式，可在 `~/.zshrc` 里加：

```bash
typeset -g POWERLEVEL9K_INSTANT_PROMPT=quiet
```

---

## 十四、最推荐的新手路线

如果你只想快速配好，直接按这个顺序：

1. Hyper
2. Homebrew
3. Git / curl / wget
4. Oh My Zsh
5. powerlevel10k
6. zsh-autosuggestions
7. zsh-syntax-highlighting
8. Node + Python
9. GitHub SSH（可选）

---

## 十五、最小可用命令清单

下面这组最适合新手直接跑：

```bash
xcode-select --install

/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
source ~/.zprofile

brew install git curl wget eza bat fd ripgrep fzf zoxide node python asdf

sh -c "$(curl -fsSL https://install.ohmyz.sh/)"

git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

后续再手动改 `~/.zshrc`，执行：

```bash
source ~/.zshrc
p10k configure
```

---

## 十六、最后建议

- 小白优先：**Hyper + brew + Oh My Zsh + powerlevel10k + 插件 + Homebrew 版 Node/Python**
- 以后需要多版本再上 `asdf`
- Git + SSH 尽早配好，后面拉代码会舒服很多
- 配置文件修改完，**记得重新打开终端或 `source ~/.zshrc`**

祝你在 macOS 上开发顺利。
