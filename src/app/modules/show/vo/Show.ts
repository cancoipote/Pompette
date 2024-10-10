import { Sequence } from "../../sequence/vo/sequence";

export class Show
{
    /**
     * label
     */
    label!: string;

    /**
     * Sequences
     */
    sequences!: Sequence[];

    /**
     * Effects
     */
    effects!: Sequence[];


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
    isPlay:boolean = false;

    /**
     * Is Paused
     */
    isPause:boolean = false;
}