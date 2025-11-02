import React, { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";
import { uploadToCloudinary } from "../utils/cloudinary";

const glassesList = [
  {
    id: 1,
    url: "https://res.cloudinary.com/dvucotc8z/image/upload/v1762103856/24834e7b77049d0a209d94660bec6ea9_extiiq.png",
    name: "Classic Black",
    suitableFaceShape: ["oval", "square", "heart"],
    minFaceWidth: 0.15,
    maxFaceWidth: 0.35,
    scaleMultiplier: 1.6,
  },
  {
    id: 2,
    url: "https://res.cloudinary.com/dvucotc8z/image/upload/v1762103781/fddb5610eedc1ef6fc8afe437bf64747_tyrduw.png",
    name: "Modern Round",
    suitableFaceShape: ["oval", "square", "heart"],
    minFaceWidth: 0.15,
    maxFaceWidth: 0.35,
    scaleMultiplier: 1.7,
  },
  {
    id: 3,
    url: "https://res.cloudinary.com/dvucotc8z/image/upload/v1762102471/3e0f4e202ed3796ec83de3150b89db71_k14kgm.png",
    name: "Cat Eye Style",
    suitableFaceShape: ["oval", "round", "square"],
    minFaceWidth: 0.15,
    maxFaceWidth: 0.32,
    scaleMultiplier: 1.5,
  },
  {
    id: 4,
    url: "https://res.cloudinary.com/dvucotc8z/image/upload/v1762102472/d66d48cf51672a8678758178aea52799_jhs2jf.png",
    name: "Aviator Gold",
    suitableFaceShape: ["square", "round", "triangle"],
    minFaceWidth: 0.18,
    maxFaceWidth: 0.40,
    scaleMultiplier: 1.8,
  },
  {
    id: 5,
    url: "https://res.cloudinary.com/dvucotc8z/image/upload/v1762102471/91eb9dc8a4240f9ba9f2ccc2c6550cc3_k80ndg.png",
    name: "Rectangle Frame",
    suitableFaceShape: ["oval", "round", "heart"],
    minFaceWidth: 0.15,
    maxFaceWidth: 0.35,
    scaleMultiplier: 1.7,
  },
  {
    id: 6,
    url: "https://res.cloudinary.com/dvucotc8z/image/upload/v1762102016/52b0cc13216e2e91ee14ab167acda2db_hzcp17.png",
    name: "Retro Classic",
    suitableFaceShape: ["oval", "square", "triangle"],
    minFaceWidth: 0.15,
    maxFaceWidth: 0.38,
    scaleMultiplier: 1.6,
  },
];

export default function CameraView() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const [filter, setFilter] = useState("none");
  const [glassIndex, setGlassIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [autoMode, setAutoMode] = useState(true);
  const [faceAnalysis, setFaceAnalysis] = useState(null);
  const [recommendedGlass, setRecommendedGlass] = useState(null);
  
  // CHẾ ĐỘ NHIỀU NGƯỜI
  const [multiPersonMode, setMultiPersonMode] = useState(false);
  const [personGlasses, setPersonGlasses] = useState({}); // {faceIndex: glassIndex}
  const [detectedFaces, setDetectedFaces] = useState(0);
  const [selectedPerson, setSelectedPerson] = useState(null);

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

    const recommended = suitableGlasses.length > 0 
      ? suitableGlasses[0] 
      : glassesList[0];

    return {
      eyeDistance,
      faceWidth,
      faceHeight,
      faceRatio,
      faceShape,
      recommendedGlass: recommended,
    };
  }, []);

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
      
      if (results.faceLandmarks?.length > 0) {
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
              setRecommendedGlass(analysis.recommendedGlass);
            }
          }
        }

        // VẼ MẮT KÍNH CHO TẤT CẢ KHUÔN MẶT
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
          
          // Lấy mắt kính cho người này
          let currentGlassIndex = glassIndex;
          if (multiPersonMode && personGlasses[faceIndex] !== undefined) {
            currentGlassIndex = personGlasses[faceIndex];
          }
          
          const currentGlass = glassesList[currentGlassIndex];
          const scaleMultiplier = currentGlass.scaleMultiplier || 1.6;
          
          // Tự động điều chỉnh kích thước
          const glassWidth = eyeDistance * scaleMultiplier;
          const glassHeight = glassWidth * 0.35;
          
          // Điều chỉnh vị trí Y
          const offsetY = eyeDistance * 0.03;

          const glassesImg = new Image();
          glassesImg.src = currentGlass.url;
          glassesImg.crossOrigin = "anonymous";
          
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
          
          // VẼ SỐ THỨ TỰ NGƯỜI
          if (multiPersonMode && numFaces > 1) {
            ctx.save();
            ctx.fillStyle = selectedPerson === faceIndex 
              ? "rgba(34, 197, 94, 0.9)" 
              : "rgba(59, 130, 246, 0.9)";
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
            ctx.fillText((faceIndex + 1).toString(), labelX, labelY);
            ctx.restore();
          }
        });
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
          data[i] = 0.625 * r + 0.375 * g;     // Red
          data[i + 1] = 0.7 * r + 0.3 * g;     // Green
          data[i + 2] = 0.3 * g + 0.7 * b;     // Blue
        }
        ctx.putImageData(imageData, 0, 0);
      } else if (filter === "nearsighted") {
        // Cận thị - mờ toàn bộ
        ctx.filter = "blur(8px)";
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = "none";
      } else if (filter === "farsighted") {
        // Viễn thị - mờ ở trung tâm, rõ ở viền
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
        
        // Tạo gradient radial blur
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(canvas, 0, 0);
        
        // Vẽ lớp blur ở giữa
        ctx.filter = "blur(10px)";
        ctx.globalAlpha = 0.8;
        ctx.drawImage(tempCanvas, 0, 0);
        ctx.filter = "none";
        ctx.globalAlpha = 1.0;
        
        // Tạo gradient mask để viền rõ hơn
        const gradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, maxRadius * 0.6
        );
        gradient.addColorStop(0, 'rgba(255,255,255,0)');
        gradient.addColorStop(1, 'rgba(255,255,255,1)');
        
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';
        
        // Vẽ lại phần viền rõ
        ctx.globalAlpha = 0.3;
        ctx.drawImage(tempCanvas, 0, 0);
        ctx.globalAlpha = 1.0;
      } else if (filter === "lightsensitive") {
        // Nhạy sáng - tăng độ sáng và giảm độ tương phản
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "overlay";
        ctx.fillStyle = "rgba(255,255,200,0.2)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "source-over";
      } else if (filter === "cataract") {
        // Đục thủy tinh thể - mờ và vàng
        ctx.fillStyle = "rgba(255,240,200,0.3)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.filter = "blur(5px) contrast(0.8) brightness(1.2)";
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = "none";
      } else if (filter === "glaucoma") {
        // Tăng nhãn áp - mất thị giác ngoại vi (tunnel vision)
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
        
        // Tạo hiệu ứng đen viền (mất thị giác ngoại vi)
        const gradient = ctx.createRadialGradient(
          centerX, centerY, maxRadius * 0.3,
          centerX, centerY, maxRadius * 0.8
        );
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(0.7, 'rgba(0,0,0,0.5)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.9)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (filter === "diabetic") {
        // Bệnh võng mạc tiểu đường - có đốm đen và mờ
        ctx.filter = "blur(2px) contrast(0.9)";
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = "none";
        
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
  }, [faceLandmarker, filter, glassIndex, autoMode, analyzeFaceAndRecommend, multiPersonMode, personGlasses, selectedPerson]);

  const capture = async () => {
    const canvas = canvasRef.current;
    const imageSrc = canvas.toDataURL("image/jpeg");
    setLoading(true);
    let uploadedUrl;
    try {
      if (process.env.REACT_APP_USE_CLOUDINARY === "true") {
        uploadedUrl = await uploadToCloudinary(imageSrc);
      } else {
        uploadedUrl = imageSrc;
      }
      setImageUrl(uploadedUrl);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 py-6">
      {/* Video Container với border đẹp - KHUNG TO HƠN */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-gradient w-full max-w-5xl">
        <Webcam 
          ref={webcamRef} 
          mirrored 
          width={1200} 
          height={900}
          className="rounded-xl w-full"
          videoConstraints={{
            width: 1920,
            height: 1080,
            facingMode: "user",
            aspectRatio: 1.333
          }}
        />
        <canvas ref={canvasRef} className="absolute top-0 left-0 rounded-xl w-full h-full" />
        
        {/* Hiển thị số người phát hiện */}
        {detectedFaces > 0 && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-opacity-90 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full shadow-lg font-bold">
            👥 {detectedFaces} người
          </div>
        )}
        
        {/* Hiển thị thông tin phân tích */}
        {faceAnalysis && !multiPersonMode && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-opacity-90 backdrop-blur-sm text-white text-sm p-3 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-1">
              <span>👤</span>
              <span className="font-semibold">Hình mặt:</span>
              <strong className="text-yellow-300">{faceAnalysis.faceShape}</strong>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span>📏</span>
              <span className="font-semibold">Tỷ lệ:</span>
              <span className="text-yellow-300">{faceAnalysis.faceRatio.toFixed(2)}</span>
            </div>
            {recommendedGlass && (
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/30">
                <span>✨</span>
                <span className="text-green-300 font-bold">{recommendedGlass.name}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Hướng dẫn chế độ nhiều người */}
        {multiPersonMode && detectedFaces > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white text-sm px-4 py-2 rounded-full shadow-lg">
            💡 Click vào số người để chọn mắt kính riêng
          </div>
        )}
      </div>

      {/* Toggle chế độ nhiều người */}
      <div className="flex items-center gap-4 mt-6 bg-white rounded-full px-6 py-3 shadow-lg">
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={multiPersonMode}
              onChange={(e) => {
                setMultiPersonMode(e.target.checked);
                if (!e.target.checked) {
                  setPersonGlasses({});
                  setSelectedPerson(null);
                }
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-red-600"></div>
          </div>
          <span className="text-sm font-semibold text-gray-700">
            👥 Chế độ nhiều người
          </span>
        </label>
        {multiPersonMode && detectedFaces > 1 && (
          <span className="text-xs text-gray-500 italic">
            ({detectedFaces} người phát hiện)
          </span>
        )}
      </div>

      {/* Toggle chế độ tự động với styling đẹp */}
      <div className="flex items-center gap-3 mt-6 bg-white rounded-full px-6 py-3 shadow-lg">
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={autoMode}
              onChange={(e) => setAutoMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-sky-500 peer-checked:to-blue-600"></div>
          </div>
          <span className="text-sm font-semibold text-gray-700">
            🤖 Tự động chọn mắt kính
          </span>
        </label>
      </div>

      {/* Filter buttons với nhiều tùy chọn */}
      <div className="mt-6 bg-white rounded-2xl p-6 shadow-xl max-w-4xl">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
          🔬 Trải nghiệm các tình trạng thị giác
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: "none", label: "Bình thường", icon: "👁️", desc: "Thị giác chuẩn" },
            { value: "colorblind", label: "Mù màu", icon: "🎨", desc: "Deuteranopia" },
            { value: "nearsighted", label: "Cận thị", icon: "🔍", desc: "Nhìn xa mờ" },
            { value: "farsighted", label: "Viễn thị", icon: "�", desc: "Nhìn gần mờ" },
            { value: "lightsensitive", label: "Nhạy sáng", icon: "☀️", desc: "Photophobia" },
            { value: "cataract", label: "Đục thủy tinh", icon: "🌫️", desc: "Cataract" },
            { value: "glaucoma", label: "Tăng nhãn áp", icon: "🔘", desc: "Mất thị giác ngoại vi" },
            { value: "diabetic", label: "Võng mạc ĐTĐ", icon: "🩸", desc: "Retinopathy" }
          ].map((f) => (
            <button
              key={f.value}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 text-left ${
                filter === f.value 
                  ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg scale-105" 
                  : "bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-sky-400 hover:bg-white"
              }`}
              onClick={() => setFilter(f.value)}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{f.icon}</span>
                <span className="font-bold">{f.label}</span>
              </div>
              <div className={`text-xs ${filter === f.value ? 'text-white/80' : 'text-gray-500'}`}>
                {f.desc}
              </div>
            </button>
          ))}
        </div>
        <p className="text-center text-xs text-gray-500 mt-4">
          💡 Chọn filter để trải nghiệm cách những người có vấn đề về thị giác nhìn thế giới
        </p>
      </div>

      {/* Chọn người (chỉ hiện ở chế độ nhiều người) */}
      {multiPersonMode && detectedFaces > 1 && (
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-xl max-w-4xl w-full">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
            👥 Chọn người để thử mắt kính
          </h3>
          <div className="flex gap-3 justify-center flex-wrap">
            {Array.from({ length: detectedFaces }).map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedPerson(index)}
                className={`px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-110 ${
                  selectedPerson === index
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-110"
                    : "bg-gray-100 text-gray-700 border-2 border-gray-300 hover:border-green-400"
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-1">👤</span>
                  <span>Người {index + 1}</span>
                  {personGlasses[index] !== undefined && (
                    <span className="text-xs mt-1 opacity-75">
                      {glassesList[personGlasses[index]].name}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-gray-500 mt-4">
            ⬇️ Sau khi chọn người, hãy chọn mắt kính bên dưới
          </p>
        </div>
      )}

      {/* Glasses selection với grid layout đẹp - 6 MẪU */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-6 max-w-4xl">
        {glassesList.map((g, idx) => {
          const isActive = multiPersonMode && selectedPerson !== null
            ? personGlasses[selectedPerson] === idx
            : glassIndex === idx;
            
          return (
            <button
              key={idx}
              onClick={() => {
                if (multiPersonMode && selectedPerson !== null) {
                  // Gán mắt kính cho người đã chọn
                  setPersonGlasses(prev => ({
                    ...prev,
                    [selectedPerson]: idx
                  }));
                } else {
                  // Mode đơn
                  setGlassIndex(idx);
                  setAutoMode(false);
                }
              }}
              className={`rounded-2xl p-3 border-2 transition-all duration-300 transform hover:scale-110 ${
                isActive
                  ? "border-sky-500 shadow-xl scale-105 bg-gradient-to-br from-sky-50 to-blue-50" 
                  : "border-gray-200 hover:border-sky-300 bg-white hover:shadow-lg"
              }`}
              title={g.name}
            >
              <div className="bg-gray-50 rounded-xl p-2 mb-2">
                <img 
                  src={g.url} 
                  alt={g.name} 
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className={`text-xs font-semibold text-center ${
                isActive ? "text-sky-600" : "text-gray-600"
              }`}>
                {g.name}
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Hint cho chế độ nhiều người */}
      {multiPersonMode && selectedPerson === null && detectedFaces > 1 && (
        <div className="mt-4 text-center text-sm text-orange-600 font-medium">
          ⚠️ Vui lòng chọn người trước khi chọn mắt kính
        </div>
      )}

      {/* Capture button với animation đẹp */}
      <button
        onClick={capture}
        disabled={loading}
        className="mt-8 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang lưu...
          </>
        ) : (
          <>
            <span className="text-2xl">📸</span>
            Chụp & Lưu
          </>
        )}
      </button>

      {/* Result image với styling đẹp */}
      {imageUrl && (
        <div className="mt-8 text-center bg-white rounded-2xl p-6 shadow-2xl max-w-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">✨ Kết quả của bạn</h3>
          <img 
            src={imageUrl} 
            alt="result" 
            className="rounded-xl border-4 border-gray-200 w-full shadow-lg"
          />
          <div className="mt-4 flex items-center justify-center gap-2 text-gray-600">
            <span className="text-2xl">💫</span>
            <p className="text-sm font-medium">
              #SeeBeyond #LightOdyssey
            </p>
          </div>
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = imageUrl;
              link.download = 'seebeyond-photo.jpg';
              link.click();
            }}
            className="mt-4 bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:from-green-600 hover:to-teal-700 transition-all duration-300"
          >
            � Tải xuống
          </button>
        </div>
      )}
    </div>
  );
}
