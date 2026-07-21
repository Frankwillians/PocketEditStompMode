(function () {
  window.PEToneLab = window.PEToneLab || {};
  const api = window.PEToneLab;

  // Manual-based knowledge base for Sonicake Pocket Master Firmware V1.3.0.
  // It enriches the runtime effectLibrary with musical context, common rig translations
  // and module-specific usage rules for reference-tone generation.
  api.POCKET_MASTER_KB = {
    version: 'Pocket Master Firmware V1.3.0',
    constraints: {
      maxSimultaneousEffects: 9,
      modules: ['NR', 'FX1', 'DRV', 'AMP', 'IR', 'EQ', 'FX2', 'DLY', 'RVB'],
      chainRule: 'Always keep all 9 modules in signalChain exactly once. Disable unused blocks instead of removing them.',
      defaultChain: ['NR', 'FX1', 'DRV', 'AMP', 'IR', 'EQ', 'FX2', 'DLY', 'RVB'],
      practicalChains: [
        {
          name: 'Classic amp rig',
          chain: ['NR', 'FX1', 'DRV', 'AMP', 'IR', 'EQ', 'FX2', 'DLY', 'RVB'],
          use: 'Most guitar sounds. Compression/boost before drive, amp into cab, EQ and time effects later.'
        },
        {
          name: 'Tight high gain',
          chain: ['NR', 'DRV', 'FX1', 'AMP', 'IR', 'EQ', 'FX2', 'DLY', 'RVB'],
          use: 'Metal, djent, tight palm-muted riffs. Gate first, overdrive before amp, EQ after cab, delay/reverb mostly off or subtle.'
        },
        {
          name: 'Ambient clean',
          chain: ['NR', 'FX1', 'AMP', 'IR', 'EQ', 'FX2', 'DLY', 'RVB', 'DRV'],
          use: 'Clean/ambient/worship. Compression early, modulation and ambience after amp/cab. DRV disabled at the end.'
        },
        {
          name: 'Lead solo',
          chain: ['NR', 'FX1', 'DRV', 'AMP', 'IR', 'EQ', 'FX2', 'DLY', 'RVB'],
          use: 'Singing lead tone. Moderate gate, drive/amp sustain, mids up, delay and reverb on.'
        }
      ]
    },
    modules: {
      NR: [
        { name: 'Gate', basedOn: 'ISP Decimator-style noise gate', character: 'noise reduction, tightness', genres: ['high gain', 'metal', 'stage noise'], params: ['THRE'] }
      ],
      FX1_FX2: [
        { name: 'COMP 1', basedOn: 'Ross Compressor', character: 'classic compression, sustain', genres: ['funk', 'country', 'clean', 'single coil'] },
        { name: 'COMP 2', basedOn: 'Keeley C4 Compressor', character: 'studio-style compressor, attack control', genres: ['clean', 'lead sustain', 'pop'] },
        { name: 'Touch Wah', basedOn: 'Envelope filter / touch wah', character: 'dynamic wah controlled by picking', genres: ['funk', 'fusion', 'bass'] },
        { name: 'Auto Wah', basedOn: 'rate-based auto wah', character: 'cyclic wah movement', genres: ['funk', 'psychedelic', 'fusion'] },
        { name: 'Boost', basedOn: 'Xotic EP Booster-style boost', character: 'preamp boost, vintage/flat switch', genres: ['solo boost', 'classic rock', 'edge of breakup'] },
        { name: 'A-Chorus', basedOn: 'Arion SCH-1 Stereo Chorus', character: 'lush stereo chorus', genres: ['80s clean', 'worship', 'pop', 'forró'] },
        { name: 'B-Chorus', basedOn: 'bass ensemble chorus', character: 'vintage chorus, bass-friendly', genres: ['bass', 'clean', 'fusion'] },
        { name: 'Flanger', basedOn: 'classic flanger', character: 'sweeping jet modulation', genres: ['80s rock', 'Van Halen', 'classic rock'] },
        { name: 'Phaser', basedOn: 'MXR Phase 90', character: 'single-knob phase swirl', genres: ['Van Halen', 'funk', 'classic rock'] },
        { name: 'Vibe', basedOn: 'Voodoo Lab Micro Vibe', character: 'Uni-Vibe style pulse', genres: ['Hendrix', 'Gilmour', 'psychedelic'] },
        { name: 'Vibrato', basedOn: 'BBD vibrato', character: 'pitch movement without dry signal', genres: ['lofi', 'indie', 'ambient'] },
        { name: 'Tremolo', basedOn: 'Demeter Tremulator', character: 'classic opto tremolo', genres: ['surf', 'vintage', 'indie'] },
        { name: 'Sine Trem', basedOn: 'sine-wave tremolo', character: 'smooth volume modulation', genres: ['ambient', 'vintage'] },
        { name: 'Bias Trem', basedOn: 'bias tremolo', character: 'amp-like tremolo with bias character', genres: ['vintage amp', 'blues'] },
        { name: 'Octave', basedOn: 'polyphonic octave', character: 'octave up/down blend', genres: ['bass synth', 'modern', 'experimental'] },
        { name: 'Pitch', basedOn: 'polyphonic pitch shifter/harmonizer', character: 'semitone harmonies', genres: ['lead harmonies', 'ambient'] },
        { name: 'Detune', basedOn: 'micro pitch detune', character: 'chorus-like widening', genres: ['80s lead', 'stereo widening'] },
        { name: 'AC G', basedOn: 'acoustic guitar simulator', character: 'piezo/acoustic voicing', genres: ['acoustic simulation', 'live utility'] }
      ],
      DRV: [
        { name: 'Scream', basedOn: 'Ibanez TS-808 Tube Screamer', character: 'mid hump, tightening boost', genres: ['blues', 'metal boost', 'SRV', 'John Mayer'] },
        { name: 'Butter OD', basedOn: 'yellow 2-knob overdrive', character: 'simple warm overdrive', genres: ['blues', 'classic rock'] },
        { name: 'JP Dist', basedOn: 'classic orange distortion', character: 'distortion with tone', genres: ['rock', 'punk'] },
        { name: 'Shark', basedOn: 'MI Audio Crunch Box', character: 'British crunch distortion', genres: ['hard rock', 'classic rock'] },
        { name: 'Dark Mouse', basedOn: 'ProCo RAT LM308', character: 'grainy distortion/fuzz, filter control', genres: ['alt rock', 'grunge', 'indie'] },
        { name: 'Grey Fuzz', basedOn: 'Tone Bender MkII', character: 'vintage fuzz', genres: ['60s rock', 'Page-like fuzz'] },
        { name: 'Red Fuzz', basedOn: 'Dallas-Arbiter Fuzz Face', character: 'round vintage fuzz', genres: ['Hendrix', 'Gilmour'] }
      ],
      AMP: [
        { name: 'TWD Deluxe', basedOn: 'Fender Tweed Deluxe', character: 'small tweed breakup, warm mids', genres: ['blues', 'roots', 'classic rock'] },
        { name: 'B-Man N', basedOn: 'Fender 59 Bassman normal', character: 'tweed headroom, bass/mid/treble', genres: ['blues', 'rockabilly'] },
        { name: 'Dark Twin', basedOn: 'Fender 65 Twin Reverb', character: 'clean, bright, high headroom', genres: ['clean', 'funk', 'John Mayer', 'country'] },
        { name: 'Voks 30N', basedOn: 'VOX AC30 normal', character: 'chime, jangly clean/crunch', genres: ['brit pop', 'U2', 'worship'] },
        { name: 'Jazz 120', basedOn: 'Roland Jazz Chorus-style solid state', character: 'ultra clean, bright stereo platform', genres: ['jazz', 'clean', 'chorus clean'] },
        { name: 'Brit 45', basedOn: 'Marshall JTM45 normal', character: 'early Marshall, warm blues rock', genres: ['classic rock', 'blues rock'] },
        { name: 'Brit50 JP', basedOn: 'Marshall JTM50 jump', character: 'plexi jump-channel crunch', genres: ['classic rock', 'AC/DC-style crunch'] },
        { name: 'Brit 800', basedOn: 'Marshall JCM800', character: 'bright British crunch/high gain', genres: ['Slash', 'Guns N Roses', '80s hard rock', 'Iron Maiden'] },
        { name: 'B-Man B', basedOn: 'Fender 59 Bassman bright', character: 'brighter Bassman', genres: ['blues', 'vintage rock'] },
        { name: 'Voks 30TB', basedOn: 'VOX AC30 top boost', character: 'sparkly top boost chime', genres: ['Queen', 'U2', 'indie'] },
        { name: 'Sol100OD', basedOn: 'Soldano SLO100 crunch channel', character: 'smooth hot-rodded lead crunch', genres: ['hard rock', 'lead'] },
        { name: 'DizzyVH', basedOn: 'Diezel VH4 channel 3', character: 'tight modern high gain', genres: ['Tool-style', 'modern metal'] },
        { name: 'Eng120', basedOn: 'ENGL Savage 120', character: 'precise aggressive high gain', genres: ['metal', 'power metal'] },
        { name: 'Halen51', basedOn: 'Peavey 5150 lead', character: 'saturated high gain, aggressive mids', genres: ['Van Halen', 'metalcore', 'modern metal'] },
        { name: 'Sol100LD', basedOn: 'Soldano SLO100 overdrive', character: 'singing lead gain', genres: ['lead solo', 'hard rock'] },
        { name: 'CalifDualV', basedOn: 'Mesa/Boogie Dual Rectifier vintage', character: 'thick Rectifier vintage mode', genres: ['nu metal', '90s metal'] },
        { name: 'CalifDualM', basedOn: 'Mesa/Boogie Dual Rectifier modern', character: 'tight modern Rectifier high gain', genres: ['Metallica', 'Dream Theater', 'metal'] },
        { name: 'EngPower', basedOn: 'ENGL Powerball II channel 4', character: 'compressed modern metal gain', genres: ['modern metal', 'djent'] },
        { name: 'FlymanB1+', basedOn: 'Brown Eye HBE boutique UK amp', character: 'hot-rodded British brown sound', genres: ['Van Halen', 'hard rock'] },
        { name: 'BogXT', basedOn: 'Bogner XTC red channel', character: 'fiery high-gain boutique lead', genres: ['lead', 'modern rock'] }
      ],
      IR: [
        { name: 'TWD 1x8', basedOn: 'Fender Champ 1x8', character: 'small vintage cab' },
        { name: 'TWD-P 1x10', basedOn: 'Fender Princeton 1x10', character: 'small American clean cab' },
        { name: 'Viblux 1x12', basedOn: 'Fender Vibrolux 1x12', character: 'American combo cab' },
        { name: 'Voks 1x12', basedOn: 'VOX AC15 1x12', character: 'British chime small cab' },
        { name: 'TWD 2x12', basedOn: 'custom Fender Tweed 2x10', character: 'tweed combo cab' },
        { name: 'Double 2x12', basedOn: 'Fender Twin Reverb 2x12', character: 'clean American 2x12' },
        { name: 'Star 2x12', basedOn: 'Mesa Lonestar 1x12', character: 'smooth American cab' },
        { name: 'Jazz 2x12', basedOn: 'Jazz Chorus 2x12', character: 'clean solid-state cab' },
        { name: 'BritGN 2x12', basedOn: 'Marshall 2550 2x12', character: 'British Greenback 2x12' },
        { name: 'BritGN 4x12', basedOn: 'Marshall 4x12 Greenback', character: 'classic British rock cab', genres: ['Slash', 'AC/DC', 'classic rock'] },
        { name: 'Bog 4x12', basedOn: 'Bogner 4x12', character: 'boutique rock cab' },
        { name: 'Dizzy 4x12', basedOn: 'Diezel 4x12', character: 'tight modern metal cab' },
        { name: 'Halen 4x12', basedOn: 'Peavey 6505 4x12', character: 'aggressive metal cab' },
        { name: 'Sol 4x12', basedOn: 'Soldano 4x12', character: 'smooth lead cab' },
        { name: 'Dual 4x12', basedOn: 'Mesa Rectifier 4x12', character: 'modern heavy 4x12', genres: ['Metallica', 'Mesa', 'modern metal'] },
        { name: 'User IR 1~5', basedOn: 'user-loaded IR slots', character: 'custom IR if user loaded one' }
      ],
      EQ: [
        { name: 'GT EQ 1', bands: ['125Hz', '400Hz', '800Hz', '1.6kHz', '4kHz'], character: 'guitar 5-band EQ, broad musical bands' },
        { name: 'GT EQ 2', bands: ['100Hz', '500Hz', '1kHz', '3kHz', '6kHz'], character: 'guitar 5-band EQ, precise low/mid/high shaping' },
        { name: 'Bass EQ', bands: ['50Hz', '120Hz', '400Hz', '800Hz', '4.5kHz'], character: 'bass 5-band EQ' }
      ],
      DLY: [
        { name: 'Pure', character: 'clean precise digital delay' },
        { name: 'Slap', character: 'classic slapback echo' },
        { name: 'Warm', character: 'warm analog-style delay' },
        { name: 'Mag', character: 'solid-state tape echo' },
        { name: 'Tube', character: 'tube-driven tape echo' },
        { name: 'Reverse', character: 'reverse delay feedback' },
        { name: 'Analog', character: 'vintage 1980s rack delay, slightly reduced feedback' },
        { name: 'Sweep', character: 'sweeping filter-modulated repeats' },
        { name: 'Ping Pong', character: 'stereo ping-pong delay' }
      ],
      RVB: [
        { name: 'Air', character: 'airy natural decay' },
        { name: 'Room', character: 'room ambience' },
        { name: 'Hall', character: 'performance hall' },
        { name: 'Church', character: 'large church space' },
        { name: 'Plate 1', character: 'large plate reverb' },
        { name: 'Plate 2', character: 'vintage plate reverb with damp' },
        { name: 'Spring', character: 'vintage spring reverb' },
        { name: 'Light', character: 'lush bright special reverb' },
        { name: 'Ocean', character: 'huge deep special reverb' },
        { name: 'Dream', character: 'lush sweet modulated reverb' }
      ]
    },
    referenceTranslations: [
      {
        match: ['sweet child', 'slash', 'guns n roses', 'appetite'],
        rig: 'Slash-style Les Paul humbucker into Marshall JCM800/plexi-style amp, 4x12 Greenback/Celestion cab, medium gain, boosted mids, light delay/reverb for solo.',
        pocket: { ampKeys: ['brit 800', 'brit', '800'], drvKeys: ['boost', 'drive', 'scream'], irKeys: ['britgn 4x12', 'greenback', '4x12'], rvbKeys: ['plate', 'room'], dlyKeys: ['pure', 'warm'] }
      },
      {
        match: ['metallica', 'black album', 'enter sandman', 'master of puppets'],
        rig: 'Mesa/Boogie Rectifier/Mark-like heavy rhythm with tight gate, Tube Screamer-style boost, scooped-but-present mids, Mesa 4x12 cab, minimal ambience.',
        pocket: { ampKeys: ['califdualm', 'califdual', 'rect', 'dual'], drvKeys: ['scream'], irKeys: ['dual 4x12', 'mesa', '4x12'], rvbKeys: ['room'], dlyKeys: ['pure'] }
      },
      {
        match: ['john mayer', 'slow dancing', 'mayer'],
        rig: 'Strat single coil into Fender/Two-Rock clean or edge-of-breakup amp, Tube Screamer optional, spring/room reverb, warm mids, smooth highs.',
        pocket: { ampKeys: ['dark twin', 'twin', 'deluxe', 'b-man'], drvKeys: ['scream', 'butter'], irKeys: ['double 2x12', 'twd', 'viblux'], rvbKeys: ['spring', 'room'] }
      },
      {
        match: ['gilmour', 'pink floyd', 'comfortably numb'],
        rig: 'David Gilmour-style clean amp platform, fuzz/drive sustain, delay with repeats, modulation/vibe/chorus, spacious plate/hall reverb.',
        pocket: { ampKeys: ['brit', 'clean', 'dark twin'], drvKeys: ['red fuzz', 'grey fuzz', 'dark mouse'], fx2Keys: ['vibe', 'chorus', 'phaser'], dlyKeys: ['digital', 'pure', 'tape'], rvbKeys: ['hall', 'plate'] }
      },
      {
        match: ['van halen', 'brown sound', 'eruption'],
        rig: 'Hot-rodded Marshall brown sound, phaser/flanger as needed, 4x12 cab, bright aggressive lead with controlled reverb.',
        pocket: { ampKeys: ['flyman', 'halen51', 'brit', 'brown'], drvKeys: ['boost'], fx2Keys: ['phaser', 'flanger'], irKeys: ['halen 4x12', 'britgn 4x12'], rvbKeys: ['plate', 'room'] }
      },
      {
        match: ['forró', 'chimbinha', 'calypso'],
        rig: 'Brazilian forró/guitarrada tone: bright clean/crunch, chorus, compression, articulate pick attack, slap/short delay and modest reverb.',
        pocket: { ampKeys: ['voks', 'dark twin', 'jazz'], fx1Keys: ['comp'], fx2Keys: ['a-chorus', 'chorus'], dlyKeys: ['slap', 'pure'], rvbKeys: ['room', 'plate'] }
      }
    ]
  };

  api.manualKnowledgeForPrompt = function manualKnowledgeForPrompt() {
    const kb = api.POCKET_MASTER_KB;
    return JSON.stringify({
      constraints: kb.constraints,
      modules: kb.modules,
      referenceTranslations: kb.referenceTranslations,
    });
  };

  api.findReferenceTranslation = function findReferenceTranslation(text) {
    const value = String(text || '').toLowerCase();
    return api.POCKET_MASTER_KB.referenceTranslations.find((item) =>
      item.match.some((m) => value.includes(m))
    ) || null;
  };
})();
