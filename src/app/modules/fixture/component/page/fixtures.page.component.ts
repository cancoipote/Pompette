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
import { Subscription }                                                                 from 'rxjs';

import { AppService }                                                                   from '../../../../core/service/app.service';
import { ServerService }                                                                from '../../../../core/service/server.service';
import { FixtureService }                                                               from '../../service/fixture.service';
import { Manufacturer }                                                                 from '../../vo/manugacturer';
import { Fixture }                                                                      from '../../vo/fixture';
import { FixtureComponent }                                                             from '../fixture/fixture.component';
import { SearchBoxComponent }                                                           from '../../../../commons/search/search.component';
import { FixtureChannel } from '../../vo/fixture.channel';
import { FixtureChannelCapability } from '../../vo/fixture.channel.capability';
import { PopupComponent } from '../../../../commons/popup/popup.component';

/**
 * Fixtures page Component
 * 
 * Fixtures page of the site
 */
@Component({
    selector: 'fixtures-page',
    templateUrl: './fixtures.page.component.html',
    styleUrls: ['./fixtures.page.component.css'],
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
        FixtureComponent,
        SearchBoxComponent
        
    ]
})
export class FixturesPageComponent implements OnInit {

    /**
    * Constructor
    * 
    */
    constructor
    (
        public appService: AppService,
		public server: ServerService,
        public fixtureService:FixtureService,
        private dialog: MatDialog
    ) 
    { 
        
    }
    
    /**
     * Manufacturer
     */
    public manufacturer: Manufacturer | null = null;

    /**
     * Fixture
     */
    public fixture: Fixture | null = null;

    /**
     * List of manufcaturers
     */
    public manufacturers:Manufacturer[] = new Array();

    /**
     *  Search content - used for filter
     */
    public search_text:string = "";

    /**
     * Subscription 
     */
    public manufacturersSubscription: Subscription = new Subscription();

    /**
     * New Manufacturer Label
     */
    private newManufacturerLabel:string = "";

    /**
     * New Fixture Label
     */
    private newFixtureLabel:string = "";

    /**
    * Initialisation
    * 
    */
    ngOnInit(): void 
    {
        this.filter();

        this.manufacturersSubscription = this.fixtureService.getDataUpdateListener()
        .subscribe
        (
            (updatedData: any[]) => 
            {
                this.filter();
            }
        );
    }    


    /**
    * Actions
    * 
    */


    /**
     * Create a new fixture
     */
    public createFixture()
    {
        this.setNewManufacturerLabel();
    }

