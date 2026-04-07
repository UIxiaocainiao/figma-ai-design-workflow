# 用命令创建 SSH 连接到 GitHub

## 1. 生成 SSH key
推荐使用 `ed25519`：

```bash
ssh-keygen -t ed25519 -C "你的 GitHub 邮箱"
```

例如：

```bash
ssh-keygen -t ed25519 -C "seriouspengtw@163.com"
```

执行后一路回车即可。默认会生成：

- `~/.ssh/id_ed25519`
- `~/.ssh/id_ed25519.pub`

---

## 2. 启动 ssh-agent 并加载私钥

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

如果你的私钥文件名不是 `id_ed25519`，请替换成实际文件名。

---

## 3. 查看公钥并添加到 GitHub
先输出公钥内容：

```bash
cat ~/.ssh/id_ed25519.pub
```

复制输出的整行内容，然后到 GitHub 页面：

**Settings → SSH and GPG keys → New SSH key**

把公钥粘贴进去并保存。

---

## 4. 测试是否连接成功

```bash
ssh -T git@github.com
```

第一次连接时，如果提示是否继续，输入：

```bash
yes
```

成功后会看到类似：

```text
Hi 你的用户名! You've successfully authenticated, but GitHub does not provide shell access.
```

这说明 SSH 已经连接成功。

---

## 5. 用 SSH 地址克隆仓库

```bash
git clone git@github.com:用户名/仓库名.git
```

例如：

```bash
git clone git@github.com:pengshz/your-repo.git
```

如果仓库属于组织：

```bash
git clone git@github.com:组织名/仓库名.git
```

---

## 6. 已有本地仓库时改成 SSH
如果你的仓库原来用的是 HTTPS，可以改成 SSH：

```bash
git remote set-url origin git@github.com:用户名/仓库名.git
git remote -v
```

之后就可以正常使用：

```bash
git pull
git push
```

---

## 7. 常用排查命令
查看本机 SSH 文件：

```bash
ls -al ~/.ssh
```

查看当前是否已加载 key：

```bash
ssh-add -l
```

手动指定私钥测试：

```bash
ssh -i ~/.ssh/id_ed25519 -T git@github.com
```

测试某个仓库地址是否存在并且你有权限：

```bash
git ls-remote git@github.com:用户名/仓库名.git
```

---

## 8. 常见报错说明
### `Repository not found`
通常表示以下几种情况：

1. 仓库 owner 写错了
2. 仓库名写错了
3. 仓库是私有的，你当前 GitHub 账号没有权限

### `Permission denied (publickey)`
通常表示：

1. 私钥没有加载进 ssh-agent
2. GitHub 没有添加对应的公钥
3. 当前机器使用的不是你想要的那把私钥

这时可以先执行：

```bash
ssh-add ~/.ssh/id_ed25519
ssh -T git@github.com
```

---

## 9. 最推荐的完整命令顺序

```bash
ssh-keygen -t ed25519 -C "seriouspengtw@163.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
cat ~/.ssh/id_ed25519.pub
ssh -T git@github.com
```

把公钥加到 GitHub 后，再克隆仓库：

```bash
git clone git@github.com:用户名/仓库名.git
```
