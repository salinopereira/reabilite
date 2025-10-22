import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { placeholderImages } from '@/lib/placeholder-images';
import { Star, MapPin } from 'lucide-react';

const professionals = [
  {
    id: '1',
    name: 'Dr.ª Carolina Moreira',
    specialty: 'Nutricionista',
    rating: 4.9,
    reviews: 87,
    avatarId: 'professional-avatar-1',
  },
  {
    id: '2',
    name: 'Dr. Ricardo Borges',
    specialty: 'Psicólogo',
    rating: 5.0,
    reviews: 102,
    avatarId: 'professional-avatar-2',
  },
  {
    id: '3',
    name: 'Prof. Marcos Andrade',
    specialty: 'Educador Físico',
    rating: 4.8,
    reviews: 64,
    avatarId: 'professional-avatar-3',
  },
];

export default function PatientDashboard() {
  const mapImage = placeholderImages.find((img) => img.id === 'map-placeholder');

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Encontre o profissional ideal
          </h2>
          <p className="text-muted-foreground">
            Busque por especialidade, localização e agende sua consulta.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input placeholder="Buscar por nome..." />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Especialidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nutritionist">Nutricionista</SelectItem>
              <SelectItem value="psychologist">Psicólogo</SelectItem>
              <SelectItem value="physical-educator">
                Educador Físico
              </SelectItem>
            </SelectContent>
          </Select>
          <Button>Buscar</Button>
        </div>

        <Card>
          <CardContent className="p-2">
            <div className="relative h-[400px] w-full overflow-hidden rounded-md">
              {mapImage && (
                <Image
                  src={mapImage.imageUrl}
                  alt={mapImage.description}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={mapImage.imageHint}
                />
              )}
              {/* Example pins */}
              <div className="absolute top-[20%] left-[30%]">
                <MapPin className="h-8 w-8 text-red-500" fill="white" />
              </div>
              <div className="absolute top-[50%] left-[60%]">
                 <MapPin className="h-8 w-8 text-red-500" fill="white" />
              </div>
              <div className="absolute bottom-[15%] right-[25%]">
                 <MapPin className="h-8 w-8 text-red-500" fill="white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-2xl font-bold tracking-tight">
          Profissionais em destaque
        </h3>
        <div className="mt-4 grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {professionals.map((prof) => {
            const avatar = placeholderImages.find(
              (p) => p.id === prof.avatarId
            );
            return (
              <Card key={prof.id}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar className="h-16 w-16">
                    {avatar && (
                      <AvatarImage
                        src={avatar.imageUrl}
                        alt={prof.name}
                        data-ai-hint={avatar.imageHint}
                      />
                    )}
                    <AvatarFallback>{prof.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{prof.name}</CardTitle>
                    <p className="text-muted-foreground">{prof.specialty}</p>
                    <div className="mt-1 flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold">{prof.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({prof.reviews} avaliações)
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/professionals/${prof.id}`}>Ver Perfil</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
