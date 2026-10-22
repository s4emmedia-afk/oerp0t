# أوربت — تشغيل على Render
1. ديسكورد: discord.com/developers/applications → New Application → "أوربت".
2. OAuth2: انسخ CLIENT_ID و CLIENT_SECRET، وأضف Redirect: https://اسم-موقعك.onrender.com/auth/callback
3. Bot: أنشئ البوت وانسخ BOT_TOKEN، وفعّل Server Members Intent و Message Content Intent.
4. ادعُ البوت بصلاحيات Administrator (OAuth2 → URL Generator → bot).
5. فعّل Developer Mode في ديسكورد وانسخ: GUILD_ID (آيدي السيرفر)، ADMIN_ROLE_ID (آيدي رتبة الإدارة)، TICKET_CATEGORY_ID (آيدي كاتيجوري التذاكر).
6. ارفع مجلد ready إلى GitHub، ثم Render → New Web Service (أو Blueprint) → Build: npm install، Start: npm start.
7. أضف المتغيرات من .env.example (BASE_URL = رابط موقعك على Render).
8. لحفظ التذاكر دائماً: أضف Disk في Render على مسار /var/data واجعل DATA_DIR=/var/data (الخطة المجانية تمسح الملفات عند إعادة التشغيل).
9. ادخل الموقع واربط حسابك. بما أن عندك رتبة الإدارة تظهر لك «لوحة الإدارة»: عدّل الأزرار ثم أرسل البانل لأي روم (أو اكتب !panel بالروم).
تجربة محلية: انسخ .env.example إلى .env ثم npm install و npm start.
