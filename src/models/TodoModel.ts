import { observable } from 'mobx';

export class TodoModel {

  static nextId = 1;
  readonly id: number;

  @observable public text: string;
  @observable public completed: boolean;

  static generateId() {
    return this.nextId++;
  }
  
  constructor(text: string, completed: boolean = false) {
    this.id = TodoModel.generateId();
    this.text = text;
    this.completed = completed;
  }

}

export default TodoModel;
