var map = null;
var overlay = null;

function initialize() {

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

    //マップ上の表示領域が変化した際の処理
    google.maps.event.addListener(map, 'bounds_changed', function() {
		var latOutput = document.getElementById('lat');
		var lngOutput = document.getElementById('lng');

		var swlatOutput = document.getElementById('swlat');
		var swlngOutput = document.getElementById('swlng');

		//北東緯度経度表示エレメント
		var nelatOutput = document.getElementById('nelat');
		var nelngOutput = document.getElementById('nelng');

		var latlngBounds = map.getBounds();

		//マップ中心の緯度経度取得
		var centerLatlng = latlngBounds.getCenter();
		var ceLat = centerLatlng.lat();
		var ceLng = centerLatlng.lng();

		latOutput.innerText = ceLat;
		lngOutput.innerText = ceLng;

		//マップ南西の緯度経度取得
		var swLatlng = latlngBounds.getSouthWest();
		var swlat = swLatlng.lat();
		var swlng = swLatlng.lng();
		swlatOutput.innerText = swlat;
		swlngOutput.innerText = swlng;

		//マップ北東の緯度経度取得
		var neLatlng = latlngBounds.getNorthEast();
		var nelat = neLatlng.lat();
		var nelng = neLatlng.lng();
		nelatOutput.innerText = nelat;
		nelngOutput.innerText = nelng;
    });

    setOverlay(0);
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
