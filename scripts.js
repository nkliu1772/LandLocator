// ------------------------------
// 全域變數
// ------------------------------
var showMarkerText = true;  // 預設預設 marker 的文字顯示狀態

// ------------------------------
// 初始化地圖
// ------------------------------
var map = L.map('map').setView([25.000659102852, 121.51006510846], 14);
L.tileLayer('https://wmts.nlsc.gov.tw/wmts/EMAP5/{Style}/{TileMatrixSet}/{z}/{y}/{x}', {
  attribution: '&copy; <a href="http://maps.nlsc.gov.tw/S09SOA/">國土測繪圖資服務雲</a> contributors',
  Style: 'default',
  TileMatrixSet: 'GoogleMapsCompatible',
  maxNativeZoom: 20,
  maxZoom: 20
}).addTo(map);

// ------------------------------
// 建立分組：第一個標的與比較標的的 Marker 與形狀
// ------------------------------
var firstMarkerGroup = L.layerGroup().addTo(map);
var otherMarkerGroup = L.layerGroup().addTo(map);
var firstShapeGroup = L.layerGroup().addTo(map);
var otherShapeGroup = L.layerGroup().addTo(map);

// ------------------------------
// 格式化地號
// ------------------------------
function formatLandNumber(landNumber) {
  const landStr = landNumber.toString().padStart(8, '0');
  const motherNumber = parseInt(landStr.slice(0, 4), 10);
  const childNumber = parseInt(landStr.slice(4), 10);
  return childNumber === 0 ? `${motherNumber}` : `${motherNumber}-${childNumber}`;
}

// ------------------------------
// 背景色選項設定函式
// ------------------------------
function setMarkerBg(prefix, color) {
  document.getElementById(prefix + "-bg").value = color;
  var options = document.querySelectorAll("#" + prefix + "-bg-options .color-option");
  options.forEach(function(el) {
    el.style.border = (el.getAttribute("data-color") === color) ? "2px solid #000" : "2px solid transparent";
  });
}

