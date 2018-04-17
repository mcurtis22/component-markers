import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DemoMapModule } from './demo-map/demo-map.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';


import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
		DemoMapModule,
		LeafletModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
