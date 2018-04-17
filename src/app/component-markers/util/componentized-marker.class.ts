import { ComponentRef } from '@angular/core';
import { IComponentMarker } from './component-marker.interface';
import * as L from 'leaflet';

export class ComponentizedMarker extends L.Marker {
	public componentRef: ComponentRef<IComponentMarker>;
}
