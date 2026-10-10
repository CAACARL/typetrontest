import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { TestResult, TypeMetrics, WpmDataPoint } from "../types";
import { generateText } from "../utils/textGeneration";
import { generateCode } from "../utils/codeGeneration";
import { useAudio } from "../hooks/useAudio";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Navbar } from "../components/Navbar";
import { HUD } from "../components/HUD";
import { DurationSelector } from "../components/DurationSelector";
import { TypingArea } from "../components/TypingArea";
import { MilestoneAnimation } from "../components/MilestoneAnimation";
import { MatrixWaterfall } from "../components/MatrixWaterfall";
import { SettingsModal } from "../components/modals/SettingsModal";
import { GraphResultsModal } from "../components/modals/GraphResultsModal";
import { NameInputModal } from "../components/modals/NameInputModal";
import { ConfirmModal } from "../components/modals/ConfirmModal";
import { TermsModal } from "../components/modals/TermsModal";
import { PrivacyModal } from "../components/modals/PrivacyModal";

const profileIcons = ["👤", "🎮", "⚡", "🔥", "💎", "🌟", "🚀", "🎯", "👾", "🤖", "🦾", "💀"];

export const HomePage = () => {
  // Core state
  const [targetText, setTargetText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isFinished, setIsFinished] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isQuitting, setIsQuitting] = useState(false);
  const [hasWarped, setHasWarped] = useState(false);

  // Modal states
  const [showSettings, setShowSettings] = useState(false);
  const [showGraphResults, setShowGraphResults] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  const navigate = useNavigate();

  // Player states
  const [playerName, setPlayerName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(profileIcons[0]);
  const [pendingResult, setPendingResult] = useState<Omit<
    TestResult,
    "playerName" | "profileIcon"
  > | null>(null);

  // Settings with localStorage
  const [testHistory, setTestHistory] = useLocalStorage<TestResult[]>("typingTestHistory", []);
  const [difficulty, setDifficulty] = useLocalStorage("difficulty", "medium");
  const [mode, setMode] = useLocalStorage("mode", "javascript");
  const [soundEnabled, setSoundEnabled] = useLocalStorage("soundEnabled", true);

  // Typing metrics
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [comboMilestone, setComboMilestone] = useState<number | null>(null);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [metrics, setMetrics] = useState<TypeMetrics>({
    correctChars: 0,
    incorrectChars: 0,
    totalKeystrokes: 0,
  });
  const [wpmHistory, setWpmHistory] = useState<WpmDataPoint[]>([]);
  const [isNewRecord, setIsNewRecord] = useState(false);

  // Audio hook
  const { playSound } = useAudio(soundEnabled);

  // Helper functions
  const getRandomTextForMode = (m: string, d: string) => {
    return m === "text" ? generateText(d, 200) : generateCode(m, 15);
  };

  const getComboColor = (combo: number) => {
    if (combo >= 100) return "#ffd700";
    if (combo >= 80) return "#ff1493";
    if (combo >= 60) return "#ff4500";
    if (combo >= 40) return "#9370db";
    if (combo >= 20) return "#8b008b";
    if (combo >= 10) return "#00d4ff";
    return "#ffffff";
  };

  const checkComboMilestone = (newCombo: number) => {
    const milestones = [10, 20, 40, 60, 80, 100];
    const milestone = milestones.find((m) => newCombo === m);
    if (milestone) {
      setComboMilestone(milestone);
      playSound(1200, 0.3, "sine");
      setTimeout(() => setComboMilestone(null), 2000);
    }
  };

  // Calculate current stats
  const accuracy =
    metrics.totalKeystrokes === 0
      ? 100
      : Math.round((metrics.correctChars / metrics.totalKeystrokes) * 100);

  const rawWpm =
    elapsedTime === 0 ? 0 : Math.round(metrics.totalKeystrokes / 5 / (elapsedTime / 60));

  const wpm =
    elapsedTime === 0
      ? 0
      : Math.round((metrics.totalKeystrokes / 5 - metrics.incorrectChars / 5) / (elapsedTime / 60));

  const bestWpm = testHistory.length > 0 ? Math.max(...testHistory.map((t) => t.wpm)) : 0;

  // Test control functions
  const startTest = () => {
    setTargetText(getRandomTextForMode(mode, difficulty));
    setUserInput("");
    setTimeLeft(selectedDuration);
    setIsFinished(false);
    setIsGlitching(true);
    setTimeout(() => {
      setIsStarted(true);
    }, 600);
    setTimeout(() => {
      setIsGlitching(false); // Turn off glitching after animation
    }, 1200);
    setTimeout(() => {
      setHasWarped(true);
    }, 1500); // After warp animations complete
    setElapsedTime(0);
    setShowSettings(false);
    setCombo(0);
    setMaxCombo(0);
    setVisibleStartIndex(0);
    setWpmHistory([]);
    setShowGraphResults(false);
    setMetrics({
      correctChars: 0,
      incorrectChars: 0,
      totalKeystrokes: 0,
    });
    playSound(600, 0.1, "square");
  };

  const resetTest = () => {
    const newText = getRandomTextForMode(mode, difficulty);
    setTargetText(newText);
    setUserInput("");
    setTimeLeft(selectedDuration);
    setIsFinished(false);
    setIsStarted(true);
    setElapsedTime(0);
    setCombo(0);
    setMaxCombo(0);
    setVisibleStartIndex(0);
    setWpmHistory([]);
    setShowGraphResults(false);
    setIsNewRecord(false);
    setMetrics({
      correctChars: 0,
      incorrectChars: 0,
      totalKeystrokes: 0,
    });
    playSound(400, 0.15, "square");
  };
  const quitTest = () => {
    setIsQuitting(true);
    playSound(200, 0.3, "sawtooth");
    setTimeout(() => {
      setUserInput("");
      setTimeLeft(selectedDuration);
      setIsFinished(false);
      setIsStarted(false);
      setIsGlitching(false);
      setIsQuitting(false);
      setHasWarped(false);
      setElapsedTime(0);
      setCombo(0);
      setMaxCombo(0);
      setVisibleStartIndex(0);
      setWpmHistory([]);
      setShowGraphResults(false);
      setIsNewRecord(false);
      setMetrics({
        correctChars: 0,
        incorrectChars: 0,
        totalKeystrokes: 0,
      });
    }, 1200);
  };

  const handleNavigateWithQuit = (destination: string) => {
    if (isStarted && !isFinished) {
      setPendingNavigation(destination);
      setShowQuitConfirm(true);
    } else {
      if (destination === "settings") {
        setShowSettings(true);
      } else if (destination === "terms") {
        setShowTerms(true);
      } else if (destination === "privacy") {
        setShowPrivacy(true);
      } else {
        navigate(destination);
      }
    }
  };

  const confirmQuit = () => {
    setShowQuitConfirm(false);
    setIsQuitting(true);
    playSound(200, 0.3, "sawtooth");

    setTimeout(() => {
      setUserInput("");
      setTimeLeft(selectedDuration);
      setIsFinished(false);
      setIsStarted(false);
      setIsGlitching(false);
      setIsQuitting(false);
      setHasWarped(false);
      setElapsedTime(0);
      setCombo(0);
      setMaxCombo(0);
      setVisibleStartIndex(0);
      setWpmHistory([]);
      setMetrics({
        correctChars: 0,
        incorrectChars: 0,
        totalKeystrokes: 0,
      });

      if (pendingNavigation === "settings") {
        setShowSettings(true);
      } else if (pendingNavigation === "terms") {
        setShowTerms(true);
      } else if (pendingNavigation === "privacy") {
        setShowPrivacy(true);
      } else if (pendingNavigation) {
        navigate(pendingNavigation);
      }
      setPendingNavigation(null);
    }, 1200);
  };

  const cancelQuit = () => {
    setShowQuitConfirm(false);
    setPendingNavigation(null);
  };

  const handleDurationSelect = (duration: number) => {
    setSelectedDuration(duration);
    setTimeLeft(duration);
  };

  // Input handling
  const handleInputChange = (value: string) => {
    const prevLength = userInput.length;
    const newLength = value.length;

    setMetrics((prev) => ({
      ...prev,
      totalKeystrokes: prev.totalKeystrokes + 1,
    }));

    if (newLength > prevLength) {
      const lastChar = value[newLength - 1];
      const expectedChar = targetText[newLength - 1];

      if (lastChar === expectedChar) {
        const newCombo = combo + 1;
        setCombo(newCombo);
        if (newCombo > maxCombo) {
          setMaxCombo(newCombo);
        }
        checkComboMilestone(newCombo);
        setMetrics((prev) => ({
          ...prev,
          correctChars: prev.correctChars + 1,
        }));
        playSound(400 + Math.min(newCombo * 10, 400), 0.03, "square");
      } else {
        setCombo(0);
        setMetrics((prev) => ({
          ...prev,
          incorrectChars: prev.incorrectChars + 1,
        }));
        playSound(150, 0.08, "sawtooth");
      }
    }

    setUserInput(value);

    if (value === targetText) {
      setIsStarted(false);
      setIsFinished(true);
      playSound(800, 0.4, "triangle");
    }
  };

  // Result handling
  const saveResult = () => {
    if (pendingResult && playerName.trim()) {
      const result: TestResult = {
        ...pendingResult,
        playerName: playerName.trim(),
        profileIcon: selectedIcon,
      };
      const newHistory = [result, ...testHistory].slice(0, 20);
      setTestHistory(newHistory);
      setShowNameInput(false);
      setShowGraphResults(false);
      setPlayerName("");
      setPendingResult(null);
    }
  };

  const skipSave = () => {
    setShowNameInput(false);
    setShowGraphResults(false);
    setPlayerName("");
    setPendingResult(null);
  };

  const continueToNameInput = () => {
    setShowGraphResults(false);
    setShowNameInput(true);
  };

  // Settings handlers
  const handleModeChange = (newMode: string) => {
    setMode(newMode);
    if (!isStarted) {
      setTargetText(getRandomTextForMode(newMode, difficulty));
    }
  };

  const handleDifficultyChange = (newDifficulty: string) => {
    setDifficulty(newDifficulty);
    if (!isStarted) {
      setTargetText(getRandomTextForMode(mode, newDifficulty));
    }
  };

  // Initialize target text
  useEffect(() => {
    if (!targetText) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTargetText(getRandomTextForMode(mode, difficulty));
    }
  }, [targetText, mode, difficulty]);

  // Timer effect
  useEffect(() => {
    if (!isStarted || isFinished) {
      return;
    }

    const timer = setInterval(() => {
      setElapsedTime((previousTime) => {
        const newTime = previousTime + 1;

        setMetrics((currentMetrics) => {
          const currentWpm =
            newTime === 0
              ? 0
              : Math.round(
                  (currentMetrics.totalKeystrokes / 5 - currentMetrics.incorrectChars / 5) /
                    (newTime / 60),
                );

          setWpmHistory((prev) => [...prev, { time: newTime, wpm: currentWpm }]);

          return currentMetrics;
        });

        return newTime;
      });

      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          clearInterval(timer);
          setIsStarted(false);
          setIsFinished(true);
          playSound(800, 0.4, "triangle");
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStarted, isFinished]);

  // Test finish effect
  useEffect(() => {
    if (isFinished && elapsedTime > 0 && !showGraphResults && !showNameInput) {
      const isRecord = wpm > bestWpm && bestWpm > 0;
      setIsNewRecord(isRecord);
      
      const result = {
        wpm,
        rawWpm,
        accuracy,
        errors: metrics.incorrectChars,
        duration: elapsedTime,
        date: new Date().toISOString(),
        mode,
        selectedDuration,
        wpmHistory: [...wpmHistory],
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPendingResult(result);
      setShowGraphResults(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showGraphResults) {
          skipSave();
        } else if (showNameInput) {
          skipSave();
        } else if (showSettings) {
          setShowSettings(false);
        }
      } else if (e.key === "Enter") {
        if (showGraphResults) {
          continueToNameInput();
        } else if (showNameInput && playerName.trim()) {
          saveResult();
        } else if (
          !isStarted &&
          !isFinished &&
          !showSettings &&
          !showNameInput &&
          !showGraphResults
        ) {
          startTest();
        } else if (isFinished && !showGraphResults && !showNameInput) {
          startTest();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    showSettings,
    showNameInput,
    showGraphResults,
    playerName,
    isStarted,
    isFinished,
    selectedDuration,
  ]);

  // Scroll visible text
  const charsPerLine = 60;
  const currentPosition = userInput.length;
  const currentLine = Math.floor(currentPosition / charsPerLine);

  if (currentLine > 1 && visibleStartIndex < currentLine - 1) {
    setVisibleStartIndex(currentLine - 1);
  }

  return (
    <div className="app">
      <div className="scanlines"></div>
      <div className="grid-bg"></div>

      {((!isStarted && !isFinished) || isGlitching) && (
        <>
          <MatrixWaterfall key="left-waterfall" side="left" isDisappearing={isGlitching} />
          <MatrixWaterfall key="right-waterfall" side="right" isDisappearing={isGlitching} />
        </>
      )}

      {comboMilestone && (
        <MilestoneAnimation milestone={comboMilestone} color={getComboColor(comboMilestone)} />
      )}

      <Navbar
        onShowSettings={() => handleNavigateWithQuit("settings")}
        onNavigateStats={() => handleNavigateWithQuit("/stats")}
        isGameActive={isStarted && !isFinished}
      />

      {isQuitting && <div className="red-static-overlay"></div>}

      <main className="main">
        <section className="game-area">
          {!isGlitching && !isStarted && !isFinished && (
            <DurationSelector
              selectedDuration={selectedDuration}
              isStarted={isStarted}
              isFinished={isFinished}
              onSelectDuration={handleDurationSelect}
            />
          )}

          {isGlitching && (
            <div className="glitch-disappear">
              <DurationSelector
                selectedDuration={selectedDuration}
                isStarted={false}
                isFinished={isFinished}
                onSelectDuration={handleDurationSelect}
              />
            </div>
          )}

          {(isStarted || isFinished) && !isQuitting && (
            <div className={!hasWarped ? "warp-in" : ""}>
              <HUD
                timeLeft={timeLeft}
                wpm={wpm}
                accuracy={accuracy}
                errors={metrics.incorrectChars}
                isFinished={isFinished}
                bestWpm={bestWpm}
                isNewRecord={isNewRecord}
              />
            </div>
          )}

          {!isGlitching && !isStarted && !isFinished && (
            <div className="ready-screen-standalone">
              <div className="ready-text">READY TO HIT THE GRID?</div>
              <div className="ready-subtitle">CLICK START OR HIT THE ENTER KEY TO BEGIN</div>
              <button className="game-btn primary start-btn-inline" onClick={startTest}>
                <span className="btn-text">START</span>
                <span className="btn-glow"></span>
              </button>
            </div>
          )}

          {isGlitching && (
            <div className="ready-screen-standalone glitch-disappear">
              <div className="ready-text">READY TO HIT THE GRID?</div>
              <div className="ready-subtitle">CLICK START OR HIT THE ENTER KEY TO BEGIN</div>
              <button className="game-btn primary start-btn-inline">
                <span className="btn-text">START</span>
                <span className="btn-glow"></span>
              </button>
            </div>
          )}

          {isStarted && !isFinished && !isQuitting && (
            <div className={!hasWarped ? "warp-in-delayed" : ""}>
              <TypingArea
                isStarted={isStarted}
                isFinished={isFinished}
                targetText={targetText}
                userInput={userInput}
                visibleStartIndex={visibleStartIndex}
                onInputChange={handleInputChange}
              />
            </div>
          )}

          {(isStarted || isFinished) && !isQuitting && (
            <div className="typing-controls">
              <button className="game-btn secondary" onClick={resetTest}>
                <span className="btn-text">RESTART</span>
                <span className="btn-glow"></span>
              </button>
              <button className="game-btn danger" onClick={quitTest}>
                <span className="btn-text">QUIT</span>
                <span className="btn-glow"></span>
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <div className="footer-text">
          <button
            className="footer-link"
            onClick={() => handleNavigateWithQuit("terms")}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            Terms
          </button>
          <span className="footer-separator">|</span>
          <button
            className="footer-link"
            onClick={() => handleNavigateWithQuit("privacy")}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            Privacy
          </button>
        </div>
        <div className="footer-version">v1.0.0</div>
      </footer>

      {showSettings && (
        <SettingsModal
          mode={mode}
          difficulty={difficulty}
          soundEnabled={soundEnabled}
          onClose={() => setShowSettings(false)}
          onModeChange={handleModeChange}
          onDifficultyChange={handleDifficultyChange}
          onSoundToggle={setSoundEnabled}
          playSound={playSound}
        />
      )}

      {showGraphResults && pendingResult && (
        <GraphResultsModal
          pendingResult={pendingResult}
          wpmHistory={wpmHistory}
          maxCombo={maxCombo}
          elapsedTime={elapsedTime}
          onContinue={continueToNameInput}
          onSkip={skipSave}
        />
      )}

      {showNameInput && (
        <NameInputModal
          playerName={playerName}
          selectedIcon={selectedIcon}
          onNameChange={setPlayerName}
          onIconSelect={setSelectedIcon}
          onSave={saveResult}
          onSkip={skipSave}
          canSave={playerName.trim().length > 0}
        />
      )}

      {showQuitConfirm && (
        <ConfirmModal
          title="QUIT CURRENT TEST?"
          message="You are currently in an active typing test. Quitting will discard your progress. Are you sure you want to quit?"
          confirmText="QUIT"
          cancelText="CONTINUE TYPING"
          onConfirm={confirmQuit}
          onCancel={cancelQuit}
          isDanger={true}
        />
      )}

      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
    </div>
  );
};
