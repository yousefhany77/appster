export interface AlgoliaResponse {
  hits: Hit[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  facets: Facets;
  exhaustiveFacetsCount: boolean;
  exhaustiveNbHits: boolean;
  exhaustiveTypo: boolean;
  exhaustive: Exhaustive;
  query: string;
  params: string;
  index: string;
  serverUsed: string;
  indexUsed: string;
  parsedQuery: string;
  timeoutCounts: boolean;
  timeoutHits: boolean;
  explain: Explain;
  renderingContent: RenderingContent;
  processingTimeMS: number;
  processingTimingsMS: ProcessingTimingsMs;
  serverTimeMS: number;
}

export interface Hit {
  path: string;
  jobTitle: string;
  jobExperience: string;
  company: string;
  jobType: string;
  isRemote: string;
  country: string;
  city: string;
  skills: string[];
  lastmodified: number;
  objectID: string;
  _snippetResult: SnippetResult;
  _highlightResult: HighlightResult;
  _rankingInfo: RankingInfo;
}

export interface SnippetResult {
  path: Path;
  jobDescription?: JobDescription;
  jobTitle: JobTitle;
  skills: Skill[];
  lastmodified: Lastmodified;
}

export interface Path {
  value: string;
  matchLevel: string;
}

export interface JobDescription {
  value: string;
  matchLevel: string;
}

export interface JobTitle {
  value: string;
  matchLevel: string;
}

export interface Skill {
  value: string;
  matchLevel: string;
}

export interface Lastmodified {
  value: string;
  matchLevel: string;
}

export interface HighlightResult {
  jobTitle: JobTitle2;
  skills: Skill2[];
}

export interface JobTitle2 {
  value: string;
  matchLevel: string;
  matchedWords: any[];
}

export interface Skill2 {
  value: string;
  matchLevel: string;
  fullyHighlighted?: boolean;
  matchedWords: string[];
}

export interface RankingInfo {
  nbTypos: number;
  firstMatchedWord: number;
  proximityDistance: number;
  userScore: number;
  geoDistance: number;
  geoPrecision: number;
  nbExactWords: number;
  words: number;
  filters: number;
}

export interface Facets {
  skills: Skills;
}

export interface Skills {
  nextjs: number;
  nodejs: number;
  reactjs: number;
  "Next.js": number;
  Typescript: number;
  express: number;
  firebase: number;
  mongodb: number;
}

export interface Exhaustive {
  facetsCount: boolean;
  nbHits: boolean;
  typo: boolean;
}

export interface Explain {
  match: Match;
  params: Params;
}

export interface Match {
  alternatives: Alterna[];
}

export interface Alterna {
  types: string[];
  words: string[];
  typos: number;
  offset: number;
  length: number;
  seqExpr?: number;
}

export interface Params {
  client: Client;
  apiKey: ApiKey;
  abTest: AbTest;
  rules: Rules;
  final: Final;
}

export interface Client {
  query: string;
  analytics: boolean;
  page: number;
  hitsPerPage: number;
  attributesToRetrieve: string[];
  attributesToSnippet: string[];
  getRankingInfo: boolean;
  highlightPreTag: string;
  highlightPostTag: string;
  snippetEllipsisText: string;
  tagFilters: any[];
  facets: string[];
  maxValuesPerFacet: number;
  responseFields: string[];
  enableABTest: boolean;
  explain: boolean;
}

export interface ApiKey {}

export interface AbTest {}

export interface Rules {}

export interface Final {
  query: string;
  analytics: boolean;
  page: number;
  hitsPerPage: number;
  attributesToRetrieve: string[];
  attributesToSnippet: string[];
  getRankingInfo: boolean;
  highlightPreTag: string;
  highlightPostTag: string;
  snippetEllipsisText: string;
  tagFilters: any[];
  facets: string[];
  maxValuesPerFacet: number;
  responseFields: string[];
  enableABTest: boolean;
  explain: boolean;
}

export interface RenderingContent {}

export interface ProcessingTimingsMs {
  request: Request;
  total: number;
}

export interface Request {
  roundTrip: number;
}
