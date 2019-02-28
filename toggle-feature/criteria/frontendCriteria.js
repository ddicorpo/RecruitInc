class FrontendCriteria{
    constructor(){
        this.frontendCriteria = [
            {
                //always returns true(only an example)
                id: 'isUserAllowed',
                check: function() {
                    return true;
                }
            }
        ];
    };

    getFrontendCriteria() {
        return this.frontendCriteria;
    };
}

module.exports = FrontendCriteria;

