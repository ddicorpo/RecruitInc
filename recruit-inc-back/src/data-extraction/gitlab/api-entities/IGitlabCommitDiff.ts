interface IGitlabCommitDiff {
    old_path: string,
    new_path: string,
    a_mode: string,
    b_mode: string,
    new_file: boolean,
    renamed_file: boolean,
    deleted_file: boolean,
    diff: string
}