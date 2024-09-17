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
import { NgxColorsModule }                                                              from 'ngx-colors';

import { AppService }                                                                   from '../../../../core/service/app.service';
import { ServerService }                                                                from '../../../../core/service/server.service';
import { FixtureService }                                                               from '../../service/fixture.service';
import { Fixture }                                                                      from '../../vo/fixture';
import { FixtureChannel }                                                               from '../../vo/fixture.channel';
import { PopupComponent }                                                               from '../../../../commons/popup/popup.component';
import { CommonsService }                                                               from '../../../../core/service/commons.service';
import { PopupManageFixture }                                                           from '../popup_manage_fixture/popup.manage.fixture.component';

/**
 * Fixture Component
 * 
 * Fixture of the site
 */
@Component({
    selector: 'fixture',
    templateUrl: './fixture.component.html',
    styleUrls: [ './fixture.component.css' ],
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
        NgxColorsModule
        ],
})
export class FixtureComponent implements OnChanges  {

    /**
    * Constructor
    * 
    */
    constructor
    (
        public appService: AppService,
		public server: ServerService,
        public fixtureService:FixtureService,
        private commonsService:CommonsService,
        private dialog: MatDialog
    ) 
    { }

    /**
     * Event dispatched when close is selected
     */
    @Output() onClose = new EventEmitter();
    
    /**
     * Event dispatched when remove is selected
     */
    @Output() onRemove = new EventEmitter();
    
    /**
     * Fixture
     */
    @Input() fixture!:Fixture;

    /**
     * Open DMX Configuration at start
     */
    @Input() openDmxConfigurationAtStart:boolean = false;

    /**
     * Display close button or not
     */
    @Input() displayCloseButton:boolean = false;

    /**
     * Display remove button or not
     */
    @Input() displayRemoveButton:boolean = false;

    /**
     * Light header or not
     */
    @Input() lightHeader:boolean = false;


    /**
     * Display reference or not
     */
    @Input() displayReference:boolean = false;

    /**
     * Title
     */
    @Input() title:string = "";

    /**
     * Hide channels or not
     */
    public hideChannels:boolean = true;

    /**
     * Display tools or not
     */
    public displayTools:boolean = false;

    /**
     * Hide tools or not
     */
    public hideTools:boolean = true;

    /**
     * Display tools color picker or not or not
     */
    public displayToolsColorPicker:boolean = false;

    /**
     * Color Picker Form
     */
    public colorPickerForm: FormGroup = new FormGroup(
    {
        inputCtrl: new FormControl('rgba(0, 0, 0, 0)'),
        pickerCtrl: new FormControl('rgba(0, 0, 0, 0)'),
    },
    { updateOn: "change" }
    );

    /**
     * Color Picker Red
     */
    public color_red:number     = 0;

    /**
     * Color Picker Green
     */
    public color_green:number   = 0;

    /**
     * Color Picker Blue
     */
    public color_blue:number    = 0;

    /**
     * Color Picker Alpha
     */
    public color_alpha:number   = 0;

    /**
     * Dimmer Min
     */
    private dimmer_min:number = 0;

    /**
     * Dimmer Max
     */
    private dimmer_max:number = 255;

    /**
    * Initialisation
    * 
    */
    ngOnChanges(changes: any): void 
    {
        if (changes.fixture)
        {
            if( this.fixture )
            {
                this.displayTools = false;
    
                if( this.canUseColorPicker() == true )
                {
                    this.displayToolsColorPicker = true;
                    this.displayTools = true;
                }
    
                this.getMinMaxDimmer();

                if( this.openDmxConfigurationAtStart == true && this.fixture.index == 0)
                {
                    this.setFixtureDMXIP();
                }
            }
        }


        this.colorPickerForm.controls["inputCtrl"].valueChanges.subscribe
        (
            (color) => 
            {
                if (this.colorPickerForm.controls["pickerCtrl"].valid) 
                {
                    this.colorPickerForm.controls["pickerCtrl"].setValue
                    (
                        color, {
                            emitEvent: false,
                        }
                    );
                    this.parseColorPickerResult(color);
                }
            }
        );

        this.colorPickerForm.controls["pickerCtrl"].valueChanges.subscribe
        (
            (color) =>
            {
                this.colorPickerForm.controls["inputCtrl"].setValue
                (
                    color, 
                    {
                        emitEvent: false,
                    }
                );
                this.parseColorPickerResult(color);
            }
        );
        
    }    

