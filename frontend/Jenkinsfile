pipeline {
    agent any

    environment {
        ECR_REPO = '575108921650.dkr.ecr.ap-northeast-2.amazonaws.com/mysafedraw/frontend-image'
        AWS_REGION = 'ap-northeast-2'
        K8S_BRANCH = 'k8s'
        CREDENTIALS_ID = 'aws-credentials-id'
    }

    stages {
        stage('Copy .env File for Test') {
            steps {
                script {
                    dir('frontend') {
                        withCredentials([file(credentialsId: 'frontend-test-env', variable: 'TEST_ENV')]) {
                            sh '''
                            # 테스트 환경 .env 파일 복사
                            chmod 777 .
                            cp -f $TEST_ENV ./.env
                            '''
                        }
                    }
                }
            }
        }

        stage('Build Docker Image for Test') {
            steps {
                script {
                    echo 'Building Docker image for Test environment...'
                    dir('frontend') {
                        sh """
                        docker build -t frontend-image .
                        """
                    }
                }
            }
        }

        stage('Deploy Test with Docker Compose') {
            steps {
                script {
                    echo 'Deploying Test environment with Docker Compose...'
                    dir('frontend') {
                        sh """
                        docker-compose down
                        docker-compose up -d
                        """
                    }
                }
            }
        }

        stage('Copy .env File for Prod') {
            steps {
                script {
                    dir('frontend') {
                        withCredentials([file(credentialsId: 'frontend-prod-env', variable: 'PROD_ENV')]) {
                            sh '''
                            # 프로덕션 환경 .env 파일 복사
                            chmod 777 .
                            cp -f $PROD_ENV ./.env
                            '''
                        }
                    }
                }
            }
        }

        stage('Build Docker Image for Prod') {
            steps {
                script {
                    echo 'Building Docker image for Prod environment...'
                    dir('frontend') {
                        sh """
                        docker build -t ${ECR_REPO}:${env.BUILD_NUMBER} .
                        docker tag ${ECR_REPO}:${env.BUILD_NUMBER} ${ECR_REPO}:latest
                        """
                    }
                }
            }
        }

        stage('AWS CLI Login') {
            steps {
                withAWS(credentials: CREDENTIALS_ID, region: AWS_REGION) {
                    sh """
                    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REPO}
                    """
                }
            }
        }

        stage('Push Docker Image to AWS ECR') {
            steps {
                script {
                    echo 'Pushing Docker image for Prod environment to ECR...'
                    sh """
                    docker push ${ECR_REPO}:${env.BUILD_NUMBER}
                    docker push ${ECR_REPO}:latest
                    """
                }
            }
        }

        stage('Switch to K8S Branch') {
            steps {
                script {
                    echo 'Switching to K8S branch...'
                    withCredentials([
                        usernamePassword(
                            credentialsId: 'gitlab-credentials', 
                            passwordVariable: 'GIT_PASSWORD', 
                            usernameVariable: 'GIT_USERNAME'
                        )
                    ]) {
                        sh '''
                        git remote set-url origin https://${GIT_USERNAME}:${GIT_PASSWORD}@lab.ssafy.com/s11-final/S11P31A405.git
                        git fetch origin
                        git checkout ${K8S_BRANCH}
                        git pull origin ${K8S_BRANCH}
                        '''
                    }
                }
            }
        }

        stage('Update K8S Deployment File') {
            steps {
                script {
                    echo "Updating frontend-deployment.yaml with new image tag: ${env.BUILD_NUMBER}"
                    sh """
                    sed -i 's|image: .*|image: ${ECR_REPO}:${env.BUILD_NUMBER}|' k8s/frontend/frontend-deployment.yaml
                    git status
                    """
                }
            }
        }

        stage('Commit and Push Changes to K8S Branch') {
            steps {
                script {
                    echo "Committing changes to ${K8S_BRANCH} branch..."
                    sh """
                    git config user.name "Jenkins"
                    git config user.email "jenkins@example.com"
                    git add k8s/frontend/frontend-deployment.yaml
                    git commit -m "Update frontend image to ${env.BUILD_NUMBER}"
                    git push origin ${K8S_BRANCH}
                    """
                }
            }
        }

        stage('Clean Up Docker Images') {
            steps {
                script {
                    echo 'Cleaning up local Docker images...'
                    sh 'docker image prune -f'
                }
            }
        }
    }
}