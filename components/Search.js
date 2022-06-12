import { useState } from 'react'
import { FiSearch } from 'react-icons/fi'

export default function Search() {
  const [keyword, setKeyword] = useState('')

  return (
    <form>
      <div className='w-72 flex items-center justify-between px-7 py-1 border border-gray-500 rounded-sm ' >
        <input
          placeholder="search"
          className='bg-transparent outline-none'
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          type="text" />
        <button><FiSearch color="var(--main-color)" /></button>
      </div>
    </form>
  )
}
