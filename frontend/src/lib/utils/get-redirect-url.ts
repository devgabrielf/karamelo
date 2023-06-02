export const getRedirectUrl = (path: string) => String(new URLSearchParams({ redirect: path }));
