pipeline {
    agent any

    environment {
        // DOCKER_USER sẽ được lấy từ credentials 'dockerhub-cred'
        IMAGE_NAME = "front_dep"
        
        // TODO: SỬA ĐỊA CHỈ IP DƯỚI ĐÂY THÀNH IP MÁY ẢO UBUNTU CỦA BẠN
        SERVER_HOST = "192.168.x.x" 
        
        // TODO: Sửa thành tên user máy ảo ubuntu (ví dụ: ubuntu, root, hoặc tên bạn đặt)
        SERVER_USER = "root" 
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/PhuocQuan/DevOps.git',
                        credentialsId: 'github-pat'
                    ]]
                ])
            }
        }

        stage('Docker Build') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred',
                usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "docker build -t docker.io/$DOCKER_USER/$IMAGE_NAME:latest ."
                }
            }
        }

        stage('Push Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred',
                usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                    sh "docker push docker.io/$DOCKER_USER/$IMAGE_NAME:latest"
                }
            }
        }

        stage('Deploy Server') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'dockerhub-cred',
                    usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
                    file(credentialsId: 'docker-compose-file', variable: 'DOCKER_COMPOSE_PATH')
                ]) {
                    sshagent (credentials: ['server-ssh-key']) {
                        sh '''
                        # Tạo thư mục project trên server nếu chưa có
                        ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST "mkdir -p ~/project"
                        
                        # Copy file docker-compose.yml từ Jenkins sang server
                        scp -o StrictHostKeyChecking=no $DOCKER_COMPOSE_PATH $SERVER_USER@$SERVER_HOST:~/project/docker-compose.yml
                        
                        # SSH vào server để khởi chạy bằng docker compose
                        ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST "
                        cd ~/project && \\
                        echo \\"$DOCKER_PASS\\" | docker login -u $DOCKER_USER --password-stdin && \\
                        docker compose pull && \\
                        docker compose down && \\
                        docker compose up -d && \\
                        docker image prune -f
                        "
                        '''
                    }
                }
            }
        }
    }
}
