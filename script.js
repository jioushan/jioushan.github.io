// DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    initializeLoading();
    initializeTheme();
    initializeNavigation();
    initializeScrollEffects();
    try { initializeMap(); } catch(e) { console.error('Map init failed:', e); }
    initializeLookingGlass();
    initializeStats();
    initializeParticles();
    initializeBackToTop();

    // Remove loading screen after everything is loaded
    setTimeout(() => {
        hideLoadingScreen();
    }, 2000);
}

// Loading screen
function initializeLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Theme management
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Auto theme based on time (6AM to 6PM = light, otherwise dark)
    const currentHour = new Date().getHours();
    const autoTheme = (currentHour >= 6 && currentHour < 18) ? 'light' : 'dark';
    
    // Use saved theme, or auto theme
    const initialTheme = savedTheme || autoTheme;
    
    document.documentElement.setAttribute('data-theme', initialTheme);
    updateThemeIcon(initialTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme);
        }
    });
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const sunIcon = themeToggle.querySelector('.sun-icon');
        const moonIcon = themeToggle.querySelector('.moon-icon');
        
        if (theme === 'dark') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }
}

// Navigation
function initializeNavigation() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu after clicking
                if (navLinks) {
                    navLinks.classList.remove('active');
                }
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                }
            }
        });
    });
}

// Scroll effects
function initializeScrollEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stagger child animations
                const children = entry.target.querySelectorAll('.feature-card, .stat-item');
                children.forEach((el, i) => {
                    el.style.transitionDelay = (i * 0.12) + 's';
                });
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('section:not(.home-section)').forEach(section => {
        observer.observe(section);
    });
    
    // Header scroll effect
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (header) {
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
        }
        
        lastScrollY = currentScrollY;
    });
}

