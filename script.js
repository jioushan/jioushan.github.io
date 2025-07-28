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

// OpenStreetMap initialization
function initializeMap() {
    // 检查是否存在地图容器
    if (!document.getElementById('mapid')) return;
    
    // 初始化地图，使用 worldCopyJump 并将中心点偏向亚洲
    const map = L.map('mapid', {
        worldCopyJump: true,
        zoomControl: true,
        scrollWheelZoom: true
    }).setView([20, 160], 2); // 注意这里经度偏向东经，地图右边是美洲

    // 添加OpenStreetMap瓦片层
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        noWrap: false
    }).addTo(map);
    
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
        { from: 'NRT', to: 'OSA', latency: '8ms', active: true },
        { from: 'OSA', to: 'TPE', latency: '35ms', active: true },
        { from: 'TPE', to: 'HKG', latency: '8ms', active: true },
        { from: 'SGP', to: 'AMS', latency: '180ms', active: true },
        { from: 'AMS', to: 'FRA', latency: '15ms', active: true },
        { from: 'FRA', to: 'MCI', latency: '120ms', active: true },
        { from: 'SJC', to: 'FMT', latency: '5ms', active: true },
        { from: 'FMT', to: 'OSA', latency: '120ms', active: true },
        { from: 'SGP', to: 'HKG', latency: '25ms', active: true },
        { from: 'SGP', to: 'OSA', latency: '85ms', active: true },
        { from: 'TPE', to: 'OSA', latency: '40ms', active: true },
        { from: 'AMS', to: 'SGP', latency: '180ms', active: true },
        { from: 'MCI', to: 'FRA', latency: '110ms', active: true },
        { from: 'MCI', to: 'SJC', latency: '45ms', active: true }
    ];
    
    // 创建自定义图标 - 纯锚点样式
    function createCustomIcon(type) {
        let color, size;
        switch(type) {
            case 'main':
                color = '#4ecdc4';
                size = 16;
                break;
            case 'pop':
                color = '#45b7d1';
                size = 12;
                break;
            default:
                color = '#45b7d1';
                size = 12;
        }
        
        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                background-color: ${color};
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                cursor: pointer;
                transition: transform 0.2s ease;
            " 
            onmouseover="this.style.transform='scale(1.3)'" 
            onmouseout="this.style.transform='scale(1)'"></div>`,
            iconSize: [size + 4, size + 4],
            iconAnchor: [(size + 4)/2, (size + 4)/2]
        });
    }
    
    // 添加节点到地图
    const markers = {};
    networkNodes.forEach(node => {
        const marker = L.marker([node.lat, node.lng], {
            icon: createCustomIcon(node.type)
        }).addTo(map);
        
        // 创建弹出窗口内容
        const connectionsInfo = connections
            .filter(conn => conn.from === node.code || conn.to === node.code)
            .map(conn => {
                const targetCode = conn.from === node.code ? conn.to : conn.from;
                const targetNode = networkNodes.find(n => n.code === targetCode);
                return `<li>${targetNode.name} (${conn.latency})</li>`;
            }).join('');
        
        const popupContent = `
            <div style="min-width: 200px;">
                <h3 style="margin: 0 0 10px 0; color: #333;">${node.code} - ${node.name}</h3>
                <p style="margin: 5px 0;"><strong>Country:</strong> ${node.country}</p>
                <p style="margin: 5px 0;"><strong>Type:</strong> ${node.type}</p>
                <p style="margin: 5px 0;"><strong>Providers:</strong> ${node.providers.join(', ')}</p>
                ${connectionsInfo ? `
                    <p style="margin: 10px 0 5px 0;"><strong>Connections:</strong></p>
                    <ul style="margin: 0; padding-left: 20px;">${connectionsInfo}</ul>
                ` : ''}
            </div>
        `;
        
        marker.bindPopup(popupContent);
        markers[node.code] = marker;
    });
    
    // 添加连接线
    connections.forEach(conn => {
        const fromNode = networkNodes.find(n => n.code === conn.from);
        const toNode = networkNodes.find(n => n.code === conn.to);
        
        if (fromNode && toNode) {
            const polyline = L.polyline([
                [fromNode.lat, fromNode.lng],
                [toNode.lat, toNode.lng]
            ], {
                color: '#4ecdc4',
                weight: 3,
                opacity: 0.7,
                dashArray: '10, 5'
            }).addTo(map);
            
            // 添加连接线弹出窗口
            polyline.bindPopup(`
                <div style="text-align: center;">
                    <strong>${fromNode.name} ⟷ ${toNode.name}</strong><br>
                    <span style="color: #4ecdc4; font-weight: bold;">${conn.latency}</span>
                </div>
            `);
        }
    });
    
    // 添加图例
    const legend = L.control({position: 'bottomright'});
    legend.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'legend');
        div.style.cssText = `
            background: white;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            font-size: 12px;
            line-height: 18px;
        `;
        div.innerHTML = `
            <h4 style="margin: 0 0 8px 0;">Node Types</h4>
            <div><span style="color: #4ecdc4;">●</span> Main Node</div>
            <div><span style="color: #45b7d1;">●</span> PoP Node</div>
        `;
        return div;
    };
    legend.addTo(map);
    
    // 响应式处理
    window.addEventListener('resize', function() {
        setTimeout(function() {
            map.invalidateSize();
        }, 100);
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

// Particle system
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position and animation delay
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        particlesContainer.appendChild(particle);
    }
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
