import { Component }                                                                    from '@angular/core';
import { Inject}                                                                        from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog }                                     from '@angular/material/dialog';
import { MatButtonModule }                                                              from '@angular/material/button';
import { MatCardModule }                                                                from '@angular/material/card';
import { ReactiveFormsModule }                                                          from '@angular/forms';
import { MatInputModule }                                                               from '@angular/material/input';
import { CommonModule }                                                                 from '@angular/common'; 
import { FormsModule }                                                                  from '@angular/forms';
import { MatDatepickerModule }                                                          from '@angular/material/datepicker';
import { MatGridListModule }                                                            from '@angular/material/grid-list';
import { MatDividerModule}                                                              from '@angular/material/divider';
import { MatCommonModule }                                                              from '@angular/material/core';
import { MatSelectModule }                                                              from '@angular/material/select';
import { MatTabsModule }                                                                from '@angular/material/tabs';
import { MatListModule }                                                                from '@angular/material/list';
import { MatIconModule }                                                                from '@angular/material/icon';

import { CommonsService }                                                               from '../../../../core/service/commons.service';
import { Fixture }                                                                      from '../../vo/fixture';
import { FixtureService }                                                               from '../../service/fixture.service';
import { FixtureChannel }                                                               from '../../vo/fixture.channel';
import { PopupComponent }                                                               from '../../../../commons/popup/popup.component';
import { FixtureChannelCapability }                                                     from '../../vo/fixture.channel.capability';
import { ServerService }                                                                from '../../../../core/service/server.service';


/**

/**
 * Kylii Popup 
 * 
 * This popup is used to display html
 */
@Component(
{
    selector: 'popup-manage-fixture-component',
    templateUrl: './popup.manage.fixture.component.html',
    styleUrls: [ './popup.manage.fixture.component.css'],
    standalone: true,
    imports: [
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        MatDatepickerModule,
        MatGridListModule,
        MatDividerModule,
        MatCommonModule,
        MatSelectModule,
        MatTabsModule,
        MatListModule,
        MatIconModule
        ],
})
export class PopupManageFixture 
{   
    /**
    * Constuctor
    *
    */
	constructor
	(

        /**
        * Access to the dialog service
        */
		public dialogRef: MatDialogRef<PopupManageFixture>,
        private commonsService:CommonsService,
        public fixtureService:FixtureService,
        private serverService:ServerService,
        private dialog: MatDialog,

        /**
        * Datas passed to the popup
        */
		@Inject(MAT_DIALOG_DATA) public data: any
	) 
    {
        if( data.fixture )
        {
            this.fixture = JSON.parse( JSON.stringify( data.fixture ) );

            for( let i:number = 0; i < this.fixtureService.fixtureTypes.length; i++ )
            {
                if( this.fixtureService.fixtureTypes[i].id == this.fixture.type.id )
                {
                    this.fixture.type = this.fixtureService.fixtureTypes[i];
                    break;
                }
            }


            for( let i:number = 0; i < this.fixture.channels.length; i++ )
            {
                for( let j:number = 0; j < this.fixtureService.fixtureChannelTypes.length; j++ )
                {
                    if( this.fixtureService.fixtureChannelTypes[j].id == this.fixture.channels[i].type.id )
                    {
                        this.fixture.channels[i].type = this.fixtureService.fixtureChannelTypes[j];
                        break;
                    }
                }
            }

        }
    }

    /**
    * Popup Height
    */
    public popup_height:number = 500;

    /**
     * Fixture
     */
    public fixture!:Fixture;

    /**
     * Channel
     */
    public channel!:FixtureChannel;


    /**
     * Is new channel
     */
    public is_new_channel:boolean = true;


    /*****************************************************************/
    //
    // Initialisation
    //
    /*****************************************************************/

    /**
    * Initialisation
    *
    */
    ngOnInit(): void 
    {
        this.popup_height = this.commonsService.getHeight();
    }




    /*****************************************************************/
    //
    // Channels
    //
    /*****************************************************************/

    /**
     * Create a channel
     */
    public createChannel()
    {
        this.is_new_channel         = true;
        this.channel                = new FixtureChannel();
        this.channel.capabilities   = new Array();

        let capabality:FixtureChannelCapability = new FixtureChannelCapability();
        capabality.min = 0;
        capabality.max = 255;
        capabality.label = "Intensity";
        this.channel.capabilities.push( capabality );

        this.channel.index          = this.fixture.channels.length;
        this.channel.type           = this.fixtureService.fixtureChannelTypes[0];
        
        this.fixture.channels.push( this.channel );
    }


