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
import { Sequence }                                                                     from '../../vo/sequence';
import { SequenceFixture }                                                              from '../../vo/sequence.fixture';
import { Fixture }                                                                      from '../../../fixture/vo/fixture';
import { SequenceFixtureComponent }                                                     from '../sequence_fixture/sequence.fixture.component';
import { Engine }                                                                       from '../../../../core/engine/engine';

/**
 * Sequence Component
 * 
 * Sequence of the site
 */
@Component({
    selector: 'sequence',
    templateUrl: './sequence.component.html',
    styleUrls: [ './sequence.component.css' ],
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
        SequenceFixtureComponent
        ],
})
export class SequenceComponent implements OnChanges  {

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
     * Event dispatched when duplicate is selected
     */
    @Output() onDuplicate = new EventEmitter();

    /**
     * Sequence
     */
    @Input() sequence!:Sequence;


    /**
     * Display menu or not
     */
    public display_menu:boolean = true;


    /**
     * Current sequence fixture
     */
    public sequenceFixture:SequenceFixture | null = null;
    


    /**
    * Initialisation
    * 
    */
    ngOnChanges(changes: any): void 
    {
        this.sequence.isPlayging = false;

        this.sequenceFixture = null;

        if( this.sequence.sequenceFixtures.length > 0 )
        {
           this.selectSequenceFixture( this.sequence.sequenceFixtures[0] );
        }

        this.server.getBlackoutListener()
        .subscribe
        (
            (updatedData: boolean) => 
            {
                this.sequence.isPlayging = false;
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
    public onChangeSequenceLabel()
    {
        let message:string = "<p>Please enter a new name for your new Sequence</p>";

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
                    prompt_value:"Sequence's name",
                    disable_cancel:false,
                    prompt:this.sequence.label 
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
                                    this.sequence.label = result.value;
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
                                                prompt_value:"Sequence's name",
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
        this.sequence.isPlayging = true;
        this.engine.playSequence( this.sequence );
    }

    /**
     * Stop Sequence
     */
    public stop()
    {
        this.sequence.isPlayging = false;
        this.engine.stopSequence( this.sequence );
        this.server.blackOut();
    }

    /**
     * Remove Sequence
     */
    public remove()
    {
        this.onRemove.emit( this.sequence );
    }

    /**
     * Duplicate Sequence
     */
    public duplicate()
    {
        this.onDuplicate.emit( this.sequence );
    }

    /**
    * Sequence Fixture
    * 
    */

    /**
     * Create Sequence Fixture
     */
    public createSequenceFixture()
    {

        let tmpFixtures:Fixture[] = new Array(); // JSON.parse( JSON.stringify( this.appService.project.fixtures ) );

        for( let i:number = 0; i < this.appService.project.fixtures.length; i++ )
        {
            let can_add:boolean = true;

            for( let j:number = 0; j < this.sequence.sequenceFixtures.length; j++ )
            {
                if( this.appService.project.fixtures[i].id == this.sequence.sequenceFixtures[j].fixture.id && this.appService.project.fixtures[i].index == this.sequence.sequenceFixtures[j].fixture.index )
                {
                    can_add = false;
                    break;
                }
            }

            if( can_add == true )
            {
                let fixtureTmp:Fixture =  JSON.parse( JSON.stringify( this.appService.project.fixtures[i] ) );

                if( fixtureTmp.reference != null && fixtureTmp.reference != undefined && fixtureTmp.reference != "null" && fixtureTmp.reference != "" )
                {   
                    fixtureTmp.label += " - " + fixtureTmp.reference
                }
                fixtureTmp.label += " ( " + fixtureTmp.index  + " )"
                tmpFixtures.push( fixtureTmp );
            }   
        }




        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:'Select a fixture', 
                    content:"Select a fixture",
                    yes_button_label:"Create",
                    no_button_label:"Close",
                    cancel_button_label:"Cancel",
                    mode_question:false,
                    mode_prompt:true,
                    mode_prompt_type:"select",
                    prompt_value:"Select a fixture",
                    disable_cancel:false,
                    display_cancel:false,
                    display_close:false,
                    items:tmpFixtures
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
                        for( let i:number = 0; i < this.appService.project.fixtures.length; i++ )
                        {
                            if( this.appService.project.fixtures[i].id == result.value.id &&  this.appService.project.fixtures[i].index == result.value.index )
                            {
                                let sequenceFixture:SequenceFixture = new SequenceFixture();
                                sequenceFixture.fixture             = this.appService.project.fixtures[i];
                                sequenceFixture.transitions         = new Array();
                                this.sequence.sequenceFixtures.push( sequenceFixture );
                                this.selectSequenceFixture( this.sequence.sequenceFixtures[ this.sequence.sequenceFixtures.length - 1 ] );
                                break;
                            }
                        }
                    }
                }       
            }
        );
    }


    /**
     * Remove Sequence Fixture
     * @param sequenceFixture 
     */
    public removeSequenceFixture( sequenceFixture:SequenceFixture )
    {
        let message:string = "<p>Do you want to remove this sequence fixture " + sequenceFixture.fixture.label + " - " + sequenceFixture.fixture.reference + " ( " + sequenceFixture.fixture.index + " ) ?</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:'Delete sequence fixture', 
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
                            for( let i:number = 0; i < this.sequence.sequenceFixtures.length; i++ )
                            {
                                if( this.sequence.sequenceFixtures[i] == sequenceFixture )
                                {
                                    this.sequence.sequenceFixtures.splice( i, 1 );
                                    this.sequenceFixture = null;

                                    if( this.sequence.sequenceFixtures.length > 0 )
                                    {
                                        this.selectSequenceFixture( this.sequence.sequenceFixtures[0] );
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
     * DUplicate a Sequence Fixture
     * @param sequenceFixture 
     */
    public duplicateSequenceFixture( sequenceFixture:SequenceFixture )
    {
        let tmpFixtures:Fixture[] = new Array(); // JSON.parse( JSON.stringify( this.appService.project.fixtures ) );

        for( let i:number = 0; i < this.appService.project.fixtures.length; i++ )
        {
            let can_add:boolean = true;

            for( let j:number = 0; j < this.sequence.sequenceFixtures.length; j++ )
            {
                if( this.appService.project.fixtures[i].id == this.sequence.sequenceFixtures[j].fixture.id && this.appService.project.fixtures[i].index == this.sequence.sequenceFixtures[j].fixture.index )
                {
                    can_add = false;
                    break;
                }
            }

            if( can_add == true )
            {
                if( this.appService.project.fixtures[i].id != sequenceFixture.fixture.id )
                {
                    can_add = false;
                }
            }

            if( can_add == true )
            {
                let fixtureTmp:Fixture =  JSON.parse( JSON.stringify( this.appService.project.fixtures[i] ) );

                if( fixtureTmp.reference != null && fixtureTmp.reference != undefined && fixtureTmp.reference != "null" && fixtureTmp.reference != "" )
                {   
                    fixtureTmp.label += " - " + fixtureTmp.reference
                }
                
                fixtureTmp.label += " ( " + fixtureTmp.index  + " )"
                tmpFixtures.push( fixtureTmp );
            }   
        }




        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:'Select a fixture', 
                    content:"Select a fixture",
                    yes_button_label:"Create",
                    no_button_label:"Close",
                    cancel_button_label:"Cancel",
                    mode_question:false,
                    mode_prompt:true,
                    mode_prompt_type:"select",
                    prompt_value:"Select a fixture",
                    disable_cancel:false,
                    display_cancel:false,
                    display_close:false,
                    items:tmpFixtures
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
                        for( let i:number = 0; i < this.appService.project.fixtures.length; i++ )
                        {
                            if( this.appService.project.fixtures[i].id == result.value.id &&  this.appService.project.fixtures[i].index == result.value.index )
                            {
                                let sequenceFixtureNew:SequenceFixture = new SequenceFixture();
                                sequenceFixtureNew.create( sequenceFixture );
                                sequenceFixtureNew.fixture.id = this.appService.project.fixtures[i].id;
                                sequenceFixtureNew.fixture.index = this.appService.project.fixtures[i].index;
                                sequenceFixtureNew.fixture.label = this.appService.project.fixtures[i].label;
                                sequenceFixtureNew.fixture.reference = this.appService.project.fixtures[i].reference;
                                
                                for( let j:number = 0; j < sequenceFixtureNew.transitions.length; j++ )
                                {
                                    if( sequenceFixtureNew.transitions[j].fixFixture )
                                    {
                                        sequenceFixtureNew.transitions[j].fixFixture.id         =  this.appService.project.fixtures[i].id;
                                        sequenceFixtureNew.transitions[j].fixFixture.index      =  this.appService.project.fixtures[i].index;
                                        sequenceFixtureNew.transitions[j].fixFixture.label      =  this.appService.project.fixtures[i].label;
                                        sequenceFixtureNew.transitions[j].fixFixture.reference  =  this.appService.project.fixtures[i].reference;
                                    }

                                    if( sequenceFixtureNew.transitions[j].startFixture )
                                    {
                                        sequenceFixtureNew.transitions[j].startFixture.id         =  this.appService.project.fixtures[i].id;
                                        sequenceFixtureNew.transitions[j].startFixture.index      =  this.appService.project.fixtures[i].index;
                                        sequenceFixtureNew.transitions[j].startFixture.label      =  this.appService.project.fixtures[i].label;
                                        sequenceFixtureNew.transitions[j].startFixture.reference  =  this.appService.project.fixtures[i].reference;
                                    }

                                    if( sequenceFixtureNew.transitions[j].endFixture )
                                    {
                                        sequenceFixtureNew.transitions[j].endFixture.id         =  this.appService.project.fixtures[i].id;
                                        sequenceFixtureNew.transitions[j].endFixture.index      =  this.appService.project.fixtures[i].index;
                                        sequenceFixtureNew.transitions[j].endFixture.label      =  this.appService.project.fixtures[i].label;
                                        sequenceFixtureNew.transitions[j].endFixture.reference  =  this.appService.project.fixtures[i].reference;
                                    }
                                }
                
                                this.sequence.sequenceFixtures.push( sequenceFixtureNew );
                                this.selectSequenceFixture( this.sequence.sequenceFixtures[ this.sequence.sequenceFixtures.length - 1 ] );
                                break;
                            }
                        }
                    }
                }       
            }
        );
    }

    /**
     * Select a Sequence Fixture
     * @param sequenceFixture 
     */
    public selectSequenceFixture( sequenceFixture:SequenceFixture )
    {
        for( let i:number = 0; i < this.sequence.sequenceFixtures.length; i++ ) 
        {
            this.sequence.sequenceFixtures[i].isSelected = false;

            if( this.sequence.sequenceFixtures[i] == sequenceFixture )
            {
                this.sequence.sequenceFixtures[i].isSelected = true;
            }
        }

        this.sequenceFixture = sequenceFixture;
    }


    /**
     * Drop 
     * @param event 
     */
    public onDrop(event: CdkDragDrop<any[]>) 
    {
        moveItemInArray(this.sequence.sequenceFixtures, event.previousIndex, event.currentIndex);
    }
}



