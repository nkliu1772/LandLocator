// 格式化地號：移除母號和子號的前導零，並根據規則顯示
function formatLandNumber(landNumber) {
    const landStr = landNumber.toString().padStart(8, '0'); // 確保地號長度為 8 位
    const motherNumber = parseInt(landStr.slice(0, 4), 10); // 母號 (前四碼)，移除前導零
    const childNumber = parseInt(landStr.slice(4), 10); // 子號 (後四碼)，移除前導零
  
    if (childNumber === 0) {
      // 如果子號為 0000，只顯示母號
      return `${motherNumber}`;
    } else {
      // 如果子號不是 0000，顯示母號-子號格式
      return `${motherNumber}-${childNumber}`;
    }
  }
  
  // 將用戶輸入的地號轉換為 API 格式
  function convertToApiFormat(userInput) {
    // 匹配正確格式，例如：臺北市文山區華興段三小段141號
    const match = userInput.match(/^(.*[市縣])(.*?[鄉鎮市區])?(.*段.*?段)?(.*號)$/);
  
    if (!match) {
      throw new Error('輸入格式不正確，請依照「臺北市文山區華興段三小段141號」的格式輸入');
    }
  
    const city = match[1]; // 縣市部分
    const section = match[3]; // 地段部分
    const landNumber = match[4]; // 地號部分
  
    if (!city || !section || !landNumber) {
      throw new Error('輸入格式不完整，請確認地號格式是否正確');
    }
  
    // 拼接成 API 格式，例如：臺北市華興段三小段141號
    return `${city}${section}${landNumber}`;
  }
  
  // 單筆查詢
  async function querySingleLand() {
    const landInput = document.getElementById('land-id').value;
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');
  
    resultDiv.innerHTML = '';
    errorDiv.textContent = '';
  
    if (!landInput) {
      errorDiv.textContent = '請輸入地號！';
      return;
    }
  
    try {
      // 將用戶輸入轉換為 API 格式
      const apiFormattedInput = convertToApiFormat(landInput);
      const apiUrl = `https://twland.ronny.tw/index/search?lands[]=${encodeURIComponent(apiFormattedInput)}`;
  
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`API 請求失敗：${response.status}`);
  
      const data = await response.json();
  
      if (data.notfound.length > 0) {
        throw new Error('查無此地號，請檢查輸入是否正確。');
      }
  
      const feature = data.features[0];
      const properties = feature.properties;
  
      const xCenter = properties.xcenter.toFixed(6);
      const yCenter = properties.ycenter.toFixed(6);
      const latLonFormat = `${yCenter},${xCenter}`;
      const formattedLandNumber = formatLandNumber(properties["地號"]);
  
      resultDiv.innerHTML = `
        <table>
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
            <tr>
              <td>${properties["縣市"]}</td>
              <td>${properties["鄉鎮"]}</td>
              <td>${properties["地段"]}</td>
              <td>${formattedLandNumber}</td>
              <td>${latLonFormat}</td>
            </tr>
          </tbody>
        </table>
      `;
    } catch (error) {
      errorDiv.textContent = `錯誤：${error.message}`;
      console.error('API 錯誤:', error);
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
      // 分割多筆輸入並轉換為 API 格式
      const landList = multiLandInput.split(/[,，\n]+/).map(item => {
        try {
          return convertToApiFormat(item.trim());
        } catch (e) {
          throw new Error(`格式錯誤：${item.trim()} (${e.message})`);
        }
      });
  
      const apiUrl = `https://twland.ronny.tw/index/search?${landList.map(land => `lands[]=${encodeURIComponent(land)}`).join('&')}`;
  
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`API 請求失敗：${response.status}`);
  
      const data = await response.json();
  
      if (data.notfound.length > 0) {
        throw new Error(`以下地號查無資料：${data.notfound.join(', ')}`);
      }
  
      let tableContent = `
        <table>
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
      });
  
      tableContent += `</tbody></table>`;
      resultDiv.innerHTML = tableContent;
    } catch (error) {
      errorDiv.textContent = `錯誤：${error.message}`;
      console.error('API 錯誤:', error);
    }
  }
  