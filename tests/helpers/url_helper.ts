import { valid_urls_data } from "../test_data/urls_data";

export function makeFullUrl(baseUrl: string, page: string, params?: Record<string, string>): string {
    // console.log("BASE URL: ", baseUrl, "PAGE: ", page, "PARAMS: ", params);
    const find_url = valid_urls_data.find(el=>el.page === page);
    if (!find_url) throw new Error(`Page '${page}' not found in valid_urls_data`);
    const url = `${baseUrl}${find_url?.url || ''}`;
    if (params) {
        const queryString = Object.entries(params)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
            .join('&');
        return `${url}?${queryString}`;
    }
    return url;
}