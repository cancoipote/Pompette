import { SequenceFixture }      from "./sequence.fixture";

export class Sequence
{
    /**
     * label
     */
    label!: string;

    /**
     * is FX
     */
    isFX:boolean = false;

    /**
     * Sequence Fixtures
     */
    sequenceFixtures:SequenceFixture[] = new Array();

    /**
     * Show is loop
     */
    showIsLoop:boolean = false;

    /**
     * Show start time
     */
    showStartTime:number = 0;

    /**
     * Show end time
     */
    showEndTime:number = 0;

    /*****************************************************************/
    //
    // Methods
    //
    //

    /**
     * Create sequence
     * @param sequence 
     */
    public create( sequence:Sequence )
    {
        this.label = sequence.label;
        this.isPlayging = sequence.isPlayging;
        this.isFX = sequence.isFX;
        this.sequenceFixtures = new Array();
        for( let i:number = 0; i < sequence.sequenceFixtures.length; i++ )
        {
            let sequenceFixture:SequenceFixture = new SequenceFixture();
            sequenceFixture.create(sequence.sequenceFixtures[i]);
            this.sequenceFixtures.push(sequenceFixture);
        }
    }



    /*****************************************************************/
    //
    // For component
    //
    //

    /**
     * Is selected
     */
    isSelected:boolean = false;

    /**
     * Is selected for Export
     */
    isSelectedForExport:boolean = false;

    /**
     * Is playing
     */
    isPlayging:boolean = false;
}