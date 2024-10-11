import { Component, OnInit, Input, OnChanges ,  Output, EventEmitter, SimpleChange, ViewChild, ElementRef, AfterViewInit, HostListener  }   from '@angular/core';
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
import { gsap }                                                                         from 'gsap';

import { AppService }                                                                   from '../../../../core/service/app.service';
import { ServerService }                                                                from '../../../../core/service/server.service';
import { PopupComponent }                                                               from '../../../../commons/popup/popup.component';
import { CommonsService }                                                               from '../../../../core/service/commons.service';
import { Fixture }                                                                      from '../../../fixture/vo/fixture';
import { Engine }                                                                       from '../../../../core/engine/engine';
import { Show }                                                                         from '../../vo/Show';
import { Sequence } from '../../../sequence/vo/sequence';

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
     * Elapsed time
     */
    public elapsedTime:number = 0;

    /**
     * Start time
     */
    public startTime:number = 0;

    /**
     * Interval Id
     */
    private intervalId: any = null;


    /**
    * Initialisation
    * 
    */
    ngOnChanges(changes: any): void 
    {
        this.elapsedTime = 0;
        this.show.isPlay = false;
        this.show.isPause = false;
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


    //////////////////////////////////////////////////////////////////////
    //
    // Manage Sequences / Effects
    //
    //////////////////////////////////////////////////////////////////////

    /**
     * Add Sequence
     */
    public addSequence()
    {
        let items:Sequence[] = new Array<Sequence>();
        for( let i=0; i< this.appService.project.sequences.length; i++ )
        {
            if( this.appService.project.sequences[i].isFX == false )
            {
                items.push( this.appService.project.sequences[i] );
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
                    title_label:'Select a sequence', 
                    content:"Select a sequence",
                    yes_button_label:"Add",
                    no_button_label:"Close",
                    cancel_button_label:"Cancel",
                    mode_question:false,
                    mode_prompt:true,
                    mode_prompt_type:"select",
                    prompt_value:"Select a sequence",
                    disable_cancel:false,
                    display_cancel:false,
                    display_close:false,
                    items:items
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
                        let newSequence = JSON.parse( JSON.stringify( result.value ) );
                        this.show.sequences.push( newSequence );
                    }
                }       
            }
        );
    }


    /**
     * Remove Sequence
     * @param sequence 
     */
    public removeSequence( sequence:Sequence )
    {
        let message:string = "<p>Do you want to remove this sequence  " +sequence.label + " ?</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:'Remove sequence', 
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
                            for( let i:number = 0; i < this.show.sequences.length; i++ )
                            {
                                if( this.show.sequences[i] == sequence )
                                {
                                    this.show.sequences.splice( i, 1 );
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
     * Add Effect
     */
    public addEffect()
    {
        let items:Sequence[] = new Array<Sequence>();
        for( let i=0; i< this.appService.project.sequences.length; i++ )
        {
            if( this.appService.project.sequences[i].isFX == true )
            {
                items.push( this.appService.project.sequences[i] );
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
                    title_label:'Select an effect', 
                    content:"Select an effect",
                    yes_button_label:"Add",
                    no_button_label:"Close",
                    cancel_button_label:"Cancel",
                    mode_question:false,
                    mode_prompt:true,
                    mode_prompt_type:"select",
                    prompt_value:"Select an effect",
                    disable_cancel:false,
                    display_cancel:false,
                    display_close:false,
                    items:items
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
                        let newEffect = JSON.parse( JSON.stringify( result.value ) );
                        this.show.effects.push( newEffect );
                    }
                }       
            }
        );
    }


    /**
     * Remove Effect
     * @param Effect 
     */
    public removeEffect( effect:Sequence )
    {
        let message:string = "<p>Do you want to remove this effect  " +effect.label + " ?</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:'Remove effect', 
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
                            for( let i:number = 0; i < this.show.effects.length; i++ )
                            {
                                if( this.show.effects[i] == effect )
                                {
                                    this.show.effects.splice( i, 1 );
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        );
    }




    //////////////////////////////////////////////////////////////////////
    //
    // Player
    //
    //////////////////////////////////////////////////////////////////////

    /**
     * Play
     */
    public play()
    {
        this.show.isPlay = true;
        this.startTime = Date.now() - this.elapsedTime;
        this.intervalId = setInterval(() => this.updateTime(), 10);
    }

    /**
     * Pause
     */
    public pause()
    {
        this.show.isPause = true;
        clearInterval(this.intervalId);
        this.elapsedTime = Date.now() - this.startTime;
    }

    /**
     * Resume
     */
    public resume()
    {
        this.show.isPause = false;
        this.play();
    }

    /**
     * Stop
     */
    public stop()
    {
        this.show.isPlay = false;
        this.show.isPause = false;

        clearInterval(this.intervalId);
        this.elapsedTime = 0;
        this.startTime = 0;
    }


    /**
     * Update time
     */
    private updateTime() 
    {
        this.elapsedTime = Date.now() - this.startTime;
    }

    /**
     * Format elapsed time minute:second:millsecond
     * @param time 
     */
    public formatElapsedTime( )
    {  
        const totalMilliseconds = this.elapsedTime;
        const totalSeconds = Math.floor(totalMilliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = totalMilliseconds % 1000;

        return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}:${this.padMilliseconds(milliseconds)}`;
    }

    /**
     * Pad
     * @param num
     * @returns
     */
    private pad(num: number): string 
    {
        return num.toString().padStart(2, '0');
    }
    
    /**
     * Pad milliseconds
     * @param num
     * @returns
     */
    private padMilliseconds(num: number): string 
    {
        return num.toString().padStart(3, '0');
    }
}



