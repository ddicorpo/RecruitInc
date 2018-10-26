/**
 * The file path shall include the file type example .java
 */
export interface IProjectStructure{
    // The file ID here corresponds to a hash of the file. Git api's should provide something that fits this description.
    // You can try the command git ls-tree -r HEAD on any repo. What we want in the fileID field corresponds to the hash.
    fileId: string,
    fileName: string,
    filePath: string
}
