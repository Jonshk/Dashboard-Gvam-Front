import { Directive, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

@Directive({
  standalone:true,
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<Event>();
  constructor(private elementRef: ElementRef) {}
    
  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement) {
      return;
    }
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
        this.clickOutside.emit(event);
    }
  }
}