document.addEventListener("DOMContentLoaded", () => {
const soundToggle = document.getElementById("sound-toggle");
const oceanSound = document.getElementById("ocean-sound");
oceanSound.muted = !oceanSound.muted;
soundToggle.addEventListener("click", () => {
  oceanSound.muted = !oceanSound.muted;
  soundToggle.classList.toggle("muted", oceanSound.muted);
  soundToggle.textContent = oceanSound.muted ? "🔇" : "🔊";
});

document.addEventListener('click', () => {
  const ocean = document.getElementById('ocean-sound');
  ocean.volume = 0.5;
  ocean.play().catch(err => console.warn(err));
}, { once: true });

function updateOceanHeight() {
  const vh = window.innerHeight;
  const bg = document.getElementById('ocean-background');
  if (bg) {
    bg.style.height = vh + 'px';
  }
}
window.addEventListener('resize', updateOceanHeight);
window.addEventListener('orientationchange', updateOceanHeight);
document.addEventListener('DOMContentLoaded', updateOceanHeight);

function spawnBird() {
  if (document.querySelectorAll('.bird').length >= 3) return;
  const bird = document.createElement('div');
  bird.classList.add('bird');
  document.getElementById('bird-layer').appendChild(bird);

  const startX = Math.random() * window.innerWidth * 0.3;
  const startY = Math.random() * window.innerHeight * 0.3;
  const endX = window.innerWidth * 0.7 + Math.random() * window.innerWidth * 0.3;
  const endY = window.innerHeight * 0.7 + Math.random() * window.innerHeight * 0.3;

  // Two control points for a cubic Bezier curve
  const cp1X = Math.random() * window.innerWidth * 0.8;
  const cp1Y = Math.random() * window.innerHeight * 0.5;
  const cp2X = Math.random() * window.innerWidth * 0.8;
  const cp2Y = window.innerHeight * 0.5 + Math.random() * window.innerHeight * 0.5;

  const duration = 16000 + Math.random() * 8000; // slower speed

  let startTime = null;
  const blurAmount = Math.random() * 2;
  bird.style.filter = `blur(${blurAmount}px)`;
  bird.style.opacity = `${0.7 + Math.random() * 0.3}`;

  // Adjust size based on blur: base size 40px + (blurAmount * scale factor)
  const baseSize = 100;
  const scaleFactor = 6;
  const size = baseSize + blurAmount * scaleFactor;
  bird.style.width = `${size}px`;
  bird.style.height = `${size}px`;

  function cubicBezier(t, p0, p1, p2, p3) {
    return (
      Math.pow(1 - t, 3) * p0 +
      3 * Math.pow(1 - t, 2) * t * p1 +
      3 * (1 - t) * Math.pow(t, 2) * p2 +
      Math.pow(t, 3) * p3
    );
  }

  function animate(ts) {
    if (!startTime) startTime = ts;
    const progress = (ts - startTime) / duration;
    if (progress > 0.7) {
      bird.style.transition = 'opacity 1.2s ease';
      bird.style.opacity = '0';
      setTimeout(() => bird.remove(), 1200);
      return;
    }

    const x = cubicBezier(progress, startX, cp1X, cp2X, endX);
    const y = cubicBezier(progress, startY, cp1Y, cp2Y, endY);
    const flap = Math.sin(progress * Math.PI * 10) * 5;
    bird.style.transform = `translate(${x}px, ${y}px) rotateZ(${flap}deg) scaleX(-1)`;

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

function spawnCloud() {
  if (document.querySelectorAll('.cloud').length >= 5) return; // 最多兩片

  const cloud = document.createElement('div');
  cloud.classList.add('cloud');

  const size = 100 + Math.random() * 300; 
  const padding = 20;
  const startX = padding + Math.random() * (window.innerWidth - size - padding * 2);
  const startY = padding + Math.random() * (window.innerHeight - size - padding * 2);
  const duration = 30000 + Math.random() * 10000;
  const finalOpacity = (0.1 + Math.random() * 0.6);

  cloud.style.width = `${size}px`;
  cloud.style.height = `${size}px`;
  cloud.style.left = `${startX}px`;
  cloud.style.top = `${startY}px`;
  cloud.style.opacity = '0';
  document.body.appendChild(cloud);

  requestAnimationFrame(() => {
    cloud.style.transition = 'opacity 2s ease';
    cloud.style.opacity = finalOpacity;

    setTimeout(() => {
      cloud.animate([
        { transform: 'translate(0px, 0px)' },
        { transform: `translate(50px, -50px)` }
      ], {
        duration: duration,
        easing: 'linear'
      });
    }, 100); // 小延遲讓 opacity transition 能生效
  });

  setTimeout(() => {
      cloud.style.transition = 'opacity 2s ease';
      cloud.style.opacity = '0';
      setTimeout(() => cloud.remove(), 2000);
    }, duration - 2000);
}


// 三不五時出現
setInterval(() => {
  if (Math.random() < 0.3) spawnBird();
}, 3000); // 每 3 秒判斷一次
  

// 每 10 秒有 50% 機率出現新雲
setInterval(() => {
  if (Math.random() < 0.5) spawnCloud();
}, 5000);

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
    document.getElementById("ocean-background").style.display = "none";
    document.body.style.backgroundColor = "#0077be";
    document.querySelector('svg').pauseAnimations();
    document.getElementById("picker-container").style.display = "none";
  }

  document.getElementById("popup-close").onclick = () => {
    document.getElementById("popup").classList.add("hidden");
    document.getElementById("ocean-background").style.display = "block";
    document.body.style.backgroundColor = "";
    document.querySelector('svg').unpauseAnimations();
    document.getElementById("picker-container").style.display = "flex";
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

  const taiwanAreas = new Set(['臺北市第01選區', '臺北市第02選區', '臺北市第05選區', '新北市第02選區', '新北市第03選區', '新北市第04選區', '新北市第05選區', '新北市第06選區', '新北市第10選區', '臺中市第01選區', '臺中市第07選區', '臺南市第01選區', '臺南市第02選區', '臺南市第03選區', '臺南市第04選區', '臺南市第05選區', '臺南市第06選區', '高雄市第01選區', '高雄市第02選區', '高雄市第03選區', '高雄市第04選區', '高雄市第05選區', '高雄市第06選區', '高雄市第07選區', '高雄市第08選區', '新竹縣第01選區', '新竹縣第02選區', '彰化縣第01選區', '彰化縣第02選區', '彰化縣第03選區', '彰化縣第04選區', '屏東縣第01選區', '屏東縣第02選區', '嘉義縣第01選區', '嘉義縣第02選區', '嘉義市第01選區', '雲林縣第02選區']);
  const mixedAreas = new Set(['臺北市第03選區', '臺北市第04選區', '臺北市第06選區', '臺北市第07選區', '臺北市第08選區', '新北市第01選區', '新北市第07選區', '新北市第08選區', '新北市第09選區', '新北市第11選區', '新北市第12選區', '桃園市第01選區', '桃園市第02選區', '桃園市第03選區', '桃園市第04選區', '桃園市第05選區', '桃園市第06選區', '臺中市第02選區', '臺中市第03選區', '臺中市第04選區', '臺中市第05選區', '臺中市第06選區', '臺中市第08選區', '基隆市第01選區', '新竹市第01選區', '雲林縣第01選區', '花蓮縣第01選區', '臺東縣第01選區', '南投縣第01選區', '南投縣第02選區']);

  const paths = svg.querySelectorAll("path");

  paths.forEach((path) => {
    const titleEl = path.querySelector("title");
    const areaName = (titleEl && titleEl.textContent.trim()) || path.getAttribute("id") || "";

    if (mixedAreas.has(areaName)) {
      path.style.fill = "url(#redBlueGradient)";
      path.style.stroke = "#00FFFF";
    } else if (taiwanAreas.has(areaName)) {
      path.style.fill = "#004b82"; // 青色
      path.style.stroke = "#00FFFF";
    } else {
      if(areaName != "")
        path.style.fill = "#aa0000";
    }

    const originalColor = path.style.fill || path.getAttribute("fill") || "";

    let lastClickedDistrict = null;
    path.addEventListener("click", () => {        
      if (!areaName) return;

      const selectedIndex = allDistricts.indexOf(areaName);
      if (selectedIndex === -1) return;

      const targetIndex = selectedIndex + 1; // 加 1 是因為有 top blank li
      snapToIndex(targetIndex);
      updateSelection(targetIndex);

      if (lastClickedDistrict === areaName) {
        // 再次點擊 → 真的要開 popup
        onDistrictClicked(areaName);
        lastClickedDistrict = null; // 重置
      } else {
        // 第一次點擊 → 僅選擇，不開 popup
        lastClickedDistrict = areaName;
      }

      if (mixedAreas.has(areaName)) {
        setBackgroundLabel("罷", "#000");
      } else if (taiwanAreas.has(areaName)) {
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

  const pickerList = document.getElementById("picker-list");
const pickerWheel = document.getElementById("picker-wheel");
const recallButton = document.getElementById("recall-button");

  pickerWheel.addEventListener("wheel", (e) => {
  e.preventDefault(); // 阻止預設 scroll（避免跳太多）

  const direction = e.deltaY > 0 ? 1 : -1;
  const currentIndex = getCenteredIndex();
  const nextIndex = Math.min(
    Math.max(currentIndex + direction, 1), // 最小 index = 1 (第一個選區)
    allDistricts.length                  // 最大 index = 最後一個選區
  );

  snapToIndex(nextIndex);
  updateSelection(nextIndex);
}, { passive: false }); // 🔴 必須設為 false 才能有效阻止滾動

// 取得所有選區名稱（從 SVG <title>）
const allDistricts = Array.from(paths)
  .map(p => p.querySelector("title")?.textContent.trim())
  .filter(Boolean)
  .sort();

// 建立列表（加入上下空白 padding）
const ITEM_HEIGHT = 40;
const CENTER_OFFSET = ITEM_HEIGHT; // 容器高度 120px，中心點在第 2 項（index 1）

pickerList.innerHTML = "";

// 上方空白
const blankTop = document.createElement("li");
blankTop.style.height = `${ITEM_HEIGHT}px`;
pickerList.appendChild(blankTop);

// 實際選區
allDistricts.forEach(d => {
  const li = document.createElement("li");
  li.textContent = d;
  pickerList.appendChild(li);
});

// 下方空白
const blankBottom = document.createElement("li");
blankBottom.style.height = `${ITEM_HEIGHT}px`;
pickerList.appendChild(blankBottom);

// 🔄 滾動結束後 snap 對齊中心項
let scrollTimer = null;
pickerWheel.addEventListener("scroll", () => {
  if (scrollTimer) clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    const centerIndex = getCenteredIndex();
    snapToIndex(centerIndex);
    updateSelection(centerIndex);
  }, 100);
});

// 👉 根據 scrollTop + 偏移計算中心 index
function getCenteredIndex() {
  const offset = pickerWheel.scrollTop + CENTER_OFFSET;
  return Math.round(offset / ITEM_HEIGHT);
}

// 👉 滾動對齊某 index 到中心
function snapToIndex(index) {
  const targetTop = index * ITEM_HEIGHT - CENTER_OFFSET;
  pickerWheel.scrollTo({ top: targetTop, behavior: "smooth" });
}

// 👉 更新高亮、背景、罷字按鈕
function updateSelection(index) {
  const items = pickerList.querySelectorAll("li");
  items.forEach((li, i) => {
    li.classList.toggle("active", i === index);
  });

  const selectedDistrict = items[index]?.textContent;
  if (!selectedDistrict || !allDistricts.includes(selectedDistrict)) return;

  // 高亮地圖
  paths.forEach(p => {
    const title = p.querySelector("title")?.textContent.trim();
    p.style.filter = (title === selectedDistrict) ? "brightness(1.3)" : "";
  });

  // 載入背景與 recall 控制
  fetch(`data/${selectedDistrict}.json`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("ocean-background").style.backgroundImage = `url('${data.photo}')`;
      document.getElementById("ocean-background").style.backgroundSize = "cover";
      document.getElementById("ocean-background").style.backgroundPosition = "center";

      if (mixedAreas.has(selectedDistrict)) {
        recallButton.disabled = false;
        recallButton.classList.add("active");
      } else {
        recallButton.disabled = true;
        recallButton.classList.remove("active");
      }
    })
    .catch(err => {
      console.warn(`無法載入 ${selectedDistrict} 的 json`, err);
      document.getElementById("ocean-background").style.backgroundSize = "cover";
      document.getElementById("ocean-background").style.backgroundPosition = "center";

      if (mixedAreas.has(selectedDistrict)) {
        recallButton.disabled = false;
        recallButton.classList.add("active");
      } else {
        recallButton.disabled = true;
        recallButton.classList.remove("active");
      }      
    });
}

// ▶️ 點擊 recall 開啟 popup
recallButton.addEventListener("click", () => {
  const active = pickerList.querySelector("li.active");
  if (active && !recallButton.disabled) {
    onDistrictClicked(active.textContent);
  }
});

// ▶️ 預設選擇第一項
const initialIndex = 1; // index 0 是空白
snapToIndex(initialIndex);
setTimeout(() => updateSelection(initialIndex), 300);
});
