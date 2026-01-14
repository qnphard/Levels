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
                        }
                    ]
                },
                LETTING_GO_ARTICLE
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
                        }
                    ]
                },
                LETTING_GO_ARTICLE
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
                            body: "By staying in Apathy, the ego can blame God, society, or parents for its condition. This 'face-saving' maneuver prevents the shame of failure by claiming that one never even had a chance."
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
                LETTING_GO_ARTICLE
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
                    body: "Grief is higher energy than Apathy (50). While Apathy is 'dead,' Grief is 'hurting.' This pain is a sign of life—it means you care enough to feel. By allowing the grief to process, the 'frozen' soul begins to thaw, eventually allowing for the return of Desire and Anger, which are steps toward Courage."
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
                LETTING_GO_ARTICLE
            ]
        }
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
                LETTING_GO_ARTICLE
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
                    title: "The Trap: Glamour",
                    spineBody: "The projection of magical qualities onto objects, people, or statuses.",
                    sections: [
                        {
                            title: "Projected Perfection",
                            importance: "core",
                            defaultExpanded: true,
                            body: "Glamour is the belief that 'Getting X will finally make me feel Y.' It imbues the object of desire with an unrealistic allure. When the object is finally acquired, the glamour fades, and the person is left with the same old internal void, leading to disappointment and the search for a new 'fix.'"
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
                            body: "Desire is based on 'I don't have.' Gratitude is based on 'I have enough.' Shifting your focus to what is already present in your life immediately raises your energy out of the craving of Level 125 into the satisfaction of higher states."
                        }
                    ]
                },
                LETTING_GO_ARTICLE
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
                LETTING_GO_ARTICLE
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
                            body: "Arrogance is the belief that your worth depends on being 'better' than someone else. This creates an eternal state of conflict and loneliness, as genuine love and connection are impossible while you are busy maintaining a position of superiority over those around you."
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
                LETTING_GO_ARTICLE
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
                    body: "At 200, the energy shifts from 'Force' (reactive, defensive, manipulative) to 'Power' (proactive, creative, authentic). It is the point where you stop blaming the world for your state and take total responsibility. This honesty provides the first real sense of lasting safety."
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
            body: "The danger of falling into indifference.",
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