// ------------------------------
// Marker 設定控制面板（浮動面板）
// ------------------------------
var MarkerSettingsControl = L.Control.extend({
  options: { position: 'topright' },
  onAdd: function(map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control marker-settings-control');
    container.style.background = 'white';
    container.style.padding = '10px';
    container.style.maxWidth = '220px';
    container.style.fontSize = '14px';
    container.style.boxShadow = '0 1px 5px rgba(0,0,0,0.65)';
    container.innerHTML = `
      <div style="text-align:right; margin-bottom:5px;">
        <button id="marker-settings-close" style="border:none; background:none; cursor:pointer; color: black;">X</button>
      </div>
      <div>
        <h4 style="margin:0 0 5px 0;">第一個標的</h4>
        Marker 文字: <input type="text" id="marker1-text" value="勘估標的" style="width:100%; margin-bottom:5px;" /><br>
        背景:
        <div id="marker1-bg-options" style="margin-bottom:5px;">
          <span class="color-option" data-color="red" onclick="setMarkerBg('marker1','red')" style="display:inline-block; width:20px; height:20px; background:red; margin-right:5px; border:2px solid #000; cursor:pointer;"></span>
          <span class="color-option" data-color="blue" onclick="setMarkerBg('marker1','blue')" style="display:inline-block; width:20px; height:20px; background:blue; margin-right:5px; border:2px solid transparent; cursor:pointer;"></span>
          <span class="color-option" data-color="green" onclick="setMarkerBg('marker1','green')" style="display:inline-block; width:20px; height:20px; background:green; margin-right:5px; border:2px solid transparent; cursor:pointer;"></span>
          <span class="color-option" data-color="orange" onclick="setMarkerBg('marker1','orange')" style="display:inline-block; width:20px; height:20px; background:orange; margin-right:5px; border:2px solid transparent; cursor:pointer;"></span>
          <span class="color-option" data-color="yellow" onclick="setMarkerBg('marker1','yellow')" style="display:inline-block; width:20px; height:20px; background:yellow; margin-right:5px; border:2px solid transparent; cursor:pointer;"></span>
        </div>
        <input type="hidden" id="marker1-bg" value="red" />
        Marker 類型:
        <div>
          <label style="margin-right:5px;"><input type="radio" name="marker1-type" value="custom" checked> 自訂圖示</label>
          <label><input type="radio" name="marker1-type" value="default"> 預設 marker</label>
        </div>
      </div>
      <hr style="margin:8px 0;">
      <div>
        <h4 style="margin:0 0 5px 0;">比較標的</h4>
        Marker 文字: <input type="text" id="marker2-text" value="比較標的" style="width:100%; margin-bottom:5px;" /><br>
        背景:
        <div id="marker2-bg-options" style="margin-bottom:5px;">
          <span class="color-option" data-color="blue" onclick="setMarkerBg('marker2','blue')" style="display:inline-block; width:20px; height:20px; background:blue; margin-right:5px; border:2px solid #000; cursor:pointer;"></span>
          <span class="color-option" data-color="red" onclick="setMarkerBg('marker2','red')" style="display:inline-block; width:20px; height:20px; background:red; margin-right:5px; border:2px solid transparent; cursor:pointer;"></span>
          <span class="color-option" data-color="green" onclick="setMarkerBg('marker2','green')" style="display:inline-block; width:20px; height:20px; background:green; margin-right:5px; border:2px solid transparent; cursor:pointer;"></span>
          <span class="color-option" data-color="orange" onclick="setMarkerBg('marker2','orange')" style="display:inline-block; width:20px; height:20px; background:orange; margin-right:5px; border:2px solid transparent; cursor:pointer;"></span>
          <span class="color-option" data-color="yellow" onclick="setMarkerBg('marker2','yellow')" style="display:inline-block; width:20px; height:20px; background:yellow; margin-right:5px; border:2px solid transparent; cursor:pointer;"></span>
        </div>
        <input type="hidden" id="marker2-bg" value="blue" />
        Marker 類型:
        <div>
          <label style="margin-right:5px;"><input type="radio" name="marker2-type" value="custom" checked> 自訂圖示</label>
          <label><input type="radio" name="marker2-type" value="default"> 預設 marker</label>
        </div>
        起始數字: <input type="number" id="marker2-start" value="1" style="width:100%; margin-top:5px;"/>
      </div>
      <button id="marker-settings-submit" style="width:100%; margin-top:5px; padding:6px 12px; font-size:0.9rem;">送出設定</button>
    `;
    setTimeout(function(){
      var closeBtn = document.getElementById('marker-settings-close');
      closeBtn.addEventListener('click', function(){ container.style.display = 'none'; });
    }, 0);
    setTimeout(function(){
      var submitBtn = document.getElementById('marker-settings-submit');
      submitBtn.addEventListener('click', function(){ updateMarkers(); });
    }, 0);
    window.markerSettingsControlContainer = container;
    L.DomEvent.disableClickPropagation(container);
    return container;
  }
});
map.addControl(new MarkerSettingsControl());

// ------------------------------
// 切換控制面板按鈕（位於地圖左下角）
// ------------------------------
var MarkerSettingsToggleControl = L.Control.extend({
  options: { position: 'bottomleft' },
  onAdd: function(map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control marker-settings-toggle');
    container.style.background = 'white';
    container.style.padding = '5px';
    container.style.cursor = 'pointer';
    container.style.boxShadow = '0 1px 5px rgba(0,0,0,0.65)';
    container.innerHTML = 'Marker 設定';
    container.onclick = function() {
      var panel = window.markerSettingsControlContainer;
      if (panel) { panel.style.display = (panel.style.display === 'none' || panel.style.display === '') ? 'block' : 'none'; }
    };
    return container;
  }
});
map.addControl(new MarkerSettingsToggleControl());

