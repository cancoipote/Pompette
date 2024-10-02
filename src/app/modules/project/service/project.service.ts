import { Injectable } 								from '@angular/core';
import { MatDialog } 								from '@angular/material/dialog';
import { PopupComponent } 							from '../../../commons/popup/popup.component';
import { AppService }                               from '../../../core/service/app.service';
import { ServerService } 							from '../../../core/service/server.service';
import { FixtureService } 							from '../../fixture/service/fixture.service';
import { Sequence } 								from '../../sequence/vo/sequence';
import { SequenceFixture } 							from '../../sequence/vo/sequence.fixture';
import { SequenceFixtureTransition } 				from '../../sequence/vo/sequence.fixture.transition';
import { version } from 'node:os';
import { Project } from '../vo/project';
import { Fixture } from '../../fixture/vo/fixture';
import { SequenceFixtureTransitionType } from '../../sequence/vo/sequence.fixture.transition.type';
import { FixtureChannel } from '../../fixture/vo/fixture.channel';




/**
 * Common Service
 * 
 * Web-Service used by Common Component
 */
@Injectable()
export class ProjectService 
{
	/**
	 * Constructor
	 * 
	 */
	constructor (
		public appService: AppService,
        private serverService:ServerService,
		private dialog: MatDialog,
		private fixtureService:FixtureService
		) {}
    
