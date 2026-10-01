import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { StatsModal } from "../components/modals/StatsModal";
import { SettingsModal } from "../components/modals/SettingsModal";
import { ConfirmModal } from "../components/modals/ConfirmModal";
import { GraphResultsModal } from "../components/modals/GraphResultsModal";
import { NameInputModal } from "../components/modals/NameInputModal";
import { GameDetailModal } from "../components/modals/GameDetailModal";

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
  
  // Modal states
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showGraphResults, setShowGraphResults] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [showGameDetail, setShowGameDetail] = useState(false);
  
  // Filter states
  const [statsFilterMode, setStatsFilterMode] = useState<string>("all");
  const [statsFilterDuration, setStatsFilterDuration] = useState<number | "all">("all");
  
  // Player states
  const [playerName, setPlayerName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(profileIcons[0]);
  const [selectedGame, setSelectedGame] = useState<TestResult | null>(null);
  const [pendingResult, setPendingResult] = useState<Omit<TestResult, "playerName" | "profileIcon"> | null>(null);
  
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
    const milestone = milestones.find(m => newCombo === m);
    if (milestone) {
      setComboMilestone(milestone);
      playSound(1200, 0.3, "sine");
      setTimeout(() => setComboMilestone(null), 2000);
    }
  };

  // Calculate current stats
  const accuracy = metrics.totalKeystrokes === 0 
    ? 100 
    : Math.round((metrics.correctChars / metrics.totalKeystrokes) * 100);

  const rawWpm = elapsedTime === 0 
    ? 0 
    : Math.round((metrics.totalKeystrokes / 5) / (elapsedTime / 60));

  const wpm = elapsedTime === 0 
    ? 0 
    : Math.round(((metrics.totalKeystrokes / 5) - (metrics.incorrectChars / 5)) / (elapsedTime / 60));

  const bestWpm = testHistory.length > 0 ? Math.max(...testHistory.map((t) => t.wpm)) : 0;

  // Test control functions
  const startTest = () => {
    setTargetText(getRandomTextForMode(mode, difficulty));
    setUserInput("");
    setTimeLeft(selectedDuration);
    setIsFinished(false);
    setIsStarted(true);
    setElapsedTime(0);
    setShowStats(false);
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
    setUserInput("");
    setTimeLeft(selectedDuration);
    setIsFinished(false);
    setIsStarted(false);
    setElapsedTime(0);
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
  };

  const handleDurationSelect = (duration: number) => {
    setSelectedDuration(duration);
    setTimeLeft(duration);
  };

  // Input handling
  const handleInputChange = (value: string) => {
    const prevLength = userInput.length;
    const newLength = value.length;

    setMetrics(prev => ({
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
        setMetrics(prev => ({
          ...prev,
          correctChars: prev.correctChars + 1,
        }));
        playSound(400 + Math.min(newCombo * 10, 400), 0.03, "square");
      } else {
        setCombo(0);
        setMetrics(prev => ({
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

  const handleClearStats = () => {
    setTestHistory([]);
    playSound(300, 0.2, "sawtooth");
    setShowClearConfirm(false);
    setShowSettings(false);
  };

  // Initialize target text
  useEffect(() => {
    if (!targetText) {
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
        
        setMetrics(currentMetrics => {
          const currentWpm = newTime === 0 
            ? 0 
            : Math.round(((currentMetrics.totalKeystrokes / 5) - (currentMetrics.incorrectChars / 5)) / (newTime / 60));
          
          setWpmHistory(prev => [...prev, { time: newTime, wpm: currentWpm }]);
          
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
  }, [isStarted, isFinished]);

  // Test finish effect
  useEffect(() => {
    if (isFinished && elapsedTime > 0 && !showGraphResults && !showNameInput) {
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
      setPendingResult(result);
      setShowGraphResults(true);
    }
  }, [isFinished]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showClearConfirm) {
          setShowClearConfirm(false);
        } else if (showGraphResults) {
          skipSave();
        } else if (showNameInput) {
          skipSave();
        } else if (showStats || showSettings) {
          setShowStats(false);
          setShowSettings(false);
        }
      } else if (e.key === 'Enter') {
        if (showGraphResults) {
          continueToNameInput();
        } else if (showNameInput && playerName.trim()) {
          saveResult();
        } else if (!isStarted && !isFinished && !showStats && !showSettings && !showClearConfirm && !showNameInput && !showGraphResults) {
          startTest();
        } else if (isFinished && !showGraphResults && !showNameInput) {
          startTest();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showStats, showSettings, showClearConfirm, showNameInput, showGraphResults, playerName, isStarted, isFinished, selectedDuration]);

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
      
      {comboMilestone && (
        <MilestoneAnimation milestone={comboMilestone} color={getComboColor(comboMilestone)} />
      )}
      
      <Navbar 
        onShowStats={() => setShowStats(!showStats)}
        onShowSettings={() => setShowSettings(!showSettings)}
      />

      <main className="main">
        {showStats && (
          <StatsModal
            testHistory={testHistory}
            statsFilterMode={statsFilterMode}
            statsFilterDuration={statsFilterDuration}
            onClose={() => setShowStats(false)}
            onFilterModeChange={setStatsFilterMode}
            onFilterDurationChange={setStatsFilterDuration}
            onGameClick={(game) => {
              setSelectedGame(game);
              setShowGameDetail(true);
            }}
          />
        )}

        {showGameDetail && selectedGame && (
          <GameDetailModal
            game={selectedGame}
            onClose={() => setShowGameDetail(false)}
          />
        )}

        {showSettings && (
          <SettingsModal
            mode={mode}
            difficulty={difficulty}
            soundEnabled={soundEnabled}
            onClose={() => setShowSettings(false)}
            onModeChange={handleModeChange}
            onDifficultyChange={handleDifficultyChange}
            onSoundToggle={setSoundEnabled}
            onClearStats={() => setShowClearConfirm(true)}
            playSound={playSound}
          />
        )}

        {showClearConfirm && (
          <ConfirmModal
            title="CONFIRM ACTION"
            message="Clear all saved statistics? This action cannot be undone."
            confirmText="CLEAR DATA"
            cancelText="CANCEL"
            onConfirm={handleClearStats}
            onCancel={() => setShowClearConfirm(false)}
            isDanger={true}
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

        <section className="game-area">
          <DurationSelector
            selectedDuration={selectedDuration}
            isStarted={isStarted}
            isFinished={isFinished}
            onSelectDuration={handleDurationSelect}
          />

          <HUD
            timeLeft={timeLeft}
            wpm={wpm}
            accuracy={accuracy}
            errors={metrics.incorrectChars}
          />

          <TypingArea
            isStarted={isStarted}
            isFinished={isFinished}
            targetText={targetText}
            userInput={userInput}
            visibleStartIndex={visibleStartIndex}
            onInputChange={handleInputChange}
            maxCombo={maxCombo}
            wpm={wpm}
            accuracy={accuracy}
            errors={metrics.incorrectChars}
            elapsedTime={elapsedTime}
            bestWpm={bestWpm}
          />

          <div className="control-panel">
            <button
              className={`game-btn primary ${isStarted && !isFinished ? "disabled" : ""}`}
              onClick={isFinished || !isStarted ? startTest : undefined}
              disabled={isStarted && !isFinished}
            >
              <span className="btn-text">
                {isFinished ? "RACE AGAIN" : isStarted ? "RACING..." : "START RACE"}
              </span>
              <span className="btn-glow"></span>
            </button>
            {isStarted && !isFinished && (
              <button className="game-btn secondary" onClick={resetTest}>
                <span className="btn-text">RESTART</span>
                <span className="btn-glow"></span>
              </button>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-text">
          <Link to="/terms" className="footer-link">Terms</Link>
          <span className="footer-separator">|</span>
          <Link to="/privacy" className="footer-link">Privacy</Link>
        </div>
        <div className="footer-version">v1.0.0</div>
      </footer>
    </div>
  );
};
