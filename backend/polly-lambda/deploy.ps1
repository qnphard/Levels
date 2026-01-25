$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$backendDir = Resolve-Path $PSScriptRoot

$awsExe = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"
$samCmd = "C:\Program Files\Amazon\AWSSAMCLI\bin\sam.cmd"

if (!(Test-Path $awsExe)) {
  throw "AWS CLI not found at $awsExe. Install with: winget install -e --id Amazon.AWSCLI"
}
if (!(Test-Path $samCmd)) {
  throw "SAM CLI not found at $samCmd. Install with: winget install -e --id Amazon.SAM-CLI"
}

Write-Host "Checking AWS credentials..."
$profile = if ($env:AWS_PROFILE) { $env:AWS_PROFILE } else { "" }
$profileArgs = @()
if ($profile) {
  Write-Host "Using AWS profile: $profile"
  $profileArgs = @("--profile", $profile)
}
try {
  & $awsExe @profileArgs sts get-caller-identity | Out-Null
} catch {
  Write-Host ""
  Write-Host "AWS is not logged in/configured on this machine." -ForegroundColor Yellow
  Write-Host "Do ONE of the following, then re-run deploy.ps1:" -ForegroundColor Yellow
  Write-Host "  - aws configure (access keys)" -ForegroundColor Yellow
  Write-Host "  - aws configure sso  (IAM Identity Center) then: aws sso login" -ForegroundColor Yellow
  Write-Host ""
  throw
}

$stackName = if ($env:POLLY_STACK_NAME) { $env:POLLY_STACK_NAME } else { "levels-polly-tts" }
$region = if ($env:AWS_REGION) { $env:AWS_REGION } else { "us-east-1" }

Write-Host "Deploying stack '$stackName' to region '$region'..."

Push-Location $backendDir
try {
  npm i
  npm run build

  & $samCmd build
  if ($profile) {
    # SAM uses the AWS SDK, which respects AWS_PROFILE
    $env:AWS_PROFILE = $profile
  }
  & $samCmd deploy `
    --stack-name $stackName `
    --resolve-s3 `
    --capabilities CAPABILITY_IAM `
    --region $region `
    --no-confirm-changeset
} finally {
  Pop-Location
}

Write-Host "Fetching API URL from CloudFormation outputs..."
$apiUrl = & $awsExe cloudformation describe-stacks `
  @profileArgs `
  --stack-name $stackName `
  --region $region `
  --query "Stacks[0].Outputs[?OutputKey=='ApiUrl'].OutputValue | [0]" `
  --output text

if (!$apiUrl -or $apiUrl -eq "None") {
  throw "Could not find ApiUrl output. Check the stack outputs in CloudFormation."
}

$envPath = Join-Path $projectRoot ".env"
$envLine = "EXPO_PUBLIC_TTS_API_URL=$apiUrl"

Write-Host "Writing $envPath"
Set-Content -Path $envPath -Value $envLine -Encoding UTF8

Write-Host ""
Write-Host "Done." -ForegroundColor Green
Write-Host "API URL: $apiUrl"
Write-Host "Next: restart Expo (`npm start`) so EXPO_PUBLIC_TTS_API_URL is picked up."

