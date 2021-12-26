# mini-core框架

## 使用前提
* 需要小程序项目支持装饰器
* 需要正确配置小程序中npm的使用
  
>项目使用npm配置，需要在project.config.json中增加如下配置并使用微信开发工具构建npm
```json
"packNpmManually": true,
"packNpmRelationList": [
    {
        "packageJsonPath": "package.json",
        "miniprogramNpmDistDir": "./miniprogram"
    }
]
```
