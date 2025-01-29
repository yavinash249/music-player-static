import { useState } from 'react'
import styled from 'styled-components'
import MusicPlayer from './components/MusicPlayer'
import PlaylistInput from './components/PlaylistInput'

const AppContainer = styled.div`
  min-height: 100vh;
  background: #1a1a1a;
  color: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.h1`
  color: #1ed760;
  margin-bottom: 2rem;
`

function App() {
  const [playlistUrl, setPlaylistUrl] = useState('')

  const handlePlaylistSubmit = (url) => {
    setPlaylistUrl(url)
  }

  return (
    <AppContainer>
      <Title>YouTube Music Player</Title>
      <PlaylistInput onSubmit={handlePlaylistSubmit} />
      {playlistUrl && <MusicPlayer playlistUrl={playlistUrl} />}
    </AppContainer>
  )
}

export default App