import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const Editorial = ({ secureUrl, thumbnailUrl, duration, videoType = 'cloudinary' }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const playPromiseRef = useRef(null);

  // Check if it's a YouTube video
  const isYouTube = videoType === 'youtube' || secureUrl?.includes('youtube.com') || secureUrl?.includes('youtu.be');

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlayPause = async () => {
    if (!videoRef.current || !isVideoReady) return;

    try {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        // Cancel any pending play promise
        if (playPromiseRef.current) {
          await playPromiseRef.current.catch(() => {});
        }

        playPromiseRef.current = videoRef.current.play();
        await playPromiseRef.current;
        setIsPlaying(true);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Play/Pause error:', error);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        containerRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const handlePlaybackSpeed = (speed) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
    setShowSettings(false);
  };

  const handleProgress = (e) => {
    if (videoRef.current && isVideoReady) {
      videoRef.current.currentTime = Number(e.target.value);
    }
  };

  // Update current time during playback (only for Cloudinary videos)
  useEffect(() => {
    if (isYouTube) return; // Skip for YouTube videos

    const video = videoRef.current;

    const handleTimeUpdate = () => {
      if (video) setCurrentTime(video.currentTime);
    };

    const handleBuffering = () => {
      if (video && video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleCanPlay = () => {
      setIsVideoReady(true);
    };

    const handleLoadStart = () => {
      setIsVideoReady(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('progress', handleBuffering);
      video.addEventListener('ended', handleEnded);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('loadstart', handleLoadStart);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.volume = volume;

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('progress', handleBuffering);
        video.removeEventListener('ended', handleEnded);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('loadstart', handleLoadStart);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
      };
    }
  }, [isYouTube, volume]);

  // If it's a YouTube video, render YouTube iframe
  if (isYouTube) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        ref={containerRef}
        className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-black max-w-4xl mx-auto"
      >
        {/* YouTube Badge */}
        <div className="absolute top-4 left-4 z-10 bg-red-600 backdrop-blur-md px-3 py-1.5 rounded-lg border border-red-700 shadow-lg">
          <p className="text-white text-xs font-semibold flex items-center">
            <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            YouTube Video
          </p>
        </div>

        {/* YouTube Iframe */}
        <div className="aspect-video">
          <iframe
            src={secureUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        {/* YouTube Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <p className="text-white text-sm font-medium">
            Watch the full solution explanation on YouTube
          </p>
        </div>
      </motion.div>
    );
  }

  // Calculate buffered percentage (only for Cloudinary videos)
  const bufferedPercent = duration ? (buffered / duration) * 100 : 0;
  const playedPercent = duration ? (currentTime / duration) * 100 : 0;

  // Render Cloudinary video player
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden shadow-2xl bg-black group ${
        isFullscreen ? 'fixed inset-0 rounded-none z-[9999]' : 'max-w-4xl mx-auto'
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={secureUrl}
        poster={thumbnailUrl}
        onClick={togglePlayPause}
        preload="metadata"
        className="w-full aspect-video bg-black cursor-pointer"
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Center Play Button (when paused) */}
      {!isPlaying && isVideoReady && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={togglePlayPause}
          className="absolute inset-0 flex items-center justify-center z-10"
        >
          <div className="bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 p-6 rounded-full">
            <Play className="w-12 h-12 text-white fill-white" />
          </div>
        </motion.button>
      )}

      {/* Video Controls Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovering || !isPlaying ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 space-y-3"
      >
        {/* Progress Bar with Buffered Indicator */}
        <div className="flex items-center gap-2 group/progress">
          <div className="flex-1 relative h-1.5 bg-gray-700 rounded-full cursor-pointer hover:h-2 transition-all duration-200">
            {/* Buffered Progress */}
            <div
              className="absolute h-full bg-gray-500 rounded-full transition-all"
              style={{ width: `${bufferedPercent}%` }}
            />
            {/* Played Progress */}
            <div
              className="absolute h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all"
              style={{ width: `${playedPercent}%` }}
            />
            {/* Scrubber Input */}
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleProgress}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={!isVideoReady}
            />
            {/* Play Head Indicator */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-red-500 rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity"
              style={{ left: `${playedPercent}%`, transform: 'translate(-50%, -50%)' }}
            />
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            {/* Play/Pause Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlayPause}
              disabled={!isVideoReady}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white fill-white" />
              )}
            </motion.button>

            {/* Volume Control */}
            <div className="flex items-center gap-2 group/volume">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMute}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </motion.button>

              {/* Volume Slider */}
              <div className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-gray-600 rounded-full cursor-pointer"
                />
              </div>
            </div>

            {/* Time Display */}
            <div className="text-white text-xs font-medium ml-2 flex items-center gap-1 min-w-max">
              <span className="text-red-400">{formatTime(currentTime)}</span>
              <span className="text-gray-400">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Settings Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
              >
                <Settings className="w-5 h-5 text-white" />
              </motion.button>

              {/* Settings Dropdown */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={
                  showSettings
                    ? { opacity: 1, scale: 1, y: 0 }
                    : { opacity: 0, scale: 0.9, y: 10 }
                }
                transition={{ duration: 0.2 }}
                className={`absolute bottom-full right-0 mb-2 bg-black/95 backdrop-blur-md rounded-lg shadow-xl overflow-hidden min-w-max border border-gray-700 ${
                  showSettings ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
              >
                <div className="py-2">
                  <p className="px-3 py-1 text-xs text-gray-400 font-semibold">
                    Playback Speed
                  </p>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => handlePlaybackSpeed(speed)}
                      className={`w-full px-3 py-1.5 text-sm text-left transition-colors duration-200 ${
                        playbackSpeed === speed
                          ? 'bg-red-500 text-white'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Fullscreen Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              <Maximize2 className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Video Info Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovering ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-700"
      >
        <p className="text-white text-xs font-semibold">Editorial Video</p>
      </motion.div>

      {/* Duration Badge */}
      {duration > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg font-semibold text-white text-sm"
        >
          {formatTime(duration)}
        </motion.div>
      )}

      {/* Loading Indicator */}
      {!isVideoReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-red-500 rounded-full animate-spin" />
        </div>
      )}
    </motion.div>
  );
};

export default Editorial;
