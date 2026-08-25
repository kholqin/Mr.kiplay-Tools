const cleanUrl = (value: string | undefined, fallback: string) => {
  const candidate = value?.trim() || fallback;
  try {
    const url = new URL(candidate);
    if (url.protocol !== "https:") return fallback;
    return url.toString().replace(/\/$/, "");
  } catch {
    return fallback;
  }
};

export const publicProviderConfig = {
  rdapBaseUrl: cleanUrl(process.env.RDAP_BASE_URL, "https://rdap.org"),
  certificateTransparencyUrl: cleanUrl(process.env.CT_BASE_URL, "https://crt.sh"),
  archiveUrl: cleanUrl(process.env.WAYBACK_BASE_URL, "https://web.archive.org"),
  githubApiUrl: cleanUrl(process.env.GITHUB_API_URL, "https://api.github.com"),
};
