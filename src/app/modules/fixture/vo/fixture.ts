import { FixtureChannel } from "./fixture.channel";
import { FixtureType } from "./fixture.type";

export class Fixture
{
    /**
     * id
     */
    id!: number;

    /**
     * version
     */
    version!: string;

    /**
     * label
     */
    label!: string;

    /**
     * reference
     */
    reference!: string;

    /**
     * file path
     */
    filePath:string = "";

    /**
     * DMX index
     */
    index!: number;

    /**
     * type
     */
    type!: FixtureType;

    /**
     * channels
     */
    channels!: FixtureChannel[];

    /**
     * manufacturer
     */
    manufacturer!: string;

    /**
     * bulb type
     */
    bulb_type!: string;

    /**
     * bulb lumens
     */
    bulb_lumens!: number;

    /**
     * bulb color temperature
     */
    bulb_color_temperature!: number;

    /**
     * dimension weight
     */
    dimension_weight!: number;

    /**
     * dimension width
     */
    dimension_width!: number;

    /**
     * dimension height
     */
    dimension_height!: number;

    /**
     * dimension depth
     */
    dimension_depth!: number;

    /**
     * lens label
     */
    lens_label!: string;

    /**
     * lens degree min
     */
    lens_degree_min!: number;

    /**
     * lens degree max
     */
    lens_degree_max!: number;

    /**
     * focus type
     */
    focus_type!: string;

    /**
     * focus pan max
     */
    focus_pan_max!: number;

    /**
     * focus tilt max
     */
    focus_tilt_max!: number;

    /**
     * technical power consumption
     */
    technical_power_consumption!: number;

    /**
     * technical dmx connector
     */
    technical_dmx_connector!: string;


    public create( fixture:Fixture )
    {
       this.id                          = fixture.id;   
       this.version                     = fixture.version;
       this.label                       = fixture.label;
       this.reference                   = fixture.reference;
       this.filePath                    = fixture.filePath
       this.index                       = fixture.index;
       this.manufacturer                = fixture.manufacturer;
       this.bulb_type                   = fixture.bulb_type;
       this.bulb_lumens                 = fixture.bulb_lumens;
       this.bulb_color_temperature      = fixture.bulb_color_temperature;
       this.dimension_weight            = fixture.dimension_weight;
       this.dimension_width             = fixture.dimension_width;
       this.dimension_height            = fixture.dimension_height;
       this.dimension_depth             = fixture.dimension_depth;
       this.lens_label                  = fixture.lens_label;
       this.lens_degree_min             = fixture.lens_degree_min;
       this.lens_degree_max             = fixture.lens_degree_max;
       this.focus_type                  = fixture.focus_type;
       this.focus_pan_max               = fixture.focus_tilt_max;
       this.focus_tilt_max              = fixture.focus_pan_max;
       this.technical_power_consumption = fixture.technical_power_consumption;
       this.technical_dmx_connector     = fixture.technical_dmx_connector;


        if( fixture.type )
        {
            this.type       = new FixtureType();
            this.type.id    = fixture.type.id;
            this.type.label = fixture.type.label;
            this.type.thumb = fixture.type.thumb;
        }

        this.channels = new Array();
        if(fixture.channels)
        {
            for( let i:number = 0; i < fixture.channels.length; i++ )
            {
                let channel:FixtureChannel = JSON.parse( JSON.stringify( fixture.channels[i] ) );
                this.channels.push( channel );            
            }
        }
    }




    /*****************************************************************/
    //
    // For component
    //
    //


    /**
     * Is selected for Export
     */
    isSelectedForExport:boolean = false;
}