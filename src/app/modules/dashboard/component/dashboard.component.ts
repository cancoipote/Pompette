import { Component, OnInit }                                                            from '@angular/core';
import { AppService }                                                                   from '../../../core/service/app.service';
import { ServerService }                                                                from '../../../core/service/server.service';
import {MatSliderModule}                                                                from '@angular/material/slider';
import { MatButtonModule }                                                              from '@angular/material/button';
import { MatCardModule }                                                                from '@angular/material/card';
import { MatFormFieldModule }                                                           from '@angular/material/form-field';
import { ThemePalette }                                                                 from '@angular/material/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators }         from '@angular/forms';
import { MatInputModule }                                                               from '@angular/material/input';
import { CommonModule }                                                                 from '@angular/common';  
import { MatDialog }                                                                    from '@angular/material/dialog';
import { NgxColorsModule }                                                              from 'ngx-colors';
import { MatTabsModule }                                                                from '@angular/material/tabs';

import { PopupComponent }                                                               from '../../../commons/popup/popup.component';
import { Project }                                                                      from '../../project/vo/project';
import { CommonsService }                                                               from '../../../core/service/commons.service';
import { ProjectService }                                                               from '../../project/service/project.service';
import { ProjectFixtureComponent }                                                      from '../../project/component/fixture/project.fixture.component';
import { ProjectSequenceComponent }                                                     from '../../project/component/sequence/project.sequence.component';
import { ProjectShowComponent }                                                         from '../../project/component/show/project.show.component';
/**
 * Dashboard Component
 * 
 * Dashboard of the site
 */
@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: [ './dashboard.component.css' ],
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
        NgxColorsModule,
        MatTabsModule,
        ProjectFixtureComponent,
        ProjectSequenceComponent,
        ProjectShowComponent
        ],
})
export class DashboardComponent implements OnInit {

    /**
    * Constructor
    * 
    */
    constructor
    (
        public appService: AppService,
		public server: ServerService,
        public projectService:ProjectService,
        private dialog: MatDialog
    ) 
    { }


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

    /**
     * Create a new Project
     */
    public createNewProject()
    {
        let message:string = "<p>Please enter a name for your new Project</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:'Create Project', 
                    content:message,
                    yes_button_label:"Create",
                    no_button_label:"Cancel",
                    cancel_button_label:"Cancel",
                    mode_question:false,
                    mode_prompt:true,
                    mode_prompt_type:"text",
                    prompt_value:"Project's name",
                    disable_cancel:false,
                    prompt:'' 
                }
            }
        );

        dialogRef.afterClosed().subscribe
        (
            result => 
            {               
                if( result )
                {
                    if( result.value )
                    {
                        if( result.value == null )
                        {
                            //
                        }
                        else
                        {
                            if( result.value == "" || result.value == " ")
                            {
                                //
                            }
                            else
                            {

                                if( CommonsService.isAlphanumeric( result.value ) )
                                {
                                    this.appService.project             = new Project();
                                    this.appService.project.label       = result.value;
                                    this.appService.project.version     = this.appService.version;
                                    this.appService.is_project          = true;
                                }
                                else
                                {
                                    let message_error:string = "The project's name can only contains alpha numeric characters";
                                    this.dialog.open
                                    (
                                        PopupComponent, 
                                        {
                                            disableClose:true,
                                            width:  '555px',
                                            data: 
                                            { 
                                                title_label:'Error', 
                                                content:message_error,
                                                mode_question:false,
                                                mode_prompt:false,
                                                mode_prompt_type:"text",
                                                prompt_value:"Project's name",
                                                disable_cancel:true,
                                                display_close:true,
                                                display_cancel:false,
                                                prompt:'' 
                                            }
                                        }
                                    );
                                }
                            }
                        }
                    }
                }
            }
        );
    }

    /**
     * Load project
     */
    public loadProject(  event:any )
    {
        this.projectService.openProject( event );
    }
}