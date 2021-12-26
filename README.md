# reactive响应式更改数据刷新界面

> ​	微信小程序提供获取data数据的方式和修改数据的方式分别为this.data.x和this.setData({})，无论是获取数据或者修改数据都显得较为繁琐，且如果x为一个对象或者数据，只修改其值页面不会自动刷新，需要调用this.setData({x: new x})更改数据，刷新界面。所以开发了reactive这个比较小的库来进行数据的响应式处理，使访问和修改值的开发效率更高（同时修改多个属性值建议使用this.setData()方法）



## 使用前提

- 安装reactive为依赖

- - npm install wx-react --save
  - yarn add wx-react

- 需要正确配置小程序中npm的使用
- 项目使用npm配置，需要在project.config.json中增加如下配置并使用微信开发工具构建npm



```json
"packNpmManually": true,
"packNpmRelationList": [
    {
        "packageJsonPath": "package.json",
        "miniprogramNpmDistDir": "./miniprogram"
    }
]
```

## 使用方式

* onLoad()生命周期中调用initReactive(this);完成直接this.x代理到this.data.x

* 调用reactive方法将对象或数组转成代理对象，第一个参数固定this，第二个为需要代理的对象。

  ```js
  Page({
    data: {
      todoList: []
    },
    onLoad(){
      // 步骤一、必须调用
      initReactive(this);
      
      // 步骤二 将目标对象（todoList）转为代理对象
      this.todoList = reactive<TodoItem[]>(this, [{ id: Date.now(), title: 'い 狂奔的蜗牛', finished: false }]);
    }
  })
  ```

  

## TodoList示例

### TS/JS逻辑

```javascript
import { reactive, initReactive } from 'reactive';
/*
 * @Author: い 狂奔的蜗牛
 * @Date: 2021-12-26 13:58:16
 * @Description: todoList
 */
interface TodoItem {
  id: number;
  title: string;
  finished: boolean;
}
Page({
  data: {
    todoList: [], // 待办事项列表
    inputStr: '', // 输入框输入值,
    options: {}
  },
  onLoad() {
    // 必须执行initReactive(this);
    initReactive(this);
    
    // 直接方位或设置值，无需this.data.todoList或this.setData({todoList:[]})
    // 将todoList转为响应式
    this.todoList = reactive<TodoItem[]>(this, [{ id: Date.now(), title: 'い 狂奔的蜗牛', finished: false }]);
    this.options = reactive<{ title: string }>(this, { title: 'TodoList' });
  },
  // 输入事件
  handleInput(e: any) {
    // 直接访问data中的属性
    this.inputStr = e.detail.value;
  },
  // 添加待办
  handleAdd() {
    if (!this.inputStr) {
      return;
    }
    // 直接修改值 会自动刷新页面
    this.todoList.push({ id: Date.now(), title: this.data.inputStr, finished: false });
    this.inputStr = '';
  },
  // 删除待办
  handleDelete(e: any) {
    const index = e.currentTarget.dataset.index * 1;
    // 直接修改值 会自动刷新页面
    this.todoList.splice(index, 1);
  },
  // 完成待办
  handleFinished(e: any) {
    const index = e.currentTarget.dataset.index * 1;
    // 直接修改值 会自动刷新页面
    this.todoList[index].finished = !this.todoList[index].finished;
  },
  // 切换title
  handleToggleTitle() {
    // 直接修改值 会自动刷新页面
    this.options.title = 'TodoList - ' + Date.now().toString().slice(-6);
  }
});
```

### 效果图



![img](https://cdn.nlark.com/yuque/0/2021/png/8429782/1640500402852-249589fe-c1c6-4258-a837-c10499c117b0.png)

[GitHub项目地址](https://github.com/llf137224350/reactive)

