import { CategoryArticles, DossierArticle } from "../types";

// Helper to keep legacy levels working while they wait for full article expansion
const wrapLegacyDetail = (label: string, detail: string): DossierArticle & { label: string } => ({
    label,
    title: label,
    spineBody: detail.substring(0, 100) + "...",
    sections: [
        { title: 'The Core Concept', body: detail, importance: 'core', defaultExpanded: true }
    ]
});

// Reusable "Letting Go" technique article for all levels' exits
const LETTING_GO_ARTICLE: DossierArticle & { label: string } = {
    label: "Letting Go",
    title: "The Technique: Letting Go",
    spineBody: "Letting go is the simple process of surrendering resistance to a feeling, allowing its energy to run out so that it disappears.",
    sections: [
        {
            title: "The Mechanism of Surrender",
            importance: "core",
            defaultExpanded: true,
            body: "Most of our lives are spent in a state of 'resistance.' We fight our feelings, we try to think them away, or we distract ourselves to avoid them. This resistance is like adding fuel to a fire—it keeps the emotional charge alive in our nervous system for decades.\n\nLetting go is the opposite of resistance. It is the process of giving an emotion total permission to be there, without trying to change it, control it, or explain it. When you stop fighting a feeling, its energy begins to discharge. It runs out of 'steam' and simply fades away."
        },
        {
            title: "The Dog and the Tail",
            importance: "core",
            defaultExpanded: true,
            body: "Think of a feeling as a dog and your thoughts as its tail. The mind tries to 'fix' the thoughts (the tail), but the thoughts are only moving because the feeling (the dog) is wagging them.\n\nIf you try to stop the thoughts directly, they multiply. But if you let go of the *feeling* underneath, the thousands of thoughts it generated will simply stop. This is why the technique focuses entirely on the *physical sensation* of the emotion, not its story."
        },
        {
            title: "The Core Technique",
            importance: "core",
            defaultExpanded: true,
            body: "**1. BE AWARE** of a feeling. Where is it in the body? Feel its texture, weight, and temperature.\n\n**2. LET IT BE THERE.** Stop trying to change it, resist it, or explain it. Give it total permission to exist.\n\n**3. IGNORE THE THOUGHTS.** Thoughts are endless and misleading. Focus only on the *physical sensation* of the feeling.\n\n**4. SURRENDER THE RESISTANCE.** The pain is not in the feeling; the pain is in the *fight against* the feeling. Let go of the desire to make it go away.\n\n**5. WAIT.** Stay with the sensation until it begins to shift or soften. Even a 2% shift is a success."
        },
        {
            title: "Signs of Success",
            importance: "core",
            defaultExpanded: false,
            body: "As you surrender, you may notice:\n\n• Spontaneous sighs or deep breaths.\n• A feeling of physical lightness.\n• Clarity of mind regarding a previously 'stuck' problem.\n• A sudden sense of compassion for yourself or others.\n• The 'trigger' no longer produces a reaction.\n\nThese are signs that the emotional 'pressure' is being released. With consistent practice, your base level of consciousness naturally rises."
        },
        {
            title: "When You Feel Stuck",
            importance: "nuance",
            defaultExpanded: false,
            body: "**Layers of the Onion:** If a feeling won't budge, it's often because there is another feeling *about* the first one. You might be 'guilty' that you are 'angry.' Let go of the guilt first, and the anger will become easier to release.\n\n**Resisting the Release:** Sometimes we feel stuck because we are secretly enjoying the 'payoff' of the negative feeling. We might like feeling 'right' in our anger, or 'helpless' in our grief. You must want to be free more than you want to be right.\n\n**Practice for Stuckness:**\n1. Feel the stuckness as a physical pressure.\n2. Ask: 'Am I willing to let go of this resistance to letting go?'\n3. Even if the answer is 'No,' simply *look* at the 'No.'\n4. Surrender the expectation that it *should* be moving faster.\n5. Rest in the neutrality of just witnessing the stuckness."
        }
    ]
};

