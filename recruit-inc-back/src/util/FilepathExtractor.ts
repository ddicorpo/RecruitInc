export class FilepathExtractor {
  static extract(path: string): string {
    // https://stackoverflow.com/questions/2187256/js-most-optimized-way-to-remove-a-filename-from-a-path-in-a-string
    let processedPath: string =
      path
        .split('/')
        .slice(0, -1)
        .join('/') + '/';
    if (processedPath.charAt(0) === '/') {
      processedPath = processedPath.substring(1);
    }
    return processedPath;
  }
}
