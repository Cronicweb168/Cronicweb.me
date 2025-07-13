import axios from 'axios';
import type { YouTubePlaylist, YouTubeVideo } from '../types';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

export class YouTubeService {
  static async getPlaylistInfo(playlistId: string): Promise<YouTubePlaylist> {
    try {
      // Get playlist details
      const playlistResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/playlists`, {
        params: {
          part: 'snippet',
          id: playlistId,
          key: YOUTUBE_API_KEY
        }
      });

      if (!playlistResponse.data.items?.length) {
        throw new Error('Playlist not found');
      }

      const playlistData = playlistResponse.data.items[0];
      
      // Get playlist items
      const itemsResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/playlistItems`, {
        params: {
          part: 'snippet,contentDetails',
          playlistId: playlistId,
          maxResults: 50,
          key: YOUTUBE_API_KEY
        }
      });

      const videoIds = itemsResponse.data.items.map((item: any) => 
        item.contentDetails.videoId
      ).join(',');

      // Get video details
      const videosResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
        params: {
          part: 'contentDetails,snippet',
          id: videoIds,
          key: YOUTUBE_API_KEY
        }
      });

      const videos: YouTubeVideo[] = videosResponse.data.items.map((video: any) => ({
        id: video.id,
        title: video.snippet.title,
        duration: this.formatDuration(video.contentDetails.duration),
        thumbnailUrl: video.snippet.thumbnails.medium.url,
        watched: false
      }));

      return {
        id: crypto.randomUUID(),
        playlistId,
        title: playlistData.snippet.title,
        videos,
        totalVideos: videos.length,
        watchedCount: 0,
        addedAt: new Date()
      };
    } catch (error) {
      console.error('YouTube API error:', error);
      throw error;
    }
  }

  static async getVideoInfo(videoId: string): Promise<YouTubeVideo> {
    try {
      const response = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
        params: {
          part: 'contentDetails,snippet',
          id: videoId,
          key: YOUTUBE_API_KEY
        }
      });

      if (!response.data.items?.length) {
        throw new Error('Video not found');
      }

      const video = response.data.items[0];
      
      return {
        id: video.id,
        title: video.snippet.title,
        duration: this.formatDuration(video.contentDetails.duration),
        thumbnailUrl: video.snippet.thumbnails.medium.url,
        watched: false
      };
    } catch (error) {
      console.error('YouTube API error:', error);
      throw error;
    }
  }

  private static formatDuration(duration: string): string {
    // Convert ISO 8601 duration to readable format
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    
    if (!match) return '0:00';

    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  static extractPlaylistId(url: string): string | null {
    // Extract playlist ID from YouTube URL
    const regex = /[?&]list=([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  static extractVideoId(url: string): string | null {
    // Extract video ID from YouTube URL
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
}