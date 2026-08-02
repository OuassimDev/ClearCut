# ✂️ ClearCut

Studio-quality background removal, powered by AI.

ClearCut is a simple, modern web utility that instantly isolates subjects and removes image backgrounds with high precision—processed entirely in-memory with zero data storage.

---

### 🚀 Quick Start (Local)

1. **Backend**
   ```bash
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install flask flask-cors "rembg[cpu]" pillow
   python backend/app.py