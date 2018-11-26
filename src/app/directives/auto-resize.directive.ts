import { Directive, HostListener, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[autoresize]',
})
export class AutoResizeDirective implements AfterViewInit, OnDestroy {
  private timeoutId: any;

  constructor(private el: ElementRef) {}

  @HostListener('input')
  public onInput(): void {
    this.adjust();
  }

  public ngAfterViewInit(): void {
    this.adjust();
    this.timeoutId = setTimeout(() => {
      // The real <textarea> takes some time to get rendered with the full text
      this.setHeight();
    }, 150);
  }

  public ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
  }

  private adjust(): void {
    if (this.textArea != null) {
      this.textArea.style.overflow = 'hidden';
      this.textArea.style.height = 'auto';
      this.setHeight();
    }
  }

  private setHeight(): void {
    if (this.textArea != null) {
      this.textArea.style.height = `${this.textArea.scrollHeight}px`;
    }
  }

  private get textArea(): HTMLTextAreaElement {
    return this.el.nativeElement.querySelector('textarea') || this.el.nativeElement;
  }

}
