# DesignBloom Architecture

## 目录结构

```text
DesignBloom
├── apps
│   ├── api
│   │   └── src
│   │       ├── config
│   │       ├── controllers
│   │       ├── routes
│   │       ├── utils
│   │       ├── app.js
│   │       └── server.js
│   └── web
│       ├── index.html
│       └── src
│           ├── components
│           ├── content
│           ├── hooks
│           ├── pages
│           ├── styles
│           ├── App.jsx
│           └── main.jsx
├── docs
│   └── architecture.md
├── scripts
│   └── deploy-qiniu.cjs
├── package.json
└── vite.config.js
```

## 前端

- `apps/web/src/pages/HomePage.jsx`
  当前首页页面容器，负责组装 section、导航交互和响应式菜单状态。
- `apps/web/src/components`
  复用型 UI 组件和页面卡片组件，避免继续把所有 JSX 堆在一个文件里。
- `apps/web/src/content/home-content.js`
  首页文案、导航、案例和服务数据集中维护。
- `apps/web/src/hooks/useHomepageMotion.js`
  GSAP 与 ScrollTrigger 动效统一收口，页面组件只保留结构逻辑。
- `apps/web/src/styles/global.css`
  现阶段保留全局样式单文件，后续可以继续拆为 tokens、layout、sections。

## 后端

- `apps/api/src/server.js`
  服务启动入口，只负责监听端口和优雅退出。
- `apps/api/src/app.js`
  HTTP 应用层，处理 CORS、错误兜底和请求分发。
- `apps/api/src/routes`
  路由表，按 `METHOD + PATH` 映射控制器。
- `apps/api/src/controllers`
  业务处理逻辑，当前包含健康检查、站点元信息和联系表单接收。
- `apps/api/src/utils`
  请求体解析和 JSON 响应等无状态工具。

## 运行边界

- 前端开发服务器：`npm run dev:web`
- 后端服务：`npm run dev:api`
- 前端构建产物：根目录 `dist/`
- 七牛部署脚本：`scripts/deploy-qiniu.cjs`

## 后续建议

- 如果后端开始接数据库，再补 `services/`、`repositories/`、`schemas/` 三层。
- 如果前端页面继续增多，新增 `apps/web/src/pages/<page>` 目录并引入路由层。
- 如果前后端共享类型或配置，再新增 `packages/shared` 做真正的共享模块。

