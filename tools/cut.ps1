# Cuts every source moment the showreel uses into reel\public\clips (30 fps, H.264).
$r   = Split-Path -Parent $PSScriptRoot
$out = "$r\reel\public\clips"
New-Item -ItemType Directory -Force $out | Out-Null
function Src($dir, $pat) { (Get-ChildItem "$r\sources\$dir\*$pat*.mp4" | Select-Object -First 1).FullName }

$IL1 = Src ilavetv 20230412; $IL2 = Src ilavetv 20230419; $IL3 = Src ilavetv 20230422
$IL4 = Src ilavetv 20230424; $IL5 = Src ilavetv 20230430; $IL6 = Src ilavetv 20230506
$GK  = Src events qGqbDSX_Ryw; $DA = Src events Cr9-H-wnSZg
$WK  = Src youtube MeKI5ITAfvE; $DN = Src youtube nSQ5gfJGbXY
$GG5 = Src ggclan 7523648308779158802; $GG4 = Src ggclan 7520304644715744519; $GG7 = Src ggclan 7570833721444551957

# name, source, start, duration, mode (h = 16:9, v = 9:16), audio
$cuts = @(
  @('open_cam',  $IL6, 1.0, 0.8, 'h', 0), @('open_game', $WK, 30.0, 0.8, 'h', 0), @('open_brand', $GG7, 16.5, 0.8, 'h', 0),
  @('il6', $IL6, 0.2, 3.0, 'h', 1), @('il2', $IL2, 0.5, 2.0, 'h', 1), @('il3', $IL3, 0.5, 2.0, 'h', 1),
  @('il4', $IL4, 0.5, 2.0, 'h', 1), @('il1', $IL1, 0.0, 2.0, 'h', 1), @('il5', $IL5, 0.5, 2.0, 'h', 1),
  @('ev_stage', $GK, 0.0, 1.15, 'h', 0), @('ev_award', $GK, 7.3, 1.2, 'h', 0), @('ev_fire', $GK, 10.0, 1.2, 'h', 0),
  @('ev_trophy', $GK, 13.9, 1.1, 'h', 0), @('ev_net', $GK, 15.12, 0.55, 'h', 0), @('ev_crowd', $GK, 19.6, 1.2, 'h', 0),
  @('da_hall', $DA, 8.6, 1.2, 'h', 0), @('da_banner', $DA, 24.18, 0.75, 'h', 0),
  @('g_face', $WK, 16.4, 1.2, 'h', 0), @('g_range', $WK, 25.3, 1.7, 'h', 0), @('g_whip', $WK, 30.0, 1.2, 'h', 0),
  @('g_won', $DN, 14.1, 1.2, 'h', 0), @('g_play', $DN, 10.2, 1.2, 'h', 0), @('g_play2', $WK, 36.0, 1.7, 'h', 0),
  @('g_car', $WK, 10.5, 1.2, 'h', 0),
  @('gg_a', $GG5, 11.9, 5.4, 'v', 0), @('gg_b', $GG4, 17.7, 5.4, 'v', 0), @('gg_c', $GG7, 16.5, 5.4, 'v', 0)
)
foreach ($c in $cuts) {
  $vf = if ($c[4] -eq 'v') { "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30" } else { "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30" }
  [string[]]$aud = if ($c[5] -eq 1) { '-c:a','aac','-b:a','192k' } else { ,'-an' }
  ffmpeg -v error -y -ss $c[2] -i $c[1] -t $c[3] -vf $vf -c:v libx264 -crf 17 -preset fast -pix_fmt yuv420p @aud "$out\$($c[0]).mp4"
  "$($c[0]) ok"
}
# thumbnails for the 3D grids
$th = "$r\reel\public\thumbs"; New-Item -ItemType Directory -Force "$th\gg","$th\om" | Out-Null
Get-ChildItem "$r\sources\ggclan\thumbs\*.jpg" | ForEach-Object { ffmpeg -v error -y -i $_.FullName -vf "scale=540:-2" -q:v 3 "$th\gg\$($_.Name)" }
Get-ChildItem "$r\sources\omchain\*.jpg" | ForEach-Object { ffmpeg -v error -y -i $_.FullName -vf "scale=540:-2" -q:v 3 "$th\om\$($_.Name)" }
"DONE"
