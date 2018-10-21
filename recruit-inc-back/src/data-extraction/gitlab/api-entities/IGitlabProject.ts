import {IGitlabRepositoryTree} from "./IGitlabRepositoryTree"
import { IGitlabCommit } from "./IGitlabCommit";

export interface IGitlabProject {
    id: number,
    description: string,
    name: string,
    name_with_namespace: string,
    path: string,
    path_with_namespace: string,
    created_at: string,
    default_branch: string,
    tag_list: string[],
    ssh_url_to_repo: string,
    http_url_to_repo: string,
    web_url: string,
    readme_url: string,
    avatar_url: string,
    star_count: number,
    forks_count: number,
    last_activity_at: string,
    namespace: {
        id: number,
        name: string,
        path: string,
        kind: string,
        full_path: string,
        parent_id: any
    },
    statistics?: {
        commit_count: number,
        storage_size: number,
        repository_size: number,
        lfs_objects_size: number,
        job_artifacts_size: number

    }
    projectStruture?:IGitlabRepositoryTree[],
    commitsStructure?:IGitlabCommit[]
}