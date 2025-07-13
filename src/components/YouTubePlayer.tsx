import React, { useState, useEffect } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlayArrow, 
  Pause, 
  SkipNext, 
  SkipPrevious, 
  CheckCircle,
  Circle,
  Close
} from '@mui/icons-material';
import { Card } from './Card';
import { Button } from './Button';
import { useStore } from '../store';
import type { YouTubePlaylist, YouTubeVideo } from '../types';

interface YouTubePlayerProps {
  playlist: YouTubePlaylist;
  onClose: () => void;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ playlist, onClose }) => {
  const { toggleVideoWatched, updateVideoProgress } = useStore();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentVideo = playlist.videos[currentVideoIndex];

  const opts: YouTubeProps['opts'] = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
    },
  };

  const onReady: YouTubeProps['onReady'] = (event) => {
    setPlayer(event.target);
    if (currentVideo.playbackPosition) {
      event.target.seekTo(currentVideo.playbackPosition);
    }
  };

  const onStateChange: YouTubeProps['onStateChange'] = (event) => {
    setIsPlaying(event.data === 1);
    
    // Save playback position every 5 seconds
    if (event.data === 1) {
      const interval = setInterval(() => {
        if (player) {
          const currentTime = player.getCurrentTime();
          updateVideoProgress(playlist.id, currentVideo.id, currentTime);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  };

  const onEnd: YouTubeProps['onEnd'] = () => {
    toggleVideoWatched(playlist.id, currentVideo.id);
    if (currentVideoIndex < playlist.videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentVideoIndex < playlist.videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handlePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-5xl"
      >
        <Card variant="elevated" className="p-0 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-md-sys-color-outline-variant">
            <h2 className="text-xl font-medium text-md-sys-color-on-surface">
              {playlist.title}
            </h2>
            <Button
              variant="text"
              icon={<Close />}
              onClick={onClose}
              className="!p-2"
            />
          </div>

          <div className="flex flex-col lg:flex-row">
            <div className="flex-1">
              <YouTube
                videoId={currentVideo.id}
                opts={opts}
                onReady={onReady}
                onStateChange={onStateChange}
                onEnd={onEnd}
                className="w-full"
              />

              <div className="p-4">
                <h3 className="text-lg font-medium text-md-sys-color-on-surface mb-2">
                  {currentVideo.title}
                </h3>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outlined"
                      icon={<SkipPrevious />}
                      onClick={handlePrevious}
                      disabled={currentVideoIndex === 0}
                    >
                      Previous
                    </Button>
                    
                    <Button
                      variant="filled"
                      icon={isPlaying ? <Pause /> : <PlayArrow />}
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      icon={<SkipNext />}
                      onClick={handleNext}
                      disabled={currentVideoIndex === playlist.videos.length - 1}
                    >
                      Next
                    </Button>
                  </div>

                  <span className="text-sm text-md-sys-color-on-surface-variant">
                    Video {currentVideoIndex + 1} of {playlist.videos.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-md-sys-color-outline-variant">
              <div className="p-4">
                <h4 className="text-sm font-medium text-md-sys-color-on-surface-variant mb-3">
                  Playlist ({playlist.watchedCount}/{playlist.totalVideos} watched)
                </h4>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  <AnimatePresence>
                    {playlist.videos.map((video, index) => (
                      <motion.button
                        key={video.id}
                        className={`
                          w-full text-left p-3 rounded-lg transition-all
                          ${index === currentVideoIndex
                            ? 'bg-md-sys-color-primary-container text-md-sys-color-on-primary-container'
                            : 'hover:bg-md-sys-color-surface-variant'
                          }
                        `}
                        onClick={() => setCurrentVideoIndex(index)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleVideoWatched(playlist.id, video.id);
                            }}
                            className="mt-0.5"
                          >
                            {video.watched ? (
                              <CheckCircle className="text-md-sys-color-primary" />
                            ) : (
                              <Circle className="text-md-sys-color-on-surface-variant" />
                            )}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${video.watched ? 'line-through opacity-60' : ''}`}>
                              {video.title}
                            </p>
                            <p className="text-xs text-md-sys-color-on-surface-variant mt-1">
                              {video.duration}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};