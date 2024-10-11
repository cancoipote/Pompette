import { Sequence } from "../../sequence/vo/sequence";

export class ShowSequence
{
    /**
     * Sequence
     */
    sequence!: Sequence;

    /**
     * Is loop
     */
    isLoop:boolean = false;

    /**
     * Duration
     */
    duration:number = 0;

    /**
     * Is delay
     */
    isDelay:boolean = false;

    /**
     * Percent
     */
    percent:number = 0;


    /*****************************************************************/
    //
    // For component
    //
    //

    /**
     * Is playing
     */
    isPlayging:boolean = false;

}