import { BrowserModule } 	         from '@angular/platform-browser';
import { NgModule } 		           from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppComponent } 	         from './app.component';
import { HttpClientModule }	       from '@angular/common/http';
import { RouterModule, Routes }    from '@angular/router';

/* Components */
import { SearchComponent }	       from './search.component';
import { AboutComponent }          from './about.component';
import { SearchBarComponent }      from './search-bar.component';
import { GuitarComponent }         from './guitar.component';
import { GuitarImageComponent }    from './guitar-image.component';

/* Service Imports */
import { GuitarService }	         from './guitar.service';

const appRoutes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'About', component: AboutComponent },
  { path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  { path: '**',
    redirectTo: '',
    pathMatch: 'full'
  },
];

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    AboutComponent,
    SearchBarComponent,
    GuitarComponent,
    GuitarImageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
  	GuitarService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
