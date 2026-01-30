import React, { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";


// KINH NGHIEM TUC (Professional)
const glassesList = [
  {
    id: 1,
    url: "https://res.cloudinary.com/dvucotc8z/image/upload/v1762103856/24834e7b77049d0a209d94660bec6ea9_extiiq.png",
    name: "Classic Black",
    suitableFaceShape: ["oval", "square", "heart"],
    minFaceWidth: 0.15,
    maxFaceWidth: 0.35,
    scaleMultiplier: 1.6,
    category: "professional",
  },
  {
    id: 2,
    url: "https://res.cloudinary.com/dvucotc8z/image/upload/v1762103781/fddb5610eedc1ef6fc8afe437bf64747_tyrduw.png",
    name: "Modern Round",
    suitableFaceShape: ["oval", "square", "heart"],
    minFaceWidth: 0.15,
    maxFaceWidth: 0.35,
    scaleMultiplier: 1.7,
    category: "professional",
  },
  {
    id: 3,
    url: "https://res.cloudinary.com/dvucotc8z/image/upload/v1762102471/3e0f4e202ed3796ec83de3150b89db71_k14kgm.png",
    name: "Cat Eye Style",
    suitableFaceShape: ["oval", "round", "square"],
    minFaceWidth: 0.15,
    maxFaceWidth: 0.32,
    scaleMultiplier: 1.5,
    category: "professional",
  },
  {
    id: 4,
    url: "https://res.cloudinary.com/dvucotc8z/image/upload/v1762102472/d66d48cf51672a8678758178aea52799_jhs2jf.png",
    name: "Aviator Gold",
    suitableFaceShape: ["square", "round", "triangle"],
    minFaceWidth: 0.18,
    maxFaceWidth: 0.4,
    scaleMultiplier: 1.8,
    category: "professional",
  },
  {
    id: 5,
    url: "https://res.cloudinary.com/dvucotc8z/image/upload/v1762102471/91eb9dc8a4240f9ba9f2ccc2c6550cc3_k80ndg.png",
    name: "Rectangle Frame",
    suitableFaceShape: ["oval", "round", "heart"],
    minFaceWidth: 0.15,
    maxFaceWidth: 0.35,
    scaleMultiplier: 1.7,
    category: "professional",
  },
  {
    id: 6,
    url: "https://res.cloudinary.com/dvucotc8z/image/upload/v1762102016/52b0cc13216e2e91ee14ab167acda2db_hzcp17.png",
    name: "Retro Classic",
    suitableFaceShape: ["oval", "square", "triangle"],
    minFaceWidth: 0.15,
    maxFaceWidth: 0.38,
    scaleMultiplier: 1.6,
    category: "professional",
  },
];



// ISHIHARA COLOR BLIND TEST PLATES - Chuẩn y khoa
// Màu sắc được tối ưu để người bình thường dễ nhìn thấy số
const ishiharaPlates = [
  { 
    id: 1, 
    correctAnswer: "12",
    type: "demonstration",
    description: "Plate demo - Tất cả đều thấy số 12",
    bgColors: ["#7CB342", "#8BC34A", "#9CCC65", "#689F38", "#7CB342", "#AED581"], // Xanh lá tươi
    numColors: ["#E53935", "#F44336", "#EF5350", "#D32F2F", "#C62828", "#FF5252"], // Đỏ tươi
  },
  { 
    id: 2, 
    correctAnswer: "8",
    type: "transformation",
    description: "Người bình thường: 8",
    bgColors: ["#66BB6A", "#81C784", "#A5D6A7", "#4CAF50", "#43A047", "#C8E6C9"],
    numColors: ["#FF7043", "#FF8A65", "#FFAB91", "#F4511E", "#E64A19", "#FF5722"],
  },
  { 
    id: 3, 
    correctAnswer: "6",
    type: "transformation",
    description: "Người bình thường: 6",
    bgColors: ["#9CCC65", "#AED581", "#C5E1A5", "#8BC34A", "#7CB342", "#DCEDC8"],
    numColors: ["#FF5722", "#FF7043", "#FF8A65", "#F4511E", "#E64A19", "#BF360C"],
  },
  { 
    id: 4, 
    correctAnswer: "29",
    type: "transformation", 
    description: "Người bình thường: 29",
    bgColors: ["#AED581", "#C5E1A5", "#DCEDC8", "#9CCC65", "#8BC34A", "#E8F5E9"],
    numColors: ["#EF6C00", "#F57C00", "#FF9800", "#E65100", "#FB8C00", "#FFA726"],
  },
  { 
    id: 5, 
    correctAnswer: "57",
    type: "transformation",
    description: "Người bình thường: 57",
    bgColors: ["#689F38", "#7CB342", "#8BC34A", "#558B2F", "#33691E", "#9CCC65"],
    numColors: ["#FFB300", "#FFC107", "#FFCA28", "#FFA000", "#FF8F00", "#FFD54F"],
  },
  { 
    id: 6, 
    correctAnswer: "5",
    type: "transformation",
    description: "Người bình thường: 5",
    bgColors: ["#81C784", "#A5D6A7", "#C8E6C9", "#66BB6A", "#4CAF50", "#E8F5E9"],
    numColors: ["#E91E63", "#EC407A", "#F06292", "#D81B60", "#C2185B", "#F48FB1"],
  },
  { 
    id: 7, 
    correctAnswer: "3",
    type: "transformation",
    description: "Người bình thường: 3",
    bgColors: ["#C5E1A5", "#DCEDC8", "#E8F5E9", "#AED581", "#9CCC65", "#F1F8E9"],
    numColors: ["#D32F2F", "#E53935", "#F44336", "#C62828", "#B71C1C", "#EF5350"],
  },
  { 
    id: 8, 
    correctAnswer: "15",
    type: "transformation",
    description: "Người bình thường: 15",
    bgColors: ["#AFB42B", "#C0CA33", "#CDDC39", "#9E9D24", "#827717", "#D4E157"],
    numColors: ["#FF5252", "#FF1744", "#F44336", "#D50000", "#E53935", "#FF8A80"],
  },
  { 
    id: 9, 
    correctAnswer: "74",
    type: "transformation",
    description: "Người bình thường: 74",
    bgColors: ["#7CB342", "#8BC34A", "#9CCC65", "#689F38", "#558B2F", "#AED581"],
    numColors: ["#FF6F00", "#FF8F00", "#FFA000", "#E65100", "#FFB300", "#FFCA28"],
  },
  { 
    id: 10, 
    correctAnswer: "2",
    type: "transformation",
    description: "Người bình thường: 2",
    bgColors: ["#4CAF50", "#66BB6A", "#81C784", "#43A047", "#388E3C", "#A5D6A7"], // Xanh lá đậm hơn
    numColors: ["#D50000", "#FF1744", "#F44336", "#B71C1C", "#C62828", "#E53935"], // Đỏ rực hơn
  },
  { 
    id: 11, 
    correctAnswer: "97",
    type: "transformation",
    description: "Người bình thường: 97",
    bgColors: ["#DCEDC8", "#E8F5E9", "#F1F8E9", "#C5E1A5", "#AED581", "#FAFAFA"],
    numColors: ["#AD1457", "#C2185B", "#D81B60", "#880E4F", "#E91E63", "#EC407A"],
  },
  { 
    id: 12, 
    correctAnswer: "45",
    type: "transformation",
    description: "Người bình thường: 45",
    bgColors: ["#8BC34A", "#9CCC65", "#AED581", "#7CB342", "#689F38", "#C5E1A5"],
    numColors: ["#E65100", "#EF6C00", "#F57C00", "#BF360C", "#FF9800", "#FF5722"],
  },
  // ===== HIDDEN DIGIT PLATES - Người mù màu CÓ THỂ thấy, người bình thường KHÓ thấy =====
  { 
    id: 13, 
    correctAnswer: "2",
    type: "hidden",
    description: "Người mù màu có thể thấy: 2",
    // Nền xanh ngọc (teal) và số cam - độ sáng tương tự nhau
    // Người bình thường khó phân biệt vì màu sắc gây nhiễu
    // Người mù màu thấy được vì họ phân biệt theo độ sáng
    bgColors: ["#26A69A", "#4DB6AC", "#80CBC4", "#009688", "#00897B", "#B2DFDB"],
    numColors: ["#FF8A65", "#FFAB91", "#FFCCBC", "#FF7043", "#FF5722", "#FBE9E7"],
  },
  { 
    id: 14, 
    correctAnswer: "5",
    type: "hidden",
    description: "Người mù màu có thể thấy: 5",
    // Nền tím/hồng và số xanh dương - khó phân biệt với người bình thường
    bgColors: ["#AB47BC", "#BA68C8", "#CE93D8", "#9C27B0", "#8E24AA", "#E1BEE7"],
    numColors: ["#7986CB", "#9FA8DA", "#C5CAE9", "#5C6BC0", "#3F51B5", "#E8EAF6"],
  },
  { 
    id: 15, 
    correctAnswer: "16",
    type: "hidden",
    description: "Người mù màu có thể thấy: 16",
    // Nền cam nhạt và số xanh lá nhạt - độ sáng tương đương
    bgColors: ["#FFCC80", "#FFE0B2", "#FFF3E0", "#FFB74D", "#FFA726", "#FFECB3"],
    numColors: ["#A5D6A7", "#C8E6C9", "#E8F5E9", "#81C784", "#66BB6A", "#DCEDC8"],
  },
  { 
    id: 16, 
    correctAnswer: "42",
    type: "hidden", 
    description: "Người mù màu có thể thấy: 42",
    // Nền đỏ nhạt và số xanh ngọc nhạt
    bgColors: ["#EF9A9A", "#FFCDD2", "#FFEBEE", "#E57373", "#EF5350", "#FCE4EC"],
    numColors: ["#80DEEA", "#B2EBF2", "#E0F7FA", "#4DD0E1", "#26C6DA", "#E0F2F1"],
  },
  // ===== THÊM CÁC PLATE TRANSFORMATION =====
  { 
    id: 17, 
    correctAnswer: "73",
    type: "transformation",
    description: "Người bình thường: 73",
    bgColors: ["#66BB6A", "#81C784", "#A5D6A7", "#4CAF50", "#43A047", "#C8E6C9"],
    numColors: ["#FF5722", "#FF7043", "#FF8A65", "#F4511E", "#E64A19", "#FFAB91"],
  },
  { 
    id: 18, 
    correctAnswer: "26",
    type: "transformation",
    description: "Người bình thường: 26",
    bgColors: ["#AED581", "#C5E1A5", "#DCEDC8", "#9CCC65", "#8BC34A", "#E8F5E9"],
    numColors: ["#D84315", "#E64A19", "#F4511E", "#BF360C", "#FF5722", "#FF7043"],
  },
];

// Hàm vẽ Ishihara Plate trên canvas
const drawIshiharaPlate = (canvas, plate) => {
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 5;
  
  // Clear canvas
  ctx.clearRect(0, 0, size, size);
  
  // Fill background với màu trắng
  ctx.fillStyle = '#f5f5f0';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Tạo các chấm tròn - TĂNG MẬT ĐỘ VÀ GIẢM KÍCH THƯỚC
  const dots = [];
  const minDotRadius = size * 0.012;  // Chấm nhỏ hơn để rõ số hơn
  const maxDotRadius = size * 0.028;  // Kích thước max nhỏ hơn
  const padding = 1; // Giảm padding để chấm dày đặc hơn
  
  // Tạo đường path cho số - TĂNG KÍCH THƯỚC SỐ
  const numberPath = createNumberPath(plate.correctAnswer, centerX, centerY, size * 0.5); // Số to hơn
  
  // Đổ đầy hình tròn bằng các chấm - TĂNG SỐ LƯỢNG
  let attempts = 0;
  const maxAttempts = 5000; // Tăng số lần thử
  
  while (attempts < maxAttempts) {
    attempts++;
    
    // Random vị trí trong hình tròn
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * (radius - maxDotRadius);
    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;
    
    // Random kích thước chấm
    const dotRadius = minDotRadius + Math.random() * (maxDotRadius - minDotRadius);
    
    // Kiểm tra chấm có nằm trong hình tròn không
    const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    if (distFromCenter + dotRadius > radius) continue;
    
    // Kiểm tra chồng lấn với các chấm khác
    let overlapping = false;
    for (const dot of dots) {
      const dist = Math.sqrt((x - dot.x) ** 2 + (y - dot.y) ** 2);
      if (dist < dot.radius + dotRadius + padding) {
        overlapping = true;
        break;
      }
    }
    if (overlapping) continue;
    
    // Kiểm tra chấm có nằm trên số không
    const isOnNumber = isPointInNumberPath(x, y, numberPath);
    
    // Chọn màu - TĂNG ĐỘ TƯƠNG PHẢN
    let color;
    if (plate.type === 'hidden') {
      // Với hidden plate, số gần như cùng màu với nền (khó thấy với người bình thường)
      if (isOnNumber) {
        color = plate.numColors[Math.floor(Math.random() * plate.numColors.length)];
      } else {
        color = plate.bgColors[Math.floor(Math.random() * plate.bgColors.length)];
      }
    } else {
      // Với các plate khác, số có màu tương phản RÕ RÀNG với nền
      if (isOnNumber) {
        color = plate.numColors[Math.floor(Math.random() * plate.numColors.length)];
      } else {
        color = plate.bgColors[Math.floor(Math.random() * plate.bgColors.length)];
      }
    }
    
    dots.push({ x, y, radius: dotRadius, color });
  }
  
  // Vẽ tất cả các chấm
  dots.forEach(dot => {
    ctx.fillStyle = dot.color;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
    ctx.fill();
  });
};

// Tạo path cho số (trả về mảng các điểm tạo thành số)
const createNumberPath = (numberStr, centerX, centerY, fontSize) => {
  const paths = [];
  const digits = numberStr.split('');
  const digitWidth = fontSize * 0.7; // Tăng độ rộng số
  const totalWidth = digits.length * digitWidth;
  let startX = centerX - totalWidth / 2;
  
  digits.forEach((digit) => {
    const digitPath = getDigitPath(digit, startX + digitWidth / 2, centerY, fontSize);
    paths.push(...digitPath);
    startX += digitWidth;
  });
  
  return paths;
};

// Lấy path cho từng chữ số - TĂNG ĐỘ DÀY NÉT
const getDigitPath = (digit, cx, cy, size) => {
  const h = size; // Chiều cao
  const w = size * 0.6; // Chiều rộng - tăng lên
  const t = size * 0.18; // Độ dày nét - TĂNG MẠNH từ 0.12 lên 0.18
  
  // Định nghĩa các segment (trên, giữa, dưới, trái-trên, trái-dưới, phải-trên, phải-dưới)
  const segments = {
    '0': ['top', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'bottom'],
    '1': ['topRight', 'bottomRight'],
    '2': ['top', 'topRight', 'middle', 'bottomLeft', 'bottom'],
    '3': ['top', 'topRight', 'middle', 'bottomRight', 'bottom'],
    '4': ['topLeft', 'topRight', 'middle', 'bottomRight'],
    '5': ['top', 'topLeft', 'middle', 'bottomRight', 'bottom'],
    '6': ['top', 'topLeft', 'middle', 'bottomLeft', 'bottomRight', 'bottom'],
    '7': ['top', 'topRight', 'bottomRight'],
    '8': ['top', 'topLeft', 'topRight', 'middle', 'bottomLeft', 'bottomRight', 'bottom'],
    '9': ['top', 'topLeft', 'topRight', 'middle', 'bottomRight', 'bottom'],
  };
  
  const activeSegments = segments[digit] || [];
  const rects = [];
  
  activeSegments.forEach(seg => {
    switch (seg) {
      case 'top':
        rects.push({ x: cx - w/2, y: cy - h/2, w: w, h: t });
        break;
      case 'middle':
        rects.push({ x: cx - w/2, y: cy - t/2, w: w, h: t });
        break;
      case 'bottom':
        rects.push({ x: cx - w/2, y: cy + h/2 - t, w: w, h: t });
        break;
      case 'topLeft':
        rects.push({ x: cx - w/2, y: cy - h/2, w: t, h: h/2 + t/2 });
        break;
      case 'bottomLeft':
        rects.push({ x: cx - w/2, y: cy - t/2, w: t, h: h/2 + t/2 });
        break;
      case 'topRight':
        rects.push({ x: cx + w/2 - t, y: cy - h/2, w: t, h: h/2 + t/2 });
        break;
      case 'bottomRight':
        rects.push({ x: cx + w/2 - t, y: cy - t/2, w: t, h: h/2 + t/2 });
        break;
      default:
        break;
    }
  });
  
  return rects;
};

// Kiểm tra điểm có nằm trong path số không
const isPointInNumberPath = (px, py, rects) => {
  for (const rect of rects) {
    if (px >= rect.x && px <= rect.x + rect.w &&
        py >= rect.y && py <= rect.y + rect.h) {
      return true;
    }
  }
  return false;
};

export default function CameraView() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const ishiharaCanvasRef = useRef(null); // Canvas cho Ishihara plates
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const [filter, setFilter] = useState("none");
  const [glassIndex, setGlassIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [autoMode, setAutoMode] = useState(true);
  const [faceAnalysis, setFaceAnalysis] = useState(null);

  // CHẾ ĐỘ NHIỀU NGƯỜI (Tự động kích hoạt khi có >1 người)
  const [detectedFaces, setDetectedFaces] = useState(0);
  const multiPersonMode = detectedFaces > 1; // Tự động bật khi có nhiều người
  
  // HIỆU ỨNG CHỤP ẢNH
  const [showFlash, setShowFlash] = useState(false);
  const [captureSuccess, setCaptureSuccess] = useState(false);

  // PRELOAD TẤT CẢ ẢNH MẮT KÍNH - SỬA LỖI NHẢY LOẠN XẠ
  const glassesImagesRef = useRef({});
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // FACE TRACKING - GIỮ ID ỔN ĐỊNH CHO MỖI KHUÔN MẶT
  const faceTrackerRef = useRef([]);
  const nextFaceIdRef = useRef(0);

  // TINH NANG MOI: BAT/TAT MAT KINH
  const [glassesEnabled, setGlassesEnabled] = useState(false);

  // TINH NANG MOI: DO KHOANG CACH DUA TREN DIEN TICH KHUON MAT
  const [faceDistance, setFaceDistance] = useState(0.5); // 0 = rat gan, 1 = rat xa

  // TINH NANG MOI: DIEU CHINH DO KHUC XA (Dioptri)
  const [visionSettings, setVisionSettings] = useState({
    myopia: 0,        // Can thi (-0.25 den -10.00)
    hyperopia: 0,     // Vien thi (+0.25 den +6.00) 
    astigmatism: 0,   // Loan thi (0 den -6.00)
    axis: 0,          // Truc loan thi (0-180 do)
  });
  const [showVisionPanel, setShowVisionPanel] = useState(false);

  // TINH NANG MOI: TAB NAVIGATION (for mobile)
  const [activeTab, setActiveTab] = useState('effects'); // effects, glasses, tools



  // TINH NANG MOI: COLOR BLIND TEST
  const [showColorTest, setShowColorTest] = useState(false);
  const [colorTestIndex, setColorTestIndex] = useState(0);
  const [colorTestAnswers, setColorTestAnswers] = useState([]);
  const [colorTestResult, setColorTestResult] = useState(null);
  const [colorTestOptions, setColorTestOptions] = useState([]);

  // TINH NANG MOI: GALLERY (Lich su thu kinh)
  const [gallery, setGallery] = useState([]);
  const [showGallery, setShowGallery] = useState(false);



  // Hàm phân tích khuôn mặt và gợi ý mắt kính
  const analyzeFaceAndRecommend = useCallback((faceLandmarks, canvasWidth, canvasHeight) => {
    if (!faceLandmarks || faceLandmarks.length === 0) return null;

    const face = faceLandmarks[0];

    // Lấy các điểm quan trọng
    const leftEye = face[33];
    const rightEye = face[263];
    const chin = face[152];
    const leftCheek = face[234];
    const rightCheek = face[454];
    const forehead = face[10];

    // Tính khoảng cách mắt (face width)
    const eyeDistance = Math.abs(rightEye.x - leftEye.x);

    // Tính chiều cao khuôn mặt
    const faceHeight = Math.abs(chin.y - forehead.y);

    // Tính chiều rộng khuôn mặt (từ má trái sang má phải)
    const faceWidth = Math.abs(rightCheek.x - leftCheek.x);

    // ===== TÍNH DIỆN TÍCH KHUÔN MẶT ĐỂ ƯỚC LƯỢNG KHOẢNG CÁCH =====
    // Diện tích = faceWidth * faceHeight (normalized 0-1)
    const normalizedFaceArea = faceWidth * faceHeight;
    
    // Quy đổi diện tích thành khoảng cách ước lượng
    // Diện tích lớn (>0.15) = gần, diện tích nhỏ (<0.03) = xa
    // faceDistance: 0 = rất gần, 1 = rất xa
    const minArea = 0.02;  // Khuôn mặt rất xa
    const maxArea = 0.20;  // Khuôn mặt rất gần
    const clampedArea = Math.max(minArea, Math.min(maxArea, normalizedFaceArea));
    const estimatedDistance = 1 - ((clampedArea - minArea) / (maxArea - minArea));
    
    // Cập nhật state
    setFaceDistance(estimatedDistance);

    // Tỷ lệ khuôn mặt
    const faceRatio = faceWidth / faceHeight;

    // Phân loại hình dạng khuôn mặt
    let faceShape = "oval";
    if (faceRatio > 0.85) {
      faceShape = "round"; // mặt tròn
    } else if (faceRatio < 0.65) {
      faceShape = "triangle"; // mặt dài
    } else if (faceRatio >= 0.75 && faceRatio <= 0.85) {
      faceShape = "square"; // mặt vuông
    } else if (faceRatio >= 0.65 && faceRatio < 0.75) {
      faceShape = "heart"; // mặt tim
    }

    // Tìm mắt kính phù hợp nhất
    const suitableGlasses = glassesList.filter(
      (glass) =>
        glass.suitableFaceShape.includes(faceShape) &&
        eyeDistance >= glass.minFaceWidth &&
        eyeDistance <= glass.maxFaceWidth
    );

    const recommended =
      suitableGlasses.length > 0 ? suitableGlasses[0] : glassesList[0];

    return {
      eyeDistance,
      faceWidth,
      faceHeight,
      faceRatio,
      faceShape,
      normalizedFaceArea,
      estimatedDistance,
      recommendedGlass: recommended,
    };
  }, []);

  // Preload tất cả ảnh mắt kính khi component mount (ca professional va fun)
  useEffect(() => {
    const loadImages = async () => {
      const allGlasses = [...glassesList];
      const promises = allGlasses.map((glass) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            glassesImagesRef.current[glass.id] = img;
            resolve();
          };
          img.onerror = () => resolve(); // Khong reject de khong lam hong ca batch
          img.src = glass.url;
        });
      });

      try {
        await Promise.all(promises);
        setImagesLoaded(true);
        console.log("Da load xong tat ca anh mat kinh!");
      } catch (error) {
        console.error("Loi load anh mat kinh:", error);
      }
    };

    loadImages();
  }, []);

  // COLOR BLIND TEST FUNCTIONS - Chuẩn y khoa
  const generateOptions = (index) => {
    const plate = ishiharaPlates[index];
    const correctAnswer = plate.correctAnswer;
    
    // Nếu là plate "hidden" (người bình thường không thấy số)
    if (plate.type === "hidden") {
      // Tạo các đáp án ngẫu nhiên, đáp án đúng là "Không thấy số"
      const fakeNumbers = [];
      while (fakeNumbers.length < 5) {
        const num = Math.floor(Math.random() * 90) + 1;
        if (!fakeNumbers.includes(String(num))) {
          fakeNumbers.push(String(num));
        }
      }
      const shuffled = fakeNumbers.sort(() => Math.random() - 0.5);
      return [...shuffled, '?']; // '?' = Không thấy số (đáp án đúng cho hidden plates)
    }
    
    // Với các plate thông thường
    const correctNum = parseInt(correctAnswer);
    const options = new Set([correctAnswer]);
    
    // Tạo 5 đáp án nhiễu gần với đáp án đúng
    while (options.size < 6) {
      const variance = Math.floor(Math.random() * 20) - 10;
      const randomNum = Math.max(1, Math.min(99, correctNum + variance));
      if (String(randomNum) !== correctAnswer) {
        options.add(String(randomNum));
      }
    }
    
    // Shuffle và thêm option "Không thấy số"
    const shuffled = [...options].sort(() => Math.random() - 0.5);
    return [...shuffled, '?'];
  };

  const startColorTest = () => {
    setShowColorTest(true);
    setColorTestIndex(0);
    setColorTestAnswers([]);
    setColorTestResult(null);
    setColorTestOptions(generateOptions(0));
  };

  // Effect để vẽ Ishihara plate khi test bắt đầu hoặc khi chuyển câu hỏi
  useEffect(() => {
    if (showColorTest && !colorTestResult && ishiharaCanvasRef.current) {
      const canvas = ishiharaCanvasRef.current;
      canvas.width = 280;
      canvas.height = 280;
      drawIshiharaPlate(canvas, ishiharaPlates[colorTestIndex]);
    }
  }, [showColorTest, colorTestIndex, colorTestResult]);

  const submitColorTestAnswer = (answer) => {
    const newAnswers = [...colorTestAnswers, answer];
    setColorTestAnswers(newAnswers);
    
    if (colorTestIndex < ishiharaPlates.length - 1) {
      const nextIndex = colorTestIndex + 1;
      setColorTestIndex(nextIndex);
      setColorTestOptions(generateOptions(nextIndex));
    } else {
      // Tính kết quả theo chuẩn y khoa
      let correctTransformation = 0; // Plates biến đổi (người bình thường thấy số)
      let correctHidden = 0; // Plates ẩn (người bình thường không thấy)
      let totalTransformation = 0;
      let totalHidden = 0;
      
      newAnswers.forEach((ans, idx) => {
        const plate = ishiharaPlates[idx];
        if (plate.type === "hidden") {
          totalHidden++;
          // Người bình thường không thấy số trong hidden plates
          if (ans === '?') correctHidden++;
        } else {
          totalTransformation++;
          // Người bình thường thấy đúng số
          if (ans === plate.correctAnswer) correctTransformation++;
        }
      });
      
      const totalCorrect = correctTransformation + correctHidden;
      const percentage = (totalCorrect / ishiharaPlates.length) * 100;
      
      // Chẩn đoán theo chuẩn y khoa
      let diagnosis = "";
      let severity = "normal";
      
      if (percentage >= 90) {
        diagnosis = "Thị lực màu bình thường. Bạn có khả năng phân biệt màu sắc tốt.";
        severity = "normal";
      } else if (percentage >= 75) {
        diagnosis = "Có dấu hiệu rối loạn nhận màu nhẹ. Nên kiểm tra thêm với chuyên gia.";
        severity = "mild";
      } else if (percentage >= 50) {
        diagnosis = "Có thể bị rối loạn sắc giác (mù màu một phần). Khuyến nghị khám chuyên khoa mắt.";
        severity = "moderate";
      } else {
        diagnosis = "Có dấu hiệu mù màu. Cần đến bác sĩ chuyên khoa mắt để chẩn đoán chính xác.";
        severity = "severe";
      }
      
      setColorTestResult({ 
        correct: totalCorrect, 
        total: ishiharaPlates.length, 
        percentage, 
        diagnosis,
        severity,
        details: {
          transformation: { correct: correctTransformation, total: totalTransformation },
          hidden: { correct: correctHidden, total: totalHidden }
        }
      });
    }
  };

  // ADD TO GALLERY
  const addToGallery = (imageData, glassName) => {
    const newItem = {
      id: Date.now(),
      image: imageData,
      glassName,
      timestamp: new Date().toLocaleString('vi-VN'),
    };
    setGallery(prev => [newItem, ...prev].slice(0, 12)); // Max 12 items
  };

  useEffect(() => {
    async function initFace() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      const detector = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        },
        runningMode: "VIDEO",
        numFaces: 5, // TĂNG LÊN 5 KHUÔN MẶT
      });
      setFaceLandmarker(detector);
    }
    initFace();
  }, []);

  useEffect(() => {
    let animationId;
    const draw = async () => {
      if (!webcamRef.current || !faceLandmarker) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      const video = webcamRef.current.video;
      if (video.readyState !== 4) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const results = faceLandmarker.detectForVideo(video, performance.now());

      // CẬP NHẬT SỐ KHUÔN MẶT
      const numFaces = results.faceLandmarks?.length || 0;
      setDetectedFaces(numFaces);

      // FACE TRACKING - Gán ID ổn định cho mỗi khuôn mặt
      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const currentFaces = results.faceLandmarks.map((face) => {
          const leftEye = face[33];
          const rightEye = face[263];
          const noseTip = face[1];
          return {
            x: (leftEye.x + rightEye.x + noseTip.x) / 3,
            y: (leftEye.y + rightEye.y + noseTip.y) / 3,
          };
        });

        // Match với tracked faces (trong vòng 0.1 khoảng cách)
        const newTracker = [];
        const usedOldIndices = new Set();

        currentFaces.forEach((currentFace) => {
          let bestMatch = -1;
          let bestDistance = 0.1; // threshold

          faceTrackerRef.current.forEach((trackedFace, trackedIndex) => {
            if (usedOldIndices.has(trackedIndex)) return;
            const distance = Math.hypot(
              currentFace.x - trackedFace.x,
              currentFace.y - trackedFace.y
            );
            if (distance < bestDistance) {
              bestDistance = distance;
              bestMatch = trackedIndex;
            }
          });

          if (bestMatch !== -1) {
            // Match found - giữ nguyên ID
            usedOldIndices.add(bestMatch);
            newTracker.push({
              ...currentFace,
              id: faceTrackerRef.current[bestMatch].id,
            });
          } else {
            // Khuôn mặt mới - gán ID mới
            newTracker.push({
              ...currentFace,
              id: nextFaceIdRef.current++,
            });
          }
        });

        faceTrackerRef.current = newTracker;
      } else {
        faceTrackerRef.current = [];
      }

      if (results.faceLandmarks?.length > 0 && imagesLoaded) {
        // Phân tích khuôn mặt đầu tiên (truyền canvas size để tính diện tích)
        const analysis = analyzeFaceAndRecommend(results.faceLandmarks, canvas.width, canvas.height);

        if (analysis) {
          setFaceAnalysis(analysis);

          // Tự động chọn mắt kính (chỉ ở mode đơn)
          if (autoMode && !multiPersonMode && analysis.recommendedGlass) {
            const recommendedIndex = glassesList.findIndex(
              (g) => g.id === analysis.recommendedGlass.id
            );
            if (recommendedIndex !== -1 && recommendedIndex !== glassIndex) {
              setGlassIndex(recommendedIndex);
            }
          }
        }

        // VẼ MẮT KÍNH CHO TẤT CẢ KHUÔN MẶT (chi khi glassesEnabled = true)
        if (glassesEnabled) {
        results.faceLandmarks.forEach((face, faceIndex) => {
          const leftEye = face[33];
          const rightEye = face[263];

          // Tính khoảng cách và góc nghiêng
          const eyeCenterX = ((leftEye.x + rightEye.x) / 2) * canvas.width;
          const eyeCenterY = ((leftEye.y + rightEye.y) / 2) * canvas.height;

          const dx = (rightEye.x - leftEye.x) * canvas.width;
          const dy = (rightEye.y - leftEye.y) * canvas.height;
          const angle = Math.atan2(dy, dx);

          // Tính khoảng cách giữa 2 mắt để scale
          const eyeDistance = Math.hypot(dx, dy);

          // Lấy stable ID từ face tracker
          const stableFaceId = faceTrackerRef.current[faceIndex]?.id ?? faceIndex;

          // Su dung glass index hien tai
          const currentGlass = glassesList[glassIndex];
          const scaleMultiplier = currentGlass.scaleMultiplier || 1.6;

          // Tự động điều chỉnh kích thước
          const glassWidth = eyeDistance * scaleMultiplier;
          const glassHeight = glassWidth * 0.35;

          // Điều chỉnh vị trí Y
          const offsetY = eyeDistance * 0.03;

          // SỬ DỤNG ẢNH ĐÃ PRELOAD - KHÔNG TẠO MỚI
          const glassesImg = glassesImagesRef.current[currentGlass.id];
          if (!glassesImg) return; // Skip nếu ảnh chưa load

          ctx.save();
          ctx.translate(eyeCenterX, eyeCenterY - offsetY);
          ctx.rotate(angle);
          ctx.drawImage(
            glassesImg,
            -glassWidth / 2,
            -glassHeight / 2,
            glassWidth,
            glassHeight
          );
          ctx.restore();

          // VẼ SỐ THỨ TỰ NGƯỜI (dùng stable ID)
          if (multiPersonMode && numFaces > 1) {
            const displayNumber = stableFaceId + 1; // Hiển thị ID ổn định

            ctx.save();
            ctx.fillStyle = "rgba(59, 130, 246, 0.9)";
            ctx.strokeStyle = "white";
            ctx.lineWidth = 3;
            ctx.font = "bold 24px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const labelX = eyeCenterX;
            const labelY = eyeCenterY - eyeDistance * 0.6;

            ctx.beginPath();
            ctx.arc(labelX, labelY, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "white";
            ctx.fillText(displayNumber.toString(), labelX, labelY);
            ctx.restore();
          }
        });
        } // end if glassesEnabled
      }

      // HIEU UNG MO PHONG DO KHUC XA (Dioptri) - iOS compatible manual blur
      const applyVisionBlur = () => {
        const { myopia, hyperopia, astigmatism } = visionSettings;
        
        // Tinh tong do mo dua tren cac thong so
        let blurAmount = 0;
        
        // Can thi: cang am cang mo xa
        if (myopia < 0) {
          blurAmount += Math.abs(myopia) * 1.5;
        }
        
        // Vien thi: cang duong cang mo gan (mo it hon)
        if (hyperopia > 0) {
          blurAmount += hyperopia * 0.8;
        }
        
        // Loan thi: them hieu ung mo khong deu
        if (astigmatism < 0) {
          blurAmount += Math.abs(astigmatism) * 1.2;
        }
        
        if (blurAmount > 0) {
          // iOS compatible: manual box blur
          const radius = Math.min(Math.round(blurAmount), 15);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          const w = canvas.width;
          const h = canvas.height;
          const tempData = new Uint8ClampedArray(data);
          
          for (let y = radius; y < h - radius; y += 2) {
            for (let x = radius; x < w - radius; x += 2) {
              let r = 0, g = 0, b = 0, count = 0;
              for (let dy = -radius; dy <= radius; dy += 3) {
                for (let dx = -radius; dx <= radius; dx += 3) {
                  const idx = ((y + dy) * w + (x + dx)) * 4;
                  r += tempData[idx];
                  g += tempData[idx + 1];
                  b += tempData[idx + 2];
                  count++;
                }
              }
              // Apply to 2x2 block for performance
              for (let py = 0; py < 2 && y + py < h; py++) {
                for (let px = 0; px < 2 && x + px < w; px++) {
                  const idx = ((y + py) * w + (x + px)) * 4;
                  data[idx] = r / count;
                  data[idx + 1] = g / count;
                  data[idx + 2] = b / count;
                }
              }
            }
          }
          ctx.putImageData(imageData, 0, 0);
        }
      };
      
      // Ap dung hieu ung khuc xa neu co gia tri
      if (visionSettings.myopia !== 0 || visionSettings.hyperopia !== 0 || visionSettings.astigmatism !== 0) {
        applyVisionBlur();
      }

      // Filter mô phỏng các tình trạng thị giác
      if (filter === "colorblind") {
        // Mù màu đỏ-xanh lục (Deuteranopia) - phổ biến nhất
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Chuyển đổi màu theo công thức deuteranopia
          data[i] = 0.625 * r + 0.375 * g; // Red
          data[i + 1] = 0.7 * r + 0.3 * g; // Green
          data[i + 2] = 0.3 * g + 0.7 * b; // Blue
        }
        ctx.putImageData(imageData, 0, 0);
      } else if (filter === "nearsighted") {
        // CẬN THỊ - ĐỘNG THEO KHOẢNG CÁCH
        // Cận thị: nhìn gần RÕ, nhìn xa MỜ
        // faceDistance: 0 = gần (rõ), 1 = xa (mờ)
        const blurIntensity = faceDistance; // Càng xa càng mờ
        
        if (blurIntensity > 0.1) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          const w = canvas.width;
          const h = canvas.height;
          // Radius động từ 2 đến 12 dựa trên khoảng cách
          const radius = Math.max(2, Math.round(blurIntensity * 12));
          
          // Simple box blur algorithm (iOS compatible)
          const tempData = new Uint8ClampedArray(data);
          const step = Math.max(1, Math.floor(radius / 4)); // Tối ưu performance
          
          for (let y = radius; y < h - radius; y += 2) {
            for (let x = radius; x < w - radius; x += 2) {
              let r = 0, g = 0, b = 0, count = 0;
              for (let dy = -radius; dy <= radius; dy += step) {
                for (let dx = -radius; dx <= radius; dx += step) {
                  const idx = ((y + dy) * w + (x + dx)) * 4;
                  r += tempData[idx];
                  g += tempData[idx + 1];
                  b += tempData[idx + 2];
                  count++;
                }
              }
              // Apply blur to 2x2 block
              for (let py = 0; py < 2 && y + py < h; py++) {
                for (let px = 0; px < 2 && x + px < w; px++) {
                  const idx = ((y + py) * w + (x + px)) * 4;
                  data[idx] = r / count;
                  data[idx + 1] = g / count;
                  data[idx + 2] = b / count;
                }
              }
            }
          }
          ctx.putImageData(imageData, 0, 0);
        }
        // Nếu blurIntensity <= 0.1 (rất gần) thì hình ảnh rõ nét
      } else if (filter === "farsighted") {
        // VIỄN THỊ - ĐỘNG THEO KHOẢNG CÁCH
        // Viễn thị: nhìn xa RÕ, nhìn gần MỜ
        // faceDistance: 0 = gần (mờ), 1 = xa (rõ)
        const blurIntensity = 1 - faceDistance; // Càng gần càng mờ
        
        if (blurIntensity > 0.1) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          const w = canvas.width;
          const h = canvas.height;
          const tempData = new Uint8ClampedArray(data);
          // Radius động từ 2 đến 14 dựa trên độ gần
          const blurRadius = Math.max(2, Math.round(blurIntensity * 14));
          const step = Math.max(2, Math.floor(blurRadius / 3));
          
          for (let y = blurRadius; y < h - blurRadius; y += 2) {
            for (let x = blurRadius; x < w - blurRadius; x += 2) {
              let r = 0, g = 0, b = 0, count = 0;
              for (let dy = -blurRadius; dy <= blurRadius; dy += step) {
                for (let dx = -blurRadius; dx <= blurRadius; dx += step) {
                  const idx = ((y + dy) * w + (x + dx)) * 4;
                  r += tempData[idx];
                  g += tempData[idx + 1];
                  b += tempData[idx + 2];
                  count++;
                }
              }
              for (let py = 0; py < 2 && y + py < h; py++) {
                for (let px = 0; px < 2 && x + px < w; px++) {
                  const idx = ((y + py) * w + (x + px)) * 4;
                  data[idx] = r / count;
                  data[idx + 1] = g / count;
                  data[idx + 2] = b / count;
                }
              }
            }
          }
          ctx.putImageData(imageData, 0, 0);
        }
        // Nếu blurIntensity <= 0.1 (rất xa) thì hình ảnh rõ nét
      } else if (filter === "lightsensitive") {
        // Nhạy sáng - tăng độ sáng và giảm độ tương phản
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "overlay";
        ctx.fillStyle = "rgba(255,255,200,0.2)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "source-over";
      } else if (filter === "cataract") {
        // Đục thủy tinh thể - mờ và vàng (iOS compatible)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const w = canvas.width;
        const h = canvas.height;
        const tempData = new Uint8ClampedArray(data);
        const blurRadius = 5;
        
        // Apply blur + yellow tint + brightness
        for (let y = blurRadius; y < h - blurRadius; y += 2) {
          for (let x = blurRadius; x < w - blurRadius; x += 2) {
            let r = 0, g = 0, b = 0, count = 0;
            for (let dy = -blurRadius; dy <= blurRadius; dy += 2) {
              for (let dx = -blurRadius; dx <= blurRadius; dx += 2) {
                const idx = ((y + dy) * w + (x + dx)) * 4;
                r += tempData[idx];
                g += tempData[idx + 1];
                b += tempData[idx + 2];
                count++;
              }
            }
            // Apply to 2x2 block with yellow tint and brightness
            for (let py = 0; py < 2 && y + py < h; py++) {
              for (let px = 0; px < 2 && x + px < w; px++) {
                const idx = ((y + py) * w + (x + px)) * 4;
                // Blur + brightness(1.2) + contrast(0.8) + yellow tint
                const avgR = Math.min(255, (r / count) * 1.15 + 30);
                const avgG = Math.min(255, (g / count) * 1.1 + 20);
                const avgB = Math.min(255, (b / count) * 0.85);
                data[idx] = avgR;
                data[idx + 1] = avgG;
                data[idx + 2] = avgB;
              }
            }
          }
        }
        ctx.putImageData(imageData, 0, 0);
      } else if (filter === "glaucoma") {
        // Tăng nhãn áp - mất thị giác ngoại vi (tunnel vision)
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);

        // Tạo hiệu ứng đen viền (mất thị giác ngoại vi)
        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          maxRadius * 0.3,
          centerX,
          centerY,
          maxRadius * 0.8
        );
        gradient.addColorStop(0, "rgba(0,0,0,0)");
        gradient.addColorStop(0.7, "rgba(0,0,0,0.5)");
        gradient.addColorStop(1, "rgba(0,0,0,0.9)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (filter === "diabetic") {
        // Bệnh võng mạc tiểu đường - có đốm đen và mờ (iOS compatible)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const w = canvas.width;
        const h = canvas.height;
        const tempData = new Uint8ClampedArray(data);
        const blurRadius = 2;
        
        // Light blur + contrast reduction
        for (let y = blurRadius; y < h - blurRadius; y += 2) {
          for (let x = blurRadius; x < w - blurRadius; x += 2) {
            let r = 0, g = 0, b = 0, count = 0;
            for (let dy = -blurRadius; dy <= blurRadius; dy++) {
              for (let dx = -blurRadius; dx <= blurRadius; dx++) {
                const idx = ((y + dy) * w + (x + dx)) * 4;
                r += tempData[idx];
                g += tempData[idx + 1];
                b += tempData[idx + 2];
                count++;
              }
            }
            for (let py = 0; py < 2 && y + py < h; py++) {
              for (let px = 0; px < 2 && x + px < w; px++) {
                const idx = ((y + py) * w + (x + px)) * 4;
                // Apply blur with slight contrast reduction (0.9)
                data[idx] = ((r / count) - 128) * 0.9 + 128;
                data[idx + 1] = ((g / count) - 128) * 0.9 + 128;
                data[idx + 2] = ((b / count) - 128) * 0.9 + 128;
              }
            }
          }
        }
        ctx.putImageData(imageData, 0, 0);

        // Thêm các đốm đen ngẫu nhiên
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const radius = Math.random() * 3 + 1;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(draw);
    };
    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [
    faceLandmarker,
    filter,
    glassIndex,
    autoMode,
    analyzeFaceAndRecommend,
    multiPersonMode,
    imagesLoaded,
    glassesEnabled,
    visionSettings,
    faceDistance,
  ]);

  const capture = async () => {
    // HIỆU ỨNG FLASH
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 200);
    
    // ÂMTHANH CHỤP (optional - có thể thêm sau)
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWa78OSXUhELTaTk7qFRCw0+ldXyvm0hBSuBzvLZiTYIGGa78OSXUhELTKPk7p9RCw0+lNXyvWwhBSuBzvLZiTcIF2a77+SWURENTKPk7p9RCw0+lNXyvWwhBSuBzvLZiTcIF2a77+SWURENTKPk7p9RCw0+lNXyvWwhBSuBzvLZiTcIF2a77+SWURENTKPk7p9RCw0+lNXyvWwhBSuBzvLZiTcIF2a77+SWURENTKPk7p9RCw0+lNXyvWwhBSuBzvLZiTcIF2a77+SWURENTKPk7p9RCw0+lNXyvWwhBSuBzvLZiTcIF2a77+SWURENTKPk7p9RCw0+lNXyvWwhBSuBzvLZiTcIF2a77+SWURENTKPk7p9RCw0=');
    audio.volume = 0.3;
    audio.play().catch(() => {}); // Ignore if autoplay blocked
    
    const canvas = canvasRef.current;
    const imageSrc = canvas.toDataURL("image/jpeg", 0.95);
    setLoading(true);
    
    try {
      // TỰ ĐỘNG DOWNLOAD ẢNH
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      link.download = `SeeBeyond_${timestamp}.jpg`;
      link.href = imageSrc;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // HIỂN THỊ THÔNG BÁO THÀNH CÔNG
      setCaptureSuccess(true);
      setTimeout(() => setCaptureSuccess(false), 3000);
      
      // ADD TO GALLERY
      const currentGlassName = glassesList[glassIndex]?.name;
      addToGallery(imageSrc, currentGlassName || 'Unknown');
      
    } catch (error) {
      console.error('Capture error:', error);
      alert('Có lỗi khi chụp ảnh. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-sky-50">
      {/* MAIN LAYOUT - Responsive */}
      <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-5 w-full p-2 sm:p-3 md:p-5 lg:p-6 max-w-[1280px] mx-auto">
        
        {/* CAMERA SECTION */}
        <div className="w-full lg:flex-1">
          {/* Camera Container */}
          <div className="relative rounded-xl overflow-hidden shadow-lg bg-black border border-gray-200">
            {/* Aspect ratio container - portrait on mobile, landscape on desktop */}
            <div className="relative w-full aspect-[3/4] sm:aspect-[4/3]">
              <Webcam
                ref={webcamRef}
                mirrored={false}
                className="absolute inset-0 w-full h-full object-cover"
                videoConstraints={{
                  facingMode: "user",
                  width: { ideal: 1280 },
                  height: { ideal: 960 },
                }}
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
              />
              
              {/* Flash Effect */}
              {showFlash && (
                <div className="absolute inset-0 bg-white animate-flash pointer-events-none" />
              )}
              
              {/* Top Bar - Info badges */}
              <div className="absolute top-0 left-0 right-0 p-2 md:p-3 flex justify-between items-start">
                {faceAnalysis && !multiPersonMode && (
                  <div className="bg-black/60 text-white text-[10px] md:text-xs px-2 md:px-3 py-1 rounded font-medium">
                    {faceAnalysis.faceShape}
                  </div>
                )}
                {detectedFaces > 0 && (
                  <div className="bg-black/60 text-white text-[10px] md:text-xs px-2 md:px-3 py-1 rounded font-medium ml-auto">
                    Phát hiện: {detectedFaces} khuôn mặt
                  </div>
                )}
              </div>

              {/* Distance Indicator - Hiển thị khi dùng filter cận/viễn thị */}
              {(filter === "nearsighted" || filter === "farsighted") && detectedFaces > 0 && (
                <div className="absolute top-10 left-0 right-0 flex justify-center">
                  <div className="bg-black/70 text-white px-3 py-2 rounded-lg text-xs flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span>📏</span>
                      <span>Khoảng cách:</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {/* Distance bar */}
                      <div className="w-20 h-2 bg-white/30 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            filter === "nearsighted" 
                              ? (faceDistance > 0.6 ? 'bg-red-400' : faceDistance > 0.3 ? 'bg-yellow-400' : 'bg-green-400')
                              : (faceDistance < 0.4 ? 'bg-red-400' : faceDistance < 0.7 ? 'bg-yellow-400' : 'bg-green-400')
                          }`}
                          style={{ width: `${(1 - faceDistance) * 100}%` }}
                        />
                      </div>
                      <span className="font-medium w-8">
                        {faceDistance < 0.3 ? 'Gần' : faceDistance < 0.7 ? 'TB' : 'Xa'}
                      </span>
                    </div>
                    {/* Blur indicator */}
                    <div className="text-[10px] text-white/70 ml-1">
                      {filter === "nearsighted" 
                        ? `Mờ: ${Math.round(faceDistance * 100)}%`
                        : `Mờ: ${Math.round((1 - faceDistance) * 100)}%`
                      }
                    </div>
                  </div>
                </div>
              )}

              {/* Success Toast */}
              {captureSuccess && (
                <div className="absolute top-12 md:top-14 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded shadow-lg text-xs md:text-sm font-medium">
                  Đã lưu thành công
                </div>
              )}



              {/* Bottom Action Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                <div className="flex items-center justify-center gap-4">
                  {/* Gallery Button */}
                  <button
                    onClick={() => setShowGallery(true)}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
                    title="Bộ sưu tập"
                  >
                    <span className="text-xs font-medium">{gallery.length}</span>
                  </button>
                  
                  {/* Main Capture Button */}
                  <button
                    onClick={capture}
                    disabled={loading}
                    className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50"
                    title="Chụp ảnh"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
                    ) : (
                      <div className="w-10 h-10 bg-white rounded-full border-2 border-gray-200" />
                    )}
                  </button>
                  
                  {/* Toggle Glasses Button */}
                  <button
                    onClick={() => setGlassesEnabled(!glassesEnabled)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      glassesEnabled ? 'bg-white/30 text-white ring-2 ring-white/70' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    title={glassesEnabled ? 'Tắt kính' : 'Bật kính'}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTROL PANEL */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-3 sm:space-y-4">
          
          {/* INTRO CARD - Hidden on mobile to save space */}
          <div className="hidden sm:block bg-sky-500 rounded-xl p-4 text-white">
            <h2 className="text-sm md:text-base font-semibold mb-1">Mô phỏng tật khuyết mắt</h2>
            <p className="text-xs text-sky-100 leading-relaxed">
              Trải nghiệm góc nhìn của người có các vấn đề về thị lực để hiểu hơn về bệnh lý mắt.
            </p>
          </div>

          {/* TAB NAVIGATION */}
          <div className="bg-white rounded-xl shadow border border-sky-200 p-1 flex sticky top-2 z-10">
            {[
              { id: 'effects', label: 'Thị giác', icon: '👁️' },
              { id: 'glasses', label: 'Thử kính', icon: '👓' },
              { id: 'tools', label: 'Công cụ', icon: '🔧' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                  activeTab === tab.id 
                    ? 'bg-sky-500 text-white shadow-sm' 
                    : 'text-sky-600 hover:text-sky-700 hover:bg-sky-50'
                }`}
              >
                <span className="sm:hidden">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* CONTENT PANELS */}
          <div className="space-y-3 sm:space-y-4 touch-scroll">
            
            {/* GLASSES TAB CONTENT */}
            <div className={`${activeTab === 'glasses' ? 'block' : 'hidden'}`}>
              {/* Toggle glasses */}
              <div className="bg-white rounded-xl shadow border border-sky-200 p-3 sm:p-4 mb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-sky-700">Hiển thị mắt kính</h3>
                    <p className="text-xs text-sky-500">Bật để thử kính trên khuôn mặt</p>
                  </div>
                  <button
                    onClick={() => setGlassesEnabled(!glassesEnabled)}
                    className={`w-12 h-6 rounded-full transition-all relative ${
                      glassesEnabled ? 'bg-sky-600' : 'bg-sky-200'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all ${
                      glassesEnabled ? 'right-0.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Glasses Grid */}
              <div className={`bg-white rounded-xl shadow border border-sky-200 p-3 sm:p-4 transition-opacity ${glassesEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-sky-700">Chọn kiểu kính</h3>
                  <button
                    onClick={() => setAutoMode(!autoMode)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                      autoMode ? 'bg-sky-100 text-sky-600' : 'bg-sky-50 text-sky-400'
                    }`}
                  >
                    {autoMode ? 'Tự động' : 'Thủ công'}
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {glassesList.map((g, idx) => (
                    <button
                      key={g.id}
                      onClick={() => { setGlassIndex(idx); setAutoMode(false); }}
                      className={`aspect-square p-1.5 sm:p-2 rounded-lg border-2 transition-all active:scale-95 ${
                        glassIndex === idx 
                          ? 'border-sky-500 bg-sky-50 shadow-sm' 
                          : 'border-sky-100 hover:border-sky-200 bg-white'
                      }`}
                    >
                      <img src={g.url} alt={g.name} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* EFFECTS TAB CONTENT */}
            <div className={`${activeTab === 'effects' ? 'block' : 'hidden'}`}>
              {/* Vision Filters */}
              <div className="bg-white rounded-xl shadow border border-sky-200 p-3 sm:p-4">
                <h3 className="text-sm font-medium text-sky-700 mb-3">Chọn loại tật khuyết</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "none", label: "Bình thường", icon: "✓" },
                    { value: "colorblind", label: "Mù màu", icon: "🎨" },
                    { value: "nearsighted", label: "Cận thị", icon: "👀" },
                    { value: "farsighted", label: "Viễn thị", icon: "🔍" },
                    { value: "cataract", label: "Đục thủy tinh thể", icon: "☁️" },
                    { value: "glaucoma", label: "Glaucoma", icon: "⭕" },
                  ].map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFilter(f.value)}
                      className={`py-2.5 sm:py-3 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all text-left flex items-center gap-2 active:scale-98 ${
                        filter === f.value 
                          ? "bg-sky-500 text-white shadow-sm" 
                          : "bg-sky-50 text-sky-600 hover:bg-sky-100 border border-sky-100"
                      }`}
                    >
                      <span className="text-sm">{f.icon}</span>
                      <span>{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dioptri Sliders */}
              <div className="bg-white rounded-xl shadow border border-sky-200 overflow-hidden mt-3">
                <button
                  onClick={() => setShowVisionPanel(!showVisionPanel)}
                  className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-sky-50 active:bg-sky-100"
                >
                  <span className="text-sm font-medium text-sky-700">Điều chỉnh độ khúc xạ</span>
                  <svg className={`w-4 h-4 text-sky-400 transition-transform ${showVisionPanel ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showVisionPanel && (
                  <div className="px-3 sm:px-4 pb-4 space-y-4 border-t border-sky-100">
                    <div className="pt-3">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-sky-600">Cận thị (Myopia)</span>
                        <span className="font-mono font-medium text-sky-700">{visionSettings.myopia}D</span>
                      </div>
                      <input
                        type="range" min="-10" max="0" step="0.5"
                        value={visionSettings.myopia}
                        onChange={(e) => setVisionSettings(p => ({ ...p, myopia: parseFloat(e.target.value) }))}
                        className="w-full h-2 bg-sky-200 rounded-full appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-sky-600">Viễn thị (Hyperopia)</span>
                        <span className="font-mono font-medium text-sky-700">+{visionSettings.hyperopia}D</span>
                      </div>
                      <input
                        type="range" min="0" max="6" step="0.5"
                        value={visionSettings.hyperopia}
                        onChange={(e) => setVisionSettings(p => ({ ...p, hyperopia: parseFloat(e.target.value) }))}
                        className="w-full h-2 bg-sky-200 rounded-full appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-sky-600">Loạn thị (Astigmatism)</span>
                        <span className="font-mono font-medium text-sky-700">{visionSettings.astigmatism}D</span>
                      </div>
                      <input
                        type="range" min="-6" max="0" step="0.5"
                        value={visionSettings.astigmatism}
                        onChange={(e) => setVisionSettings(p => ({ ...p, astigmatism: parseFloat(e.target.value) }))}
                        className="w-full h-2 bg-sky-200 rounded-full appearance-none cursor-pointer"
                      />
                    </div>
                    <button
                      onClick={() => setVisionSettings({ myopia: 0, hyperopia: 0, astigmatism: 0, axis: 0 })}
                      className="w-full py-2.5 bg-sky-100 hover:bg-sky-200 active:bg-sky-300 rounded-lg text-xs font-medium text-sky-600 transition-all"
                    >
                      Đặt lại mặc định
                    </button>
                  </div>
                )}
              </div>


            </div>

            {/* TOOLS TAB CONTENT */}
            <div className={`${activeTab === 'tools' ? 'block' : 'hidden'}`}>
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow border border-sky-200 p-3 sm:p-4">
                <h3 className="text-sm font-medium text-sky-700 mb-3">Công cụ hỗ trợ</h3>
                <div className="space-y-2">
                  <button
                    onClick={startColorTest}
                    className="w-full bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white py-3 px-4 rounded-lg text-sm font-medium transition-all text-left flex items-center gap-2"
                  >
                    <span>🔴</span>
                    <span>Test mù màu Ishihara</span>
                  </button>
                  <button
                    onClick={() => setShowGallery(true)}
                    className="w-full bg-sky-100 hover:bg-sky-200 active:bg-sky-300 text-sky-600 py-3 px-4 rounded-lg text-sm font-medium transition-all text-left flex items-center gap-2"
                  >
                    <span>📷</span>
                    <span>Bộ sưu tập ảnh ({gallery.length})</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* COLOR BLIND TEST MODAL */}
      {showColorTest && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Test Mù Màu Ishihara
                </h2>
                <p className="text-xs text-gray-500">Chuẩn y khoa quốc tế</p>
              </div>
              <button
                onClick={() => setShowColorTest(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-lg transition-all"
              >
                ✕
              </button>
            </div>

            {!colorTestResult ? (
              <div>
                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Tiến độ</span>
                    <span className="font-medium text-sky-600">
                      {colorTestIndex + 1} / {ishiharaPlates.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-sky-400 to-sky-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${((colorTestIndex + 1) / ishiharaPlates.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* ISHIHARA PLATE - Vẽ bằng Canvas */}
                <div className="relative mb-4">
                  <div className="w-full max-w-[280px] mx-auto aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-gray-100 bg-[#f5f5f0]">
                    <canvas 
                      ref={ishiharaCanvasRef}
                      className="w-full h-full"
                      style={{ borderRadius: '50%' }}
                    />
                  </div>
                  {/* Plate type indicator */}
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                      ishiharaPlates[colorTestIndex].type === 'demonstration' 
                        ? 'bg-blue-100 text-blue-700'
                        : ishiharaPlates[colorTestIndex].type === 'hidden'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {ishiharaPlates[colorTestIndex].type === 'demonstration' 
                        ? 'Demo' 
                        : ishiharaPlates[colorTestIndex].type === 'hidden'
                        ? 'Đặc biệt'
                        : `Plate ${colorTestIndex + 1}`}
                    </span>
                  </div>
                </div>

                <p className="text-center text-gray-700 mb-4 font-medium">
                  Bạn nhìn thấy số nào trong hình?
                </p>

                {/* Answer options */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {colorTestOptions.map((num, idx) => (
                    <button
                      key={idx}
                      onClick={() => submitColorTestAnswer(num)}
                      className={`py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all active:scale-95 ${
                        num === '?' 
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 col-span-3 sm:col-span-4' 
                          : 'bg-sky-50 hover:bg-sky-500 hover:text-white text-sky-700 border border-sky-200'
                      }`}
                    >
                      {num === '?' ? '🚫 Không thấy số nào' : num}
                    </button>
                  ))}
                </div>

                {/* Hướng dẫn */}
                <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-xs text-amber-700">
                    <strong>💡 Hướng dẫn:</strong> Nhìn vào tâm hình trong vòng 3-5 giây, sau đó chọn số bạn nhìn thấy. 
                    Nếu không thấy số nào rõ ràng, chọn "Không thấy số nào".
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                {/* Result icon */}
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-4 ${
                  colorTestResult.severity === 'normal' ? 'bg-green-100' :
                  colorTestResult.severity === 'mild' ? 'bg-yellow-100' :
                  colorTestResult.severity === 'moderate' ? 'bg-orange-100' :
                  'bg-red-100'
                }`}>
                  {colorTestResult.severity === 'normal' ? '✅' :
                   colorTestResult.severity === 'mild' ? '⚠️' :
                   colorTestResult.severity === 'moderate' ? '🔶' : '🔴'}
                </div>

                <h3 className="text-xl font-bold mb-2 text-gray-800">Kết quả kiểm tra</h3>
                
                {/* Score */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-4xl font-bold text-sky-600 mb-1">
                    {colorTestResult.correct} / {colorTestResult.total}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Độ chính xác: <span className="font-semibold">{colorTestResult.percentage.toFixed(0)}%</span>
                  </p>
                </div>

                {/* Details */}
                {colorTestResult.details && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-green-600 mb-1">Plates thường</p>
                      <p className="text-sm text-green-500 mb-1">(Người BT thấy số)</p>
                      <p className="text-lg font-bold text-green-700">
                        {colorTestResult.details.transformation.correct}/{colorTestResult.details.transformation.total}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-xs text-purple-600 mb-1">Plates đặc biệt</p>
                      <p className="text-sm text-purple-500 mb-1">(Người mù màu thấy)</p>
                      <p className="text-lg font-bold text-purple-700">
                        {colorTestResult.details.hidden.correct}/{colorTestResult.details.hidden.total}
                      </p>
                    </div>
                  </div>
                )}

                {/* Diagnosis */}
                <div className={`p-4 rounded-xl mb-4 text-left ${
                  colorTestResult.severity === 'normal' ? 'bg-green-50 border border-green-200' :
                  colorTestResult.severity === 'mild' ? 'bg-yellow-50 border border-yellow-200' :
                  colorTestResult.severity === 'moderate' ? 'bg-orange-50 border border-orange-200' :
                  'bg-red-50 border border-red-200'
                }`}>
                  <p className={`font-medium text-sm ${
                    colorTestResult.severity === 'normal' ? 'text-green-700' :
                    colorTestResult.severity === 'mild' ? 'text-yellow-700' :
                    colorTestResult.severity === 'moderate' ? 'text-orange-700' :
                    'text-red-700'
                  }`}>
                    {colorTestResult.diagnosis}
                  </p>
                </div>

                {/* Disclaimer */}
                <p className="text-[10px] text-gray-400 mb-4">
                  ⚕️ Kết quả này chỉ mang tính tham khảo. Để có chẩn đoán chính xác, vui lòng đến gặp bác sĩ chuyên khoa mắt.
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setColorTestResult(null);
                      setColorTestIndex(0);
                      setColorTestAnswers([]);
                      setColorTestOptions(generateOptions(0));
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium transition-all"
                  >
                    🔄 Làm lại
                  </button>
                  <button
                    onClick={() => {
                      setShowColorTest(false);
                      setColorTestResult(null);
                    }}
                    className="flex-1 bg-sky-500 hover:bg-sky-400 text-white px-4 py-3 rounded-xl font-medium transition-all"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GALLERY MODAL */}
      {showGallery && (
        <div className="fixed inset-0 bg-sky-600/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl">
            <div className="p-5 border-b border-sky-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-sky-700">
                Bộ sưu tập của bạn
              </h2>
              <button
                onClick={() => setShowGallery(false)}
                className="text-sky-400 hover:text-sky-600 text-2xl"
              >
                x
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[70vh]">
              {gallery.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sky-600 mb-2">Chưa có ảnh nào trong bộ sưu tập</p>
                  <p className="text-sm text-sky-400">Chụp ảnh để bắt đầu sưu tập!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {gallery.map((item) => (
                    <div key={item.id} className="group relative rounded-lg overflow-hidden shadow border border-sky-200">
                      <img 
                        src={item.image} 
                        alt={item.glassName}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-sky-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-3">
                        <p className="text-white font-medium text-sm">{item.glassName}</p>
                        <p className="text-white/70 text-xs">{item.timestamp}</p>
                        <div className="flex gap-2 mt-2">
                          <a
                            href={item.image}
                            download={`VistaEye_${item.id}.jpg`}
                            className="bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded text-xs"
                          >
                            Tải xuống
                          </a>
                          <button
                            onClick={() => {
                              if (navigator.share) {
                                navigator.share({
                                  title: 'VISTA EYE',
                                  text: `Thử kính ${item.glassName} tại VISTA EYE!`,
                                  url: item.image,
                                });
                              } else {
                                navigator.clipboard.writeText(item.image);
                                alert('Đã copy link ảnh!');
                              }
                            }}
                            className="bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded text-xs"
                          >
                            Chia sẻ
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {gallery.length > 0 && (
              <div className="p-4 border-t border-sky-200 bg-sky-50 flex justify-between items-center">
                <p className="text-sm text-sky-600">{gallery.length} ảnh trong bộ sưu tập</p>
                <button
                  onClick={() => {
                    if (window.confirm('Bạn có chắc muốn xóa tất cả ảnh?')) {
                      setGallery([]);
                    }
                  }}
                  className="text-rose-500 hover:text-rose-700 text-sm font-medium"
                >
                  Xóa tất cả
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
