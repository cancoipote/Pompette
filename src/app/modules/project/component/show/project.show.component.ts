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


import { AppService }                                                                   from '../../../../core/service/app.service';
import { ServerService }                                                                from '../../../../core/service/server.service';
import { FixtureComponent }                                                             from '../../../fixture/component/fixture/fixture.component';
import { FixtureService }                                                               from '../../../fixture/service/fixture.service';
import { PopupComponent }                                                               from '../../../../commons/popup/popup.component';
import { CommonsService }                                                               from '../../../../core/service/commons.service';
import { Show }                                                                         from '../../../show/vo/SHow';
import { SearchBoxComponent }                                                           from '../../../../commons/search/search.component';
import { CdkDragDrop, DragDropModule, moveItemInArray }                                 from '@angular/cdk/drag-drop';
import { ShowComponent } from '../../../show/component/show/show.component';


/**
 * Project Show page Component
 * 
 * Show page of the site
 */
@Component({
    selector: 'project-show',
    templateUrl: './project.show.component.html',
    styleUrls: ['./project.show.component.css'],
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
        SearchBoxComponent,
        ShowComponent
        
    ]
})
export class ProjectShowComponent implements OnInit {

    /**
    * Constructor
    * 
    */
    constructor
    (
        public appService: AppService,
		public server: ServerService,
        public fixtureService:FixtureService,
        private dialog: MatDialog,
        public commonsService:CommonsService,

    ) 
    { }
    
    /**
     * Display menu or not
     */
    public display_menu:boolean = true;

    /**
     *  Search content - used for filter
     */
    public search_text:string = "";

    /**
     * Show
     */
    public show:Show | null = null;

    /**
     * List of shows
     */
    public shows:Show[] = new Array();

    /**
    * Initialisation
    * 
    */
    ngOnInit(): void 
    {
        this.filter();
        if( this.shows.length > 0 )
        {
            this.selectShow( this.shows[0] );
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
        this.shows = new Array();

        if( this.search_text == null  || this.search_text == "" || this.search_text == " " )
        {
            this.shows = this.appService.project.shows;
        }
        else
        {
            for( let i:number = 0; i < this.appService.project.shows.length; i++)
            {
               if( this.appService.project.shows[i].label.toLowerCase().includes(this.search_text.toLowerCase()) )
               {
                   this.shows.push(this.appService.project.shows[i]);
               }
            }
        }
    }

    /**
     * Drop 
     * @param event 
     */
    public onDrop(event: CdkDragDrop<any[]>) 
    {
        moveItemInArray(this.appService.project.shows, event.previousIndex, event.currentIndex);
    }


    /**
    * Actions
    * 
    */

    /**
     * Create a new show
     */
   public createShow()
   {
    let message:string = "<p>Please enter a name for your new Show</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:'Create Show', 
                    content:message,
                    yes_button_label:"Create",
                    no_button_label:"Cancel",
                    cancel_button_label:"Cancel",
                    mode_question:false,
                    mode_prompt:true,
                    mode_prompt_type:"text",
                    prompt_value:"Show's name",
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
                                    let show:Show = new Show();
                                    show.label = result.value;
                                    this.appService.project.shows.push( show );
                                    this.selectShow(show);
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
    * Select Show
    * @param show 
    */
   public selectShow( show:Show )
   {
        for( let i:number = 0; i < this.appService.project.shows.length; i++ )
        {
            this.appService.project.shows[i].isSelected = false;

            if( this.appService.project.shows[i] == show )
            {
                this.appService.project.shows[i].isSelected = true;
            }
        }

        this.show = show;
   }


   /**
    * Remove Show
    * @param show 
    */
   public removeShow( show:Show )
   {
        let message:string = "<p>Do you want to remove this show " + show.label + " ?</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:'Delete show', 
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
                            for( let i:number = 0; i < this.appService.project.shows.length; i++ )
                            {
                                if( this.appService.project.shows[i] == show )
                                {
                                    this.appService.project.shows.splice( i, 1 );
                                    this.show = null;

                                    if( this.appService.project.shows.length > 0 )
                                    {
                                        this.selectShow( this.appService.project.shows[0] );
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
}