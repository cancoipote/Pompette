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
import { CommonsService }                                                               from '../../../../core/service/commons.service';
import { SequenceFixture }                                                              from '../../vo/sequence.fixture';
import { SequenceFixtureTransition }                                                    from '../../vo/sequence.fixture.transition';
import { SequenceFixtureTransitionComponent }                                           from '../sequence_fixture_transition/sequence.fixture.transition.component';
import { PopupComponent }                                                               from '../../../../commons/popup/popup.component';
import { FixtureService }                                                               from '../../../fixture/service/fixture.service';
import { Engine }                                                                       from '../../../../core/engine/engine';

/**
 * Sequence Fixture Component
 * 
 * Sequence Fixture of the site
 */
@Component({
    selector: 'sequence-fixture',
    templateUrl: './sequence.fixture.component.html',
    styleUrls: [ './sequence.fixture.component.css' ],
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
        SequenceFixtureTransitionComponent
        ],
})
export class SequenceFixtureComponent implements OnChanges  {

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
        private fixtueService:FixtureService,
        private engine: Engine
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
    @Input() sequenceFixture!:SequenceFixture;


    /**
     * Display menu or not
     */
    public display_menu:boolean = true;
    
    /**
     * Current sequence fixture transition
     */
    public sequenceFixtureTransition:SequenceFixtureTransition | null = null;

    /**
    * Initialisation
    * 
    */
    ngOnChanges(changes: any): void 
    {
        this.sequenceFixture.isPlayging = false;
        this.sequenceFixtureTransition = null;


        if( this.sequenceFixture.transitions.length > 0 )
        {
            this.selectSequenceFixtureTransition( this.sequenceFixture.transitions[0] );   
        }


        this.server.getBlackoutListener()
        .subscribe
        (
            (updatedData: boolean) => 
            {
                this.sequenceFixture.isPlayging = false;
            }
        );
    }    


    /**
    * Actions
    * 
    */

   
    /**
     * Play Sequence
     */
    public play()
    {
        this.server.blackOut();
        this.sequenceFixture.isPlayging = true;
        this.engine.playSequenceFixture( this.sequenceFixture );
    }

    /**
     * Stop Sequence
     */
    public stop()
    {
        this.sequenceFixture.isPlayging = false;
        this.engine.stopSequenceFixture();
        this.server.blackOut();

    }

    /**
     * Remove Sequence
     */
    public remove()
    {
        this.onRemove.emit( this.sequenceFixture );
    }

    /**
     * Remove Sequence
     */
    public duplicate()
    {
        this.onDuplicate.emit( this.sequenceFixture );
    }

    /**
     * Sequence Fixture transition
     * 
     */


    /**
     * Create Sequence Fixture Transition
     *
    */
    public createSequenceFixtureTransition( )
    {
        let message:string = "<p>Please enter a name for your new transition</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:'Create Transition', 
                    content:message,
                    yes_button_label:"Create",
                    no_button_label:"Cancel",
                    cancel_button_label:"Cancel",
                    mode_question:false,
                    mode_prompt:true,
                    mode_prompt_type:"text",
                    prompt_value:"Transition's name",
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
                                    let transition:SequenceFixtureTransition = new SequenceFixtureTransition();
                                    transition.label = result.value;
                                    transition.type = this.fixtueService.transitionTypes[0];
                                    transition.startFixture = JSON.parse( JSON.stringify( this.sequenceFixture.fixture ) );
                                    transition.endFixture = JSON.parse( JSON.stringify( this.sequenceFixture.fixture ) );
                                    transition.fixFixture = JSON.parse( JSON.stringify( this.sequenceFixture.fixture ) );
                                    this.sequenceFixture.transitions.push( transition );

                                    this.selectSequenceFixtureTransition(transition);
                                }
                                else
                                {
                                    let message_error:string = "The transition's name can only contains alpha numeric characters";
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
     * Select Sequence Fixture Transition
     * @param sequenceFixtureTransition 
     */
    public selectSequenceFixtureTransition( sequenceFixtureTransition: SequenceFixtureTransition )
    {
        for( let i:number = 0; i < this.sequenceFixture.transitions.length; i++ )
        {
            this.sequenceFixture.transitions[i].isSelected = false;

            if( this.sequenceFixture.transitions[i] == sequenceFixtureTransition )
            {
                this.sequenceFixture.transitions[i].isSelected = true;
            }
        }


        this.sequenceFixtureTransition = sequenceFixtureTransition;
    }  
    
    /**
     * Duplicate Sequence Fixture Transition
     * @param sequenceFixtureTransition 
     */
    public duplicateSequenceFixtureTransition( sequenceFixtureTransition: SequenceFixtureTransition )
    {
        let message:string = "<p>Please enter a name for your new transition</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:'Create Transition', 
                    content:message,
                    yes_button_label:"Create",
                    no_button_label:"Cancel",
                    cancel_button_label:"Cancel",
                    mode_question:false,
                    mode_prompt:true,
                    mode_prompt_type:"text",
                    prompt_value:"Transition's name",
                    disable_cancel:false,
                    prompt:sequenceFixtureTransition.label + " - copy"
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
                                    let transition:SequenceFixtureTransition = new SequenceFixtureTransition();
                                    transition.create( sequenceFixtureTransition );
                                    transition.label = result.value;

                                    if( transition.type )
                                    {
                                        for( let i:number = 0; i < this.fixtueService.transitionTypes.length; i++ )
                                        {
                                            if( this.fixtueService.transitionTypes[i].id == transition.type.id )
                                            {
                                                transition.type = this.fixtueService.transitionTypes[i];
                                                break;
                                            }
                                        }
                                    }

                                    this.sequenceFixture.transitions.push( transition );

                                    this.selectSequenceFixtureTransition(transition);
                                }
                                else
                                {
                                    let message_error:string = "The transition's name can only contains alpha numeric characters";
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
     * Remove Sequence Fixture Transition
     * @param sequenceFixtureTransition 
     */
    public removeSequenceFixtureTransition( sequenceFixtureTransition: SequenceFixtureTransition )
    {
        let message:string = "<p>Do you want to remove this transition " + sequenceFixtureTransition.label + " ?</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:'Delete transition', 
                    content:message,
                    yes_button_label:"Yes",
                    no_button_label:"No",
                    cancel_button_label:"Cancel",
                    mode_question:true,
                    mode_prompt:false,
                    mode_prompt_type:"text",
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
                    if( result.answer )
                    {
                        if( result.answer == true )
                        {
                            for( let i:number = 0; i < this.sequenceFixture.transitions.length; i++ )
                            {
                                if( this.sequenceFixture.transitions[i] == sequenceFixtureTransition )
                                {
                                    this.sequenceFixture.transitions.splice( i, 1 );
                                    this.sequenceFixtureTransition = null;

                                    if( this.sequenceFixture.transitions.length > 0 )
                                    {
                                        this.selectSequenceFixtureTransition( this.sequenceFixture.transitions[0] );
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        );
    }


    /**
     * Drop 
     * @param event 
     */
    public onDrop(event: CdkDragDrop<any[]>) 
    {
        moveItemInArray(this.sequenceFixture.transitions, event.previousIndex, event.currentIndex);
    }
}



