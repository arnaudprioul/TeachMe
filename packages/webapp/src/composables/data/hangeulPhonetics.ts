export interface IPhoneticInfo {
  soundsLike: string
  mouthDescription: string
  tip: string
}

export const HANGEUL_PHONETICS: Record<string, Record<string, IPhoneticInfo>> = {
  // ─── Basic Consonants ───────────────────────────────────────────

  giyeok: {
    en: {
      soundsLike: "Like 'g' in 'go' (beginning) or 'k' in 'back' (end)",
      mouthDescription: 'Back of tongue rises to touch the soft palate, then releases with a light burst of air.',
      tip: "Looks like a gun — 'g' is for gun.",
    },
    fr: {
      soundsLike: "Comme le « g » de « gare » (début) ou le « k » de « bec » (fin)",
      mouthDescription: "L'arrière de la langue monte pour toucher le voile du palais, puis relâche avec un léger souffle.",
      tip: "Ressemble à un pistolet — « g » comme « gun » en anglais.",
    },
  },

  nieun: {
    en: {
      soundsLike: "Like 'n' in 'now'",
      mouthDescription: 'Tongue tip presses against the gum ridge behind the upper front teeth. Air flows through the nose.',
      tip: "Looks like the top-left corner of a square — the tongue is pressing 'up' just like the shape.",
    },
    fr: {
      soundsLike: "Comme le « n » de « nez »",
      mouthDescription: "La pointe de la langue appuie contre les alvéoles derrière les incisives supérieures. L'air passe par le nez.",
      tip: "Ressemble au coin supérieur gauche d'un carré — la langue pousse vers le haut, comme la forme.",
    },
  },

  digeut: {
    en: {
      soundsLike: "Like 'd' in 'do' (beginning) or 't' in 'mat' (end)",
      mouthDescription: 'Tongue tip touches the gum ridge behind the upper teeth, then releases.',
      tip: "Looks like a doorway — 'd' is for door.",
    },
    fr: {
      soundsLike: "Comme le « d » de « dos » (début) ou le « t » de « mat » (fin)",
      mouthDescription: 'La pointe de la langue touche les alvéoles derrière les dents supérieures, puis relâche.',
      tip: "Ressemble à une porte — « d » comme « door » en anglais.",
    },
  },

  rieul: {
    en: {
      soundsLike: "Between 'r' and 'l' — like a light tap of the tongue, similar to the 't' in American 'butter'",
      mouthDescription: 'Tongue tip lightly taps the gum ridge once — a flap, not a trill or lateral.',
      tip: "Looks like a winding river — a wavy 'r/l' sound.",
    },
    fr: {
      soundsLike: "Entre le « r » et le « l » — un battement léger de la langue, comme le « r » simple de l'espagnol « pero »",
      mouthDescription: "La pointe de la langue frappe brièvement les alvéoles — un battement, ni roulé ni latéral.",
      tip: "Ressemble à une rivière sinueuse — un son entre « r » et « l ».",
    },
  },

  mieum: {
    en: {
      soundsLike: "Like 'm' in 'mom'",
      mouthDescription: 'Both lips press together and air flows through the nose.',
      tip: "Looks like a square gate — picture a mouth closed shut, saying 'mmm'.",
    },
    fr: {
      soundsLike: "Comme le « m » de « maman »",
      mouthDescription: "Les deux lèvres se pressent l'une contre l'autre et l'air passe par le nez.",
      tip: "Ressemble à un portail carré — imaginez une bouche fermée qui fait « mmm ».",
    },
  },

  bieup: {
    en: {
      soundsLike: "Like 'b' in 'bed' (beginning) or 'p' in 'cap' (end)",
      mouthDescription: 'Both lips press together, then release with a light puff of air.',
      tip: "Looks like a bucket — 'b' is for bucket.",
    },
    fr: {
      soundsLike: "Comme le « b » de « beau » (début) ou le « p » de « cap » (fin)",
      mouthDescription: "Les deux lèvres se pressent ensemble puis relâchent avec un léger souffle d'air.",
      tip: "Ressemble à un seau — « b » comme « bucket » en anglais.",
    },
  },

  siot: {
    en: {
      soundsLike: "Like 's' in 'see'",
      mouthDescription: 'Tongue tip approaches the gum ridge, creating a narrow gap for air to hiss through.',
      tip: "Looks like a tree — the wind 'sss' blowing through the branches.",
    },
    fr: {
      soundsLike: "Comme le « s » de « soleil »",
      mouthDescription: "La pointe de la langue s'approche des alvéoles, créant un passage étroit où l'air siffle.",
      tip: "Ressemble à un arbre — le vent « sss » qui souffle dans les branches.",
    },
  },

  ieung: {
    en: {
      soundsLike: "Silent at the start of a syllable; like 'ng' in 'sing' at the end",
      mouthDescription: "As initial: no consonant sound, just a placeholder. As final: back of tongue touches the soft palate while air flows through the nose.",
      tip: "Looks like a circle — zero sound at the beginning, a ring of 'ng' at the end.",
    },
    fr: {
      soundsLike: "Muet en début de syllabe ; comme le « ng » de l'anglais « sing » en fin de syllabe",
      mouthDescription: "En initiale : aucun son consonantique, simple support. En finale : l'arrière de la langue touche le voile du palais tandis que l'air passe par le nez.",
      tip: "Ressemble à un cercle — zéro son au début, un anneau de « ng » à la fin.",
    },
  },

  jieut: {
    en: {
      soundsLike: "Like 'j' in 'judge' (beginning) or 't' in 'hat' (end)",
      mouthDescription: 'Tongue blade presses against the hard palate, then releases with a brief friction.',
      tip: "Looks like a hat on a person — 'j' for jaunty hat.",
    },
    fr: {
      soundsLike: "Comme le « dj » de « jean » (début) ou le « t » de « chat » (fin)",
      mouthDescription: 'La lame de la langue appuie contre le palais dur, puis relâche avec une brève friction.',
      tip: "Ressemble à un chapeau sur une personne — « j » pour « joli chapeau ».",
    },
  },

  chieut: {
    en: {
      soundsLike: "Like 'ch' in 'church' — aspirated (strong puff of air)",
      mouthDescription: 'Same position as ㅈ (tongue blade on hard palate), but released with a strong burst of air.',
      tip: "Looks like ㅈ with a hat — the extra line is the extra puff of air.",
    },
    fr: {
      soundsLike: "Comme le « tch » de « tchin » — aspiré (fort souffle d'air)",
      mouthDescription: "Même position que ㅈ (lame de la langue contre le palais dur), mais relâché avec un fort souffle d'air.",
      tip: "Ressemble à ㅈ avec un chapeau — le trait supplémentaire représente le souffle supplémentaire.",
    },
  },

  kieuk: {
    en: {
      soundsLike: "Like 'k' in 'kite' — aspirated (strong puff of air)",
      mouthDescription: 'Back of tongue touches the soft palate, same as ㄱ, but released with a strong burst of air.',
      tip: "Looks like ㄱ with an extra stroke — the extra stroke is the extra air.",
    },
    fr: {
      soundsLike: "Comme le « k » de « kaki » — aspiré (fort souffle d'air)",
      mouthDescription: "L'arrière de la langue touche le voile du palais, comme ㄱ, mais relâché avec un fort souffle d'air.",
      tip: "Ressemble à ㄱ avec un trait supplémentaire — le trait en plus symbolise le souffle en plus.",
    },
  },

  tieut: {
    en: {
      soundsLike: "Like 't' in 'top' — aspirated (strong puff of air)",
      mouthDescription: 'Tongue tip on the gum ridge, same as ㄷ, but released with a strong burst of air.',
      tip: "Looks like ㄷ with an extra line on top — more air, more force.",
    },
    fr: {
      soundsLike: "Comme le « t » de « table » — aspiré (fort souffle d'air)",
      mouthDescription: "La pointe de la langue sur les alvéoles, comme ㄷ, mais relâché avec un fort souffle d'air.",
      tip: "Ressemble à ㄷ avec un trait supplémentaire au-dessus — plus d'air, plus de force.",
    },
  },

  pieup: {
    en: {
      soundsLike: "Like 'p' in 'pie' — aspirated (strong puff of air)",
      mouthDescription: 'Both lips press together, same as ㅂ, but released with a strong burst of air.',
      tip: "Looks like ㅂ with extra strokes — the extras mean extra breath.",
    },
    fr: {
      soundsLike: "Comme le « p » de « papa » — aspiré (fort souffle d'air)",
      mouthDescription: "Les deux lèvres pressées ensemble, comme ㅂ, mais relâché avec un fort souffle d'air.",
      tip: "Ressemble à ㅂ avec des traits supplémentaires — les extras signifient un souffle supplémentaire.",
    },
  },

  hieut: {
    en: {
      soundsLike: "Like 'h' in 'hat'",
      mouthDescription: 'Air flows freely from the throat through a slightly constricted glottis. No specific tongue contact.',
      tip: "Looks like a person wearing a hat — 'h' for hat.",
    },
    fr: {
      soundsLike: "Comme le « h » aspiré de l'anglais « hat » — un souffle audible de la gorge",
      mouthDescription: "L'air s'écoule librement depuis la gorge à travers une glotte légèrement resserrée. Pas de contact de la langue.",
      tip: "Ressemble à une personne portant un chapeau — « h » pour « hat ».",
    },
  },

  // ─── Double (Tense) Consonants ──────────────────────────────────

  'ssang-giyeok': {
    en: {
      soundsLike: "Like a tense 'k' — similar to the 'g' in 'sky' but with tighter throat muscles and no puff of air",
      mouthDescription: 'Same position as ㄱ (back of tongue on soft palate), but the throat muscles are tensed. No aspiration.',
      tip: "Double ㄱ = double tension. Think of the hard 'k' sound you make when startled.",
    },
    fr: {
      soundsLike: "Comme un « k » tendu — similaire au « g » de « gare » mais avec les muscles de la gorge contractés et sans souffle d'air",
      mouthDescription: "Même position que ㄱ (arrière de la langue sur le voile du palais), mais les muscles de la gorge sont tendus. Pas d'aspiration.",
      tip: "Double ㄱ = double tension. Pensez au « k » dur que vous faites quand vous êtes surpris.",
    },
  },

  'ssang-digeut': {
    en: {
      soundsLike: "Like a tense 't' — similar to the 't' in 'stop' but with tighter throat muscles and no puff of air",
      mouthDescription: 'Same position as ㄷ (tongue tip on gum ridge), but the throat muscles are tensed. No aspiration.',
      tip: "Double ㄷ = double tension. A sharp, clipped 't' with no air escaping.",
    },
    fr: {
      soundsLike: "Comme un « t » tendu — similaire au « t » de « stop » mais avec les muscles de la gorge contractés et sans souffle d'air",
      mouthDescription: "Même position que ㄷ (pointe de la langue sur les alvéoles), mais les muscles de la gorge sont tendus. Pas d'aspiration.",
      tip: "Double ㄷ = double tension. Un « t » bref et sec, sans air qui s'échappe.",
    },
  },

  'ssang-bieup': {
    en: {
      soundsLike: "Like a tense 'p' — similar to the 'p' in 'spin' but with tighter throat muscles and no puff of air",
      mouthDescription: 'Same position as ㅂ (both lips pressed together), but the throat muscles are tensed. No aspiration.',
      tip: "Double ㅂ = double tension. Press lips tight and pop without any breath.",
    },
    fr: {
      soundsLike: "Comme un « p » tendu — similaire au « p » de « sport » mais avec les muscles de la gorge contractés et sans souffle d'air",
      mouthDescription: "Même position que ㅂ (les deux lèvres pressées ensemble), mais les muscles de la gorge sont tendus. Pas d'aspiration.",
      tip: "Double ㅂ = double tension. Pressez les lèvres fermement et relâchez sans aucun souffle.",
    },
  },

  'ssang-siot': {
    en: {
      soundsLike: "Like a tense 'ss' — similar to the 's' in 'see' but sharper and more forceful",
      mouthDescription: 'Same position as ㅅ (tongue tip near gum ridge), but with tighter muscles producing a sharper, more intense hiss.',
      tip: "Double ㅅ = a hissing snake with extra intensity. Clench your teeth slightly more.",
    },
    fr: {
      soundsLike: "Comme un « ss » tendu — similaire au « s » de « soleil » mais plus aigu et plus intense",
      mouthDescription: "Même position que ㅅ (pointe de la langue près des alvéoles), mais avec des muscles plus tendus produisant un sifflement plus aigu et intense.",
      tip: "Double ㅅ = un serpent qui siffle avec plus d'intensité. Serrez légèrement plus les dents.",
    },
  },

  'ssang-jieut': {
    en: {
      soundsLike: "Like a tense 'j' — similar to the 'j' in 'judge' but with tighter throat muscles and no puff of air",
      mouthDescription: 'Same position as ㅈ (tongue blade on hard palate), but the throat muscles are tensed. No aspiration.',
      tip: "Double ㅈ = double tension. A sharp, clipped 'j' sound.",
    },
    fr: {
      soundsLike: "Comme un « dj » tendu — similaire au « dj » de « jean » mais avec les muscles de la gorge contractés et sans souffle d'air",
      mouthDescription: "Même position que ㅈ (lame de la langue sur le palais dur), mais les muscles de la gorge sont tendus. Pas d'aspiration.",
      tip: "Double ㅈ = double tension. Un son « dj » bref et sec.",
    },
  },

  // ─── Basic Vowels ───────────────────────────────────────────────

  a: {
    en: {
      soundsLike: "Like the 'a' in 'father'",
      mouthDescription: 'Mouth open wide, tongue low and slightly back. Unrounded lips.',
      tip: "The vertical line with a stroke to the right — mouth open wide, say 'ahhh'.",
    },
    fr: {
      soundsLike: "Comme le « a » de « patte »",
      mouthDescription: 'Bouche grande ouverte, langue basse et légèrement en arrière. Lèvres non arrondies.',
      tip: "La ligne verticale avec un trait à droite — bouche grande ouverte, dites « ahhh ».",
    },
  },

  ya: {
    en: {
      soundsLike: "Like 'ya' in 'yacht'",
      mouthDescription: "Starts with tongue high and front (like 'ee'), then quickly opens to the 'a' position.",
      tip: "Same as ㅏ but with two horizontal strokes — the extra stroke adds a 'y' glide.",
    },
    fr: {
      soundsLike: "Comme « ya » dans « yaourt »",
      mouthDescription: "Commence avec la langue haute et en avant (comme « i »), puis s'ouvre rapidement vers la position du « a ».",
      tip: "Comme ㅏ mais avec deux traits horizontaux — le trait supplémentaire ajoute un glissement en « y ».",
    },
  },

  eo: {
    en: {
      soundsLike: "Like the 'u' in 'cup' or 'uh' — an open-mid back unrounded vowel",
      mouthDescription: 'Mouth moderately open, tongue mid-to-low and pulled back. Lips unrounded.',
      tip: "The vertical line with a stroke to the left — the mirror of ㅏ, a darker, deeper sound.",
    },
    fr: {
      soundsLike: "Proche du « eu » de « peur » mais plus ouvert, ou du « o » de l'anglais « son »",
      mouthDescription: 'Bouche moyennement ouverte, langue à mi-hauteur et en arrière. Lèvres non arrondies.',
      tip: "La ligne verticale avec un trait à gauche — le miroir de ㅏ, un son plus sombre et profond.",
    },
  },

  yeo: {
    en: {
      soundsLike: "Like 'yuh' — a 'y' glide followed by the ㅓ vowel",
      mouthDescription: "Starts with tongue high and front (like 'ee'), then moves to the ㅓ position.",
      tip: "Same as ㅓ but with two strokes — the extra stroke adds the 'y' glide.",
    },
    fr: {
      soundsLike: "Comme « yeu » — un glissement en « y » suivi de la voyelle ㅓ",
      mouthDescription: "Commence avec la langue haute et en avant (comme « i »), puis passe à la position de ㅓ.",
      tip: "Comme ㅓ mais avec deux traits — le trait supplémentaire ajoute le glissement en « y ».",
    },
  },

  o: {
    en: {
      soundsLike: "Like the 'o' in 'go' but without the glide — a pure, rounded 'oh'",
      mouthDescription: 'Mouth moderately open, tongue pulled back and mid-high. Lips rounded.',
      tip: "The horizontal line with a stroke above — lips round upward like the stroke going up.",
    },
    fr: {
      soundsLike: "Comme le « o » de « beau » — un « o » pur et arrondi",
      mouthDescription: 'Bouche moyennement ouverte, langue en arrière et mi-haute. Lèvres arrondies.',
      tip: "La ligne horizontale avec un trait au-dessus — les lèvres s'arrondissent vers le haut comme le trait.",
    },
  },

  yo: {
    en: {
      soundsLike: "Like 'yo' in 'yoke'",
      mouthDescription: "Starts with tongue high and front (like 'ee'), then rounds into the ㅗ position.",
      tip: "Same as ㅗ but with two vertical strokes — the extra stroke adds the 'y' glide.",
    },
    fr: {
      soundsLike: "Comme « yo » dans « yoga »",
      mouthDescription: "Commence avec la langue haute et en avant (comme « i »), puis s'arrondit vers la position de ㅗ.",
      tip: "Comme ㅗ mais avec deux traits verticaux — le trait supplémentaire ajoute le glissement en « y ».",
    },
  },

  u: {
    en: {
      soundsLike: "Like the 'oo' in 'food'",
      mouthDescription: 'Tongue pulled back and high. Lips tightly rounded.',
      tip: "The horizontal line with a stroke below — lips pucker downward like the stroke going down.",
    },
    fr: {
      soundsLike: "Comme le « ou » de « tout »",
      mouthDescription: 'Langue en arrière et haute. Lèvres étroitement arrondies.',
      tip: "La ligne horizontale avec un trait en-dessous — les lèvres se pincent vers le bas comme le trait.",
    },
  },

  yu: {
    en: {
      soundsLike: "Like 'you' in 'youth'",
      mouthDescription: "Starts with tongue high and front (like 'ee'), then rounds into the ㅜ position.",
      tip: "Same as ㅜ but with two vertical strokes — the extra stroke adds the 'y' glide.",
    },
    fr: {
      soundsLike: "Comme « you » en anglais, ou le « iou » dans « youpi »",
      mouthDescription: "Commence avec la langue haute et en avant (comme « i »), puis s'arrondit vers la position de ㅜ.",
      tip: "Comme ㅜ mais avec deux traits verticaux — le trait supplémentaire ajoute le glissement en « y ».",
    },
  },

  eu: {
    en: {
      soundsLike: "No exact English equivalent — like saying 'oo' but with lips spread flat, not rounded",
      mouthDescription: 'Tongue pulled back and high, but lips are unrounded and spread. Similar position to ㅜ but without lip rounding.',
      tip: "The plain horizontal line — your lips are flat like the line itself.",
    },
    fr: {
      soundsLike: "Proche du « eu » de « jeu » mais avec la langue plus en arrière — un son entre « eu » et « ou » sans arrondir les lèvres",
      mouthDescription: 'Langue en arrière et haute, mais lèvres non arrondies et étirées. Position similaire à ㅜ mais sans arrondir les lèvres.',
      tip: "La simple ligne horizontale — vos lèvres sont plates comme la ligne elle-même.",
    },
  },

  i: {
    en: {
      soundsLike: "Like the 'ee' in 'see'",
      mouthDescription: 'Tongue high and pushed forward. Lips spread wide.',
      tip: "The plain vertical line — simple and straight, like the 'ee' sound is pure and clean.",
    },
    fr: {
      soundsLike: "Comme le « i » de « si »",
      mouthDescription: 'Langue haute et poussée en avant. Lèvres étirées.',
      tip: "La simple ligne verticale — simple et droite, comme le son « i » qui est pur et net.",
    },
  },

  // ─── Compound Vowels ────────────────────────────────────────────

  ae: {
    en: {
      soundsLike: "Like the 'a' in 'cat' or 'e' in 'bed' — in modern Korean, nearly identical to ㅔ",
      mouthDescription: 'Mouth slightly open, tongue low-to-mid and front. Lips unrounded.',
      tip: "ㅏ + ㅣ combined — starts open like 'ah' but blends toward 'ee', landing on an 'eh' sound.",
    },
    fr: {
      soundsLike: "Comme le « è » de « père » — en coréen moderne, quasi identique à ㅔ",
      mouthDescription: 'Bouche légèrement ouverte, langue basse à mi-hauteur et en avant. Lèvres non arrondies.',
      tip: "ㅏ + ㅣ combinés — commence ouvert comme « a » puis tend vers « i », donnant un son « è ».",
    },
  },

  yae: {
    en: {
      soundsLike: "Like 'yeah' — a 'y' glide followed by the ㅐ vowel",
      mouthDescription: "Starts with tongue high and front (like 'ee'), then opens to the ㅐ position.",
      tip: "ㅑ + ㅣ combined — 'ya' blending toward 'ee' gives 'yeh'.",
    },
    fr: {
      soundsLike: "Comme « yè » — un glissement en « y » suivi de la voyelle ㅐ",
      mouthDescription: "Commence avec la langue haute et en avant (comme « i »), puis s'ouvre vers la position de ㅐ.",
      tip: "ㅑ + ㅣ combinés — « ya » qui tend vers « i » donne « yè ».",
    },
  },

  e: {
    en: {
      soundsLike: "Like the 'e' in 'bed'",
      mouthDescription: 'Mouth slightly open, tongue mid and front. Lips unrounded.',
      tip: "ㅓ + ㅣ combined — the darker 'uh' blends toward 'ee', landing on 'eh'.",
    },
    fr: {
      soundsLike: "Comme le « é » de « été » ou le « è » de « père »",
      mouthDescription: 'Bouche légèrement ouverte, langue à mi-hauteur et en avant. Lèvres non arrondies.',
      tip: "ㅓ + ㅣ combinés — le « eu » sombre tend vers « i », donnant un son « é/è ».",
    },
  },

  ye: {
    en: {
      soundsLike: "Like 'ye' in 'yes'",
      mouthDescription: "Starts with tongue high and front (like 'ee'), then opens to the ㅔ position.",
      tip: "ㅕ + ㅣ combined — 'yuh' blending toward 'ee' gives 'yeh'.",
    },
    fr: {
      soundsLike: "Comme « yé » dans « yéti »",
      mouthDescription: "Commence avec la langue haute et en avant (comme « i »), puis s'ouvre vers la position de ㅔ.",
      tip: "ㅕ + ㅣ combinés — « yeu » qui tend vers « i » donne « yé ».",
    },
  },

  wa: {
    en: {
      soundsLike: "Like 'wa' in 'water'",
      mouthDescription: "Starts with rounded lips (like ㅗ 'oh'), then opens to ㅏ 'ah'.",
      tip: "ㅗ + ㅏ combined — the round 'oh' glides into an open 'ah'.",
    },
    fr: {
      soundsLike: "Comme « oua » dans « ouate »",
      mouthDescription: "Commence avec les lèvres arrondies (comme ㅗ « o »), puis s'ouvre vers ㅏ « a ».",
      tip: "ㅗ + ㅏ combinés — le « o » arrondi glisse vers un « a » ouvert.",
    },
  },

  wae: {
    en: {
      soundsLike: "Like 'we' in 'wet'",
      mouthDescription: "Starts with rounded lips (like ㅗ 'oh'), then opens to ㅐ 'eh'.",
      tip: "ㅗ + ㅐ combined — the round 'oh' glides into 'eh'.",
    },
    fr: {
      soundsLike: "Comme « ouè » — un « ou » suivi d'un « è »",
      mouthDescription: "Commence avec les lèvres arrondies (comme ㅗ « o »), puis s'ouvre vers ㅐ « è ».",
      tip: "ㅗ + ㅐ combinés — le « o » arrondi glisse vers « è ».",
    },
  },

  oe: {
    en: {
      soundsLike: "Like 'we' in 'wet' — in modern Korean, pronounced nearly the same as ㅙ and ㅞ",
      mouthDescription: "Historically ㅗ + ㅣ, but now typically a 'we' sound. Lips start rounded, tongue moves forward.",
      tip: "ㅗ + ㅣ combined — historically a round 'oh-ee' diphthong, now simplified to 'we'.",
    },
    fr: {
      soundsLike: "Comme « oué » — en coréen moderne, prononcé presque comme ㅙ et ㅞ",
      mouthDescription: "Historiquement ㅗ + ㅣ, mais maintenant typiquement un son « oué ». Les lèvres commencent arrondies, la langue avance.",
      tip: "ㅗ + ㅣ combinés — historiquement une diphtongue « o-i » arrondie, maintenant simplifiée en « oué ».",
    },
  },

  wo: {
    en: {
      soundsLike: "Like 'wo' in 'won' or the 'wa' in 'wander'",
      mouthDescription: "Starts with rounded lips (like ㅜ 'oo'), then opens to ㅓ 'uh'.",
      tip: "ㅜ + ㅓ combined — the tight 'oo' glides into the open 'uh'.",
    },
    fr: {
      soundsLike: "Comme « ouo » — un « ou » suivi du son ㅓ",
      mouthDescription: "Commence avec les lèvres arrondies (comme ㅜ « ou »), puis s'ouvre vers ㅓ « eu ».",
      tip: "ㅜ + ㅓ combinés — le « ou » serré glisse vers le « eu » ouvert.",
    },
  },

  we: {
    en: {
      soundsLike: "Like 'we' in 'wet' — in modern Korean, nearly identical to ㅙ and ㅚ",
      mouthDescription: "Starts with rounded lips (like ㅜ 'oo'), then opens to ㅔ 'eh'.",
      tip: "ㅜ + ㅔ combined — the tight 'oo' glides into 'eh'.",
    },
    fr: {
      soundsLike: "Comme « oué » — en coréen moderne, quasi identique à ㅙ et ㅚ",
      mouthDescription: "Commence avec les lèvres arrondies (comme ㅜ « ou »), puis s'ouvre vers ㅔ « é ».",
      tip: "ㅜ + ㅔ combinés — le « ou » serré glisse vers « é ».",
    },
  },

  wi: {
    en: {
      soundsLike: "Like 'we' in 'week'",
      mouthDescription: "Starts with rounded lips (like ㅜ 'oo'), then spreads to ㅣ 'ee'.",
      tip: "ㅜ + ㅣ combined — the round 'oo' glides into a bright 'ee'.",
    },
    fr: {
      soundsLike: "Comme « oui »",
      mouthDescription: "Commence avec les lèvres arrondies (comme ㅜ « ou »), puis s'étire vers ㅣ « i ».",
      tip: "ㅜ + ㅣ combinés — le « ou » arrondi glisse vers un « i » clair. Exactement comme « oui » !",
    },
  },

  ui: {
    en: {
      soundsLike: "Like saying 'oo-ee' quickly — starts with ㅡ and glides to ㅣ",
      mouthDescription: "Starts with lips spread and tongue back-high (ㅡ position), then tongue moves forward to ㅣ 'ee'.",
      tip: "ㅡ + ㅣ combined — the flat 'eu' glides into 'ee'. Used in the possessive particle 의.",
    },
    fr: {
      soundsLike: "Comme « eu-i » dit rapidement — commence par ㅡ et glisse vers ㅣ",
      mouthDescription: "Commence avec les lèvres étirées et la langue en arrière en haut (position ㅡ), puis la langue avance vers ㅣ « i ».",
      tip: "ㅡ + ㅣ combinés — le « eu » plat glisse vers « i ». Utilisé dans la particule possessive 의.",
    },
  },
}