// Mapbox GL JS initialization
function initializeMap() {
    if (!document.getElementById('mapid') || typeof mapboxgl === 'undefined') return;

    // Check WebGL support
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) throw new Error('no webgl');
    } catch(e) {
        document.getElementById('mapid').innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#999;font-size:0.9rem;">Map requires WebGL support</div>';
        return;
    }

    mapboxgl.accessToken = 'pk.eyJ1IjoiamlvdXNoYW4iLCJhIjoiY21vcTN0ZWp6MXhhYjJybmNnNmEwa2ZwbyJ9.VpuJK_3oT4w-2qKM3DY_xw';

    function getMapStyle() {
        return document.documentElement.getAttribute('data-theme') === 'dark'
            ? 'mapbox://styles/mapbox/dark-v11'
            : 'mapbox://styles/mapbox/light-v11';
    }

    const map = new mapboxgl.Map({
        container: 'mapid',
        style: getMapStyle(),
        center: [180, 25],
        zoom: 2.2,
        projection: 'mercator'
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    const networkNodes = [
        { code: 'NRT', name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503,
          providers: ['BBIX', 'Softbank'], type: 'main' },
        { code: 'OSA', name: 'Osaka', country: 'Japan', lat: 34.6937, lng: 135.5023,
          providers: ['OPTAGE', 'NTT', 'KDDI', 'IIJ'], type: 'main' },
        { code: 'TPE', name: 'Taipei', country: 'Taiwan', lat: 25.0330, lng: 121.5654,
          providers: ['MoeDove', 'HE'], type: 'pop' },
        { code: 'HKG', name: 'Hong Kong', country: 'Hong Kong', lat: 22.3193, lng: 114.1694,
          providers: ['HKIX', 'EQIX'], type: 'main' },
        { code: 'SJC', name: 'San Jose', country: 'USA', lat: 37.3382, lng: -121.8863,
          providers: ['HE'], type: 'pop' },
        { code: 'MCI', name: 'Kansas City', country: 'USA', lat: 39.0997, lng: -94.5786,
          providers: ['HE', 'Cogent', 'KCIX'], type: 'main' }
    ];

    const connections = [
        { from: 'HKG', to: 'TPE', latency: '12ms' },
        { from: 'HKG', to: 'NRT', latency: '50ms' },
        { from: 'OSA', to: 'NRT', latency: '7ms' },
        { from: 'TPE', to: 'NRT', latency: '33ms' },
        { from: 'OSA', to: 'SJC', latency: '100ms' },
        { from: 'SJC', to: 'MCI', latency: '50ms' }
    ];

    const nodeMap = {};
    networkNodes.forEach(n => { nodeMap[n.code] = n; });

    function getNodeConns(code) {
        return connections.filter(c => c.from === code || c.to === code);
    }

    function createCurve(from, to) {
        // Handle date line crossing: shift to continuous coords
        let x0 = from[0], x1 = to[0];
        if (Math.abs(x1 - x0) > 180) {
            if (x0 < x1) x0 += 360; else x1 += 360;
        }
        const mid = [(x0 + x1) / 2, (from[1] + to[1]) / 2];
        const dx = x1 - x0, dy = to[1] - from[1];
        const dist = Math.sqrt(dx * dx + dy * dy);
        const curve = Math.min(dist * 0.15, 20);
        mid[0] += -dy * 0.001 * curve;
        mid[1] += dx * 0.001 * curve;
        const pts = [];
        for (let i = 0; i <= 50; i++) {
            const t = i / 50;
            let lng = Math.pow(1-t,2)*x0 + 2*(1-t)*t*mid[0] + t*t*x1;
            // Normalize back to -180..180
            while (lng > 180) lng -= 360;
            while (lng < -180) lng += 360;
            pts.push([lng, Math.pow(1-t,2)*from[1] + 2*(1-t)*t*mid[1] + t*t*to[1]]);
        }
        // Split at antimeridian to prevent Mapbox wrapping
        const segments = [[]];
        for (let i = 0; i < pts.length; i++) {
            segments[segments.length - 1].push(pts[i]);
            if (i < pts.length - 1) {
                const dLng = Math.abs(pts[i+1][0] - pts[i][0]);
                if (dLng > 180) {
                    segments.push([]);
                }
            }
        }
        return segments;
    }

    // Sidebar
    const sidebarContent = document.getElementById('sidebar-content');
    let activeNode = null;

    function renderNodeList() {
        if (!sidebarContent) return;
        let html = '';
        networkNodes.forEach(node => {
            html += '<div class="node-item" data-code="' + node.code + '">' +
                '<div class="node-dot ' + node.type + '"></div>' +
                '<div class="node-item-info">' +
                '<div class="node-item-code">' + node.code + '</div>' +
                '<div class="node-item-name">' + node.name + ', ' + node.country + '</div>' +
                '</div></div>';
        });
        sidebarContent.innerHTML = html;

        sidebarContent.querySelectorAll('.node-item').forEach(el => {
            el.addEventListener('click', function() {
                selectNode(this.getAttribute('data-code'));
            });
        });
    }

    function selectNode(code) {
        activeNode = code;
        const node = nodeMap[code];
        if (!node) return;

        map.flyTo({ center: [node.lng, node.lat], zoom: 4, duration: 1200 });

        const nodeConns = getNodeConns(code);
        let connHtml = '';
        nodeConns.forEach(c => {
            const targetCode = c.from === code ? c.to : c.from;
            const target = nodeMap[targetCode];
            connHtml += '<div class="conn-item" data-from="' + c.from + '" data-to="' + c.to + '">' +
                '<span class="conn-target">' + targetCode + ' - ' + target.name + '</span>' +
                '<span class="conn-latency">' + c.latency + '</span></div>';
        });

        sidebarContent.innerHTML =
            '<div class="node-detail">' +
            '<button class="back-btn" id="map-back-btn">&larr; Back</button>' +
            '<div class="node-detail-header">' +
            '<span class="node-detail-title">' + code + ' - ' + node.name + '</span>' +
            '<span class="node-detail-badge ' + node.type + '">' + node.type + '</span></div>' +
            '<div class="node-detail-row"><strong>Country:</strong> ' + node.country + '</div>' +
            '<div class="node-detail-row"><strong>Providers:</strong> ' + node.providers.join(', ') + '</div>' +
            '<div class="node-detail-row" style="margin-top:10px;"><strong>Connections:</strong></div>' +
            '<ul class="conn-list">' + connHtml + '</ul></div>';

        document.getElementById('map-back-btn').addEventListener('click', function() {
            activeNode = null;
            renderNodeList();
        });

        sidebarContent.querySelectorAll('.conn-item').forEach(el => {
            el.addEventListener('mouseenter', function() {
                const from = this.getAttribute('data-from');
                const to = this.getAttribute('data-to');
                highlightConnection(from, to, true);
            });
            el.addEventListener('mouseleave', function() {
                const from = this.getAttribute('data-from');
                const to = this.getAttribute('data-to');
                highlightConnection(from, to, false);
            });
        });
    }

    function highlightConnection(from, to, active) {
        if (!map.getLayer('connection-lines')) return;
        const lineColor = active ? '#ffffff' : '#4ecdc4';
        const lineWidth = active ? 3 : 1.5;
        const lineOpacity = active ? 1 : 0.6;
        map.setPaintProperty('connection-lines', 'line-color', [
            'case',
            ['all', ['==', ['get', 'from'], from], ['==', ['get', 'to'], to]],
            lineColor,
            ['all', ['==', ['get', 'from'], to], ['==', ['get', 'to'], from]],
            lineColor,
            '#4ecdc4'
        ]);
        map.setPaintProperty('connection-lines', 'line-width', [
            'case',
            ['all', ['==', ['get', 'from'], from], ['==', ['get', 'to'], to]],
            lineWidth,
            ['all', ['==', ['get', 'from'], to], ['==', ['get', 'to'], from]],
            lineWidth,
            1.5
        ]);
    }

    renderNodeList();

    // Map layers
    function addMapLayers() {
        const lineFeatures = [];
        connections.forEach(conn => {
            const a = nodeMap[conn.from], b = nodeMap[conn.to];
            if (!a || !b) return;
            const segments = createCurve([a.lng, a.lat], [b.lng, b.lat]);
            segments.forEach(seg => {
                if (seg.length >= 2) {
                    lineFeatures.push({
                        type: 'Feature',
                        properties: { from: conn.from, to: conn.to, latency: conn.latency },
                        geometry: { type: 'LineString', coordinates: seg }
                    });
                }
            });
        });

        map.addSource('connections', { type: 'geojson', data: { type: 'FeatureCollection', features: lineFeatures } });
        map.addLayer({
            id: 'connection-lines',
            type: 'line',
            source: 'connections',
            paint: {
                'line-color': '#4ecdc4',
                'line-width': 1.5,
                'line-opacity': 0.6,
                'line-dasharray': [3, 2]
            }
        });

        const nodeFeatures = networkNodes.map(node => ({
            type: 'Feature',
            properties: {
                code: node.code, name: node.name, country: node.country,
                type: node.type, providers: node.providers.join(', ')
            },
            geometry: { type: 'Point', coordinates: [node.lng, node.lat] }
        }));

        map.addSource('nodes', { type: 'geojson', data: { type: 'FeatureCollection', features: nodeFeatures } });

        map.addLayer({
            id: 'node-glow',
            type: 'circle',
            source: 'nodes',
            paint: { 'circle-radius': 10, 'circle-color': '#4ecdc4', 'circle-opacity': 0.15 }
        });

        map.addLayer({
            id: 'node-circles',
            type: 'circle',
            source: 'nodes',
            paint: {
                'circle-radius': ['case', ['==', ['get', 'type'], 'main'], 7, 5],
                'circle-color': ['case', ['==', ['get', 'type'], 'main'], '#4ecdc4', '#45b7d1'],
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff',
                'circle-stroke-opacity': 0.9
            }
        });

        map.addLayer({
            id: 'node-labels',
            type: 'symbol',
            source: 'nodes',
            layout: {
                'text-field': ['get', 'code'],
                'text-size': 11,
                'text-offset': [0, 1.5],
                'text-anchor': 'top',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Regular']
            },
            paint: { 'text-color': '#ffffff', 'text-halo-color': 'rgba(0,0,0,0.7)', 'text-halo-width': 1 }
        });

        map.on('click', 'node-circles', function(e) {
            const code = e.features[0].properties.code;
            selectNode(code);
        });

        map.on('mouseenter', 'node-circles', function() { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', 'node-circles', function() { map.getCanvas().style.cursor = ''; });
    }

    map.on('load', function() {
        addMapLayers();

        // Legend
        const legend = document.createElement('div');
        legend.className = 'mapboxgl-ctrl mapboxgl-ctrl-group map-legend';
        legend.style.cssText = 'padding:10px;border-radius:8px;font-size:12px;line-height:20px;';
        legend.innerHTML = '<div style="font-weight:bold;margin-bottom:4px;">Node Types</div>' +
            '<div><span style="color:#4ecdc4;">●</span> Main Node</div>' +
            '<div><span style="color:#45b7d1;">●</span> PoP Node</div>';
        document.getElementById('mapid').appendChild(legend);
    });

    // Theme switching
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
            if (m.attributeName === 'data-theme' && map.isStyleLoaded()) {
                map.setStyle(getMapStyle());
                map.once('style.load', function() { addMapLayers(); });
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });
}

// Looking Glass functionality
function initializeLookingGlass() {
    const lgInput = document.getElementById('lg-input');
    const lgSubmit = document.getElementById('lg-submit');
    const lgResults = document.getElementById('lg-results');
    
    if (!lgInput || !lgSubmit || !lgResults) return;
    
    lgSubmit.addEventListener('click', performTrace);
    lgInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performTrace();
        }
    });
    
    async function performTrace() {
        const target = lgInput.value.trim();
        if (!target) return;
        
        // Show loading state with animation
        lgSubmit.classList.add('loading');
        lgResults.innerHTML = `
            <div class="loading-indicator">
                <div class="loading-spinner"></div>
                <p>Running trace to ${target}...</p>
            </div>
        `;
        
        try {
            const response = await fetch(`https://mtr.api.jsmsr.eu.org/mtr?ip=${encodeURIComponent(target)}`, {
                timeout: 30000 // 30 second timeout
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('API Response:', data); // Debug log
            displayTraceResults(data, target);
            
        } catch (error) {
            console.error('Trace error:', error);
            
            // Only show IPv6 message if timeout or network error after 30 seconds
            if (error.name === 'TypeError' || error.message.includes('timeout') || error.message.includes('fetch')) {
                lgResults.innerHTML = `
                    <div class="error-result">
                        <h3>🌐 IPv6 Network Required</h3>
                        <p><strong>Our API currently only returns results under IPv6 networks.</strong></p>
                        <p>Please ensure your network supports IPv6 access to use this Looking Glass service.</p>
                        <div class="ipv6-info">
                            <h4>How to check IPv6 connectivity:</h4>
                            <ul>
                                <li>Visit <a href="https://test-ipv6.com/" target="_blank">test-ipv6.com</a> to test your IPv6 connectivity</li>
                                <li>Contact your ISP to enable IPv6 if not available</li>
                                <li>Try using a different network that supports IPv6</li>
                            </ul>
                        </div>
                    </div>
                `;
            } else {
                lgResults.innerHTML = `
                    <div class="error-result">
                        <h3>Error</h3>
                        <p>Failed to perform trace: ${error.message}</p>
                        <p>Please try again later.</p>
                    </div>
                `;
            }
        } finally {
            lgSubmit.classList.remove('loading');
        }
    }
    
    function displayTraceResults(data, target) {
        console.log('Processing data:', data); // Debug log
        
        // Check if data exists and has result
        if (!data) {
            lgResults.innerHTML = `
                <div class="error-result">
                    <h3>No Data</h3>
                    <p>No response data received from API</p>
                </div>
            `;
            return;
        }
        
        // Handle different possible data structures
        let resultArray = null;
        if (data.result && Array.isArray(data.result)) {
            resultArray = data.result;
        } else if (Array.isArray(data)) {
            resultArray = data;
        } else if (typeof data === 'string') {
            resultArray = data.split('\n').filter(line => line.trim());
        } else {
            lgResults.innerHTML = `
                <div class="error-result">
                    <h3>Invalid Data Format</h3>
                    <p>Received data: ${JSON.stringify(data).substring(0, 200)}...</p>
                </div>
            `;
            return;
        }
        
        if (!resultArray || resultArray.length === 0) {
            lgResults.innerHTML = `
                <div class="error-result">
                    <h3>No Trace Results</h3>
                    <p>No trace data available for ${target}</p>
                </div>
            `;
            return;
        }
        
        const formattedData = formatTraceData(resultArray);
        
        lgResults.innerHTML = `
            <div class="trace-results">
                <h3>Trace to ${target}</h3>
                <div class="trace-info">
                    <span>Hops: ${formattedData.length}</span>
                    <span>Timestamp: ${new Date().toLocaleString()}</span>
                </div>
                <div class="trace-table">
                    ${formattedData.length > 0 ? 
                        formattedData.map(hop => `
                            <div class="trace-row">
                                <div class="hop-number">${hop.hop}</div>
                                <div class="hop-info">
                                    <div class="hop-ip">${hop.ip}</div>
                                    <div class="hop-stats">
                                        <span class="hop-latency">${hop.latency}</span>
                                        <span class="hop-loss">Loss: ${hop.loss}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('') : 
                        '<div class="no-hops">No valid hops found in trace data</div>'
                    }
                </div>
                <div class="raw-data">
                    <details style="margin-top: 20px;">
                        <summary>Raw API Response</summary>
                        <pre>${JSON.stringify(data, null, 2)}</pre>
                    </details>
                </div>
            </div>
        `;
    }
    
    function formatTraceData(result) {
        const hops = [];
        
        result.forEach(line => {
            if (typeof line !== 'string') {
                line = String(line);
            }
            
            // Skip header lines and empty lines
            if (line.includes('Start:') || line.includes('HOST:') || line.includes('Loss%') || !line.trim()) {
                return;
            }
            
            // Parse MTR format: "  1.|-- 2602:f919:939:9999::1      0.0%     1    0.5   0.5   0.5   0.5   0.0"
            const mtrMatch = line.match(/^\s*(\d+)\.\|\-\-\s+([^\s]+)\s+([0-9.]+%)\s+\d+\s+([0-9.]+)/);
            if (mtrMatch) {
                const hopNumber = mtrMatch[1];
                const ipAddress = mtrMatch[2];
                const loss = mtrMatch[3];
                const latency = mtrMatch[4];
                
                hops.push({
                    hop: hopNumber,
                    ip: ipAddress,
                    latency: `${latency}ms`,
                    loss: loss,
                    raw: line.trim()
                });
            }
        });
        
        return hops;
    }
}

// Statistics animation
function initializeStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateNumber = (element, target) => {
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseFloat(entry.target.dataset.target);
                animateNumber(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// Particle network with interactive ripple
function initializeParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const count = 100;
    const particles = [];
    // create nodes with random connections to form a web-like topology
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            ox: 0, oy: 0,
            r: Math.random() * 1.5 + 0.5,
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.15,
            alpha: Math.random() * 0.3 + 0.15,
            links: []
        });
    }
    particles.forEach(p => { p.ox = p.x; p.oy = p.y; });

    // build spider-web connections: each node connects to 2-4 nearest neighbors
    for (let i = 0; i < particles.length; i++) {
        const dists = [];
        for (let j = 0; j < particles.length; j++) {
            if (i === j) continue;
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            dists.push({ j, d: Math.sqrt(dx * dx + dy * dy) });
        }
        dists.sort((a, b) => a.d - b.d);
        const linkCount = 2 + Math.floor(Math.random() * 3); // 2-4 links
        for (let k = 0; k < linkCount && k < dists.length; k++) {
            if (!particles[i].links.includes(dists[k].j)) {
                particles[i].links.push(dists[k].j);
            }
            if (!particles[dists[k].j].links.includes(i)) {
                particles[dists[k].j].links.push(i);
            }
        }
    }

    const mouse = { x: -9999, y: -9999, active: false };

    function onMove(e) {
        const rect = canvas.getBoundingClientRect();
        const src = e.touches ? e.touches[0] : e;
        mouse.x = src.clientX - rect.left;
        mouse.y = src.clientY - rect.top;
        mouse.active = true;
    }
    function onLeave() { mouse.active = false; mouse.x = -9999; mouse.y = -9999; }

    canvas.style.pointerEvents = 'auto';
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('touchmove', onMove, { passive: true });
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('touchend', onLeave);

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of particles) {
            if (mouse.active) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150 * 2;
                    p.vx += (dx / dist) * force * 0.3;
                    p.vy += (dy / dist) * force * 0.3;
                }
            }
            p.vx += (p.ox - p.x) * 0.008;
            p.vy += (p.oy - p.y) * 0.008;
            p.vx *= 0.97;
            p.vy *= 0.97;
            p.x += p.vx;
            p.y += p.vy;
        }

        // draw web connections
        const drawn = new Set();
        for (let i = 0; i < particles.length; i++) {
            const a = particles[i];
            for (const j of a.links) {
                const key = i < j ? i + '-' + j : j + '-' + i;
                if (drawn.has(key)) continue;
                drawn.add(key);
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const baseAlpha = 0.08 * (1 - dist / 400);
                if (baseAlpha <= 0) continue;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = 'rgba(255,255,255,' + Math.max(0, baseAlpha * 0.5) + ')';
                ctx.lineWidth = 0.3;
                ctx.stroke();
            }
        }

        // draw nodes
        for (const p of particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,' + p.alpha + ')';
            ctx.fill();
        }

        requestAnimationFrame(draw);
    }
    draw();
}

// Back to top functionality
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    const themeToggle = document.getElementById('theme-toggle');
    
    // Theme toggle should always be visible
    if (themeToggle) {
        themeToggle.classList.add('show');
    }
    
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
