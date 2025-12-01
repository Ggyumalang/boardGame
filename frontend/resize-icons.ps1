# PowerShell script to resize images to exact dimensions
Add-Type -AssemblyName System.Drawing

function Resize-Image {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [int]$Width,
        [int]$Height
    )
    
    $img = [System.Drawing.Image]::FromFile($InputPath)
    $newImg = New-Object System.Drawing.Bitmap($Width, $Height)
    $graphics = [System.Drawing.Graphics]::FromImage($newImg)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($img, 0, 0, $Width, $Height)
    
    $newImg.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graphics.Dispose()
    $newImg.Dispose()
    $img.Dispose()
    
    Write-Host "Resized to ${Width}x${Height}: $OutputPath"
}

# Resize 192x192
Resize-Image -InputPath "C:\Users\khg21\.gemini\antigravity\brain\b8113ad2-8b57-4148-aae1-60721cf6fb1d\icon_192x192_exact_1764308989198.png" `
             -OutputPath "c:\Users\khg21\.gemini\antigravity\scratch\boardGame\frontend\public\icon-192x192.png" `
             -Width 192 -Height 192

# Resize 512x512
Resize-Image -InputPath "C:\Users\khg21\.gemini\antigravity\brain\b8113ad2-8b57-4148-aae1-60721cf6fb1d\icon_512x512_exact_1764309009232.png" `
             -OutputPath "c:\Users\khg21\.gemini\antigravity\scratch\boardGame\frontend\public\icon-512x512.png" `
             -Width 512 -Height 512

Write-Host "✅ Icons resized successfully!"
