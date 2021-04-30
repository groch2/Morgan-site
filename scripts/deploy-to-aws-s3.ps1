aws s3 sync ".\dist" s3://morgan-site-test/ --include "*" --exclude "pictures-by-device-type/*" --delete --dryrun
Write-Host "Press Enter to confirm or any other key to abort :"
$keyCode = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown").VirtualKeyCode
if ($keyCode -eq 13) {
    aws s3 sync ".\dist" s3://morgan-site-test/ --include "*" --exclude "pictures-by-device-type/*" --delete
}
else {
    Write-Host "Abort"
}