import io
from flask import Flask, request, send_file
from flask_cors import CORS
from rembg import remove, new_session
from PIL import Image

app = Flask(__name__)


CORS(app)

session = new_session("isnet-general-use")

@app.route('/api/remove-bg', methods=['POST'])
def remove_bg():
    if 'image' not in request.files:
        return {'error': 'No image file uploaded'}, 400

    file = request.files['image']

    try:
        input_img = Image.open(file.stream)

        output_img = remove(input_img, session=session)

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
    app.run(host='0.0.0.0', port=5000, debug=True)