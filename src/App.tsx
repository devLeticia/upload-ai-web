import { Button } from './components/ui/button'
import { Github, Wand2 } from 'lucide-react'
import { Separator } from './components/ui/separator'
import { Textarea } from './components/ui/textarea'
import { Label } from './components/ui/label'
import { Slider } from './components/ui/slider'
import { VideoInputForm } from './components/video-input-form'
import { PromptSelect } from './components/prompt-select'
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from './components/ui/select'
import { useState } from 'react'
import { useCompletion } from 'ai/react'

export function App() {
  const [temperature, setTemperature] = useState(0.5)
  const [videoId, setVideoId] = useState<string | null>(null)

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
  } = useCompletion({
    api: 'http://localhost:3333/ai/complete',
    body: {
      videoId,
      temperature,
    },
    headers: {
      'Content-type': 'application/json',
    },
  })

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <div className='px-6 flex items-center justify-between border-b py-3'>
        <img className='h-8' src='/flow-upload-logo.svg' />
        <div className='flex items-center gap-3'>
          <span className='text-sm text-muted-foreground'>
            Developed with ❤ at Rocketseat NLW
          </span>

          <Separator
            orientation='vertical'
            className='h-6 bg-muted-foreground'
          ></Separator>

          <Button variant={'secondary'}>
            <Github className='w-4 h-4 mr-2'></Github>
            Github
          </Button>
        </div>
      </div>
      <main className='flex-1 p-6 flex gap-6'>
        <aside className='w-80 space-y-6 p-6 bg-dark bg-card border  rounded-sm'>
          <VideoInputForm onVideoUploaded={setVideoId} />
          <form className='space-y-6' onSubmit={handleSubmit}>
            <div className='space-y-2'>
              <Label>Prompt</Label>
              <PromptSelect onPromptSelected={setInput} />
              <span className='block text-xs text-muted-foreground italic leading-relaxed'>
                You'll be able to custsomize this option soon
              </span>
            </div>

            <div className='space-y-2'>
              <Label>Model</Label>
              <Select disabled defaultValue='gpt3.5'>
                <SelectTrigger className='bg-background'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='bg-background'>
                  <SelectItem value='gpt3.5'>GPT 3.5-Turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className='block text-xs text-muted-foreground italic leading-relaxed'>
                You'll be able to custsomize this option soon
              </span>
            </div>

            <Separator className='bg-muted-foreground' />

            <div className='space-y-4'>
              <Label>Temperature</Label>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
              />

              <span className='block text-xs text-muted-foreground italic  leading-relaxed'>
                Using higher values can boost creativity but might also increase
                the chances of errors.
              </span>
            </div>
            <Separator className='bg-muted-foreground' />

            <Button type='submit' disabled={isLoading} className='w-full'>
              Execute
              <Wand2 className='h-4 w-4 ml-2' />
            </Button>
          </form>
        </aside>
        <div className='flex flex-col flex-1 gap-4'>
          <div className='grid grid-rows-2 gap-4 flex-1'>
            <Textarea
              value={input}
              onChange={handleInputChange}
              placeholder='Include your AI prompt...'
              className='resize-none p-6 leading-relaxed'
            />
            <Textarea
              className='resize-none p-6 leading-relaxed'
              placeholder='Include your AI prompt...'
              readOnly
              value={completion}
            />
          </div>
          <p className='text-sm text-muted-foreground'>
            You can use the
            <code className='text-rose-600'> {'{transcription}'} </code>{' '}
            variable in your prompt to add content to transcription
          </p>
        </div>
      </main>
    </div>
  )
}
