import { 
  YouTubePlaylistResponse, 
  YouTubeVideoResponse, 
  YouTubePlaylistItem, 
  YouTubeVideoItem, 
  ApiResponse, 
  Video, 
  Playlist 
} from '../types';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Utility function to parse ISO 8601 duration to seconds
const parseISO8601Duration = (duration: string): number => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  
  return hours * 3600 + minutes * 60 + seconds;
};

// Utility function to extract video ID from YouTube URL
export const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
};

// Utility function to extract playlist ID from YouTube URL
export const extractPlaylistId = (url: string): string | null => {
  const patterns = [
    /[?&]list=([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]+)$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
};

// Fetch playlist details from YouTube API
export const fetchPlaylistDetails = async (playlistId: string): Promise<ApiResponse<YouTubePlaylistItem>> => {
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/playlists?part=snippet,contentDetails&id=${playlistId}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }
    
    const data: YouTubePlaylistResponse = await response.json();
    
    if (data.items.length === 0) {
      return { success: false, error: 'Playlist not found' };
    }
    
    return { success: true, data: data.items[0] };
  } catch (error) {
    console.error('Fetch playlist details error:', error);
    return { success: false, error: 'Failed to fetch playlist details' };
  }
};

// Fetch playlist videos from YouTube API
export const fetchPlaylistVideos = async (playlistId: string, maxResults: number = 50): Promise<ApiResponse<YouTubeVideoItem[]>> => {
  try {
    const videos: YouTubeVideoItem[] = [];
    let nextPageToken = '';
    
    do {
      const playlistItemsResponse = await fetch(
        `${YOUTUBE_API_BASE_URL}/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`
      );
      
      if (!playlistItemsResponse.ok) {
        throw new Error(`YouTube API error: ${playlistItemsResponse.status}`);
      }
      
      const playlistData = await playlistItemsResponse.json();
      
      if (playlistData.items.length === 0) {
        break;
      }
      
      // Get video IDs
      const videoIds = playlistData.items.map((item: any) => item.snippet.resourceId.videoId);
      
      // Fetch video details
      const videoDetailsResponse = await fetch(
        `${YOUTUBE_API_BASE_URL}/videos?part=snippet,contentDetails&id=${videoIds.join(',')}&key=${YOUTUBE_API_KEY}`
      );
      
      if (!videoDetailsResponse.ok) {
        throw new Error(`YouTube API error: ${videoDetailsResponse.status}`);
      }
      
      const videoData: YouTubeVideoResponse = await videoDetailsResponse.json();
      videos.push(...videoData.items);
      
      nextPageToken = playlistData.nextPageToken;
    } while (nextPageToken);
    
    return { success: true, data: videos };
  } catch (error) {
    console.error('Fetch playlist videos error:', error);
    return { success: false, error: 'Failed to fetch playlist videos' };
  }
};

// Fetch single video details from YouTube API
export const fetchVideoDetails = async (videoId: string): Promise<ApiResponse<YouTubeVideoItem>> => {
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/videos?part=snippet,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }
    
    const data: YouTubeVideoResponse = await response.json();
    
    if (data.items.length === 0) {
      return { success: false, error: 'Video not found' };
    }
    
    return { success: true, data: data.items[0] };
  } catch (error) {
    console.error('Fetch video details error:', error);
    return { success: false, error: 'Failed to fetch video details' };
  }
};

