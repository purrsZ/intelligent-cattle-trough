# CORS 跨域问题解决方案

## 🔍 问题分析

您遇到的是典型的CORS（跨源资源共享）问题：

```
请求 URL: http://bj01.fe.server.base.axisspace.cn:8080/ctc/group/list
请求方法: OPTIONS (预检请求)
状态代码: 403 Forbidden
Origin: http://localhost:3000
```

浏览器发送了OPTIONS预检请求，但服务器返回403，表示不允许跨域访问。

## ✅ 解决方案

### 方案1：使用Create React App代理（已实施）

**配置代理**：
```json
// package.json
{
  "proxy": "http://bj01.fe.server.base.axisspace.cn:8080"
}
```

**环境变量配置**：
```env
# .env
REACT_APP_API_BASE_URL=
```

**工作原理**：
- 前端请求发送到本地开发服务器（localhost:3000）
- Create React App自动代理到目标服务器
- 避免了浏览器的CORS限制

### 方案2：后端配置CORS（需后端配合）

如果有后端控制权，可以在服务器配置CORS头：

```javascript
// Express.js 示例
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
```

### 方案3：高级代理配置

如果需要更复杂的代理规则，可以使用 `setupProxy.js`：

```javascript
// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/ctc',
    createProxyMiddleware({
      target: 'http://bj01.fe.server.base.axisspace.cn:8080',
      changeOrigin: true,
      secure: false,
    })
  );
};
```

## 🚀 当前配置

**API请求流程**：
```
前端请求 → localhost:3000/ctc/group/list
           ↓ (代理)
服务器响应 ← bj01.fe.server.base.axisspace.cn:8080/ctc/group/list
```

**优势**：
- ✅ 无需修改现有API代码
- ✅ 开发环境即时生效
- ✅ 避免CORS问题
- ✅ 支持所有HTTP方法

## 📋 测试步骤

1. **重启开发服务器**：
   ```bash
   npm start
   ```

2. **检查请求URL**：
   应该看到请求发送到 `http://localhost:3000/ctc/group/list`

3. **查看Network面板**：
   - 不应再有OPTIONS预检请求失败
   - POST请求应该正常发送

4. **检查控制台日志**：
   ```
   🚀 API Request: {
     method: 'POST',
     url: '/ctc/group/list',
     data: { pageNum: 1, pageSize: 10 }
   }
   ```

## ⚠️ 注意事项

1. **仅开发环境有效**：代理只在开发模式下工作
2. **生产环境处理**：需要配置nginx或其他反向代理
3. **重启必需**：修改proxy配置后需要重启开发服务器

## 🔧 生产环境配置

生产环境可以通过nginx配置反向代理：

```nginx
server {
  listen 80;
  server_name your-domain.com;
  
  location / {
    root /path/to/build;
    try_files $uri $uri/ /index.html;
  }
  
  location /ctc/ {
    proxy_pass http://bj01.fe.server.base.axisspace.cn:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

现在重启开发服务器，CORS问题应该已经解决！

