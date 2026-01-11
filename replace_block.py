from pathlib import Path

path = Path(r"src/screens/JourneyMapScreen.tsx")
lines = path.read_text().splitlines()
start_idx = lines.index("  const renderLevelCard = (level: ConsciousnessLevel, index: number) => {")
end_idx = start_idx
while end_idx < len(lines):
    if lines[end_idx] == "  };" and end_idx + 2 < len(lines) and lines[end_idx + 1] == "" and lines[end_idx + 2].startswith("  const renderCategorySection"):
        break
    end_idx += 1
new_block = """  const renderLevelCard = (level: ConsciousnessLevel, index: number) => {
    const isExplored = progress?.exploredLevels.includes(level.id) ?? false;
    const isCurrent = progress?.currentLevel === level.id;
    const isCourage = level.isThreshold;

    const journeyEntry = progress?.journeyPath.find(
      (entry) => entry.levelId === level.id
    );
    const completedCount = journeyEntry?.practicesCompleted ?? 0;
    const baseGradient = level.gradient
      ? level.gradient
      : ([
          adjustColor(level.color, 18),
          adjustColor(level.color, -10),
        ] as const);
    const darkGradient = level.gradientDark ? level.gradientDark : baseGradient;
    const gradientColors =
      theme.mode === 'dark' ? darkGradient : baseGradient;
    const glowBase = level.glowDark ?? gradientColors[0];
    const glowTint =
      theme.mode === 'dark' ? glowBase : adjustColor(gradientColors[0], -12);

    return (
      <LuminousLevelCard
        key={level.id}
        level={level}
        index={index}
        cardWidth={cardWidth}
        theme={theme}
        styles={styles}
        gradientColors={gradientColors}
        glowBase={glowBase}
        glowTint={glowTint}
        floatTranslate={floatTranslate}
        canBlur={canBlur}
        isCurrent={isCurrent}
        isCourage={isCourage}
        isExplored={isExplored}
        completedCount={completedCount}
        onCardPress={() => handleLevelPress(level)}
        onMeditationsPress={() => openChapter(level, 'meditations')}
        onArticlesPress={() => openChapter(level, 'articles')}
        onOverviewPress={() => openChapter(level, 'overview')}
      />
    );
  };"""
lines[start_idx:end_idx+1] = new_block.splitlines()
path.write_text("\n".join(lines) + "\n")
