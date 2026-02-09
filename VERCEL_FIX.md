# 🔧 URGENT: Vercel Environment Variable Fix

## Problem
Your live site at **www.mathbattle.xyz** is getting 404 errors because of a double slash in API calls:
- ❌ Current: `https://mathbattlebackend.onrender.com//api`
- ✅ Should be: `https://mathbattlebackend.onrender.com/api`

## Root Cause
The file `frontend/src/api.js` (line 8-11) automatically adds `/api` to the URL. Your Vercel environment variable includes `/api`, causing a double slash.

## Fix Required

### Step 1: Update Vercel Environment Variable

1. Go to **Vercel Dashboard**: https://vercel.com
2. Navigate to your project: **mathbattle**
3. Go to **Settings** → **Environment Variables**
4. Find variable: `VITE_API_URL`
5. **Current value:** `https://mathbattlebackend.onrender.com/` or `https://mathbattlebackend.onrender.com/api`
6. **Update to:** `https://mathbattlebackend.onrender.com` (NO trailing slash, NO /api)
7. Click **Save**

### Step 2: Redeploy

After updating the environment variable:
1. Go to **Deployments** tab
2. Click the **three dots (···)** on the latest deployment
3. Click **Redeploy**

**OR** just push a small change to GitHub (will auto-deploy):
```bash
git commit --allow-empty -m "Trigger redeploy after env var fix"
git push
```

## Why This Happens

The code in `api.js` is smart - it automatically adds `/api`:
```javascript
if (!url.endsWith('/api')) {
  url = url + '/api';  // This line adds /api
}
```

So if you set `VITE_API_URL=https://mathbattlebackend.onrender.com/`, it becomes:
- `https://mathbattlebackend.onrender.com/` + `/api` = `https://mathbattlebackend.onrender.com//api` ❌

**Correct setup:**
- Set: `VITE_API_URL=https://mathbattlebackend.onrender.com`
- Code adds: `/api`
- Result: `https://mathbattlebackend.onrender.com/api` ✅

## Verification

After redeployment:
1. Visit: https://www.mathbattle.xyz
2. Open browser console (F12)
3. Look for: `[API] Final API URL: https://mathbattlebackend.onrender.com/api`
4. Should have **single slash** before `api`
5. No more 404 errors!

## Files Updated Locally

I've updated `frontend/.env.production` to the correct value. When you push these changes, it will be correct in the repo, but **Vercel uses its own environment variables** from the dashboard (not the file), so you MUST update it in Vercel settings.

---

**After fixing, your site will work perfectly!** ✅
