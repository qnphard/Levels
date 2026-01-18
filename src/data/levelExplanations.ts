/**
 * Level-specific explanations for "Here's why this happens" screen
 * Each level has three bullet points explaining why the emotion shows up
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
    reservoir: 'Past experiences of humiliation, rejection, or being seen as "small" are stored as a reservoir. Shame isn\'t about "making a mistake"—it\'s the deeper belief that "I am a mistake."',
    copingTraps: {
      default: 'Hiding or isolating (the "process of elimination") reinforces the shame cycle. Withdrawing seems safer, but it strengthens the belief that you are inherently unlovable.',
      venting: 'Venting about shame usually rehearses the "broken" story. Talking about how defective you feel can lock you into the identity rather than releasing the energy.',
      escape: 'Trying to escape shame through distraction only postpones the pain. The feeling remains because the underlying ontological sense of "defect" hasn\'t been addressed.',
      overthinking: 'Ruminating on "what is wrong with me" is the ego\'s way of keeping shame alive. Overthinking reinforces the identity of being a "non-person."',
    },
    thirdAngle: 'Shame (20) attacks who you *are*; Guilt (30) attacks what you *did*. Moving from "I am bad" to "I did something bad" is actually a step up in energy toward healing.',
  },
  guilt: {
    reservoir: 'Stored remorse and the belief that error demands punishment. Guilt pulls up past "sins" that haven\'t been forgiven, projecting a world of "evil" and a vindictive God-view.',
    copingTraps: {
      default: 'Self-punishment and masochism keep guilt alive. The ego believes that suffering "atones" for error, but it actually just strengthens the cycle of self-attack.',
      venting: 'Venting guilt can be a subtle way to manipulate others or God for sympathy. It rehearses the "I\'m a bad person" narrative instead of correcting the error.',
      escape: 'Avoiding guilt through distraction delays the reckoning. Unresolved guilt often surfaces through "accidents," illness, or self-sabotage.',
      overthinking: 'Ruminating on "I should have known better" is a fantasy. You acted based on your limited perception at the time; guilt is the ego inflating the hero of its own tragedy.',
    },
    thirdAngle: 'Guilt serves as a guidepost: it shows you your values. When recontextualized as "learning error" rather than "metaphysical evil," it can be surrendered in favor of correction.',
  },
  fear: {
    reservoir: 'A vast reservoir of past fear energy activated by present uncertainty. Fear sees "danger" everywhere because its primary goal is physical and emotional survival.',
    copingTraps: {
      default: 'Suppressing fear creates intense inner pressure. This constant vigilance exhausts the nervous system, leading to the very "overwhelm" the ego tries to avoid.',
      venting: 'Expressing fear outwardly often amplifies it. Venting about what "might" happen rehearses the anxious state and strengthens the neural pathways of worry.',
      escape: 'Escape through distraction ignores the "threat" but doesn\'t dissolve the fear energy. The fear will return because the underlying perception of danger is unchanged.',
      overthinking: 'Catastrophizing is the ego\'s attempt to "prepare" via worst-case scenarios. Overthinking fear makes the imaginary threat feel more real and imminent.',
    },
    thirdAngle: 'Stress is simply "fear of the future." When the demand for security is surrendered, the energy of fear dissolves, and the "stress" disappears with it.',
  },
  anger: {
    reservoir: 'Stored anger from past injustices or unmet needs gets activated. The intensity results from accumulated resentment, not just the current trigger.',
    copingTraps: {
      default: 'Suppressing anger builds explosive pressure. Trying to "be nice" while resentment simmers creates inner tension that eventually erupts disproportionately.',
      venting: 'Venting anger rehearses the state of reactivity. While it feels like "release," it actually strengthens the habit of using force to get what you want.',
      escape: 'Avoiding anger only delays the eruption. The unresolved energy manifests as passive-aggression or sudden, "unexplained" outbursts.',
      conflict: 'Engaging from anger usually escalates the situation. Reacting from "I\'ll show you" creates more resistance in others, perpetuating the conflict.',
    },
    thirdAngle: 'Anger shows you where your boundaries are. Underneath every anger is an unmet need (respect, safety, etc.) and a hidden fear. It is information, not a directive.',
  },
  desire: {
    reservoir: 'A reservoir of past lack and the belief that fulfillment is "out there." Desire is the state of craving, which by definition is a state of "not having."',
    copingTraps: {
      default: 'Chasing desires reinforces the "not-enough" program. Getting what you want provides temporary relief, but the *state* of craving remains insatiable.',
      venting: 'Talking constantly about what you lack or want can amplify the intensity of the craving. It keeps the mind fixated on the "hole" in your experience.',
      escape: 'Using substances or shopping to "fill the hole" creates dependency. You become addicted to the temporary high that masks the underlying sense of lack.',
      overthinking: 'Obsessing over the object of desire makes it feel necessary for your survival. The ego magnifies the object until it becomes a "god" you must serve.',
    },
    thirdAngle: 'Desire points to a deeper need for inner peace. When you surrender the *demand* for the object, you discover that the feeling of "completeness" is already within you.',
  },
  grief: {
    reservoir: 'Accumulated past losses and disappointments. Grief is the painful feeling of "I can\'t go on" because the source of happiness is perceived to be lost forever.',
    copingTraps: {
      default: 'Suppressing grief leads to "apathy" or delayed processing. Trying to "be strong" prevents the energy from moving through you, leaving a heavy burden.',
      venting: 'Getting stuck in the "story" of loss can keep you in the pain. Healthy expression moves the energy; rehearsing the story locks it in.',
      escape: 'Distraction prevents the necessary "letting go" that grief demands. Avoidance creates a stagnation that prevents new life from entering.',
      overthinking: 'Ruminating on "if only I had..." is a trap. It keeps you oriented to a past that no longer exists, preventing you from accepting what is.',
    },
    thirdAngle: 'Grief is the cost of attachment, but also the indicator of love. Allowing it to move through you honors the connection while releasing the demand to control change.',
  },
  apathy: {
    reservoir: 'A reservoir of past overwhelm where the nervous system "played dead" to survive. Apathy is the state of hopelessness where "I can\'t" is the dominant belief.',
    copingTraps: {
      default: 'Staying in apathy feels "safe" because it avoids all other feelings, but it is a "living death." It blocks growth and keeps you in a state of chronic lack.',
      escape: 'Escaping into "veg-out" modes (TV, scrolling) reinforces the numbness. Small, gentle movements of energy are needed to break the freeze response.',
      overthinking: 'Ruminating on "why bother" or "it doesn\'t matter" is the ego\'s way of justifying the shutdown. It protects you from the effort (and risk) of feeling.',
    },
    thirdAngle: 'Apathy isn\'t failure; it\'s a tired nervous system. It shows you where you need rest, healthy boundaries, and a very gentle reconnection with your own "Will."',
  },
  pride: {
    reservoir: 'Past experiences of being criticized or feeling small. Pride is the ego\'s "armor," a superior positionality used to defend against vulnerability.',
    copingTraps: {
      default: 'Defensiveness and "I\'m right" create isolation. Pride prevents genuine connection because you cannot be "wrong" or "vulnerable" and still be safe.',
      conflict: 'Reacting from pride escalates conflict into a "battle of wills." Rigidity prevents resolution because the ego sees compromise as a loss of self.',
      venting: 'Venting about how "wrong" others are strengthens your superior identity. It keeps you stuck in judgment and prevents compassion.',
    },
    thirdAngle: 'Pride is "Fear in a top hat." It protects a fragile core. Underneath the "better than" is usually a fear of being "not enough." Surrendering pride allows for true self-worth.',
  },

  // === Higher Levels (200+) ===
  courage: {
    reservoir: 'The shift from negative to positive. Courage emerges when you stop waiting for external permission and realize "I can do it." It\'s the energy of self-empowerment.',
    copingTraps: {
      default: 'Forcing yourself through obstacles with willpower alone leads to exhaustion. True courage is not gritting your teeth—it\'s dropping the belief that life is against you.',
      overthinking: 'Planning endlessly to "prepare" for action is often disguised avoidance. Courage acts despite uncertainty, not after it\'s resolved.',
    },
    thirdAngle: 'Courage (200) is the critical threshold where consciousness shifts from force to power. Problems are seen as challenges to grow from, not threats to survive.',
  },
  neutrality: {
    reservoir: 'Release from the positionalities of lower levels. Neutral energy says "It\'s okay if it happens, and it\'s okay if it doesn\'t." The expectation that life will be okay if you roll with it.',
    copingTraps: {
      default: 'Confusing nonattachment with detachment. Detachment leads to indifference and flatness. True neutrality is engaged but not invested in specific outcomes.',
      escape: 'Withdrawing from life and calling it "peace" is avoidance, not neutrality. Real neutrality participates fully without drivenness.',
    },
    thirdAngle: 'Neutrality is "wearing the world like a loose garment" (St. Francis). Life becomes like a cork in the sea—floating with events rather than fighting them.',
  },
  willingness: {
    reservoir: 'The gateway to higher awareness. Willingness emerges from openness to life and commitment to participation. It\'s the energy of the "good Samaritan" and the Golden Rule.',
    copingTraps: {
      default: 'Burnout from over-giving without boundaries. Willingness serves from fullness, not depletion. It knows when to rest.',
      venting: 'Complaining about how much you do for others undermines the gift. True generosity expects no reward and has no strings attached.',
    },
    thirdAngle: 'Willingness attracts abundance not by seeking but by being. "Like goes to like." The extra energy that would otherwise go to resistance now fuels contribution.',
  },
  acceptance: {
    reservoir: 'The realization that "life is good" as it is. Acceptance doesn\'t mean approval—it means no longer fighting what has already happened. It meets life on life\'s terms.',
    copingTraps: {
      default: 'Passive resignation is not acceptance. True acceptance is active engagement with reality while releasing the demand that it be different.',
      overthinking: 'Analyzing why things "should" be different keeps you stuck in judgment. Acceptance sees things as they are without needing them to change.',
    },
    thirdAngle: 'Acceptance ends the war with what is. Personal responsibility replaces blame. There is no need to control others when you are at peace with yourself.',
  },
  reason: {
    reservoir: 'The emergence of abstract intelligence. Reason handles massive data and complexity. It\'s the energy of science, philosophy, and logical problem-solving.',
    copingTraps: {
      default: 'Getting trapped in intellect without heart. Reason alone cannot access love, joy, or transcendence—it can only understand them from outside.',
      overthinking: 'Analysis paralysis. The mind believes that enough information will resolve uncertainty, but some answers lie beyond logic.',
    },
    thirdAngle: 'Reason is a powerful tool, but it cannot transcend itself. The limitation of level 400 is that it sees truth as objective and external rather than subjective and experiential.',
  },
  love: {
    reservoir: 'A way of being that emanates from the heart, not the mind. Love focuses on the essence of things rather than details. It sees the intrinsic value and lovability of all that exists.',
    copingTraps: {
      default: 'Conditional love—loving only when conditions are met—is not love but desire wearing love\'s clothing. True love is unchanging regardless of circumstances.',
    },
    thirdAngle: 'At level 500, love becomes the dominant experience. The world is perceived through the lens of appreciation and care rather than judgment or analysis.',
  },
  joy: {
    reservoir: 'Unconditional love that is unchanging despite external circumstances. Joy calibrates at 540—it\'s not dependent on what happens but arises from within regardless.',
    copingTraps: {
      default: 'Seeking joy externally through excitement or stimulation. True joy is quiet and arises from completion and self-sufficiency, not acquisition.',
    },
    thirdAngle: 'The world is illuminated by exquisite beauty at this level. Compassion for all beings emerges naturally. Joy is the nearness to unity and the discovery of Self.',
  },
  peace: {
    reservoir: 'Perfection, bliss, effortlessness, and oneness. Peace is a state of non-duality beyond the intellect—the "peace that passeth all understanding." It calibrates at 600+.',
    copingTraps: {
      default: 'There are no traps at true Peace. If you find one, you\'re not yet there. Peace is the absence of inner conflict, not the suppression of it.',
    },
    thirdAngle: 'At the level of Peace, there is no individual "doing" anything. Actions happen through you rather than by you. The world is experienced as perfect exactly as it is.',
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
    return 'Suppressing or avoiding emotions creates inner pressure. This constant mental effort exhausts you and the feelings tend to resurface when pressure is off.';
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
  if (selectedSituations.includes('conflict') && explanation.copingTraps.conflict) {
    return explanation.copingTraps.conflict;
  }

  return explanation.copingTraps.default;
}

