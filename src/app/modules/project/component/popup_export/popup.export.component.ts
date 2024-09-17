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
import { MatCheckboxModule }                                                            from '@angular/material/checkbox';


import { CommonsService }                                                               from '../../../../core/service/commons.service';
import { PopupComponent }                                                               from '../../../../commons/popup/popup.component';
import { ServerService }                                                                from '../../../../core/service/server.service';
import { AppService }                                                                   from '../../../../core/service/app.service';
import { ProjectService }                                                               from '../../service/project.service';
import { Sequence } from '../../../sequence/vo/sequence';
import { Fixture } from '../../../fixture/vo/fixture';


/**

/**
 * Project Export
 * 
 */
@Component(
{
    selector: 'popup-export',
    templateUrl: './popup.export.component.html',
    styleUrls: [ './popup.export.component.css'],
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
        MatIconModule,
        MatCheckboxModule
        ],
})
export class PopupExport
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
		public dialogRef: MatDialogRef<PopupExport>,
        private commonsService:CommonsService,
        private serverService:ServerService,
        private dialog: MatDialog,
        public appService: AppService,
        private projectService: ProjectService,


        /**
        * Datas passed to the popup
        */
		@Inject(MAT_DIALOG_DATA) public data: any
	) 
    {

    }

    /**
    * Popup Height
    */
    public popup_height:number = 500;

    /**
     * Sequences list
     */
    public sequences:Sequence[] = new Array();

    
    /**
     * Effects list
     */
    public effects:Sequence[] = new Array();


    /**
     * Fixtures list
     */
    public fixtures:Fixture[] = new Array();

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
        this.popup_height = this.commonsService.getHeight( 500 );

        for( let i:number = 0; i < this.appService.project.sequences.length; i++ )
        {
            this.appService.project.sequences[i].isSelectedForExport = false;

            if( this.appService.project.sequences[i].isFX == true )
            {
                this.effects.push( this.appService.project.sequences[i] );
            }
            else
            {
                this.sequences.push( this.appService.project.sequences[i] );
            }
        }

        for( let i:number = 0; i < this.appService.project.fixtures.length; i++ )
        {
            this.appService.project.fixtures[i].isSelectedForExport = false;
            this.fixtures.push( this.appService.project.fixtures[i] );
        }
    }


    /*****************************************************************/
    //
    // Actions
    //
    /*****************************************************************/

    /**
     * Select or unselect all sequences
     */
    public selectUnselectedAllSequences()
    {
        if( this.sequences.length > 0 )
        {
            let newValue:boolean = true;
            if( this.sequences[0].isSelectedForExport == true )
            {
                newValue = false;
            }

            for( let i:number = 0; i < this.sequences.length; i++ )
            {
                this.sequences[i].isSelectedForExport = newValue;
            }
        }
    }

    /**
     * Select or unselect all effects
     */
    public selectUnselectedAllEffects()
    {
        if( this.effects.length > 0 )
        {
            let newValue:boolean = true;
            if( this.effects[0].isSelectedForExport == true )
            {
                newValue = false;
            }

            for( let i:number = 0; i < this.effects.length; i++ )
            {
                this.effects[i].isSelectedForExport = newValue;
            }
        }
    }


     /**
     * Select or unselect all fixtures
     */
    public selectUnselectedAllFixtures()
    {
        if( this.fixtures.length > 0 )
        {
            let newValue:boolean = true;
            if( this.fixtures[0].isSelectedForExport == true )
            {
                newValue = false;
            }

            for( let i:number = 0; i < this.fixtures.length; i++ )
            {
                this.fixtures[i].isSelectedForExport = newValue;
            }
        }
    }

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
     * Export
     */
    public onExport()
    {
        let selectedSequences:any[] = this.getSelectItems( this.sequences );
        let selectedEffects:any[] = this.getSelectItems( this.effects );
        let selectedFixtures:any[] = this.getSelectItems( this.fixtures );

       
        
        if( selectedSequences.length == 0 && selectedEffects.length == 0 && selectedFixtures.length == 0 )
        {
            let message_error:string = "Please select at least one sequence and/or effect and/or fixture to export.";
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
                        cancel_button_label:"Close",
                        prompt_value:"Sequence's name",
                        disable_cancel:false,
                        display_cancel:false,
                        prompt:'' 
                    }
                }
            );

            return;
        }

        if( selectedSequences.length > 0 )
        {
            this.exportSequences( selectedSequences );
        }

        if( selectedEffects.length > 0 )
        {
            this.exportSequences( selectedEffects );
        }

        if( selectedFixtures.length > 0 )
        {
            this.exportFixtures( selectedFixtures );
        }
    }


    /**
     * Export Sequences
     * @param sequences 
     */
    private exportSequences( sequences:Sequence[] )
    {
        let devices_channel:any = [];
        for( let i:number = 0; i < this.appService.project.fixtures.length; i++ )
        {
            let item:any = (
                {
                    label:this.appService.project.fixtures[i].reference,
                    channel:this.appService.project.fixtures[i].index
                }
            );
            devices_channel.push(item);
        }


        let atmospheres:any = [];
        for( let i:number = 0; i < sequences.length; i++ )
        {
            let devices:any = [];
            for( let j:number = 0; j < sequences[i].sequenceFixtures.length; j++ )
            {
                let transitions:any = [];
                for( let k:number = 0; k < sequences[i].sequenceFixtures[j].transitions.length; k++ )
                {
                    let startChannels:any = [];
                    for( let a:number = 0; a < this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].startFixture.channels.length; a++ )
                    {
                        let item:any = (
                            {
                                channel:sequences[i].sequenceFixtures[j].transitions[k].startFixture.channels[a].index,
                                value:sequences[i].sequenceFixtures[j].transitions[k].startFixture.channels[a].value
                            }
                        );
                        startChannels.push(item);
                    }

                    let endChannels:any = [];
                    for( let a:number = 0; a < sequences[i].sequenceFixtures[j].transitions[k].endFixture.channels.length; a++ )
                    {
                        let item:any = (
                            {
                                channel:sequences[i].sequenceFixtures[j].transitions[k].endFixture.channels[a].index,
                                value:sequences[i].sequenceFixtures[j].transitions[k].endFixture.channels[a].value
                            }
                        );
                        endChannels.push(item);
                    }

                    let subType:any = null;
                    if( sequences[i].sequenceFixtures[j].transitions[k].subType )
                    {
                        subType = sequences[i].sequenceFixtures[j].transitions[k].subType.label;
                    }
                    let item:any = (
                        {
                            type:sequences[i].sequenceFixtures[j].transitions[k].type.label,
                            subType:subType,
                            fixedDuration:sequences[i].sequenceFixtures[j].transitions[k].fixedDuration,
                            duration:parseInt(sequences[i].sequenceFixtures[j].transitions[k].duration.toString()),
                            durationMin:parseInt(sequences[i].sequenceFixtures[j].transitions[k].durationMin.toString()),
                            durationMax:parseInt(sequences[i].sequenceFixtures[j].transitions[k].durationMax.toString()),
                            startChannels:startChannels,
                            endChannels:endChannels
                        }
                    );

                    transitions.push(item);
                }

                let item:any = (
                    {
                        label:sequences[i].sequenceFixtures[j].fixture.reference,
                        model:sequences[i].sequenceFixtures[j].fixture.label,
                        sequence:
                        {
                            loop:sequences[i].sequenceFixtures[j].loop,
                            loop_from_start:sequences[i].sequenceFixtures[j].loopFromStart,
                            can_be_bypass:sequences[i].sequenceFixtures[j].canBeBypass,
                            transitions:transitions
                        }
                    }
                );
                devices.push(item);
            }

            let item:any = (
                {
                    label:sequences[i].label,
                    devices:devices
                }
            );
            atmospheres.push(item);
        }

        let extport_data:any = (
            {
                frequency:50,
                devices_channel:devices_channel,
                atmospheres:atmospheres
            }
        );
        
        let export_filename_description:string = "_export_sequences";
        if( sequences[0].isFX == true )
        {
            export_filename_description = "_export_effects";
        }

        if ('showSaveFilePicker' in window)
        {
            this.projectService.exportProjectFromSowftware( JSON.stringify(extport_data, null, 2), export_filename_description );
        }
        else
        {
            this.projectService.exportProjectFromBrowser( JSON.stringify(extport_data, null, 2), export_filename_description );
        }
    }


    /**
     * Export Fixtures
     * @param fixtures 
     */
    private exportFixtures( fixtures:Fixture[] )
    {

        let devices:any[] = new Array();

        for( let i:number = 0; i < fixtures.length; i++ )
        {
            let channels:any[] = new Array();

            for( let j:number = 0; j < fixtures[i].channels.length; j++ )
            {
                let label = fixtures[i].channels[j].type.label;
                if( fixtures[i].channels[j].type_description && fixtures[i].channels[j].type_description != null && fixtures[i].channels[j].type_description != undefined && fixtures[i].channels[j].type_description != "" )
                {
                    label += " - " + fixtures[i].channels[j].type_description;
                }

                let capabilities:any[] = new Array();
                for( let k:number = 0; k < fixtures[i].channels[j].capabilities.length; k++ )
                {
                    let capability:any = (
                        {
                            label:fixtures[i].channels[j].capabilities[k].label,
                            min:fixtures[i].channels[j].capabilities[k].min,
                            max:fixtures[i].channels[j].capabilities[k].max
                        }
                    );
                    capabilities.push( capability );
                }

                let channel:any = (
                    {
                        label:label,
                        channel:parseInt( fixtures[i].channels[j].index.toString() ),
                        capabilities:capabilities
                    }
                );

                channels.push( channel );
            }


          

            let fixture:any = (
                {
                    label:fixtures[i].label,
                    channels:channels
                }
            );
            devices.push(fixture);
        }

        let extport_data:any = (
            {
                fixtures:devices
            }
        );


        let export_filename_description:string = "_export_fixtures";
       
        if ('showSaveFilePicker' in window)
        {
            this.projectService.exportProjectFromSowftware( JSON.stringify(extport_data, null, 2), export_filename_description );
        }
        else
        {
            this.projectService.exportProjectFromBrowser( JSON.stringify(extport_data, null, 2), export_filename_description );
        }
    }


    /**
     * Get Selected items from array
     * @param datas
     * @returns 
     */
    private getSelectItems( datas:any[] ):any[]
    {
        let result:any[] = new Array();;

        for( let i:number = 0; i < datas.length; i++ )
        {
            if( datas[i].isSelectedForExport == true )
            {
                result.push(datas[i]);
            }
        }

        return result;
    }
   
}

