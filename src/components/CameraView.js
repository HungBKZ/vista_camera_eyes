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



// ISHIHARA COLOR BLIND TEST PLATES
const ishiharaPlates = [
  { id: 1, number: "12", colors: { normal: "12", colorblind: "?" }, bgColor: "#8B9467", dotColor: "#C44536" },
  { id: 2, number: "8", colors: { normal: "8", colorblind: "3" }, bgColor: "#6B8E23", dotColor: "#CD5C5C" },
  { id: 3, number: "6", colors: { normal: "6", colorblind: "?" }, bgColor: "#9ACD32", dotColor: "#DC143C" },
  { id: 4, number: "29", colors: { normal: "29", colorblind: "70" }, bgColor: "#808000", dotColor: "#B22222" },
  { id: 5, number: "57", colors: { normal: "57", colorblind: "35" }, bgColor: "#556B2F", dotColor: "#CD853F" },
  { id: 6, number: "5", colors: { normal: "5", colorblind: "2" }, bgColor: "#6B8E23", dotColor: "#E9967A" },
  { id: 7, number: "3", colors: { normal: "3", colorblind: "5" }, bgColor: "#9ACD32", dotColor: "#F08080" },
  { id: 8, number: "15", colors: { normal: "15", colorblind: "17" }, bgColor: "#808000", dotColor: "#FA8072" },
];

