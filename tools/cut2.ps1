# Revision 1 clips: cropped İlave TV (logos removed), kill shots, AI/Hush + facecam talking clips.
$r   = Split-Path -Parent $PSScriptRoot
$out = "$r\reel\public\clips"
function Src($dir, $pat) { (Get-ChildItem "$r\sources\$dir\*$pat*.mp4" | Select-Object -First 1).FullName }
$IL = @{}
foreach ($k in @{1='20230412';2='20230419';3='20230422';4='20230424';5='20230430';6='20230506'}.GetEnumerator()) { $IL[$k.Key] = Src ilavetv $k.Value }
$WK = Src youtube MeKI5ITAfvE; $RZ = Src youtube RdRPaYRuIZc
$V6 = Src shorts V6CR-J2ND5s; $LJ = Src shorts lojv_RuLlMc
$VE = Src shorts VE2FDenutCQ; $ES = Src shorts es9Ttx-xF1E; $MV = Src shorts M_voiq9ddK4
$HR = Src hush GGClan_Hush_Reel; $MH = Src hush meet_hush

$H = "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30"
$V = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30"
# crop away the top city tag + İlave TV logo, keep 16:9
$ILC = "crop=iw*0.76:ih*0.76:iw*0.12:ih*0.20,$H"

$cuts = @(
  @('ilc6', $IL[6], 0.2, 3.0, $ILC, 1), @('ilc3', $IL[3], 0.5, 2.0, $ILC, 0), @('ilc2', $IL[2], 0.5, 2.0, $ILC, 0),
  @('ilc4', $IL[4], 0.5, 2.0, $ILC, 0), @('ilc1', $IL[1], 0.0, 2.0, $ILC, 0), @('ilc5', $IL[5], 0.5, 2.0, $ILC, 0),
  @('g_range2', $WK, 25.3, 2.3, $H, 0),
  @('k_v6a', $V6, 4.8, 1.9, $V, 0), @('k_v6b', $V6, 20.8, 1.9, $V, 0), @('k_lojv', $LJ, 10.8, 1.9, $V, 0), @('k_raze', $RZ, 1.8, 2.0, $V, 0),
  @('ai_meet', $MH, 0.0, 2.8, $V, 1), @('ai_hush', $HR, 0.0, 3.0, $V, 1), @('ai_blast', $HR, 18.4, 1.2, $V, 0),
  @('fc_ve', $VE, 0.0, 2.6, $V, 1), @('fc_es', $ES, 7.8, 2.4, $V, 1), @('fc_mv', $MV, 6.8, 2.0, $V, 1)
)
foreach ($c in $cuts) {
  [string[]]$aud = if ($c[5] -eq 1) { '-c:a','aac','-b:a','192k' } else { ,'-an' }
  ffmpeg -v error -y -ss $c[2] -i $c[1] -t $c[3] -vf $c[4] -c:v libx264 -crf 17 -preset fast -pix_fmt yuv420p @aud "$out\$($c[0]).mp4"
  "$($c[0]) ok"
}
"DONE"
