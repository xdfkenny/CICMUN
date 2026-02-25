$root = Join-Path (Get-Location) "public\gallery"
if (-not (Test-Path $root)) { Write-Error "Gallery path not found: $root"; exit 1 }
$count = 0
Get-ChildItem -Path $root -Directory | Where-Object { $_.Name -ne '__thumbs' } | ForEach-Object {
    $folder = $_.Name
    $i = 1
    Get-ChildItem -Path $_.FullName -File | Sort-Object Name | ForEach-Object {
        $ext = $_.Extension
        $newname = "$folder $('{0:D3}' -f $i)$ext"
        $newpath = Join-Path $_.DirectoryName $newname
        if (-not (Test-Path $newpath)) {
            Rename-Item -LiteralPath $_.FullName -NewName $newname
        } else {
            $j = $i
            while (Test-Path (Join-Path $_.DirectoryName "$folder $('{0:D3}' -f $j)$ext")) { $j++ }
            Rename-Item -LiteralPath $_.FullName -NewName "$folder $('{0:D3}' -f $j)$ext"
        }
        $i++
        $count++
    }
}
Write-Output "Files renamed: $count"
