# آذرمهر صنعت — ساختار پروژه

## فایل‌های اصلی

### `messenger-app-compiled.html`
فایل نهایی compile شده برای GitHub Pages.
**هرگز دستی ویرایش نکنید** — از build script استفاده کنید.

---

## ساختار سورس

```
src/
├── constants.js          ← USERS، رنگ‌ها، Supabase، داده‌های اولیه
├── components/
│   └── index.jsx         ← Av، Badge، Sheet، DrawerItem، WorkflowTimeline
└── modules/
    ├── Chat.jsx          ← ✅ تست شده - تغییر ندهید
    ├── Requests.jsx      ← ✅ تست شده - تغییر ندهید
    ├── Payments.jsx      ← ✅ تست شده - تغییر ندهید
    ├── Projects.jsx      ← ✅ تست شده - تغییر ندهید
    ├── CRM.jsx           ← 🔧 در حال توسعه
    ├── Notifications.jsx ← ✅ تست شده - تغییر ندهید
    ├── Letters.jsx       ← ⚠️ نیاز به تست
    ├── Admin.jsx         ← ✅ تست شده - تغییر ندهید
    └── OrgChart.jsx      ← ✅ تست شده - تغییر ندهید
```

---

## قوانین توسعه

1. **هر ماژول مستقله** — تغییر یکی نباید دیگری رو خراب کنه
2. **قبل از compile** — preview JSX بساز و تأیید بگیر
3. **بعد از هر تغییر** — syntax check بزن
4. **فایل compile شده** — فقط از build script بساز

---

## Build Process

```bash
# Syntax check
node -e "babel.transformSync(code, {presets:['@babel/preset-react']})"

# Build
browserify app.jsx -t babelify -o bundle.js
terser bundle.js --compress --mangle -o bundle.min.js
```

---

## کاربران سیستم

| نام | username | رمز |
|-----|----------|-----|
| محمدرضا بزرگمهر | bozorgmehr | Azr@1401 |
| سعید کریم‌لو | karimloo | Azr@1402 |
| امید سراج‌الدینی | seraj | Azr@1403 |
| لیلا اردستانی | ardestani | Azr@1404 |
| ملیکا کمازانی | kamazani | Azr@1405 |
| مجتبی قاسم‌بیک | ghasembik | Azr@1406 |
| فیض‌الله حسینی | hosseini | Azr@1407 |
| فرهاد محسن‌زاده | mohsenzadeh | Azr@1408 |
| فغانی | faghani | Azr@1409 |
| حسین مرادی | moradi | Azr@1410 |
| المیرا دولتخواه | dolatkhah | Azr@1411 |
| کوثر اعرابی | aarabi | Azr@1412 |

---

## Supabase

- **URL:** https://apscmdspkitpwzhizgkq.supabase.co
- **Tables:** messages, requests, payments, notifications, crm_customers, crm_orders