// ------------------------------
// 建立 Marker（第一個與比較標的）
// ------------------------------
function createCustomMarker(lat, lng, defaultText, groupType, markerCounter) {
  let text, bgColor, markerType;
  if (groupType === 'first') {
    text = document.getElementById('marker1-text').value;
    if(text.trim() === "") { text = defaultText; }
    bgColor = document.getElementById('marker1-bg').value;
    markerType = document.querySelector('input[name="marker1-type"]:checked').value;
  } else {
    let baseText = document.getElementById('marker2-text').value;
    markerType = document.querySelector('input[name="marker2-type"]:checked').value;
    bgColor = document.getElementById('marker2-bg').value;
    if(baseText.trim() === "") { text = String(markerCounter); }
    else { text = baseText + markerCounter; }
  }
  
  if(markerType === "custom") {
    let textColor = (bgColor === 'orange' || bgColor === 'yellow') ? 'black' : 'white';
    const options = { draggable: true };
    const markerIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${bgColor}; color: ${textColor}; border-radius: 10px; padding: 5px 10px; text-align: center; font-size: 14px;">${text}</div>`,
      iconSize: [100, 30],
      iconAnchor: [50, 15]
    });
    options.icon = markerIcon;
    let marker = L.marker([lat, lng], options);
    marker.groupType = groupType;
    if(groupType === 'other') { marker.markerCounter = markerCounter; }
    return marker;
  } else if(markerType === "default") {
    var color = bgColor;
    var iconUrl;
    switch(color) {
      case 'red': iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png'; break;
      case 'blue': iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png'; break;
      case 'green': iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png'; break;
      case 'orange': iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png'; break;
      case 'yellow': iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png'; break;
      default: iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';
    }
    var defaultIcon = L.icon({
      iconUrl: iconUrl,
      shadowUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [12, -28],
      shadowSize: [41, 41]
    });
    const options = { draggable: true, icon: defaultIcon };
    let marker = L.marker([lat, lng], options);
    if(showMarkerText && text.trim() !== "") {
      marker.bindTooltip(text, { permanent: true, direction: 'top', offset: [0, -5], className: 'default-marker-tooltip' });
    } else {
      marker.unbindTooltip();
    }
    marker.groupType = groupType;
    if(groupType === 'other') { marker.markerCounter = markerCounter; }
    return marker;
  }
}

// ------------------------------
// 更新 Marker（送出設定時觸發）
// ------------------------------
function updateMarkers() {
  firstMarkerGroup.eachLayer(function(marker) {
    var latlng = marker.getLatLng();
    var newMarker = createCustomMarker(latlng.lat, latlng.lng, "勘估標的", "first");
    if(newMarker.options.icon) { marker.setIcon(newMarker.options.icon); }
    if(document.querySelector('input[name="marker1-type"]:checked').value === "default") {
      marker.unbindTooltip();
      if(showMarkerText) {
        marker.bindTooltip(document.getElementById('marker1-text').value || "勘估標的", { permanent: true, direction: 'top', offset: [0, -5], className: 'default-marker-tooltip' });
      }
    }
  });
  let newStart = parseInt(document.getElementById('marker2-start').value) || 1;
  let counter = newStart;
  otherMarkerGroup.eachLayer(function(marker) {
    marker.markerCounter = counter;
    var latlng = marker.getLatLng();
    var newMarker = createCustomMarker(latlng.lat, latlng.lng, "比較標的", "other", counter);
    if(newMarker.options.icon) { marker.setIcon(newMarker.options.icon); }
    if(document.querySelector('input[name="marker2-type"]:checked').value === "default") {
      marker.unbindTooltip();
      if(showMarkerText) {
        let baseText = document.getElementById('marker2-text').value;
        let tooltipText = (baseText.trim() === "" ? String(counter) : baseText + counter);
        marker.bindTooltip(tooltipText, { permanent: true, direction: 'top', offset: [0, -5], className: 'default-marker-tooltip' });
      }
    }
    counter++;
  });
}
// 格式化地號，移除「地號」關鍵字，改為「號」，並將台灣地名標準化
function formatLandInput(input) {
  const replacements = {
    "台北": "臺北",
    "台中": "臺中",
    "台南": "臺南",
    "台東": "臺東"
  };

  // 替換台灣地名
  Object.keys(replacements).forEach(key => {
    input = input.replace(new RegExp(key, 'g'), replacements[key]);
  });

  // 替換地號格式
  return input.replace(/地號$/, '號').trim();
}


