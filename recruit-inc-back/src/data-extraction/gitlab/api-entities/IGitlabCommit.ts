export interface IGitlabCommit {
    id: string,
    short_id: string,
    title: string,
    created_at: string,
    parent_ids: string[],
    message: string,
    author_name: string,
    author_email: string,
    authored_date: string,
    committer_name: string,
    committer_email: string,
    committed_date: string,
    stats?: {
        additions: number,
        deletions: number,
        total: number
    }
}