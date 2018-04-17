import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { DemoMapComponent } from './demo-map.component';
import { ComponentMarkersModule } from './../component-markers/component-markers.module';

@NgModule({
  imports: [
    CommonModule,
		LeafletModule,
		ComponentMarkersModule
  ],
  declarations: [
		DemoMapComponent
	],
	exports: [
		DemoMapComponent
	],
	providers: [
		
	]
})
export class DemoMapModule { }
