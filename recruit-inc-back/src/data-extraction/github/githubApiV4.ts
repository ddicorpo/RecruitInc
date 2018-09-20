import fetch from 'node-fetch';

export class GithubApiV4 {

    public queryData(accessToken: string, query: string ) : string{

        return fetch('https://api.github.com/graphql', {
            method: 'POST',
            body: JSON.stringify({query}),
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        }).then(res => res.text())
            .then(body => {
                console.log(body);
                return body;
            })
            .catch(error => {
                console.error(error);
                return error;
            });
    }
}