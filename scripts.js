// 初始化 Leaflet 地圖
var map = L.map('map').setView([25.033964, 121.564468], 14); // 預設中心點與縮放層級
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 定義圖層群組，用於管理動態多邊形
var featureGroup = L.featureGroup().addTo(map);

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

  resultDiv.innerHTML = '';
  errorDiv.textContent = '';

  if (!multiLandInput) {
    errorDiv.textContent = '請輸入至少一筆地號！';
    return;
  }

  try {
    // 分割多筆輸入，清理格式
    const landList = multiLandInput
      .split(/[,，\n]+/)
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

    let tableContent = `
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>縣市</th>
            <th>鄉鎮</th>
            <th>地段</th>
            <th>地號</th>
            <th>經緯度座標</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.features.forEach(feature => {
      const properties = feature.properties;
      const xCenter = properties.xcenter.toFixed(6);
      const yCenter = properties.ycenter.toFixed(6);
      const latLonFormat = `${yCenter},${xCenter}`;
      const formattedLandNumber = formatLandNumber(properties["地號"]);

      tableContent += `
        <tr>
          <td>${properties["縣市"]}</td>
          <td>${properties["鄉鎮"]}</td>
          <td>${properties["地段"]}</td>
          <td>${formattedLandNumber}</td>
          <td>${latLonFormat}</td>
        </tr>
      `;

      // 在地圖上繪製多邊形
      const geoJsonLayer = L.geoJSON(feature);
      featureGroup.addLayer(geoJsonLayer);
    });

    tableContent += `</tbody></table>`;
    resultDiv.innerHTML = tableContent;

    // 調整地圖視野以適應多邊形
    map.fitBounds(featureGroup.getBounds());
  } catch (error) {
    errorDiv.textContent = `錯誤：${error.message}`;
    console.error('API 錯誤:', error);
  }
}
