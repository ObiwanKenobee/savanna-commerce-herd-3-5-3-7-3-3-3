# 🦁 Savanna Marketplace Infrastructure as Code
# Multi-region deployment for Kenya and East Africa

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.20"
    }
  }

  backend "s3" {
    bucket = "savanna-marketplace-terraform-state"
    key    = "production/terraform.tfstate"
    region = "af-south-1"  # Africa (Cape Town)
  }
}

# 🌍 Multi-Region Setup
locals {
  regions = {
    primary   = "af-south-1"    # Africa (Cape Town) - Primary
    secondary = "eu-west-1"     # Europe (Ireland) - Secondary for latency
  }
  
  environment = var.environment
  project_name = "savanna-marketplace"
  
  common_tags = {
    Project     = local.project_name
    Environment = local.environment
    ManagedBy   = "terraform"
    Region      = "east-africa"
    Wildlife    = "🦁"
  }
}

# 🔐 Variables
variable "environment" {
  description = "Environment name (staging/production)"
  type        = string
  default     = "production"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.medium"
}

variable "min_size" {
  description = "Minimum number of instances"
  type        = number
  default     = 2
}

variable "max_size" {
  description = "Maximum number of instances"
  type        = number
  default     = 10
}

# 🌐 AWS Provider Configuration
provider "aws" {
  region = local.regions.primary
  
  default_tags {
    tags = local.common_tags
  }
}

provider "aws" {
  alias  = "secondary"
  region = local.regions.secondary
  
  default_tags {
    tags = local.common_tags
  }
}

# 🏗️ VPC and Networking
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  
  name = "${local.project_name}-${local.environment}-vpc"
  cidr = "10.0.0.0/16"
  
  azs             = ["${local.regions.primary}a", "${local.regions.primary}b", "${local.regions.primary}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  
  enable_nat_gateway = true
  enable_vpn_gateway = true
  enable_dns_hostnames = true
  enable_dns_support = true
  
  tags = merge(local.common_tags, {
    Name = "${local.project_name}-${local.environment}-vpc"
    Purpose = "savanna-network"
  })
}

# 🔒 Security Groups
resource "aws_security_group" "web" {
  name        = "${local.project_name}-${local.environment}-web"
  description = "Security group for web servers"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = [module.vpc.vpc_cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.common_tags, {
    Name = "${local.project_name}-${local.environment}-web-sg"
  })
}

# 🗄️ Database (RDS PostgreSQL)
resource "aws_db_subnet_group" "main" {
  name       = "${local.project_name}-${local.environment}-db-subnet-group"
  subnet_ids = module.vpc.private_subnets

  tags = merge(local.common_tags, {
    Name = "${local.project_name}-${local.environment}-db-subnet-group"
  })
}

resource "aws_db_instance" "main" {
  identifier = "${local.project_name}-${local.environment}-db"
  
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.t3.micro"
  
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp2"
  storage_encrypted     = true
  
  db_name  = "savanna_marketplace"
  username = var.db_username
  password = var.db_password
  
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.database.id]
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "Sun:04:00-Sun:05:00"
  
  skip_final_snapshot = false
  final_snapshot_identifier = "${local.project_name}-${local.environment}-final-snapshot"
  
  tags = merge(local.common_tags, {
    Name = "${local.project_name}-${local.environment}-database"
    Purpose = "wildlife-data-store"
  })
}

resource "aws_security_group" "database" {
  name        = "${local.project_name}-${local.environment}-database"
  description = "Security group for database"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.web.id]
  }

  tags = merge(local.common_tags, {
    Name = "${local.project_name}-${local.environment}-database-sg"
  })
}

# 🚀 Application Load Balancer
resource "aws_lb" "main" {
  name               = "${local.project_name}-${local.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.web.id]
  subnets           = module.vpc.public_subnets

  enable_deletion_protection = false

  tags = merge(local.common_tags, {
    Name = "${local.project_name}-${local.environment}-alb"
    Purpose = "savanna-gateway"
  })
}

resource "aws_lb_target_group" "web" {
  name     = "${local.project_name}-${local.environment}-web-tg"
  port     = 8080
  protocol = "HTTP"
  vpc_id   = module.vpc.vpc_id

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }

  tags = merge(local.common_tags, {
    Name = "${local.project_name}-${local.environment}-web-tg"
  })
}

resource "aws_lb_listener" "web" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web.arn
  }
}

# 📊 Outputs
output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "database_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

output "load_balancer_dns" {
  description = "DNS name of the load balancer"
  value       = aws_lb.main.dns_name
}

# 🔐 Database Variables
variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "savanna_admin"
  sensitive   = true
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
}
