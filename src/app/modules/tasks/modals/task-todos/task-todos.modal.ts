import { User } from './../../../user/actions/user.actions';
import { Keyboard } from '@ionic-native/keyboard';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Content, TextInput, ViewController, Platform, ItemSliding, AlertController } from 'ionic-angular';
import { Observable, Subject } from 'rxjs/';
import {
  clone, isNil, merge, not, pathOr, pipe, prop, trim, propEq,
  propSatisfies, is, complement, both, isEmpty, defaultTo, find,
} from 'ramda';

import { AppState } from './../../../../app.reducer';
import { Task, TaskTodoListParams, TaskTodoParams, Todo, TodoList } from './../../../../models/tasks/task.model';
import { addTodo, addTodoList, editTodo, editTodoList, removeTodo, removeTodoList } from './../../actions/task.actions';
import { isEnterOrNotKeyboardEvent } from '../../../../helpers/is-enter-or-not-keyboard-event';
import { CustomValidators } from '../../../../shared/form/validators/custom-validators';
import { isEnter } from './../../../../helpers/isEnter';

const hasId: <T>(item: T) => boolean = pipe(prop('id'), isNil, not);
const hasMethodOpen = both(complement(isNil), propSatisfies(is(Function), 'open'));
const defaultUser: User = { name: 'Unassigned', id: Math.PI };
const withDefaultUser = defaultTo<User>(defaultUser);

