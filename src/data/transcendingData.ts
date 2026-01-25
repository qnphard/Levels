/**
 * Transcending Data
 * 
 * Deep content for the "How to Transcend" screens, structured after
 * the chapter pattern in "Transcending the Levels of Consciousness".
 * 
 * Content synthesized from 5 source books:
 * - Transcending the Levels of Consciousness
 * - Power vs Force
 * - Letting Go
 * - Healing & Recovery
 * - Truth vs Falsehood
 */

export interface Duality {
    from: string;
    to: string;
}

/**
 * Content block types for rich formatting
 */
export type ContentBlock =
    | { type: 'text'; content: string }
    | { type: 'callout'; variant: 'insight' | 'example' | 'warning' | 'tip'; title?: string; content: string }
    | { type: 'bullets'; items: string[] }
    | { type: 'steps'; items: { title: string; content: string }[] }
    | { type: 'quote'; quote: string; source?: string };

export interface TranscendingContent {
    /** The essential nature and dangers of this level */
    corePattern: string | ContentBlock[];
    /** How the ego operates and manifests at this level */
    egoDynamics: string | ContentBlock[];
    /** Karmic factors, spiritual meaning, deeper context */
    spiritualContext: string | ContentBlock[];
    /** The actual path through and beyond this level */
    pathThrough: string | ContentBlock[];
    /** Transformation pairs: from negative to positive */
    dualities: Duality[];
}

