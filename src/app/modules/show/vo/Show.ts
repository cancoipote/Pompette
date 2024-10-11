import { ShowSequence } from "./show.sequence";

export class Show
{
    /**
     * label
     */
    label!: string;

    /**
     * Sequences
     */
    sequences!: ShowSequence[];

    /**
     * Effects
     */
    effects!: ShowSequence[];


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