document.addEventListener("DOMContentLoaded", () => {
  function renderPopup(data) 
  {
    const nameEl = document.getElementById("popup-name");
    const districtEl = document.getElementById("popup-district");
    const photoEl = document.getElementById("popup-photo");
    const bodyEl = document.getElementById("popup-body");

    nameEl.textContent = data.name;
    districtEl.textContent = data.district;
    photoEl.src = data.photo;

    bodyEl.innerHTML = "";

    data.articles.forEach(article => {
      article.paragraphs.forEach((paragraph, paraIndex) => {
        const block = document.createElement("div");
        block.className = "paragraph-block";

        // 處理標題與日期（支援 fallback）
        const titleText = paragraph.title && paragraph.title.trim() ? paragraph.title : "未命名段落";
        const dateText = paragraph.date || "未標註日期";

        // 顯示段落標題列
        const header = document.createElement("div");
        header.className = "paragraph-header";
        header.textContent = `📅 ${dateText} - ${titleText}`;
        block.appendChild(header);

        // 內文容器（預設隱藏）
        const content = document.createElement("div");
        content.className = "paragraph-content hidden";

        // 建立段落文字內容
        const p = document.createElement("p");
        let html = paragraph.text;

        paragraph.annotations.forEach((a, index) => {
          html = html.replace(
            a.highlight,
            `<span class="annotated" data-index="${paraIndex}_${index}">${a.highlight}</span>`
          );
        });

        // 插入文字 + response 結構
        const container = document.createElement("div");
        container.innerHTML = html;

        paragraph.annotations.forEach((a, index) => {
          const span = container.querySelector(`.annotated[data-index="${paraIndex}_${index}"]`);
          const box = document.createElement("div");
          box.className = "response-box hidden";
          box.textContent = a.response;
          box.dataset.index = `${paraIndex}_${index}`;
          span.insertAdjacentElement("afterend", box);
        });

        container.querySelectorAll(".annotated").forEach(span => {
          span.addEventListener("click", () => {
            const box = span.nextElementSibling;
            box.classList.toggle("shown");
            box.classList.toggle("hidden");
          });
        });

        p.append(...container.childNodes);
        content.appendChild(p);
        block.appendChild(content);
        bodyEl.appendChild(block);

        // 點標題展開段落
        header.addEventListener("click", () => {
          content.classList.toggle("hidden");
        });
      });
    });

    document.getElementById("popup").classList.remove("hidden");
  }

  document.getElementById("popup-close").onclick = () => {
    document.getElementById("popup").classList.add("hidden");
  };

  //地圖點選後呼叫
  function onDistrictClicked(areaName) {

  // ✅ 強制還原 body 的視覺縮放（桌機有效）
    document.body.style.zoom = "1";

    // ✅ 若支援 visualViewport（大多手機瀏覽器）
    if (window.visualViewport && window.visualViewport.scale !== 1) {
      // 暫時用 scale 補償恢復
      document.documentElement.style.transform = "scale(1)";
      document.documentElement.style.transformOrigin = "top left";
    }    
    //const encodedName = encodeURIComponent(areaName);
    const ts = Date.now(); // 或用 random 也可
    const url = `data/${areaName}.json?t=${ts}`;

    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error(`找不到資料檔：${url}`);
        }
        return res.json();
      })
      .then(data => {
        renderPopup({
          name: data.name,
          district: areaName,
          photo: data.photo,
          articles: data.articles
        });
      })
      .catch(err => {
        console.error(err);
      });

      // Reset zoom (桌機用)
      document.body.style.zoom = "1";

      // 移除任何先前 scale 補償（手機）
      document.documentElement.style.transform = "scale(1)";
      document.documentElement.style.transformOrigin = "top left";
    }
    const svg = document.querySelector("#map-container svg");
    const hash = decodeURIComponent(window.location.hash.slice(1)).trim();

