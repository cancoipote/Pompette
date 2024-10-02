import { Fixture }                          from "../../fixture/vo/fixture";
import { SequenceFixtureTransitionSubType } from "./sequence.fixture.transition.sub.type";
import { SequenceFixtureTransitionType }    from "./sequence.fixture.transition.type";


export class SequenceFixtureTransition
{

    /**
     * Label
    */
    label!:string;

    /**
     * Is playing
     */
    isPlayging:boolean = false;

    /**
     * duration in seconds
     */
    duration:number = 0;

    /**
     * duration in seconds
     */
    durationMin:number = 0;

    /**
     * duration in seconds
     */
    durationMax:number = 0;

    /**
     * Fixed duration or not
     */
    fixedDuration:boolean = true;

    /**
     * use setp instead of duration
     */
    useStep:boolean = false;

    /**
     * step
     */
    step:number = 0;

    /**
     * type
     */
    type!:SequenceFixtureTransitionType;

    /**
     * sub type
     */
    subType!:SequenceFixtureTransitionSubType;

    /**
     * Start Fixture
     */
    startFixture!:Fixture;
 
    /**
     * End Fixture
     */
    endFixture!:Fixture;

    /**
     * Fix Fixture
     */
    fixFixture!:Fixture;




    /*****************************************************************/
    //
    // Methods
    //
    //


    /**
     * Create from transition
     * @param transition 
     */
    public create( transition:SequenceFixtureTransition )
    {
        this.label = transition.label;
        this.isPlayging = transition.isPlayging;
        this.duration = transition.duration;
        this.durationMin = transition.durationMin;
        this.durationMax = transition.durationMax;
        this.fixedDuration = transition.fixedDuration;
        this.useStep = transition.useStep;
        this.step = transition.step;
        this.type = transition.type;
        this.subType = transition.subType;

        this.startFixture = new Fixture();
        this.startFixture.create( transition.startFixture );

        this.endFixture = new Fixture();
        this.endFixture.create( transition.endFixture );

        this.fixFixture = new Fixture();
        this.fixFixture.create( transition.fixFixture );

    }

    /**
     * get duration min & max
     */
    public getDuration():any
    {
        let min:number = 0;
        let max:number = 0;

        if( this.fixedDuration )
        {
            min = this.duration;
            max = this.duration;
        }
        else
        {
            min = this.durationMin;
            max = this.durationMax;
        }

        return {min:min,max:max};
    }

    /**
     * Get duration in string
     * @returns 
     */
    public getDurationString():string
    {
        if( this.useStep == false )
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
        else
        {
            return "( " + this.step + " steps )";
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
     * Is playing
     */
    isPlaying:boolean = false;

    /**
     * Percent animation
     */
    percentAnimation:number = 0;
}