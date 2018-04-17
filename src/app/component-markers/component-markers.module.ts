import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentMarkerFactoryService } from './component-marker-factory.service';
import { ComponentMarkerComponent } from './component-marker.component';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ ComponentMarkerComponent ],
  entryComponents: [ComponentMarkerComponent],
	exports: [ ComponentMarkerComponent ],
	providers: [ComponentMarkerFactoryService]
})
export class ComponentMarkersModule { }
