import { CUSTOM_ELEMENTS_SCHEMA, NgModule }                                                   from '@angular/core';
import { BrowserModule, provideClientHydration }                                              from '@angular/platform-browser';

import { AppRoutingModule }                                                                   from './app-routing.module';
import { AppComponent }                                                                       from './app.component';
import { provideAnimationsAsync }                                                             from '@angular/platform-browser/animations/async';

import { MatButtonModule }                                                                    from '@angular/material/button';
import { MatCheckboxModule }                                                                  from '@angular/material/checkbox';
import { MatSelectModule }                                                                    from '@angular/material/select';
import { MatSnackBarModule }                                                                  from '@angular/material/snack-bar';
import { MatMenuModule }                                                                      from '@angular/material/menu';
import { MatInputModule }                                                                     from '@angular/material/input';
import { MatIconModule }                                                                      from '@angular/material/icon';
import { MatDatepickerModule }                                                                from '@angular/material/datepicker';
import { MatFormFieldModule }                                                                 from '@angular/material/form-field';
import { MatRadioModule }                                                                     from '@angular/material/radio';
import { MatSidenavModule }                                                                   from '@angular/material/sidenav';
import { MatToolbarModule }                                                                   from '@angular/material/toolbar';
import { MatListModule }                                                                      from '@angular/material/list';
import { MatGridListModule }                                                                  from '@angular/material/grid-list';
import { MatCardModule }                                                                      from '@angular/material/card';
import { MatStepperModule }                                                                   from '@angular/material/stepper';
import { MatTabsModule }                                                                      from '@angular/material/tabs';
import { MatExpansionModule }                                                                 from '@angular/material/expansion';
import { MatButtonToggleModule }                                                              from '@angular/material/button-toggle';
import { MatChipsModule }                                                                     from '@angular/material/chips';
import { MatProgressSpinnerModule }                                                           from '@angular/material/progress-spinner';
import { MatProgressBarModule }                                                               from '@angular/material/progress-bar';
import { MAT_DIALOG_DATA, MatDialogRef }                                                      from '@angular/material/dialog';
import { MatDialogModule }                                                                    from '@angular/material/dialog';

import { MatTooltipModule }                                                                   from '@angular/material/tooltip';
import { MatTableModule }                                                                     from '@angular/material/table';
import { MatSortModule }                                                                      from '@angular/material/sort';
import { MatPaginatorModule }                                                                 from '@angular/material/paginator';
import { MatAutocompleteModule }                                                              from '@angular/material/autocomplete';
import { MatNativeDateModule, MatDateFormats, DateAdapter }                                   from '@angular/material/core';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS }                                                  from '@angular/material/core';
import { ReactiveFormsModule } 									                                              from '@angular/forms';
import { CommonModule } 					                                                            from '@angular/common';
import { MatCommonModule }                                                                    from '@angular/material/core';
import { MatDividerModule}                                                                    from '@angular/material/divider';
import {MatSliderModule}                                                                      from '@angular/material/slider';

import { NgxColorsModule }                                                                    from 'ngx-colors';

import { ServerService }                                                                      from './core/service/server.service';
import { AppService }                                                                         from './core/service/app.service';
import { SharedModule }                                                                       from './core/shared/shared.module';
import { ProjectService }                                                                     from './modules/project/service/project.service';
import { FixtureService }                                                                     from './modules/fixture/service/fixture.service';
import { CommonsService }                                                                     from './core/service/commons.service';
import { Engine }                                                                             from './core/engine/engine';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 

    // Material
    MatSliderModule,
    MatButtonModule, 
    MatCheckboxModule,
    MatSelectModule,
    MatSnackBarModule,
    MatMenuModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    CommonModule,
    MatCommonModule,
    MatDividerModule,
    MatSnackBarModule,

    NgxColorsModule,

    SharedModule.forRoot(),
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),   
    AppService,
    CommonsService,
    ServerService,
    ProjectService,
    FixtureService,
    Engine
  ],
  schemas: 
    [ 
    	CUSTOM_ELEMENTS_SCHEMA 
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