@Component({
  selector: 'modal-task-todos',
  templateUrl: 'task-todos.modal.html',
  styles: [ 'task-todos.modal.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTodosModal {

  @ViewChild(Content) public content: Content;

  @ViewChild('datePicker') public datePicker;

  public dates = { duedate: null, dueDateWasEmpty: true };

  public isTodoListFormVisible = false;

  public todoListForm: FormGroup;

  public todoForm: FormGroup;

  public keyboardHeight = 0;

  public currentUser: any = {};

  public users: User[];

  private assignee = {
    id: `${defaultUser.id}`,
    name: defaultUser.name,
  };

  private task: Task;

  private killer$ = new Subject<any>();

  private prevTodoName: string;

  private prevTodoListName: string;

  private wasPrevTodoDone: boolean;

  private focusTimeoutId: any;

  private datePickerTimeoutId: any;

  private prevTodo = {} as Todo;

  private slidingItem = {} as ItemSliding;

  constructor(
    public platform: Platform,
    private viewCtrl: ViewController,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private detector: ChangeDetectorRef,
    private keyboard: Keyboard,
    private alertCtrl: AlertController
  ) {}

  public ionViewWillLoad(): void {
    this.getTask();
    this.getCurrentUser();
    this.getUsers();
    this.createForms();
    this.resizeAreaUnderKeyboard();
  }

  public ionViewWillUnload(): void {
    this.killer$.next();
  }

  public dismiss(): void {
    this.viewCtrl.dismiss();
  }

  public trackById(_, item): number {
    return prop<number>('id', item);
  }

  public saveTodoList(evt): void {
    if (isEnterOrNotKeyboardEvent(evt)) {
      clearTimeout(this.focusTimeoutId);
      if (this.todoListForm.valid && !this.currentUser.observer) {
        this.isTodoListFormVisible = false;
        const name: string = this.todoListForm.value.name;
        const payload: TaskTodoListParams = merge(this.taskParams, { name });
        this.store.dispatch(addTodoList(payload));
        this.keyboard.close();
      }
      this.todoListForm.reset();
    }
  }

  public dontSaveTodoList(): void {
    this.todoListForm.reset();
    clearTimeout(this.focusTimeoutId);
    this.isTodoListFormVisible = false;
  }

  public getPrevTodoListName(name: string): void {
    this.prevTodoListName = name;
  }

  public updateTodoListName(list: TodoList): void {
    const trimmedName = list.name.trim();
    const listNameChanged = trimmedName !== '' && trimmedName !== this.prevTodoListName;

    if (listNameChanged) {
      const payload: TaskTodoListParams = merge(this.taskParams, { listId: list.id, name: list.name });
      this.store.dispatch(editTodoList(payload));
      this.prevTodoListName = '';
    }
    this.keyboard.close();
  }

  public deleteTodoList(list: TodoList): void {
    if (!this.currentUser.observer) {
      const payload: TaskTodoListParams = merge(this.taskParams, { listId: list.id, todos: list.todos });
      this.store.dispatch(removeTodoList(payload));
    }
  }

  public saveTodo(evt, listId: number, textInput: HTMLAreaElement): void {
    if (isEnterOrNotKeyboardEvent(evt)) {
      const name = trim(pathOr('', ['value', 'name'], this.todoForm));
      if (this.todoForm.valid && name !== '' && !this.currentUser.observer && listId != null) {
        const payload: TaskTodoParams = merge(this.taskParams, { listId, name });
        this.store.dispatch(addTodo(payload));
        this.content.resize();
      }
      this.todoForm.reset();
      this.keyboard.close();
    }
  }

  public getPrevTodo(todo: Todo): void {
    const { name, done } = todo;
    this.prevTodoName = name;
    this.wasPrevTodoDone = done;
  }

  public updateTodo(todo: Todo, options = { isNameUpdate: false }): void {
    const trimmedName = todo.name.trim();
    const nameChanged = trimmedName !== '' && options.isNameUpdate && trimmedName !== this.prevTodoName;
    const isStatusUpdate = !options.isNameUpdate;

    if (nameChanged || isStatusUpdate) {
      const payload: TaskTodoParams = {
        todo,
        todoId: todo.id,
        listId: todo.todo_list_id,
        wasTodoDone: this.wasPrevTodoDone,
        ...this.taskParams,
      };
      this.store.dispatch(editTodo(payload));
      this.prevTodoName = '';
      this.keyboard.close();
    }
  }

  public saveTodoItem(todo, options, event) {
    if (isEnter(event)) {
      event.preventDefault();
      this.updateTodo(todo, options);
      this.keyboard.close();
    }
  }

  public deleteTodo(todo: Todo): void {
    const payload: TaskTodoParams = {
      todo,
      listId: todo.todo_list_id,
      todoId: todo.id,
      wasTodoDone: todo.done,
      ...this.taskParams,
    };
    this.store.dispatch(removeTodo(payload));
  }

  public assignTodo(todo: Todo, item: ItemSliding): void {
    this.slidingItem = item;

    this.getCurrentAssignee(todo);

    const alert = this.alertCtrl.create();

    this.users.forEach(user => {
      alert.addInput({
        type: 'radio',
        label: user.name,
        value: `${user.id}`,
        checked: user.name === this.assignee.name,
      });
    });

    const cancelButton = { text: 'Cancel', handler: () => this.slidingItem.close() };

    const confirmButton = {
      text: 'OK',
      handler: id => {
        const userId = id === `${Math.PI}` ? null : id;
        const newAssignee = this.users.find(user => `${user.id}` ===  userId) || { id: null, name: null };
        const updatedTodo: Todo = { ...todo, user_id: newAssignee.id, assigned: newAssignee.name };
        const payload: TaskTodoParams = {
          ...this.taskParams,
          todo: updatedTodo,
          todoId: todo.id,
          listId: todo.todo_list_id,
        };

        this.slidingItem.close();
        this.store.dispatch(editTodo(payload));
      },
    };

    alert.setTitle('Set Assignee');
    alert.addButton(cancelButton);
    alert.addButton(confirmButton);
    alert.present();
  }

  public setDueDate(todo: Todo, item: ItemSliding): void {
    this.dates.dueDateWasEmpty = !todo.duedate;
    this.slidingItem = item;

    if (this.prevTodo.id !== todo.id) {
      this.dates.duedate = todo.duedate;
      this.prevTodo = { ...todo };
    }

    this.dates.duedate = this.dates.duedate || todo.duedate || new Date().toISOString();

    clearTimeout(this.datePickerTimeoutId);

    const openDatePicker = () => {
      if (hasMethodOpen(this.datePicker)) {
        this.datePicker.open();
      }
    };

    this.datePickerTimeoutId = setTimeout(openDatePicker, 50);
  }

  public resetDueDate(todo: Todo, item: ItemSliding): void {
    this.prevTodo = { ...todo, duedate: null };
    this.dates.dueDateWasEmpty = true;
    this.dates.duedate = null;
    this.slidingItem = item;
    item.close();

    const payload: TaskTodoParams = {
      ...this.taskParams,
      todo: this.prevTodo,
      todoId: todo.id,
      listId: todo.todo_list_id,
    };
    this.store.dispatch(editTodo(payload));
  }

  public selectDate(currDate): void {
    const dateWasDefinedAndChanged = !this.dates.dueDateWasEmpty && this.dates.duedate !== this.prevTodo.duedate;

    if (not(isEmpty(currDate)) && dateWasDefinedAndChanged) {
      this.prevTodo = { ...this.prevTodo, duedate: this.dates.duedate };

      const payload: TaskTodoParams = {
        ...this.taskParams,
        todo: this.prevTodo,
        todoId: this.prevTodo.id,
        listId: this.prevTodo.todo_list_id,
      };

      this.store.dispatch(editTodo(payload));
    }

    this.dates.dueDateWasEmpty = false;
    this.slidingItem.close();
  }

  public cancelDateSelection(): void {
    this.dates.duedate = null;
    this.dates.dueDateWasEmpty = true;
    this.prevTodo = {} as Todo;
    this.slidingItem.close();
  }

  public changeTodoStatus(todo: Todo): void {
    this.getPrevTodo(todo);
    todo.done = !todo.done;
    this.updateTodo(todo);
  }

  public showTodoListForm(listNameInput: TextInput): void {
    this.isTodoListFormVisible = true;
    this.focusTimeoutId = setTimeout(() => listNameInput.setFocus(), 500);
  }

  public saveNew(event: KeyboardEvent) {
    if (isEnter(event)) {
      event.stopPropagation();
      event.preventDefault();
      this.saveTodoList(event);
    }
  }

  public updateTaskName(event: KeyboardEvent, list) {
    if (isEnter(event)) {
      event.stopPropagation();
      event.preventDefault();
      this.updateTodoListName(list);
    }
  }

  private createForms(): void {
    this.todoForm = this.fb.group({
      name: [ '', CustomValidators.required('Todo list') ],
    });

    this.todoListForm = this.fb.group({
      name: [ '', CustomValidators.required('Todo list name') ],
    });
  }

  private getTask(): void {
    this.selectFromStore<Task>('task', 'fetchTask', 'value')
      .subscribe(task => {
        this.task = clone(task);
        this.detector.markForCheck();
      });
  }

  private getCurrentUser(): void {
    this.selectFromStore('user', 'fetchCurrentUser', 'value')
      .subscribe(user => {
        this.currentUser = user;
        this.detector.markForCheck();
      });
  }

  private getUsers(): void {
    this.store.select<User[]>('task', 'fetchDashboardUsers', 'value')
      .takeUntil(this.killer$)
      .subscribe(users => {
        this.users = [ defaultUser, ...users ];
        this.detector.markForCheck();
      });
  }

  private getCurrentAssignee(todo: Todo): void {
    const userByName: (user: User) => boolean = propEq<string>('name', todo.assigned);

    const assignee: User = withDefaultUser(find(userByName, this.users));

    this.assignee.name = assignee.name;
    this.assignee.id = `${assignee.id}`;
  }

  private selectFromStore<T>(...path: string[]): Observable<T> {
    return this.store
      .select<T>(...path)
      .filter(hasId)
      .takeUntil(this.killer$);
  }

  private get taskParams(): TaskTodoListParams {
    return {
      projectId: this.task.project_id,
      swimlaneId: this.task.swimlane_id,
      stageId: this.task.stage_id,
      taskId: this.task.id,
      dueDateBlock: this.task.duedate_block,
    };
  }

  private resizeAreaUnderKeyboard() {
    this.keyboard.onKeyboardShow().takeUntil(this.killer$).subscribe((event) => {
      this.keyboardHeight = event.keyboardHeight + 20;
    });

    this.keyboard.onKeyboardHide().takeUntil(this.killer$).subscribe((event) => {
      this.keyboardHeight = 0;
    });
  }
}
