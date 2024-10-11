import { Injectable, NgZone  } 						from '@angular/core';

import { AppService } 								from '../service/app.service';
import { ServerService } 							from '../service/server.service';
import { SequenceFixtureTransition } 				from '../../modules/sequence/vo/sequence.fixture.transition';
import { SequenceFixture } 							from '../../modules/sequence/vo/sequence.fixture';
import { Sequence } 								from '../../modules/sequence/vo/sequence';
import { EngineFixture } 							from './engine.fixture';





/**
 * Engine Service
 * 
 * Engine
 */
@Injectable()
export class Engine 
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
	 * Is playing
	 */
	public isPlaying:boolean = false;

	/**
	 * Engine fictures
	 */
	public engineFixtures:EngineFixture[] = new Array<EngineFixture>();

	/**
	 * Thread ID
	 */
	public threadId:any = null;

	
	/***************************************************** 
	 * 
	 * Public Methods
	 * 
	 */


	/**
	 * Start Engine
	 */
	public start() 
	{
		this.server.getBlackoutListener()
        .subscribe
        (
            (updatedData: boolean) => 
            {
                this.clear();
				this.stopThread();
            }
        );
	}

	
	/**
	 * Play Sequence
	 * @param sequence 
	 */
	public playSequence( sequence:Sequence )
	{
		this.isPlaying = true;

		this.engineFixtures = new Array<EngineFixture>();

		sequence.isPlayging = true;

		for( let i:number = 0; i < sequence.sequenceFixtures.length; i++ )
		{
			let fixtureEngine:EngineFixture = new EngineFixture(this.appService, this.server, this.ngZone);
			fixtureEngine.createFromSequenceFixture(sequence.sequenceFixtures[i]);
			fixtureEngine.sequence = sequence;
			fixtureEngine.start();

			this.engineFixtures.push(fixtureEngine);
		}

		this.startThread();
	}

	/**
	 * Stop Sequence
	 */
	public stopSequence( sequence:Sequence )
	{
		sequence.isPlayging = false;
		for( let i:number = 0; i < this.engineFixtures.length; i++ )
		{
			if( this.engineFixtures[i].sequence == sequence )
			{
				for( let a:number = 0; a < this.engineFixtures[i].sequenceFixture.transitions.length; a++ )
				{
					this.engineFixtures[i].sequenceFixture.transitions[a].isPlayging = false;
				}
				
				this.engineFixtures[i].stop();
				this.engineFixtures.splice(i, 1);
				break;
			}
		}

		if( this.engineFixtures.length == 0 )
		{
			this.clear();
			this.stopThread
		}
	}

	/**
	 * Stop Sequences
	 */
	public stopSequences()
	{
		this.clear();
		this.stopThread();
	}

	/**
	 * Play SequenceFixture
	 * @param sequenceFixture 
	 */
	public playSequenceFixture( sequenceFixture:SequenceFixture )
	{
		this.isPlaying = true;

		let fixtureEngine:EngineFixture = new EngineFixture(this.appService, this.server, this.ngZone);
		fixtureEngine.createFromSequenceFixture(sequenceFixture);
		fixtureEngine.start();

		this.engineFixtures = new Array<EngineFixture>();
		this.engineFixtures.push(fixtureEngine);

		this.startThread();
	}


	/**
	 * Stop SequenceFixture
	 */
	public stopSequenceFixture()
	{
		this.clear();
		this.stopThread();
	}


	/**
	 * Play Transition
	 * @param transition 
	 */
	public playTransition( transition:SequenceFixtureTransition )
	{
		this.isPlaying = true;

		let fixtureEngine:EngineFixture = new EngineFixture(this.appService, this.server, this.ngZone);
		fixtureEngine.createFromTransition(transition);
		fixtureEngine.start();

		this.engineFixtures = new Array<EngineFixture>();
		this.engineFixtures.push(fixtureEngine);

		this.startThread();
	}

	/**
	 * Stop Transition
	 */
	public stopTransition()
	{
		this.clear();
		this.stopThread();
	}


	/***************************************************** 
	 * 
	 * Engine
	 * 
	 */

	/**
	 * Start Thread
	 * 
	 */
	private startThread() 
	{
		const frequency = 1000 / 50; // 20ms
	
		this.threadId = setInterval
		(
			() => 
				{
					this.server.sendDMX();
				}, 
			frequency
		);
	}
	
	/**
	 * Stop Thread
	 * 
	 */
	private stopThread() 
	{
		if (this.threadId) 
		{
			clearInterval(this.threadId);
			console.log('Thread stopped');
		}
	}


	/**
	 * Clear All animations
	 */
	private clear()
	{
		for( let i:number = 0; i < this.engineFixtures.length; i++ )
		{
			for( let a:number = 0; a < this.engineFixtures[i].sequenceFixture.transitions.length; a++ )
			{
				this.engineFixtures[i].sequenceFixture.transitions[a].isPlayging = false;
			}

			this.engineFixtures[i].stop();
		}

		this.engineFixtures = new Array<EngineFixture>();
		this.isPlaying = false;
	}
}
