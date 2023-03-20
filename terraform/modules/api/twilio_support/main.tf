provider "aws" {
  region = var.aws_region
}

resource "aws_api_gateway_rest_api" "twilio_support_api" {
  name = "Lapland Twilio Support API"
  description = "Supports the Lapland Visitor Communication System."
}

resource "aws_api_gateway_resource" "twilio_support_api_resource_vcs" {
  rest_api_id = aws_api_gateway_rest_api.twilio_support_api.id
  parent_id   = aws_api_gateway_rest_api.twilio_support_api.root_resource_id
  path_part   = "vcs"
}

resource "aws_api_gateway_resource" "twilio_support_api_resource_orders" {
  rest_api_id = aws_api_gateway_rest_api.twilio_support_api.id
  parent_id   = aws_api_gateway_resource.twilio_support_api_resource_vcs.id
  path_part   = "orders"
}

resource "aws_api_gateway_request_validator" "twilio_support_api_validator" {
  name                        = "Validator"
  rest_api_id                 = aws_api_gateway_rest_api.twilio_support_api.id
  validate_request_parameters = true
}

resource "aws_api_gateway_method" "twilio_support_api_orders_method" {
  rest_api_id   = aws_api_gateway_rest_api.twilio_support_api.id
  resource_id   = aws_api_gateway_resource.twilio_support_api_resource_orders.id
  http_method   = "GET"
  authorization = "NONE"
  api_key_required = true
  request_parameters = {
    "method.request.querystring.booking-date-start" = true
    "method.request.querystring.booking-date-end" = true
    "method.request.querystring.booking-time-start" = true
    "method.request.querystring.booking-time-end" = true
  }
  request_validator_id = aws_api_gateway_request_validator.twilio_support_api_validator.id
}

resource "aws_api_gateway_integration" "twilio_support_api_orders_method_integration" {
  rest_api_id = aws_api_gateway_rest_api.twilio_support_api.id
  resource_id = aws_api_gateway_resource.twilio_support_api_resource_orders.id
  http_method = aws_api_gateway_method.twilio_support_api_orders_method.http_method
  type                    = "HTTP"
  uri                     = var.uri_orders_endpoint
  integration_http_method = "GET"
  passthrough_behavior    = "WHEN_NO_MATCH"

  connection_type = "VPC_LINK"
  connection_id   = var.vpc_connection_id

  request_parameters = {
    "integration.request.querystring.booking-date-start" = "method.request.querystring.booking-date-start"
    "integration.request.querystring.booking-date-end" = "method.request.querystring.booking-date-end"
    "integration.request.querystring.booking-time-start" = "method.request.querystring.booking-time-start"
    "integration.request.querystring.booking-time-end" = "method.request.querystring.booking-time-end"
    "integration.request.querystring.sort" = "'start-date-time'"
  }
}

resource "aws_api_gateway_method_response" "response_200" {
  rest_api_id = aws_api_gateway_rest_api.twilio_support_api.id
  resource_id = aws_api_gateway_resource.twilio_support_api_resource_orders.id
  http_method = aws_api_gateway_method.twilio_support_api_orders_method.http_method
  status_code = "200"
}

resource "aws_api_gateway_integration_response" "twilio_support_api_integration_response_200" {
  rest_api_id = aws_api_gateway_rest_api.twilio_support_api.id
  resource_id = aws_api_gateway_resource.twilio_support_api_resource_orders.id
  http_method = aws_api_gateway_method.twilio_support_api_orders_method.http_method
  status_code = aws_api_gateway_method_response.response_200.status_code

  response_templates = {
    "application/json" = <<EOF
#set($orders = $input.path('$'))
[
#foreach($order in $orders)
  #if($order.status != "cancelled")
  {
    "id": "$order.id",
    "firstname": "$order.customer.firstname",
    "lastname": "$order.customer.lastname",
    "telephone": "$order.customer.telephone",
    "email": "$order.customer.email",
    "start_date": "$order.items[0].booked_unit.start_date",
    "start_time": "$order.items[0].booked_unit.start_time",
    "group": #if($order.extensions.group != "")"$order.extensions.group"#else"unassigned"#end

  }#if($foreach.hasNext),#end
  #end
#end
]
EOF
  }
}

resource "aws_api_gateway_method_response" "response_500" {
  rest_api_id = aws_api_gateway_rest_api.twilio_support_api.id
  resource_id = aws_api_gateway_resource.twilio_support_api_resource_orders.id
  http_method = aws_api_gateway_method.twilio_support_api_orders_method.http_method
  status_code = "500"
}

resource "aws_api_gateway_integration_response" "twilio_support_api_integration_response_500" {
  rest_api_id       = aws_api_gateway_rest_api.twilio_support_api.id
  resource_id       = aws_api_gateway_resource.twilio_support_api_resource_orders.id
  http_method       = aws_api_gateway_method.twilio_support_api_orders_method.http_method
  status_code       = aws_api_gateway_method_response.response_500.status_code
  selection_pattern = "500"
}

resource "aws_api_gateway_deployment" "twilio_support_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.twilio_support_api.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.twilio_support_api_resource_orders,
      aws_api_gateway_method.twilio_support_api_orders_method,
      aws_api_gateway_integration.twilio_support_api_orders_method_integration,
      aws_api_gateway_integration_response.twilio_support_api_integration_response_200
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "twilio_support_api_stage" {
  deployment_id = aws_api_gateway_deployment.twilio_support_api_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.twilio_support_api.id
  stage_name    = "v1"
}

resource "aws_api_gateway_usage_plan" "twilio_support_api_usage_plan" {
  name         = "Lapland Twilio Support API Usage Plan"

  api_stages {
    api_id = aws_api_gateway_rest_api.twilio_support_api.id
    stage  = aws_api_gateway_stage.twilio_support_api_stage.stage_name
  }

  quota_settings {
    limit  = 1000
    period = "DAY"
  }

  throttle_settings {
    burst_limit = 200
    rate_limit  = 100
  }
}