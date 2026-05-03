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
    initializeMap();
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
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate elements with delay for staggered effect
                const animateElements = entry.target.querySelectorAll('.animate-on-scroll');
                animateElements.forEach((element, index) => {
                    element.style.transitionDelay = `${index * 0.1}s`;
                    element.classList.add('visible');
                });
            }
        });
    }, observerOptions);
    
    // Observe sections
    document.querySelectorAll('section').forEach(section => {
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
    if (!document.getElementById('mapid')) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoiamlvdXNoYW4iLCJhIjoiY21vcTN0ZWp6MXhhYjJybmNnNmEwa2ZwbyJ9.VpuJK_3oT4w-2qKM3DY_xw';

    const map = new mapboxgl.Map({
        container: 'mapid',
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [140, 20],
        zoom: 2,
        projection: 'mercator'
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Real JSMSR Network nodes data
    const networkNodes = [
        { code: 'NRT', name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503,
          providers: ['BBIX', 'Softbank'], type: 'main' },
        { code: 'OSA', name: 'Osaka', country: 'Japan', lat: 34.6937, lng: 135.5023,
          providers: ['OPTAGE', 'NTT', 'KDDI', 'IIJ'], type: 'main' },
        { code: 'TPE', name: 'Taipei', country: 'Taiwan', lat: 25.0330, lng: 121.5654,
          providers: ['MoeDove', 'HE'], type: 'pop' },
        { code: 'HKG', name: 'Hong Kong', country: 'Hong Kong', lat: 22.3193, lng: 114.1694,
          providers: ['HKIX', 'EQIX'], type: 'main' },
        { code: 'SGP', name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198,
          providers: ['Telia1299', 'CSL', 'EQIX'], type: 'main' },
        { code: 'SJC', name: 'San Jose', country: 'USA', lat: 37.3382, lng: -121.8863,
          providers: ['HE'], type: 'pop' },
        { code: 'FMT', name: 'Fremont', country: 'USA', lat: 37.5485, lng: -121.9886,
          providers: ['HE'], type: 'main' },
        { code: 'AMS', name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041,
          providers: ['GTT', 'Cogent', 'HE', 'Telia1299', 'Liberty'], type: 'main' },
        { code: 'FRA', name: 'Frankfurt', country: 'Germany', lat: 50.1109, lng: 8.6821,
          providers: ['HE'], type: 'pop' },
        { code: 'MCI', name: 'Kansas City', country: 'USA', lat: 39.0997, lng: -94.5786,
          providers: ['HE', 'Cogent', 'KCIX', 'SIX SEA'], type: 'main' }
    ];

    // Real network connections with latency
    const connections = [
        { from: 'NRT', to: 'OSA', latency: '8ms' },
        { from: 'OSA', to: 'TPE', latency: '35ms' },
        { from: 'TPE', to: 'HKG', latency: '8ms' },
        { from: 'SGP', to: 'AMS', latency: '180ms' },
        { from: 'AMS', to: 'FRA', latency: '15ms' },
        { from: 'FRA', to: 'MCI', latency: '120ms' },
        { from: 'SJC', to: 'FMT', latency: '5ms' },
        { from: 'FMT', to: 'OSA', latency: '120ms' },
        { from: 'SGP', to: 'HKG', latency: '25ms' },
        { from: 'SGP', to: 'OSA', latency: '85ms' },
        { from: 'TPE', to: 'OSA', latency: '40ms' },
        { from: 'AMS', to: 'SGP', latency: '180ms' },
        { from: 'MCI', to: 'FRA', latency: '110ms' },
        { from: 'MCI', to: 'SJC', latency: '45ms' }
    ];

    const nodeMap = {};
    networkNodes.forEach(n => { nodeMap[n.code] = n; });

    function createCurve(from, to) {
        const mid = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
        const dx = to[0] - from[0], dy = to[1] - from[1];
        const dist = Math.sqrt(dx * dx + dy * dy);
        const curve = Math.min(dist * 0.15, 20);
        mid[0] += -dy * 0.001 * curve;
        mid[1] += dx * 0.001 * curve;
        const pts = [];
        for (let i = 0; i <= 50; i++) {
            const t = i / 50;
            pts.push([
                Math.pow(1-t,2)*from[0] + 2*(1-t)*t*mid[0] + t*t*to[0],
                Math.pow(1-t,2)*from[1] + 2*(1-t)*t*mid[1] + t*t*to[1]
            ]);
        }
        return pts;
    }

    map.on('load', function() {
        // Build connection lines as GeoJSON
        const lineFeatures = connections.map(conn => {
            const a = nodeMap[conn.from], b = nodeMap[conn.to];
            if (!a || !b) return null;
            return {
                type: 'Feature',
                properties: { from: conn.from, to: conn.to, latency: conn.latency },
                geometry: { type: 'LineString', coordinates: createCurve([a.lng, a.lat], [b.lng, b.lat]) }
            };
        }).filter(Boolean);

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

        // Build node points as GeoJSON
        const nodeFeatures = networkNodes.map(node => ({
            type: 'Feature',
            properties: {
                code: node.code, name: node.name, country: node.country,
                type: node.type, providers: node.providers.join(', ')
            },
            geometry: { type: 'Point', coordinates: [node.lng, node.lat] }
        }));

        map.addSource('nodes', { type: 'geojson', data: { type: 'FeatureCollection', features: nodeFeatures } });

        // Outer glow
        map.addLayer({
            id: 'node-glow',
            type: 'circle',
            source: 'nodes',
            paint: {
                'circle-radius': 10,
                'circle-color': '#4ecdc4',
                'circle-opacity': 0.15
            }
        });

        // Main node circles
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

        // Node labels
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
            paint: {
                'text-color': '#ffffff',
                'text-halo-color': 'rgba(0,0,0,0.7)',
                'text-halo-width': 1
            }
        });

        // Popup on click
        map.on('click', 'node-circles', function(e) {
            const p = e.features[0].properties;
            const nodeConns = connections.filter(c => c.from === p.code || c.to === p.code);
            const connHtml = nodeConns.map(c => {
                const target = c.from === p.code ? c.to : c.from;
                const targetNode = nodeMap[target];
                return '<li>' + targetNode.name + ' (' + c.latency + ')</li>';
            }).join('');

            const html = '<div style="min-width:200px;">' +
                '<h3 style="margin:0 0 10px 0;color:#333;">' + p.code + ' - ' + p.name + '</h3>' +
                '<p style="margin:5px 0;"><strong>Country:</strong> ' + p.country + '</p>' +
                '<p style="margin:5px 0;"><strong>Type:</strong> ' + p.type + '</p>' +
                '<p style="margin:5px 0;"><strong>Providers:</strong> ' + p.providers + '</p>' +
                (connHtml ? '<p style="margin:10px 0 5px 0;"><strong>Connections:</strong></p><ul style="margin:0;padding-left:20px;">' + connHtml + '</ul>' : '') +
                '</div>';

            new mapboxgl.Popup({ offset: 15 })
                .setLngLat(e.features[0].geometry.coordinates)
                .setHTML(html)
                .addTo(map);
        });

        // Cursor style
        map.on('mouseenter', 'node-circles', function() { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', 'node-circles', function() { map.getCanvas().style.cursor = ''; });

        // Legend
        const legend = document.createElement('div');
        legend.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
        legend.style.cssText = 'padding:10px;background:rgba(15,20,30,0.9);border-radius:8px;font-size:12px;line-height:20px;color:#fff;';
        legend.innerHTML = '<div style="font-weight:bold;margin-bottom:4px;">Node Types</div>' +
            '<div><span style="color:#4ecdc4;">●</span> Main Node</div>' +
            '<div><span style="color:#45b7d1;">●</span> PoP Node</div>';
        document.getElementById('mapid').appendChild(legend);
    });
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