function setBackgroundLabel(word, wordColor) {
  const popupLabel = document.getElementById("popup-label");
  if (popupLabel) {
    popupLabel.textContent = word;
    popupLabel.style.color = wordColor;

    // 自動調整底色根據顏色
    popupLabel.style.backgroundColor =
      wordColor === "red"
        ? "rgba(255,0,0,0.1)"
        : wordColor === "#1e3d7a"
        ? "rgba(0,64,160,0.1)"
        : "rgba(0,0,0,0.08)";
  }
}

  const kmtAreas = new Set(['新北市第08選區', '新竹市第01選區', '桃園市第06選區', '臺中市第06選區', '桃園市第02選區', '臺東縣第01選區', '桃園市第04選區', '臺北市第08選區', '新北市第01選區', '雲林縣第01選區', '新北市第11選區', '桃園市第03選區', '臺中市第02選區', '臺北市第07選區', '基隆市第01選區', '桃園市第01選區', '新北市第09選區', '花蓮縣第01選區', '臺北市第04選區', '臺北市第06選區', '南投縣第01選區', '臺中市第03選區', '臺中市第08選區', '臺中市第04選區', '新北市第07選區', '臺北市第03選區', '南投縣第02選區', '新北市第12選區', '桃園市第05選區', '臺中市第05選區']);
  const dppAreas = new Set(['臺北市第01選區', '臺北市第02選區', '臺北市第05選區', '新北市第02選區', '新北市第03選區', '新北市第04選區', '新北市第05選區', '新北市第06選區', '新北市第10選區', '臺中市第01選區', '臺中市第07選區', '臺南市第01選區', '臺南市第02選區', '臺南市第03選區', '臺南市第04選區', '臺南市第05選區', '臺南市第06選區', '高雄市第01選區', '高雄市第02選區', '高雄市第03選區', '高雄市第04選區', '高雄市第05選區', '高雄市第06選區', '高雄市第07選區', '高雄市第08選區', '新竹縣第01選區', '新竹縣第02選區', '彰化縣第01選區', '彰化縣第02選區', '彰化縣第03選區', '彰化縣第04選區', '屏東縣第01選區']);
  const mixedAreas = new Set(['臺北市第03選區', '臺北市第04選區', '臺北市第06選區', '臺北市第07選區', '臺北市第08選區', '新北市第01選區', '新北市第07選區', '新北市第08選區', '新北市第09選區', '新北市第11選區', '新北市第12選區', '桃園市第01選區', '桃園市第02選區', '桃園市第03選區', '桃園市第04選區', '桃園市第05選區', '桃園市第06選區', '臺中市第02選區', '臺中市第03選區', '臺中市第04選區', '臺中市第05選區', '臺中市第06選區', '臺中市第08選區', '基隆市第01選區', '新竹市第01選區', '雲林縣第01選區', '花蓮縣第01選區', '臺東縣第01選區', '南投縣第01選區', '南投縣第02選區']);

  const paths = svg.querySelectorAll("path");

  paths.forEach((path) => {
    const titleEl = path.querySelector("title");
    const areaName = (titleEl && titleEl.textContent.trim()) || path.getAttribute("id") || "";

    if (mixedAreas.has(areaName)) {
      path.style.fill = "url(#redBlueGradient)";
      path.style.stroke = "#00FFFF";
    } else if (dppAreas.has(areaName)) {
      path.style.fill = "#004b82"; // 青色
      path.style.stroke = "#00FFFF";
    } else {
      if(areaName != "")
        path.style.fill = "#aa0000";
    }

    const originalColor = path.style.fill || path.getAttribute("fill") || "";

    path.addEventListener("click", () => {  
      if(areaName != "")    
        onDistrictClicked(areaName);
        if (mixedAreas.has(areaName)) {
          setBackgroundLabel("罷", "#000");
        } else if (dppAreas.has(areaName)) {
          setBackgroundLabel("青", "#1e3d7a");
        } else {
          setBackgroundLabel("赤", "red");
        }
    });

    path.addEventListener("mouseover", () => {
      if(areaName != "")
      {
        path.setAttribute("data-old-filter", path.style.filter || "");
        path.style.filter = "brightness(1.3)";       
      }
    });

    path.addEventListener("mouseout", () => {
      const oldFilter = path.getAttribute("data-old-filter") || "";
      path.style.filter = oldFilter;
    });
  });
  if (hash) {
    const targetPath = Array.from(svg.querySelectorAll("path")).find((path) => {
      const titleEl = path.querySelector("title");
      return titleEl && titleEl.textContent.trim() === hash;
    });

    if (targetPath) {
      targetPath.dispatchEvent(new Event("click")); // 模擬點擊
      targetPath.scrollIntoView({ behavior: "smooth", block: "center" }); // 可選：自動捲動
    }
  }
  // 動態加入 SVG 漸層定義
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = `
    <linearGradient id="redBlueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
  <stop offset="0%" style="stop-color:#00416a; stop-opacity:1" />
  <stop offset="100%" style="stop-color:#bb0000; stop-opacity:1" />
</linearGradient>
  `;
  svg.insertBefore(defs, svg.firstChild);
});
