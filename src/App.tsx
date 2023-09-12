import { Button } from './components/ui/button'
import { Github, FileVideo, Upload, Wand2 } from 'lucide-react'
import { Separator } from './components/ui/separator'
import { Textarea } from './components/ui/textarea'
import { Label } from './components/ui/label'
import { Slider } from './components/ui/slider'
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from './components/ui/select'

export function App() {
  return (
    <div className='min-h-screen flex flex-col'>
      <div className='px-6 flex items-center justify-between border-b py-3'>
        <h1 className='text-xl font-bold'>Flow Upload Ai.</h1>
        <div className='flex items-center gap-3'>
          <span className='text-sm text-muted-foreground'>
            Developed with ❤ at Rocketseat NLW
          </span>

          <Separator orientation='vertical' className='h-6'></Separator>

          <Button variant={'secondary'}>
            <Github className='w-4 h-4 mr-2'></Github>
            Github
          </Button>
        </div>
      </div>
      <main className='flex-1 p-6 flex gap-6'>
        <aside className='w-80 space-y-6'>
          <form className='space-y-6'>
            <label
              htmlFor='video'
              className='border flex rounded-sm aspect-video w-full
                       cursor-pointer border-dashed text-sm flex-col
                       gap-2 items-center justify-center text-muted-foreground first-letter hover:bg-secondary/20'
            >
              <FileVideo className='h-6 w-6' />
              Choose Video
            </label>
            <input
              type='file'
              id='video'
              accept='video/mp4'
              className='sr-only'
            />
            <Separator />
            <div className='space-y-2'>
              <Label htmlFor='transcription_prompt'>Transcription Prompt</Label>
              <Textarea
                id='transcription_prompt'
                className='h-20 leading-relaxed resize-none'
                placeholder='Include keywords mentioned in the video separated by comma'
              />
            </div>
            <Button type='submit' className='w-full'>
              Upload video
              <Upload className='h-4 w-4 ml-2' />
            </Button>
          </form>
          <form className='space-y-6'>
            <div className='space-y-2'>
              <Label>Prompt</Label>
              <Select disabled defaultValue='gpt3.5'>
                <SelectTrigger>
                  <SelectValue placeholder='Select a prompt' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='title'>Youtube Title</SelectItem>
                  <SelectItem value='description'>
                    Youtube Description
                  </SelectItem>
                </SelectContent>
              </Select>
              <span className='block text-xs text-muted-foreground italic leading-relaxed'>
                You'll be able to custsomize this option soon
              </span>
            </div>

            <div className='space-y-2'>
              <Label>Model</Label>
              <Select disabled defaultValue='gpt3.5'>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='gpt3.5'>GPT 3.5-Turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className='block text-xs text-muted-foreground italic leading-relaxed'>
                You'll be able to custsomize this option soon
              </span>
            </div>

            <Separator />

            <div className='space-y-4'>
              <Label>Temperature</Label>
              <Slider min={0} max={1} step={0.1} />

              <span className='block text-xs text-muted-foreground italic  leading-relaxed'>
                Using higher values can boost creativity but might also increase
                the chances of errors.
              </span>
            </div>
            <Separator />

            <Button type='submit' className='w-full'>
              Execute
              <Wand2 className='h-4 w-4 ml-2' />
            </Button>
          </form>
        </aside>
        <div className='flex flex-col flex-1 gap-4'>
          <div className='grid grid-rows-2 gap-4 flex-1'>
            <Textarea
              placeholder='Include your AI prompt...'
              className='resize-none p-6 leading-relaxed'
            />
            <Textarea
              className='resize-none p-6 leading-relaxed'
              placeholder='Include your AI prompt...'
              readOnly
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
