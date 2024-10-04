
import { Injectable } 								from '@angular/core';
import { MatDialog } 								from '@angular/material/dialog';
import { FixtureService }                           from '../../modules/fixture/service/fixture.service';
import { AppService }       						from './app.service';
import { Fixture }                                  from '../../modules/fixture/vo/fixture';
import { Subject }                                  from 'rxjs';



/**
 * Server Service
 * 
 * Web-Service used by Common Component
 */
@Injectable()
export class ServerService 
{
	/**
	 * Constructor
	 * 
	 */
	constructor (
		public appService: AppService,
        public fixturesService:FixtureService,
		private dialog: MatDialog,
		) {}
    
    
    /**
     * Socket
     */
    private socket!: WebSocket;

    /**
     * Is Connected
     */
    private isConnected = false;

    /**
     * Update blackout
     */
	private onBlackout = new Subject<boolean>();

    
    /**
     * Socket Initialisation
     * @param port 
     */
    public initalisation( port: number = 8018)
    {
        this.socket = new WebSocket('ws://localhost:' + port);
        this.socket.onmessage = (event) => 
        {
            let responseTab = event.data.split( '#');
            if( responseTab.length == 2)
            {
                switch( responseTab[0])
                {
                    case 'port':
                        let port_list = JSON.parse( responseTab[1] );
                        break;
                    
                    case 'fixtures':
                        this.blackOut();
                        this.appService.isApplicationReady = true;
                        this.fixturesService.loadFixtures( responseTab[1] );
                        break;
                    
                    case 'pdf':
                        this.savePDF( responseTab[1] );
                        break;
                }
            }

          //  console.log(`Message from server: ${event.data}`);
        };

        this.socket.onopen = () => {
            this.isConnected = true;
            this.socket.send('fixtures#1');
        };

        this.socket.onclose = () => {
            this.isConnected = false;
        };
    }

    /**
     * Send message to Server
     * @param message 
     */
    public send( message: string)
    {
        if( this.isConnected == true)
        {
            this.socket.send( message);
        }
    }


    /**
     * Black Out
     */
     public blackOut( displatchEvent:boolean = true)
     {
        for( let i:number = 0; i < this.appService.dmx_buffer.length; i++ )
        {
            this.appService.dmx_buffer[i] = 0;
        }

        this.sendDMX();

        if( displatchEvent == true)
        {
            this.onBlackout.next( true);
        }
     }

     /**
     * Get subject blackout
     * @returns 
     */
    public getBlackoutListener() 
    {
        return this.onBlackout.asObservable();
    }

    /**
     * Send DMX buffer
     */
    public sendDMX()
    {
        let message = "dmx#" + this.appService.dmx_buffer.join(",");
        this.send( message);
    }

   /**
    * Save Ficture
    * @param fixture 
    */
    public saveFixture( fixture:Fixture)
    {
        let message = "fixtureSave#" + JSON.stringify(fixture);
        this.send( message);
    }


    /**
    * Delete Ficture
    * @param fixture 
    */
    public deleteFixture( fixture:Fixture)
    {
        let message = "fixtureDelete#" + JSON.stringify(fixture);
        this.send( message);
    }


    /**
     * Save Fictures
     */
    public getFixtures()
    {
        let message = "fixtures#1";
        this.send( message);
    }

    /**
     * Export PDF
     * @param datas 
     */
    public exportPDF( datas:string )
    {
        datas = datas.split('#').join("_@_");
        let message = "pdf#" + datas;
        this.send( message);
    }

    /**
     * Save PDF
     * @param datas 
     */
    public async savePDF( datas:any )
    {
        const numberArray = datas.split(',').map(Number);
        const bytes = new Uint8Array(numberArray);
        const blob = new Blob([bytes], { type: 'application/pdf' });

        if ('showSaveFilePicker' in window)
        {
            const fileHandle = await (window as any).showSaveFilePicker
			(
				{
					suggestedName: this.appService.project.label,
					types: 
					[
						{
							description: 'PDF Files',
							accept: { 'application/pdf': ['.pdf'] },
						},
					],
				}
			);

			const writable = await fileHandle.createWritable();
			await writable.write(blob);
			await writable.close();
        }
        else
        {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = this.appService.project.label + '.pdf';
            link.click();
        }
    }
}
