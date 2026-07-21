(function () {
  window.PEToneLab = window.PEToneLab || {};
  const api = window.PEToneLab;

  api.audioReference = null;

  function avg(values, start, end) {
    let sum = 0, count = 0;
    for (let i = start; i < end && i < values.length; i++) { sum += values[i]; count++; }
    return count ? sum / count : 0;
  }

  function db(value) {
    return 20 * Math.log10(Math.max(1e-8, value));
  }

  api.analyzeReferenceAudio = async function analyzeReferenceAudio(file) {
    if (!file) return null;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const buffer = await file.arrayBuffer();
    const audio = await ctx.decodeAudioData(buffer.slice(0));
    const channel = audio.getChannelData(0);
    const length = channel.length;
    const sampleRate = audio.sampleRate;

    let sumSq = 0, peak = 0, zeroCrossings = 0;
    const step = Math.max(1, Math.floor(length / 240000));
    for (let i = 0; i < length; i += step) {
      const v = channel[i];
      sumSq += v * v;
      peak = Math.max(peak, Math.abs(v));
      if (i > 0 && Math.sign(v) !== Math.sign(channel[Math.max(0, i - step)])) zeroCrossings++;
    }
    const sampled = Math.ceil(length / step);
    const rms = Math.sqrt(sumSq / Math.max(1, sampled));
    const crest = peak / Math.max(1e-6, rms);

    const fftSize = 4096;
    const offline = new OfflineAudioContext(1, fftSize, sampleRate);
    const source = offline.createBufferSource();
    const shortBuffer = offline.createBuffer(1, fftSize, sampleRate);
    const start = Math.max(0, Math.floor(length * 0.35));
    const data = shortBuffer.getChannelData(0);
    for (let i = 0; i < fftSize; i++) data[i] = channel[Math.min(length - 1, start + i)] || 0;
    const analyser = offline.createAnalyser();
    analyser.fftSize = fftSize;
    source.buffer = shortBuffer;
    source.connect(analyser);
    analyser.connect(offline.destination);
    source.start();
    await offline.startRendering();

    const bins = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(bins);
    const nyquist = sampleRate / 2;
    const hzPerBin = nyquist / bins.length;
    let weighted = 0, weight = 0;
    const mags = Array.from(bins).map((x) => Math.pow(10, x / 20));
    mags.forEach((m, i) => { weighted += m * i * hzPerBin; weight += m; });
    const centroid = weight ? weighted / weight : 0;
    const low = avg(mags, Math.floor(80 / hzPerBin), Math.floor(250 / hzPerBin));
    const lowMid = avg(mags, Math.floor(250 / hzPerBin), Math.floor(800 / hzPerBin));
    const mid = avg(mags, Math.floor(800 / hzPerBin), Math.floor(2000 / hzPerBin));
    const high = avg(mags, Math.floor(2500 / hzPerBin), Math.floor(6500 / hzPerBin));

    const analysis = {
      fileName: file.name,
      durationSec: Math.round(audio.duration * 10) / 10,
      rmsDb: Math.round(db(rms) * 10) / 10,
      peakDb: Math.round(db(peak) * 10) / 10,
      crestFactor: Math.round(crest * 10) / 10,
      spectralCentroidHz: Math.round(centroid),
      zeroCrossingRate: Math.round((zeroCrossings / Math.max(1, sampled)) * 10000) / 100,
      tonalBalance: {
        low: Math.round(low * 100000),
        lowMid: Math.round(lowMid * 100000),
        mid: Math.round(mid * 100000),
        high: Math.round(high * 100000),
      },
      interpretation: []
    };

    if (analysis.spectralCentroidHz > 2800 || high > mid * 1.15) analysis.interpretation.push('bright/present top end');
    if (low > mid * 1.15) analysis.interpretation.push('strong low end');
    if (mid > low * 1.1 && mid > high * 0.9) analysis.interpretation.push('forward mids');
    if (crest < 4) analysis.interpretation.push('compressed/sustained tone');
    if (crest > 8) analysis.interpretation.push('dynamic/cleaner attack');
    if (analysis.zeroCrossingRate > 7) analysis.interpretation.push('likely distorted/high harmonic content');

    api.audioReference = analysis;
    try { await ctx.close(); } catch (e) {}
    return analysis;
  };

  api.audioReferencePrompt = function audioReferencePrompt() {
    if (!api.audioReference) return '';
    return `\n\nAnálise local do áudio de referência enviado pelo usuário:\n${JSON.stringify(api.audioReference, null, 2)}\nUse essa análise para ajustar ganho, EQ, compressão, brilho, delay/reverb e presença. A análise local não identifica artista; use-a apenas como guia sonoro.`;
  };
})();
