output "vpc_id" {
  value       = aws_vpc.main.id
  description = "Primary VPC id"
}

output "public_subnet_id" {
  value       = aws_subnet.public.id
  description = "Subnet hosting the application EC2 instance"
}

output "security_group_id" {
  value       = aws_security_group.app.id
  description = "Security group id"
}

output "ec2_public_ip" {
  value       = aws_eip.app.public_ip
  description = "Elastic IP assigned to the server"
}

output "ec2_instance_id" {
  value       = aws_instance.app.id
  description = "Instance id"
}

output "ecr_repository_url" {
  value       = aws_ecr_repository.app.repository_url
  description = "ECR repository URL for container images"
}
