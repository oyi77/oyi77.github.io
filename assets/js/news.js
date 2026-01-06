/**
 * Terminal News Aggregator Logic - v2.0 (NewsNow Integrated)
 * Fetches news from multiple sources and renders them in a cyberpunk feed.
 */

document.addEventListener('DOMContentLoaded', () => {
    const feedItems = document.getElementById('feed-items');
    const itemCount = document.getElementById('item-count');
    const sourceList = document.getElementById('source-list');
    const dynamicSourcesContainer = document.getElementById('dynamic-sources');
    const refreshBtn = document.getElementById('refresh-all');

    let allNews = [];
    let currentFilter = 'all';

    const CORS_PROXY = "https://api.allorigins.win/raw?url=";

    const SOURCES = {
        hn: { name: 'HACKER_NEWS', type: 'hn', url: 'https://hacker-news.firebaseio.com/v0/topstories.json', limit: 10 },
        crypto: { name: 'CRYPTO_PULSE', type: 'rss', url: 'https://cointelegraph.com/rss', limit: 8 },
        defillama: { name: 'DEFI_LLAMA', type: 'rss', url: 'https://medium.com/feed/defillama', limit: 5 },
        github: { name: 'GITHUB_BLOG', type: 'rss', url: 'https://github.blog/feed/', limit: 5 }
    };

    // NewsNow Sources mapping (ID -> Display Name)
    const NEWSNOW_SOURCES = {
        "hackernews": "HN_GLOBAL",
        "github-trending-today": "GITHUB_TRENDS",
        "producthunt": "PRODUCT_HUNT",
        "36kr-renqi": "36KR_TECH",
        "juejin": "JUEJIN_DEV",
        "sspai": "SSPAI_DIGITAL",
        "freebuf": "FREEBUF_SEC",
        "zhihu": "ZHIHU_HOT",
        "weibo": "WEIBO_TRENDS",
        "douyin": "DOUYIN_HOT",
        "bilibili-hot-search": "BILIBILI_HOT",
        "v2ex": "V2EX_TECH",
        "steam": "STEAM_GAMES",
        "it-home": "IT_HOME",
        "wallstreetcn-hot": "WALLSTREET_CN"
    };

    /**
     * Initialize dynamic NewsNow nodes in the sidebar
     */
    function initDynamicNodes() {
        Object.entries(NEWSNOW_SOURCES).forEach(([id, name]) => {
            const div = document.createElement('div');
            div.className = 'source-item';
            div.dataset.source = id;
            div.innerHTML = `
                <span class="source-icon">[#]</span>
                <span class="source-name">${name}</span>
            `;
            div.addEventListener('click', () => handleSourceClick(div, id));
            dynamicSourcesContainer.appendChild(div);
        });
    }

    /**
     * Handle source click (filter or load)
     */
    function handleSourceClick(element, id) {
        document.querySelectorAll('.source-item').forEach(i => i.classList.remove('active'));
        element.classList.add('active');
        currentFilter = id;
        renderFeed();
    }

    /**
     * Fetch all news sources
     */
    async function fetchAllNews() {
        showLoading(true);
        allNews = [];

        // Fetch static sources defined in SOURCES
        const staticPromises = Object.entries(SOURCES).map(([id, source]) => fetchNativeSource(id, source));

        // Fetch a couple of top NewsNow sources for the "All" view to keep it fast
        // We'll fetch more as needed or on filter
        const topNewsNow = ["hackernews", "github-trending-today", "producthunt"];
        const newsNowPromises = topNewsNow.map(id => fetchNewsNowSource(id));

        const results = await Promise.all([...staticPromises, ...newsNowPromises]);

        allNews = results.flat().sort((a, b) => b.timestamp - a.timestamp);

        renderFeed();
        showLoading(false);
    }

    /**
     * Fetch Native/RSS Source
     */
    async function fetchNativeSource(id, source) {
        try {
            if (source.type === 'hn') {
                const response = await fetch(source.url);
                const ids = await response.json();
                const stories = await Promise.all(ids.slice(0, source.limit).map(sid =>
                    fetch(`https://hacker-news.firebaseio.com/v0/item/${sid}.json`).then(r => r.json())
                ));
                return stories.map(s => ({
                    id: `hn-${s.id}`,
                    sourceId: id,
                    sourceName: source.name,
                    title: s.title,
                    link: s.url || `https://news.ycombinator.com/item?id=${s.id}`,
                    snippet: `Score: ${s.score} | By: ${s.by}`,
                    timestamp: s.time * 1000,
                    timeLabel: timeAgo(s.time * 1000)
                }));
            } else if (source.type === 'rss') {
                const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`;
                const response = await fetch(rssUrl);
                const data = await response.json();
                if (data.status === 'ok') {
                    return data.items.slice(0, source.limit).map(item => ({
                        id: item.guid || item.link,
                        sourceId: id,
                        sourceName: source.name,
                        title: item.title,
                        link: item.link,
                        snippet: item.content.replace(/<[^>]*>?/gm, '').slice(0, 150) + '...',
                        timestamp: new Date(item.pubDate.getTime() ? item.pubDate : item.pubDate.replace(/-/g, "/")).getTime(),
                        timeLabel: timeAgo(new Date(item.pubDate).getTime())
                    }));
                }
            }
        } catch (e) { console.error(`Failed ${id}`, e); }
        return [];
    }

    /**
     * Fetch NewsNow Source via Proxy
     */
    async function fetchNewsNowSource(id) {
        try {
            const url = `${CORS_PROXY}${encodeURIComponent(`https://newsnow.busiyi.world/api/s?id=${id}`)}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data && data.items) {
                return data.items.map(item => ({
                    id: `nn-${id}-${item.id || Math.random()}`,
                    sourceId: id,
                    sourceName: NEWSNOW_SOURCES[id] || id.toUpperCase(),
                    title: item.title,
                    link: item.url || item.link,
                    snippet: item.extra || (item.m_mobile_url ? "Mobile optimized link available" : "Hot topic trend"),
                    timestamp: item.timestamp ? item.timestamp * 1000 : Date.now(),
                    timeLabel: item.timestamp ? timeAgo(item.timestamp * 1000) : "TREENDING"
                }));
            }
        } catch (e) { console.error(`Failed NewsNow ${id}`, e); }
        return [];
    }

    /**
     * Render the feed
     */
    async function renderFeed() {
        // If the filter is a NewsNow source not in the "All" view cache, fetch it now
        const isNewsNow = NEWSNOW_SOURCES[currentFilter];
        const isAlreadyFetched = allNews.some(n => n.sourceId === currentFilter);

        if (isNewsNow && !isAlreadyFetched && currentFilter !== 'all') {
            showLoading(true);
            const freshItems = await fetchNewsNowSource(currentFilter);
            allNews = [...allNews, ...freshItems];
            showLoading(false);
        }

        const filtered = currentFilter === 'all'
            ? allNews
            : allNews.filter(n => n.sourceId === currentFilter);

        feedItems.innerHTML = '';

        if (filtered.length === 0) {
            feedItems.innerHTML = '<div class="feed-empty">NO_DATA_FOUND_IN_NODE</div>';
        } else {
            filtered.forEach((item, index) => {
                const element = document.createElement('div');
                element.className = 'feed-item';
                element.style.animationDelay = `${index * 0.03}s`;
                element.innerHTML = `
                    <div class="item-meta">
                        <span class="item-source">${item.sourceName}</span>
                        <span class="item-time">${item.timeLabel}</span>
                    </div>
                    <h3 class="item-title"><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a></h3>
                    <p class="item-snippet">${item.snippet}</p>
                `;
                feedItems.appendChild(element);
            });
        }

        itemCount.textContent = `${filtered.length} items`;
    }

    function showLoading(show) {
        if (show) {
            feedItems.innerHTML = `<div class="feed-loading"><div class="loading-bar"></div><span>SCANNING_NETWORK...</span></div>`;
        }
    }

    function timeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        if (isNaN(seconds)) return "RECENT";
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return Math.floor(seconds) + "s ago";
    }

    // Static event listeners
    document.querySelectorAll('.source-item').forEach(item => {
        item.addEventListener('click', () => handleSourceClick(item, item.dataset.source));
    });

    refreshBtn.addEventListener('click', () => fetchAllNews());

    // Init
    initDynamicNodes();
    fetchAllNews();
    setInterval(fetchAllNews, 15 * 60 * 1000);
});