// Search YouTube videos
export const searchYouTubeVideos = async (query: string, maxResults: number = 25): Promise<ApiResponse<YouTubeVideoItem[]>> => {
  try {
    const searchResponse = await fetch(
      `${YOUTUBE_API_BASE_URL}/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`
    );
    
    if (!searchResponse.ok) {
      throw new Error(`YouTube API error: ${searchResponse.status}`);
    }
    
    const searchData = await searchResponse.json();
    
    if (searchData.items.length === 0) {
      return { success: true, data: [] };
    }
    
    // Get video IDs from search results
    const videoIds = searchData.items.map((item: any) => item.id.videoId);
    
    // Fetch detailed video information
    const videoDetailsResponse = await fetch(
      `${YOUTUBE_API_BASE_URL}/videos?part=snippet,contentDetails&id=${videoIds.join(',')}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!videoDetailsResponse.ok) {
      throw new Error(`YouTube API error: ${videoDetailsResponse.status}`);
    }
    
    const videoData: YouTubeVideoResponse = await videoDetailsResponse.json();
    
    return { success: true, data: videoData.items };
  } catch (error) {
    console.error('Search YouTube videos error:', error);
    return { success: false, error: 'Failed to search YouTube videos' };
  }
};

// Convert YouTube playlist to internal playlist format
export const convertYouTubePlaylistToInternal = (
  youtubePlaylist: YouTubePlaylistItem, 
  youtubeVideos: YouTubeVideoItem[], 
  userId: string
): Playlist => {
  const videos: Video[] = youtubeVideos.map((video, index) => ({
    id: `${video.id}-${index}`,
    title: video.snippet.title,
    description: video.snippet.description,
    thumbnailUrl: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
    duration: parseISO8601Duration(video.contentDetails.duration),
    watched: false,
    youtubeVideoId: video.id,
    position: index,
    playlistId: '', // Will be set when playlist is created
  }));
  
  const totalDuration = videos.reduce((sum, video) => sum + video.duration, 0);
  
  return {
    id: '', // Will be set when playlist is created
    title: youtubePlaylist.snippet.title,
    description: youtubePlaylist.snippet.description,
    thumbnailUrl: youtubePlaylist.snippet.thumbnails.medium?.url || youtubePlaylist.snippet.thumbnails.default?.url,
    videoCount: videos.length,
    totalDuration,
    watchedCount: 0,
    videos,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId,
    youtubePlaylistId: youtubePlaylist.id,
  };
};

// Convert YouTube video to internal video format
export const convertYouTubeVideoToInternal = (
  youtubeVideo: YouTubeVideoItem, 
  position: number, 
  playlistId: string
): Video => {
  return {
    id: `${youtubeVideo.id}-${position}`,
    title: youtubeVideo.snippet.title,
    description: youtubeVideo.snippet.description,
    thumbnailUrl: youtubeVideo.snippet.thumbnails.medium?.url || youtubeVideo.snippet.thumbnails.default?.url,
    duration: parseISO8601Duration(youtubeVideo.contentDetails.duration),
    watched: false,
    youtubeVideoId: youtubeVideo.id,
    position,
    playlistId,
  };
};

// Format duration for display
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
};

// Calculate playlist statistics
export const calculatePlaylistStats = (playlist: Playlist) => {
  const totalVideos = playlist.videos.length;
  const watchedVideos = playlist.videos.filter(video => video.watched).length;
  const totalDuration = playlist.videos.reduce((sum, video) => sum + video.duration, 0);
  const watchedDuration = playlist.videos
    .filter(video => video.watched)
    .reduce((sum, video) => sum + video.duration, 0);
  
  return {
    totalVideos,
    watchedVideos,
    totalDuration,
    watchedDuration,
    progressPercentage: totalVideos > 0 ? Math.round((watchedVideos / totalVideos) * 100) : 0,
    remainingDuration: totalDuration - watchedDuration,
  };
};

// Get next video in playlist
export const getNextVideo = (playlist: Playlist, currentVideoId: string): Video | null => {
  const currentIndex = playlist.videos.findIndex(video => video.id === currentVideoId);
  if (currentIndex === -1 || currentIndex === playlist.videos.length - 1) {
    return null;
  }
  return playlist.videos[currentIndex + 1];
};

// Get previous video in playlist
export const getPreviousVideo = (playlist: Playlist, currentVideoId: string): Video | null => {
  const currentIndex = playlist.videos.findIndex(video => video.id === currentVideoId);
  if (currentIndex <= 0) {
    return null;
  }
  return playlist.videos[currentIndex - 1];
};

// Get video progress percentage
export const getVideoProgress = (video: Video): number => {
  if (!video.lastPlaybackPosition || video.duration === 0) return 0;
  return Math.round((video.lastPlaybackPosition / video.duration) * 100);
};

// Mark video as watched if progress is above threshold
export const shouldMarkAsWatched = (video: Video, threshold: number = 0.9): boolean => {
  if (!video.lastPlaybackPosition) return false;
  return video.lastPlaybackPosition / video.duration >= threshold;
};

// Generate YouTube embed URL
export const generateEmbedUrl = (videoId: string, startTime?: number): string => {
  const baseUrl = `https://www.youtube.com/embed/${videoId}`;
  const params = new URLSearchParams();
  
  params.append('autoplay', '1');
  params.append('rel', '0');
  params.append('modestbranding', '1');
  
  if (startTime) {
    params.append('start', startTime.toString());
  }
  
  return `${baseUrl}?${params.toString()}`;
};

// Generate YouTube watch URL
export const generateWatchUrl = (videoId: string, startTime?: number): string => {
  const baseUrl = `https://www.youtube.com/watch?v=${videoId}`;
  
  if (startTime) {
    return `${baseUrl}&t=${startTime}s`;
  }
  
  return baseUrl;
};

// Validate YouTube URL
export const validateYouTubeUrl = (url: string): { isValid: boolean; type: 'video' | 'playlist' | null; id: string | null } => {
  const videoId = extractVideoId(url);
  const playlistId = extractPlaylistId(url);
  
  if (videoId) {
    return { isValid: true, type: 'video', id: videoId };
  }
  
  if (playlistId) {
    return { isValid: true, type: 'playlist', id: playlistId };
  }
  
  return { isValid: false, type: null, id: null };
};

// YouTube Player API helpers
export const loadYouTubeAPI = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.onload = () => {
      window.onYouTubeIframeAPIReady = () => {
        resolve();
      };
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// YouTube Player state constants
export const YOUTUBE_PLAYER_STATES = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
};

// Create YouTube player configuration
export const createPlayerConfig = (videoId: string, options: any = {}) => {
  return {
    height: options.height || '390',
    width: options.width || '640',
    videoId,
    playerVars: {
      autoplay: options.autoplay || 0,
      controls: options.controls || 1,
      disablekb: options.disablekb || 0,
      enablejsapi: 1,
      fs: options.fs || 1,
      iv_load_policy: 3,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      start: options.start || 0,
      ...options.playerVars,
    },
    events: {
      onReady: options.onReady || (() => {}),
      onStateChange: options.onStateChange || (() => {}),
      onError: options.onError || (() => {}),
    },
  };
};

// Export YouTube API key validation
export const isYouTubeApiConfigured = (): boolean => {
  return Boolean(YOUTUBE_API_KEY && YOUTUBE_API_KEY !== '');
};

// Declare global YouTube API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}