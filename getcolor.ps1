Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap("c:\Users\Utente\Desktop\Zinho Style Website KM Tourism\kmtoursimlogo.png")
$p = $bmp.GetPixel(0,0)
Write-Host "R: $($p.R) G: $($p.G) B: $($p.B) A: $($p.A)"
