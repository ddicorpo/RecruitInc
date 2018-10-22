export class FilepathExtractor {

    static extract(path: string): string {
        // https://stackoverflow.com/questions/2187256/js-most-optimized-way-to-remove-a-filename-from-a-path-in-a-string
        return path.split("/").slice(0, -1).join("/")+"/";
    }
}
