import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Directive({
  selector: 'img[altImage]'
})
export class AltImageDirective {
  @Input('altImage')
  altImage?: string;


  effectiveAltImage$ = new BehaviorSubject('assets/guest.png');

  @HostListener('error')
  onError() {
    const fallback = this.altImage || 'assets/guest.png';
    const element = this.eRef.nativeElement as HTMLImageElement;

    element.src = fallback;
  }


  constructor(private eRef: ElementRef) { }

}
