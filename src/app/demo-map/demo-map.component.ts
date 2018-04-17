import { Component, ComponentRef, EventEmitter, OnDestroy, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import * as L from 'leaflet';
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { ComponentMarkerFactoryService } from '../component-markers/component-marker-factory.service';
import { ComponentMarkerComponent } from '../component-markers/component-marker.component';
import { TypedMarker } from '../component-markers/util/typed-marker.class';
import { IComponentMarker } from '../component-markers/util/component-marker.interface';
import { ComponentizedMarker } from '../component-markers/util/componentized-marker.class';
import { DemoMapService } from './demo-map.service';

const DEFAULT_TILE_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const DEFAULT_TILE_LAYER_ATTRIBUTION = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';

@Component({
  selector: 'app-demo-map',
  templateUrl: './demo-map.component.html',
  styleUrls: ['./demo-map.component.css'],
	providers: [ DemoMapService ]
})
export class DemoMapComponent implements OnInit, OnDestroy {

	public leafletMap: L.Map;
	public leafletMarkers: L.Marker[] = [];
	public leafletOptions: any = L.Map.mergeOptions({
		center: new L.LatLng(38.991709, -76.886109),
		zoom: 10,
		layers: [
			L.tileLayer(DEFAULT_TILE_LAYER, {
				 maxZoom: 18,
				 attribution: DEFAULT_TILE_LAYER_ATTRIBUTION
			 })
		 ]
	 }).prototype.options;

	public divIconOptions =   {
    className: 'collapsed',
    iconAnchor: null,
    iconSize: null
  } as L.DivIconOptions ;

  private _resizeSub: Subscription;
	private compiledMarkers: Map<number, ComponentizedMarker> = new Map();
	private markerIndex = 0;

  constructor(
		private componentMarkerFactoryService: ComponentMarkerFactoryService,
		private renderer: Renderer2,
    private vcRef: ViewContainerRef
	) { }

  ngOnInit() {
    this.componentMarkerFactoryService.vcRef = this.vcRef;
	}

	ngOnDestroy() {
		this._resizeSub.unsubscribe();
	}

	onMapReady(map: L.Map) {
		this.leafletMap = map;

		const resizeObservable = Observable.fromEvent(this.leafletMap, 'resize');
		this._resizeSub = resizeObservable.subscribe( () => this.leafletMap.invalidateSize() );
		this.leafletMap.options = this.leafletOptions;
		this.leafletMap.addLayer(this.leafletOptions.layers[0]);
	}

	getRandomCoordinatesInBounds(): [number, number] {
		const center = this.leafletMap.getCenter();
		const {_northEast, _southWest} = (this.leafletMap.getBounds() as any);
		const [maxLat, minLat] = [_northEast.lat, _southWest.lat];
		const [maxLng, minLng] = [_northEast.lng, _southWest.lng];
		const [latRange, lngRange] = [(maxLat - minLat) * 0.5, (maxLng - minLng) * 0.5];
		return [Math.random() * latRange + center.lat, Math.random() * lngRange + center.lng];
	}

	createMarker(): void {
    const marker = new TypedMarker(ComponentMarkerComponent, ++this.markerIndex);
		this.componentMarkerFactoryService.compileMarker(marker).subscribe( (markerComponentRef: ComponentRef<IComponentMarker>) => {
		  console.log(markerComponentRef);
		  this.addCompiledMarkerToMap(markerComponentRef);
    });
	}

  addMarker( compRef: ComponentRef<IComponentMarker> = null,
             coordinates: [ number, number ] = this.getRandomCoordinatesInBounds(),
             icon: L.Icon | L.DivIcon = new L.DivIcon(this.divIconOptions) ): L.Marker {
    let marker = new ComponentizedMarker(coordinates, {icon: icon});
    marker.componentRef = compRef;
    marker.options.riseOnHover = true;
    marker.options.riseOffset = 500;
    marker = marker.addTo(this.leafletMap);
    return marker;
  }

	addCompiledMarkerToMap( compRef: ComponentRef<IComponentMarker>) {
		const markerInstance = (compRef.instance as IComponentMarker);
		let element: HTMLElement = compRef.location.nativeElement;
		let componentMarker = this.addMarker(compRef) as ComponentizedMarker;

		//Send all events to the component
		componentMarker.on({
				'mouseover': ( event: L.Event ) => {
					this.sendLeafletEventToComponent(event);
					// this.emitLeafletEvent(this.markerMouseOver, event);
				},
				'mouseout': ( event: L.Event ) => {
					this.sendLeafletEventToComponent(event);
					// this.emitLeafletEvent(this.markerMouseOut, event);
				},
				'click': ( event: L.Event ) => {
					this.sendLeafletEventToComponent(event);
					const domEvent: Event = _.get(event, 'originalEvent', null);
					if ( domEvent && !domEvent.defaultPrevented ) {
						// this.panToMarker(event);
						// this.emitLeafletEvent(this.markerClicked, event);
					}
				},
				'remove': () => {
					this.renderer.removeChild(componentMarker.getElement(), element);
				}
			}
		);
		this.renderer.appendChild(componentMarker.getElement(), element);
		const mapMarker = componentMarker.componentRef.instance;
		this.compiledMarkers.set(mapMarker.index, componentMarker);
	}


	onMarkerCreated(ref: ComponentRef<any>) {
		if ( _.get(ref, 'location.nativeElement') ) {
			this.addCompiledMarkerToMap(ref);
		}
	}

	onMarkerFocused(ref: ComponentRef<any>) {
		let coords: any = _.get(ref, 'instance.location.coordinates');
		let latlon = new L.LatLng(coords.lat, coords.lon);
	}

	onMarkerExpanded(ref: ComponentRef<any>) {
		let compiledMarker = (this.compiledMarkers.get(ref.instance.index) as ComponentizedMarker);
		if (compiledMarker) {
			compiledMarker.setZIndexOffset(500);
		}
	}

	onMarkerCollapsed(ref: ComponentRef<any>) {
		let compiledMarker = (this.compiledMarkers.get(ref.instance.index) as ComponentizedMarker);
		if (compiledMarker) {
			compiledMarker.setZIndexOffset(0);
		}
	}

	sendLeafletEventToComponent( event: L.Event ) {
		let marker: any = _.get(event, 'target.componentRef._component');
		marker.onLeafletEvent(event);
	}

	emitLeafletEvent( emitter: EventEmitter<any>, event: L.Event ) {
		let marker: any = _.get(event, 'target.componentRef._component');
		emitter.emit(marker);
	}

}
