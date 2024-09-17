import { Injectable, NgZone  } 						from '@angular/core';
import anime 										from 'animejs/lib/anime.es.js';

import { AppService } 								from '../service/app.service';
import { ServerService } 							from '../service/server.service';
import { SequenceFixtureTransition } 				from '../../modules/sequence/vo/sequence.fixture.transition';
import { SequenceFixture } 							from '../../modules/sequence/vo/sequence.fixture';
import { Sequence } 								from '../../modules/sequence/vo/sequence';
import { Fixture } from '../../modules/fixture/vo/fixture';





/**
 * Engine Fixture
 * 
 */
export class EngineFixture 
{
	/**
	 * Constructor
	 * 
	 */
	constructor (
		private appService: AppService,
		private server: ServerService,
		private ngZone: NgZone
		) {}
    

    /**
     * Is Playing
     */
    public isPlaying:boolean = false;
	
	/**
	 * Fixture
	 */
	public fixture:Fixture = new Fixture();

    /**
     * Sequence Ficture
     */
    public sequenceFixture:SequenceFixture = new SequenceFixture();

    /**
     * Transition index
     */
    public index:number = 0;

    /**
     * Transition direction
     */
    public direction:number = 1;
    
    /**
     * Sequcence
     */
    public sequence:Sequence = new Sequence();


	/***************************************************** 
	 * 
	 * Public Methods
	 * 
	 */

    
    /**
     * Create from Sequence
     * @param sequence
     * 
     */
    public createFromSequence(sequence:Sequence)
    {
     
    }
    
    
    
    /**
     * Create from SequenceFixture
     * @param sequenceFixture 
     */
    public createFromSequenceFixture(sequenceFixture:SequenceFixture)
    {
        this.sequenceFixture    = sequenceFixture;
        this.fixture            = sequenceFixture.fixture;
    }


    /**
     * Create from Transition
     * @param transition 
     */
    public createFromTransition(transition:SequenceFixtureTransition)
    {
        this.sequenceFixture                = new SequenceFixture();
        this.sequenceFixture.fixture        = transition.startFixture;
        this.sequenceFixture.transitions.push(transition);
        this.sequenceFixture.loop           = false;
        this.sequenceFixture.loopFromStart  = false;  
    }

	/**
	 * Start Engine
	 */
	public start() 
	{
		this.isPlaying  = true;
        this.index      = 0;
        this.playSequenceTransition();
	}


    /**
	 * Start Engine
	 */
	public stop() 
	{
        this.isPlaying  = false;
        this.index      = 0;
        anime.remove(this.fixture.channels);
	}




    /***************************************************** 
	 * 
	 * Transition
	 * 
	 */


    /**
     * Play Sequence Transition
     */
    private playSequenceTransition( )
    {
        if( this.isPlaying == false )
        {
            return;
        }

        for( let i:number = 0; i < this.sequenceFixture.transitions.length; i++ )
        {
            this.sequenceFixture.transitions[i].isPlayging = false;
        }
        this.sequenceFixture.transitions[this.index].isPlayging = true;
        this.sequenceFixture.transitions[this.index].percentAnimation = 0;

        let duration:number = 0;
        if( this.sequenceFixture.transitions[this.index].fixedDuration == true )
        {
            duration = this.sequenceFixture.transitions[this.index].duration;
        }
        else
        {
            let min:number = parseInt(this.sequenceFixture.transitions[this.index].durationMin.toString());
            let max:number = parseInt(this.sequenceFixture.transitions[this.index].durationMax.toString());

            duration = Math.floor(Math.random() * (max - min )) + min;
        }

        switch( this.sequenceFixture.transitions[this.index].type.id)
        {
            case 1:
                this.delay(duration);
                break;
            
            case 2:
                this.linear(duration);
                break;

            case 3:
                if( this.sequenceFixture.transitions[this.index].subType )
                {
                    this.easing(duration, this.sequenceFixture.transitions[this.index].subType.label);
                }
                break;

            case 4:
                this.fix(duration);
                break;
        }  
    }


    /**
     * Play Transition delay
     */
    private delay( duration:number ) 
    {
        let start:number[] = [0];
        let end:number[] = [0];
        anime({
			targets: start,
			value: (el:any, i:number) =>end,
			duration: duration,
			easing: 'linear',
			update: (anim) => {
                this.sequenceFixture.transitions[this.index].percentAnimation = anim.progress;
				//this.server.sendDMX();
			},
			complete: (anim) =>
            {
                this.nextTransition();
			}
		  });
    }

