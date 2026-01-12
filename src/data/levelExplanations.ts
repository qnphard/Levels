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
    reservoir: 'Past experiences where you felt exposed, rejected, or criticized get activated by current triggers. Shame isn\'t about what happened now—it\'s about old wounds that haven\'t fully healed.',
    copingTraps: {
      default: 'Hiding or isolating reinforces the shame cycle. When you believe you\'re fundamentally flawed, withdrawing seems safer, but it actually strengthens the shame identity.',
      venting: 'Venting about shame often rehearses the "I\'m broken" story. Talking about how defective you feel can actually reinforce the shame pattern rather than release it.',
      escape: 'Trying to escape shame through distraction or numbing only postpones it. The feeling will return, often stronger, because the underlying belief hasn\'t been addressed.',
      overthinking: 'Ruminating on "what\'s wrong with me" keeps you stuck in shame. Overthinking shame strengthens the identity that you ARE the shame, rather than someone experiencing it.',
    },
    thirdAngle: 'Shame = "I am bad." Guilt = "I did something bad." Shame attacks your identity; guilt addresses your actions. Understanding this distinction is the first step to self-compassion.',
  },
  guilt: {
    reservoir: 'Old actions, choices, or behaviors that violated your values get triggered by current situations. Guilt pulls up stored remorse that hasn\'t been fully processed or forgiven.',
    copingTraps: {
      default: 'Over-apologizing or self-punishment keeps guilt alive. Constantly beating yourself up doesn\'t resolve guilt—it creates a loop of suffering that prevents genuine atonement.',
      venting: 'Venting guilt can rehearse the "I\'m a bad person" narrative. Expressing guilt outwardly might feel like accountability, but it often strengthens the guilt identity.',
      escape: 'Avoiding guilt through distraction only delays the reckoning. The unresolved guilt will resurface, often manifesting as self-sabotage or relationship patterns.',
      overthinking: 'Ruminating on "what I should have done" traps you in guilt. Overthinking keeps you stuck in the past, preventing you from making amends or moving forward.',
    },
    thirdAngle: 'Guilt serves a purpose: it shows you your values. When guilt is examined with compassion, it becomes a guidepost for alignment, not a weapon against yourself.',
  },
  fear: {
    reservoir: 'Past fears, traumas, or anxieties get triggered by present uncertainty. The feelings you\'re experiencing aren\'t just about what\'s happening now—they\'re connected to stored fear energy from the past.',
    copingTraps: {
      default: 'Suppressing or avoiding fear creates inner pressure. This constant mental effort to control or escape fear exhausts you, and the fear tends to resurface when pressure is off.',
      venting: 'Expressing fear outwardly can actually amplify it. Venting about fear rehearses the anxious state, strengthening the neural pathways of worry and catastrophizing.',
      escape: 'Trying to escape fear through distraction only postpones it. The fear will return, often stronger, because the underlying threat perception hasn\'t been addressed.',
      overthinking: 'Ruminating on worst-case scenarios keeps fear alive. Overthinking fear strengthens the pattern of catastrophic thinking, making the fear feel more real.',
    },
    thirdAngle: 'Stress is fear of the future. When fear dissolves, stress does too. Most of what we call "stress" is actually unexamined fear energy, temporarily stirred by circumstances.',
  },
  anger: {
    reservoir: 'Stored anger from past injustices, boundaries being crossed, or needs not being met gets activated by current triggers. The intensity isn\'t just from what\'s happening now—it\'s fueled by accumulated resentment.',
    copingTraps: {
      default: 'Suppressing anger creates explosive pressure. Trying to "be nice" while anger simmers builds inner tension that eventually erupts, often disproportionately.',
      venting: 'Venting anger rehearses the state. Expressing anger outwardly might feel like release, but it actually strengthens the anger pattern and keeps you stuck in reactivity.',
      escape: 'Trying to escape anger through distraction only delays it. The unresolved anger will resurface, often manifesting as passive-aggressive behavior or sudden outbursts.',
      conflict: 'Engaging in conflict while angry often escalates situations. Reacting from anger creates more anger, both in yourself and others, perpetuating the cycle.',
    },
    thirdAngle: 'Anger shows you where your boundaries are. Underneath anger is often a need: for respect, safety, or validation. Anger is information—it points to what matters to you.',
  },
  desire: {
    reservoir: 'Past experiences of lack, scarcity, or unmet needs get triggered by current wants. The craving isn\'t just about the object—it\'s connected to deeper needs for fulfillment or safety.',
    copingTraps: {
      default: 'Chasing desires without examining them creates a cycle. Giving in to every urge strengthens the craving pattern, making it harder to find genuine satisfaction.',
      venting: 'Expressing desires outwardly can amplify cravings. Talking about what you want can actually increase the intensity of the desire rather than reduce it.',
      escape: 'Using substances or behaviors to escape desire only creates dependency. What starts as temporary relief becomes a pattern that requires more and more to satisfy.',
      overthinking: 'Ruminating on what you want keeps desire alive. Overthinking cravings strengthens the fixation, making the object of desire feel more necessary.',
    },
    thirdAngle: 'Desire shows you where you\'re looking for fulfillment outside yourself. When examined, desire points to deeper needs: for connection, meaning, or inner peace that can\'t be satisfied by external objects.',
  },
  grief: {
    reservoir: 'Past losses, endings, or disappointments get activated by current situations that remind you of what\'s missing. The sadness isn\'t just about now—it\'s connected to stored grief that hasn\'t fully moved through you.',
    copingTraps: {
      default: 'Suppressing grief creates numbness or delayed processing. Trying to "stay strong" or avoid sadness only postpones the healing, and grief tends to resurface when you\'re ready.',
      venting: 'Getting stuck in expressing grief can keep you in the pain. While healthy expression is important, rehearsing grief without movement can become a pattern.',
      escape: 'Trying to escape grief through distraction prevents healing. Grief needs to be felt and moved through—avoiding it creates a heavy burden that weighs you down.',
      overthinking: 'Ruminating on what\'s lost keeps grief alive. Overthinking grief can trap you in the past, preventing you from processing the loss and finding meaning.',
    },
    thirdAngle: 'Grief is the price of love. The depth of your grief reflects the depth of your connection. Allowing grief to move through you honors what was lost and creates space for what remains.',
  },
  apathy: {
    reservoir: 'Past overwhelm, exhaustion, or repeated disappointment leads to shutdown. The numbness isn\'t about now—it\'s a protective response to accumulated stress that hasn\'t been processed.',
    copingTraps: {
      default: 'Staying in apathy becomes its own trap. The numbness feels safer than feeling, but it also prevents movement, growth, and reconnection with life.',
      escape: 'Using apathy as an escape from feeling eventually creates more numbness. The more you disconnect from feeling, the harder it becomes to reconnect.',
      overthinking: 'Ruminating on "why bother" keeps you in apathy. Overthinking reinforces the belief that nothing matters, strengthening the numb state.',
    },
    thirdAngle: 'Apathy isn\'t failure—it\'s a tired nervous system. Your body and mind are protecting you from overwhelm. Apathy shows you where you need rest, boundaries, and gentle reconnection.',
  },
  pride: {
    reservoir: 'Past experiences of being wrong, criticized, or vulnerable get activated by current challenges to your position. The defensiveness isn\'t just about now—it\'s protecting old wounds around being seen as flawed.',
    copingTraps: {
      default: 'Maintaining a superior position creates isolation. Pride prevents genuine connection because it requires others to be "less than" for you to feel secure.',
      conflict: 'Engaging in conflict from pride escalates defensiveness. Reacting from "I\'m right" creates more rigidity and prevents understanding or resolution.',
      venting: 'Expressing superiority outwardly strengthens the pride pattern. Venting about how right you are actually reinforces the defensive identity.',
    },
    thirdAngle: 'Pride protects vulnerability. Underneath pride is often fear of being wrong, exposed, or judged. Pride shows you where you\'re defending against feeling small or flawed.',
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
    return explanation?.copingTraps.default || 'Suppressing or avoiding emotions creates inner pressure. This constant mental effort exhausts you and the feelings tend to resurface when pressure is off.';
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

