var map = null;
var overlay = null;

function goMap() {
  var query = getUrlVars();
  location.href = "/sealevel_osaka/map.html?level=" + query['level'];
}

function wait() {
  $(this).delay(1000).queue(function() {
    $(this).dequeue();
    goMap();
  });
}

function initialize() {

    var query = getUrlVars();

    //Google Maps API初期化
    geocoder = new google.maps.Geocoder();
		var mapOptions = {
  		zoom: 13,
  		center: new google.maps.LatLng(34.6706714,135.423291),
      // roadmap は、デフォルトの道路地図ビューを表示します。これは、デフォルトのマップタイプです。
      // satellite は、Google Earth 航空写真を表示します。
      // hybrid は、通常のビューと航空写真ビューの複合ビューを表示します。
      // terrain は、地形情報に基づいた物理地図を表示します。
  		mapTypeId: 'satellite',
      scrollwheel: false,
      draggable: false,
      disableDoubleClickZoom: false,
      zoomControl:false,
      streetViewControl:false
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    setOverlay(query['level']);

    //背景色設定
    var m = query['level']
    if( m > 5 ) m = 5
    setTopImg(m)
}

//背景設定
function setTopImg(m) {
  document.getElementById('top_img').src = "img/" + m + "m.png";
}

function setSuii(m) {
  if(m == 0) {
    overlay.setMap(null);
  }
  else {
    overlay.setMap(null);
    setOverlay(m);
  }
}

function goSpace() {
  location.href = "/"
}

function setOverlay(m) {

  var bounds = new google.maps.LatLngBounds();

  //画像の配置位置指定(34.671942, 135.411618)
  // 縦,横
  bounds.extend(new google.maps.LatLng(34.725, 135.2995));
  bounds.extend(new google.maps.LatLng(34.6202, 135.5225));

  //グラウンドオーバーレイを作成
  overlay = new google.maps.GroundOverlay("img/s" + m + "m.png", bounds, {
    opacity : 0.5,
    clickable : false
  });

  //マップに設定
  overlay.setMap(map);
}
var val = getUrlVars();


function getUrlVars()
{
    var vars = [], max = 0, hash = "", array = "";
    var url = window.location.search;

    hash  = url.slice(1).split('&');
    max = hash.length;
    for (var i = 0; i < max; i++) {
        array = hash[i].split('=');
        vars.push(array[0]);
        vars[array[0]] = array[1];
    }

    return vars;
}
