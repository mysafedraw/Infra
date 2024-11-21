# Jenkins LTS 이미지 기반
FROM jenkins/jenkins:lts

# Docker CLI 설치
USER root
RUN apt-get update && \
    apt-get install -y docker.io && \
    rm -rf /var/lib/apt/lists/*

# docker-compose 설치
RUN curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep -oP '(?<=tag_name": ")[^"]+')" -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose

# 이미 존재하는 경우에도 docker 그룹을 사용해 jenkins 사용자 추가
RUN groupmod -g 988 docker || groupadd -g 988 docker && usermod -aG docker jenkins

# jenkins 사용자로 변경
USER jenkins