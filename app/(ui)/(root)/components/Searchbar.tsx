import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'


const Searchbar = () => {
    return (
        <div className="relative flex items-center mr-4">

            <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />


            <input
                id="search"
                placeholder="Search"
                className="
                    h-8 md:h-9
                    pl-10 
                    pr-5
                    md:pr-24
                    rounded-lg
                    border border-sky-200
                    bg-white
                    text-sm
                    text-slate-800
                    placeholder:text-slate-400
                    focus:outline-none
                    focus:border-blue-600
                    focus:ring-2
                    focus:ring-blue-500/30
                    shadow-sm
                    transition
                "
            />



            {/* <Button
                type="submit"
                variant={"secondary"}
                className="
                    absolute right-1
                    h-6
                    md:h-8
                    px-4
                    text-xs
                    rounded-md
                    bg-brand
                    border border-sky-200
                    hover:bg-brand-strong
                    shadow-sm
                  "
            >
                Search
            </Button> */}
        </div>
    )
}

export default Searchbar