    private canUseColorPicker():boolean
    {
        let result:boolean  = false;
        let isRed:boolean   = false;
        let isGreen:boolean = false;
        let isBlue:boolean  = false;


        if( this.fixture )
        {
            for( let i:number = 0; i < this.fixture.channels.length; i++)
            {
                if(  this.fixture.channels[i].type )
                {
                    if( this.fixture.channels[i].type.label.toUpperCase() == "RED" || this.fixture.channels[i].type_description.toUpperCase()  == "RED" )
                    {
                        isRed = true;
                    }
                    
                    if( this.fixture.channels[i].type.label.toUpperCase() == "GREEN" || this.fixture.channels[i].type_description.toUpperCase()  == "GREEN" )
                    {
                        isGreen = true;
                    }
    
                    if( this.fixture.channels[i].type.label.toUpperCase() == "BLUE" || this.fixture.channels[i].type_description.toUpperCase()  == "BLUE" )
                    {
                        isBlue = true;
                    }
                }
            }
        }

        if( isRed == true && isGreen == true && isBlue == true )
        {
            result = true;
        }

        return result;
    }


    /**
    * Actions
    * 
    */

    /**
     * Close Fixture Component
     */
    public close()
    {
        this.onClose.emit( this.fixture );
    }

    /**
     * Remove Fixture Component
     */
    public remove()
    {
        this.onRemove.emit( this.fixture );
    }
 

