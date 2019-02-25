class BackendFeatures{
    constructor(){
        this.backendFeatures = [
            {
                id: 'closedBeta',
                name: 'This is a closed beta for only certain users',
                description: 'Closed beta allows us to test on small groups of users',
                criteria: {isUserAllowed: true}
            },
            {
                id: 'newFeatureRollout',
                name: 'A new feature rollout',
                description: 'New feature done development, allows to gradually launch the new feature',
                enabled: true
                //criteria: // if criteria is put, no need for the "enabled"
            },
            {
                id: 'experimentalFeature',
                name: 'An Experimental Feature',
                description: 'Experimental feature still in development, useful for internal development',
                enabled: false,
            },
        ];
    };

    getBackendFeature() {
        return this.backendFeatures;
    };
}

module.exports = BackendFeatures;