export const LEVEL_DOSSIER_DATA: Record<string, CategoryArticles> = {
    shame: {
        purpose: {
            title: "Purpose of Shame",
            spineBody: "Shame is the biological 'kill-switch' of the ego. It alerts you to a state of total social annihilation, where your standing in the tribe is so low that your very existence feels like a threat to yourself and others.",
            sections: [
                {
                    title: "The Evolutionary Mechanism",
                    importance: "core",
                    defaultExpanded: true,
                    body: "In primitive human societies, banishment was equivalent to a death sentence. Shame evolved as a radical survival mechanism: by forcing you to 'drop' your status, look down, and hide, it signals to the tribe that you are no longer a threat or a competitor. It is a desperate bid for safety through total submission."
                },
                {
                    title: "The Danger of This Level",
                    importance: "core",
                    defaultExpanded: true,
                    body: "This level is perilously proximate to death. Death may be chosen consciously as suicide or more subtly elected through neglect, indifference, carelessness, or accident. The shame-based personality is shy, withdrawn, introverted, and self-deprecating.\n\nEarly life experiences—neglect, physical, emotional, or sexual abuse—lead to shame and can warp the personality for a lifetime unless resolved. Shame, as Freud determined, produces neurosis. It is destructive to emotional and psychological health and makes one prone to physical illness."
                },
                {
                    title: "Healthy vs. Toxic Shame",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Healthy shame is a brief, sharp signal that you have violated a core value or social boundary; it prompts a quick correction. Toxic shame (Calibration 20) is the chronic, globalized belief that you *are* the mistake. It doesn't want you to fix your behavior; it wants you to stop existing."
                },
                {
                    title: "The God-View: Despising",
                    importance: "nuance",
                    defaultExpanded: false,
                    body: "At this level, the universe/God is perceived as a vindictive punisher who fundamentally despises you. This produces a state of 'Miserable' existence where one feels like a cosmic error that even the Creator wants eliminated."
                },
                {
                    title: "Clinical Notes",
                    importance: "nuance",
                    defaultExpanded: false,
                    body: "**When Shame Becomes Depression**\n\nSevere shame often manifests as clinical depression—immobilizing and life-threatening. It is characterized by helplessness and hopelessness, a dispirited state that is hellish to endure.\n\n**Dangerous Consciousness at Level 20**\n\nThe behavior of people whose consciousness is only in the 20s is dangerous. They are prone to hallucinations of an accusatory nature, as well as paranoia; some become psychotic or commit bizarre crimes. This is an extremely fragile state where the line between inner torment and outer destructiveness can blur.\n\n**Brain Chemistry**\n\nDepression at this level is accompanied by major changes in brain physiology and low levels of critical neurotransmitters such as norepinephrine and serotonin. The propensity to depression includes strong genetic factors and is often familial.\n\n**The Suicide Paradox**\n\nParadoxically, as a person comes out of severe apathy and gains more energy, they may become capable of suicide. This explains the clinical paradox that 'improvement' can temporarily increase risk. When the apathetic depressive begins to improve, the phase of agitated depression emerges.\n\n**When to Seek Help**\n\nDepressions of a serious degree require professional help, protection, and support. The loss of hope and will to live frequently occurs in lonely, isolated persons, the elderly, and those who have gone through severe stress such as divorce, financial disaster, or loss of loved ones. If you recognize yourself here, please reach out for support."
                }
            ],
            nextDoors: [
                { label: "The Felt Sense", targetRoom: "HUB", hotspot: "felt-sense" }
            ]
        },
        feltSense: {
            title: "The Felt Sense of Shame",
            spineBody: "The somatic experience of Level 20 is a 'Black Hole' in the center of being. It is the physical sensation of wanting to be invisible or to cease to have ever been born.",
            sections: [
                {
                    title: "The Thoughts of Shame",
                    importance: "core",
                    defaultExpanded: true,
                    body: "\"I'm a fundamentally broken person and everyone can see it.\"\n\n\"If they really knew me, they'd be disgusted.\"\n\n\"I'm such a mistake; I don't even deserve to take up this space.\"\n\n\"I just want to crawl into a hole and never come out again.\"\n\n\"Why am I like this? Everyone else seems so normal.\"\n\n\"I'm a burden to everyone I love.\"\n\n\"I should just stay quiet; anything I say will be wrong.\"\n\n\"I wish I could just disappear and cease to have ever existed.\"\n\n\"Nothing I ever do will be enough to fix how bad I am.\"\n\n\"I'm a fraud, and it's only a matter of time before I'm found out.\"\n\n\"I don't belong here, or anywhere.\"\n\n\"I am a 'non-person'; I don't count.\""
                },
                {
                    title: "Shame in Real Life",
                    importance: "core",
                    defaultExpanded: true,
                    body: "**The Ghosted Message**\n\"They didn't reply because they finally realized how boring I am. I should never have reached out.\"\n\n**The Grocery Store**\nYou drop a jar; everyone looks. \"I'm so pathetic and clumsy. Everyone is thinking about how I'm wasting their time.\"\n\n**The Meeting**\nYou have an idea but stay silent. \"If I speak, they'll see how little I actually know. Better to stay invisible.\"\n\n**The Compliment**\nSomeone says you did a great job. \"They're just being nice because they pity me. If they saw the real me, they'd take it back.\"\n\n**The Social Media Scroll**\nSeeing friends out without you. \"I'm the one person who doesn't fit in. There's something wrong with me that keeps me from being like them.\"\n\n**The Career Mistake**\nYou send an email with a typo. \"I'm completely incompetent. My boss is definitely looking for a way to fire me now.\"\n\n**The Mirror**\nCatching your reflection and wanting to hide. \"I look like a monster. No wonder people look away.\"\n\n**The Late Arrival**\nWalking into a room where people are already seated. \"Everyone is looking at me and thinking about how disrespectful and messy I am.\"\n\n**The Boundary**\nYou say 'no' to a request. \"I'm such a selfish person. I'm going to lose this friend because I'm not good enough to help them.\"\n\n**The Quiet Group**\nYou haven't spoken in 10 minutes. \"If I speak now, it'll be weird. I'll just keep fading into the background until I can leave.\"\n\n**The Gift**\nReceiving a thoughtful present. \"I don't deserve this. I haven't done enough to earn this kind of kindness. I'm a fraud.\"\n\n**The Success of Others**\nSeeing someone from your past doing well. \"I'm a failure. I've wasted my life while they've actually become someone. I should hide so they don't see me.\""
                },
                {
                    title: "Body Map: The Hollow",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Physically, shame often manifests as a crushing weight or a cold hollow in the solar plexus and chest. There is a desire to hunch the shoulders, pull the head down (hanging the head), and avoid eye contact. The energy is 'descending'—pulling the life force down toward the earth."
                },
                {
                    title: "The Breath of Lead",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Breathing in deep shame is shallow, restricted, and labored. The body feels heavy, as if the gravity of the Earth has increased tenfold. Every movement feels like an enormous effort against an invisible pressure."
                },
                {
                    title: "Temperature & Skin",
                    importance: "nuance",
                    defaultExpanded: false,
                    body: "Shame results in a peculiar coldness in the extremities, often accompanied by the 'hot flush' of humiliation (vasodilation) when the ego is exposed. It is the body's internal battle between hiding (cold/withdrawal) and the heat of being 'found out'."
                }
            ],
            nextDoors: [
                { label: "The Traps", targetRoom: "HUB", hotspot: "traps" }
            ]
        },
        traps: {
            body: "The ego's primary survival mechanism in shame is to 'make itself small' to avoid further pain.",
            chips: [
                {
                    label: "Hiding",
                    title: "The Trap: Hiding",
                    spineBody: "Hiding is the ego's primary defense at calibration 20. If the 'bad self' is not seen, it cannot be hurt, rejected, or eliminated.",
                    sections: [
                        {
                            title: "The Invisibility Impulse",
                            importance: "core",
                            defaultExpanded: true,
                            body: "The hiding impulse manifests as social withdrawal, silence, and the wearing of 'psychological masks.' You stay in the shadows to avoid the 'gaze of judgment.' The cost is total isolation—the very connection that could heal the shame is the one thing you run from."
                        },
                        {
                            title: "Secret Lives",
                            importance: "nuance",
                            defaultExpanded: false,
                            body: "Hiding often leads to a split personality: the visible 'perfectionist' mask and the hidden 'shameful' reality. This creates a feedback loop where the secrecy itself becomes proof of your 'wrongness,' driving the calibration even lower."
                        }
                    ],
                    nextDoors: [
                        { label: "The Exit", targetRoom: "HUB", hotspot: "exits" }
                    ]
                },
                {
                    label: "Shrinking",
                    title: "The Trap: Shrinking",
                    spineBody: "Shrinking is the energetic counterpart to hiding. It is the reduction of your presence, voice, and power to the absolute minimum.",
                    sections: [
                        {
                            title: "Biological Freeze",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Shrinking is a version of the 'freeze' response. By minimizing your needs, you hope to survive without being noticed. You stop asking for what you want, you stop taking up space, and you slowly allow your life to wither until it occupies a tiny, 'safe' closet."
                        }
                    ],
                    nextDoors: [
                        { label: "The Way Out", targetRoom: "HUB", hotspot: "exits" }
                    ]
                },
                {
                    label: "Identification",
                    title: "The Trap: Identification",
                    spineBody: "The most dangerous aspect of Shame is the belief that 'I AM the defect.'",
                    sections: [
                        {
                            title: "Ontological Mistake",
                            importance: "core",
                            defaultExpanded: true,
                            body: "In Guilt (30), you feel: 'I made a mistake.' In Shame (20), the ego believes: 'I am a mistake.' This is an ontological error—you have confused your behavior or your social standing with your essential being. Once you identify as 'worthless,' any positive action feels like an act of fraud."
                        }
                    ],
                    nextDoors: [
                        { label: "Reclaim Worth", targetRoom: "HUB", hotspot: "exits" }
                    ]
                },
                {
                    label: "Perfectionism",
                    title: "The Trap: The Perfectionist Mask",
                    spineBody: "Overcompensation through rigid perfectionism and moral crusading.",
                    sections: [
                        {
                            title: "The Brittle Exterior",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Some shame-based individuals compensate by developing a perfectionist exterior—becoming driven, rigid, and intolerant. This mask creates the illusion of control but is brittle. Any crack in the facade triggers the underlying shame even more intensely.\n\nThe perfectionist believes: 'If I am flawless, no one can attack me.' But this strategy is exhausting and ultimately fails, because perfection is impossible and the inner 'bad self' is ever-present beneath the surface."
                        }
                    ],
                    nextDoors: [
                        { label: "The Way Out", targetRoom: "HUB", hotspot: "exits" }
                    ]
                },
                {
                    label: "Vigilante",
                    title: "The Trap: The Vigilante",
                    spineBody: "Projecting your hidden shame onto others and attacking them for it.",
                    sections: [
                        {
                            title: "Righteous Projection",
                            importance: "core",
                            defaultExpanded: true,
                            body: "The ego may escape its own shame by projecting it outward. This creates 'moral extremists' who form vigilante groups, attacking in others the very 'badness' they cannot face in themselves. The projection feels righteous, but it is merely displaced self-hatred.\n\nNotorious examples include serial killers who acted out of shame, hate, and sexual moralism with the justification of punishing 'bad' people. The vigilante feels purified by destroying the 'evil' they see outside—never realizing it is their own shadow."
                        }
                    ],
                    nextDoors: [
                        { label: "The Way Out", targetRoom: "HUB", hotspot: "exits" }
                    ]
                },
                {
                    label: "Domino Effect",
                    title: "The Trap: The Domino Effect",
                    spineBody: "Shame destabilizes the entire personality, triggering other negative emotions.",
                    sections: [
                        {
                            title: "Cascade of Negativity",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Because shame operates at such a fundamental level (identity), it pulls down the whole personality and makes you vulnerable to false pride, anger, guilt, and other negative emotions. One shame spiral can trigger a cascade of emotional instability.\n\nThis is why shame is one of the lowest levels on the Map of Consciousness—it undermines the foundation upon which all other emotions rest."
                        }
                    ],
                    nextDoors: [
                        { label: "The Way Out", targetRoom: "HUB", hotspot: "exits" }
                    ]
                }
            ]
        },
        exits: {
            body: "Transcending shame requires the radical realization that your intrinsic worth is divine and independent of all form.",
            chips: [
                {
                    label: "Humility",
                    title: "The Exit: Humility",
                    spineBody: "True humility is not self-abasement; it is the simple admission of ignorance. 'I don't know' is the most powerful tool for leaving level 20.",
                    sections: [
                        {
                            title: "Right-Sized Being",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Shame is a form of narcissism—it assumes the whole world is looking at you and judging you. Humility realizes that you are but one small part of life. By admitting you don't know why you are the way you are, or how to fix it, you stop defending the 'bad self' and allow Grace to enter."
                        },
                        {
                            title: "The Beginner's Mind",
                            importance: "core",
                            defaultExpanded: false,
                            body: "Approach your 'vulnerability' with curiosity instead of judgment. If you are 'worthless,' you have nothing left to lose. This creates a strange freedom to start entirely fresh, without the baggage of past identity."
                        }
                    ]
                },
                {
                    label: "Surrender",
                    title: "The Exit: Surrender",
                    spineBody: "The total relinquishment of the 'I' that is 'bad.'",
                    sections: [
                        {
                            title: "Surrendering to Mercy",
                            importance: "core",
                            defaultExpanded: true,
                            body: "In the depth of despair, the choice is either death or surrender. By surrendering the very idea that you are a separate, defective self to a higher power (Love/God/The Universe), the heavy weight of the 'Miserable Self' is lifted by Grace. You don't fix the shame; you let go of the one who is shamed."
                        },
                        {
                            title: "The Dualities of Shame",
                            importance: "core",
                            defaultExpanded: false,
                            body: "To transcend shame, recognize the destructive pole and choose its opposite:\n\n• **Self-punitive** → Self-forgiveness\n• **Self as worthless** → Affirm the gift of life\n• **Condemn** → Forgive\n• **Self-hatred** → Self-compassion\n• **Unlovable** → Worth as a child of God\n• **Error unforgivable** → Error as lesson\n• **Focus on self** → Focus on others\n• **'I should have'** → 'I was not able to then'\n• **Shrink, hide** → Be visible\n• **End of the road** → Beginning of the new\n\nEach shift represents a small step from the pull of the negative to the choice of the positive."
                        }
                    ]
                },
                {
                    label: "The Flip Point",
                    title: "The Exit: The Flip Point",
                    spineBody: "At the absolute bottom, heaven and hell are one-tenth of an inch apart.",
                    sections: [
                        {
                            title: "The Moment of Transformation",
                            importance: "core",
                            defaultExpanded: true,
                            body: "At the bottom of despair, there is exhaustion of energy and even the will to survive. Paradoxically, it is often only in the very pits of Hell that the ego can finally be surrendered.\n\nIn that moment of complete hopelessness, the soul may cry: 'If there is a God, I ask for help'—and a great transformation occurs.\n\nThis confirms the Zen teaching: 'Heaven and hell are only one-tenth of an inch apart.' The door swings open not through effort, but through total surrender of the 'one who is suffering.'"
                        }
                    ]
                },
                {
                    label: "Dark Night",
                    title: "The Exit: The Dark Night of the Soul",
                    spineBody: "Feeling abandoned by God is actually the ego's dark night, not the soul's.",
                    sections: [
                        {
                            title: "The Ego's Last Stand",
                            importance: "core",
                            defaultExpanded: true,
                            body: "The state of feeling abandoned by God produces a hellish, timeless depression. But here is the crucial insight: what is described as 'the dark night of the soul' is actually the dark night FOR THE EGO.\n\nThis can be a sign of significant spiritual progress—the ego is fighting for its survival by making you believe that letting go means death. The ego's basic illusion is that it IS God and that without it, death will occur."
                        },
                        {
                            title: "The Safety of Surrender",
                            importance: "core",
                            defaultExpanded: false,
                            body: "In the pits of spiritual despair and black hopelessness, the necessary Knowingness is this: spiritually, all fear is illusion.\n\nThe reason it is safe to let go completely of all that one holds dear, along with the belief that the inner core of the ego is the very source of life itself, is because IT IS NOT THE SOURCE—no matter how intensely the experience may seem.\n\nWith the surrender of what seems to be the irreducible core of one's existence, the door swings open and the Presence shines forth with the Radiance of Divinity."
                        }
                    ]
                },
                LETTING_GO_ARTICLE
            ]
        },
        deepDive: {
            title: "Deep Dive: Karma & Spiritual Accountability",
            spineBody: "Understanding the karmic origins of shame and how spiritual accountability works across lifetimes.",
            sections: [
                {
                    title: "Karmic Despair",
                    importance: "core",
                    defaultExpanded: true,
                    body: "Karmic despair is often experienced via major tragic events or catastrophes. There is also the collective human group karma that is merely the consequence of being human. It may be expressed as group conditions that are ethnic, religious, geographic, or aligned in other ways due to acts or agreements in the past.\n\nKarma is linear, propagates via the soul, and is inherited as the consequence of significant acts of the will. The likelihood of such seemingly negative consequences can readily be deduced from human history, which frequently involved slaughter of the innocent and willful acts of desecration."
                },
                {
                    title: "The Nature of Karma",
                    importance: "core",
                    defaultExpanded: false,
                    body: "The term 'karma' is not used specifically in Western religions, but it is nevertheless a basic reality as spiritual accountability that determines the fate of the soul. Everyone already has a specific calibrated level of consciousness at birth.\n\nWithout an understanding of karma, individual circumstances would seem accidental or capricious. Consciousness research demonstrates that all Creation is a reflection of Divine Harmony, Justice, and Balance. Each individual has to proceed from wherever they find themselves in the evolutionary process."
                },
                {
                    title: "Redemption Through Positive Karma",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Positive karma (good works, prayer, selfless service, benevolent acts) can compensate for and undo negative ('bad') karma. In this process, 'merit' accrues, which at times can even be drawn against when confronting vicissitudes.\n\nSpiritual progress ensues automatically from choosing good will, forgiveness, and lovingness as a way of being in the world at large—rather than viewing it as a gain-seeking transaction.\n\nThe key insight: karma really means accountability. Every entity is answerable to the universe."
                },
                {
                    title: "The Luciferic Temptation",
                    importance: "nuance",
                    defaultExpanded: false,
                    body: "As people evolve spiritually, each ascended level has its corollary tests or temptations. The best known are wealth, power, and prestige ('pride goeth before the fall').\n\nThis is clinically described as the 'Luciferic Temptation' of power for its own sake or power over others. The source of the error is ascribing the source of power to the ego 'I' instead of to Divinity.\n\nShame can also be the consequence of the abuse of spiritual/religious status and influence, as seen in the catastrophes of fallen gurus who once had worldwide acclaim."
                },
                {
                    title: "Optimal Conditions",
                    importance: "nuance",
                    defaultExpanded: false,
                    body: "From previous studies, it was learned that everyone is born under optimal conditions for karmic opportunities. Therefore, it is wise to judge not, for what appears as misery or catastrophe may be the doorway to liberation for those who have negative karma to undo.\n\nThus, seemingly catastrophic events may be the very essential and necessary elements for the evolution of the soul."
                }
            ]
        }
    },
    guilt: {
        feltSense: {
            title: "Felt Sense",
            spineBody: "Guilt is the active vibration of self-attack. Unlike the paralysis of Shame, Guilt is a busy energy—constantly calculating, correcting, and punishing.",
            sections: [
                {
                    title: "The Thoughts of Guilt",
                    importance: "core",
                    defaultExpanded: true,
                    body: "\"I should have known better.\"\n\n\"It's all my fault; I've ruined everything.\"\n\n\"If I hadn't said that, they would still be here.\"\n\n\"I don't deserve to be happy after what I've done.\"\n\n\"I'm carrying a debt I can never repay.\"\n\n\"I have to work twice as hard to make up for my mistakes.\"\n\n\"If I don't punish myself, something worse will happen.\"\n\n\"I'm a fraud for letting people think I'm a 'good person'.\"\n\n\"I am responsible for everyone else's pain.\"\n\n\"I should have been more, done more, known more.\""
                },
                {
                    title: "Guilt in Real Life",
                    importance: "core",
                    defaultExpanded: true,
                    body: "**The Past Loop**\nLying in bed at 2 AM, reliving a mistake you made three years ago and feeling the exact same sting of regret. \"How could I have been so stupid?\"\n\n**The Rest Day**\nYou're trying to relax on a Sunday, but a voice won't stop whispering: \"You should be doing something productive. You're wasting time. You haven't earned this rest.\"\n\n**The Gift**\nYou receive a thoughtful present and immediately feel a heavy weight. \"I haven't done enough for them. I don't deserve this kindness. Now I'm in their debt.\"\n\n**The Team Mistake**\nYou notice a small error in a project. \"The whole team is going to suffer because of me. I'm a burden and I've let everyone down.\"\n\n**The Unanswered Text**\nYou forgot to reply to a friend. \"I'm a terrible friend. They probably think I'm ignoring them. I've ruined the relationship over something so small.\"\n\n**The Success of Others**\nSeeing a friend succeed while you struggle. \"I'm failing because I didn't work hard enough. I deserve to be behind. I should have done what they did.\""
                },
                {
                    title: "The Somatic Weight",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Guilt often manifests as a 'heavy' pressure in the chest or solar plexus. It feels like 'The Breath of Lead'—shallow and labored. It is also a primary driver of psychosomatic illness and accident-proneness; the mind believes it 'deserves' to suffer, and the body complies by getting sick or making mistakes."
                }
            ],
            nextDoors: [
                { label: "The Traps", targetRoom: "HUB", hotspot: "traps" },
                { label: "The Way Out", targetRoom: "HUB", hotspot: "exits" }
            ]
        },
        purpose: {
            title: "Purpose",
            spineBody: "In its healthy form, Guilt is a developmental tool for correction and social cohesion. It is a 'moral compass' that helps an immature mind navigate boundaries.",
            sections: [
                {
                    title: "The Moral Compass",
                    importance: "core",
                    defaultExpanded: true,
                    body: "The original purpose of guilt is to teach accountability. For a child or someone at an early stage of development, guilt acts as an externalized conscience, helping them realize that their actions have consequences for others. It keeps the primitive 'animal instincts' in check until true empathy and love can take over."
                },
                {
                    title: "Guilt as Manipulation",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Guilt is often exploited for control. We see this in propaganda, which seeks to manipulate the public by artificial guilt induction—'white guilt,' 'colonial guilt,' 'class guilt.' This is a major tool of political and religious manipulation.\n\nRelationships also use guilt as currency: 'After all I've done for you...' or 'If you really loved me, you would...' The purpose of recognizing this is not to become cynical, but to see that guilt is a TOOL, not a truth."
                },
                {
                    title: "Sin = Error",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Mistakes are 'sin' only because they represent evolutionary 'errors' in that they fail to serve life in a positive way. They are not intrinsically 'evil' or 'wicked' unless so contextualized.\n\nThe core teaching is that the judgmentalizing of error is optional. To be 'guilty' merely means one has made a mistake. One can then choose how to react to that information: with harsh self-condemnation, or with correction and growth."
                },
                {
                    title: "Clinical Notes",
                    importance: "nuance",
                    defaultExpanded: false,
                    body: "**Guilt Provokes Rage**\nGuilt provokes rage, and killing is frequently its expression. Capital punishment is an example of how killing gratifies a guilt-ridden populace. The guilt-ridden person often becomes vindictive, harsh, intolerant, and condemning of others.\n\n**Hate from Guilt**\nThe most significant clinical aspect of guilt is that it gives rise to hate. Guilt-ridden people are often vindictive, harsh, intolerant, and condemning of others. They project onto the world the self-hatred they cannot face.\n\n**Psychosomatic Illness**\nGuilt is a major cause of psychosomatic disease. When the mind believes it 'deserves' to suffer, the body dutifully obliges. This includes 'accidental' injuries and 'bad luck' that seems to follow the guilt-ridden.\n\n**Important**: If you are stuck in a loop of self-punishment that is affecting your health or relationships, please seek support from a qualified therapist or counselor."
                }
            ]
        },
        traps: {
            body: "The belief that suffering is payment for 'sin.'",
            chips: [
                {
                    label: "Self-Punishment",
                    title: "The Trap: Self-Punishment",
                    spineBody: "The ego aggressively punishes itself to forestall external judgment. It believes that if it hurts itself enough, 'God' or others won't have to.",
                    sections: [
                        {
                            title: "Deserved Suffering",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Self-punishment takes many forms: self-sabotage, choosing painful relationships, or even 'accidental' injuries. The ego secretly hopes that by being miserable, it can pay off its 'moral debt' and eventually be forgiven. But the ledger of the ego is never satisfied."
                        }
                    ]
                },
                {
                    label: "Remorse",
                    title: "The Trap: Remorse",
                    spineBody: "The 'If Only' loop that keeps the energy stuck in the past.",
                    sections: [
                        {
                            title: "The Past as Prison",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Remorse is a substitute for action. By wallowing in how 'bad' you were, you avoid the responsibility of current change. The ego prefers to be the 'hero of the tragedy' rather than the simple person who made a mistake and moved on."
                        }
                    ]
                },
                {
                    label: "The Sin-Hater",
                    title: "The Trap: Projection",
                    spineBody: "Projecting internal guilt onto others to justify hatred.",
                    sections: [
                        {
                            title: "Indignation",
                            importance: "core",
                            defaultExpanded: true,
                            body: "To escape the pain of inner guilt, the ego projects it outward. This results in 'righteous' indignation and the demonization of others. The 'sin-hater' is often merely attacking in others the very thing they cannot forgive in themselves."
                        }
                    ]
                },
                {
                    label: "The Superego",
                    title: "The Trap: The Internalized Judge",
                    spineBody: "The harsh, critical inner parent that was introjected in childhood.",
                    sections: [
                        {
                            title: "The Borrowed Conscience",
                            importance: "core",
                            defaultExpanded: true,
                            body: "The superego is not your true conscience—it is a conglomerate of punitive, negative voices that were introjected (swallowed whole) during childhood from critical parents, teachers, and authority figures.\n\nIt speaks in absolute terms: 'You MUST,' 'You SHOULD,' 'You OUGHT TO.' It is the voice of shame, blame, and guilt, and it is not the voice of your true Self."
                        },
                        {
                            title: "Distinguishing True Conscience",
                            importance: "core",
                            defaultExpanded: false,
                            body: "How to tell the superego from true conscience:\n\n• **Superego**: Harsh, punitive, shaming, absolute, comes from fear.\n• **True Conscience**: Gentle, corrective, encouraging, comes from love.\n\nThe superego says 'You're worthless for making that mistake.' True conscience says 'That action didn't serve you—let's grow from it.'"
                        }
                    ]
                },
                {
                    label: "Gothic Penance",
                    title: "The Trap: Suffering for Forgiveness",
                    spineBody: "The belief that one must suffer enough to 'earn' forgiveness.",
                    sections: [
                        {
                            title: "The Ego's Ledger",
                            importance: "core",
                            defaultExpanded: true,
                            body: "This is the trap of 'Gothic Penance'—the belief that by suffering intensely, one can balance out 'spiritual debts' and earn forgiveness.\n\nThe truth is that no amount of suffering 'pays off' guilt. God/Divinity does not keep a ledger of debts. The ego keeps the ledger, and it is the ego that refuses to forgive. The 'penance' is a kind of spiritual haggling that keeps the ego in control."
                        }
                    ]
                },
                {
                    label: "Wallowing",
                    title: "The Trap: Guilt as Indulgence",
                    spineBody: "Using guilt as a substitute for real change.",
                    sections: [
                        {
                            title: "The Illusion of Virtue",
                            importance: "core",
                            defaultExpanded: true,
                            body: "A nonobvious but common trap is wallowing—using the feeling of guilt as a substitute for actual change or restitution. The ego feels 'virtuous' for feeling bad, as if the emotion itself were an action.\n\n'Look how bad I feel—surely that counts for something!' But feeling guilty is not the same as making amends. The wallower stays stuck in the emotion to avoid the harder work of transformation."
                        }
                    ]
                },
                {
                    label: "The Ego's Juice",
                    title: "The Trap: Secret Pleasure in Pain",
                    spineBody: "The hidden payoff of negative emotions.",
                    sections: [
                        {
                            title: "Addiction to Suffering",
                            importance: "core",
                            defaultExpanded: true,
                            body: "A difficult truth: the ego gets 'juice' (a secret sense of aliveness and self-importance) from negative emotions. Guilt, resentment, and self-pity all provide a strange sense of identity and drama.\n\nTo let go of guilt would mean becoming 'nobody.' The ego would rather be a 'guilty sinner' than a neutral being at peace. Recognizing this hidden payoff is essential for true release."
                        }
                    ]
                }
            ]
        },
        exits: {
            body: "Moving from self-punishment to restitution and forgiveness.",
            chips: [
                {
                    label: "Forgiveness",
                    title: "The Exit: Forgiveness",
                    spineBody: "Forgiveness is the simple admission that humans are limited and ignorant.",
                    sections: [
                        {
                            title: "Recontextualization",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Mistakes are not evidence of evil, but of developmental error. As Socrates said, 'All men seek the good, but are unable to discern true from false.' By seeing your past actions as the result of ignorance rather than malice, the energy of guilt can be surrendered to the energy of learning."
                        },
                        {
                            title: "Self-Forgiveness",
                            importance: "core",
                            defaultExpanded: false,
                            body: "Let go of the 'I' that made the mistake. The person you were then is not the person you are now. By surrendering the past identity of the 'sinner,' you allow Grace to heal the present moment."
                        },
                        {
                            title: "The Dualities of Guilt",
                            importance: "nuance",
                            defaultExpanded: false,
                            body: "For transcendence, identify and surrender the polarities that keep guilt in place:\n\n• **Attraction to**: Self-punishment, remorse, 'earning' forgiveness, moral superiority, being 'right' about being wrong.\n\n• **Aversion to**: Letting go of the past, forgiving self, being 'nobody,' accepting grace freely, not having control.\n\nSurrender both sides of each duality to find freedom."
                        }
                    ]
                },
                {
                    label: "The Transformation",
                    title: "The Exit: Spiritual Will",
                    spineBody: "The transformation from hate to will is the pathway up from Guilt.",
                    sections: [
                        {
                            title: "Will: The Antidote to Hate",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Research has confirmed that the transformation out of guilt (and its byproduct, hate) is primarily through spiritual Will—the choice to be forgiving, to see things differently, to prefer peace to being 'right.'\n\nThis is not willpower (forcing), but willingness—the gentle yet firm decision to let go of resentments and self-condemnation because holding them hurts more than releasing them."
                        },
                        {
                            title: "The Mechanics of Will",
                            importance: "core",
                            defaultExpanded: false,
                            body: "Will operates by choosing what to identify with. At each moment, you can ask: 'Do I want to be at peace, or do I want to be right about being guilty?'\n\nThe power of decision is the power of creation. By deciding to release the guilty self-image, you make space for a new self to arise. This is the spiritual 'born again' process—not a religious cliché, but a real psychological death and rebirth."
                        }
                    ]
                },
                {
                    label: "No Justified Resentments",
                    title: "The Exit: Releasing the 'Right to Hate'",
                    spineBody: "The recognition that no resentment is ever truly justified.",
                    sections: [
                        {
                            title: "The Price of Resentment",
                            importance: "core",
                            defaultExpanded: true,
                            body: "A core teaching is that there are no justified resentments—not because wrongdoing doesn't exist, but because holding resentment harms the holder far more than the offender.\n\nResentment is drinking poison and waiting for the other person to die. The willingness to let go of all resentments—even the 'justified' ones—is the fastest way out of the guilt/hate trap."
                        },
                        {
                            title: "A Prayer for Release",
                            importance: "nuance",
                            defaultExpanded: false,
                            body: "A simple practice:\n\n'I am willing to see this differently. I am willing to release my grip on being right. I am willing to forgive, even if I don't feel it yet. I am willing to be at peace.'\n\nWillingness is enough. The actual feeling of forgiveness follows the decision to forgive, not the other way around."
                        }
                    ]
                },
                LETTING_GO_ARTICLE
            ]
        },
        deepDive: {
            title: "Deep Dive: The Politics of Guilt & Hate",
            spineBody: "Understanding how unconscious guilt shapes collective behavior and how to transcend victim/perpetrator dynamics.",
            sections: [
                {
                    title: "Unconscious Guilt",
                    importance: "core",
                    defaultExpanded: true,
                    body: "At this level, guilt is mostly unconscious and therefore not open to inspection or amelioration. This is critical: most guilt-driven behavior is invisible to the person doing it.\n\nPeople at this level don't think 'I feel guilty'; instead, they experience chronic anxiety, self-sabotage, bad luck, and a vague sense that something is 'wrong' with them. The guilt is the water they swim in—too pervasive to see."
                },
                {
                    title: "The Perpetrator/Victim Split",
                    importance: "core",
                    defaultExpanded: false,
                    body: "A notable observation is that the perpetrator and victim feed off each other. They are two sides of the same coin.\n\nAt this level of consciousness, the roles are interchangeable: the victim gains a 'right' to hate (and thus feel powerful), while the perpetrator may secretly enjoy the guilt (feeling 'important' through being 'bad').\n\nBoth positions are traps. True healing requires stepping outside the entire victim/perpetrator paradigm."
                },
                {
                    title: "Divine Justice",
                    importance: "core",
                    defaultExpanded: false,
                    body: "An important truth: The universe is self-balancing. Wrongdoing creates consequences automatically through the impersonal mechanism of karma/spiritual accountability.\n\nThis means that personal revenge and hatred are unnecessary—the universe handles justice far more precisely than any human ever could. The desire to punish oneself or others comes from a lack of faith in this self-correcting nature of reality."
                },
                {
                    title: "The Balance of Guilt",
                    importance: "nuance",
                    defaultExpanded: false,
                    body: "An overlooked aspect is that guilt can sometimes prevent worse behavior. For those at very low consciousness levels, guilt may be the only thing stopping antisocial actions.\n\nAs one evolves, the motivator shifts from fear/guilt to love/service. But one should not try to 'transcend' guilt before the replacement values are in place. The goal is not to become a guiltless sociopath, but to evolve to a place where love motivates behavior more than fear of punishment."
                },
                {
                    title: "Collective Guilt Manipulation",
                    importance: "nuance",
                    defaultExpanded: false,
                    body: "A sobering observation is that guilt is weaponized in politics. Propaganda often involves artificial guilt-induction to control populations.\n\n'White guilt,' 'colonial guilt,' 'class guilt,' 'environmental guilt'—these are often manufactured emotional states designed to manipulate behavior, rather than genuine expressions of conscience.\n\nRecognizing manipulation is not the same as denying real wrongdoing. The key is to distinguish between genuine conscience (which leads to positive action) and induced guilt (which leads to paralysis and resentment)."
                }
            ]
        }
    },
    apathy: {
        feltSense: {
            title: "Felt Sense",
            spineBody: "Apathy is the energy of resignation and surrender to defeat. It is the 'I can't' that masks a deep-seated hopelessness.",
            sections: [
                {
                    title: "The Thoughts of Apathy",
                    importance: "core",
                    defaultExpanded: true,
                    body: "\"What's the use? It won't work anyway.\"\n\n\"I'm just too tired to care anymore.\"\n\n\"Nobody can help me; nothing can be done.\"\n\n\"Everything is boring and pointless.\"\n\n\"I'll just stay in bed today. It doesn't matter.\"\n\n\"I don't even have the energy to explain why I'm sad.\"\n\n\"The world is a cold, dark place.\"\n\n\"I'm just a burden to everyone.\""
                },
                {
                    title: "Apathy in Real Life",
                    importance: "core",
                    defaultExpanded: true,
                    body: "**The Empty Inbox**\nYou look at 50 unread emails and just close the tab. \"I can't deal with any of this. Let it all pile up.\"\n\n**The Dusty Gym Shoes**\nLooking at your shoes by the door. \"I should exercise, but why? I'll probably just fail. It won't make a difference to how I feel anyway.\"\n\n**The Social Invite**\nA friend asks you to get coffee. \"I don't even have the energy to get dressed. I'll just say I'm busy. They'll stop asking eventually, and that's fine.\"\n\n**The 'Fine' Answer**\nSomeone asks how you are. \"Fine,\" you say, while feeling like a hollow shell. You don't even want to go into it because it's too much effort.\n\n**The Midnight Scroll**\nMindlessly scrolling through a feed for 3 hours, not even reading the posts. Total numbness and a lack of will to do anything else."
                },
                {
                    title: "The Gray Veil",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Physically, apathy feels like a 'frozen' or 'gray' energy. There is a lack of muscle tone, a blank stare, and a sensation of being disconnected from the body. The life force is so low that even swallowing food or tracked movement of the eyes can feel like an impossible task."
                }
            ],
            nextDoors: [
                { label: "The Traps", targetRoom: "HUB", hotspot: "traps" },
                { label: "The Way Out", targetRoom: "HUB", hotspot: "exits" }
            ]
        },
        purpose: {
            title: "Purpose",
            spineBody: "In its biological sense, Apathy is a state of conservation—a 'hibernation' of the soul to prevent total burnout.",
            sections: [
                {
                    title: "Summoning Aid",
                    importance: "core",
                    defaultExpanded: true,
                    body: "The evolutionary purpose of apathy is to signal absolute helplessness. By 'giving up,' the individual forces the environment or the tribe to intervene. It is a desperate cry for care that bypasses the ego's pride."
                },
                {
                    title: "The Refusal of Life",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Apathy represents a rejection of the gift of existence itself—a form of self-indulgence without love or concern. In this state, there is no care for others or even appropriate concern for one's own quality of life.\n\nThis same attitude gets projected onto the Universe, which is then perceived as rejecting, uncaring, and unavailable. The withdrawal from life creates a perception that life has withdrawn from you."
                },
                {
                    title: "The Hidden 'I Won't'",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Beneath what appears as 'I can't' often lies a concealed 'I won't.' There is a subtle but strong internal resistance—a disguised stubbornness and pride.\n\nThe ego is so persistent in this position that it often takes a major life crisis to shake it loose. The apathetic stance is paradoxically a very rigid one, dressed up as weakness."
                }
            ]
        },
        traps: {
            body: "The belief that effort is futile.",
            chips: [
                {
                    label: "Learned Helplessness",
                    title: "The Trap: Learned Helplessness",
                    spineBody: "The belief that because you failed in the past, failure is an inevitable law of your existence.",
                    sections: [
                        {
                            title: "The Past as Oracle",
                            importance: "core",
                            defaultExpanded: true,
                            body: "In this trap, the mind uses past defeats to justify current inaction. It projects 'I can't' onto every new opportunity, effectively killing the future before it happens."
                        }
                    ]
                },
                {
                    label: "Victim Identity",
                    title: "The Trap: Victim Identity",
                    spineBody: "The ego finds a strange 'comfort' in being the victim, as it cancels all responsibility.",
                    sections: [
                        {
                            title: "The Blame Payoff",
                            importance: "core",
                            defaultExpanded: true,
                            body: "By staying in Apathy, the ego can blame the Universe, society, or parents for its condition. This 'face-saving' maneuver prevents the shame of failure by claiming that one never even had a chance."
                        },
                        {
                            title: "The Dualistic Split",
                            importance: "core",
                            defaultExpanded: false,
                            body: "Responsibility is rejected and replaced by a chronic victim mentality that projects the 'cause' onto external circumstances. The victim and perpetrator roles become interchangeable—both are positions that avoid true accountability and growth."
                        }
                    ]
                },
                {
                    label: "The Hidden Pride",
                    title: "The Trap: Concealed Stubbornness",
                    spineBody: "What looks like helplessness is often disguised ego resistance.",
                    sections: [
                        {
                            title: "The 'I Won't' Beneath 'I Can't'",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Behind the facade of helplessness lies a concealed stubbornness—a refusal to change that is dressed up as inability. The ego would rather maintain the 'poor me' position than risk the vulnerability of trying and possibly failing.\n\nThis is why apathy can be so resistant to help. It's not that the person CAN'T accept help—they often WON'T, because doing so would threaten their victim identity."
                        }
                    ]
                },
                {
                    label: "The Downward Spiral",
                    title: "The Trap: Progressive Collapse",
                    spineBody: "Apathy breeds more apathy through a self-perpetuating cycle.",
                    sections: [
                        {
                            title: "The Compound Effect",
                            importance: "core",
                            defaultExpanded: true,
                            body: "The apathetic condition tends to compound itself. It may lead to chronic invalidism, dependent relationships, and self-centered passivity. Substances or escapism may provide temporary relief from the inner barrenness.\n\nWhen the temporary escape wears off, the return of emptiness becomes even more intolerable, creating a lifestyle of avoidance. Each descent compounds until a severe crisis—job loss, broken relationships, health collapse—forces a confrontation."
                        }
                    ]
                },
                {
                    label: "Infectious Indifference",
                    title: "The Trap: Collective Apathy",
                    spineBody: "Apathy spreads through communities and systems.",
                    sections: [
                        {
                            title: "The 'What's The Use?' Contagion",
                            importance: "core",
                            defaultExpanded: true,
                            body: "'What's the use?' is an infectious attitude. Unrecognized apathy in the form of inertia underlies many social problems—the failure of systems to 'take care' and assume responsibility.\n\nThis can be endemic in regions, organizations, and relationships. Dead energy attracts more dead energy. The awareness of this contagion is the first step to breaking free from collective hopelessness."
                        }
                    ]
                }
            ]
        },
        exits: {
            body: "Moving from 'I can't' to 'I won't' is the first step toward freedom.",
            chips: [
                {
                    label: "Willingness",
                    title: "The Exit: Willingness",
                    spineBody: "Willingness is the decision to try, even if success seems impossible.",
                    sections: [
                        {
                            title: "Choosing to Choose",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Apathy is cured by the injection of Will. This begins with the admission: 'I am choosing to stay stuck.' This shift from 'victim' to 'chooser' (even a chooser of stagnation) immediately raises the energy level and opens the door to Courage."
                        },
                        {
                            title: "Asking for Help",
                            importance: "core",
                            defaultExpanded: false,
                            body: "Admit powerlessness. By saying 'I can't, but maybe something else can,' you allow external energy (Grace, a mentor, or a group) to pull you out of the gray pit."
                        }
                    ]
                },
                {
                    label: "Divine Will",
                    title: "The Exit: Invoking a Higher Power",
                    spineBody: "When personal willpower fails, spiritual Will can provide the power for transformation.",
                    sections: [
                        {
                            title: "Beyond Personal Willpower",
                            importance: "core",
                            defaultExpanded: true,
                            body: "There is a crucial distinction between personal 'willpower' (which is mental and psychological) and spiritual Will (which is of a much higher order). In an apathetic state, personal willpower is weak and ineffectual—the tank is empty.\n\nSpiritual Will, however, operates at a level beyond the ego. It can be accessed through genuine surrender, prayer, or sincere entreaty to the Universe/Divinity. This is what makes 'man's calamity' into 'opportunity'—the very desperation that breaks the ego's grip."
                        },
                        {
                            title: "The Paradox of Defeat",
                            importance: "nuance",
                            defaultExpanded: false,
                            body: "Sometimes what appears as defeat—loss, illness, catastrophe—is actually the sacrifice of the temporary for the permanent. To the soul's evolution, adversity may be the only way to break the ego's stranglehold.\n\nThis doesn't mean seeking suffering, but recognizing that suffering can be transformed into growth when surrendered rather than resisted."
                        }
                    ]
                },
                {
                    label: "Surrender-Based Recovery",
                    title: "The Exit: Admitting Powerlessness",
                    spineBody: "The path that has helped millions recover from seemingly hopeless conditions.",
                    sections: [
                        {
                            title: "The Paradox of Powerlessness",
                            importance: "core",
                            defaultExpanded: true,
                            body: "A proven path out of apathy begins with admitting: 'I am powerless over my life, and I need help from something greater than myself.'\n\nBy admitting personal powerlessness and turning away from the ego, a decision is made to surrender to a higher principle. This is followed by honest self-inventory and the establishment of daily spiritual practices.\n\nThis approach has brought about recovery from the most difficult human conditions in countless people worldwide for decades."
                        },
                        {
                            title: "The Power of Spiritual Community",
                            importance: "core",
                            defaultExpanded: false,
                            body: "Recovery from apathetic conditions is powerfully strengthened by participation in groups with high spiritual energy—specifically, groups operating from unconditional love rather than judgment.\n\nThe average person lacks sufficient energy alone, but spiritual groups provide a field of support that can lift consciousness. Self-honesty is difficult in isolation; it becomes possible in the presence of others who have walked the same path."
                        }
                    ]
                },
                {
                    label: "Caring for Others",
                    title: "The Exit: Service as Medicine",
                    spineBody: "Helping others is one of the most effective cures for apathy.",
                    sections: [
                        {
                            title: "The Outward Turn",
                            importance: "core",
                            defaultExpanded: true,
                            body: "One of the most reliable ways out of apathy is to help someone else. This works because it breaks the cycle of self-focused negativity and activates a different energy system.\n\nPeople recovered from addiction often credit helping newcomers with their continued sobriety. Discouraged athletes regain motivation by encouraging teammates. Even caring for animals works—studies show that apathetic elderly patients become more engaged when given pets to care for."
                        },
                        {
                            title: "Small Steps Count",
                            importance: "nuance",
                            defaultExpanded: false,
                            body: "You don't need to save the world. Start small: hold a door, send a kind message, water a plant. The building of self-worth is usually best done step by step.\n\nThe key is that the help be genuine and not transactional. The goal is not to 'earn' something, but simply to participate in life again through caring for something outside yourself."
                        }
                    ]
                },
                LETTING_GO_ARTICLE
            ]
        },
        deepDive: {
            title: "Deep Dive: The Hidden Mechanics of Apathy",
            spineBody: "Understanding the deeper dynamics that maintain apathetic states and how to work with them.",
            sections: [
                {
                    title: "Nothing Is Accidental",
                    importance: "core",
                    defaultExpanded: true,
                    body: "A profound teaching: within the infinite field of existence, nothing happens by accident. Each person is born into circumstances that are optimal for their growth and evolution, even when those circumstances appear catastrophic.\n\nThis doesn't mean suffering is 'deserved' or 'wanted'—it means that what appears as random misfortune may actually hold unseen opportunities for the soul. Therefore, judgment of one's own or others' circumstances should be held lightly."
                },
                {
                    title: "The Passive/Aggressive Core",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Apathy is not truly passive—it is a form of aggression turned inward. Self-hatred, self-accusation, and negative self-judgment are all active attacks on the self.\n\nWhen this mechanism flips outward, the same energy that created collapse can become external aggression—harsh criticism, blame, and vilification of others. Understanding that apathy and rage share the same root helps explain why apathetic people can suddenly become hostile."
                },
                {
                    title: "Apathy in Everyday Life",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Periods of apathy are recurrent in almost everyone's life as temporary phenomena. This often applies to specific neglected areas—finances, health, relationships, career—that have been resisted or for which responsibility has been refused.\n\nThese 'zones of apathy' are based on aversions and attractions rooted in illusion. Almost any resistance can be dissolved through complete surrender and willingness to release illusory goals."
                },
                {
                    title: "Crisis as Opportunity",
                    importance: "nuance",
                    defaultExpanded: false,
                    body: "The ego is so strong that it frequently takes a major life crisis to break its grip. War, disaster, illness, loss—these catastrophes can force a confrontation that the comfortable ego would otherwise avoid.\n\nThis is why crisis can be lifesaving: it forces the issue when gradual change has failed. The key is to use the crisis as a doorway to surrender rather than doubling down on victimhood."
                },
                {
                    title: "The Dualities of Apathy",
                    importance: "nuance",
                    defaultExpanded: false,
                    body: "For transcendence, identify and surrender both sides of these polarities:\n\n• **Blame/project 'cause'** ↔ **Responsibility/own**\n• **'I can't'** ↔ **'I won't'**\n• **See self as victim** ↔ **See self as co-player**\n• **Indifference** ↔ **Caring**\n• **Defeatist** ↔ **Optimist**\n• **Justify, rationalize, excuse** ↔ **Take action**\n• **See self as helpless** ↔ **See self as able**\n• **Hopeless** ↔ **Hope**\n• **Negate self-worth** ↔ **Choose self-worth as gift from Divinity**\n• **See self as weak** ↔ **See self as potentially strong**\n• **Refuse solutions** ↔ **Willing, accept**\n• **Self-sabotage** ↔ **Self-endorsement**\n• **Pessimism, cynical** ↔ **Trust, faith, hope**\n• **See self as unworthy** ↔ **Accept value of life**\n• **Future looks bleak** ↔ **Future holds opportunity**\n• **Passive** ↔ **Active, put forth effort**\n• **Reject help** ↔ **Accept help**\n• **Self-pity** ↔ **Compassion, then move on**\n• **Self-indulgence** ↔ **Move on, 'get over it'**\n• **Succumb** ↔ **Resist, refuse, reject the downward pull**"
                }
            ]
        }
    },
    grief: {
        feltSense: {
            title: "Felt Sense",
            spineBody: "Grief is the heavy, fluid energy of loss and regret. It is the realm of the 'broken heart' and the 'if only' fantasy.",
            sections: [
                {
                    title: "The Thoughts of Grief",
                    importance: "core",
                    defaultExpanded: true,
                    body: "\"I'll never get over this; I've lost the one thing that made me happy.\"\n\n\"If only I had done things differently, they'd still be here.\"\n\n\"All those wasted years... I'll never get them back.\"\n\n\"I'm unlovable and I'll always be alone.\"\n\n\"Everything I love eventually leaves me.\"\n\n\"I can't imagine a future without what I've lost.\"\n\n\"I wish I could go back in time and change that one moment.\"\n\n\"The world is such a tragic, sad place.\"\n\n\"Happiness is for other people, not for me.\"\n\n\"I have lost my source of life; I am hollow.\""
                },
                {
                    title: "Grief in Real Life",
                    importance: "core",
                    defaultExpanded: true,
                    body: "**The Empty Chair**\nCatching a glimpse of where a loved one used to sit and feeling a sudden, sharp pang in the center of your chest. For a split second, you forget they are gone, and then the weight returns.\n\n**The Old Photo**\nFinding an old picture and spending an hour mourning the person you 'used to be.' You feel like that version of yourself is dead and can never be reclaimed.\n\n**The Song on the Radio**\nA song plays that reminds you of a past relationship. You feel an immediate lump in your throat and a wave of regret that washes over your entire day.\n\n**The Career Choice**\nThinking about the job or the city you 'should' have chosen. You feel like your current life is a consolation prize and that you are living in a 'tragic' timeline.\n\n**The Growing Child**\nLooking at your children and feeling sad that they are growing up. You mourn the loss of their infancy even as they stand in front of you, missing the 'then' so much you can't enjoy the 'now.'"
                },
                {
                    title: "The Weight of Sadness",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Physically, grief is 'heavy' but 'wet.' Unlike the dry, frozen energy of Apathy, Grief is characterized by crying, sighing, and a constant lump in the throat (globus sensation). There is a pressure in the chest, as if the heart itself is being squeezed by an invisible hand."
                }
            ],
            nextDoors: [
                { label: "The Traps", targetRoom: "HUB", hotspot: "traps" },
                { label: "The Way Out", targetRoom: "HUB", hotspot: "exits" }
            ]
        },
        purpose: {
            title: "Purpose",
            spineBody: "Grief is a necessary bridge back to life. It is the process of loosening the bonds of attachment so that the energy can eventually be reinvested.",
            sections: [
                {
                    title: "The Bridge to Feeling",
                    importance: "core",
                    defaultExpanded: true,
                    body: "Grief has more energy than Apathy. While Apathy is 'dead,' Grief is 'hurting.' This pain is a sign of life—it means you care enough to feel. When traumatized, numb patients begin to cry, it's a sign of improvement—once they start to cry, they will eat again.\n\nBy allowing grief to process, the 'frozen' soul begins to thaw, eventually allowing for the return of Desire and Anger, which are steps toward Courage."
                },
                {
                    title: "Vulnerability & Early Life",
                    importance: "nuance",
                    defaultExpanded: false,
                    body: "Major losses in early life can make one vulnerable to a passive acceptance of grief later on, as though sorrow were the inevitable price of life. This level colors one’s entire vision of existence, leading to a generalization where the loss of a particular loved one is equated with the loss of love itself."
                },
                {
                    title: "The Mechanism of Attachment",
                    importance: "core",
                    defaultExpanded: false,
                    body: "The universality of grief reveals something important about how the ego works: it misperceives the source of happiness as external. When we obtain something we desire, an internal reward mechanism activates—but we attribute that happiness to the thing itself.\n\nIn reality, the only source of happiness is from within. The value is in the eyes of the beholder, not intrinsic to the object or person. This is why the spiritually evolved person with few attachments is relatively immune to grief—their happiness originates from within and is not dependent on externals."
                },
                {
                    title: "The Cry for Help",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Like a child crying for its mother, grief is a biological signal that summons aid. It is the ego's admission that it cannot handle the loss alone, inviting the compassion of others and the grace of the Universe."
                }
            ]
        },
        traps: {
            body: "The belief that joy is external and has been lost forever.",
            chips: [
                {
                    label: "Regret",
                    title: "The Trap: Regret",
                    spineBody: "The 'If Only' loop that keeps the mind trapped in a nonexistent past.",
                    sections: [
                        {
                            title: "The Hypothetical Ideal",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Regret assumes that if you had chosen differently, the outcome would have been perfect. It ignores the reality of your limitations at the time. By wallowing in 'should haves,' the ego avoids the responsibility of the present moment."
                        },
                        {
                            title: "The Fallacy of 'Could Have'",
                            importance: "core",
                            defaultExpanded: false,
                            body: "There is an inherent fallacy in 'I could have' or 'should have.' In reality, if you really COULD have done differently, you WOULD have—given your consciousness, knowledge, and circumstances at that time.\n\nRegret ignores that evolution happens on a learning curve. The very 'mistake' that causes regret was part of the learning that made the current realization possible."
                        }
                    ]
                },
                {
                    label: "Despondency",
                    title: "The Trap: Despondency",
                    spineBody: "The generalization of a specific loss into a global state of tragedy.",
                    sections: [
                        {
                            title: "Permanent Loss",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Despondency tells you that because *this* person or *this* dream is gone, the *source* of all love and joy is gone. It identifies the infinite capacity for happiness with a single, finite object."
                        },
                        {
                            title: "Seeing Sadness Everywhere",
                            importance: "core",
                            defaultExpanded: false,
                            body: "In deep grief, one begins to see sadness everywhere—in little children, in world conditions, in the nature of existence itself. This level colors one's entire vision of reality.\n\nThe loss of a particular loved one becomes equated with the loss of love itself. This generalization from the specific to the universal is a trap that deepens suffering beyond the original loss."
                        }
                    ]
                },
                {
                    label: "The Illusion of 'Mine'",
                    title: "The Trap: Ownership and Specialness",
                    spineBody: "The magical transformation that turns 'a thing' into 'my thing' and creates the conditions for suffering.",
                    sections: [
                        {
                            title: "The Magic of Possession",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Consider: a watch is merely an object. But with the claim of ownership, it becomes imbued with a unique quality called 'mine.' What was just 'a' watch becomes 'MY' watch—magically transformed. Emphasized, it becomes 'my FAVORITE watch.'\n\nBy this process, attachment, control, fear of loss, and sentiment are added to the composition. The stage is now set for grief if you lose 'MY watch' rather than just 'a watch.' The moment 'mine' is introduced, bondage arises."
                        },
                        {
                            title: "Stewardship Instead of Ownership",
                            importance: "core",
                            defaultExpanded: false,
                            body: "The emotional charge can be loosened by recognizing that everything actually belongs to the Universe/Divinity, and humans only exercise temporary stewardship.\n\nOwnership is a transitory perception. Value and worth exist only in how we think about things, not in the things themselves. All relationships are temporary and arbitrary—legality only provides rights of control, not true 'having.'"
                        }
                    ]
                },
                {
                    label: "Specialness Projection",
                    title: "The Trap: Overvaluing What Is Lost",
                    spineBody: "The more 'special' something is made, the greater the potential for grief.",
                    sections: [
                        {
                            title: "The Specialness Investment",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Objects, qualities, or relationships become overvalued through the mechanism of attachment and projection. The more 'specialness' projected onto something—a person, a role, an object—the greater the potential for grief when it changes.\n\nFear of loss itself contributes to dependent attachments. We cling more tightly to what we fear losing, which increases the 'specialness' investment and thus the potential suffering."
                        }
                    ]
                }
            ]
        },
        exits: {
            body: "Acceptance is the realization that the source of joy is within you, not in what was lost.",
            chips: [
                {
                    label: "Acceptance",
                    title: "The Exit: Acceptance",
                    spineBody: "Acceptance is not resignation; it is the peaceful recognition of the facts of life.",
                    sections: [
                        {
                            title: "Surrendering the Attachment",
                            importance: "core",
                            defaultExpanded: true,
                            body: "You don't lose the person or the object; you lose the *attachment* to them. By surrendering the 'mine-ness' of what was lost, you realize that the love you felt was always your own energy. The form has changed, but the essence remains within your consciousness."
                        },
                        {
                            title: "Riding the Waves",
                            importance: "core",
                            defaultExpanded: false,
                            body: "Grief comes in waves. If you don't resist them—if you dive into the center of the pain without trying to escape—the wave will pass through you in minutes. It is the resistance to the pain that makes it chronic."
                        }
                    ]
                },
                {
                    label: "Processing Technique",
                    title: "The Exit: Working Through Grief",
                    spineBody: "A practical method for processing loss through surrender rather than resistance.",
                    sections: [
                        {
                            title: "The Four Steps",
                            importance: "core",
                            defaultExpanded: true,
                            body: "**1. Stay with the feeling.** Focus on it without flinching. Recognize that all pain comes from resistance—the suffering stems from the attachment, not the loss itself.\n\n**2. Surrender to the waves.** Become willing to be immersed in the feelings without escaping. Notice that they come in waves, and surrendering to the intense ones decreases their severity.\n\n**3. Ask for help from your Higher Power.** Surrender personal will to Divinity/Universe. Reading meaningful spiritual passages can help.\n\n**4. Be willing to endure the process.** If not resisted, grief will process itself out and come to an end. Don't rush it."
                        },
                        {
                            title: "Each Loss Contains All Loss",
                            importance: "nuance",
                            defaultExpanded: false,
                            body: "Although suffering is triggered by a specific event, the painful emotions have actually accumulated from multiple sources over time. There may be more below the surface than first suspected.\n\nEach loss actually represents ALL loss—the experience is of loss itself, not just the specific event. A helpful source of strength is to identify with all of humanity and realize that suffering is universal and innate to being human."
                        }
                    ]
                },
                {
                    label: "Resolution Principles",
                    title: "The Exit: Key Realizations",
                    spineBody: "Philosophical truths that lighten the weight of grief.",
                    sections: [
                        {
                            title: "Seven Truths About Loss",
                            importance: "core",
                            defaultExpanded: true,
                            body: "**1.** Everything in the human domain is temporary, transitional, and evolutionary.\n\n**2.** Nothing can truly be 'owned' or 'mine.' All relationships are temporary.\n\n**3.** Everything belongs to Divinity; what we consider 'ours' is a temporary condition, including the body.\n\n**4.** See all relationships and possessions as stewardships, not ownerships.\n\n**5.** Cling to principles rather than people, objects, or situations.\n\n**6.** Resolve to live with courage and dignity. Accept that mourning is normal.\n\n**7.** All beings live by faith—it is only a question of faith in 'what.'"
                        },
                        {
                            title: "Faith in 'What'?",
                            importance: "nuance",
                            defaultExpanded: false,
                            body: "Despite claims to the contrary, everyone lives by faith in something—intellect, reason, science, progress, political power, or the ego. These faiths are fragile because they can be eclipsed at any moment. In the presence of Infinite Reality, these pretensions evaporate, and the dualistic nature of belief falls away into Identity."
                        },
                        {
                            title: "Loss as Freedom",
                            importance: "nuance",
                            defaultExpanded: false,
                            body: "Paradoxically, loss is simultaneously freedom and the opening of new options. It forces inner adaptations that represent opportunities for growth.\n\nThe mind wants to undo change and return to comfort, but evolutionary growth is insistent. Change is a source of pleasure when chosen, and resentment when resisted. The only source of happiness that is realistically based is in the present—and that which is in the present is not subject to loss."
                        }
                    ]
                },
                {
                    label: "Nonattachment",
                    title: "The Exit: Love Without Clinging",
                    spineBody: "The important distinction between nonattachment and cold detachment.",
                    sections: [
                        {
                            title: "Nonattachment vs Detachment",
                            importance: "core",
                            defaultExpanded: true,
                            body: "This distinction matters: 'Detachment' as an ongoing process can unfortunately lead to apathy, emotional flatness, and indifference. It can result in passivity and loss of interest in life.\n\nSome misunderstand spirituality to teach that even love is an attachment. This is incorrect: love is an aspect of Divinity; possessiveness is an aspect of ego. The goal is not to care about nothing, but to love without clinging."
                        },
                        {
                            title: "The Correct Path",
                            importance: "core",
                            defaultExpanded: false,
                            body: "Nonattachment means holding everything lightly—enjoying without clutching, loving without possessing, caring without controlling.\n\nThe spiritually evolved person is not cold or indifferent. They may love deeply and feel losses keenly. But they do not mistake the form for the essence, or the temporary for the permanent."
                        }
                    ]
                },
                LETTING_GO_ARTICLE
            ]
        },
        deepDive: {
            title: "Deep Dive: The Mechanics of Loss",
            spineBody: "Understanding the deeper structures of attachment and how to work with grief at its source.",
            sections: [
                {
                    title: "Symbolic Disassembly",
                    importance: "core",
                    defaultExpanded: true,
                    body: "The intensity of grief at loss is not really about the particular object, person, or role—it's about the abstract quality of which it's a symbol. To see through the particulars to their perceived essence facilitates the withdrawal of attachment.\n\n| Specific | Class | Abstract Value |\n| :--- | :--- | :--- |\n| **Mate** | Personal | Companion, affection, love |\n| **Parent** | Relationship | Family identity, the past |\n| **Child** | Relationship | Love, future potential |\n| **Lover** | Relationship | Sex, pride, security |\n| **Relative** | Tribal | Group identity |\n| **Old Rover** | Dogginess | Companionship |\n| **Health** | Physical | Survival as a body |\n| **Money/Wealth** | Asset/Means | Survival, prestige, comfort |\n| **Job/Title** | Economic | Status, identity, skills |\n| **Auto/House** | Possession | Transport, habitat, security |\n| **Youth** | Opportunity | Open future, vigor |\n| **'Valuables'** | Sentiment | Familiarity, 'mine-ness' |\n\nSeeing this allows for 'substitution'—the realization that the abstract value (which is internal) can be reinvested in new forms."
                },
                {
                    title: "Blessing in Disguise",
                    importance: "core",
                    defaultExpanded: false,
                    body: "A loss can become a 'blessing in disguise,' though this takes time to ripen into discovery. Loss often turns a person from looking without for happiness to turning within for reevaluation.\n\nA limitation in one area of life simultaneously opens opportunities in other areas. Refusing this opportunity leads to bitterness and devolution. Accepting the vicissitudes of life leads to greater understanding and compassion.\n\nLove itself is the opportunity to surrender personal will to the Divine and reassess the overall purpose of the gift of human life."
                },
                {
                    title: "Chronic Grief",
                    importance: "nuance",
                    defaultExpanded: false,
                    body: "While some degree of grief is inevitable in life, CHRONIC grief—grief that becomes a long-term identity or prevailing state—requires examination of the underlying positionalities.\n\nChronic grief often indicates an unwillingness to release dualistic positions: clinging vs letting go, living in the past vs the now, seeing as loss vs seeing as opportunity.\n\nThe chronically grieving person has made grief a home rather than a bridge."
                },
                {
                    title: "The Dualities of Grief",
                    importance: "nuance",
                    defaultExpanded: false,
                    body: "For transcendence, identify and surrender both sides of these polarities:\n\n• **Cling to** ↔ **Let go of**\n• **Live in past** ↔ **Live in the now**\n• **Undo** ↔ **Accept**\n• **Bargain with Divinity** ↔ **Accept limitation/karma**\n• **Hope to change, entreat** ↔ **Surrender**\n• **See as loss** ↔ **See as opportunity to move on**\n• **Refuse, deny** ↔ **Work through**\n• **Anger, resentment** ↔ **Acceptance**\n• **Self-blame** ↔ **Accept limitation**\n• **Feel empty** ↔ **Replace with new values**\n• **Lessened** ↔ **Compensate**\n• **Equate external as source of happiness** ↔ **See happiness as internal**\n• **Dependent on externals** ↔ **Depend on self**\n• **Resist** ↔ **Transcend**\n• **Despondency** ↔ **Hope**\n• **Go back in time** ↔ **Move forward to options**\n• **Emotionalize** ↔ **Minimize**"
                }
            ]
        },
    },
    fear: {
        feltSense: {
            title: "Felt Sense",
            spineBody: "Fear is the fast-vibrating energy of withdrawal and alarm. It is the alert signal that keeps the ego on a constant lookout for threat.",
            sections: [
                {
                    title: "The Thoughts of Fear",
                    importance: "core",
                    defaultExpanded: true,
                    body: "\"What if I lose everything and end up on the street?\"\n\n\"I have to be careful; something terrible is about to happen.\"\n\n\"What if these symptoms are a serious disease? I have to know now.\"\n\n\"I can't go there; it's just not safe.\"\n\n\"Everyone is keeping secrets; I can't trust anyone.\"\n\n\"What if I fail and everyone sees how incompetent I am?\"\n\n\"I'm not ready for this; I'm going to mess it all up.\"\n\n\"If I don't control every detail, it will all fall apart.\"\n\n\"I'm so anxious I can't even think straight.\"\n\n\"The world is a dangerous place, and I am small.\""
                },
                {
                    title: "Fear in Real Life",
                    importance: "core",
                    defaultExpanded: true,
                    body: "**The Health Scare**\nGoogling a minor symptom and convincing yourself you have a terminal illness. You spend hours in a state of high-alert panic, checking your pulse and temperature every five minutes.\n\n**The Stage Fright**\nStanding in front of a group, heart racing, palms sweating, certain that you'll forget every word and be humiliated. Your mind goes blank as the 'fight or flight' response takes over.\n\n**The Late-Night Noise**\nHearing a small creak in the house and immediately imagining a break-in. You lie frozen in bed, ears straining to hear every sound, your body coiled for a threat that isn't there.\n\n**The Financial Dread**\nLooking at your bank account and feeling a surge of terror about the future, even if you have enough for today. \"What if the economy crashes? What if I'm the first one fired?\"\n\n**The Relationship Panic**\nYour partner is quiet for one evening, and you immediately think: \"They're going to leave me. I must have done something wrong.\" You start over-compensating and 'clinging' to prevent the catastrophe you've imagined."
                },
                {
                    title: "The Adrenaline Rush",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Physically, fear is characterized by hyper-arousal. Heart rate increases, breathing becomes shallow and restricted to the upper chest, and the gut tightens. There is often a cold sweat, shaking limbs, and a constant 'scanning' of the environment. The life force is withdrawn from the extremities to protect the vital organs, leading to cold hands and feet."
                }
            ],
            nextDoors: [
                { label: "The Traps", targetRoom: "HUB", hotspot: "traps" },
                { label: "The Way Out", targetRoom: "HUB", hotspot: "exits" }
            ]
        },
        purpose: {
            title: "Purpose",
            spineBody: "Fear is the biological 'Danger' signal. In its healthy form, it is simply 'caution'—a tool for physical survival.",
            sections: [
                {
                    title: "Survival & Caution",
                    importance: "core",
                    defaultExpanded: true,
                    body: "The original purpose of fear is to keep the organism alive by avoiding physical threats. It triggers the 'fight or flight' response, providing a surge of adrenaline that empowers you to escape danger or defend yourself. When calibrated correctly, it is a brief, useful signal that leads to protective action."
                },
                {
                    title: "The Control Mechanism",
                    importance: "nuance",
                    defaultExpanded: false,
                    body: "Fear is the easiest way to control people. Dictators, bad bosses, and abusive partners all use the same trick: they make you feel small and unsafe, so you look to them for protection.\n\nIf you are afraid, you stop thinking for yourself and just want to be 'saved.' This is why fear stops you from growing—it keeps you in a childlike state of dependency."
                },
                {
                    title: "The Cost of 'Me'",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Fear only exists because you think you are separate from everything else. A wave in the ocean isn't afraid of crashing because it *is* the ocean. But if the wave thinks it's a 'separate object,' it becomes terrified of 'ending.'\n\nFear is the tax you pay for being an ego. The more you defend 'me,' the more you have to fear."
                }
            ]
        },
        traps: {
            body: "The expansion of caution into chronic worry and paranoia.",
            chips: [
                {
                    label: "Worrying",
                    title: "The Trap: Chronic Worry",
                    spineBody: "The 'What If' loop that projects fear into every corner of the future.",
                    sections: [
                        {
                            title: "Imaginary Threats",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Worrying is the ego's attempt to 'solve' a future that hasn't happened yet. It uses the imagination to create infinite nightmare scenarios. Paradoxically, the body reacts to these thoughts as if they were real, staying in a constant state of stress that actually weakens its ability to handle real challenges."
                        }
                    ]
                },
                {
                    label: "The Media Loop",
                    title: "The Trap: The Horror Movie",
                    spineBody: "Why the news makes you sick.",
                    sections: [
                        {
                            title: "The 24-Hour Alarm",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Your brain has a filter called the Reticular Activating System (RAS). Its job is to spot what's important. If you watch scary news all day, you are training your RAS to say: 'DANGER IS EVERYWHERE.'"
                        },
                        {
                            title: "Real Life: The Horror Movie Director",
                            importance: "core",
                            defaultExpanded: false,
                            body: "Living in fear is like hiring a horror movie director to narrate your life. You're walking down a quiet street, but your mind is playing ominous music and zooming in on shadows. The street isn't dangerous; your *narration* is preventing you from seeing reality."
                        }
                    ]
                },
                {
                    label: "Paranoia",
                    title: "The Trap: Paranoia",
                    spineBody: "The belief that the world is inherently predatory and God is punitive.",
                    sections: [
                        {
                            title: "The Hostile Universe",
                            importance: "core",
                            defaultExpanded: true,
                            body: "In this state, everyone is seen as a potential enemy or threat. This projection creates a lonely, guarded existence where love and connection are impossible because they require the very 'vulnerability' that the fearful ego is hiding."
                        }
                    ]
                },
                {
                    label: "The Wall",
                    title: "The Trap: Inhibition & Bravado",
                    spineBody: "Fear doesn't just stop you from dying; it stops you from living.",
                    sections: [
                        {
                            title: "The Shrinking World",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Fear makes your world smaller. First, you're afraid of flying, so you don't travel. Then you're afraid of driving, so you stay in town. Then you're afraid of crowds, so you stay home. Eventually, you are 'safe' in a prison of your own making."
                        },
                        {
                            title: "The Counter-Phobe (The Daredevil)",
                            importance: "nuance",
                            defaultExpanded: false,
                            body: "Some people fight fear by doing the opposite: they drive too fast or do dangerous stunts. This isn't courage; it's just fear in a mask. They are trying to prove they aren't afraid, which means fear is still running their life."
                        }
                    ]
                }
            ]
        },
        exits: {
            body: "Moving from protection to trust is the only way through the fog of fear.",
            chips: [
                {
                    label: "Trust",
                    title: "The Exit: Trust",
                    spineBody: "Trust is the admission that you are safe in the hands of the Universe.",
                    sections: [
                        {
                            title: "Surrendering to Life",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Fear is the belief that you are alone and must protect yourself against everything. Trust is the realization that the source of your life is benevolent. By surrendering the need for total control and trusting in the 'Now,' the high tension of fear dissolves into the peace of Presence."
                        },
                        {
                            title: "Fear of Fear",
                            importance: "core",
                            defaultExpanded: false,
                            body: "Most of what we fear is the *sensation* of fear itself. By choosing to sit with the fast heartbeat and the tight gut without trying to escape, you realize the feeling cannot actually hurt you. Once the sensation is accepted, the energy of fear is released and can be used for action."
                        }
                    ]
                },
                {
                    label: "Processing Technique",
                    title: "The Exit: 'And Then What?'",
                    spineBody: "A simple game to defeat the Boogeyman.",
                    sections: [
                        {
                            title: "Identifying the Boogeyman",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Fear relies on the 'vague unknown.' It whispers, 'Something bad will happen,' but it refuses to say *what*. The way to beat it is to turn on the lights."
                        },
                        {
                            title: "Real Life: The Job Loss Spiral",
                            importance: "core",
                            defaultExpanded: false,
                            body: "**Fear**: 'What if I get fired?'\n**You**: 'Okay, and then what?'\n**Fear**: 'I won't have money.'\n**You**: 'And then what?'\n**Fear**: 'I'll lose my house.'\n**You**: 'And then what?'\n**Fear**: 'I'll be homeless.'\n**You**: 'And then what?'\n**Fear**: 'I'll starve and die.'\n\nOnce you hit 'I'll die,' you realize that *all* fear is just the fear of death in a different costume. And since you are a spiritual being, death is just a transition. The monster loses its teeth."
                        }
                    ]
                },
                {
                    label: "Rational Caution",
                    title: "The Exit: Emotion vs. Calculation",
                    spineBody: "You don't need to be terrified to be safe.",
                    sections: [
                        {
                            title: "The Seatbelt Analogy",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Imagine putting on your seatbelt. Do you do it while screaming in terror, imagining a fiery crash? No. You just click it. It's calm, rational, and smart.\n\nThis is the difference between **Caution** (useful) and **Fear** (useless). Caution looks both ways before crossing the street. Fear stands on the sidewalk shivering. You can protect your life perfectly well without the emotional drama."
                        }
                    ]
                },
                {
                    label: "Worst Case Scenario",
                    title: "The Exit: Face the Ultimate Fear",
                    spineBody: "Follow every fear to its final conclusion and discover it leads to the same place.",
                    sections: [
                        {
                            title: "The Technique",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Every fear ultimately leads to the fear of death. If you follow any fear and keep asking 'Why am I afraid of that?' you will find it leads to another fear, and another, until you arrive at the worst-case scenario: physical death.\\n\\nThe technique is to sit with that worst-case scenario deliberately. Picture yourself in the casket. Let go of resisting the feelings that arise. When you have fully surrendered to the 'biggie,' what remains? Surprisingly, what people experience is that they have survived the worst possible scenario—and they are still here. The 'I' that feared death is still present.\\n\\nOnce you have faced and surrendered to the ultimate fear, all lesser fears lose their power. They were all just disguises for the same thing."
                        },
                        {
                            title: "Clinical Insight: Pain vs. Suffering",
                            importance: "core",
                            defaultExpanded: false,
                            body: "A critical insight from clinical practice: pain and suffering are not the same thing. Pain is one thing, and it is quite possible to be with pain yet be totally indifferent to it.\\n\\nThe suffering is in the resistance, not in the sensation. When you stop fighting a feeling and totally surrender to it, saying 'More, more, more,' the suffering ends even though the sensation may continue. This is because you are no longer the victim—you are the master who is choosing to experience it.\\n\\nThis principle applies to all negative emotions, not just physical pain."
                        }
                    ]
                },
                LETTING_GO_ARTICLE
            ]
        },
        deepDive: {
            title: "Deep Dive: Fear and the Ego",
            spineBody: "Understanding fear as the primary tool of the ego's control mechanisms.",
            sections: [
                {
                    title: "The Last Barrier",
                    importance: "core",
                    defaultExpanded: true,
                    body: "Why is fear so hard to let go of? Because the ego thinks it *is* God. It thinks: 'If I stop worrying, who will keep me safe?'\n\nThe ego believes that its constant stress is the only thing holding the universe together. Letting go of fear means admitting that you are not in control of everything—and that is actually the most relaxing news in the world. It shifts you from 'Defending the Fortress' to 'Trusting the Universe.'"
                },
                {
                    title: "The Dualities of Fear",
                    importance: "nuance",
                    defaultExpanded: false,
                    body: "Surrender the aversion to the negative to realize the positive:\n\n• **Excitement of danger** ↔ **Stay 'cool'**\n• **Panic, overreact** ↔ **Self-control**\n• **Dramatize** ↔ **Handle calmly**\n• **Gain attention/help** ↔ **Self-sufficient**\n• **Protect** ↔ **Lose, loss**\n• **Control** ↔ **Surrender**\n• **Emotionalism** ↔ **Think clearly**\n• **Imagine/Project** ↔ **Live in the now**\n• **See enemies** ↔ **See safety**\n• **Resist, defend** ↔ **Accept**\n• **Justify** ↔ **View realistically**\n• **Project cause** ↔ **Own responsibly**\n• **Focus on body** ↔ **Focus on spirit**\n• **Depend on self** ↔ **Trust in Universe**"
                }
            ]
        }
    },
    desire: {
        feltSense: {
            title: "Felt Sense",
            spineBody: "Desire is the restless energy of craving and lack. It is the realm of the 'Hungry Ghost,' where getting never leads to satisfaction.",
            sections: [
                {
                    title: "The Thoughts of Desire",
                    importance: "core",
                    defaultExpanded: true,
                    body: "\"I'll finally be happy when I get that promotion/car/partner.\"\n\n\"I just need one more thing/drink/approval and then I'll be satisfied.\"\n\n\"If I could only look like that, my life would be perfect.\"\n\n\"I must have their attention; I can't stand being ignored.\"\n\n\"I'm so bored... I need something exciting to happen right now.\"\n\n\"Why do they have that and I don't? It's just not fair.\"\n\n\"I'll do whatever it takes to get to the top; nothing else matters.\"\n\n\"I can't stop thinking about it; it's all I want.\"\n\n\"Everything will be better once I start over in a new place.\"\n\n\"I'm just one purchase away from a better version of myself.\""
                },
                {
                    title: "Desire in Real Life",
                    importance: "core",
                    defaultExpanded: true,
                    body: "**The Midnight Scroll**\nBrowsing online stores at 1 AM, tired but restless, convinced that a new gadget is the key to finally 'organizing' your life or fixing your boredom. You're not buying a tool; you're buying a hope.\n\n**The Social Envy**\nLooking at a friend's vacation photos and feeling a sharp, uncomfortable 'pang' of wanting. Suddenly, your own comfortable life feels 'not enough,' and you spend your evening planning a trip you can't afford.\n\n**The Promotion Trap**\nYou get the raise you worked two years for. You feel happy for exactly five minutes before you start looking at the *next* level and feeling the same old pressure to 'get more.' The goalpost always moves.\n\n**The Glamour Crush**\nYou're obsessed with someone you barely know. You've projected a 'magical' identity onto them, convinced they are the missing piece of your soul and that you'll be hollow until you have them.\n\n**The 'Just One More' Loop**\nYou're eating or drinking something you enjoy, but you're no longer tasting it. You're just reaching for the next bite because you're terrified of the 'good feeling' ending and the void returning."
                },
                {
                    title: "The Restless Itch",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Physically, desire is 'forward-leaning' energy. There is a constant restlessness in the limbs and a tension in the arms and shoulders (the 'reaching' muscles). Breathing is shallow and 'hungry.' There is a tunnel-vision quality to the gaze, and a gnawing sensation in the solar plexus that feels like a hunger that cannot be reached."
                }
            ],
            nextDoors: [
                { label: "The Traps", targetRoom: "HUB", hotspot: "traps" },
                { label: "The Way Out", targetRoom: "HUB", hotspot: "exits" }
            ]
        },
        purpose: {
            title: "Purpose",
            spineBody: "Desire is a powerful motivator. In its healthy form, it is the energy that moves a person out of Apathy and Fear toward action and growth.",
            sections: [
                {
                    title: "The Springboard",
                    importance: "core",
                    defaultExpanded: true,
                    body: "Desire is a necessary step up from the 'I can't' of lower levels. It provides the 'will to get,' which powers personal achievement and the economy. It at least represents a belief that happiness is possible, which is a significant improvement over the hopelessness of the pit."
                },
                {
                    title: "The Engine of 'More'",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Imagine a single-celled organism swimming around. It doesn't generate its own energy; it has to *hunt* for food to survive. This is where desire comes from biologically: the need to go 'out there' to get what you need.\n\nIn humans, this manifests as a 'forward-leaning' energy. It's the feeling of 'I need that to be okay.' While this is much better than being paralyzed by fear, its trap is thinking that happiness is something you have to chase, catch, and consume."
                },
                {
                    title: "Hunger vs. Ambition",
                    importance: "nuance",
                    defaultExpanded: false,
                    body: "Think of Desire as 'emotional hunger.' When you are hungry, you can't think of anything else. But once you eat, you aren't 'happy'—you're just not hungry anymore. Desire works the same way: getting the thing doesn't give you lasting joy; it just temporarily relieves the itch of wanting it."
                }
            ]
        },
        traps: {
            body: "The enslavement to the 'More.'",
            chips: [
                {
                    label: "Addiction",
                    title: "The Trap: Addiction",
                    spineBody: "When desire becomes a compulsion that overrides reason and survival.",
                    sections: [
                        {
                            title: "The Hungry Ghost",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Addiction is the attempt to fill a spiritual hole with a physical substance or behavior. Because the source of the problem is internal, no amount of 'external' input can ever satisfy it. The ego becomes a slave to the craving, sacrificing its health, relationships, and dignity for a moment of relief."
                        }
                    ]
                },
                {
                    label: "Glamour",
                    title: "The Trap: The Illusion of Specialness",
                    spineBody: "The projection of magical qualities onto objects, people, or statuses.",
                    sections: [
                        {
                            title: "Real Life: The New Phone",
                            importance: "core",
                            defaultExpanded: true,
                            body: "You see an ad for the latest phone. Suddenly, your current phone feels like trash. You imagine how organized, creative, and cool you'll be with the new one. You *obsess* over it.\n\nThen you buy it. For two days, it feels magical. By day three, it's just a phone. The 'glamour' has faded, and you're left with the same internal feelings you had before. The magic wasn't in the phone; it was a projection of your own mind."
                        }
                    ]
                },
                {
                    label: "Insatiability",
                    title: "The Trap: Insatiability",
                    spineBody: "Why 'just one more' is never actually enough.",
                    sections: [
                        {
                            title: "The Horizon Effect",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Trying to satisfy desire by 'getting things' is like walking toward the horizon. No matter how far you walk, the horizon is always the same distance away.\n\nThis is why billionaires often still feel poor. If your internal rule is 'I will be happy when I get *more*,' you have programmed yourself to never be happy, because 'more' is a moving target. The moment you get X, your mind immediately resets the goal to Y."
                        }
                    ]
                },
                {
                    label: "Paradox of Wanting",
                    title: "The Trap: The Paradox of Wanting",
                    spineBody: "Why chasing something often pushes it away, and why 'needing' it creates a wall.",
                    sections: [
                        {
                            title: "The Wall of Wanting",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Think of it like trying to recall a forgotten name. The harder you strain and reach for it ('I *need* to remember!'), the more it slips away. The moment you give up and relax, the name pops into your head.\n\nDesire works the same way. The energy of 'I need this' is actually the energy of 'I don't have this.' It creates a vibration of **lack**. This lack acts like a wall between you and the thing you want."
                        },
                        {
                            title: "Real Life: The Desperate Dater",
                            importance: "core",
                            defaultExpanded: false,
                            body: "Imagine someone on a first date who is desperate for a relationship. They *need* this to work. They analyze every text, over-laugh at jokes, and radiate anxiety. This 'heavy' energy pushes the other person away.\n\nNow imagine someone who wants a relationship but is happy being single. They are relaxed, present, and fun. They don't *need* the date to go perfectly. Paradoxically, this 'intention' without 'craving' makes them magnetic."
                        }
                    ]
                }
            ]
        },
        exits: {
            body: "Moving from craving to intention is the way to freedom.",
            chips: [
                {
                    label: "Intention",
                    title: "The Exit: Intention",
                    spineBody: "Choosing a goal without being enslaved by the 'need' for it.",
                    sections: [
                        {
                            title: "Want vs. Need",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Intention sounds like: 'I would like to have this, but I don't need it to be okay.' By letting go of the *demand* for fulfillment, you stop the energy of 'lack' that actually pushes the object away. Paradoxically, once you don't 'need' it, it often manifests effortlessly."
                        },
                        {
                            title: "Gratitude",
                            importance: "core",
                            defaultExpanded: false,
                            body: "Desire is based on 'I don't have.' Gratitude is based on 'I have enough.' Shifting your focus to what is already present in your life immediately raises your energy out of craving into the satisfaction of higher states."
                        }
                    ]
                },
                {
                    label: "Decision",
                    title: "The Exit: Decision vs. Wanting",
                    spineBody: "Stop 'craving' and start 'choosing.'",
                    sections: [
                        {
                            title: "The Ordering Lunch Analogy",
                            importance: "core",
                            defaultExpanded: true,
                            body: "When you order lunch at a restaurant, you don't sit there sweating, thinking, 'Oh god, I *need* the salad, I hope I get the salad, what if I don't get the salad?' You simply look at the menu and choose. 'I'll have the salad.'\n\nThis is the difference between **Desire** and **Will**. You can achieve huge goals without the emotional burn of craving. You simply set the goal, do the work, and move towards it. It's a calm decision, not a desperate hunger."
                        }
                    ]
                },
                {
                    label: "Perspective",
                    title: "The Exit: The 'Space Probe' View",
                    spineBody: "Seeing your body as a tool you use, not who you are.",
                    sections: [
                        {
                            title: "The Astronaut Suit",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Imagine you are an astronaut exploring a new planet. You wear a high-tech suit to survive. You take care of the suit, you fuel it, and you repair it. But you never start thinking, 'I *am* this suit.'\n\nYour body is like that suit. It's a biological 'space probe' your consciousness is using to experience the physical world. When you realize this, the desperate obsession with the body's cravings (food, sensation, appearance) starts to relax. You are the pilot, not the machine."
                        }
                    ]
                },
                LETTING_GO_ARTICLE
            ]
        },
        deepDive: {
            title: "Deep Dive: The Anatomy of Craving",
            spineBody: "Why the brain gets hooked on the chase, and how to surrender the 'have to have.'",
            sections: [
                {
                    title: "The Brain Loop",
                    importance: "core",
                    defaultExpanded: true,
                    body: "Why is it so hard to stop wanting? Because the ego thinks 'wanting' is a survival skill. It fears that if you stop wanting, you'll stop doing.\n\nIn reality, addiction isn't about the object (the wine, the person, the money). It's an addiction to the *brain chemical reward* that comes from the chase. The ego gets a secret 'juice' even from negative things like feeling ignored or being the victim. It loves the drama because drama makes it feel 'real.'"
                },
                {
                    title: "The Dualities of Desire",
                    importance: "nuance",
                    defaultExpanded: false,
                    body: "Surrender the 'have to have' to realize the 'freedom to be':\n\n• **Special** ↔ **Common**\n• **Win, gain** ↔ **Lose**\n• **Wealth** ↔ **Poverty**\n• **Control** ↔ **Passive**\n• **Get** ↔ **Lose**\n• **Crave** ↔ **Frustrated**\n• **Force** ↔ **Weakness**\n• **Approval** ↔ **Criticism**\n• **Success** ↔ **Failure**\n• **Fame** ↔ **Anonymity**\n• **Stubborn** ↔ **Give in**\n• **Aggression** ↔ **Submission**\n• **Resist** ↔ **Change**\n• **Defend** ↔ **Surrender**\n• **Acquisition** ↔ **Poverty**\n• **Conquest** ↔ **Lose**\n• **Popularity** ↔ **Unnoticed**\n• **'Have to have'** ↔ **Prefer**\n• **Important** ↔ **Ordinary**\n• **Feel 'high'** ↔ **Just normal**\n• **Exceptional** ↔ **Average**\n• **Noticed** ↔ **Ignored**\n• **Excitement** ↔ **Boredom**\n• **Glamorous** ↔ **Common**\n• **Change world** ↔ **Change self**\n• **Possession** ↔ **Simplicity**\n• **Display** ↔ **Bland**\n• **Superior** ↔ **Common**"
                }
            ]
        }
    },
    anger: {
        feltSense: {
            title: "Felt Sense",
            spineBody: "Anger is the explosive, high-vibration energy of aggression and boundary-setting. It is the heat of 'I won't stand for this anymore!'",
            sections: [
                {
                    title: "The Thoughts of Anger",
                    importance: "core",
                    defaultExpanded: true,
                    body: "\"How dare they treat me like that! They have no idea who I am.\"\n\n\"I'm going to make them regret the day they met me.\"\n\n\"It's just not fair. Why do I always get the short end of the stick?\"\n\n\"They're doing this on purpose just to annoy me; I'll show them.\"\n\n\"I can't wait to see them fail; they deserve everything that's coming.\"\n\n\"If they don't do what I want, I'll make their life a living hell.\"\n\n\"Everyone is so incompetent; I'm surrounded by idiots.\"\n\n\"I'll never forgive them for what they did. Never.\"\n\n\"I'm right, and they're wrong, and I'll keep fighting until they admit it.\"\n\n\"I'm so sick of this; I want to burn it all down and start over.\""
                },
                {
                    title: "Anger in Real Life",
                    importance: "core",
                    defaultExpanded: true,
                    body: "**The Road Rage Encounter**\nSomeone cuts you off in traffic. You don't just brake; you feel a surge of heat in your neck and a sudden, violent desire to chase them down, hooting and gesturing, to 'teach them a lesson.' For ten minutes, your entire world is that one car.\n\n**The Unseen Sacrifice**\nYou spent the day cleaning the house for your partner. They come home and don't notice. Instead of asking for appreciation, you start slamming cupboard doors and giving them the 'silent treatment,' hoping they'll feel the weight of your unexpressed rage.\n\n**The Workplace Stewing**\nYour boss gives the promotion to a colleague you think is less qualified. Instead of asking for feedback, you go to your desk and spend the afternoon 'collecting injustices,' making a list of everyone's mistakes to use as weapons later.\n\n**The Internet Crusade**\nYou see a post that contradicts your beliefs. You spend an hour typing a furious, sarcastic reply, your heart racing, feeling a 'high' from how clearly you've 'destroyed' their argument. You're not looking for truth; you're looking for blood.\n\n**The Family Grudge**\nYou bring up a mistake your sibling made ten years ago during a holiday dinner. You've 'stored' this injustice for a decade, waiting for the perfect moment to discharge the energy of a past hurt that you haven't really let go of."
                },
                {
                    title: "The Red Surge",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Physically, anger feels like 'heat' rising from the core toward the face and neck. The jaw clenches, fists tighten, and the chest/shoulders expand as the body 'puffs up' to intimidate. Your heart rate spikes, and common sense disappears as 'tunnel vision' focuses entirely on the perceived enemy. You feel like a spring coiled for a strike."
                }
            ],
            nextDoors: [
                { label: "The Traps", targetRoom: "HUB", hotspot: "traps" },
                { label: "The Way Out", targetRoom: "HUB", hotspot: "exits" }
            ]
        },
        purpose: {
            title: "Purpose",
            spineBody: "Anger is the energy of mobilization. In its healthy form, it provides the force to overcome oppression and set necessary boundaries.",
            sections: [
                {
                    title: "The Catalyst for Change",
                    importance: "core",
                    defaultExpanded: true,
                    body: "Anger is significantly higher energy than Apathy or Grief. It provides the 'fuel' to do something about an intolerable situation. Historically, the oppressed rise out of the pit through anger to seek freedom. It is the necessary biological 'No' that protects your integrity from violation."
                },
                {
                    title: "The Volcano",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Imagine a volcano. It has enormous power. That power can create new islands (constructive) or destroy villages (destructive).\n\nAnger works the same way. It is a high-energy state that says 'NO.' It can fuel movements that change the world, or it can burn your relationships to the ground. The key insight: it was the *movements* that created lasting change, not the anger itself. Anger is rocket fuel—useful for launch, dangerous if you stay on it."
                },
                {
                    title: "Frustration = Blocked Desire",
                    importance: "nuance",
                    defaultExpanded: false,
                    body: "Anger almost always comes from frustrated desire. You wanted something ('They *should* respect me!'), you didn't get it, and now you're boiling.\n\nThe root is an expectation that reality didn't meet. We have a 'script' in our heads of how the world should be. When reality doesn't follow the script, we get angry at reality for 'being wrong.'"
                }
            ]
        },
        traps: {
            body: "The slow erosion of the soul through hatred and resentment.",
            chips: [
                {
                    label: "Resentment",
                    title: "The Trap: Resentment",
                    spineBody: "When anger is suppressed and 'stewed over,' it turns into chronic bitterness.",
                    sections: [
                        {
                            title: "Lighting Yourself on Fire",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Holding the energy of resentment is like lighting yourself on fire and hoping the other person dies of smoke inhalation. The toxic chemicals of chronic anger (adrenaline and cortisol) corrode your health, while the mental focus on the past prevents you from experiencing the beauty of the present."
                        }
                    ]
                },
                {
                    label: "Righteousness",
                    title: "The Trap: Righteous Indignation",
                    spineBody: "The ego's 'favorite drug'—the high of feeling right while making others wrong.",
                    sections: [
                        {
                            title: "The Vanity Payoff",
                            importance: "core",
                            defaultExpanded: true,
                            body: "The ego extracts a secret pleasure from feeling misunderstood or victimized. By making others 'bad,' the ego feels 'good' and 'superior.' This addiction to being right prevents real solutions and keeps you trapped in a cycle of conflict where winning is more important than peace."
                        }
                    ]
                },
                {
                    label: "Injustice Collector",
                    title: "The Trap: The Injustice Museum",
                    spineBody: "Hoarding old hurts like treasures to justify anger today.",
                    sections: [
                        {
                            title: "The Curator of Wrongs",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Some people are like museum curators; they walk around their mind, polishing old insults and hurts from years ago. They 'collect' injustices to justify being mean today. 'I can yell at you because my boss yelled at me in 2015.'\n\nThis is a way of avoiding responsibility for your own happiness. As long as you have a 'good reason' to be angry, you never have to change."
                        },
                        {
                            title: "Real Life: The Holiday Grudge",
                            importance: "core",
                            defaultExpanded: false,
                            body: "You bring up a mistake your sibling made ten years ago during Christmas dinner. You've 'stored' this injustice for a decade, waiting for the perfect moment to discharge the energy of a hurt you never actually let go of."
                        }
                    ]
                }
            ]
        },
        exits: {
            body: "Moving from aggression to understanding is the way through the heat.",
            chips: [
                {
                    label: "Ownership",
                    title: "The Exit: Ownership",
                    spineBody: "Admitting 'I am angry' rather than claiming 'They made me angry.'",
                    sections: [
                        {
                            title: "Reclaiming the Power",
                            importance: "core",
                            defaultExpanded: true,
                            body: "As long as you blame others, they have power over you. By owning the anger as your internal response to a perception, you reclaim the power to change it. You move from being a 'victim' of circumstances to being the 'master' of your own emotional frequency."
                        },
                        {
                            title: "Forgiveness",
                            importance: "core",
                            defaultExpanded: false,
                            body: "Forgiveness isn't for the other person; it's the act of releasing the heavy burden of the past so you can be free. It is the realization that 'They did the best they could with the level of consciousness they had,' even if that 'best' was terrible. Releasing them releases you."
                        }
                    ]
                },
                {
                    label: "The Hot Coal",
                    title: "The Exit: Understanding Who Gets Burned",
                    spineBody: "Anger punishes you, not them.",
                    sections: [
                        {
                            title: "The Self-Burn",
                            importance: "core",
                            defaultExpanded: true,
                            body: "There is a famous saying: 'Holding onto anger is like grasping a hot coal with the intent of throwing it at someone else; you are the one who gets burned.'\n\nYour anger doesn't punish the other person (who is probably sleeping soundly). It punishes *you*. It floods *your* body with cortisol and destroys *your* peace. Letting go isn't a gift to them; it's a gift to yourself."
                        },
                        {
                            title: "Dropping the 'Shoulds'",
                            importance: "core",
                            defaultExpanded: false,
                            body: "Anger comes from the word 'should.' 'He *should* be on time.' 'They *should* be fair.'\n\nThe exit is replacing 'should' with 'is.' 'He *is* late.' When you stop fighting reality, you can deal with it. You can wait, leave, or speak up—but you can do it without the burning heat of rage."
                        }
                    ]
                },
                LETTING_GO_ARTICLE
            ]
        },
        deepDive: {
            title: "Deep Dive: The Addiction to Being Right",
            spineBody: "Understanding why the ego clings to anger and how to break free.",
            sections: [
                {
                    title: "The Weakness Disguised as Strength",
                    importance: "core",
                    defaultExpanded: true,
                    body: "Anger *feels* powerful. You puff up, raise your voice, dominate. But look closer: a person in a rage is shaking, red-faced, unable to think clearly. That's not strength—that's loss of control.\n\nA truly powerful person doesn't need to scream. True strength is the ability to stay calm when provoked. Anger is often just a sign that you feel threatened."
                },
                {
                    title: "No Justified Resentment",
                    importance: "core",
                    defaultExpanded: false,
                    body: "In recovery programs, there's a famous dictum: 'There is no such thing as a justified resentment.'\n\nThe ego loves to find reasons to be angry. But every reason is just fuel for the fire that burns *you*. Even if your anger is 'justified,' it still corrodes your health and steals your peace."
                },
                {
                    title: "The Dualities of Anger",
                    importance: "nuance",
                    defaultExpanded: false,
                    body: "Surrender the 'pleasure' of being right to have the peace of being happy:\n\n• **Act out feeling** ↔ **Self-control**\n• **Intimidate** ↔ **Forgive**\n• **Hold on** ↔ **Let go**\n• **Punish, get even** ↔ **Let them go free**\n• **Dump on others** ↔ **Restraint**\n• **Excitement, 'stirred up'** ↔ **Stay cool**\n• **Emotionalize** ↔ **Think**\n• **Dramatize** ↔ **Ignore**\n• **Be right** ↔ **Be at peace**\n• **Puff up** ↔ **Appear calm**\n• **Threaten** ↔ **Compromise**\n• **Judgmentalism** ↔ **Acceptance**"
                }
            ]
        }
    },
    pride: {
        feltSense: {
            title: "Felt Sense",
            spineBody: "Pride is the brittle, inflated energy of self-importance and comparison. It is the feeling of 'I am better,' which hides a deep fear of being 'less than.'",
            sections: [
                {
                    title: "The Thoughts of Pride",
                    importance: "core",
                    defaultExpanded: true,
                    body: "\"I've worked harder than anyone else; I deserve more respect.\"\n\n\"I would never do something as pathetic/low-class as that.\"\n\n\"They just don't understand the level I'm operating on; I'm playing a different game.\"\n\n\"I have to look perfect today; my image is everything.\"\n\n\"I'm right, and I'll find a clever way to make them feel stupid for disagreeing.\"\n\n\"I'm part of the 'True Way'; those people are just lost.\"\n\n\"I don't need help; I can do it all myself, and I'll take all the credit.\"\n\n\"I can't admit I'm wrong; it would destroy my reputation forever.\"\n\n\"Look at what I've acquired; my success proves my superiority.\"\n\n\"I'm so much more 'evolved' or 'spiritual' than the average person.\""
                },
                {
                    title: "Pride in Real Life",
                    importance: "core",
                    defaultExpanded: true,
                    body: "**The Designer Shield**\nWearing a visible, expensive brand name and feeling a subtle 'surge' of superiority as you enter a room. You're not enjoying the fabric; you're enjoying the distance you've put between yourself and 'the common.'\n\n**The Clever Correction**\nA friend makes a minor mistake. Instead of letting it go, you feel a 'need' to correct them publicly with a witty, condescending remark. You feel 'up' for a second, but the warmth in the room just died.\n\n**The 'I Told You So'**\nA colleague fails. Instead of offering help, you subtly remind everyone that you had 'doubts' all along. You're using their defeat to prop up your image as the visionary who is never wrong.\n\n**The Spiritual High-Ground**\nYou've found a new diet or meditation practice, and now you look at 'ordinary' people with a sense of pity. You think you're 'awakened' and they are 'sheep,' missing the fact that this scorn is the ultimate ego-trap.\n\n**The Non-Apology**\nYou messed up, but instead of owning it, you say: \"I'm sorry you feel that way, but my actions were justified by X.\" You're protecting your 'mask' at the total cost of integrity and connection."
                },
                {
                    title: "The Rigid Mask",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Physically, pride is 'stiff.' The neck is tight, the chin is held high ('looking down one's nose'), and the shoulders are pulled back in a rigid, military posture. The heart feels 'cold' or guarded, and the face feels like a mask that must never slip. There is a constant, nervous 'scanning' of the environment to see how you are being perceived."
                }
            ],
            nextDoors: [
                { label: "The Traps", targetRoom: "HUB", hotspot: "traps" },
                { label: "The Way Out", targetRoom: "HUB", hotspot: "exits" }
            ]
        },
        purpose: {
            title: "Purpose",
            spineBody: "Pride is a balm for the pain of lower levels. It provides a temporary sense of worth that motivates action and social achievement.",
            sections: [
                {
                    title: "The Survival of the Image",
                    importance: "core",
                    defaultExpanded: true,
                    body: "Pride is the first level where you actually feel 'good' about yourself. It helps you rise out of the shame and fear of the pits by giving you a tribe, a status, and a name to defend. It drives the pursuit of excellence and the acculturation that turns a biological animal into a productive member of society."
                },
                {
                    title: "The Balloon",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Pride is like a balloon: inflated, impressive-looking, but fragile. One pin and it pops. This is why 'pride goeth before a fall.'\n\nThe more you inflate your self-image, the more surface area you expose to attack. Every claim of specialness becomes a target. The truly powerful don't need to puff up—they have nothing to defend."
                },
                {
                    title: "Pride vs. Self-Esteem",
                    importance: "nuance",
                    defaultExpanded: false,
                    body: "Pride is based on comparison: 'I am better *than*.' Self-esteem is based on existence: 'I am enough.'\n\nPride needs constant feeding. It competes, compares, and collapses when it loses. Self-esteem doesn't need to win. It's already complete."
                }
            ]
        },
        traps: {
            body: "The brittle fortress of the 'Special' self.",
            chips: [
                {
                    label: "Arrogance",
                    title: "The Trap: Arrogance",
                    spineBody: "The habit of looking down on others to maintain a sense of height.",
                    sections: [
                        {
                            title: "Scorn & Division",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Arrogance is the belief that your worth depends on being 'better' than someone else. This creates an eternal state of conflict and loneliness, as genuine love and connection are impossible while you are busy maintaining a position of superiority over those around you.\n\nPride is divisive and gives rise to factionalism. Historically, man has habitually died for pridearmies still regularly slaughter each other for that aspect of pride called nationalism. Religious wars, political terrorism, and zealotry are all the price of pride."
                        }
                    ]
                },
                {
                    label: "Denial",
                    title: "The Trap: Denial",
                    spineBody: "The inability to see one's own shadow or admit mistakes.",
                    sections: [
                        {
                            title: "The Death of Growth",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Pride's main defense is denial. Because it is terrified of 'shame,' it refuses to look at its own fallibility. If you 'already know' or are 'already right,' no further learning is possible. This makes Pride the final, massive block before the breakthrough into real Power (Courage)."
                        }
                    ]
                },
                {
                    label: "Spiritual Pride",
                    title: "The Trap: The Spiritual Ego",
                    spineBody: "Being proud of your humility.",
                    sections: [
                        {
                            title: "The Hidden Trap",
                            importance: "core",
                            defaultExpanded: true,
                            body: "You've meditated for years. You eat clean. You've 'done the work.' And now you look at 'ordinary' people with pity. You're 'awake' and they're 'asleep.'\n\nThis is the spiritual ego—the most cunning trap of all. It uses your growth as fuel for more pride. Even humility can become a display. Even poverty can be worn as a badge of superiority."
                        },
                        {
                            title: "Real Life: The Humble Brag",
                            importance: "core",
                            defaultExpanded: false,
                            body: "'I just feel so peaceful now that I've let go of my ego.' (Said with obvious self-satisfaction.)\n\n'I don't care about money anymore.' (Posted on social media for approval.)\n\nThe moment you're proud of not being proud, you've fallen back into the trap."
                        }
                    ]
                }
            ]
        },
        exits: {
            body: "Moving from vanity to genuine humility is the way through the wall.",
            chips: [
                {
                    label: "Humility",
                    title: "The Exit: Humility",
                    spineBody: "Realizing that the truly humble cannot be humiliated.",
                    sections: [
                        {
                            title: "Immunity through Honesty",
                            importance: "core",
                            defaultExpanded: true,
                            body: "By admitting 'I don't know' or 'I am fallible,' you remove the target that the world attacks. Humility isn't thinking less of yourself; it's thinking of yourself less. It is the shift from 'I am better' to 'I am grateful,' which allows true power to flow through you without inflating your ego."
                        },
                        {
                            title: "True Self-Worth",
                            importance: "core",
                            defaultExpanded: false,
                            body: "Replace pride with self-esteem based on integrity. Real worth is inherent—it is a gift of your existence. When you know your value is eternal and shared with all life, the need to prove yourself better than others simply evaporates, and you are free to love."
                        }
                    ]
                },
                {
                    label: "The Light Bulb",
                    title: "The Exit: Channeling, Not Creating",
                    spineBody: "You don't create the light; you transmit it.",
                    sections: [
                        {
                            title: "The Electricity Analogy",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Imagine a light bulb claiming credit for the light it produces. 'Look how bright *I* am!' But the bulb doesn't create light—it channels electricity from a source far beyond itself.\n\nYou are like that bulb. Your talents, achievements, and gifts flow *through* you, not *from* you. When you realize this, pride dissolves into gratitude. You become a grateful channel, not a vain source."
                        },
                        {
                            title: "Giving Credit",
                            importance: "core",
                            defaultExpanded: false,
                            body: "Instead of puffing up after an achievement, try: 'Thank you for allowing this to happen through me.'\n\nThis isn't false modesty—it's accurate perception. You didn't choose your talents, your upbringing, or the circumstances that led to your success. Gratitude is simply honest accounting."
                        }
                    ]
                },
                LETTING_GO_ARTICLE
            ]
        },
        deepDive: {
            title: "Deep Dive: The Fragility of the Inflated Self",
            spineBody: "Understanding why pride attracts attack and how humility provides invulnerability.",
            sections: [
                {
                    title: "Humility as Armor",
                    importance: "core",
                    defaultExpanded: true,
                    body: "In martial arts, a rigid stance is a weakness. A fixed position gives your opponent a pattern to attack. The master stays fluid, without positionality.\n\nPride is a rigid stance. 'I am THIS.' The humble person has no fixed position to attack. They can say 'I was wrong' without collapsing, because their worth doesn't depend on being right."
                },
                {
                    title: "The Insatiable Hunger",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Pride is a statement of lack. It constantly needs feeding—more compliments, more status, more proof of superiority. But the more you feed it, the hungrier it gets. It's an appetite that can never be satisfied.\n\nThis is why wealthy, famous, 'successful' people can still feel empty. No external validation can fill an internal hole."
                },
                {
                    title: "The Dualities of Pride",
                    importance: "nuance",
                    defaultExpanded: false,
                    body: "Surrender the need to be 'special' to discover the peace of being 'enough':\n\n• **Vain, proud** ↔ **Humble**\n• **Be more** ↔ **Be enough**\n• **Important** ↔ **Nobody**\n• **Admired** ↔ **Looked down on**\n• **Status** ↔ **Common, ordinary**\n• **Noticed** ↔ **Ignored**\n• **Special** ↔ **Ordinary**\n• **Better than** ↔ **The same**\n• **Superior** ↔ **Inferior**\n• **Be right** ↔ **Be wrong**\n• **Opinionated** ↔ **Silent**\n• **Insider** ↔ **Excluded**\n• **Exclusive** ↔ **Common**\n• **Succeed** ↔ **Fail**"
                }
            ]
        }
    },
    courage: {
        feltSense: {
            title: "Felt Sense",
            spineBody: "Courage is the first level of true 'Power.' It feels like a steadying of the breath, a grounding of the feet, and the quiet realization: 'I can face this.'",
            sections: [
                {
                    title: "The Shift to Integrity",
                    importance: "core",
                    defaultExpanded: true,
                    body: "At 200, the energy shifts from 'Force' (reactive, defensive, manipulative) to 'Power' (proactive, creative, authentic). It is the point where you stop blaming the world for your state and take total responsibility. This honesty provides the first real sense of lasting safety.\\n\\n**Brain Physiology at 200+**\\nFrom calibration level 200 and up, there is a release of endorphins, which is accompanied by feelings of pleasure and happiness. Below consciousness level 200, there is a predominance of adrenaline and animal-instinct survival responses. This is why crossing the 200 threshold feels so dramatically different—it is literally a change in brain chemistry from stress hormones to pleasure hormones."
                },
                {
                    title: "The Somatic Grounding",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Unlike the 'puffed up' tension of Pride, Courage feels relaxed but alert. The spine is tall, the heart is open but not vulnerable, and the gaze is steady. It is the end of the 'Heavy Weather' zone and the beginning of 'Stabilization.'"
                }
            ],
            nextDoors: [
                { label: "The Traps", targetRoom: "HUB", hotspot: "traps" },
                { label: "The Way Out", targetRoom: "HUB", hotspot: "exits" }
            ]
        },
        purpose: {
            title: "Purpose",
            spineBody: "Courage is the gateway to growth. Its purpose is to overcome the inertia of the lower levels and provide the momentum needed for real evolution.",
            sections: [
                {
                    title: "The Engine of Change",
                    importance: "core",
                    defaultExpanded: true,
                    body: "Courage is the willingness to try new things, to fail, and to admit mistakes. It is the engine of the soul. Without Courage, spiritual work is impossible; with it, success is inevitable."
                },
                {
                    title: "The 200 Threshold: Global Significance",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Research indicates that 78% of the world's population calibrates below consciousness level 200 (in America, 49%). This explains why the world appears as it does—with its endless conflicts, wars, poverty, and crime.\\n\\nThe critical step at Level 200 is the choice to accept personal responsibility and accountability instead of blame. The source of humanity's problems is primarily endogenous (internal) rather than exogenous (external). Courage to face this truth is what separates those who grow from those who remain stuck."
                }
            ]
        },
        traps: {
            body: "The danger of mistaking the 'thrill' of courage for the 'state' of courage.",
            chips: [
                {
                    label: "Recklessness",
                    title: "The Trap: Recklessness",
                    spineBody: "Acting without wisdom to prove that you aren't afraid.",
                    sections: [
                        {
                            title: "Pseudo-Power",
                            importance: "core",
                            defaultExpanded: true,
                            body: "True courage is the ability to face fear, not the absence of it. Recklessness is often a denial of fear, which keeps the fear hidden. It is the ego trying to 'muscle' its way through rather than surrendering to the truth."
                        }
                    ]
                }
            ]
        },
        exits: {
            body: "Moving from responsibility to flexibility.",
            chips: [
                {
                    label: "Integrity",
                    title: "The Exit: Integrity",
                    spineBody: "Alignment between what you think, say, and do.",
                    sections: [
                        {
                            title: "The Power of Truth",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Integrity is the state of being whole and undivided. When you stop lying to yourself and others, the massive amount of energy used to maintain the 'masks' of lower levels returns to you. This energy is what carries you toward Neutrality."
                        }
                    ]
                },
                LETTING_GO_ARTICLE
            ]
        }
    },
    neutrality: {
        feltSense: {
            title: "Felt Sense",
            spineBody: "Neutrality is the state of being 'okay' no matter what. It feels like a spacious, cool, and flexible energy that is unattached to outcomes.",
            sections: [
                {
                    title: "The End of Rigidity",
                    importance: "core",
                    defaultExpanded: true,
                    body: "In Neutrality, the mind stops taking everything so personally. You see that 'it is what it is.' This flexibility makes you extremely resilient; like a willow tree in a storm, you bend so you don't break."
                },
                {
                    title: "Emotional Safety",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Neutrality feels like a 'safe harbor.' You no longer need to be right, win, or be special. You are simply present, watching life unfold with a quiet, appreciative interest."
                }
            ],
            nextDoors: [
                { label: "The Traps", targetRoom: "HUB", hotspot: "traps" },
                { label: "The Way Out", targetRoom: "HUB", hotspot: "exits" }
            ]
        },
        purpose: {
            title: "Purpose",
            spineBody: "The purpose of Neutrality is to provide a baseline of stability from which higher states can be safely explored.",
            sections: [
                {
                    title: "Recovery and Rest",
                    importance: "core",
                    defaultExpanded: true,
                    body: "Neutrality is where the nervous system finally gets to rest. It is a period of consolidation after the effort of lower levels. It allows the soul to 'recharge' before moving into active Willingness."
                }
            ]
        },
        traps: {
            body: "The danger of falling into indifference or mistaking withdrawal for freedom.",
            chips: [
                {
                    label: "Indifference",
                    title: "The Trap: Indifference",
                    spineBody: "Mistaking 'not caring' for 'not being attached.'",
                    sections: [
                        {
                            title: "The Cold Heart",
                            importance: "core",
                            defaultExpanded: true,
                            body: "True neutrality is warm and inclusive. Indifference is cold and exclusive. If you use 'neutrality' to avoid connection or responsibility, you have slipped into a subtler form of Apathy. True peace doesn't require closing the heart."
                        }
                    ]
                },
                {
                    label: "Detachment vs Nonattachment",
                    title: "The Trap: Confusing Detachment with Nonattachment",
                    spineBody: "Withdrawal is not the same as freedom.",
                    sections: [
                        {
                            title: "The Critical Distinction",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Nonattachment means freedom from projection and ego-investment in outcomes. Detachment, by contrast, indicates withdrawal and negation—a defense against the fear of attachment.\\n\\nProgressive detachment leads to ennui, flatness, and a decrease in aliveness and joy. If followed consistently, the pathway of negation leads to the Void—a state that can be mistaken for enlightenment but is actually devoid of Divine Love.\\n\\nThe true condition of Allness is experientially very different from nothingness. True nonattachment is alive, warm, and engaged; false detachment is cold, withdrawn, and spiritually deadening."
                        }
                    ]
                }
            ]
        },
        exits: {
            body: "Moving from okay-ness to active participation.",
            chips: [
                {
                    label: "Detachment",
                    title: "The Exit: Detachment",
                    spineBody: "Holding the world lightly while caring deeply.",
                    sections: [
                        {
                            title: "The Inner Anchor",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Detachment isn't about not having things; it's about things not having you. By releasing the need for life to go a certain way, you become free to engage with life fully. This freedom naturally leads to the enthusiasm of Willingness."
                        }
                    ]
                },
                LETTING_GO_ARTICLE
            ]
        }
    },
    willingness: {
        feltSense: {
            title: "Felt Sense",
            spineBody: "Willingness is the energy of optimism, enthusiasm, and 'Yes.' It feels like a bright, light, and eager invitation to life.",
            sections: [
                {
                    title: "The Open Door",
                    importance: "core",
                    defaultExpanded: true,
                    body: "In Willingness, you stop resisting life and start cooperating with it. You are 'willing' to do the work, to help others, and to learn. This state is extremely attractive and brings rapid progress in all areas of life."
                },
                {
                    title: "Mental Flexibility",
                    importance: "core",
                    defaultExpanded: false,
                    body: "The mind becomes quick, open, and inventive. You no longer see 'problems,' only 'opportunities for growth.' The somatic feeling is one of readiness and 'leaning in' to experience."
                }
            ],
            nextDoors: [
                { label: "The Traps", targetRoom: "HUB", hotspot: "traps" },
                { label: "The Way Out", targetRoom: "HUB", hotspot: "exits" }
            ]
        },
        purpose: {
            title: "Purpose",
            spineBody: "Willingness is the catalyst for rapid development. Its purpose is to move from passive existence to active mastery.",
            sections: [
                {
                    title: "Service and Growth",
                    importance: "core",
                    defaultExpanded: true,
                    body: "Willingness is the energy of the 'Great Student' and the 'Great Servant.' It humbles itself to learn and rises up to help. It is the state where you become a valuable asset to the world."
                },
                {
                    title: "The Golden Rule and Karma Yoga",
                    importance: "core",
                    defaultExpanded: false,
                    body: "The energy of Willingness is the level of the Golden Rule: 'Do unto others as you would have others do unto you.' In successful relationships, this results in mutuality rather than mere entanglement.\\n\\nWillingness is supportive rather than competitive. It expresses as the 'win-win' attitude instead of the lower levels' 'win-lose' zero-sum thinking.\\n\\nThe spiritual practice of selfless service is classically termed 'karma yoga', which, when combined with prayer and devotion, is transformative. It was the pathway of Mahatma Gandhi. True generosity expects no reward—the giving is its own reward."
                }
            ]
        },
        traps: {
            body: "The danger of over-extension and 'People Pleasing.'",
            chips: [
                {
                    label: "Over-Commitment",
                    title: "The Trap: Over-Commitment",
                    spineBody: "Saying 'Yes' to everything to avoid the discomfort of saying 'No.'",
                    sections: [
                        {
                            title: "The Burnout of 'Yes'",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Willingness can lead to exhaustion if not guided by wisdom. The ego might use 'willingness' to seek approval or prove its worth. True willingness includes the willingness to set boundaries and rest."
                        }
                    ]
                }
            ]
        },
        exits: {
            body: "Moving from helping to realizing.",
            chips: [
                {
                    label: "Commitment",
                    title: "The Exit: Commitment",
                    spineBody: "The steady application of will toward a higher purpose.",
                    sections: [
                        {
                            title: "The Focused Power",
                            importance: "core",
                            defaultExpanded: true,
                            body: "By committing to a path, you move beyond the scattered energy of mere 'willingness' into the deep integration of Acceptance. Commitment is the 'final polish' of the individual will before it transitions into the Divine Will."
                        }
                    ]
                },
                LETTING_GO_ARTICLE
            ]
        }
    },
    acceptance: {
        feltSense: {
            title: "Felt Sense",
            spineBody: "Acceptance is the profound realization that everything is exactly as it should be. It feels like a warm, harmonious, and deep 'Settle' into reality.",
            sections: [
                {
                    title: "The Harmony of Now",
                    importance: "core",
                    defaultExpanded: true,
                    body: "At 350, you stop trying to change the world to suit your desires. Instead, you change yourself to harmonize with the world. This is not a passive 'giving up,' but a powerful alignment with the flow of Life itself."
                },
                {
                    title: "Self-Responsibility",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Acceptance is the final stage of individual evolution. You realize that you are the creator of your own experience. The somatic feeling is one of being 'at home' in your own skin and in the world."
                }
            ],
            nextDoors: [
                { label: "The Traps", targetRoom: "HUB", hotspot: "traps" },
                { label: "The Way Out", targetRoom: "HUB", hotspot: "exits" }
            ]
        },
        purpose: {
            title: "Purpose",
            spineBody: "The purpose of Acceptance is to bring the individual into total harmony with the whole of existence.",
            sections: [
                {
                    title: "The End of Conflict",
                    importance: "core",
                    defaultExpanded: true,
                    body: "Acceptance ends the 'war' between what is and what we think 'should be.' It is the foundation for the clear, objective clarity of Reason and the unconditional warmth of Love."
                },
                {
                    title: "The Major Transformation",
                    importance: "core",
                    defaultExpanded: false,
                    body: "At Level 350, a major transformation occurs: the realization that oneself is the source and creator of one's experience of life. Below 200, there is the tendency to see oneself as a victim at the mercy of life—believing the source of happiness (or problems) is 'out there.'\\n\\nThe enormous jump at Acceptance is taking back one's own power with the realization that the source of happiness is within. Nothing 'out there' has the capacity to make you happy. Love is not something given or taken away by another but is created from within."
                }
            ]
        },
        traps: {
            body: "The danger of 'Spiritual Bypassing.'",
            chips: [
                {
                    label: "Complacency",
                    title: "The Trap: Complacency",
                    spineBody: "Using 'it's all perfect' as an excuse to ignore necessary action.",
                    sections: [
                        {
                            title: "The Bypass of Truth",
                            importance: "core",
                            defaultExpanded: true,
                            body: "True acceptance includes the acceptance of your own capacity to act and change. If 'acceptance' leads to laziness or the ignoring of suffering, it is a subtler form of Denial. Real acceptance is active and engaged."
                        }
                    ]
                }
            ]
        },
        exits: {
            body: "Moving from peace to understanding.",
            chips: [
                {
                    label: "Forgiveness",
                    title: "The Exit: Total Forgiveness",
                    spineBody: "The complete release of the past as a valid reference for the present.",
                    sections: [
                        {
                            title: "The Clean Slate",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Forgiveness at this level is the recognition that 'no one ever did anything wrong' from their own level of consciousness. This perspective opens the door to the vast intellectual clarity of Reason."
                        }
                    ]
                },
                LETTING_GO_ARTICLE
            ]
        },
    },
    reason: {
        feltSense: {
            title: "Felt Sense",
            spineBody: "Reason is the energy of massive intellectual clarity, objectivity, and understanding. It feels like a 'cool, clear light' that penetrates the fog of emotion.",
            sections: [
                {
                    title: "The Objective Lens",
                    importance: "core",
                    defaultExpanded: true,
                    body: "At 400, the mind becomes extremely powerful. You are able to see the interconnectedness of all things and the cause-and-effect relationships that govern the world. This is the level of science, philosophy, and peak medicine."
                },
                {
                    title: "Mental Sovereignty",
                    importance: "core",
                    defaultExpanded: false,
                    body: "You are no longer a victim of your emotions or circumstances. You use logic and reason to solve problems and understand reality. The somatic feeling is one of 'Sharp Alertness' and a quiet, focused mind."
                }
            ],
            nextDoors: [
                { label: "The Traps", targetRoom: "HUB", hotspot: "traps" },
                { label: "The Way Out", targetRoom: "HUB", hotspot: "exits" }
            ]
        },
        purpose: {
            title: "Purpose",
            spineBody: "The purpose of Reason is to bring the human mind to its highest potential of understanding within the realm of form.",
            sections: [
                {
                    title: "Clarity and Order",
                    importance: "core",
                    defaultExpanded: true,
                    body: "Reason brings order to chaos. It provides the intellectual framework that allows for the safe and effective navigation of complex systems. It is the final stage before the breakthrough into the Heart (Love)."
                },
                {
                    title: "The 4% Threshold",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Although Reason is highly effective in a technical world where logic dominates, Reason itself is paradoxically the major block to reaching higher levels of consciousness—because it attracts identification of the self as mind.\\n\\nTranscending this level is relatively uncommon: only 4% of people do so. It requires a paradigm shift from the descriptive to the subjective and experiential. The happiness level at Reason is approximately 80%, in marked contrast to its low percentages below level 200 (1-22%). But to go higher requires surrendering the identity 'I am my thoughts.'"
                }
            ]
        },
        traps: {
            body: "The danger of 'Intellectual Hubris.'",
            chips: [
                {
                    label: "The Lab Coat",
                    title: "The Trap: Reductionism",
                    spineBody: "Believing that if it can't be measured, it doesn't exist.",
                    sections: [
                        {
                            title: "Missing the Essence",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Reason can become its own prison. By trying to explain everything through logic, you might miss the 'ineffable' beauty and mystery of life. The ego may use 'reason' to maintain a sense of superiority over those it deems 'irrational.'"
                        }
                    ]
                }
            ]
        },
        exits: {
            body: "Moving from thinking to being.",
            chips: [
                {
                    label: "Wisdom",
                    title: "The Exit: Wisdom",
                    spineBody: "The integration of the head and the heart.",
                    sections: [
                        {
                            title: "Beyond the Concept",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Wisdom realizes that 'knowing' is different from 'thinking about.' By surrendering the need for an intellectual explanation, the door to the intuitive warmth of Love opens. You move from the 'map' to the 'terrain.'"
                        }
                    ]
                },
                LETTING_GO_ARTICLE
            ]
        }
    },
    love: {
        feltSense: {
            title: "Felt Sense",
            spineBody: "Love at 500 is not an emotion, but a state of being. It is the realization of the absolute beauty and perfection of all life. It feels like a radiant, unconditional warmth.",
            sections: [
                {
                    title: "The Heart Center",
                    importance: "core",
                    defaultExpanded: true,
                    body: "At 500, the focus shifts from the mind to the heart. You see the divine spark in every living thing. The world is no longer seen as 'separate' or 'dangerous,' but as an extension of your own being."
                },
                {
                    title: "Unconditionality",
                    importance: "core",
                    defaultExpanded: false,
                    body: "This love has no 'target' and requires no 'payoff.' It is a constant radiation, like the sun. The somatic feeling is a profound opening in the center of the chest and a sense of 'Glow' throughout the body."
                }
            ],
            nextDoors: [
                { label: "The Traps", targetRoom: "HUB", hotspot: "traps" },
                { label: "The Way Out", targetRoom: "HUB", hotspot: "exits" }
            ]
        },
        purpose: {
            title: "Purpose",
            spineBody: "The purpose of Love is to bridge the gap between the individual and the infinite.",
            sections: [
                {
                    title: "Healing and Inclusion",
                    importance: "core",
                    defaultExpanded: true,
                    body: "Love is the ultimate healer. By including everything in its warm embrace, it dissolves conflict and brings about a state of profound peace. It is the energy of the saint and the higher spiritual teacher."
                },
                {
                    title: "Infatuation vs True Love",
                    importance: "core",
                    defaultExpanded: false,
                    body: "At lower levels, what is perceived as 'love' is often conditional—identified with possession, passion, romance, and desire. Infatuations calibrate at 145, revealing their origin as primarily the mating instinct from our animal nature.\\n\\n**The contrast:**\\n• Infatuation: Left-brain, adrenaline/sex hormones, frantic/fearful, addiction/craving, impaired judgment\\n• True Love (500+): Right-brain, endorphins, calm/balanced, fulfillment/content, improved judgment\\n\\nTrue love emanates from the heart, not the mind. It is forgiving, nurturing, and supportive. At 500, approximately 90% of people experience happiness as a basic quality of life."
                }
            ]
        },
        traps: {
            body: "The danger of 'Sentimentality.'",
            chips: [
                {
                    label: "Attachment",
                    title: "The Trap: Specialized Love",
                    spineBody: "Falling back into 'I love you BECAUSE...' rather than 'I love because that is what I am.'",
                    sections: [
                        {
                            title: "The Ego's Mimicry",
                            importance: "core",
                            defaultExpanded: true,
                            body: "The ego may try to mimic Love to gain control or approval. This is often seen in 'martyrdom' or toxic sentimentality. True Love is free, powerful, and requires nothing. It is a state of Grace, not an act of will."
                        }
                    ]
                }
            ]
        },
        exits: {
            body: "Moving from including to radiating.",
            chips: [
                {
                    label: "Devotion",
                    title: "The Exit: Devotion",
                    spineBody: "The total surrender of the self to the service of Love.",
                    sections: [
                        {
                            title: "The One and the All",
                            importance: "core",
                            defaultExpanded: true,
                            body: "By surrendering the remaining 'I' to the state of Love, you enter the causeless Joy of the higher spiritual states. You move from 'loving' to 'being Love.'"
                        }
                    ]
                },
                LETTING_GO_ARTICLE
            ]
        }
    },
    joy: {
        feltSense: {
            title: "Felt Sense",
            spineBody: "Joy is the 'Effortless Bliss' that arises when the heart is completely open. It is a luminous energy that feels like 'Dancing Stillness.'",
            sections: [
                {
                    title: "Divine Presence",
                    importance: "core",
                    defaultExpanded: true,
                    body: "At 540, the world is seen as a 'Lila' (divine play). Everything is light, airy, and full of wonder. You are 'in the world but not of it.' The somatic feeling is one of incredible lightness and spontaneous laughter."
                },
                {
                    title: "The Radiance",
                    importance: "core",
                    defaultExpanded: false,
                    body: "This joy comes from within and is not dependent on circumstances. It is the energy of the miracle and the profound healer. Your mere presence becomes a blessing to those around you."
                }
            ],
            nextDoors: [
                { label: "The Traps", targetRoom: "HUB", hotspot: "traps" },
                { label: "The Way Out", targetRoom: "HUB", hotspot: "exits" }
            ]
        },
        purpose: {
            title: "Purpose",
            spineBody: "The purpose of Joy is to demonstrate the inherent happiness of the soul when it is free from the ego.",
            sections: [
                {
                    title: "Spontaneous Perfection",
                    importance: "core",
                    defaultExpanded: true,
                    body: "Joy shows that the fruit of the spiritual path is not a somber 'holiness,' but a vibrant, innocent, and total 'Yes' to life. It is the final stage before the subject-object duality dissolves into Peace."
                },
                {
                    title: "The Domain of Saints",
                    importance: "core",
                    defaultExpanded: false,
                    body: "From level 540 upward is the domain of saints, spiritual healers, and advanced spiritual students. This level is reached by only 0.4% of the world's population—yet in spiritually-committed groups (12-step, monastics, ashrams), 50-55% reach this goal.\\n\\nAt this level is a capacity for enormous patience and persistence in the face of prolonged adversity. The hallmark is compassion. People here have a notable effect on others and are capable of a prolonged, open visual gaze that induces states of love and peace in those around them."
                }
            ]
        },
        traps: {
            body: "The danger of 'Spiritual Greed.'",
            chips: [
                {
                    label: "Chasing State",
                    title: "The Trap: Bliss-Junkie",
                    spineBody: "Attaching to the 'feeling' of joy rather than the 'source' of it.",
                    sections: [
                        {
                            title: "The Golden Handcuffs",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Even joy can become a trap if the ego attaches to it. If you 'need' to feel high to be okay, you are still in a state of Desire. True freedom is the willingness to let the joy be here, or not, while resting as the awareness beneath it."
                        }
                    ]
                }
            ]
        },
        exits: {
            body: "Moving from radiance to stillness.",
            chips: [
                {
                    label: "Bliss",
                    title: "The Exit: Bliss",
                    spineBody: "The dissolution of the 'radiator' into the 'radiance.'",
                    sections: [
                        {
                            title: "The Great Silence",
                            importance: "core",
                            defaultExpanded: true,
                            body: "By surrendering the 'joyful self' into the underlying Silence, you enter the level of Peace (600). The wave returns to the Ocean."
                        }
                    ]
                },
                LETTING_GO_ARTICLE
            ]
        }
    },
    peace: {
        feltSense: {
            title: "Felt Sense",
            spineBody: "Peace (600) is the level of Non-Duality. It is a 'Motionless Stillness' that is beyond time and space. It feels like being the entire Universe at once.",
            sections: [
                {
                    title: "The End of the Traveler",
                    importance: "core",
                    defaultExpanded: true,
                    body: "At 600, there is no longer a 'me' experiencing 'peace.' There is only Peace. The world is seen as a slow-motion hologram of light. All subject-object duality has collapsed. You are the Awareness in which the world arises."
                },
                {
                    title: "Absolute Perfection",
                    importance: "core",
                    defaultExpanded: false,
                    body: "Everything is seen in its absolute perfection. Nothing needs to change. There is no 'higher' or 'lower.' The somatic feeling is one of infinite weightlessness and absolute, unshakable Rest."
                }
            ],
            nextDoors: [
                { label: "The Traps", targetRoom: "HUB", hotspot: "traps" },
                { label: "The Way Out", targetRoom: "HUB", hotspot: "exits" }
            ]
        },
        purpose: {
            title: "Purpose",
            spineBody: "The purpose of Peace is to serve as the threshold of Enlightenment.",
            sections: [
                {
                    title: "Transcendence",
                    importance: "core",
                    defaultExpanded: true,
                    body: "Peace is the level where the human experience is fully transcended while still remaining in the body. It is the energy of the Sage. Its presence alone heals the collective consciousness of humanity."
                }
            ]
        },
        traps: {
            body: "There are no 'traps' in the traditional sense at this level, only the risk of 'identifying' with the state.",
            chips: [
                {
                    label: "Identification",
                    title: "The Subtlest Trap",
                    spineBody: "The residual idea: 'I am Enlightened.'",
                    sections: [
                        {
                            title: "The Final Veil",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Any thought about the state is not the state. The idea of being 'someone' who is peaceful is the final veil between the self and the Absolute (Self-Realization). Even this must eventually be surrendered."
                        }
                    ]
                }
            ]
        },
        exits: {
            body: "Moving from Peace to the Absolute.",
            chips: [
                {
                    label: "Self-Realization",
                    title: "The Ultimate Exit",
                    spineBody: "The realization that there was never anyone here to be enlightened.",
                    sections: [
                        {
                            title: "The Infinite Return",
                            importance: "core",
                            defaultExpanded: true,
                            body: "The final step is the realization that you were already the Self before the search began. The path ends where it started, but with the total realization of the truth. This is the end of all possible 'Levels.'"
                        }
                    ]
                },
                LETTING_GO_ARTICLE
            ]
        }
    }
};
