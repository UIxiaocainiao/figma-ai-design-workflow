# DesignBloom

DesignBloom 现在按前端页面和后端服务分层整理，仓库不再只有一个扁平的 Vite 页面入口。

## 目录

- `apps/web`：React + Vite 前端页面
- `apps/api`：Node.js 后端服务骨架
- `scripts`：部署脚本
- `docs`：项目架构说明

## 启动

```bash
npm install
npm run dev:web
npm run dev:api
```

后端现在只支持 MySQL。

- Railway 部署环境优先读取 `DATABASE_URL`
- 本地开发环境优先读取 `MYSQL_PUBLIC_URL`，若未提供则回退到 `DATABASE_URL`

## 构建

```bash
npm run build:web
```

前端构建产物输出到根目录 `dist/`。

## 文档

- 项目架构见 `docs/architecture.md`
