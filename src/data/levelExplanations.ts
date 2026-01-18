/**
 * Level-specific explanations for "Here's why this happens" screen
 * Each level has three bullet points explaining why the emotion shows up
 * 
 * Voice: Warm, inclusive ("we"), beginner-friendly, no jargon
 */

export interface LevelExplanation {
  reservoir: string; // "Reservoir + trigger" text
  copingTraps: {
    default: string;
    venting?: string;
    escape?: string;
    overthinking?: string;
    conflict?: string;
  };
  thirdAngle: string; // The third perspective/angle
}

export const levelExplanations: Record<string, LevelExplanation> = {
  shame: {
    reservoir: 'We all carry moments where we felt deeply humiliated or "not good enough." Shame is different from guilt—with guilt, we think "I did something bad." With shame, we think "I am bad." That\'s a much heavier weight to carry.',
    copingTraps: {
      default: 'When we feel shame, we often hide or pull away from people. It feels safer to be alone. But hiding actually makes the shame stronger—it convinces us that we really are unlovable.',
      venting: 'Talking about how "broken" we are can feel like release, but it often just reinforces the painful story. We end up stuck in the identity of being defective.',
      escape: 'Distracting ourselves from shame only delays the pain. The feeling stays because we haven\'t addressed the deeper belief that something is fundamentally wrong with us.',
      overthinking: 'Asking ourselves "what is wrong with me?" over and over keeps shame alive. That inner voice is trying to confirm that we don\'t belong.',
    },
    thirdAngle: 'Here\'s something hopeful: if you can move from "I am bad" to "I did something bad," that\'s actually progress. Guilt is a step up from shame—it means you\'re separating your actions from your worth.',
  },
  guilt: {
    reservoir: 'We carry guilt when we believe we\'ve done something wrong that hasn\'t been fully forgiven—either by ourselves or others. It pulls up old "mistakes" and makes us feel like we deserve punishment.',
    copingTraps: {
      default: 'We sometimes punish ourselves, thinking that suffering will "make up" for what we did. But self-punishment doesn\'t actually help—it just keeps us stuck in a cycle of feeling bad.',
      venting: 'Telling people how terrible we are can be a way of seeking reassurance or sympathy. But it often just rehearses the "I\'m a bad person" story instead of helping us move forward.',
      escape: 'Avoiding guilty feelings only delays the processing. Unresolved guilt has a way of showing up anyway—through "accidents," self-sabotage, or that nagging voice in the back of our minds.',
      overthinking: 'Thinking "I should have known better" assumes we had wisdom we didn\'t actually have at the time. We acted based on what we knew then. Guilt inflates our past self into a villain.',
    },
    thirdAngle: 'Guilt can actually be a teacher. It shows us what we value. When we see a mistake as a "learning moment" rather than proof that we\'re evil, we can correct course and let go.',
  },
  apathy: {
    reservoir: 'Apathy often comes after we\'ve been through too much. Our system gets overwhelmed and just... shuts down. It\'s like our inner battery has run out. We feel hopeless—like "what\'s even the point?"',
    copingTraps: {
      default: 'Staying in apathy feels safe because we don\'t have to feel anything else. But it\'s a kind of "living death"—we\'re protected from pain, but also cut off from life.',
      escape: 'Numbing out with TV, scrolling, or just "vegging" can feel like rest, but it actually reinforces the shutdown. What we need instead are small, gentle movements back toward caring.',
      overthinking: 'Thoughts like "why bother?" or "nothing matters" feel like truth, but they\'re actually our tired mind justifying the shutdown. They protect us from the effort of feeling.',
    },
    thirdAngle: 'Apathy isn\'t failure—it\'s exhaustion. It shows us where we\'ve pushed too hard or ignored our needs for too long. Sometimes the path forward starts with simply being gentle with ourselves.',
  },
  grief: {
    reservoir: 'Grief happens when we lose something or someone that brought us happiness. It\'s the painful feeling of "I can\'t go on without this." The deeper we loved, the deeper the grief.',
    copingTraps: {
      default: 'Sometimes we try to "be strong" and push grief away. But when we don\'t let ourselves feel it, the sadness gets stuck. It sits heavy inside us instead of moving through.',
      venting: 'Telling the story of our loss over and over can keep us stuck in the pain. There\'s a difference between processing grief and rehearsing it.',
      escape: 'Distracting ourselves prevents the natural "letting go" that grief asks of us. The energy has nowhere to go, so it stays trapped.',
      overthinking: 'Thoughts like "if only I had..." keep us oriented to a past that no longer exists. They stop us from accepting what is.',
    },
    thirdAngle: 'Grief is the price of love—and also proof of it. When we let ourselves feel it fully, we honor what we loved. And slowly, we become able to let new life enter.',
  },
  fear: {
    reservoir: 'We all have stored-up fear from past experiences when we felt unsafe. When something uncertain happens now, it triggers that old fear. Suddenly we\'re not just nervous—we\'re flooded with everything buried beneath.',
    copingTraps: {
      default: 'Trying to suppress fear creates intense inner pressure. We stay on high alert all the time, which is exhausting. The very "overwhelm" we\'re trying to avoid ends up happening anyway.',
      venting: 'Talking about everything that "might go wrong" often makes fear bigger, not smaller. We rehearse the anxious state and make the worry feel more real.',
      escape: 'Distracting ourselves from fear doesn\'t make it go away. As soon as the distraction stops, the fear is still there waiting—because the underlying sense of threat hasn\'t changed.',
      overthinking: 'Playing out worst-case scenarios in our head is the mind\'s attempt to "prepare." But it actually makes imaginary threats feel real and imminent.',
    },
    thirdAngle: 'Here\'s a key insight: stress is just fear of the future. When we let go of demanding certainty—when we accept that we can\'t control everything—the fear loses its grip.',
  },
  desire: {
    reservoir: 'Desire is the state of wanting something we don\'t have. It comes from a belief that we\'re incomplete—that happiness is "out there" in some object, person, or achievement. By definition, desire is always the feeling of "not enough."',
    copingTraps: {
      default: 'Chasing what we want only gives temporary relief. We get the thing, feel good briefly, then find something else to want. The craving itself never stops.',
      venting: 'Constantly talking about what we lack or want can make the craving even stronger. We keep our attention fixed on the "hole" in our life.',
      escape: 'Using shopping, food, or substances to "fill the void" creates dependency. We get hooked on the temporary high, while the underlying emptiness remains.',
      overthinking: 'Obsessing over what we want makes it seem necessary for survival. Our mind inflates the object until we believe we can\'t be happy without it.',
    },
    thirdAngle: 'Desire points to something real—a hunger for peace and fulfillment. But that fulfillment can\'t come from outside. When we drop the demand for the object, we discover that what we were really seeking was already within us.',
  },
  anger: {
    reservoir: 'When we feel angry, it\'s usually because something triggered old stored-up frustration. Past injustices, unmet needs, accumulated resentments—they all pile up. That\'s why our reaction often feels bigger than the situation deserves.',
    copingTraps: {
      default: 'Holding anger in feels terrible—like pressure building in a container. But without releasing it skillfully, that pressure eventually explodes in ways we regret.',
      venting: 'Letting anger out by yelling or ranting feels like release, but it often just strengthens the habit of reacting with force. We practice being angry.',
      escape: 'Ignoring anger doesn\'t make it go away. It shows up later as sarcasm, passive-aggression, or sudden outbursts that seem to come from nowhere.',
      conflict: 'Reacting from anger usually escalates the situation. When we\'re in "I\'ll show you" mode, we create more resistance, and the conflict grows.',
    },
    thirdAngle: 'Anger is information, not a command. It shows us where our boundaries are—and what we need (respect, safety, fairness). Underneath every anger is also a hidden fear. When we see that, we can respond wisely instead of just reacting.',
  },
  pride: {
    reservoir: 'Pride often develops as protection. If we\'ve been criticized or made to feel small in the past, we build up armor. We learn to present ourselves as superior, "above" the things that hurt us. It feels like strength, but it\'s actually a defense.',
    copingTraps: {
      default: 'When we\'re stuck in pride, we can\'t admit we\'re wrong or ask for help. We isolate ourselves because real connection requires vulnerability—which feels too dangerous.',
      conflict: 'Arguing from pride turns every disagreement into a "battle of wills." We can\'t compromise because losing feels like losing ourselves.',
      venting: 'Criticizing others makes us feel superior temporarily, but it keeps us stuck in judgment and prevents real understanding.',
    },
    thirdAngle: 'Pride is sometimes called "fear in a top hat." It looks impressive, but underneath there\'s usually a scared person who doesn\'t feel good enough. When we can let go of needing to be "better than," we find something better: real self-worth.',
  },

  // === Higher Levels (200+) ===
  courage: {
    reservoir: 'Courage is the turning point. It\'s when we stop waiting for permission or for things to feel safe, and we simply decide: "I can handle this." It\'s not the absence of fear—it\'s moving forward even when we\'re scared.',
    copingTraps: {
      default: 'Sometimes we think courage means forcing ourselves through obstacles until we\'re exhausted. But real courage isn\'t about gritting our teeth—it\'s about trusting that life isn\'t against us.',
      overthinking: 'Planning forever to "feel ready" is often just disguised avoidance. Courage acts even when things are uncertain, not after every question is answered.',
    },
    thirdAngle: 'Courage is special because it\'s the threshold where everything shifts. Below it, we react from fear. Above it, we respond from power. Problems become challenges we can grow from.',
  },
  neutrality: {
    reservoir: 'Neutrality is when we can honestly say, "It\'s okay if this happens, and it\'s okay if it doesn\'t." We\'re no longer fighting life or desperately needing things to go a certain way. There\'s a deep relaxation here.',
    copingTraps: {
      default: 'We might confuse neutrality with "not caring." But true neutrality isn\'t flat or cold—we\'re engaged with life, just not attached to specific outcomes.',
      escape: 'Withdrawing from life and calling it "peace" isn\'t neutrality—it\'s avoidance. Real neutrality participates fully, just without the inner drama.',
    },
    thirdAngle: 'Neutrality is like wearing life as a "loose garment." We float with events instead of fighting them. There\'s trust that things will work out, even if we don\'t know exactly how.',
  },
  willingness: {
    reservoir: 'Willingness is the gateway to even higher states. It\'s when we genuinely want to help, contribute, and be part of something bigger than ourselves. There\'s an openness here—a saying "yes" to life.',
    copingTraps: {
      default: 'Sometimes willingness can lead to burnout if we don\'t have boundaries. Real willingness gives from fullness, not from emptiness. It knows when to rest.',
      venting: 'If we catch ourselves complaining about how much we do for others, that\'s a sign we\'re giving with strings attached. True generosity expects nothing back.',
    },
    thirdAngle: 'Willingness attracts good things—not because we\'re trying to get them, but because we\'ve become the kind of person who naturally gives and receives. "Like attracts like."',
  },
  acceptance: {
    reservoir: 'Acceptance doesn\'t mean approval—it means we stop fighting what has already happened. We see that "life is how it is" and we work with it instead of against it. There\'s incredible peace in this.',
    copingTraps: {
      default: 'Passive resignation isn\'t acceptance. Real acceptance is active—we engage with reality while releasing the demand that it should be different.',
      overthinking: 'Analyzing why things "should" be different keeps us stuck. Acceptance sees things as they are without needing to fix or judge them.',
    },
    thirdAngle: 'When we accept what is, the war inside ends. We take responsibility for our lives without blaming anyone else. And we no longer need to control others to feel okay.',
  },
  reason: {
    reservoir: 'Reason is the power of the mind to understand complex things. It\'s the energy behind science, philosophy, and problem-solving. We can see patterns, analyze situations, and make sense of the world.',
    copingTraps: {
      default: 'The trap of reason is getting stuck in the head and losing connection with the heart. The mind alone can\'t access love, joy, or transcendence—it can only think about them.',
      overthinking: 'Analysis paralysis happens when we believe that more information will eventually give us certainty. Some answers don\'t come from thinking—they come from experiencing.',
    },
    thirdAngle: 'Reason is powerful, but it has limits. At some point, we realize that thinking about something isn\'t the same as knowing it directly. The next levels require moving beyond the mind.',
  },
  love: {
    reservoir: 'This isn\'t romantic love or needy love—it\'s a way of being. Love at this level comes from the heart, not the mind. We naturally see the beauty and value in people and things, without trying.',
    copingTraps: {
      default: 'Loving only when conditions are met isn\'t really love—it\'s a transaction. Real love remains steady regardless of whether the other person pleases us.',
    },
    thirdAngle: 'At this level, we perceive the world through appreciation rather than judgment. We care about others not because we "should," but because it\'s how we naturally experience life.',
  },
  joy: {
    reservoir: 'Joy isn\'t about exciting events—it\'s an inner state that doesn\'t depend on what\'s happening outside. Everything is illuminated by a quiet beauty. We feel complete, needing nothing.',
    copingTraps: {
      default: 'Chasing excitement or stimulation isn\'t joy—it\'s desire dressed up. True joy is quiet. It comes from a sense of sufficiency, not acquisition.',
    },
    thirdAngle: 'At this level, compassion for all beings arises naturally. We feel close to something greater than ourselves. The world seems miraculous just as it is.',
  },
  peace: {
    reservoir: 'Peace is beyond words. It\'s a state of complete stillness and oneness, where there\'s no "me" struggling against "life." Everything is perfect exactly as it is. We simply are.',
    copingTraps: {
      default: 'There are no traps at true peace—only the absence of struggle. If we find ourselves efforting, we\'re not there yet. Peace is the natural state when all resistance drops.',
    },
    thirdAngle: 'In peace, things happen through us rather than by us. We\'re not "doing" life anymore—we\'re being lived. This is what the great teachers meant by "the peace that passes understanding."',
  },
};

/**
 * Get the appropriate coping trap text based on selected situations
 */
export function getCopingTrapText(
  levelId: string,
  selectedSituations: string[]
): string {
  const explanation = levelExplanations[levelId];
  if (!explanation) {
    return 'When we push feelings away or try to ignore them, they don\'t actually go away. They build up inside, creating pressure. Eventually they surface—often at inconvenient times.';
  }

  // Check situations in priority order
  if (selectedSituations.includes('urge-to-vent') && explanation.copingTraps.venting) {
    return explanation.copingTraps.venting;
  }
  if (selectedSituations.includes('urge-to-escape') && explanation.copingTraps.escape) {
    return explanation.copingTraps.escape;
  }
  if (selectedSituations.includes('overthinking') && explanation.copingTraps.overthinking) {
    return explanation.copingTraps.overthinking;
  }
  if (selectedSituations.includes('rumination') && explanation.copingTraps.overthinking) {
    return explanation.copingTraps.overthinking;
  }
  if (selectedSituations.includes('conflict') && explanation.copingTraps.conflict) {
    return explanation.copingTraps.conflict;
  }

  return explanation.copingTraps.default;
}
