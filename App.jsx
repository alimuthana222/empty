import React from 'react';
import { useState } from 'react'

const questions = [
  {
    category: "أسئلة المقدمة والمشكلة",
    color: "#1e40af",
    icon: "📌",
    items: [
      {
        q: "عرّف مشروعك بجملة واحدة",
        a: "مشروعنا هو نظام ذكي لتسجيل الحضور باستخدام تقنية التعرف على الوجه بالذكاء الاصطناعي، يعمل بشكل تلقائي وفوري دون الحاجة لحضور يدوي.",
        tip: "ابدأ بثقة، لا تتردد"
      },
      {
        q: "ما هي المشكلة التي يحلها مشروعك؟",
        a: "الطرق التقليدية لتسجيل الحضور تعاني من 4 مشاكل رئيسية:\n\n١. ضياع الوقت: المناداة على الأسماء تأخذ ٥-١٠ دقائق من وقت المحاضرة.\n٢. الأخطاء البشرية: تسجيل خاطئ أو ضياع أوراق.\n٣. الحضور البديل (البروكسي): طالب يوقع عن زميله الغائب.\n٤. صعوبة إدارة السجلات: استخراج تقارير يدوياً يستغرق وقتاً طويلاً.",
        tip: "اذكر الأرقام: ٥-١٠ دقائق، ٣٠-٥٠ طالب"
      },
      {
        q: "ما أهداف مشروعك؟",
        a: "للمشروع ٤ أهداف رئيسية:\n\n١. التشغيل الآلي: تسجيل الحضور تلقائياً دون تدخل يدوي.\n٢. توفير الوقت: تخليص الأستاذ من عبء المناداة.\n٣. الكفاءة والسرعة: التعرف على أكثر من طالب في نفس الوقت.\n٤. التحول الرقمي: الانتقال من الورق إلى قاعدة بيانات آمنة.",
        tip: "رتّب الأهداف بشكل واضح: ١، ٢، ٣، ٤"
      }
    ]
  },
  {
    category: "أسئلة الجانب التقني",
    color: "#065f46",
    icon: "⚙️",
    items: [
      {
        q: "ما هي تقنية التعرف على الوجه التي استخدمتها؟",
        a: "استخدمنا إطار عمل InsightFace الذي يحتوي على مكونين رئيسيين:\n\n١. RetinaFace: لاكتشاف الوجوه في الإطار بدقة عالية.\n٢. ArcFace: لاستخراج بصمة الوجه كمتجه رياضي بـ ٥١٢ بُعداً.\n\nبعدها نقارن البصمة بقاعدة البيانات باستخدام Cosine Similarity، إذا تجاوزت النسبة ٠.٥ يُعتبر الطالب معرّفاً.",
        tip: "المصطلحات المهمة: InsightFace, ArcFace, Embedding, Cosine Similarity"
      },
      {
        q: "ما هي مراحل التعرف على الوجه؟",
        a: "التعرف على الوجه يمر بـ ٤ مراحل:\n\n١. Face Detection: اكتشاف موقع الوجه في الصورة.\n٢. Face Alignment: تصحيح زاوية الوجه باستخدام نقاط معالم (عيون، أنف، فم).\n٣. Feature Extraction: تحويل الوجه إلى متجه رقمي (embedding) بـ ٥١٢ بُعد.\n٤. Face Matching: مقارنة المتجه مع قاعدة البيانات لتحديد الهوية.",
        tip: "اذكر الأرقام: ٥١٢ بُعد، عتبة ٠.٥"
      },
      {
        q: "لماذا اخترتم InsightFace تحديداً؟",
        a: "اخترنا InsightFace لثلاثة أسباب:\n\n١. يعمل على CPU فقط دون الحاجة لـ GPU، مما يجعله عملياً للكليات التي ليس لديها أجهزة متطورة.\n٢. يوفر دقة عالية مع كفاءة حسابية ممتازة (buffalo_l model).\n٣. مفتوح المصدر ومدعوم بأبحاث حديثة.",
        tip: "ركز على نقطة CPU - هذا ميزة تنافسية مهمة"
      },
      {
        q: "ما هو Cosine Similarity وكيف يُستخدم؟",
        a: "Cosine Similarity هو مقياس رياضي يحسب درجة التشابه بين متجهين.\n\nتتراوح قيمته بين ٠ (لا تشابه) و١ (تطابق كامل).\n\nفي مشروعنا: إذا كانت النسبة > ٠.٥ بين embedding الشخص أمام الكاميرا وembedding الطالب المسجل في قاعدة البيانات، يُعتبر هذا الشخص هو نفس الطالب ويُسجَّل حضوره.",
        tip: "مثال بسيط يساعد: \"مثل قياس زاوية بين متجهين في الفضاء\""
      },
      {
        q: "ما البرامج والمكتبات المستخدمة؟",
        a: "المشروع يستخدم:\n\n• Python: لغة البرمجة الأساسية.\n• OpenCV: للتقاط الفيديو من الكاميرا ومعالجة الصور.\n• PyQt5: لبناء واجهة المستخدم الرسومية (GUI).\n• PostgreSQL: قاعدة البيانات لتخزين بيانات الطلاب والحضور.\n• InsightFace: إطار عمل التعرف على الوجه.",
        tip: "خمسة مكونات - احفظها كقائمة"
      },
      {
        q: "كيف يعمل النظام المتعدد الخيوط (Multi-threading)؟",
        a: "النظام يعمل بـ ٣ خيوط (threads) متزامنة:\n\n١. UI Thread: يدير واجهة المستخدم ويستجيب للأزرار.\n٢. Camera Thread (30 FPS): يلتقط الإطارات من الكاميرا بشكل مستمر.\n٣. Recognition Thread (3-4 Hz): يعالج الإطارات ويقوم بالتعرف على الوجوه.\n\nالتواصل بينها عبر Qt Signal-Slot لضمان الأمان دون الحاجة لـ manual locks.",
        tip: "وضح أن هذا يمنع تجميد الواجهة أثناء المعالجة"
      }
    ]
  },
  {
    category: "أسئلة قاعدة البيانات",
    color: "#7c2d12",
    icon: "🗄️",
    items: [
      {
        q: "كيف صممتم قاعدة البيانات؟",
        a: "قاعدة البيانات PostgreSQL تتكون من جداول رئيسية:\n\n• students: بيانات الطالب (ID، اسم، قسم، مرحلة، شعبة).\n• faces: صور الوجه لكل طالب (٥ صور + embedding لكل صورة).\n• attendance: سجلات الحضور (اسم، تاريخ، وقت، حاضر/غائب، الأستاذ، المادة).\n• جداول الإعدادات: الأقسام، المراحل، الشعب، المواد.\n\nمنعنا التكرار بـ Unique Constraint على (الاسم + التاريخ + رقم المحاضرة).",
        tip: "اذكر الـ BYTEA لتخزين الصور والـ embeddings"
      },
      {
        q: "لماذا اخترتم PostgreSQL؟",
        a: "اخترنا PostgreSQL لثلاثة أسباب تقنية:\n\n١. يدعم نوع BYTEA لتخزين البيانات الثنائية (صور الوجه والـ embeddings) مباشرة في قاعدة البيانات.\n٢. يدعم Composite Unique Constraints لمنع تكرار تسجيل الحضور.\n٣. ACID Compliance يضمن سلامة البيانات وعدم فقدانها.",
        tip: "ACID = Atomicity, Consistency, Isolation, Durability"
      }
    ]
  },
  {
    category: "أسئلة المقارنة مع المشاريع الأخرى",
    color: "#4a1d96",
    icon: "⚖️",
    items: [
      {
        q: "ما الفرق بين مشروعكم والمشاريع السابقة؟",
        a: "المشاريع السابقة لديها قيود:\n\n• Eigenface (2016): دقة منخفضة مع تغيير الإضاءة.\n• LBPH + Haar (2017): ضعيف مع تغيير زاوية الوجه.\n• dlib + ResNet (2020): أداء ضعيف في البيئات الواقعية.\n• FaceNet (2022): يحتاج GPU وبدون ميزات إدارة.\n\nمشروعنا يتميز بـ:\n✅ يعمل على CPU فقط (لا يحتاج GPU).\n✅ واجهة ثنائية اللغة (عربي + إنجليزي).\n✅ دعم كاميرات متعددة.\n✅ وضع حضور يدوي كبديل احتياطي.\n✅ تخزين PostgreSQL متكامل.",
        tip: "هذه نقطة مهمة جداً، احفظ المقارنة جيداً"
      }
    ]
  },
  {
    category: "أسئلة تصميم الواجهة والعمل",
    color: "#164e63",
    icon: "🖥️",
    items: [
      {
        q: "اشرح كيف يُسجَّل طالب جديد في النظام؟",
        a: "عملية تسجيل طالب جديد تمر بـ ٧ خطوات:\n\n١. المسؤول يدخل بيانات الطالب (اسم، ID، قسم، مرحلة، شعبة).\n٢. تُفعَّل الكاميرا وتظهر معاينة مباشرة.\n٣. يُلتقط ٥ صور من زوايا مختلفة قليلاً.\n٤. النظام يتحقق من وجود وجه في كل صورة قبل قبولها.\n٥. يُستخرج face embedding لكل صورة.\n٦. تُحفظ بيانات الطالب + الصور + الـ embeddings في قاعدة البيانات.\n٧. الصورة الأولى تُعيَّن كـ primary encoding.",
        tip: "اذكر أن ٥ صور = دقة أعلى لأن لدينا زوايا مختلفة"
      },
      {
        q: "كيف يعمل تسجيل الحضور التلقائي؟",
        a: "آلية التسجيل التلقائي:\n\n١. الأستاذ يختار معاملات الجلسة (القسم، المرحلة، الشعبة، المادة).\n٢. يبدأ Camera Thread (30 FPS) و Recognition Thread (3-4 Hz).\n٣. تُحمَّل جميع الـ embeddings من قاعدة البيانات إلى الذاكرة.\n٤. لكل إطار: يُكتشف الوجه → يُستخرج embedding → يُقارن مع القاعدة.\n٥. إذا Cosine Similarity > 0.5 → يُسجَّل الطالب \"حاضر\".\n٦. يُضاف الطالب لقائمة تتبع لمنع التكرار.\n٧. عند إيقاف الجلسة: باقي الطلاب يُسجَّلون \"غائب\" تلقائياً.",
        tip: "الخطوة ٧ مهمة جداً - تسجيل الغائبين تلقائياً"
      },
      {
        q: "ما هي صفحات التطبيق؟",
        a: "التطبيق يحتوي على ٧ صفحات:\n\n١. الرئيسية: إحصائيات (عدد الطلاب، الحاضرون اليوم، المواد) تتحدث كل ٥ ثواني.\n٢. صفحة الحضور: واجهة ثلاثية (إعدادات كاميرا | بث مباشر | إعدادات الجلسة).\n٣. تسجيل طالب: نموذج بيانات + معاينة كاميرا + ٥ صور.\n٤. إدارة الطلاب: جدول مع بحث وفلاتر وأزرار تعديل/حذف.\n٥. السجلات: كل سجلات الحضور مع فلتر متعدد المعايير + تصدير CSV.\n٦. الحضور اليدوي: بديل احتياطي عند عدم توفر الكاميرا.\n٧. الإعدادات: إدارة الأقسام، المواد، الكاميرات.",
        tip: "٧ صفحات - احفظها بالترتيب"
      }
    ]
  },
  {
    category: "أسئلة نقاط الضعف والمستقبل",
    color: "#713f12",
    icon: "🔮",
    items: [
      {
        q: "ما محدودية أو عيوب النظام الحالي؟",
        a: "النظام الحالي لديه محدودية في:\n\n١. لا يكتشف الاحتيال بالصور (Liveness Detection): يمكن خداعه بصورة مطبوعة.\n٢. قاعدة البيانات محلية: لا يدعم إدارة مركزية لأكثر من حرم جامعي.\n٣. لا يوجد تطبيق موبايل للأستاذ.\n٤. لا توجد تحليلات إحصائية متقدمة للغياب.\n٥. الأداء قد يتأثر في القاعات الكبيرة جداً (أكثر من ٥٠ طالب أمام الكاميرا).",
        tip: "كن صريحاً بالعيوب - هذا يدل على نضج علمي"
      },
      {
        q: "ما العمل المستقبلي للمشروع؟",
        a: "خططنا المستقبلية تشمل ٦ تحسينات:\n\n١. Liveness Detection: كشف الاحتيال بالصور أو الشاشات.\n٢. Cloud Architecture: نقل قاعدة البيانات للسحابة لدعم أكثر من حرم.\n٣. تطبيق موبايل: للأستاذ والطالب لمتابعة الحضور.\n٤. تحليلات متقدمة: تنبيهات للغياب المتكرر وتقارير دورية.\n٥. Multi-Face Optimization: تحسين الأداء لقاعات كبيرة.\n٦. تكامل مع LMS: ربط مع Moodle أو Blackboard.",
        tip: "Liveness Detection هو الأهم - ذكره أولاً"
      },
      {
        q: "لماذا اخترتم الحضور اليدوي كبديل؟",
        a: "أضفنا الحضور اليدوي لأسباب عملية:\n\n• عند عطل الكاميرا أو انقطاع الكهرباء.\n• في الحالات الاستثنائية كالامتحانات أو الأنشطة خارج القاعة.\n• يحافظ على استمرارية العمل حتى في أسوأ الظروف.\n\nالنظام الجيد يجب أن يكون لديه Plan B دائماً.",
        tip: "أظهر أنك فكرت في السيناريوهات الواقعية"
      }
    ]
  },
  {
    category: "أسئلة متوقعة صعبة",
    color: "#881337",
    icon: "🎯",
    items: [
      {
        q: "لماذا العتبة 0.5 في Cosine Similarity؟",
        a: "عتبة ٠.٥ هي نتيجة موازنة بين نوعين من الأخطاء:\n\n• إذا رفعنا العتبة (مثلاً ٠.٨): سيرفض النظام طلاب حقيقيين → False Negatives.\n• إذا خفضنا العتبة (مثلاً ٠.٢): سيقبل أشخاص غير مسجلين → False Positives.\n\nعتبة ٠.٥ هي القيمة الموصى بها في أبحاث ArcFace وهي توازن جيد بين الدقة والحساسية في بيئات الفصل الدراسي.",
        tip: "اذكر False Positive و False Negative - يدل على فهم عميق"
      },
      {
        q: "كيف تمنعون تسجيل الحضور مرتين لنفس الطالب؟",
        a: "نستخدم مستويين من الحماية:\n\n١. في الذاكرة: نضيف كل طالب تم التعرف عليه إلى Tracking Set، فلو ظهر مرة ثانية يتجاهله النظام.\n\n٢. في قاعدة البيانات: يوجد Unique Constraint على (اسم الطالب + التاريخ + رقم المحاضرة)، فحتى لو حدث خطأ في الكود لا يمكن حفظ سجل مكرر.",
        tip: "مستويان من الحماية = تصميم قوي ومحكم"
      },
      {
        q: "كيف تتعاملون مع الإضاءة السيئة أو الوجوه الجانبية؟",
        a: "نتعامل مع هذه التحديات بعدة طرق:\n\n١. التسجيل بـ ٥ صور: نلتقط صور من زوايا وإضاءات مختلفة عند التسجيل، مما يعطي النظام مرجعاً متنوعاً.\n٢. OpenCV Image Processing: نضبط السطوع والتباين في صفحة الإعدادات.\n٣. RetinaFace قوي بطبيعته: يكتشف الوجوه في زوايا وأحجام مختلفة.\n\nبالطبع الإضاءة الشديدة الجداً قد تؤثر، وهذا مذكور في محدودية النظام.",
        tip: "كن صادقاً بالقيود لكن أظهر الحلول المتبعة"
      },
      {
        q: "ما هو ArcFace وكيف يعمل؟",
        a: "ArcFace هو نموذج تعلم عميق لاستخراج بصمة الوجه.\n\nفكرته الأساسية: يستخدم دالة خسارة تسمى Additive Angular Margin Loss تجبر النموذج على:\n• جعل embeddings لنفس الشخص قريبة جداً من بعض.\n• جعل embeddings لأشخاص مختلفين بعيدة جداً.\n\nالنتيجة: متجه ٥١٢ بُعد يمثل بصمة فريدة لكل وجه، دقيق جداً في التمييز بين الأشخاص.",
        tip: "نشر في IEEE TPAMI 2022 - يمكن ذكر المرجع"
      }
    ]
  }
];

