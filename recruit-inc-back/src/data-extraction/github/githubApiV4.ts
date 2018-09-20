import fetch from 'node-fetch';

export class GithubApiV4 {

    public queryData(accessToken: string, query: string ) : string{

        fetch('https://api.github.com/graphql', {
            method: 'POST',
            body: JSON.stringify({query}),
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        }).then(res => res.text())
            .then(body => console.log(body))
            .catch(error => console.error(error));

        //results are on the console only for now
        return "result";
    }
}