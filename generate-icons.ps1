Add-Type -AssemblyName System.Drawing

$destDir = Join-Path $PSScriptRoot "icons"
if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir | Out-Null
}

function Build-Icon([int]$dim, [string]$outPath) {
    $bmp = New-Object System.Drawing.Bitmap($dim, $dim)
    $gfx = [System.Drawing.Graphics]::FromImage($bmp)
    $gfx.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $gfx.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gfx.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $gfx.Clear([System.Drawing.Color]::Transparent)

    # Rounded background
    $rect = New-Object System.Drawing.Rectangle(0, 0, $dim, $dim)
    $c1 = [System.Drawing.Color]::FromArgb(255, 30, 64, 175) # Dark Blue
    $c2 = [System.Drawing.Color]::FromArgb(255, 14, 165, 233) # Sky Blue
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, 45.0)

    $offset = [Math]::Max(1, [int]($dim * 0.05))
    $w = $dim - ($offset * 2)
    $gfx.FillEllipse($brush, $offset, $offset, $w, $w)

    # Draw Magnifying Glass Lens
    $penWidth = [Math]::Max(1.5, [float]($dim * 0.08))
    $lensPen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, $penWidth)
    $lensPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $lensPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

    $lensD = [float]($dim * 0.42)
    $lensX = [float]($dim * 0.22)
    $lensY = [float]($dim * 0.20)
    $gfx.DrawEllipse($lensPen, $lensX, $lensY, $lensD, $lensD)

    # Draw Handle
    $hPenWidth = [Math]::Max(2.0, [float]($dim * 0.11))
    $hPen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, $hPenWidth)
    $hPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $hPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

    $hx1 = [float]($lensX + ($lensD * 0.85))
    $hy1 = [float]($lensY + ($lensD * 0.85))
    $hx2 = [float]($dim * 0.80)
    $hy2 = [float]($dim * 0.80)
    $gfx.DrawLine($hPen, $hx1, $hy1, $hx2, $hy2)

    # Plus sign inside lens if dim >= 32
    if ($dim -ge 32) {
        $pWidth = [Math]::Max(1.5, [float]($dim * 0.06))
        $pPen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, $pWidth)
        $pPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
        $pPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

        $cx = [float]($lensX + ($lensD / 2.0))
        $cy = [float]($lensY + ($lensD / 2.0))
        $arm = [float]($lensD * 0.24)

        $gfx.DrawLine($pPen, ($cx - $arm), $cy, ($cx + $arm), $cy)
        $gfx.DrawLine($pPen, $cx, ($cy - $arm), $cx, ($cy + $arm))
        $pPen.Dispose()
    }

    $gfx.Dispose()
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $brush.Dispose()
    $lensPen.Dispose()
    $hPen.Dispose()
    Write-Output "Created: $outPath ($dim x $dim)"
}

Build-Icon 16 (Join-Path $destDir "icon-16.png")
Build-Icon 48 (Join-Path $destDir "icon-48.png")
Build-Icon 128 (Join-Path $destDir "icon-128.png")
