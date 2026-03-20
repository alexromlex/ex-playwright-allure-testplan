export interface UrlData {
    page: string;
    url: string;
    method: string[];
}

export const valid_urls_data: UrlData[] = [
    {"page": "main", "url": "/", "method": ["GET"]},
    {"page": "services", "url": "/szolgaltatasok", "method": ["GET"]},
    {"page": "portfolio", "url": "/portfolio", "method": ["GET"]},
    {"page": "blog", "url": "/cikkek", "method": ["GET"]},
    {"page": "contact", "url": "/ajanlatkeres", "method": ["GET", "POST"]},
    // API
    {"page": "login", "url": "/api/login.php", "method": ["POST"]},
    {"page": "get_partners", "url": "/api/get_partners.php", "method": ["GET"]},
    {"page": "get_scode", "url": "/api/scode.php", "method": ["GET"]},
];