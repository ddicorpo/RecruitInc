/**
 * The file path shall include the file type example .java
 */
export interface ISingleFileCommit {
  filePath: string;
  lineAdded: number;
  lineDeleted: number;
}
