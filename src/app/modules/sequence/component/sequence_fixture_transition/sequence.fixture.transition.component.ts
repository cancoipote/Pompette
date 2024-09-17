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

import { AppService }                                                                   from '../../../../core/service/app.service';
import { ServerService }                                                                from '../../../../core/service/server.service';
import { CommonsService }                                                               from '../../../../core/service/commons.service';
import { SequenceFixtureTransition }                                                    from '../../vo/sequence.fixture.transition';
import { PopupComponent }                                                               from '../../../../commons/popup/popup.component';
import { FixtureService }                                                               from '../../../fixture/service/fixture.service';
import { MatRadioModule }                                                               from '@angular/material/radio';
import { FixtureComponent }                                                             from '../../../fixture/component/fixture/fixture.component';
import { Fixture }                                                                      from '../../../fixture/vo/fixture';
import { Engine }                                                                       from '../../../../core/engine/engine';

/**
 * Sequence Fixture Transition Component
 * 
 * Sequence Fixture Transition of the site
 */
@Component({
    selector: 'sequence-fixture-transition',
    templateUrl: './sequence.fixture.transition.component.html',
    styleUrls: [ './sequence.fixture.transition.component.css' ],
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
        MatRadioModule,
        NgxColorsModule,
        FixtureComponent
        ],
})
export class SequenceFixtureTransitionComponent implements OnChanges  {

    /**
    * Constructor
    * 
    */
    constructor
    (
        public appService: AppService,
		public server: ServerService,
        private commonsService:CommonsService,
        public fixtureService:FixtureService,
        private dialog: MatDialog,
        private engine:Engine
    ) 
    { }
    

    /**
     * Event dispatched when remove is selected
     */
    @Output() onRemove = new EventEmitter();

    /**
     * Event dispatched when duplicate is selected
     */
    @Output() onDuplicate = new EventEmitter();

    /**
     * Sequence
     */
    @Input() sequenceFixtureTransition!:SequenceFixtureTransition;


    /**
    * Initialisation
    * 
    */
    ngOnChanges(changes: any): void 
    {
        this.sequenceFixtureTransition.isPlayging = false;
     
        this.server.getBlackoutListener()
        .subscribe
        (
            (updatedData: boolean) => 
            {
                this.sequenceFixtureTransition.isPlayging = false;
            }
        );
    }    


    /**
    * Actions
    * 
    */

   
    /**
     * On Change sequence label
     */
    public onChangeTransitionLabel()
    {
        let message:string = "<p>Please enter a new name for your transition</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:'Edit Sequence name', 
                    content:message,
                    yes_button_label:"Edit",
                    no_button_label:"Cancel",
                    cancel_button_label:"Cancel",
                    mode_question:false,
                    mode_prompt:true,
                    mode_prompt_type:"text",
                    prompt_value:"Transition's name",
                    disable_cancel:false,
                    prompt:this.sequenceFixtureTransition.label 
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
                                    this.sequenceFixtureTransition.label = result.value;
                                }
                                else
                                {
                                    let message_error:string = "The sequence's name can only contains alpha numeric characters";
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
                                                prompt_value:"Transition's name",
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
     * Play Sequence
     */
    public play()
    {
        this.server.blackOut();
        this.sequenceFixtureTransition.isPlayging = true;
        this.engine.playTransition( this.sequenceFixtureTransition );
    }

    /**
     * Stop Sequence
     */
    public stop()
    {
        this.sequenceFixtureTransition.isPlayging = false;
        this.engine.stopTransition();
        this.server.blackOut();
    }

    /**
     * Remove Sequence
     */
    public remove()
    {
        this.onRemove.emit( this.sequenceFixtureTransition );
    }

    /**
     * Duplicate Sequence
     */
    public duplicate()
    {
        this.onDuplicate.emit( this.sequenceFixtureTransition );
    }


    /**
     * On Change transition type
     */
    public onChangeTransitionType()
    {
        if( this.sequenceFixtureTransition.type.subTypes.length > 0 )
        {
            this.sequenceFixtureTransition.subType = this.sequenceFixtureTransition.type.subTypes[0];
        }
    }

    
    /**
     * Change duration type
     * @param event 
     */
    public onChangeDurationType( event:any )
    {
        this.sequenceFixtureTransition.fixedDuration = event.value;
        this.sequenceFixtureTransition.duration = 0;
        this.sequenceFixtureTransition.durationMin = 0;
        this.sequenceFixtureTransition.durationMax = 0;
    }

    /**
     * Siwtch start and end
     */
    public switchChannels()
    {
        let start:Fixture   = JSON.parse( JSON.stringify( this.sequenceFixtureTransition.startFixture ) );
        let end:Fixture     = JSON.parse( JSON.stringify( this.sequenceFixtureTransition.endFixture ) );

        this.sequenceFixtureTransition.startFixture = end;
        this.sequenceFixtureTransition.endFixture = start;
    }
}



