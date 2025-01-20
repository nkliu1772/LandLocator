// 初始化 Leaflet 地圖
var map = L.map('map').setView([25.000659102852, 121.51006510846], 14);
L.tileLayer('https://wmts.nlsc.gov.tw/wmts/EMAP5/{Style}/{TileMatrixSet}/{z}/{y}/{x}', {
  attribution: '&copy; <a href="http://maps.nlsc.gov.tw/S09SOA/">國土測繪圖資服務雲</a> contributors',
  Style: 'default',
  TileMatrixSet: 'GoogleMapsCompatible',
  maxNativeZoom: 20,
  maxZoom: 20
}).addTo(map);

// 添加圖層群組，用於管理地圖上的多邊形和標記
var featureGroup = L.featureGroup().addTo(map);
var markerGroup = L.featureGroup().addTo(map);

// 格式化地號：移除多餘的前導零，並轉換為友好格式
function formatLandNumber(landNumber) {
  const landStr = landNumber.toString().padStart(8, '0');
  const motherNumber = parseInt(landStr.slice(0, 4), 10); // 母號
  const childNumber = parseInt(landStr.slice(4), 10); // 子號

  if (childNumber === 0) {
    return `${motherNumber}`; // 沒有子號
  } else {
    return `${motherNumber}-${childNumber}`; // 顯示母號-子號
  }
}

// 多筆查詢
async function queryMultipleLands() {
  const multiLandInput = document.getElementById('multi-land-id').value;
  const resultDiv = document.getElementById('multi-result');
  const errorDiv = document.getElementById('multi-error');

  // 清空之前的結果和錯誤訊息
  resultDiv.innerHTML = '';
  errorDiv.textContent = '';

  if (!multiLandInput) {
    errorDiv.textContent = '請輸入至少一筆地號！';
    return;
  }

  try {
    // 分割多筆輸入，清理格式
    const landList = multiLandInput
      .split(/[,，\n]+/) // 支援逗號或換行分隔
      .map(item => item.trim())
      .filter(Boolean);

    if (landList.length === 0) {
      throw new Error('輸入格式錯誤，請確認地號是否正確。');
    }

    // 組合 API 查詢參數
    const apiUrl = `https://twland.ronny.tw/index/search?${landList
      .map(land => `lands[]=${encodeURIComponent(land)}`)
      .join('&')}`;

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`API 請求失敗：${response.status}`);

    const data = await response.json();

    if (data.notfound.length > 0) {
      throw new Error(`以下地號查無資料：${data.notfound.join(', ')}`);
    }

    // 清空地圖上的圖層
    featureGroup.clearLayers();
    markerGroup.clearLayers();

    // 多筆查詢結果表格
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

    // 處理每筆回應數據
    data.features.forEach((feature, index) => {
      const properties = feature.properties;
      const xCenter = properties.xcenter.toFixed(6);
      const yCenter = properties.ycenter.toFixed(6);
      const latLonFormat = `${yCenter},${xCenter}`;
      const googleMapsLink = `https://www.google.com/maps/place/${latLonFormat}`;
      const formattedLandNumber = formatLandNumber(properties["地號"]);

      // 表格內容（流水號和超連結）
      tableContent += `
        <tr>
          <td>${index === 0 ? "勘估標的" : `比較標的${index}`}</td>
          <td>${properties["縣市"]}</td>
          <td>${properties["鄉鎮"]}</td>
          <td>${properties["地段"]}</td>
          <td>${formattedLandNumber}</td>
          <td><a href="${googleMapsLink}" target="_blank">${latLonFormat}</a></td>
        </tr>
      `;

      // 在地圖上添加標記
      const markerText = index === 0 ? "勘估標的" : `比較標的${index}`;
      const markerColor = index === 0 ? "red" : "#007BFF";

      const markerIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${markerColor}; color: white; border-radius: 10px; padding: 5px 10px; text-align: center; font-size: 14px;">${markerText}</div>`,
        iconSize: [100, 30],
        iconAnchor: [50, 15]
      });

      L.marker([yCenter, xCenter], { icon: markerIcon }).addTo(markerGroup);

      // 在地圖上繪製多邊形
      const geoJsonLayer = L.geoJSON(feature);
      featureGroup.addLayer(geoJsonLayer);
    });

    tableContent += `</tbody></table>`;
    resultDiv.innerHTML = tableContent;

    // 調整地圖視野以適應所有多邊形和標記
    map.fitBounds(featureGroup.getBounds());
  } catch (error) {
    errorDiv.textContent = `錯誤：${error.message}`;
    console.error('API 錯誤:', error);
  }
}

// 顯示/隱藏地圖上的說明文字
function toggleMarkers() {
  if (map.hasLayer(markerGroup)) {
    map.removeLayer(markerGroup);
  } else {
    map.addLayer(markerGroup);
  }
}

// 顯示/隱藏地圖上的圖形框框
function toggleShapes() {
  if (map.hasLayer(featureGroup)) {
    map.removeLayer(featureGroup);
  } else {
    map.addLayer(featureGroup);
  }
}
