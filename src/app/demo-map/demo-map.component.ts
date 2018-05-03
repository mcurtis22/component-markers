import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewContainerRef
} from '@angular/core';
import * as L from 'leaflet';
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { ComponentMarkerFactoryService } from '../component-markers/component-marker-factory.service';
import { ComponentMarkerComponent } from '../component-markers/component-marker.component';
import { IComponentMarker } from '../component-markers/util/component-marker.interface';
import { ComponentizedMarker } from '../component-markers/util/componentized-marker.class';
import { TypedMarker } from '../component-markers/util/typed-marker.class';

const DEFAULT_TILE_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const DEFAULT_TILE_LAYER_ATTRIBUTION = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';

@Component({
	selector: 'app-demo-map',
	templateUrl: './demo-map.component.html',
	styleUrls: ['./demo-map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoMapComponent implements OnInit, OnDestroy {

	@Output('onMarkerMouseOver') public markerMouseOver: EventEmitter<IComponentMarker> = new EventEmitter<IComponentMarker>();
	@Output('onMarkerMouseOut') public markerMouseOut: EventEmitter<IComponentMarker> = new EventEmitter<IComponentMarker>();
	@Output('onMarkerMouseClick') public markerClick: EventEmitter<IComponentMarker> = new EventEmitter<IComponentMarker>();

	public divIconOptions =   {
		className: 'collapsed',
		iconAnchor: null,
		iconSize: null
	} as L.DivIconOptions ;
	public leafletMap: L.Map;
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
	public markers: IComponentMarker[] = [];

	private _resizeSub: Subscription;
	private _compilationSub: Subscription = new Subscription();
	private markerIndex = 0;

	constructor(
		private componentMarkerFactoryService: ComponentMarkerFactoryService,
		private renderer: Renderer2,
		private vcRef: ViewContainerRef

	) {}

	ngOnInit() {
		this.componentMarkerFactoryService.vcRef = this.vcRef;
	}

	ngOnDestroy() {
		this._resizeSub.unsubscribe();
		this._compilationSub.unsubscribe();
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
		this._compilationSub.add(this.componentMarkerFactoryService.compileMarker(marker).subscribe( (markerComponentRef: ComponentRef<IComponentMarker>) => {
		  this.addCompiledMarkerToMap(markerComponentRef);
		}));
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
		let componentizedMarker = this.addMarker(compRef) as ComponentizedMarker;
		this.initializeMarkerEvents(componentizedMarker);

    setTimeout(() => {
      componentizedMarker.componentRef.instance.body = ''+Date.now();
    });

    let element: HTMLElement = componentizedMarker.componentRef.location.nativeElement;
		this.renderer.appendChild(componentizedMarker.getElement(), element);
		this.markers.push(componentizedMarker.componentRef.instance);
	}

	sendLeafletEventToComponent( event: L.Event ) {
		let marker: any = _.get(event, 'target.componentRef._component');
		marker.onLeafletEvent(event);
	}

	emitLeafletEvent( emitter: EventEmitter<IComponentMarker>, event: L.Event ) {
		let marker: any = _.get(event, 'target.componentRef._component');
		emitter.emit(marker);
	}

	initializeMarkerEvents(componentizedMarker: ComponentizedMarker) {
    let element: HTMLElement = componentizedMarker.componentRef.location.nativeElement;

    //Send all events to the component
    componentizedMarker.on({
        'mouseover': ( event: L.Event ) => {
          this.sendLeafletEventToComponent(event);
          this.emitLeafletEvent(this.markerMouseOver, event);
        },
        'mouseout': ( event: L.Event ) => {
          this.sendLeafletEventToComponent(event);
          this.emitLeafletEvent(this.markerMouseOut, event);
        },
        'click': ( event: L.Event ) => {
          this.sendLeafletEventToComponent(event);
          const domEvent: Event = _.get(event, 'originalEvent', null);
          if ( domEvent && !domEvent.defaultPrevented ) {
            this.emitLeafletEvent(this.markerClick, event);
          }
        },
        'remove': () => {
          this.renderer.removeChild(componentizedMarker.getElement(), element);
          componentizedMarker.componentRef.destroy();
          this.markers.splice(this.markers.indexOf(componentizedMarker.componentRef.instance), 1);
        }
      });

    //Listen to the remove function from the marker but handle it via Leaflet's hook
    componentizedMarker.componentRef.instance.onRemove.subscribe( () => {
      componentizedMarker.removeFrom(this.leafletMap);
    });
  }


}