    /**
     * Set New Manufacturer Label
     */
    private setNewManufacturerLabel()
    {
        let message:string = "<p>Please enter a name for your new fixture manufacturer</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:'New fixture manufacturer', 
                    content:message,
                    yes_button_label:"Set label",
                    no_button_label:"Close",
                    cancel_button_label:"Cancel",
                    mode_question:false,
                    mode_prompt:true,
                    mode_prompt_type:"text",
                    prompt_value:"Manufacturer's name",
                    disable_cancel:false,
                    prompt:'' 
                }
            }
        );
        

        let errorMessage:String = '';
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
                            errorMessage = "You have to fill a name";
                        }
                        else
                        {
                            if( result.value == "" || result.value == " ")
                            {
                                errorMessage = "You have to fill a name";
                            }
                            else
                            {
                                this.newManufacturerLabel = result.value;
                                this.setNewFixtureLabel();
                            }
                        }
                    }
                    else
                    {
                        errorMessage = "You have to fill a name";
                    }
                }
                else
                {
                    errorMessage = "You have to fill a name";
                }
            }
        );

        if( errorMessage != "" )
        {
            this.dialog.open
            (
                PopupComponent, 
                {
                    disableClose:true,
                    width:  '555px',
                    data: 
                    { 
                        title_label:'Error', 
                        content:errorMessage,
                        yes_button_label:"Ok",
                        no_button_label:"Close",
                        cancel_button_label:"Cancel",
                        mode_question:false,
                        mode_prompt:false,
                        mode_prompt_type:"text",
                        prompt_value:"",
                        disable_cancel:true,
                        display_close:true,
                        display_cancel:false,
                        prompt:'' 
                    }
                }
            );
        }
    }

    /**
     * Set New Fixture Label
     */
    private setNewFixtureLabel()
    {
        let message:string = "<p>Please enter a name for your new fixture</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:'New fixture', 
                    content:message,
                    yes_button_label:"Set label",
                    no_button_label:"Close",
                    cancel_button_label:"Cancel",
                    mode_question:false,
                    mode_prompt:true,
                    mode_prompt_type:"text",
                    prompt_value:"Ficture's name",
                    disable_cancel:true,
                    prompt:'' 
                }
            }
        );
        

        let errorMessage:String = '';
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
                            errorMessage = "You have to fill a name";
                        }
                        else
                        {
                            if( result.value == "" || result.value == " ")
                            {
                                errorMessage = "You have to fill a name";
                            }
                            else
                            {
                                this.newFixtureLabel = result.value;
                                this.initNewFixture();
                            }
                        }
                    }
                    else
                    {
                        errorMessage = "You have to fill a name";
                    }
                }
                else
                {
                    errorMessage = "You have to fill a name";
                }
            }
        );

        if( errorMessage != "" )
        {
            this.dialog.open
            (
                PopupComponent, 
                {
                    disableClose:true,
                    width:  '555px',
                    data: 
                    { 
                        title_label:'Error', 
                        content:errorMessage,
                        yes_button_label:"Ok",
                        no_button_label:"Close",
                        cancel_button_label:"Cancel",
                        mode_question:false,
                        mode_prompt:false,
                        mode_prompt_type:"text",
                        prompt_value:"",
                        disable_cancel:true,
                        display_close:true,
                        display_cancel:false,
                        prompt:'' 
                    }
                }
            );
        }
    }

    /**
     * Init Nex Fixture
     */
    private initNewFixture()
    {
        this.manufacturer           = new Manufacturer();
        this.manufacturer.label     = this.newManufacturerLabel;

        this.fixture                = new Fixture();
        this.fixture.label          = this.newFixtureLabel;
        this.fixture.manufacturer   = this.newManufacturerLabel;

        // get timestamp of now
        let timestamp = new Date().getTime();
        this.fixture.id = timestamp;
        
        this.fixture.channels = new Array();
        this.fixture.type = this.fixtureService.fixtureTypes[0];

        let channel:FixtureChannel = new FixtureChannel();
        

        channel.capabilities   = new Array();

        let capabality:FixtureChannelCapability = new FixtureChannelCapability();
        capabality.min = 0;
        capabality.max = 255;
        capabality.label = "Intensity";
        channel.capabilities.push( capabality );

        channel.index               = this.fixture.channels.length;
        channel.type                = this.fixtureService.fixtureChannelTypes[0];
        channel.type_description    = "";

        this.fixture.channels.push( channel );
        
        this.server.saveFixture( this.fixture );

        this.server.blackOut();
    }

    /**
     * Remove Fixture
     * @param fixture 
     */
    public removeFixture( fixture:Fixture )
    {
        let message:string = "<p>Do you want to remove this fixture " + fixture.manufacturer + " - " +  fixture.label + " ?</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:'Delete fixture', 
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
                            this.server.deleteFixture(fixture);
                            this.manufacturer = null;
                            this.fixture = null;
                        }
                    }
                }
            }
        );
    }

    /**
     * Select a fixture from menu
     * @param manufacturer 
     * @param fixture 
     */
    public selectFixtures( manufacturer:Manufacturer, fixture:Fixture )
    {
        this.manufacturer = manufacturer;
        this.fixture = fixture;
        this.server.blackOut();
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
        this.manufacturers = new Array();

        if( this.search_text == null  || this.search_text == "" || this.search_text == " " )
        {
            this.manufacturers = this.fixtureService.manufacturers;
        }
        else
        {
            for( let i:number = 0; i < this.fixtureService.manufacturers.length; i++)
            {
                let item:Manufacturer = this.filterManufacturer( this.fixtureService.manufacturers[i] );
                if( item.label != "none")
                {
                    this.manufacturers.push( item );
                }
            }
        }
    }

    /**
     * FIltre Manufacturer
     * @param manufacturer 
     */
    private filterManufacturer( manufacturer:Manufacturer):Manufacturer
    {
        let result:Manufacturer = new Manufacturer();
        result.label = "none";

        for( let i:number = 0; i < manufacturer.fixtures.length; i++ )
        {   
            if( manufacturer.fixtures[i].label.toLowerCase().includes(this.search_text.toLowerCase()) )
            {
                result.fixtures.push(manufacturer.fixtures[i]);
            }
        }

        if( result.fixtures.length == 0)
        {
            result.label = "none";
        }
        else
        {
            result.label = manufacturer.label;
        }

        return result;
    }
}