import { DataSource, Knowledge } from "@botpress/runtime";

const monkModeSource = DataSource.Website.fromUrls(
  ["https://illimitableman.wordpress.com/2014/04/13/monk-mode/"],
  { id: "monk_mode" }
);

export const LibraryKB = new Knowledge({
  name: "libraryKB",
  description: "Curated articles and essays for the library agent.",
  sources: [monkModeSource],
});
