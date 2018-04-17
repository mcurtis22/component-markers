import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable()
export class DemoMapService {
	static defaultIcon: L.Icon;
	static defaultDivIconOptions: L.DivIconOptions;

	private readonly LEAFLET_MAP_MARKER = 'leaflet/marker-icon.png';
	private readonly LEAFLET_MAP_SHADOW = 'leaflet/marker-shadow.png';


		constructor() {
			L.Icon.Default.mergeOptions({
				iconUrl: `${window.location.origin}/${this.LEAFLET_MAP_MARKER}`,
				shadowUrl: `${window.location.origin}/${this.LEAFLET_MAP_SHADOW}`
			});
			DemoMapService.defaultIcon = new L.Icon(L.Icon.Default.prototype.options as L.IconOptions);
			DemoMapService.defaultDivIconOptions = {
				className: 'collapsed',
				iconAnchor: null,
				iconSize: null
			} as L.DivIconOptions ;
		}

		static getDivIcon(options: L.DivIconOptions = {}): L.DivIcon {
			const opt = Object.assign(DemoMapService.defaultDivIconOptions, options);
			return new L.DivIcon(opt);
		}

}
