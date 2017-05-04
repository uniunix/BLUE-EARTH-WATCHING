// google map インスタンス
var map = null;
// overlay画像 インスタンス
var overlay = null;
    
    
// 各地の地図情報
var map_data = {
    'osaka': {
        map_pos: [34.6706714, 135.423291],
        image_pos: [
            34.725, 135.2995,   // 北,東
            34.6202, 135.5225   // 南,西
        ],
        level: 13,
        mapType: 'hybrid',
    },
    'washington': {
        map_pos: [38.649898, -76.110904],
        image_pos: [
            40.53, -72.95,      // 北,東
            36.79, -79.27       // 南,西
        ],
        level: 9,
        mapType:'terrain',
    },
    'houston': {
        map_pos: [29.568426,-94.817874],
        image_pos: [
            31.52, -91.22,      // 北,東
            27.91, -98.41       // 南,西
        ],
        level: 9,
        mapType:'terrain',
    }
}

// 地図画面へ遷移
function goMap() {
    var query = getUrlVars()
    var level = query['level']
    var map = query['city']

    if (level == undefined) level = 0
    if (map == undefined) map = 'osaka'

    location.href = "./map.html?level=" + level + "&city=" + map
}

// タイマーで少し待った後画面遷移
function waitTransMap() {
    $(this).delay(1000).queue(function() {
        $(this).dequeue();
        goMap();
    });
}


// トップ画面へ戻る
function goSpace() {
    location.href = "/"
}

function initialize() {

    var query = getUrlVars();
    var city = query['city']
    var map_pos = map_data[city]['map_pos']
    var m = query['level']
    if (m > 5) m = 5

    //Google Maps API初期化
    geocoder = new google.maps.Geocoder();
    var mapOptions = {
        zoom: map_data[city]['level'],
        center: new google.maps.LatLng(map_pos[0], map_pos[1]),
        // roadmap は、デフォルトの道路地図ビューを表示します。これは、デフォルトのマップタイプです。
        // satellite は、Google Earth 航空写真を表示します。
        // hybrid は、通常のビューと航空写真ビューの複合ビューを表示します。
        // terrain は、地形情報に基づいた物理地図を表示します。
        mapTypeId: map_data[city]['mapType'],
        scrollwheel: false,
        draggable: false,
        disableDoubleClickZoom: false,
        zoomControl: false,
        streetViewControl: false
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    
    //オーバーレイ画像設定
    setOverlay(m);

    //背景色設定
    setTopImg(m, city)
}

//背景設定
function setTopImg(m, city) {
    document.getElementById('top_img').src = "img/" + city + "/" + m + "m.png";
    document.getElementById('top_txt').src = "img/" + city + "/" + m + "m_info.png";
}

//水位設定
function setSuii(m) {
    if (m == 0) {
        overlay.setMap(null);
    } else {
        overlay.setMap(null);
        setOverlay(m);
    }
}

// googlemap の overlay画像設定
function setOverlay(m) {
    var query = getUrlVars();
    var city = query['city']
    var img_pos = map_data[city]['image_pos']
    var bounds = new google.maps.LatLngBounds();

    //画像の配置位置指定(34.671942, 135.411618)
    // 北,東
    // 南,南
    bounds.extend(new google.maps.LatLng(img_pos[0], img_pos[1]));
    bounds.extend(new google.maps.LatLng(img_pos[2], img_pos[3]));

    //グラウンドオーバーレイを作成
    overlay = new google.maps.GroundOverlay("img/" + city + "/s" + m + "m.png", bounds, {
        opacity: 0.5,
        clickable: false
    });

    //マップに設定
    overlay.setMap(map);
}

// query文字列取得
var val = getUrlVars();

function getUrlVars() {
    var vars = [],
        max = 0,
        hash = "",
        array = "";
    var url = window.location.search;

    hash = url.slice(1).split('&');
    max = hash.length;
    for (var i = 0; i < max; i++) {
        array = hash[i].split('=');
        vars.push(array[0]);
        vars[array[0]] = array[1];
    }

    return vars;
}