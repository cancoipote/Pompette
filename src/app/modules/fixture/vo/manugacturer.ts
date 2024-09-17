import { Fixture } from "./fixture";
import { FixtureChannel } from "./fixture.channel";
import { FixtureType } from "./fixture.type";

export class Manufacturer
{
    /**
     * label
     */
    label!: string;

    /**
     * Fixtures
     */
     fixtures:Fixture[] = new Array();
}