import { FixtureChannelCapability } from "./fixture.channel.capability";
import { FixtureChannelType }       from "./fixture.channel.type";

export class FixtureChannel
{
    /**
     * DMX index
     */
    index!: number;

    /**
     * DMX value
     */
    value!: number;


    /**
     * type
     */
    type!: FixtureChannelType;

    /**
     * type description
     */
    type_description!: string;

    /**
     * Capabilities
     */
    capabilities!: FixtureChannelCapability[];

    /**
     * Capability
     */
    capability!: FixtureChannelCapability;
}