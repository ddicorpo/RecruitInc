export interface ISourceFiles {
  filename: string;
  //Path in the repository, not complete path
  repoFilePath: string;
  //Contents of the file
  fileContents: string;
}
