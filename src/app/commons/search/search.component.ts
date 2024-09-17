import { CommonModule }                                             from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter }           from '@angular/core';
import { FormsModule, ReactiveFormsModule }                         from '@angular/forms';
import { MatButtonModule }                                          from '@angular/material/button';
import { MatCardModule }                                            from '@angular/material/card';
import { MatCommonModule }                                          from '@angular/material/core';
import { MatDatepickerModule }                                      from '@angular/material/datepicker';
import { MatDividerModule }                                         from '@angular/material/divider';
import { MatGridListModule }                                        from '@angular/material/grid-list';
import { MatIconModule }                                            from '@angular/material/icon';
import { MatInputModule }                                           from '@angular/material/input';
import { MatSelectModule }                                          from '@angular/material/select';

/**
 * Search Box manager - Component
 * 
 * Used for filters
 */
@Component({
   	  	selector: 'search-box',
        templateUrl: './search.component.html',
        styleUrls: [ './search.component.css' ],
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
            MatIconModule
            ],
})
export class SearchBoxComponent implements OnInit
{   
    
    /**
     * Constructor
     * 
     */
    constructor
    (
    ) {}


    /**
     * Search Text
     */
    public search_text:string = "";

    /**
     * Event dispatched when code bar is filled
     */
    @Output() onChange = new EventEmitter();

    /**
     * Event dispatched when filter change
     */
    @Output() onFilterChange = new EventEmitter();

    /**
     * Disable filters or not
     */
    @Input() disableFilters:boolean = false;

    /**
     * Display filters or not
     */
    @Input() displayFilters!:boolean;
    

    /*******************************/
    //
    // Initialisation
    // 
    /*******************************/

    /**
     * Initialisation
     * 
     */
    ngOnInit(): void 
    {
    }

    /*****************************************************************/
    //
    // Event
    //
    /*****************************************************************/

    /**
     * Catch filter event
     * 
     */
    public on_filter( )
    {
        this.displayFilters = ! this.displayFilters;
        this.onFilterChange.emit( this.displayFilters );
    }

    /**
     * Catch clear event
     * 
     */
    public on_clear( )
    {
        this.search_text = "";
        this.onChange.emit( this.search_text );
    }

    /**
     * Catch keyboard event
     * 
     */
    public on_keyup( evt:KeyboardEvent )
    {
        if( evt.keyCode == 13 )
        {
            this.onChange.emit( this.search_text );
        }
    }
}