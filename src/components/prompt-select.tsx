import { useEffect, useState } from 'react'
import {
    Select,
    SelectTrigger,
    SelectItem,
    SelectValue,
    SelectContent,
  } from './ui/select'
import { api } from '@/lib/axios'



interface Prompt {
    id: string
    title: string
    template: string
}

interface PromptSelectProps {
    onPromptSelected: (template: string) => void
}

export function PromptSelect (props: PromptSelectProps) {
    const [prompts, setPrompts] = useState<Prompt[] | null>(null)

    // you can also use reactQury lib, swr, etc...
    //mounted, or watch when there is something in the array
    useEffect(() => {
        api.get('/prompts').then(response => {
            setPrompts(response.data)
        })
    }, [])


    function handlePromptSelected(promptId: string) {
        const selectedPrompt = prompts?.find(prompt => prompt.id === promptId)

        if (!selectedPrompt) {
            return 
        }

        props.onPromptSelected(selectedPrompt.template)
    }

    return (
        <Select onValueChange={handlePromptSelected}>
        <SelectTrigger className='bg-background'>
          <SelectValue placeholder='Select a prompt' />
        </SelectTrigger>
        <SelectContent className='bg-background'>
            {prompts?.map(prompt => {
                return (
                    <SelectItem key={prompt.id} value={prompt.id}>
                        {prompt.title}
                    </SelectItem>
                )
            })}
        </SelectContent>
      </Select>
    )
}