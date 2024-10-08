import { Component, OnInit }                                                            from '@angular/core';
import { Router }                                                                       from '@angular/router';
import { MatDialog }                                                                    from '@angular/material/dialog';

import { AppService }                                                                   from './core/service/app.service';
import { ServerService }                                                                from './core/service/server.service';
import { Project }                                                                      from './modules/project/vo/project';
import { PopupComponent }                                                               from './commons/popup/popup.component';
import { ProjectService }                                                               from './modules/project/service/project.service';
import { FixtureService }                                                               from './modules/fixture/service/fixture.service';
import { PopupMonitoring }                                                              from './modules/monitoring/component/popup.monitoring.component';
import { CommonsService }                                                               from './core/service/commons.service';
import { Engine }                                                                       from './core/engine/engine';
import { PopupExport }                                                                  from './modules/project/component/popup_export/popup.export.component';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.sass'
})
export class AppComponent implements OnInit{

    constructor (
        public router: Router,
        public appService: AppService,
        public server: ServerService,
        public projectService:ProjectService,
        public fixtureService:FixtureService,
        private commonsService:CommonsService,
        private engine: Engine,
        private dialog: MatDialog
    ) {}

    /**
     * Title
     */
    public title = 'Pompette';
    
    /**
     * Popup Monitoring open or not
     */
    private popupMonitoring:any | null = null;



    /****************************
     *
     * Initialisation
     *
     */

    ngOnInit() 
    {
        this.gotoHome();
        this.fixtureService.loadConfiguration();
        this.server.initalisation();
        this.engine.start();
    }
  


    /****************************
     *
     * Actions
     *
     */

