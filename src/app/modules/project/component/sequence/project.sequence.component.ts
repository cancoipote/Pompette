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
import { CdkDragDrop, DragDropModule, moveItemInArray }                                 from '@angular/cdk/drag-drop';


import { AppService }                                                                   from '../../../../core/service/app.service';
import { ServerService }                                                                from '../../../../core/service/server.service';
import { FixtureComponent }                                                             from '../../../fixture/component/fixture/fixture.component';
import { FixtureService }                                                               from '../../../fixture/service/fixture.service';
import { Fixture }                                                                      from '../../../fixture/vo/fixture';
import { PopupComponent }                                                               from '../../../../commons/popup/popup.component';
import { CommonsService }                                                               from '../../../../core/service/commons.service';
import { Sequence }                                                                     from '../../../sequence/vo/sequence';
import { SequenceComponent }                                                            from '../../../sequence/component/sequence/sequence.component';
import { SearchBoxComponent }                                                           from '../../../../commons/search/search.component';


/**
 * Project Sequence page Component
 * 
 * Sequence page of the site
 */
@Component({
    selector: 'project-sequence',
    templateUrl: './project.sequence.component.html',
    styleUrls: ['./project.sequence.component.css'],
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
        DragDropModule,
        FixtureComponent,
        SequenceComponent,
        SearchBoxComponent
        
    ]
})
export class ProjectSequenceComponent implements OnInit {

    /**
    * Constructor
    * 
    */
    constructor
    (
        public appService: AppService,
		public server: ServerService,
        public fixtureService:FixtureService,
        public commonsService:CommonsService,
        private dialog: MatDialog
    ) 
    { }
    
    /**
     * Current Sequence
     */
    public sequence:Sequence | null = null;


    /**
     * List of sequences
     */
    public sequences:Sequence[] = new Array();

    /**
     * Display menu or not
     */
    public display_menu:boolean = true;


    /**
     *  Search content - used for filter
     */
    public search_text:string = "";





    /**
    * Initialisation
    * 
    */
    ngOnInit(): void 
    {
        this.filter();
        if( this.sequences.length > 0 )
        {
            this.selectSequence( this.sequences[0] );
        }
    }    


   

    /**
    * Filters
    * 
    */
    
    /**
     * Called when user type a text to filter equipment list
     * 
     * @param {string} Search string
     */
    public onSearch( search:any )
    {
        this.search_text = search;
        this.filter();
    }

    /**
     * Filter List
     */
    public filter()
    {
        this.sequences = new Array();

        if( this.search_text == null  || this.search_text == "" || this.search_text == " " )
        {
            this.sequences = this.appService.project.sequences;
        }
        else
        {
            for( let i:number = 0; i < this.appService.project.sequences.length; i++)
            {
               if( this.appService.project.sequences[i].label.toLowerCase().includes(this.search_text.toLowerCase()) )
               {
                   this.sequences.push(this.appService.project.sequences[i]);
               }
            }
        }
    }




    
    /**
    * Actions
    * 
    */


    /**
     * Create sequence
     */
    public createSequence()
    {
        let message:string = "<p>Please enter a name for your new Sequence / FX</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:'Create Sequence', 
                    content:message,
                    yes_button_label:"Create",
                    no_button_label:"Cancel",
                    cancel_button_label:"Cancel",
                    mode_question:false,
                    mode_prompt:true,
                    mode_prompt_type:"text",
                    prompt_value:"Sequence's name",
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
                                    let sequence:Sequence = new Sequence();
                                    sequence.label = result.value;
                                    this.appService.project.sequences.push( sequence );
                                    this.filter();
                                    this.selectSequence(sequence);
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
     * Select a sequence
     * @param sequence 
     */
    public selectSequence( sequence:Sequence )
    {
        for( let i:number = 0; i < this.appService.project.sequences.length; i++ )
        {
            this.appService.project.sequences[i].isSelected = false;

            if( this.appService.project.sequences[i] == sequence )
            {
                this.appService.project.sequences[i].isSelected = true;
            }
        }


        this.sequence = sequence;
    }


    /**
     * Remove Sequence
     * @param sequence 
     */
    public removeSequence( sequence:Sequence )
    {
        let message:string = "<p>Do you want to remove this sequence / FX " + sequence.label + " ?</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:'Delete sequence', 
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
                            for( let i:number = 0; i < this.appService.project.sequences.length; i++ )
                            {
                                if( this.appService.project.sequences[i] == sequence )
                                {
                                    this.appService.project.sequences.splice( i, 1 );
                                    this.sequence = null;

                                    if( this.appService.project.sequences.length > 0 )
                                    {
                                        this.selectSequence( this.appService.project.sequences[0] );
                                    }

                                    this.filter();

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
     * Duplicate Sequence
     * @param sequence 
     */
    public duplicateSequence( sequence:Sequence )
    {
        let message:string = "<p>Please enter a name for your new Sequence / FX</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:'Duplicate Sequence', 
                    content:message,
                    yes_button_label:"Create",
                    no_button_label:"Cancel",
                    cancel_button_label:"Cancel",
                    mode_question:false,
                    mode_prompt:true,
                    mode_prompt_type:"text",
                    prompt_value:"Sequence's name",
                    disable_cancel:false,
                    prompt:sequence.label + " - copy"
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
                                    let sequenceDuplicate:Sequence = new Sequence();
                                    sequenceDuplicate.create(sequence);
                                    sequenceDuplicate.label = result.value;
                                    this.appService.project.sequences.push( sequenceDuplicate );

                                    this.selectSequence(sequenceDuplicate);
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
     * Drop 
     * @param event 
     */
    public onDrop(event: CdkDragDrop<any[]>) 
    {
        moveItemInArray(this.appService.project.sequences, event.previousIndex, event.currentIndex);
    }
   
}