	/**
	 * Export project
	 */
    private convertProjectToExportFormat():any
	{
		let now = new Date();
		let day = String(now.getDate()).padStart(2, '0');
		let month = String(now.getMonth() + 1).padStart(2, '0'); 
		let year = now.getFullYear();
		let hours = String(now.getHours()).padStart(2, '0');
		let minutes = String(now.getMinutes()).padStart(2, '0');
		let seconds = String(now.getSeconds()).padStart(2, '0');
		let formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

		let fixtures:any = new Array();
		for( let i:number = 0; i < this.appService.project.fixtures.length; i++)
		{
			let fixture:any = new Object();
			fixture.id = this.appService.project.fixtures[i].id;
			fixture.index = this.appService.project.fixtures[i].index;
			fixture.reference = this.appService.project.fixtures[i].reference;

			fixtures.push(fixture);
		}

		let sequences:any = new Array();
		for( let i:number = 0; i < this.appService.project.sequences.length; i++)
		{
			let sequence:any = new Object();
			sequence.label = this.appService.project.sequences[i].label;
			sequence.isFX = this.appService.project.sequences[i].isFX;
			sequence.sequenceFixtures = new Array();

			for( let j:number = 0; j < this.appService.project.sequences[i].sequenceFixtures.length; j++)	
			{
				let sequenceFixture:any = new Object();
				sequenceFixture.fixture = new Object();
				sequenceFixture.fixture.id = this.appService.project.sequences[i].sequenceFixtures[j].fixture.id;
				sequenceFixture.fixture.index = this.appService.project.sequences[i].sequenceFixtures[j].fixture.index;
				sequenceFixture.fixture.reference = this.appService.project.sequences[i].sequenceFixtures[j].fixture.reference;
				sequenceFixture.loop = this.appService.project.sequences[i].sequenceFixtures[j].loop;
				sequenceFixture.loopFromStart = this.appService.project.sequences[i].sequenceFixtures[j].loopFromStart;
				sequenceFixture.canBeBypass = this.appService.project.sequences[i].sequenceFixtures[j].canBeBypass;

				sequenceFixture.transitions = new Array();
				for( let k:number = 0; k < this.appService.project.sequences[i].sequenceFixtures[j].transitions.length; k++)
				{
					let transition:any = new Object();
					transition.label = this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].label;
					transition.duration = this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].duration;
					transition.durationMin = this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].durationMin;
					transition.durationMax = this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].durationMax;
					transition.fixedDuration = this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].fixedDuration;
					transition.useStep = this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].useStep;
					transition.step = this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].step;

					transition.type = new Object();
					transition.type.id = this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].type.id;
					transition.subType = null;
					if( this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].subType )
					{
						transition.subType = new Object();
						transition.subType.id = this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].subType.id;
					}

					transition.startFixture = null;
					if( this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].startFixture )
					{
						transition.startFixture = new Object();
						transition.startFixture.channels = new Array();
						for( let a:number = 0; a < this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].startFixture.channels.length; a++)
						{
							let channel:any = new Object();
							channel.index = this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].startFixture.channels[a].index;
							channel.value = this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].startFixture.channels[a].value;
							transition.startFixture.channels.push(channel);
						}
					}

					transition.endFixture = null;
					if( this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].endFixture )
					{
						transition.endFixture = new Object();
						transition.endFixture.channels = new Array();
						for( let a:number = 0; a < this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].endFixture.channels.length; a++)
						{
							let channel:any = new Object();
							channel.index = this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].endFixture.channels[a].index;
							channel.value = this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].endFixture.channels[a].value;
							transition.endFixture.channels.push(channel);
						}
					}

					transition.fixFixture = null;
					if( this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].fixFixture )
					{
						transition.fixFixture = new Object();
						transition.fixFixture.channels = new Array();
						for( let a:number = 0; a < this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].fixFixture.channels.length; a++)
						{
							let channel:any = new Object();
							channel.index = this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].fixFixture.channels[a].index;
							channel.value = this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].fixFixture.channels[a].value;
							transition.fixFixture.channels.push(channel);
						}
					}

					
					sequenceFixture.transitions.push(transition);
				}

				sequence.sequenceFixtures.push(sequenceFixture);
			}
			sequences.push(sequence);
		}

		let shows:any = new Array();

		let exportResult:any = (
			{
				version: this.appService.version,
				date:formattedDateTime,
				project:
				{
					label: this.appService.project.label,
					fixtures: fixtures,
					sequences: sequences,
					shows: shows
				}
			}
		);

		return exportResult;
	}
    
	/**
	 * Save project from Browser
	 */
    public saveProjectFromBrowser()
	{
		let datas:any = this.convertProjectToExportFormat();
		const dataStr = JSON.stringify(datas, null, 2);
		const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

		const exportFileDefaultName = this.appService.project.label + '.pompette';

		const linkElement = document.createElement('a');
		linkElement.setAttribute('href', dataUri);
		linkElement.setAttribute('download', exportFileDefaultName);
		linkElement.click();
	}
	
	/**
	 * Save project from Sowftware
	 */
	public async saveProjectFromSowftware()
	{
		let datas:any = this.convertProjectToExportFormat();
		const dataStr = JSON.stringify(datas, null, 2);
		const blob = new Blob([dataStr], { type: 'application/json' });

		try 
		{
			const fileHandle = await (window as any).showSaveFilePicker
			(
				{
					suggestedName: this.appService.project.label + '.pompette',
					types: 
					[
						{
							description: 'JSON Files',
							accept: { 'application/json': ['.pompette'] },
						},
					],
				}
			);

			const writable = await fileHandle.createWritable();
			await writable.write(blob);
			await writable.close();
		} 
		catch (err) 
		{
			let message_error:string = "An error occurred while saving the file.";
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
						prompt_value:"Project's name",
						disable_cancel:true,
						display_close:true,
                        display_cancel:false,
						prompt:'' 
					}
				}
			);
		}
	}

	/**
	 * Open project
	 */
	public openProject( event:any )
	{
		
		let jsonData:any = null;
		const file: File = event.target.files[0];

		if( file )
		{
			this.readFile(file).then(content => 
				{
					try 
					{
						jsonData = JSON.parse(content)
						if( this.validateJSONStructure(jsonData) ) 
						{
							this.appService.project = new Project();
							this.appService.project.label = jsonData.project.label;

							this.appService.project.fixtures = new Array();
							for( let i:number = 0; i < jsonData.project.fixtures.length; i++)
							{
								let fixture:Fixture = new Fixture();
								for( let a:number = 0; a < this.fixtureService.manufacturers.length; a++)
								{
									for( let b:number = 0; b < this.fixtureService.manufacturers[a].fixtures.length; b++)
									{
										if( jsonData.project.fixtures[i].id == this.fixtureService.manufacturers[a].fixtures[b].id )
										{
											fixture = JSON.parse( JSON.stringify(this.fixtureService.manufacturers[a].fixtures[b]) );
											break;
										}
									}
								}
								fixture.index = jsonData.project.fixtures[i].index;
								fixture.reference = jsonData.project.fixtures[i].reference;
									
								this.appService.project.fixtures.push(fixture);
							}

							
							this.appService.project.sequences = new Array();
							for( let i:number = 0; i < jsonData.project.sequences.length; i++)
							{
								let sequence:Sequence = new Sequence();
								sequence.label = jsonData.project.sequences[i].label;
								sequence.isFX = jsonData.project.sequences[i].isFX;
								sequence.sequenceFixtures = new Array();

								for( let j:number = 0; j < jsonData.project.sequences[i].sequenceFixtures.length; j++)	
								{
									let sequenceFixture:SequenceFixture = new SequenceFixture();
									sequenceFixture.fixture = new Fixture();
									for( let a:number = 0; a < this.appService.project.fixtures.length; a++)
									{
										if( jsonData.project.sequences[i].sequenceFixtures[j].fixture.id == this.appService.project.fixtures[a].id && jsonData.project.sequences[i].sequenceFixtures[j].fixture.index == this.appService.project.fixtures[a].index )
										{
											sequenceFixture.fixture.create( this.appService.project.fixtures[a] );
											break;
										}
									}
									sequenceFixture.loop = jsonData.project.sequences[i].sequenceFixtures[j].loop;
									sequenceFixture.loopFromStart = jsonData.project.sequences[i].sequenceFixtures[j].loopFromStart;
									sequenceFixture.canBeBypass = jsonData.project.sequences[i].sequenceFixtures[j].canBeBypass;

									sequenceFixture.transitions = new Array();

									for(let k:number = 0; k < jsonData.project.sequences[i].sequenceFixtures[j].transitions.length; k++)
									{
										let transition:SequenceFixtureTransition = new SequenceFixtureTransition();
										transition.label = jsonData.project.sequences[i].sequenceFixtures[j].transitions[k].label;
										transition.duration = parseInt(jsonData.project.sequences[i].sequenceFixtures[j].transitions[k].duration.toString());
										transition.durationMin = parseInt(jsonData.project.sequences[i].sequenceFixtures[j].transitions[k].durationMin.toString());
										transition.durationMax = parseInt(jsonData.project.sequences[i].sequenceFixtures[j].transitions[k].durationMax.toString());
										transition.fixedDuration = jsonData.project.sequences[i].sequenceFixtures[j].transitions[k].fixedDuration;

										transition.useStep = false;
										if( jsonData.project.sequences[i].sequenceFixtures[j].transitions[k].useStep )
										{
											transition.useStep = jsonData.project.sequences[i].sequenceFixtures[j].transitions[k].useStep;
										}

										transition.step = 0;
										if( jsonData.project.sequences[i].sequenceFixtures[j].transitions[k].step )
										{
											transition.step = parseInt(jsonData.project.sequences[i].sequenceFixtures[j].transitions[k].step.toString());
										}

										transition.type = new SequenceFixtureTransitionType();
										for( let a:number = 0; a < this.fixtureService.transitionTypes.length; a++ )
										{
											if( jsonData.project.sequences[i].sequenceFixtures[j].transitions[k].type.id == this.fixtureService.transitionTypes[a].id )
											{
												transition.type = this.fixtureService.transitionTypes[a];
												break;
											}
										}

										
										if( jsonData.project.sequences[i].sequenceFixtures[j].transitions[k].subType )
										{
											transition.subType = new SequenceFixtureTransitionType();
											for( let a:number = 0; a < transition.type.subTypes.length; a++ )
											{
												if( jsonData.project.sequences[i].sequenceFixtures[j].transitions[k].subType.id == transition.type.subTypes[a].id )
												{
													transition.subType = transition.type.subTypes[a];
													break;
												}
											}
										}

										if( jsonData.project.sequences[i].sequenceFixtures[j].transitions[k].startFixture )
										{
											transition.startFixture = new Fixture();
											transition.startFixture.create( sequenceFixture.fixture );
											for( let a:number = 0; a < jsonData.project.sequences[i].sequenceFixtures[j].transitions[k].startFixture.channels.length; a++ )
											{
												for( let b:number = 0; b < transition.startFixture.channels.length; b++ )
												{
													if( jsonData.project.sequences[i].sequenceFixtures[j].transitions[k].startFixture.channels[a].index == transition.startFixture.channels[b].index )
													{
														transition.startFixture.channels[b].value = jsonData.project.sequences[i].sequenceFixtures[j].transitions[k].startFixture.channels[a].value;
														break;
													}
												}
											}
										}

										if( jsonData.project.sequences[i].sequenceFixtures[j].transitions[k].endFixture )
										{
											transition.endFixture = new Fixture();
											transition.endFixture.create( sequenceFixture.fixture );
											for( let a:number = 0; a < jsonData.project.sequences[i].sequenceFixtures[j].transitions[k].endFixture.channels.length; a++ )
											{
												for( let b:number = 0; b < transition.endFixture.channels.length; b++ )
												{
													if( jsonData.project.sequences[i].sequenceFixtures[j].transitions[k].endFixture.channels[a].index == transition.endFixture.channels[b].index )
													{
														transition.endFixture.channels[b].value = jsonData.project.sequences[i].sequenceFixtures[j].transitions[k].endFixture.channels[a].value;
														break;
													}
												}
											}
										}

										if( jsonData.project.sequences[i].sequenceFixtures[j].transitions[k].fixFixture )
										{
											transition.fixFixture = new Fixture();
											transition.fixFixture.create( sequenceFixture.fixture );
											for( let a:number = 0; a < jsonData.project.sequences[i].sequenceFixtures[j].transitions[k].fixFixture.channels.length; a++ )
											{
												for( let b:number = 0; b < transition.fixFixture.channels.length; b++ )
												{
													if( jsonData.project.sequences[i].sequenceFixtures[j].transitions[k].fixFixture.channels[a].index == transition.fixFixture.channels[b].index )
													{
														transition.fixFixture.channels[b].value = jsonData.project.sequences[i].sequenceFixtures[j].transitions[k].fixFixture.channels[a].value;
														break;
													}
												}
											}
										}

										sequenceFixture.transitions.push(transition);
									}

									sequence.sequenceFixtures.push(sequenceFixture);
								}
								this.appService.project.sequences.push(sequence);
							}

							this.appService.is_project 	= true;	

							
						} 
						else 
						{
							let message_error:string = "You try to load an invalid file.";
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
										prompt_value:"Project's name",
										disable_cancel:true,
										display_close:true,
										display_cancel:false,
										prompt:'' 
									}
								}
							);
						}
					} 
					catch (error) 
					{
						console.log(error);
						let message_error:string = "You try to load an invalid file.";
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
									prompt_value:"Project's name",
									disable_cancel:true,
									display_close:true,
									display_cancel:false,
									prompt:'' 
								}
							}
						);
					}
				}
				)
				.catch
				(
					error => 
					{
						let message_error:string = "Unable to read the file uploaded";
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
									prompt_value:"Project's name",
									disable_cancel:true,
									display_close:true,
									display_cancel:false,
									prompt:'' 
								}
							}
						);
					}
				);
		}
		
		/*
		let jsonData:any = null;
		const file: File = event.target.files[0];
		if (file) 
		{
			this.readFile(file).then(content => 
			{
				try 
				{
					jsonData = JSON.parse(content)
					if( this.validateJSONStructure(jsonData) ) 
					{
						this.appService.project 	= JSON.parse(content);

						for( let i:number = 0; i < this.appService.project.fixtures.length; i++)
						{
							for( let j:number = 0; j < this.fixtureService.manufacturers.length; j++)
							{
								for( let k:number = 0; k < this.fixtureService.manufacturers[j].fixtures.length; k++)
								{
									if( this.appService.project.fixtures[i].id == this.fixtureService.manufacturers[j].fixtures[k].id )
									{
										let indexDmx:number = this.appService.project.fixtures[i].index + 0;
										let reference:string = this.appService.project.fixtures[i].reference + "";
										if( reference == null || reference == undefined || reference == "null" || reference == "undefined" )
										{
											reference = "";
										}

										this.appService.project.fixtures[i] = JSON.parse( JSON.stringify(this.fixtureService.manufacturers[j].fixtures[k]) );
										this.appService.project.fixtures[i].index = indexDmx;
										this.appService.project.fixtures[i].reference = reference;

										for( let a:number = 0; a < this.appService.project.fixtures[i].channels.length; a++)
										{
											if( this.appService.project.fixtures[i].channels[a].capabilities.length > 0 )
											{
												this.appService.project.fixtures[i].channels[a].capability = this.appService.project.fixtures[i].channels[a].capabilities[0];
											}
										}

										break;
									}
								}
							}
						}

						

						for( let i:number = 0; i < this.appService.project.sequences.length; i++)
						{
							let sequence:Sequence = new Sequence();
							sequence.create(this.appService.project.sequences[i]);
							this.appService.project.sequences[i] = sequence;
						}

						for( let i:number = 0; i < this.appService.project.sequences.length; i++)
						{
							for( let j:number = 0; j < this.appService.project.sequences[i].sequenceFixtures.length; j++)
							{
								for( let a:number = 0; a < this.appService.project.fixtures.length; a++)
								{
									if( this.appService.project.sequences[i].sequenceFixtures[j].fixture.id == this.appService.project.fixtures[a].id && this.appService.project.sequences[i].sequenceFixtures[j].fixture.index == this.appService.project.fixtures[a].index )
									{
										this.appService.project.sequences[i].sequenceFixtures[j].fixture = this.appService.project.fixtures[a];
										break;
									}
								}

								for( let k:number = 0; k < this.appService.project.sequences[i].sequenceFixtures[j].transitions.length; k++ )
								{
									if( this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].type )
									{
										for( let a:number = 0; a < this.fixtureService.transitionTypes.length; a++ )
										{
											if( this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].type.id == this.fixtureService.transitionTypes[a].id )
											{
												this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].type = this.fixtureService.transitionTypes[a];

												if( this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].subType )
												{
													for( let b:number = 0; b < this.fixtureService.transitionTypes[a].subTypes.length; b++ )
													{
														if( this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].subType.id == this.fixtureService.transitionTypes[a].subTypes[b].id )
														{
															this.appService.project.sequences[i].sequenceFixtures[j].transitions[k].subType = this.fixtureService.transitionTypes[a].subTypes[b];
														}
													}
												}

												break;
											}
										}
									}
								}
							}
						}
	
						

						if( this.appService.project.sequences == null )
						{
							this.appService.project.sequences = new Array();
						}

						this.appService.is_project 	= true;	
					} 
					else 
					{
						let message_error:string = "You try to load an invalid file.";
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
									prompt_value:"Project's name",
									disable_cancel:true,
									display_close:true,
                                    display_cancel:false,
									prompt:'' 
								}
							}
						);
					}
				} 
				catch (error) 
				{
					let message_error:string = "You try to load an invalid file.";
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
								prompt_value:"Project's name",
								disable_cancel:true,
								display_close:true,
                                display_cancel:false,
								prompt:'' 
							}
						}
					);
				}
			}
			)
			.catch
			(
				error => 
				{
					let message_error:string = "Unable to read the file uploaded";
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
								prompt_value:"Project's name",
								disable_cancel:true,
								display_close:true,
                                display_cancel:false,
								prompt:'' 
							}
						}
					);
				}
			);
    	}
		*/
	}



	/**
	 * Export from Browser
	 * @param datas
	 * @param filename_details
	 */
    public exportProjectFromBrowser( datas:string, filename_details:string )
	{
		const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(datas);

		const exportFileDefaultName = this.appService.project.label + filename_details + '.json';

		const linkElement = document.createElement('a');
		linkElement.setAttribute('href', dataUri);
		linkElement.setAttribute('download', exportFileDefaultName);
		linkElement.click();
	}
	
	/**
	 * Export from Sowftware
	 * @param datas
	 * @param filename_details
	 */
	public async exportProjectFromSowftware( datas:string, filename_details:string )
	{
		const blob = new Blob([datas], { type: 'application/json' });

		try 
		{
			const fileHandle = await (window as any).showSaveFilePicker
			(
				{
					suggestedName: this.appService.project.label + filename_details + '.json',
					types: 
					[
						{
							description: 'JSON Files',
							accept: { 'application/json': ['.json'] },
						},
					],
				}
			);

			const writable = await fileHandle.createWritable();
			await writable.write(blob);
			await writable.close();
		} 
		catch (err) 
		{
			let message_error:string = "An error occurred while saving the file.";
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
						prompt_value:"Project's name",
						disable_cancel:true,
						display_close:true,
                        display_cancel:false,
						prompt:'' 
					}
				}
			);
		}
	}


	/**
	 * Read file
	 * @param file 
	 * @returns 
	 */
	private readFile(file: File): Promise<string> 
	{
		return new Promise
		(
			(resolve, reject) => 
			{
		  		const reader = new FileReader();
		 		reader.onload = () => 
				{
					resolve(reader.result as string);
		  		};
		  		
				reader.onerror = () => 
				{
					reject(reader.error);
		  		};
		  		reader.readAsText(file);
			}
		);  
	}


	/**
	 * Valide Json Structure
	 * @param jsonData 
	 * @returns 
	 */
	public validateJSONStructure(jsonData:any): boolean
	{
		if( jsonData == null || jsonData == undefined )
		{
			return false;
		}
		
		if( typeof jsonData != 'object' )
		{
			return false;
		}

		if( jsonData.version == null || jsonData.version == undefined )
		{
			return false;
		}

		if( typeof jsonData.version != 'string' )
		{
			return false;
		}

		if( typeof jsonData.date != 'string' )
		{
			return false;
		}

		if( jsonData.project == null || jsonData.project == undefined )
		{
			return false;
		}

		if( typeof jsonData.project != 'object' )
		{
			return false;
		}

		return true;
	}

}
