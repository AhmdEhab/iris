# IRIS — Team & Achievements

صفحة الفريق والإنجازات لمشروع **IRIS**: منصة تعلّم متكيّفة للأطفال — فريق من طلاب **كلية الحاسبات والمعلومات**.
التصميم مبني على نفس هوية الموقع الرئيسي [iris-kohl-seven.vercel.app](https://iris-kohl-seven.vercel.app/).

A static, bilingual (AR / EN) page for the IRIS team — built with plain HTML, CSS and JavaScript.

---

## الصفحات والأقسام

| القسم | الوصف |
| --- | --- |
| Hero | عنوان كبير + لوجو IRIS في كارت + ستيكرز متحركة (Parallax) |
| Marquee | شريط متحرك بشعارات المشروع |
| Stats | أرقام سريعة بعدّاد متحرك (أعضاء / جوائز / مجالات / لغات) |
| Team | كروت الأعضاء مع الإيميل والتليفون وLinkedIn |
| Achievements | الإنجاز الأحدث (هاكاثون GDG) + باقي الجوائز |
| Contact | دعوة للتواصل |

## الملفات

```
index.html      # الصفحة (عربي/إنجليزي في نفس الملف)
styles.css      # نظام التصميم كامل (ألوان، خطوط، كروت، responsive)
script.js       # اللغة، الهيدر + شريط التقدم، الظهور المتدرج، العدّادات، Parallax، Tilt، أزرار مغناطيسية، Confetti
asserts/        # الصور: الأعضاء، الجوائز، اللوجو، الـ mascot
```

## التشغيل محليًا

```bash
# أي سيرفر ستاتيك بسيط
python3 -m http.server 8080
# ثم افتح http://localhost:8080
```

## تعديل الستايل (مهم)
ملف الستايل مربوط بـ `styles.css?v=7` والـ JS بـ `script.js?v=7` — لما تعدّل أي منهم **غيّر الرقم** في `index.html`
(مثال: `?v=8`) عشان المتصفح ما يفضلش يستخدم نسخة قديمة من الكاش.

## إضافة إنجاز جديد

1. ضيف صورة الشهادة في `asserts/` (يفضّل عرض 1200px، JPG بجودة 85).
2. انسخ أي كارت `<article class="award">` في قسم `#achievements`.
3. غيّر الصورة والنص العربي (`.ar`) والإنجليزي (`.en`).
4. لو مفيش صورة، استخدم `class="award award-badge"` مع `badge-media` بدل الصورة.

## الألوان الأساسية

| المتغير | اللون |
| --- | --- |
| `--blue` | `#1f67b1` |
| `--coral` | `#f45b63` |
| `--yellow` | `#feca34` |
| `--green` | `#49b87a` |
| `--purple` | `#8060b4` |
| `--bg` | `#fef6ea` |
| `--text` | `#2a2118` |

الخطوط: **Cairo** للنصوص، **Baloo Bhaijaan 2** للعناوين العربية، **Baloo 2 / Quicksand** للإنجليزي.
