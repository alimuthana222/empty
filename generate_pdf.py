"""
Generate a PDF from the defense preparation Q&A data in App.jsx.
Usage: python3 generate_pdf.py
Output: defense_prep.pdf
"""

import re
from fpdf import FPDF
import arabic_reshaper
from bidi.algorithm import get_display

FONT_REGULAR  = "/usr/share/fonts/truetype/noto/NotoNaskhArabic-Regular.ttf"
FONT_BOLD     = "/usr/share/fonts/truetype/noto/NotoNaskhArabic-Bold.ttf"
FONT_LATIN    = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_LATIN_B  = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

questions = [
    {
        "category": "أسئلة المقدمة والمشكلة",
        "color": (30, 64, 175),
        "icon": "📌",
        "items": [
            {
                "q": "عرّف مشروعك بجملة واحدة",
                "a": "مشروعنا هو نظام ذكي لتسجيل الحضور باستخدام تقنية التعرف على الوجه بالذكاء الاصطناعي، يعمل بشكل تلقائي وفوري دون الحاجة لحضور يدوي.",
                "tip": "ابدأ بثقة، لا تتردد",
            },
            {
                "q": "ما هي المشكلة التي يحلها مشروعك؟",
                "a": "الطرق التقليدية لتسجيل الحضور تعاني من 4 مشاكل رئيسية:\n\n١. ضياع الوقت: المناداة على الأسماء تأخذ ٥-١٠ دقائق من وقت المحاضرة.\n٢. الأخطاء البشرية: تسجيل خاطئ أو ضياع أوراق.\n٣. الحضور البديل (البروكسي): طالب يوقع عن زميله الغائب.\n٤. صعوبة إدارة السجلات: استخراج تقارير يدوياً يستغرق وقتاً طويلاً.",
                "tip": "اذكر الأرقام: ٥-١٠ دقائق، ٣٠-٥٠ طالب",
            },
            {
                "q": "ما أهداف مشروعك؟",
                "a": "للمشروع ٤ أهداف رئيسية:\n\n١. التشغيل الآلي: تسجيل الحضور تلقائياً دون تدخل يدوي.\n٢. توفير الوقت: تخليص الأستاذ من عبء المناداة.\n٣. الكفاءة والسرعة: التعرف على أكثر من طالب في نفس الوقت.\n٤. التحول الرقمي: الانتقال من الورق إلى قاعدة بيانات آمنة.",
                "tip": "رتّب الأهداف بشكل واضح: ١، ٢، ٣، ٤",
            },
        ],
    },
    {
        "category": "أسئلة الجانب التقني",
        "color": (6, 95, 70),
        "icon": "⚙️",
        "items": [
            {
                "q": "ما هي تقنية التعرف على الوجه التي استخدمتها؟",
                "a": "استخدمنا إطار عمل InsightFace الذي يحتوي على مكونين رئيسيين:\n\n١. RetinaFace: لاكتشاف الوجوه في الإطار بدقة عالية.\n٢. ArcFace: لاستخراج بصمة الوجه كمتجه رياضي بـ ٥١٢ بُعداً.\n\nبعدها نقارن البصمة بقاعدة البيانات باستخدام Cosine Similarity، إذا تجاوزت النسبة ٠.٥ يُعتبر الطالب معرّفاً.",
                "tip": "المصطلحات المهمة: InsightFace, ArcFace, Embedding, Cosine Similarity",
            },
            {
                "q": "ما هي مراحل التعرف على الوجه؟",
                "a": "التعرف على الوجه يمر بـ ٤ مراحل:\n\n١. Face Detection: اكتشاف موقع الوجه في الصورة.\n٢. Face Alignment: تصحيح زاوية الوجه باستخدام نقاط معالم (عيون، أنف، فم).\n٣. Feature Extraction: تحويل الوجه إلى متجه رقمي (embedding) بـ ٥١٢ بُعد.\n٤. Face Matching: مقارنة المتجه مع قاعدة البيانات لتحديد الهوية.",
                "tip": "اذكر الأرقام: ٥١٢ بُعد، عتبة ٠.٥",
            },
            {
                "q": "لماذا اخترتم InsightFace تحديداً؟",
                "a": "اخترنا InsightFace لثلاثة أسباب:\n\n١. يعمل على CPU فقط دون الحاجة لـ GPU، مما يجعله عملياً للكليات التي ليس لديها أجهزة متطورة.\n٢. يوفر دقة عالية مع كفاءة حسابية ممتازة (buffalo_l model).\n٣. مفتوح المصدر ومدعوم بأبحاث حديثة.",
                "tip": "ركز على نقطة CPU - هذا ميزة تنافسية مهمة",
            },
            {
                "q": "ما هو Cosine Similarity وكيف يُستخدم؟",
                "a": "Cosine Similarity هو مقياس رياضي يحسب درجة التشابه بين متجهين.\n\nتتراوح قيمته بين ٠ (لا تشابه) و١ (تطابق كامل).\n\nفي مشروعنا: إذا كانت النسبة > ٠.٥ بين embedding الشخص أمام الكاميرا وembedding الطالب المسجل في قاعدة البيانات، يُعتبر هذا الشخص هو نفس الطالب ويُسجَّل حضوره.",
                "tip": 'مثال بسيط يساعد: "مثل قياس زاوية بين متجهين في الفضاء"',
            },
            {
                "q": "ما البرامج والمكتبات المستخدمة؟",
                "a": "المشروع يستخدم:\n\n• Python: لغة البرمجة الأساسية.\n• OpenCV: للتقاط الفيديو من الكاميرا ومعالجة الصور.\n• PyQt5: لبناء واجهة المستخدم الرسومية (GUI).\n• PostgreSQL: قاعدة البيانات لتخزين بيانات الطلاب والحضور.\n• InsightFace: إطار عمل التعرف على الوجه.",
                "tip": "خمسة مكونات - احفظها كقائمة",
            },
            {
                "q": "كيف يعمل النظام المتعدد الخيوط (Multi-threading)؟",
                "a": "النظام يعمل بـ ٣ خيوط (threads) متزامنة:\n\n١. UI Thread: يدير واجهة المستخدم ويستجيب للأزرار.\n٢. Camera Thread (30 FPS): يلتقط الإطارات من الكاميرا بشكل مستمر.\n٣. Recognition Thread (3-4 Hz): يعالج الإطارات ويقوم بالتعرف على الوجوه.\n\nالتواصل بينها عبر Qt Signal-Slot لضمان الأمان دون الحاجة لـ manual locks.",
                "tip": "وضح أن هذا يمنع تجميد الواجهة أثناء المعالجة",
            },
        ],
    },
    {
        "category": "أسئلة قاعدة البيانات",
        "color": (124, 45, 18),
        "icon": "🗄️",
        "items": [
            {
                "q": "كيف صممتم قاعدة البيانات؟",
                "a": "قاعدة البيانات PostgreSQL تتكون من جداول رئيسية:\n\n• students: بيانات الطالب (ID، اسم، قسم، مرحلة، شعبة).\n• faces: صور الوجه لكل طالب (٥ صور + embedding لكل صورة).\n• attendance: سجلات الحضور (اسم، تاريخ، وقت، حاضر/غائب، الأستاذ، المادة).\n• جداول الإعدادات: الأقسام، المراحل، الشعب، المواد.\n\nمنعنا التكرار بـ Unique Constraint على (الاسم + التاريخ + رقم المحاضرة).",
                "tip": "اذكر الـ BYTEA لتخزين الصور والـ embeddings",
            },
            {
                "q": "لماذا اخترتم PostgreSQL؟",
                "a": "اخترنا PostgreSQL لثلاثة أسباب تقنية:\n\n١. يدعم نوع BYTEA لتخزين البيانات الثنائية (صور الوجه والـ embeddings) مباشرة في قاعدة البيانات.\n٢. يدعم Composite Unique Constraints لمنع تكرار تسجيل الحضور.\n٣. ACID Compliance يضمن سلامة البيانات وعدم فقدانها.",
                "tip": "ACID = Atomicity, Consistency, Isolation, Durability",
            },
        ],
    },
    {
        "category": "أسئلة المقارنة مع المشاريع الأخرى",
        "color": (74, 29, 150),
        "icon": "⚖️",
        "items": [
            {
                "q": "ما الفرق بين مشروعكم والمشاريع السابقة؟",
                "a": "المشاريع السابقة لديها قيود:\n\n• Eigenface (2016): دقة منخفضة مع تغيير الإضاءة.\n• LBPH + Haar (2017): ضعيف مع تغيير زاوية الوجه.\n• dlib + ResNet (2020): أداء ضعيف في البيئات الواقعية.\n• FaceNet (2022): يحتاج GPU وبدون ميزات إدارة.\n\nمشروعنا يتميز بـ:\n>> يعمل على CPU فقط (لا يحتاج GPU).\n>> واجهة ثنائية اللغة (عربي + إنجليزي).\n>> دعم كاميرات متعددة.\n>> وضع حضور يدوي كبديل احتياطي.\n>> تخزين PostgreSQL متكامل.",
                "tip": "هذه نقطة مهمة جداً، احفظ المقارنة جيداً",
            },
        ],
    },
    {
        "category": "أسئلة تصميم الواجهة والعمل",
        "color": (22, 78, 99),
        "icon": "🖥️",
        "items": [
            {
                "q": "اشرح كيف يُسجَّل طالب جديد في النظام؟",
                "a": "عملية تسجيل طالب جديد تمر بـ ٧ خطوات:\n\n١. المسؤول يدخل بيانات الطالب (اسم، ID، قسم، مرحلة، شعبة).\n٢. تُفعَّل الكاميرا وتظهر معاينة مباشرة.\n٣. يُلتقط ٥ صور من زوايا مختلفة قليلاً.\n٤. النظام يتحقق من وجود وجه في كل صورة قبل قبولها.\n٥. يُستخرج face embedding لكل صورة.\n٦. تُحفظ بيانات الطالب + الصور + الـ embeddings في قاعدة البيانات.\n٧. الصورة الأولى تُعيَّن كـ primary encoding.",
                "tip": "اذكر أن ٥ صور = دقة أعلى لأن لدينا زوايا مختلفة",
            },
            {
                "q": "كيف يعمل تسجيل الحضور التلقائي؟",
                "a": "آلية التسجيل التلقائي:\n\n١. الأستاذ يختار معاملات الجلسة (القسم، المرحلة، الشعبة، المادة).\n٢. يبدأ Camera Thread (30 FPS) و Recognition Thread (3-4 Hz).\n٣. تُحمَّل جميع الـ embeddings من قاعدة البيانات إلى الذاكرة.\n٤. لكل إطار: يُكتشف الوجه → يُستخرج embedding → يُقارن مع القاعدة.\n٥. إذا Cosine Similarity > 0.5 → يُسجَّل الطالب \"حاضر\".\n٦. يُضاف الطالب لقائمة تتبع لمنع التكرار.\n٧. عند إيقاف الجلسة: باقي الطلاب يُسجَّلون \"غائب\" تلقائياً.",
                "tip": "الخطوة ٧ مهمة جداً - تسجيل الغائبين تلقائياً",
            },
            {
                "q": "ما هي صفحات التطبيق؟",
                "a": "التطبيق يحتوي على ٧ صفحات:\n\n١. الرئيسية: إحصائيات (عدد الطلاب، الحاضرون اليوم، المواد) تتحدث كل ٥ ثواني.\n٢. صفحة الحضور: واجهة ثلاثية (إعدادات كاميرا | بث مباشر | إعدادات الجلسة).\n٣. تسجيل طالب: نموذج بيانات + معاينة كاميرا + ٥ صور.\n٤. إدارة الطلاب: جدول مع بحث وفلاتر وأزرار تعديل/حذف.\n٥. السجلات: كل سجلات الحضور مع فلتر متعدد المعايير + تصدير CSV.\n٦. الحضور اليدوي: بديل احتياطي عند عدم توفر الكاميرا.\n٧. الإعدادات: إدارة الأقسام، المواد، الكاميرات.",
                "tip": "٧ صفحات - احفظها بالترتيب",
            },
        ],
    },
    {
        "category": "أسئلة نقاط الضعف والمستقبل",
        "color": (113, 63, 18),
        "icon": "🔮",
        "items": [
            {
                "q": "ما محدودية أو عيوب النظام الحالي؟",
                "a": "النظام الحالي لديه محدودية في:\n\n١. لا يكتشف الاحتيال بالصور (Liveness Detection): يمكن خداعه بصورة مطبوعة.\n٢. قاعدة البيانات محلية: لا يدعم إدارة مركزية لأكثر من حرم جامعي.\n٣. لا يوجد تطبيق موبايل للأستاذ.\n٤. لا توجد تحليلات إحصائية متقدمة للغياب.\n٥. الأداء قد يتأثر في القاعات الكبيرة جداً (أكثر من ٥٠ طالب أمام الكاميرا).",
                "tip": "كن صريحاً بالعيوب - هذا يدل على نضج علمي",
            },
            {
                "q": "ما العمل المستقبلي للمشروع؟",
                "a": "خططنا المستقبلية تشمل ٦ تحسينات:\n\n١. Liveness Detection: كشف الاحتيال بالصور أو الشاشات.\n٢. Cloud Architecture: نقل قاعدة البيانات للسحابة لدعم أكثر من حرم.\n٣. تطبيق موبايل: للأستاذ والطالب لمتابعة الحضور.\n٤. تحليلات متقدمة: تنبيهات للغياب المتكرر وتقارير دورية.\n٥. Multi-Face Optimization: تحسين الأداء لقاعات كبيرة.\n٦. تكامل مع LMS: ربط مع Moodle أو Blackboard.",
                "tip": "Liveness Detection هو الأهم - ذكره أولاً",
            },
            {
                "q": "لماذا اخترتم الحضور اليدوي كبديل؟",
                "a": "أضفنا الحضور اليدوي لأسباب عملية:\n\n• عند عطل الكاميرا أو انقطاع الكهرباء.\n• في الحالات الاستثنائية كالامتحانات أو الأنشطة خارج القاعة.\n• يحافظ على استمرارية العمل حتى في أسوأ الظروف.\n\nالنظام الجيد يجب أن يكون لديه Plan B دائماً.",
                "tip": "أظهر أنك فكرت في السيناريوهات الواقعية",
            },
        ],
    },
    {
        "category": "أسئلة متوقعة صعبة",
        "color": (136, 19, 55),
        "icon": "🎯",
        "items": [
            {
                "q": "لماذا العتبة 0.5 في Cosine Similarity؟",
                "a": "عتبة ٠.٥ هي نتيجة موازنة بين نوعين من الأخطاء:\n\n• إذا رفعنا العتبة (مثلاً ٠.٨): سيرفض النظام طلاب حقيقيين → False Negatives.\n• إذا خفضنا العتبة (مثلاً ٠.٢): سيقبل أشخاص غير مسجلين → False Positives.\n\nعتبة ٠.٥ هي القيمة الموصى بها في أبحاث ArcFace وهي توازن جيد بين الدقة والحساسية في بيئات الفصل الدراسي.",
                "tip": "اذكر False Positive و False Negative - يدل على فهم عميق",
            },
            {
                "q": "كيف تمنعون تسجيل الحضور مرتين لنفس الطالب؟",
                "a": "نستخدم مستويين من الحماية:\n\n١. في الذاكرة: نضيف كل طالب تم التعرف عليه إلى Tracking Set، فلو ظهر مرة ثانية يتجاهله النظام.\n\n٢. في قاعدة البيانات: يوجد Unique Constraint على (اسم الطالب + التاريخ + رقم المحاضرة)، فحتى لو حدث خطأ في الكود لا يمكن حفظ سجل مكرر.",
                "tip": "مستويان من الحماية = تصميم قوي ومحكم",
            },
            {
                "q": "كيف تتعاملون مع الإضاءة السيئة أو الوجوه الجانبية؟",
                "a": "نتعامل مع هذه التحديات بعدة طرق:\n\n١. التسجيل بـ ٥ صور: نلتقط صور من زوايا وإضاءات مختلفة عند التسجيل، مما يعطي النظام مرجعاً متنوعاً.\n٢. OpenCV Image Processing: نضبط السطوع والتباين في صفحة الإعدادات.\n٣. RetinaFace قوي بطبيعته: يكتشف الوجوه في زوايا وأحجام مختلفة.\n\nبالطبع الإضاءة الشديدة الجداً قد تؤثر، وهذا مذكور في محدودية النظام.",
                "tip": "كن صادقاً بالقيود لكن أظهر الحلول المتبعة",
            },
            {
                "q": "ما هو ArcFace وكيف يعمل؟",
                "a": "ArcFace هو نموذج تعلم عميق لاستخراج بصمة الوجه.\n\nفكرته الأساسية: يستخدم دالة خسارة تسمى Additive Angular Margin Loss تجبر النموذج على:\n• جعل embeddings لنفس الشخص قريبة جداً من بعض.\n• جعل embeddings لأشخاص مختلفين بعيدة جداً.\n\nالنتيجة: متجه ٥١٢ بُعد يمثل بصمة فريدة لكل وجه، دقيق جداً في التمييز بين الأشخاص.",
                "tip": "نشر في IEEE TPAMI 2022 - يمكن ذكر المرجع",
            },
        ],
    },
]

