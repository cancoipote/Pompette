import { Component, OnInit }                                                            from '@angular/core';
import { MatSliderModule }                                                              from '@angular/material/slider';
import { MatButtonModule }                                                              from '@angular/material/button';
import { MatCardModule }                                                                from '@angular/material/card';
import { MatFormFieldModule }                                                           from '@angular/material/form-field';
import { ThemePalette }                                                                 from '@angular/material/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators }                    from '@angular/forms';
import { MatInputModule }                                                               from '@angular/material/input';
import { CommonModule }                                                                 from '@angular/common';  
import { MatDialog }                                                                    from '@angular/material/dialog';
import { MatSidenavModule }                                                             from '@angular/material/sidenav';
import { MatListModule }                                                                from '@angular/material/list';
import { MatExpansionModule }                                                           from '@angular/material/expansion';
import { MatIconModule }                                                                from '@angular/material/icon';


import { AppService }                                                                   from '../../../../core/service/app.service';
import { ServerService }                                                                from '../../../../core/service/server.service';
import { FixtureComponent }                                                             from '../../../fixture/component/fixture/fixture.component';
import { FixtureService }                                                               from '../../../fixture/service/fixture.service';
import { Fixture }                                                                      from '../../../fixture/vo/fixture';
import { PopupComponent }                                                               from '../../../../commons/popup/popup.component';


/**
 * Project Show page Component
 * 
 * Show page of the site
 */
@Component({
    selector: 'project-show',
    templateUrl: './project.show.component.html',
    styleUrls: ['./project.show.component.css'],
    standalone: true,
    imports: [
        MatSliderModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        MatSidenavModule,
        MatListModule,
        MatExpansionModule,
        MatIconModule,
        FixtureComponent,
        
    ]
})
export class ProjectShowComponent implements OnInit {

    /**
    * Constructor
    * 
    */
    constructor
    (
        public appService: AppService,
		public server: ServerService,
        public fixtureService:FixtureService,
        private dialog: MatDialog
    ) 
    { }
    
    /**
     * Display menu or not
     */
    public display_menu:boolean = true;

    /**
    * Initialisation
    * 
    */
    ngOnInit(): void 
    {
    }    


    /**
    * Actions
    * 
    */

   
}