export default function CameraView() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
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

  // TINH NANG MOI: DIEU CHINH DO KHUC XA (Dioptri)
  const [visionSettings, setVisionSettings] = useState({
    myopia: 0,        // Can thi (-0.25 den -10.00)
    hyperopia: 0,     // Vien thi (+0.25 den +6.00) 
    astigmatism: 0,   // Loan thi (0 den -6.00)
    axis: 0,          // Truc loan thi (0-180 do)
  });
  const [showVisionPanel, setShowVisionPanel] = useState(false);

  // TINH NANG MOI: EMPATHY MODE
  const [empathyMode, setEmpathyMode] = useState(false);
  const [empathyTimer, setEmpathyTimer] = useState(0);
  const [empathyCondition, setEmpathyCondition] = useState(null);
  const empathyTimerRef = useRef(null);

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
  const analyzeFaceAndRecommend = useCallback((faceLandmarks) => {
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

  // EMPATHY MODE TIMER
  useEffect(() => {
    if (empathyMode && empathyCondition) {
      empathyTimerRef.current = setInterval(() => {
        setEmpathyTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (empathyTimerRef.current) {
        clearInterval(empathyTimerRef.current);
      }
      setEmpathyTimer(0);
    }
    return () => {
      if (empathyTimerRef.current) {
        clearInterval(empathyTimerRef.current);
      }
    };
  }, [empathyMode, empathyCondition]);

  // START EMPATHY MODE
  const startEmpathyMode = (condition) => {
    setEmpathyMode(true);
    setEmpathyCondition(condition);
    setFilter(condition);
    setEmpathyTimer(0);
  };

  // STOP EMPATHY MODE
  const stopEmpathyMode = () => {
    setEmpathyMode(false);
    setEmpathyCondition(null);
    setFilter("none");
  };

  // FORMAT TIME
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // COLOR BLIND TEST FUNCTIONS
  const generateOptions = (index) => {
    const correctAnswer = ishiharaPlates[index].number;
    const correctNum = parseInt(correctAnswer);
    
    // Tao 5 dap an ngau nhien + 1 dap an dung
    const options = new Set([correctAnswer]);
    while (options.size < 6) {
      // Random so gan voi dap an dung (+-15)
      const variance = Math.floor(Math.random() * 30) - 15;
      const randomNum = Math.max(1, correctNum + variance);
      if (String(randomNum) !== correctAnswer) {
        options.add(String(randomNum));
      }
    }
    
    // Shuffle va them option "Khong thay"
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

  const submitColorTestAnswer = (answer) => {
    const newAnswers = [...colorTestAnswers, answer];
    setColorTestAnswers(newAnswers);
    
    if (colorTestIndex < ishiharaPlates.length - 1) {
      const nextIndex = colorTestIndex + 1;
      setColorTestIndex(nextIndex);
      setColorTestOptions(generateOptions(nextIndex));
    } else {
      // Calculate result
      let correct = 0;
      newAnswers.forEach((ans, idx) => {
        if (ans === ishiharaPlates[idx].number) {
          correct++;
        }
      });
      const percentage = (correct / ishiharaPlates.length) * 100;
      let diagnosis = "Thi luc mau binh thuong";
      if (percentage < 50) {
        diagnosis = "Co the bi mu mau - Nen gap bac si";
      } else if (percentage < 75) {
        diagnosis = "Co dau hieu roi loan nhan mau nhe";
      }
      setColorTestResult({ correct, total: ishiharaPlates.length, percentage, diagnosis });
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
        // Phân tích khuôn mặt đầu tiên
        const analysis = analyzeFaceAndRecommend(results.faceLandmarks);

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
        // Cận thị - mờ toàn bộ (iOS compatible - manual box blur)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const w = canvas.width;
        const h = canvas.height;
        const radius = 8;
        
        // Simple box blur algorithm (iOS compatible)
        const tempData = new Uint8ClampedArray(data);
        for (let y = radius; y < h - radius; y++) {
          for (let x = radius; x < w - radius; x++) {
            let r = 0, g = 0, b = 0, count = 0;
            for (let dy = -radius; dy <= radius; dy += 2) {
              for (let dx = -radius; dx <= radius; dx += 2) {
                const idx = ((y + dy) * w + (x + dx)) * 4;
                r += tempData[idx];
                g += tempData[idx + 1];
                b += tempData[idx + 2];
                count++;
              }
            }
            const idx = (y * w + x) * 4;
            data[idx] = r / count;
            data[idx + 1] = g / count;
            data[idx + 2] = b / count;
          }
        }
        ctx.putImageData(imageData, 0, 0);
      } else if (filter === "farsighted") {
        // Viễn thị - mờ ở trung tâm, rõ ở viền (iOS compatible)
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
        
        // Manual blur for center area
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const w = canvas.width;
        const h = canvas.height;
        const tempData = new Uint8ClampedArray(data);
        const blurRadius = 10;
        
        for (let y = blurRadius; y < h - blurRadius; y += 2) {
          for (let x = blurRadius; x < w - blurRadius; x += 2) {
            // Calculate distance from center
            const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
            const blurStrength = Math.max(0, 1 - (distFromCenter / (maxRadius * 0.6)));
            
            if (blurStrength > 0.2) {
              let r = 0, g = 0, b = 0, count = 0;
              const actualRadius = Math.round(blurRadius * blurStrength);
              for (let dy = -actualRadius; dy <= actualRadius; dy += 3) {
                for (let dx = -actualRadius; dx <= actualRadius; dx += 3) {
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
        }
        ctx.putImageData(imageData, 0, 0);
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
        <div className="fixed inset-0 bg-sky-600/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-sky-700">
                Test Mù Màu Ishihara
              </h2>
              <button
                onClick={() => setShowColorTest(false)}
                className="text-sky-400 hover:text-sky-600 text-2xl"
              >
                x
              </button>
            </div>

            {!colorTestResult ? (
              <div>
                <div className="text-center mb-4">
                  <p className="text-sm text-sky-600 mb-2">
                    Câu hỏi {colorTestIndex + 1} / {ishiharaPlates.length}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${((colorTestIndex + 1) / ishiharaPlates.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* ISHIHARA PLATE SIMULATION */}
                <div 
                  className="w-64 h-64 mx-auto rounded-full flex items-center justify-center relative overflow-hidden mb-6"
                  style={{ 
                    background: `radial-gradient(circle, ${ishiharaPlates[colorTestIndex].bgColor} 0%, ${ishiharaPlates[colorTestIndex].bgColor} 100%)` 
                  }}
                >
                  {/* Generate random dots pattern */}
                  {[...Array(200)].map((_, i) => {
                    const isNumber = Math.random() > 0.6;
                    const size = Math.random() * 12 + 6;
                    const x = Math.random() * 200 + 32;
                    const y = Math.random() * 200 + 32;
                    return (
                      <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                          width: size,
                          height: size,
                          left: x,
                          top: y,
                          backgroundColor: isNumber ? ishiharaPlates[colorTestIndex].dotColor : ishiharaPlates[colorTestIndex].bgColor,
                          opacity: 0.8 + Math.random() * 0.2,
                        }}
                      />
                    );
                  })}
                  <span 
                    className="text-6xl font-bold relative z-10"
                    style={{ color: ishiharaPlates[colorTestIndex].dotColor }}
                  >
                    {ishiharaPlates[colorTestIndex].number}
                  </span>
                </div>

                <p className="text-center text-sky-600 mb-4 font-medium">
                  Bạn nhìn thấy số nào?
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {colorTestOptions.map((num, idx) => (
                    <button
                      key={idx}
                      onClick={() => submitColorTestAnswer(num)}
                      className="py-3 bg-sky-100 hover:bg-sky-600 hover:text-white rounded-lg font-bold text-lg transition-all"
                    >
                      {num === '?' ? 'Không thấy' : num}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className={`text-5xl mb-4 ${colorTestResult.percentage >= 75 ? '' : ''}`}>
                  {colorTestResult.percentage >= 75 ? 'O' : colorTestResult.percentage >= 50 ? '-' : '!'}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-sky-700">Kết quả</h3>
                <p className="text-3xl font-bold text-sky-600 mb-2">
                  {colorTestResult.correct} / {colorTestResult.total}
                </p>
                <p className="text-sky-600 mb-4">{colorTestResult.percentage.toFixed(0)}% chính xác</p>
                <div className={`p-4 rounded-lg mb-4 ${
                  colorTestResult.percentage >= 75 
                    ? 'bg-sky-100 text-sky-700' 
                    : colorTestResult.percentage >= 50 
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-rose-100 text-rose-700'
                }`}>
                  <p className="font-medium">{colorTestResult.diagnosis}</p>
                </div>
                <button
                  onClick={() => {
                    setShowColorTest(false);
                    setColorTestResult(null);
                  }}
                  className="bg-sky-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-sky-400 transition-all"
                >
                  Đóng
                </button>
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
