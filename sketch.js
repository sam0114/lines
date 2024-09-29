let lines = [];
let gravity = 0.05;
let maxLines = 10;  // 初始最大線段數量
let clickActive = false;

function setup() {
  createCanvas(600, 600, WEBGL);  // 使用 3D 繪圖
  background(0);
  
  // 初始化一開始的線段
  for (let i = 0; i < maxLines; i++) {
    lines.push(new FallingLine());
  }
}

function draw() {
  background(0);
  rotateX(PI / 6);  // 傾斜視角，讓空間有深度感
  

  // 繪製所有線段
  for (let i = 0; i < lines.length; i++) {
  let l = lines[i];
    l.update();
    l.display();
  }

  // 如果滑鼠點擊停止後，慢慢恢復初始狀態
  if (!clickActive) {
    for (let i = 0; i < lines.length; i++) {
      lines[i].recover();
    }

    // 當滑鼠點擊結束，移除多餘線段，使數量恢復初始狀態
    if (lines.length > maxLines) {
      lines.pop();
    }
  }
}

// 當滑鼠按下時，生成新的線段並變為波浪狀
function mousePressed() {
  clickActive = true;

  // 每次點擊生成更多線段
  for (let i = 0; i < 1; i++) {
    lines.push(new FallingLine());
  }

  // 讓所有線段產生波動效果
  for (let i = 0; i < lines.length; i++) {
    lines[i].applyWave(mouseX, mouseY);
  }
}

// 當滑鼠釋放時，停止波動並逐漸恢復原狀
function mouseReleased() {
  clickActive = false;
}

// 線段類別
class FallingLine {
  constructor() {
    this.x = random(-width / 2, width / 2);  // 隨機 X 位置
    this.y = -height / 2;  // 線段從上方掉落
    this.z = random(-200, 200);  // 隨機 Z 軸位置
    this.length = random(300, 500);  // 初始較長的線段
    this.speed = random(1,10);  // 初始速度
    this.amplitude = 0;  // 波動振幅
    this.color = color(255);  // 初始顏色為白色
    this.delayTime = random(0, 100);  // 設置隨機延遲時間
    this.startTime = millis();  // 紀錄開始時間
  }

  // 更新線段位置
  update() {
    // 檢查線段是否需要等待延遲時間
 
    
    this.speed += gravity;  // 模擬重力加速度
    this.y += this.speed;  // 線段隨時間往下掉
    
    // 如果線段掉到底部，重置位置
    if (this.y > height / 2) {
      this.x = random(-width / 2, width / 2); // 隨機 X 位置
      this.y = -height / 2;
      this.speed = 0;
      this.startTime = millis();  // 重新設定開始時間
      this.delayTime = random(0, 200);  // 重新設定隨機延遲
    }

    
    

    // 波動振幅會逐漸衰減
    this.amplitude *= 0.95;
  }

  // 繪製線段（加入波浪效果）
  display() {
    push();
    translate(this.x, this.y, this.z);  // 設置線段的位置
    stroke(this.color);
    strokeWeight(2);
    
    // 根據振幅創建波浪效果
    let wave = sin(frameCount * 0.2) * this.amplitude;
    
    // 繪製波浪狀的線段
    for (let i = 0; i < 10; i++) {
      let segmentY = map(i, 0, 10, -this.length / 2, this.length / 2);
      let waveOffset = sin(i * 0.5 + frameCount * 0.05) * wave;  // 波浪形狀
      line(waveOffset, segmentY, waveOffset, segmentY + this.length / 10);
    }
    pop();
  }

  // 當滑鼠點擊時，線段變為彩色並產生波動
  applyWave(mx, my) {
    // 根據滑鼠與線段距離決定波動強度
    let d = dist(mx - width / 2, my - height / 2, this.x, this.y);
    if (d < 200) {
      this.amplitude = 50;  // 設置較大的波動
      this.color = color(random(255), random(255), random(255));  // 變成隨機顏色
    }
  }

  // 恢復到原來白色、稀疏的狀態
  recover() {
    this.color = lerpColor(this.color, color(255), 0.05);  // 顏色漸變回白色
    this.amplitude = lerp(this.amplitude, 0, 0.05);  // 漸漸停止波動
  }
}