PAGE_W = 210
PAGE_H = 297
MARGIN = 15
CONTENT_W = PAGE_W - 2 * MARGIN


def ar(text):
    """Reshape and apply bidi algorithm for proper Arabic rendering."""
    reshaped = arabic_reshaper.reshape(text)
    return get_display(reshaped)


def hex_to_rgb(hex_color):
    h = hex_color.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


class PDF(FPDF):
    def __init__(self):
        super().__init__()
        self.add_font("NotoAr", style="", fname=FONT_REGULAR)
        self.add_font("NotoAr", style="B", fname=FONT_BOLD)
        self.add_font("DejaVu", style="", fname=FONT_LATIN)
        self.add_font("DejaVu", style="B", fname=FONT_LATIN_B)
        self.set_fallback_fonts(["DejaVu"])
        self.set_auto_page_break(auto=True, margin=MARGIN)

    def header(self):
        # Dark top bar
        self.set_fill_color(15, 32, 39)
        self.rect(0, 0, PAGE_W, 14, style="F")
        self.set_font("NotoAr", "B", 10)
        self.set_text_color(96, 165, 250)
        self.set_xy(MARGIN, 3)
        self.cell(CONTENT_W, 8, ar("دليل مناقشة التخرج · نظام الحضور الذكي"), align="C")
        self.set_text_color(30, 30, 30)
        self.ln(8)

    def footer(self):
        self.set_y(-12)
        self.set_font("NotoAr", "", 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 8, f"{self.page_no()}", align="C")

    def cover_page(self):
        self.add_page()
        # Background
        self.set_fill_color(15, 20, 40)
        self.rect(0, 0, PAGE_W, PAGE_H, style="F")

        # Center box
        self.set_fill_color(30, 58, 95)
        self.rect(20, 60, PAGE_W - 40, 130, style="F")

        total_q = sum(len(cat["items"]) for cat in questions)

        self.set_font("NotoAr", "B", 22)
        self.set_text_color(96, 165, 250)
        self.set_xy(20, 80)
        self.cell(PAGE_W - 40, 14, ar("دليل مناقشة التخرج"), align="C")

        self.set_font("NotoAr", "", 14)
        self.set_text_color(226, 232, 240)
        self.set_xy(20, 100)
        self.cell(PAGE_W - 40, 10, ar("نظام الحضور الذكي بالتعرف على الوجه"), align="C")

        self.set_font("NotoAr", "", 11)
        self.set_text_color(148, 163, 184)
        self.set_xy(20, 116)
        self.cell(PAGE_W - 40, 8, ar(f"{total_q} سؤال وجواب متوقع"), align="C")

        self.set_xy(20, 130)
        self.set_font("NotoAr", "", 10)
        self.set_text_color(96, 165, 250)
        self.cell(PAGE_W - 40, 8, ar(f"{len(questions)} محاور رئيسية"), align="C")

        # Category list preview
        self.set_xy(30, 148)
        self.set_font("NotoAr", "", 9)
        self.set_text_color(203, 213, 225)
        for i, cat in enumerate(questions, 1):
            line = ar(f"{i}. {cat['category']} ({len(cat['items'])} أسئلة)")
            self.set_x(30)
            self.cell(PAGE_W - 60, 7, line, align="C")
            self.ln(7)

    def category_header(self, cat):
        r, g, b = cat["color"]
        # Colored bar
        self.set_fill_color(r, g, b)
        self.rect(MARGIN, self.get_y(), CONTENT_W, 12, style="F")
        self.set_font("NotoAr", "B", 13)
        self.set_text_color(255, 255, 255)
        self.set_xy(MARGIN, self.get_y())
        self.cell(CONTENT_W, 12, ar(cat["category"]), align="C")
        self.ln(14)

    def write_arabic(self, text, font_size=10, bold=False, color=(30, 30, 30), indent=0):
        """Write a block of Arabic text, handling newlines."""
        style = "B" if bold else ""
        self.set_font("NotoAr", style, font_size)
        self.set_text_color(*color)
        lines = text.split("\n")
        for line in lines:
            if line.strip():
                self.set_x(MARGIN + indent)
                self.multi_cell(CONTENT_W - indent, 6, ar(line), align="R")
            else:
                self.ln(3)

    def question_block(self, q_num, item, cat_color):
        r, g, b = cat_color

        # Check space
        if self.get_y() > PAGE_H - 60:
            self.add_page()

        y_start = self.get_y()

        # Question number badge
        self.set_fill_color(r, g, b)
        self.set_draw_color(r, g, b)
        self.rect(MARGIN, y_start, CONTENT_W, 9, style="F")
        self.set_font("NotoAr", "B", 10)
        self.set_text_color(255, 255, 255)
        self.set_xy(MARGIN, y_start)
        label = ar(f"س{q_num}: {item['q']}")
        self.cell(CONTENT_W, 9, label, align="R")
        self.ln(10)

        # Answer box
        self.set_fill_color(245, 247, 250)
        ans_y = self.get_y()
        self.set_x(MARGIN)

        self.set_font("NotoAr", "", 10)
        self.set_text_color(30, 30, 30)
        ans_lines = item["a"].split("\n")
        for line in ans_lines:
            if line.strip():
                self.set_x(MARGIN + 2)
                self.multi_cell(CONTENT_W - 4, 6, ar(line), align="R")
            else:
                self.ln(2)

        # Tip box
        self.ln(2)
        tip_y = self.get_y()
        self.set_fill_color(254, 249, 195)
        self.rect(MARGIN, tip_y, CONTENT_W, 8, style="F")
        self.set_font("NotoAr", "B", 9)
        self.set_text_color(146, 64, 14)
        self.set_xy(MARGIN, tip_y)
        tip_text = ar(f">> {item['tip']}")
        self.cell(CONTENT_W, 8, tip_text, align="R")
        self.ln(12)


def main():
    pdf = PDF()
    pdf.cover_page()

    for cat in questions:
        pdf.add_page()
        pdf.category_header(cat)
        for i, item in enumerate(cat["items"], 1):
            pdf.question_block(i, item, cat["color"])

    out_path = "/home/runner/work/empty/empty/defense_prep.pdf"
    pdf.output(out_path)
    print(f"PDF saved to: {out_path}")


if __name__ == "__main__":
    main()
