terraform {
  required_version = ">= 1.2.4"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }

    datadog = {
      source  = "DataDog/datadog"
      version = "3.16.0"
    }
  }
}

provider "aws" {
  region = "eu-west-1"
}

provider "datadog" {
  api_key               = var.dd_api_key
  app_key               = var.dd_app_key
  api_url               = "https://api.datadoghq.eu/"
}

module "site-main" {
  source = "github.com/skyscrapers/terraform-website-s3-cloudfront-route53//site-main"

  region = var.aws_region
  domain = var.domain
  bucket_name = var.bucket_name
  duplicate-content-penalty-secret = var.duplicate-content-penalty-secret
  acm-certificate-arn = var.acm-certificate-arn
  not-found-response-path = "/index.html"
  price_class = "PriceClass_100"
}

module "datadog-rum" {
  source              = "./modules/datadog_rum"
  dd_app_key          = var.dd_app_key
  dd_api_key          = var.dd_api_key
}