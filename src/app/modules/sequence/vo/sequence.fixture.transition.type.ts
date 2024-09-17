import { SequenceFixtureTransitionSubType } from "./sequence.fixture.transition.sub.type";

export class SequenceFixtureTransitionType
{
    /**
     * id
     */
    id:number = 0;

    /**
     * label
     */
    label:string = "";

    /**
     *  use start end channel
     */
    useStartEndChannel:boolean = false;

    
    /**
     *  use channel
     */
    useChannel:boolean = false;

    /**
     * Sub types
     */
    subTypes:SequenceFixtureTransitionSubType[] = [];
}