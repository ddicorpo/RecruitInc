class BackendCriteria{
    constructor(){
        this.backendCriteria = [
            {
                //always returns true(only an example)
                id: 'isUserAllowed',
                check: function() {
                    return true;
                }
            }
        ];
    };

    getBackendCriteria() {
        return this.backendCriteria;
    };
}

module.exports = BackendCriteria;

