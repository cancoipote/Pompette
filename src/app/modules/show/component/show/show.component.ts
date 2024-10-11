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

import { AppService }                                                                   from '../../../../core/service/app.service';
import { ServerService }                                                                from '../../../../core/service/server.service';
import { PopupComponent }                                                               from '../../../../commons/popup/popup.component';
import { CommonsService }                                                               from '../../../../core/service/commons.service';
import { Engine }                                                                       from '../../../../core/engine/engine';
import { Show }                                                                         from '../../vo/show';
import { Sequence }                                                                     from '../../../sequence/vo/sequence';
import { ShowSequence } from '../../vo/show.sequence';

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
        MatCheckboxModule
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

        for( let i:number = 0; i < this.show.sequences.length; i++ )
        {
            this.show.sequences[i].percent = 0;
        }

        for( let i:number = 0; i < this.show.effects.length; i++ )
        {
            this.show.effects[i].percent = 0;
        }
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
                        let newSequence:ShowSequence = new ShowSequence();
                        newSequence.sequence =  result.value;
                        newSequence.percent = 0;
                        newSequence.isPlayging = false;
                        this.show.sequences.push( newSequence );
                    }
                }       
            }
        );
    }

    /**
     * Add Sequence Delay
     */
    public addSequenceDelay()
    {
        let delaySequence:ShowSequence = new ShowSequence();
        delaySequence.sequence = new Sequence();
        delaySequence.sequence.label = "Delay";
        delaySequence.isDelay = true;
        delaySequence.percent = 0;
        delaySequence.isPlayging = false;
        this.show.sequences.push( delaySequence );

    }


    /**
     * Remove ShowSequence
     * @param ShowSequence 
     */
    public removeSequence( sequence:ShowSequence )
    {
        let message:string = "<p>Do you want to remove this sequence  " +sequence.sequence.label + " ?</p>";

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
     * Drop Sequence
     * @param event 
     */
    public onDropSequence( event: CdkDragDrop<any[]> )
    {
        moveItemInArray(this.show.sequences, event.previousIndex, event.currentIndex);
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
                        let newEffect:ShowSequence = new ShowSequence();
                        newEffect.sequence =  result.value;
                        newEffect.percent = 0;
                        newEffect.isPlayging = false;
                        this.show.effects.push( newEffect );
                    }
                }       
            }
        );
    }


    /**
     * Add Effect Delay
     */
    public addEffectDelay()
    {
        let delayEffect:ShowSequence = new ShowSequence();
        delayEffect.sequence = new Sequence();
        delayEffect.sequence.label = "Delay";
        delayEffect.isDelay = true;
        delayEffect.percent = 0;
        delayEffect.isPlayging = false;
        this.show.effects.push( delayEffect );
    }


    /**
     * Remove Effect
     * @param Effect 
     */
    public removeEffect( effect:ShowSequence )
    {
        let message:string = "<p>Do you want to remove this effect  " + effect.sequence.label + " ?</p>";

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


    /**
     * Drop Effect
     * @param event 
     */
    public onDropEffect( event: CdkDragDrop<any[]> )
    {
        moveItemInArray(this.show.effects, event.previousIndex, event.currentIndex);
    }

    /**
     * Shane Sequence duration
     * @param sequence 
     */
    public onChangeSequenceDuration( sequence:ShowSequence )
    {
        let message:string = "<p>Please enter duration in ms</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:"Set duration", 
                    content:message,
                    yes_button_label:"Set duration",
                    no_button_label:"Cancel",
                    cancel_button_label:"Cancel",
                    mode_question:false,
                    mode_prompt:true,
                    mode_prompt_type:"text",
                    prompt_value:"Duration in ms",
                    disable_cancel:false,
                    prompt:sequence.duration.toString()
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
                                let displayError:boolean = false;
                                if( CommonsService.isNumeric( result.value ) )
                                {
                                    let futureDuration:number = parseInt( result.value );

                                    if( futureDuration >= 0)
                                    {
                                        displayError = false;
                                        sequence.duration = futureDuration;
                                    }
                                    else
                                    {
                                        displayError = true;
                                    }
                                }
                                else
                                {
                                    displayError = true;
                                }

                                if( displayError == true )
                                {
                                    let message_error:string = "The duration must be a number greater than 0";
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
                                                prompt_value:"Duration",
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
        this.show.isPlay    = false;
        this.show.isPause   = false;

        clearInterval(this.intervalId);
        this.elapsedTime    = 0;
        this.startTime      = 0;

        for( let i:number = 0; i < this.show.sequences.length; i++ )
        {
            this.show.sequences[i].percent = 0;
        }

        for( let i:number = 0; i < this.show.effects.length; i++ )
        {
            this.show.effects[i].percent = 0;
        }
    }


    /**
     * Update time
     */
    private updateTime() 
    {
        this.elapsedTime = Date.now() - this.startTime;

        let sequencesDuration:number = 0;
        for( let i:number = 0; i < this.show.sequences.length; i++ )
        {
            if( i > 0 )
            {
                sequencesDuration += this.show.sequences[i-1].duration;
            }
            
            
            if( this.elapsedTime <=  sequencesDuration)
            {
                this.show.sequences[i].percent = 0;
                this.show.sequences[i].isPlayging = false;
            }
            else
            {
                if( this.show.sequences[i].isLoop == true )
                {
                    this.show.sequences[i].isPlayging = true;
                    this.show.sequences[i].percent = 100;
                    break;
                }
                else
                {
                    if( this.elapsedTime >= sequencesDuration + this.show.sequences[i].duration )
                    {
                        this.show.sequences[i].isPlayging = false;
                    }
                    else
                    {
                        this.show.sequences[i].isPlayging = true;
                        this.show.sequences[i].percent = (this.elapsedTime - sequencesDuration) / this.show.sequences[i].duration * 100;
                    }
                }
            }
        }


        let effectsDuration:number = 0;
        for( let i:number = 0; i < this.show.effects.length; i++ )
        {
            if( i > 0 )
            {
                effectsDuration += this.show.effects[i-1].duration;
            }
            
            
            if( this.elapsedTime <=  effectsDuration)
            {
                this.show.effects[i].percent = 0;
                this.show.effects[i].isPlayging = false;
            }
            else
            {
                if( this.show.effects[i].isLoop == true )
                {
                    this.show.effects[i].isPlayging = true;
                    this.show.effects[i].percent = 100;
                    break;
                }
                else
                {
                    if( this.elapsedTime >= effectsDuration + this.show.effects[i].duration )
                    {
                        this.show.effects[i].isPlayging = false;
                    }
                    else
                    {
                        this.show.effects[i].isPlayging = true;
                        this.show.effects[i].percent = (this.elapsedTime - effectsDuration) / this.show.effects[i].duration * 100;
                    }
                }
            }
        }
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



