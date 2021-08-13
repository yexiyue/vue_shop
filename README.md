# 								vue_shop

## 1.准备工作

vue电商后台管理项目

项目初始化 2021/8/11

安装phpstudy启动后台数据库

安装postman测试api接口

## 2.功能实现

### 1登录概述

1.登录业务流程

1. 在登录页面输入用户名和密码
2. 调用后台接口进行验证
3. 通过验证之后，根据后台的响应状态跳转到项目主项

2.登录业务的相关技术点

- 通过 cookie在客户端记录状态
- 通过 session在服务器端记录状态
- 通过 token方式维持状态

1.将登录成功之后的token, 保存到客户端的sessionStorage 中
2.项目中出了登录之外的其他API接口，必须在登录之后才能访问
3.token 只应在当前网站打开期间生效，所以将token保存在sessionStorage 中
4.通过编程式导航跳转到后台主页，路由地址是/home

5.添加路由守卫
除了登录其他都需要LoginCredential

6.退出功能实现
删除token
再重定向到'/login'

7.需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌

```js
//添加拦截器
axios.interceptors.request.use(config=>{
  config.headers.Authorization=sessionStorage.getItem('LoginCredential');
  return config
})
```

### 2.主页

#### 1.用户列表开发

