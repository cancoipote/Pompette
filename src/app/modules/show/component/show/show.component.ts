import { Component, OnInit, Input, OnChanges ,  Output, EventEmitter, SimpleChange  }   from '@angular/core';
import { MatSliderModule }                                                              from '@angular/material/slider';
import { MatButtonModule }                                                              from '@angular/material/button';
import { MatCardModule }                                                                from '@angular/material/card';
import { MatFormFieldModule }                                                           from '@angular/material/form-field';
import { ThemePalette }                                                                 from '@angular/material/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators }         from '@angular/forms';
import { MatInputModule }                                                               from '@angular/material/input';
import { CommonModule }                                                                 from '@angular/common';  
import { MatDialog }                                                                    from '@angular/material/dialog';
import { MatSidenavModule }                                                             from '@angular/material/sidenav';
import { MatListModule }                                                                from '@angular/material/list';
import { MatExpansionModule }                                                           from '@angular/material/expansion';
import { MatSelectModule }                                                              from '@angular/material/select';
import { MatIconModule }                                                                from '@angular/material/icon';
import { MatCheckboxModule }                                                            from '@angular/material/checkbox';
import { MatTooltipModule }                                                             from '@angular/material/tooltip';
import { NgxColorsModule }                                                              from 'ngx-colors';
import { CdkDragDrop, DragDropModule, moveItemInArray }                                 from '@angular/cdk/drag-drop';


import { AppService }                                                                   from '../../../../core/service/app.service';
import { ServerService }                                                                from '../../../../core/service/server.service';
import { PopupComponent }                                                               from '../../../../commons/popup/popup.component';
import { CommonsService }                                                               from '../../../../core/service/commons.service';
import { Fixture }                                                                      from '../../../fixture/vo/fixture';
import { Engine }                                                                       from '../../../../core/engine/engine';
import { Show }                                                                         from '../../vo/Show';

/**
 * Sequence Component
 * 
 * Sequence of the site
 */
@Component({
    selector: 'show',
    templateUrl: './show.component.html',
    styleUrls: [ './show.component.css' ],
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
        MatSelectModule,
        CommonModule,
        MatIconModule,
        MatCheckboxModule,
        MatTooltipModule,
        NgxColorsModule,
        DragDropModule,
        ],
})
export class ShowComponent implements OnChanges  {

    /**
    * Constructor
    * 
    */
    constructor
    (
        public appService: AppService,
		public server: ServerService,
        private commonsService:CommonsService,
        private dialog: MatDialog,
        private engine: Engine
    ) 
    { }
    
    /**
     * Event dispatched when remove is selected
     */
    @Output() onRemove = new EventEmitter();


    /**
     * Show
     */
    @Input() show!:Show;





    /**
    * Initialisation
    * 
    */
    ngOnChanges(changes: any): void 
    {
        
    }    




    /**
    * Actions
    * 
    */

    /**
     * On Change show label
     */
    public onChangeShowLabel()
    {
        let message:string = "<p>Please enter a new name for your Show</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:'Edit Show name', 
                    content:message,
                    yes_button_label:"Edit",
                    no_button_label:"Cancel",
                    cancel_button_label:"Cancel",
                    mode_question:false,
                    mode_prompt:true,
                    mode_prompt_type:"text",
                    prompt_value:"Show's name",
                    disable_cancel:false,
                    prompt:this.show.label 
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
                                    this.show.label = result.value;
                                }
                                else
                                {
                                    let message_error:string = "The show's name can only contains alpha numeric characters";
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
                                                prompt_value:"Show's name",
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
     * Remove Show
     */
    public remove()
    {
        this.onRemove.emit( this.show );
    }
}



