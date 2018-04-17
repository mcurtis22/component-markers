import { Injectable, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { ComponentMarkerComponent } from './component-marker.component';
import { IComponentMarker } from './util/component-marker.interface';
import { TypedMarker } from './util/typed-marker.class';
import { ComponentizedMarker } from './util/componentized-marker.class';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ComponentMarkerFactoryService {
  public markersToBeCompiled: TypedMarker[] = [];

  private _vcRef: ViewContainerRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  public set vcRef(vcr: ViewContainerRef) {
    this._vcRef = vcr;
  }

  public get vcRef(): ViewContainerRef {
    return this._vcRef;
  }

	public compileMarker(marker: TypedMarker): Observable<ComponentRef<ComponentMarkerComponent>> {
		const observable = Observable.create( (obs: Observer<any>) => {

		  if (!this._vcRef) {
		    obs.error('Target ViewContainerRef needs to be defined before compiling.');
		    return;
      }

			const componentFactory = this.componentFactoryResolver.resolveComponentFactory(marker.component);
			let componentRef = this._vcRef.createComponent(componentFactory);

			//Using EventEmitters to avoid throwing exceptions pertaining to Angular change detection

			componentRef.instance.onViewInit.subscribe(( isCompiled: boolean ) => {
				let instance = componentRef.instance as IComponentMarker;

				instance.index = marker.index;
				instance.showIndex = marker.showIndex || marker.index > 0;

				if ( isCompiled ) {
					instance.compiled = true;
					componentRef.changeDetectorRef.detectChanges();
          obs.next(componentRef);
					obs.complete();
				}
			});
		});
		return observable;
	}

}
