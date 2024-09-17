import { Injectable } 				                from '@angular/core';
import { MatDialog } 								from '@angular/material/dialog';
import { Subject }                                  from 'rxjs';

import { AppService }                               from '../../../core/service/app.service';
import { FixtureChannelType }                       from '../vo/fixture.channel.type';
import { FixtureType }                              from '../vo/fixture.type';
import * as jsonData                                from '../../../../../server/assets/fixtureConfiguration.json';
import { Manufacturer }                             from '../vo/manugacturer';
import { Fixture }                                  from '../vo/fixture';
import { SequenceFixtureTransitionType }            from '../../sequence/vo/sequence.fixture.transition.type';



/**
 * Common Service
 * 
 * Web-Service used by Common Component
 */
@Injectable()
export class FixtureService 
{
	/**
	 * Constructor
	 * 
	 */
	constructor (
		public appService: AppService,
		private dialog: MatDialog,
		) {}
    

    /**
     * Is Configuration Loading
     */
    public isLoading:boolean = true;

    /**
     * List of fixture types
     */
    public fixtureTypes:FixtureType[] = new Array();

    /**
     * List of fixture channel types
     */
    public fixtureChannelTypes:FixtureChannelType[] = new Array();

    /**
     * List of transition type
     */
    public transitionTypes:SequenceFixtureTransitionType[] = new Array();

    /**
     * List of manufcaturers
     */
    public manufacturers:Manufacturer[] = new Array();

    /**
     * Update manufacturers
     */
    private manufacturersUpdated = new Subject<Manufacturer[]>();


    /**
     * Load Configurations
     */
    public loadConfiguration()
    {
        for( let i:number = 0; i <jsonData.fixtureType.length; i++ )
        {
            this.fixtureTypes.push( JSON.parse( JSON.stringify(jsonData.fixtureType[i]) ) );
        }

        for( let i:number = 0; i <jsonData.channelType.length; i++ )
        {
            this.fixtureChannelTypes.push( JSON.parse( JSON.stringify(jsonData.channelType[i]) ) );
        }

        for( let i:number = 0; i <jsonData.transiotnType.length; i++ )
        {
            this.transitionTypes.push( JSON.parse( JSON.stringify(jsonData.transiotnType[i]) ) );
        }
    }



    


    /**
     * Load Fixtures
     */
    public loadFixtures( datas:any )
    {
        this.manufacturers = new Array();
        let json = JSON.parse(datas);
        for( let i:number = 0; i < json.length; i++ )
        {
            let manufacturer:Manufacturer   = new Manufacturer();
            manufacturer.label              = json[i].label;
            manufacturer.fixtures           = new Array();

            for( let j:number = 0; j < json[i].fixtures.length; j++ )
            {
                let fixture:Fixture = json[i].fixtures[j].content;

                for( let a:number = 0; a < this.fixtureTypes.length; a++ )
                {
                    if( this.fixtureTypes[a].id == json[i].fixtures[j].content.type )
                    {
                        fixture.type = this.fixtureTypes[a];
                        break;
                    }
                }

                for( let k:number = 0; k < json[i].fixtures[j].content.channels.length; k++ )
                {
                    for( let a:number = 0; a < this.fixtureChannelTypes.length; a++ )
                    {
                        if( this.fixtureChannelTypes[a].id == json[i].fixtures[j].content.channels[k].type )
                        {
                            fixture.channels[k].type = this.fixtureChannelTypes[a];
                            break;
                        }
                    }
                }
                manufacturer.fixtures.push(fixture);
            }

            this.manufacturers.push( manufacturer );
        }

       

        // Init datas
        for( let i:number = 0; i < this.manufacturers.length; i++ )
        {
            for( let j:number = 0; j < this.manufacturers[i].fixtures.length; j++ )
            {
                this.manufacturers[i].fixtures[j].index = 0;
                for( let k:number = 0; k < this.manufacturers[i].fixtures[j].channels.length; k++ )
                {
                    this.manufacturers[i].fixtures[j].channels[k].value = 0;

                    if( this.manufacturers[i].fixtures[j].channels[k].capabilities )
                    {
                        if( this.manufacturers[i].fixtures[j].channels[k].capabilities.length > 0 )
                        {
                            this.manufacturers[i].fixtures[j].channels[k].capability =  this.manufacturers[i].fixtures[j].channels[k].capabilities[0];
                        }
                    }
                }
            }
        }

        this.manufacturersUpdated.next(this.manufacturers);
        this.isLoading = true;
    }


    /**
     * Get subject manufacturers
     * @returns 
     */
    public getDataUpdateListener() 
    {
        return this.manufacturersUpdated.asObservable();
    }
}