    /**
     * Manage Project Frequency
     */
    public manageProjectFrequency()
    {
        let message:string = "<p>Please enter Frequeny</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:"Frequency", 
                    content:message,
                    yes_button_label:"Set Frequency",
                    no_button_label:"Cancel",
                    cancel_button_label:"Cancel",
                    mode_question:false,
                    mode_prompt:true,
                    mode_prompt_type:"text",
                    prompt_value:"Frequency",
                    disable_cancel:false,
                    prompt:this.appService.project.frequency
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
                                    let frequency:number = parseInt( result.value );

                                    if( frequency > 0 )
                                    {
                                        displayError = false;
                                        this.appService.project.frequency = frequency;
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
                                    let message_error:string = "Frequency must be a number greater than 0";
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
     * Manage Base Frequency
     */
    public manageBaseFrequency()
    {
        let message:string = "<p>Please enter Frequeny</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:"Frequency", 
                    content:message,
                    yes_button_label:"Set Frequency",
                    no_button_label:"Cancel",
                    cancel_button_label:"Cancel",
                    mode_question:false,
                    mode_prompt:true,
                    mode_prompt_type:"text",
                    prompt_value:"Frequency",
                    disable_cancel:false,
                    prompt:this.appService.frequency
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
                                    let frequency:number = parseInt( result.value );

                                    if( frequency > 0 )
                                    {
                                        displayError = false;
                                        this.appService.frequency = frequency;
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
                                    let message_error:string = "Frequency must be a number greater than 0";
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
     * Change Project Name
     */
    public onChangeProjectLabel()
    {
        let message:string = "<p>Please enter a new name for your Project</p>";

        let dialogRef = this.dialog.open
        (
            PopupComponent, 
            {
                disableClose:true,
                width:  '555px',
                data: 
                { 
                    title_label:'Edit Project', 
                    content:message,
                    yes_button_label:"Edit",
                    no_button_label:"Cancel",
                    cancel_button_label:"Cancel",
                    mode_question:false,
                    mode_prompt:true,
                    mode_prompt_type:"text",
                    prompt_value:"Project's name",
                    disable_cancel:false,
                    prompt:this.appService.project.label 
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
                                this.appService.project.label       = result.value;
                            }
                        }
                    }
                }
            }
        );
    }


    /**
     * Display a popup for monitoring the DMX
     */
    public monitoring()
    {
        if( this.popupMonitoring == null )
        {
            let popup_width:number = this.commonsService.getWidth();
            popup_width -= 100;
            if( popup_width < 700 )
            {
                popup_width = 700;
            }
            popup_width = 1000;
            this.popupMonitoring = this.dialog.open
            (
                PopupMonitoring, 
                {
                    panelClass: 'monitoring-popup-container',
                    disableClose:true,
                    hasBackdrop:false,
                    width:popup_width +'px',
                    maxWidth:popup_width +'px',
                    data: 
                    { 
                    }
                },
            );

            this.popupMonitoring.afterClosed().subscribe
            (
                (result: any) => 
                {               
                    this.popupMonitoring = null;
                }
            );
        }
        else
        {
            this.popupMonitoring.close();
            this.popupMonitoring = null;
        }
    }


    /**
     * Blackout
     */
    public blackOut()
    {
        this.server.blackOut();
    }


    /**
     * Export Sequence
     */
    public export()
    {
        let popup_width:number = this.commonsService.getWidth();
        popup_width -= 100;
        if( popup_width < 700 )
        {
            popup_width = 700;
        }


        let dialogRef = this.dialog.open
        (
            PopupExport, 
            {
                disableClose:true,
                width:popup_width +'px',
                maxWidth:popup_width +'px',
                data: 
                { 
                }
            }
        );
    }


    /****************************
     *
     * Router
     *
     */

    /**
     * Goto Home dashboard
     */
    public gotoHome()
    {
        this.router.navigate([this.appService.DASHBOARD_PAGE]);
    }

    /**
     * Goto Fixtures
     */
    public gotoFixtures()
    {
        this.router.navigate(["/fixtures"]);
    }

    /**
     * Goto DMX Tester
     */
    public gotoDMXTester()
    {
        this.router.navigate(["/DMXTester"]);
    }


    /****************************
     *
     * Save
     *
     */

    /**
     * Save project
     */
    public save( closeAfterSave:boolean = false, openAfterSave:boolean = false, event:any=null )
    {
        if ('showSaveFilePicker' in window)
        {
            this.projectService.saveProjectFromSowftware();
        }
        else
        {
            this.projectService.saveProjectFromBrowser();
        }

        if( closeAfterSave == true )
        {
            this.close( false );
        }

        if( openAfterSave == true )
        {
            this.open( false, event );
        }
    }


    /**
     * Print
     */
    public print()
    {
        let now = new Date();
		let day = String(now.getDate()).padStart(2, '0');
		let month = String(now.getMonth() + 1).padStart(2, '0'); 
		let year = now.getFullYear();
		let hours = String(now.getHours()).padStart(2, '0');
		let minutes = String(now.getMinutes()).padStart(2, '0');
		let seconds = String(now.getSeconds()).padStart(2, '0');
		let formattedDateTime = `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;

        let htmlBody:string = "";
        htmlBody += "<h2>" + this.appService.project.label + "</h2>"
        htmlBody += "<div class='titleDate'>" + formattedDateTime + "</div>"
        htmlBody += "<h3>Fixtures</h3>"
        htmlBody += "<ul>"
        for( var i:number = 0; i < this.appService.project.fixtures.length; i++ )
        {
            htmlBody += "<li>";
            htmlBody += this.appService.project.fixtures[i].label;

            htmlBody += "<ul>";

            if( this.appService.project.fixtures[i].reference != ( null || undefined || "" || " " ))
            {
                htmlBody += "<li>ref : " + this.appService.project.fixtures[i].reference + "</li>";
            }

            htmlBody += "<li>ip : " + this.appService.project.fixtures[i].index + "</li>";

            htmlBody += "</ul>";

            htmlBody += "</li>";
        }
        htmlBody += "</ul>"

      

        let htmlStyle:string = "";
        htmlStyle += "body {";
        htmlStyle +=    "font-family: Arial, sans-serif;";
        htmlStyle +=    "margin: 20mm;";
        htmlStyle += "}";
        htmlStyle += "h2 {";
        htmlStyle += "}";
        htmlStyle += ".titleDate {";
        htmlStyle +=    "margin-bottom: 10px;";
        htmlStyle +=    "margin-top: -20px;";
        htmlStyle +=    "color: #999999;";
        htmlStyle +=    "font-size: 12px;";
        htmlStyle +=    "font-style: italic";
        htmlStyle += "}";

        let htmlDatas:any = (
            {
                body:htmlBody,
                style:htmlStyle
            }
        );

        this.server.exportPDF(JSON.stringify( htmlDatas ));
    }


  /***
   * Open a project
   */
  public open( askSaveBeforeOpen:boolean = true, event:any )
  {
    if( askSaveBeforeOpen == true && this.appService.is_project == true )
    {
      let message:string = "<p>Do you want to save your project before open another ?</p>";

      let dialogRef = this.dialog.open
      (
          PopupComponent, 
          {
              disableClose:true,
              width:  '555px',
              data: 
              { 
                  title_label:'Open Project', 
                  content:message,
                  yes_button_label:"Save",
                  no_button_label:"Open wihout saving",
                  cancel_button_label:"Cancel",
                  mode_question:true,
                  mode_prompt:false,
                  mode_prompt_type:"text",
                  prompt_value:"Project's name",
                  disable_cancel:false,
                  display_cancel:true,
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
                        this.save( false, true, event );
                      }
                      else
                      {
                        this.open( false, event );
                      }
                  }
                  else
                  {
                    this.open( false, event );
                  }
              }
          }
      );
    }
    else
    {
      this.projectService.openProject( event );
      this.gotoHome();
    }
  }

  /**
   * Close Project
   */
  public close( askSaveBeforeClose:boolean = true )
  {
        if( askSaveBeforeClose == true )
        {
        let message:string = "<p>Do you want to save your project before close it ?</p>";

            let dialogRef = this.dialog.open
            (
                PopupComponent, 
                {
                    disableClose:true,
                    width:  '555px',
                    data: 
                    { 
                        title_label:'Close Project', 
                        content:message,
                        yes_button_label:"Save",
                        no_button_label:"Close wihout saving",
                        cancel_button_label:"Cancel",
                        mode_question:true,
                        mode_prompt:false,
                        mode_prompt_type:"text",
                        prompt_value:"Project's name",
                        disable_cancel:false,
                        display_cancel:true,
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
                            this.save( true );
                            }
                            else
                            {
                            this.close( false );
                            }
                        }
                        else
                        {
                        this.close( false );
                        }
                    }
                }
            );
        }
        else
        {
            this.appService.project     = new Project();
            this.appService.is_project  = false;
            this.server.blackOut();
        }
    }
}