export const TRANSCENDING_DATA: Record<string, TranscendingContent> = {
    shame: {
        corePattern: [
            {
                type: 'text',
                content: `We've all felt that burning sensation when we've done something embarrassing—saying something stupid at a party, being rejected, or having our mistakes exposed publicly. That's a taste of shame. But for some of us, that feeling isn't just occasional—it becomes a constant companion.`
            },
            {
                type: 'text',
                content: `When we're stuck in shame, we feel fundamentally flawed. Not just "I made a mistake," but "I AM a mistake." We want to disappear, become invisible, hide from the world.`
            },
            {
                type: 'callout',
                variant: 'example',
                title: 'Sound Familiar?',
                content: `The person who avoids all social gatherings because they're convinced everyone is judging them. The adult who still cringes at childhood memories of being mocked. The perfectionist who works 80-hour weeks because any mistake feels like proof they're worthless.`
            },
            {
                type: 'callout',
                variant: 'warning',
                content: `At its core, shame tells us we don't deserve to exist. This is why it can be so dangerous—it drains our will to live and makes even small acts of self-care feel undeserved.`
            },
        ],

        egoDynamics: [
            {
                type: 'text',
                content: `When we're caught in shame, our mind does strange things to cope. We might become extremely shy and withdrawn, afraid to speak up because anything we say could "prove" how flawed we are. Or we might swing the other way—becoming rigid perfectionists, harsh critics of others, or even cruel.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Hidden Truth',
                content: `People who loudly judge others are often drowning in their own shame. The person who aggressively shames "sinners" online may be hiding from their own inner demons. It's easier to point fingers outward than to face our own pain.`
            },
            {
                type: 'text',
                content: `We might also overcompensate—becoming workaholics, overachievers, or control freaks—anything to "prove" we're worthy. But it never feels like enough because the shame underneath keeps whispering that we're frauds.`
            },
            {
                type: 'bullets',
                items: [
                    'Avoiding eye contact and shrinking in social situations',
                    'Harsh self-talk ("I\'m so stupid," "I always mess things up")',
                    'Pushing people away before they can reject us',
                    'Perfectionism that\'s never satisfied',
                ]
            },
        ],

        spiritualContext: [
            {
                type: 'quote',
                quote: `Sometimes our darkest moments become doorways to our greatest breakthroughs.`
            },
            {
                type: 'text',
                content: `Many spiritual traditions speak of the "dark night of the soul"—a period of intense despair that, when we finally surrender, opens into profound peace.`
            },
            {
                type: 'text',
                content: `When we hit rock bottom with shame, we often reach a turning point. We're so exhausted from hating ourselves that we finally become willing to try something different. In that moment of complete surrender—"I can't do this alone"—something shifts.`
            },
            {
                type: 'callout',
                variant: 'insight',
                content: `This doesn't mean suffering is good or necessary. But it does mean that even our deepest shame can become the foundation for transformation. Many of the most compassionate, wise people you'll meet have walked through their own shame and come out the other side.`
            },
        ],

        pathThrough: [
            {
                type: 'text',
                content: `The way through shame isn't about becoming shameless—it's about learning to hold our imperfections with compassion instead of contempt. This is a journey, not a quick fix, but every step you take builds on the last.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'The Core Shift',
                content: `Shame dissolves when we stop fighting it and start meeting it with kindness. We don't transcend shame by proving we're "good enough"—we transcend it by accepting that we don't have to be.`
            },
            {
                type: 'steps',
                items: [
                    {
                        title: 'Recognize the shame spiral',
                        content: `Shame has a harsh, absolute voice: "You always..." "You never..." "You're such a..." When you hear these words in your head, that's your signal. Pause. Name it: "This is shame talking." Just that awareness creates distance between you and the feeling.`
                    },
                    {
                        title: 'Practice the self-compassion pause',
                        content: `When shame arises, physically place a hand on your heart. Take three slow breaths. Then speak to yourself as you would to a dear friend: "This is really hard right now. Everyone struggles with this. May I be kind to myself in this moment." This isn't weakness—it's the beginning of real strength.`
                    },
                    {
                        title: 'Break the secrecy cycle',
                        content: `Shame thrives in darkness and isolation. Find one safe person—a therapist, sponsor, trusted friend, or support group—and share what you're carrying. When someone witnesses our shame without rejecting us, something profound shifts. The secret loses its power.`
                    },
                    {
                        title: 'Challenge the identity story',
                        content: `Notice when you shift from "I did something bad" to "I AM bad." These are completely different. You are not your mistakes. You are a human being who, like all humans, is learning through trial and error. Ask yourself: "Would I condemn a child for making this mistake while learning?"`
                    },
                    {
                        title: 'Practice the letting go technique',
                        content: `When shame surfaces, don't fight it or engage with the story. Simply notice the physical sensation—the tightness, the heat, the contraction. Let it be there without believing the thoughts that come with it. Say inwardly: "I let go of wanting to be ashamed" or "I let go of resisting this feeling."`
                    },
                    {
                        title: 'Rewrite your origin story',
                        content: `Most shame originates in childhood experiences where we were shamed by others. Revisit those memories with adult eyes. See the child you were. Recognize that a child could only conclude "something is wrong with me" when what was actually wrong was the situation. The shame was never yours to carry.`
                    },
                    {
                        title: 'Serve others in small ways',
                        content: `One of the fastest antidotes to shame is getting out of our own head through service. Hold a door. Help a neighbor. Volunteer. When we contribute to others' wellbeing, we naturally experience our own worth. This isn't about earning value—it's about remembering it.`
                    },
                    {
                        title: 'Celebrate imperfection',
                        content: `Start noticing when you're "good enough" instead of perfect, and let that be okay. Share your struggles authentically. Admit when you don't know something. Each time you let yourself be imperfect without self-attack, you're rewiring the shame response.`
                    },
                ]
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Daily Practice',
                content: `Each morning, place a hand on your heart and say: "I am worthy of love and belonging—not because of what I do, but because I exist." Let it feel awkward at first. Repetition creates new neural pathways.`
            },
            {
                type: 'quote',
                quote: `The path through shame leads to genuine self-worth—not arrogant pride, but a quiet knowing that we have a right to exist, just as we are.`
            },
        ],

        dualities: [
            { from: "I am a mistake", to: "I made a mistake" },
            { from: "Hiding from the world", to: "Showing up authentically" },
            { from: "Harsh self-criticism", to: "Gentle self-compassion" },
            { from: "Keeping secrets in isolation", to: "Sharing with safe people" },
            { from: "Perfectionism", to: "Good enough is enough" },
            { from: "Pushing people away", to: "Letting people in" },
            { from: "I don't deserve good things", to: "I deserve love and care" },
            { from: "What's wrong with me?", to: "What happened to me?" },
            { from: "I'm fundamentally flawed", to: "I'm learning and growing" },
            { from: "Self-punishment", to: "Self-forgiveness" },
        ],
    },


    guilt: {
        corePattern: [
            {
                type: 'text',
                content: `We all know that sinking feeling in our stomach when we've hurt someone or done something we regret. That's guilt—and in small doses, it's actually healthy. It's our conscience saying, "Hey, that wasn't okay. Let's do better next time."`
            },
            {
                type: 'text',
                content: `But sometimes guilt becomes a prison. We replay past mistakes over and over. We punish ourselves with harsh inner criticism. We believe we don't deserve forgiveness or happiness because of what we've done.`
            },
            {
                type: 'callout',
                variant: 'example',
                title: 'Sound Familiar?',
                content: `The parent who can't forgive themselves for yelling at their kids. The person still carrying guilt about a relationship that ended badly years ago. The adult who feels guilty every time they take time for themselves instead of helping others.`
            },
            {
                type: 'callout',
                variant: 'warning',
                title: 'The Self-Punishment Trap',
                content: `When we're stuck in chronic guilt, we often unconsciously create situations where we get punished—bad relationships, self-sabotage, "accidents" that aren't really accidents. It's as if part of us believes we deserve to suffer.`
            },
        ],

        egoDynamics: [
            {
                type: 'text',
                content: `Here's something important to understand: guilt often has nothing to do with whether we actually did something wrong. Many of us carry guilt that was programmed into us as children—by parents, teachers, or religious authority figures who used guilt as a tool to control our behavior.`
            },
            {
                type: 'text',
                content: `When we're caught in guilt, our mind plays tricks:`
            },
            {
                type: 'bullets',
                items: [
                    `We become our own harshest prosecutor, constantly building a case against ourselves`,
                    `We replay painful memories, making them worse each time`,
                    `We project our guilt onto others—judging and blaming them for the very things we can't forgive in ourselves`,
                    `We might even seek punishment, staying in toxic situations because we feel we deserve it`,
                ]
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Hidden Truth',
                content: `The person who harshly judges "irresponsible" people is often struggling with guilt about times they weren't responsible. The parent who is hypervigilant about their kids' behavior might be trying to atone for their own perceived failures.`
            },
            {
                type: 'text',
                content: `Guilt also has a sneaky payoff—it lets us feel like we're "taking our punishment" without actually changing anything.`
            },
        ],

        spiritualContext: [
            {
                type: 'callout',
                variant: 'insight',
                title: 'The Key Distinction',
                content: `Healthy guilt says "I did something bad." Toxic guilt says "I am bad." The first leads to genuine apology and change. The second leads to endless suffering.`
            },
            {
                type: 'text',
                content: `From a deeper perspective, we're all doing the best we can with the understanding we have at any given moment. The "you" who made that mistake wasn't the same "you" who exists now. You've grown. You've learned.`
            },
            {
                type: 'quote',
                quote: `Beating yourself up for past mistakes is like punishing today's child for what a toddler did.`
            },
            {
                type: 'text',
                content: `Many spiritual traditions teach that genuine remorse, combined with a commitment to do better, is enough. We don't need to keep suffering. The universe isn't keeping score—we are.`
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Balancing The Scales',
                content: `Every act of kindness, every time we choose love over fear, every effort to help others—these all "balance the scales." We can heal, grow, and become people who make the world better precisely because we understand what it's like to struggle.`
            },
        ],

        pathThrough: [
            {
                type: 'text',
                content: `The path through guilt isn't about becoming irresponsible or never caring when we hurt others. It's about transforming toxic guilt into genuine accountability and growth.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Core Shift',
                content: `We're not trying to escape guilt—we're learning to use it wisely. Healthy guilt is a teacher. Toxic guilt is a prison. The difference is whether it moves us forward or keeps us stuck.`
            },
            {
                type: 'steps',
                items: [
                    {
                        title: 'Recognize the guilt type',
                        content: `Ask yourself: "Is this guilt pointing me toward a specific action I can take, or is it just making me feel bad about myself?" Healthy guilt has a clear message: apologize, make amends, change behavior. Toxic guilt just loops endlessly with no resolution.`
                    },
                    {
                        title: 'Practice the guilt pause',
                        content: `When guilt arises, pause before spiraling. Take three breaths. Ask: "What specifically am I feeling guilty about? Is this guilt proportional to what actually happened? What would I say to a friend in this situation?" This creates space between the feeling and the reaction.`
                    },
                    {
                        title: 'Make genuine amends when possible',
                        content: `If you've hurt someone and can apologize or make it right, do it. A sincere apology has three parts: acknowledging what you did, expressing genuine remorse, and committing to different behavior. But remember: you can only take responsibility for your actions, not for how others choose to respond.`
                    },
                    {
                        title: 'Write a release letter',
                        content: `For situations where direct amends aren't possible—the person is gone, deceased, or contact would cause more harm—write a letter you never send. Pour out everything: what you did, how you feel, what you'd do differently. Then burn it, bury it, or delete it. This ritual allows completion.`
                    },
                    {
                        title: 'Challenge inherited guilt',
                        content: `Ask: "Where did I learn to feel guilty about this?" Much of our guilt was programmed in childhood. We may feel guilty for having needs, for saying no, for being ourselves. Recognizing that guilt as borrowed—not earned—helps us release it.`
                    },
                    {
                        title: 'Update your self-image',
                        content: `The "you" who made that mistake isn't who you are now. You've learned, grown, and changed. Create a simple affirmation: "I am not defined by my past. I am defined by who I choose to be now." Say it until you start to believe it.`
                    },
                    {
                        title: 'Transform guilt into service',
                        content: `Instead of endlessly punishing yourself, channel that energy into being the person you want to be. Help others. Make a difference. Your past mistakes can become the fuel for a more compassionate future. Guilt that drives positive action becomes redemption.`
                    },
                    {
                        title: 'Practice radical self-forgiveness',
                        content: `This is the deepest work. Place a hand on your heart and say: "I forgive myself for what I did. I was doing my best with what I knew then. I am allowed to move forward." Let it feel uncomfortable. Self-forgiveness isn't earned—it's claimed.`
                    },
                ]
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Daily Practice',
                content: `Each evening, do a brief review: "Did I act in alignment with my values today? If not, what can I do differently tomorrow?" This replaces toxic rumination with constructive reflection. Then release it—tomorrow is a fresh start.`
            },
            {
                type: 'quote',
                quote: `Endless guilt helps no one. A life lived with kindness, presence, and genuine care—that's the real way to "make up" for past wrongs.`
            },
        ],

        dualities: [
            { from: "I am bad", to: "I did something I regret" },
            { from: "Endless self-punishment", to: "Genuine amends and moving on" },
            { from: "I should have known better", to: "I did my best with what I knew then" },
            { from: "I don't deserve forgiveness", to: "Everyone deserves a chance to grow" },
            { from: "Replaying the past", to: "Learning and releasing" },
            { from: "Judging others harshly", to: "Compassion for everyone's struggles" },
            { from: "Seeking punishment", to: "Seeking healing" },
            { from: "My past defines me", to: "My choices now define me" },
            { from: "Guilt as suffering", to: "Guilt as a call to grow" },
            { from: "I owe the universe pain", to: "I owe the universe my best self" },
        ],
    },

    // TODO: Will be populated in subsequent level audits
    apathy: {
        corePattern: [
            {
                type: 'text',
                content: `We've all had those days where we just can't seem to care. The alarm goes off, and we think, "What's the point?" We scroll through our phones for hours, unable to muster the energy to do anything meaningful. That's a taste of apathy.`
            },
            {
                type: 'text',
                content: `But for some of us, this isn't just a bad day—it becomes a way of life. Everything feels gray. Nothing seems worth the effort. The future looks bleak, and we've stopped believing things can get better. We're just... existing, not really living.`
            },
            {
                type: 'callout',
                variant: 'example',
                title: 'Sound Familiar?',
                content: `The student who stops going to class because "it doesn't matter anyway." The person who stays in bed all day, not even depressed exactly, just... empty. The adult who's given up on their dreams and just goes through the motions. The person who's stopped taking care of themselves—not eating well, not exercising, not connecting with others.`
            },
            {
                type: 'callout',
                variant: 'warning',
                title: 'The Core Danger',
                content: `At its core, apathy is a loss of hope. We've been hurt, disappointed, or exhausted so many times that we've stopped trying. It feels safer to expect nothing than to hope and be let down again.`
            },
        ],

        egoDynamics: [
            {
                type: 'text',
                content: `Here's what's tricky about apathy: it disguises itself as wisdom. We tell ourselves we're being "realistic" or "practical." We say "I've accepted things as they are." But underneath, there's often a hidden belief: "I'm not worth the effort."`
            },
            {
                type: 'text',
                content: `Some common ways apathy shows up:`
            },
            {
                type: 'bullets',
                items: [
                    `"What's the use?" becomes our automatic response to everything`,
                    `We blame circumstances for our situation without taking any action`,
                    `We reject help when it's offered ("It won't work anyway")`,
                    `Small setbacks confirm our belief that trying is pointless`,
                    `We feel like a burden to others, which just makes us withdraw more`,
                ]
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Hidden Truth',
                content: `The person who says they're "fine" being single has actually given up on finding love. The worker who does the bare minimum isn't lazy—they've stopped believing their effort matters.`
            },
            {
                type: 'text',
                content: `Here's something important: underneath apathy, there's often a lot of pain. We became apathetic to protect ourselves from disappointment. In a way, it's a survival mechanism—but one that's stopped serving us.`
            },
        ],

        spiritualContext: [
            {
                type: 'callout',
                variant: 'insight',
                title: 'The Paradox',
                content: `Strangely enough, apathy can be a doorway. Many spiritual traditions talk about "hitting rock bottom"—reaching a point so low that we finally become willing to try something completely different.`
            },
            {
                type: 'text',
                content: `When we've exhausted all our own strategies and nothing has worked, we become open in a new way. The walls we built to protect ourselves start to crack. In that vulnerability, something new can enter.`
            },
            {
                type: 'quote',
                quote: `This doesn't mean apathy is good or that suffering is necessary. But if you find yourself in this place, know this: countless people have been exactly where you are and found their way through. Your story isn't over.`
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'The First Step',
                content: `The spiritual invitation here is surrender—not giving up, but letting go of the illusion that we have to figure everything out alone. Asking for help, whether from another person, a community, or something greater than ourselves. That simple act of reaching out can be the first spark of returning life.`
            },
        ],

        pathThrough: [
            {
                type: 'text',
                content: `Getting out of apathy is different from getting out of other emotional states. When we're angry or afraid, we have energy—just misdirected. With apathy, the energy itself is absent. So we need to approach this gently.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Core Shift',
                content: `The path through apathy isn't about forcing energy we don't have—it's about gently nurturing the small sparks until they become a flame again. Tiny steps. Borrowed hope. Gentle persistence.`
            },
            {
                type: 'steps',
                items: [
                    {
                        title: 'Accept where you are without judgment',
                        content: `Fighting apathy with self-criticism just makes it worse. Instead, try: "I'm in a low place right now, and that's okay. Many people have been here and found their way through." Acceptance isn't giving up—it's stopping the war with yourself so healing can begin.`
                    },
                    {
                        title: 'Start impossibly small',
                        content: `When everything feels overwhelming, the goal isn't to transform your life—it's to take one tiny step. Get out of bed. Take a shower. Text one person. Make one decision. Small wins create momentum. A single step forward is a victory over apathy.`
                    },
                    {
                        title: 'Move your body gently',
                        content: `Physical movement shifts our energy state. Not a workout—just a walk. Even stretching in bed counts. When energy is depleted, start with the body. Stand up. Take ten steps. Open a window. The body can lead when the mind can't.`
                    },
                    {
                        title: 'Connect with something living',
                        content: `This could be another person, a pet, even a plant. Caring for something outside ourselves can gently reawaken our own life force. Many people in deep apathy have been saved by getting a dog—something that needs them, that depends on them.`
                    },
                    {
                        title: 'Borrow hope from others',
                        content: `When you can't generate hope yourself, let others hold it for you. Join a support group. Talk to someone who's been through similar struggles. Read recovery stories. Their belief in recovery can carry you until you develop your own.`
                    },
                    {
                        title: 'Accept help when offered',
                        content: `This is huge. Apathy often tells us help won't work or we don't deserve it. That's the apathy talking, not the truth. Let people in. Say yes to offers of support. One sincere "I could use some help" can crack the isolation.`
                    },
                    {
                        title: 'Create one tiny routine',
                        content: `Structure provides energy when we have none. Pick one small thing and do it at the same time each day. Morning coffee at 8am. A short walk at noon. Brushing teeth before bed. Routine builds a scaffold for life to return.`
                    },
                    {
                        title: 'Notice what stirs you—even slightly',
                        content: `Pay attention to any small flicker of interest, curiosity, or caring. These are seeds. Maybe it's a song, a sunset, a child's laugh. Don't dismiss them as pointless. Follow those threads. Life force returns through these tiny doorways.`
                    },
                ]
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Daily Practice',
                content: `Each morning, before fully waking, ask yourself: "What is one small thing I can do today—just one—that would be a win?" Write it down. Do that one thing. Let it be enough. Over time, one thing becomes two, becomes three.`
            },
            {
                type: 'quote',
                quote: `The path through apathy isn't about forcing energy we don't have—it's about gently nurturing the small sparks until they become a flame again.`
            },
        ],

        dualities: [
            { from: "What's the point?", to: "Let me try one small thing" },
            { from: "Nothing will help", to: "I'll give this a chance" },
            { from: "I don't care", to: "I'm starting to notice what matters" },
            { from: "Rejecting help", to: "Accepting a hand up" },
            { from: "Staying in bed", to: "One small step forward" },
            { from: "It's hopeless", to: "Others have made it through" },
            { from: "I'm not worth the effort", to: "I deserve to feel alive" },
            { from: "Blaming circumstances", to: "Taking one responsible action" },
            { from: "Going through the motions", to: "Bringing presence to this moment" },
            { from: "Giving up", to: "Beginning again, gently" },
        ],
    },

    grief: {
        corePattern: [
            {
                type: 'text',
                content: `We've all experienced the heavy weight of loss—the death of a loved one, the end of a relationship, a dream that didn't come true. Grief is a natural response to losing something or someone important. In its healthy form, it's how we process and eventually move forward.`
            },
            {
                type: 'text',
                content: `But sometimes grief becomes a place we live rather than a passage we move through. We replay what we've lost. We can't imagine happiness without what's gone. The past becomes more real than the present, and the future seems empty.`
            },
            {
                type: 'callout',
                variant: 'example',
                title: 'Sound Familiar?',
                content: `The widow who still sets a place at the table years later. The person who can't stop talking about "the way things used to be." The adult still mourning the childhood they didn't have. The one who lost a career and with it, their sense of identity.`
            },
            {
                type: 'callout',
                variant: 'warning',
                title: 'The Hidden Trap',
                content: `Grief has more energy than apathy—at least in grief, we still care. But that caring can become clinging. We attach to what's gone so tightly that we can't receive what life is offering us now. The pain of loss becomes strangely familiar, even comfortable.`
            },
        ],

        egoDynamics: [
            {
                type: 'text',
                content: `Here's something important to understand: grief isn't really about what we've lost. It's about our attachment to it—the meaning we gave it, the role it played in our identity, what we believed it provided.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'The Core Illusion',
                content: `We mistakenly believe the source of our happiness is "out there"—in people, things, circumstances. So when they're gone, we feel like happiness itself has been taken from us. But happiness was always coming from within. We were just projecting it onto externals.`
            },
            {
                type: 'text',
                content: `Common ways chronic grief manifests:`
            },
            {
                type: 'bullets',
                items: [
                    `Replaying memories obsessively, making the past more vivid than the present`,
                    `Believing we'll "never get over it" and resisting the healing process`,
                    `Feeling guilty about moments of happiness, as if joy betrays what we've lost`,
                    `Seeing reminders of our loss everywhere—the world colored by sadness`,
                    `Bargaining with God or fate, trying to negotiate an impossible reversal`,
                ]
            },
            {
                type: 'text',
                content: `What we call "my" loss reveals the mechanism of attachment. A watch is just a watch—until it's "my father's watch." Then it carries sentiment, identity, connection. We grieve not just the object, but everything it represented.`
            },
        ],

        spiritualContext: [
            {
                type: 'callout',
                variant: 'insight',
                title: 'The Deeper Truth',
                content: `In the deepest sense, nothing can truly be "owned" or "lost." Everything in physical life is temporary—a stewardship, not a possession. Our relationships, our health, our circumstances are all on loan from life.`
            },
            {
                type: 'quote',
                quote: `All suffering comes from resistance. The cure is through surrender and acceptance, which relieve the pain.`
            },
            {
                type: 'text',
                content: `Many who've experienced major loss find that it becomes a doorway to spiritual growth. When external sources of happiness fall away, we're forced to discover what was there all along—an inner source of peace that isn't dependent on circumstances.`
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'The Paradox of Loss',
                content: `Loss can simultaneously be freedom and the opening of new options. It surfaces inner qualities that represent opportunities for growth. While the mind regrets and would like to undo change, evolutionary development continues. What feels like the end of something is often the beginning of something else.`
            },
            {
                type: 'text',
                content: `The spiritual invitation isn't to deny the pain or pretend we don't care. It's to grieve fully, surrender the attachment (not the love), and eventually discover that what we thought we lost was always within us.`
            },
        ],

        pathThrough: [
            {
                type: 'text',
                content: `The path through grief is not about "getting over it" or pretending the loss doesn't matter. It's about allowing the grief to move through us rather than getting stuck in us. Grief that flows leads to healing. Grief that stagnates becomes chronic suffering.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Core Shift',
                content: `We're not surrendering the person, relationship, or thing we've lost. We're surrendering our attachment to them—the belief that our happiness depended on them. The love never leaves. What releases is the clinging.`
            },
            {
                type: 'steps',
                items: [
                    {
                        title: 'Allow the grief to come in waves',
                        content: `Notice that grief isn't constant—it comes in waves. When a wave rises, don't resist it. Let yourself feel it fully. Cry if you need to. Then notice that the wave passes. Each wave, when fully experienced, is slightly smaller than the last. Resistance is what makes grief stick.`
                    },
                    {
                        title: 'Practice the surrender technique',
                        content: `When grief arises, stay focused on the feeling itself—not the thoughts about it. Be willing to immerse yourself in the sensation without avoiding it. Surrender the feeling to God, life, or simply to the moment. You're not surrendering the loss—you're surrendering the resistance to what is.`
                    },
                    {
                        title: 'Distinguish love from attachment',
                        content: `Love says, "I'm grateful for what we shared." Attachment says, "I can't go on without you." The love never needs to end—it becomes part of who you are. What we release is the clinging, the belief that our happiness depended on physical presence. Love transcends physical form.`
                    },
                    {
                        title: 'Return to the present moment',
                        content: `Grief lives in the past. Peace lives in now. When you notice yourself lost in memories or "what might have been," gently bring your attention to this moment. What can you see, hear, feel right now? The past is a thought. Only the present is real.`
                    },
                    {
                        title: 'Let go of the fantasy of reversal',
                        content: `Part of us keeps hoping for a miracle reversal. "If only..." Holding onto this hope keeps us from accepting reality and finding peace within it. Making peace with "what is" doesn't mean we wanted it—it means we stop torturing ourselves with impossible alternatives.`
                    },
                    {
                        title: 'Honor the loss without enshrining it',
                        content: `Create rituals of remembrance—a specific day, a special object, a way to honor what was. But let these be containers, not prisons. We can visit our grief without living in it. Honoring isn't the same as clinging.`
                    },
                    {
                        title: 'Discover what remains',
                        content: `In the wake of loss, ask: "What hasn't changed? What qualities, strengths, or capacities are still here?" Often we discover that what we valued in the other was actually qualities within ourselves. The relationship activated them, but they belong to you.`
                    },
                    {
                        title: 'Open to what\'s emerging',
                        content: `Loss creates space—even though it doesn't feel that way at first. Slowly, life begins to fill that space with new possibilities, new relationships, new purposes. We don't betray what we've lost by receiving what comes next. Life wants to continue through us.`
                    },
                ]
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Daily Practice',
                content: `Each day, spend a few minutes in gratitude for what you still have—not to minimize the loss, but to balance it. Grief narrows our vision. Gratitude widens it again. Both the loss and the blessings are true simultaneously.`
            },
            {
                type: 'quote',
                quote: `Loss can be turned to profit as a spur to spiritual growth and evolution. That a loss can be a "blessing in disguise" takes time to ripen into discovery.`
            },
        ],

        dualities: [
            { from: "Clinging to the past", to: "Living in the present" },
            { from: "Refusing to accept", to: "Surrendering to what is" },
            { from: "Happiness was 'out there'", to: "Happiness is within me" },
            { from: "I'll never get over this", to: "I'm learning to carry this differently" },
            { from: "Bargaining for reversal", to: "Accepting life's flow" },
            { from: "Feeling empty", to: "Discovering what remains" },
            { from: "Anger and resentment", to: "Understanding and peace" },
            { from: "The past was better", to: "The present has its gifts" },
            { from: "Loss as ending", to: "Loss as transformation" },
            { from: "Resisting the grief", to: "Letting it flow through" },
        ],
    },

    fear: {
        corePattern: [
            {
                type: 'text',
                content: `Fear is one of the most powerful emotions we experience. In its healthy form, fear keeps us safe—it's the voice that tells us not to walk down a dark alley alone, to buckle our seatbelt, to check the stove before leaving. This protective fear is a gift.`
            },
            {
                type: 'text',
                content: `But for many of us, fear becomes much more than a safety mechanism. It becomes a prison. We're afraid of failure, rejection, the unknown. We worry constantly about things that may never happen. Our imagination runs wild with worst-case scenarios, and we live in a perpetual state of anxiety.`
            },
            {
                type: 'callout',
                variant: 'example',
                title: 'Sound Familiar?',
                content: `The person who won't apply for the promotion because "I probably won't get it anyway." The one who can't enjoy anything because they're always waiting for the other shoe to drop. The parent who catastrophizes every sniffle into a fatal disease. The adult who won't try new things because they might look foolish.`
            },
            {
                type: 'callout',
                variant: 'warning',
                title: 'The Fear Trap',
                content: `When we look at the world through the lens of fear, we see danger everywhere. Fear feeds on itself—the more we focus on it, the more we find to be afraid of. And ironically, we often end up creating the very situations we fear most because fear limits our actions, inhibits our growth, and keeps us playing small.`
            },
        ],

        egoDynamics: [
            {
                type: 'text',
                content: `Here's something crucial to understand: fear is a product of the imagination focused on the future. While guilt and regret live in the past, fear projects us forward into scenarios that often never happen.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'The Root Fear',
                content: `If you trace any fear back far enough, it eventually leads to the fear of death—physical, social, or psychological. Fear of failure? It's really fear of being rejected, which feels like social death. Fear of losing money? Fear of losing security, which connects to survival. All fears are, at their root, elaborations of this one primal fear.`
            },
            {
                type: 'text',
                content: `Common ways fear manifests:`
            },
            {
                type: 'bullets',
                items: [
                    `Constant worry and "what if" thinking about things that may never happen`,
                    `Avoiding opportunities, relationships, or situations that feel risky`,
                    `Seeking excessive control over people and circumstances`,
                    `Physical symptoms: racing heart, tight chest, trouble sleeping, stomach problems`,
                    `Overcompensating with bravado or risk-taking to prove we're not afraid`,
                ]
            },
            {
                type: 'text',
                content: `Here's an uncomfortable truth: sometimes we're not just afraid of the thing itself—we're afraid of the feeling of fear. We fear fear itself, which creates a cycle that amplifies our anxiety.`
            },
        ],

        spiritualContext: [
            {
                type: 'quote',
                quote: `Fear is the last hindrance to be overcome. All fear is a product of the ego and its failure to relinquish its sovereignty to the will of God.`
            },
            {
                type: 'text',
                content: `From a deeper perspective, fear arises because we believe we're separate—separate from life, from each other, from any greater source of protection or meaning. When we truly rest in something greater than ourselves, fear naturally diminishes.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'The Faith Alternative',
                content: `All life, from moment to moment, is based on faith—whether we call it that or not. We have faith the floor will hold us, that the sun will rise, that our hearts will keep beating. Moving from fear to faith isn't about believing something blindly. It's about recognizing that trust is already our default operating system.`
            },
            {
                type: 'text',
                content: `Research shows that spiritually-oriented people tend to be less fearful across the board. Not because they deny reality, but because they've found an inner anchor that doesn't depend on external circumstances being perfectly safe.`
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'The Ultimate Safety',
                content: `What if you knew—really knew—that whatever happens, you'll be okay? Not that nothing bad will ever happen, but that you have within you the capacity to meet whatever comes. This is what courage really is: not the absence of fear, but action in the presence of fear.`
            },
        ],

        pathThrough: [
            {
                type: 'text',
                content: `The path through fear isn't about becoming reckless or pretending danger doesn't exist. It's about developing a new relationship with fear—one where it informs us without controlling us.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Core Shift',
                content: `We're not trying to eliminate fear—we're learning to move through it. Courage isn't fearlessness; it's feeling the fear and taking the action anyway. Each time we do this, fear loses a little of its power over us.`
            },
            {
                type: 'steps',
                items: [
                    {
                        title: 'Practice the "And then what?" technique',
                        content: `When fear arises, follow it to its logical conclusion. "I'm afraid I'll lose my job." And then what? "I won't have money." And then what? Keep going until you reach the core fear. You'll often find that the worst-case scenario, while uncomfortable, is survivable—or that you've been catastrophizing something that's very unlikely.`
                    },
                    {
                        title: 'Separate realistic from irrational fears',
                        content: `Ask: "Is this fear trying to keep me safe, or is it trying to keep me small?" Realistic fear says, "Look both ways before crossing." Irrational fear says, "Never leave the house." Learn to recognize the difference. Action protects against real danger; avoidance feeds imaginary ones.`
                    },
                    {
                        title: 'Feel the fear physically',
                        content: `When fear arises, drop into your body. Where do you feel it? Racing heart? Tight throat? Churning stomach? Instead of fleeing these sensations, stay with them. Breathe into them. You'll discover that the physical sensations of fear, when not resisted, naturally peak and then subside.`
                    },
                    {
                        title: 'Challenge the imagination',
                        content: `Fear thrives on imagination—specifically, on imagining the worst. Ask yourself: "How many of my fears have actually come true?" Most haven't. Then ask: "Have I survived the ones that did?" You have. Your track record for getting through difficult things is 100%.`
                    },
                    {
                        title: 'Take small courageous actions',
                        content: `Courage is a muscle that strengthens with use. Start small: speak up in a meeting, have that difficult conversation, try something new. Each small act of courage builds confidence. Fear shrinks when we face what we're avoiding.`
                    },
                    {
                        title: 'Return to the present moment',
                        content: `Fear lives in the future. In this exact moment—right now—are you actually okay? Usually, yes. Practice bringing your attention back to what's immediate and real, rather than getting lost in imagined futures that may never happen.`
                    },
                    {
                        title: 'Surrender the outcome',
                        content: `Much of our fear comes from trying to control things that are beyond our control. Practice saying: "I'll do my best, and I'll handle whatever happens." Surrendering the outcome doesn't mean giving up—it means releasing the anxiety of trying to guarantee results.`
                    },
                    {
                        title: 'Build a foundation of faith',
                        content: `Whether your faith is in God, life, the universe, or simply your own resilience—cultivate it. Remind yourself of times you've made it through difficulty. Trust that you have what it takes. Fear and faith cannot occupy the same space; one expands as the other contracts.`
                    },
                ]
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Daily Practice',
                content: `Each morning, identify one small fear you're willing to face today. It doesn't have to be dramatic—maybe it's sending an email you've been avoiding, or saying hello to someone new. Build your courage muscle with consistent small acts.`
            },
            {
                type: 'quote',
                quote: `We have nothing to fear but fear itself. The physical symptoms of fear, when not resisted, naturally expire and peace returns.`
            },
        ],

        dualities: [
            { from: "Panic and overreact", to: "Respond with self-control" },
            { from: "Dramatize and exaggerate", to: "Handle calmly and minimize" },
            { from: "Project to imagined futures", to: "Live in the present moment" },
            { from: "See enemies everywhere", to: "See safety and opportunity" },
            { from: "Resist, defend, avoid", to: "Accept and work through" },
            { from: "Control everything", to: "Surrender to life's flow" },
            { from: "Emotionalism", to: "Think clearly" },
            { from: "Harbor fears secretly", to: "Examine and work through" },
            { from: "Survive alone", to: "Trust in something greater" },
            { from: "Justify the fear", to: "View realistically" },
        ],
    },

    desire: {
        corePattern: [
            {
                type: 'text',
                content: `Desire is the engine that drives much of human activity. The wanting of more—more money, more pleasure, more recognition, more love—motivates us to get out of bed, work hard, and strive for better. In healthy doses, desire propels growth and achievement.`
            },
            {
                type: 'text',
                content: `But desire has a shadow side. When wanting becomes craving, when "I'd like" becomes "I must have," we've crossed into territory that brings more suffering than satisfaction. The feeling of lack becomes chronic. No matter how much we get, it's never quite enough.`
            },
            {
                type: 'callout',
                variant: 'example',
                title: 'Sound Familiar?',
                content: `The person who finally gets the promotion but immediately starts wanting the next one. The shopper who feels empty an hour after buying something. The relationship hopper always seeking "the one." The collector who never has enough. The achiever who can't enjoy success because they're already chasing the next goal.`
            },
            {
                type: 'callout',
                variant: 'warning',
                title: 'The Desire Trap',
                content: `Here's the painful truth: desire promises that satisfaction is just one more acquisition away— but that moment never comes. The nature of desire is to be insatiable. Satisfaction of one desire is merely replaced by wanting something else. We're on a treadmill mistaking movement for progress.`
            },
        ],

        egoDynamics: [
            {
                type: 'text',
                content: `Why is desire so hard to satisfy? Because the perceived source of happiness is "out there"—in things, people, achievements, experiences. But the actual mechanism of pleasure is internal, in the brain itself. We're chasing external triggers for an internal experience.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'The Projection of Specialness',
                content: `The ego projects "specialness" onto objects of desire. That car isn't just transportation—it's status, success, freedom. That relationship isn't just companionship—it's completion, validation, meaning. We infatuate ourselves with our own projections, then wonder why the reality disappoints.`
            },
            {
                type: 'text',
                content: `Common ways chronic desire manifests:`
            },
            {
                type: 'bullets',
                items: [
                    `Constant feeling of lack or incompleteness, no matter what we have`,
                    `Obsessive pursuit of goals at the expense of present-moment enjoyment`,
                    `Addiction patterns—to substances, shopping, food, relationships, attention`,
                    `Jealousy and envy when others have what we want`,
                    `Inability to feel satisfied; the "hedonic treadmill" effect`,
                ]
            },
            {
                type: 'text',
                content: `Desire escalates. What once satisfied us no longer does. We need more, newer, better. This is the addiction mechanism—not unique to substances, but built into the very structure of wanting itself.`
            },
        ],

        spiritualContext: [
            {
                type: 'quote',
                quote: `The basic problem with desire is the inner feeling of lack that results in chronic dissatisfaction. The vulnerability of the ego's wanting is its presumption that fulfillment depends on acquisition from external sources.`
            },
            {
                type: 'text',
                content: `Every spiritual tradition points to the same insight: lasting happiness cannot come from getting what we want. Not because wanting is wrong, but because the source of happiness is internal, not external. We've been looking in the wrong place.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'From Having to Being',
                content: `The spiritual journey moves from "having" to "doing" to "being." We first think happiness comes from having things. Then from doing accomplishments. Finally we discover it comes from being—from the quality of consciousness itself, independent of circumstances.`
            },
            {
                type: 'text',
                content: `Many successful people honestly acknowledge that beyond basic comforts, they're no happier rich and famous than they were as struggling students. The externals changed dramatically; the internal experience... not so much.`
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'The Want Nothing State',
                content: `Imagine wanting nothing—not because you're depressed or have given up, but because you feel genuinely complete. This state is immune to fear because there's nothing to lose. It's not about deprivation; it's about discovering you already have what you've been seeking.`
            },
        ],

        pathThrough: [
            {
                type: 'text',
                content: `The path through desire isn't about killing all wanting or becoming a joyless ascetic. It's about shifting from compulsive craving to conscious choosing, from needing to preferring, from being driven to being at peace.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Core Shift',
                content: `We're replacing wanting with choosing. "I need this to be happy" becomes "I choose this because I prefer it." The first creates anxiety and desperation. The second allows enjoyment without attachment.`
            },
            {
                type: 'steps',
                items: [
                    {
                        title: 'Notice the feeling of wanting',
                        content: `When desire arises, pause and feel it in your body. Where is it located? What does it feel like? Often it's a kind of tension, an incompleteness, a reaching. Simply noticing this feeling—without acting on it or suppressing it—begins to give you freedom from its compulsion.`
                    },
                    {
                        title: 'Question the promise',
                        content: `Ask: "What am I really hoping this will give me?" Usually it's not the thing itself we want, but a feeling—security, validation, love, meaning. Then ask: "Can this thing actually deliver that feeling permanently?" Usually, honestly, no.`
                    },
                    {
                        title: 'Use "And then what?"',
                        content: `Follow the desire to its conclusion. "If I get this, then what?" Keep going. You'll often find that the chain of wants is endless, or that what you're really seeking is a state of being—peace, fulfillment, love—that no external acquisition can provide.`
                    },
                    {
                        title: 'Practice gratitude for what is',
                        content: `Desire fixates on what's missing. Gratitude refocuses on what's present. Each day, consciously appreciate what you already have—not to suppress wanting, but to balance it. The richest person isn't who has the most, but who needs the least.`
                    },
                    {
                        title: 'Replace "need" with "prefer"',
                        content: `Language shapes experience. "I need this" creates urgency and suffering. "I prefer this" allows wanting without attachment. Practice: "I would enjoy having this, and I'm okay either way." This isn't resignation—it's freedom.`
                    },
                    {
                        title: 'Delay gratification consciously',
                        content: `When a craving arises, experiment with waiting. Not as punishment, but as practice. Can you sit with the wanting without immediately acting? Often the intensity peaks and subsides naturally. You discover you're not as helpless before desire as you thought.`
                    },
                    {
                        title: 'Find satisfaction in the process',
                        content: `Shift from "I'll be happy when I get there" to finding fulfillment in the journey itself. The striving, growing, working—can these be intrinsically satisfying? When the process matters as much as the outcome, every moment becomes enough.`
                    },
                    {
                        title: 'Discover the inner source',
                        content: `Through meditation, prayer, or simple stillness, begin to contact the peace that's always present beneath the wanting. This inner fullness doesn't depend on getting anything. It's the source we've been seeking through external means. It was here all along.`
                    },
                ]
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Daily Practice',
                content: `Before each purchase, decision, or pursuit, pause and ask: "Am I moving toward this from wholeness, or running from a feeling of lack?" The same action can come from completely different places. Choose from fullness, not emptiness.`
            },
            {
                type: 'quote',
                quote: `The more evolved the person, the less the pressure of needs. Satisfaction arises not from what one has, but from the realization of the Source of one's own existence.`
            },
        ],

        dualities: [
            { from: "Craving and needing", to: "Preferring and choosing" },
            { from: "Never enough", to: "Genuine contentment" },
            { from: "Happiness is out there", to: "Fulfillment is within" },
            { from: "Getting and acquiring", to: "Appreciating what is" },
            { from: "Driven by lack", to: "Moving from wholeness" },
            { from: "Infatuation with externals", to: "Connection to inner source" },
            { from: "Jealousy and envy", to: "Celebrating others' good" },
            { from: "Stubborn demanding", to: "Flexible accepting" },
            { from: "Conquest and control", to: "Allowing and receiving" },
            { from: "Fame and approval seeking", to: "Inner validation" },
        ],
    },

    anger: {
        corePattern: [
            {
                type: 'text',
                content: `Anger is energy. At its best, it can fuel movements for justice, protect boundaries, and catalyze necessary change. Throughout history, anger at injustice has been the spark that ignited liberation.`
            },
            {
                type: 'text',
                content: `But for many of us, anger has become something else entirely—a chronic state of irritation, resentment, and reactivity that poisons our relationships and our health. We nurse grudges. We collect injustices. We walk around with a chip on our shoulder, ready to be offended.`
            },
            {
                type: 'callout',
                variant: 'example',
                title: 'Sound Familiar?',
                content: `The person who's still angry about something that happened years ago. The one who gets disproportionately upset at minor inconveniences. The "injustice collector" who remembers every slight. The person whose family and coworkers walk on eggshells. The one who always has to be right.`
            },
            {
                type: 'callout',
                variant: 'warning',
                title: 'The Anger Trap',
                content: `Anger feels powerful—but it's actually weakness masquerading as strength. We puff up like an animal trying to look threatening. The short-term rush of righteous indignation gives way to chronic stress, damaged relationships, and an inability to see situations clearly. Anger clouds judgment.`
            },
        ],

        egoDynamics: [
            {
                type: 'text',
                content: `Here's something essential to understand: anger is always frustrated desire. When we don't get what we want—respect, fairness, compliance, agreement—we feel thwarted. That frustration becomes anger.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'The Ego\'s Expectations',
                content: `At the core of chronic anger is a narcissistic worldview that expects the world to conform to our wishes. We believe we deserve agreement, compliance, and priority. When reality doesn't cooperate, we feel personally offended. But the world isn't centered on any individual—it simply is what it is.`
            },
            {
                type: 'text',
                content: `Common ways chronic anger manifests:`
            },
            {
                type: 'bullets',
                items: [
                    `"Injustice collecting"—keeping mental lists of wrongs done to us`,
                    `Chronic irritability, always on edge, easily triggered`,
                    `Needing to be right; seeing disagreement as attack`,
                    `Resentment that we nurse and feed over time`,
                    `Explosive outbursts followed by regret or justification`,
                ]
            },
            {
                type: 'text',
                content: `The ego gets a payoff from anger. There's a kind of pleasure in righteous indignation, in feeling morally superior to those who've wronged us. This is why we hold onto resentments even though they poison us. We're addicted to the feeling.`
            },
        ],

        spiritualContext: [
            {
                type: 'quote',
                quote: `There is no such thing as a justified resentment. Resentment or anger is not about what others 'are' but about what they 'are not'—not generous rather than stingy, not careful rather than thoughtless.`
            },
            {
                type: 'text',
                content: `Every spiritual tradition emphasizes the importance of releasing anger and cultivating forgiveness—not for the other person's sake, but for our own. Holding onto anger is, as the saying goes, like drinking poison and expecting the other person to die.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'The Forgiveness Paradox',
                content: `Forgiveness doesn't mean what happened was okay. It doesn't mean we allow it to continue. It means we stop carrying the burden of resentment. We release the past so it stops poisoning our present. Forgiveness is ultimately an act of self-liberation.`
            },
            {
                type: 'text',
                content: `To strong, mature people, anger is seen as a primitive weakness—an embarrassing loss of control. The truly powerful don't need to puff up and threaten. They're resolute, determined, and committed without the volatility of anger.`
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Anger as Information',
                content: `Anger can be useful as information—it tells us our needs aren't being met or our boundaries have been crossed. The key is to receive this information without being hijacked by it. We can acknowledge the anger, learn from it, and then release it rather than acting from it.`
            },
        ],

        pathThrough: [
            {
                type: 'text',
                content: `The path through anger isn't about suppressing it or pretending we're not upset. It's about changing our relationship with anger—feeling it, understanding it, and releasing it rather than being controlled by it.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Core Shift',
                content: `We're moving from reactivity to response-ability. Instead of being triggered automatically, we develop a gap between stimulus and response where we can choose how to act. This is true strength—not the puffed-up pseudo-strength of the angry person.`
            },
            {
                type: 'steps',
                items: [
                    {
                        title: 'Acknowledge the underlying desire',
                        content: `When anger arises, ask: "What did I want that I'm not getting?" Anger is always frustrated desire. Identifying the want underneath the anger often defuses it. The want might be for respect, fairness, control, or agreement. Name it.`
                    },
                    {
                        title: 'Give up "justified resentments"',
                        content: `There's no such thing as a justified resentment. Even when we're genuinely wronged, holding onto the anger hurts us more than the other person. Let go not because they deserve forgiveness, but because you deserve peace.`
                    },
                    {
                        title: 'Stop milking the past',
                        content: `Notice when you're replaying old grievances, rehearsing arguments, or "building your case." This is the ego extracting pleasure from anger. The past is gone. Continuing to nurse it only poisons the present.`
                    },
                    {
                        title: 'Feel anger without acting on it',
                        content: `When anger arises, create a pause. Feel the physical sensations—the heat, the tension, the adrenaline. Breathe. Let the intensity peak and begin to subside before you respond. Acting from anger almost always makes things worse.`
                    },
                    {
                        title: 'Lower your expectations',
                        content: `Much anger comes from expecting the world, others, or ourselves to be different than we are. Accept human fallibility—your own and others'. The Serenity Prayer wisdom: accept what you cannot change, change what you can, know the difference.`
                    },
                    {
                        title: 'Take responsibility for your reactions',
                        content: `"They made me angry" is a myth. Events happen; we choose our response. Others may behave badly, but our emotional reaction belongs to us. This isn't blame—it's empowerment. If we create our anger, we can release it.`
                    },
                    {
                        title: 'Cultivate compassion for human limitation',
                        content: `People generally aren't trying to hurt us—they're trying to meet their own needs, often clumsily. Understanding that most offense isn't intentional, that others are struggling with their own pain, softens anger into something more workable.`
                    },
                    {
                        title: 'Practice forgiveness as self-care',
                        content: `Forgiveness doesn't mean approving of what happened. It means refusing to carry the burden anymore. Who are you still angry at? What would it take to put that down? Your peace is worth more than your grievance.`
                    },
                ]
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Daily Practice',
                content: `Each evening, scan for resentments that arose during the day. For each one, consciously release it: "I let this go. I choose peace." Don't let resentments accumulate. Clear them daily.`
            },
            {
                type: 'quote',
                quote: `An eye for an eye makes the whole world blind. The obvious antidotes to anger are compassion, acceptance, love, and the willingness to forgive.`
            },
        ],

        dualities: [
            { from: "Act out feelings explosively", to: "Respond with self-control" },
            { from: "Intimidate and threaten", to: "Communicate and forgive" },
            { from: "Hold on to resentments", to: "Let go and move forward" },
            { from: "Punish and get even", to: "Release and allow consequences" },
            { from: "Dump on others", to: "Practice restraint" },
            { from: "Get stirred up and dramatic", to: "Stay cool and minimize" },
            { from: "Prove self right", to: "Seek understanding" },
            { from: "Puff up aggressively", to: "Respond from quiet strength" },
            { from: "Nurse grudges", to: "Forgive and forget" },
            { from: "React automatically", to: "Respond thoughtfully" },
        ],
    },

    pride: {
        corePattern: [
            {
                type: 'text',
                content: `Pride feels good—especially after climbing out of shame, guilt, fear, or grief. Finally, some positive feelings! Self-esteem rising. A sense of accomplishment. Pride is socially encouraged: "Take pride in your work! Be proud of who you are!"`
            },
            {
                type: 'text',
                content: `But pride has a hidden fragility. It depends on external conditions—achievements, approval, status, image. If those are threatened, pride can instantly collapse into shame. "Pride goeth before a fall" isn't just a saying—it's a description of a psychological mechanism.`
            },
            {
                type: 'callout',
                variant: 'example',
                title: 'Sound Familiar?',
                content: `The person who desperately needs to be right and can't admit mistakes. The one whose mood depends on compliments and recognition. The perfectionist terrified of criticism. Someone who measures themselves against others constantly. The person who can't celebrate someone else's success without feeling diminished.`
            },
            {
                type: 'callout',
                variant: 'warning',
                title: 'The Pride Trap',
                content: `Pride creates a fragile self-image that requires constant maintenance and defense. We become sensitive to slights, competitive, and insecure beneath the surface confidence. True security doesn't need defending. If our self-worth can be taken away by criticism or failure, it was never real to begin with.`
            },
        ],

        egoDynamics: [
            {
                type: 'text',
                content: `Pride is an inflation of the ego—puffing ourselves up to feel important, worthy, significant. But anything inflated can be deflated. The higher we puff ourselves, the farther we can fall.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'The Seeking of Specialness',
                content: `At its core, pride is the ego's need to be special—better than, superior to, more worthy than others. But specialness is always relative and therefore always vulnerable. Someone else can always be smarter, more successful, more attractive. The game is unwinnable.`
            },
            {
                type: 'text',
                content: `Common ways pride manifests:`
            },
            {
                type: 'bullets',
                items: [
                    `Needing to be right; difficulty admitting mistakes or learning from criticism`,
                    `Comparing ourselves to others obsessively`,
                    `Self-worth dependent on achievements, status, or approval`,
                    `Arrogance and looking down on others`,
                    `Defensiveness when our image is challenged`,
                ]
            },
            {
                type: 'text',
                content: `The paradox: true self-esteem doesn't come from being better than others. It comes from being aligned with our own integrity. The confident person doesn't need to prove anything—they're secure because their worth isn't based on comparisons.`
            },
        ],

        spiritualContext: [
            {
                type: 'quote',
                quote: `Pride is intrinsically a statement of lack, and it is therefore constantly needy and seeking to be fed and propped up to compensate for its insufficiency. The more it is fed, the more voracious its appetite becomes.`
            },
            {
                type: 'text',
                content: `Every spiritual tradition warns against pride, not because feeling good about ourselves is wrong, but because pride built on externals is inherently unstable and leads to suffering. It also separates us from others and blocks further growth.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Humility as Strength',
                content: `Humility is not humiliation. Humility is an accurate assessment of reality—recognizing both our gifts and our limitations. It's the strongest safeguard against the vulnerability of pride. A humble person can't be deflated because they haven't inflated themselves.`
            },
            {
                type: 'text',
                content: `At its deepest, pride is the ego claiming credit for what life has given. Our talents, circumstances, even our effort—where did the capacity for effort come from? Gratitude naturally replaces pride when we see clearly.`
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'The Gratitude Shift',
                content: `Instead of "I'm great because I accomplished this," try "I'm grateful I had the opportunity and capacity to contribute." Same accomplishment, completely different inner experience—one is vulnerable and needs defending; the other is peaceful and invulnerable.`
            },
        ],

        pathThrough: [
            {
                type: 'text',
                content: `The path through pride isn't about becoming self-deprecating or rejecting healthy self-esteem. It's about shifting from a fragile, externally-dependent self-image to a secure sense of worth that doesn't need external validation.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Core Shift',
                content: `We're moving from specialness to simply being. Instead of "I'm worthy because I'm better than," we discover "I'm worthy because I exist." This isn't arrogance—it's the recognition that all existence is equally miraculous. Nothing to prove, nothing to defend.`
            },
            {
                type: 'steps',
                items: [
                    {
                        title: 'Notice when you need to be right',
                        content: `The need to be right is pride in action. When you notice yourself defending a position beyond reason, ask: "Would I rather be right, or would I rather be at peace?" Being able to say "I was wrong" or "I don't know" is a sign of genuine confidence.`
                    },
                    {
                        title: 'Practice being ordinary',
                        content: `Specialness is exhausting. Experiment with not standing out, not impressing, not proving. What happens when you're just... normal? Many find relief. The pressure to be exceptional is often self-imposed and unnecessary.`
                    },
                    {
                        title: 'Replace comparison with connection',
                        content: `Pride compares and ranks. When you catch yourself measuring against others, shift to curiosity and appreciation. What can you learn from this person? What do you genuinely appreciate about them? Connection replaces competition.`
                    },
                    {
                        title: 'Celebrate others\' successes genuinely',
                        content: `Pride feels diminished by others' achievements. Practice celebrating when good things happen to others—not performatively, but genuinely. Their success doesn't diminish you. There's enough light in the universe for everyone.`
                    },
                    {
                        title: 'Embrace constructive criticism',
                        content: `Pride takes criticism personally. Practice hearing feedback as information, not attack. Thank people for honest feedback even when it stings. Growth requires seeing ourselves clearly, which we can't do without outside perspective.`
                    },
                    {
                        title: 'Give credit away',
                        content: `Pride claims credit; security shares it. Acknowledge the contributions of others, the role of circumstance, the gifts you didn't earn. Giving credit away doesn't diminish you—it reveals a strength that doesn't need validation.`
                    },
                    {
                        title: 'Practice gratitude instead of pride',
                        content: `When you accomplish something, instead of "I'm great," try "I'm grateful." Same event, different orientation. Gratitude acknowledges that we didn't create ourselves, our talents, or our opportunities. Everything is gift.`
                    },
                    {
                        title: 'Find worth independent of achievement',
                        content: `Ask: "If I achieved nothing, would I still be worthy of existence?" The honest answer is yes. Your worth doesn't come from what you do—it comes from what you are. This is the foundation that can't be shaken.`
                    },
                ]
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Daily Practice',
                content: `Each day, notice one moment when pride arises—needing to be right, seeking recognition, comparing. In that moment, consciously let it go. Choose humility instead. Notice how much more peaceful you feel.`
            },
            {
                type: 'quote',
                quote: `Humility is the antidote to most errors of self-deception. True security doesn't need defending because it isn't based on comparisons or positions that can be challenged.`
            },
        ],

        dualities: [
            { from: "Vain and proud", to: "Humble and grounded" },
            { from: "Needing to be better than", to: "Content to be equal with" },
            { from: "Seeking admiration", to: "Unconcerned with image" },
            { from: "Defensive about status", to: "Secure regardless of status" },
            { from: "Needing to be right", to: "Willing to be wrong" },
            { from: "Special and superior", to: "Ordinary and connected" },
            { from: "Competitive comparing", to: "Appreciation and support" },
            { from: "Credit-seeking", to: "Gratitude-expressing" },
            { from: "Fragile self-image", to: "Stable self-worth" },
            { from: "Arrogance", to: "Confidence through humility" },
        ],
    },

    courage: {
        corePattern: [
            {
                type: 'text',
                content: `We've all felt that moment when we finally decide to face what we've been avoiding—speaking up to a difficult boss, ending a relationship that isn't working, or starting something we've always wanted to try. That surge of energy, that willingness to act despite fear—that's courage.`
            },
            {
                type: 'text',
                content: `Courage represents the most critical threshold in human consciousness. It's where we shift from negative to positive energy, from being victims of circumstances to taking responsibility for our lives. This is the first level where we can truly say "I can do it."`
            },
            {
                type: 'callout',
                variant: 'example',
                title: 'Courage in Action',
                content: `The person who chooses integrity over personal gain despite potential losses. The individual who takes responsibility for their life circumstances instead of blaming others. The employee who speaks truth to power despite potential consequences. The person who faces their fears to take necessary action.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'The Critical Shift',
                content: `At Courage, we make the decisive choice to align with truth rather than personal gain. This brings strength, self-respect, and true empowerment—not ego inflation, but genuine inner confidence that doesn't depend on external factors.`
            },
        ],

        egoDynamics: [
            {
                type: 'text',
                content: `At Courage, there's a fundamental shift where we move from being dominated by primitive emotions to being guided by intelligence and integrity. We develop the capacity to recognize and reject temptations to violate our values for quick gain.`
            },
            {
                type: 'text',
                content: `Self-honesty brings relief from the negative emotions of lower levels. Anxiety, fear, insecurity, and guilt diminish, as do frustration, resentment, and anger. Negative emotions become unwelcome rather than familiar.`
            },
            {
                type: 'bullets',
                items: [
                    'Argument, conflict, and discord lose their appeal because they no longer provide ego inflation',
                    'Development of genuine humor that replaces hostile attacks and outbursts',
                    'Peace and quiet become preferred over the excitement of adrenaline',
                    'Reflection becomes more important than emotionalized reactivity',
                    'Personal happiness becomes an achievable goal through inner alignment',
                    'Gratitude replaces resentment, self-pity, and blaming others'
                ]
            },
            {
                type: 'callout',
                variant: 'warning',
                title: 'Hidden Traps',
                content: `The ego may become prideful about its integrity, judging others who haven't made this shift. We might develop spiritual arrogance or become impatient with those still operating from victim consciousness. True courage includes humility.`
            },
        ],

        spiritualContext: [
            {
                type: 'quote',
                quote: `What gains a man to win the world but lose his soul?`
            },
            {
                type: 'text',
                content: `At level 200, there's an intuitive acceptance of accountability as both a spiritual and social reality. We become aware of our responsibility for the destiny of our soul, not just the body and ego's satisfactions. Truth becomes an ally instead of an enemy.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: "The Soul's Choice",
                content: `Courage represents the soul's decision to engage with life's evolutionary force rather than resist it. We begin to serve life rather than exploit it. This alignment with truth brings inner freedom because the spirit knows when the ego is lying.`
            },
            {
                type: 'text',
                content: `This is where we begin to understand that it's the effort and intention, not just the result, that matters spiritually. "To thine own self be true" progressively dominates our choices and decisions.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Spiritual Opportunities',
                content: `Courage provides opportunities for spiritual development and service to others.`
            },
            {
                type: 'text',
                content: `From a higher view, Courage is the soul's commitment to growth and service. It's where we begin to align with life's evolutionary impulse rather than resisting it. We transcend the victim consciousness of levels below and provide the foundation for all higher development.`
            },
        ],

        pathThrough: [
            {
                type: 'text',
                content: `The path through Courage involves making the decisive choice to align with truth rather than personal gain. This isn't about becoming fearless—it's about developing the capacity to act with integrity despite fear, uncertainty, or potential loss.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Core Shift',
                content: `We're moving from being dominated by primitive emotions to being guided by intelligence and integrity. The critical key is accepting personal responsibility and accountability—recognizing that we have the power to choose our responses to life's challenges.`
            },
            {
                type: 'steps',
                items: [
                    {
                        title: 'Accept Personal Responsibility and Accountability',
                        content: `Stop blaming external circumstances and recognize that we have the power to choose our responses to life's challenges. This is the critical key to moving into the strength of courage. We become empowered by telling the truth about our situation.`
                    },
                    {
                        title: 'Align with Truth Rather Than Personal Gain',
                        content: `Make the decisive choice to prioritize integrity over advantage. When faced with decisions, ask: "What would truth have me do?" rather than "What will benefit me most?" This alignment brings strength, self-respect, and true empowerment.`
                    },
                    {
                        title: 'Develop Inner Standards Over External Approval',
                        content: `Focus on steadfastness and integrous performance that results in inner gratifications from fulfilling your own standards. Let "To thine own self be true" guide your decisions rather than seeking validation from others.`
                    },
                    {
                        title: 'Face What You\'ve Been Avoiding',
                        content: `Use courage to confront the fears, situations, or truths you've been evading. Recognize and reject temptations to violate integrity for gain. What we avoid controls us; what we face, we can transform.`
                    },
                    {
                        title: 'Choose Long-term Character Over Short-term Gain',
                        content: `Recognize that it's the effort and intention, not just the result, that matters. Focus on developing inner potentials like strength and integrity rather than acquiring externals. Character is built through consistent right choices.`
                    },
                    {
                        title: 'Practice Self-Honesty and Integrity',
                        content: `Understand that it's possible to fool the world but not yourself. The spirit knows when the ego is lying. Let this awareness guide you toward authentic choices that align with your deepest values, bringing inner freedom.`
                    },
                    {
                        title: 'Build Inner Confidence Through Right Action',
                        content: `Take actions that build genuine self-respect. Courage brings inner confidence because it's not dependent on external factors or results. Each integrous choice strengthens your capacity for the next one.`
                    },
                    {
                        title: 'Embrace the Discomfort of Growth',
                        content: `Accept that courage often requires "white-knuckling it" through difficult periods. This builds self-confidence and reveals your inner capacity for bravery and fortitude. Strong intention plus dedication can bring success despite prior failures.`
                    },
                ]
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Daily Practice',
                content: `Each day, identify one situation where you can choose truth over convenience, integrity over advantage. Notice how this alignment brings inner strength and self-respect, even when the external results are uncertain.`
            },
            {
                type: 'quote',
                quote: `Courage brings inner confidence and a greater sense of personal power because it is not dependent on external factors or results.`
            },
        ],

        dualities: [
            { from: "Victim mentality", to: "Personal responsibility" },
            { from: "Avoiding challenges", to: "Facing difficulties head-on" },
            { from: "Seeking approval", to: "Trusting your own judgment" },
            { from: "Making excuses", to: "Taking action" },
            { from: "Blaming others", to: "Focusing on your response" },
            { from: "Staying in comfort zone", to: "Taking calculated risks" },
            { from: "Feeling powerless", to: "Recognizing your influence" },
            { from: "Waiting for rescue", to: "Becoming self-reliant" },
            { from: "Fear-based decisions", to: "Values-based choices" },
            { from: "Giving up easily", to: "Persisting through challenges" },
        ],
    },

    neutrality: {
        corePattern: [
            {
                type: 'text',
                content: `We've all experienced those moments of inner calm when we're genuinely okay with whatever happens. Maybe we didn't get the job we wanted, and instead of devastation, we think, "Well, if I don't get this one, I'll get another." That's a taste of Neutrality—the beginning of inner confidence.`
            },
            {
                type: 'text',
                content: `At Neutrality, we release the rigid positions and emotional investments that create so much suffering. We're no longer attached to specific outcomes or driven by the need to control everything. Life becomes more like play than a high-stakes drama.`
            },
            {
                type: 'callout',
                variant: 'example',
                title: 'Neutrality in Daily Life',
                content: `The person who can genuinely say "It's okay either way" when facing a decision. The individual who doesn't get stirred up by others' opinions or need to prove they're right. The one who can roll with life's ups and downs without losing their inner balance.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'The Freedom of Non-Attachment',
                content: `Neutrality is like wearing the world like a loose garment. We can participate fully in life without being emotionally hijacked by outcomes. There's nothing really at stake because our happiness no longer depends on external conditions.`
            },
        ],

        egoDynamics: [
            {
                type: 'text',
                content: `At Neutrality, the ego achieves a healthy balance. We're no longer driven by primitive impulses or the need to defend rigid positions. The intellect is free from distorted emotionality, allowing for clear reality testing and social accommodation.`
            },
            {
                type: 'text',
                content: `We become nonjudgmental about human nature, including its animalistic drives. These aspects don't need to be rejected, repressed, or projected onto others—they're simply accepted as part of the human condition to be balanced by positive qualities.`
            },
            {
                type: 'bullets',
                items: [
                    'Freedom from the need to be right or prove anything to others',
                    'Comfortable with not having strong opinions about everything',
                    'Easy to get along with because there\'s no hidden agenda',
                    'Safe to be around because we\'re not interested in conflict or control',
                    'Flexible and adaptable rather than rigid and defensive',
                    'Relief from narcissistic demands and the pressure of "have to\'s"'
                ]
            },
            {
                type: 'callout',
                variant: 'warning',
                title: 'The Detachment Trap',
                content: `There's a difference between non-attachment and detachment. Detachment can lead to withdrawal, indifference, and a decrease in aliveness. True neutrality allows for participation and enjoyment of life—it's freedom from attachment, not from engagement.`
            },
        ],

        spiritualContext: [
            {
                type: 'quote',
                quote: `Life becomes effortless and existence itself is pleasurable, without conditions, and easygoing like a cork in the sea.`
            },
            {
                type: 'text',
                content: `Neutrality represents a recuperative level for the spirit that has struggled out of the swamps of despair, depression, and frantic searching. Many people choose to spend significant time at this level of inner healing and peace.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'The Tao of Neutrality',
                content: `This level is consistent with the teachings of the Tao—the flow of life is neither sought nor resisted. We learn to float along the river of life by decision and acceptance rather than by force or struggle.`
            },
            {
                type: 'text',
                content: `While Neutrality is a welcome relief from lower levels, it's not yet an active expression of love or compassion. It serves life by non-resistant participation but doesn't yet actively contribute to life's upliftment. It's essentially silent—neither adding to nor detracting from life's panorama.`
            },
        ],

        pathThrough: [
            {
                type: 'text',
                content: `The path through neutrality involves developing emotional balance without becoming emotionally suppressed. We learn to respond rather than react, to observe rather than immediately judge. This is about removing the mental and emotional blocks that keep us trapped in reactivity.`
            },
            {
                type: 'steps',
                items: [
                    {
                        title: 'Develop Emotional Awareness',
                        content: `Begin observing your emotional reactions without immediately acting on them. Notice the gap between stimulus and response, and practice pausing before reacting to emotionally charged situations.`
                    },
                    {
                        title: 'Practice Non-Attachment to Outcomes',
                        content: `Release the need for things to go your way. Focus on doing your best while letting go of controlling results. Find peace in the process rather than being dependent on specific outcomes.`
                    },
                    {
                        title: 'Cultivate Objective Observation',
                        content: `Learn to see situations from multiple perspectives before forming judgments. Ask yourself: "What would someone neutral to this situation observe?" Practice stepping back mentally to gain clarity.`
                    },
                    {
                        title: 'Release the Need to Be Right',
                        content: `Notice when your ego is invested in being correct or winning arguments. Practice saying "You might be right" or "I hadn't considered that perspective" even when you disagree.`
                    },
                    {
                        title: 'Develop Emotional Regulation Skills',
                        content: `Learn techniques for managing intense emotions—breathing exercises, mindfulness, or brief meditation. Build your capacity to feel emotions without being overwhelmed or controlled by them.`
                    },
                    {
                        title: 'Practice Compassionate Detachment',
                        content: `Care about people and situations without being emotionally enmeshed in their drama. Learn to support others without taking on their emotional states or trying to fix their problems.`
                    },
                    {
                        title: 'Embrace Uncertainty and Ambiguity',
                        content: `Become comfortable with not knowing, not having all the answers, or not being able to control situations. Find peace in the mystery and complexity of life rather than needing everything to be clear-cut.`
                    },
                    {
                        title: 'Balance Engagement with Equanimity',
                        content: `Learn when to engage passionately and when to maintain neutral observation. Develop the wisdom to know when your emotional investment serves the situation and when it creates unnecessary suffering.`
                    },
                ]
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Daily Practice',
                content: `Each morning, set an intention to observe rather than react. When you notice emotional charge arising, take three breaths and ask: "What would a neutral observer see here?" This creates space for wisdom to emerge.`
            },
            {
                type: 'quote',
                quote: `True neutrality is not indifference—it is the capacity to care without attachment, to engage without being controlled by outcomes.`,
                source: 'Dr. Hawkins'
            },
        ],

        dualities: [
            { from: "Emotional reactivity", to: "Thoughtful response" },
            { from: "Taking things personally", to: "Objective observation" },
            { from: "Need to be right", to: "Openness to other perspectives" },
            { from: "Attachment to outcomes", to: "Focus on process and effort" },
            { from: "Emotional volatility", to: "Inner stability and balance" },
            { from: "Judging situations as good/bad", to: "Seeing circumstances as neutral" },
            { from: "Getting caught in drama", to: "Maintaining peaceful detachment" },
            { from: "Needing to control", to: "Accepting what is beyond our influence" },
            { from: "Emotional overwhelm", to: "Calm presence in all situations" },
            { from: "Polarized thinking", to: "Seeing the middle ground and nuance" },
        ],
    },

    willingness: {
        corePattern: [
            {
                type: 'text',
                content: `This very positive level of energy may be seen as the gateway to the higher levels of awareness. Whereas jobs, for instance, are performed adequately at the Neutral level, at the level of Willingness, work is done well and success is common in all endeavors. Growth is rapid here; these are the people chosen for advancement.`
            },
            {
                type: 'text',
                content: `Willingness implies that one has overcome inner resistance to life and is committed to participation. Below level 200, people tend to be close-minded, but by level 310, a great opening occurs. At this level people become genuinely friendly, and social and economic successes seem to follow automatically.`
            },
            {
                type: 'callout',
                variant: 'example',
                title: 'The Willing Person',
                content: `The willing are not troubled by unemployment; they will take any job when they have to, or create a career, or become self-employed. They do not feel demeaned by service jobs or by starting "at the bottom." They are helpful to others and tend to volunteer, contributing to the good of society.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Gateway to Higher Consciousness',
                content: `At this level, self-esteem is high and reinforced by positive feedback from society in the forms of recognition, appreciation, and reward. Willingness is sympathetic and responsive to the needs of others. Willing people are builders of and contributors to society.`
            },
        ],

        egoDynamics: [
            {
                type: 'text',
                content: `With their capacity to bounce back from adversity and learn from experience, they tend to become self-correcting. Having let go of Pride, they are willing to look at their defects and learn from others. At the level of Willingness, people become excellent students and represent a considerable source of power for society.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Spiritual Alignment',
                content: `By spiritual alignment and dedication, the level of spiritual energy rises and strongly activates the right-brain chemistry and physiology. This alters perception and releases anabolic neurotransmitters and endorphins in the brain. The world is therefore seen as more benign, friendly, and supportive.`
            },
            {
                type: 'text',
                content: `Fulfillment of goals is facilitated by virtue of their internalization rather than projection to external conditions. Thus, gain is internalized and valued as successful internal growth and the gratification of reaching developmental goals.`
            },
            {
                type: 'bullets',
                items: [
                    'Benign intention motivates actions and decisions that lead to choosing positive options',
                    'Integrity of intention is concordant with a benign conscience',
                    'Results in self-approval and healthy self-esteem independent of others\' opinions',
                    'Creates autonomy and gratification through fulfillment of inner potentials',
                    'Develops capacity for humor and ability to laugh at oneself and human foibles',
                ]
            },
        ],

        spiritualContext: [
            {
                type: 'quote',
                quote: `Spiritual dedication and effort bring unanticipated rewards that confirm the validity of the commitment. The seeming sacrifices turn out to be well worth the effort.`
            },
            {
                type: 'text',
                content: `Spiritual gratification is an unsuspected source of pleasure that brings a greater sense of well-being, which is the consequence of an increase in the flow of spiritual energy. There is a greater sense of aliveness and appreciation for life as its quality progressively improves.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'The Golden Rule Level',
                content: `The energy of Willingness is also the level of the Golden Rule: "Do unto others as you would have others do unto you." In successful relationships, this results in a mutuality of partners as helpmates and companions. This mutuality is the result of alignment with each other's welfare rather than just the more animal-driven emotional involvement.`
            },
            {
                type: 'text',
                content: `Willingness is supportive rather than competitive for gain or dominance, and relationships involve service to each other's growth and goals rather than to just one's own. Willingness is therefore harmonious and is expressed as the "win-win" attitude instead of the lesser levels that view life as a "win-lose" dichotomy.`
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Karma Yoga',
                content: `The spiritual practice of selfless service is classically termed "karma yoga," which, when combined with prayer and devotion, is transformative. It was the pathway of Mahatma Gandhi.`
            },
        ],

        pathThrough: [
            {
                type: 'text',
                content: `Willingness is cheerful, helpful, and voluntary. It has the extra energy that would otherwise be wasted on resistance, delay, and complaints. Willingness energizes fulfilling the needs of others, and thus its social expression is benevolent and humanitarian.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Core Shift',
                content: `With relinquishment of resistance, less effort is required to function in the world. The intrinsic rewards of spiritual growth become self-activating motivation that evolves into enthusiasm as a consequence of the more positive view of self and life.`
            },
            {
                type: 'steps',
                items: [
                    {
                        title: 'Overcome inner resistance',
                        content: `Willingness implies that one has overcome inner resistance to life and is committed to participation. Practice saying "yes" to life's opportunities. Replace "I can't" with "I can" and "I will." This shift from resistance to acceptance opens the gateway to higher levels.`
                    },
                    {
                        title: 'Become teachable',
                        content: `Having let go of Pride, you are willing to look at your defects and learn from others. Actively seek feedback, admit when you don't know something, and approach life as an excellent student. This teachability is what makes rapid growth possible.`
                    },
                    {
                        title: 'Practice the Golden Rule',
                        content: `"Do unto others as you would have others do unto you." This creates mutuality in relationships rather than power struggles. Look for win-win solutions and consider how your actions affect others' welfare and happiness.`
                    },
                    {
                        title: 'Develop self-correcting capacity',
                        content: `With the capacity to bounce back from adversity and learn from experience, become self-correcting. When setbacks occur, ask: "What can I learn? How can I grow?" This prevents getting stuck in victim consciousness.`
                    },
                    {
                        title: 'Serve others voluntarily',
                        content: `Be helpful to others and contribute to the good of society. Volunteer, mentor, or simply be of service in daily interactions. True generosity expects no reward—there are no strings attached. Many charitable people see it as an honor to serve others.`
                    },
                    {
                        title: 'Internalize your goals',
                        content: `Fulfillment of goals is facilitated by virtue of their internalization rather than projection to external conditions. Value successful internal growth and the gratification of reaching developmental goals rather than external validation alone.`
                    },
                    {
                        title: 'Accept personal responsibility',
                        content: `Central to Willingness is the willingness to accept personal responsibility, accountability, and the refusal to place blame or responsibility externally. Create your own opportunities rather than waiting for them to appear.`
                    },
                    {
                        title: 'Recognize the true source',
                        content: `The limitation of this level is the focus on the personality and identification with it as the self, whereas in reality, the growth is due to the radiance of the Self. Remember that everything happens as a consequence of potentiality manifesting as actuality when conditions are appropriate.`
                    },
                ]
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Daily Practice',
                content: `Each day, look for opportunities to be helpful and contribute. Practice the motto: "Just put your head down, keep going, and go for it." Maintain the willingness to face inner discomfort for the sake of reaching higher goals.`
            },
            {
                type: 'quote',
                quote: `Willingness attracts abundance and supportive feedback, not as a result of seeking but in response to that which it is because 'like goes to like.'`
            },
        ],

        dualities: [
            { from: "Inner resistance to life", to: "Committed participation" },
            { from: "Closed-minded", to: "Great opening occurs" },
            { from: "Defensive about defects", to: "Willing to look at defects and learn" },
            { from: "Win-lose mentality", to: "Win-win attitude" },
            { from: "Competitive for dominance", to: "Supportive and harmonious" },
            { from: "Blaming externally", to: "Personal responsibility and accountability" },
            { from: "Seeking external validation", to: "Internal growth and self-approval" },
            { from: "Resistant to feedback", to: "Excellent student, teachable" },
            { from: "Self-serving", to: "Service to others' growth and goals" },
            { from: "I can't", to: "I can and I will" },
        ],
    },

    acceptance: {
        corePattern: [
            {
                type: 'text',
                content: `At this level of awareness, a major transformation takes place with the understanding that oneself is the source and creator of the experience of one's life. Taking such responsibility is distinctive at this degree of evolution, characterized by the capacity to live harmoniously with the forces of life.`
            },
            {
                type: 'text',
                content: `Below consciousness level 200, there is the tendency to see oneself as a victim at the mercy of life. This stems from a belief that the source of one's happiness or the cause of one's problems is "out there." The enormous jump of taking back one's own power is completed at this level with the realization that the source of happiness is within oneself.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Not Passivity',
                content: `Acceptance is not to be confused with passivity, which is a symptom of apathy. This form of acceptance allows engagement in life on life's own terms, without trying to make it conform to an agenda. With Acceptance, there is emotional calm, and perception is widened as denial is transcended.`
            },
            {
                type: 'callout',
                variant: 'example',
                title: 'Characteristics of Acceptance',
                content: `The individual at the level of Acceptance is less interested in judgmentalism and instead is dedicated to resolving issues and finding out what to do about problems. Tough jobs do not cause discomfort or dismay. Long-term goals take precedence over short-term ones; self-discipline and mastery are prominent.`
            },
        ],

        egoDynamics: [
            {
                type: 'text',
                content: `At level 350, the narcissistic ego's demand to control others is silenced by virtue of the cessation of value-driven judgmentalism and its innate desire to promulgate its views. Dualistic mentations diminish, as do judgments predicated on perceptions based on the dichotomy of good and evil.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Freedom of Choice',
                content: `Choice presents itself as freedom of options rather than as opposing moralistic categories. At the world's level of consciousness, to choose vanilla means to see chocolate as a rival, an enemy, or a quality to be hated. At level 350, there is the freedom to see that they are merely alternate options and one can choose one flavor without demonizing the other.`
            },
            {
                type: 'text',
                content: `Critical to this level is the utilization of the previously achieved capacity for Willingness (which was acquired at level 310). The success of level 350 is based on the willingness to apply the principle of forgiveness in order to counterbalance morality and judgmentalism. Thus, vindictiveness is replaced by mercy.`
            },
            {
                type: 'bullets',
                items: [
                    'Unemotional discernment replaces judgmentalism',
                    'Personal opinions become dethroned and lose their tendency to dominate',
                    'The conscience becomes benign as it has been "defanged"',
                    'Primitive drives are accepted as part of nature to be counterbalanced',
                    'Humility results in surrendering the ego\'s self-importance',
                ]
            },
        ],

        spiritualContext: [
            {
                type: 'quote',
                quote: `Acceptance is a result of wisdom as well as surrendering positionalities in that it accepts that the varied expressions of life are in accord with Divine will and that Creation is thereby multitudinous in its expressions as evolution.`
            },
            {
                type: 'text',
                content: `Acceptance does not get caught in the "either-or" of "black and white" duality and is able to bypass the temptation of judgmentalism. Acceptance sees that perceived qualities are innate to the human condition and are reflective of individual as well as group karma and innate to the species Homo sapiens.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Harmless Nature',
                content: `Acceptance at level 350 is harmless because it does not seek to judge, control, change, or dominate others. It is not out to "save the world," or to condemn it in its multitudinous expressions. By surrendering the wish to change or control others, there is a reciprocal freedom of not being controllable by others' opinions and values.`
            },
            {
                type: 'text',
                content: `The spiritual power and integrity of every individual help raise the sea and all the ships on it. Moralistic exhortation brings about its opposite as counterforce, whereas the integrity of humility radiates power to which there is no opposite.`
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Divine Judgment',
                content: `To decline the role of moral arbiter allows the surrendering of that function to God ("Judgment is mine," sayeth the Lord) and results in detachment from the world's endless debates over moral, ethical, legal, political, religious, ethnic, judicial, and social positionalities.`
            },
        ],

        pathThrough: [
            {
                type: 'text',
                content: `The level of Acceptance is not polarized by conflict or opposition; it sees that other people have equal rights and therefore honors equality. While lower levels are characterized by rigidity, at this level social plurality begins to emerge as a form of resolution of problems. Acceptance includes rather than rejects.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Core Shift',
                content: `By relinquishing emotionalized judgmentalism, the way is clear to enter into harmony and peacefulness as a consequence of the decrease of the pressure of emotionality. Forgiveness and mercy allow for contemplative reflection and the emergence of the balance of discernment and understanding.`
            },
            {
                type: 'steps',
                items: [
                    {
                        title: 'Take back your power',
                        content: `Realize that you are the source and creator of the experience of your life. The enormous jump of taking back one's own power is completed at this level with the realization that the source of happiness is within oneself. Nothing "out there" has the capacity to make one happy.`
                    },
                    {
                        title: 'Transcend judgmentalism',
                        content: `Replace judgmentalism with unemotional discernment. While it is obvious that there are many elements and forces in the world that are deleterious to human life and happiness, it is not necessary to hate or demonize them but instead to merely make appropriate allowances and avoid them.`
                    },
                    {
                        title: 'Practice forgiveness and mercy',
                        content: `Apply the principle of forgiveness to counterbalance morality and judgmentalism. Vindictiveness is replaced by mercy, which allows for greater inner, as well as interpersonal and social, harmony and well-being. Error is seen to be in need of correction, forgiveness, and compassion.`
                    },
                    {
                        title: 'Surrender the need to control others',
                        content: `By surrendering the wish to change or control others, there is a reciprocal freedom of not being controllable by others' opinions and values, nor is there a desire or need for their approval. With freedom from the need of approval by others, there is release from the compulsion to seek and crave social agreement.`
                    },
                    {
                        title: 'Accept human limitations realistically',
                        content: `The maturity of Acceptance includes the ability to tranquilly accept both personal and human limitations without loss of self-esteem because value judgments have lost their validity and are now seen to be primarily arbitrary, personalized choices.`
                    },
                    {
                        title: 'Develop humility',
                        content: `Humility results in surrendering the ego's self-importance and narcissistic gain that arise from judgmentalism. Humility observes that the world is as it is, despite the millions of self-appointed experts in it. Humanity has managed to survive this long without one's personal opinions and advice.`
                    },
                    {
                        title: 'See the whole picture',
                        content: `One now sees things with less distortion or misinterpretation, and the context of experience is expanded so that one is capable of "seeing the whole picture." Acceptance essentially has to do with balance, proportion, and appropriateness.`
                    },
                    {
                        title: 'Develop a sense of humor',
                        content: `Developing a sense of humor assists the evolution of consciousness through deflating the ego's puffed-up self-image. The capacity to laugh at oneself and the foibles and paradoxes of human life prevents making a fool or spectacle of oneself to gain attention or control others.`
                    },
                ]
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Daily Practice',
                content: `Practice seeing situations without the need to judge them as "good" or "bad." Ask: "What can I learn from this? How can I respond appropriately?" Focus on resolving issues rather than being right about them.`
            },
            {
                type: 'quote',
                quote: `Acceptance brings peace by inclusion rather than by rejection or denunciation, thus offering the security necessary for the development of rationality and the intellect.`
            },
        ],

        dualities: [
            { from: "Victim at the mercy of life", to: "Source and creator of experience" },
            { from: "Happiness is 'out there'", to: "Source of happiness is within" },
            { from: "Judgmentalism and vindictiveness", to: "Forgiveness and mercy" },
            { from: "Need to control others", to: "Freedom from controlling and being controlled" },
            { from: "Emotionalized positions", to: "Unemotional discernment" },
            { from: "Black and white duality", to: "Freedom of options without demonizing" },
            { from: "Moral arbiter role", to: "Surrendering judgment to Divine will" },
            { from: "Rigid positionalities", to: "Social plurality and inclusion" },
            { from: "Ego's self-importance", to: "Humility and realistic perception" },
            { from: "Distorted perception", to: "Seeing the whole picture clearly" },
        ],
    },

    reason: {
        corePattern: [
            {
                type: 'text',
                content: `Intelligence and rationality rise to the forefront when the emotionalism of the lower levels is transcended. Reason is capable of handling large, complex amounts of data and making rapid, correct decisions; of understanding the intricacies of relationships, gradations, and fine distinctions; and of expert manipulation of symbols as abstract concepts become increasingly important.`
            },
            {
                type: 'text',
                content: `This is the level of science, medicine, and generally increased capacity for rationality, conceptualization, and comprehension. Thus, knowledge and education are highly valued. Understanding of information and logic are the main tools of accomplishment that are the hallmarks of level 400. This is the level of Nobel Prize winners, great statesmen, Supreme Court Justices, Einstein, Freud, and many other important figures in the history of thought.`
            },
            {
                type: 'callout',
                variant: 'warning',
                title: 'The Shortcomings',
                content: `The shortcomings of this level are the failure to clearly distinguish the difference between symbols (i.e., res cogitans) and what they represent (res externa), and the confusion between the objective and subjective worlds that limits the understanding of causality. At this level, it is easy to lose sight of the forest for the trees, to become infatuated with concepts and theories, and to end up missing the essential point.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'The Major Block',
                content: `Reason itself, paradoxically, is the major block to reaching higher levels of consciousness because it attracts identification of the self as mind. Transcending this level is relatively uncommon in our society (only four percent do so), as it requires a shift of paradigm from the descriptive to the subjective and experiential.`
            },
        ],

        egoDynamics: [
            {
                type: 'text',
                content: `The consciousness levels of the 400s represent the emergence of the capacity to synthesize and utilize linear abstractions and symbols of great complexity and to extract significance and meaning as well as predictive verification. Intelligence comprehends hierarchical fields of organizational rank and discerns value as to reliability, implied worth, or significance.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Higher vs Lower Mind',
                content: `Lower Mind is less evolved and characteristic of children, immaturity, and lack of education. In its more primitive condition, mentalization subserves emotionalities and personalized needs and wants. Higher Mind is disciplined by accountability that requires adherence to standards of truth, with concomitant requirements of ethics and responsibility.`
            },
            {
                type: 'text',
                content: `At consciousness levels in the 400s, although emotions are still present and taken into account, they no longer dominate or replace logic and reason. "Thinkingness" is merely random mentation, whereas reason is constrained by the dialectics, discipline, and limitations of the rules of logic.`
            },
            {
                type: 'bullets',
                items: [
                    'Massive capability to process and synthesize complex information',
                    'Automatic weighting of data with degrees of credibility and importance',
                    'Capacity to think and reason spawned academic fields of science and philosophy',
                    'Alignment with commitment to truth energizes reason, logic, and intellect',
                    'The gift of alignment with truth results in comprehension and wisdom',
                ]
            },
        ],

        spiritualContext: [
            {
                type: 'quote',
                quote: `With the evolution of consciousness, reason, logic, and the intellect are energized by alignment with commitment to truth, which is actually an aspect of Divinity and the invisible source of the power of the field of mind itself.`
            },
            {
                type: 'text',
                content: `The combination of reason, logic, and education is a strong counterbalance to offset the pressures of the primitive narcissistic core of the ego that feels threatened by the higher values of personal and social integrity. An enemy of rationality is the self-servingness of narcissism itself, which warps and distorts reason to facilitate its own ends.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Spiritual Alignment',
                content: `With maturity, the intellect is integrated with positive emotions that add value and motivations, such as the pleasure of accomplishment. Spiritual alignment results in prioritizing spiritual principles by which to resolve conflict. To commit to the endeavor to serve the highest good means to subordinate it to God's will.`
            },
            {
                type: 'text',
                content: `By spiritual intention, the intellect can be sanctified so that it becomes a springboard and roadway to understanding spiritual reality instead of a dead end or a roadblock. Spiritual study utilizes the intellect to reveal that the intellect itself has to be transcended from "knowing about" to "becoming."`
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'The Paradigm Jump',
                content: `The transition from the consciousness level of the 400s to the level of the 500s is a paradigm jump from the mental realm of linear symbols to nonlinear subjectivity. The mind is satisfied with the acquisition of knowledge but then discovers that alone it is insufficient to bring about transformation.`
            },
        ],

        pathThrough: [
            {
                type: 'text',
                content: `Intellectualizing can become an end in itself. Reason is limited in that it does not afford the capacity for the discernment of essence or the "critical point" of a complex issue. Reason is disciplined by the dialectic of logic as a necessity to discern the linear truth of confirmable facts.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Core Shift',
                content: `The limitation of the mind is evidenced by its structure in that the functional ego is linear, dualistic, and dominated by the Newtonian paradigm of causality that reinforces the illusion of a separate, personal "I" as a self-actualizing causal agent. The transition requires transcending the mind.`
            },
            {
                type: 'steps',
                items: [
                    {
                        title: 'Align reason with truth',
                        content: `With the evolution of consciousness, reason, logic, and the intellect are energized by alignment with commitment to truth, which is actually an aspect of Divinity. The gift of alignment with truth results in comprehension and the accumulation of wisdom and sagacity in the exercise of reason.`
                    },
                    {
                        title: 'Transcend intellectualization',
                        content: `Recognize that intellectualizing can become an end in itself. The intellect accumulates, sorts, processes, and assimilates spiritual and religious information, but it can become a limitation to the evolution to higher consciousness, which requires transcending the mind.`
                    },
                    {
                        title: 'Move from "knowing about" to "becoming"',
                        content: `The mind is satisfied with the acquisition of knowledge but discovers that alone it is insufficient to bring about transformation, which requires a further step to convert data into an inner experiential reality. This transfer comes about through spiritual practice, meditation, contemplation, and devotion.`
                    },
                    {
                        title: 'Silence the mental chatter',
                        content: `A major deterrent to spiritual evolution is random mentalization, which is presumed to be "thinking." Mentalization is of egocentric origin, and its primary function is commentary. Unless requested, thought is a vanity, an endless procession of opinion and judgment. The well-disciplined mind should only speak when requested to perform a task.`
                    },
                    {
                        title: 'Surrender paradigm allegiance',
                        content: `A resistance that is often unrecognized is attachment to the familiar by what can be called "paradigm allegiance." The limitation of academic science is most markedly obvious in its ambivalence and distrust of first-person experiential testimony and information. Science is linear; Spiritual Reality is nonlinear.`
                    },
                    {
                        title: 'Sanctify the intellect',
                        content: `By spiritual intention, the intellect can be sanctified so that it becomes a springboard and roadway to understanding spiritual reality instead of a dead end or roadblock. Spiritual study utilizes the intellect to reveal that the intellect itself has to be transcended.`
                    },
                    {
                        title: 'Practice surrender and humility',
                        content: `The transition is best described as the classic passage from "have" to "do" to "be" and is facilitated by surrendering the attempt to control the process. Surrender is a necessary and almost constant attitude that is subserved by humility at great depth.`
                    },
                    {
                        title: 'Embrace the paradigm jump',
                        content: `The transition from the consciousness level of the 400s to the level of the 500s is a paradigm jump from the mental realm of linear symbols to nonlinear subjectivity. This requires rejecting egocentricity and by spiritual declaration, practice, and commitment, allowing spiritual energy to flow as lovingness.`
                    },
                ]
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Daily Practice',
                content: `Practice periods of mental silence. Give the mind permission to be silent. When devalued and humbled, the vanity basis of thinkingness collapses, and in its place one discovers the joy of inner silence, which actually constitutes ninety-nine percent of the mind. Only one percent is actually chattering.`
            },
            {
                type: 'quote',
                quote: `It is a relief to let the mind become silent and just "be" with surroundings. Peace results, and appreciation and calm prevail.`
            },
        ],

        dualities: [
            { from: "Intellectualization as an end", to: "Intellect as a springboard to spirit" },
            { from: "Knowing about", to: "Becoming" },
            { from: "Mental chatter and commentary", to: "Inner silence and peace" },
            { from: "Paradigm allegiance", to: "Openness to nonlinear reality" },
            { from: "Self as mind", to: "Mind as servant of Self" },
            { from: "Linear symbols", to: "Nonlinear subjectivity" },
            { from: "Objective focus", to: "Experiential subjectivity" },
            { from: "Ego-driven reasoning", to: "Truth-aligned intelligence" },
            { from: "Mental acquisition", to: "Spiritual transformation" },
            { from: "Controlling the process", to: "Surrendering to Divinity" },
        ],
    },

    love: {
        corePattern: [
            {
                type: 'text',
                content: `Love at level 500 represents a major paradigm shift from the linear mind to spiritual reality. This is unconditional, unchanging, and permanent love that does not fluctuate because its source within us is not dependent on external conditions.`
            },
            {
                type: 'text',
                content: `We develop the capacity to discern essence rather than getting caught in details. Love deals with wholes while reason deals with particulars. We take no positions, thus rising above the separation of positionality.`
            },
            {
                type: 'callout',
                variant: 'example',
                title: 'Love in Daily Life',
                content: `The healthcare worker who serves with genuine compassion regardless of patient behavior. The parent who loves their child unconditionally through all phases of development. The person who can forgive those who have hurt them and wish them well.`
            },
            {
                type: 'text',
                content: `Love is a way of being in and relating to the world that is forgiving, nurturing, and supportive. It emanates from the heart, not the mind, and has the capacity to lift others and accomplish great feats because of its purity of motive.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'The Source Within',
                content: `Love is not an emotion but a state of being. The source of love is internal, not dependent on external conditions or people. The capacity for love grows—the more we love, the more we can love.`
            },
        ],

        egoDynamics: [
            {
                type: 'text',
                content: `At Love, the ego undergoes a fundamental transformation. The narcissistic core no longer predominates due to humility and the relinquishment of egocentricity. Personal self-interest is no longer dominant as selfishness or neediness.`
            },
            {
                type: 'text',
                content: `We transcend identification with limiting linear domain and positionalities. Our awareness shifts to subjectivity as the primary state underlying all experience. We focus on context and quality rather than content and quantity.`
            },
            {
                type: 'callout',
                variant: 'warning',
                title: 'Hidden Attachments',
                content: `We may become attached to the blissful state and resist moving to higher levels. There's risk of spiritual pride about our loving nature compared to others. We can become overly accommodating, losing appropriate boundaries.`
            },
            {
                type: 'bullets',
                items: [
                    'Freedom from animal instincts pressuring for dominance',
                    'Benign intention motivating actions toward positive options',
                    'Self-rewarding nature of love that expects no return',
                    'Approximately 90% experience happiness as basic quality of life',
                ]
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Transition Mechanisms',
                content: `Learning to distinguish between conditional attachment and unconditional love. Building capacity to love without enabling or rescuing others. Recognizing love as a state of being rather than something to do or give.`
            },
        ],

        spiritualContext: [
            {
                type: 'quote',
                quote: `Love represents the soul's alignment with its true nature and with Divinity itself. It's where we transcend the ego's need to get love and instead become love.`,
            },
            {
                type: 'text',
                content: `This level dissolves much of the karmic separation that keeps us feeling isolated and alone. Love is crucial for spiritual development because it provides the heart-centered foundation necessary for higher levels of consciousness.`
            },
            {
                type: 'text',
                content: `Without the capacity for unconditional love, we cannot access the joy and peace of higher levels. It represents the soul's recognition of its divine nature and its capacity to serve life rather than exploit it.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Christ Consciousness',
                content: `This level represents the emergence of Christ consciousness or Buddha nature—the recognition that love is not something we have but something we are. Separation is revealed as an illusion.`
            },
            {
                type: 'text',
                content: `Love transcends the intellectual limitations of Reason through heart-centered knowing. It provides the foundation of unconditional love that allows Joy to emerge and creates the spiritual alignment that supports Peace and higher levels.`
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Service Orientation',
                content: `Love establishes the service orientation that prepares us for enlightened consciousness. It represents the first level of true spiritual reality beyond the linear mind.`
            },
        ],

        pathThrough: [
            {
                type: 'text',
                content: `The path through Love focuses on stabilizing spiritual states rather than removing blocks. We learn to embody love as our natural way of being, moving from conditional attachment to unconditional love.`
            },
            {
                type: 'steps',
                items: [
                    {
                        title: 'Transcend Conditional Love',
                        content: `Recognize the difference between attachment-based "love" (which can turn to hate) and unconditional love (which is permanent). Practice loving without conditions, expectations, or need for return. True love is not dependent on the other person's behavior.`
                    },
                    {
                        title: 'Shift from Mind to Heart',
                        content: `Move from intellectual understanding to heart-centered knowing. Love does not proceed from the mind but emanates from the heart. Practice feeling into situations rather than just thinking about them. Let your heart guide your responses.`
                    },
                    {
                        title: 'Develop Essence Perception',
                        content: `Learn to discern the essence or core of situations rather than getting caught in details and positions. Practice seeing the whole rather than just the parts. Ask: "What is the essential truth here?" This capacity for instantaneous understanding transcends sequential thinking.`
                    },
                    {
                        title: 'Release All Positions',
                        content: `Love takes no position and thus is global. Practice rising above the need to be right, to take sides, or to defend positions. When you find yourself in opposition, ask: "How can I love this situation?" This dissolves barriers and allows unity.`
                    },
                    {
                        title: 'Focus on Goodness',
                        content: `Love focuses on the goodness of life in all its expressions and augments that which is positive. Practice looking for what's working, what's beautiful, what's growing. Dissolve negativity by recontextualizing it rather than attacking it.`
                    },
                    {
                        title: 'Expand Your Sense of Self',
                        content: `Love is inclusive and progressively expands the sense of self. Practice identifying with larger and larger circles—family, community, humanity, all life. The boundaries of "self" and "other" begin to dissolve in love's inclusiveness.`
                    },
                    {
                        title: 'Serve Without Expectation',
                        content: `Love serves whereas ego seeks to be served. Find ways to contribute to others' wellbeing without expectation of return. The joy is in the giving itself. Discover that to be loving is also to be lovable.`
                    },
                    {
                        title: 'Align with Divine Love',
                        content: `Recognize that as love becomes progressively spiritualized, it emerges as alignment with Divinity, which is the ultimate source of love. Surrender personal love to Divine Love. Let yourself be an instrument of love rather than the source of it.`
                    },
                ]
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Daily Practice',
                content: `Each morning, place a hand on your heart and ask: "How can I be an expression of love today?" Let this intention guide your interactions. Notice how love naturally flows when we stop trying to get it and start being it.`
            },
            {
                type: 'quote',
                quote: `Love is self-rewarding and has no needs. The more we love, the more we can love. Love takes no position and is therefore global and unifying.`,
            },
        ],

        dualities: [
            { from: "Conditional attachment", to: "Unconditional love" },
            { from: "Seeking to get love", to: "Being love itself" },
            { from: "Mind-based understanding", to: "Heart-centered knowing" },
            { from: "Taking positions", to: "Rising above separation" },
            { from: "Focusing on problems", to: "Seeing goodness and potential" },
            { from: "Self-centered needs", to: "Service without expectation" },
            { from: "Emotional volatility", to: "Stable, permanent love" },
            { from: "Judging and attacking", to: "Recontextualizing with compassion" },
            { from: "Separate self-interest", to: "Expanded sense of unity" },
            { from: "Human love", to: "Divine love expressing through us" },
        ],
    },

    joy: {
        corePattern: [
            {
                type: 'text',
                content: `Joy at level 540 represents unconditional love and inner happiness that is independent of external conditions. This is spiritual joy that occurs on a quiet level of inexplicable ecstasy, with a source that is unending and ever present.`
            },
            {
                type: 'text',
                content: `We transcend the devotional love of 500 and discover joy as a state of being rather than an emotion. There's no beginning or ending, no loss or grief or desire. Nothing needs to be done; everything simply is.`
            },
            {
                type: 'callout',
                variant: 'example',
                title: 'Joy in Daily Life',
                content: `The person who finds deep contentment in simple activities like gardening. The caregiver who serves others with genuine joy, finding fulfillment in giving. The individual who maintains inner peace and happiness despite life challenges.`
            },
            {
                type: 'text',
                content: `We experience inner happiness that doesn't depend on circumstances. Spontaneous gratitude and appreciation for existence itself becomes natural, along with effortless compassion that flows without intention.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'The Natural State',
                content: `Joy is not dependent on getting what we want but on appreciating what is. True happiness comes from within and is our natural state when obstacles are removed. The source of joy is spiritual and connects us to the divine nature of existence.`
            },
        ],

        egoDynamics: [
            {
                type: 'text',
                content: `At Joy, the ego has largely dissolved its grip on happiness being dependent on external conditions. The narcissistic core has been transcended through the realization that joy is our natural state when obstacles are removed.`
            },
            {
                type: 'text',
                content: `We experience freedom from the need for external validation or achievement for happiness. Natural generosity and service arise from inner abundance, with the ability to maintain equanimity during life's ups and downs.`
            },
            {
                type: 'callout',
                variant: 'warning',
                title: 'Hidden Attachments',
                content: `We may become attached to the blissful state and resist ordinary human experiences. There's risk of spiritual bypassing—avoiding necessary human growth work. We can become detached from practical responsibilities or develop subtle spiritual pride.`
            },
            {
                type: 'bullets',
                items: [
                    'Spontaneous gratitude and appreciation for existence itself',
                    'Effortless compassion that includes all beings',
                    'Transcendence of competitive or comparative thinking',
                    'Inner contentment independent of circumstances',
                ]
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Integration Balance',
                content: `Learning to include rather than transcend human experience. Balancing spiritual joy with practical engagement in life. Maintaining groundedness while experiencing transcendent states.`
            },
        ],

        spiritualContext: [
            {
                type: 'quote',
                quote: `Spiritual joy occurs on a quiet level of inexplicable ecstasy. The source of joy is unending and ever present, with no beginning or ending.`,
            },
            {
                type: 'text',
                content: `Joy represents the soul's recognition of its divine nature and inherent wholeness. We discover that happiness is not something to be achieved but something we are. This level dissolves karmic patterns of seeking fulfillment outside ourselves.`
            },
            {
                type: 'text',
                content: `This level is crucial for spiritual development because it provides the stable foundation of inner contentment necessary for higher levels of consciousness. It represents the soul's maturation beyond personal love into universal love and compassion.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Divine Bliss',
                content: `Joy is the soul's recognition of its unity with the divine source of all happiness. We discover that joy is not an emotion but the very fabric of consciousness itself. This represents the emergence of what mystics call "divine bliss."`
            },
            {
                type: 'text',
                content: `Joy transcends the conditional love of 500 through recognition of inherent wholeness. It provides the foundation of inner contentment that supports Peace (600) and establishes the spiritual abundance necessary for enlightened consciousness.`
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Universal Compassion',
                content: `Joy naturally expresses itself as love and service to others. This level creates the stable joy that is independent of external circumstances and prepares consciousness for the transcendent peace of higher levels.`
            },
        ],

        pathThrough: [
            {
                type: 'text',
                content: `The path through Joy focuses on stabilizing spiritual states of inner contentment and recognizing joy as our natural essence. We learn to shift from seeking happiness externally to being happiness itself.`
            },
            {
                type: 'steps',
                items: [
                    {
                        title: 'Recognize Joy as Your Natural State',
                        content: `Understand that joy is not something to be achieved but something to be uncovered. It's your natural state when the obstacles of seeking happiness externally are removed. Practice recognizing moments when joy arises spontaneously, independent of circumstances.`
                    },
                    {
                        title: 'Shift from Seeking to Being',
                        content: `Move from trying to get joy from external sources to recognizing joy as the essence of your being. Practice being present to the joy that's already here rather than seeking it in future achievements or acquisitions.`
                    },
                    {
                        title: 'Cultivate Unconditional Appreciation',
                        content: `Develop the capacity to find beauty and meaning in ordinary moments. Practice gratitude not for what you have but for the simple fact of existence itself. Let appreciation become a way of being rather than a practice.`
                    },
                    {
                        title: 'Transcend Conditional Happiness',
                        content: `Release the belief that you need specific conditions to be happy. Practice maintaining inner contentment regardless of external circumstances. Discover the joy that exists independent of getting what you want.`
                    },
                    {
                        title: 'Embrace Spiritual Abundance',
                        content: `Recognize that joy naturally overflows into service and love for others. Allow your inner fullness to express itself through generous giving and compassionate action. Serve from abundance rather than need.`
                    },
                    {
                        title: 'Stabilize in Quiet Ecstasy',
                        content: `Learn to sustain the quiet, deep joy that doesn't depend on dramatic peaks or external stimulation. Practice resting in the subtle but profound contentment that is always available in the present moment.`
                    },
                    {
                        title: 'Integrate Joy with Human Experience',
                        content: `Balance transcendent joy with full engagement in human life. Include rather than bypass the full spectrum of human emotions while maintaining your foundation in spiritual joy.`
                    },
                    {
                        title: 'Radiate Joy Effortlessly',
                        content: `Allow your joy to become a natural emanation that uplifts others without effort or intention. Let your presence become a gift to the world, sharing joy simply by being authentically joyful.`
                    },
                ]
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Daily Practice',
                content: `Each morning, rest in the awareness of your natural joyful essence before engaging with the day. Notice how this inner contentment remains stable regardless of external circumstances. Let joy be your foundation rather than your goal.`
            },
            {
                type: 'quote',
                quote: `The source of joy is unending and ever present. With no beginning or ending, there is no loss or grief or desire. Nothing needs to be done.`,
            },
        ],

        dualities: [
            { from: "Seeking happiness externally", to: "Recognizing joy as natural state" },
            { from: "Conditional contentment", to: "Unconditional inner joy" },
            { from: "Emotional ups and downs", to: "Stable spiritual happiness" },
            { from: "Need-based relationships", to: "Abundance-based service" },
            { from: "Achievement-dependent worth", to: "Inherent spiritual value" },
            { from: "Dramatic peak experiences", to: "Sustained quiet ecstasy" },
            { from: "Personal love and attachment", to: "Universal compassion" },
            { from: "Seeking validation", to: "Self-validating joy" },
            { from: "Future-focused happiness", to: "Present-moment contentment" },
            { from: "Joy as emotion", to: "Joy as essence of being" },
        ],
    },

    peace: {
        corePattern: [
            {
                type: 'text',
                content: `Peace at level 600 is experienced as perfection, bliss, effortlessness, and oneness. It is a state of non-duality beyond separateness and beyond the intellect, described as "the peace that passeth all understanding."`
            },
            {
                type: 'text',
                content: `This represents Illumination and Enlightenment - the emergence of God Immanent as Self, illuminated by the Light of the Radiant Self. We experience profound inner stillness that remains undisturbed by external circumstances.`
            },
            {
                type: 'callout',
                variant: 'example',
                title: 'Peace in Expression',
                content: `The sage who remains in perfect equanimity regardless of praise or criticism. The person who radiates such profound peace that others feel it in their presence. The individual who has transcended all personal desires and lives in complete contentment.`
            },
            {
                type: 'text',
                content: `We experience natural effortlessness in all activities, as if life flows through rather than from us. There's complete transcendence of the need to have opinions, positions, or preferences about anything.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Beyond Seeking',
                content: `Peace is not the absence of activity but the presence of profound stillness within activity. All seeking ends because there is nothing left to seek. Reality is recognized as perfect exactly as it is.`
            },
        ],

        egoDynamics: [
            {
                type: 'text',
                content: `At Peace, the ego has essentially dissolved. There is no longer a separate self that needs to defend, acquire, or become anything. The personal identity has been transcended and replaced by universal consciousness.`
            },
            {
                type: 'text',
                content: `We experience complete absence of personal desires, preferences, or aversions. Natural detachment from outcomes occurs while remaining fully engaged. Spontaneous right action serves the highest good without personal motivation.`
            },
            {
                type: 'callout',
                variant: 'warning',
                title: 'Integration Challenges',
                content: `We may withdraw from ordinary human activities and responsibilities. There's risk of becoming detached from practical worldly concerns. We can appear indifferent or uncaring to those at lower levels of consciousness.`
            },
            {
                type: 'bullets',
                items: [
                    'Transcendence of all emotional reactivity and mental positions',
                    'Effortless presence that requires no maintenance or effort',
                    'Natural wisdom that flows without thinking or planning',
                    'Complete acceptance of what is without need to change it',
                ]
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Balanced Expression',
                content: `Learning to express transcendent peace through compassionate engagement. Balancing transcendence with practical service to humanity. Integrating enlightened awareness with ordinary human activities.`
            },
        ],

        spiritualContext: [
            {
                type: 'quote',
                quote: `This is experienced as perfection, bliss, effortlessness, and oneness. It is a state of non-duality beyond separateness and beyond the intellect.`,
            },
            {
                type: 'text',
                content: `Peace represents the transcendence of all karmic patterns and the establishment in pure consciousness. We recognize our identity as universal awareness rather than a separate individual. This level dissolves all sense of separation.`
            },
            {
                type: 'text',
                content: `Peace marks the beginning of enlightened consciousness and represents the goal of all spiritual seeking. It's where consciousness recognizes itself as the source and substance of all existence.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'Ground of Being',
                content: `Peace is recognized as the very nature of consciousness itself. It's not something achieved but something that we are. Existence itself is perfect peace, and all apparent disturbance exists only in the realm of illusion.`
            },
            {
                type: 'text',
                content: `This level transcends the joy and love of lower levels through recognition of non-dual awareness. It represents the first level of true enlightenment beyond personal consciousness and establishes the foundation for even higher levels of realization.`
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Universal Recognition',
                content: `Peace completes the journey from separation to unity consciousness. It represents the peace that is the goal of all spiritual paths and the fulfillment of human potential.`
            },
        ],

        pathThrough: [
            {
                type: 'text',
                content: `The path through Peace focuses on transcending all positions and dissolving the personal self into universal consciousness. We learn to rest in pure awareness and allow life to flow through us effortlessly.`
            },
            {
                type: 'steps',
                items: [
                    {
                        title: 'Transcend All Positions',
                        content: `Release the need to have opinions, preferences, or positions about anything. Practice recognizing that all positions are limitations of infinite consciousness. Let go of the need to be right, to take sides, or to have preferences about how life should be.`
                    },
                    {
                        title: 'Surrender Personal Will',
                        content: `Dissolve the sense of being a separate doer and allow life to flow through you rather than from you. Practice surrendering all personal desires and agendas to the flow of existence itself. Become an instrument of divine will.`
                    },
                    {
                        title: 'Rest in Pure Awareness',
                        content: `Establish yourself in the awareness that is aware of all experience but is not affected by any of it. Practice identifying with the consciousness that observes all thoughts, emotions, and sensations without being disturbed by them.`
                    },
                    {
                        title: 'Embrace Effortlessness',
                        content: `Allow all activities to flow naturally without force or struggle. Practice letting go of the effort to make things happen and instead allow life to unfold through you. Discover the profound ease that comes from non-resistance.`
                    },
                    {
                        title: 'Recognize Perfect Unity',
                        content: `See through the illusion of separation and recognize the one consciousness appearing as all diversity. Practice seeing the same awareness looking through all eyes and the same peace present in all beings.`
                    },
                    {
                        title: 'Dissolve the Personal Self',
                        content: `Let go of all identification with being a separate individual with personal history, desires, and concerns. Practice resting in the impersonal awareness that is your true nature, beyond all personal identity.`
                    },
                    {
                        title: 'Stabilize in Silence',
                        content: `Establish yourself in the profound silence that is the source of all sound, the stillness that is the source of all movement. Practice resting in the silence between thoughts, the peace between breaths.`
                    },
                    {
                        title: 'Embody Compassionate Presence',
                        content: `Allow your peace to become a gift to the world through your simple presence. Practice being a source of peace for others without any effort or intention, simply by being established in your true nature as peace itself.`
                    },
                ]
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Daily Practice',
                content: `Rest in the awareness that is aware of all experience but remains unaffected by it. Notice how this profound stillness is always present, regardless of what appears to be happening. Let this peace be your foundation.`
            },
            {
                type: 'quote',
                quote: `What remains is pure awareness without a center or circumference. The peace that passeth all understanding.`,
            },
        ],

        dualities: [
            { from: "Personal desires and preferences", to: "Impersonal awareness" },
            { from: "Emotional reactivity", to: "Unshakeable equanimity" },
            { from: "Seeking and striving", to: "Effortless being" },
            { from: "Separate self-identity", to: "Universal consciousness" },
            { from: "Mental positions and opinions", to: "Transcendent neutrality" },
            { from: "Resistance to what is", to: "Perfect acceptance" },
            { from: "Personal will and agenda", to: "Divine will flowing through" },
            { from: "Duality and separation", to: "Non-dual unity" },
            { from: "Conditional peace", to: "Unconditional peace" },
            { from: "Peace as experience", to: "Peace as essence of being" },
        ],
    },

    enlightenment: {
        corePattern: [
            {
                type: 'text',
                content: `Here we encounter the ultimate paradox: how do we speak about that which is beyond all speaking? How do we describe the indescribable? Enlightenment is not a state to be achieved, but the recognition of what has always been present.`
            },
            {
                type: 'text',
                content: `This is not a level in the conventional sense—it's the dissolution of all levels. The seeker, the path, and the goal are revealed to be movements within consciousness, not toward it. What we've been searching for was never lost.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'The Great Recognition',
                content: `Enlightenment is not becoming something new—it's recognizing what we've always been. Like the wave discovering it was always ocean, or space recognizing its own vastness.`
            },
            {
                type: 'quote',
                quote: `The pathless path leads nowhere because we never left home.`
            },
            {
                type: 'text',
                content: `At this level, the illusion of separation dissolves completely. There is no longer an "I" experiencing enlightenment—there is simply enlightenment itself. The observer, the observed, and the process of observation merge into one seamless reality.`
            },
            {
                type: 'callout',
                variant: 'warning',
                title: 'Beyond Description',
                content: `These words are like fingers pointing at the moon—useful for direction, but not to be mistaken for the moon itself. The reality they point to can only be known directly, never captured in concepts.`
            },
        ],

        egoDynamics: [
            {
                type: 'text',
                content: `At enlightenment, there are no ego dynamics in the conventional sense because there is no separate ego to have dynamics. The ego doesn't fight or resist—it simply dissolves like a wave returning to the ocean.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'The Final Dissolution',
                content: `The spiritual seeker, with all their practices and attainments, is revealed to have been another ego construction. The search ends not in finding something new, but in recognizing what was never lost.`
            },
            {
                type: 'text',
                content: `What remains is pure being—not someone being enlightened, but enlightenment itself. Actions arise spontaneously from the field of consciousness, without a doer. Thoughts appear and disappear like clouds in an empty sky.`
            },
            {
                type: 'bullets',
                items: [
                    'No sense of personal doership—actions arise spontaneously',
                    'Thoughts and emotions are witnessed without identification',
                    'No attachment to being "enlightened" or special',
                    'Complete ordinariness—nothing to maintain or protect',
                    'Effortless compassion as the natural expression of unity',
                ]
            },
            {
                type: 'quote',
                quote: `In the deepest realization, there is no one there to be realized.`
            },
        ],

        spiritualContext: [
            {
                type: 'text',
                content: `This is what mystics throughout history have pointed to with different names—God, Brahman, Buddha Nature, the Tao, Pure Consciousness. It is not a belief or concept, but direct knowing beyond all knowing.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'The Ultimate Reality',
                content: `What is realized is that consciousness is not something we have—it's what we are. Not personal consciousness, but the very field in which all experience arises and dissolves.`
            },
            {
                type: 'text',
                content: `From this recognition emerges the greatest compassion—not as an emotion, but as the natural expression of unity. All beings are seen as expressions of the same consciousness, waves in the same ocean.`
            },
            {
                type: 'text',
                content: `Time and causality are transcended. Past and future are revealed as mental constructs. There is only the eternal now, which was never born and will never die.`
            },
            {
                type: 'quote',
                quote: `The journey ends where it began—in the present moment. All seeking was movement within what we already are.`
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'Living the Paradox',
                content: `Enlightenment is both the most ordinary thing (simple being) and the most extraordinary (the end of all seeking). It is both nothing special and everything. This paradox cannot be resolved by the mind—only lived.`
            },
        ],

        pathThrough: [
            {
                type: 'text',
                content: `Here we face the ultimate paradox: how does one practice for something that is already present? The "path through" enlightenment is really the recognition that there is nowhere to go and nothing to achieve.`
            },
            {
                type: 'callout',
                variant: 'insight',
                title: 'The Pathless Path',
                content: `All practices, all seeking, all effort to become enlightened are movements within enlightenment. The wave cannot become the ocean—it can only recognize that it already is the ocean.`
            },
            {
                type: 'steps',
                items: [
                    {
                        title: 'Recognize the seeker as another thought',
                        content: `Notice that the "I" who wants enlightenment is itself a thought arising in awareness. Who is aware of this thought? Rest as that awareness, not as the thought of being someone seeking something.`
                    },
                    {
                        title: 'Surrender the need to understand',
                        content: `The mind cannot grasp enlightenment because enlightenment is what grasps the mind. Let go of trying to figure it out, analyze it, or make it into a concept. Understanding is not knowing.`
                    },
                    {
                        title: 'Stop seeking and simply be',
                        content: `All seeking reinforces the illusion that something is missing. What if nothing is missing? What if what you're seeking is what's already looking? Rest in the simple fact of being, without needing it to be anything special.`
                    },
                    {
                        title: 'Recognize what never changes',
                        content: `Thoughts come and go, emotions arise and pass, experiences change constantly. What is it that remains constant through all change? That unchanging awareness is what you are—not what you have, but what you are.`
                    },
                    {
                        title: 'Dissolve the observer-observed duality',
                        content: `Notice that in pure awareness, there is no separate observer watching experiences. There is just experiencing itself. The seer, the seen, and the seeing are one seamless reality.`
                    },
                    {
                        title: 'Embrace the ordinariness',
                        content: `Enlightenment is not a special state—it's the recognition of what's most ordinary and intimate. It's not about having extraordinary experiences, but recognizing the extraordinary nature of ordinary being.`
                    },
                    {
                        title: 'Let compassion arise naturally',
                        content: `Don't try to be compassionate—recognize that compassion is your nature. When the illusion of separation dissolves, love flows naturally, not as something you do, but as what you are.`
                    },
                    {
                        title: 'Live the paradox without resolution',
                        content: `Enlightenment cannot be grasped by the mind because it is what grasps the mind. Live this paradox without trying to resolve it. Be the mystery that you are, knowing that you can never be known as an object.`
                    },
                ]
            },
            {
                type: 'callout',
                variant: 'tip',
                title: 'The Ultimate Letting Go',
                content: `The final surrender is not of desires or fears, but of the one who desires and fears. When the seeker dissolves into the sought, what remains is what was always already here.`
            },
            {
                type: 'quote',
                quote: `You are not a human being having a spiritual experience. You are spiritual experience having a human being.`
            },
        ],

        dualities: [
            { from: "Seeking enlightenment", to: "Being enlightenment" },
            { from: "I am enlightened", to: "There is only enlightenment" },
            { from: "Spiritual practices", to: "Effortless being" },
            { from: "Achieving states", to: "Recognizing what is" },
            { from: "Personal awakening", to: "Impersonal awareness" },
            { from: "Transcending the ego", to: "Ego never existed" },
            { from: "Finding God", to: "Being God" },
            { from: "Becoming whole", to: "Never was broken" },
            { from: "Ending suffering", to: "Suffering was illusion" },
            { from: "Reaching the goal", to: "Never left home" },
        ],
    },
};

/**
 * Helper to get transcending content by level ID
 */
export function getTranscendingContent(levelId: string): TranscendingContent | undefined {
    return TRANSCENDING_DATA[levelId.toLowerCase()];
}
