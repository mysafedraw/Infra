# Python 3.9 이미지 사용
FROM ai-base-image

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 패키지 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 소스 코드 복사
COPY . .

# Gunicorn으로 Flask 서버 실행 (2개의 워커 설정)
CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:8000", "app:app"]