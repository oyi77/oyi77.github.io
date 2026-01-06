/**
 * Terminal News Aggregator Logic - v3.0 (Card Layout Redesign)
 * Fetches news from multiple sources and renders them in source-specific cards.
 */

document.addEventListener('DOMContentLoaded', () => {
    const feedItems = document.getElementById('feed-items'); // This is now a grid container
    const feedSkeleton = document.getElementById('feed-skeleton');
    const itemCount = document.getElementById('item-count');
    const dynamicSourcesContainer = document.getElementById('dynamic-sources');
    const refreshBtn = document.getElementById('refresh-all');

    let allNews = [];
    const CORS_PROXY = "https://api.allorigins.win/raw?url=";

    // Source Configuration & Theming
    const THEME_MAP = {
        'zhihu': 'theme-blue',
        'weibo': 'theme-red',
        'coolapk': 'theme-green', // Assuming "Cool" is CoolApk
        'v2ex': 'theme-green',
        'hackernews': 'theme-orange',
        'producthunt': 'theme-orange',
        'github-trending-today': 'theme-blue',
        'juejin': 'theme-blue',
        'default': 'theme-blue'
    };

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
        "v2ex": { name: "V2EX_TECH", icon: "V" },
        "steam": { name: "STEAM_GAMES", icon: "S" },
        "it-home": { name: "IT_HOME", icon: "IT" },
        "wallstreetcn-hot": { name: "WALLSTREET_CN", icon: "WS" }
    };

    /**
     * Initialize dynamic NewsNow nodes in the sidebar
     */
    function initDynamicNodes() {
        Object.entries(NEWSNOW_SOURCES).forEach(([id, meta]) => {
            const div = document.createElement('div');
            div.className = 'source-item';
            div.dataset.source = id;
            div.innerHTML = `
                <span class="source-icon">[${meta.icon}]</span>
                <span class="source-name">${meta.name}</span>
            `;
            div.addEventListener('click', () => {
                // Scroll to the card
                const card = document.getElementById(`card-${id}`);
                if (card) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Flash effect
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

        // Fetch a defined set of top sources for the initial view
        const topSources = ["zhihu", "weibo", "hackernews", "github-trending-today", "producthunt", "v2ex"];

        const promises = topSources.map(id => fetchNewsNowSource(id, forceRefresh));
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

        // Group by Source
        const grouped = allNews.reduce((acc, item) => {
            if (!acc[item.sourceId]) acc[item.sourceId] = [];
            acc[item.sourceId].push(item);
            return acc;
        }, {});

        Object.entries(grouped).forEach(([sourceId, items]) => {
            // Determine theme
            let theme = THEME_MAP.default;
            if (sourceId.includes('zhihu')) theme = THEME_MAP.zhihu;
            else if (sourceId.includes('weibo')) theme = THEME_MAP.weibo;
            else if (sourceId.includes('cool')) theme = THEME_MAP.coolapk;
            else if (THEME_MAP[sourceId]) theme = THEME_MAP[sourceId];

            const meta = NEWSNOW_SOURCES[sourceId] || { name: sourceId.toUpperCase(), icon: '#' };

            const card = document.createElement('div');
            card.className = `news-card ${theme}`;
            card.id = `card-${sourceId}`;

            // Generate list items
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

            // Add individual refresh handler logic if needed (future feature), 
            // for now global refresh is fine or wire up that specific button
            const localRefreshBtn = card.querySelector('.card-action-btn');
            localRefreshBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Spin icon
                localRefreshBtn.textContent = '...';

                const newItems = await fetchNewsNowSource(sourceId, true);
                // Update local state and re-render just this card content? 
                // Simpler to just re-fetch all for MVP or update the memory and re-render all.
                // Or:
                if (newItems.length > 0) {
                    // Filter out old items for this source
                    allNews = allNews.filter(n => n.sourceId !== sourceId);
                    allNews = [...allNews, ...newItems];
                    renderCards();
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
            if (feedSkeleton) feedSkeleton.style.display = 'flex'; // Need to update skeleton CSS to be grid compatible potentially
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

    // Init
    initDynamicNodes();
    fetchAllNews(); // Initial load (cached)
    setInterval(() => fetchAllNews(true), 15 * 60 * 1000); // Auto refresh every 15m
});
