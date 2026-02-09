terraform {
  required_providers {
    supabase = {
      source  = "supabase/supabase"
      version = "~> 1.0"
    }
  }
}

variable "supabase_access_token" {
  type      = string
  default   = ""
  sensitive = true
}

variable "supabase_endpoint" {
  type    = string
  default = ""
}

provider "supabase" {
  access_token = var.supabase_access_token != "" ? var.supabase_access_token : null
  endpoint     = var.supabase_endpoint != "" ? var.supabase_endpoint : null
}