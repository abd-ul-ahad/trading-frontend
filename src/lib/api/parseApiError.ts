import { AxiosError } from 'axios';

export type FieldErrors = Record<string, string>;

export type ParsedApiError = {
  message: string;
  fieldErrors: FieldErrors;
};

type FastApiDetailItem = {
  loc?: (string | number)[];
  msg?: string;
};

function locToField(loc: (string | number)[] | undefined): string | null {
  if (!loc?.length) return null;
  const field = loc[loc.length - 1];
  return typeof field === 'string' ? field : null;
}

export function parseApiError(error: unknown): ParsedApiError {
  if (!(error instanceof AxiosError)) {
    return {
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      fieldErrors: {},
    };
  }

  const data = error.response?.data as
    | { detail?: FastApiDetailItem[] | string; message?: string }
    | undefined;

  const fieldErrors: FieldErrors = {};
  let message = data?.message ?? error.message ?? 'An error occurred';

  if (Array.isArray(data?.detail)) {
    for (const item of data.detail) {
      const field = locToField(item.loc);
      const msg = item.msg?.replace(/^Value error,\s*/i, '') ?? 'Invalid value';
      if (field) {
        fieldErrors[field] = msg;
      } else if (!message || message === error.message) {
        message = msg;
      }
    }
  } else if (typeof data?.detail === 'string') {
    message = data.detail;
  }

  return { message, fieldErrors };
}