// ------------------------------
// 查詢並顯示結果
// ------------------------------
async function queryMultipleLands() {
  const multiLandInput = document.getElementById('multi-land-id').value;
  const errorDiv = document.getElementById('multi-error');
  let resultHTML = '';
  errorDiv.textContent = '';

  if (!multiLandInput) {
    errorDiv.textContent = '請輸入至少一筆地號！';
    return;
  }

  try {
    // 處理地號，轉換「地號」為「號」
    const landList = multiLandInput
      .split(/[,，\n]+/) // 支援逗號或換行分隔
      .map(item => formatLandInput(item.trim())) // 自動轉換地號格式
      .filter(Boolean);
    
    if (landList.length === 0) { 
      throw new Error('輸入格式錯誤，請確認地號是否正確。'); 
    }

    const apiUrl = `https://twland.ronny.tw/index/search?${landList
      .map(land => `lands[]=${encodeURIComponent(land)}`)
      .join('&')}`;

    console.log("發送 API 查詢：", apiUrl); // ✅ Debug: 檢查發送的 URL

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`API 請求失敗：${response.status}`);

    const data = await response.json();

    if (data.notfound.length > 0) { 
      const notFoundList = data.notfound.map(obj => obj.query).filter(Boolean);
      if (notFoundList.length > 0) {
        throw new Error(`以下地號查無資料：${notFoundList.join(', ')}`);
      } else {
        throw new Error(`查無資料，請檢查輸入格式`);
      }
    }
    

    // 清空地圖上的圖層
    firstMarkerGroup.clearLayers();
    otherMarkerGroup.clearLayers();
    firstShapeGroup.clearLayers();
    otherShapeGroup.clearLayers();

    // 建立表格
    let tableContent = `
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>編號</th>
            <th>縣市</th>
            <th>鄉鎮</th>
            <th>地段</th>
            <th>地號</th>
            <th>經緯度座標</th>
          </tr>
        </thead>
        <tbody>
    `;

    var markerOtherCounter = parseInt(document.getElementById('marker2-start').value) || 1;

    data.features.forEach((feature, index) => {
      const properties = feature.properties;
      const xCenter = properties.xcenter.toFixed(6);
      const yCenter = properties.ycenter.toFixed(6);
      const latLonFormat = `${yCenter},${xCenter}`;
      const googleMapsLink = `https://www.google.com/maps/place/${latLonFormat}`;
      const formattedLandNumber = formatLandNumber(properties["地號"]);

      tableContent += `
        <tr>
          <td>${index === 0 ? "勘估標的" : 
              (document.getElementById('marker2-text').value.trim() === "" 
              ? markerOtherCounter 
              : document.getElementById('marker2-text').value + markerOtherCounter)}
          </td>
          <td>${properties["縣市"]}</td>
          <td>${properties["鄉鎮"]}</td>
          <td>${properties["地段"]}</td>
          <td>${formattedLandNumber}</td>
          <td><a href="${googleMapsLink}" target="_blank">${latLonFormat}</a></td>
        </tr>
      `;

      // 建立標記 (Marker)
      let marker;
      if (index === 0) {
        marker = createCustomMarker(yCenter, xCenter, "勘估標的", "first");
        firstMarkerGroup.addLayer(marker);
        let geoJsonLayer = L.geoJSON(feature);
        firstShapeGroup.addLayer(geoJsonLayer);
      } else {
        marker = createCustomMarker(yCenter, xCenter, "比較標的", "other", markerOtherCounter);
        markerOtherCounter++;
        otherMarkerGroup.addLayer(marker);
        let geoJsonLayer = L.geoJSON(feature);
        otherShapeGroup.addLayer(geoJsonLayer);
      }

      // 允許拖動標記
      marker.on('dragend', function(e) {
        const newPos = e.target.getLatLng();
        console.log(`Marker 新位置：${newPos.lat}, ${newPos.lng}`);
      });
    });

    tableContent += `</tbody></table>`;

    // 如果結果超過 4 筆，預設折疊表格，以旋轉三角形作為 toggle
    let resultArea = document.getElementById('resultArea');
    const rowCount = (new DOMParser().parseFromString(tableContent, 'text/html')).querySelectorAll('tbody tr').length;

    if (rowCount > 4) {
      resultArea.innerHTML = `
        <div id="toggleTable" class="collapsed">
          <div class="triangle"></div><span>顯示表格</span>
        </div>
        <div id="resultTableContainer" style="display:none;">${tableContent}</div>
      `;
      document.getElementById('toggleTable').addEventListener('click', function() {
        let container = document.getElementById('resultTableContainer');
        if (container.style.display === 'none') {
          container.style.display = 'block';
          this.classList.remove('collapsed');
          this.querySelector('span').textContent = '收合表格';
        } else {
          container.style.display = 'none';
          this.classList.add('collapsed');
          this.querySelector('span').textContent = '顯示表格';
        }
      });
    } else {
      resultArea.innerHTML = `<div id="resultTableContainer">${tableContent}</div>`;
    }

    // 調整地圖視野
    var bounds = L.latLngBounds([]);
    firstShapeGroup.eachLayer(layer => bounds.extend(layer.getBounds()));
    otherShapeGroup.eachLayer(layer => bounds.extend(layer.getBounds()));
    map.fitBounds(bounds);

  } catch (error) {
    document.getElementById('multi-error').textContent = `錯誤：${error.message}`;
    console.error('API 請求錯誤:', error);
  }
}


