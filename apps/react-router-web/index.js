import "dotenv/config";
import * as fs from "node:fs";
import sourceMapSupport from "source-map-support";

sourceMapSupport.install({
  retrieveSourceMap: function (source) {
    // get source file without the `file://` prefix or `?t=...` suffix
    const match = source.match(/^file:\/\/(.*)\?t=[.\d]+$/);
    if (match) {
      return {
        url: source,
        map: fs.readFileSync(`${match[1]}.map`, "utf8"),
      };
    }
    return null;
  },
});

await import("./server");
