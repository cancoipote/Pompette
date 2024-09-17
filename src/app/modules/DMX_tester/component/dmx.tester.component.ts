import { Component, OnInit }                                                            from '@angular/core';
import { AppService }                                                                   from '../../../core/service/app.service';
import { ServerService }                                                                from '../../../core/service/server.service';
import {MatSliderModule}                                                                from '@angular/material/slider';
import { MatButtonModule }                                                              from '@angular/material/button';
import { MatCardModule }                                                                from '@angular/material/card';
import { MatFormFieldModule }                                                           from '@angular/material/form-field';
import { ThemePalette }                                                                 from '@angular/material/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators }                    from '@angular/forms';
import { MatInputModule }                                                               from '@angular/material/input';
import { CommonModule }                                                                 from '@angular/common';  
import { MatDialog }                                                                    from '@angular/material/dialog';
import { MatSelectModule }                                                              from '@angular/material/select';
import { NgxColorsModule }                                                              from 'ngx-colors';

import { PopupComponent }                                                               from '../../../commons/popup/popup.component';
import { Project } from '../../project/vo/project';
import { CommonsService } from '../../../core/service/commons.service';
/**
 * Dashboard Component
 * 
 * Dashboard of the site
 */
@Component({
    selector: 'DMXTester',
    templateUrl: './dmx.tester.component.html',
    styleUrls: [ './dmx.tester.component.css' ],
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
        MatSelectModule,
        NgxColorsModule
        ],
})
export class DMXTesterComponent implements OnInit {

    /**
    * Constructor
    * 
    */
    constructor
    (
        public appService: AppService,
		public server: ServerService,
        private dialog: MatDialog
    ) 
    { }

    
    public dmx_buffer_tmp:any[] = new Array();
    public dmx_buffer_tmp_max:number = 20;
    public dmx_buffer_tmp_pages:number[] = new Array();
    public dmx_buffer_tmp_page:number = 0;

    /**
    * Initialisation
    * 
    */
    ngOnInit(): void 
    {
        let count_index:number = Math.ceil(this.appService.dmx_buffer.length / this.dmx_buffer_tmp_max);
        for( let i = 0; i < count_index; i++ )
        {
            this.dmx_buffer_tmp_pages.push(i);
        }
        this.dmx_buffer_tmp_page = this.dmx_buffer_tmp_pages[0];

        this.createTmpBuffer();
    }    


    /**
    * Actions
    * 
    */

    /**
     * Blackout
     */
    public blackout()
    {
        for( let i = 0; i < this.dmx_buffer_tmp.length;i++ )
        {
            this.dmx_buffer_tmp[i].value        = 0;
            this.dmx_buffer_tmp[i].value_str    = "000";
        }

        this.server.blackOut();
    }

    /**
     * Call when user change user index page
     */
    public onChangeIndexPage()
    {
        this.createTmpBuffer();
    }

    /**
     * Create Tmp Buffer
     */
    public createTmpBuffer()
    {
        this.dmx_buffer_tmp = new Array();
        for( let i = 0; i < this.dmx_buffer_tmp_max; i++ )
        {
            let can_add:boolean = true;
            let index = i + ( this.dmx_buffer_tmp_page * this.dmx_buffer_tmp_max )
            
            if( index >= this.appService.dmx_buffer.length )
            {
                can_add = false;
            }

            if( can_add == true )
            {
                this.dmx_buffer_tmp.push( 
                    {
                        id:index,
                        value:this.appService.dmx_buffer[index],
                        value_str:this.convertNumberTo3(this.appService.dmx_buffer[index])
                    } 
                );
            }
        }
    }

    /**
     * Call when a slider is updated
     * @param index 
     * @param event 
     */
    public onInputChannelChange(index:number, event: Event)
    {
        let value:number                        = parseInt((event.target as HTMLInputElement).value.toString());
        this.dmx_buffer_tmp[index].value        = value;
        this.dmx_buffer_tmp[index].value_str    = this.convertNumberTo3(value);
        
        this.appService.dmx_buffer[index]       = value;
        this.server.sendDMX();
    }

    public convertNumberTo3( value:number ):string
    {
        let result = "0";

        if( value < 10 )
        {
            result = "00" + value;
        }
        else
        {
            if( value < 100 )
            {
                result = "0" + value;
            }
            else
            {
                result = "" + value;
            }
        }

        return result;
    }
}