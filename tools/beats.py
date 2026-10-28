"""Rough tempo + energy map of the song, used to place cuts on the beat."""
import subprocess, sys
import numpy as np

src = sys.argv[1]
sr = 11025
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-ac", "1", "-ar", str(sr), "-f", "s16le", "-"], capture_output=True).stdout
x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
hop = 256
n = len(x) // hop
frames = x[: n * hop].reshape(n, hop)
energy = np.sqrt((frames ** 2).mean(axis=1))
# onset strength = positive change in log energy
le = np.log(energy + 1e-6)
onset = np.maximum(0, np.diff(le, prepend=le[0]))
onset -= onset.mean()
fps = sr / hop
# tempo via autocorrelation in 70..180 bpm
ac = np.correlate(onset, onset, mode="full")[len(onset) - 1 :]
lags = np.arange(len(ac))
bpm = 60 * fps / np.maximum(lags, 1)
mask = (bpm > 70) & (bpm < 180)
best = lags[mask][np.argmax(ac[mask])]
tempo = 60 * fps / best
period = best
# beat phase: offset that maximises onset sum on the grid
phases = [onset[p::period].sum() for p in range(period)]
phase = int(np.argmax(phases))
print(f"duration {len(x)/sr:.2f}s  tempo {tempo:.1f} bpm  first beat {phase/fps:.3f}s")
# energy per second
sec = int(len(x) / sr)
rms = [float(np.sqrt((x[i*sr:(i+1)*sr] ** 2).mean())) for i in range(sec)]
peak = max(rms)
print("energy per second (0-9):")
print(" ".join(f"{i}:{int(9*r/peak)}" for i, r in enumerate(rms)))
