export interface CustomError {
  code?: number;
  message?: string;
  stack?: string;
  humanReadableError?: HumanReadableError;
}

export interface HumanReadableError {
  humanReadableErrorGuid: string;
  humanReadableErrorVariables?: object;
}
