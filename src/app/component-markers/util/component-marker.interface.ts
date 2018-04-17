import { EventEmitter } from '@angular/core';

export interface IComponentMarker {
	compiled: boolean;
	index?: number;
	showIndex?: boolean;
	onViewInit: EventEmitter<any>;
	onExpand: EventEmitter<any>;
	onCollapse: EventEmitter<any>;
	onLeafletEvent: ((event: L.Event) => void);
	expandMarker: (() => void);
	collapseMarker: (() => void);
}
