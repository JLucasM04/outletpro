# Servidor HTTP Simples em PowerShell
# Sem dependências externas

$path = "c:\Users\joaol\Music\outletpro"
$port = 9000

Write-Host "Iniciando servidor HTTP na porta $port..."
Write-Host "Caminho: $path"
Write-Host ""

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "✅ Servidor rodando em http://localhost:$port"
Write-Host "⚡ Pressione Ctrl+C para parar"
Write-Host ""

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    
    $uri = $request.Url.LocalPath
    if ($uri -eq "/") { $uri = "/index.html" }
    
    $filePath = Join-Path $path $uri.TrimStart("/")
    
    try {
        if (Test-Path $filePath -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $extension = [System.IO.Path]::GetExtension($filePath)
            
            $contentTypes = @{
                ".html" = "text/html; charset=utf-8"
                ".css" = "text/css; charset=utf-8"
                ".js" = "application/javascript; charset=utf-8"
                ".json" = "application/json; charset=utf-8"
                ".png" = "image/png"
                ".jpg" = "image/jpeg"
                ".gif" = "image/gif"
                ".svg" = "image/svg+xml"
                ".ico" = "image/x-icon"
            }
            
            $response.ContentType = if ($contentTypes[$extension]) { $contentTypes[$extension] } else { "application/octet-stream" }
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
            $response.StatusCode = 200
            
            Write-Host "GET $uri -> 200 OK"
        } else {
            $response.StatusCode = 404
            $response.ContentType = "text/html; charset=utf-8"
            $html = "<html><body><h1>404 - Não Encontrado</h1><p>$uri</p></body></html>"
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($html)
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            
            Write-Host "GET $uri -> 404 NOT FOUND"
        }
    } catch {
        $response.StatusCode = 500
        Write-Host "GET $uri -> 500 ERROR: $_"
    } finally {
        $response.OutputStream.Close()
    }
}

$listener.Stop()
