# Infra setup

이 디렉터리는 AWS 상에 최소 비용으로 서버를 배포하기 위한 Terraform 코드와 운영 스크립트를 담고 있습니다. 구성은 다음과 같습니다.

- 전용 VPC (10.20.0.0/16) + 공용 서브넷 1개
- 인터넷 게이트웨이, 라우트 테이블
- HTTP/HTTPS/SSH용 보안 그룹 (SSH는 본인 IP로 제한 권장)
- t3.micro Amazon Linux 2023 EC2 + 탄력적 IP
- Docker 설치와 기본 디렉터리를 만드는 user-data 스크립트
- Amazon ECR 저장소 (이미지 5개만 보존)
- EC2 IAM Role (ECR pull + SSM 연결)

## 선행 준비물

1. AWS CLI 2.x 및 Terraform 1.6 이상 설치
2. `aws configure --profile random-char`로 자격 증명 생성 (Access Key/Secret Key)
3. IAM에서 이미 만들어 둔 SSH 키 페어 이름(예: `random-char-key`) 확인
4. Terraform backend를 로컬 로 실행할 경우, 이 repo 루트에서 `cd infra/terraform`

## 사용 방법

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
# 파일 안 values를 실제 값으로 수정
aws sso login --profile random-char # 또는 configure한 profile 로그인
terraform init
terraform plan -var-file=terraform.tfvars
terraform apply -var-file=terraform.tfvars
```

> ⚠️ `ssh_allowed_cidr`는 반드시 본인 공인 IP로 제한하세요. `0.0.0.0/0` 그대로 두면 누구나 SSH 접속을 시도할 수 있습니다.

### 주요 변수

| 변수 | 설명 | 기본값 |
| --- | --- | --- |
| `project_name` | 리소스 공통 접두사 | `random-character` |
| `environment` | `prod`, `stg` 등 환경 이름 | `prod` |
| `aws_region` | 배포 리전 | `ap-northeast-2` |
| `key_pair_name` | 기존 EC2 키 페어 이름 | (필수) |
| `instance_type` | 서버 사이즈 | `t3.micro` |
| `ssh_allowed_cidr` | SSH 허용 CIDR | `null` (자동으로 0.0.0.0/0) |
| `root_volume_size` | 루트 볼륨 크기(GB) | `30` |

Terraform 적용이 끝나면 출력값으로 VPC/서브넷/보안 그룹/Elastic IP/ECR URL 등을 확인할 수 있습니다.

## 배포 구조

1. GitHub Actions에서 Docker 이미지를 빌드해서 ECR에 푸시
2. 같은 Workflow가 SSH로 EC2에 접속해 최신 이미지를 pull & run (`deploy/run-container.sh` 호출)
3. EC2의 Docker 컨테이너는 host 80 포트를 컨테이너 4000번 포트로 연결 → 브라우저에서 바로 접근 가능

Secrets/환경 변수는 `/opt/random-character/.env` 파일에 저장되어 컨테이너 실행 시 `--env-file`로 주입됩니다. user-data가 최초에 빈 `.env`를 만들어주므로, 서버에 접속해서 OPENAI 키 등 실제 값을 채워 넣으면 됩니다.

## 운영 팁

- EC2에 SSM Agent 권한이 있으므로 Session Manager로 직접 접속할 수 있습니다.
- 비용 모니터링은 AWS Budgets에서 월 $15 알림을 걸어두었습니다.
- 추후 RDS나 S3가 필요하면 동일 Terraform 스택에 리소스를 추가하세요.
