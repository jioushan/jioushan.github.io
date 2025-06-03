document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll("nav ul li a");
    const backToTopButton = document.getElementById("back-to-top");

    // 平滑滚动
    links.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            document.querySelector(link.getAttribute("href")).scrollIntoView({
                behavior: "smooth"
            });
        });
    });

    // 显示/隐藏回到顶部按钮
    window.addEventListener("scroll", function() {
        backToTopButton.style.display = window.scrollY > 300 ? "block" : "none";
    });

    backToTopButton.addEventListener("click", function() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // 初始化地图
    const map = L.map('mapid').setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // 更新后的节点列表（已删除Kansas，新增Kansas City, Osaka, Okinawa）
    const locations = [
        { coords: [37.3382, -121.8863], name: "San José", info: "San José Node" },
        { coords: [22.3193, 114.1694], name: "Hong Kong", info: "Hong Kong Route" },
        { coords: [50.1109, 8.6821], name: "Frankfurt", info: "Frankfurt Route" },
        { coords: [60.1695, 24.9354], name: "Helsinki", info: "Helsinki Node" },
        { coords: [35.6895, 139.6917], name: "Tokyo", info: "Tokyo Node" },
        { coords: [52.3676, 4.9041], name: "Amsterdam", info: "Amsterdam Node" },
        { coords: [25.0330, 121.5654], name: "Taipei", info: "Taipei Node" },
        { coords: [1.3521, 103.8198], name: "Singapore", info: "Singapore Node" },
        { coords: [39.0997, -94.5786], name: "Kansas City", info: "Missouri - Kansas City Node" },
        { coords: [34.6937, 135.5023], name: "Osaka", info: "Osaka Node" },
        { coords: [26.2124, 127.6809], name: "Okinawa", info: "Okinawa Node" }
    ];

    const markers = locations.map(loc => {
        return L.marker(loc.coords).addTo(map)
            .bindPopup(`<b>${loc.name}</b><br>${loc.info}`);
    });

    // 名称映射方便连接
    const locMap = {};
    locations.forEach(loc => { locMap[loc.name] = loc.coords; });

    // 更新后的连线路径
    const routes = [
        [locMap["Helsinki"], locMap["Frankfurt"]],
        [locMap["Hong Kong"], locMap["Amsterdam"]],
        [locMap["Amsterdam"], locMap["Frankfurt"]],
        [locMap["Hong Kong"], locMap["Taipei"]],
        [locMap["Hong Kong"], locMap["Singapore"]],
        [locMap["San José"], locMap["Tokyo"]],
        [locMap["San José"], locMap["Kansas City"]],
        [locMap["Tokyo"], locMap["Osaka"]],
        [locMap["Taipei"], locMap["Osaka"]],
        [locMap["Taipei"], locMap["Hong Kong"]],
        [locMap["Tokyo"], locMap["Okinawa"]]
    ];

    routes.forEach(route => {
        const polyline = L.polyline(route, { color: 'blue' }).addTo(map);
        map.fitBounds(polyline.getBounds());
    });
});
