# Deployment Guide

이 문서는 인프라 배포부터 CI/CD 파이프라인 구성, 애플리케이션 배포까지 전체 흐름을 정리합니다.

## 1. 필수 도구

- Terraform 1.6+
- AWS CLI 2.x (`aws configure --profile random-char` 완료)
- GitHub 저장소 권한 (Actions/Secrets 설정 가능)
- SSH 클라이언트 (EC2 초기 접속용)

## 2. 인프라 프로비저닝 (Terraform)

1. `cd infra/terraform`
2. `cp terraform.tfvars.example terraform.tfvars`
3. `terraform.tfvars` 값을 실환경에 맞게 수정
4. `terraform init`
5. `terraform apply -var-file=terraform.tfvars`

주요 출력값:
- `ec2_public_ip`: 서버에 접속할 공인 IP
- `ecr_repository_url`: CI가 이미지를 push 할 대상

> SSH 포트는 반드시 본인 IP로 제한(`ssh_allowed_cidr`)하는 것을 권장합니다.

## 3. 서버 초기 설정

Terraform user-data가 `/opt/random-character/.env` 파일을 만들어 놓지만 실제 값은 비어있습니다. EC2에 접속해 다음 내용을 채우세요.

```bash
ssh -i random-char-key.pem ec2-user@<ec2_public_ip>
vi /opt/random-character/.env
```

필수 ENV 예시:

```
OPENAI_API_KEY=sk-...
PORT=4000
NODE_ENV=production
```

필요하면 API base URL 등도 여기에 추가합니다. 파일 권한은 600으로 유지하세요.

## 4. GitHub Actions 시크릿

`.github/workflows/deploy-server.yml`은 아래 시크릿이 있어야 동작합니다.

| Secret | 설명 |
| --- | --- |
| `AWS_ACCESS_KEY_ID` | ECR push 권한이 있는 IAM 사용자의 Access Key |
| `AWS_SECRET_ACCESS_KEY` | 위 사용자 Secret Key |
| `EC2_HOST` | Terraform 출력 `ec2_public_ip` |
| `EC2_USER` | 기본은 `ec2-user` |
| `EC2_SSH_KEY` | 서버 접속용 Private Key (PEM 전체 문자열) |

> Private Key는 `-----BEGIN OPENSSH PRIVATE KEY-----` 포함하여 그대로 입력합니다.

필요 시 `HOST_HTTP_PORT`, `APP_NAME` 등은 Workflow 내부에서 환경변수로 조정할 수 있습니다.

## 5. 배포 흐름

1. 서버/Infra 코드가 `main` 브랜치에 머지되면 GitHub Actions가 실행됩니다.
2. `server/` 디렉터리를 기반으로 Docker 이미지를 빌드 → ECR에 `random-character-prod` 태그로 push.
3. Actions가 SSH로 EC2에 접속해 `deploy/run-container.sh`를 업로드하고 실행.
4. 스크립트는 최신 이미지를 pull, 기존 컨테이너를 중지 후 새 컨테이너를 80→4000 포트 매핑으로 실행합니다.

## 6. 수동 배포 (테스트용)

로컬에서 이미지를 만들어 바로 서버에 올리고 싶다면:

```bash
cd server
docker build -t random-character:local .
# scp run-container.sh & docker save image 등으로 배포 가능
```

다만 표준 플로우는 GitHub Actions를 통해 자동화된 파이프라인을 사용하는 것입니다.

## 7. 향후 확장 아이디어

- HTTPS용 ACM 인증서 + ALB 추가 (Terraform에 listener/target group 확장)
- RDS(PostgreSQL) 연결 후 캐시/프리미엄 사용량을 DB에 저장
- CloudWatch Logs/Metric 알람 추가로 헬스 모니터링
- Terraform backend를 S3/DynamoDB로 분리해 협업 인프라 관리