    private linear( duration:number ) 
    {
        this.fixture = JSON.parse(JSON.stringify( this.sequenceFixture.transitions[this.index].startFixture ));

        anime({
			targets: this.fixture.channels,
			value: (el:any, i:number) => this.sequenceFixture.transitions[this.index].endFixture.channels[i].value,
			duration: duration,
			easing: 'linear',
			update: (anim) => {
				for(  let i:number = 0; i < this.fixture.channels.length; i++)
				{
					this.appService.dmx_buffer[this.fixture.index + this.fixture.channels[i].index] = this.fixture.channels[i].value;
				}
                this.sequenceFixture.transitions[this.index].percentAnimation = anim.progress;
				//this.server.sendDMX();
			},
			complete: (anim) =>
            {
                this.nextTransition();
			}
		  });
    }

    private easing( duration:number, easing:string ) 
    {
        this.fixture = JSON.parse(JSON.stringify( this.sequenceFixture.transitions[this.index].startFixture ));

        anime({
			targets: this.fixture.channels,
			value: (el:any, i:number) => this.sequenceFixture.transitions[this.index].endFixture.channels[i].value,
			duration: duration,
			easing: easing,
			update: (anim) => {
				for(  let i:number = 0; i < this.fixture.channels.length; i++)
				{
					this.appService.dmx_buffer[this.fixture.index + this.fixture.channels[i].index] = this.fixture.channels[i].value;
				}
                this.sequenceFixture.transitions[this.index].percentAnimation = anim.progress;
				//this.server.sendDMX();
			},
			complete: (anim) =>
            {
                this.nextTransition();
			}
		  });
    }


    /**
     * Play Transition fix
     */
    private fix( duration:number ) 
    {

        this.fixture = JSON.parse(JSON.stringify( this.sequenceFixture.transitions[this.index].fixFixture ));
        for(  let i:number = 0; i < this.fixture.channels.length; i++)
        {
            this.appService.dmx_buffer[this.fixture.index + this.fixture.channels[i].index] = this.fixture.channels[i].value;
        }
        
        if( duration == null || duration <= 0 )
        {
            this.sequenceFixture.transitions[this.index].percentAnimation = 100;
            this.nextTransition();
        }
        else
        {
            let start:number[] = [0];
            let end:number[] = [0];
            anime({
                targets: start,
                value: (el:any, i:number) =>end,
                duration: duration,
                easing: 'linear',
                update: (anim) => {
                    this.sequenceFixture.transitions[this.index].percentAnimation = anim.progress;
                    //this.server.sendDMX();
                },
                complete: (anim) =>
                {
                    this.nextTransition();
                }
            });
        }

        

        /*  
        this.sequenceFixture.transitions[this.index].percentAnimation = 100;
        this.fixture = JSON.parse(JSON.stringify( this.sequenceFixture.transitions[this.index].fixFixture ));

        for(  let i:number = 0; i < this.fixture.channels.length; i++)
        {
            this.appService.dmx_buffer[this.fixture.index + this.fixture.channels[i].index] = this.fixture.channels[i].value;
        }
       // this.server.sendDMX();

        // delay
        setTimeout(() => {
            this.nextTransition();
        }, duration);
        */
    }

    /**
     * Next Transition
     */
    private nextTransition()
    {
        if( this.isPlaying == false )
        {
            return;
        }
        if( this.direction == 1 )
        {
            if( this.index >= this.sequenceFixture.transitions.length - 1 )
            {
                if( this.sequenceFixture.loop )
                {
                    if( this.sequenceFixture.loopFromStart )
                    {
                        this.index = 0;
                        this.playSequenceTransition();
                    }
                    else
                    {
                        this.direction = -1;
                        this.index = this.sequenceFixture.transitions.length - 1;
                        this.playSequenceTransition();
                    }
                }
                else
                {
                  //  this.playSequenceTransition();
                }
            }
            else
            {
                this.index++;
                this.playSequenceTransition();
            }
        }
        else
        {
            if( this.index <= 0 )
            {
                if( this.sequenceFixture.loop )
                {
                    if( this.sequenceFixture.loopFromStart )
                    {
                        this.index = this.sequenceFixture.transitions.length - 1;
                        this.playSequenceTransition();
                    }
                    else
                    {
                        this.index = 0;
                        this.direction =  1;
                        this.playSequenceTransition();
                    }
                }
                else
                {
                //    this.playSequenceTransition();
                }
            }
            else
            {
                this.index--;
                this.playSequenceTransition();
            }
        }
    }
}
