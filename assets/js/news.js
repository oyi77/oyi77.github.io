/**
 * Terminal News Aggregator Logic - v3.0 (Card Layout Redesign)
 * Fetches news from multiple sources and renders them in source-specific cards.
 */

document.addEventListener('DOMContentLoaded', () => {
    const feedItems = document.getElementById('feed-items');
    const feedSkeleton = document.getElementById('feed-skeleton');
    const itemCount = document.getElementById('item-count');
    const dynamicSourcesContainer = document.getElementById('dynamic-sources');
    const refreshBtn = document.getElementById('refresh-all');

    let allNews = [];
    const CORS_PROXY = "https://api.allorigins.win/raw?url=";
    const AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE0OTIxOTgzIiwidHlwZSI6ImdpdGh1YiIsImV4cCI6MTc3MjkxNDg4MX0.zu9pUP1IE4sQYZGyNTOVIjpQEder_nk5PcunVdCUBco";

    // Source Configuration & Theming
    const THEME_MAP = {
        'zhihu': 'theme-blue',
        'weibo': 'theme-red',
        'coolapk': 'theme-green',
        'v2ex': 'theme-green',
        'hackernews': 'theme-orange',
        'producthunt': 'theme-orange',
        'github': 'theme-blue',
        'juejin': 'theme-blue',
        'default': 'theme-blue'
    };

    // Initial known metadata (will be augmented by dynamic discovery mostly for names/icons if we could inference them, 
    // but for now we keep this as a lookup. Dynamic sources without entries here will get defaults).
    const NEWSNOW_SOURCES = {
        "hackernews": { name: "HN_GLOBAL", icon: "Y" },
        "github-trending-today": { name: "GITHUB_TRENDS", icon: "G" },
        "producthunt": { name: "PRODUCT_HUNT", icon: "P" },
        "36kr-renqi": { name: "36KR_TECH", icon: "36" },
        "juejin": { name: "JUEJIN_DEV", icon: "J" },
        "sspai": { name: "SSPAI_DIGITAL", icon: "S" },
        "freebuf": { name: "FREEBUF_SEC", icon: "F" },
        "zhihu": { name: "ZHIHU_HOT", icon: "知" },
        "weibo": { name: "WEIBO_TRENDS", icon: "W" },
        "douyin": { name: "DOUYIN_HOT", icon: "🎵" },
        "bilibili-hot-search": { name: "BILIBILI_HOT", icon: "B" },
        "v2ex-share": { name: "V2EX_SHARE", icon: "V" },
        "v2ex": { name: "V2EX_SHARE", icon: "V" }, // Fallback alias
        "steam": { name: "STEAM_GAMES", icon: "S" },
        "it-home": { name: "IT_HOME", icon: "IT" },
        "ithome": { name: "IT_HOME", icon: "IT" },
        "wallstreetcn-hot": { name: "WALLSTREET_CN", icon: "WS" },
        "coolapk": { name: "COOLAPK", icon: "C" },
        "zaobao": { name: "ZAOBAO_SG", icon: "早" },
        "baidu": { name: "BAIDU_HOT", icon: "度" },
        "36kr-quick": { name: "36KR_QUICK", icon: "快" },
        "cls-telegraph": { name: "CLS_TELE", icon: "电" },
        "gelonghui": { name: "GELONGHUI", icon: "格" }
    };

    /**
     * Get Theme for Source ID
     */
    function getThemeForSource(sourceId) {
        if (THEME_MAP[sourceId]) return THEME_MAP[sourceId];
        // Heuristic matching
        if (sourceId.includes('zhihu')) return THEME_MAP['zhihu'];
        if (sourceId.includes('weibo')) return THEME_MAP['weibo'];
        if (sourceId.includes('cool')) return THEME_MAP['coolapk'];
        if (sourceId.includes('github')) return THEME_MAP['github'];
        if (sourceId.includes('v2ex')) return THEME_MAP['v2ex'];
        if (sourceId.includes('wallstreet')) return 'theme-red';
        if (sourceId.includes('36kr')) return 'theme-blue';
        return THEME_MAP.default;
    }

    /**
     * Fetch System Sources from API
     */
    async function fetchSystemSources() {
        try {
            const response = await fetch("https://newsnow.busiyi.world/api/me/sync", {
                method: "GET",
                headers: {
                    "accept": "*/*",
                    "authorization": AUTH_TOKEN,
                    "cache-control": "no-cache"
                }
            });
            const result = await response.json();
            if (result && result.data) {
                // Merge sources, prioritizing focus > hottest > realtime
                const sources = [
                    ...(result.data.focus || []),
                    ...(result.data.hottest || []),
                    ...(result.data.realtime || [])
                ];
                // Deduplicate and filter out empties
                return [...new Set(sources)].filter(Boolean);
            }
        } catch (e) {
            console.error("Failed to fetch system sources", e);
        }
        return null; // Fallback will be triggered
    }

    /**
     * Initialize dynamic NewsNow nodes in the sidebar
     */
    function initDynamicNodes(sources = []) {
        dynamicSourcesContainer.innerHTML = ''; // Clear existing
        sources.forEach(id => {
            const meta = NEWSNOW_SOURCES[id] || { name: id.toUpperCase().replace(/-/g, '_'), icon: '#' };
            const div = document.createElement('div');
            div.className = 'source-item';
            div.dataset.source = id;
            div.innerHTML = `
                <span class="source-icon">[${meta.icon}]</span>
                <span class="source-name">${meta.name}</span>
            `;
            div.addEventListener('click', () => {
                const card = document.getElementById(`card-${id}`);
                if (card) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    card.style.transition = 'transform 0.2s, box-shadow 0.2s';
                    card.style.transform = 'scale(1.02)';
                    card.style.boxShadow = '0 0 20px var(--news-accent)';
                    setTimeout(() => {
                        card.style.transform = '';
                        card.style.boxShadow = '';
                    }, 500);
                }
            });
            dynamicSourcesContainer.appendChild(div);
        });
    }

    /**
     * Fetch all news sources
     */
    async function fetchAllNews(forceRefresh = false) {
        showLoading(true);
        allNews = [];

        // 1. Get List of Sources
        let topSources = await fetchSystemSources();

        if (!topSources || topSources.length === 0) {
            console.log("Using fallback sources");
            // Fallback to minimal set if API fails
            topSources = ["zhihu", "weibo", "hackernews", "v2ex-share", "coolapk"];
        }

        // Update sidebar based on what we are fetching
        initDynamicNodes(topSources);

        // Limit concurrent requests to avoid overwhelming
        // Fetch top 12 sources to fill the grid nicely
        const limitedSources = topSources.slice(0, 12);

        const promises = limitedSources.map(id => fetchNewsNowSource(id, forceRefresh));
        const results = await Promise.all(promises);

        allNews = results.flat();

        renderCards();
        showLoading(false);
    }

    /**
     * Fetch NewsNow Source via Proxy
     */
    async function fetchNewsNowSource(id, forceRefresh = false) {
        try {
            let apiTarget = `https://newsnow.busiyi.world/api/s?id=${id}`;
            if (forceRefresh) {
                apiTarget += '&latest';
            }

            const url = `${CORS_PROXY}${encodeURIComponent(apiTarget)}`;

            console.log(`Fetching ${id} from ${apiTarget}`);

            const response = await fetch(url);
            const data = await response.json();

            if (data && data.items) {
                return data.items.map(item => ({
                    id: `nn-${id}-${item.id || Math.random()}`,
                    sourceId: id,
                    sourceName: NEWSNOW_SOURCES[id]?.name || id.toUpperCase(),
                    title: item.title,
                    link: item.url || item.link,
                    heat: item.extra || (item.timestamp ? timeAgo(item.timestamp * 1000) : ""),
                    timestamp: item.timestamp ? item.timestamp * 1000 : Date.now()
                }));
            }
        } catch (e) { console.error(`Failed NewsNow ${id}`, e); }
        return [];
    }

    /**
     * Render the Cards Layout
     */
    function renderCards() {
        feedItems.innerHTML = '';

        const grouped = allNews.reduce((acc, item) => {
            if (!acc[item.sourceId]) acc[item.sourceId] = [];
            acc[item.sourceId].push(item);
            return acc;
        }, {});

        // Iterate through unique source IDs from allNews to maintain valid groups
        // But we want to respect the fetch order (sidebar order) if possible.
        // Let's iterate through the keys of grouped, but sorted by our 'limitedSources' order? 
        // Hard to pass that down without global state. 
        // Object.keys is mostly insertion order, which matches promise resolution mostly. Good enough.

        Object.entries(grouped).forEach(([sourceId, items]) => {
            const theme = getThemeForSource(sourceId);
            const meta = NEWSNOW_SOURCES[sourceId] || { name: sourceId.toUpperCase().replace(/-/g, '_'), icon: '#' };

            const card = document.createElement('div');
            card.className = `news-card ${theme}`;
            card.id = `card-${sourceId}`;

            const listHtml = items.map((item, index) => `
                <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="card-item">
                    <span class="item-index">${index + 1}</span>
                    <div class="item-content">
                        <span class="item-title">${item.title}</span>
                        ${item.heat ? `<span class="item-meta">${item.heat}</span>` : ''}
                    </div>
                </a>
            `).join('');

            card.innerHTML = `
                <div class="card-header">
                    <div class="card-source-info">
                        <div class="card-icon">${meta.icon}</div>
                        <div class="card-title-group">
                            <span class="card-source-name">${meta.name}</span>
                            <span class="card-updated">Just updated</span>
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="card-action-btn" title="Refresh">↻</button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="card-list">
                        ${listHtml}
                    </div>
                </div>
            `;

            const localRefreshBtn = card.querySelector('.card-action-btn');
            localRefreshBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                localRefreshBtn.textContent = '...';

                const newItems = await fetchNewsNowSource(sourceId, true);

                if (newItems.length > 0) {
                    allNews = allNews.filter(n => n.sourceId !== sourceId);
                    allNews = [...allNews, ...newItems];
                    renderCards();
                } else {
                    localRefreshBtn.textContent = '↻';
                }
            });

            feedItems.appendChild(card);
        });

        itemCount.textContent = `${allNews.length} items cached`;
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
    refreshBtn.addEventListener('click', () => fetchAllNews(true));

    // Start
    fetchAllNews();
    setInterval(() => fetchAllNews(true), 15 * 60 * 1000);
});
