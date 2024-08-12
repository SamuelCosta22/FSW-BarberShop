import { Header } from "./components/header"
import Image from "next/image"
import { db } from "./lib/prisma"
import { BarbershopItem } from "./components/barbershop-item"
import { QuickSearchOptions } from "./components/quick-search-options"
import { Search } from "./components/search"
import { getServerSession } from "next-auth"
import { authOptions } from "./lib/auth"
import { BookingItem } from "./components/booking-item"

const Home = async () => {
  const barbershops = await db.barbershop.findMany({})
  const popularBarbershops = await db.barbershop.findMany({
    orderBy: {
      name: "desc",
    },
  })

  const session = await getServerSession(authOptions)
  const confirmedBookings = session?.user
    ? await db.booking.findMany({
        where: {
          userId: (session.user as any).id,
          date: {
            gte: new Date(),
          },
        },
        include: {
          service: {
            include: {
              barbershop: true,
            },
          },
        },
        orderBy: {
          date: "asc",
        },
      })
    : []

  return (
    <div>
      <Header />
      <div className="flex flex-col space-y-6 p-5">
        <div>
          <h2 className="text-xl font-bold">Olá, Samuel!</h2>
          <p>Terça-feira 06 de agosto.</p>
        </div>

        <div>
          <Search />
        </div>

        <div>
          <QuickSearchOptions />
        </div>

        <div className="relative h-[150px] w-full">
          <Image
            src="/banner-01.png"
            fill
            className="rounded-xl object-cover"
            alt="Agende nos melhores com FSW Barber"
          />
        </div>

        <div>
          <h2 className="mb-3 text-xs font-bold uppercase text-gray-400">
            Agendamentos
          </h2>

          <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {confirmedBookings.map((booking) => (
              <BookingItem key={booking.id} booking={booking} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-bold uppercase text-gray-400">
            Recomendados
          </h2>
          <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
            {barbershops.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-bold uppercase text-gray-400">
            Populares
          </h2>
          <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
            {popularBarbershops.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
