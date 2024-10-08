import Image from "next/image"
import { quickSearchOptions } from "../constants/search"
import { Button } from "./ui/button"
import Link from "next/link"

export function QuickSearchOptions() {
  return (
    <div className="flex gap-3 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
      {quickSearchOptions.map((option) => (
        <Button
          key={option.title}
          className="gap-2"
          variant="secondary"
          asChild
        >
          <Link href={`/barbershops?service=${option.title}`}>
            <Image
              src={option.imageURL}
              width={16}
              height={16}
              alt={option.title}
            />
            {option.title}
          </Link>
        </Button>
      ))}
    </div>
  )
}
