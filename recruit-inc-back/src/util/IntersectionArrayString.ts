export class IntersectionArrayString {
    static intersection(originalArray : string[], targetArray: string[]){
        let commonVal : string[] = [];
        if(originalArray === undefined || targetArray == undefined){
            return commonVal;
        }
        commonVal = originalArray.filter(function(value) {
            return targetArray.indexOf(value) > -1;
        });

        return commonVal;
    }
}