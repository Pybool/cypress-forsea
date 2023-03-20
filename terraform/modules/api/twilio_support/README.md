# Twilio Support API

This creates an API Gateway with one endpoint, a simplified version of the Orders search 
for use with Lapland's Visitor Communication System, which uses Twilio to send SMS to customers during the event.  

In place is an API Gateway that requires an API Key passed as `x-api-key` header for all requests.  

This is connected to a "Lapland Twilio Support API Usage Plan", which allows access to that API.

API keys need to be made in API Gateway in the AWS console, and associated with this usage plan.

To make changes:
```
export AWS_PROFILE="ticknovate-test"
cd terraform/modules/api/twilio_support
terraform init
terraform workspace select test

terraform plan -var-file="test.tfvars"

terraform apply -var-file="test.tfvars"
```

Switch out the workspace and the var file for uat/prod as necessary.

This has only currently been deployed to test env. To deploy to UAT or prod see below.

For UAT:
```
export AWS_PROFILE="ticknovate-uat"
cd terraform/modules/api/twilio_support
terraform init
terraform workspace new uat

terraform plan -var-file="uat.tfvars"

terraform apply -var-file="uat.tfvars"
```

For Production:
```
export AWS_PROFILE="ticknovate-prod"
cd terraform/modules/api/twilio_support
terraform init
terraform workspace new prod

terraform plan -var-file="prod.tfvars"

terraform apply -var-file="prod.tfvars"
```

Depending on your setup you may need to follow Terraform setup instructions in the root README.md