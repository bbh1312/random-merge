#!/bin/bash
set -xeuo pipefail

# System update and tooling
sudo dnf update -y
sudo dnf install -y docker git

sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ec2-user

# Create application directory structure
sudo mkdir -p /opt/random-character
sudo chown ec2-user:ec2-user /opt/random-character

# Placeholder for env file; user should upload secrets later
if [ ! -f /opt/random-character/.env ]; then
  cat <<'EENV' | sudo tee /opt/random-character/.env >/dev/null
OPENAI_API_KEY=
PORT=4000
NODE_ENV=production
EENV
  sudo chown ec2-user:ec2-user /opt/random-character/.env
  sudo chmod 600 /opt/random-character/.env
fi

# Allow ec2-user to run docker without sudo in login shells
if ! grep -q docker /home/ec2-user/.bashrc; then
  echo "newgrp docker" >> /home/ec2-user/.bashrc
fi
