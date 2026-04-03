# Charene 的专属菜单

一个基于 `Next.js + TypeScript + Tailwind CSS + Prisma + SQLite` 的可爱风电子菜单项目，包含：

- 前台菜单页：分类浏览、加入购物车、数量调整、确认下单弹窗
- 后台管理页：新增/删除系列、新增/删除商品
- SQLite 持久化：通过 Prisma 管理分类和商品数据

## 快速开始

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看前台菜单，后台在 [http://localhost:3000/admin](http://localhost:3000/admin)。

## 部署到 Linux 服务器

推荐直接用 Docker 部署，这样环境最稳定。

1. 复制环境变量文件

```bash
cp .env.production.example .env.production
```

2. 首次部署时构建镜像

```bash
docker compose build
```

3. 初始化数据库

```bash
docker compose run --rm app npm run db:push
```

4. 如果你想保留演示菜单数据，再执行一次种子数据

```bash
docker compose run --rm app npm run db:seed
```

5. 启动服务

```bash
docker compose up -d
```

服务默认监听 `3000` 端口，数据库文件会持久化到服务器上的 `./data/menu.db`。

如果你前面还有 Nginx，可以把域名反代到 `http://127.0.0.1:3000`。
