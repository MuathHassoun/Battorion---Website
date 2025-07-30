$repo = "MuathHassoun/battorion-version"
$apiUrl = "https://api.github.com/repos/$repo/tags"
$headers = @{ "User-Agent" = "PowerShellScript" }

try {
    $tags = Invoke-RestMethod -Uri $apiUrl -Headers $headers
    foreach ($tag in $tags) {
        Write-Host $tag.name
    }
} catch {
    Write-Error "Failed to fetch tags: $_"
}
