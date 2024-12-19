document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll("nav ul li a");
    const backToTopButton = document.getElementById("back-to-top");

    // 平滑滚动到页面部分
    links.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            document.querySelector(link.getAttribute("href")).scrollIntoView({
                behavior: "smooth"
            });
        });
    });

    // 滚动到顶部按钮显示/隐藏逻辑
    window.addEventListener("scroll", function() {
        if (window.scrollY > 300) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    });

    backToTopButton.addEventListener("click", function() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // 初始化地图
    const map = L.map('mapid').setView([20, 0], 2);

    // 设置地图图层
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // 添加标记和信息卡
    const locations = [
        { coords: [39.0119, -98.4842], name: "Kansas", info: "Kansas Route" },
        { coords: [37.3382, -121.8863], name: "San José", info: "San jose Node" },
        { coords: [22.3193, 114.1694], name: "Hong Kong", info: "Hong Kong Route" },
        { coords: [50.1109, 8.6821], name: "Frankfurt", info: "Frankfurt Route" },
        { coords: [60.1695, 24.9354], name: "Helsinki", info: "Helsinki Node" },
        { coords: [35.6895, 139.6917], name: "Tokyo", info: "Tokyo Node" },
        { coords: [52.3676, 4.9041], name: "Amsterdam", info: "Amsterdam Node" },
        { coords: [25.0330, 121.5654], name: "Taipei", info: "Taipei Node" },
        { coords: [1.3521, 103.8198], name: "Singapore", info: "Singapore Node" },
        { coords: [37.5665, 126.9780], name: "Seoul", info: "Seoul Node" }
    ];

    const markers = locations.map(loc => {
        return L.marker(loc.coords).addTo(map)
            .bindPopup(`<b>${loc.name}</b><br>${loc.info}`);
    });

    // 添加连线
    const routes = [
        [locations[3].coords, locations[0].coords], // Frankfurt to Kansas
        [locations[4].coords, locations[3].coords], // Helsinki to Frankfurt
        [locations[1].coords, locations[5].coords, locations[2].coords], // San José to Tokyo to Hong Kong
        [locations[2].coords, locations[6].coords], // Hong Kong to Amsterdam
        [locations[6].coords, locations[3].coords], // Amsterdam to Frankfurt
        [locations[2].coords, locations[7].coords], // Hong Kong to Taipei
        [locations[2].coords, locations[8].coords], // Hong Kong to Singapore
        [locations[2].coords, locations[9].coords], // Hong Kong to Seoul
        [locations[1].coords, locations[0].coords]  // San José to Kansas
    ];

    routes.forEach(route => {
        const polyline = L.polyline(route, {color: 'blue'}).addTo(map);
        map.fitBounds(polyline.getBounds());
    });
});
