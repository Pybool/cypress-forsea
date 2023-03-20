provider "aws" {
  region = var.aws_region
}

resource "aws_dynamodb_table" "print_manager_table" {
  name           = "lapland-${terraform.workspace}-PrintManagerConnections"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "connectionId"

  attribute {
    name = "connectionId"
    type = "S"
  }
}

resource "aws_iam_role" "print_manager_lambda_role" {
  name = "lapland-${terraform.workspace}-print_manager_lambda_role"
  assume_role_policy = jsonencode(
{
  Version: "2012-10-17",
  Statement: [
    {
      Action: "sts:AssumeRole",
      Principal: {
        "Service": "lambda.amazonaws.com"
      },
      Effect: "Allow",
      Sid: ""
    }
  ]
}
)
}

resource "aws_iam_policy" "print_manager_lambda_policy" {
  name = "lapland-${terraform.workspace}-print_manager_lambda_policy"
  policy = jsonencode(
    {
      Version: "2012-10-17",
      Statement: [
        {
          Action: [
            "dynamodb:PutItem",
            "dynamodb:DeleteItem",
            "dynamodb:Scan"
          ],
          Resource: aws_dynamodb_table.print_manager_table.arn,
          Effect: "Allow",
          Sid: ""
        },
        {
          Action: "execute-api:*",
          Resource: "${aws_apigatewayv2_stage.print_manager_api_stage.execution_arn}/*/*"
          Effect: "Allow",
          Sid: ""
        }
      ]
    }
  )
}

resource "aws_iam_role_policy_attachment" "print_manager_lambda_policy_attachment" {
  role = aws_iam_role.print_manager_lambda_role.name
  policy_arn = aws_iam_policy.print_manager_lambda_policy.arn

}

resource "aws_iam_role_policy_attachment" "print_manager_lambda_policy_attachment_basic" {
  role       = "${aws_iam_role.print_manager_lambda_role.name}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_permission" "print_manager_lambda_permission" {
  statement_id  = "AllowPrintManagerAPIInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.print_handler.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.print_manager_api.execution_arn}/*/*"
}

resource "aws_lambda_function" "print_handler" {
  filename      = "lambda.zip"
  function_name = "lapland-${terraform.workspace}-printHandler"
  role          = aws_iam_role.print_manager_lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs14.x"

  environment {
    variables = {
      API_GATEWAY_URL = replace(aws_apigatewayv2_stage.print_manager_api_stage.invoke_url, "wss://", "")
      CONNECTIONS_TABLE = aws_dynamodb_table.print_manager_table.name
    }
  }
}

resource "aws_apigatewayv2_api" "print_manager_api" {
  name                       = "lapland-${terraform.workspace}-Print-Manager-Connection-API"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
}

resource "aws_apigatewayv2_stage" "print_manager_api_stage" {
  api_id = aws_apigatewayv2_api.print_manager_api.id
  name   = "v1"
}

resource "aws_apigatewayv2_integration" "print_manager_integration" {
  api_id           = aws_apigatewayv2_api.print_manager_api.id
  integration_type = "AWS_PROXY"
  content_handling_strategy = "CONVERT_TO_TEXT"
  integration_method        = "POST"
  integration_uri           = aws_lambda_function.print_handler.invoke_arn
}

resource "aws_apigatewayv2_route" "print_queue_default_route" {
  api_id    = aws_apigatewayv2_api.print_manager_api.id
  route_key = "$default"
  target = "integrations/${aws_apigatewayv2_integration.print_manager_integration.id}"
}

resource "aws_apigatewayv2_route" "print_queue_connect_route" {
  api_id    = aws_apigatewayv2_api.print_manager_api.id
  route_key = "$connect"
  target = "integrations/${aws_apigatewayv2_integration.print_manager_integration.id}"
}

resource "aws_apigatewayv2_route" "print_queue_disconnect_route" {
  api_id    = aws_apigatewayv2_api.print_manager_api.id
  route_key = "$disconnect"
  target = "integrations/${aws_apigatewayv2_integration.print_manager_integration.id}"
}

resource "aws_apigatewayv2_deployment" "print_manager_api_deployment" {
  api_id      = aws_apigatewayv2_api.print_manager_api.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_apigatewayv2_route.print_queue_default_route,
      aws_apigatewayv2_route.print_queue_connect_route,
      aws_apigatewayv2_route.print_queue_disconnect_route,
      aws_apigatewayv2_integration.print_manager_integration
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}
