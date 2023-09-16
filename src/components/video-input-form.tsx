import { FileVideo, Upload } from 'lucide-react'
import { Separator } from './ui/separator'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { ChangeEvent, FormEvent, useState, useMemo, useRef } from 'react'
import { getFFmpeg } from '@/lib/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import { api } from '@/lib/axios'

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success'

const statusMessages = {
  converting: 'Converting video to audio',
  uploading: 'uploading video',
  generating: 'generating transcription',
  success: 'Finalized!',
}

interface VideoInputFormProps {
  onVideoUploaded: (id: string) => void
}

export function VideoInputForm(props: VideoInputFormProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>('waiting')

  const promptInputRef = useRef<HTMLTextAreaElement>(null)

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget

    if (!files) {
      return
    }

    const selectedFile = files[0]

    setVideoFile(selectedFile)
  }

  async function convertVideoToAudio(video: File) {
    console.log('Convert start')

    const ffmpeg = await getFFmpeg()

    await ffmpeg.writeFile('input.mp4', await fetchFile(video))

    // ffmpeg.on('log', log => {
    // console.log(log)
    // })

    ffmpeg.on('progress', (progress) => {
      console.log('Conver progress:' + Math.round(progress.progress * 100))
    })

    //mpeg commands - will convert mp4 into mp3
    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20k',
      '-acodec',
      'libmp3lame',
      'output.mp3',
    ])

    const data = await ffmpeg.readFile('output.mp3')

    const audioFileBlob = new Blob([data], { type: 'audio/mpeg' })
    const audioFile = new File([audioFileBlob], 'audio.mp3', {
      type: 'audio/mpeg',
    })

    console.log('Conver finished')

    return audioFile
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    console.log('começou')
    event.preventDefault()

    const prompt = promptInputRef.current?.value
    console.log('prompt:', prompt)
    if (!videoFile) {
      return
    }

    setStatus('converting')

    //convert video into audio (so it will be much compressed)

    const audioFile = await convertVideoToAudio(videoFile)
    console.log('audioFile', audioFile)

    // create formData to send it to backend as a multipart/formdata
    const data = new FormData()

    data.append('file', audioFile)

    setStatus('uploading')

    // request to save audio file in database
    const response = await api.post('/videos', data)

    console.log('response', response.data)

    //request to generate transcription
    const videoId = response.data.video.id

    setStatus('generating')

    const transcription = await api.post(`/videos/${videoId}/transcription`, {
      prompt,
    })

    console.log('transcription')
    console.log('finalizou')
    setStatus('success')

    props.onVideoUploaded(videoId)
  }

  const previewURL = useMemo(() => {
    if (!videoFile) {
      return null
    }

    return URL.createObjectURL(videoFile)
  }, [videoFile])

  return (
    <form className='space-y-6' onSubmit={handleUploadVideo}>
      <label
        htmlFor='video'
        className='border relative flex rounded-md aspect-video w-full bg-background
                       cursor-pointer border-dashed text-sm flex-col
                       gap-2 items-center justify-center text-muted-foreground first-letter hover:bg-primary/25'
      >
        {previewURL ? (
          <video
            src={previewURL}
            controls={false}
            className='pointer-events-none absolute inset-0'
          />
        ) : (
          <>
            <FileVideo className='h-6 w-6' />
            Drop .mp4 video here
          </>
        )}
      </label>
      <input
        type='file'
        id='video'
        accept='video/mp4'
        className='sr-only bg-background'
        onChange={handleFileSelected}
      />
      <Separator className='bg-muted-foreground' />
      <div className='space-y-2'>
        <Label htmlFor='transcription_prompt'>Transcription Prompt</Label>
        <Textarea
          ref={promptInputRef}
          disabled={status !== 'waiting'}
          id='transcription_prompt'
          className='h-20 leading-relaxed resize-none bg-background'
          placeholder='Include keywords mentioned in the video separated by comma'
        />
      </div>
      <Button
        disabled={status !== 'waiting'}
        type='submit'
        data-success={status === 'success'}
        className='w-full data-[success=true]:bg-emerald-300'
      >
        {status === 'waiting' ? (
          <>
            Upload Video
            <Upload className='h-4 w-4 ml-2' />
          </>
        ) : (
          statusMessages[status]
        )}
      </Button>
    </form>
  )
}
