'use client'

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { TrashIcon } from 'lucide-react'
import { toast } from 'sonner'
import z from 'zod'

import type { Post } from '@/server/db'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useORPC } from '@/lib/orpc/react'

export const CreatePost: React.FC = () => {
  const orpc = useORPC()
  const queryClient = useQueryClient()

  const form = useForm({
    schema: z.object({ title: z.string().min(1), content: z.string().min(1) }),
    defaultValues: { title: '', content: '' },
    submitFn: (values) => orpc.post.create.call(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: orpc.post.all.key(),
      })
      form.reset()
    },
    onError: (error) => {
      toast.error(error)
    },
  })

  return (
    <Card>
      <CardContent>
        <Form form={form}>
          <FormField
            name="title"
            render={(field) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl {...field}>
                  <Input placeholder="What's on your mind?" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="content"
            render={(field) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl {...field}>
                  <Input placeholder="What's on your mind?" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={form.isPending}>Create Post</Button>
        </Form>
      </CardContent>
    </Card>
  )
}

export const PostList: React.FC = () => {
  const orpc = useORPC()
  const { data } = useSuspenseQuery(orpc.post.all.queryOptions())
  return data.map((post) => <PostCard key={post.id} post={post} />)
}

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const orpc = useORPC()
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation(
    orpc.post.delete.mutationOptions({
      onError: (error) => toast.error(error.message),
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: orpc.post.all.key(),
        })
      },
    }),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>{post.createdAt?.toDateString()}</CardDescription>
        <CardAction>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              mutate({ id: post.id ?? '' })
            }}
            disabled={isPending}
          >
            <TrashIcon />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <p>{post.content}</p>
      </CardContent>
    </Card>
  )
}

export const PostCardSkeleton: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="w-1/3 animate-pulse rounded-lg bg-current">
        &nbsp;
      </CardTitle>
      <CardDescription className="w-1/4 animate-pulse rounded-lg bg-current">
        &nbsp;
      </CardDescription>
    </CardHeader>

    <CardContent>
      <p className="h-20 animate-pulse rounded-lg bg-current">&nbsp;</p>
    </CardContent>
  </Card>
)
