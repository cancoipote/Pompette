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

import { Subscription }                                                                 from 'rxjs';

import { AppService }                                                                   from '../../../../core/service/app.service';
import { ServerService }                                                                from '../../../../core/service/server.service';
import { FixtureComponent }                                                             from '../../../fixture/component/fixture/fixture.component';
import { FixtureService }                                                               from '../../../fixture/service/fixture.service';
import { Fixture }                                                                      from '../../../fixture/vo/fixture';
import { PopupComponent }                                                               from '../../../../commons/popup/popup.component';
import { SearchBoxComponent }                                                           from '../../../../commons/search/search.component';
import { Manufacturer }                                                                 from '../../../fixture/vo/manugacturer';


/**
 * Project Fixture page Component
 * 
 * Fixtures page of the site
 */
@Component({
    selector: 'project-fixture',
    templateUrl: './project.fixture.component.html',
    styleUrls: ['./project.fixture.component.css'],
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
        FixtureComponent,
        SearchBoxComponent
        
    ]
})
export class ProjectFixtureComponent implements OnInit {

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
    { }
    
    /**
     * Fixture
     */
    public fixture!:Fixture;

    /**
     * Display menu or not
     */
    public display_menu:boolean = true;

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
     * Filtre Manufacturer
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



    /**
    * Actions
    * 
    */

    /**
     * Select a fixture from menu
     * @param manufacturer 
     * @param fixture 
     */
    public selectFixtures( fixture:Fixture )
    {
       let fixtureToAdd:Fixture = JSON.parse(JSON.stringify(fixture));
       fixtureToAdd.index       = 0;
       this.appService.project.fixtures.push(fixtureToAdd);
    }


    /**
     * Close / Remove a fixture
     * @param fixture 
     */
    public closeFixture(fixture:Fixture)
    {
        for( let i:number = 0; i < this.appService.project.fixtures.length; i++ )
        {
            if( this.appService.project.fixtures[i].manufacturer == fixture.manufacturer && this.appService.project.fixtures[i].label == fixture.label && this.appService.project.fixtures[i].index == fixture.index)
            {
                let content_message:string = "Do you want to remove this fixture ?<br><br><b>"+fixture.label+" (" + fixture.index + ") </b>";
       
                let dialogRef = this.dialog.open
                (
                    PopupComponent, 
                    {
                        disableClose:true,
                        width:  '555px',
                        data: 
                        { 
                            title_label:"Warning", 
                            content:content_message,
                            yes_button_label:"Yes, I'm sure",
                            no_button_label:"No",
                            mode_question:true
                        }
                    }
                );
    
                dialogRef.afterClosed().subscribe
                (
                    result => 
                    {               
                        if( result )
                        {
                            if( result.answer != null )
                            {
                                if( result.answer == true )
                                {
                                    for( let a:number = 0; a < this.appService.project.sequences.length; a++ )
                                    {
                                        for( let b:number = 0; b < this.appService.project.sequences[a].sequenceFixtures.length; b++ )
                                        {
                                            if( this.appService.project.sequences[a].sequenceFixtures[b].fixture.manufacturer == fixture.manufacturer && this.appService.project.sequences[a].sequenceFixtures[b].fixture.label == fixture.label && this.appService.project.sequences[a].sequenceFixtures[b].fixture.index == fixture.index && this.appService.project.sequences[a].sequenceFixtures[b].fixture.id == fixture.id)
                                            {
                                                this.appService.project.sequences[a].sequenceFixtures.splice(b,1);
                                            }
                                        }
                                    }

                                    this.appService.project.fixtures.splice(i,1);
                                }
                            }
                        }
                    }
                );
                break;
            }
        }
    }
}