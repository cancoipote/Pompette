import { Fixture }      from "../../fixture/vo/fixture";
import { Sequence }     from "../../sequence/vo/sequence";
import { Show }         from "../../show/vo/SHow";

export class Project
{
    /**
     * label
     */
    label!: string;

    /**
     * version
     */
    version!: string;

    /**
     * Fixtures
     */
    fixtures:Fixture[] = new Array();

    /**
     * Sequences
     */
    sequences:Sequence[] = new Array();


    /**
     * Shows
     */
    shows:Show[] = new Array();
}