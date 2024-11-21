import json
import numpy as np
import os
import tensorflow as tf
from flask import Flask, request, jsonify, render_template
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# 모델 로드
model = load_model('model.h5')
# 레이블 인코더 로드
label_encoder = LabelEncoder()
label_encoder.classes_ = np.load('classes.npy', allow_pickle=True)  # 클래스 저장 및 로드

#max_timesteps = 150
max_timesteps = 200


def preprocess_drawing(drawing):
    strokes = []
    for stroke in drawing:
        for x, y in zip(stroke[0], stroke[1]):
            strokes.append([x, y])
            if len(strokes) >= max_timesteps:
                break
        if len(strokes) >= max_timesteps:
            break
    return strokes


@app.route('/')
def home():
    return render_template('index2.html')

# @app.route('/predict', methods=['POST'])
# def predict():
#     data = request.json
#     drawing = data['drawing']
#     processed_drawing = preprocess_drawing(drawing)
#
#     # 데이터 패딩
#     data_array = pad_sequences([processed_drawing], maxlen=max_timesteps, padding='post', dtype='float32')
#
#     # 예측 수행
#     prediction = model.predict(data_array)
#     predicted_class = np.argmax(prediction, axis=1)
#     label = label_encoder.inverse_transform(predicted_class)
#
#     return jsonify({'label': label[0]})

@app.route('/api2/predict', methods=['POST'])
def predict():
    data = request.json
    drawing = data['drawing']
    processed_drawing = preprocess_drawing(drawing)

    # 데이터 패딩
    data_array = pad_sequences([processed_drawing], maxlen=max_timesteps, padding='post', dtype='float32')

    # 예측 수행
    prediction = model.predict(data_array)[0]

    # 상위 3개 클래스 인덱스와 확률 계산
    top_3_indices = np.argsort(prediction)[-3:][::-1]
    top_3_labels = label_encoder.inverse_transform(top_3_indices)
    top_3_probabilities = [round(float(prediction[i]) * 100, 2) for i in top_3_indices]  # 확률을 %로 변환

    # 상위 3개의 라벨과 확률 반환
    return jsonify({
        'top_labels': top_3_labels.tolist(),
        'top_probabilities': top_3_probabilities
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0',port=8000)
