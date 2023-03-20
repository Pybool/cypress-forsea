terraform {
  required_version = ">= 1.2.4"

  required_providers {
    datadog = {
      source  = "DataDog/datadog"
      version = "3.16.0"
    }
  }
}

resource "datadog_rum_application" "rum_application_harmony" {
  name = "harmony"
  type = "browser"
}
