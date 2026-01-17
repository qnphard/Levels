import { Meditation } from '../types';

export type RootStackParamList = {
    Tutorial: undefined;
    Onboarding: undefined;
    Main: undefined;
    Player: { meditation: Meditation };
    JourneyMap: undefined;
    LevelDetail: { levelId: string };
    LevelChapter: { levelId: string; initialView?: 'overview' | 'meditations' | 'articles'; sourceFeeling?: string };
    LearnHub: undefined;
    Chapter: { chapterId: string; tab?: string; initialTab?: string };
    Essentials: undefined;
    WhatYouReallyAre: undefined;
    Tension: { initialTab?: string } | undefined;
    Mantras: undefined;
    Settings: undefined;
    CommonTraps: undefined;
    NaturalHappiness: undefined;
    PowerVsForce: undefined;
    LevelsOfTruth: undefined;
    Intention: undefined;
    MusicAsTool: undefined;
    FatigueVsEnergy: undefined;
    FulfillmentVsSatisfaction: undefined;
    PositiveReprogramming: undefined;
    Effort: undefined;
    ShadowWork: undefined;
    NonReactivity: undefined;
    Relaxing: undefined;
    Knowledge: undefined;
    Addiction: undefined;
    LossAndAbandonment: { initialTab?: string } | undefined;
    MeditationGenerator: undefined;
    Profile: undefined;
    LevelRoom: { levelId: string };
    RoomOfLevels: undefined;
    RoomOfLevels3D: undefined;
    AnimationShowcase: undefined;
};

export type MainTabParamList = {
    Home: undefined;
    Journey: undefined;
    Explore: undefined;
    Journal: undefined;
};
