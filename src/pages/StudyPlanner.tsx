import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  School,
  AutoAwesome,
  Timer,
  ListAlt,
  Delete,
  ArrowBack,
  ExpandMore,
  ExpandLess,
  Link as LinkIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useStore } from '../store';
import { GeminiService } from '../services/gemini';
import type { StudyPlan } from '../types';

export const StudyPlanner: React.FC = () => {
  const navigate = useNavigate();
  const { studyPlans, addStudyPlan, deleteStudyPlan } = useStore();
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedPlans, setExpandedPlans] = useState<Set<string>>(new Set());

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    try {
      const plan = await GeminiService.generateStudyPlan(topic);
      addStudyPlan(plan);
      toast.success('Study plan generated successfully!');
      setTopic('');
    } catch (error) {
      console.error('Error generating study plan:', error);
      toast.error('Failed to generate study plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleExpanded = (planId: string) => {
    const newExpanded = new Set(expandedPlans);
    if (newExpanded.has(planId)) {
      newExpanded.delete(planId);
    } else {
      newExpanded.add(planId);
    }
    setExpandedPlans(newExpanded);
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <div className="min-h-screen bg-md-sys-color-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-md-sys-color-surface shadow-elevation-1">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="text"
              icon={<ArrowBack />}
              onClick={() => navigate('/')}
              className="!p-2"
            />
            <h1 className="text-2xl font-medium text-md-sys-color-on-surface">
              Study Planner
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Generate Plan Section */}
        <Card variant="elevated" className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AutoAwesome className="text-md-sys-color-primary" />
            <h2 className="text-lg font-medium text-md-sys-color-on-surface">
              AI-Powered Study Plans
            </h2>
          </div>
          
          <form onSubmit={handleGeneratePlan} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-md-sys-color-on-surface mb-2">
                What do you want to study?
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Photosynthesis, Machine Learning, Spanish Grammar"
                className="input-outlined"
                required
                disabled={isGenerating}
              />
            </div>
            
            <Button
              type="submit"
              variant="filled"
              icon={<AutoAwesome />}
              disabled={isGenerating}
              className="w-full sm:w-auto"
            >
              {isGenerating ? 'Generating...' : 'Generate Study Plan'}
            </Button>
          </form>
        </Card>

        {/* Study Plans List */}
        <div className="space-y-6">
          <AnimatePresence>
            {studyPlans.map((plan) => {
              const isExpanded = expandedPlans.has(plan.id);
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  layout
                >
                  <Card variant="elevated">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-medium text-md-sys-color-on-surface">
                          {plan.topic}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-md-sys-color-on-surface-variant">
                          <div className="flex items-center gap-1">
                            <Timer className="text-sm" />
                            <span>Total: {formatTime(plan.totalTime)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ListAlt className="text-sm" />
                            <span>{plan.subtopics.length} subtopics</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="text"
                          icon={isExpanded ? <ExpandLess /> : <ExpandMore />}
                          onClick={() => toggleExpanded(plan.id)}
                          className="!p-2"
                        />
                        <Button
                          variant="text"
                          icon={<Delete />}
                          onClick={() => {
                            deleteStudyPlan(plan.id);
                            toast.success('Study plan deleted');
                          }}
                          className="!p-2 text-md-sys-color-error"
                        />
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-4 pt-4 border-t border-md-sys-color-outline-variant">
                            {plan.subtopics.map((subtopic, index) => (
                              <div key={index} className="space-y-2">
                                <div className="flex items-start justify-between">
                                  <h4 className="text-lg font-medium text-md-sys-color-on-surface">
                                    {index + 1}. {subtopic.title}
                                  </h4>
                                  <span className="text-sm text-md-sys-color-primary font-medium">
                                    {formatTime(subtopic.timeAllocation)}
                                  </span>
                                </div>
                                
                                <ul className="space-y-1 ml-6">
                                  {subtopic.keyPoints.map((point, pointIndex) => (
                                    <li
                                      key={pointIndex}
                                      className="text-sm text-md-sys-color-on-surface-variant list-disc"
                                    >
                                      {point}
                                    </li>
                                  ))}
                                </ul>

                                {subtopic.resources && subtopic.resources.length > 0 && (
                                  <div className="mt-3 ml-6">
                                    <p className="text-sm font-medium text-md-sys-color-on-surface-variant mb-2">
                                      Resources:
                                    </p>
                                    <div className="space-y-1">
                                      {subtopic.resources.map((resource, resIndex) => (
                                        <div
                                          key={resIndex}
                                          className="flex items-center gap-2 text-sm"
                                        >
                                          <span className="px-2 py-0.5 rounded-full text-xs bg-md-sys-color-secondary-container text-md-sys-color-on-secondary-container">
                                            {resource.type}
                                          </span>
                                          {resource.url ? (
                                            <a
                                              href={resource.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-md-sys-color-primary hover:underline flex items-center gap-1"
                                            >
                                              {resource.title}
                                              <LinkIcon className="text-xs" />
                                            </a>
                                          ) : (
                                            <span className="text-md-sys-color-on-surface-variant">
                                              {resource.title}
                                            </span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {studyPlans.length === 0 && (
          <Card variant="elevated" className="text-center py-12">
            <School className="text-6xl text-md-sys-color-primary opacity-20 mb-4" />
            <p className="text-lg text-md-sys-color-on-surface-variant mb-2">
              No study plans yet
            </p>
            <p className="text-sm text-md-sys-color-on-surface-variant mb-6">
              Enter a topic above and let AI create a personalized study plan for you
            </p>
          </Card>
        )}
      </main>
    </div>
  );
};