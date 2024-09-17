import { Injectable } 	from '@angular/core';
/**
 * Application Service
 *Commmons
 * Contains Main constants
 */
@Injectable()
export class CommonsService 
{


	/*****************************************************************/
    //
    // Get Width
    //
    /*****************************************************************/

    /**
     * Get the with of the browser to dynamically set width of Popup 
     * 
     * @return {number} Browser Width
     */
     public getWidth():number 
     {
         return Math.max
         (
             document.body.scrollWidth,
             document.documentElement.scrollWidth,
             document.body.offsetWidth,
             document.documentElement.offsetWidth,
             document.documentElement.clientWidth
         );
     }
 
     /*****************************************************************/
     //
     // Get Height
     //
     /*****************************************************************/
 
     /**
      * Get the height of the browser to dynamically set width of Popup 
      * 
      * @param {number} Substact height
      * @param {number} Min height
      * @return {number} Browser Width
      */
     public getHeight( substract_height:number = 300, min_height:number = 400 ):number 
     {
         let height:number = window.innerHeight - substract_height;
         
         if( height < min_height )
         {	
             height = min_height;
         }	
         
         return height;
     }

    

    /*****************************************************************/
    //
    // Validators
    //
    /*****************************************************************/

    /**
     * Is data is numeric
     * @param value 
     * @returns 
     */
    static isNumeric(value: string) 
    {
        //Check if value is a integer between 0 and 512
        const numericRegex = /^[0-9]*$/;
        return numericRegex.test(value);
    }

    /**
     * Is data is alpha numeric space dash underscore only
     * @param input 
     * @returns 
     */
    static isAlphanumeric(input: string): boolean 
    {
       // const alphanumericRegex = /^[a-zA-Z0-9]*$/;

        // Regex to check if input is alpha numeric space dot dash underscore only
        const alphanumericRegex = /^[a-zA-Z0-9\s\.\-\_]*$/

        return alphanumericRegex.test(input);
    }
}
