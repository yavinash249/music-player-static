import { useState, useEffect } from 'react'
import YouTube from 'react-youtube'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPlay, 
  faPause, 
  faForward, 
  faBackward,
  faVolumeUp,
  faMusic
} from '@fortawesome/free-solid-svg-icons'

const PlayerContainer = styled.div`
  background: linear-gradient(45deg, #1e1e1e, #2d2d2d);
  padding: 2.5rem;
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const Controls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2.5rem;
  margin-top: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 50px;
  backdrop-filter: blur(10px);
`

const ControlButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    color: #1ed760;
    background: rgba(30, 215, 96, 0.1);
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      transform: none;
      background: none;
    }
  }
`

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  backdrop-filter: blur(10px);
`

const VolumeSlider = styled.input`
  width: 120px;
  height: 4px;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: #1ed760;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }
`

const UpcomingSongs = styled.div`
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1.5rem;
`

const UpcomingTitle = styled.h3`
  color: white;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.5px;
`

const SongList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`

const SongItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background: ${props => props.$isPlaying ? 'rgba(30, 215, 96, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 12px;
  color: white;
  gap: 1rem;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.$isPlaying ? 'rgba(30, 215, 96, 0.3)' : 'transparent'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }
`

const SongIcon = styled.div`
  color: ${props => props.$isPlaying ? '#1ed760' : '#808080'};
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
`

const SongInfo = styled.div`
  flex: 1;
  overflow: hidden;
  
  h4 {
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${props => props.$isPlaying ? '#1ed760' : 'white'};
    font-weight: 500;
    margin-bottom: 4px;
  }
  
  span {
    font-size: 0.85rem;
    color: #808080;
    letter-spacing: 0.5px;
  }
`

// Add this to your App.jsx or index.css for a better background
// eslint-disable-next-line no-unused-vars
const AppBackground = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #121212 0%, #1e1e1e 100%);
  padding: 2rem;
