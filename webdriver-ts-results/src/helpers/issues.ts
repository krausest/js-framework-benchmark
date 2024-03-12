enum Severity {
  NOTE,
  ERROR,
}

interface Issue {
  number: number;
  severity: Severity;
  text: string;
  link: string;
}

export const knownIssues: Issue[] = [
  {
    number: 634,
    severity: Severity.ERROR,
    text: "[Issue]: The HTML structure for the implementation is not fully correct.",
    link: "https://github.com/krausest/js-framework-benchmark/issues/634",
  },
  {
    number: 772,
    severity: Severity.NOTE,
    text: "[Note]: Implementation uses manual DOM manipulations",
    link: "https://github.com/krausest/js-framework-benchmark/issues/772",
  },
  {
    number: 796,
    severity: Severity.NOTE,
    text: "[Note]: Implementation uses explicit requestAnimationFrame calls",
    link: "https://github.com/krausest/js-framework-benchmark/issues/796",
  },
  {
    number: 800,
    severity: Severity.NOTE,
    text: "[Note]: View state on the model",
    link: "https://github.com/krausest/js-framework-benchmark/issues/800",
  },
  {
    number: 801,
    severity: Severity.NOTE,
    text: "[Note]: Implementation uses manual event delegation",
    link: "https://github.com/krausest/js-framework-benchmark/issues/801",
  },
  {
    number: 1139,
    severity: Severity.NOTE,
    text: "[Note]: Implementation uses runtime code generation",
    link: "https://github.com/krausest/js-framework-benchmark/issues/1139",
  },
  {
    number: 1261,
    severity: Severity.NOTE,
    text: "[Note]: Manual caching of (v)dom nodes",
    link: "https://github.com/krausest/js-framework-benchmark/issues/1261",
  },
];

export function findIssue(issueNumber: number): Issue | undefined {
  return knownIssues.find((issue) => issue.number === issueNumber);
}
