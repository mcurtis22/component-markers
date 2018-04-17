import { Type } from '@angular/core';

export class TypedMarker  {
  constructor(
    public component: Type<any>,
    public index?: number,
    public showIndex?: boolean,
  ) {}
}
