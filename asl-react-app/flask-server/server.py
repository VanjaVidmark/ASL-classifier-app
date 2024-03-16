from flask import Flask, request, jsonify
from asl_predict import make_prediction

app = Flask(__name__)
    
@app.route('/api/send-frame', methods=['POST'])
def receive_frame():
    data = request.json
    if 'frame' in data:
        letter = make_prediction(data["frame"], "KNN_model")
        return jsonify({'letter': letter}), 200
    else:
        return jsonify({'error': 'Number not found in request'}), 400

if __name__ == '__main__':
    app.run(debug=True)
