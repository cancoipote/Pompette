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
import { DragDropModule }                                                               from '@angular/cdk/drag-drop';

import { AppService }                                                                   from '../../../core/service/app.service';
import { CommonsService }                                                               from '../../../core/service/commons.service';




/**

/**
 * Kylii Popup 
 * 
 * This popup is used to display html
 */
@Component(
{
    selector: 'popup-monitoring-component',
    templateUrl: './popup.monitoring.component.html',
    styleUrls: [ './popup.monitoring.component.css'],
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
        DragDropModule
        ],
})
export class PopupMonitoring 
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
		public dialogRef: MatDialogRef<PopupMonitoring>,
        public appService:AppService,
        private commonsService:CommonsService,
        private dialog: MatDialog,

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
    // Actions
    //
    /*****************************************************************/

    /**
     * Get Background color
     * @param value 
     * @returns 
     */
    public getBackgoundColor( value:number ):string 
    {
        // Convertir la valeur dmx (0-255) en une couleur. Ici, nous utilisons une échelle de gris.
        const colorValue = Math.round(value);
        let red:number = 108;
        let green:number = 206;
        let blue:number = 238;
        let alpha:number = colorValue / 255;

        return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";

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
        this.dialogRef.close();
    }
}

