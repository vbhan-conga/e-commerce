import { Directive, AfterViewInit, ElementRef } from '@angular/core';
/**
 * Auto Focus directive for focusing on elements after the view has been loaded.
 * @example
 * <input type="text" appAutoFocus/>
 */
@Directive({
  selector: '[appAutoFocus]'
})
export class AutoFocusDirective implements AfterViewInit {
  constructor(private element: ElementRef) {}

  ngAfterViewInit() {
    this.element.nativeElement.focus();
  }
}