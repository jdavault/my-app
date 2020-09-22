resource "aws_cloudwatch_metric_alarm" "this" {
  count = length(var.resources)
  actions_enabled           = true
  alarm_actions             = [
    var.sns_arn
  ]
  alarm_description         = var.description
  alarm_name                = "${var.name}-${var.resources[count.index]}"
  comparison_operator       = var.comparison_operator
  datapoints_to_alarm       = 1
  evaluation_periods        = 1
  insufficient_data_actions = []
  ok_actions                = [
    var.sns_arn
  ]
  tags                      = {}
  threshold                 = var.threshold
  treat_missing_data        = var.treat_missing_data
  metric_query {
    id          = "m${count.index}"
    return_data = true
    metric {
      dimensions  = {
        "FunctionName" = var.resources[count.index]
        "Resource"     = var.resources[count.index]
      }
      metric_name = var.metric_name
      namespace   = var.namespace
      period      = var.period
      stat        = var.stat
    }
  }
}