    /**
     * Display informations
     */
    public displayInfos()
    {
        let message:string = "<p>" + this.fixture.manufacturer + " - " + this.fixture.label + "</p>";
        message += "<ul>";

        message += "<li>Dimensions :</li>";
        message += "<ul>";
        message += "<li>Weight : " + this.fixture.dimension_weight + " Kg</li>";
        message += "<li>Width : " + this.fixture.dimension_width + " mm</li>";
        message += "<li>Height : " + this.fixture.dimension_height + " mm</li>";
        message += "<li>Depth : " + this.fixture.dimension_depth + " mm</li>";
        message += "</ul>";

        message += "<li>Technical :</li>";
        message += "<ul>";
        message += "<li>Power Consumation : " + this.fixture.technical_power_consumption + " W</li>";
        message += "<li>DMX Connector : " + this.fixture.technical_dmx_connector + "</li>";
        message += "</ul>";

        message += "<li>Bulb</li>";
        message += "<ul>";
        message += "<li>type : " + this.fixture.bulb_type + "</li>";
        message += "<li>lumens : " + this.fixture.bulb_lumens + "</li>";
        message += "<li>color temperature : " + this.fixture.bulb_color_temperature + "</li>";
        message += "</ul>";

        message += "<li>Lens</li>";
        message += "<ul>";
        message += "<li>label : " + this.fixture.lens_label + "</li>";
        message += "<li>degree min : " + this.fixture.lens_degree_min + "</li>";
        message += "<li>degree max : " + this.fixture.lens_degree_max + "</li>";
        message += "</ul>";

        message += "<li>Focus</li>";
        message += "<ul>";
        message += "<li>type : " + this.fixture.focus_type + "</li>";
        message += "<li>pan max : " + this.fixture.focus_pan_max + "</li>";
        message += "<li>tilt max : " + this.fixture.focus_tilt_max + "</li>";
        message += "</ul>";

        message += "</ul>"

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:"Informations", 
                    content:message,
                    yes_button_label:"CloseP",
                    no_button_label:"Close",
                    cancel_button_label:"Close",
                    mode_question:false,
                    mode_prompt:false,
                    mode_prompt_type:"text",
                    prompt_value:"DMX IP",
                    disable_cancel:false,
                    prompt:'' 
                }
            }
        );

    }

    /**
     * Blackout
     */
    public blackout()
    {
        for( let i:number = 0; i < this.fixture.channels.length; i++)
        {
            this.fixture.channels[i].value = 0;
        }

        this.color_red      = 0;
        this.color_green    = 0;
        this.color_blue     = 0;
        this.color_alpha    = 0;

        this.changeFixtuesDatas( true );
    }


    /**
     * Play
     */
    public play()
    {
        this.changeFixtuesDatas( true );
    }


    /**
     * Set Fixture Reference
     */
    public setFixtureReference()
    {
        let message:string = "<p>Please enter a reference</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:this.fixture.label, 
                    content:message,
                    yes_button_label:"Set Reference",
                    no_button_label:"Cancel",
                    cancel_button_label:"Cancel",
                    mode_question:false,
                    mode_prompt:true,
                    mode_prompt_type:"text",
                    prompt_value:"Reference",
                    disable_cancel:false,
                    prompt:this.fixture.reference 
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
                                this.fixture.reference = result.value;
                            }
                        }
                    }
                }
            }
        );
    }

    /**
     * Display informations
     */
    public setFixtureDMXIP()
    {
        let message:string = "<p>Please enter DMX IP</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:this.fixture.label, 
                    content:message,
                    yes_button_label:"Set IP",
                    no_button_label:"Cancel",
                    cancel_button_label:"Cancel",
                    mode_question:false,
                    mode_prompt:true,
                    mode_prompt_type:"text",
                    prompt_value:"DMX IP",
                    disable_cancel:false,
                    prompt:this.fixture.index 
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
                                // Check if result.value is a integer between 0 and 512
                                if( CommonsService.isNumeric( result.value ) )
                                {
                                    let futureIndex:number = parseInt( result.value );

                                    if( futureIndex >= 0 && futureIndex <= 512)
                                    {
                                        displayError = false;
                                        this.fixture.index = futureIndex;
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
                                    let message_error:string = "The DMX IP must be a number between 0 and 512";
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
                                                prompt_value:"DMX IP",
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
     * Edit fixture
     */
    public edit()
    {
        let popup_width:number = this.commonsService.getWidth();
        popup_width -= 100;
        if( popup_width < 700 )
        {
            popup_width = 700;
        }


        let dialogRef = this.dialog.open
        (
            PopupManageFixture, 
            {
                disableClose:true,
                width:popup_width +'px',
                maxWidth:popup_width +'px',
                data: 
                { 
                   fixture:this.fixture
                }
            }
        );

        dialogRef.afterClosed().subscribe
        (
            result => 
            {               
                if( result )
                {
                    if( result.fixture )
                    {
                        this.fixture = result.fixture;
                    }
                }
            }
        );
    }



    /**
    * Fixtures
    * 
    */


    /**
     * Change fixture datas
     */
    public changeFixtuesDatas( changeForTools:boolean = true)
    {
        for(  let i:number = 0; i < this.fixture.channels.length; i++)
        {
            this.appService.dmx_buffer[this.fixture.index + this.fixture.channels[i].index] = this.fixture.channels[i].value;

            if( changeForTools == true)
            {
                if(  this.fixture.channels[i].type )
                {
                    if( this.fixture.channels[i].type.label.toUpperCase() == "RED" || this.fixture.channels[i].type_description.toUpperCase()  == "RED" )
                    {
                        this.color_red = this.fixture.channels[i].value;
                    }
                    
                    if( this.fixture.channels[i].type.label.toUpperCase() == "GREEN" || this.fixture.channels[i].type_description.toUpperCase()  == "GREEN" )
                    {
                        this.color_green = this.fixture.channels[i].value;
                    }
        
                    if( this.fixture.channels[i].type.label.toUpperCase() == "BLUE" || this.fixture.channels[i].type_description.toUpperCase()  == "BLUE" )
                    {
                        this.color_blue= this.fixture.channels[i].value;
                    }
        
                    if( this.fixture.channels[i].type.label.toUpperCase().includes("DIMMER") || this.fixture.channels[i].type_description.toUpperCase().includes("DIMMER") )
                    {
                        this.color_alpha= this.fixture.channels[i].value;
                    }   
                }
            }
        }

        if( changeForTools == true)
        {
            this.updateColorPicker();
        }
        

        this.server.sendDMX();
    }

    /**
     * Change channel capability
     * @param capability 
     */
    public changeCapability( channel:FixtureChannel )
    {

        let message:string = "<p>Select a capability</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:this.fixture.label, 
                    content:message,
                    yes_button_label:"Set Capability",
                    no_button_label:"Cancel",
                    cancel_button_label:"Cancel",
                    mode_question:false,
                    mode_prompt:true,
                    mode_prompt_type:"select",
                    prompt_value:"Capbilities",
                    disable_cancel:true,
                    items:channel.capabilities,
                    prompt:channel.capability 
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
                            if( result.value.label && result.value.min && result.value.max )
                            {
                                for( let i:number = 0; i < this.fixture.channels.length; i++ )
                                    {
                                        if( this.fixture.channels[i] == channel)
                                        {
                                            for( let j:number = 0; j < this.fixture.channels[i].capabilities.length; j++)
                                            {
                                                if( this.fixture.channels[i].capabilities[j].label == result.value.label )
                                                {
                                                    
                                                    if( result.value.label == this.fixture.channels[i].capabilities[j].label && result.value.min == this.fixture.channels[i].capabilities[j].min && result.value.max == this.fixture.channels[i].capabilities[j].max)
                                                    {
                                                        this.fixture.channels[i].capability = this.fixture.channels[i].capabilities[j];
                                                        this.fixture.channels[i].value      = this.fixture.channels[i].capability.min;
                                                        this.changeFixtuesDatas();
                                                        break;
                                                    }
                                                }
                                            }
                                            break;
                                        }
                                    }
                               
                            }
                        }
                    }
                }
            }
        );

        /*
        for( let i:number = 0; i < this.fixture.channels.length; i++ )
        {
            if( this.fixture.channels[i] == channel)
            {
                this.fixture.channels[i].value = this.fixture.channels[i].capability.min;
                this.changeFixtuesDatas();
                break;
            }
        }
        */
    }

    public changeValueManually( channel:FixtureChannel )
    {
        for( let i:number = 0; i < this.fixture.channels.length; i++ )
        {
            if( this.fixture.channels[i] == channel)
            {
                let message:string = "Set manually channel value for " + this.fixture.label + " - " + this.fixture.channels[i].type.label + " " + this.fixture.channels[i].type_description;

                let dialogRef = this.dialog.open
                (
                    PopupComponent, 
                    {
                        disableClose:true,
                        width:  '555px',
                        data: 
                        { 
                            title_label:this.fixture.label, 
                            content:message,
                            yes_button_label:"Edit Channel Value",
                            no_button_label:"Cancel",
                            cancel_button_label:"Cancel",
                            mode_question:false,
                            mode_prompt:true,
                            mode_prompt_type:"text",
                            prompt_value:"Channel value",
                            disable_cancel:false,
                            prompt:this.fixture.channels[i].value
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
                                        // Check if result.value is a integer between 0 and 512
                                        if( CommonsService.isNumeric( result.value ) )
                                        {
                                            let futureValue:number = parseInt( result.value );

                                            if( futureValue >= 0 && futureValue <= 255)
                                            {
                                                displayError = false;
                                                this.fixture.channels[i].value = futureValue;
                                                this.changeFixtuesDatas(true);
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
                                            let message_error:string = "The new value must be a number between 0 and 255";
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
                                                        prompt_value:"DMX IP",
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
                break;
            }
        }
    }



    /**
     * Color Picker
     * 
     */

    /**
     * Update Color Picker
     */
    private updateColorPicker()
    {
        let alpha:number = (this.dimmer_max * this.color_alpha ) / 255;
        alpha = this.color_alpha / this.dimmer_max;
        if( alpha > 1)
        {
            alpha = 1;
        }

        let color:string = "rgba(" + this.color_red + ", " + this.color_green + ", " + this.color_blue + ", " + alpha + ")"
        this.colorPickerForm.controls["pickerCtrl"].setValue
        (
            color, {
                emitEvent: false,
            }
        );

        this.colorPickerForm.controls["inputCtrl"].setValue
        (
            color, 
            {
                emitEvent: false,
            }
        );
    }


    /**
     * Parse Color Picker Result
     * @param value 
     */
    private parseColorPickerResult( value:string )
    {
        value = value.split('(')[1].split(')')[0];
        let values:string[] = value.split(",");
        let canUpdate:boolean = false;


        if( values.length == 3 )
        {
            this.color_red      = parseInt( values[0] );
            this.color_green    = parseInt( values[1] );
            this.color_blue     = parseInt( values[2] );
            this.color_alpha    = this.dimmer_max;
            canUpdate           = true;
        }

        if( values.length == 4 )
        {
            this.color_red      = parseInt( values[0] );
            this.color_green    = parseInt( values[1] );
            this.color_blue     = parseInt( values[2] );
            this.color_alpha    = Math.floor((  parseFloat( values[3] ) * this.dimmer_max));
            canUpdate           = true;
        }

        if( canUpdate == true )
        {
            for(  let i:number = 0; i < this.fixture.channels.length; i++)
            {
                this.appService.dmx_buffer[this.fixture.index + this.fixture.channels[i].index] = this.fixture.channels[i].value;
    
                if(  this.fixture.channels[i].type )
                {
                    if( this.fixture.channels[i].type.label.toUpperCase() == "RED" || this.fixture.channels[i].type_description.toUpperCase()  == "RED" )
                    {
                        this.fixture.channels[i].value = this.color_red;
                    }
                    
                    if( this.fixture.channels[i].type.label.toUpperCase() == "GREEN" || this.fixture.channels[i].type_description.toUpperCase()  == "GREEN" )
                    {
                        this.fixture.channels[i].value = this.color_green;
                    }
        
                    if( this.fixture.channels[i].type.label.toUpperCase() == "BLUE" || this.fixture.channels[i].type_description.toUpperCase()  == "BLUE" )
                    {
                        this.fixture.channels[i].value = this.color_blue;
                    }
        
                    if( this.fixture.channels[i].type.label.toUpperCase().includes("DIMMER") || this.fixture.channels[i].type_description.toUpperCase().includes("DIMMER") )
                    {

                        this.fixture.channels[i].value = this.color_alpha;
                    }   
                }
            }
        }
        this.changeFixtuesDatas(false);
    }


    /**
     * Change Color Picker
     * @param event 
     */
    public onChangeColorPicker(event:any = null)
    {
        if( event != null )
        {
            this.parseColorPickerResult(event);
        }
    }

    /**
     * Close Color Picker
     * @param event 
     */
    public onCloseColorPicker(event:any = null)
    {
        if( event != null )
        {
            this.parseColorPickerResult(event);
        }
    }


    /**
     * Conveft Alpha to Dimmer
     * @param alpha 
     */
    private convertAlphaToDimmer( alpha:number )
    {

    }

    /**
     * Convert Dimmer to Alpha
     * @param dimmer 
     */
    private convertDimmerToAlpha( dimmer:number )
    {

    }

    /**
     * Get Min Max Dimmer
     */
    private getMinMaxDimmer()
    {
        for( let i:number = 0; i < this.fixture.channels.length; i++)
        {
            if( this.fixture.channels[i].type )
            {
                if( this.fixture.channels[i].type.label.toUpperCase().includes("DIMMER") || this.fixture.channels[i].type_description.toUpperCase().includes("DIMMER") )
                {
                    if( this.fixture.channels[i].capabilities.length == 1 )
                    {
                        this.dimmer_min = 0;
                        this.dimmer_max = 255;
                    }                
                    else
                    {
                        this.dimmer_min = this.fixture.channels[i].capabilities[0].min;
                        this.dimmer_max = this.fixture.channels[i].capabilities[0].max;
                    }
                    break;
                }
            }   
        }
    }
}



