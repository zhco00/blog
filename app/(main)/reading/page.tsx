import { redirect } from 'next/navigation'

export default function ReadingPage() {
  redirect('/blog?category=reading')
}
