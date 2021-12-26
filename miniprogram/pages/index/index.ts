import { reactive, initReactive } from '../../core/index';
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
    // 将todoList转为响应式
    this.todoList = reactive<TodoItem[]>(this, [{ id: Date.now(), title: 'い 狂奔的蜗牛', finished: false }]);
    this.options = reactive<{ title: string }>(this, { title: 'TodoList' });

    setTimeout(() => {});
  },
  // 输入事件
  handleInput(e: any) {
    this.inputStr = e.detail.value;
  },
  // 添加待办
  handleAdd() {
    if (!this.inputStr) {
      return;
    }
    this.data.todoList.push({ id: Date.now(), title: this.data.inputStr, finished: false });
    this.inputStr = '';
  },
  // 删除待办
  handleDelete(e: any) {
    const index = e.currentTarget.dataset.index * 1;
    this.todoList.splice(index, 1);
  },
  // 完成待办
  handleFinished(e: any) {
    const index = e.currentTarget.dataset.index * 1;
    this.todoList[index].finished = !this.todoList[index].finished;
  },
  // 切换title
  handleToggleTitle() {
    this.options.title = 'TodoList - ' + Date.now().toString().slice(-6);
  }
});
