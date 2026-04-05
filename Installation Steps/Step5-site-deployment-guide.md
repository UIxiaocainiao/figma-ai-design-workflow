# 阿里云域名接入七牛云静态站点部署 SOP（极简版）

## 1. 目的

将阿里云域名的二级域名接入七牛云 Kodo + CDN，并通过 HTTPS 访问静态网站。

示例域名：

- 主域名：`pengshz.cn`
- 二级域名：`design.pengshz.cn`

---

## 2. 前置条件

开始前请确认：

- 已在阿里云购买并管理域名 `pengshz.cn`
- 已开通七牛云账号
- 已在七牛云创建 Kodo 存储空间（Bucket）
- 已准备好网站打包产物
- 网站首页文件为 `index.html`

---

## 3. 操作步骤

## 步骤 1：确定使用的二级域名

本次使用：

```text
design.pengshz.cn
```

---

## 步骤 2：在七牛云申请免费证书

进入：

```text
七牛云控制台 -> SSL 证书服务
```

操作：

1. 申请免费单域名证书
2. 域名填写：`design.pengshz.cn`
3. 提交申请

---

## 步骤 3：按七牛提示去阿里云添加证书验证记录

进入：

```text
阿里云 -> 云解析 DNS -> pengshz.cn -> 解析设置 -> 添加记录
```

根据七牛证书页面提示，添加一条验证记录。

本次实际示例：

```text
记录类型：TXT
主机记录：_dnsauth.design
记录值：以七牛证书页面显示为准
TTL：默认
```

保存后：

1. 等几分钟
2. 回七牛证书页面
3. 点击“检测验证结果”

验证通过后，等待证书签发成功。

---

## 步骤 4：在七牛云 CDN 添加加速域名

进入：

```text
七牛云 -> CDN -> 域名管理 -> 添加域名
```

填写：

```text
域名：design.pengshz.cn
协议：HTTPS
证书：选择 design.pengshz.cn 对应证书
源站：选择网站所在 Bucket
```

提交创建。

---

## 步骤 5：复制七牛云返回的 CNAME

CDN 域名创建成功后，在七牛云域名管理中复制系统分配的 CNAME。

格式通常类似：

```text
xxxxxx.qiniudns.com
```

---

## 步骤 6：去阿里云添加正式业务 CNAME 记录

进入：

```text
阿里云 -> 云解析 DNS -> pengshz.cn -> 解析设置 -> 添加记录
```

填写：

```text
记录类型：CNAME
主机记录：design
记录值：七牛 CDN 返回的 CNAME
TTL：默认
```

保存后等待解析生效。

---

## 步骤 7：回七牛云检查域名状态

进入：

```text
七牛云 -> CDN -> 域名管理
```

确认 `design.pengshz.cn` 状态为：

- CNAME：已配置
- 状态：成功
- 协议：HTTPS

---

## 步骤 8：上传网站文件到七牛云 Kodo

将网站打包后的文件上传到 Bucket 根目录。

正确目录示例：

```text
index.html
assets/
css/
js/
```

不要上传成：

```text
dist/index.html
dist/assets/
```

除非你明确知道自己在做目录映射。

---

## 步骤 9：将 Bucket 设置为公开空间

进入：

```text
七牛云 -> Kodo -> 空间管理 -> 选择 Bucket -> 空间设置 -> 访问控制
```

设置为：

```text
公开空间
```

---

## 步骤 10：开启默认首页

进入：

```text
七牛云 -> Kodo -> 空间管理 -> 选择 Bucket -> 静态页面设置
```

开启：

```text
默认首页
```

首页文件需为：

```text
index.html
```

---

## 步骤 11：访问测试

浏览器访问：

```text
https://design.pengshz.cn
```

如果首页未自动打开，再测试：

```text
https://design.pengshz.cn/index.html
```

---

## 4. 最终 DNS 记录模板

阿里云最终通常应有两条关键记录。

### 4.1 证书验证记录

```text
记录类型：TXT
主机记录：_dnsauth.design
记录值：七牛证书页面提供的 TXT 值
```

### 4.2 正式业务访问记录

```text
记录类型：CNAME
主机记录：design
记录值：七牛 CDN 提供的 CNAME
```

---

## 5. 验收标准

满足以下条件即表示部署完成：

### 5.1 七牛云 CDN 状态正常

`design.pengshz.cn` 显示：

- CNAME：已配置
- 状态：成功
- 协议：HTTPS

### 5.2 Kodo 设置正确

- Bucket：公开空间
- 默认首页：已开启
- 根目录存在 `index.html`

### 5.3 浏览器访问正常

以下地址可正常打开：

```text
https://design.pengshz.cn
```

或：

```text
https://design.pengshz.cn/index.html
```

---

## 6. 常见问题处理

### 6.1 证书验证失败

检查：

- TXT 记录类型是否正确
- 主机记录是否填写为 `_dnsauth.design`
- 记录值是否完整复制

---

### 6.2 七牛显示 CNAME 未配置

检查阿里云是否已添加：

```text
记录类型：CNAME
主机记录：design
记录值：七牛提供的 CNAME
```

---

### 6.3 打开网站出现 401 Authorization Required

原因通常是：

```text
Bucket 仍为私有空间
```

处理方法：

1. 将 Bucket 改为公开空间
2. 等待生效
3. 重新访问

---

### 6.4 打开网站不是首页或 404

检查：

- 根目录是否存在 `index.html`
- 默认首页是否已开启
- 上传时是否多套了一层目录

---

## 7. 一句话总结

整个流程本质上就是：

```text
七牛云申请证书 -> 阿里云加 TXT 验证 -> 七牛云创建 CDN 域名 -> 阿里云加 CNAME -> 上传网站文件 -> Bucket 改公开 -> 开启默认首页 -> 访问域名测试
```
