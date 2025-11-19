# 环境变量配置指南

## 概述

本项目使用多个环境变量文件来管理不同环境的配置：

- `.env.example` - 环境变量模板文件（已提交到 Git）
- `.env` - 本地开发环境配置（不提交到 Git）
- `.env.production` - 生产环境配置（不提交到 Git）
- `.env.staging` - 测试环境配置（不提交到 Git）

## 快速开始

1. 复制 `.env.example` 文件并重命名为 `.env`
2. 根据你的实际配置填写环境变量值

```bash
cp .env.example .env
```

## 环境变量说明

### 域名配置
- `NEXT_PUBLIC_DOMAIN` - 应用的主域名
- `NEXT_PUBLIC_APP_URL` - 应用的完整 URL
- `NODE_ENV` - 环境类型 (development/staging/production)
- `NEXT_PUBLIC_CANONICAL_DOMAIN` - 规范化重定向的目标主域名（如 `imaginevisual.cc`）
- `ENABLE_CANONICAL_REDIRECT` - 是否启用域名规范化重定向（默认关闭，设为 `"true"` 才启用）

### 数据库配置
- `POSTGRES_URL` - PostgreSQL 数据库连接字符串
- `DATABASE_URL` - 通用数据库连接字符串

### Google OAuth 配置
- `GOOGLE_CLIENT_ID` - Google OAuth 客户端 ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth 客户端密钥
- `GOOGLE_REDIRECT_URI` - OAuth 回调 URL

### Stripe 支付配置
- `STRIPE_PUBLIC_KEY` - Stripe 公钥
- `STRIPE_PRIVATE_KEY` - Stripe 私钥
- `STRIPE_WEBHOOK_SECRET` - Stripe Webhook 密钥
- `STRIPE_ENDPOINT_SECRET` - Stripe 端点密钥

### NextAuth 配置
- `NEXTAUTH_SECRET` - NextAuth 加密密钥（使用 `openssl rand -base64 32` 生成）
- `NEXTAUTH_URL` - NextAuth 基础 URL

### Replicate AI 配置
- `REPLICATE_API_TOKEN` - Replicate API 令牌
- `REPLICATE_WEBHOOK_SECRET` - Replicate Webhook 密钥
- `REPLICATE_URL` - Replicate 回调 URL

### Cloudflare R2 存储配置
- `R2_BUCKET_NAME` - R2 存储桶名称
- `R2_ACCESS_KEY_ID` - R2 访问密钥 ID
- `R2_SECRET_ACCESS_KEY` - R2 秘密访问密钥
- `R2_TOKEN` - R2 API 令牌
- `R2_ENDPOINT` - R2 端点 URL
- `R2_ACCOUNT_ID` - R2 账户 ID
- `R2_PUBLIC_URL` - R2 公共访问 URL

### 邮件配置（可选）
- `SMTP_HOST` - SMTP 服务器地址
- `SMTP_PORT` - SMTP 端口（通常是 587）
- `SMTP_USER` - SMTP 用户名
- `SMTP_PASSWORD` - SMTP 密码
- `EMAIL_FROM` - 发件人邮箱地址

### 分析配置（可选）
- `GOOGLE_ANALYTICS_ID` - Google Analytics 跟踪 ID
- `VERCEL_ANALYTICS_ID` - Vercel Analytics ID

### 安全配置
- `CORS_ORIGIN` - CORS 允许的源
- `RATE_LIMIT_MAX` - 速率限制最大请求数
- `RATE_LIMIT_WINDOW` - 速率限制时间窗口（毫秒）

### 日志配置
- `LOG_LEVEL` - 日志级别 (debug/info/warn/error)

## 环境特定配置

### 开发环境 (.env)
- 使用 `http://localhost:3000` 作为域名
- 日志级别设置为 `debug`
- 较宽松的速率限制

### 测试环境 (.env.staging)
- 使用 `https://staging.imaginevisual.cc` 作为域名
- 使用测试环境的 API 密钥
- 更详细的日志记录

### 生产环境 (.env.production)
- 使用 `https://imaginevisual.cc` 作为域名
- 使用生产环境的 API 密钥
- 优化的日志级别和速率限制

## 安全注意事项

1. **永远不要**将包含真实密钥的环境变量文件提交到 Git
2. 定期轮换 API 密钥和秘钥
3. 使用强随机密钥作为 `NEXTAUTH_SECRET`
4. 在生产环境中使用 HTTPS
5. 设置适当的 CORS 策略

## 部署指南

### Vercel 部署
在 Vercel 项目设置中添加环境变量，或使用 Vercel CLI：

```bash
vercel env add NEXT_PUBLIC_DOMAIN
vercel env add POSTGRES_URL
vercel env add NEXT_PUBLIC_CANONICAL_DOMAIN
vercel env add ENABLE_CANONICAL_REDIRECT
# ... 添加其他环境变量
```

### Docker 部署
创建 `.env.production` 文件并在 Docker 运行时挂载：

```bash
docker run -d --env-file .env.production your-app-image
```

## 故障排除

1. **环境变量未生效**：确保文件名正确，重启开发服务器
2. **CORS 错误**：检查 `CORS_ORIGIN` 设置
3. **数据库连接失败**：验证 `POSTGRES_URL` 格式和权限
4. **OAuth 失败**：确认回调 URL 与 Google Console 设置一致
5. **域名重定向循环**：如果发现 `Too many redirects` 或线上不可访问，设置 `ENABLE_CANONICAL_REDIRECT="false"` 或在托管层（如 Vercel）删除相反方向的跳转规则，避免互相“打架”。

## 获取 API 密钥

### Google OAuth
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建项目并启用相关 API
3. 创建 OAuth 2.0 客户端 ID

### Stripe
1. 访问 [Stripe Dashboard](https://dashboard.stripe.com/)
2. 在开发者部分获取 API 密钥

### Replicate
1. 访问 [Replicate](https://replicate.com/)
2. 在账户设置中生成 API 令牌

### Cloudflare R2
1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 创建 R2 存储桶并生成 API 令牌