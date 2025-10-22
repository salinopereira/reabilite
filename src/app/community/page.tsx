import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { placeholderImages } from '@/lib/placeholder-images';
import { PlusCircle, MessageSquare, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const posts = [
  {
    id: 1,
    author: { name: 'Dr. Ricardo Borges', avatarId: 'professional-avatar-2' },
    title: 'Dicas para lidar com a ansiedade no dia a dia',
    tag: 'Psicologia',
    snippet: 'A ansiedade é uma reação normal do corpo, mas quando excessiva pode atrapalhar muito. Vamos discutir algumas estratégias simples que você pode aplicar para gerenciá-la melhor...',
    likes: 128,
    comments: 23,
  },
  {
    id: 2,
    author: { name: 'Juliana Costa', avatarId: 'patient-avatar-1' },
    title: 'Minha jornada com a reeducação alimentar: 5kg a menos!',
    tag: 'Nutrição',
    snippet: 'Queria compartilhar com vocês minha experiência! Com a ajuda da minha nutri aqui da plataforma, consegui mudar meus hábitos e estou me sentindo muito mais disposta. Foi difícil no começo, mas...',
    likes: 256,
    comments: 45,
  },
  {
    id: 3,
    author: { name: 'Prof. Marcos Andrade', avatarId: 'professional-avatar-3' },
    title: 'Como começar a treinar: um guia para iniciantes',
    tag: 'Fitness',
    snippet: 'Dar o primeiro passo é sempre o mais difícil. Se você quer começar a se exercitar mas não sabe como, este post é para você. Vamos falar sobre como escolher uma atividade, frequência e...',
    likes: 98,
    comments: 15,
  },
];

export default function CommunityPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Comunidade Reabilite</h2>
          <p className="text-muted-foreground">
            Troque experiências, tire dúvidas e apoie outros membros.
          </p>
        </div>
        <div>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4"/>
                Criar Publicação
            </Button>
        </div>
      </div>

      <div className="space-y-6">
        {posts.map(post => {
            const avatar = placeholderImages.find(p => p.id === post.author.avatarId);
            return (
                <Card key={post.id}>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Avatar>
                                {avatar && <AvatarImage src={avatar.imageUrl} alt={post.author.name} data-ai-hint={avatar.imageHint} />}
                                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{post.author.name}</p>
                                <Badge variant="secondary">{post.tag}</Badge>
                            </div>
                        </div>
                        <CardTitle className="pt-2">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{post.snippet}</p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between">
                         <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4"/>
                                {post.likes}
                            </div>
                             <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4"/>
                                {post.comments}
                            </div>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="#">Ler mais</Link>
                        </Button>
                    </CardFooter>
                </Card>
            )
        })}
      </div>

    </div>
  );
}
