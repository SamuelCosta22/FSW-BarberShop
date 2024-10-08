"use client"

import { Prisma } from "@prisma/client"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import { format, isFuture } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import Image from "next/image"
import { PhoneItem } from "./phone-item"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { deleteBooking } from "../actions/delete-booking"
import { toast } from "sonner"
import { useState } from "react"
import { BookingSummary } from "./booking-summary"

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: {
        include: {
          barbershop: true
        }
      }
    }
  }>
}

//TODO: Receber agendamento como prop
export function BookingItem({ booking }: BookingItemProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isDeleteConfimationDialogOpen, setIsDeleteConfimationDialogOpen] =
    useState(false)

  const isConfirmed = isFuture(booking.date)

  const handleSheetOpenChange = (isOpen: boolean) => {
    setIsSheetOpen(isOpen)
  }

  const handleDeleteConfirmationDialogOpen = (isOpen: boolean) => {
    setIsDeleteConfimationDialogOpen(isOpen)
  }

  const closeDialogAndSheet = () => {
    setIsSheetOpen(false)
    setIsDeleteConfimationDialogOpen(false)
  }

  const handleCancelBooking = async () => {
    try {
      await deleteBooking(booking.id)
      closeDialogAndSheet()
      toast.success("Reserva cancelada com sucesso!")
    } catch (error) {
      console.log(error)
      toast.error("Erro ao cancelar a reserva. Tente novamente.")
    }
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
      <SheetTrigger className="w-full min-w-[90%]">
        <Card className="min-w-[90%]">
          <CardContent className="flex justify-between p-0">
            <div className="flex flex-col gap-2 py-5 pl-5">
              <Badge
                className="w-fit"
                variant={isConfirmed ? "default" : "secondary"}
              >
                {isConfirmed ? "Confirmado" : "Finalizado"}
              </Badge>
              <h3 className="text-left font-semibold">
                {booking.service.name}
              </h3>

              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={booking.service.barbershop.imageURL} />
                </Avatar>
                <p className="text-sm">{booking.service.barbershop.name}</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
              <p className="text-sm capitalize">
                {format(booking.date, "MMMM", { locale: ptBR })}
              </p>
              <p className="text-2xl">
                {format(booking.date, "dd", { locale: ptBR })}
              </p>
              <p className="text-sm">
                {format(booking.date, "HH:mm", { locale: ptBR })}
              </p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent className="w-[85%]">
        <SheetHeader>
          <SheetTitle className="text-left">Informações da Reserva</SheetTitle>
        </SheetHeader>

        <div className="relative mt-6 flex h-[180px] w-full items-end">
          <Image
            src="/map.png"
            fill
            className="rounded-xl object-cover"
            alt={`Mapa da barbearia ${booking.service.barbershop.name}`}
          />
          <Card className="z-50 mx-5 mb-3 w-full rounded-xl">
            <CardContent className="flex items-center gap-3 px-3 py-3">
              <Avatar>
                <AvatarImage src={booking.service.barbershop.imageURL} />
              </Avatar>
              <div>
                <h3 className="font-bold">{booking.service.barbershop.name}</h3>
                <p className="text-xs text-gray-400">
                  {booking.service.barbershop.address}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Badge
            className="w-fit"
            variant={isConfirmed ? "default" : "secondary"}
          >
            {isConfirmed ? "Confirmado" : "Finalizado"}
          </Badge>

          <div className="mb-5 mt-6">
            <BookingSummary
              barbershop={booking.service.barbershop}
              service={booking.service}
              selectedDate={booking.date}
            />
          </div>

          <div className="space-y-3">
            {booking.service.barbershop.phones.map((phone) => (
              <PhoneItem key={phone} phone={phone} />
            ))}
          </div>
        </div>

        <SheetFooter>
          <div className="mt-5 flex items-center gap-3">
            <SheetClose className="w-full" asChild>
              <Button variant="outline" className="w-full">
                Voltar
              </Button>
            </SheetClose>

            {isConfirmed && (
              <Dialog
                open={isDeleteConfimationDialogOpen}
                onOpenChange={handleDeleteConfirmationDialogOpen}
              >
                <DialogTrigger className="w-full" asChild>
                  <Button variant="destructive" className="w-full">
                    Cancelar reserva
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90%]">
                  <DialogHeader>
                    <DialogTitle className="mb-3">
                      Você quer cancelar sua reserva?
                    </DialogTitle>
                    <DialogDescription className="mb-3">
                      Ao cancelar, você perderá sua reserva e não poderá
                      recuperá-la. Essa ação é irreversível!
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-3 flex flex-row gap-3">
                    <DialogClose asChild>
                      <Button variant="secondary" className="w-full">
                        Voltar
                      </Button>
                    </DialogClose>
                    <Button
                      onClick={handleCancelBooking}
                      variant="destructive"
                      className="w-full"
                    >
                      Confirmar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
