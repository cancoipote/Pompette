import { Fixture }      from "../../fixture/vo/fixture";
import { Sequence }     from "../../sequence/vo/sequence";
import { Show }         from "../../show/vo/show";

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
	 * Frequency
	 */
	frequency = 60;

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