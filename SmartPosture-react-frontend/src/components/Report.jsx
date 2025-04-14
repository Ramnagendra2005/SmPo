import { useState, useEffect, useRef } from 'react';

export default function Report() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [graphsVisible, setGraphsVisible] = useState({});
  const [graphLoadStates, setGraphLoadStates] = useState({
    postureOverTime: { loading: true, error: false },
    postureComponents: { loading: true, error: false },
    blinkRate: { loading: true, error: false },
    sessionComparison: { loading: true, error: false }
  });

  // Cache buster and refs 
  const cacheBuster = useRef(Date.now());
  const graphRefs = {
    postureOverTime: useRef(),
    postureComponents: useRef(),
    blinkRate: useRef(),
    sessionComparison: useRef()
  };

  // Fetch report data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/report/data?t=${cacheBuster.current}`);
        const data = await response.json();
        setReportData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching report data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Intersection Observer setup
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setGraphsVisible(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    Object.entries(graphRefs).forEach(([key, ref]) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [loading]);

  // Image load handlers
  const handleImageLoad = (graphName) => {
    setGraphLoadStates(prev => ({
      ...prev,
      [graphName]: { ...prev[graphName], loading: false }
    }));
  };

  const handleImageError = (graphName) => {
    setGraphLoadStates(prev => ({
      ...prev,
      [graphName]: { loading: false, error: true }
    }));
  };

  // Score ring component
  const ScoreRing = ({ score, size = 180, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    
    let color = '#ef4444';
    if (score >= 80) color = '#10b981';
    else if (score >= 60) color = '#f59e0b';
    
    return (
      <div className="relative flex flex-col items-center justify-center">
        <svg height={size} width={size} className="progress-ring">
          <circle
            className="text-gray-700"
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className="progress-ring__circle"
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{ "--offset": strokeDashoffset }}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-bold">{score}</span>
          <span className="text-sm text-gray-400">out of 100</span>
        </div>
      </div>
    );
  };

  // Stat card component
  const StatCard = ({ icon, title, value, trend }) => {
    let trendColor = "text-gray-400";
    let trendIcon = "→";
    
    if (trend === "improving") {
      trendColor = "text-green-500";
      trendIcon = "↑";
    } else if (trend === "declining") {
      trendColor = "text-red-500";
      trendIcon = "↓";
    }
    
    return (
      <div className="bg-gray-800 rounded-xl p-4 flex flex-col stats-container">
        <div className="flex items-center mb-2">
          <div className="text-indigo-400 mr-2">{icon}</div>
          <h3 className="text-gray-300 text-sm">{title}</h3>
        </div>
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold">{value}</div>
          {trend && (
            <div className={`${trendColor} text-sm font-medium`}>
              {trendIcon}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Component score component
  const ComponentScore = ({ title, score, icon }) => {
    let color = 'bg-red-500';
    if (score >= 80) color = 'bg-green-500';
    else if (score >= 60) color = 'bg-yellow-500';
    
    return (
      <div className="flex flex-col items-center text-center">
        <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center mb-2`}>
          {icon}
        </div>
        <div className="text-sm font-medium mb-1">{title}</div>
        <div className="text-lg font-bold">{score}</div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-500 border-t-indigo-500 mb-4"></div>
          <p className="text-gray-400">Loading your posture report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white" style={{marginTop:"100px"}}>
      {/* Header */}
      <header className="py-6 px-8 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Posture Report</h1>
          <p className="text-gray-400">An analysis of your posture health</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Section */}
        <section className="mb-12 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-xl p-6 flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-4">Overall Posture Score</h2>
              <ScoreRing score={reportData?.currentScore || 0} />
              <p className="mt-4 text-center text-gray-400">
                {reportData?.scoreTrend === "improving" && "Your posture is improving! Keep up the good work."}
                {reportData?.scoreTrend === "declining" && "Your posture has been declining. Try to be more mindful."}
                {reportData?.scoreTrend === "stable" && "Your posture has been stable recently."}
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Today's Summary</h2>
              <div className="grid grid-cols-2 gap-4">
                <StatCard 
                  icon="⏱️" 
                  title="Time Tracked" 
                  value={`${reportData?.timeTracked || 0} hrs`} 
                />
                <StatCard 
                  icon="🔄" 
                  title="Total Sessions" 
                  value={reportData?.totalSessions || 0} 
                />
                <StatCard 
                  icon="⚠️" 
                  title="Corrections" 
                  value={reportData?.totalCorrections || 0} 
                  trend={reportData?.scoreTrend} 
                />
                <StatCard 
                  icon="☕" 
                  title="Breaks Taken" 
                  value={reportData?.totalBreaks || 0} 
                />
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Component Analysis</h2>
              <div className="grid grid-cols-3 gap-3">
                <ComponentScore 
                  title="Head" 
                  score={reportData?.headTiltScore || 0} 
                  icon="🧠" 
                />
                <ComponentScore 
                  title="Shoulders" 
                  score={reportData?.shoulderAlignmentScore || 0} 
                  icon="💪" 
                />
                <ComponentScore 
                  title="Spine" 
                  score={reportData?.spinalPostureScore || 0} 
                  icon="🦴" 
                />
                <ComponentScore 
                  title="Hips" 
                  score={reportData?.hipBalanceScore || 0} 
                  icon="🦯" 
                />
                <ComponentScore 
                  title="Legs" 
                  score={reportData?.legPositionScore || 0} 
                  icon="🦵" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-bold mb-6">Weekly Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Your Average Score</h3>
              <div className="flex items-center">
                <div className="text-4xl font-bold mr-4">{reportData?.averageScore || 0}</div>
                <div className="text-sm text-gray-400">
                  {reportData?.averageScore > 80 ? 
                    "Great job maintaining excellent posture!" : 
                    "There's room for improvement in your posture habits."}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Weekly Progress</h3>
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <div className="mb-1">Sessions: <span className="font-medium">{reportData?.totalSessions || 0}</span></div>
                  <div className="mb-1">Time Tracked: <span className="font-medium">{reportData?.timeTracked || 0} hrs</span></div>
                  <div>Corrections: <span className="font-medium">{reportData?.totalCorrections || 0}</span></div>
                </div>
                <div className="text-5xl font-light text-indigo-400">
                  {reportData?.scoreTrend === "improving" ? "↗" : reportData?.scoreTrend === "declining" ? "↘" : "→"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Graphs Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Detailed Analysis</h2>
          
          {/* Posture Over Time Graph */}
          <div 
            id="postureOverTime"
            ref={graphRefs.postureOverTime}
            className={`mb-10 bg-gray-800 rounded-xl p-6 graph-container ${graphsVisible.postureOverTime ? 'graph-visible' : ''}`}
          >
            <h3 className="text-xl font-semibold mb-4">Posture Score Trend</h3>
            <div className="relative rounded-lg overflow-hidden h-64 bg-gray-700">
              {graphLoadStates.postureOverTime.loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-500 border-t-indigo-500"></div>
                </div>
              )}
              {graphLoadStates.postureOverTime.error ? (
                <div className="absolute inset-0 flex items-center justify-center text-red-500 p-4 text-center">
                  Failed to load graph. Please try refreshing.
                </div>
              ) : (
                <img 
                  src={`http://localhost:5000/graph/posture_over_time?t=${cacheBuster.current}`}
                  alt="Posture Score Over Time"
                  className="w-full h-full object-contain"
                  onLoad={() => handleImageLoad('postureOverTime')}
                  onError={() => handleImageError('postureOverTime')}
                />
              )}
            </div>
            <p className="mt-4 text-sm text-gray-400">
              Your posture score has been {reportData?.scoreTrend} over the last week.
            </p>
          </div>

          {/* Posture Components Radar Chart */}
          <div 
            id="postureComponents"
            ref={graphRefs.postureComponents}
            className={`mb-10 bg-gray-800 rounded-xl p-6 graph-container ${graphsVisible.postureComponents ? 'graph-visible' : ''}`}
            style={{ transitionDelay: '0.2s' }}
          >
            <h3 className="text-xl font-semibold mb-4">Posture Component Analysis</h3>
            <div className="relative rounded-lg overflow-hidden h-80 bg-gray-700">
              {graphLoadStates.postureComponents.loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-500 border-t-indigo-500"></div>
                </div>
              )}
              {graphLoadStates.postureComponents.error ? (
                <div className="absolute inset-0 flex items-center justify-center text-red-500 p-4 text-center">
                  Failed to load graph. Please try refreshing.
                </div>
              ) : (
                <img 
                  src={`http://localhost:5000/graph/posture_components?t=${cacheBuster.current}`}
                  alt="Posture Components"
                  className="w-full h-full object-contain"
                  onLoad={() => handleImageLoad('postureComponents')}
                  onError={() => handleImageError('postureComponents')}
                />
              )}
            </div>
            <p className="mt-4 text-sm text-gray-400">
              Comparison of posture components between today and yesterday.
            </p>
          </div>

          {/* Blink Rate Graph */}
          <div 
            id="blinkRate"
            ref={graphRefs.blinkRate}
            className={`mb-10 bg-gray-800 rounded-xl p-6 graph-container ${graphsVisible.blinkRate ? 'graph-visible' : ''}`}
            style={{ transitionDelay: '0.4s' }}
          >
            <h3 className="text-xl font-semibold mb-4">Blink Rate Analysis</h3>
            <div className="relative rounded-lg overflow-hidden h-64 bg-gray-700">
              {graphLoadStates.blinkRate.loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-500 border-t-indigo-500"></div>
                </div>
              )}
              {graphLoadStates.blinkRate.error ? (
                <div className="absolute inset-0 flex items-center justify-center text-red-500 p-4 text-center">
                  Failed to load graph. Please try refreshing.
                </div>
              ) : (
                <img 
                  src={`http://localhost:5000/graph/blink_rate?t=${cacheBuster.current}`}
                  alt="Blink Rate Chart"
                  className="w-full h-full object-contain"
                  onLoad={() => handleImageLoad('blinkRate')}
                  onError={() => handleImageError('blinkRate')}
                />
              )}
            </div>
            <p className="mt-4 text-sm text-gray-400">
              Your blink rate throughout the day compared to the recommended rate of 15 blinks per minute.
            </p>
          </div>

          {/* Session Comparison Graph */}
          <div 
            id="sessionComparison"
            ref={graphRefs.sessionComparison}
            className={`mb-10 bg-gray-800 rounded-xl p-6 graph-container ${graphsVisible.sessionComparison ? 'graph-visible' : ''}`}
            style={{ transitionDelay: '0.6s' }}
          >
            <h3 className="text-xl font-semibold mb-4">Session Comparison</h3>
            <div className="relative rounded-lg overflow-hidden h-64 bg-gray-700">
              {graphLoadStates.sessionComparison.loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-500 border-t-indigo-500"></div>
                </div>
              )}
              {graphLoadStates.sessionComparison.error ? (
                <div className="absolute inset-0 flex items-center justify-center text-red-500 p-4 text-center">
                  Failed to load graph. Please try refreshing.
                </div>
              ) : (
                <img 
                  src={`http://localhost:5000/graph/session_comparison?t=${cacheBuster.current}`}
                  alt="Session Comparison Chart"
                  className="w-full h-full object-contain"
                  onLoad={() => handleImageLoad('sessionComparison')}
                  onError={() => handleImageError('sessionComparison')}
                />
              )}
            </div>
            <p className="mt-4 text-sm text-gray-400">
              Comparison of posture scores and correction count across your recent sessions.
            </p>
          </div>
        </section>

        {/* Recommendations Section */}
        <section className="mb-12 animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <h2 className="text-2xl font-bold mb-6">Recommendations</h2>
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Improve Your Posture</h3>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                <li>Take regular breaks - stand up every 30 minutes</li>
                <li>Position your monitor at eye level to avoid neck strain</li>
                <li>Keep your shoulders relaxed and pulled back slightly</li>
                <li>Use a chair with proper lumbar support</li>
                <li>Practice core-strengthening exercises to support your spine</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Eye Health Recommendations</h3>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                <li>Follow the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds</li>
                <li>Consciously blink more frequently to prevent dry eyes</li>
                <li>Adjust screen brightness to match your surroundings</li>
                <li>Consider using blue light filtering glasses for extended screen time</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>© 2025 Posture Monitor | Your digital posture assistant</p>
        </div>
      </footer>

      <style jsx="true" global="true">{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes ring-progress {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: var(--offset); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .progress-ring__circle {
          animation: ring-progress 1.5s ease-out forwards;
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
        }
        .graph-container {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease-out;
        }
        .graph-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        .animate-slide-up {
          animation: slideUp 0.8s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}