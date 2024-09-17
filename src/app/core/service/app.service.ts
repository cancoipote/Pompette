import { Injectable } 	from '@angular/core';
import { Buffer } 		from 'buffer';
import { Project } 		from '../../modules/project/vo/project';
import { Subject } 		from 'rxjs';

/**
 * Application Service
 * 
 * Contains Main constants
 */
@Injectable()
export class AppService 
{
	/**
	 * Project Version
	 */
	version = '1.0.0';

    /**
     * DMX Buffer
     */
    dmx_buffer = Buffer.alloc(513);

    /**
	 * Route for the Dashboard
	 */
	DASHBOARD_PAGE 		= "/dashboard";

	/**
	 * Is application ready or not
	 */
	isApplicationReady = false;

	/**
	 * Project
	 */
	project!: Project;

	 /**
	 * Is Project setted
	 */
	is_project:boolean = false;
}
