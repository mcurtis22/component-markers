import { AfterViewInit, Component, DoCheck, OnInit } from '@angular/core';
import { EventEmitter, ChangeDetectorRef } from '@angular/core';
import * as L from 'leaflet';
import { IComponentMarker } from './util/component-marker.interface';

@Component({
selector: 'app-component-marker',
templateUrl: './component-marker.component.html',
styleUrls: ['./component-marker.component.css']
})
export class ComponentMarkerComponent implements IComponentMarker, AfterViewInit, DoCheck {
  public compiled: boolean = false;
  public expanded: boolean = false;
  public showIndex: boolean = true;
  public index: number;
  public onViewInit: EventEmitter<any> = new EventEmitter();
  public onExpand: EventEmitter<any> = new EventEmitter();
  public onCollapse: EventEmitter<any> = new EventEmitter();



  constructor(
    public changeDetectorRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.onViewInit.emit(true);
  }

  ngDoCheck() {
    if (!this.compiled) {
      this.onViewInit.emit(false);
    }
  }

  public onLeafletEvent(event: L.Event): void {
    const eventType = event.type;

    switch (eventType) {
      case 'mouseover':
        this.expandMarker();
        break;
      case 'mouseout':
        this.collapseMarker();
        break;
      default:
        break;
    }
  }

  public expandMarker(): void {
    this.expanded = true;
    this.onExpand.emit();
    this.changeDetectorRef.detectChanges();
  }

  public collapseMarker(): void {
    this.expanded = false;
    this.onCollapse.emit();
    this.changeDetectorRef.detectChanges();
  }

}
