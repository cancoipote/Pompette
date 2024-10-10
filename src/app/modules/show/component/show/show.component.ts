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

    /**
    * Player
    * 
    */

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



