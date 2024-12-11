import { AI } from "@/app/action"
import { createStreamableUI, getMutableAIState } from "ai/rsc"


export async function submitMessage(formData: FormData) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()
  
  const uiStream = createStreamableUI()

  const aiMessages = [...aiState.get().messages]

  
}