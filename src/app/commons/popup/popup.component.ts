import { Component }                                                                    from '@angular/core';
import { Inject}                                                                        from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }                                                from '@angular/material/dialog';
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

/**

/**
 * Kylii Popup 
 * 
 * This popup is used to display html
 */
@Component(
{
    selector: 'popup-component',
    templateUrl: './popup.component.html',
    styleUrls: [ './popup.component.css'],
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
        MatSelectModule
        ],
})
export class PopupComponent 
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
		public dialogRef: MatDialogRef<PopupComponent>,
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
     * Title
     */
    public title_label!: string;

    /**
     * Content
     */
    public content!: string;

    /**
     * Close button
     */
     public close_button_label:string = "Close";

    /**
     * Display Close button
     */
    public display_close:boolean = true;

    /**
     * Yes button
     */
    public yes_button_label:string = "Agree";

    /**
     * No button
     */
    public no_button_label:string = "Disagree";

    /**
     * Cancel button
     */
    public cancel_button_label:string = "Cancel";

    /**
     * Sate date button
     */
    public set_date_button_label:string = "Set date";

    /**
     * Mode question
     */
    public mode_question:boolean = false;

    /**
     *  Prompt
     */
     public prompt:any = "";
    
      /**
     *  Prompt value
     */
    public prompt_value:string = "value";

    /**
     * Mode prompt
     */
     public mode_prompt:boolean = false;

    /**
     * Mode prompt text area
     */
    public mode_prompt_type:string = "select"; // text | textarea | select

    /**
     * Disable Cancel
     */
    public disable_cancel:boolean = false;

    /**
     * Display Cancel
     */
     public display_cancel:boolean = true;

    /**
     * Mode date
     */
    public mode_date:boolean = false;

    /**
     * Date
     */
    public date!: Date;


    /**
     * items
     */
    public items:any[] = new Array();

    /**
     * item
     */
    public item:any = {};



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
        this.title_label        = this.data.title_label;
        this.content            = this.data.content;
        
        if( this.data.prompt_value )
        {
            this.prompt_value = this.data.prompt_value;
        }

        if( this.data.mode_question )
        {
            this.mode_question = this.data.mode_question;
        }

        if( this.data.prompt )
        {
            this.prompt = this.data.prompt;
        }


        if( this.data.mode_prompt_type )
        {
            this.mode_prompt_type = this.data.mode_prompt_type;
        }

        if( this.data.items )
        {
            this.items = this.data.items;
        }

        if( this.data.mode_prompt )
        {
            this.mode_prompt = this.data.mode_prompt;
        }

        if( this.data.display_cancel )
        {
            this.display_cancel = this.data.display_cancel;
        }

        if( this.data.disable_cancel != null )
        {
            this.disable_cancel = this.data.disable_cancel;
        }

        if( this.data.close_button_label )
        {
            this.close_button_label = this.data.close_button_label;
        }

        this.display_close = this.data.display_close;

        if( this.data.yes_button_label )
        {
            this.yes_button_label = this.data.yes_button_label;
        }

        if( this.data.no_button_label )
        {
            this.no_button_label = this.data.no_button_label;
        }

        if( this.data.cancel_button_label )
        {
            this.cancel_button_label = this.data.cancel_button_label;
        }

        if( this.data.mode_date )
        {
            this.mode_date = this.data.mode_date;
        }

        this.date = new Date();
        if( this.data.date )
        {
            this.date = this.data.date;
        }

        if( this.data.set_date_button_label )
        {
            this.set_date_button_label = this.data.set_date_button_label;
        }

        this.popup_height = this.getHeight();
    }


    /*****************************************************************/
    //
    // Get Height
    //
    /*****************************************************************/

    /**
     * Get the height of the browser to dynamically set width of Popup 
     * 
	 * @param {number} Substact height
	 * @param {number} Min height
     * @return {number} Browser Width
     */
    public getHeight( substract_height:number = 300, min_height:number = 400 ):number 
    {
		let height:number = window.innerHeight - substract_height;
		
		if( height < min_height )
		{	
			height = min_height;
		}	
		
        return height;
    }

    /*****************************************************************/
    //
    // Popup
    //
    /*****************************************************************/

    /**
    * Called when the user click outside the popup
    */
    onNoClick(): void 
    {
        this.dialogRef.close();
    }




    /**
    * Close the popup
    */
    public on_close():void
    {
        if( this.mode_prompt == true )
        {
            this.dialogRef.close({value:this.prompt});
        }
        else
        {
            this.dialogRef.close();
        }
    }


    /**
    * Cancel the popup
    */
    public on_cancel():void
    {
        this.dialogRef.close();
    }


    /**
    * Close the popup Yes
    */
    public on_yes():void
    {
        if( this.mode_prompt == true )
        {
            this.dialogRef.close({value:this.prompt});
        }
        else
        {
            this.dialogRef.close( {answer:true} );
        }

    }

    /**
    * Close the popup No
    */
    public on_no():void
    {
        this.dialogRef.close( {answer:false} );
    }

    /**
    * Close the popup date
    */
    public on_save_date():void
    {
        this.dialogRef.close( {date:this.date} );
    }
}

