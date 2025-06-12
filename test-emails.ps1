# Тестовые данные
$testEmail = "ilyaasmirnov02@gmail.com"
$actionUrl = "https://teacheruchit.ru/verify"

# Функция для отправки запроса
function Send-EmailRequest {
    param (
        [string]$endpoint,
        [string]$email,
        [string]$actionUrl
    )
    
    $body = @{
        email = $email
        actionUrl = $actionUrl
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/$endpoint" -Body $body -ContentType "application/json"
        Write-Host "✅ $endpoint успешно отправлено"
        return $true
    }
    catch {
        Write-Host "❌ Ошибка при отправке $endpoint : $_"
        return $false
    }
}

# Проверяем, запущен ли сервер
try {
    $response = Invoke-RestMethod -Method Get -Uri "http://localhost:3000" -TimeoutSec 1
}
catch {
    Write-Host "❌ Сервер не запущен. Запустите сервер командой: node server.js"
    exit
}

Write-Host "`nТестирование отправки писем...`n"

# Тестируем все типы писем
$results = @{
    "verification" = Send-EmailRequest -endpoint "send-verification" -email $testEmail -actionUrl $actionUrl
    "passwordReset" = Send-EmailRequest -endpoint "send-password-reset" -email $testEmail -actionUrl $actionUrl
    "welcome" = Send-EmailRequest -endpoint "send-welcome" -email $testEmail -actionUrl $actionUrl
}

# Выводим итоги
Write-Host "`nРезультаты тестирования:"
$results.GetEnumerator() | ForEach-Object {
    $status = if ($_.Value) { "✅ Успешно" } else { "❌ Ошибка" }
    Write-Host "$($_.Key): $status"
} 