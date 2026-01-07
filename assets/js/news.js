/**
 * Bloomberg-Style News Aggregator - Unified Feed
 * Consolidates all news sources into a single, curated timeline
 * 
 * FEATURES:
 * - Local caching to prevent rate limiting (10-minute cache)
 * - RSSHub JSON Feed support (easier parsing than XML)
 * - Optimized for direct API requests
 * - 47 NewsNow API sources + 14 RSSHub feeds = 61 total sources
 * 
 * RSSHub Benefits:
 * - JSON format (much easier to parse than XML)
 * - Wide variety of sources
 * - Well-maintained service
 * - Format: https://rsshub.app/{route}?format=json
 */

document.addEventListener('DOMContentLoaded', () => {
    const feedItems = document.getElementById('feed-items');
    const feedSkeleton = document.getElementById('feed-skeleton');
    const itemCount = document.getElementById('item-count');
    const sourceFilter = document.getElementById('source-filter');
    const refreshBtn = document.getElementById('refresh-all');
    const searchInput = document.getElementById('news-search');

    let allNews = [];
    let filteredNews = [];
    let activeSourceFilter = 'all';
    let searchQuery = '';
    let successfulSources = new Set(); // Track which sources successfully fetched data

    // Cache configuration
    const CACHE_PREFIX = 'news_cache_';
    const CACHE_TIMESTAMP_PREFIX = 'news_cache_ts_';
    const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes cache (prevents rate limiting)

    /**
     * CORS EXPLANATION:
     * 
     * When you access newsnow.busiyi.world directly from a browser and it works,
     * it means the API allows CORS (Cross-Origin Resource Sharing).
     * 
     * CORS is a browser security feature that blocks requests from one domain to another
     * UNLESS the server explicitly allows it via headers like:
     *   Access-Control-Allow-Origin: *
     * 
     * Since the API works directly, we prioritize direct requests (no proxy needed!).
     * Proxies are only used as fallback if direct requests fail.
     */
    const CORS_PROXIES = [
        null, // Direct request (for NewsNow API - allows CORS)
        "https://api.allorigins.win/raw?url=", // Fallback proxy 1
        "https://corsproxy.io/?" // Fallback proxy 2
    ];
    
    /**
     * RSSHub Proxy Configuration
     * 
     * IMPORTANT: RSSHub blocks direct browser requests (returns 403 CORS error)
     * We MUST use CORS proxies to access RSSHub feeds from the browser.
     * 
     * RSSHub's public instance (rsshub.app) doesn't allow CORS by default.
     * Solutions:
     * 1. Use CORS proxies (current approach) - proxies make server-to-server requests
     * 2. Deploy your own RSSHub instance with ALLOW_ORIGIN=* environment variable
     * 3. Use a backend proxy server
     */
    const RSSHUB_PROXIES = [
        "https://api.allorigins.win/raw?url=", // Primary proxy (usually works, wraps in .contents)
        "https://corsproxy.io/?", // Fallback proxy 1
        "https://api.codetabs.com/v1/proxy?quest=", // Fallback proxy 2 (5 req/sec limit)
    ];
    const AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE0OTIxOTgzIiwidHlwZSI6ImdpdGh1YiIsImV4cCI6MTc3MjkxNDg4MX0.zu9pUP1IE4sQYZGyNTOVIjpQEder_nk5PcunVdCUBco";

    // Complete list of all available sources
    const ALL_SOURCES = [
        "36kr-quick", "36kr-renqi", "baidu", "bilibili-hot-search", "cankaoxiaoxi",
        "chongbuluo-hot", "chongbuluo-latest", "cls-depth", "cls-hot", "cls-telegraph",
        "coolapk", "douban", "douyin", "fastbull-express", "fastbull-news", "freebuf",
        "gelonghui", "github-trending-today", "hackernews", "hupu", "ifeng",
        "iqiyi-hot-ranklist", "ithome", "jin10", "juejin", "kaopu", "mktnews-flash",
        "nowcoder", "pcbeta-windows11", "producthunt", "qqvideo-tv-hotsearch", "solidot",
        "sputniknewscn", "sspai", "steam", "tencent-hot", "thepaper", "tieba",
        "toutiao", "v2ex-share", "wallstreetcn-hot", "wallstreetcn-news", "wallstreetcn-quick",
        "weibo", "xueqiu-hotstock", "zaobao", "zhihu"
    ];

    /**
     * RSSHub Feed Sources
     * RSSHub provides RSS feeds in JSON format (much easier to parse!)
     * Format: https://rsshub.app/{route}?format=json
     * 
     * Comprehensive list of RSSHub routes that complement NewsNow API sources
     * Source: https://github.com/DIYgod/RSSHub/tree/master/lib/routes
     * Docs: https://docs.rsshub.app/
     */
    const RSS_FEEDS = {
        // ========== Chinese Platforms (RSSHub) ==========
        "zhihu-hot-rsshub": {
            url: "https://rsshub.app/zhihu/hot?format=json",
            name: "知乎热榜",
            category: "Social",
            icon: "知",
            color: "#0084ff"
        },
        "zhihu-daily-rsshub": {
            url: "https://rsshub.app/zhihu/daily?format=json",
            name: "知乎日报",
            category: "Social",
            icon: "知",
            color: "#0084ff"
        },
        "weibo-hot-rsshub": {
            url: "https://rsshub.app/weibo/search/hot?format=json",
            name: "微博热搜",
            category: "Social",
            icon: "微",
            color: "#e6162d"
        },
        "bilibili-hot-rsshub": {
            url: "https://rsshub.app/bilibili/ranking/0/0/1/1?format=json",
            name: "B站热门",
            category: "Entertainment",
            icon: "B",
            color: "#fb7299"
        },
        "douban-movie-rsshub": {
            url: "https://rsshub.app/douban/movie/playing?format=json",
            name: "豆瓣电影",
            category: "Entertainment",
            icon: "豆",
            color: "#007722"
        },
        
        // ========== Tech & Development (RSSHub) ==========
        "github-trending-rsshub": {
            url: "https://rsshub.app/github/trending/daily?format=json",
            name: "GitHub Trending",
            category: "Tech",
            icon: "GH",
            color: "#24292e"
        },
        "hackernews-rsshub": {
            url: "https://rsshub.app/hackernews/frontpage?format=json",
            name: "Hacker News",
            category: "Tech",
            icon: "HN",
            color: "#ff6600"
        },
        "reddit-programming": {
            url: "https://rsshub.app/reddit/r/programming?format=json",
            name: "Reddit Programming",
            category: "Tech",
            icon: "RD",
            color: "#ff4500"
        },
        "reddit-technology": {
            url: "https://rsshub.app/reddit/r/technology?format=json",
            name: "Reddit Technology",
            category: "Tech",
            icon: "RD",
            color: "#ff4500"
        },
        "reddit-webdev": {
            url: "https://rsshub.app/reddit/r/webdev?format=json",
            name: "Reddit WebDev",
            category: "Tech",
            icon: "RD",
            color: "#ff4500"
        },
        "producthunt-rsshub": {
            url: "https://rsshub.app/producthunt/today?format=json",
            name: "Product Hunt",
            category: "Tech",
            icon: "PH",
            color: "#da552f"
        },
        "lobsters": {
            url: "https://rsshub.app/lobsters?format=json",
            name: "Lobsters",
            category: "Tech",
            icon: "LB",
            color: "#cc0000"
        },
        "devto": {
            url: "https://rsshub.app/dev.to/top?format=json",
            name: "DEV Community",
            category: "Tech",
            icon: "DEV",
            color: "#0a0a0a"
        },
        "v2ex-rsshub": {
            url: "https://rsshub.app/v2ex/topics/latest?format=json",
            name: "V2EX 最新",
            category: "Tech",
            icon: "V2",
            color: "#194739"
        },
        
        // ========== Tech News Sites (RSSHub) ==========
        "techcrunch-rsshub": {
            url: "https://rsshub.app/techcrunch?format=json",
            name: "TechCrunch",
            category: "Tech",
            icon: "TC",
            color: "#ff6600"
        },
        "the-verge-rsshub": {
            url: "https://rsshub.app/theverge?format=json",
            name: "The Verge",
            category: "Tech",
            icon: "VG",
            color: "#000000"
        },
        "ars-technica-rsshub": {
            url: "https://rsshub.app/arstechnica?format=json",
            name: "Ars Technica",
            category: "Tech",
            icon: "AT",
            color: "#ff4e00"
        },
        "wired-rsshub": {
            url: "https://rsshub.app/wired?format=json",
            name: "Wired",
            category: "Tech",
            icon: "WD",
            color: "#000000"
        },
        "gizmodo-rsshub": {
            url: "https://rsshub.app/gizmodo?format=json",
            name: "Gizmodo",
            category: "Tech",
            icon: "GZ",
            color: "#000000"
        },
        "engadget-rsshub": {
            url: "https://rsshub.app/engadget?format=json",
            name: "Engadget",
            category: "Tech",
            icon: "EG",
            color: "#00bdf6"
        },
        
        // ========== Major News Sources (RSSHub) ==========
        "bbc-tech-rsshub": {
            url: "https://rsshub.app/bbc/tech?format=json",
            name: "BBC Technology",
            category: "News",
            icon: "BBC",
            color: "#bb1919"
        },
        "bbc-news-rsshub": {
            url: "https://rsshub.app/bbc?format=json",
            name: "BBC News",
            category: "News",
            icon: "BBC",
            color: "#bb1919"
        },
        "cnn-rsshub": {
            url: "https://rsshub.app/cnn?format=json",
            name: "CNN",
            category: "News",
            icon: "CNN",
            color: "#cc0000"
        },
        "reuters-tech-rsshub": {
            url: "https://rsshub.app/reuters/technology?format=json",
            name: "Reuters Technology",
            category: "News",
            icon: "RT",
            color: "#ff0000"
        },
        "reuters-world-rsshub": {
            url: "https://rsshub.app/reuters/world?format=json",
            name: "Reuters World",
            category: "News",
            icon: "RT",
            color: "#ff0000"
        },
        "theguardian-tech-rsshub": {
            url: "https://rsshub.app/theguardian/technology?format=json",
            name: "The Guardian Tech",
            category: "News",
            icon: "TG",
            color: "#052962"
        },
        "nytimes-tech-rsshub": {
            url: "https://rsshub.app/nytimes/technology?format=json",
            name: "NYTimes Technology",
            category: "News",
            icon: "NYT",
            color: "#000000"
        },
        
        // ========== Finance & Business (RSSHub) ==========
        "bloomberg-rsshub": {
            url: "https://rsshub.app/bloomberg?format=json",
            name: "Bloomberg",
            category: "Finance",
            icon: "BB",
            color: "#000000"
        },
        "ft-rsshub": {
            url: "https://rsshub.app/ft?format=json",
            name: "Financial Times",
            category: "Finance",
            icon: "FT",
            color: "#fff1e5"
        },
        "cnbc-rsshub": {
            url: "https://rsshub.app/cnbc?format=json",
            name: "CNBC",
            category: "Finance",
            icon: "CNBC",
            color: "#000000"
        },
        "forbes-rsshub": {
            url: "https://rsshub.app/forbes?format=json",
            name: "Forbes",
            category: "Finance",
            icon: "FB",
            color: "#000000"
        },
        "wsj-rsshub": {
            url: "https://rsshub.app/wsj?format=json",
            name: "Wall Street Journal",
            category: "Finance",
            icon: "WSJ",
            color: "#000000"
        }
    };

    // Source metadata with categories
    const SOURCE_METADATA = {
        // Tech & Development
        "hackernews": { name: "Hacker News", category: "Tech", icon: "HN", color: "#ff6600" },
        "github-trending-today": { name: "GitHub Trends", category: "Tech", icon: "GH", color: "#24292e" },
        "producthunt": { name: "Product Hunt", category: "Tech", icon: "PH", color: "#da552f" },
        "juejin": { name: "掘金", category: "Tech", icon: "掘", color: "#1e80ff" },
        "v2ex-share": { name: "V2EX", category: "Tech", icon: "V2", color: "#194739" },
        "sspai": { name: "少数派", category: "Tech", icon: "SS", color: "#d7191a" },
        "freebuf": { name: "FreeBuf", category: "Security", icon: "FB", color: "#00a0e9" },
        "ithome": { name: "IT之家", category: "Tech", icon: "IT", color: "#d81e06" },
        "solidot": { name: "Solidot", category: "Tech", icon: "SD", color: "#0066cc" },
        "nowcoder": { name: "牛客网", category: "Tech", icon: "NC", color: "#ff6b6b" },
        
        // Social & Entertainment
        "zhihu": { name: "知乎", category: "Social", icon: "知", color: "#0084ff" },
        "weibo": { name: "微博", category: "Social", icon: "微", color: "#e6162d" },
        "douyin": { name: "抖音", category: "Entertainment", icon: "抖", color: "#000000" },
        "bilibili-hot-search": { name: "B站", category: "Entertainment", icon: "B", color: "#fb7299" },
        "douban": { name: "豆瓣", category: "Social", icon: "豆", color: "#007722" },
        "tieba": { name: "贴吧", category: "Social", icon: "贴", color: "#3385ff" },
        "hupu": { name: "虎扑", category: "Sports", icon: "虎", color: "#ff6600" },
        "coolapk": { name: "酷安", category: "Tech", icon: "酷", color: "#00a862" },
        
        // Finance & Business
        "wallstreetcn-hot": { name: "华尔街见闻", category: "Finance", icon: "WS", color: "#c41e3a" },
        "wallstreetcn-news": { name: "华尔街见闻", category: "Finance", icon: "WS", color: "#c41e3a" },
        "wallstreetcn-quick": { name: "华尔街见闻", category: "Finance", icon: "WS", color: "#c41e3a" },
        "jin10": { name: "金十数据", category: "Finance", icon: "金", color: "#ff6b35" },
        "xueqiu-hotstock": { name: "雪球", category: "Finance", icon: "雪", color: "#1e88e5" },
        "gelonghui": { name: "格隆汇", category: "Finance", icon: "格", color: "#1890ff" },
        "fastbull-express": { name: "FastBull", category: "Finance", icon: "FB", color: "#ff4757" },
        "fastbull-news": { name: "FastBull", category: "Finance", icon: "FB", color: "#ff4757" },
        "mktnews-flash": { name: "Market News", category: "Finance", icon: "MN", color: "#2ed573" },
        
        // News & Media
        "36kr-quick": { name: "36氪快讯", category: "News", icon: "36", color: "#36a3f7" },
        "36kr-renqi": { name: "36氪", category: "News", icon: "36", color: "#36a3f7" },
        "thepaper": { name: "澎湃新闻", category: "News", icon: "澎", color: "#d81e06" },
        "ifeng": { name: "凤凰网", category: "News", icon: "凤", color: "#ff6600" },
        "cankaoxiaoxi": { name: "参考消息", category: "News", icon: "参", color: "#1e88e5" },
        "zaobao": { name: "联合早报", category: "News", icon: "早", color: "#0066cc" },
        "sputniknewscn": { name: "卫星通讯社", category: "News", icon: "卫", color: "#ff0000" },
        "toutiao": { name: "今日头条", category: "News", icon: "头", color: "#ff6600" },
        "tencent-hot": { name: "腾讯新闻", category: "News", icon: "腾", color: "#12b7f5" },
        "baidu": { name: "百度", category: "News", icon: "度", color: "#2932e1" },
        
        // Specialized
        "cls-depth": { name: "财联社深度", category: "Finance", icon: "财", color: "#ff6b35" },
        "cls-hot": { name: "财联社热点", category: "Finance", icon: "财", color: "#ff6b35" },
        "cls-telegraph": { name: "财联社电报", category: "Finance", icon: "财", color: "#ff6b35" },
        "chongbuluo-hot": { name: "虫部落热门", category: "Tech", icon: "虫", color: "#00a862" },
        "chongbuluo-latest": { name: "虫部落最新", category: "Tech", icon: "虫", color: "#00a862" },
        "steam": { name: "Steam", category: "Gaming", icon: "ST", color: "#1b2838" },
        "iqiyi-hot-ranklist": { name: "爱奇艺", category: "Entertainment", icon: "爱", color: "#00a0e9" },
        "qqvideo-tv-hotsearch": { name: "腾讯视频", category: "Entertainment", icon: "腾", color: "#12b7f5" },
        "pcbeta-windows11": { name: "远景论坛", category: "Tech", icon: "远", color: "#0066cc" },
        "kaopu": { name: "靠谱", category: "News", icon: "靠", color: "#ff6600" }
    };

    /**
     * CACHE MANAGEMENT
     * Prevents rate limiting by caching API responses locally
     */
    function getCache(sourceId) {
        try {
            const cached = localStorage.getItem(CACHE_PREFIX + sourceId);
            const timestamp = localStorage.getItem(CACHE_TIMESTAMP_PREFIX + sourceId);
            
            if (!cached || !timestamp) return null;
            
            const age = Date.now() - parseInt(timestamp);
            if (age > CACHE_DURATION) {
                // Cache expired
                localStorage.removeItem(CACHE_PREFIX + sourceId);
                localStorage.removeItem(CACHE_TIMESTAMP_PREFIX + sourceId);
                return null;
            }
            
            return JSON.parse(cached);
        } catch (e) {
            console.warn(`Cache read error for ${sourceId}:`, e);
            return null;
        }
    }

    function setCache(sourceId, data) {
        try {
            localStorage.setItem(CACHE_PREFIX + sourceId, JSON.stringify(data));
            localStorage.setItem(CACHE_TIMESTAMP_PREFIX + sourceId, Date.now().toString());
        } catch (e) {
            console.warn(`Cache write error for ${sourceId}:`, e);
            // If storage is full, clear old caches
            if (e.name === 'QuotaExceededError') {
                clearOldCaches();
            }
        }
    }

    function clearCache(sourceId) {
        localStorage.removeItem(CACHE_PREFIX + sourceId);
        localStorage.removeItem(CACHE_TIMESTAMP_PREFIX + sourceId);
    }

    function clearOldCaches() {
        // Clear caches older than 1 hour
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(CACHE_TIMESTAMP_PREFIX)) {
                const timestamp = parseInt(localStorage.getItem(key));
                if (timestamp && timestamp < oneHourAgo) {
                    const sourceId = key.replace(CACHE_TIMESTAMP_PREFIX, '');
                    clearCache(sourceId);
                }
            }
        }
    }

    /**
     * Get source metadata
     */
    function getSourceMeta(sourceId) {
        // Check RSS feeds first
        if (RSS_FEEDS[sourceId]) {
            return RSS_FEEDS[sourceId];
        }
        return SOURCE_METADATA[sourceId] || {
            name: sourceId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            category: "General",
            icon: sourceId.substring(0, 2).toUpperCase(),
            color: "#666666"
        };
    }

    /**
     * Parse RSS Feed (RSSHub JSON Format)
     * RSSHub provides JSON Feed format which is much easier to parse than XML
     * JSON Feed spec: https://jsonfeed.org/version/1
     */
    async function parseRSSFeed(feedUrl, sourceId, forceRefresh = false) {
        try {
            // Check cache first
            if (!forceRefresh) {
                const cached = getCache(sourceId);
                if (cached) {
                    console.log(`📦 ${sourceId}: Using cached RSS data`);
                    return cached;
                }
            }

            // RSSHub URLs should already have ?format=json, but ensure it
            const jsonFeedUrl = feedUrl.includes('format=json') 
                ? feedUrl 
                : feedUrl + (feedUrl.includes('?') ? '&' : '?') + 'format=json';

            // RSSHub blocks direct browser requests (403 CORS error)
            // Always use proxies for RSSHub feeds
            let proxy = null;
            
            // Try each RSSHub proxy (don't try direct - RSSHub blocks it)
            for (let proxyIndex = 0; proxyIndex < RSSHUB_PROXIES.length; proxyIndex++) {
                proxy = RSSHUB_PROXIES[proxyIndex];
                try {
                    const finalUrl = `${proxy}${encodeURIComponent(jsonFeedUrl)}`;
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 15000); // Longer timeout for proxies
                    
                    // Build fetch options based on proxy type
                    const fetchOptions = {
                        signal: controller.signal,
                        headers: { 
                            'Accept': 'application/json, application/feed+json'
                        }
                    };
                    
                    // Some proxies need different headers
                    if (proxy.includes('allorigins')) {
                        // allorigins.win works with default headers
                    } else if (proxy.includes('corsproxy.io')) {
                        // corsproxy.io might need referer
                        fetchOptions.headers['Referer'] = 'https://rsshub.app/';
                    } else if (proxy.includes('codetabs')) {
                        // codetabs might need different format
                        fetchOptions.headers['User-Agent'] = 'Mozilla/5.0';
                    }
                    
                    const response = await fetch(finalUrl, fetchOptions);
                    
                    clearTimeout(timeoutId);

                    if (!response.ok) {
                        // 403 means RSSHub or proxy blocked the request
                        if (response.status === 403) {
                            const proxyName = proxy.includes('allorigins') ? 'allorigins' 
                                            : proxy.includes('codetabs') ? 'codetabs' 
                                            : proxy.includes('cors-anywhere') ? 'cors-anywhere'
                                            : 'corsproxy';
                            console.warn(`RSS ${sourceId}: 403 from ${proxyName} proxy - trying next`);
                            if (proxyIndex < RSSHUB_PROXIES.length - 1) continue;
                            throw new Error(`HTTP 403: All proxies blocked (RSSHub CORS issue)`);
                        }
                        if (proxyIndex < RSSHUB_PROXIES.length - 1) continue;
                        throw new Error(`HTTP ${response.status}`);
                    }

                    // Parse JSON Feed (much simpler than XML!)
                    // Handle different proxy response formats
                    let jsonData;
                    try {
                        const responseText = await response.text();
                        
                        // Try parsing as direct JSON first
                        jsonData = JSON.parse(responseText);
                        
                        // allorigins.win wraps responses in { contents: "..." }
                        if (jsonData.contents) {
                            try {
                                jsonData = JSON.parse(jsonData.contents);
                            } catch (e) {
                                // If contents is not JSON, it might be HTML error page
                                console.warn(`RSS ${sourceId}: Proxy returned non-JSON contents`);
                                if (proxyIndex < RSSHUB_PROXIES.length - 1) continue;
                                throw new Error('Proxy returned invalid response');
                            }
                        }
                        
                        // Some proxies might return error objects
                        if (jsonData.error || jsonData.status === 'error') {
                            throw new Error(jsonData.error || jsonData.message || 'Proxy error');
                        }
                    } catch (parseError) {
                        console.error(`RSS ${sourceId}: JSON parse error`, parseError.message);
                        if (proxyIndex < RSSHUB_PROXIES.length - 1) continue;
                        throw new Error(`Invalid JSON: ${parseError.message}`);
                    }

                    // JSON Feed format: { version, title, items: [{ id, title, url, date_published, ... }] }
                    if (!jsonData || !jsonData.items || !Array.isArray(jsonData.items)) {
                        throw new Error('Invalid JSON Feed format');
                    }

                    const meta = getSourceMeta(sourceId);
                    const processed = [];

                    jsonData.items.slice(0, 20).forEach((item, index) => {
                        const title = item.title || '';
                        const link = item.url || item.link || item.id || '#';
                        const datePublished = item.date_published || item.pubDate || item.published;
                        const description = item.content_html || item.content_text || item.summary || '';

                        if (title && title.trim()) {
                            // Parse date (ISO 8601 format)
                            const timestamp = datePublished 
                                ? new Date(datePublished).getTime() 
                                : Date.now();
                            
                            processed.push({
                                id: `rss-${sourceId}-${item.id || index}`,
                                sourceId: sourceId,
                                sourceName: meta.name,
                                sourceCategory: meta.category,
                                sourceIcon: meta.icon,
                                sourceColor: meta.color,
                                title: title.trim(),
                                link: link.trim(),
                                heat: timeAgo(timestamp),
                                timestamp: timestamp,
                                description: description.trim()
                            });
                        }
                    });

                    // Cache the result
                    if (processed.length > 0) {
                        setCache(sourceId, processed);
                        const proxyName = proxy.includes('allorigins') ? 'allorigins' 
                                        : proxy.includes('codetabs') ? 'codetabs' 
                                        : 'corsproxy';
                        console.log(`✓ ${sourceId}: ${processed.length} RSS items (via ${proxyName} proxy, JSON Feed)`);
                    }

                    return processed;
                } catch (e) {
                    if (proxyIndex === RSSHUB_PROXIES.length - 1) {
                        // Last proxy failed
                        if (e.message?.includes('403') || e.message?.includes('CORS')) {
                            console.error(`RSS ${sourceId}: CORS blocked by RSSHub (all proxies failed)`);
                        } else {
                            console.error(`RSS ${sourceId}: Error`, e.message);
                        }
                        return [];
                    }
                    continue; // Try next proxy
                }
            }
        } catch (e) {
            console.error(`RSS ${sourceId}: Failed`, e);
        }
        return [];
    }

    /**
     * Update fetch status display
     */
    function updateFetchStatus(current, total, success, failed, fromCache = 0) {
        const statusEl = document.getElementById('fetch-status');
        if (statusEl) {
            if (current < total) {
                const cacheInfo = fromCache > 0 ? ` (${fromCache}📦 cached)` : '';
                statusEl.textContent = `Fetching ${current}/${total}... (${success}✓ ${failed}✗)${cacheInfo}`;
                statusEl.style.display = 'inline-block';
            } else {
                const cacheInfo = fromCache > 0 ? ` (${fromCache} from cache)` : '';
                statusEl.textContent = `Complete: ${success} sources, ${allNews.length} items${cacheInfo}`;
                setTimeout(() => {
                    statusEl.style.display = 'none';
                }, 3000);
            }
        }
    }

    /**
     * Fetch all news sources - Bloomberg style unified feed
     * Now includes RSS feeds and caching
     */
    async function fetchAllNews(forceRefresh = false) {
        showLoading(true);
        allNews = [];
        successfulSources.clear();

        // Combine NewsNow sources and RSS feeds
        const sourcesToFetch = ALL_SOURCES;
        const rssFeedsToFetch = Object.keys(RSS_FEEDS);
        const totalSources = sourcesToFetch.length + rssFeedsToFetch.length;

        console.log(`🚀 Fetching ${totalSources} sources (${sourcesToFetch.length} NewsNow API + ${rssFeedsToFetch.length} RSSHub JSON) with caching...`);

        let successCount = 0;
        let failCount = 0;
        let processedCount = 0;
        let cacheHitCount = 0;

        // Fetch NewsNow API sources
        const batchSize = 8;
        for (let i = 0; i < sourcesToFetch.length; i += batchSize) {
            const batch = sourcesToFetch.slice(i, i + batchSize);
            const promises = batch.map(async (id) => {
                // Check if cached before fetching
                const wasCached = !forceRefresh && getCache(id) !== null;
                const result = await fetchNewsNowSource(id, forceRefresh);
                return { id, result, wasCached };
            });
            const results = await Promise.allSettled(promises);
            
            results.forEach((settledResult, idx) => {
                processedCount++;
                if (settledResult.status === 'fulfilled') {
                    const { result: data, wasCached } = settledResult.value;
                    if (wasCached) cacheHitCount++;
                    
                    if (data && Array.isArray(data)) {
                        const items = data.filter(item => item && item.title);
                        if (items.length > 0) {
                            allNews.push(...items);
                            successCount++;
                            successfulSources.add(batch[idx]);
                        } else {
                            failCount++;
                            console.warn(`⚠️ No items from ${batch[idx]}`);
                        }
                    } else {
                        failCount++;
                    }
                } else {
                    failCount++;
                }
                updateFetchStatus(processedCount, totalSources, successCount, failCount, cacheHitCount);
            });
            
            if (i + batchSize < sourcesToFetch.length) {
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }

        // Fetch RSS feeds
        for (const feedId of rssFeedsToFetch) {
            processedCount++;
            try {
                const wasCached = !forceRefresh && getCache(feedId) !== null;
                if (wasCached) cacheHitCount++;
                
                const feed = RSS_FEEDS[feedId];
                const items = await parseRSSFeed(feed.url, feedId, forceRefresh);
                if (items && items.length > 0) {
                    allNews.push(...items);
                    successCount++;
                    successfulSources.add(feedId);
                } else {
                    failCount++;
                }
            } catch (e) {
                failCount++;
                console.error(`RSS ${feedId}:`, e);
            }
            updateFetchStatus(processedCount, totalSources, successCount, failCount, cacheHitCount);
        }

        console.log(`✅ Fetch complete: ${successCount} sources succeeded, ${failCount} failed, ${allNews.length} total items`);

        // Sort by timestamp (newest first)
        allNews.sort((a, b) => b.timestamp - a.timestamp);

        updateSourceFilter();
        applyFilters();
        updateSubtitle();
        showLoading(false);
    }

    /**
     * Update subtitle with successful source count
     */
    function updateSubtitle() {
        const subtitle = document.querySelector('.feed-subtitle');
        if (subtitle) {
            const successfulCount = successfulSources.size;
            const totalCount = ALL_SOURCES.length + Object.keys(RSS_FEEDS).length;
            subtitle.textContent = `Unified feed from ${successfulCount} of ${totalCount} sources (${ALL_SOURCES.length} API + ${Object.keys(RSS_FEEDS).length} RSSHub)`;
        }
    }

    /**
     * Fetch NewsNow Source with caching and retry
     * Returns { data, fromCache } to track cache hits
     */
    async function fetchNewsNowSource(id, forceRefresh = false, retryCount = 0) {
        // Check cache first (unless forcing refresh)
        if (!forceRefresh) {
            const cached = getCache(id);
            if (cached) {
                console.log(`📦 ${id}: Using cached data (${cached.length} items)`);
                return cached; // Return cached data directly
            }
        } else {
            clearCache(id);
        }

        const maxRetries = 2;
        let apiTarget = `https://newsnow.busiyi.world/api/s?id=${id}`;
        if (forceRefresh) {
            apiTarget += '&latest';
        }

        // Try each proxy in order (direct first, then fallbacks)
        for (let proxyIndex = 0; proxyIndex < CORS_PROXIES.length; proxyIndex++) {
            const proxy = CORS_PROXIES[proxyIndex];
            try {
                const url = proxy ? `${proxy}${encodeURIComponent(apiTarget)}` : apiTarget;
                
                const controller = new AbortController();
                const timeout = proxy ? 20000 : 8000;
                const timeoutId = setTimeout(() => controller.abort(), timeout);
                
                const fetchOptions = {
                    signal: controller.signal,
                    headers: { 'Accept': 'application/json' }
                };

                if (!proxy && AUTH_TOKEN) {
                    fetchOptions.headers['Authorization'] = AUTH_TOKEN;
                }

                let finalUrl = url;
                if (proxy && proxy.includes('corsproxy.io')) {
                    const refererParam = encodeURIComponent('https://newsnow.busiyi.world/');
                    finalUrl = `${url}&referer=${refererParam}`;
                } else if (!proxy) {
                    try {
                        fetchOptions.headers['Referer'] = 'https://newsnow.busiyi.world/';
                        fetchOptions.headers['Origin'] = 'https://newsnow.busiyi.world';
                    } catch (e) {}
                }
                
                const response = await fetch(finalUrl, fetchOptions);
                clearTimeout(timeoutId);

                if (!response.ok) {
                    if (proxyIndex < CORS_PROXIES.length - 1) continue;
                    console.warn(`Source ${id}: HTTP ${response.status}`);
                    return [];
                }

                const data = await response.json();

                if (!data || data.error) {
                    if (proxyIndex < CORS_PROXIES.length - 1) continue;
                    return [];
                }

                if (data && data.items && Array.isArray(data.items)) {
                    const meta = getSourceMeta(id);
                    const processed = data.items.slice(0, 20).map(item => {
                        const getString = (val, fallback = '') => {
                            if (!val) return fallback;
                            if (typeof val === 'string') return val.trim();
                            if (typeof val === 'object') {
                                return val.text || val.title || val.name || JSON.stringify(val).substring(0, 50) || fallback;
                            }
                            return String(val).trim();
                        };

                        const title = getString(item.title, 'Untitled');
                        const link = getString(item.url || item.link, '#');
                        const heat = item.extra ? getString(item.extra) : (item.timestamp ? timeAgo(item.timestamp * 1000) : "");
                        
                        return {
                            id: `nn-${id}-${item.id || Math.random()}`,
                            sourceId: id,
                            sourceName: meta.name,
                            sourceCategory: meta.category,
                            sourceIcon: meta.icon,
                            sourceColor: meta.color,
                            title: title,
                            link: link,
                            heat: heat,
                            timestamp: item.timestamp ? (typeof item.timestamp === 'number' ? item.timestamp * 1000 : new Date(item.timestamp).getTime()) : Date.now()
                        };
                    }).filter(item => item.title && item.title !== 'Untitled' && item.title.length > 0);
                    
                    // Cache the result
                    if (processed.length > 0) {
                        setCache(id, processed);
                        const proxyName = proxy ? (proxy.includes('allorigins') ? 'allorigins' : 'corsproxy') : 'direct';
                        console.log(`✓ ${id}: ${processed.length} items (via ${proxyName})`);
                    }
                    
                    return processed;
                }
            } catch (e) {
                if (proxyIndex === CORS_PROXIES.length - 1) {
                    if (e.name === 'AbortError') {
                        if (retryCount < maxRetries) {
                            const delay = Math.pow(2, retryCount) * 1000;
                            await new Promise(resolve => setTimeout(resolve, delay));
                            return fetchNewsNowSource(id, forceRefresh, retryCount + 1);
                        }
                        console.warn(`Source ${id}: Request timeout`);
                    } else {
                        console.error(`Source ${id}: Error - ${e.message}`);
                    }
                    return [];
                }
                continue;
            }
        }
        
        return [];
    }

    /**
     * Update source filter dropdown
     */
    function updateSourceFilter() {
        if (!sourceFilter) return;
        
        const categories = [...new Set(allNews.map(n => n.sourceCategory))].sort();
        const sources = [...new Set(allNews.map(n => n.sourceId))].sort();
        const successfulSourceCount = successfulSources.size;
        
        sourceFilter.innerHTML = `
            <option value="all">All Sources (${successfulSourceCount} sources, ${allNews.length} items)</option>
            ${categories.map(cat => {
                const sourceIds = new Set(allNews.filter(n => n.sourceCategory === cat).map(n => n.sourceId));
                const sourceCount = sourceIds.size;
                const itemCount = allNews.filter(n => n.sourceCategory === cat).length;
                return `<option value="cat:${cat}">${cat} (${sourceCount} sources, ${itemCount} items)</option>`;
            }).join('')}
            <optgroup label="Sources">
                ${sources.map(id => {
                    const meta = getSourceMeta(id);
                    const itemCount = allNews.filter(n => n.sourceId === id).length;
                    return `<option value="src:${id}">${meta.name} (${itemCount} items)</option>`;
                }).join('')}
            </optgroup>
        `;
    }

    /**
     * Apply filters and render unified feed
     */
    function applyFilters() {
        if (activeSourceFilter === 'all') {
            filteredNews = allNews;
        } else if (activeSourceFilter.startsWith('cat:')) {
            const category = activeSourceFilter.replace('cat:', '');
            filteredNews = allNews.filter(n => n.sourceCategory === category);
        } else if (activeSourceFilter.startsWith('src:')) {
            const sourceId = activeSourceFilter.replace('src:', '');
            filteredNews = allNews.filter(n => n.sourceId === sourceId);
        } else {
            filteredNews = allNews;
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filteredNews = filteredNews.filter(n => 
                n.title.toLowerCase().includes(query) ||
                n.sourceName.toLowerCase().includes(query)
            );
        }

        renderUnifiedFeed();
    }

    /**
     * Render Bloomberg-style unified timeline
     */
    function renderUnifiedFeed() {
        feedItems.innerHTML = '';

        if (filteredNews.length === 0) {
            feedItems.innerHTML = `
                <div class="empty-state">
                    <p>No news found. Try adjusting your filters.</p>
                </div>
            `;
            itemCount.textContent = '0 items';
            return;
        }

        const now = Date.now();
        const groups = {
            'Just Now': [],
            'Last Hour': [],
            'Today': [],
            'This Week': [],
            'Older': []
        };

        filteredNews.forEach(item => {
            const age = now - item.timestamp;
            if (age < 5 * 60 * 1000) {
                groups['Just Now'].push(item);
            } else if (age < 60 * 60 * 1000) {
                groups['Last Hour'].push(item);
            } else if (age < 24 * 60 * 60 * 1000) {
                groups['Today'].push(item);
            } else if (age < 7 * 24 * 60 * 60 * 1000) {
                groups['This Week'].push(item);
            } else {
                groups['Older'].push(item);
            }
        });

        Object.entries(groups).forEach(([period, items]) => {
            if (items.length === 0) return;

            const groupDiv = document.createElement('div');
            groupDiv.className = 'time-group';
            groupDiv.innerHTML = `
                <div class="time-group-header">
                    <span class="time-label">${period}</span>
                    <span class="time-count">${items.length} items</span>
                </div>
                <div class="time-group-items">
                    ${items.map(item => renderNewsItem(item)).join('')}
                </div>
            `;
            feedItems.appendChild(groupDiv);
        });

        const successfulCount = successfulSources.size;
        itemCount.textContent = `${successfulCount} sources • ${filteredNews.length} of ${allNews.length} items`;
    }

    /**
     * Render individual news item
     */
    function renderNewsItem(item) {
        const safeString = (val, fallback = '') => {
            if (!val) return fallback;
            if (typeof val === 'string') return val;
            if (typeof val === 'object') {
                return val.text || val.title || val.name || String(val);
            }
            return String(val);
        };

        const escapeHtml = (text) => {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        };

        const timeStr = item.timestamp ? new Date(item.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }) : '--:--';

        const sourceIcon = safeString(item.sourceIcon, '?');
        const sourceName = escapeHtml(safeString(item.sourceName, 'Unknown'));
        const sourceCategory = escapeHtml(safeString(item.sourceCategory, 'General'));
        const sourceColor = safeString(item.sourceColor, '#666666');
        const title = escapeHtml(safeString(item.title, 'Untitled'));
        const link = safeString(item.link, '#');
        const heat = item.heat ? escapeHtml(safeString(item.heat)) : '';

        return `
            <article class="news-item" data-source="${item.sourceId || ''}">
                <div class="news-item-time">${timeStr}</div>
                <div class="news-item-content">
                    <div class="news-item-header">
                        <span class="news-source-badge" style="--source-color: ${sourceColor}">
                            ${sourceIcon}
                        </span>
                        <span class="news-source-name">${sourceName}</span>
                        <span class="news-category">${sourceCategory}</span>
                        ${heat ? `<span class="news-heat">${heat}</span>` : ''}
                    </div>
                    <h3 class="news-title">
                        <a href="${link}" target="_blank" rel="noopener noreferrer">
                            ${title}
                        </a>
                    </h3>
                </div>
            </article>
        `;
    }

    /**
     * Show/Hide Loading Skeleton
     */
    function showLoading(show) {
        if (show) {
            feedItems.style.display = 'none';
            if (feedSkeleton) feedSkeleton.style.display = 'grid';
        } else {
            if (feedSkeleton) feedSkeleton.style.display = 'none';
            feedItems.style.display = 'grid';
        }
    }

    function timeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        if (isNaN(seconds)) return "Just now";
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    }

    // Event Listeners
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => fetchAllNews(true));
    }

    if (sourceFilter) {
        sourceFilter.addEventListener('change', (e) => {
            activeSourceFilter = e.target.value;
            applyFilters();
        });
    }

    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchQuery = e.target.value;
                applyFilters();
            }, 300);
        });
    }

    // Start
    fetchAllNews();
    setInterval(() => fetchAllNews(true), 15 * 60 * 1000);
});
