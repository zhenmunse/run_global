# 测试 SendGrid API（PowerShell）
$apiKey = 'YOUR_SENDGRID_API_KEY'
$headers = @{ Authorization = "Bearer $apiKey"; 'Content-Type' = 'application/json' }
$body = @{
  personalizations = @(@{ to = @(@{ email = 'admin@vineshore.org' }) })
  from = @{ email = 'webform@vineshore.org' }
  subject = 'Test send'
  content = @(@{ type = 'text/plain'; value = 'test' })
} | ConvertTo-Json -Depth 10

$response = Invoke-WebRequest -Uri 'https://api.sendgrid.com/v3/mail/send' -Method Post -Headers $headers -Body $body -UseBasicParsing -ErrorAction SilentlyContinue
$response.StatusCode
$response.StatusDescription