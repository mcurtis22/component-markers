import { Component, IterableDiffers, ViewChild } from '@angular/core';
import * as L from "leaflet";
import { DemoMapComponent } from './demo-map/demo-map.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'Component Markers Demo';
	@ViewChild(DemoMapComponent) demoMap: DemoMapComponent;


  private readonly LEAFLET_MAP_MARKER = 'leaflet/marker-icon.png';
  private readonly LEAFLET_MAP_SHADOW = 'leaflet/marker-shadow.png';

	constructor() {
    L.Icon.Default.mergeOptions({
      iconUrl: `${window.location.origin}/${this.LEAFLET_MAP_MARKER}`,
      shadowUrl: `${window.location.origin}/${this.LEAFLET_MAP_SHADOW}`
    });
  }




  handleMarkerClick() {

  }

  handleMarkerOut() {

  }

  handleMarkerOver() {

  }
}