`

// eslint-disable-next-line react/prop-types
function MusicPlayer({ playlistUrl }) {
  const [player, setPlayer] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(100)
  const [currentPlaylist, setCurrentPlaylist] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentVideoTitle, setCurrentVideoTitle] = useState('')

  useEffect(() => {
    if (player) {
      const intervalId = setInterval(() => {
        const playerState = player.getPlayerState()
        setIsPlaying(playerState === 1)
        
        // Update current index and title
        const index = player.getPlaylistIndex()
        if (index !== currentIndex) {
          setCurrentIndex(index)
          updateCurrentVideoTitle(player)
        }
      }, 1000)

      return () => clearInterval(intervalId)
    }
  }, [player, currentIndex])

  const updateCurrentVideoTitle = async (videoPlayer) => {
    try {
      const data = videoPlayer.getVideoData()
      setCurrentVideoTitle(data.title)
    } catch (error) {
      console.error('Error getting video title:', error)
    }
  }

  const getVideoAndPlaylistId = (url) => {
    const playlistId = url.match(/[&?]list=([^&]+)/i)
    const videoId = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/i)
    
    return {
      videoId: videoId ? videoId[1] : '',
      playlistId: playlistId ? playlistId[1] : ''
    }
  }

  const onReady = async (event) => {
    const youtubePlayer = event.target
    setPlayer(youtubePlayer)
    youtubePlayer.setVolume(volume)
    
    // Get initial playlist and index
    const playlist = youtubePlayer.getPlaylist() || []
    setCurrentPlaylist(playlist)
    setCurrentIndex(youtubePlayer.getPlaylistIndex())
    
    // Get initial video title
    await updateCurrentVideoTitle(youtubePlayer)
    
    const playerState = youtubePlayer.getPlayerState()
    setIsPlaying(playerState === 1)
  }

  const onStateChange = async (event) => {
    setIsPlaying(event.data === 1)
    
    if (player) {
      const newIndex = player.getPlaylistIndex()
      setCurrentIndex(newIndex)
      await updateCurrentVideoTitle(player)
    }
  }

  const onError = (error) => {
    console.error('YouTube Player Error:', error)
  }

  const togglePlay = () => {
    if (!player) return

    try {
      const playerState = player.getPlayerState()
      
      if (playerState === 1) {
        player.pauseVideo()
        setIsPlaying(false)
      } else {
        player.playVideo()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error('Error toggling play state:', error)
    }
  }

  const handlePrevious = async () => {
    if (!player || !currentPlaylist.length) return
    
    try {
      player.previousVideo()
      const newIndex = player.getPlaylistIndex()
      setCurrentIndex(newIndex)
      await updateCurrentVideoTitle(player)
    } catch (error) {
      console.error('Error playing previous video:', error)
    }
  }

  const handleNext = async () => {
    if (!player || !currentPlaylist.length) return
    
    try {
      player.nextVideo()
      const newIndex = player.getPlaylistIndex()
      setCurrentIndex(newIndex)
      await updateCurrentVideoTitle(player)
    } catch (error) {
      console.error('Error playing next video:', error)
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
    player?.setVolume(newVolume)
  }

  const getCurrentAndUpcomingSongs = () => {
    if (!player || !currentPlaylist.length) return []
    
    const songs = []
    // Add current song
    songs.push({
      id: currentPlaylist[currentIndex],
      title: currentVideoTitle || 'Loading...',
      isPlaying: true
    })
    
    // Add next 4 songs
    for (let i = 1; i <= 4; i++) {
      let nextIndex = (currentIndex + i) % currentPlaylist.length
      songs.push({
        id: currentPlaylist[nextIndex],
        title: `Next Song ${i}`,
        isPlaying: false,
        position: i
      })
    }
    
    return songs
  }

  const { videoId, playlistId } = getVideoAndPlaylistId(playlistUrl)

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
      controls: 1,
      origin: window.location.origin,
      ...(playlistId && {
        list: playlistId,
        listType: 'playlist',
      })
    },
  }

  const songs = getCurrentAndUpcomingSongs()

  return (
    <PlayerContainer>
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onStateChange={onStateChange}
        onError={onError}
        iframeClassName="youtube-iframe"
        loading="lazy"
        title="YouTube music player"
      />
      <Controls>
        <ControlButton 
          onClick={handlePrevious}
          disabled={!currentPlaylist.length}
          style={{ opacity: currentPlaylist.length ? 1 : 0.5 }}
        >
          <FontAwesomeIcon icon={faBackward} />
        </ControlButton>
        <ControlButton onClick={togglePlay}>
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </ControlButton>
        <ControlButton 
          onClick={handleNext}
          disabled={!currentPlaylist.length}
          style={{ opacity: currentPlaylist.length ? 1 : 0.5 }}
        >
          <FontAwesomeIcon icon={faForward} />
        </ControlButton>
      </Controls>
      <VolumeControl>
        <FontAwesomeIcon icon={faVolumeUp} />
        <VolumeSlider
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
        />
      </VolumeControl>
      
      {/* Current and Upcoming Songs Section */}
      <UpcomingSongs>
        <UpcomingTitle>Now Playing & Up Next</UpcomingTitle>
        <SongList>
          {songs.map((song, index) => (
            <SongItem 
              key={`${song.id}-${index}`}
              $isPlaying={song.isPlaying}
            >
              <SongIcon $isPlaying={song.isPlaying}>
                <FontAwesomeIcon icon={faMusic} />
              </SongIcon>
              <SongInfo $isPlaying={song.isPlaying}>
                <h4>{song.title}</h4>
                {!song.isPlaying && (
                  <span>Coming up #{song.position}</span>
                )}
              </SongInfo>
            </SongItem>
          ))}
        </SongList>
      </UpcomingSongs>
    </PlayerContainer>
  )
}

export default MusicPlayer