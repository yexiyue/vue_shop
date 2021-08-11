# 								vue_shop

## 1.准备工作

vue电商后台管理项目

项目初始化 2021/8/11

安装phpstudy启动后台数据库

安装postman测试api接口

## 2.功能实现

## 1登录概述

1.登录业务流程

1. 在登录页面输入用户名和密码
2. 调用后台接口进行验证
3. 通过验证之后，根据后台的响应状态跳转到项目主项

2.登录业务的相关技术点

- 通过 cookie在客户端记录状态
- 通过 session在服务器端记录状态
- 通过 token方式维持状态

![image-20210811174541596](../../../1/img/image-20210811174541596.png)