export default function DefensePrep() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [expandedQ, setExpandedQ] = useState(null);
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [mode, setMode] = useState("study"); // study | quiz

  const toggleAnswer = (key) => {
    setRevealedAnswers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const cat = questions[activeCategory];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
      fontFamily: "'Cairo', 'Segoe UI', sans-serif",
      direction: "rtl",
      color: "#e2e8f0",
      padding: "0"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1a1a2e; }
        ::-webkit-scrollbar-thumb { background: #4a5568; border-radius: 3px; }
        .cat-btn { transition: all 0.25s ease; cursor: pointer; }
        .cat-btn:hover { transform: translateX(-4px); }
        .q-card { transition: all 0.2s ease; cursor: pointer; }
        .q-card:hover { transform: translateY(-2px); }
        .reveal-btn { transition: all 0.2s ease; }
        .reveal-btn:hover { opacity: 0.85; transform: scale(0.98); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .answer-box { animation: fadeIn 0.3s ease; }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.6 } }
        .badge { animation: pulse 2s infinite; }
      `}</style>

      {/* Header */}
      <div style={{
        background: "linear-gradient(90deg, #1e3a5f, #0f2027)",
        borderBottom: "2px solid #2d5a8e",
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px"
      }}>
        <div>
          <div style={{ fontSize: "22px", fontWeight: 900, color: "#60a5fa" }}>
            🎓 دليل مناقشة التخرج
          </div>
          <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
            نظام الحضور الذكي بالتعرف على الوجه · {questions.reduce((a, c) => a + c.items.length, 0)} سؤال متوقع
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {["study", "quiz"].map(m => (
            <button key={m} onClick={() => { setMode(m); setRevealedAnswers({}); }} style={{
              padding: "8px 18px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontFamily: "Cairo, sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              background: mode === m ? "#3b82f6" : "#1e3a5f",
              color: mode === m ? "#fff" : "#94a3b8",
              transition: "all 0.2s"
            }}>
              {m === "study" ? "📖 وضع الدراسة" : "🧠 وضع الاختبار"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 80px)" }}>

        {/* Sidebar */}
        <div style={{
          width: "260px",
          minWidth: "260px",
          background: "rgba(15,20,40,0.8)",
          borderLeft: "1px solid #1e3a5f",
          padding: "16px 12px",
          overflowY: "auto"
        }}>
          <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "12px", paddingRight: "8px", letterSpacing: "1px" }}>
            المحاور
          </div>
          {questions.map((cat, i) => (
            <button key={i} className="cat-btn" onClick={() => { setActiveCategory(i); setExpandedQ(null); }}
              style={{
                width: "100%",
                textAlign: "right",
                padding: "12px 14px",
                marginBottom: "6px",
                borderRadius: "10px",
                border: `1px solid ${activeCategory === i ? cat.color : "transparent"}`,
                background: activeCategory === i
                  ? `${cat.color}22`
                  : "rgba(255,255,255,0.03)",
                color: activeCategory === i ? "#e2e8f0" : "#94a3b8",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontFamily: "Cairo, sans-serif",
                fontSize: "13px",
                fontWeight: activeCategory === i ? 700 : 400
              }}>
              <span style={{ fontSize: "18px" }}>{cat.icon}</span>
              <span style={{ flex: 1, textAlign: "right" }}>{cat.category}</span>
              <span style={{
                background: activeCategory === i ? cat.color : "#374151",
                color: "#fff",
                borderRadius: "20px",
                padding: "1px 8px",
                fontSize: "11px",
                fontWeight: 700
              }}>
                {cat.items.length}
              </span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
          {/* Category Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
            padding: "16px 20px",
            borderRadius: "12px",
            background: `linear-gradient(135deg, ${cat.color}33, ${cat.color}11)`,
            border: `1px solid ${cat.color}55`
          }}>
            <span style={{ fontSize: "32px" }}>{cat.icon}</span>
            <div>
              <div style={{ fontSize: "20px", fontWeight: 900, color: "#f1f5f9" }}>{cat.category}</div>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "3px" }}>
                {cat.items.length} سؤال · {mode === "quiz" ? "انقر لإظهار الإجابة" : "جميع الإجابات مرئية"}
              </div>
            </div>
            {mode === "quiz" && (
              <div style={{ marginRight: "auto" }}>
                <span className="badge" style={{
                  background: "#f59e0b22",
                  border: "1px solid #f59e0b",
                  color: "#fbbf24",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 700
                }}>
                  🧠 اختبر نفسك
                </span>
              </div>
            )}
          </div>

          {/* Questions */}
          {cat.items.map((item, qi) => {
            const key = `${activeCategory}-${qi}`;
            const isExpanded = expandedQ === key;
            const isRevealed = mode === "study" || revealedAnswers[key];

            return (
              <div key={qi} className="q-card" style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${isExpanded ? cat.color + "88" : "#1e3a5f"}`,
                borderRadius: "12px",
                marginBottom: "14px",
                overflow: "hidden",
                transition: "all 0.2s"
              }}>
                {/* Question Header */}
                <div
                  onClick={() => setExpandedQ(isExpanded ? null : key)}
                  style={{
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    cursor: "pointer"
                  }}>
                  <div style={{
                    minWidth: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: cat.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: 900,
                    color: "#fff",
                    marginTop: "2px"
                  }}>
                    {qi + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#f1f5f9",
                      lineHeight: "1.6"
                    }}>
                      {item.q}
                    </div>
                  </div>
                  <div style={{
                    fontSize: "20px",
                    transition: "transform 0.2s",
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    color: "#64748b"
                  }}>
                    ▾
                  </div>
                </div>

                {/* Answer Area */}
                {isExpanded && (
                  <div style={{ borderTop: `1px solid ${cat.color}33`, padding: "16px 20px 20px" }}>
                    {mode === "quiz" && !revealedAnswers[key] ? (
                      <button className="reveal-btn" onClick={() => toggleAnswer(key)} style={{
                        background: `linear-gradient(135deg, ${cat.color}, ${cat.color}cc)`,
                        color: "#fff",
                        border: "none",
                        padding: "12px 28px",
                        borderRadius: "10px",
                        fontSize: "14px",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "Cairo, sans-serif",
                        width: "100%"
                      }}>
                        👁️ اظهر الإجابة
                      </button>
                    ) : (
                      <div className="answer-box">
                        <div style={{
                          background: "rgba(255,255,255,0.04)",
                          borderRadius: "10px",
                          padding: "16px",
                          marginBottom: "12px",
                          borderRight: `3px solid ${cat.color}`,
                          whiteSpace: "pre-line",
                          fontSize: "14px",
                          lineHeight: "1.9",
                          color: "#cbd5e1"
                        }}>
                          {item.a}
                        </div>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "10px 14px",
                          background: "#f59e0b15",
                          borderRadius: "8px",
                          border: "1px solid #f59e0b33"
                        }}>
                          <span style={{ fontSize: "16px" }}>💡</span>
                          <span style={{ fontSize: "13px", color: "#fbbf24", fontWeight: 600 }}>
                            نصيحة: {item.tip}
                          </span>
                        </div>
                        {mode === "quiz" && (
                          <button className="reveal-btn" onClick={() => toggleAnswer(key)} style={{
                            marginTop: "10px",
                            background: "transparent",
                            color: "#64748b",
                            border: "1px solid #374151",
                            padding: "8px 20px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            cursor: "pointer",
                            fontFamily: "Cairo, sans-serif"
                          }}>
                            إخفاء الإجابة
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

