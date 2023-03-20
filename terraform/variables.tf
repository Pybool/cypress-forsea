variable "aws_region" {
  type = string
  default = "eu-west-1"
}

variable "domain" {
  type = string
}
variable "bucket_name" {
  type = string
}
variable "duplicate-content-penalty-secret" {
  type = string
}
variable "acm-certificate-arn" {
  type = string
}
variable dd_api_key {
  type    = string
  sensitive = true
}
variable dd_app_key {
  type    = string
  sensitive = true
}