    /**
     * Remove Channel
     */
    public removeChannel()
    {
        if( this.fixture.channels.length == 1)
        {
            let message_error:string = "You can't remove the last channel, a fixture needs at least one.";
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
            return;
        }


        let message:string = "<p>Do you want to remove this channel " + this.channel.type.label + " - " +  this.channel.type_description + " ?</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:'Remove channel', 
                    content:message,
                    yes_button_label:"Yes",
                    no_button_label:"No",
                    cancel_button_label:"Cancel",
                    mode_question:true,
                    mode_prompt:false,
                    mode_prompt_type:"text",
                    prompt_value:"channel's name",
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
                            for( let i:number = 0; i < this.fixture.channels.length; i++ )
                            {
                                if(  this.channel == this.fixture.channels[i] )
                                {
                                    this.fixture.channels.splice(i,1);
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
     * Select a channel
     * @param channel 
     */
    public selectChannel( channel:FixtureChannel )
    {
        this.is_new_channel = false;
        this.channel = channel;
    }


    /**
     * Change Channel Index
     */
    public changeChannelIndex( channel:FixtureChannel )
    {
        let message:string = "<p>Please enter channel's index</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:"Set Channel Index", 
                    content:message,
                    yes_button_label:"Set index",
                    no_button_label:"Cancel",
                    cancel_button_label:"Cancel",
                    mode_question:false,
                    mode_prompt:true,
                    mode_prompt_type:"text",
                    prompt_value:"Channel index",
                    disable_cancel:true,
                    prompt:channel.index 
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
                                        channel.index = futureIndex;
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
                                    let message_error:string = "The channel index must be a number between 0 and 512";
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
     * Create capabality
     */
    public createCapabality( )
    {
        let capabality:FixtureChannelCapability = new FixtureChannelCapability();
        capabality.min = 0;
        capabality.max = 255;

        this.channel.capabilities.push( capabality );
    }


    /**
     * Remove Capabality
     * @param capabality 
     */
    public removeCapabality( capabality:FixtureChannelCapability )
    {

        if( this.channel.capabilities.length == 1)
            {
                let message_error:string = "You can't remove the last capability, a channel needs at least one.";
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
                return;
            }

        let message:string = "<p>Do you want to remove this capablity " + capabality.label + " ?</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:'Remove capabality', 
                    content:message,
                    yes_button_label:"Yes",
                    no_button_label:"No",
                    cancel_button_label:"Cancel",
                    mode_question:true,
                    mode_prompt:false,
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
                    if( result.answer )
                    {
                        if( result.answer == true )
                        {
                            for( let i:number = 0; i <  this.channel.capabilities.length; i++ )
                            {
                                if( capabality ==  this.channel.capabilities[i] )
                                {
                                    this.channel.capabilities.splice(i,1);
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
     * Change Capabality Min
     */
    public changeCapabalityMin( capabality:FixtureChannelCapability )
    {
        let message:string = "<p>Please enter capabality min</p>";
 
        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:"Set capabality min", 
                    content:message,
                    yes_button_label:"Set capabality min",
                    no_button_label:"Cancel",
                    cancel_button_label:"Cancel",
                    mode_question:false,
                    mode_prompt:true,
                    mode_prompt_type:"text",
                    prompt_value:"Capabality min",
                    disable_cancel:true,
                    prompt:capabality.min 
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
                                // Check if result.value is a integer between 0 and 255
                                if( CommonsService.isNumeric( result.value ) )
                                {
                                    let futureIndex:number = parseInt( result.value );
 
                                    if( futureIndex >= 0 && futureIndex <= 255)
                                    {
                                        displayError = false;
                                        capabality.min = futureIndex;
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
                                    let message_error:string = "The capabality must be a number between 0 and 255";
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
     * Change Capabality Max
     */
    public changeCapabalityMax( capabality:FixtureChannelCapability )
    {
        let message:string = "<p>Please enter capabality max</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:"Set capabality max", 
                    content:message,
                    yes_button_label:"Set capabality max",
                    no_button_label:"Cancel",
                    cancel_button_label:"Cancel",
                    mode_question:false,
                    mode_prompt:true,
                    mode_prompt_type:"text",
                    prompt_value:"Capabality max",
                    disable_cancel:true,
                    prompt:capabality.max 
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
                                // Check if result.value is a integer between 0 and 255
                                if( CommonsService.isNumeric( result.value ) )
                                {
                                    let futureIndex:number = parseInt( result.value );

                                    if( futureIndex >= 0 && futureIndex <= 255)
                                    {
                                        displayError = false;
                                        capabality.min = futureIndex;
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
                                    let message_error:string = "The capabality max must be a number between 0 and 255";
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

    /*****************************************************************/
    //
    // Informations
    //
    /*****************************************************************/


    

    /*****************************************************************/
    //
    // Popup
    //
    /*****************************************************************/


    /**
     * On Close Popup
     */
    public onClose()
    {
        this.dialogRef.close( {fixture:null} );
    }

    /**
     * On Save
     */
     public onSave()
     {
        this.serverService.saveFixture( this.fixture );
        this.dialogRef.close( {fixture:this.fixture} );
     }
}

