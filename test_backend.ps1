try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/swagger-ui/index.html" -Method Head
    Write-Host "Backend Connectivity Check: SUCCESS"
    Write-Host "Status Code: $($response.StatusCode)"
} catch {
    Write-Host "Backend Connectivity Check: FAILED"
    Write-Host $_.Exception.Message
}
