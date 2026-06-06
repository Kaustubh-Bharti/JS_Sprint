import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import Hero from './Hero';
import FeaturesSection from './FeaturesSection';
import RoadmapSection from './RoadmapSection';
import SkillTest from './SkillTest';

interface LandingPageProps {
  onNavigate: (page: string, extra?: unknown) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const { colors } = useTheme();
  const [showSkillTest, setShowSkillTest] = useState(false);

  return (
    <div className={`min-h-screen ${colors.bg}`}>
      <Hero
        onStart={() => onNavigate('learn')}
        onSkillTest={() => setShowSkillTest(true)}
      />
      <FeaturesSection />
      <RoadmapSection onDaySelect={(day) => onNavigate('learn', { startDay: day })} />

      {/* CTA section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className={`text-4xl font-extrabold mb-4 ${colors.text}`}>Ready to sprint?</h2>
          <p className={`text-lg ${colors.muted} mb-8`}>Brendan did it in 10 days. You've got 5. Let's go.</p>
          <button
            onClick={() => onNavigate('learn')}
            className={`px-10 py-4 rounded-2xl text-lg font-bold text-white bg-gradient-to-r ${colors.accent} shadow-xl hover:shadow-2xl hover:scale-105 transition-all`}
          >
            Start Learning Now →
          </button>
        </div>
      </section>

      {/* Skill test modal */}
      {showSkillTest && (
        <SkillTest
          onClose={() => setShowSkillTest(false)}
          onStart={(day) => {
            setShowSkillTest(false);
            onNavigate('learn', { startDay: day });
          }}
        />
      )}
    </div>
  );
}
