import { Fixture }                      from "../../fixture/vo/fixture";
import { SequenceFixtureTransition }    from "./sequence.fixture.transition";


export class SequenceFixture
{
    /**
     * fixtures 
     */
    fixture!:Fixture;

    /**
     * Is playing
     */
    isPlayging:boolean = false;

    /**
     * loop
     */
    loop:boolean = false;

    /**
     * loop from start
     */
    loopFromStart:boolean = false;

    /**
     * can be bypass
     */
    canBeBypass:boolean = false;

    /**
     * transitions
     */
    transitions:SequenceFixtureTransition[] = new Array();



    

    /*****************************************************************/
    //
    // Methods
    //
    //


    /**
     * Create from sequence fixture
     * @param sequence 
     */
    public create( sequence:SequenceFixture )
    {
        this.fixture = new Fixture();
        this.fixture.create( sequence.fixture );
        this.isPlayging = sequence.isPlayging;
        this.loop = sequence.loop;
        this.loopFromStart = sequence.loopFromStart;
        this.canBeBypass = sequence.canBeBypass;
        this.transitions = new Array();
        for( let i:number = 0; i < sequence.transitions.length; i++ )
        {
            let transition:SequenceFixtureTransition = new SequenceFixtureTransition();
            transition.create(sequence.transitions[i]);
            this.transitions.push(transition);
        }
    }


    /**
     * get duration min & max
     */
    public getDuration():any
    {
        let min:number = 0;
        let max:number = 0;

        for( let i:number = 0; i < this.transitions.length; i++ )
        {
            let transitionDuration:any = this.transitions[i].getDuration();
            min += parseInt(transitionDuration.min);
            max += parseInt(transitionDuration.max);
        }

        return {min:min,max:max};
    }

    /**
     * Get duration in string
     * @returns 
     */
    public getDurationString():string
    {
        let duration:any = this.getDuration();
        let result:string = "";

        if( duration.min == duration.max )
        {
            result = "( " + duration.min + "ms )";
        }
        else
        {
            result = "( [ " + duration.min + "ms ; " + duration.max + "ms ] )";
        }
        
        return result;
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
}