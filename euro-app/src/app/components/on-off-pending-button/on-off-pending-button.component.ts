import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-on-off-pending-button',
  templateUrl: './on-off-pending-button.component.html',
  styleUrls: ['./on-off-pending-button.component.scss']
})
export class OnOffPendingButtonComponent implements OnInit {

  private _value: boolean = false;

  @Input()
  get value(): boolean { return this._value;}
  set value(val: boolean) { 
    this.isPending = false;
    this._value = val;
  }

  @Input()
  clickWhenOn = true;
  

  @Output()
  change = new EventEmitter<boolean>();

  isPending: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggle() {
    if (!this.clickWhenOn && this._value) return;

    this.isPending = true;
    this.change.emit(!this._value);
  }

}