// ------------------------------
// 切換按鈕
// ------------------------------
function toggleMarkers() {
  if (map.hasLayer(firstMarkerGroup) && map.hasLayer(otherMarkerGroup)) {
    map.removeLayer(firstMarkerGroup);
    map.removeLayer(otherMarkerGroup);
  } else {
    map.addLayer(firstMarkerGroup);
    map.addLayer(otherMarkerGroup);
  }
}
function toggleShapes() {
  if (map.hasLayer(firstShapeGroup) && map.hasLayer(otherShapeGroup)) {
    map.removeLayer(firstShapeGroup);
    map.removeLayer(otherShapeGroup);
  } else {
    map.addLayer(firstShapeGroup);
    map.addLayer(otherShapeGroup);
  }
}
function toggleFirstMarker() {
  if (map.hasLayer(firstMarkerGroup)) {
    map.removeLayer(firstMarkerGroup);
    map.removeLayer(firstShapeGroup);
  } else {
    map.addLayer(firstMarkerGroup);
    map.addLayer(firstShapeGroup);
  }
}
function toggleMarkerText() {
  showMarkerText = !showMarkerText;
  updateMarkers();
}

// ------------------------------
// 說明彈窗功能
// ------------------------------
document.getElementById('showExplanationBtn').addEventListener('click', function(){
  document.getElementById('explanationModal').style.display = 'block';
});
document.getElementById('closeExplanationBtn').addEventListener('click', function(){
  document.getElementById('explanationModal').style.display = 'none';
});
document.getElementById('explanationModal').addEventListener('click', function(e){
  if(e.target === this) { this.style.display = 'none'; }
});
