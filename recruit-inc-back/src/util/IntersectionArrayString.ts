export class IntersectionArrayString {
    static intersection(originalArray : string[], targetArray: string[]){
        let commonVal : string[] = originalArray.filter(function(value) {
            return targetArray.indexOf(value) > -1;
            });

        return commonVal;
    }
}