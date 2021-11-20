$stAgentSvc = Get-Process -Name "stAgentSvc"
Stop-Process -InputObject $stAgentSvc -Force
Write-Host $stAgentSvc.Name "has exited:" $stAgentSvc.HasExited