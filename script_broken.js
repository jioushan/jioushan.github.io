// DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    initializeLoading();
    initializeTheme();
    initializeNavigation();
    initializeScrollEffects                border: 2px solid white;
                box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                cursor: pointer;
                transition: transform 0.2s ease;
            " 
            onmouseover="this.style.transform='scale(1.3)'" 
            onmouseout="this.style.transform='scale(1)'"></div>`,eMap();
    initializeLookingGlass();
    initializeStats();
    initializeParticles();
    initializeBackToTop();
    initializeStats();
    initializeParticles();
    initializeBackToTop();
    
    // Remove loading screen after everything is loaded
    setTimeout(() => {
        hideLoadingScreen();
    }, 1500);
}

// Theme management
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentHour = new Date().getHours();
    
    // Auto theme based on time (6 AM to 6 PM = light, otherwise dark)
    const shouldBeDark = currentHour < 6 || currentHour >= 18;
    
    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || (shouldBeDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', initialTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
    
    // Update theme automatically based on time
    setInterval(() => {
        const hour = new Date().getHours();
        const shouldBeDark = hour < 6 || hour >= 18;
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (!localStorage.getItem('theme')) {
            const autoTheme = shouldBeDark ? 'dark' : 'light';
            if (currentTheme !== autoTheme) {
                document.documentElement.setAttribute('data-theme', autoTheme);
            }
        }
    }, 60000); // Check every minute
}
function initializeLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    
    function hideLoadingScreen() {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }
    
    // Hide loading screen when page is fully loaded
    window.addEventListener('load', () => {
        setTimeout(hideLoadingScreen, 1000);
    });
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Navigation
function initializeNavigation() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const header = document.querySelector('header');
    
    // Mobile menu toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }
    
    // Header scroll effect
    if (header) {
        let lastScrollY = 0;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.backdropFilter = 'blur(20px)';
                header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
                header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.05)';
            }
            
            // Hide header on scroll down, show on scroll up
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }
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
            }
        });
    }, observerOptions);
    
    // Observe elements for fade-in animation
    const elements = document.querySelectorAll('.feature-card, .stat-item');
    elements.forEach((element, index) => {
        element.classList.add('fade-in');
        element.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(element);
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
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
    
    // 创建自定义图标
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
                border: 3px solid white;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 11px;
                animation: pulse 2s infinite;
            ">${type === 'main' ? '�' : '📡'}</div>
            <style>
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
            </style>`,
            iconSize: [size, size],
            iconAnchor: [size/2, size/2]
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
            <div><span style="color: #4ecdc4;">🌐</span> Main Node</div>
            <div><span style="color: #45b7d1;">📡</span> PoP Node</div>
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
    
    lgSubmit.addEventListener('click', () => {
        const target = lgInput.value.trim();
        if (!target) {
            showError('Please enter an IP address or domain name');
            return;
        }
        
        if (!isValidTarget(target)) {
            showError('Please enter a valid IP address or domain name');
            return;
        }
        
        performTrace(target);
    });
    
    lgInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            lgSubmit.click();
        }
    });
    
    function isValidTarget(target) {
        // Basic validation for IP address or domain
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
        
        return ipRegex.test(target) || domainRegex.test(target);
    }
    
    function performTrace(target) {
        lgSubmit.classList.add('loading');
        lgSubmit.disabled = true;
        
        // Clear previous results
        lgResults.innerHTML = '';
        
        // Show loading state
        showLoadingResult(target);
        
        const apiUrl = `https://mtr.api.jsmsr.eu.org/mtr?ip=${encodeURIComponent(target)}`;
        
        console.log('Performing trace to:', target);
        console.log('API URL:', apiUrl);
        
        // Add timeout to fetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            signal: controller.signal
        })
            .then(response => {
                clearTimeout(timeoutId);
                console.log('Response status:', response.status);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                // Try to parse as JSON first, then as text
                return response.text().then(text => {
                    try {
                        return JSON.parse(text);
                    } catch (e) {
                        return text;
                    }
                });
            })
            .then(data => {
                console.log('API Response:', data);
                setTimeout(() => {
                    displayResults(target, data);
                }, 1000);
            })
            .catch(error => {
                clearTimeout(timeoutId);
                console.error('Error performing trace:', error);
                
                let errorMessage;
                if (error.name === 'AbortError') {
                    errorMessage = `Request timeout while tracing ${target}. The API might be slow or unavailable.`;
                } else if (error.message.includes('CORS')) {
                    errorMessage = `CORS error when tracing ${target}. This is a browser security limitation.`;
                } else if (error.message.includes('Failed to fetch')) {
                    errorMessage = `Network error when tracing ${target}. Please check your internet connection or try again later.`;
                } else {
                    errorMessage = `Failed to trace ${target}: ${error.message}`;
                }
                
                setTimeout(() => {
                    showError(errorMessage);
                }, 1000);
            })
            .finally(() => {
                lgSubmit.classList.remove('loading');
                lgSubmit.disabled = false;
            });
    }
    
    function showLoadingResult(target) {
        lgResults.innerHTML = `
            <div class="trace-result loading-result">
                <div class="trace-header">
                    <div class="trace-target">Tracing route to ${target}</div>
                    <div class="trace-timestamp">${new Date().toLocaleString()}</div>
                </div>
                <div class="trace-data">
                    <div class="loading-animation">
                        <div class="spinner"></div>
                        <div class="loading-text">
                            <div class="loading-dots">
                                <span>Initiating network trace</span>
                                <span class="dots">
                                    <span>.</span>
                                    <span>.</span>
                                    <span>.</span>
                                </span>
                            </div>
                            <div class="loading-steps">
                                <div class="step active">🔍 Resolving hostname</div>
                                <div class="step">🌐 Tracing network path</div>
                                <div class="step">📊 Analyzing results</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Animate loading steps
        const steps = lgResults.querySelectorAll('.step');
        let currentStep = 0;
        
        const stepInterval = setInterval(() => {
            if (currentStep < steps.length - 1) {
                steps[currentStep].classList.remove('active');
                currentStep++;
                steps[currentStep].classList.add('active');
            } else {
                clearInterval(stepInterval);
            }
        }, 800);
    }
    
    function displayResults(target, data) {
        const timestamp = new Date().toLocaleString();
        
        lgResults.innerHTML = `
            <div class="trace-result">
                <div class="trace-header">
                    <div class="trace-target">Trace results for ${target}</div>
                    <div class="trace-timestamp">${timestamp}</div>
                </div>
                <div class="trace-data">${formatTraceData(data)}</div>
            </div>
        `;
    }
    
    function formatTraceData(data) {
        if (typeof data === 'string') {
            return data;
        }
        
        if (typeof data === 'object') {
            // Handle the API response format
            if (data.result && Array.isArray(data.result)) {
                return data.result.join('\n');
            }
            
            if (data.output) {
                return data.output;
            }
            
            if (data.traceroute) {
                return data.traceroute;
            }
            
            if (data.mtr) {
                return data.mtr;
            }
            
            // Format JSON data nicely
            return JSON.stringify(data, null, 2);
        }
        
        return 'No trace data available';
    }
    
    function showError(message) {
        lgResults.innerHTML = `
            <div class="trace-result">
                <div class="trace-header">
                    <div class="trace-target">Error</div>
                    <div class="trace-timestamp">${new Date().toLocaleString()}</div>
                </div>
                <div class="error-message">${message}</div>
            </div>
        `;
    }
}
function initializeStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

function animateCounter(element) {
    const target = parseFloat(element.dataset.target);
    const duration = 2000;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = target * easeOut;
        
        if (target % 1 === 0) {
            element.textContent = Math.floor(current);
        } else {
            element.textContent = current.toFixed(1);
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target % 1 === 0 ? target : target.toFixed(1);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Particles animation
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        animation: float ${Math.random() * 3 + 2}s infinite linear;
        left: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 2}s;
    `;
    
    container.appendChild(particle);
    
    // Add CSS animation if not already added
    if (!document.getElementById('particle-styles')) {
        const style = document.createElement('style');
        style.id = 'particle-styles';
        style.textContent = `
            @keyframes float {
                0% {
                    transform: translateY(100vh) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Back to top and theme controls
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    const themeToggle = document.getElementById('theme-toggle');
    
    if (!backToTopBtn && !themeToggle) return;
    
    window.addEventListener('scroll', () => {
        const showControls = window.scrollY > 300;
        
        if (backToTopBtn) {
            if (showControls) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
        
        if (themeToggle) {
            if (showControls) {
                themeToggle.classList.add('show');
            } else {
                themeToggle.classList.remove('show');
            }
        }
    });
    
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events
const debouncedScrollHandler = debounce(() => {
    // Scroll optimizations can be added here
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScrollHandler, { passive: true });

// PWA support (if needed in future)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker registration can be added here
    });
}

// Console welcome message
console.log(`
%c🌐 JSMSR Network Website
%cProfessional Network Infrastructure Provider
%cVersion: 3.0 | Built with ❤️ | Features: 3D Globe, Looking Glass, Auto Theme
`, 
'color: #4a9eff; font-size: 20px; font-weight: bold;',
'color: #666; font-size: 14px;',
'color: #888; font-size: 12px;'
);
