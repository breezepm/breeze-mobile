import {
  Component, OnInit, AfterViewChecked, Input, Output,
  EventEmitter, ElementRef, ChangeDetectionStrategy,
  OnChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NewTask } from './../../actions/project.actions';

@Component({
  selector: 'br-task-form',
  templateUrl: 'task-form.component.html',
  styles: [ 'task-form.componet.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent implements OnInit, AfterViewChecked, OnChanges {

  @Input() public isUserObserver: boolean;

  @Input() public swimlaneId: number;

  @Input() public stageId: number;

  @Input() public addLast = false;

  @Input() public isExtClose = false;

  @Output() public onSubmit: EventEmitter<NewTask> = new EventEmitter();

  @Output() public onFocusOut: EventEmitter<any> = new EventEmitter();

  public taskForm: FormGroup;

  private isFocused: boolean;

  private fieldIsVisible: boolean;

  constructor(private fb: FormBuilder, private el: ElementRef) { }

  public ngOnInit(): void {
    this.buildForm();
    this.resetFieldVisibility();
  }

  public ngAfterViewChecked(): void {
    if (this.textArea && !this.isFocused) {
      this.isFocused = true;
      this.textArea.focus();
    }
  }

  public showNewTaskField(): void {
    this.isFieldVisible = true;
  }

  public addNewTask(evt: KeyboardEvent): void {
    if (evt.type === 'text') {
      this.onFocusOut.emit();
    }

    const IS_KEYBOARD_EVENT: boolean = evt.type.toLocaleLowerCase() === 'keyup';
    const IS_ENTER_KEY: boolean = evt.keyCode === 13;

    if ((IS_KEYBOARD_EVENT && IS_ENTER_KEY) || !IS_KEYBOARD_EVENT) {
      this.dispatchToParent(this.taskForm.value.taskName);
      this.onFocusOut.emit();
    }
  }

  public get isFieldVisible(): boolean {
    return this.fieldIsVisible;
  }

  public set isFieldVisible(value: boolean) {
    this.fieldIsVisible = value;
  }

  public ngOnChanges(change: any) {
    if (!!change.isExtClose.currentValue) {
      this.fieldIsVisible = false;
      this.isFocused = false;
    }
  }

  private buildForm() {
    this.taskForm = this.fb.group({ taskName: ['', Validators.required ] });
  }

  private get textArea(): HTMLTextAreaElement {
    return this.el.nativeElement.querySelector('textarea');
  }

  private resetFieldVisibility(): void {
    this.isFieldVisible = false;
    this.isFocused = false;
  }

  private dispatchToParent(taskName: string): void {
    this.resetFieldVisibility();
    const name: string = taskName != null ? taskName.trim() : '';

    if (name !== '') {
      this.onSubmit.emit({
        name,
        stageId: this.stageId,
        swimlaneId: this.swimlaneId,
        projectId: null,
        addLast: this.addLast,
      });
    }

    this.taskForm.reset();
  }
}
