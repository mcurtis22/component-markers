import { EventEmitter } from '@angular/core';

export interface IComponentMarker {
	compiled: boolean;
	index?: number;
	showIndex?: boolean;
	body?: string;
	onViewInit: EventEmitter<any>;
	onExpand: EventEmitter<any>;
	onCollapse: EventEmitter<any>;
	onRemove: EventEmitter<any>;
	onLeafletEvent: ((event: L.Event) => void);
	expandMarker: (() => void);
	collapseMarker: (() => void);
}
