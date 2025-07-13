import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlaylistPlay, 
  Add, 
  Link,
  Delete,
  PlayArrow,
  CheckCircle,
  Circle,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { YouTubePlayer } from '../components/YouTubePlayer';
import { useStore } from '../store';
import { YouTubeService } from '../services/youtube';
import type { YouTubePlaylist } from '../types';

export const YouTube: React.FC = () => {
  const navigate = useNavigate();
  const { playlists, addPlaylist, deletePlaylist } = useStore();
  const [isAddingPlaylist, setIsAddingPlaylist] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<YouTubePlaylist | null>(null);

  const handleAddPlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const playlistId = YouTubeService.extractPlaylistId(playlistUrl);
      
      if (!playlistId) {
        const videoId = YouTubeService.extractVideoId(playlistUrl);
        if (videoId) {
          // Handle single video
          const video = await YouTubeService.getVideoInfo(videoId);
          const playlist: YouTubePlaylist = {
            id: crypto.randomUUID(),
            playlistId: videoId,
            title: video.title,
            videos: [video],
            totalVideos: 1,
            watchedCount: 0,
            addedAt: new Date()
          };
          addPlaylist(playlist);
          toast.success('Video added successfully!');
        } else {
          toast.error('Invalid YouTube URL');
        }
      } else {
        // Handle playlist
        const playlist = await YouTubeService.getPlaylistInfo(playlistId);
        addPlaylist(playlist);
        toast.success('Playlist added successfully!');
      }

      setPlaylistUrl('');
      setIsAddingPlaylist(false);
    } catch (error) {
      console.error('Error adding playlist:', error);
      toast.error('Failed to add playlist. Check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressPercentage = (playlist: YouTubePlaylist) => {
    return playlist.totalVideos > 0 
      ? Math.round((playlist.watchedCount / playlist.totalVideos) * 100)
      : 0;
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
              YouTube Playlists
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Add Playlist Section */}
        <Card variant="elevated" className="mb-8">
          {!isAddingPlaylist ? (
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-md-sys-color-on-surface">
                  Track Your Learning
                </h2>
                <p className="text-sm text-md-sys-color-on-surface-variant mt-1">
                  Add YouTube playlists or videos to track your progress
                </p>
              </div>
              <Button
                variant="filled"
                icon={<Add />}
                onClick={() => setIsAddingPlaylist(true)}
              >
                Add Playlist
              </Button>
            </div>
          ) : (
            <form onSubmit={handleAddPlaylist} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-md-sys-color-on-surface mb-2">
                  YouTube URL
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-md-sys-color-on-surface-variant" />
                    <input
                      type="url"
                      value={playlistUrl}
                      onChange={(e) => setPlaylistUrl(e.target.value)}
                      placeholder="https://youtube.com/playlist?list=..."
                      className="input-outlined pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="filled"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Adding...' : 'Add'}
                  </Button>
                  <Button
                    variant="text"
                    onClick={() => {
                      setIsAddingPlaylist(false);
                      setPlaylistUrl('');
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
              <p className="text-xs text-md-sys-color-on-surface-variant">
                Paste a YouTube playlist URL or video URL to start tracking
              </p>
            </form>
          )}
        </Card>

        {/* Playlists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {playlists.map((playlist) => (
              <motion.div
                key={playlist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4 }}
              >
                <Card variant="elevated" className="h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-md-sys-color-on-surface line-clamp-2">
                        {playlist.title}
                      </h3>
                      <p className="text-sm text-md-sys-color-on-surface-variant mt-1">
                        {playlist.totalVideos} videos
                      </p>
                    </div>
                    <Button
                      variant="text"
                      icon={<Delete />}
                      onClick={() => {
                        deletePlaylist(playlist.id);
                        toast.success('Playlist deleted');
                      }}
                      className="!p-2 text-md-sys-color-error"
                    />
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-md-sys-color-on-surface-variant">
                        Progress
                      </span>
                      <span className="text-md-sys-color-primary font-medium">
                        {getProgressPercentage(playlist)}%
                      </span>
                    </div>
                    <div className="h-2 bg-md-sys-color-surface-variant rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-md-sys-color-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${getProgressPercentage(playlist)}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                    <p className="text-xs text-md-sys-color-on-surface-variant mt-1">
                      {playlist.watchedCount} of {playlist.totalVideos} watched
                    </p>
                  </div>

                  {/* Video List Preview */}
                  <div className="flex-1 space-y-2 mb-4 max-h-40 overflow-y-auto">
                    {playlist.videos.slice(0, 3).map((video) => (
                      <div
                        key={video.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        {video.watched ? (
                          <CheckCircle className="text-md-sys-color-primary text-sm" />
                        ) : (
                          <Circle className="text-md-sys-color-on-surface-variant text-sm" />
                        )}
                        <span className={`line-clamp-1 ${
                          video.watched ? 'line-through opacity-60' : ''
                        }`}>
                          {video.title}
                        </span>
                      </div>
                    ))}
                    {playlist.videos.length > 3 && (
                      <p className="text-xs text-md-sys-color-on-surface-variant pl-6">
                        +{playlist.videos.length - 3} more videos
                      </p>
                    )}
                  </div>

                  <Button
                    variant="filled"
                    icon={<PlayArrow />}
                    onClick={() => setSelectedPlaylist(playlist)}
                    className="w-full"
                  >
                    Watch Playlist
                  </Button>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {playlists.length === 0 && (
          <Card variant="elevated" className="text-center py-12">
            <PlaylistPlay className="text-6xl text-md-sys-color-primary opacity-20 mb-4" />
            <p className="text-lg text-md-sys-color-on-surface-variant mb-4">
              No playlists added yet
            </p>
            <Button
              variant="filled"
              icon={<Add />}
              onClick={() => setIsAddingPlaylist(true)}
            >
              Add Your First Playlist
            </Button>
          </Card>
        )}
      </main>

      {/* YouTube Player Modal */}
      <AnimatePresence>
        {selectedPlaylist && (
          <YouTubePlayer
            playlist={selectedPlaylist}
            onClose={() => setSelectedPlaylist(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};