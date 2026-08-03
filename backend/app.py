import io
import os
from flask import Flask, request, send_file
from flask_cors import CORS
from rembg import remove, new_session
from PIL import Image

app = Flask(__name__)
CORS(app)


MODEL_NAME = os.environ.get("REMBG_MODEL", "u2netp")


_session = None

def get_session():
    global _session
    if _session is None:
        _session = new_session(MODEL_NAME)
    return _session


MAX_DIM = int(os.environ.get("MAX_DIM", "1600"))


def resize_if_needed(img: Image.Image) -> Image.Image:
    w, h = img.size
    scale = MAX_DIM / max(w, h)
    if scale < 1:
        img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
    return img


@app.route('/api/remove-bg', methods=['POST'])
def remove_bg():
    if 'image' not in request.files:
        return {'error': 'No image file uploaded'}, 400

    file = request.files['image']

    try:
        input_img = Image.open(file.stream)
        input_img = resize_if_needed(input_img)

        output_img = remove(input_img, session=get_session())

        img_io = io.BytesIO()
        output_img.save(img_io, 'PNG')
        img_io.seek(0)

        return send_file(img_io, mimetype='image/png')
    except Exception as e:
        return {'error': str(e)}, 500


@app.route('/health', methods=['GET'])
def health_check():
    return {'status': 'healthy'}, 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))