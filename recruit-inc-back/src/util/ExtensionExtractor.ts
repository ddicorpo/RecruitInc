export class ExtensionExtractor {
  static extract(path: string): string {
    // https://stackoverflow.com/questions/423376/how-to-get-the-file-name-from-a-full-path-using-javascript
    return path.split('.').pop();
  }
}
